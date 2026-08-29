// Live, on-demand compound-vs-patent-landscape search via PubChem's own
// PUG-REST API -- the real "does my compound match anything patented"
// capability discussed and spot-tested this session. Two live-verified
// PubChem endpoints, chained:
//   1. fastsimilarity_2d: given a SMILES, find structurally similar
//      compounds (PubChem's own 2D fingerprint similarity -- not the same
//      fingerprint definition as fto_structural_triage.py's Morgan/ECFP4
//      Tanimoto, so scores aren't numerically comparable across the two,
//      but it's a real, independent 2D similarity measure).
//   2. xrefs/PatentID: given a compound, every patent PubChem has it
//      cross-referenced to (via SureChEMBL and other sources it ingests).
//
// Real problems found testing this live, both fixed here:
//   - A first version fetched xrefs SEQUENTIALLY, one compound at a time --
//     16 compounds took 74s, well past a serverless function's budget.
//     Fixed by fetching with bounded concurrency (Promise.all in small
//     batches) instead of a plain for-loop.
//   - That version also silently conflated "this compound has a genuinely
//     huge/generic patent list" with "the fetch simply timed out, we don't
//     actually know" -- both got labeled "truncated/generic", which could
//     misrepresent, say, the client's OWN queried compound as "too generic
//     to summarize" when it just hadn't been reached in time. Fixed: a
//     failed/timed-out fetch is reported as status 'unknown', never
//     silently folded into a confident-sounding label.
const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug'
const USER_AGENT = 'patent-analytics-web/1.0 (research; contact: kotian333@gmail.com)'

const MAX_SIMILAR_COMPOUNDS = 6 // per tier -- bounds total xref fetches to at most 12
const PER_COMPOUND_XREF_TIMEOUT_MS = 12000 // real testing: even a genuinely huge compound's
// Fault/data usually resolves within this window server-side; a shorter
// client-side abort was cutting requests off before PubChem's own answer
// (Fault or data) came back.
const XREF_FETCH_CONCURRENCY = 4 // PubChem's own usage guidance: stay well under 5 req/s
const MAX_PATENTS_SHOWN_PER_COMPOUND = 10

const TIER_SAME_THRESHOLD = 85 // matches fto_structural_triage.py's THRESHOLD_SAME (0.85)
const TIER_RELATED_THRESHOLD = 60 // matches THRESHOLD_RELATED (0.60)

async function pubchemGet(path: string, timeoutMs?: number): Promise<unknown | null> {
  const controller = timeoutMs ? new AbortController() : undefined
  const timer = timeoutMs && controller ? setTimeout(() => controller.abort(), timeoutMs) : undefined
  try {
    const resp = await fetch(`${PUBCHEM_BASE}${path}`, { headers: { 'User-Agent': USER_AGENT }, signal: controller?.signal })
    if (!resp.ok) return null
    return await resp.json()
  } catch {
    return null // timeout, network error, or a Fault response body -- caller decides how to interpret
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export async function resolveCompoundToSmiles(input: string): Promise<string | null> {
  const trimmed = input.trim()
  if (!trimmed) return null

  const byName = (await pubchemGet(`/compound/name/${encodeURIComponent(trimmed)}/property/ConnectivitySMILES/JSON`, 8000)) as
    | { PropertyTable?: { Properties?: { ConnectivitySMILES?: string }[] } }
    | null
  const nameSmiles = byName?.PropertyTable?.Properties?.[0]?.ConnectivitySMILES
  if (nameSmiles) return nameSmiles

  const bySmiles = (await pubchemGet(`/compound/smiles/${encodeURIComponent(trimmed)}/property/ConnectivitySMILES/JSON`, 8000)) as
    | { PropertyTable?: { Properties?: { ConnectivitySMILES?: string }[] } }
    | null
  return bySmiles?.PropertyTable?.Properties?.[0]?.ConnectivitySMILES ?? null
}

export type FtoLiveHit = {
  cid: number
  tier: 'LIKELY_SAME_SCAFFOLD' | 'RELATED_SCAFFOLD_REVIEW'
  patentIds: string[] // capped to MAX_PATENTS_SHOWN_PER_COMPOUND
  status: 'confirmed_no_patents' | 'found' | 'too_many_to_list' | 'unknown'
}

async function findSimilarCids(smiles: string, threshold: number, exclude: Set<number>): Promise<number[]> {
  const data = (await pubchemGet(
    `/compound/fastsimilarity_2d/smiles/${encodeURIComponent(smiles)}/cids/JSON?Threshold=${threshold}&MaxRecords=${MAX_SIMILAR_COMPOUNDS + exclude.size}`,
    10000
  )) as { IdentifierList?: { CID?: number[] } } | null
  const cids = data?.IdentifierList?.CID ?? []
  return cids.filter((c) => !exclude.has(c)).slice(0, MAX_SIMILAR_COMPOUNDS)
}

async function fetchPatentsForCid(cid: number): Promise<{ patentIds: string[]; status: FtoLiveHit['status'] }> {
  const data = (await pubchemGet(`/compound/cid/${cid}/xrefs/PatentID/JSON`, PER_COMPOUND_XREF_TIMEOUT_MS)) as
    | { InformationList?: { Information?: { PatentID?: string[] }[] } }
    | null
  if (data === null) {
    return { patentIds: [], status: 'unknown' } // request failed/timed out -- genuinely don't know, not "confirmed generic"
  }
  const all = data.InformationList?.Information?.[0]?.PatentID
  if (all === undefined) {
    return { patentIds: [], status: 'confirmed_no_patents' } // response parsed fine, no PatentID field -- genuinely zero
  }
  return {
    patentIds: all.slice(0, MAX_PATENTS_SHOWN_PER_COMPOUND),
    status: all.length > MAX_PATENTS_SHOWN_PER_COMPOUND ? 'too_many_to_list' : 'found',
  }
}

// Small fixed-concurrency batch runner -- plain Promise.all(items.map(...))
// would fire all requests at once (16 simultaneous hits on PubChem, well
// past its own rate-limit guidance); a for-loop with await was the
// opposite problem (fully serial, 74s measured on real data). This is the
// middle ground.
async function mapWithConcurrency<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const i = next++
      results[i] = await fn(items[i])
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker))
  return results
}

export async function findPatentsForCompound(smiles: string): Promise<FtoLiveHit[]> {
  const sameCids = await findSimilarCids(smiles, TIER_SAME_THRESHOLD, new Set())
  const relatedCids = await findSimilarCids(smiles, TIER_RELATED_THRESHOLD, new Set(sameCids))

  const tagged: { cid: number; tier: FtoLiveHit['tier'] }[] = [
    ...sameCids.map((cid) => ({ cid, tier: 'LIKELY_SAME_SCAFFOLD' as const })),
    ...relatedCids.map((cid) => ({ cid, tier: 'RELATED_SCAFFOLD_REVIEW' as const })),
  ]

  const results = await mapWithConcurrency(tagged, XREF_FETCH_CONCURRENCY, async ({ cid, tier }) => {
    const { patentIds, status } = await fetchPatentsForCid(cid)
    return { cid, tier, patentIds, status } as FtoLiveHit
  })

  return results
}
