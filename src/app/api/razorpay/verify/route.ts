import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Called by the client right after Razorpay's checkout modal completes.
// This gives the user instant feedback; the webhook (payment.captured) is
// the actual source of truth in case the browser closes before this runs.
export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 503 })
  }

  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_THECHEMSOLVER_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_THECHEMSOLVER_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, anonKey)
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment fields.' }, { status: 400 })
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    console.warn(`[audit] razorpay signature mismatch user=${userData.user.email} order=${razorpay_order_id}`)
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  const serviceKey = process.env.THECHEMSOLVER_SUPABASE_SERVICE_KEY
  if (!serviceKey) {
    return NextResponse.json({ error: 'Payments are not fully configured yet.' }, { status: 503 })
  }

  const admin = createClient(supabaseUrl, serviceKey)
  const expiresAt = new Date()
  expiresAt.setFullYear(expiresAt.getFullYear() + 1)

  await admin.from('premium_access').upsert({
    user_id: userData.user.id,
    razorpay_order_id,
    razorpay_payment_id,
    purchased_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
  })

  return NextResponse.json({ success: true, expires_at: expiresAt.toISOString() })
}
