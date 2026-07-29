import {expect, test} from '@playwright/test';

test('German is served at the root without a prefix', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

test('English is served under /en', async ({page}) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('German services page uses the localised pathname', async ({page}) => {
  const response = await page.goto('/leistungen');
  expect(response?.status()).toBe(200);
});

test('English services page uses the English pathname', async ({page}) => {
  const response = await page.goto('/en/services');
  expect(response?.status()).toBe(200);
});

test('unknown locale returns 404', async ({page}) => {
  const response = await page.goto('/fr');
  expect(response?.status()).toBe(404);
});
