import { test, expect } from '@playwright/test'
import { signInAsStaff, staffCredentials } from './fixtures/staff-user'

test('anonymous visitor is sent to sign-in from staff routes', async ({ page }) => {
  test.skip(!process.env.E2E_SUPABASE_URL, 'Set E2E_SUPABASE_URL for live authentication journey')
  await page.goto('/staff')
  await expect(page).toHaveURL(/auth\/sign-in/)
})

test('staff can reach staff shell', async ({ page }) => {
  test.skip(!process.env.E2E_SUPABASE_URL || !staffCredentials.email || !staffCredentials.password, 'Set live Supabase and staff credentials for staff journey')
  await signInAsStaff(page)
  await page.goto('/staff')
  await expect(page.getByText('Rescue workspace')).toBeVisible()
})
