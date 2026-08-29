import { createHmac, timingSafeEqual } from 'crypto'

// Single-admin auth (Prashant is the only user) -- a full auth system
// (accounts, roles, password reset) would be over-scoped for a one-person
// dashboard, so this is a plain HMAC-signed, expiring session token stored
// in an httpOnly cookie. No new npm dependency: Node's built-in `crypto`
// is enough for "prove you know the admin password, then stay logged in
// for a while."
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export const ADMIN_SESSION_COOKIE = 'pa_admin_session'

function hmac(payload: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set')
  return createHmac('sha256', secret).update(payload).digest('hex')
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.PATENT_ANALYTICS_ADMIN_PASSWORD
  if (!expected || !password) return false
  const a = Buffer.from(password)
  const b = Buffer.from(expected)
  // Constant-time compare -- this gates a real admin dashboard with every
  // CTA submission on it, not worth a timing side-channel over a strcmp.
  return a.length === b.length && timingSafeEqual(a, b)
}

export function signSession(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS
  return `${expiresAt}.${hmac(String(expiresAt))}`
}

export function verifySession(token: string | undefined | null): boolean {
  if (!token) return false
  const [expiresAtRaw, sig] = token.split('.')
  const expiresAt = Number(expiresAtRaw)
  if (!expiresAtRaw || !sig || Number.isNaN(expiresAt)) return false
  if (Date.now() > expiresAt) return false
  const expectedSig = hmac(expiresAtRaw)
  const a = Buffer.from(sig)
  const b = Buffer.from(expectedSig)
  return a.length === b.length && timingSafeEqual(a, b)
}
