import {expect, test} from '@playwright/test';

test('header links to every main section in German', async ({page}) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', {name: 'Hauptnavigation'});
  await expect(nav.getByRole('link', {name: 'Leistungen'})).toBeVisible();
  await expect(nav.getByRole('link', {name: 'FAQ'})).toBeVisible();
});

test('locale switcher moves between German and English', async ({page}) => {
  await page.goto('/leistungen');
  await page.getByRole('link', {name: 'Switch to English'}).click();
  await expect(page).toHaveURL(/\/en\/services$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('footer exposes the Impressum within one click', async ({page}) => {
  await page.goto('/');
  const impressum = page.getByRole('link', {name: 'Impressum'});
  await expect(impressum).toBeVisible();
  await impressum.click();
  await expect(page).toHaveURL(/\/impressum$/);
});

test('footer carries the legally required business details', async ({page}) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  await expect(footer).toContainText('Eddie Ekanem');
  await expect(footer).toContainText('85276 Pfaffenhofen');
  await expect(footer).toContainText('154/214/50789');
});

test('mobile shows call and WhatsApp actions', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/');
  await expect(page.getByRole('link', {name: 'Anrufen'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'WhatsApp'})).toBeVisible();
});
