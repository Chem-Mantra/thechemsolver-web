import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { runCompoundCheck, emailCompoundCheckResult } from '@/lib/compoundCheckResult'

export const maxDuration = 60

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

  const { data: existing } = await supabaseAdmin
    .from('check_payments')
    .select('details_json')
    .eq('razorpay_order_id', razorpayOrderId)
    .maybeSingle()
  if (existing) {
    return NextResponse.json({ result: existing.details_json })
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')
  if (expectedSignature !== razorpaySignature) {
    console.error('[check-payment compound razorpay-verify] signature mismatch', { razorpayOrderId, razorpayPaymentId })
    return NextResponse.json({ error: 'Payment could not be verified — please try again.' }, { status: 402 })
  }

  const paymentRes = await fetch(`${RAZORPAY_API_BASE}/payments/${razorpayPaymentId}`, {
    headers: { Authorization: await getAuthHeader() },
  })
  const payment = await paymentRes.json()
  if (!paymentRes.ok || payment.status !== 'captured') {
    console.error('[check-payment compound razorpay-verify] payment not captured', razorpayPaymentId, payment)
    return NextResponse.json({ error: 'Payment could not be completed — please try again.' }, { status: 402 })
  }

  const orderRes = await fetch(`${RAZORPAY_API_BASE}/orders/${razorpayOrderId}`, {
    headers: { Authorization: await getAuthHeader() },
  })
  const order = await orderRes.json()
  const compound = typeof order?.notes?.compound === 'string' ? order.notes.compound : ''
  const email = typeof order?.notes?.email === 'string' ? order.notes.email : ''

  if (!compound || !email) {
    console.error('[check-payment compound razorpay-verify] CAPTURED PAYMENT WITH UNREADABLE order notes -- MANUAL REFUND/RECOVERY NEEDED', { razorpayOrderId, razorpayPaymentId })
    await supabaseAdmin.from('check_payments').insert({
      provider: 'razorpay',
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      patent_number: '(unknown)',
      requester_email: '(unknown)',
      outcome: 'error',
    })
    return NextResponse.json(
      { error: `Payment succeeded but something went wrong on our end — email support@thechemsolver.com with reference ${razorpayOrderId} and we'll make it right.` },
      { status: 500 }
    )
  }

  const result = await runCompoundCheck(compound)

  await supabaseAdmin.from('check_payments').insert({
    provider: 'razorpay',
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    patent_number: compound,
    requester_email: email,
    outcome: result.status === 'unresolved' ? 'unresolved' : 'found',
    details_json: result,
  })

  await emailCompoundCheckResult(email, compound, result)

  return NextResponse.json({ result })
}
