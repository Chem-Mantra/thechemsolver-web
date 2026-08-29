'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import type { PayPalButtonsInstance, PayPalSubscriptionActions } from './paypalTypes'
import './paypalTypes' // side-effect import: brings the shared `declare global { Window.paypal }` into scope

export const OPEN_RETAINER_EVENT = 'patent-analytics:open-retainer'

type Status = 'closed' | 'open' | 'activating' | 'done' | 'error'

// PayPal JS SDK loaded with intent=subscription (a different SDK mode than
// CheckPatentModal's intent=capture -- subscriptions and one-time captures
// are separate PayPal integrations, can't share one script load). The plan
// itself (fixed $999/mo, id below) was created once via PayPal's Billing
// Plans API -- see create-subscription/route.ts's docstring for why a
// pending DB row's own id, not the form data itself, gets embedded as the
// subscription's custom_id.
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
const RETAINER_PLAN_ID = 'P-6UH133924X797384GNKJKGLA'

export default function RetainerModal() {
  const [status, setStatus] = useState<Status>('closed')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [sdkReady, setSdkReady] = useState(false)
  const [form, setForm] = useState({ company: '', email: '', name: '', patents: '', compounds: '' })

  const formRef = useRef(form)
  formRef.current = form

  const buttonsContainerRef = useRef<HTMLDivElement>(null)
  const buttonsInstanceRef = useRef<PayPalButtonsInstance | null>(null)

  useEffect(() => {
    const open = () => setStatus('open')
    window.addEventListener(OPEN_RETAINER_EVENT, open)
    return () => window.removeEventListener(OPEN_RETAINER_EVENT, open)
  }, [])

  useEffect(() => {
    if (!sdkReady || status !== 'open' || !window.paypal || !buttonsContainerRef.current) return

    const instance = window.paypal.Buttons({
      style: { layout: 'vertical', color: 'blue', label: 'subscribe', height: 45 },
      createSubscription: async (_data, actions) => {
        const { company, email, name, patents, compounds } = formRef.current
        const seedPatents = patents.split(/[,\n]/).map((p) => p.trim()).filter(Boolean)
        const compoundList = compounds.split(/[,\n]/).map((c) => c.trim()).filter(Boolean)
        if (!company.trim() || !email.trim() || (seedPatents.length === 0 && compoundList.length === 0)) {
          setErrorMsg('Company, email, and at least one patent number or compound are required.')
          throw new Error('Missing required fields')
        }
        setErrorMsg(null)
        const res = await fetch('/api/patent-analytics/retainer/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ company, email, name, seedPatents, compounds: compoundList }),
        })
        const data = await res.json()
        if (!res.ok || !data.pendingCustomerId) throw new Error(data?.error || 'Could not start signup.')
        return actions.subscription.create({ plan_id: RETAINER_PLAN_ID, custom_id: data.pendingCustomerId })
      },
      onApprove: async (data) => {
        setStatus('activating')
        setErrorMsg(null)
        try {
          const res = await fetch('/api/patent-analytics/retainer/verify-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscriptionID: data.subscriptionID }),
          })
          const result = await res.json()
          if (!res.ok) throw new Error(result?.error || 'Subscription succeeded but something went wrong.')
          setStatus('done')
        } catch (err) {
          setErrorMsg(err instanceof Error ? err.message : 'Something went wrong — please contact support, your subscription may have gone through.')
          setStatus('error')
        }
      },
      onError: (err) => {
        console.error('[RetainerModal] PayPal Buttons error', err)
        setErrorMsg('Something went wrong with PayPal — please try again.')
        setStatus('error')
      },
    })

    buttonsInstanceRef.current = instance
    instance.render('#pa-retainer-paypal-buttons')

    return () => {
      buttonsInstanceRef.current?.close()
      buttonsInstanceRef.current = null
    }
  }, [sdkReady, status])

  if (status === 'closed') return null

  function close() {
    setStatus('closed')
    setErrorMsg(null)
    setForm({ company: '', email: '', name: '', patents: '', compounds: '' })
  }

  return (
    <>
      {PAYPAL_CLIENT_ID && (
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`}
          strategy="lazyOnload"
          onLoad={() => setSdkReady(true)}
        />
      )}
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

          {status === 'done' ? (
            <div>
              <h2 className="pa-display text-2xl font-bold mb-2">You&rsquo;re subscribed</h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
                Your Portfolio Retainer is active. We&rsquo;re now monitoring your submitted patent(s) and will
                email you as soon as we find new matching filings. A confirmation is on its way to {form.email}.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="pa-display text-2xl font-bold mb-2">Portfolio Retainer — $999/mo</h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>
                Tell us which patent(s) and/or compound(s) to monitor. We&rsquo;ll re-check patent families and screen
                newly-published patents against your compounds on an ongoing basis, and email you the moment
                something new matches.
              </p>
              <div className="flex flex-col gap-3 mb-5">
                <input
                  required
                  placeholder="Firm / company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  disabled={status === 'activating'}
                  className="text-base px-4 py-3 rounded-lg outline-none disabled:opacity-60"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
                />
                <input
                  required
                  type="email"
                  placeholder="Work email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={status === 'activating'}
                  className="text-base px-4 py-3 rounded-lg outline-none disabled:opacity-60"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
                />
                <input
                  placeholder="Name (optional)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={status === 'activating'}
                  className="text-base px-4 py-3 rounded-lg outline-none disabled:opacity-60"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
                />
                <textarea
                  placeholder="Patent number(s) to monitor — one per line (e.g. US7314938B2)"
                  value={form.patents}
                  onChange={(e) => setForm({ ...form, patents: e.target.value })}
                  disabled={status === 'activating'}
                  rows={2}
                  className="text-base px-4 py-3 rounded-lg outline-none disabled:opacity-60 resize-none"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
                />
                <textarea
                  placeholder="Compound(s) to monitor for new matching patents — one per line, name or SMILES (optional)"
                  value={form.compounds}
                  onChange={(e) => setForm({ ...form, compounds: e.target.value })}
                  disabled={status === 'activating'}
                  rows={2}
                  className="text-base px-4 py-3 rounded-lg outline-none disabled:opacity-60 resize-none"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
                />
              </div>
              {errorMsg && (
                <p className="text-sm mb-4" style={{ color: '#ba1a1a' }}>{errorMsg}</p>
              )}
              {status === 'activating' ? (
                <p className="text-sm text-center py-3" style={{ color: 'var(--on-surface-muted)' }}>Activating your subscription…</p>
              ) : !PAYPAL_CLIENT_ID ? (
                <p className="text-sm" style={{ color: '#ba1a1a' }}>Payments aren&rsquo;t configured yet.</p>
              ) : (
                <div id="pa-retainer-paypal-buttons" ref={buttonsContainerRef} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
