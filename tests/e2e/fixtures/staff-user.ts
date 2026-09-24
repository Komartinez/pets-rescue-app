import type { Page } from '@playwright/test'

export const staffCredentials = {
  email: process.env.E2E_STAFF_EMAIL ?? '',
  password: process.env.E2E_STAFF_PASSWORD ?? '',
}

export async function signInAsStaff(page: Page) {
  await page.goto('/auth/sign-in')
  await page.getByLabel('Email address').fill(staffCredentials.email)
  await page.getByLabel('Password').fill(staffCredentials.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL(/staff|app/)
}
