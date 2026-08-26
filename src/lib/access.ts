import {
  FREE_TRIAL_DAYS,
  LOCAL_TRIAL_STARTED_KEY,
} from '@/lib/pricing'

export type AccessSource = 'paid' | 'server_trial' | 'local_trial' | 'none'

export type AccessSnapshot = {
  hasAccess: boolean
  isPaid: boolean
  isTrial: boolean
  source: AccessSource
  expiresAt: string | null
  daysLeft: number | null
}

/** Whole days remaining until `expiresAt` (0 if expired, null if unknown). */
export function daysRemaining(expiresAt: string | Date | null | undefined): number | null {
  if (!expiresAt) return null
  const end = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt
  if (Number.isNaN(end.getTime())) return null
  const ms = end.getTime() - Date.now()
  if (ms <= 0) return 0
  return Math.ceil(ms / (24 * 60 * 60 * 1000))
}

/** Trial / paid row from `premium_access`. Paid rows have a real PayPal capture id. */
export function isPaidCaptureId(paypalCaptureId: string | null | undefined): boolean {
  if (!paypalCaptureId) return false
  // Server-granted trials may be stamped with "trial" / "trial:…" so we never
  // confuse them with a real PayPal capture.
  if (paypalCaptureId === 'trial' || paypalCaptureId.startsWith('trial:')) return false
  return true
}

export function snapshotFromPremiumRow(row: {
  expires_at?: string | null
  paypal_capture_id?: string | null
} | null): AccessSnapshot {
  if (!row?.expires_at) {
    return {
      hasAccess: false,
      isPaid: false,
      isTrial: false,
      source: 'none',
      expiresAt: null,
      daysLeft: null,
    }
  }
  const expiresAt = row.expires_at
  const active = new Date(expiresAt).getTime() > Date.now()
  const paid = isPaidCaptureId(row.paypal_capture_id)
  if (!active) {
    return {
      hasAccess: false,
      isPaid: false,
      isTrial: false,
      source: 'none',
      expiresAt,
      daysLeft: 0,
    }
  }
  return {
    hasAccess: true,
    isPaid: paid,
    isTrial: !paid,
    source: paid ? 'paid' : 'server_trial',
    expiresAt,
    daysLeft: daysRemaining(expiresAt),
  }
}

/** Ensure an anonymous local trial start timestamp exists; return ms epoch. */
export function ensureLocalTrialStarted(): number {
  if (typeof window === 'undefined') return Date.now()
  const existing = Number(localStorage.getItem(LOCAL_TRIAL_STARTED_KEY) || 0)
  if (existing > 0) return existing
  const now = Date.now()
  localStorage.setItem(LOCAL_TRIAL_STARTED_KEY, String(now))
  return now
}

export function readLocalTrialStarted(): number | null {
  if (typeof window === 'undefined') return null
  const existing = Number(localStorage.getItem(LOCAL_TRIAL_STARTED_KEY) || 0)
  return existing > 0 ? existing : null
}

export function localTrialExpiresAt(startedMs: number): Date {
  return new Date(startedMs + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000)
}

export function snapshotFromLocalTrial(startedMs: number | null): AccessSnapshot {
  if (!startedMs) {
    return {
      hasAccess: false,
      isPaid: false,
      isTrial: false,
      source: 'none',
      expiresAt: null,
      daysLeft: null,
    }
  }
  const expires = localTrialExpiresAt(startedMs)
  const expiresAt = expires.toISOString()
  const active = expires.getTime() > Date.now()
  return {
    hasAccess: active,
    isPaid: false,
    isTrial: active,
    source: active ? 'local_trial' : 'none',
    expiresAt,
    daysLeft: daysRemaining(expiresAt),
  }
}

/** Prefer server-side access when signed in; fall back to local trial for guests. */
export function mergeAccess(
  server: AccessSnapshot | null,
  local: AccessSnapshot | null,
  signedIn: boolean,
): AccessSnapshot {
  if (signedIn && server) {
    // Signed-in users are fully governed by the server row (including expired).
    return server
  }
  if (local?.hasAccess) return local
  if (server?.hasAccess) return server
  return (
    server ??
    local ?? {
      hasAccess: false,
      isPaid: false,
      isTrial: false,
      source: 'none',
      expiresAt: null,
      daysLeft: null,
    }
  )
}
