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
import { ensureLocalTrialStarted } from '@/lib/access'

/**
 * Soft-paywall around interactive tools (labs, practice, ebooks).
 *
 * - During free trial (local anonymous or signed-in server trial): children render.
 * - After trial without payment: full overlay with sign-in + PayPal.
 * - SEO chrome outside this component stays crawlable.
 */
export default function AccessGate({
  children,
  title = 'Continue with full access',
}: {
  children: React.ReactNode
  title?: string
}) {
  const { user, session, loading, access, refreshAccess } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localReady, setLocalReady] = useState(false)

  // Plant the anonymous trial clock the first time a gated tool is opened.
  useEffect(() => {
    ensureLocalTrialStarted()
    setLocalReady(true)
    if (!user) {
      // Refresh so AuthProvider picks up the local trial start.
      void refreshAccess()
    }
  }, [user, refreshAccess])

  if (loading || access.loading || !localReady) {
    return (
      <div className="min-h-[240px] flex items-center justify-center text-sm text-gray-400">
        Loading tools…
      </div>
    )
  }

  if (access.hasAccess) {
    return (
      <>
        {access.isTrial && access.daysLeft != null && access.daysLeft <= 5 && (
          <TrialNudge daysLeft={access.daysLeft} signedIn={!!user} />
        )}
        {children}
      </>
    )
  }

  // Trial over (or never started) — paywall.
  return (
    <div className="relative min-h-[320px]">
      <div className="pointer-events-none select-none opacity-30 blur-[1px]" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-[#060610]/75 backdrop-blur-sm">
        <div className="w-full max-w-md bg-[#150c1c] border border-white/10 rounded-2xl shadow-2xl p-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-300 mb-2">
            Free trial ended
          </p>
          <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            You had {FREE_TRIAL_DAYS} free days to explore every lab, practice set, and ebook.
            Unlock a full year of access for <strong className="text-white">${ACCESS_PRICE_USD}</strong>.
          </p>

          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

          {!user || !session ? (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true)
                  setError(null)
                  try {
                    await signInWithGoogle()
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Could not sign in with Google.')
                    setBusy(false)
                  }
                }}
                className="w-full bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 text-sm font-semibold rounded-lg px-4 py-3 transition-colors mb-3"
              >
                {busy ? 'Please wait…' : 'Sign in with Google to continue'}
              </button>
              <p className="text-[11px] text-gray-500">
                Sign-in is free. New accounts get a {FREE_TRIAL_DAYS}-day trial automatically if you
                haven&apos;t used one yet — otherwise you&apos;ll see checkout next.
              </p>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-3">
                Signed in as <strong className="text-white">{user.email}</strong>
              </p>
              {/* Native app: no external payment link (App Store rules). Web only. */}
              {Capacitor.isNativePlatform() ? (
                <p className="text-sm text-gray-300 leading-relaxed">
                  Open <strong className="text-white">thechemsolver.com/account</strong> in a browser,
                  pay with this same Google email, then come back and refresh.
                </p>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <PayPalButton label={`Unlock for $${ACCESS_PRICE_USD}/year`} />
                  <p className="text-[10px] text-gray-500">
                    Charged as {formatAccessChargeAmount()} (incl. processing). Pay with the same email
                    as Google sign-in.
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={() => refreshAccess()}
                className="mt-4 text-xs text-purple-300 hover:text-white underline"
              >
                I&apos;ve paid — check again
              </button>
            </>
          )}

          <p className="text-[10px] text-gray-600 mt-4">{trialHeadline()}</p>
        </div>
      </div>
    </div>
  )
}

function TrialNudge({ daysLeft, signedIn }: { daysLeft: number; signedIn: boolean }) {
  return (
    <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100 flex flex-wrap items-center justify-between gap-2">
      <span>
        Free trial: <strong>{daysLeft}</strong> day{daysLeft === 1 ? '' : 's'} left
        {!signedIn && ' · sign in to save progress across devices'}
      </span>
      {signedIn && (
        <a href="/account" className="font-semibold text-amber-200 hover:text-white underline">
          Upgrade · ${ACCESS_PRICE_USD}/yr
        </a>
      )}
    </div>
  )
}
