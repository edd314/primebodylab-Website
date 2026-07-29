import {expect, test} from '@playwright/test';

const ACUITY = /acuityscheduling\.com|as\.me/;

test('no Acuity request before the user clicks', async ({page}) => {
  const requests: string[] = [];
  page.on('request', (r) => {
    if (ACUITY.test(r.url())) requests.push(r.url());
  });

  await page.goto('/buchen');
  await page.waitForLoadState('networkidle');

  expect(requests).toEqual([]);
});

test('Acuity loads after the user clicks', async ({page}) => {
  await page.goto('/buchen');

  const acuityRequest = page.waitForRequest(ACUITY, {timeout: 15_000});
  await page.getByTestId('load-booking').click();
  await acuityRequest;

  await expect(page.getByTestId('booking-frame')).toBeVisible();
});

test('deep link preselects the service', async ({page}) => {
  await page.goto('/buchen?service=performance-massage');
  await expect(page.getByTestId('selected-service')).toContainText('Performance Massage');
});

test('gate explains the third-party load before it happens', async ({page}) => {
  await page.goto('/buchen');
  await expect(page.getByTestId('booking-notice')).toContainText('Acuity');
});
