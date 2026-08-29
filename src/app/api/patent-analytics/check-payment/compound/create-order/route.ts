import { NextRequest, NextResponse } from 'next/server'

// Instant Compound Check ($10) -- compound-input side, step 1 of 2.
// Mirrors check-payment/create-order/route.ts (the patent-number side)
// exactly, just embedding the client's compound instead of a patent
// number in the order's custom_id.
const PAYPAL_API_BASE =
  process.env.PAYPAL_ENV === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com'

const CHECK_PRICE_USD = '10.00'

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
  const compound = typeof body?.compound === 'string' ? body.compound.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  if (!compound || !email) {
    return NextResponse.json({ error: 'Compound and email are required.' }, { status: 400 })
  }

  const customId = JSON.stringify({ compound, email })
  if (customId.length > 127) {
    return NextResponse.json({ error: 'That compound name/email is too long — please shorten it or contact us directly.' }, { status: 400 })
  }

  const accessToken = await getAccessToken(clientId, clientSecret)
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: 'USD', value: CHECK_PRICE_USD },
          custom_id: customId,
          description: `Instant Compound Check: ${compound}`,
        },
      ],
    }),
  })
  const order = await res.json()
  if (!res.ok || !order.id) {
    console.error('[check-payment compound create-order] PayPal order creation failed', order)
    return NextResponse.json({ error: 'Could not start payment — please try again.' }, { status: 502 })
  }

  return NextResponse.json({ orderID: order.id })
}
