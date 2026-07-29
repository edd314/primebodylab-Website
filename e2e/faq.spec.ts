import {expect, test} from '@playwright/test';

test('renders every FAQ group', async ({page}) => {
  await page.goto('/faq');
  await expect(page.getByTestId('faq-group')).toHaveCount(3);
});

test('answers are collapsed until opened', async ({page}) => {
  await page.goto('/faq');
  const first = page.getByTestId('faq-item').first();
  await expect(first.locator('div[role="region"]')).toBeHidden();
  await first.getByRole('button').click();
  await expect(first.locator('div[role="region"]')).toBeVisible();
});

test('emits valid FAQPage structured data', async ({page}) => {
  await page.goto('/faq');
  // Select by type, not position — the layout also emits LocalBusiness JSON-LD.
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const data = scripts.map((s) => JSON.parse(s)).find((d) => d['@type'] === 'FAQPage');

  expect(data).toBeDefined();
  expect(data['@type']).toBe('FAQPage');
  expect(Array.isArray(data.mainEntity)).toBe(true);
  expect(data.mainEntity.length).toBeGreaterThan(10);
  expect(data.mainEntity[0]['@type']).toBe('Question');
  expect(data.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
});
