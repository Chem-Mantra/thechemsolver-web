import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const maxDuration = 30

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1'

async function getAuthHeader(): Promise<string> {
  const keyId = process.env.RAZORPAY_KEY_ID!
  const keySecret = process.env.RAZORPAY_KEY_SECRET!
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
}

async function notifyFounder(row: {
  id: string
  service_type: string
  patent_number: string | null
  client_compound: string | null
  details: string
  requester_name: string | null
  requester_email: string
  requester_company: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL || 'support@thechemsolver.com'
  if (!apiKey || !from) {
    console.warn('RESEND_API_KEY/RESEND_FROM_EMAIL not set — skipping standard report notification.')
    return
  }
  const serviceLabel = row.service_type === 'section3d' ? 'Section 3(d) Compliance Screening' : 'Genus/Species (Markush) Coverage'
  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from,
      to: notifyTo,
      subject: `PAID Standard Report (UPI, $199): ${serviceLabel} — ${row.requester_company}`,
      html: `
        <p><b>Service:</b> ${escapeHtml(serviceLabel)}</p>
        <p><b>Requester:</b> ${escapeHtml(row.requester_name || '(not provided)')} — ${escapeHtml(row.requester_email)} — ${escapeHtml(row.requester_company)}</p>
        <p><b>Patent number:</b> ${escapeHtml(row.patent_number || '(not provided)')}</p>
        <p><b>Client's compound:</b> ${escapeHtml(row.client_compound || '(not provided)')}</p>
        <p><b>What they asked for, in their own words:</b></p>
        <p style="white-space: pre-wrap; background: #f4f8fb; padding: 12px; border-radius: 8px;">${escapeHtml(row.details)}</p>
        <p>Reference id: ${escapeHtml(row.id)} (standard_report_requests table)</p>
        <p>24-48h turnaround promised. Once done, run generate_live_report.py with the result and email it to ${escapeHtml(row.requester_email)}, then mark this row fulfilled in the admin portal or via SQL.</p>
      `,
    })
  } catch (err) {
    console.warn('standard-report (razorpay) founder notification failed (non-blocking):', err)
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
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json({ error: 'Missing payment confirmation.' }, { status: 400 })
  }

  const { data: alreadyDone } = await supabaseAdmin
    .from('standard_report_requests')
    .select('id')
    .eq('razorpay_order_id', razorpayOrderId)
    .maybeSingle()
  if (alreadyDone) {
    return NextResponse.json({ success: true })
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')
  if (expectedSignature !== razorpaySignature) {
    console.error('[standard-report razorpay-verify] signature mismatch', { razorpayOrderId, razorpayPaymentId })
    return NextResponse.json({ error: 'Payment could not be verified — please try again.' }, { status: 402 })
  }

  const paymentRes = await fetch(`${RAZORPAY_API_BASE}/payments/${razorpayPaymentId}`, {
    headers: { Authorization: await getAuthHeader() },
  })
  const payment = await paymentRes.json()
  if (!paymentRes.ok || payment.status !== 'captured') {
    console.error('[standard-report razorpay-verify] payment not captured', razorpayPaymentId, payment)
    return NextResponse.json({ error: 'Payment could not be completed — please try again.' }, { status: 402 })
  }

  const orderRes = await fetch(`${RAZORPAY_API_BASE}/orders/${razorpayOrderId}`, {
    headers: { Authorization: await getAuthHeader() },
  })
  const order = await orderRes.json()
  const pendingRequestId = typeof order?.notes?.pendingRequestId === 'string' ? order.notes.pendingRequestId : ''

  if (!pendingRequestId) {
    console.error('[standard-report razorpay-verify] CAPTURED PAYMENT WITH NO pendingRequestId -- MANUAL REFUND/RECOVERY NEEDED', { razorpayOrderId, razorpayPaymentId })
    return NextResponse.json(
      { error: `Payment succeeded but something went wrong on our end — email support@thechemsolver.com with reference ${razorpayOrderId} and we'll make it right.` },
      { status: 500 }
    )
  }

  const { data: row, error: updateError } = await supabaseAdmin
    .from('standard_report_requests')
    .update({ status: 'pending', provider: 'razorpay', razorpay_order_id: razorpayOrderId, razorpay_payment_id: razorpayPaymentId })
    .eq('id', pendingRequestId)
    .eq('status', 'pending_payment')
    .select()
    .single()

  if (updateError || !row) {
    console.error('[standard-report razorpay-verify] ACTIVE payment but no matching pending request row -- MANUAL RECOVERY NEEDED', { razorpayOrderId, razorpayPaymentId, pendingRequestId, updateError })
    return NextResponse.json(
      { error: `Payment succeeded but something went wrong on our end — email support@thechemsolver.com with reference ${razorpayOrderId} and we'll make it right.` },
      { status: 500 }
    )
  }

  await notifyFounder(row)

  return NextResponse.json({ success: true })
}
