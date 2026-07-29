# PrimeBodyLab Core Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a German-first, statically generated PrimeBodyLab site that fully replaces the current Squarespace site — homepage, services, booking, FAQ and legal pages in German and English.

**Architecture:** Next.js App Router with a `[locale]` segment, every page pre-rendered at build time and served from the CDN. A small edge middleware handles locale negotiation only. All copy lives in typed content files under `src/content/`, validated by Zod at build time, so the owner edits data rather than markup. Acuity is embedded behind a click-to-load gate so no third-party script runs without user action.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, next-intl v4, Zod, Vitest, Playwright, Vercel.

## Global Constraints

Every task's requirements implicitly include this section.

- **Default locale is `de`, unprefixed.** English is served under `/en`. `localePrefix: 'as-needed'`.
- **Both locales are mandatory at the type level.** A content record missing `de` or `en` must be a compile error, not a runtime blank.
- **Fonts must be self-hosted.** No request to `fonts.googleapis.com` or `fonts.gstatic.com` may appear in built output. `next/font/google` self-hosts at build time and satisfies this.
- **No cookie banner, and nothing that would require one.** No third-party script may load before an explicit user click.
- **Acuity is loaded only on click** via the booking gate. Never in a layout, never on mount.
- **Legal pages are three separate routes** — Impressum, Datenschutz, AGB. Never combined.
- **Client copy is reproduced verbatim.** Do not rewrite, improve, or soften the owner's existing wording.
- **No CMS, no dark mode, no unit tests on presentational markup.**
- **Colour tokens:** `bone #F6F3ED`, `ink #1D2420`, `forest #2E3A33`, `sage #3E6B54`, `muted #5C635A`, `line #DFDBD2`.
- **Typefaces:** Instrument Serif (display), Inter (body).
- **Business facts, exact:** phone `+49 176 83248394`, email `book_primebodylab@proton.me`, WhatsApp `https://wa.me/4917683248394`, address `Hans-Kohlman-str, 85276 Pfaffenhofen`, tax ID `154/214/50789`, owner `Eddie Ekanem`.

**Scope note:** This plan covers spec phases 1–3, which together produce a launchable replacement site. Spec phases 4 (local SEO pages, gift vouchers) and 5 (journal, analytics) are separate subsystems and get their own plans once this one is shipped.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `src/i18n/routing.ts` | Locale list, default locale, localised pathname map |
| `src/i18n/request.ts` | Per-request locale resolution for server components |
| `src/i18n/navigation.ts` | Locale-aware `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` |
| `src/proxy.ts` | Edge middleware — locale negotiation only |
| `src/content/schema.ts` | Zod schemas and the `Localized<T>` type |
| `src/content/site.ts` | NAP, socials, tax ID, opening info |
| `src/content/services.ts` | Services, prices, durations, Acuity appointment type IDs |
| `src/content/faqs.ts` | Q&As grouped by category |
| `src/content/testimonials.ts` | Reviews and attribution |
| `src/content/review.ts` | IDs of content still awaiting the owner's German approval |
| `src/app/[locale]/layout.tsx` | Locale layout, fonts, header/footer shell |
| `src/app/[locale]/page.tsx` | Homepage |
| `src/app/[locale]/services/page.tsx` | Services overview |
| `src/app/[locale]/services/[slug]/page.tsx` | Per-service detail |
| `src/app/[locale]/book/page.tsx` | Booking gate |
| `src/app/[locale]/faq/page.tsx` | FAQ + FAQPage JSON-LD |
| `src/app/[locale]/{imprint,privacy,terms}/page.tsx` | Legal pages |
| `src/app/sitemap.ts`, `src/app/robots.ts` | Crawl directives with hreflang alternates |
| `src/components/layout/*` | Header, Footer, LocaleSwitcher, MobileContactBar |
| `src/components/sections/*` | Hero, PillarGrid, FounderBlock, TestimonialRow, ServiceCard, ServiceDetail, FaqAccordion, CtaBand |
| `src/components/booking/BookingGate.tsx` | Click-to-load Acuity embed |
| `src/components/seo/JsonLd.tsx` | Structured data emitter |
| `src/styles/globals.css` | Tailwind import + `@theme` tokens |

Section components receive typed props and never import content files directly. Pages read content and pass it down. This is what makes owner edits safe.

---

### Task 1: Project scaffold and test tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `playwright.config.ts`
- Create: `src/app/layout.tsx`, `src/styles/globals.css`
- Test: `src/lib/__tests__/smoke.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: a working `npm run build`, `npm test` (Vitest), `npm run test:e2e` (Playwright)

- [ ] **Step 1: Scaffold the project**

```bash
cd /d/dev/sites/primebodylab
npx create-next-app@latest . --typescript --app --src-dir --no-tailwind --no-eslint --import-alias "@/*" --use-npm
```

Answer "no" to overwriting existing files if prompted about `.gitignore` — keep the existing one and merge Next's entries manually.

- [ ] **Step 2: Install dependencies**

```bash
npm install next-intl zod
npm install -D tailwindcss @tailwindcss/postcss vitest @vitejs/plugin-react vite-tsconfig-paths @playwright/test
npx playwright install chromium
```

- [ ] **Step 3: Configure PostCSS for Tailwind v4**

Create `postcss.config.mjs`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

- [ ] **Step 4: Create the stylesheet entry**

Create `src/styles/globals.css`:

```css
@import "tailwindcss";
```

- [ ] **Step 5: Configure Vitest**

Create `vitest.config.ts`:

```ts
import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
```

- [ ] **Step 6: Configure Playwright**

Create `playwright.config.ts`:

```ts
import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {baseURL: 'http://localhost:3000'},
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
```

- [ ] **Step 7: Add scripts to `package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 8: Write a failing smoke test**

Create `src/lib/__tests__/smoke.test.ts`:

```ts
import {describe, expect, it} from 'vitest';
import {formatPrice} from '@/lib/format';

describe('formatPrice', () => {
  it('formats euros in German convention', () => {
    expect(formatPrice(80, 'de')).toBe('80 €');
  });

  it('formats euros in English convention', () => {
    expect(formatPrice(80, 'en')).toBe('€80');
  });
});
```

- [ ] **Step 9: Run it and confirm it fails**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "@/lib/format"`

- [ ] **Step 10: Implement the minimal module**

Create `src/lib/format.ts`:

```ts
export type Locale = 'de' | 'en';

export function formatPrice(amount: number, locale: Locale): string {
  return locale === 'de' ? `${amount} €` : `€${amount}`;
}
```

- [ ] **Step 11: Run tests and the build**

Run: `npm test && npm run build`
Expected: 2 tests pass; build completes without errors.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with Tailwind, Vitest and Playwright"
```

---

### Task 2: Design tokens and self-hosted fonts

**Files:**
- Modify: `src/styles/globals.css`
- Create: `src/lib/fonts.ts`
- Modify: `src/app/layout.tsx`
- Test: `e2e/fonts.spec.ts`

**Interfaces:**
- Consumes: `src/styles/globals.css` from Task 1
- Produces: `displayFont`, `bodyFont` from `@/lib/fonts` (each a `NextFont` with a `.variable` class string); CSS custom properties `--color-bone`, `--color-ink`, `--color-forest`, `--color-sage`, `--color-muted`, `--color-line`, and Tailwind utilities `bg-bone`, `text-ink`, `font-display`, `font-body`

- [ ] **Step 1: Write the failing DSGVO font test**

Create `e2e/fonts.spec.ts`:

```ts
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
  expect(fontFamily).toContain('Inter');
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm run test:e2e -- fonts.spec.ts`
Expected: FAIL — the second test fails because no font is applied yet.

- [ ] **Step 3: Define the fonts**

Create `src/lib/fonts.ts`:

```ts
import {Instrument_Serif, Inter} from 'next/font/google';

/**
 * The CSS variable names here must NOT match the Tailwind theme keys
 * (`--font-display` / `--font-body`), or `@theme` ends up defining a variable
 * in terms of itself and the font silently falls back.
 */
export const displayFont = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  display: 'swap',
  variable: '--font-instrument-serif',
});

export const bodyFont = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});
```

`latin-ext` is required — German umlauts (ä, ö, ü, ß) fall outside the `latin` subset.

- [ ] **Step 4: Define the theme tokens**

Replace `src/styles/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-bone: #F6F3ED;
  --color-ink: #1D2420;
  --color-forest: #2E3A33;
  --color-sage: #3E6B54;
  --color-muted: #5C635A;
  --color-line: #DFDBD2;

  --font-display: var(--font-instrument-serif), Georgia, serif;
  --font-body: var(--font-inter), system-ui, sans-serif;
}

html {
  background-color: var(--color-bone);
  color: var(--color-ink);
}

body {
  font-family: var(--font-body);
}

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 400;
}
```

- [ ] **Step 5: Wire fonts into the root layout**

Replace `src/app/layout.tsx`:

```tsx
import type {ReactNode} from 'react';
import {bodyFont, displayFont} from '@/lib/fonts';
import '@/styles/globals.css';

export default function RootLayout({children}: {children: ReactNode}) {
  return children;
}

export const metadata = {
  metadataBase: new URL('https://www.primebodylab.de'),
};

export {bodyFont, displayFont};
```

The `[locale]` layout in Task 5 renders `<html>` and applies the font variables. This root layout exists only to import global CSS and set `metadataBase`.

- [ ] **Step 6: Add a temporary homepage so the test has something to load**

Create `src/app/page.tsx`:

```tsx
import {bodyFont, displayFont} from '@/lib/fonts';

export default function TempHome() {
  return (
    <html lang="de" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="bg-bone text-ink">
        <h1 className="font-display text-4xl">PrimeBodyLab</h1>
      </body>
    </html>
  );
}
```

This file is deleted in Task 5 once `[locale]` routing exists.

- [ ] **Step 7: Run the tests**

Run: `npm run test:e2e -- fonts.spec.ts`
Expected: PASS — both tests green, no external font requests.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add design tokens and self-hosted Instrument Serif + Inter"
```

---

### Task 3: Content schemas and validation

**Files:**
- Create: `src/content/schema.ts`, `src/content/site.ts`, `src/content/review.ts`
- Test: `src/content/__tests__/schema.test.ts`, `src/content/__tests__/parity.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type Locale = 'de' | 'en'`
  - `type Localized<T> = {de: T; en: T}`
  - `localized<T extends ZodTypeAny>(inner: T)` → Zod schema for `{de, en}`
  - `siteSchema`, and `site` (validated `Site` object) from `@/content/site`
  - `pendingGermanReview: string[]` from `@/content/review`

- [ ] **Step 1: Write the failing schema test**

Create `src/content/__tests__/schema.test.ts`:

```ts
import {describe, expect, it} from 'vitest';
import {localized} from '@/content/schema';
import {z} from 'zod';

