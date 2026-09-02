import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1'
const UNLOCK_PRICE_INR_PAISE = 124500 // ~$15 at a conservative USD/INR rate, same fixed-rate approach as the $10 tier

async function getAuthHeader(): Promise<string> {
  const keyId = process.env.RAZORPAY_KEY_ID!
  const keySecret = process.env.RAZORPAY_KEY_SECRET!
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
}

export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'UPI/card payments are not configured yet.' }, { status: 503 })
  }

  const body = await req.json().catch(() => null)
  const requestId = typeof body?.requestId === 'string' ? body.requestId.trim() : ''
  if (!requestId) {
    return NextResponse.json({ error: 'Missing request ID.' }, { status: 400 })
  }

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

  try {
    const res = await fetch(`${RAZORPAY_API_BASE}/orders`, {
      method: 'POST',
      headers: { Authorization: await getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: UNLOCK_PRICE_INR_PAISE,
        currency: 'INR',
        // Real bug found 2026-09-02: this used to embed the full requestId
        // UUID (36 chars), producing e.g. "unlock_5caa4595-...-...9c627d631fc3_1788376073000"
        // (57 chars) -- Razorpay's receipt field caps at 56 chars and
        // rejects anything longer with a 400. The sibling check-payment
        // route never hit this because it uses a short patent number here,
        // not a UUID. Truncating to the UUID's first 8 chars (still unique
        // enough for a human-readable receipt label -- the real identifier
        // lives in `notes.requestId` below, not the receipt) keeps this
        // safely under the limit.
        receipt: `unlock_${requestId.slice(0, 8)}_${Date.now()}`,
        notes: { requestId },
      }),
    })
    const order = await res.json()
    if (!res.ok || !order.id) {
      console.error('[newest-patents unlock razorpay-create-order] Razorpay order creation failed', order)
      return NextResponse.json({ error: 'Could not start payment -- please try again.' }, { status: 502 })
    }

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId })
  } catch (exc) {
    // TEMPORARY diagnostic -- this route was returning a raw infra 502
    // (not JSON) in production for reasons not yet reproduced locally.
    // Surfacing the real exception message here (never done elsewhere in
    // this codebase) is a one-off to see the actual failure; strip the
    // `debug` field back out once the real cause is found and fixed.
    console.error('[newest-patents unlock razorpay-create-order] uncaught exception', exc)
    return NextResponse.json(
      { error: 'Could not start payment -- please try again.', debug: exc instanceof Error ? exc.message : String(exc) },
      { status: 500 }
    )
  }
}
