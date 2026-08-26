'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import {
  type AccessSnapshot,
  ensureLocalTrialStarted,
  mergeAccess,
  readLocalTrialStarted,
  snapshotFromLocalTrial,
  snapshotFromPremiumRow,
} from '@/lib/access'

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  /** Combined paid / server-trial / anonymous local-trial status. */
  access: AccessSnapshot & { loading: boolean }
  /**
   * @deprecated Prefer `access`. Kept so older components that only checked
   * ad-free/premium keep compiling during the freemium cutover.
   */
  premium: {
    isPremium: boolean
    expiresAt: string | null
    loading: boolean
  }
  refreshAccess: () => Promise<void>
  /** @deprecated alias of refreshAccess */
  refreshPremium: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const EMPTY_ACCESS: AccessSnapshot = {
  hasAccess: false,
  isPaid: false,
  isTrial: false,
  source: 'none',
  expiresAt: null,
  daysLeft: null,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [access, setAccess] = useState<AccessSnapshot & { loading: boolean }>({
    ...EMPTY_ACCESS,
    loading: true,
  })

  const fetchAccess = useCallback(async (sess: Session | null) => {
    const localStarted = typeof window !== 'undefined' ? readLocalTrialStarted() : null
    const localSnap = snapshotFromLocalTrial(localStarted)

    if (!sess?.user) {
      // Guests: start/continue anonymous local trial on first access check.
      // Tools themselves also call ensureLocalTrialStarted when opened.
      setAccess({ ...mergeAccess(null, localSnap, false), loading: false })
      return
    }

    // Signed-in: read premium_access, then ensure a server trial exists if new.
    const { data } = await supabase
      .from('premium_access')
      .select('expires_at, paypal_capture_id')
      .eq('user_id', sess.user.id)
      .maybeSingle()

    let serverSnap = snapshotFromPremiumRow(
      data as { expires_at: string; paypal_capture_id: string | null } | null,
    )

    // Bootstrap server trial once (idempotent). Only if no row yet.
    // Pass local trial start so signing in continues the same 15-day clock
    // (no fresh 15 days after browsing as a guest).
    if (!data) {
      try {
        const res = await fetch('/api/access/ensure-trial', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sess.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            localTrialStartedAt: localStarted ?? undefined,
          }),
        })
        if (res.ok) {
          const body = await res.json()
          serverSnap = {
            hasAccess: !!body.hasAccess,
            isPaid: !!body.isPaid,
            isTrial: !!body.isTrial,
            source: body.source ?? (body.isPaid ? 'paid' : body.hasAccess ? 'server_trial' : 'none'),
            expiresAt: body.expiresAt ?? null,
            daysLeft: body.daysLeft ?? null,
          }
        }
      } catch (err) {
        console.warn('[auth] ensure-trial failed', err)
      }
    }

    setAccess({ ...mergeAccess(serverSnap, localSnap, true), loading: false })
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
      fetchAccess(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      fetchAccess(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [fetchAccess])

  // Kick off anonymous local trial early so the clock starts on first visit,
  // not only when a gated tool is opened (explore-first, but time-bounded).
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (session) return
    ensureLocalTrialStarted()
    // Recompute once local trial key is planted.
    fetchAccess(null)
  }, [session, fetchAccess])

  const refreshAccess = useCallback(async () => {
    setAccess((prev) => ({ ...prev, loading: true }))
    await fetchAccess(session)
  }, [fetchAccess, session])

  const isPremium = access.hasAccess // trial or paid both unlock tools

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        access,
        premium: {
          isPremium,
          expiresAt: access.expiresAt,
          loading: access.loading,
        },
        refreshAccess,
        refreshPremium: refreshAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
