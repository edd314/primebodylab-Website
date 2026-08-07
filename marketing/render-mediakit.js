const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const htmlPath = path.join(__dirname, 'templates', 'mediakit.html');

  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await page.goto(`file://${htmlPath}`);
  await page.waitForTimeout(150);

  await page.pdf({
    path: path.join(__dirname, 'output', 'eddie-media-kit.pdf'),
    width: '794px',
    height: '1123px',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  await page.screenshot({
    path: path.join(__dirname, 'output', 'eddie-media-kit.png'),
    fullPage: true,
  });

  await browser.close();
  console.log('wrote eddie-media-kit.pdf and .png');
})();
