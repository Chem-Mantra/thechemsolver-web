'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import type { PayPalButtonsInstance } from './paypalTypes'
import './paypalTypes'

export const OPEN_STANDARD_REPORT_EVENT = 'patent-analytics:open-standard-report'

type Status = 'closed' | 'open' | 'capturing' | 'done' | 'error'
type ServiceType = 'section3d' | 'markush'

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

type RazorpaySuccessResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
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

const initialForm = { serviceType: 'section3d' as ServiceType, patentNumber: '', clientCompound: '', details: '', name: '', email: '', company: '' }

export default function StandardReportModal() {
  const [status, setStatus] = useState<Status>('closed')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [sdkReady, setSdkReady] = useState(false)
  const [razorpaySdkReady, setRazorpaySdkReady] = useState(false)
  const [razorpayBusy, setRazorpayBusy] = useState(false)
  const [form, setForm] = useState(initialForm)

  const formRef = useRef(form)
  formRef.current = form

  const buttonsContainerRef = useRef<HTMLDivElement>(null)
  const buttonsInstanceRef = useRef<PayPalButtonsInstance | null>(null)

  useEffect(() => {
    const open = () => setStatus('open')
    window.addEventListener(OPEN_STANDARD_REPORT_EVENT, open)
    return () => window.removeEventListener(OPEN_STANDARD_REPORT_EVENT, open)
  }, [])

  async function createPendingRequest(): Promise<string> {
    const { serviceType, patentNumber, clientCompound, details, name, email, company } = formRef.current
    if (!details.trim() || !email.trim() || !company.trim()) {
      setErrorMsg('Company, email, and details of what you need are required.')
      throw new Error('Missing required fields')
    }
    setErrorMsg(null)
    const res = await fetch('/api/patent-analytics/standard-report/create-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceType, patentNumber, clientCompound, details, name, email, company }),
    })
    const data = await res.json()
    if (!res.ok || !data.pendingRequestId) throw new Error(data?.error || 'Could not start your request.')
    return data.pendingRequestId as string
  }

  useEffect(() => {
    if (!sdkReady || status !== 'open' || !window.paypal || !buttonsContainerRef.current) return

    const instance = window.paypal.Buttons({
      style: { layout: 'vertical', color: 'blue', label: 'pay', height: 45 },
      createOrder: async () => {
        const pendingRequestId = await createPendingRequest()
        const res = await fetch('/api/patent-analytics/standard-report/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pendingRequestId }),
        })
        const data = await res.json()
        if (!res.ok || !data.orderID) throw new Error(data?.error || 'Could not start payment.')
        return data.orderID as string
      },
      onApprove: async (data) => {
        setStatus('capturing')
        setErrorMsg(null)
        try {
          const res = await fetch('/api/patent-analytics/standard-report/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID }),
          })
          const result = await res.json()
          if (!res.ok) throw new Error(result?.error || 'Payment succeeded but something went wrong.')
          setStatus('done')
        } catch (err) {
          setErrorMsg(err instanceof Error ? err.message : 'Something went wrong — please contact support, your payment may have gone through.')
          setStatus('error')
        }
      },
      onError: (err) => {
        console.error('[StandardReportModal] PayPal Buttons error', err)
        setErrorMsg('Something went wrong with PayPal — please try again.')
        setStatus('error')
      },
    })

    buttonsInstanceRef.current = instance
    instance.render('#pa-standard-report-paypal-buttons')

    return () => {
      buttonsInstanceRef.current?.close()
      buttonsInstanceRef.current = null
    }
  }, [sdkReady, status])

  async function handleRazorpayClick() {
    if (!window.Razorpay) {
      setErrorMsg('Payment is still loading — try again in a moment.')
      return
    }
    setRazorpayBusy(true)
    try {
      const pendingRequestId = await createPendingRequest()
      const orderRes = await fetch('/api/patent-analytics/standard-report/razorpay-create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pendingRequestId }),
      })
      const order = await orderRes.json()
      if (!orderRes.ok || !order.orderId) throw new Error(order?.error || 'Could not start payment.')

      const { email, name } = formRef.current
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Patent Analytics',
        description: 'Standard Report',
        prefill: { email, name: name || undefined },
        theme: { color: '#0284c7' },
        handler: async (response) => {
          setStatus('capturing')
          try {
            const res = await fetch('/api/patent-analytics/standard-report/razorpay-verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            })
            const result = await res.json()
            if (!res.ok) throw new Error(result?.error || 'Payment succeeded but something went wrong.')
            setStatus('done')
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
    setErrorMsg(null)
    setForm(initialForm)
  }

  const inputStyle = { background: 'var(--input-bg)', border: '1px solid var(--border-light)' }
  const inputClass = 'text-base px-4 py-3 rounded-lg outline-none disabled:opacity-60 w-full'

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
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" onLoad={() => setRazorpaySdkReady(true)} />
      )}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: 'rgba(15, 23, 42, 0.35)', backdropFilter: 'blur(4px)' }}
        onClick={close}
      >
        <div
          className="pa-glass pa-glass-elevated w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto"
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
              <h2 className="pa-display text-2xl font-bold mb-2">Request received</h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
                We&rsquo;ll email your report to <b>{form.email}</b> within 24-48 hours. Questions any time:
                support@thechemsolver.com.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="pa-display text-2xl font-bold mb-2">Standard Report — $199</h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>
                Section 3(d) and Markush Coverage reports need a real chemist reading the specific patent claim —
                tell us exactly what you need below. We&rsquo;ll email your report within 24-48 hours.
              </p>
              <div className="flex flex-col gap-3 mb-5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, serviceType: 'section3d' })}
                    disabled={status === 'capturing'}
                    className={form.serviceType === 'section3d' ? 'pa-btn-primary text-sm font-medium px-4 py-2.5 flex-1' : 'pa-chip text-sm font-medium px-4 py-2.5 flex-1 justify-center'}
                  >
                    Section 3(d) Screening
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, serviceType: 'markush' })}
                    disabled={status === 'capturing'}
                    className={form.serviceType === 'markush' ? 'pa-btn-primary text-sm font-medium px-4 py-2.5 flex-1' : 'pa-chip text-sm font-medium px-4 py-2.5 flex-1 justify-center'}
                  >
                    Markush Coverage
                  </button>
                </div>
                <input
                  placeholder="Patent number (if you have one)"
                  value={form.patentNumber}
                  onChange={(e) => setForm({ ...form, patentNumber: e.target.value })}
                  disabled={status === 'capturing'}
                  className={inputClass}
                  style={inputStyle}
                />
                <input
                  placeholder="Your compound (name or SMILES, if you have it)"
                  value={form.clientCompound}
                  onChange={(e) => setForm({ ...form, clientCompound: e.target.value })}
                  disabled={status === 'capturing'}
                  className={inputClass}
                  style={inputStyle}
                />
                <textarea
                  required
                  placeholder="Tell us exactly what you need — e.g. which two compounds/forms to compare, or what genus claim and target compound to check"
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  disabled={status === 'capturing'}
                  rows={4}
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                />
                <input
                  required
                  placeholder="Firm / company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  disabled={status === 'capturing'}
                  className={inputClass}
                  style={inputStyle}
                />
                <input
                  required
                  type="email"
                  placeholder="Work email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={status === 'capturing'}
                  className={inputClass}
                  style={inputStyle}
                />
                <input
                  placeholder="Name (optional)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={status === 'capturing'}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              {errorMsg && <p className="text-sm mb-4" style={{ color: '#ba1a1a' }}>{errorMsg}</p>}
              {status === 'capturing' ? (
                <p className="text-sm text-center py-3" style={{ color: 'var(--on-surface-muted)' }}>Confirming payment…</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {PAYPAL_CLIENT_ID && <div id="pa-standard-report-paypal-buttons" ref={buttonsContainerRef} />}
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
