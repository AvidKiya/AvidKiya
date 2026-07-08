import { test, expect } from '@playwright/test';

test('public pages load', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
  await page.goto('/shop');
  await expect(page.locator('body')).toBeVisible();
  await page.goto('/planner');
  await expect(page.locator('body')).toBeVisible();
});

test('health endpoint is healthy', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json.success).toBeTruthy();
});
