// Student access plan — 15-day free trial, then $15/year.
// Checkout runs through a PayPal payment link/button (docs/PAYPAL_SETUP.md)
// with a fixed amount set on PayPal's side. Students see "$15" as the
// advertised price; $15.76 is what the PayPal button actually charges
// (absorbs processing fee so the project nets ~$15). Keep both numbers
// in sync with the live PayPal button configuration.

/** Free trial length after first use / first sign-in. */
export const FREE_TRIAL_DAYS = 15

/** Advertised/net student price in whole USD dollars. */
export const ACCESS_PRICE_USD = 15

/** Actual amount charged by the PayPal hosted button. */
export const ACCESS_CHARGE_USD = 15.76

/** Paid access length after successful PayPal capture. */
export const ACCESS_DURATION_YEARS = 1

/** localStorage key for anonymous client-side trial start (ms epoch). */
export const LOCAL_TRIAL_STARTED_KEY = 'tcs_trial_started_at'

// ── Back-compat aliases (older AdFree* names used across a few call sites) ──
export const AD_FREE_PRICE_USD = ACCESS_PRICE_USD
export const AD_FREE_CHARGE_USD = ACCESS_CHARGE_USD

/** Same amount, formatted for display (e.g. "$15.76"). */
export function formatAccessChargeAmount(): string {
  return `$${ACCESS_CHARGE_USD.toFixed(2)}`
}

/** @deprecated use formatAccessChargeAmount */
export function formatAdFreeChargeAmount(): string {
  return formatAccessChargeAmount()
}

export function formatAccessPrice(): string {
  return `$${ACCESS_PRICE_USD}`
}

export function trialHeadline(): string {
  return `${FREE_TRIAL_DAYS}-day free trial, then ${formatAccessPrice()}/year`
}
