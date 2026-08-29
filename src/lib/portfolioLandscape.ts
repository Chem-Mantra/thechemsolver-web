import * as cheerio from 'cheerio'

// Live, on-demand TypeScript port of portfolio_landscape.py's
// build_family_landscape -- runs inside a Vercel API route instead of on
// Prashant's own machine, so a paying customer's Instant Compound Check can
// generate a REAL result for a patent that's never been processed before,
// synchronously, in the same request. Ported rather than called out to
// (there is no live bridge from a Vercel serverless function to a Python
// script on a local Windows machine) -- verified this doesn't need RDKit:
// portfolio_landscape.py itself never calls into rdkit, it's pure HTML
// parsing of Google Patents' own already-published compound microdata.
//
// One deliberate simplification vs the Python version: that version
// recomputes a canonical InChI per compound via RDKit, partly as a
// dedup/comparison key. This version dedupes on Google's own InChIKey
// (the <span itemprop="id"> value) directly instead -- Google already
// computed that as a canonical identifier per compound, so recomputing our
// own is redundant for this product (Portfolio Landscape never asserts
// structural *equivalence* across differently-drawn SMILES the way Stage 3
// cross-checking does -- it only ever needs "is this the same compound
// Google already told us about", which the InChIKey answers directly).

const INCHIKEY_RE = /^[A-Z]{14}-[A-Z]{10}-[A-Z]$/
const MAX_PLAUSIBLE_FRAGMENTS = 4 // same noise filter as extract_patent_compounds
const MIN_VALID_SIZE = 200_000 // same threshold as portfolio_landscape.py
const FETCH_HEADERS = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) research-pilot/0.1' }

export type CompoundEntry = { smiles: string; inchikey: string }
export type FamilyMember = { publicationNumber: string; publicationDate: string }
export type FamilyMemberResult = {
  publicationNumber: string
  publicationDate: string
  status: 'FETCHED' | 'FETCH_FAILED'
  compounds: CompoundEntry[]
}
export type FamilyLandscape = {
  seedPublicationNumber: string
  members: FamilyMemberResult[]
  uniqueInchikeys: Set<string>
  multiMemberInchikeys: Set<string>
}

async function fetchPatentHtml(publicationNumber: string): Promise<string | null> {
  const url = `https://patents.google.com/patent/${publicationNumber}/en`
  let resp: Response
  try {
    resp = await fetch(url, { headers: FETCH_HEADERS })
  } catch {
    return null
  }
  if (!resp.ok) return null
  const text = await resp.text()
  if (text.length < MIN_VALID_SIZE) return null
  return text
}

function extractPatentCompounds(html: string): CompoundEntry[] {
  const $ = cheerio.load(html)
  const out: CompoundEntry[] = []
  $('li[itemprop="match"]').each((_, el) => {
    const idText = $(el).find('span[itemprop="id"]').first().text().trim()
    const smiles = $(el).find('span[itemprop="smiles"]').first().text().trim()
    if (!idText || !smiles) return
    if (!INCHIKEY_RE.test(idText)) return // generic/Markush scaffold, skip
    if (!smiles || smiles.includes('*')) return // wildcard, not a single comparable structure
    if ((smiles.match(/\./g) || []).length > MAX_PLAUSIBLE_FRAGMENTS) return // reaction-mixture noise
    out.push({ smiles, inchikey: idText })
  })
  return out
}

function extractPatentFamily(html: string): FamilyMember[] {
  const $ = cheerio.load(html)
  const family: FamilyMember[] = []
  $('tr[itemprop="docdbFamily"]').each((_, row) => {
    const pubNumber = $(row).find('span[itemprop="publicationNumber"]').first().text().trim()
    if (!pubNumber) return
    const pubDate = $(row).find('[itemprop="publicationDate"]').first().text().trim()
    family.push({ publicationNumber: pubNumber, publicationDate: pubDate })
  })
  return family
}

// Real families can run into dozens of members (verified: US7314938B2 has
// 44) -- a fixed low cap that silently truncates the fetch would ship an
// incomplete result tagged auto_verified, undercounting structures with no
// indication anything was cut. Real testing at 350ms/fetch showed ~20
// members is the safe ceiling to finish well inside a 60s serverless
// budget (seed fetch + extraction + DB write overhead included) -- families
// larger than that return null here so the caller falls back to the
// existing manual queue ("we'll email you within 1 hour") instead of
// shipping a truncated live result. Never truncate and ship silently.
const MAX_FAMILY_MEMBERS_LIVE = 20

