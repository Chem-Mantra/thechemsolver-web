import { NextRequest, NextResponse } from 'next/server'

// Instant Compound Check ($10, charged as its INR equivalent) via Razorpay --
// the UPI/cards/netbanking path for Indian customers, alongside the
// existing PayPal option in create-order/route.ts. Same tamper-resistance
// pattern: patentNumber/email are embedded in the Razorpay order's own
// `notes` field at CREATE time and read back from Razorpay's own order
// data at verify time (razorpay-verify/route.ts), never re-trusted from
// the client, so one payment can't be reused to look up a different patent.
const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1'
const CHECK_PRICE_INR_PAISE = 83000 // ~$10 at a conservative USD/INR rate,
// in paise (Razorpay's smallest-unit convention, like PayPal's amount.value
// but INR has no further subdivision so this is just rupees*100). Revisit
// if this needs to track live FX rates -- fixed for now, same as PayPal's
// flat $10.00.

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
  const patentNumber = typeof body?.patentNumber === 'string' ? body.patentNumber.trim().toUpperCase() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  if (!patentNumber || !email) {
    return NextResponse.json({ error: 'Patent number and email are required.' }, { status: 400 })
  }

  const res = await fetch(`${RAZORPAY_API_BASE}/orders`, {
    method: 'POST',
    headers: { Authorization: await getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: CHECK_PRICE_INR_PAISE,
      currency: 'INR',
      receipt: `check_${patentNumber}_${Date.now()}`,
      notes: { patentNumber, email },
    }),
  })
  const order = await res.json()
  if (!res.ok || !order.id) {
    console.error('[check-payment razorpay-create-order] Razorpay order creation failed', order)
    return NextResponse.json({ error: 'Could not start payment — please try again.' }, { status: 502 })
  }

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId,
  })
}
