'use client'

import { useEffect, useState } from 'react'

export const OPEN_CHECK_PATENT_EVENT = 'patent-analytics:open-check-patent'

type Status = 'closed' | 'open' | 'submitting' | 'found' | 'pending' | 'error'

export default function CheckPatentModal() {
  const [status, setStatus] = useState<Status>('closed')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [form, setForm] = useState({ patentNumber: '', email: '', name: '' })

  useEffect(() => {
    const open = () => setStatus('open')
    window.addEventListener(OPEN_CHECK_PATENT_EVENT, open)
    return () => window.removeEventListener(OPEN_CHECK_PATENT_EVENT, open)
  }, [])

  if (status === 'closed') return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg(null)
    try {
      const res = await fetch('/api/patent-analytics/check-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Something went wrong.')
      if (data.found) {
        setResultUrl(data.url)
        setStatus('found')
      } else {
        setMessage(data.message)
        setStatus('pending')
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong — please try again.')
      setStatus('error')
    }
  }

  function close() {
    setStatus('closed')
    setResultUrl(null)
    setMessage(null)
    setForm({ patentNumber: '', email: '', name: '' })
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.35)', backdropFilter: 'blur(4px)' }}
      onClick={close}
    >
      <div
        className="pa-glass pa-glass-elevated w-full max-w-md p-8 relative"
        style={{ background: 'var(--surface-bright)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 text-lg"
          style={{ color: 'var(--on-surface-muted)' }}
        >
          ✕
        </button>

        {status === 'found' && resultUrl ? (
          <div>
            <h2 className="pa-display text-2xl font-bold mb-2">Good news — we already have this one</h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>
              {form.patentNumber} has already been screened and auto-verified.
            </p>
            <a href={resultUrl} className="pa-btn-primary text-base font-semibold px-6 py-3.5 inline-block w-full text-center">
              View the result →
            </a>
          </div>
        ) : status === 'pending' && message ? (
          <div>
            <h2 className="pa-display text-2xl font-bold mb-2">We don&rsquo;t have this one yet</h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>
              {message}
            </p>
            <p className="text-sm" style={{ color: 'var(--on-surface-muted)' }}>
              We&rsquo;ll send the full results to <b>{form.email}</b> as soon as it&rsquo;s ready.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="pa-display text-2xl font-bold mb-2">Instant Compound Check</h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>
              Enter a patent number — if we&rsquo;ve already screened it, you&rsquo;ll see the result immediately.
              If not, we&rsquo;ll run it and email you within 1 hour.
            </p>
            <div className="flex flex-col gap-3 mb-5">
              <input
                required
                placeholder="Patent number (e.g. US7314938B2)"
                value={form.patentNumber}
                onChange={(e) => setForm({ ...form, patentNumber: e.target.value })}
                className="text-base px-4 py-3 rounded-lg outline-none"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
              />
              <input
                required
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="text-base px-4 py-3 rounded-lg outline-none"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
              />
              <input
                placeholder="Name (optional)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="text-base px-4 py-3 rounded-lg outline-none"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
              />
            </div>
            {status === 'error' && errorMsg && (
              <p className="text-sm mb-4" style={{ color: '#ba1a1a' }}>{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="pa-btn-primary text-base font-semibold px-6 py-3.5 w-full disabled:opacity-60"
            >
              {status === 'submitting' ? 'Checking…' : 'Check this patent →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
