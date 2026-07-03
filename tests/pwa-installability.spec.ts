import { test, expect } from '@playwright/test'

// These checks mirror what Chrome's installability criteria and Lighthouse's
// PWA audit look for. Service workers only register in production builds
// (see RegisterServiceWorker.tsx), so this suite requires `npm run build`
// to have run first — the `test:e2e` npm script does this automatically.
test.describe('PWA installability', () => {
  test('manifest is linked and valid', async ({ page, baseURL }) => {
    await page.goto('/')

    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href')
    expect(manifestHref).toBeTruthy()

    const manifestUrl = new URL(manifestHref!, baseURL).toString()
    const res = await page.request.get(manifestUrl)
    expect(res.ok()).toBeTruthy()

    const manifest = await res.json()
    expect(manifest.name).toBeTruthy()
    expect(manifest.short_name).toBeTruthy()
    expect(manifest.start_url).toBeTruthy()
    expect(manifest.display).toBe('standalone')
    expect(Array.isArray(manifest.icons)).toBe(true)

    const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes)
    expect(sizes).toContain('192x192')
    expect(sizes).toContain('512x512')

    for (const icon of manifest.icons) {
      const iconUrl = new URL(icon.src, baseURL).toString()
      const iconRes = await page.request.get(iconUrl)
      expect(iconRes.ok(), `icon ${icon.src} should be reachable`).toBeTruthy()
    }
  })

  test('theme-color meta and apple-mobile-web-app tags are present', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#08020d')
    await expect(page.locator('meta[name="apple-mobile-web-app-capable"]')).toHaveAttribute('content', 'yes')
  })

  test('service worker registers in production build', async ({ page }) => {
    await page.goto('/')
    const hasSW = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false
      const reg = await navigator.serviceWorker.getRegistration()
      if (reg) return true
      // Registration is async (fires in a useEffect); give it a beat.
      return new Promise<boolean>((resolve) => {
        navigator.serviceWorker.ready.then(() => resolve(true)).catch(() => resolve(false))
        setTimeout(() => resolve(false), 5000)
      })
    })
    expect(hasSW).toBe(true)
  })

  test('offline fallback route renders', async ({ page }) => {
    const res = await page.goto('/offline')
    expect(res?.status()).toBeLessThan(400)
    await expect(page.getByText(/offline/i)).toBeVisible()
  })
})
