import { test, expect } from '@playwright/test'

test('public visitor can see the applicant entry points', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Create an account' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'I already have an account' })).toBeVisible()
})

test('applicant can register and sign out', async ({ page }) => {
  test.skip(!process.env.E2E_SUPABASE_URL, 'Set E2E_SUPABASE_URL for live authentication journey')
  await page.goto('/auth/register')
  await expect(page.getByRole('heading', { name: 'Start your adoption journey' })).toBeVisible()
})
