import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { FREE_TRIAL_DAYS } from '@/lib/pricing'
import { isPaidCaptureId, snapshotFromPremiumRow } from '@/lib/access'

/**
 * Start (or report) the signed-in student's free trial.
 *
 * Single clock (no double-dip):
 * - Client may send `localTrialStartedAt` (ms epoch) from the anonymous
 *   localStorage trial. The server trial ends at localStart + 15 days —
 *   even if that is already in the past — so signing in never resets a
 *   burned free period.
 * - If no local clock was sent, trial starts now and lasts FREE_TRIAL_DAYS.
 * - Existing row → return as-is (never restarts).
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

  let localTrialStartedAt: number | null = null
  try {
    const body = await req.json().catch(() => ({}))
    const raw = (body as { localTrialStartedAt?: unknown })?.localTrialStartedAt
    if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
      localTrialStartedAt = raw
    } else if (typeof raw === 'string' && /^\d+$/.test(raw)) {
      localTrialStartedAt = Number(raw)
    }
  } catch {
    // empty body is fine
  }

  // Reject absurd timestamps (future > 1 day, or older than 2 years).
  const nowMs = Date.now()
  if (localTrialStartedAt != null) {
    if (localTrialStartedAt > nowMs + 24 * 60 * 60 * 1000) localTrialStartedAt = null
    if (localTrialStartedAt < nowMs - 2 * 365 * 24 * 60 * 60 * 1000) localTrialStartedAt = null
  }

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

  // Align server trial to the anonymous local clock when present.
  const trialStartMs = localTrialStartedAt ?? nowMs
  const purchasedAt = new Date(trialStartMs)
  const expiresAt = new Date(trialStartMs + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000)

  const { data: inserted, error: insertErr } = await admin
    .from('premium_access')
    .insert({
      user_id: userId,
      purchased_at: purchasedAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      paypal_capture_id: 'trial',
    })
    .select('expires_at, paypal_capture_id, purchased_at')
    .single()

  if (insertErr) {
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
  return NextResponse.json({
    created: true,
    alignedToLocal: localTrialStartedAt != null,
    ...snap,
  })
}
