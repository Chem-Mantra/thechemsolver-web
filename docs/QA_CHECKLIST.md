# Manual QA Checklist — Laptop Only

Run through this after any change touching `capacitor.config.ts`, native
glue (`CapacitorNative.tsx`), nav (`HomeNav.tsx`/`NavWrapper.tsx`), or PWA
files (`manifest.webmanifest`, `sw.js`).

## Setup

```bash
npm run build && npm run start   # production build, matches what ships
```
Open http://localhost:3000 in Chrome, then DevTools → toggle device
toolbar (Ctrl+Shift+M) → select "iPhone SE", "iPhone 14", "iPhone 14 Pro Max".

## Responsive / touch

- [ ] Home page hamburger menu opens/closes, all 6 links present and tappable
- [ ] Interior-page (e.g. `/labs`) hamburger menu opens/closes, links tappable
- [ ] No horizontal scroll/overflow at 375px, 390px, 430px widths
- [ ] Tap targets (nav buttons, quiz answer options) feel ≥44×44pt — no
      mis-taps on adjacent elements
- [ ] Lab simulators (canvas/WebGL, e.g. `/labs/titration`, `/labs/vsepr`)
      render and respond to touch/drag, not just mouse hover
- [ ] Rotating the emulated device (portrait ↔ landscape) doesn't break layout

## PWA installability (desktop Chrome/Edge)

- [ ] Address bar shows an install icon on `/`
- [ ] DevTools → Application → Manifest shows no errors, icons render
- [ ] DevTools → Application → Service Workers shows `sw.js` activated
- [ ] Installed app opens in its own window (no browser chrome), correct
      icon and name ("TheChemSolver")
- [ ] Throttle network to "Offline" in DevTools, reload a previously-visited
      page → see the `/offline` fallback, not a browser error page
- [ ] Quiz/practice pages (`/usnco/practice`, `/ap-chemistry/practice`) are
      NOT served stale from cache — confirm fresh data loads when back online

## Automated (test:e2e:chromium works out of the box; see docs/MOBILE_APP_SETUP.md for the optional WebKit setup)

```bash
npm run test:e2e:chromium   # smoke + mobile-nav + pwa-installability + screenshots
npm run test:e2e:report     # inspect failures, traces, attached screenshots
npm run audit:lighthouse    # requires `npm run start` running first
```
- [ ] All Playwright specs pass on all 3 Chromium device projects
- [ ] Lighthouse mobile scores: performance/accessibility/SEO ≥ 90
      (best-practices is expected to sit lower due to the site's CSP
      `unsafe-inline`/`unsafe-eval`, required for Google AdSense — not a bug)

## Screenshots for human eyeballing

After `npm run test:e2e:chromium`, check:
`test-results/screenshots/<iphone-se|iphone-14|iphone-14-pro-max>-chromium/*.png`
- [ ] Home, labs index, a lab page, and an exam hub page all look correct
      at each of the 3 sizes — no clipped text, no overlapping elements

## What cannot be verified without macOS/Xcode/iOS Simulator

- Real WKWebView rendering quirks (Safari-specific CSS/JS bugs) — Playwright's
  WebKit project is the closest laptop approximation, not identical
- Actual native status bar / splash screen / safe-area behavior on a real
  notch/Dynamic Island device
- Real hardware back-swipe gesture, haptics, and Capacitor plugin behavior
  in a compiled binary
- App icon/splash rendering exactly as Xcode's asset catalog resolves it
- App Store review requirements (privacy manifest, tracking prompts, etc.)
- Performance on actual iPhone hardware (Playwright's mobile emulation
  approximates viewport/touch/UA, not real device CPU/GPU characteristics)
