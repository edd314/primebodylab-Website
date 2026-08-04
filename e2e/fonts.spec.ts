import {expect, test} from '@playwright/test';

test('no requests to Google font hosts', async ({page}) => {
  const externalFontRequests: string[] = [];

  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
      externalFontRequests.push(url);
    }
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  expect(externalFontRequests).toEqual([]);
});

test('display font is applied to the page', async ({page}) => {
  await page.goto('/');
  const fontFamily = await page
    .locator('body')
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(fontFamily).toContain('Epilogue');
});
