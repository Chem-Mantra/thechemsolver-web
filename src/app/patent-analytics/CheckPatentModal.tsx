'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import type { PayPalButtonsInstance } from './paypalTypes'
import './paypalTypes' // side-effect import: brings the shared `declare global { Window.paypal }` into scope
import type { CompoundCheckResult } from '@/lib/compoundCheckResult'

export const OPEN_CHECK_PATENT_EVENT = 'patent-analytics:open-check-patent'

type Mode = 'patent' | 'compound'
type Status = 'closed' | 'open' | 'capturing' | 'found' | 'pending' | 'compound-result' | 'error'

// PayPal JS SDK (Smart Buttons), not the dashboard Hosted Button used
// elsewhere in this app for the flat $15/yr product -- Hosted Buttons
// redirect to a new tab with no live confirmation, which can't deliver this
// product's "instant" promise. Buttons render inline; createOrder/onApprove
// round-trip through our own create-order/capture-order API routes, which
// do the actual PayPal Orders API calls and payment verification
// server-side (see those routes for why: never trust "I paid" from the client).
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

// Razorpay Checkout -- UPI/cards/netbanking for Indian customers, alongside
// PayPal above. Same server-verified pattern: razorpay-create-order embeds
// patentNumber/compound + email in the order's own `notes` (read back
// server-side at verify time, not re-trusted from the client), razorpay-verify
// checks the HMAC signature Razorpay's own handler returns before revealing
// anything.
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

type RazorpaySuccessResponse = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
type RazorpayInstance = { open: () => void }
type RazorpayGlobal = new (options: {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description: string
  prefill?: { email?: string; name?: string }
  theme?: { color?: string }
  handler: (response: RazorpaySuccessResponse) => void
  modal?: { ondismiss?: () => void }
}) => RazorpayInstance

declare global {
  interface Window {
    Razorpay?: RazorpayGlobal
  }
}

const TIER_LABEL: Record<string, string> = {
  LIKELY_SAME_SCAFFOLD: 'Likely same scaffold',
  RELATED_SCAFFOLD_REVIEW: 'Related scaffold',
}

function statusNote(status: string): string {
  switch (status) {
    case 'confirmed_no_patents':
      return 'no patents found for this exact structure'
    case 'too_many_to_list':
      return 'linked to many more patents than shown — likely a common structure'
    case 'unknown':
      return "couldn't check in time"
    default:
      return ''
  }
}

