import { NextRequest, NextResponse } from 'next/server'

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1'
const CHECK_PRICE_INR_PAISE = 83000 // same flat rate as check-payment/razorpay-create-order's $10

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
  const compound = typeof body?.compound === 'string' ? body.compound.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  if (!compound || !email) {
    return NextResponse.json({ error: 'Compound and email are required.' }, { status: 400 })
  }

  const res = await fetch(`${RAZORPAY_API_BASE}/orders`, {
    method: 'POST',
    headers: { Authorization: await getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: CHECK_PRICE_INR_PAISE,
      currency: 'INR',
      receipt: `compound_check_${Date.now()}`,
      notes: { compound, email },
    }),
  })
  const order = await res.json()
  if (!res.ok || !order.id) {
    console.error('[check-payment compound razorpay-create-order] Razorpay order creation failed', order)
    return NextResponse.json({ error: 'Could not start payment — please try again.' }, { status: 502 })
  }

  return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId })
}
