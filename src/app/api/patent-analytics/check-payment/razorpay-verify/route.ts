import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { resolveOrFetchLiveResult } from '@/lib/liveCheckLookup'

// See capture-order/route.ts's identical export -- live Portfolio Landscape
// fetches on a large family can take up to ~25-30s.
export const maxDuration = 60

// Instant Compound Check ($10 via UPI/cards) -- step 2 of 2, Razorpay path.
// Mirrors check-payment/capture-order/route.ts (the PayPal path) gate for
// gate: signature verified server-side before any product data is
// revealed or any check_requests row queued; patentNumber/email read back
// from Razorpay's own order `notes`, not the client's request body; every
// confirmed payment writes an audit row to check_payments (shared table,
// provider='razorpay') so a failure after a real charge is recoverable.
const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1'

async function getAuthHeader(): Promise<string> {
  const keyId = process.env.RAZORPAY_KEY_ID!
  const keySecret = process.env.RAZORPAY_KEY_SECRET!
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
}

async function notifyFounderOfQueuedCheck(patentNumber: string, email: string, name: string) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const notifyTo = process.env.PATENT_NEWS_NOTIFY_EMAIL || 'kotian333@gmail.com'
  if (!apiKey || !from) {
    console.warn('RESEND_API_KEY/RESEND_FROM_EMAIL not set — skipping check-request notification.')
    return
  }
  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from,
      to: notifyTo,
      subject: `PAID check request (UPI): ${patentNumber} (no data yet)`,
      text: `A visitor PAID via UPI/Razorpay for a check on ${patentNumber} but we don't have it yet -- this one's time-sensitive.\n\nRequester: ${name || '(no name)'} <${email}>\n\nRun it through the pipeline and upload via 04_upload_to_website.py -- the fulfillment step will automatically email them the result once it's uploaded.`,
    })
  } catch (err) {
    console.warn('check-payment (razorpay) founder notification failed (non-blocking):', err)
  }
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
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json({ error: 'Missing payment confirmation.' }, { status: 400 })
  }

  // Gate 1: idempotency -- already processed, return the recorded outcome.
  const { data: existing } = await supabaseAdmin
    .from('check_payments')
    .select('outcome, result_url')
    .eq('razorpay_order_id', razorpayOrderId)
    .maybeSingle()
  if (existing) {
    if (existing.outcome === 'found' && existing.result_url) {
      return NextResponse.json({ found: true, url: existing.result_url })
    }
    if (existing.outcome === 'queued') {
      return NextResponse.json({ found: false, message: "We don't have data on this patent yet. We'll run it and email you the results within 1 hour." })
    }
    return NextResponse.json({ error: 'This payment ran into an issue — contact support@thechemsolver.com with reference ' + razorpayOrderId }, { status: 500 })
  }

  // Gate 2: verify the signature Razorpay's checkout handler returned --
  // standard HMAC-SHA256("order_id|payment_id", key_secret), computed
  // locally (no API call needed for this check itself).
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')
  if (expectedSignature !== razorpaySignature) {
    console.error('[check-payment razorpay-verify] signature mismatch', { razorpayOrderId, razorpayPaymentId })
    return NextResponse.json({ error: 'Payment could not be verified — please try again.' }, { status: 402 })
  }

  // Confirm the payment actually captured (signature match alone proves
  // the response came from Razorpay, not that money moved) and read back
  // patentNumber/email from the order's own notes.
  const paymentRes = await fetch(`${RAZORPAY_API_BASE}/payments/${razorpayPaymentId}`, {
    headers: { Authorization: await getAuthHeader() },
  })
  const payment = await paymentRes.json()
  if (!paymentRes.ok || payment.status !== 'captured') {
    console.error('[check-payment razorpay-verify] payment not captured', razorpayPaymentId, payment)
    return NextResponse.json({ error: 'Payment could not be completed — please try again.' }, { status: 402 })
  }

  const orderRes = await fetch(`${RAZORPAY_API_BASE}/orders/${razorpayOrderId}`, {
    headers: { Authorization: await getAuthHeader() },
  })
  const order = await orderRes.json()
  const patentNumber = typeof order?.notes?.patentNumber === 'string' ? order.notes.patentNumber : ''
  const email = typeof order?.notes?.email === 'string' ? order.notes.email : ''

  // Gate 3: money taken, but we can't tell what for. Never silently drop this.
  if (!patentNumber || !email) {
    console.error('[check-payment razorpay-verify] CAPTURED PAYMENT WITH UNREADABLE order notes -- MANUAL REFUND/RECOVERY NEEDED', { razorpayOrderId, razorpayPaymentId })
    await supabaseAdmin.from('check_payments').insert({
      provider: 'razorpay',
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      patent_number: '(unknown)',
      requester_email: '(unknown)',
      requester_name: name || null,
      outcome: 'error',
    })
    return NextResponse.json(
      { error: `Payment succeeded but something went wrong on our end — email support@thechemsolver.com with reference ${razorpayOrderId} and we'll make it right.` },
      { status: 500 }
    )
  }

  const liveResult = await resolveOrFetchLiveResult(patentNumber)

  let responseBody: Record<string, unknown>
  if (liveResult.found) {
    const url = liveResult.url
    await supabaseAdmin.from('check_payments').insert({
      provider: 'razorpay',
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      patent_number: patentNumber,
      requester_email: email,
      requester_name: name || null,
      outcome: 'found',
      result_url: url,
    })
    responseBody = { found: true, url }
  } else {
    const { error: dbError } = await supabaseAdmin
      .from('check_requests')
      .insert({ patent_number: patentNumber, requester_email: email, requester_name: name || null })
    if (dbError) {
      console.error('[check-payment razorpay-verify] paid but failed to queue check_requests row -- MANUAL FOLLOW-UP NEEDED', { razorpayOrderId, razorpayPaymentId, patentNumber, email, dbError })
    }
    await supabaseAdmin.from('check_payments').insert({
      provider: 'razorpay',
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      patent_number: patentNumber,
      requester_email: email,
      requester_name: name || null,
      outcome: 'queued',
    })
    await notifyFounderOfQueuedCheck(patentNumber, email, name)
    responseBody = { found: false, message: "We don't have data on this patent yet. We'll run it and email you the results within 1 hour." }
  }

  return NextResponse.json(responseBody)
}
