'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { signInWithGoogle } from '@/lib/googleAuth'
import { useAuth } from '../AuthProvider'
import GoogleIcon from '../components/GoogleIcon'

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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08020d] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
