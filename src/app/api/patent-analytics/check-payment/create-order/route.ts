import { NextRequest, NextResponse } from 'next/server'

// Instant Compound Check ($10) -- step 1 of 2. Creates a PayPal order via
// the Orders API v2 (NOT the dashboard-configured Hosted Button used
// elsewhere in this app for the flat $15/yr product -- that mechanism has
// no per-purchase custom_id and redirects to a new tab with no live
// confirmation, which can't deliver this product's "instant" promise).
//
// The patent number + email are embedded in the order's own custom_id at
// CREATE time and read back from PayPal's own order data at CAPTURE time
// (see capture-order/route.ts) rather than trusted from the client again --
// this is what stops someone from paying once and then reusing the same
// approved order to look up a different patent than the one they paid for.
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
  const patentNumber = typeof body?.patentNumber === 'string' ? body.patentNumber.trim().toUpperCase() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  if (!patentNumber || !email) {
    return NextResponse.json({ error: 'Patent number and email are required.' }, { status: 400 })
  }

  // custom_id has a hard 127-char limit on PayPal's side -- reject upfront
  // with a clear message rather than silently truncating into invalid JSON
  // that capture-order would then fail to parse AFTER the customer has paid.
  const customId = JSON.stringify({ patentNumber, email })
  if (customId.length > 127) {
    return NextResponse.json({ error: 'That email address is too long — please use a shorter one or contact us directly.' }, { status: 400 })
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
          description: `Instant Compound Check: ${patentNumber}`,
        },
      ],
    }),
  })
  const order = await res.json()
  if (!res.ok || !order.id) {
    console.error('[check-payment create-order] PayPal order creation failed', order)
    return NextResponse.json({ error: 'Could not start payment — please try again.' }, { status: 502 })
  }

  return NextResponse.json({ orderID: order.id })
}
