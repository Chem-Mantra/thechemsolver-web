import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { FREE_TRIAL_DAYS } from '@/lib/pricing'
import { isPaidCaptureId, snapshotFromPremiumRow } from '@/lib/access'

/**
 * Start (or report) the signed-in student's free trial.
 *
 * - No row yet → insert a 15-day server trial (`paypal_capture_id = 'trial'`).
 * - Existing active paid or trial → return as-is (never restarts).
 * - Expired trial without payment → return expired (no free re-trial).
 *
 * Requires `Authorization: Bearer <supabase access_token>`.
 */
export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_THECHEMSOLVER_SUPABASE_URL
  const serviceKey = process.env.THECHEMSOLVER_SUPABASE_SERVICE_KEY
  const anonKey = process.env.NEXT_PUBLIC_THECHEMSOLVER_SUPABASE_ANON_KEY
  if (!supabaseUrl || !serviceKey || !anonKey) {
    return NextResponse.json({ error: 'Access service is not configured.' }, { status: 503 })
  }

  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (!token) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  }

  // Validate the user JWT with the anon client (does not need service role).
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: userData, error: userErr } = await userClient.auth.getUser()
  if (userErr || !userData.user) {
    return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })
  }
  const userId = userData.user.id

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: existing, error: readErr } = await admin
    .from('premium_access')
    .select('expires_at, paypal_capture_id, purchased_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (readErr) {
    console.error('[ensure-trial] read failed', readErr)
    return NextResponse.json({ error: 'Could not read access status.' }, { status: 500 })
  }

  if (existing) {
    const snap = snapshotFromPremiumRow(existing)
    return NextResponse.json({
      created: false,
      ...snap,
      isPaid: isPaidCaptureId(existing.paypal_capture_id),
    })
  }

  const now = new Date()
  const expires = new Date(now.getTime() + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000)

  const { data: inserted, error: insertErr } = await admin
    .from('premium_access')
    .insert({
      user_id: userId,
      purchased_at: now.toISOString(),
      expires_at: expires.toISOString(),
      paypal_capture_id: 'trial',
    })
    .select('expires_at, paypal_capture_id, purchased_at')
    .single()

  if (insertErr) {
    // Race: another request may have inserted between our read and write.
    if (insertErr.code === '23505') {
      const { data: raced } = await admin
        .from('premium_access')
        .select('expires_at, paypal_capture_id, purchased_at')
        .eq('user_id', userId)
        .maybeSingle()
      const snap = snapshotFromPremiumRow(raced)
      return NextResponse.json({ created: false, ...snap })
    }
    console.error('[ensure-trial] insert failed', insertErr)
    return NextResponse.json({ error: 'Could not start free trial.' }, { status: 500 })
  }

  const snap = snapshotFromPremiumRow(inserted)
  return NextResponse.json({ created: true, ...snap })
}
