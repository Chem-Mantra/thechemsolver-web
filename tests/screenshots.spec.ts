import { test } from '@playwright/test'

// Human visual QA: captures full-page screenshots per device project into
// test-results/screenshots/<project>/<page>.png. Open them directly, or run
// `npm run test:e2e:report` for the interactive HTML report with these
// screenshots attached. This does NOT assert pixel-perfect output (no
// golden-image baseline exists yet) — it's for eyeballing, not CI gating.
const PAGES: Array<[name: string, path: string]> = [
  ['home', '/'],
  ['labs-index', '/labs'],
  ['titration-lab', '/labs/titration'],
  ['ap-chemistry', '/ap-chemistry'],
]

test.describe('visual screenshots', () => {
  for (const [name, path] of PAGES) {
    test(`capture ${name}`, async ({ page }, testInfo) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle').catch(() => {})
      const screenshot = await page.screenshot({ fullPage: true })
      await testInfo.attach(name, { body: screenshot, contentType: 'image/png' })
      await testInfo.outputPath() // ensures the per-test output dir exists
      await page.screenshot({
        path: `test-results/screenshots/${testInfo.project.name}/${name}.png`,
        fullPage: true,
      })
    })
  }
})
