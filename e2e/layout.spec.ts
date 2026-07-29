import {expect, test} from '@playwright/test';

test('header links to every main section in German', async ({page}) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', {name: 'Hauptnavigation'});
  await expect(nav.getByRole('link', {name: 'Leistungen'})).toBeVisible();
  await expect(nav.getByRole('link', {name: 'FAQ'})).toBeVisible();
});

test('locale switcher offers both languages, not just the other one', async ({page}) => {
  await page.goto('/');
  const group = page.getByRole('group', {name: 'Sprache wählen'});
  await expect(group.getByRole('link', {name: 'Deutsch'})).toBeVisible();
  await expect(group.getByRole('link', {name: 'English'})).toBeVisible();
  await expect(group.getByRole('link', {name: 'Deutsch'})).toHaveAttribute('aria-current', 'true');
});

test('locale switcher moves between German and English', async ({page}) => {
  await page.goto('/leistungen');
  await page.getByRole('link', {name: 'English'}).click();
  await expect(page).toHaveURL(/\/en\/services$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('switching language keeps you on the same page, not the homepage', async ({page}) => {
  await page.goto('/leistungen/performance-massage');
  await page.getByRole('link', {name: 'English'}).click();
  await expect(page).toHaveURL(/\/en\/services\/performance-massage$/);

  await page.getByRole('link', {name: 'Deutsch'}).click();
  await expect(page).toHaveURL(/\/leistungen\/performance-massage$/);
});

test('switcher is reachable on mobile', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/');
  await expect(page.getByRole('link', {name: 'English'})).toBeVisible();
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
