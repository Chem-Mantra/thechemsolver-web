import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Razorpay webhook — the actual source of truth for granting one year of
// ad-free access, independent of whether the client's /verify round trip
// completed (e.g. the browser closed right after paying).
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 503 })
  }

  const signature = req.headers.get('x-razorpay-signature')
  const rawBody = await req.text()

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex')
  if (expectedSignature !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(rawBody)

  if (event.event === 'payment.captured') {
    const payment = event.payload?.payment?.entity
    const userId = payment?.notes?.supabase_user_id

    if (userId) {
      const serviceKey = process.env.THECHEMSOLVER_SUPABASE_SERVICE_KEY
      const supabaseUrl = process.env.NEXT_PUBLIC_THECHEMSOLVER_SUPABASE_URL!

      if (serviceKey) {
        const admin = createClient(supabaseUrl, serviceKey)
        const expiresAt = new Date()
        expiresAt.setFullYear(expiresAt.getFullYear() + 1)

        await admin.from('premium_access').upsert({
          user_id: userId,
          razorpay_order_id: payment.order_id,
          razorpay_payment_id: payment.id,
          purchased_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
