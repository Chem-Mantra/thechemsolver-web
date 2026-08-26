'use client'

import { useEffect, useState } from 'react'
import { OPEN_LEAD_FORM_EVENT } from './OpenLeadFormButton'

type Status = 'closed' | 'open' | 'submitting' | 'done' | 'error'

export default function LeadCaptureModal() {
  const [status, setStatus] = useState<Status>('closed')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', company: '', patentNumber: '' })

  useEffect(() => {
    const open = () => setStatus('open')
    window.addEventListener(OPEN_LEAD_FORM_EVENT, open)
    return () => window.removeEventListener(OPEN_LEAD_FORM_EVENT, open)
  }, [])

  if (status === 'closed') return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg(null)
    try {
      const res = await fetch('/api/patent-analytics/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Something went wrong.')
      setDownloadUrl(data.downloadUrl)
      setStatus('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong — please try again.')
      setStatus('error')
    }
  }

  function close() {
    setStatus('closed')
    setDownloadUrl(null)
    setForm({ name: '', email: '', company: '', patentNumber: '' })
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

        {status === 'done' && downloadUrl ? (
          <div>
            <h2 className="pa-display text-2xl font-bold mb-2">Your sample report is ready</h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>
              Thanks, {form.name.split(' ')[0] || 'there'} — here&rsquo;s a real structure-extraction
              report built from our pipeline, ready to download now.
            </p>
            <a
              href={downloadUrl}
              download
              className="pa-btn-primary text-base font-semibold px-6 py-3.5 inline-block w-full text-center"
            >
              Download sample report (.zip) →
            </a>
            <p className="text-sm mt-4" style={{ color: 'var(--on-surface-muted)' }}>
              We&rsquo;ll also follow up at {form.email} — happy to run a report on a
              patent specific to your practice if this one doesn&rsquo;t match what
              you need.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="pa-display text-2xl font-bold mb-2">Request a free sample report</h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>
              Tell us a bit about you, and get instant access to a real sample
              report — no cost, no obligation.
            </p>
            <div className="flex flex-col gap-3 mb-5">
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="text-base px-4 py-3 rounded-lg outline-none"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
              />
              <input
                required
                type="email"
                placeholder="Work email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="text-base px-4 py-3 rounded-lg outline-none"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
              />
              <input
                required
                placeholder="Firm / company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="text-base px-4 py-3 rounded-lg outline-none"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
              />
              <input
                placeholder="Patent number of interest (optional)"
                value={form.patentNumber}
                onChange={(e) => setForm({ ...form, patentNumber: e.target.value })}
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
              {status === 'submitting' ? 'Preparing your report…' : 'Get my free sample report →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
