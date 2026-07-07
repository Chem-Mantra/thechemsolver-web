# PayPal + Google Sign-In Setup — $15/Year Ad-Free

Replaces the earlier Razorpay-based design (see git history for
`docs/RAZORPAY_SETUP.md` if you ever need it back) — the project moved to a
PayPal Business account with a dashboard-configured Hosted Button/Payment
Link/QR code instead of a coded checkout flow.

## What's built (already in the repo)

- **Auth**: Google-only sign-in via Supabase Auth (`src/lib/googleAuth.ts`).
  Students must sign in before paying — this is how a PayPal payment gets
  matched back to a website account (see "Why email-matching" below).
- **Checkout**: `src/app/PayPalButton.tsx` renders PayPal's "single
  button / embed a payment link" snippet (hosted button ID
  `UJBQ2ZGH7YK8J`, from the button-code PDF downloaded 07-Jul-2026) once
  the student is signed in — a plain HTML form that POSTs to a
  PayPal-hosted payment page. No JS SDK, no client-id needed for
  checkout itself, no order-creation code on our side. The amount,
  currency, and description are whatever the button was configured with
  in PayPal's dashboard (should be $15.76 USD).
- **Granting access**: `/api/paypal/webhook` — the only place that grants
  `premium_access`. It verifies PayPal's webhook signature, resolves the
  payer's email off the `PAYMENT.CAPTURE.COMPLETED` event (following the
  capture's "up" link to the parent order if needed), looks up the
  matching Supabase account by email, upserts `premium_access` for one
  year, and sends a confirmation email via Resend.
- **`/account`** and **`AdFreePopup.tsx`** — both show the PayPal button to
  signed-in, non-premium users, and read `premium_access` (via
  `AuthProvider`) to show "✓ Ad-free" once granted.

### Why email-matching (and its one sharp edge)

A dashboard-generated Hosted Button is the same button for every visitor —
there's no way to stamp a per-visitor ID onto a specific click the way a
coded Orders-API integration could. So the webhook matches the **PayPal
payer's email** to a **Supabase Google-sign-in email**. This works as long
as the student pays with the same email they signed in with. If they pay
with a different email, the webhook logs
`no Supabase account found for payer email=... capture=...` and does
nothing automatically — you'd grant that one manually (see below). The
UI copy on `/account` already tells students to use the same email.

### Manually granting access (mismatch fallback)

If the webhook log shows no match, find the buyer in PayPal (Activity →
the transaction → note their Supabase-account email if you know it, or ask
them), then in Supabase SQL Editor:

```sql
insert into premium_access (user_id, purchased_at, expires_at)
values (
  (select id from auth.users where email = 'the-students-email@example.com'),
  now(),
  now() + interval '1 year'
)
on conflict (user_id) do update set expires_at = excluded.expires_at;
```

## 1. PayPal: Business account + button

1. Confirm the PayPal account is a **Business account** — personal
   accounts can't create API apps or webhooks (needed for step 2 below),
   even though they can create Payment Links/Buttons/QR codes.
2. Button is already created: hosted button ID `UJBQ2ZGH7YK8J`
   ("TheChemSolver Ad-Free (1 Year)"). Double-check in the PayPal
   dashboard that it's actually configured to charge **$15.76 USD** — the
   button-code PDF doesn't show the price, only the code.
   `NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID` is already set in `.env.local`.
   If you ever recreate the button, update that env var to the new ID.

## 2. PayPal: API app + webhook (for auto-granting access)

The Hosted Button itself doesn't need this, but granting access
automatically does — the webhook is what verifies a payment happened and
who paid.

1. Go to **developer.paypal.com** → log in with the same Business account →
   **Apps & Credentials** → make sure you're on **Live** (not Sandbox) →
   **Create App**.
2. Copy the **Client ID** and **Secret** from that app.
3. On that same app's page, **Add Webhook**:
   - URL: `https://www.thechemsolver.com/api/paypal/webhook`
   - Subscribe to event: **Payment capture completed**
     (`PAYMENT.CAPTURE.COMPLETED`)
4. Copy the **Webhook ID** it gives you.

## 3. Resend: confirmation email

1. Sign up at resend.com (free tier covers this easily).
2. Add and verify a sending domain — either `thechemsolver.com` itself or
   a subdomain like `mail.thechemsolver.com` (Resend gives you a few DNS
   records — TXT/CNAME — to add wherever thechemsolver.com's DNS is
   managed).
3. Create an API key.
4. Decide the "from" address, e.g. `TheChemSolver <noreply@thechemsolver.com>`.

## 4. Environment variables

```
NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID=UJBQ2ZGH7YK8J   # already set

PAYPAL_CLIENT_ID=...                    # from the Live API app (step 2)
PAYPAL_CLIENT_SECRET=...
PAYPAL_WEBHOOK_ID=...
PAYPAL_ENV=live                         # or "sandbox" while testing

RESEND_API_KEY=...
RESEND_FROM_EMAIL=TheChemSolver <noreply@thechemsolver.com>

THECHEMSOLVER_SUPABASE_SERVICE_KEY=...      # already set, reused
NEXT_PUBLIC_THECHEMSOLVER_SUPABASE_URL=...  # already set, reused
NEXT_PUBLIC_SITE_URL=https://www.thechemsolver.com
```

Add these to both `.env.local` (local dev) and Vercel's Environment
Variables (production).

## 5. Supabase: `premium_access` table

The table already exists from the Razorpay days with nullable
`razorpay_order_id`/`razorpay_payment_id` columns. Add the PayPal
equivalent — run in Supabase SQL Editor:

```sql
alter table premium_access add column if not exists paypal_capture_id text;
```

(`razorpay_order_id`/`razorpay_payment_id` can stay — they're just unused
now — or be dropped later with `alter table premium_access drop column ...`
if you want to tidy up once you're confident nothing else reads them.)

RLS policy is unchanged: only the service-role key (used by the webhook)
writes to this table; signed-in users can only read their own row.

## 6. Go-live checklist

- [ ] Hosted Button confirmed at $15.76 USD, described correctly
- [ ] Live API app created, Client ID/Secret copied
- [ ] Webhook added pointing at the production URL, subscribed to
      `PAYMENT.CAPTURE.COMPLETED`, Webhook ID copied
- [ ] Resend domain verified, API key created, from-address decided
- [ ] `paypal_capture_id` column added to `premium_access`
- [ ] All env vars set in both `.env.local` and Vercel
- [ ] Tested end-to-end: sign in with Google → pay with **the same
      email** → within ~a minute, `/account` shows "✓ Ad-free" and a
      confirmation email arrives
- [ ] Tested the mismatch path once on purpose (pay with a different
      email) to confirm the webhook logs it clearly rather than failing
      silently
