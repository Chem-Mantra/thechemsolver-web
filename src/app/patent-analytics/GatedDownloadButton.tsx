'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { signInWithGoogle } from '@/lib/googleAuth'

/**
 * Downloads are free, but require a Google sign-in first -- this is the
 * lead-generation mechanism: we don't get the download data, but we do get
 * to know who's interested. Reuses the same Supabase Google auth already
 * wired up site-wide (signInWithGoogle), not a new auth system.
 */
export default function GatedDownloadButton({
  filename,
  data,
  className,
  children,
}: {
  filename: string
  data: Record<string, unknown>
  className: string
  children: React.ReactNode
}) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setSignedIn(!!user))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function handleClick() {
    if (!signedIn) {
      setBusy(true)
      setError(null)
      try {
        await signInWithGoogle()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not sign in with Google.')
        setBusy(false)
      }
      return
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={busy || signedIn === null} className={className}>
        {busy ? 'Signing in…' : signedIn ? children : 'Sign in with Google to download →'}
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  )
}
