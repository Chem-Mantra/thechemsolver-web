import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Portfolio Retainer ($999/mo) -- step 1 of 2. Creates a PENDING
// retainer_customers row (+ one retainer_watches row per patent the
// customer wants monitored) BEFORE the PayPal subscription is created.
// The row's own id is then passed as the subscription's custom_id (see
// RetainerModal.tsx), so verify-subscription/route.ts can look the
// customer back up from PayPal's own subscription data at activation
// time rather than trusting the client to resend company/email/watch
// list again after payment -- same tamper-resistance pattern as the
// Instant Compound Check flow.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const company = typeof body?.company === 'string' ? body.company.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const seedPatents: string[] = Array.isArray(body?.seedPatents)
    ? body.seedPatents.filter((p: unknown) => typeof p === 'string' && p.trim()).map((p: string) => p.trim().toUpperCase())
    : []

  if (!company || !email || seedPatents.length === 0) {
    return NextResponse.json({ error: 'Company, email, and at least one patent to monitor are required.' }, { status: 400 })
  }

  const { data: customer, error: customerError } = await supabaseAdmin
    .from('retainer_customers')
    .insert({ company, contact_email: email, contact_name: name || null, status: 'pending' })
    .select()
    .single()

  if (customerError || !customer) {
    return NextResponse.json({ error: 'Could not start signup — please try again.' }, { status: 500 })
  }

  const { error: watchError } = await supabaseAdmin
    .from('retainer_watches')
    .insert(seedPatents.map((seedPatent) => ({ customer_id: customer.id, seed_patent: seedPatent })))

  if (watchError) {
    // Clean up the orphaned customer row rather than leave a pending
    // signup with nothing to monitor.
    await supabaseAdmin.from('retainer_customers').delete().eq('id', customer.id)
    return NextResponse.json({ error: 'Could not start signup — please try again.' }, { status: 500 })
  }

  return NextResponse.json({ pendingCustomerId: customer.id })
}
