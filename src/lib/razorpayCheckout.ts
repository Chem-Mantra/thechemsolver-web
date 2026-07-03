'use client'

type RazorpayResponse = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void }
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/** Opens Razorpay's checkout modal for the $15/year ad-free purchase, verifies
 * the payment server-side, and resolves once premium_access is granted. */
export async function openRazorpayCheckout(accessToken: string): Promise<{ expiresAt: string }> {
  const ready = await loadRazorpayScript()
  if (!ready) throw new Error('Payment gateway failed to load. Check your connection and try again.')

  const orderRes = await fetch('/api/razorpay/order', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const order = await orderRes.json()
  if (!orderRes.ok) throw new Error(order.error || 'Could not start checkout.')

  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  if (!key) throw new Error('Payment configuration missing.')

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key,
      amount: order.amount,
      currency: order.currency,
      name: 'TheChemSolver',
      description: 'Ad-free access (1 year)',
      order_id: order.id,
      handler: async (response: RazorpayResponse) => {
        try {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify(response),
          })
          const verifyData = await verifyRes.json()
          if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed.')
          resolve({ expiresAt: verifyData.expires_at })
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Payment verification failed.'))
        }
      },
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled.')),
      },
      theme: { color: '#a855f7' },
    })
    rzp.open()
  })
}
