import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Portfolio Retainer ($999/mo) -- step 2 of 2. Confirms the PayPal
// subscription is really ACTIVE (server-side, via PayPal's own API, not
// trusted from the client's "I subscribed" claim) and activates the
// matching retainer_customers row -- looked up via the subscription's own
// custom_id, which was set to that row's id at creation time
// (RetainerModal.tsx), not re-supplied by the client here.
const PAYPAL_API_BASE =
  process.env.PAYPAL_ENV === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com'

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
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

export async function POST(req: NextRequest) {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 503 })
  }

  const body = await req.json().catch(() => null)
  const subscriptionId = typeof body?.subscriptionID === 'string' ? body.subscriptionID : ''
  if (!subscriptionId) {
    return NextResponse.json({ error: 'Missing subscription ID.' }, { status: 400 })
  }

  const accessToken = await getAccessToken()
  const subRes = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const subscription = await subRes.json()

  if (!subRes.ok || subscription.status !== 'ACTIVE') {
    console.error('[retainer verify-subscription] subscription not active', subscriptionId, subscription?.status)
    return NextResponse.json({ error: 'Subscription could not be confirmed — please try again or contact support.' }, { status: 402 })
  }

  const customerId = subscription.custom_id
  if (!customerId) {
    console.error('[retainer verify-subscription] ACTIVE subscription with no custom_id -- MANUAL RECOVERY NEEDED', subscriptionId)
    return NextResponse.json(
      { error: `Payment succeeded but something went wrong on our end — email support@thechemsolver.com with reference ${subscriptionId} and we'll make it right.` },
      { status: 500 }
    )
  }

  const { data: customer, error: updateError } = await supabaseAdmin
    .from('retainer_customers')
    .update({ paypal_subscription_id: subscriptionId, status: 'active' })
    .eq('id', customerId)
    .select()
    .single()

  if (updateError || !customer) {
    console.error('[retainer verify-subscription] ACTIVE subscription but no matching pending customer row -- MANUAL RECOVERY NEEDED', { subscriptionId, customerId, updateError })
    return NextResponse.json(
      { error: `Payment succeeded but something went wrong on our end — email support@thechemsolver.com with reference ${subscriptionId} and we'll make it right.` },
      { status: 500 }
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL || 'support@thechemsolver.com'
  if (apiKey && from) {
    const resend = new Resend(apiKey)
    try {
      await resend.emails.send({
        from,
        to: customer.contact_email,
        subject: 'Your Portfolio Retainer is active',
        text: `Hi${customer.contact_name ? ` ${customer.contact_name}` : ''},\n\nYour Portfolio Retainer subscription is active. We're now monitoring your submitted patent(s) and will email you as soon as we find new matching filings.\n\nQuestions any time: support@thechemsolver.com\n\n-- Patent Analytics`,
      })
    } catch (err) {
      console.warn('retainer welcome email failed (non-blocking):', err)
    }
    try {
      await resend.emails.send({
        from,
        to: notifyTo,
        subject: `New Portfolio Retainer subscriber: ${customer.company}`,
        html: `
          <p><b>Company:</b> ${escapeHtml(customer.company)}</p>
          <p><b>Contact:</b> ${escapeHtml(customer.contact_name || '(not provided)')} — ${escapeHtml(customer.contact_email)}</p>
          <p><b>Subscription ID:</b> ${escapeHtml(subscriptionId)}</p>
          <p>$999/mo, active now. Watches were set up in create-subscription — check retainer_watches for the patent list.</p>
        `,
      })
    } catch (err) {
      console.warn('retainer admin notification email failed (non-blocking):', err)
    }
  }

  return NextResponse.json({ success: true })
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
}
