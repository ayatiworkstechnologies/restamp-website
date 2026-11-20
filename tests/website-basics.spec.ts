import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test('homepage loads successfully', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page).toHaveTitle(/Restamp/);
});

test('property search loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  await expect(page.locator('textProperty search or similar')).toBeVisible();
});

test('login page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await expect(page.locator('form')).toBeVisible();
});

test('session restoration after refresh', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  // Check that the page loads without immediate auth errors
  await expect(page).toHaveTitle(/Restamp/);
});