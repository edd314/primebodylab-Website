import {expect, test} from '@playwright/test';

test('overview lists all three services', async ({page}) => {
  await page.goto('/leistungen');
  await expect(page.getByTestId('service-card')).toHaveCount(3);
});

test('service card links to its detail page', async ({page}) => {
  await page.goto('/leistungen');
  await page.getByTestId('service-card').first().getByRole('link').first().click();
  await expect(page).toHaveURL(/\/leistungen\/performance-massage$/);
});

test('massage detail page shows the 80 euro starting price', async ({page}) => {
  await page.goto('/leistungen/performance-massage');
  await expect(page.getByTestId('duration-row').first()).toContainText('80 €');
});

test('durations without a price show an enquiry note, not a blank', async ({page}) => {
  await page.goto('/leistungen/performance-massage');
  const rows = page.getByTestId('duration-row');
  await expect(rows.nth(1)).toContainText('Auf Anfrage');
});

test('unknown service slug returns 404', async ({page}) => {
  const response = await page.goto('/leistungen/nonexistent');
  expect(response?.status()).toBe(404);
});

test('English detail page uses English pricing format', async ({page}) => {
  await page.goto('/en/services/performance-massage');
  await expect(page.getByTestId('duration-row').first()).toContainText('€80');
});