describe('localized', () => {
  it('accepts a record with both locales', () => {
    const schema = localized(z.string());
    expect(schema.parse({de: 'Hallo', en: 'Hello'})).toEqual({
      de: 'Hallo',
      en: 'Hello',
    });
  });

  it('rejects a record missing German', () => {
    const schema = localized(z.string());
    expect(() => schema.parse({en: 'Hello'})).toThrow();
  });

  it('rejects a record missing English', () => {
    const schema = localized(z.string());
    expect(() => schema.parse({de: 'Hallo'})).toThrow();
  });

  it('rejects an empty string in either locale', () => {
    const schema = localized(z.string().min(1));
    expect(() => schema.parse({de: '', en: 'Hello'})).toThrow();
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- schema`
Expected: FAIL — `Failed to resolve import "@/content/schema"`

- [ ] **Step 3: Implement the schema helpers**

Create `src/content/schema.ts`:

```ts
import {z, type ZodTypeAny} from 'zod';

export const LOCALES = ['de', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export type Localized<T> = {de: T; en: T};

export function localized<T extends ZodTypeAny>(inner: T) {
  return z.object({de: inner, en: inner});
}

export const localizedText = localized(z.string().min(1));

export const siteSchema = z.object({
  ownerName: z.string().min(1),
  phone: z.string().min(1),
  phoneHref: z.string().startsWith('tel:'),
  email: z.string().email(),
  whatsapp: z.string().url(),
  street: z.string().min(1),
  postcode: z.string().min(1),
  city: z.string().min(1),
  country: z.string().length(2),
  taxId: z.string().min(1),
  socials: z.object({
    instagram: z.string().url(),
    tiktok: z.string().url(),
    facebook: z.string().url(),
  }),
  qualifications: localized(z.array(z.string().min(1)).min(1)),
});

export type Site = z.infer<typeof siteSchema>;
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npm test -- schema`
Expected: PASS — 4 tests.

- [ ] **Step 5: Make `schema.ts` the single source of the `Locale` type**

Task 1 declared `Locale` in `src/lib/format.ts` as a stand-in. Now that the real
one exists, delete the duplicate and import it, so there is exactly one definition
in the codebase:

```ts
import type {Locale} from '@/content/schema';

export function formatPrice(amount: number, locale: Locale): string {
  return locale === 'de' ? `${amount} €` : `€${amount}`;
}
```

Run: `npm test`
Expected: PASS — the Task 1 smoke tests still pass against the shared type.

- [ ] **Step 6: Write the failing site content test**

Create `src/content/__tests__/parity.test.ts`:

```ts
import {describe, expect, it} from 'vitest';
import {site} from '@/content/site';
import {pendingGermanReview} from '@/content/review';

describe('site content', () => {
  it('carries the owner’s exact business details', () => {
    expect(site.phone).toBe('+49 176 83248394');
    expect(site.email).toBe('book_primebodylab@proton.me');
    expect(site.taxId).toBe('154/214/50789');
    expect(site.postcode).toBe('85276');
    expect(site.city).toBe('Pfaffenhofen');
  });

  it('lists qualifications in both locales with equal length', () => {
    expect(site.qualifications.de).toHaveLength(site.qualifications.en.length);
  });
});

describe('review register', () => {
  it('is an array of string ids', () => {
    expect(Array.isArray(pendingGermanReview)).toBe(true);
    for (const id of pendingGermanReview) {
      expect(typeof id).toBe('string');
    }
  });
});
```

- [ ] **Step 7: Run it and confirm it fails**

Run: `npm test -- parity`
Expected: FAIL — `Failed to resolve import "@/content/site"`

- [ ] **Step 8: Implement the site content**

Create `src/content/site.ts`:

```ts
import {siteSchema, type Site} from './schema';

const data: Site = {
  ownerName: 'Eddie Ekanem',
  phone: '+49 176 83248394',
  phoneHref: 'tel:+4917683248394',
  email: 'book_primebodylab@proton.me',
  whatsapp: 'https://wa.me/4917683248394',
  street: 'Hans-Kohlman-str',
  postcode: '85276',
  city: 'Pfaffenhofen',
  country: 'DE',
  taxId: '154/214/50789',
  socials: {
    instagram: 'https://www.instagram.com/primebodylab',
    tiktok: 'https://www.tiktok.com/@primebodylab',
    facebook: 'https://www.facebook.com/primebodylab',
  },
  qualifications: {
    de: [
      'Zertifizierter Personal Trainer',
      'Zertifizierter Sportmasseur',
      'Zertifizierter Stretch-Spezialist',
    ],
    en: [
      'Certified Personal Trainer',
      'Certified Sports Massage Therapist',
      'Certified Assisted Stretch Specialist',
    ],
  },
};

export const site = siteSchema.parse(data);
```

Social URLs are placeholders pending confirmation — flag them to the client before launch.

- [ ] **Step 9: Implement the review register**

Create `src/content/review.ts`:

```ts
/**
 * Content ids whose German text is our translation of the owner's English,
 * not the owner's own approved wording.
 *
 * Clear an id from this list once Eddie has approved that German copy.
 * `npm run check:release` fails while this array is non-empty.
 */
export const pendingGermanReview: string[] = [];
```

- [ ] **Step 10: Run tests**

Run: `npm test`
Expected: PASS — all tests green.

- [ ] **Step 11: Add the release gate script**

Create `scripts/check-release.mjs`:

```js
import {pendingGermanReview} from '../src/content/review.ts';

if (pendingGermanReview.length > 0) {
  console.error('Release blocked — German copy awaiting owner approval:');
  for (const id of pendingGermanReview) console.error(`  - ${id}`);
  process.exit(1);
}

console.log('Release gate passed — all German copy approved.');
```

Add to `package.json` scripts:

```json
"check:release": "node --experimental-strip-types scripts/check-release.mjs"
```

- [ ] **Step 12: Verify the gate**

Run: `npm run check:release`
Expected: `Release gate passed — all German copy approved.`

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add content schemas, site details and German review gate"
```

---

### Task 4: Services, FAQs and testimonials content

**Files:**
- Create: `src/content/services.ts`, `src/content/faqs.ts`, `src/content/testimonials.ts`
- Modify: `src/content/schema.ts`
- Test: `src/content/__tests__/services.test.ts`

**Interfaces:**
- Consumes: `localized`, `localizedText`, `Localized`, `Locale` from `@/content/schema`
- Produces:
  - `services: Service[]` where `Service = {slug: string; acuityTypeId: string | null; name: Localized<string>; tagline: Localized<string>; description: Localized<string>; includes: Localized<string[]>; durations: {minutes: number; price: number | null}[]}`
  - `faqs: FaqGroup[]` where `FaqGroup = {id: string; title: Localized<string>; items: {id: string; question: Localized<string>; answer: Localized<string>}[]}`
  - `testimonials: Testimonial[]` where `Testimonial = {id: string; author: string; rating: number; quote: Localized<string>}`
  - `getService(slug: string): Service | undefined`

- [ ] **Step 1: Write the failing services test**

Create `src/content/__tests__/services.test.ts`:

```ts
import {describe, expect, it} from 'vitest';
import {getService, services} from '@/content/services';
import {faqs} from '@/content/faqs';
import {testimonials} from '@/content/testimonials';

describe('services', () => {
  it('defines the three services the business offers', () => {
    expect(services.map((s) => s.slug)).toEqual([
      'performance-massage',
      'stretch-therapy',
      'performance-coaching',
    ]);
  });

  it('gives performance massage a starting price of 80 euro', () => {
    const massage = getService('performance-massage')!;
    const prices = massage.durations.map((d) => d.price);
    expect(Math.min(...prices.filter((p): p is number => p !== null))).toBe(80);
  });

  it('offers massage in 60, 90 and 120 minutes', () => {
    const massage = getService('performance-massage')!;
    expect(massage.durations.map((d) => d.minutes)).toEqual([60, 90, 120]);
  });

  it('returns undefined for an unknown slug', () => {
    expect(getService('nope')).toBeUndefined();
  });

  it('has a unique slug per service', () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('faqs', () => {
  it('has a unique id for every question', () => {
    const ids = faqs.flatMap((g) => g.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('groups questions under booking, treatments and coaching', () => {
    expect(faqs.map((g) => g.id)).toEqual(['booking', 'treatments', 'coaching']);
  });
});

describe('testimonials', () => {
  it('carries the four reviews from the current site', () => {
    expect(testimonials).toHaveLength(4);
  });

  it('rates every review between 1 and 5', () => {
    for (const t of testimonials) {
      expect(t.rating).toBeGreaterThanOrEqual(1);
      expect(t.rating).toBeLessThanOrEqual(5);
    }
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- services`
Expected: FAIL — `Failed to resolve import "@/content/services"`

- [ ] **Step 3: Add the schemas**

Append to `src/content/schema.ts`:

```ts
export const durationSchema = z.object({
  minutes: z.number().int().positive(),
  price: z.number().positive().nullable(),
});

export const serviceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  acuityTypeId: z.string().nullable(),
  name: localizedText,
  tagline: localizedText,
  description: localizedText,
  includes: localized(z.array(z.string().min(1)).min(1)),
  durations: z.array(durationSchema).min(1),
});

export const faqGroupSchema = z.object({
  id: z.string().min(1),
  title: localizedText,
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        question: localizedText,
        answer: localizedText,
      }),
    )
    .min(1),
});

export const testimonialSchema = z.object({
  id: z.string().min(1),
  author: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  quote: localizedText,
});

export type Service = z.infer<typeof serviceSchema>;
export type FaqGroup = z.infer<typeof faqGroupSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
```

- [ ] **Step 4: Implement services content**

Create `src/content/services.ts`:

```ts
import {z} from 'zod';
import {serviceSchema, type Service} from './schema';

const data: Service[] = [
  {
    slug: 'performance-massage',
    acuityTypeId: null,
    name: {de: 'Performance Massage', en: 'Performance Massage'},
    tagline: {de: 'Schneller regenerieren', en: 'Recover Faster'},
    description: {
      de: 'Therapeutische Massage, die Muskelverspannungen reduziert, die Regeneration beschleunigt und die sportliche Leistung optimiert.',
      en: 'Therapeutic massage designed to minimise muscle tension, accelerate recovery, and optimise athletic performance.',
    },
    includes: {
      de: [
        'Sportmassage',
        'Tiefengewebsmassage',
        'Regenerationsmassage',
        'Triggerpunkt-Therapie',
        'Brasilianische Lymphdrainage',
        'Myofasziale Entspannung',
      ],
      en: [
        'Sports Massage',
        'Deep Tissue Massage',
        'Recovery Massage',
        'Trigger Point Therapy',
        'Brazilian Lymphatic Drainage',
        'Myofascial Release',
      ],
    },
    durations: [
      {minutes: 60, price: 80},
      {minutes: 90, price: null},
      {minutes: 120, price: null},
    ],
  },
  {
    slug: 'stretch-therapy',
    acuityTypeId: null,
    name: {de: 'Assistiertes Stretching', en: 'Assisted Stretch Therapy'},
    tagline: {de: 'Besser bewegen', en: 'Move Better'},
    description: {
      de: 'Spezialisiertes Stretching-Programm zur Verbesserung der Mobilität, Steigerung der Flexibilität und Wiederherstellung der Bewegungsfreiheit.',
      en: 'Specialised stretching programme designed to enhance mobility, increase flexibility, and restore freedom of movement.',
    },
    includes: {
      de: [
        'Assistiertes Stretching',
        'PNF-Stretching',
        'Mobilitätstherapie',
        'Verbesserung des Bewegungsumfangs',
        'Wiederherstellung der Bewegung',
      ],
      en: [
        'Assisted Stretching',
        'PNF Stretching',
        'Mobility Therapy',
        'Range of Motion Improvement',
        'Movement Restoration',
      ],
    },
    durations: [
      {minutes: 60, price: null},
      {minutes: 90, price: null},
      {minutes: 120, price: null},
    ],
  },
  {
    slug: 'performance-coaching',
    acuityTypeId: null,
    name: {de: 'Performance Coaching', en: 'Performance Coaching'},
    tagline: {de: 'Klüger trainieren', en: 'Train Smarter'},
    description: {
      de: 'Individuelles Coaching-Programm, das Kraft aufbaut, Bewegungsmuster verbessert und nachhaltige Ergebnisse erzielt.',
      en: 'Individualised coaching programme designed to build strength, improve movement patterns, and produce sustainable outcomes.',
    },
    includes: {
      de: [
        'Persönliches Performance-Programm',
        'Wöchentliche Betreuung',
        'Ernährungsberatung',
        'Integrierte Regeneration',
        'Fortschrittskontrolle',
      ],
      en: [
        'Personalised Performance Programme',
        'Weekly Accountability',
        'Nutrition Guidance',
        'Recovery Integration',
        'Progress Tracking',
      ],
    },
    durations: [{minutes: 30, price: null}],
  },
];

export const services = z.array(serviceSchema).parse(data);

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
```

`acuityTypeId` is `null` and prices are `null` until the client supplies them. The booking gate in Task 9 handles both cases explicitly.

- [ ] **Step 5: Implement FAQs content**

Create `src/content/faqs.ts`. Transcribe all questions from `primebodylab.de/faqs-2` verbatim into the English fields, with German translations alongside. Structure:

```ts
import {z} from 'zod';
import {faqGroupSchema, type FaqGroup} from './schema';

const data: FaqGroup[] = [
  {
    id: 'booking',
    title: {de: 'Buchung & Termine', en: 'Booking & Appointments'},
    items: [
      {
        id: 'walk-ins',
        question: {de: 'Bieten Sie Walk-ins an?', en: 'Do you accept walk-ins?'},
        answer: {
          de: 'Nein. PrimeBodyLab arbeitet ausschließlich nach Terminvereinbarung, damit jeder Kunde ein persönliches, fokussiertes und erstklassiges Erlebnis erhält.',
          en: 'No. PrimeBodyLab operates strictly by appointment to ensure every client receives a personalised, focused, and premium experience.',
        },
      },
      {
        id: 'cancellation',
        question: {
          de: 'Wie lautet Ihre Stornierungsrichtlinie?',
          en: 'What is your cancellation policy?',
        },
        answer: {
          de: 'Termine können bis zu 24 Stunden vor dem vereinbarten Termin storniert oder verschoben werden. Bei verspäteter Absage oder Nichterscheinen kann eine Stornogebühr anfallen.',
          en: 'Appointments can be cancelled or rescheduled up to 24 hours before your scheduled session. Late cancellations or missed appointments may incur a cancellation fee.',
        },
      },
      // ids: which-service, gift-vouchers — see the table below
    ],
  },
  {
    id: 'treatments',
    title: {
      de: 'Massage & Assistiertes Stretching',
      en: 'Performance Massage & Assisted Stretch Therapy',
    },
    items: [
      // ids: what-to-wear, preparation, session-length, what-to-expect,
      // combining-services, non-athletes — see the table below
    ],
  },
  {
    id: 'coaching',
    title: {de: 'Performance Coaching', en: 'Performance Coaching'},
    items: [
      // ids: gym-membership, beginners, how-online-works, communication-frequency,
      // personalisation, injuries, nutrition, results-timeline, consistency
      // — see the table below
    ],
  },
];

export const faqs = z.array(faqGroupSchema).parse(data);
```

**Transcribe the remaining 17 questions before this task is complete.** Do not paraphrase and do not write the answers from memory — open `https://www.primebodylab.de/faqs-2` and copy the English wording exactly as it appears, then translate each into German.

Every question, with its required `id` and English heading:

| Group | `id` | English question |
| --- | --- | --- |
| booking | `walk-ins` | Do you accept walk-ins? *(written above)* |
| booking | `cancellation` | What is your cancellation policy? *(written above)* |
| booking | `which-service` | Which service is right for me? |
| booking | `gift-vouchers` | Do you offer gift vouchers? |
| treatments | `what-to-wear` | What should I wear? |
| treatments | `preparation` | How should I prepare for my appointments? |
| treatments | `session-length` | How long are the sessions? |
| treatments | `what-to-expect` | What to Expect During Your Session |
| treatments | `combining-services` | Can I combine services? |
| treatments | `non-athletes` | Is PrimeBodyLab suitable for non-athletes? |
| coaching | `gym-membership` | Do I need a gym membership? |
| coaching | `beginners` | Is this coaching suitable for beginners? |
| coaching | `how-online-works` | How does online coaching work? |
| coaching | `communication-frequency` | How often do we communicate? |
| coaching | `personalisation` | Will my Performance Programme be personalised? |
| coaching | `injuries` | What if I have an injury or movement limitation? |
| coaching | `nutrition` | Do you provide nutrition advice? |
| coaching | `results-timeline` | How long before I see results? |
| coaching | `consistency` | What if I've struggled to stay consistent in the past? |

The test in Step 1 asserts all ids are unique and the groups are ordered
`booking`, `treatments`, `coaching`. Add every id to `pendingGermanReview` in
`src/content/review.ts` — these German translations are ours, not the owner's.

- [ ] **Step 6: Note the cancellation policy discrepancy**

The FAQ page states 24 hours; the homepage footer states 24 hours for studio and 48 for mobile. Transcribe both verbatim as they appear and add a line to `docs/client-questions.md`:

```markdown
# Open questions for Eddie

- Cancellation policy: the FAQ says 24 hours, the homepage says 24 hours (studio)
  and 48 hours (mobile). Which is correct? Both are currently reproduced as written.
```

- [ ] **Step 7: Implement testimonials content**

Open `https://www.primebodylab.de/` and copy each of the four reviews exactly as written. Do not summarise or improve them — these are real people's words about a real business.

Required ids and authors, in the order they appear on the live homepage:

| `id` | `author` | Notes |
| --- | --- | --- |
| `tom-steggemen` | Tom Steggemen | |
| `dr-verena` | Dr. Verena | Mentions migraine relief — reproduce verbatim |
| `michael-oatah` | Michael Oatah | |
| `dr-moritz` | Dr. Moritz | Praises therapist expertise |

Ratings are 4 or 5 as displayed per review; read each one off the page rather than assuming five.

```ts
import {z} from 'zod';
import {testimonialSchema, type Testimonial} from './schema';

const data: Testimonial[] = [
  {
    id: 'tom-steggemen',
    author: 'Tom Steggemen',
    rating: 5, // confirm against the live page
    quote: {
      de: '…', // German translation of the English below
      en: '…', // verbatim from primebodylab.de
    },
  },
  // …three more, same shape
];

export const testimonials = z.array(testimonialSchema).parse(data);
```

Add all four German quotes to `pendingGermanReview`. Translated testimonials are our words in someone else's mouth, so Eddie must sign these off before launch.

- [ ] **Step 8: Run the tests**

Run: `npm test`
Expected: PASS — all content tests green.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add services, FAQ and testimonial content in both locales"
```

---

### Task 5: i18n routing

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`, `src/proxy.ts`
- Create: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`
- Delete: `src/app/page.tsx`
- Modify: `next.config.ts`
- Test: `e2e/routing.spec.ts`

**Interfaces:**
- Consumes: `displayFont`, `bodyFont` from `@/lib/fonts`
- Produces: `routing` from `@/i18n/routing`; `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` from `@/i18n/navigation`

- [ ] **Step 1: Write the failing routing test**

Create `e2e/routing.spec.ts`:

```ts
import {expect, test} from '@playwright/test';

test('German is served at the root without a prefix', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

test('English is served under /en', async ({page}) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('German services page uses the localised pathname', async ({page}) => {
  const response = await page.goto('/leistungen');
  expect(response?.status()).toBe(200);
});

test('English services page uses the English pathname', async ({page}) => {
  const response = await page.goto('/en/services');
  expect(response?.status()).toBe(200);
});

test('unknown locale returns 404', async ({page}) => {
  const response = await page.goto('/fr');
  expect(response?.status()).toBe(404);
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm run test:e2e -- routing.spec.ts`
Expected: FAIL — `/en` and `/leistungen` return 404.

- [ ] **Step 3: Define routing**

Create `src/i18n/routing.ts`:

```ts
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/services': {de: '/leistungen', en: '/services'},
    '/services/[slug]': {de: '/leistungen/[slug]', en: '/services/[slug]'},
    '/book': {de: '/buchen', en: '/book'},
    '/faq': {de: '/faq', en: '/faq'},
    '/imprint': {de: '/impressum', en: '/imprint'},
    '/privacy': {de: '/datenschutz', en: '/privacy'},
    '/terms': {de: '/agb', en: '/terms'},
  },
});
```

Internal paths are the canonical routes used in the `app/` directory. External paths are what users and search engines see.

- [ ] **Step 4: Create the request config**

Create `src/i18n/request.ts`:

```ts
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {locale, messages: {}};
});
```

`messages` is empty because all copy lives in `src/content/*`, not in translation catalogues. next-intl handles routing here, not message lookup.

- [ ] **Step 5: Create the navigation helpers**

Create `src/i18n/navigation.ts`:

```ts
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
```

- [ ] **Step 6: Create the middleware**

Create `src/proxy.ts`:

```ts
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
```

On Next.js 15 or earlier this file is named `src/middleware.ts` with identical contents. Next.js 16 renamed it to `proxy.ts`. Check which major `create-next-app` installed and name the file accordingly.

- [ ] **Step 7: Wire the plugin into Next config**

Replace `next.config.ts`:

```ts
import createNextIntlPlugin from 'next-intl/plugin';
import type {NextConfig} from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 8: Create the locale layout**

Create `src/app/[locale]/layout.tsx`:

```tsx
import type {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {bodyFont, displayFont} from '@/lib/fonts';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

type Props = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="bg-bone text-ink antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Create a minimal homepage and delete the temporary one**

Create `src/app/[locale]/page.tsx`:

```tsx
import {setRequestLocale} from 'next-intl/server';

type Props = {params: Promise<{locale: string}>};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return <h1 className="font-display text-5xl">PrimeBodyLab</h1>;
}
```

Create `src/app/[locale]/services/page.tsx`:

```tsx
import {setRequestLocale} from 'next-intl/server';

type Props = {params: Promise<{locale: string}>};

export default async function ServicesPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return <h1 className="font-display text-5xl">Leistungen</h1>;
}
```

Then:

```bash
rm src/app/page.tsx
```

- [ ] **Step 10: Update the root layout**

Replace `src/app/layout.tsx`:

```tsx
import type {ReactNode} from 'react';
import '@/styles/globals.css';

export const metadata = {
  metadataBase: new URL('https://www.primebodylab.de'),
};

export default function RootLayout({children}: {children: ReactNode}) {
  return children;
}
```

Then update `src/app/[locale]/layout.tsx` to import fonts directly from `@/lib/fonts` (already done in Step 8) and remove the re-export line added in Task 2 Step 5.

- [ ] **Step 11: Run the tests**

Run: `npm run test:e2e -- routing.spec.ts fonts.spec.ts`
Expected: PASS — all routing and font tests green.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add German-default i18n routing with localised pathnames"
```

---

### Task 6: Layout shell — header, footer, mobile contact bar

**Files:**
- Create: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/LocaleSwitcher.tsx`, `src/components/layout/MobileContactBar.tsx`
- Create: `src/lib/nav.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Test: `e2e/layout.spec.ts`

**Interfaces:**
- Consumes: `site` from `@/content/site`; `Link`, `usePathname`, `useRouter` from `@/i18n/navigation`; `Locale` from `@/content/schema`
- Produces: `navItems: {href: string; label: Localized<string>}[]` from `@/lib/nav`; `<Header locale>`, `<Footer locale>`, `<LocaleSwitcher>`, `<MobileContactBar>`

- [ ] **Step 1: Write the failing layout test**

Create `e2e/layout.spec.ts`:

```ts
import {expect, test} from '@playwright/test';

test('header links to every main section in German', async ({page}) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', {name: 'Hauptnavigation'});
  await expect(nav.getByRole('link', {name: 'Leistungen'})).toBeVisible();
  await expect(nav.getByRole('link', {name: 'FAQ'})).toBeVisible();
});

test('locale switcher moves between German and English', async ({page}) => {
  await page.goto('/leistungen');
  await page.getByRole('link', {name: 'EN'}).click();
  await expect(page).toHaveURL(/\/en\/services$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('footer exposes the Impressum within one click', async ({page}) => {
  await page.goto('/');
  const impressum = page.getByRole('link', {name: 'Impressum'});
  await expect(impressum).toBeVisible();
  await impressum.click();
  await expect(page).toHaveURL(/\/impressum$/);
});

test('footer carries the legally required business details', async ({page}) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  await expect(footer).toContainText('Eddie Ekanem');
  await expect(footer).toContainText('85276 Pfaffenhofen');
  await expect(footer).toContainText('154/214/50789');
});

test('mobile shows call and WhatsApp actions', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/');
  await expect(page.getByRole('link', {name: 'Anrufen'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'WhatsApp'})).toBeVisible();
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm run test:e2e -- layout.spec.ts`
Expected: FAIL — no navigation element exists.

- [ ] **Step 3: Define the navigation model**

Create `src/lib/nav.ts`:

```ts
import type {Localized} from '@/content/schema';

export type NavItem = {
  href: '/services' | '/faq' | '/book';
  label: Localized<string>;
};

export const navItems: NavItem[] = [
  {href: '/services', label: {de: 'Leistungen', en: 'Services'}},
  {href: '/faq', label: {de: 'FAQ', en: 'FAQ'}},
];

export const bookCta: Localized<string> = {
  de: 'Termin buchen',
  en: 'Book Now',
};

export const legalItems: {href: '/imprint' | '/privacy' | '/terms'; label: Localized<string>}[] = [
  {href: '/imprint', label: {de: 'Impressum', en: 'Imprint'}},
  {href: '/privacy', label: {de: 'Datenschutz', en: 'Privacy'}},
  {href: '/terms', label: {de: 'AGB', en: 'Terms'}},
];
```

- [ ] **Step 4: Implement the locale switcher**

Create `src/components/layout/LocaleSwitcher.tsx`:

```tsx
'use client';

import {useParams} from 'next/navigation';
import {usePathname, Link} from '@/i18n/navigation';
import type {Locale} from '@/content/schema';

export function LocaleSwitcher({current}: {current: Locale}) {
  const pathname = usePathname();
  const params = useParams();
  const target: Locale = current === 'de' ? 'en' : 'de';

  return (
    <Link
      // @ts-expect-error -- params always match the current route
      href={{pathname, params}}
      locale={target}
      className="text-xs tracking-widest uppercase text-muted hover:text-ink"
    >
      {target.toUpperCase()}
    </Link>
  );
}
```

- [ ] **Step 5: Implement the header**

Create `src/components/layout/Header.tsx`:

```tsx
import {Link} from '@/i18n/navigation';
import {bookCta, navItems} from '@/lib/nav';
import type {Locale} from '@/content/schema';
import {LocaleSwitcher} from './LocaleSwitcher';

export function Header({locale}: {locale: Locale}) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-2xl">
          PrimeBodyLab
        </Link>

        <nav
          aria-label={locale === 'de' ? 'Hauptnavigation' : 'Main navigation'}
          className="flex items-center gap-7"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted hover:text-ink"
            >
              {item.label[locale]}
            </Link>
          ))}
          <LocaleSwitcher current={locale} />
          <Link
            href="/book"
            className="rounded-full border border-forest px-5 py-2.5 text-sm text-forest hover:bg-forest hover:text-bone"
          >
            {bookCta[locale]}
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 6: Implement the footer**

Create `src/components/layout/Footer.tsx`:

```tsx
import {Link} from '@/i18n/navigation';
import {site} from '@/content/site';
import {legalItems} from '@/lib/nav';
import type {Locale} from '@/content/schema';

export function Footer({locale}: {locale: Locale}) {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl">PrimeBodyLab</p>
          <address className="mt-3 not-italic text-sm leading-relaxed text-muted">
            {site.ownerName}
            <br />
            {site.street}
            <br />
            {site.postcode} {site.city}
            <br />
            <a href={site.phoneHref} className="hover:text-ink">
              {site.phone}
            </a>
            <br />
            <a href={`mailto:${site.email}`} className="hover:text-ink">
              {site.email}
            </a>
          </address>
          <p className="mt-3 text-sm text-muted">
            {locale === 'de' ? 'Steuernummer' : 'Tax ID'}: {site.taxId}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            {locale === 'de' ? 'Qualifikationen' : 'Qualifications'}
          </p>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {site.qualifications[locale].map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            {locale === 'de' ? 'Rechtliches' : 'Legal'}
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {legalItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted hover:text-ink">
                  {item.label[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 7: Implement the mobile contact bar**

Create `src/components/layout/MobileContactBar.tsx`:

```tsx
import {site} from '@/content/site';
import type {Locale} from '@/content/schema';

export function MobileContactBar({locale}: {locale: Locale}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-bone sm:hidden">
      <a
        href={site.phoneHref}
        className="py-4 text-center text-sm font-medium text-forest"
      >
        {locale === 'de' ? 'Anrufen' : 'Call'}
      </a>
      <a
        href={site.whatsapp}
        rel="noopener noreferrer"
        target="_blank"
        className="border-l border-line py-4 text-center text-sm font-medium text-forest"
      >
        WhatsApp
      </a>
    </div>
  );
}
```

- [ ] **Step 8: Compose them into the locale layout**

In `src/app/[locale]/layout.tsx`, replace the `<body>` contents:

```tsx
      <body className="bg-bone text-ink antialiased">
        <NextIntlClientProvider>
          <Header locale={locale as Locale} />
          <main className="pb-20 sm:pb-0">{children}</main>
          <Footer locale={locale as Locale} />
          <MobileContactBar locale={locale as Locale} />
        </NextIntlClientProvider>
      </body>
```

Add the imports:

```tsx
import {Header} from '@/components/layout/Header';
import {Footer} from '@/components/layout/Footer';
import {MobileContactBar} from '@/components/layout/MobileContactBar';
import type {Locale} from '@/content/schema';
```

- [ ] **Step 9: Add placeholder legal routes so footer links resolve**

Create `src/app/[locale]/imprint/page.tsx`, `src/app/[locale]/privacy/page.tsx` and `src/app/[locale]/terms/page.tsx`, each following this shape with its own heading:

```tsx
import {setRequestLocale} from 'next-intl/server';

type Props = {params: Promise<{locale: string}>};

export default async function ImprintPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <h1 className="font-display text-4xl">{locale === 'de' ? 'Impressum' : 'Imprint'}</h1>;
}
```

Task 11 fills these with real content.

- [ ] **Step 10: Run the tests**

Run: `npm run test:e2e -- layout.spec.ts`
Expected: PASS — all five tests green.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: add header, footer, locale switcher and mobile contact bar"
```

---

### Task 7: Homepage sections

**Files:**
- Create: `src/components/sections/Hero.tsx`, `PillarGrid.tsx`, `FounderBlock.tsx`, `TestimonialRow.tsx`, `CtaBand.tsx`
- Create: `src/content/home.ts`
- Modify: `src/app/[locale]/page.tsx`, `src/content/schema.ts`
- Test: `e2e/home.spec.ts`

**Interfaces:**
- Consumes: `services`, `testimonials`, `site`, `Locale`
- Produces: `home` from `@/content/home` with shape `{hero: {kicker: Localized<string>; headline: Localized<string[]>; body: Localized<string>}; pillars: {id: string; title: Localized<string>; body: Localized<string>}[]; founder: {heading: Localized<string>; body: Localized<string>}}`

- [ ] **Step 1: Write the failing homepage test**

Create `e2e/home.spec.ts`:

```ts
import {expect, test} from '@playwright/test';

test('hero carries the brand promise', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', {level: 1})).toBeVisible();
});

test('three pillars are present', async ({page}) => {
  await page.goto('/');
  const pillars = page.getByTestId('pillar');
  await expect(pillars).toHaveCount(3);
});

test('all four testimonials render', async ({page}) => {
  await page.goto('/');
  await expect(page.getByTestId('testimonial')).toHaveCount(4);
});

test('hero booking CTA reaches the booking page', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('hero-cta').click();
  await expect(page).toHaveURL(/\/buchen$/);
});

test('English homepage renders the English headline', async ({page}) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', {level: 1})).toContainText('Move Better');
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm run test:e2e -- home.spec.ts`
Expected: FAIL — no pillars or testimonials on the page.

- [ ] **Step 3: Add the home content schema**

Append to `src/content/schema.ts`:

```ts
export const homeSchema = z.object({
  hero: z.object({
    kicker: localizedText,
    headline: localized(z.array(z.string().min(1)).min(1)),
    body: localizedText,
  }),
  pillars: z
    .array(
      z.object({
        id: z.string().min(1),
        title: localizedText,
        body: localizedText,
      }),
    )
    .length(3),
  founder: z.object({
    heading: localizedText,
    body: localizedText,
  }),
});

export type Home = z.infer<typeof homeSchema>;
```

- [ ] **Step 4: Implement home content**

Create `src/content/home.ts`:

```ts
import {homeSchema, type Home} from './schema';

const data: Home = {
  hero: {
    kicker: {
      de: 'Pfaffenhofen · Studio & mobil',
      en: 'Pfaffenhofen · Studio & mobile',
    },
    headline: {
      de: ['Stärker regenerieren.', 'Klüger trainieren.', 'Besser bewegen.'],
      en: ['Recover Stronger.', 'Train Smarter.', 'Move Better.'],
    },
    body: {
      de: 'Sportmassage, assistiertes Stretching und Performance-Coaching — abgestimmt auf deine Ziele, ob Schmerzlinderung, mehr Leistung, bessere Beweglichkeit oder eine langfristige Investition in deine Gesundheit.',
      en: 'Services tailored to your individual goals — whether addressing pain relief, performance improvement, mobility enhancement, or long-term health investment.',
    },
  },
  pillars: [
    {
      id: 'performance',
      title: {de: 'Performance', en: 'Performance'},
      body: {
        de: 'Kraft aufbauen, Bewegungsmuster verbessern und Ergebnisse erzielen, die bleiben.',
        en: 'Build strength, improve movement patterns and produce results that last.',
      },
    },
    {
      id: 'recovery',
      title: {de: 'Regeneration', en: 'Recovery'},
      body: {
        de: 'Muskelverspannungen reduzieren und schneller regenerieren — zwischen Trainings und im Alltag.',
        en: 'Minimise muscle tension and recover faster — between sessions and in daily life.',
      },
    },
    {
      id: 'movement',
      title: {de: 'Beweglichkeit', en: 'Movement'},
      body: {
        de: 'Mobilität verbessern, Flexibilität steigern und Bewegungsfreiheit zurückgewinnen.',
        en: 'Enhance mobility, increase flexibility and restore freedom of movement.',
      },
    },
  ],
  founder: {
    heading: {
      de: 'Hi, ich bin Eddie, Gründer von PrimeBodyLab.',
      en: "Hi I'm Eddie, founder of PrimeBodyLab.",
    },
    body: {
      de: 'Als zertifizierter Personal Trainer, Sportmasseur und Stretch-Spezialist entwickle ich persönliche Programme für gesundheitsbewusste Menschen.',
      en: 'As a certified personal trainer, massage therapist and stretch specialist, I build personalised programmes for health-conscious individuals.',
    },
  },
};

export const home = homeSchema.parse(data);
```

Add every id in this file to `pendingGermanReview` in `src/content/review.ts`: `home.hero`, `home.pillars`, `home.founder`.

- [ ] **Step 5: Implement the Hero**

Create `src/components/sections/Hero.tsx`:

```tsx
import {Link} from '@/i18n/navigation';
import type {Locale, Localized} from '@/content/schema';

type Props = {
  locale: Locale;
  kicker: Localized<string>;
  headline: Localized<string[]>;
  body: Localized<string>;
  ctaLabel: string;
};

export function Hero({locale, kicker, headline, body, ctaLabel}: Props) {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">
        {kicker[locale]}
      </p>

      <h1 className="mx-auto mt-6 max-w-[15ch] font-display text-4xl leading-tight sm:text-6xl">
        {headline[locale].map((line, i) => (
          <span key={line} className={i === headline[locale].length - 1 ? 'text-sage' : undefined}>
            {line}{' '}
          </span>
        ))}
      </h1>

      <p className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-muted">
        {body[locale]}
      </p>

      <div className="mt-9 flex justify-center gap-3">
        <Link
          href="/book"
          data-testid="hero-cta"
          className="rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone hover:opacity-90"
        >
          {ctaLabel}
        </Link>
        <Link
          href="/services"
          className="border-b border-line px-4 py-3.5 text-sm font-medium text-forest hover:border-forest"
        >
          {locale === 'de' ? 'Leistungen ansehen' : 'Explore Services'}
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Implement the PillarGrid**

Create `src/components/sections/PillarGrid.tsx`:

```tsx
import type {Home, Locale} from '@/content/schema';

export function PillarGrid({
  locale,
  pillars,
}: {
  locale: Locale;
  pillars: Home['pillars'];
}) {
  return (
    <section className="border-y border-line">
      <div className="mx-auto grid max-w-6xl sm:grid-cols-3">
        {pillars.map((pillar) => (
          <div
            key={pillar.id}
            data-testid="pillar"
            className="border-b border-line px-8 py-12 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
          >
            <h2 className="font-display text-2xl">{pillar.title[locale]}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {pillar.body[locale]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Implement FounderBlock and TestimonialRow**

Create `src/components/sections/FounderBlock.tsx`:

```tsx
import {site} from '@/content/site';
import type {Home, Locale} from '@/content/schema';

export function FounderBlock({
  locale,
  founder,
}: {
  locale: Locale;
  founder: Home['founder'];
}) {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 py-24 sm:grid-cols-[1fr_1.2fr]">
      <div className="aspect-[4/5] bg-line" aria-hidden="true" />
      <div className="self-center">
        <h2 className="font-display text-3xl leading-snug">{founder.heading[locale]}</h2>
        <p className="mt-5 text-base leading-relaxed text-muted">{founder.body[locale]}</p>
        <ul className="mt-7 space-y-1.5 text-sm text-muted">
          {site.qualifications[locale].map((q) => (
            <li key={q} className="border-l-2 border-sage pl-3">
              {q}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

The `aria-hidden` block is the photography slot. When the shoot lands, replace it with `next/image` — no other change needed.

Create `src/components/sections/TestimonialRow.tsx`:

```tsx
import {testimonials} from '@/content/testimonials';
import type {Locale} from '@/content/schema';

export function TestimonialRow({locale}: {locale: Locale}) {
  return (
    <section className="border-y border-line bg-[color-mix(in_srgb,var(--color-bone)_60%,white)]">
      <div className="mx-auto grid max-w-6xl gap-px px-6 py-20 sm:grid-cols-2">
        {testimonials.map((t) => (
          <figure key={t.id} data-testid="testimonial" className="px-4 py-8">
            <div className="text-sage" aria-label={`${t.rating} / 5`}>
              {'★'.repeat(t.rating)}
            </div>
            <blockquote className="mt-4 text-base leading-relaxed">
              {t.quote[locale]}
            </blockquote>
            <figcaption className="mt-4 text-sm text-muted">— {t.author}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Implement the CtaBand**

Create `src/components/sections/CtaBand.tsx`:

```tsx
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/content/schema';

export function CtaBand({locale}: {locale: Locale}) {
  return (
    <section className="bg-forest text-bone">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
        <h2 className="max-w-[20ch] font-display text-3xl sm:text-4xl">
          {locale === 'de'
            ? 'Bereit, dich besser zu bewegen?'
            : 'Ready to move better?'}
        </h2>
        <Link
          href="/book"
          className="rounded-full bg-bone px-7 py-3.5 text-sm font-medium text-forest hover:opacity-90"
        >
          {locale === 'de' ? 'Termin buchen' : 'Book Now'}
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 9: Compose the homepage**

Replace `src/app/[locale]/page.tsx`:

```tsx
import {setRequestLocale} from 'next-intl/server';
import {home} from '@/content/home';
import {bookCta} from '@/lib/nav';
import {Hero} from '@/components/sections/Hero';
import {PillarGrid} from '@/components/sections/PillarGrid';
import {FounderBlock} from '@/components/sections/FounderBlock';
import {TestimonialRow} from '@/components/sections/TestimonialRow';
import {CtaBand} from '@/components/sections/CtaBand';
import type {Locale} from '@/content/schema';

type Props = {params: Promise<{locale: string}>};

export default async function HomePage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  return (
    <>
      <Hero
        locale={locale}
        kicker={home.hero.kicker}
        headline={home.hero.headline}
        body={home.hero.body}
        ctaLabel={bookCta[locale]}
      />
      <PillarGrid locale={locale} pillars={home.pillars} />
      <FounderBlock locale={locale} founder={home.founder} />
      <TestimonialRow locale={locale} />
      <CtaBand locale={locale} />
    </>
  );
}
```

- [ ] **Step 10: Run the tests**

Run: `npm run test:e2e -- home.spec.ts`
Expected: PASS — all five tests green.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: build homepage sections"
```

---

### Task 8: Services overview and per-service pages

**Files:**
- Create: `src/components/sections/ServiceCard.tsx`, `src/components/sections/ServiceDetail.tsx`
- Modify: `src/app/[locale]/services/page.tsx`
- Create: `src/app/[locale]/services/[slug]/page.tsx`
- Test: `e2e/services.spec.ts`

**Interfaces:**
- Consumes: `services`, `getService`, `formatPrice`, `Locale`
- Produces: `<ServiceCard service locale>`, `<ServiceDetail service locale>`

- [ ] **Step 1: Write the failing services test**

Create `e2e/services.spec.ts`:

```ts
import {expect, test} from '@playwright/test';

test('overview lists all three services', async ({page}) => {
  await page.goto('/leistungen');
  await expect(page.getByTestId('service-card')).toHaveCount(3);
});

test('service card links to its detail page', async ({page}) => {
  await page.goto('/leistungen');
  await page.getByTestId('service-card').first().getByRole('link').first().click();
  await expect(page).toHaveURL(/\/leistungen\/performance-massage$/);
});

test('massage detail page shows the 80 euro starting price', async ({page}) => {
  await page.goto('/leistungen/performance-massage');
  await expect(page.getByTestId('duration-row').first()).toContainText('80 €');
});

test('durations without a price show an enquiry note, not a blank', async ({page}) => {
  await page.goto('/leistungen/performance-massage');
  const rows = page.getByTestId('duration-row');
  await expect(rows.nth(1)).toContainText('Auf Anfrage');
});

test('unknown service slug returns 404', async ({page}) => {
  const response = await page.goto('/leistungen/nonexistent');
  expect(response?.status()).toBe(404);
});

test('English detail page uses English pricing format', async ({page}) => {
  await page.goto('/en/services/performance-massage');
  await expect(page.getByTestId('duration-row').first()).toContainText('€80');
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm run test:e2e -- services.spec.ts`
Expected: FAIL — no service cards exist.

- [ ] **Step 3: Implement ServiceCard**

Create `src/components/sections/ServiceCard.tsx`:

```tsx
import {Link} from '@/i18n/navigation';
import {formatPrice} from '@/lib/format';
import type {Locale, Service} from '@/content/schema';

export function ServiceCard({service, locale}: {service: Service; locale: Locale}) {
  const prices = service.durations
    .map((d) => d.price)
    .filter((p): p is number => p !== null);
  const from = prices.length > 0 ? Math.min(...prices) : null;

  return (
    <article data-testid="service-card" className="flex flex-col border-b border-line py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-sage">
        {service.tagline[locale]}
      </p>
      <h2 className="mt-3 font-display text-3xl">{service.name[locale]}</h2>
      <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-muted">
        {service.description[locale]}
      </p>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        {service.includes[locale].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="mt-7 flex items-center gap-6">
        <Link
          href={{pathname: '/services/[slug]', params: {slug: service.slug}}}
          className="rounded-full bg-forest px-6 py-3 text-sm font-medium text-bone hover:opacity-90"
        >
          {locale === 'de' ? 'Mehr erfahren' : 'Learn More'}
        </Link>
        {from !== null && (
          <span className="text-sm text-muted">
            {locale === 'de' ? 'ab' : 'from'} {formatPrice(from, locale)}
          </span>
        )}
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Implement the overview page**

Replace `src/app/[locale]/services/page.tsx`:

```tsx
import {setRequestLocale} from 'next-intl/server';
import {services} from '@/content/services';
import {ServiceCard} from '@/components/sections/ServiceCard';
import {CtaBand} from '@/components/sections/CtaBand';
import type {Locale} from '@/content/schema';

type Props = {params: Promise<{locale: string}>};

export default async function ServicesPage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20">
        <h1 className="font-display text-4xl sm:text-5xl">
          {locale === 'de' ? 'Leistungen' : 'Services'}
        </h1>
        <div className="mt-6">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} locale={locale} />
          ))}
        </div>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
```

- [ ] **Step 5: Implement ServiceDetail**

Create `src/components/sections/ServiceDetail.tsx`:

```tsx
import {Link} from '@/i18n/navigation';
import {formatPrice} from '@/lib/format';
import type {Locale, Service} from '@/content/schema';

export function ServiceDetail({service, locale}: {service: Service; locale: Locale}) {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20">
      <p className="text-xs uppercase tracking-[0.2em] text-sage">
        {service.tagline[locale]}
      </p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">{service.name[locale]}</h1>
      <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-muted">
        {service.description[locale]}
      </p>

      <div className="mt-14 grid gap-12 sm:grid-cols-2">
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted">
            {locale === 'de' ? 'Enthaltene Techniken' : 'Treatments Include'}
          </h2>
          <ul className="mt-4 space-y-2 text-base">
            {service.includes[locale].map((item) => (
              <li key={item} className="border-b border-line pb-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted">
            {locale === 'de' ? 'Dauer & Preis' : 'Duration & Price'}
          </h2>
          <ul className="mt-4 space-y-2 text-base">
            {service.durations.map((duration) => (
              <li
                key={duration.minutes}
                data-testid="duration-row"
                className="flex justify-between border-b border-line pb-2"
              >
                <span>
                  {duration.minutes} {locale === 'de' ? 'Min.' : 'min'}
                </span>
                <span className="text-muted">
                  {duration.price === null
                    ? locale === 'de'
                      ? 'Auf Anfrage'
                      : 'On request'
                    : formatPrice(duration.price, locale)}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href={{pathname: '/book', query: {service: service.slug}}}
            className="mt-8 inline-block rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone hover:opacity-90"
          >
            {locale === 'de' ? 'Termin buchen' : 'Book Now'}
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Implement the detail route**

Create `src/app/[locale]/services/[slug]/page.tsx`:

```tsx
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {getService, services} from '@/content/services';
import {routing} from '@/i18n/routing';
import {ServiceDetail} from '@/components/sections/ServiceDetail';
import {CtaBand} from '@/components/sections/CtaBand';
import type {Locale} from '@/content/schema';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((service) => ({locale, slug: service.slug})),
  );
}

type Props = {params: Promise<{locale: string; slug: string}>};

export default async function ServiceDetailPage({params}: Props) {
  const {locale: raw, slug} = await params;
  setRequestLocale(raw);

  const service = getService(slug);
  if (!service) notFound();

  const locale = raw as Locale;

  return (
    <>
      <ServiceDetail service={service} locale={locale} />
      <CtaBand locale={locale} />
    </>
  );
}
```

- [ ] **Step 7: Run the tests**

Run: `npm run test:e2e -- services.spec.ts`
Expected: PASS — all six tests green.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add services overview and per-service detail pages"
```

---

### Task 9: Booking gate

**Files:**
- Create: `src/components/booking/BookingGate.tsx`
- Create: `src/app/[locale]/book/page.tsx`
- Test: `e2e/booking.spec.ts`

**Interfaces:**
- Consumes: `services`, `getService`, `site`, `formatPrice`, `Locale`
- Produces: `<BookingGate locale service acuityBaseUrl>` — a client component that renders a summary panel and injects the Acuity iframe only after the user clicks

**Constraint:** no request to `acuityscheduling.com` or `as.me` may occur before the click. This is what keeps the site free of a cookie banner.

- [ ] **Step 1: Write the failing booking test**

Create `e2e/booking.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm run test:e2e -- booking.spec.ts`
Expected: FAIL — `/buchen` has no gate.

- [ ] **Step 3: Implement the gate**

Create `src/components/booking/BookingGate.tsx`:

```tsx
'use client';

import {useState} from 'react';
import {formatPrice} from '@/lib/format';
import type {Locale, Service} from '@/content/schema';

const ACUITY_BASE = 'https://opensessions.as.me/schedule.php';

type Props = {
  locale: Locale;
  service: Service | null;
};

export function BookingGate({locale, service}: Props) {
  const [loaded, setLoaded] = useState(false);

  const src = service?.acuityTypeId
    ? `${ACUITY_BASE}?appointmentType=${service.acuityTypeId}`
    : ACUITY_BASE;

  const copy = {
    de: {
      heading: 'Termin buchen',
      selected: 'Ausgewählte Leistung',
      any: 'Alle Leistungen',
      notice:
        'Der Buchungskalender wird von Acuity Scheduling bereitgestellt. Beim Laden werden Daten an Acuity übertragen. Der Kalender wird erst nach deinem Klick geladen.',
      button: 'Buchungskalender laden',
    },
    en: {
      heading: 'Book an appointment',
      selected: 'Selected service',
      any: 'All services',
      notice:
        'The booking calendar is provided by Acuity Scheduling. Loading it transfers data to Acuity. The calendar loads only after you click.',
      button: 'Load booking calendar',
    },
  }[locale];

  return (
    <section className="mx-auto max-w-3xl px-6 pt-20">
      <h1 className="font-display text-4xl sm:text-5xl">{copy.heading}</h1>

      <div className="mt-8 border border-line p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{copy.selected}</p>
        <p data-testid="selected-service" className="mt-2 font-display text-2xl">
          {service ? service.name[locale] : copy.any}
        </p>

        {service && (
          <ul className="mt-5 space-y-2 text-sm">
            {service.durations.map((d) => (
              <li key={d.minutes} className="flex justify-between border-b border-line pb-2">
                <span>
                  {d.minutes} {locale === 'de' ? 'Min.' : 'min'}
                </span>
                <span className="text-muted">
                  {d.price === null
                    ? locale === 'de'
                      ? 'Auf Anfrage'
                      : 'On request'
                    : formatPrice(d.price, locale)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {loaded ? (
        <iframe
          data-testid="booking-frame"
          src={src}
          title={copy.heading}
          className="mt-8 h-[800px] w-full border border-line"
        />
      ) : (
        <div className="mt-8 border border-line bg-[color-mix(in_srgb,var(--color-bone)_60%,white)] p-8 text-center">
          <p data-testid="booking-notice" className="mx-auto max-w-[52ch] text-sm leading-relaxed text-muted">
            {copy.notice}
          </p>
          <button
            type="button"
            data-testid="load-booking"
            onClick={() => setLoaded(true)}
            className="mt-6 rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone hover:opacity-90"
          >
            {copy.button}
          </button>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Implement the booking page**

Create `src/app/[locale]/book/page.tsx`:

```tsx
import {setRequestLocale} from 'next-intl/server';
import {getService} from '@/content/services';
import {BookingGate} from '@/components/booking/BookingGate';
import type {Locale} from '@/content/schema';

type Props = {
  params: Promise<{locale: string}>;
  searchParams: Promise<{service?: string}>;
};

export default async function BookPage({params, searchParams}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);

  const {service: slug} = await searchParams;
  const service = slug ? (getService(slug) ?? null) : null;

  return <BookingGate locale={raw as Locale} service={service} />;
}
```

- [ ] **Step 5: Run the tests**

Run: `npm run test:e2e -- booking.spec.ts`
Expected: PASS — all four tests green, including the no-request-before-click assertion.

- [ ] **Step 6: Record the outstanding client input**

Append to `docs/client-questions.md`:

```markdown
- Acuity appointment type IDs for each service. Until supplied, every booking
  CTA lands on the general Acuity calendar rather than a preselected service.
  Set them in `src/content/services.ts` → `acuityTypeId`.
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add click-to-load Acuity booking gate"
```

---

### Task 10: FAQ page with structured data

**Files:**
- Create: `src/components/sections/FaqAccordion.tsx`, `src/components/seo/JsonLd.tsx`
- Create: `src/app/[locale]/faq/page.tsx`
- Test: `e2e/faq.spec.ts`

**Interfaces:**
- Consumes: `faqs`, `Locale`
- Produces: `<JsonLd data>` — renders a `<script type="application/ld+json">`; `<FaqAccordion locale groups>`

- [ ] **Step 1: Write the failing FAQ test**

Create `e2e/faq.spec.ts`:

```ts
import {expect, test} from '@playwright/test';

test('renders every FAQ group', async ({page}) => {
  await page.goto('/faq');
  await expect(page.getByTestId('faq-group')).toHaveCount(3);
});

test('answers are collapsed until opened', async ({page}) => {
  await page.goto('/faq');
  const first = page.getByTestId('faq-item').first();
  await expect(first.locator('div[role="region"]')).toBeHidden();
  await first.getByRole('button').click();
  await expect(first.locator('div[role="region"]')).toBeVisible();
});

test('emits valid FAQPage structured data', async ({page}) => {
  await page.goto('/faq');
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(raw!);
  expect(data['@type']).toBe('FAQPage');
  expect(Array.isArray(data.mainEntity)).toBe(true);
  expect(data.mainEntity.length).toBeGreaterThan(10);
  expect(data.mainEntity[0]['@type']).toBe('Question');
  expect(data.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm run test:e2e -- faq.spec.ts`
Expected: FAIL — `/faq` renders only a heading.

- [ ] **Step 3: Implement the JSON-LD component**

Create `src/components/seo/JsonLd.tsx`:

```tsx
export function JsonLd({data}: {data: Record<string, unknown>}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}
```

- [ ] **Step 4: Implement the accordion**

Create `src/components/sections/FaqAccordion.tsx`:

```tsx
'use client';

import {useState} from 'react';
import type {FaqGroup, Locale} from '@/content/schema';

export function FaqAccordion({locale, groups}: {locale: Locale; groups: FaqGroup[]}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="mt-12 space-y-16">
      {groups.map((group) => (
        <section key={group.id} data-testid="faq-group">
          <h2 className="font-display text-2xl">{group.title[locale]}</h2>

          <div className="mt-6 border-t border-line">
            {group.items.map((item) => {
              const isOpen = open === item.id;
              return (
                <div key={item.id} data-testid="faq-item" className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`answer-${item.id}`}
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-base">{item.question[locale]}</span>
                    <span aria-hidden="true" className="text-sage">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <div
                    id={`answer-${item.id}`}
                    role="region"
                    hidden={!isOpen}
                    className="pb-6 text-base leading-relaxed text-muted"
                  >
                    {item.answer[locale]}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Implement the FAQ page**

Create `src/app/[locale]/faq/page.tsx`:

```tsx
import {setRequestLocale} from 'next-intl/server';
import {faqs} from '@/content/faqs';
import {FaqAccordion} from '@/components/sections/FaqAccordion';
import {JsonLd} from '@/components/seo/JsonLd';
import {CtaBand} from '@/components/sections/CtaBand';
import type {Locale} from '@/content/schema';

type Props = {params: Promise<{locale: string}>};

export default async function FaqPage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.flatMap((group) =>
      group.items.map((item) => ({
        '@type': 'Question',
        name: item.question[locale],
        acceptedAnswer: {'@type': 'Answer', text: item.answer[locale]},
      })),
    ),
  };

  return (
    <>
      <JsonLd data={faqPageSchema} />
      <section className="mx-auto max-w-3xl px-6 pt-20">
        <h1 className="font-display text-4xl sm:text-5xl">
          {locale === 'de' ? 'Häufige Fragen' : 'FAQs'}
        </h1>
        <FaqAccordion locale={locale} groups={faqs} />
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
```

- [ ] **Step 6: Run the tests**

Run: `npm run test:e2e -- faq.spec.ts`
Expected: PASS — all three tests green.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add FAQ page with FAQPage structured data"
```

---

### Task 11: Legal pages

**Files:**
- Create: `src/content/legal.ts`
- Modify: `src/app/[locale]/{imprint,privacy,terms}/page.tsx`
- Modify: `src/content/schema.ts`
- Test: `e2e/legal.spec.ts`

**Interfaces:**
- Consumes: `site`, `Locale`
- Produces: `legal: {imprint: Localized<string>; privacy: Localized<string>; terms: Localized<string>}` from `@/content/legal` — Markdown-free plain text with paragraph breaks on `\n\n`

- [ ] **Step 1: Write the failing legal test**

Create `e2e/legal.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm run test:e2e -- legal.spec.ts`
Expected: FAIL — the Impressum shows only a heading.

- [ ] **Step 3: Add the legal schema**

Append to `src/content/schema.ts`:

```ts
export const legalSchema = z.object({
  imprint: localizedText,
  privacy: localizedText,
  terms: localizedText,
});

export type Legal = z.infer<typeof legalSchema>;
```

- [ ] **Step 4: Implement legal content**

Create `src/content/legal.ts`. The Impressum is composed from `site` so it can never drift from the footer. Privacy and Terms are transcribed **verbatim** from the client's existing `/terms-conditions-and-privacy-policy` page, split into their two respective sections:

```ts
import {site} from './site';
import {legalSchema, type Legal} from './schema';

const imprintDe = `Angaben gemäß § 5 DDG

${site.ownerName}
PrimeBodyLab
${site.street}
${site.postcode} ${site.city}

Kontakt
Telefon: ${site.phone}
E-Mail: ${site.email}

Steuernummer
${site.taxId}

Verantwortlich für den Inhalt
${site.ownerName}, Anschrift wie oben.`;

const imprintEn = `Information pursuant to § 5 DDG

${site.ownerName}
PrimeBodyLab
${site.street}
${site.postcode} ${site.city}
Germany

Contact
Phone: ${site.phone}
Email: ${site.email}

Tax number
${site.taxId}

Responsible for content
${site.ownerName}, address as above.`;

const data: Legal = {
  imprint: {de: imprintDe, en: imprintEn},
  privacy: {
    de: 'TRANSCRIBE the privacy section of the existing page here, verbatim.',
    en: 'TRANSCRIBE the privacy section of the existing page here, verbatim.',
  },
  terms: {
    de: 'TRANSCRIBE the terms section of the existing page here, verbatim.',
    en: 'TRANSCRIBE the terms section of the existing page here, verbatim.',
  },
};

export const legal = legalSchema.parse(data);
```

**The three `TRANSCRIBE` strings must be replaced with the client's actual wording before this task is complete.** Fetch `https://www.primebodylab.de/terms-conditions-and-privacy-policy` and split it. Add `legal.privacy` and `legal.terms` to `pendingGermanReview`.

The privacy policy must additionally describe the Acuity click-to-load embed and the analytics setup, since both are new. Draft that section, add it to `docs/client-questions.md` for the client to confirm, and add its id to `pendingGermanReview`.

- [ ] **Step 5: Implement a shared legal page component**

Create `src/components/sections/LegalText.tsx`:

```tsx
export function LegalText({heading, body}: {heading: string; body: string}) {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-20 pb-8">
      <h1 className="font-display text-4xl sm:text-5xl">{heading}</h1>
      <div className="mt-8 space-y-4 text-base leading-relaxed text-muted">
        {body.split('\n\n').map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Wire up the three routes**

Replace `src/app/[locale]/imprint/page.tsx`:

```tsx
import {setRequestLocale} from 'next-intl/server';
import {legal} from '@/content/legal';
import {LegalText} from '@/components/sections/LegalText';
import type {Locale} from '@/content/schema';

type Props = {params: Promise<{locale: string}>};

export default async function ImprintPage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  return (
    <LegalText
      heading={locale === 'de' ? 'Impressum' : 'Imprint'}
      body={legal.imprint[locale]}
    />
  );
}
```

Repeat for `privacy/page.tsx` (heading `Datenschutz` / `Privacy Policy`, body `legal.privacy`) and `terms/page.tsx` (heading `AGB` / `Terms & Conditions`, body `legal.terms`).

- [ ] **Step 7: Run the tests**

Run: `npm run test:e2e -- legal.spec.ts`
Expected: PASS — all five tests green.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: split legal content into Impressum, Datenschutz and AGB"
```

---

### Task 12: Metadata, hreflang, sitemap and LocalBusiness data

**Files:**
- Create: `src/lib/metadata.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`
- Modify: every `page.tsx` under `src/app/[locale]/`
- Modify: `src/app/[locale]/layout.tsx`
- Test: `e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `routing`, `getPathname` from `@/i18n/navigation`, `site`, `services`
- Produces: `buildMetadata({locale, pathname, title, description, params?}): Metadata` from `@/lib/metadata`

- [ ] **Step 1: Write the failing SEO test**

Create `e2e/seo.spec.ts`:

```ts
import {expect, test} from '@playwright/test';

test('homepage declares hreflang for both locales plus x-default', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute(
    'href',
    'https://www.primebodylab.de/',
  );
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    'https://www.primebodylab.de/en',
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
  const business = scripts.map((s) => JSON.parse(s)).find((d) => d['@type'] === 'HealthAndBeautyBusiness');

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
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm run test:e2e -- seo.spec.ts`
Expected: FAIL — no hreflang tags and no sitemap.

- [ ] **Step 3: Implement the metadata builder**

Create `src/lib/metadata.ts`:

```ts
import type {Metadata} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import type {Locale} from '@/content/schema';

export const SITE_URL = 'https://www.primebodylab.de';

/**
 * `href` is next-intl's route href — either a pathname string declared in
 * `routing.pathnames`, or `{pathname, params}` for a dynamic route. next-intl
 * types this as a large union; `Parameters<typeof getPathname>[0]['href']`
 * borrows the exact type rather than restating it.
 */
type Href = Parameters<typeof getPathname>[0]['href'];

type Args = {
  locale: Locale;
  href: Href;
  title: string;
  description: string;
};

export function buildMetadata({locale, href, title, description}: Args): Metadata {
  const languages: Record<string, string> = {};

  for (const candidate of routing.locales) {
    languages[candidate] = SITE_URL + getPathname({locale: candidate, href});
  }

  return {
    title,
    description,
    alternates: {
      canonical: SITE_URL + getPathname({locale, href}),
      languages: {...languages, 'x-default': languages[routing.defaultLocale]},
    },
    openGraph: {
      title,
      description,
      url: SITE_URL + getPathname({locale, href}),
      siteName: 'PrimeBodyLab',
      locale: locale === 'de' ? 'de_DE' : 'en_GB',
      type: 'website',
    },
  };
}
```

- [ ] **Step 4: Add `generateMetadata` to each page**

Add to `src/app/[locale]/page.tsx`:

```tsx
import type {Metadata} from 'next';
import {buildMetadata} from '@/lib/metadata';

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: raw} = await params;
  const locale = raw as Locale;

  return buildMetadata({
    locale,
    href: '/',
    title:
      locale === 'de'
        ? 'PrimeBodyLab — Sportmassage, Stretching & Coaching in Pfaffenhofen'
        : 'PrimeBodyLab — Sports Massage, Stretching & Coaching in Pfaffenhofen',
    description: home.hero.body[locale],
  });
}
```

Repeat the same pattern for `/services`, `/book`, `/faq`, `/imprint`, `/privacy`, `/terms`, each with its own title and description. For `/services/[slug]`, use the service name and description:

```tsx
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: raw, slug} = await params;
  const locale = raw as Locale;
  const service = getService(slug);
  if (!service) return {};

  return buildMetadata({
    locale,
    href: {pathname: '/services/[slug]', params: {slug}},
    title: `${service.name[locale]} — PrimeBodyLab ${site.city}`,
    description: service.description[locale],
  });
}
```

- [ ] **Step 5: Add LocalBusiness structured data to the layout**

In `src/app/[locale]/layout.tsx`, render inside `<body>` before `<Header>`:

```tsx
<JsonLd
  data={{
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: 'PrimeBodyLab',
    url: SITE_URL,
    telephone: site.phone,
    email: site.email,
    founder: {'@type': 'Person', name: site.ownerName},
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      postalCode: site.postcode,
      addressLocality: site.city,
      addressCountry: site.country,
    },
    sameAs: Object.values(site.socials),
  }}
