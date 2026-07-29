import {expect, test} from '@playwright/test';

const paths = ['/', '/leistungen', '/buchen', '/faq', '/impressum'];

for (const path of paths) {
  test(`${path} has exactly one h1 and a document title`, async ({page}) => {
    await page.goto(path);
    await expect(page.getByRole('heading', {level: 1})).toHaveCount(1);
    expect(await page.title()).not.toBe('');
  });

  test(`${path} logs no console errors`, async ({page}) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });
}
