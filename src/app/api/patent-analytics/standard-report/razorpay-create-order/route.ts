import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1'
// Same flat-rate convention as check-payment/razorpay-create-order's
// CHECK_PRICE_INR_PAISE (~83000 paise per $10) -- $199 at that same rate.
const STANDARD_REPORT_PRICE_INR_PAISE = 1_651_700

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
  const pendingRequestId = typeof body?.pendingRequestId === 'string' ? body.pendingRequestId : ''
  if (!pendingRequestId) {
    return NextResponse.json({ error: 'Missing request reference.' }, { status: 400 })
  }

  const { data: row } = await supabaseAdmin
    .from('standard_report_requests')
    .select('id')
    .eq('id', pendingRequestId)
    .eq('status', 'pending_payment')
    .maybeSingle()
  if (!row) {
    return NextResponse.json({ error: 'Request not found — please start over.' }, { status: 404 })
  }

  const res = await fetch(`${RAZORPAY_API_BASE}/orders`, {
    method: 'POST',
    headers: { Authorization: await getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: STANDARD_REPORT_PRICE_INR_PAISE,
      currency: 'INR',
      receipt: `standard_report_${pendingRequestId}`,
      notes: { pendingRequestId },
    }),
  })
  const order = await res.json()
  if (!res.ok || !order.id) {
    console.error('[standard-report razorpay-create-order] Razorpay order creation failed', order)
    return NextResponse.json({ error: 'Could not start payment — please try again.' }, { status: 502 })
  }

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId,
  })
}
