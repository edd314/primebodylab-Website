import {expect, test} from '@playwright/test';

const pages = [
  {path: '/impressum', heading: 'Impressum'},
  {path: '/datenschutz', heading: 'Datenschutz'},
  {path: '/agb', heading: 'AGB'},
];

for (const {path, heading} of pages) {
  test(`${path} renders with its own heading`, async ({page}) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', {level: 1})).toContainText(heading);
  });
}

test('Impressum carries the operator details required in Germany', async ({page}) => {
  await page.goto('/impressum');
  const main = page.getByRole('main');
  await expect(main).toContainText('Eddie Ekanem');
  await expect(main).toContainText('85276 Pfaffenhofen');
  await expect(main).toContainText('154/214/50789');
  await expect(main).toContainText('book_primebodylab@proton.me');
});

test('legal pages exist in English too', async ({page}) => {
  const response = await page.goto('/en/imprint');
  expect(response?.status()).toBe(200);
});
