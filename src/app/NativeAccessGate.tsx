'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Capacitor } from '@capacitor/core'
import { supabase } from '@/lib/supabase'
import { signInWithGoogle } from '@/lib/googleAuth'
import { useAuth } from './AuthProvider'

/**
 * Full-app access gate — native only. The website itself is unaffected
 * (free, with ads/upsell, for every browser visitor); this component only
 * renders `children` once the signed-in account is confirmed premium.
 *
 * This is a deliberately stricter pattern than the website's ads-only
 * gating — see docs/PAYPAL_SETUP.md for the App Store risk tradeoff.
 */
export default function NativeAccessGate({ children }: { children: React.ReactNode }) {
  const { user, loading, premium, refreshPremium } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  if (!Capacitor.isNativePlatform()) return <>{children}</>

  if (loading || premium.loading) {
    return (
      <GateShell>
        <p className="text-sm text-gray-400">Loading…</p>
      </GateShell>
    )
  }

  async function handleSignIn() {
    setBusy(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in with Google.')
      setBusy(false)
    }
  }

  async function handleCheckAgain() {
    setChecking(true)
    await refreshPremium()
    setChecking(false)
  }

  async function handleSwitchAccount() {
    await supabase.auth.signOut()
  }

  if (!user) {
    return (
      <GateShell>
        <h1 className="text-lg font-bold mt-2 mb-2">Sign in to continue</h1>
        <p className="text-sm text-gray-400 mb-6 max-w-xs">
          Use the same Google account you registered with at thechemsolver.com.
        </p>
        {error && <p className="text-red-400 text-xs mb-3 max-w-xs">{error}</p>}
        <button
          onClick={handleSignIn}
          disabled={busy}
          className="w-full max-w-xs flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 text-sm font-semibold rounded-lg px-4 py-3 transition-colors"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </GateShell>
    )
  }

  if (!premium.isPremium) {
    return (
      <GateShell>
        <h1 className="text-lg font-bold mt-2 mb-2">Access required</h1>
        <p className="text-sm text-gray-400 mb-1 max-w-xs">
          <strong className="text-white">{user.email}</strong> hasn&apos;t purchased access yet.
        </p>
        <p className="text-sm text-gray-400 mb-6 max-w-xs">
          Visit <strong className="text-white">thechemsolver.com</strong>, register and pay with this same Google
          account, then come back here and sign in again.
        </p>
        <button
          onClick={handleCheckAgain}
          disabled={checking}
          className="w-full max-w-xs bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg px-4 py-3 transition-colors mb-3"
        >
          {checking ? 'Checking…' : "I've paid — check again"}
        </button>
        <button onClick={handleSwitchAccount} className="text-xs text-gray-500 hover:text-white underline">
          Sign in with a different account
        </button>
      </GateShell>
    )
  }

  return <>{children}</>
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.05l3.02-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.95l3.02 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  )
}

function GateShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-[#08020d] text-white flex flex-col items-center justify-center px-6 text-center"
      style={{
        paddingTop: 'calc(1.5rem + var(--safe-top))',
        paddingBottom: 'calc(1.5rem + var(--safe-bottom))',
      }}
    >
      <Image src="/logo.png" alt="TheChemSolver" width={56} height={56} className="rounded-full mb-2" priority />
      {children}
    </div>
  )
}
