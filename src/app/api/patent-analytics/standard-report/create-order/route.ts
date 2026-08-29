import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const PAYPAL_API_BASE =
  process.env.PAYPAL_ENV === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com'

const STANDARD_REPORT_PRICE_USD = '199.00'

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
  const pendingRequestId = typeof body?.pendingRequestId === 'string' ? body.pendingRequestId : ''
  if (!pendingRequestId) {
    return NextResponse.json({ error: 'Missing request reference.' }, { status: 400 })
  }

  const { data: row } = await supabaseAdmin
    .from('standard_report_requests')
    .select('id, service_type')
    .eq('id', pendingRequestId)
    .eq('status', 'pending_payment')
    .maybeSingle()
  if (!row) {
    return NextResponse.json({ error: 'Request not found — please start over.' }, { status: 404 })
  }

  const accessToken = await getAccessToken(clientId, clientSecret)
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: 'USD', value: STANDARD_REPORT_PRICE_USD },
          custom_id: pendingRequestId,
          description: `Standard Report: ${row.service_type === 'section3d' ? 'Section 3(d) Screening' : 'Markush Coverage'}`,
        },
      ],
    }),
  })
  const order = await res.json()
  if (!res.ok || !order.id) {
    console.error('[standard-report create-order] PayPal order creation failed', order)
    return NextResponse.json({ error: 'Could not start payment — please try again.' }, { status: 502 })
  }

  return NextResponse.json({ orderID: order.id })
}
