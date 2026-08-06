/**
 * Generates ready-to-post ad graphics for a seasonal campaign, straight
 * from the same content the website uses (src/content/campaigns.ts) — the
 * ad copy can never drift out of sync with what's on the site.
 *
 * Usage:
 *   npx tsx marketing/generate.ts <campaign-id> [--all]
 *
 *   npx tsx marketing/generate.ts summer-training
 *   npx tsx marketing/generate.ts --all
 *
 * Output: marketing/output/<campaign-id>/{feed,story}-{de,en}.png
 * feed  = 1080x1080 (IG feed post / general social square)
 * story = 1080x1920 (IG/FB story or reel cover)
 */
import {chromium} from 'playwright';
import {readFileSync, mkdirSync, writeFileSync, unlinkSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {campaigns} from '../src/content/campaigns';
import type {Campaign, Locale} from '../src/content/schema';

const __dirname = dirname(fileURLToPath(import.meta.url));

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function renderOne(campaign: Campaign, format: 'feed' | 'story', locale: Locale, outDir: string) {
  const templatePath = join(__dirname, 'templates', 'ad.html');
  let html = readFileSync(templatePath, 'utf-8');

  html = html
    .replace('{{LANG}}', locale)
    .replace('{{FORMAT}}', format)
    .replace('{{EYEBROW}}', escapeHtml(campaign.eyebrow[locale]))
    .replace('{{HEADLINE}}', escapeHtml(campaign.headline[locale]))
    .replace('{{BODY}}', escapeHtml(campaign.body[locale]))
    .replace('{{CTA}}', escapeHtml(campaign.ctaLabel[locale]));

  const tmpHtmlPath = join(outDir, `.tmp-${format}-${locale}.html`);
  writeFileSync(tmpHtmlPath, html);

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: {width: 1080, height: format === 'story' ? 1920 : 1080},
  });
  await page.goto(`file://${tmpHtmlPath}`);
  await page.waitForTimeout(150); // let @font-face finish swapping in
  const outPath = join(outDir, `${format}-${locale}.png`);
  await page.screenshot({path: outPath});
  await browser.close();
  unlinkSync(tmpHtmlPath);

  return outPath;
}

async function generate(campaignId: string) {
  const campaign = campaigns.find((c) => c.id === campaignId);
  if (!campaign) {
    console.error(`Unknown campaign id "${campaignId}". Known ids: ${campaigns.map((c) => c.id).join(', ')}`);
    process.exit(1);
  }

  const outDir = join(__dirname, 'output', campaignId);
  mkdirSync(outDir, {recursive: true});

  for (const format of ['feed', 'story'] as const) {
    for (const locale of ['de', 'en'] as const) {
      const outPath = await renderOne(campaign!, format, locale, outDir);
      console.log('wrote', outPath);
    }
  }
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: npx tsx marketing/generate.ts <campaign-id> | --all');
    process.exit(1);
  }

  if (arg === '--all') {
    for (const c of campaigns) await generate(c.id);
  } else {
    await generate(arg);
  }
}

main();
