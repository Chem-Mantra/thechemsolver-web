import Razorpay from 'razorpay'

const keyId = process.env.RAZORPAY_KEY_ID
const keySecret = process.env.RAZORPAY_KEY_SECRET

// Null until RAZORPAY_KEY_ID/SECRET are set (see docs/RAZORPAY_SETUP.md) —
// routes that use this check for null and return 503 instead of crashing.
export const razorpay = keyId && keySecret ? new Razorpay({ key_id: keyId, key_secret: keySecret }) : null

// USD by default — this is the international-students product. Requires
// "International Payments" enabled on the Razorpay account; see
// docs/RAZORPAY_SETUP.md. Falls back to INR only if explicitly configured.
export const PAYMENT_CURRENCY = process.env.RAZORPAY_CURRENCY || 'USD'
export const PAYMENT_AMOUNT_USD = Number(process.env.RAZORPAY_AMOUNT_USD || 15)
