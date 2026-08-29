import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Standard Report ($199) -- step 1 of 3. Section 3(d) and Markush Coverage
// have no automated pairing/genus-parsing (see SECTION3D_AUTOPAIR_RESULTS.md
// and markush_membership.py's own scope note) -- real research/encoding
// work is required per request, so this captures the FULL intake up front
// (what exactly the client wants, in their own words) rather than just a
// patent number, and creates a PENDING row before payment. Its own id is
// then embedded as the PayPal/Razorpay order's tamper-resistant identifier
// (see create-order/razorpay-create-order) -- same pattern as
// RetainerModal's pendingCustomerId -- because this intake is far richer
// than a $10 check's patentNumber+email and won't fit PayPal's 127-char
// custom_id limit.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const serviceType = typeof body?.serviceType === 'string' ? body.serviceType : ''
  const patentNumber = typeof body?.patentNumber === 'string' ? body.patentNumber.trim().toUpperCase() : ''
  const clientCompound = typeof body?.clientCompound === 'string' ? body.clientCompound.trim() : ''
  const details = typeof body?.details === 'string' ? body.details.trim() : ''
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const company = typeof body?.company === 'string' ? body.company.trim() : ''

  if (!['section3d', 'markush'].includes(serviceType)) {
    return NextResponse.json({ error: 'Invalid service type.' }, { status: 400 })
  }
  if (!details || !email || !company) {
    return NextResponse.json({ error: 'Company, email, and details of what you need are required.' }, { status: 400 })
  }

  const { data: row, error } = await supabaseAdmin
    .from('standard_report_requests')
    .insert({
      service_type: serviceType,
      patent_number: patentNumber || null,
      client_compound: clientCompound || null,
      details,
      requester_name: name || null,
      requester_email: email,
      requester_company: company,
      status: 'pending_payment',
    })
    .select()
    .single()

  if (error || !row) {
    return NextResponse.json({ error: 'Could not start your request — please try again.' }, { status: 500 })
  }

  return NextResponse.json({ pendingRequestId: row.id })
}
