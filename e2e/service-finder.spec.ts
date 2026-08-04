import {expect, test} from '@playwright/test';

test('walking the full quiz to a result deep-links the correct booking page', async ({page}) => {
  await page.goto('/');

  await page.getByTestId('service-finder-bubble').click();
  await expect(page.getByTestId('service-finder-panel')).toBeVisible();

  // Q1: goal -> "Relax and de-stress"
  await page.getByTestId('service-finder-option').filter({hasText: 'Entspannen'}).click();

  // Q2: massageType -> "Overall relaxation & stress relief"
  await page.getByTestId('service-finder-option').filter({hasText: 'Allgemeine Entspannung' }).click();

  // Q3: combine -> "No, just the treatment"
  await page.getByTestId('service-finder-option').filter({hasText: 'Nein, nur die Behandlung'}).click();

  // Q4: frequency -> "Just this once"
  await page.getByTestId('service-finder-option').filter({hasText: 'Nur dieses eine Mal'}).click();

  const result = page.getByTestId('service-finder-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Wellness & Recovery Massage');

  await result.getByRole('link', {name: 'Termin buchen'}).click();
  await expect(page).toHaveURL(/\/buchen\?service=wellness-recovery-massage/);
});

test('answering "Not sure" recommends a Strategy Session instead of a service', async ({page}) => {
  await page.goto('/');

  await page.getByTestId('service-finder-bubble').click();
  await page.getByTestId('service-finder-option').filter({hasText: 'nicht sicher'}).click();

  await expect(page.getByText('Strategy Session buchen')).toBeVisible();
});

test('the services page prompt opens the same quiz panel', async ({page}) => {
  await page.goto('/leistungen');
  await page.getByText('Nicht sicher, welche Leistung passt?').click();
  await expect(page.getByTestId('service-finder-panel')).toBeVisible();
});
