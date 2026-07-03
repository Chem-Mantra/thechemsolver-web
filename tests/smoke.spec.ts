import { test, expect } from '@playwright/test'

// Noise that's expected outside a real Vercel/production origin and isn't
// specific to this app: @vercel/analytics only resolves its script when
// actually deployed on Vercel (404s locally/in CI), and Google's ad-quality
// verification pings legitimately get blocked by the CSP wherever they run
// (same in prod) — neither indicates a real page bug.
const KNOWN_BENIGN_URL_NOISE = [/_vercel\/insights\/script\.js/, /adtrafficquality\.google/]

test.describe('smoke', () => {
  test('home page loads with no uncaught JS errors or unexpected failed requests', async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    const failedRequests: string[] = []
    page.on('response', (res) => {
      if (res.status() >= 400 && !KNOWN_BENIGN_URL_NOISE.some((pattern) => pattern.test(res.url()))) {
        failedRequests.push(`${res.status()} ${res.url()}`)
      }
    })

    const response = await page.goto('/')
    expect(response?.status()).toBeLessThan(400)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('navigation').getByText('TheChemSolver', { exact: true })).toBeVisible()

    expect(pageErrors, `Uncaught JS errors on /: ${pageErrors.join('\n')}`).toEqual([])
    expect(failedRequests, `Unexpected failed requests on /: ${failedRequests.join('\n')}`).toEqual([])
  })

  test('key routes respond', async ({ page }) => {
    for (const path of ['/labs', '/ap-chemistry', '/usnco', '/icho', '/organic-chemistry']) {
      const response = await page.goto(path)
      expect(response?.status(), `${path} should respond OK`).toBeLessThan(400)
    }
  })

  test('a lab simulator page renders its canvas/interactive root', async ({ page }) => {
    await page.goto('/labs/titration')
    await expect(page.locator('main, [class*="lab"], canvas, svg').first()).toBeVisible({ timeout: 10_000 })
  })
})
