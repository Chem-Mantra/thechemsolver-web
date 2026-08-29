import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const maxDuration = 30

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
      subject: `PAID Standard Report ($199): ${serviceLabel} — ${row.requester_company}`,
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
    console.warn('standard-report founder notification failed (non-blocking):', err)
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
  if (!orderID) {
    return NextResponse.json({ error: 'Missing order ID.' }, { status: 400 })
  }

  // Idempotency: a paypal_order_id already captured on a row means this
  // exact order was already fully processed.
  const { data: alreadyDone } = await supabaseAdmin
    .from('standard_report_requests')
    .select('id, status')
    .eq('paypal_order_id', orderID)
    .maybeSingle()
  if (alreadyDone) {
    return NextResponse.json({ success: true })
  }

  const accessToken = await getAccessToken(clientId, clientSecret)
  const captureRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  })
  const capture = await captureRes.json()

  if (!captureRes.ok || capture.status !== 'COMPLETED') {
    const alreadyCaptured = capture?.details?.some?.((d: { issue?: string }) => d.issue === 'ORDER_ALREADY_CAPTURED')
    if (alreadyCaptured) {
      return NextResponse.json({ success: true }) // a genuine double-submit race, first request already handled it
    }
    console.error('[standard-report capture-order] capture failed', orderID, capture)
    return NextResponse.json({ error: 'Payment could not be completed — please try again.' }, { status: 402 })
  }

  const captureId: string | null = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? null
  const pendingRequestId: string | null =
    capture.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id ?? capture.purchase_units?.[0]?.custom_id ?? null

  if (!pendingRequestId) {
    console.error('[standard-report capture-order] CAPTURED PAYMENT WITH NO custom_id -- MANUAL REFUND/RECOVERY NEEDED', { orderID, captureId })
    return NextResponse.json(
      { error: `Payment succeeded but something went wrong on our end — email support@thechemsolver.com with reference ${orderID} and we'll make it right.` },
      { status: 500 }
    )
  }

  const { data: row, error: updateError } = await supabaseAdmin
    .from('standard_report_requests')
    .update({ status: 'pending', provider: 'paypal', paypal_order_id: orderID, paypal_capture_id: captureId })
    .eq('id', pendingRequestId)
    .eq('status', 'pending_payment')
    .select()
    .single()

  if (updateError || !row) {
    console.error('[standard-report capture-order] ACTIVE payment but no matching pending request row -- MANUAL RECOVERY NEEDED', { orderID, captureId, pendingRequestId, updateError })
    return NextResponse.json(
      { error: `Payment succeeded but something went wrong on our end — email support@thechemsolver.com with reference ${orderID} and we'll make it right.` },
      { status: 500 }
    )
  }

  await notifyFounder(row)

  return NextResponse.json({ success: true })
}
