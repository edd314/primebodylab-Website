const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, 'output', 'print');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch();

  // ---------- Business card: 85mm x 55mm @ 300dpi = 1004 x 650 px ----------
  {
    const htmlPath = path.join(__dirname, 'templates', 'business-card.html');
    const page = await browser.newPage({ viewport: { width: 1004, height: 1300 } });
    await page.goto(`file://${htmlPath}`);
    await page.waitForTimeout(150);

    const front = page.locator('.front');
    const back = page.locator('.back');

    await front.screenshot({ path: path.join(outDir, 'business-card-front.png') });
    await back.screenshot({ path: path.join(outDir, 'business-card-back.png') });

    // Print-ready two-page PDF (page 1 = front, page 2 = back), exact physical card size
    await page.pdf({
      path: path.join(outDir, 'business-card.pdf'),
      width: '85mm',
      height: '55mm',
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    await page.close();
  }

  // ---------- Flyer: A5 148mm x 210mm @ 300dpi = 1748 x 2480 px ----------
  {
    const htmlPath = path.join(__dirname, 'templates', 'flyer.html');
    const page = await browser.newPage({ viewport: { width: 1748, height: 2480 } });
    await page.goto(`file://${htmlPath}`);
    await page.waitForTimeout(150);

    await page.screenshot({ path: path.join(outDir, 'flyer.png'), fullPage: true });

    await page.pdf({
      path: path.join(outDir, 'flyer.pdf'),
      width: '148mm',
      height: '210mm',
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    await page.close();
  }

  await browser.close();
  console.log('wrote business-card-front.png, business-card-back.png, business-card.pdf, flyer.png, flyer.pdf to', outDir);
})();
