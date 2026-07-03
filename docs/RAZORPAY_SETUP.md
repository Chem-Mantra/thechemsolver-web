# Razorpay + Google Sign-In Setup — $15/Year Ad-Free & App Access

## 🔕 Status: paused

Monetization is on hold for now — everything on TheChemSolver is free,
including inside the native app, while the plan is reconsidered based on
traffic. `NativeAccessGate` and `AdFreePopup` are unmounted (not imported)
in `src/app/layout.tsx`; `/account` only offers Google sign-in, no purchase
button. All the code below still exists and works — re-enabling later is
just re-adding those two imports/renders in `layout.tsx` and restoring the
upgrade button in `src/app/account/page.tsx` (see git history for the
exact prior version). Google sign-in itself stays active.

Everything below describes that (currently paused) system.

---

Replaces the earlier Stripe-based design: Stripe isn't fully available for
Indian businesses, and Razorpay is already live on chem-mantra.online. All
the code is written and wired up (see "What's built" below). What's left
requires your own Razorpay/Google/Supabase dashboard access.

## ⚠️ Read this first: App Store risk changed

The previous design only gated **ads** — the app was fully usable for free,
and paying just removed ads. That's a common, low-risk pattern under
Apple's guidelines.

**This version gates the entire native app**: `NativeAccessGate.tsx` blocks
all content until the signed-in Google account has paid. This is a
materially different, higher-risk pattern under **App Store Review
Guideline 3.1.1** ("apps... may not use their own mechanisms to unlock
content or functionality, such as... external mechanisms for purchases").
Apps that are entirely unusable without an external payment are reviewed
much more strictly than "remove ads" freemium apps, and rejection is a real
possibility. This is **not legal advice** — if App Store approval matters
to you, it's worth a conversation with whoever handles your Apple Developer
account before submitting, or budgeting time for a possible resubmission
with adjustments (e.g., some free tools remain usable without login).

The website itself is completely unaffected by this — it stays free with
ads for every browser visitor, exactly as before. The hard gate only
applies inside the compiled iOS/Android app (`Capacitor.isNativePlatform()`).

## What's built (already in the repo)

- **Auth**: Google-only sign-in via Supabase Auth (`src/lib/googleAuth.ts`).
  Web uses a normal redirect; the native app opens the **system browser**
  and catches the return via a custom URL scheme deep link
  (`AuthCallbackListener.tsx`) — Google actively blocks OAuth from loading
  inside embedded WebViews like Capacitor's, so this isn't optional.
- **Payments**: `src/lib/razorpay.ts`, `/api/razorpay/order`,
  `/api/razorpay/verify` (client-driven, instant), `/api/razorpay/webhook`
  (`payment.captured`, the real source of truth). Checkout runs as
  Razorpay's in-page modal (`src/lib/razorpayCheckout.ts`) — no redirect
  needed, which also makes it simpler inside the native WebView than
  Stripe's hosted-page approach was.
- **`/account`** — Google sign-in, purchase button, premium status.
- **`NativeAccessGate.tsx`** — the native-only full-app block described above.
- **Ad-gating** (`AdsGate.tsx`, `AdSlot.tsx`, `AdFreePopup.tsx`) — unchanged
  from before, still applies to the website.

Until you complete the steps below, the order/verify/webhook routes return
`503` and Google sign-in will fail at the Supabase step — the **website**
still works exactly as before either way. The native app, however, will be
stuck on the sign-in gate until Google OAuth is configured (see App Store
risk note above about why that's the deliberate design here).

## 1. Razorpay: reusing chem-mantra-lms's account

`.env.local` currently has chem-mantra-lms's **test-mode** keys
(`rzp_test_...`) copied in, since you said Razorpay is "ready." A few
things to decide:

- **Same account for both sites, or separate?** Razorpay doesn't require
  domain whitelisting for the standard Orders API, so reusing one account
  across chem-mantra.online and thechemsolver.com works technically fine —
  it just means combined revenue/settlement reporting. If you'd rather keep
  them separate for accounting, create a second Razorpay account (or ask
  Razorpay support about sub-merchant accounts) and swap the keys.
- Either way, get **live** keys before launch: Dashboard → Settings → API
  Keys → generate live keys (`rzp_live_...`) once KYC is approved.

## 2. Razorpay: enabling International Payments (USD)

By default, Indian Razorpay accounts only accept **INR**. To charge
international students in USD, you need **International Payments**
enabled:

1. Razorpay Dashboard → Account & Settings → look for "International
   Payments" (or contact Razorpay support directly — this has required a
   support conversation for many accounts rather than a pure self-serve
   toggle).
2. This typically requires: business category eligibility, additional KYC
   documents, and agreeing to Razorpay's cross-border payment terms
   (RBI/FEMA compliance is Razorpay's responsibility as the payment
   aggregator, not yours, but they gate the feature behind verification).
3. Until this is approved, `/api/razorpay/order` will fail when creating a
   USD order — the route returns a clear error message pointing back to
   this doc. You can temporarily set `RAZORPAY_CURRENCY=INR` and
   `RAZORPAY_AMOUNT_USD=` to an INR-equivalent value to test the flow
   end-to-end with domestic test cards in the meantime.
4. International card payments via Razorpay typically settle to you in INR
   at Razorpay's conversion rate (check current terms) — there isn't a
   separate USD payout account unless you've set that up separately.

Test cards (once in test mode): Razorpay's test Visa card `4111 1111 1111
1111`, any future expiry, any CVC, any name.

## 3. Razorpay: webhook endpoint

1. Dashboard → Settings → Webhooks → **+ Add New Webhook**.
2. URL: `https://www.thechemsolver.com/api/razorpay/webhook`.
3. Active events: `payment.captured`.
4. Set a secret — put it in `.env.local` and Vercel as
   `RAZORPAY_WEBHOOK_SECRET`.

## 4. Google OAuth: Supabase configuration

1. Supabase Dashboard → Authentication → Providers → **Google** → enable.
2. You need a Google Cloud OAuth Client ID + Secret. Two options:
   - **Reuse** chem-mantra-lms's existing `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`
     (found in that project's `.env`) — Google OAuth clients support
     multiple redirect URIs, so this works technically. The tradeoff: the
     Google consent screen users see may show whatever app name that
     Google Cloud project is branded as, which could read as
     "chem-mantra" instead of "TheChemSolver" — a bit confusing for trust.
   - **Create a new OAuth Client** in Google Cloud Console branded
     specifically "TheChemSolver" (cleaner, more professional, a few extra
     minutes of setup). Recommended if you want the consent screen to
     clearly say TheChemSolver.
3. Either way, add Supabase's callback URL as an **Authorized redirect
   URI** on the Google OAuth client:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
   (Supabase shows you this exact URL in the same dashboard screen).
4. In Supabase → Authentication → URL Configuration → **Redirect URLs**,
   add:
   - `https://www.thechemsolver.com/**` (web)
   - `com.thechemsolver.app://auth-callback` (native — this is the custom
     scheme already registered in `ios/App/App/Info.plist` and
     `android/.../AndroidManifest.xml`)

## 5. Environment variables

```
THECHEMSOLVER_SUPABASE_SERVICE_KEY=...
RAZORPAY_KEY_ID=rzp_live_... (or rzp_test_... while testing)
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_... (same value as RAZORPAY_KEY_ID)
RAZORPAY_WEBHOOK_SECRET=...
RAZORPAY_CURRENCY=USD
RAZORPAY_AMOUNT_USD=15
NEXT_PUBLIC_SITE_URL=https://www.thechemsolver.com
```

Add these to both `.env.local` (local dev) and Vercel's Environment
Variables (production).

## 6. Supabase: `premium_access` table

Same table as before, just Razorpay's identifiers instead of Stripe's. Run
in Supabase SQL Editor:

```sql
create table premium_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  razorpay_order_id text,
  razorpay_payment_id text,
  purchased_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table premium_access enable row level security;

create policy "Users can read own premium status"
  on premium_access for select
  using (auth.uid() = user_id);

-- No insert/update/delete policy for anon/authenticated — only the
-- webhook and /api/razorpay/verify (both using the service role key,
-- which bypasses RLS) write here.
```

## 7. Go-live checklist

- [ ] `premium_access` table + RLS policy created
- [ ] Decided: same Razorpay account as chem-mantra.online, or separate
- [ ] International Payments enabled on the Razorpay account (or
      confirmed INR-only is acceptable for now)
- [ ] Live Razorpay keys generated and set in env vars
- [ ] Razorpay webhook added, pointing at the production URL
- [ ] Decided: reuse chem-mantra-lms's Google OAuth client, or create a
      new TheChemSolver-branded one
- [ ] Google provider enabled in Supabase, redirect URLs (web + native
      scheme) added to the allowlist
- [ ] Tested end-to-end on the **website**: Google sign-in → pay → ads
      gone on `/`
- [ ] Tested end-to-end in a **local native build**: sign in with an
      already-paid Google account → app opens straight to content; sign
      in with an unpaid account → blocked with the "visit thechemsolver.com"
      message; "I've paid — check again" correctly re-checks status
- [ ] Reviewed the App Store risk section above and decided how to proceed
      before submitting for review
