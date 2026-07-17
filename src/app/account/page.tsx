'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { signInWithGoogle } from '@/lib/googleAuth'
import PayPalButton from '../PayPalButton'
import {
  ACCESS_PRICE_USD,
  FREE_TRIAL_DAYS,
  formatAccessChargeAmount,
  trialHeadline,
} from '@/lib/pricing'
import { useAuth } from '../AuthProvider'
import GoogleIcon from '../components/GoogleIcon'

export default function AccountPage() {
  const { user, session, loading, access, refreshAccess } = useAuth()
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
          Create a free account to start your {FREE_TRIAL_DAYS}-day trial of every lab, practice set,
          and ebook. After that it&apos;s ${ACCESS_PRICE_USD}/year.
        </p>
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        <button
          onClick={handleGoogleSignIn} disabled={busy}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 text-sm font-semibold rounded-lg px-4 py-3 transition-colors"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <p className="text-[11px] text-gray-500 mt-4 text-center">{trialHeadline()}</p>
      </Shell>
    )
  }

  return (
    <Shell>
      <h1 className="text-xl font-bold mb-1">Your account</h1>
      <p className="text-sm text-gray-400 mb-6">{user.email}</p>

      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

      {access.loading ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-sm text-gray-300">Checking your plan…</p>
        </div>
      ) : access.isPaid ? (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-5">
          <p className="text-sm font-semibold text-purple-300 mb-1">✓ Full access</p>
          <p className="text-xs text-gray-400">
            {access.expiresAt && `Active until ${new Date(access.expiresAt).toLocaleDateString()}`}
          </p>
        </div>
      ) : access.isTrial && access.hasAccess ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
          <p className="text-sm font-semibold text-emerald-300 mb-1">
            Free trial · {access.daysLeft ?? '—'} day{(access.daysLeft ?? 0) === 1 ? '' : 's'} left
          </p>
          <p className="text-xs text-gray-400 mb-4">
            {access.expiresAt &&
              `Trial ends ${new Date(access.expiresAt).toLocaleDateString()}. Then ${ACCESS_PRICE_USD}/year keeps everything unlocked.`}
          </p>
          <PayPalButton label={`Unlock early · $${ACCESS_PRICE_USD}/year`} />
          <p className="text-[10px] text-gray-500 mt-2 text-center">
            Charged as {formatAccessChargeAmount()} at checkout (incl. processing).
          </p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-1">Trial ended</p>
          <p className="text-xs text-gray-400 mb-4">
            Unlock every lab, practice set, and ebook for ${ACCESS_PRICE_USD}/year.
          </p>
          {session ? (
            <>
              <PayPalButton label={`Unlock · $${ACCESS_PRICE_USD}/year`} />
              <p className="text-[10px] text-gray-500 mt-2 text-center">
                Charged as {formatAccessChargeAmount()} at checkout. Pay with the same email as your
                Google sign-in — access unlocks automatically within a minute.
              </p>
              <button
                type="button"
                onClick={() => refreshAccess()}
                className="block mx-auto mt-3 text-xs text-purple-300 hover:text-white underline"
              >
                I&apos;ve paid — check again
              </button>
            </>
          ) : null}
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