/>
```

Add imports for `JsonLd`, `site` and `SITE_URL`.

- [ ] **Step 6: Implement the sitemap**

Create `src/app/sitemap.ts`:

```ts
import type {MetadataRoute} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {services} from '@/content/services';
import {SITE_URL} from '@/lib/metadata';

const staticHrefs = [
  '/',
  '/services',
  '/book',
  '/faq',
  '/imprint',
  '/privacy',
  '/terms',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const serviceHrefs = services.map((service) => ({
    pathname: '/services/[slug]' as const,
    params: {slug: service.slug},
  }));

  return [...staticHrefs, ...serviceHrefs].map((href) => ({
    url: SITE_URL + getPathname({locale: routing.defaultLocale, href}),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, SITE_URL + getPathname({locale, href})]),
      ),
    },
  }));
}
```

- [ ] **Step 7: Implement robots.txt**

Create `src/app/robots.ts`:

```ts
import type {MetadataRoute} from 'next';
import {SITE_URL} from '@/lib/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {userAgent: '*', allow: '/'},
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 8: Run the tests**

Run: `npm run test:e2e -- seo.spec.ts`
Expected: PASS — all five tests green.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add metadata, hreflang, sitemap, robots and LocalBusiness data"
```

---

### Task 13: Redirects, owner documentation and launch readiness

**Files:**
- Modify: `next.config.ts`
- Create: `CLAUDE.md`, `README.md`
- Create: `e2e/redirects.spec.ts`, `e2e/a11y.spec.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: everything built so far
- Produces: a launch-ready repository

