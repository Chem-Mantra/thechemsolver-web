import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { resolveOrFetchLiveResult } from '@/lib/liveCheckLookup'

// Live Portfolio Landscape fetches (Google Patents, up to 15 family
// members + politeness delays) can genuinely take up to ~25-30s on a large
// family -- default Vercel function timeouts are too short for that.
export const maxDuration = 60

// Instant Compound Check ($10) -- step 2 of 2. Captures the PayPal order
// created by create-order/route.ts, then runs the SAME lookup logic the
// free check-request/route.ts flow used to run unconditionally -- the only
// difference is this now only runs after a confirmed, server-verified
// capture, never on the client's say-so.
//
// GATES (money is real here, so these are not optional):
//   1. Idempotency: a paypal_order_id already present in check_payments was
//      already fully processed -- return its recorded outcome again rather
//      than re-running business logic (closes both the "double-click retry"
//      case and the "reuse one payment to look up a different patent" case,
//      since patent_number/email are read from PayPal's own custom_id, not
//      the request body).
//   2. Payment confirmed server-side (capture.status === 'COMPLETED') before
//      any product data is revealed or any check_requests row is queued.
//   3. If capture succeeds but custom_id can't be read back, the charge is
//      real but we don't know what it was for -- this is logged loudly for
//      manual refund/recovery, never silently dropped.
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
      subject: `PAID check request: ${patentNumber} (no data yet)`,
      text: `A visitor PAID $10 for a check on ${patentNumber} but we don't have it yet -- this one's time-sensitive.\n\nRequester: ${name || '(no name)'} <${email}>\n\nRun it through the pipeline and upload via 04_upload_to_website.py -- the fulfillment step will automatically email them the result once it's uploaded.`,
    })
  } catch (err) {
    console.warn('check-payment founder notification failed (non-blocking):', err)
  }
}

export async function POST(req: NextRequest) {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 503 })
  }

  const body = await req.json().catch(() => null)
  const orderID = typeof body?.orderID === 'string' ? body.orderID : ''
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  if (!orderID) {
    return NextResponse.json({ error: 'Missing order ID.' }, { status: 400 })
  }

  // Gate 1: idempotency -- already processed, return the recorded outcome.
  const { data: existing } = await supabaseAdmin
    .from('check_payments')
    .select('outcome, result_url')
    .eq('paypal_order_id', orderID)
    .maybeSingle()
  if (existing) {
    if (existing.outcome === 'found' && existing.result_url) {
      return NextResponse.json({ found: true, url: existing.result_url })
    }
    if (existing.outcome === 'queued') {
      return NextResponse.json({ found: false, message: "We don't have data on this patent yet. We'll run it and email you the results within 1 hour." })
    }
    return NextResponse.json({ error: 'This payment ran into an issue — contact support@thechemsolver.com with reference ' + orderID }, { status: 500 })
  }

  const accessToken = await getAccessToken(clientId, clientSecret)
  const captureRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  })
  const capture = await captureRes.json()

  // Gate 2: only a confirmed COMPLETED capture unlocks anything below.
  if (!captureRes.ok || capture.status !== 'COMPLETED') {
    // ORDER_ALREADY_CAPTURED can happen on a genuine double-submit race --
    // re-check our own table once (the first request may have just
    // finished writing it) before reporting a hard failure.
    const alreadyCaptured = capture?.details?.some?.((d: { issue?: string }) => d.issue === 'ORDER_ALREADY_CAPTURED')
    if (alreadyCaptured) {
      const { data: raceWinner } = await supabaseAdmin
        .from('check_payments')
        .select('outcome, result_url')
        .eq('paypal_order_id', orderID)
        .maybeSingle()
      if (raceWinner?.outcome === 'found' && raceWinner.result_url) {
        return NextResponse.json({ found: true, url: raceWinner.result_url })
      }
      if (raceWinner?.outcome === 'queued') {
        return NextResponse.json({ found: false, message: "We don't have data on this patent yet. We'll run it and email you the results within 1 hour." })
      }
    }
    console.error('[check-payment capture-order] capture failed', orderID, capture)
    return NextResponse.json({ error: 'Payment could not be completed — please try again.' }, { status: 402 })
  }

  const captureId: string | null = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? null
  const customIdRaw: string | null =
    capture.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id ?? capture.purchase_units?.[0]?.custom_id ?? null

  let patentNumber = ''
  let email = ''
  try {
    const parsed = JSON.parse(customIdRaw || '{}')
    patentNumber = typeof parsed.patentNumber === 'string' ? parsed.patentNumber : ''
    email = typeof parsed.email === 'string' ? parsed.email : ''
  } catch {
    // handled by the empty-check below
  }

  // Gate 3: money taken, but we can't tell what for. Never silently drop this.
  if (!patentNumber || !email) {
    console.error('[check-payment capture-order] CAPTURED PAYMENT WITH UNREADABLE custom_id -- MANUAL REFUND/RECOVERY NEEDED', { orderID, captureId, customIdRaw })
    await supabaseAdmin.from('check_payments').insert({
      paypal_order_id: orderID,
      paypal_capture_id: captureId,
      patent_number: '(unknown)',
      requester_email: '(unknown)',
      requester_name: name || null,
      outcome: 'error',
    })
    return NextResponse.json(
      { error: `Payment succeeded but something went wrong on our end — email support@thechemsolver.com with reference ${orderID} and we'll make it right.` },
      { status: 500 }
    )
  }

  const liveResult = await resolveOrFetchLiveResult(patentNumber)

  let responseBody: Record<string, unknown>
  if (liveResult.found) {
    const url = liveResult.url
    await supabaseAdmin.from('check_payments').insert({
      paypal_order_id: orderID,
      paypal_capture_id: captureId,
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
      console.error('[check-payment capture-order] paid but failed to queue check_requests row -- MANUAL FOLLOW-UP NEEDED', { orderID, captureId, patentNumber, email, dbError })
    }
    await supabaseAdmin.from('check_payments').insert({
      paypal_order_id: orderID,
      paypal_capture_id: captureId,
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
