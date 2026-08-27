'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { signInWithGoogle } from '@/lib/googleAuth'
import { buildReportPdf } from './pdfReport'

/**
 * Downloads are free, but require a Google sign-in first -- this is the
 * lead-generation mechanism: we don't get the download data, but we do get
 * to know who's interested. Reuses the same Supabase Google auth already
 * wired up site-wide (signInWithGoogle), not a new auth system.
 *
 * Offers a PDF/JSON choice once signed in, rather than a single fixed
 * format -- PDF is generated client-side (jsPDF, generic JSON walker, see
 * pdfReport.ts), no server round-trip.
 */
export default function GatedDownloadButton({
  filenameBase,
  title,
  subtitle,
  data,
  className,
  children,
}: {
  filenameBase: string
  title: string
  subtitle: string
  data: Record<string, unknown>
  className: string
  children: React.ReactNode
}) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showChoice, setShowChoice] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setSignedIn(!!user))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!showChoice) return
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setShowChoice(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [showChoice])

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
    setShowChoice((v) => !v)
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filenameBase}.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowChoice(false)
  }

  function downloadPdf() {
    const doc = buildReportPdf(title, subtitle, data)
    doc.save(`${filenameBase}.pdf`)
    setShowChoice(false)
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <button type="button" onClick={handleClick} disabled={busy || signedIn === null} className={className}>
        {busy ? 'Signing in…' : signedIn ? children : 'Sign in with Google to download →'}
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      {showChoice && (
        <div
          className="pa-glass pa-glass-elevated absolute left-0 top-full mt-2 p-2 z-20 flex flex-col gap-1 min-w-[180px]"
        >
          <button
            type="button"
            onClick={downloadPdf}
            className="text-left text-sm px-3 py-2 rounded-md hover:bg-black/[0.04] transition-colors"
            style={{ color: 'var(--on-surface)' }}
          >
            Download as PDF
          </button>
          <button
            type="button"
            onClick={downloadJson}
            className="text-left text-sm px-3 py-2 rounded-md hover:bg-black/[0.04] transition-colors"
            style={{ color: 'var(--on-surface)' }}
          >
            Download as JSON
          </button>
        </div>
      )}
    </div>
  )
}
