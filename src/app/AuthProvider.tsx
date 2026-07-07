'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type PremiumStatus = {
  isPremium: boolean
  expiresAt: string | null
  loading: boolean
}

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  premium: PremiumStatus
  refreshPremium: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [premium, setPremium] = useState<PremiumStatus>({ isPremium: false, expiresAt: null, loading: true })

  const fetchPremium = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setPremium({ isPremium: false, expiresAt: null, loading: false })
      return
    }
    // premium_access RLS policy restricts this to the caller's own row —
    // see docs/PAYPAL_SETUP.md for the exact SQL.
    const { data } = await supabase.from('premium_access').select('expires_at').eq('user_id', userId).maybeSingle()
    const expiresAt = (data as { expires_at: string } | null)?.expires_at ?? null
    const isPremium = !!expiresAt && new Date(expiresAt).getTime() > Date.now()
    setPremium({ isPremium, expiresAt, loading: false })
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
      fetchPremium(data.session?.user.id)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      fetchPremium(newSession?.user.id)
    })

    return () => listener.subscription.unsubscribe()
  }, [fetchPremium])

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        premium,
        refreshPremium: () => fetchPremium(session?.user.id),
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
