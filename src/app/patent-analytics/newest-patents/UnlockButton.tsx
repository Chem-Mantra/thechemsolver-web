'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import type { PayPalButtonsInstance } from '../paypalTypes'
import '../paypalTypes'

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

// Window.Razorpay is already declared globally in CheckPatentModal.tsx --
// redeclaring the same ambient interface here (even with an identical
// shape) is a TS error ("subsequent property declarations must have the
// same type"), since two separately-defined types aren't considered
// identical even when structurally equal. Using a local type assertion at
// the call site instead avoids touching that shared global declaration.
type RazorpaySuccessResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
type RazorpayInstance = { open: () => void }
type RazorpayGlobal = new (options: {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description: string
  theme?: { color?: string }
  handler: (response: RazorpaySuccessResponse) => void
  modal?: { ondismiss?: () => void }
}) => RazorpayInstance

// A gateway timeout/crash returns an HTML or plain-text error page, not
// JSON -- calling res.json() directly on that throws a raw parser error
// ("Unexpected token '<' ... is not valid JSON") that would otherwise leak
// straight into the user-facing error message. Parse defensively so a
// transient infrastructure hiccup shows a normal retry message instead.
async function safeParseJson(res: Response): Promise<{ error?: string; [key: string]: unknown }> {
  try {
    return await res.json()
  } catch {
    return { error: 'Something went wrong on our end -- please try again in a moment.' }
  }
}

// Standalone unlock button for a CONFIRMED newest-patents result -- same
// embedded-PayPal-Buttons + Razorpay-Checkout pattern as CheckPatentModal,
// without the modal chrome, since this lives directly on the results page.
export default function UnlockButton({ requestId }: { requestId: string }) {
  const [sdkReady, setSdkReady] = useState(false)
  const [razorpaySdkReady, setRazorpaySdkReady] = useState(false)
  const [razorpayBusy, setRazorpayBusy] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const buttonsContainerRef = useRef<HTMLDivElement>(null)
  const buttonsInstanceRef = useRef<PayPalButtonsInstance | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!sdkReady || !window.paypal || !buttonsContainerRef.current) return

    const instance = window.paypal.Buttons({
      style: { layout: 'vertical', color: 'blue', label: 'pay', height: 45 },
      createOrder: async () => {
        setError(null)
        const res = await fetch('/api/patent-analytics/newest-patents/unlock/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId }),
        })
        const data = await safeParseJson(res)
        if (!res.ok || !data.orderID) throw new Error(data?.error || 'Could not start payment.')
        return data.orderID as string
      },
      onApprove: async (data) => {
        setCapturing(true)
        setError(null)
        try {
          const res = await fetch('/api/patent-analytics/newest-patents/unlock/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID }),
          })
          const result = await safeParseJson(res)
          if (!res.ok) throw new Error(result?.error || 'Payment succeeded but something went wrong.')
          router.refresh()
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Something went wrong — please contact support, your payment may have gone through.')
          setCapturing(false)
        }
      },
      onError: (err) => {
        console.error('[UnlockButton] PayPal Buttons error', err)
        setError('Something went wrong with PayPal — please try again.')
      },
    })

    buttonsInstanceRef.current = instance
    instance.render('#pa-unlock-paypal-buttons')
    return () => {
      buttonsInstanceRef.current?.close()
      buttonsInstanceRef.current = null
    }
  }, [sdkReady, requestId, router])

  async function handleRazorpayClick() {
    if (!window.Razorpay) {
      setError('Payment is still loading — try again in a moment.')
      return
    }
    setError(null)
    setRazorpayBusy(true)
    try {
      const orderRes = await fetch('/api/patent-analytics/newest-patents/unlock/razorpay-create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      })
      const order = await safeParseJson(orderRes)
      if (!orderRes.ok || !order.orderId) throw new Error(order?.error || 'Could not start payment.')

      const rzp = new window.Razorpay({
        key: order.keyId as string,
        amount: order.amount as number,
        currency: order.currency as string,
        order_id: order.orderId as string,
        name: 'Patent Analytics',
        description: 'Newest Patent Extraction unlock',
        theme: { color: '#0284c7' },
        handler: async (response) => {
          setCapturing(true)
          try {
            const res = await fetch('/api/patent-analytics/newest-patents/unlock/razorpay-verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            })
            const result = await safeParseJson(res)
            if (!res.ok) throw new Error(result?.error || 'Payment succeeded but something went wrong.')
            router.refresh()
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong — please contact support, your payment may have gone through.')
            setCapturing(false)
          }
        },
        modal: { ondismiss: () => setRazorpayBusy(false) },
      })
      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start payment.')
      setRazorpayBusy(false)
    }
  }

  if (capturing) {
    return <p className="text-sm text-center py-3" style={{ color: 'var(--on-surface-muted)' }}>Confirming payment…</p>
  }

  return (
    <>
      {PAYPAL_CLIENT_ID && (
        <Script src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`} strategy="lazyOnload" onLoad={() => setSdkReady(true)} />
      )}
      {RAZORPAY_KEY_ID && (
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" onLoad={() => setRazorpaySdkReady(true)} />
      )}
      <div className="flex flex-col gap-3">
        {error && <p className="text-sm" style={{ color: '#ba1a1a' }}>{error}</p>}
        {PAYPAL_CLIENT_ID && <div id="pa-unlock-paypal-buttons" ref={buttonsContainerRef} />}
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
        {!PAYPAL_CLIENT_ID && !RAZORPAY_KEY_ID && <p className="text-sm" style={{ color: '#ba1a1a' }}>Payments aren&rsquo;t configured yet.</p>}
      </div>
    </>
  )
}
