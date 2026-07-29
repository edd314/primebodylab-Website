import {expect, test} from '@playwright/test';

// Next normalises the root URL by dropping the trailing slash, so the expected
// German/x-default href is the bare origin rather than origin + "/".
test('homepage declares hreflang for both locales plus x-default', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute(
    'href',
    'https://www.primebodylab.de',
  );
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    'https://www.primebodylab.de/en',
  );
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
    'href',
    'https://www.primebodylab.de',
  );
});

test('German services page canonical points at the German URL', async ({page}) => {
  await page.goto('/leistungen');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://www.primebodylab.de/leistungen',
  );
});

test('every page has a unique non-empty title', async ({page}) => {
  const paths = ['/', '/leistungen', '/buchen', '/faq', '/impressum'];
  const titles: string[] = [];

  for (const path of paths) {
    await page.goto(path);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(5);
    titles.push(title);
  }

  expect(new Set(titles).size).toBe(titles.length);
});

test('emits LocalBusiness structured data with matching NAP', async ({page}) => {
  await page.goto('/');
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const business = scripts
    .map((s) => JSON.parse(s))
    .find((d) => d['@type'] === 'HealthAndBeautyBusiness');

  expect(business).toBeDefined();
  expect(business.telephone).toBe('+49 176 83248394');
  expect(business.address.postalCode).toBe('85276');
  expect(business.address.addressLocality).toBe('Pfaffenhofen');
});

test('sitemap lists both locales', async ({request}) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const xml = await response.text();
  expect(xml).toContain('https://www.primebodylab.de/leistungen');
  expect(xml).toContain('https://www.primebodylab.de/en/services');
});
