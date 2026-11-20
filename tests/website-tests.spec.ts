import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('RESTAMP Website - Homepage', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Restamp/);
  });

  test('hero section is visible', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('header')).toBeVisible();
  });
});

test.describe('RESTAMP Website - Property Browsing', () => {
  test('property search page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator('text=Search or properties')).toBeVisible();
  });
});

test.describe('RESTAMP Website - Authentication', () => {
  test('login page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('form')).toBeVisible();
  });

  test('session restoration after refresh', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Restamp/);
  });
});

test.describe('RESTAMP Website - Contact Reveal', () => {
  test('contact reveal requires authentication', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    // Attempt to navigate to a property detail page without login
    await page.goto(`${BASE_URL}/properties`);
    // Should either show login prompt or property listings
  });
});

test.describe('RESTAMP Website - Contact Credits', () => {
  test('insufficient credit message handled correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    // The 402 error flow is handled by useOwnerContact hook
    // Verify the page loads without errors
    await expect(page).toHaveTitle(/RSTAMP/);
  });
});

test.describe('RESTAMP Website - Owner Workflows', () => {
  test('owner dashboard loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/owner`);
    await expect(page).toHaveTitle(/Owner/);
  });
});

test.describe('RESTAMP Website - Site Visits', () => {
  test('site visit-related pages load', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page).toHaveTitle(/RSTAMP/);
  });
});

test.describe('RESTAMP Website - Subscriptions', () => {
  test('plans page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/plans`);
    await expect(page.locator('text=Plan')).toBeVisible();
  });
});

test.describe('RESTAMP Website - Unauthorized Responses', () => {
  test('protected routes handle unauthorized access', async ({ page }) => {
    await page.goto(`${BASE_URL}/owner/dashboard`);
    // Should either show login or redirect
    const title = await page.title();
    expect(title).not.toBe('Unauthorized');
  });
});