/** Client-side GA4 helpers. Requires NEXT_PUBLIC_GA_ID in Vercel env. */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!GA_ID || !window.gtag) return
  window.gtag('event', name, params ?? {})
}

/** Standard event names used across TheChemSolver. */
export const TCSEvents = {
  labOpen: 'lab_open',
  hubView: 'hub_view',
  emailSubscribe: 'email_subscribe',
  purchase: 'purchase',
  beginCheckout: 'begin_checkout',
  signUp: 'sign_up',
} as const