export default function CheckPatentModal() {
  const [mode, setMode] = useState<Mode>('patent')
  const [status, setStatus] = useState<Status>('closed')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [compoundResult, setCompoundResult] = useState<CompoundCheckResult | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [sdkReady, setSdkReady] = useState(false)
  const [razorpaySdkReady, setRazorpaySdkReady] = useState(false)
  const [razorpayBusy, setRazorpayBusy] = useState(false)
  const [form, setForm] = useState({ patentNumber: '', compound: '', email: '', name: '' })

  // PayPal's Buttons callbacks are set up once (on render) and must always
  // see the LATEST typed values/mode, not whatever was in state when the
  // button first rendered -- a plain closure would go stale the moment the
  // user edits a field or switches mode after the button's already on screen.
  const formRef = useRef(form)
  formRef.current = form
  const modeRef = useRef(mode)
  modeRef.current = mode

  const buttonsContainerRef = useRef<HTMLDivElement>(null)
  const buttonsInstanceRef = useRef<PayPalButtonsInstance | null>(null)

  useEffect(() => {
    const open = () => setStatus('open')
    window.addEventListener(OPEN_CHECK_PATENT_EVENT, open)
    return () => window.removeEventListener(OPEN_CHECK_PATENT_EVENT, open)
  }, [])

  // Render the PayPal Buttons once: when the SDK script has loaded AND the
  // modal is showing the payment form. Torn down on close so reopening the
  // modal doesn't stack duplicate button instances into the same container.
  useEffect(() => {
    if (!sdkReady || status !== 'open' || !window.paypal || !buttonsContainerRef.current) return

    const instance = window.paypal.Buttons({
      style: { layout: 'vertical', color: 'blue', label: 'pay', height: 45 },
      createOrder: async () => {
        const { patentNumber, compound, email } = formRef.current
        const isCompound = modeRef.current === 'compound'
        const value = isCompound ? compound : patentNumber
        if (!value.trim() || !email.trim()) {
          setErrorMsg(isCompound ? 'Enter your compound and email before paying.' : 'Enter a patent number and email before paying.')
          throw new Error('Missing required fields')
        }
        setErrorMsg(null)
        const endpoint = isCompound ? '/api/patent-analytics/check-payment/compound/create-order' : '/api/patent-analytics/check-payment/create-order'
        const payload = isCompound ? { compound: value, email } : { patentNumber: value, email }
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok || !data.orderID) throw new Error(data?.error || 'Could not start payment.')
        return data.orderID as string
      },
      onApprove: async (data) => {
        setStatus('capturing')
        setErrorMsg(null)
        const isCompound = modeRef.current === 'compound'
        try {
          const endpoint = isCompound ? '/api/patent-analytics/check-payment/compound/capture-order' : '/api/patent-analytics/check-payment/capture-order'
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID, name: formRef.current.name }),
          })
          const result = await res.json()
          if (!res.ok) throw new Error(result?.error || 'Payment succeeded but something went wrong.')
          if (isCompound) {
            setCompoundResult(result.result as CompoundCheckResult)
            setStatus('compound-result')
          } else if (result.found) {
            setResultUrl(result.url)
            setStatus('found')
          } else {
            setMessage(result.message)
            setStatus('pending')
          }
        } catch (err) {
          setErrorMsg(err instanceof Error ? err.message : 'Something went wrong — please contact support, your payment may have gone through.')
          setStatus('error')
        }
      },
      onError: (err) => {
        console.error('[CheckPatentModal] PayPal Buttons error', err)
        setErrorMsg('Something went wrong with PayPal — please try again.')
        setStatus('error')
      },
    })

    buttonsInstanceRef.current = instance
    instance.render('#pa-check-paypal-buttons')

    return () => {
      buttonsInstanceRef.current?.close()
      buttonsInstanceRef.current = null
    }
  }, [sdkReady, status])

  async function handleRazorpayClick() {
    const { patentNumber, compound, email, name } = formRef.current
    const isCompound = mode === 'compound'
    const value = isCompound ? compound : patentNumber
    if (!value.trim() || !email.trim()) {
      setErrorMsg(isCompound ? 'Enter your compound and email before paying.' : 'Enter a patent number and email before paying.')
      return
    }
    if (!window.Razorpay) {
      setErrorMsg('Payment is still loading — try again in a moment.')
      return
    }
    setErrorMsg(null)
    setRazorpayBusy(true)
    try {
      const createEndpoint = isCompound
        ? '/api/patent-analytics/check-payment/compound/razorpay-create-order'
        : '/api/patent-analytics/check-payment/razorpay-create-order'
      const payload = isCompound ? { compound: value, email } : { patentNumber: value, email }
      const orderRes = await fetch(createEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const order = await orderRes.json()
      if (!orderRes.ok || !order.orderId) throw new Error(order?.error || 'Could not start payment.')

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Patent Analytics',
        description: `Instant Compound Check: ${value}`,
        prefill: { email, name: name || undefined },
        theme: { color: '#0284c7' },
        handler: async (response) => {
          setStatus('capturing')
          try {
            const verifyEndpoint = isCompound
              ? '/api/patent-analytics/check-payment/compound/razorpay-verify'
              : '/api/patent-analytics/check-payment/razorpay-verify'
            const res = await fetch(verifyEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, name }),
            })
            const result = await res.json()
            if (!res.ok) throw new Error(result?.error || 'Payment succeeded but something went wrong.')
            if (isCompound) {
              setCompoundResult(result.result as CompoundCheckResult)
              setStatus('compound-result')
            } else if (result.found) {
              setResultUrl(result.url)
              setStatus('found')
            } else {
              setMessage(result.message)
              setStatus('pending')
            }
          } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Something went wrong — please contact support, your payment may have gone through.')
            setStatus('error')
          }
        },
        modal: { ondismiss: () => setRazorpayBusy(false) },
      })
      rzp.open()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not start payment.')
      setRazorpayBusy(false)
    }
  }

  if (status === 'closed') return null

  function close() {
    setStatus('closed')
    setResultUrl(null)
    setCompoundResult(null)
    setMessage(null)
    setErrorMsg(null)
    setForm({ patentNumber: '', compound: '', email: '', name: '' })
    setMode('patent')
  }

  return (
    <>
      {PAYPAL_CLIENT_ID && (
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`}
          strategy="lazyOnload"
          onLoad={() => setSdkReady(true)}
        />
      )}
      {RAZORPAY_KEY_ID && (
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
          onLoad={() => setRazorpaySdkReady(true)}
        />
      )}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: 'rgba(15, 23, 42, 0.35)', backdropFilter: 'blur(4px)' }}
        onClick={close}
      >
        <div
          className="pa-glass pa-glass-elevated w-full max-w-md p-8 relative max-h-[90vh] overflow-y-auto"
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
          ) : status === 'compound-result' && compoundResult ? (
            <div>
              <h2 className="pa-display text-2xl font-bold mb-2">Structural matches</h2>
              {compoundResult.status === 'unresolved' ? (
                <p className="text-base leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
                  We couldn&rsquo;t resolve <b>{form.compound}</b> to a known chemical structure. If you have a SMILES
                  string, try pasting that directly. We&rsquo;ve also emailed you this result.
                </p>
              ) : compoundResult.hits.length === 0 ? (
                <p className="text-base leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
                  No structurally similar compounds found in PubChem&rsquo;s index for <b>{form.compound}</b>. This
                  doesn&rsquo;t guarantee freedom to operate — it means this structure isn&rsquo;t among what PubChem&rsquo;s
                  patent cross-reference index covers. We&rsquo;ve also emailed you this result.
                </p>
              ) : (
                <div>
                  <p className="text-sm mb-4" style={{ color: 'var(--on-surface-variant)' }}>
                    Structural matches for <b>{form.compound}</b> — also emailed to {form.email}:
                  </p>
                  <div className="flex flex-col gap-2 mb-4">
                    {compoundResult.hits.map((h) => (
                      <div key={h.cid} className="pa-glass p-3 text-sm">
                        <div className="font-semibold mb-1">{TIER_LABEL[h.tier] || h.tier}</div>
                        <div style={{ color: 'var(--on-surface-muted)' }}>
                          CID {h.cid} — {h.patentIds.length ? h.patentIds.join(', ') : 'no patents linked'}
                          {statusNote(h.status) && ` (${statusNote(h.status)})`}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--on-surface-muted)' }}>
                    First-pass structural screen, not a legal freedom-to-operate opinion.
                  </p>
                </div>
              )}
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
            <div>
              <h2 className="pa-display text-2xl font-bold mb-2">Instant Compound Check — $10</h2>
              <div className="flex gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => setMode('patent')}
                  disabled={status === 'capturing'}
                  className={mode === 'patent' ? 'pa-btn-primary text-sm font-medium px-4 py-2.5 flex-1' : 'pa-chip text-sm font-medium px-4 py-2.5 flex-1 justify-center'}
                >
                  I have a patent number
                </button>
                <button
                  type="button"
                  onClick={() => setMode('compound')}
                  disabled={status === 'capturing'}
                  className={mode === 'compound' ? 'pa-btn-primary text-sm font-medium px-4 py-2.5 flex-1' : 'pa-chip text-sm font-medium px-4 py-2.5 flex-1 justify-center'}
                >
                  I have a compound
                </button>
              </div>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>
                {mode === 'patent'
                  ? "Enter a patent number and pay — if we've already screened it, you'll see the result immediately after payment. If not, we'll run it and email you within 1 hour."
                  : "Enter your compound (name or SMILES) and pay — we'll search for structurally similar compounds and the patents they're linked to, live."}
              </p>
              <div className="flex flex-col gap-3 mb-5">
                {mode === 'patent' ? (
                  <input
                    required
                    placeholder="Patent number (e.g. US7314938B2)"
                    value={form.patentNumber}
                    onChange={(e) => setForm({ ...form, patentNumber: e.target.value })}
                    disabled={status === 'capturing'}
                    className="text-base px-4 py-3 rounded-lg outline-none disabled:opacity-60"
                    style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
                  />
                ) : (
                  <input
                    required
                    placeholder="Compound name or SMILES (e.g. imatinib)"
                    value={form.compound}
                    onChange={(e) => setForm({ ...form, compound: e.target.value })}
                    disabled={status === 'capturing'}
                    className="text-base px-4 py-3 rounded-lg outline-none disabled:opacity-60"
                    style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
                  />
                )}
                <input
                  required
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={status === 'capturing'}
                  className="text-base px-4 py-3 rounded-lg outline-none disabled:opacity-60"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
                />
                <input
                  placeholder="Name (optional)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={status === 'capturing'}
                  className="text-base px-4 py-3 rounded-lg outline-none disabled:opacity-60"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
                />
              </div>
              {errorMsg && (
                <p className="text-sm mb-4" style={{ color: '#ba1a1a' }}>{errorMsg}</p>
              )}
              {status === 'capturing' ? (
                <p className="text-sm text-center py-3" style={{ color: 'var(--on-surface-muted)' }}>
                  {mode === 'compound' ? 'Confirming payment and searching — this can take up to 30-40 seconds…' : 'Confirming payment…'}
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {PAYPAL_CLIENT_ID && <div id="pa-check-paypal-buttons" ref={buttonsContainerRef} />}
                  {PAYPAL_CLIENT_ID && RAZORPAY_KEY_ID && (
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--on-surface-muted)' }}>
                      <div className="flex-1 h-px" style={{ background: 'var(--border-light)' }} />
                      or
                      <div className="flex-1 h-px" style={{ background: 'var(--border-light)' }} />
                    </div>
                  )}
                  {RAZORPAY_KEY_ID && (
                    <button
                      type="button"
                      onClick={handleRazorpayClick}
                      disabled={razorpayBusy || !razorpaySdkReady}
                      className="text-base font-semibold px-6 py-3.5 rounded-lg disabled:opacity-60"
                      style={{ background: '#0284c7', color: 'white' }}
                    >
                      {razorpayBusy ? 'Opening payment…' : 'Pay with UPI / Cards (India) →'}
                    </button>
                  )}
                  {!PAYPAL_CLIENT_ID && !RAZORPAY_KEY_ID && (
                    <p className="text-sm" style={{ color: '#ba1a1a' }}>Payments aren&rsquo;t configured yet.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
