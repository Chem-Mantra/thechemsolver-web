const HOSTED_BUTTON_ID = process.env.NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID

/** PayPal's "single button / embed a payment link" snippet — a plain form
 * POST to a PayPal-hosted payment page (no client-id or JS SDK needed,
 * unlike the Hosted Buttons/Smart Buttons variants). Generated from the
 * PayPal Business dashboard; see docs/PAYPAL_SETUP.md. Only rendered once
 * the student is signed in (checked by the caller), so the PayPal-side
 * email can be matched back to their Supabase account by the webhook in
 * /api/paypal/webhook. */
export default function PayPalButton() {
  if (!HOSTED_BUTTON_ID) {
    return <p className="text-red-400 text-xs">PayPal checkout isn&apos;t configured yet.</p>
  }

  return (
    <form
      action={`https://www.paypal.com/ncp/payment/${HOSTED_BUTTON_ID}`}
      method="post"
      target="_blank"
      className="inline-grid justify-items-center content-start gap-2"
    >
      <input
        type="submit"
        value="Go ad-free — Buy Now"
        className="text-center border-none rounded min-w-[9rem] h-[2.625rem] font-bold bg-[#FFD140] text-black text-sm cursor-pointer px-4"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="cards" />
      <section className="text-xs text-gray-500">
        {'Powered by '}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg"
          alt="paypal"
          className="h-3.5 inline align-middle"
        />
      </section>
    </form>
  )
}
