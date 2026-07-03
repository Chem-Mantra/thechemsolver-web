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

## Google sign-in (monetization paused)

Everything on TheChemSolver is free right now, including inside the native
app — the $15/year ad-free purchase and the native app's payment gate are
both built but currently unmounted, pending a decision on monetization
based on traffic. `/account` still offers optional Google sign-in. See
**[docs/RAZORPAY_SETUP.md](docs/RAZORPAY_SETUP.md)** for the full paused
system and how to re-enable it later.