- [ ] **Step 1: Write the failing redirect test**

Create `e2e/redirects.spec.ts`:

```ts
import {expect, test} from '@playwright/test';

const redirects = [
  {from: '/services', to: '/leistungen'},
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
```

Note: `/services` is the English route, so the German redirect must not shadow it. Verify `/en/services` still returns 200 — covered by the existing routing test.

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm run test:e2e -- redirects.spec.ts`
Expected: FAIL — `/appointments` and `/faqs-2` return 404.

- [ ] **Step 3: Add the redirects**

Modify `next.config.ts`:

```ts
import createNextIntlPlugin from 'next-intl/plugin';
import type {NextConfig} from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {source: '/appointments', destination: '/buchen', permanent: true},
      {source: '/faqs-2', destination: '/faq', permanent: true},
      {
        source: '/terms-conditions-and-privacy-policy',
        destination: '/datenschutz',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
```

`/services` needs no redirect — next-intl already serves it as the English route, and `/leistungen` as the German one. Remove that entry from the test.

- [ ] **Step 4: Update the redirect test to match**

Edit `e2e/redirects.spec.ts` — remove the `/services` entry and add:

```ts
test('/services remains the English services route', async ({page}) => {
  const response = await page.goto('/services');
  expect(response?.status()).toBe(200);
});
```

- [ ] **Step 5: Add a basic accessibility check**

Create `e2e/a11y.spec.ts`:

```ts
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
```

- [ ] **Step 6: Add the Lighthouse performance budget**

Spec §8 requires CI to fail if Core Web Vitals regress. Install the runner:

```bash
npm install -D @lhci/cli
```

Create `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run start",
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/leistungen",
        "http://localhost:3000/leistungen/performance-massage",
        "http://localhost:3000/faq"
      ],
      "numberOfRuns": 3,
      "settings": {"preset": "desktop"}
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:seo": ["error", {"minScore": 1}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 200}]
      }
    },
    "upload": {"target": "temporary-public-storage"}
  }
}
```

Add to `package.json` scripts:

```json
"test:perf": "npm run build && lhci autorun"
```

- [ ] **Step 7: Run the performance budget and confirm it passes**

Run: `npm run test:perf`
Expected: all assertions pass. A static page with self-hosted fonts and no third-party scripts should clear these comfortably. If SEO scores below 1, the usual cause is a missing meta description on one of the four URLs — fix the page rather than lowering the threshold.

- [ ] **Step 8: Add the CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm test
      - run: npm run build
      - run: npm run test:e2e
      - run: npm run test:perf
```

