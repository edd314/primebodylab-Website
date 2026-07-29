import {expect, test} from '@playwright/test';

const redirects = [
  {from: '/appointments', to: '/buchen'},
  {from: '/faqs-2', to: '/faq'},
  {from: '/terms-conditions-and-privacy-policy', to: '/datenschutz'},
];

for (const {from, to} of redirects) {
  test(`${from} redirects to ${to}`, async ({page}) => {
    await page.goto(from);
    await expect(page).toHaveURL(new RegExp(`${to}$`));
  });
}

// /services needs no redirect — next-intl already serves it as the English
// route, with /leistungen as the German one. Redirecting it would break English.
test('/services remains the English services route', async ({page}) => {
  const response = await page.goto('/services');
  expect(response?.status()).toBe(200);
});
