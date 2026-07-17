'use client'

import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { useAuth } from './AuthProvider'
import { signInWithGoogle } from '@/lib/googleAuth'
import PayPalButton from './PayPalButton'
import {
  ACCESS_PRICE_USD,
  FREE_TRIAL_DAYS,
  formatAccessChargeAmount,
  trialHeadline,
} from '@/lib/pricing'

const DISMISS_KEY = 'access-popup-dismissed-until'
const DISMISS_DAYS = 3

/**
 * Corner upsell — shown to visitors whose free trial is ending soon or already
 * over, and who have not paid. Hidden entirely inside the native app shell
 * (App Store rules forbid external payment links for in-app unlock).
 */
export default function AdFreePopup() {
  const { user, session, access } = useAuth()
  const [dismissed, setDismissed] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const until = Number(localStorage.getItem(DISMISS_KEY) || 0)
    setDismissed(Date.now() < until)
  }, [])

  if (Capacitor.isNativePlatform()) return null
  if (access.loading || dismissed) return null
  // Don't nag paid users or people early in a healthy trial.
  if (access.isPaid) return null
  if (access.hasAccess && access.isTrial && (access.daysLeft ?? 99) > 5) return null

  const trialEnded = !access.hasAccess
  const trialEnding = access.isTrial && (access.daysLeft ?? 0) <= 5

  if (!trialEnded && !trialEnding) return null

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000))
    setDismissed(true)
  }

  async function handleSignIn() {
    setBusy(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in with Google.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed right-4 z-40 max-w-[300px] bg-[#150c1c] border border-white/10 rounded-2xl shadow-2xl p-4"
      style={{ top: 'calc(5rem + var(--safe-top))' }}
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors text-sm"
      >
        ✕
      </button>
      <p className="text-sm font-bold text-white pr-5 mb-1">
        {trialEnded ? 'Your free trial ended' : `${access.daysLeft} day${access.daysLeft === 1 ? '' : 's'} left free`}
      </p>
      <p className="text-xs text-gray-400 mb-3 leading-relaxed">
        Keep every lab, practice set, and ebook for ${ACCESS_PRICE_USD}/year after your{' '}
        {FREE_TRIAL_DAYS}-day free trial.
      </p>
      {error && <p className="text-red-400 text-[11px] mb-2">{error}</p>}
      {!user || !session ? (
        <button
          type="button"
          onClick={handleSignIn}
          disabled={busy}
          className="inline-block bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
        >
          {busy ? 'Please wait…' : 'Sign in with Google →'}
        </button>
      ) : (
        <PayPalButton label={`Unlock · $${ACCESS_PRICE_USD}/year`} />
      )}
      <p className="text-[10px] text-gray-500 mt-2">
        Charged as {formatAccessChargeAmount()} · {trialHeadline()}
      </p>
    </div>
  )
}