`npm run check:release` is deliberately excluded — it must not block development commits, only the launch decision.

- [ ] **Step 9: Run the full suite**

Run: `npm test && npm run test:e2e && npm run build`
Expected: all Vitest tests pass, all Playwright specs pass, build succeeds.

- [ ] **Step 10: Write the owner's guide**

Create `CLAUDE.md` at the repo root:

```markdown
# PrimeBodyLab — working on this site

This is Eddie Ekanem's site for PrimeBodyLab (Pfaffenhofen, Germany). It is a
Next.js site deployed on Vercel. Pushing to `main` deploys automatically.

## Where content lives

All copy is in `src/content/`. You almost never need to touch anything else.

| I want to change… | Edit this file |
| --- | --- |
| A price or session length | `src/content/services.ts` → the service's `durations` array |
| A service name, description, or what's included | `src/content/services.ts` |
| A question or answer on the FAQ page | `src/content/faqs.ts` |
| A customer review | `src/content/testimonials.ts` |
| Phone, email, address, tax number, social links | `src/content/site.ts` |
| Homepage headline, the three pillars, the founder blurb | `src/content/home.ts` |
| Impressum, privacy policy, terms | `src/content/legal.ts` |

## Rules that must not be broken

1. **Every piece of text needs both German and English.** Fields look like
   `{de: '…', en: '…'}`. Leaving one out will not build.
2. **Never load a third-party script on page load.** The booking calendar loads
   only when the visitor clicks the button. This is why the site has no cookie
   banner. Do not "simplify" this.
3. **Fonts are self-hosted.** Never add a `<link>` to Google Fonts.
4. **Impressum, Datenschutz and AGB stay as three separate pages.**
5. **German is the default language and has no `/de` prefix.**

## Before publishing a change

```bash
npm test          # content checks
npm run build     # catches missing translations
```

## Booking

Bookings are handled by Acuity, not this site. To change availability, services
or prices *as the customer books*, log in to Acuity. The prices shown on this
site are separate — update both.
```

