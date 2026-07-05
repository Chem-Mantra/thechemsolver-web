'use client'

import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { useAuth } from './AuthProvider'
import { signInWithGoogle } from '@/lib/googleAuth'
import { openRazorpayCheckout } from '@/lib/razorpayCheckout'
import { AD_FREE_PRICE_USD, formatAdFreeChargeAmount } from '@/lib/pricing'

const DISMISS_KEY = 'adfree-popup-dismissed-until'
const DISMISS_DAYS = 7

export default function AdFreePopup() {
  const { user, session, premium, refreshPremium } = useAuth()
  const [dismissed, setDismissed] = useState(true) // start hidden until we've checked localStorage, avoids a flash
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const until = Number(localStorage.getItem(DISMISS_KEY) || 0)
    setDismissed(Date.now() < until)
  }, [])

  // The purchase flow is website-only: Apple's guidelines don't allow an app
  // to sell/unlock a feature used within the app via an external payment
  // link, so the app never shows or links to this popup at all. Premium
  // status (granted on the web) still applies inside the app automatically,
  // since it's read from the same signed-in Supabase account.
  if (Capacitor.isNativePlatform()) return null
  if (premium.loading || premium.isPremium || dismissed) return null

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000))
    setDismissed(true)
  }

  async function handleGoAdFree() {
    setBusy(true)
    setError(null)
    try {
      if (!user || !session) {
        // Not signed in yet — sign in first, then land back here to finish.
        await signInWithGoogle()
        return
      }
      await openRazorpayCheckout(session.access_token)
      await refreshPremium()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start checkout.')
    } finally {
      setBusy(false)
    }
  }

  return (
    // top offset clears the sticky nav bar (which also has top-right controls,
    // e.g. the mobile hamburger button) — sits just below it instead of on
    // top of it, with a safe-area fallback for installed-PWA use.
    <div
      className="fixed right-4 z-40 max-w-[280px] bg-[#150c1c] border border-white/10 rounded-2xl shadow-2xl p-4"
      style={{ top: 'calc(5rem + var(--safe-top))' }}
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors text-sm"
      >
        ✕
      </button>
      <p className="text-sm font-bold text-white pr-5 mb-1">Go ad-free</p>
      <p className="text-xs text-gray-400 mb-3 leading-relaxed">
        Support the project — ${AD_FREE_PRICE_USD}, ad-free access for a full year.
      </p>
      {error && <p className="text-red-400 text-[11px] mb-2">{error}</p>}
      <button
        type="button"
        onClick={handleGoAdFree}
        disabled={busy}
        className="inline-block bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
      >
        {busy ? 'Please wait…' : `Go ad-free — $${AD_FREE_PRICE_USD}/yr →`}
      </button>
      <p className="text-[10px] text-gray-500 mt-2">
        Charged as {formatAdFreeChargeAmount()} at checkout (incl. payment processing fee)
      </p>
    </div>
  )
}
