'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { signInWithGoogle } from '@/lib/googleAuth'

// One free run per signed-in account (enforced server-side in
// create-request by requester_email already having any prior row) --
// Google sign-in first, same reused auth as GatedDownloadButton, so the
// email backing that free-run check is a real verified identity, not
// whatever a client types into a plain text field.
export default function NewestPatentsForm() {
  const [user, setUser] = useState<{ email: string; name: string } | null | undefined>(undefined)
  const [patentNumber, setPatentNumber] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submittedId, setSubmittedId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ? { email: u.email ?? '', name: (u.user_metadata?.full_name as string) ?? '' } : null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user
      setUser(u ? { email: u.email ?? '', name: (u.user_metadata?.full_name as string) ?? '' } : null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user?.email || !patentNumber.trim()) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/patent-analytics/newest-patents/create-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patentNumber: patentNumber.trim(), email: user.email, name: user.name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Could not start your request.')
      setSubmittedId(data.requestId as string)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start your request.')
    } finally {
      setBusy(false)
    }
  }

  if (submittedId) {
    return (
      <div className="pa-glass p-8 text-center">
        <h2 className="pa-display text-xl font-bold mb-3" style={{ color: 'var(--on-surface)' }}>
          Processing -- you can close this tab
        </h2>
        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--on-surface-variant)' }}>
          We&rsquo;re extracting structures from <b>{patentNumber.trim()}</b> now. This typically takes up to
          30 minutes. We&rsquo;ll email <b>{user?.email}</b> a link to your result the moment it&rsquo;s ready --
          you don&rsquo;t need to wait here.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/patent-analytics/newest-patents/results/${submittedId}`)}
          className="pa-btn-primary text-sm font-semibold px-5 py-3 inline-block"
        >
          Or check status now →
        </button>
      </div>
    )
  }

  return (
    <div className="pa-glass p-8">
      {user === undefined ? (
        <p className="text-sm" style={{ color: 'var(--on-surface-muted)' }}>Loading…</p>
      ) : !user ? (
        <div className="text-center">
          <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--on-surface-variant)' }}>
            Sign in with Google to run your one free extraction. We use this only to verify you&rsquo;re a real
            person and to email you the result -- see below for what happens after that.
          </p>
          <button type="button" onClick={handleSignIn} disabled={busy} className="pa-btn-primary text-base font-semibold px-6 py-3.5 disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in with Google →'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            Signed in as <b>{user.email}</b>
          </p>
          <input
            required
            placeholder="Patent number (e.g. US12698261B2)"
            value={patentNumber}
            onChange={(e) => setPatentNumber(e.target.value)}
            disabled={busy}
            className="text-base px-4 py-3 rounded-lg outline-none disabled:opacity-60"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
          />
          {error && <p className="text-sm" style={{ color: '#ba1a1a' }}>{error}</p>}
          <button type="submit" disabled={busy || !patentNumber.trim()} className="pa-btn-primary text-base font-semibold px-6 py-3.5 disabled:opacity-60">
            {busy ? 'Starting…' : 'Run free extraction →'}
          </button>
          <p className="text-xs" style={{ color: 'var(--on-surface-muted)' }}>
            One free run per account. If we can&rsquo;t confirm a clean structure, you&rsquo;ll see the full result
            for free with an option to escalate to human review. If we do, unlocking the download is $15.
          </p>
        </form>
      )}
    </div>
  )
}
