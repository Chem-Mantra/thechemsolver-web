'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { signInWithGoogle } from '@/lib/googleAuth'
import PayPalButton from '../PayPalButton'
import { AD_FREE_PRICE_USD, formatAdFreeChargeAmount } from '@/lib/pricing'
import { useAuth } from '../AuthProvider'
import GoogleIcon from '../components/GoogleIcon'

export default function AccountPage() {
  const { user, session, loading, premium } = useAuth()
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

      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

      {premium.loading ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-sm text-gray-300">Checking your plan…</p>
        </div>
      ) : premium.isPremium ? (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-5">
          <p className="text-sm font-semibold text-purple-300 mb-1">✓ Ad-free</p>
          <p className="text-xs text-gray-400">
            {premium.expiresAt && `Active until ${new Date(premium.expiresAt).toLocaleDateString()}`}
          </p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-1">Go ad-free</p>
          <p className="text-xs text-gray-400 mb-4">
            Support the project — ${AD_FREE_PRICE_USD} for a full year, no ads anywhere on the site.
          </p>
          <PayPalButton />
          <p className="text-[10px] text-gray-500 mt-2 text-center">
            Charged as {formatAdFreeChargeAmount()} at checkout (incl. payment processing fee). Pay with the
            same email as your Google sign-in — access unlocks automatically within a minute, and you&apos;ll
            get an email confirmation.
          </p>
        </div>
      )}

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
