import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { resolveCompoundToSmiles } from '@/lib/pubchemFtoSearch'

// Portfolio Retainer ($999/mo) -- step 1 of 2. Creates a PENDING
// retainer_customers row (+ one retainer_watches row per patent AND/OR
// compound the customer wants monitored) BEFORE the PayPal subscription is
// created. The row's own id is then passed as the subscription's custom_id
// (see RetainerModal.tsx), so verify-subscription/route.ts can look the
// customer back up from PayPal's own subscription data at activation time
// rather than trusting the client to resend company/email/watch list again
// after payment -- same tamper-resistance pattern as the Instant Compound
// Check flow.
//
// Compound watches are the "alerts when new patents matching your compound
// classes are published" promise on the site's own service copy -- distinct
// from patent watches (which track a SEED PATENT'S OWN family growing).
// 06_check_retainer_watches.py checks these two watch kinds differently:
// patent watches re-run build_family_landscape; compound watches compare
// the resolved SMILES against newly-processed patents' own structures
// (Morgan/Tanimoto, same engine as fto_structural_triage.py) rather than
// PubChem's live similarity search -- this runs as a periodic batch job,
// not a live web request, so there's no serverless timeout pressure, and
// staying on the same RDKit-based methodology as the rest of the live
// product avoids introducing a second, differently-scored similarity
// metric into just one corner of it.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const company = typeof body?.company === 'string' ? body.company.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const seedPatents: string[] = Array.isArray(body?.seedPatents)
    ? body.seedPatents.filter((p: unknown) => typeof p === 'string' && p.trim()).map((p: string) => p.trim().toUpperCase())
    : []
  const compoundInputs: string[] = Array.isArray(body?.compounds)
    ? body.compounds.filter((c: unknown) => typeof c === 'string' && c.trim()).map((c: string) => c.trim())
    : []

  if (!company || !email || (seedPatents.length === 0 && compoundInputs.length === 0)) {
    return NextResponse.json({ error: 'Company, email, and at least one patent or compound to monitor are required.' }, { status: 400 })
  }

  // Resolve compound names/SMILES up front -- a compound we can't identify
  // isn't watchable, better to tell the customer now than silently drop it.
  const resolvedCompounds: { label: string; smiles: string }[] = []
  const unresolvedCompounds: string[] = []
  for (const input of compoundInputs) {
    const smiles = await resolveCompoundToSmiles(input)
    if (smiles) resolvedCompounds.push({ label: input, smiles })
    else unresolvedCompounds.push(input)
  }
  if (unresolvedCompounds.length > 0 && resolvedCompounds.length === 0 && seedPatents.length === 0) {
    return NextResponse.json({ error: `Couldn't identify: ${unresolvedCompounds.join(', ')}. Try a SMILES string instead of a name.` }, { status: 400 })
  }

  const { data: customer, error: customerError } = await supabaseAdmin
    .from('retainer_customers')
    .insert({ company, contact_email: email, contact_name: name || null, status: 'pending' })
    .select()
    .single()

  if (customerError || !customer) {
    return NextResponse.json({ error: 'Could not start signup — please try again.' }, { status: 500 })
  }

  const watchRows = [
    ...seedPatents.map((seedPatent) => ({ customer_id: customer.id, seed_patent: seedPatent })),
    ...resolvedCompounds.map((c) => ({ customer_id: customer.id, compound_smiles: c.smiles, compound_label: c.label })),
  ]

  const { error: watchError } = await supabaseAdmin.from('retainer_watches').insert(watchRows)

  if (watchError) {
    // Clean up the orphaned customer row rather than leave a pending
    // signup with nothing to monitor.
    await supabaseAdmin.from('retainer_customers').delete().eq('id', customer.id)
    return NextResponse.json({ error: 'Could not start signup — please try again.' }, { status: 500 })
  }

  return NextResponse.json({ pendingCustomerId: customer.id, unresolvedCompounds })
}
