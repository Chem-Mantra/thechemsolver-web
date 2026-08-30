import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const maxDuration = 30

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

  const accessToken = await getAccessToken(clientId, clientSecret)
  const captureRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  })
  const capture = await captureRes.json()

  if (!captureRes.ok || capture.status !== 'COMPLETED') {
    console.error('[newest-patents unlock capture-order] capture failed', orderID, capture)
    return NextResponse.json({ error: 'Payment could not be completed -- please try again.' }, { status: 402 })
  }

  const requestId: string | null =
    capture.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id ?? capture.purchase_units?.[0]?.custom_id ?? null
  if (!requestId) {
    console.error('[newest-patents unlock capture-order] CAPTURED PAYMENT WITH UNREADABLE custom_id -- MANUAL REFUND/RECOVERY NEEDED', { orderID, capture })
    return NextResponse.json(
      { error: `Payment succeeded but something went wrong on our end -- email support@thechemsolver.com with reference ${orderID}.` },
      { status: 500 }
    )
  }

  const { error } = await supabaseAdmin.from('live_extraction_requests').update({ unlocked: true }).eq('id', requestId)
  if (error) {
    console.error('[newest-patents unlock capture-order] payment captured but failed to unlock -- MANUAL FOLLOW-UP NEEDED', { orderID, requestId, error })
    return NextResponse.json(
      { error: `Payment succeeded but something went wrong on our end -- email support@thechemsolver.com with reference ${orderID}.` },
      { status: 500 }
    )
  }

  return NextResponse.json({ unlocked: true })
}
