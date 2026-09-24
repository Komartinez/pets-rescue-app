import { test, expect } from '@playwright/test'

test('public shell remains usable on a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Create an account' })).toBeVisible()
  await page.getByRole('link', { name: 'Create an account' }).focus()
  await expect(page.getByRole('link', { name: 'Create an account' })).toBeFocused()
})

test('public shell remains usable on a wide viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Meet the animal/ })).toBeVisible()
})
