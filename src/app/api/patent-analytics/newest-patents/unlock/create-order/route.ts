import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Unlocks a CONFIRMED newest-patents extraction result for download.
// $15 -- between the $10 automated Instant Compound Check (Google/PubChem-
// sourced, already-indexed patents) and the $199 human-reviewed Standard
// Report, reflecting this is still fully automated but sourced from a
// patent nothing else on the market covers yet. Easy to retune later --
// single constant, no logic depends on the exact number.
const UNLOCK_PRICE_USD = '15.00'

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
  const requestId = typeof body?.requestId === 'string' ? body.requestId.trim() : ''
  if (!requestId) {
    return NextResponse.json({ error: 'Missing request ID.' }, { status: 400 })
  }

  // Only a genuinely confirmed, not-yet-unlocked result can be paid for --
  // never let a client buy an unlock for a needs_review/failed/pending
  // request (there's nothing to unlock), and never double-charge one
  // already unlocked.
  const { data: row } = await supabaseAdmin
    .from('live_extraction_requests')
    .select('id, status, outcome, unlocked')
    .eq('id', requestId)
    .maybeSingle()
  if (!row) {
    return NextResponse.json({ error: 'Request not found.' }, { status: 404 })
  }
  if (row.status !== 'completed' || row.outcome !== 'confirmed') {
    return NextResponse.json({ error: 'This result is not available to unlock.' }, { status: 400 })
  }
  if (row.unlocked) {
    return NextResponse.json({ error: 'This result is already unlocked.' }, { status: 400 })
  }

  const accessToken = await getAccessToken(clientId, clientSecret)
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: 'USD', value: UNLOCK_PRICE_USD },
          custom_id: requestId,
          description: `Newest Patent Extraction unlock: ${requestId}`,
        },
      ],
    }),
  })
  const order = await res.json()
  if (!res.ok || !order.id) {
    console.error('[newest-patents unlock create-order] PayPal order creation failed', order)
    return NextResponse.json({ error: 'Could not start payment -- please try again.' }, { status: 502 })
  }

  return NextResponse.json({ orderID: order.id })
}
