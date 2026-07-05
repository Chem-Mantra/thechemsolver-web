// Ad-Free plan pricing — grosses up the advertised $15/year price so that,
// after Razorpay's international transaction fee (+ GST charged on that fee),
// TheChemSolver still nets $15 per sale. Students see "$15" as the
// advertised price; the actual checkout amount is slightly higher to absorb
// these deductions automatically. All math is done in cents (integers) to
// avoid floating-point rounding issues with real money.

export const AD_FREE_PRICE_USD = 15 // advertised/net price, in whole dollars

const RAZORPAY_INTL_FEE_RATE = 0.03 // Razorpay's international-card transaction fee
const GST_ON_FEE_RATE = 0.18        // GST charged on the Razorpay fee itself (not the sale price)
const DEDUCTION_RATE = RAZORPAY_INTL_FEE_RATE * (1 + GST_ON_FEE_RATE)

/** Amount actually charged at checkout, in cents — the smallest USD unit Razorpay expects. */
export function getAdFreeChargeAmountCents(): number {
  const netCents = AD_FREE_PRICE_USD * 100
  return Math.ceil(netCents / (1 - DEDUCTION_RATE))
}

/** Same amount, formatted for display (e.g. "$15.56"). */
export function formatAdFreeChargeAmount(): string {
  return `$${(getAdFreeChargeAmountCents() / 100).toFixed(2)}`
}
