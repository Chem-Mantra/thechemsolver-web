import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { checkPatentRelevance, NOT_CHEMISTRY_MESSAGE } from '@/lib/patentRelevanceGate'

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

  if (!patentNumber || !email) {
    return NextResponse.json({ error: 'Patent number and email are required.' }, { status: 400 })
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

  const { data: priorRequest } = await supabaseAdmin
    .from('live_extraction_requests')
    .select('id')
    .eq('requester_email', email)
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
    .insert({ patent_number: patentNumber, requester_email: email, requester_name: name || null })
    .select('id')
    .single()

  if (error || !row) {
    console.error('[newest-patents create-request] insert failed', error)
    return NextResponse.json({ error: 'Could not start your request -- please try again.' }, { status: 500 })
  }

  return NextResponse.json({ requestId: row.id })
}
