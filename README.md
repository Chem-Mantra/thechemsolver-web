# TheChemSolver

Next.js 14 app powering [thechemsolver.com](https://www.thechemsolver.com) —
free chemistry simulators and practice tools for AP Chemistry, USNCO, and IChO.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start   # production build
```

## iOS / mobile app

This project also wraps the live site in a Capacitor native shell for iOS
(and Android). See **[docs/MOBILE_APP_SETUP.md](docs/MOBILE_APP_SETUP.md)**
for what's built, how to test it on a Linux laptop with no iPhone, and the
exact steps left for macOS/Xcode. Manual QA steps are in
**[docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md)**.

Quick reference:

```bash
npm run cap:sync            # sync web assets/config into ios/ and android/
npm run cap:open:ios        # open in Xcode (macOS only)
npm run test:e2e:chromium   # mobile-viewport Playwright tests
npm run audit:lighthouse    # mobile Lighthouse audit (needs `npm run start` running)
```

Lab simulation pages (`/labs/*`) lock to landscape orientation on mobile —
natively via `@capacitor/screen-orientation` in the app, best-effort plus a
rotate hint on the web (iOS Safari never supported orientation lock).

## Student access plan (freemium)

- **15-day free trial** — anonymous visitors get a local trial clock; Google
  sign-in writes the same window to `premium_access` (aligned to the local
  start — no second free period). Paid/trial status then follows the account
  across devices.
- **Then $15/year** — PayPal hosted button unlocks full access for one year
  (labs, practice, ebooks). Webhook: `/api/paypal/webhook`.
- Marketing/SEO pages stay public; only interactive tools are gated via
  `AccessGate`. Native app uses `NativeAccessGate` (web PayPal for checkout).
  See **[docs/PAYPAL_SETUP.md](docs/PAYPAL_SETUP.md)**.
