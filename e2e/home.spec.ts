import {expect, test} from '@playwright/test';

test('hero carries the brand promise', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', {level: 1})).toBeVisible();
});

test('three pillars are present', async ({page}) => {
  await page.goto('/');
  await expect(page.getByTestId('pillar')).toHaveCount(3);
});

test('all four testimonials render', async ({page}) => {
  await page.goto('/');
  await expect(page.getByTestId('testimonial')).toHaveCount(4);
});

test('hero booking CTA reaches the booking page', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('hero-cta').click();
  await expect(page).toHaveURL(/\/buchen$/);
});

test('English homepage renders the English headline', async ({page}) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', {level: 1})).toContainText('Move Better');
});

test('service ticker lists every service with its starting price', async ({page}) => {
  await page.goto('/');
  const ticker = page.getByTestId('service-ticker');
  await expect(ticker.getByTestId('ticker-item')).toHaveCount(5);
  await expect(ticker).toContainText('ab 80 €');
});
