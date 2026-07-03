import { defineConfig, devices } from '@playwright/test'

// Laptop-only mobile QA: no physical iPhone, no iOS Simulator. These
// projects emulate iPhone viewports/touch/UA in real browser engines
// instead. Chromium projects use channel: 'chrome' — the system-installed
// Google Chrome binary — instead of Playwright's own downloaded Chromium,
// since the downloaded browser is missing a shared library (libavif16) on
// this machine and installing it needs interactive sudo. System Chrome
// already has everything it needs. WebKit is the closer approximation to
// Safari/WKWebView but still needs that missing dependency — see
// docs/MOBILE_APP_SETUP.md.
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],
  timeout: 30_000,
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Playwright's iPhone device presets default to browserName: 'webkit'
    // (to mimic real Safari) — override to chromium/system-Chrome explicitly,
    // keeping only the viewport/UA/touch emulation from the preset.
    {
      name: 'iphone-se-chromium',
      use: { ...devices['iPhone SE'], browserName: 'chromium', channel: 'chrome' },
    },
    {
      name: 'iphone-14-chromium',
      use: { ...devices['iPhone 14'], browserName: 'chromium', channel: 'chrome' },
    },
    {
      name: 'iphone-14-pro-max-chromium',
      use: { ...devices['iPhone 14 Pro Max'], browserName: 'chromium', channel: 'chrome' },
    },
    // Requires: sudo npx playwright install-deps  (installs libwpe/libavif etc.)
    // Run with: npx playwright test --project=iphone-14-webkit
    {
      name: 'iphone-14-webkit',
      use: { ...devices['iPhone 14'], browserName: 'webkit' },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
