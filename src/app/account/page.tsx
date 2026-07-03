'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { signInWithGoogle } from '@/lib/googleAuth'
import { useAuth } from '../AuthProvider'

// Monetization is paused for now — everything on TheChemSolver is free,
// including inside the native app. This page just offers Google sign-in.
// To bring back the $15/year ad-free purchase later, see docs/RAZORPAY_SETUP.md.
export default function AccountPage() {
  const { user, loading } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogleSignIn() {
    setBusy(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in with Google.')
      setBusy(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <Shell><p className="text-gray-400 text-sm">Loading…</p></Shell>
  }

  if (!user) {
    return (
      <Shell>
        <h1 className="text-xl font-bold mb-1">Sign in</h1>
        <p className="text-sm text-gray-400 mb-6">
          Everything on TheChemSolver is free — signing in with Google is optional.
        </p>
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        <button
          onClick={handleGoogleSignIn} disabled={busy}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 text-sm font-semibold rounded-lg px-4 py-3 transition-colors"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </Shell>
    )
  }

  return (
    <Shell>
      <h1 className="text-xl font-bold mb-1">Your account</h1>
      <p className="text-sm text-gray-400 mb-6">{user.email}</p>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <p className="text-sm text-gray-300">Everything on TheChemSolver is free right now — enjoy!</p>
      </div>

      <button onClick={handleSignOut} className="text-xs text-gray-400 hover:text-white mt-6 underline">
        Sign out
      </button>
    </Shell>
  )
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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08020d] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
