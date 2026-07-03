import { test, expect } from '@playwright/test'

test.describe('mobile navigation', () => {
  test('home page hamburger menu opens, links are tappable, and closes', async ({ page }) => {
    await page.goto('/')

    const menuButton = page.getByRole('button', { name: /open menu/i })
    await expect(menuButton).toBeVisible()

    // iOS Human Interface Guidelines minimum tap target is 44x44pt.
    const box = await menuButton.boundingBox()
    expect(box?.width).toBeGreaterThanOrEqual(44)
    expect(box?.height).toBeGreaterThanOrEqual(44)

    await menuButton.tap()
    const mobileMenu = page.getByTestId('mobile-menu')
    const usncoLink = mobileMenu.getByRole('link', { name: 'USNCO', exact: true })
    await expect(usncoLink).toBeVisible()

    await usncoLink.tap()
    await expect(page).toHaveURL(/\/usnco$/)
  })

  test('interior-page hamburger menu (NavWrapper) opens and navigates', async ({ page }) => {
    await page.goto('/labs')

    const menuButton = page.getByRole('button', { name: /open menu/i })
    await expect(menuButton).toBeVisible()
    await menuButton.tap()

    const mobileMenu = page.getByTestId('mobile-menu')
    const ichoLink = mobileMenu.getByRole('link', { name: 'IChO', exact: true })
    await expect(ichoLink).toBeVisible()
    await ichoLink.tap()
    await expect(page).toHaveURL(/\/icho$/)

    // Menu should not persist open across a route change.
    await expect(page.getByRole('button', { name: /close menu/i })).toHaveCount(0)
  })

  test('desktop-only nav links are hidden on mobile viewports, hamburger is the way in', async ({ page }) => {
    await page.goto('/labs')
    const desktopNav = page.locator('div.hidden.md\\:flex')
    await expect(desktopNav).not.toBeVisible()
    await expect(page.getByRole('button', { name: /open menu/i })).toBeVisible()
  })
})
