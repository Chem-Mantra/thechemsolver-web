import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1'

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
  const razorpayOrderId = typeof body?.razorpay_order_id === 'string' ? body.razorpay_order_id : ''
  const razorpayPaymentId = typeof body?.razorpay_payment_id === 'string' ? body.razorpay_payment_id : ''
  const razorpaySignature = typeof body?.razorpay_signature === 'string' ? body.razorpay_signature : ''
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json({ error: 'Missing payment confirmation.' }, { status: 400 })
  }

  // Same HMAC-SHA256("order_id|payment_id", key_secret) check as the $10
  // tier's verify route -- proves the response actually came from Razorpay.
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')
  if (expectedSignature !== razorpaySignature) {
    console.error('[newest-patents unlock razorpay-verify] signature mismatch', { razorpayOrderId, razorpayPaymentId })
    return NextResponse.json({ error: 'Payment could not be verified -- please try again.' }, { status: 402 })
  }

  const paymentRes = await fetch(`${RAZORPAY_API_BASE}/payments/${razorpayPaymentId}`, {
    headers: { Authorization: await getAuthHeader() },
  })
  const payment = await paymentRes.json()
  if (!paymentRes.ok || payment.status !== 'captured') {
    console.error('[newest-patents unlock razorpay-verify] payment not captured', razorpayPaymentId, payment)
    return NextResponse.json({ error: 'Payment could not be completed -- please try again.' }, { status: 402 })
  }

  const orderRes = await fetch(`${RAZORPAY_API_BASE}/orders/${razorpayOrderId}`, {
    headers: { Authorization: await getAuthHeader() },
  })
  const order = await orderRes.json()
  const requestId = typeof order?.notes?.requestId === 'string' ? order.notes.requestId : ''

  if (!requestId) {
    console.error('[newest-patents unlock razorpay-verify] CAPTURED PAYMENT WITH UNREADABLE order notes -- MANUAL REFUND/RECOVERY NEEDED', { razorpayOrderId, razorpayPaymentId })
    return NextResponse.json(
      { error: `Payment succeeded but something went wrong on our end -- email support@thechemsolver.com with reference ${razorpayOrderId}.` },
      { status: 500 }
    )
  }

  const { error } = await supabaseAdmin.from('live_extraction_requests').update({ unlocked: true }).eq('id', requestId)
  if (error) {
    console.error('[newest-patents unlock razorpay-verify] payment captured but failed to unlock -- MANUAL FOLLOW-UP NEEDED', { razorpayOrderId, requestId, error })
    return NextResponse.json(
      { error: `Payment succeeded but something went wrong on our end -- email support@thechemsolver.com with reference ${razorpayOrderId}.` },
      { status: 500 }
    )
  }

  return NextResponse.json({ unlocked: true })
}
