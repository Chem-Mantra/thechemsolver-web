import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { runCompoundCheck, emailCompoundCheckResult } from '@/lib/compoundCheckResult'

// The live PubChem search itself measured ~31s on real data (see
// pubchemFtoSearch.ts) -- well under this, but with real margin for a
// slower compound.
export const maxDuration = 60

const PAYPAL_API_BASE =
  process.env.PAYPAL_ENV === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com'

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  return data.access_token
}

export async function POST(req: NextRequest) {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 503 })
  }

  const body = await req.json().catch(() => null)
  const orderID = typeof body?.orderID === 'string' ? body.orderID : ''
  if (!orderID) {
    return NextResponse.json({ error: 'Missing order ID.' }, { status: 400 })
  }

  const { data: existing } = await supabaseAdmin
    .from('check_payments')
    .select('outcome, details_json')
    .eq('paypal_order_id', orderID)
    .maybeSingle()
  if (existing) {
    return NextResponse.json({ result: existing.details_json })
  }

  const accessToken = await getAccessToken(clientId, clientSecret)
  const captureRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  })
  const capture = await captureRes.json()

  if (!captureRes.ok || capture.status !== 'COMPLETED') {
    const alreadyCaptured = capture?.details?.some?.((d: { issue?: string }) => d.issue === 'ORDER_ALREADY_CAPTURED')
    if (alreadyCaptured) {
      const { data: raceWinner } = await supabaseAdmin
        .from('check_payments')
        .select('details_json')
        .eq('paypal_order_id', orderID)
        .maybeSingle()
      if (raceWinner) return NextResponse.json({ result: raceWinner.details_json })
    }
    console.error('[check-payment compound capture-order] capture failed', orderID, capture)
    return NextResponse.json({ error: 'Payment could not be completed — please try again.' }, { status: 402 })
  }

  const captureId: string | null = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? null
  const customIdRaw: string | null =
    capture.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id ?? capture.purchase_units?.[0]?.custom_id ?? null

  let compound = ''
  let email = ''
  try {
    const parsed = JSON.parse(customIdRaw || '{}')
    compound = typeof parsed.compound === 'string' ? parsed.compound : ''
    email = typeof parsed.email === 'string' ? parsed.email : ''
  } catch {
    // handled below
  }

  if (!compound || !email) {
    console.error('[check-payment compound capture-order] CAPTURED PAYMENT WITH UNREADABLE custom_id -- MANUAL REFUND/RECOVERY NEEDED', { orderID, captureId, customIdRaw })
    await supabaseAdmin.from('check_payments').insert({
      paypal_order_id: orderID,
      paypal_capture_id: captureId,
      patent_number: '(unknown)',
      requester_email: '(unknown)',
      outcome: 'error',
    })
    return NextResponse.json(
      { error: `Payment succeeded but something went wrong on our end — email support@thechemsolver.com with reference ${orderID} and we'll make it right.` },
      { status: 500 }
    )
  }

  const result = await runCompoundCheck(compound)

  await supabaseAdmin.from('check_payments').insert({
    paypal_order_id: orderID,
    paypal_capture_id: captureId,
    patent_number: compound, // reusing this column for "what was searched" -- no separate compound column, TEXT either way
    requester_email: email,
    outcome: result.status === 'unresolved' ? 'unresolved' : 'found',
    details_json: result,
  })

  await emailCompoundCheckResult(email, compound, result)

  return NextResponse.json({ result })
}
