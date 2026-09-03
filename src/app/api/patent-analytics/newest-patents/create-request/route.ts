import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { checkPatentRelevance, NOT_CHEMISTRY_MESSAGE } from '@/lib/patentRelevanceGate'

const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug'

// Resolves a client-typed compound (name OR SMILES) to a SMILES string via
// PubChem, server-side, BEFORE inserting a request row -- this is what lets
// an unresolvable compound fail fast with a clear error instead of silently
// burning the client's one free run and 30 minutes of worker time on a typo.
// Tries the SMILES endpoint first (cheap, exact), falls back to the name
// endpoint (PubChem's synonym/name resolver) since most people will type a
// drug name, not a SMILES string. The worker re-canonicalizes whatever this
// returns through its own RDKit gate, so this doesn't need to be a "final"
// canonical form -- it just needs to describe the right molecule.
async function resolveCompoundToSmiles(input: string): Promise<string | null> {
  const encoded = encodeURIComponent(input)
  for (const path of [`/compound/smiles/${encoded}`, `/compound/name/${encoded}`]) {
    try {
      const res = await fetch(`${PUBCHEM_BASE}${path}/property/CanonicalSMILES/TXT`, {
        signal: AbortSignal.timeout(10_000),
      })
      if (!res.ok) continue
      const text = (await res.text()).trim()
      if (text) return text
    } catch {
      // Network hiccup or timeout on one lookup path -- try the other before giving up.
    }
  }
  return null
}

// "Newest patents" live extraction -- structure extraction sourced from
// USPTO directly (via the persistent worker + live_extraction_requests
// queue), for patents not yet indexed by Google Patents/PubChem. Free to
// run (the worker's compute cost is the only cost, and the actual
// deliverable -- a downloadable confirmed structure, or the human-review
// upsell on a needs-review outcome -- is gated behind payment separately,
// not this step). One free run per signed-in account, checked by
// requester_email already having any prior row here -- this endpoint is
// the actual compute cost, so it's the one that needs the abuse guard, not
// the download step (which is already payment-gated regardless).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const patentNumber = typeof body?.patentNumber === 'string' ? body.patentNumber.trim().toUpperCase() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const compoundInput = typeof body?.compoundInput === 'string' ? body.compoundInput.trim() : ''
  const mode = body?.mode === 'section3d' ? 'section3d'
    : body?.mode === 'compound_match' ? 'compound_match'
    : body?.mode === 'markush_coverage' ? 'markush_coverage'
    : null
  // Defaults true (stereo-sensitive) when absent -- matches
  // check_membership()'s own default, so any client request shape that
  // predates this field (or simply doesn't send it) keeps today's behavior
  // unchanged, not silently switched to the broader stereo-blind match.
  const stereoSensitive = typeof body?.stereoSensitive === 'boolean' ? body.stereoSensitive : true

  if (!patentNumber || !email) {
    return NextResponse.json({ error: 'Patent number and email are required.' }, { status: 400 })
  }
  if (mode && !compoundInput) {
    return NextResponse.json({ error: 'A compound is required for this check.' }, { status: 400 })
  }

  // Optional "does my compound appear in this patent" / "is this compound a
  // salt/ester/isomer of a known compound" variants. Resolved here, before
  // insert, so a typo or unrecognized name fails immediately with a clear
  // message rather than wasting the client's one free run.
  let compoundSmiles: string | null = null
  if (compoundInput) {
    compoundSmiles = await resolveCompoundToSmiles(compoundInput)
    if (!compoundSmiles) {
      return NextResponse.json(
        { error: `Could not recognize "${compoundInput}" as a compound name or SMILES string. Double-check the spelling, or paste a SMILES string directly.` },
        { status: 400 }
      )
    }
  }

  // Same chemistry-relevance gate as every other product -- reject before
  // spending any worker compute on a patent this business's tools don't
  // apply to. Fails open (lets it through) if unverifiable, same reasoning
  // as everywhere else this gate is used: a fetch failure here is at least
  // as likely to mean "too new for Google's page index" as "bad patent
  // number," and this specific product exists FOR exactly that case.
  const relevance = await checkPatentRelevance(patentNumber)
  if (relevance.reason === 'not_chemistry') {
    return NextResponse.json({ error: NOT_CHEMISTRY_MESSAGE }, { status: 400 })
  }

  // Markush coverage is a SEPARATE product from structure_extraction
  // (different Modal worker, different real cost -- GPU vs CPU), so its
  // free-run allowance is scoped to its own product_type rather than
  // sharing the structure-extraction gate below. A returning
  // newest-patents user who already used their free structure-extraction
  // run should still get one free markush check, and vice versa.
  const productType = mode === 'markush_coverage' ? 'markush_coverage' : 'structure_extraction'

  const { data: priorRequest } = await supabaseAdmin
    .from('live_extraction_requests')
    .select('id')
    .eq('requester_email', email)
    .eq('product_type', productType)
    .limit(1)
    .maybeSingle()
  if (priorRequest) {
    return NextResponse.json(
      { error: "You've already used your free extraction run on this account. Contact support@thechemsolver.com if you need to run another patent." },
      { status: 429 }
    )
  }

  const { data: row, error } = await supabaseAdmin
    .from('live_extraction_requests')
    .insert({
      patent_number: patentNumber,
      requester_email: email,
      requester_name: name || null,
      ...(mode === 'markush_coverage'
        ? { product_type: 'markush_coverage', query_compound_input: compoundInput, query_compound_smiles: compoundSmiles, stereo_sensitive: stereoSensitive }
        // Only set for the compound-match/section3d variants -- omitted
        // entirely (not even sent as null) for a plain "list every structure"
        // request, so this insert is byte-for-byte what it was before either
        // variant existed whenever compoundInput isn't supplied.
        : compoundSmiles
        ? { query_compound_input: compoundInput, query_compound_smiles: compoundSmiles, query_mode: mode ?? 'compound_match' }
        : {}),
    })
    .select('id')
    .single()

  if (error || !row) {
    console.error('[newest-patents create-request] insert failed', error)
    return NextResponse.json({ error: 'Could not start your request -- please try again.' }, { status: 500 })
  }

  return NextResponse.json({ requestId: row.id })
}
