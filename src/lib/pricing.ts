// Ad-Free plan pricing — checkout runs through a PayPal payment link/button
// (see docs/PAYPAL_SETUP.md), which has a fixed amount set on PayPal's side.
// Students see "$15" as the advertised price; $15.76 is what the PayPal
// button is actually configured to charge (absorbs PayPal's processing
// fee so the project nets $15). Keep these two numbers in sync with
// whatever the PayPal button/link is actually set to charge.

export const AD_FREE_PRICE_USD = 15 // advertised/net price, in whole dollars
export const AD_FREE_CHARGE_USD = 15.76 // actual amount charged by the PayPal button

/** Same amount, formatted for display (e.g. "$15.76"). */
export function formatAdFreeChargeAmount(): string {
  return `$${AD_FREE_CHARGE_USD.toFixed(2)}`
}
