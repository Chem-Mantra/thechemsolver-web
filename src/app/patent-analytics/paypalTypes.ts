// Shared window.paypal typing for both PayPal JS SDK integrations in this
// product: CheckPatentModal.tsx (intent=capture, one-time Orders) and
// RetainerModal.tsx (intent=subscription, Billing Plans). A `declare
// global` for the same property must have an IDENTICAL type everywhere it
// appears, so this lives in one shared file both import rather than each
// declaring its own (incompatible) shape.
export type PayPalOrderActions = { order: { capture: () => Promise<unknown> } }
export type PayPalSubscriptionActions = { subscription: { create: (opts: { plan_id: string; custom_id: string }) => Promise<string> } }
export type PayPalButtonsInstance = { render: (selector: string) => void; close: () => void }

export type PayPalButtonsConfig = {
  style?: Record<string, unknown>
  createOrder?: () => Promise<string>
  onApprove?: (data: { orderID?: string; subscriptionID?: string }) => Promise<void>
  createSubscription?: (data: unknown, actions: PayPalSubscriptionActions) => Promise<string>
  onError?: (err: unknown) => void
}

export type PayPalGlobal = {
  Buttons: (config: PayPalButtonsConfig) => PayPalButtonsInstance
}

declare global {
  interface Window {
    paypal?: PayPalGlobal
  }
}