- [ ] **Step 11: Write the developer README**

Create `README.md`:

```markdown
# primebodylab.de

German-first marketing site for PrimeBodyLab, Pfaffenhofen.

## Stack

Next.js (App Router) · TypeScript · Tailwind v4 · next-intl · Zod · Vitest · Playwright · Vercel

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build — also validates all content |
| `npm test` | Content and unit tests |
| `npm run test:e2e` | Playwright suite |
| `npm run test:perf` | Lighthouse budget — fails if Core Web Vitals regress |
| `npm run check:release` | Fails while German copy awaits owner approval |

## Architecture notes

- German is the default locale and is served unprefixed; English lives under `/en`.
  Localised pathnames are declared in `src/i18n/routing.ts` — the `app/` directory
  uses the internal English paths, users see the localised ones.
- All pages are statically generated. A small edge middleware handles locale
  negotiation only.
- No third-party script loads before user interaction, which is why there is no
  cookie banner. See `src/components/booking/BookingGate.tsx`.

## Deployment

Push to `main`. Vercel builds and deploys.

Cutover from Squarespace is documented in
`docs/superpowers/specs/2026-07-29-primebodylab-rebuild-design.md` §9.
```

- [ ] **Step 12: Verify the release gate reports outstanding items**

Run: `npm run check:release`
Expected: FAIL, listing every German string still awaiting the client's approval. This is correct — it means the gate works and the site is not yet cleared for launch.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add legacy redirects, owner guide and launch checks"
```

---

## Post-implementation

Before DNS cutover, work through spec §9 in order. The site must not go live while
`npm run check:release` fails.

Outstanding client inputs are tracked in `docs/client-questions.md`. At minimum:
Acuity appointment type IDs, prices for stretch therapy and coaching, confirmed
social URLs, the cancellation-policy discrepancy, and approval of all German copy.

Follow-on plans, once this ships:

1. **Local SEO pages and gift vouchers** — spec phase 4
2. **Journal and analytics** — spec phase 5
