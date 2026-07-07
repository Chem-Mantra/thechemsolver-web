import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// PayPal webhook — the sole source of truth for granting one year of
// ad-free access, since checkout runs through a dashboard-configured
// Hosted Button/Payment Link (no per-purchase custom_id we control). We
// match the payer's PayPal email back to a signed-in Supabase account by
// email, which is why students are required to sign in with Google before
// paying and asked to pay with that same email — see docs/PAYPAL_SETUP.md.
export async function POST(req: NextRequest) {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!clientId || !clientSecret || !webhookId) {
    return NextResponse.json({ error: 'PayPal is not configured yet.' }, { status: 503 })
  }

  const rawBody = await req.text()
  const event = JSON.parse(rawBody)

  const verified = await verifyWebhookSignature(req, event, { clientId, clientSecret, webhookId })
  if (!verified) {
    console.warn('[paypal webhook] signature verification failed', event.id)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    const capture = event.resource
    const payerEmail = await resolvePayerEmail(capture, { clientId, clientSecret })

    if (!payerEmail) {
      console.error('[paypal webhook] could not find payer email on capture', capture?.id, JSON.stringify(capture))
      return NextResponse.json({ received: true })
    }

    const granted = await grantAdFreeAccess(payerEmail, capture.id)
    if (!granted) {
      console.error(`[paypal webhook] no Supabase account found for payer email=${payerEmail} capture=${capture.id}`)
    }
  }

  return NextResponse.json({ received: true })
}

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

async function verifyWebhookSignature(
  req: NextRequest,
  event: unknown,
  creds: { clientId: string; clientSecret: string; webhookId: string }
): Promise<boolean> {
  const accessToken = await getAccessToken(creds.clientId, creds.clientSecret)
  const res = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_algo: req.headers.get('paypal-auth-algo'),
      cert_url: req.headers.get('paypal-cert-url'),
      transmission_id: req.headers.get('paypal-transmission-id'),
      transmission_sig: req.headers.get('paypal-transmission-sig'),
      transmission_time: req.headers.get('paypal-transmission-time'),
      webhook_id: creds.webhookId,
      webhook_event: event,
    }),
  })
  const data = await res.json()
  return data.verification_status === 'SUCCESS'
}

// Capture objects don't always carry payer info directly — fall back to
// following the "up" link to the parent order, which does.
async function resolvePayerEmail(
  capture: { payer?: { email_address?: string }; links?: { rel: string; href: string }[] },
  creds: { clientId: string; clientSecret: string }
): Promise<string | null> {
  if (capture?.payer?.email_address) return capture.payer.email_address

  const upLink = capture?.links?.find((l) => l.rel === 'up')?.href
  if (!upLink) return null

  const accessToken = await getAccessToken(creds.clientId, creds.clientSecret)
  const res = await fetch(upLink, { headers: { Authorization: `Bearer ${accessToken}` } })
  if (!res.ok) return null
  const order = await res.json()
  return order?.payer?.email_address ?? null
}

async function grantAdFreeAccess(email: string, captureId: string): Promise<boolean> {
  const serviceKey = process.env.THECHEMSOLVER_SUPABASE_SERVICE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_THECHEMSOLVER_SUPABASE_URL
  if (!serviceKey || !supabaseUrl) return false

  const admin = createClient(supabaseUrl, serviceKey)

  // supabase-js's admin API has no server-side "get user by email" filter, so
  // this pages through all users. Fine at this project's scale; add a
  // dedicated lookup (e.g. a profiles table indexed by email) if that changes.
  const target = email.toLowerCase()
  let userId: string | null = null
  for (let page = 1; page <= 20 && !userId; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error || !data?.users?.length) break
    const users = data.users as { id: string; email?: string }[]
    userId = users.find((u) => u.email?.toLowerCase() === target)?.id ?? null
    if (users.length < 1000) break
  }
  if (!userId) return false

  const expiresAt = new Date()
  expiresAt.setFullYear(expiresAt.getFullYear() + 1)

  await admin.from('premium_access').upsert({
    user_id: userId,
    paypal_capture_id: captureId,
    purchased_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
  })

  await sendConfirmationEmail(email)
  return true
}

async function sendConfirmationEmail(email: string) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) return

  const resend = new Resend(apiKey)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechemsolver.com'

  await resend.emails.send({
    from,
    to: email,
    subject: "You're ad-free on TheChemSolver 🎉",
    html: `
      <p>Thanks for your purchase! Your payment has been received and ad-free access is now active on your account for one year.</p>
      <p><a href="${siteUrl}/account">Go to TheChemSolver</a></p>
    `,
  })
}