export async function buildFamilyLandscapeLive(seedPublicationNumber: string): Promise<FamilyLandscape | null> {
  const seedHtml = await fetchPatentHtml(seedPublicationNumber)
  if (!seedHtml) return null

  const seedCompounds = extractPatentCompounds(seedHtml)
  const members: FamilyMemberResult[] = [
    { publicationNumber: seedPublicationNumber, publicationDate: '', status: 'FETCHED', compounds: seedCompounds },
  ]

  const family = extractPatentFamily(seedHtml)
  if (family.length > MAX_FAMILY_MEMBERS_LIVE) {
    return null // too large to safely complete live -- fall back to the manual queue, don't truncate
  }
  for (const member of family) {
    await new Promise((resolve) => setTimeout(resolve, 350)) // politeness delay, same spirit as portfolio_landscape.py's FETCH_SLEEP_SECONDS
    const html = await fetchPatentHtml(member.publicationNumber)
    if (!html) {
      members.push({ publicationNumber: member.publicationNumber, publicationDate: member.publicationDate, status: 'FETCH_FAILED', compounds: [] })
      continue
    }
    members.push({
      publicationNumber: member.publicationNumber,
      publicationDate: member.publicationDate,
      status: 'FETCHED',
      compounds: extractPatentCompounds(html),
    })
  }

  const countByInchikey = new Map<string, number>()
  for (const m of members) {
    const seenInThisMember = new Set(m.compounds.map((c) => c.inchikey))
    for (const key of seenInThisMember) {
      countByInchikey.set(key, (countByInchikey.get(key) ?? 0) + 1)
    }
  }
  const uniqueInchikeys = new Set(countByInchikey.keys())
  const multiMemberInchikeys = new Set([...countByInchikey.entries()].filter(([, n]) => n >= 2).map(([k]) => k))

  return { seedPublicationNumber, members, uniqueInchikeys, multiMemberInchikeys }
}

export type PortfolioLandscapeResult = {
  patent_number: string
  headline: string
  summary: string
  details_json: Record<string, unknown>
  confidence_tier: 'auto_verified'
}

// Same headline/summary phrasing as 02_run_daily_batch.py's
// build_portfolio_landscape_row, so a live result reads identically to a
// batch-generated one -- a client shouldn't be able to tell which path
// produced their report.
export function buildPortfolioLandscapeResult(landscape: FamilyLandscape): PortfolioLandscapeResult {
  const { seedPublicationNumber: seed, members, uniqueInchikeys, multiMemberInchikeys } = landscape
  const nMembers = members.length - 1
  const nStructures = uniqueInchikeys.size

  let headline: string
  if (nMembers === 0) {
    headline = `${seed}: ${nStructures} structure(s) extracted, no sibling family filings found`
  } else if (multiMemberInchikeys.size > 0) {
    headline = `${seed}'s patent family (${nMembers + 1} publications) shares ${multiMemberInchikeys.size} structures across members`
  } else {
    headline = `${seed}'s patent family spans ${nMembers + 1} publications, ${nStructures} unique structures found`
  }

  const summary =
    `Family/portfolio landscape for ${seed}: ${nMembers} other publication(s) found in the same ` +
    `patent family, ${nStructures} unique structures consolidated across all successfully-fetched ` +
    `family members, ${multiMemberInchikeys.size} of which appear in 2 or more family members.`

  // One entry per unique compound (deduped by Google's own InChIKey),
  // carrying a representative SMILES + which member patents it appeared
  // in. Same shape 02_run_daily_batch.py's build_portfolio_landscape_row
  // already produces (structures[].smiles/inchikeys/member_patents) --
  // needed so 06_check_retainer_watches.py's compound-class matching can
  // read structures uniformly whether a result came from the daily batch
  // or a live on-demand fetch, not just the family-summary counts above.
  const structureByInchikey = new Map<string, { smiles: string; inchikeys: Set<string>; memberPatents: Set<string> }>()
  for (const m of members) {
    for (const c of m.compounds) {
      const existing = structureByInchikey.get(c.inchikey)
      if (existing) {
        existing.memberPatents.add(m.publicationNumber)
      } else {
        structureByInchikey.set(c.inchikey, { smiles: c.smiles, inchikeys: new Set([c.inchikey]), memberPatents: new Set([m.publicationNumber]) })
      }
    }
  }

  return {
    patent_number: seed,
    headline,
    summary,
    details_json: {
      seed_patent: seed,
      family_members: members.slice(1).map((m) => m.publicationNumber),
      n_family_members: nMembers,
      n_unique_structures: nStructures,
      n_multi_member_structures: multiMemberInchikeys.size,
      fetch_failures: members.filter((m) => m.status === 'FETCH_FAILED').map((m) => m.publicationNumber),
      generated_live: true,
      structures: [...structureByInchikey.values()].map((s) => ({
        smiles: s.smiles,
        inchikeys: [...s.inchikeys],
        member_patents: [...s.memberPatents],
      })),
    },
    confidence_tier: 'auto_verified',
  }
}
