# TheChemSolver — iOS App (Capacitor) Setup

Built on Ubuntu, no physical iPhone, no macOS. This doc explains what was
done, how to test it on this laptop, and exactly what's left for a Mac.

## Why Capacitor in "remote URL" mode

`thechemsolver-web` is a full Next.js app, not a static site: `/api/ap`,
`/api/icho`, `/api/usnco` are live route handlers querying Supabase. A
static Capacitor bundle (`webDir` full of pre-rendered HTML) would ship
without working quiz/practice content. Instead:

- The native shell (`capacitor.config.ts`) points `server.url` at the live,
  already-deployed site: `https://www.thechemsolver.com`. Capacitor loads
  that URL directly in the WKWebView/WebView and injects its native bridge
  on top, so plugins (status bar, splash screen, back button, haptics,
  network, browser) work even though the content itself is remote.
- `webDir: 'www'` still points at a small local fallback page
  (`www/index.html`) — Capacitor requires a webDir to exist, and it's shown
  if the remote URL is briefly unreachable.
- For local development, point the shell at your `next dev` server instead:
  `CAPACITOR_DEV_SERVER_URL=http://<your-lan-ip>:3000 npx cap sync ios`.

This is independent of the site's own PWA support (manifest + service
worker), which was also added, and works for installable-web-app testing in
desktop Chrome/Edge regardless of Capacitor.

## What was completed on Ubuntu

- `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`
  plus 8 UX plugins (status-bar, splash-screen, app, browser, keyboard,
  haptics, network, device) installed into the existing Next.js project.
- `capacitor.config.ts` — app id `com.thechemsolver.app`, name
  "TheChemSolver", remote-URL server config, allowNavigation list for
  Supabase/AdSense/DoubleClick domains, dark background/status-bar config.
- `npx cap add ios` and `npx cap add android` both ran successfully —
  **iOS uses Swift Package Manager, not CocoaPods** (no Ruby/CocoaPods
  toolchain needed), confirmed by the absence of a `Podfile` in `ios/`.
  Android's Gradle sync also completed cleanly (JDK 17 present).
- Native UX glue (`src/app/CapacitorNative.tsx`), mounted once from the root
  layout, no-ops on the regular website and only activates inside the native
  shell:
  - Status bar styled for the site's dark theme.
  - Splash screen hide-on-ready.
  - Hardware/gesture back button mapped to browser history, exits app at
    the root instead of doing nothing.
  - External links (ads, mailto/tel excluded, off-origin domains) open in
    the system browser via `@capacitor/browser` instead of hijacking the
    app's single WebView.
  - Light haptic tap feedback on in-app navigation.
  - Network status → offline banner (`.offline-banner`, safe-area aware).
  - `env(safe-area-inset-*)` CSS variables + `viewport-fit=cover` so content
    respects the notch/Dynamic Island/home indicator.
- Fixed a real mobile-nav gap found during the audit: both the homepage's
  own nav (`HomeNav.tsx`) and the interior-page nav (`NavWrapper.tsx`) had
  their exam/tool links in a `hidden md:flex` block with **no mobile
  fallback at all** — phones had no way to reach AP Chemistry/USNCO/IChO/Orgo
  from the nav. Added a hamburger menu (44×44pt tap target, per iOS HIG) to
  both.
- Full PWA support added to the Next app itself: `public/manifest.webmanifest`,
  `public/sw.js` (hand-rolled, deliberately bypasses `/api/*` and cross-origin
  requests so Supabase quiz data is never stale-cached), `/offline` fallback
  route, `RegisterServiceWorker.tsx` (production-only), `theme-color` +
  `viewport-fit=cover` via the Next `viewport` export, `worker-src`/
  `manifest-src` added to the existing CSP.
- Icons and splash screens generated for iOS, Android, and the web manifest
  from the existing `src/app/icon.png` via `@capacitor/assets` (uses
  `sharp`, no ImageMagick/PIL needed). Source assets live in `assets/` for
  regeneration — **swap in a real 1024×1024 icon before App Store
  submission**; the current source is only 512×512, upscaled.
- Playwright test suite (4 device projects × 4 spec files = 56 tests):
  smoke, mobile-nav, PWA-installability, and full-page screenshot capture.
- Lighthouse mobile audit script, verified working end-to-end against a
  production build (`npm run audit:lighthouse`).
- `npm run build` verified green after every change.

## How to test on this laptop

No iPhone and no macOS are needed for any of this:

```bash
# 1. Dev server
npm run dev                         # http://localhost:3000

# 2. Chrome DevTools device emulation (manual, visual)
#    DevTools → toggle device toolbar → pick "iPhone SE/14/14 Pro Max"

# 3. Automated mobile-viewport tests (Chromium engine, iPhone SE/14/14 Pro Max)
npm run test:e2e:chromium           # builds + runs 3 device projects
npm run test:e2e:report             # opens the HTML report (traces, screenshots)

# 4. Full-page screenshots for eyeballing, per device:
#    test-results/screenshots/<project>/<page>.png after running test:e2e

# 5. Lighthouse mobile audit (performance/accessibility/best-practices/SEO)
npm run start &                     # production build must be running
npm run audit:lighthouse            # reports/*.html + *.json
# stop the server afterwards, e.g.: fuser -k 3000/tcp

# 6. PWA installability in desktop Chrome/Edge
npm run build && npm run start
# open http://localhost:3000, look for the install icon in the address bar,
# or DevTools → Application → Manifest / Service Workers
```

### Chromium engine note

Playwright's own downloaded Chromium/WebKit binaries need one missing
system library (`libavif16`) that requires interactive `sudo` to install.
Rather than depend on that, the 3 Chromium projects in `playwright.config.ts`
(`iphone-se-chromium`, `iphone-14-chromium`, `iphone-14-pro-max-chromium`)
use `channel: 'chrome'` — your already-installed system Google Chrome —
combined with Playwright's iPhone viewport/UA/touch-emulation device
presets. This runs today with zero extra setup and is what `npm run
test:e2e:chromium` uses; **42/42 tests pass** across all three device sizes.

WebKit (`iphone-14-webkit`, Playwright's own build — the closest engine to
real Safari/WKWebView, but not identical) still needs the missing library:

```bash
sudo apt-get install libavif16
# or: sudo npx playwright install-deps
```

Then `npm run test:e2e` (all 4 projects) and `npm run test:e2e:webkit`
will work too. Everything else — Lighthouse, dev server, manual DevTools
emulation, and the 3 Chromium-based device projects — already works without
this.

## What's left — macOS/Xcode only

Confirmed via `npx cap doctor` on this machine: `Xcode is not installed` is
the only failing check; Android tooling passed cleanly.

On a Mac, with Xcode 26+ (Capacitor 8 requires iOS 15+ support) and Xcode
Command Line Tools installed:

1. `git clone`/copy this repo, `npm install`.
2. `npx cap sync ios` (re-copies `www/` + config; harmless to re-run).
3. `npx cap open ios` — opens `ios/App/App.xcodeproj` in Xcode.
4. Xcode resolves Swift Package Manager dependencies automatically (no
   CocoaPods/`pod install` needed — this project intentionally uses SPM).
5. Set your Apple Developer Team in the App target's Signing & Capabilities.
6. Pick a Simulator (or a real device, if the user later gets one) and Run.
7. For TestFlight/App Store: Product → Archive, then follow App Store
   Connect's normal submission flow. Icons/splash are already generated;
   replace `assets/icon.png` with a real 1024×1024 source and re-run
   `npm run cap:assets` first if you want higher-fidelity art.

Nothing else is blocked — everything up to "open Xcode and press Run" is
done.
