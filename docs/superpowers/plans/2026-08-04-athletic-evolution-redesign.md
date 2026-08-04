# Athletic Evolution Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retheme PrimeBodyLab from its current warm dark-green/bronze/serif identity to the "Athletic Evolution" direction (black background, neon yellow-green accent, bold condensed type) approved from Justin's mockup, site-wide, with no changes to content, booking flow, or bilingual copy.

**Architecture:** Repoint the 7 existing `@theme` color tokens and 2 font tokens in `src/styles/globals.css` / `src/lib/fonts.ts` — the same mechanism used for the site's last full theme swap, so every component that already reads tokens by name (buttons, cards, bands) updates for free. Two components get real structural rebuilds on top of the token swap (Header wordmark treatment, Hero two-column layout + new ticker), and one cross-cutting contrast fix is required because the token swap alone would leave several buttons unreadable (see Global Constraints).

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4 (`@theme` tokens), next-intl, next/font/google (self-hosted), Vitest, Playwright.

## Global Constraints

- Token **names** stay stable (`bone`, `ink`, `forest`, `sage`, `muted`, `line`, `surface`); only their hex values change. No component should rename a token or introduce a new one unless a task below explicitly says so.
- Fonts must stay self-hosted via `next/font/google` (Anton for `--font-display`, Epilogue for `--font-body`). Never add a `<link>` to Google's font CDN — there's an e2e test (`e2e/fonts.spec.ts`) that fails the build if a request to `fonts.googleapis.com`/`fonts.gstatic.com` is made.
- **New contrast rule introduced by this redesign:** anywhere `bg-forest` is used as a solid fill (a button, an active pill, the Service Finder bubble), pair it with `text-bone` — never `text-ink`. `forest` is becoming a bright neon yellow-green; `text-ink` (off-white) on that fill, or `text-forest` on an off-white fill, both fail contrast. `text-bone` (near-black) on a `bg-forest` fill is what the mockup shows and is what stays readable. This does **not** apply to `sage`, which is used as a text color on the dark page background (`bone`), not as a fill — that pairing (bright text on near-black) stays high-contrast as-is.
- Only the homepage Hero's `<h1>` gets `uppercase`. Every other display-font heading (service names, FAQ questions, pillar titles, the CtaBand heading, etc.) keeps its existing sentence case — the Anton typeface swap alone gives them the bold/condensed look; uppercasing every heading site-wide is out of scope and untested against the real German copy's long compound words.
- Every piece of visitor-facing text needs both `de` and `en` (existing project rule) — the new ServiceTicker's "ab"/"from" label follows the same inline ternary pattern already used in `ServiceCard.tsx` and `ServiceDetail.tsx`, not a new content-file entry, since it's exactly that pattern.
- Don't add `priority` to more than the single largest above-the-fold image (existing `AGENTS.md` rule — preloading multiple full srcsets previously stalled the e2e suite from 14s to over 3 minutes). The Hero photo becomes that image once it's added; `Gallery`'s current `priority={index === 0}` on its first slide must come off in the same task that adds the Hero photo, or the page will have two priority images at once.
- `npm test` and `npm run build` must both pass before every commit. Run the specific `npm run test:e2e -- <file>` relevant to what a task touched (each task below names which).

---

### Task 1: Retheme color tokens, fonts, and fix accent-fill contrast

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `src/lib/fonts.ts`
- Modify: `src/components/layout/Header.tsx:46`
- Modify: `src/components/layout/LocaleSwitcher.tsx:48`
- Modify: `src/components/sections/CtaBand.tsx`
- Modify: `src/components/sections/ServiceCard.tsx:42`
- Modify: `src/components/sections/ServiceDetail.tsx:68`
- Modify: `src/components/booking/BookingGate.tsx:107`
- Modify: `src/components/ServiceFinderWidget.tsx:101,220,259` (line 124 is reviewed in Step 4 but intentionally left unchanged)
- Modify: `src/components/WelcomePopup.tsx:104,128`
- Modify: `e2e/fonts.spec.ts:24`

**Interfaces:**
- Produces: the `bg-forest` + `text-bone` pairing convention (see Global Constraints) that Tasks 3 and 4 must use for any new solid-fill element they create.
- Produces: `--color-bone: #0A0A0A`, `--color-ink: #F5F5F0`, `--color-forest: #D7FF3D`, `--color-sage: #D7FF3D`, `--color-muted: #9A9A93`, `--color-line: #2A2A2A`, `--color-surface: #141414` — later tasks reference these tokens by name only, never hardcode a hex.
- Produces: `--font-display` resolves to Anton, `--font-body` resolves to Epilogue.

This task does **not** touch `src/components/sections/Hero.tsx` — Task 4 rebuilds that file from scratch with the correct `text-bone` pairing already in place, so editing it here would just be overwritten.

- [ ] **Step 1: Repoint the color tokens**

Replace the `@theme` block and its doc comment in `src/styles/globals.css`:

```css
@import "tailwindcss";

/**
 * "Athletic Evolution" theme — black background, neon yellow-green accent,
 * bold condensed type. Replaces the warm dark-green/bronze theme. Token
 * NAMES are kept stable (bone/ink/forest/sage/muted/line/surface) so every
 * component needed zero class-name changes for the swap — only the values
 * moved:
 *
 * - bone    page background: warm near-black -> true near-black.
 * - ink     primary text: warm cream -> off-white.
 * - forest  primary accent (solid-fill buttons, bands): dark green -> neon
 *           yellow-green. Anywhere this is used as a fill, pair it with
 *           `text-bone`, not `text-ink` — see Global Constraints in the
 *           plan this theme shipped under.
 * - sage    secondary accent (taglines, hero last line, hover states):
 *           bronze -> the same neon as `forest`. It's used as a *text*
 *           color on the dark `bone` background, so it stays high-contrast
 *           without needing the `forest` fill's dark-text pairing.
 * - muted / line were re-picked to sit correctly against the new near-black
 *           bone.
 * - surface is the elevated-panel token (BookingGate notice, Service
 *           Finder panel, CtaBand) — a shade lighter than `bone` so those
 *           panels still read as distinct surfaces on a near-black page.
 */
@theme {
  --color-bone: #0A0A0A;
  --color-ink: #F5F5F0;
  --color-forest: #D7FF3D;
  --color-sage: #D7FF3D;
  --color-muted: #9A9A93;
  --color-line: #2A2A2A;
  --color-surface: #141414;

  --font-display: var(--font-anton), Impact, sans-serif;
  --font-body: var(--font-epilogue), system-ui, sans-serif;
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

- [ ] **Step 2: Swap the self-hosted fonts**

Replace `src/lib/fonts.ts`:

```typescript
import {Anton, Epilogue} from 'next/font/google';

/**
 * The CSS variable names here must NOT match the Tailwind theme keys
 * (`--font-display` / `--font-body`), or `@theme` ends up defining a variable
 * in terms of itself and the font silently falls back.
 */
export const displayFont = Anton({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  display: 'swap',
  variable: '--font-anton',
});

export const bodyFont = Epilogue({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-epilogue',
});
```

- [ ] **Step 3: Update the font e2e test to expect the new body font**

In `e2e/fonts.spec.ts`, change line 24:

```typescript
  expect(fontFamily).toContain('Epilogue');
```

(was `expect(fontFamily).toContain('Inter');`)

- [ ] **Step 4: Fix the `bg-forest` + `text-ink` contrast pairings**

In `src/components/layout/Header.tsx`, line 46, change:

```typescript
            className="rounded-full border border-forest px-3 py-1.5 text-xs whitespace-nowrap text-sage transition-colors hover:bg-forest hover:text-ink sm:px-5 sm:py-2.5 sm:text-sm"
```

to:

```typescript
            className="rounded-full border border-forest px-3 py-1.5 text-xs whitespace-nowrap text-sage transition-colors hover:bg-forest hover:text-bone sm:px-5 sm:py-2.5 sm:text-sm"
```

In `src/components/layout/LocaleSwitcher.tsx`, line 48, change:

```typescript
                ? 'rounded-full bg-forest px-2.5 py-1 text-[11px] font-medium tracking-wider text-ink'
```

to:

```typescript
                ? 'rounded-full bg-forest px-2.5 py-1 text-[11px] font-medium tracking-wider text-bone'
```

In `src/components/sections/ServiceCard.tsx`, line 42, change:

```typescript
            className="rounded-full bg-forest px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
```

to:

```typescript
            className="rounded-full bg-forest px-6 py-3 text-sm font-medium text-bone transition-opacity hover:opacity-90"
```

In `src/components/sections/ServiceDetail.tsx`, line 68, change:

```typescript
            className="mt-8 inline-block rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
```

to:

```typescript
            className="mt-8 inline-block rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone transition-opacity hover:opacity-90"
```

In `src/components/booking/BookingGate.tsx`, line 107, change:

```typescript
            className="mt-6 rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
```

to:

```typescript
            className="mt-6 rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone transition-opacity hover:opacity-90"
```

In `src/components/ServiceFinderWidget.tsx`, three separate lines change. Line 101:

```typescript
        className="fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-2xl text-ink shadow-lg transition-opacity hover:opacity-90 sm:right-6 sm:bottom-6"
```

becomes:

```typescript
        className="fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-2xl text-bone shadow-lg transition-opacity hover:opacity-90 sm:right-6 sm:bottom-6"
```

Line 220:

```typescript
      className="mt-4 inline-block rounded-full border border-forest px-6 py-2.5 text-sm text-sage transition-colors hover:bg-forest hover:text-ink"
```

becomes:

```typescript
      className="mt-4 inline-block rounded-full border border-forest px-6 py-2.5 text-sm text-sage transition-colors hover:bg-forest hover:text-bone"
```

Line 259:

```typescript
        className="mt-5 inline-block rounded-full bg-forest px-7 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
```

becomes:

```typescript
        className="mt-5 inline-block rounded-full bg-forest px-7 py-3 text-sm font-medium text-bone transition-opacity hover:opacity-90"
```

(Line 124, `className="absolute top-4 right-4 text-muted transition-colors hover:text-ink"`, stays unchanged — that's a close button hover on the panel's own `bg-surface` background, not a `bg-forest` fill, so `text-ink` is still the correct pairing there.)

In `src/components/WelcomePopup.tsx`, two lines change. Line 104:

```typescript
              className="mt-6 inline-block rounded-full bg-forest px-7 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
```

becomes:

```typescript
              className="mt-6 inline-block rounded-full bg-forest px-7 py-3 text-sm font-medium text-bone transition-opacity hover:opacity-90"
```

Line 128:

```typescript
                className="rounded-full bg-forest px-7 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
```

becomes:

```typescript
                className="rounded-full bg-forest px-7 py-3 text-sm font-medium text-bone transition-opacity hover:opacity-90 disabled:opacity-60"
```

- [ ] **Step 5: Rebuild `CtaBand` so it doesn't paint a full-width neon block**

`CtaBand`'s section wrapper currently uses `bg-forest text-ink` — with `forest` now a bright neon, a full-bleed neon section with off-white heading text fails contrast badly. Replace the whole file:

```typescript
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/content/schema';

export function CtaBand({locale}: {locale: Locale}) {
  return (
    <section className="bg-surface text-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
        <h2 className="max-w-[20ch] font-display text-3xl text-balance sm:text-4xl">
          {locale === 'de' ? 'Bereit, dich besser zu bewegen?' : 'Ready to move better?'}
        </h2>
        <Link
          href="/book"
          className="rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone transition-opacity hover:opacity-90"
        >
          {locale === 'de' ? 'Termin buchen' : 'Book Now'}
        </Link>
      </div>
    </section>
  );
}
```

This keeps the section on the page's normal dark surface (visually distinct from `bone` via the `surface` token, same role that token already plays elsewhere) and makes the button match every other primary CTA on the site: solid neon fill, dark text.

- [ ] **Step 6: Run the full test suite and the font/layout e2e specs**

```bash
npm test
npm run build
npm run test:e2e -- fonts.spec.ts layout.spec.ts home.spec.ts services.spec.ts booking.spec.ts
```

Expected: all pass. The `fonts.spec.ts` "display font is applied" assertion should now pass against `Epilogue`; no test asserts on color values directly, so a correct token swap shouldn't break anything functional.

- [ ] **Step 7: Manual visual check**

Start the dev server (`npm run dev`) and open `http://localhost:3000/` and `http://localhost:3000/en`. Confirm: page background is black, primary buttons (header "Book Now", CtaBand, service cards) are solid neon yellow-green with dark text that's clearly readable, taglines/accents render in the same neon as text on the black background. No white-on-bright or bright-on-white button should be visible anywhere.

- [ ] **Step 8: Commit**

```bash
git add src/styles/globals.css src/lib/fonts.ts src/components/layout/Header.tsx src/components/layout/LocaleSwitcher.tsx src/components/sections/CtaBand.tsx src/components/sections/ServiceCard.tsx src/components/sections/ServiceDetail.tsx src/components/booking/BookingGate.tsx src/components/ServiceFinderWidget.tsx src/components/WelcomePopup.tsx e2e/fonts.spec.ts
git commit -m "feat: retheme to Athletic Evolution colors and fonts"
```

---

### Task 2: Extract a shared `getFromPrice` helper

**Files:**
- Create: `src/lib/pricing.ts`
- Create: `src/lib/__tests__/pricing.test.ts`
- Modify: `src/components/sections/ServiceCard.tsx`
- Modify: `src/components/ServiceFinderWidget.tsx`

**Interfaces:**
- Consumes: `Service` type from `src/content/schema.ts` (existing).
- Produces: `getFromPrice(service: Service): number | null` — the lowest non-null price across a service's durations, or `null` if every duration is price-on-request. Task 3's `ServiceTicker` consumes this directly.

The "lowest price across durations" calculation currently exists inline, duplicated, in both `ServiceCard.tsx` and `ServiceFinderWidget.tsx`. Task 3 needs this same calculation a third time for the new ticker — this is the point to de-duplicate it into one tested function instead of writing a fourth copy.

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/pricing.test.ts`:

```typescript
import {describe, expect, it} from 'vitest';
import {getFromPrice} from '../pricing';
import type {Service} from '@/content/schema';

function makeService(durations: {minutes: number; price: number | null}[]): Service {
  return {
    slug: 'test-service',
    acuityTypeId: null,
    image: {src: '/images/test.jpg', alt: {de: 'Test', en: 'Test'}, placeholder: false, focus: 'center'},
    name: {de: 'Test', en: 'Test'},
    tagline: {de: 'Test', en: 'Test'},
    description: {de: 'Test', en: 'Test'},
    includes: {de: ['Test'], en: ['Test']},
    durations,
  };
}

describe('getFromPrice', () => {
  it('returns the lowest non-null price across durations', () => {
    const service = makeService([
      {minutes: 60, price: 90},
      {minutes: 90, price: 85},
      {minutes: 120, price: 110},
    ]);
    expect(getFromPrice(service)).toBe(85);
  });

  it('ignores null (price-on-request) durations when finding the minimum', () => {
    const service = makeService([
      {minutes: 30, price: null},
      {minutes: 60, price: 80},
    ]);
    expect(getFromPrice(service)).toBe(80);
  });

  it('returns null when every duration is price-on-request', () => {
    const service = makeService([{minutes: 30, price: null}]);
    expect(getFromPrice(service)).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/__tests__/pricing.test.ts`
Expected: FAIL — `Cannot find module '../pricing'`

- [ ] **Step 3: Implement `getFromPrice`**

Create `src/lib/pricing.ts`:

```typescript
import type {Service} from '@/content/schema';

/**
 * The lowest non-null price across a service's durations — what every
 * "ab €X" / "from €X" label on the site shows. Returns null when every
 * duration is price-on-request (Performance Coaching).
 */
export function getFromPrice(service: Service): number | null {
  const prices = service.durations
    .map((duration) => duration.price)
    .filter((price): price is number => price !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/__tests__/pricing.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Replace the duplicated logic in `ServiceCard.tsx`**

In `src/components/sections/ServiceCard.tsx`, add the import:

```typescript
import {getFromPrice} from '@/lib/pricing';
```

Replace:

```typescript
  const prices = service.durations
    .map((duration) => duration.price)
    .filter((price): price is number => price !== null);
  const from = prices.length > 0 ? Math.min(...prices) : null;
```

with:

```typescript
  const from = getFromPrice(service);
```

- [ ] **Step 6: Replace the duplicated logic in `ServiceFinderWidget.tsx`**

Add the import alongside the file's existing imports:

```typescript
import {getFromPrice} from '@/lib/pricing';
```

Replace (around line 239-240):

```typescript
  const prices = service.durations.map((d) => d.price).filter((p): p is number => p !== null);
  const startingPrice = prices.length > 0 ? Math.min(...prices) : null;
```

with:

```typescript
  const startingPrice = getFromPrice(service);
```

- [ ] **Step 7: Run the full unit test suite and the services e2e spec**

```bash
npm test
npm run test:e2e -- services.spec.ts service-finder.spec.ts
```

Expected: all pass — the displayed prices are unchanged, only where the calculation lives has changed.

- [ ] **Step 8: Commit**

```bash
git add src/lib/pricing.ts src/lib/__tests__/pricing.test.ts src/components/sections/ServiceCard.tsx src/components/ServiceFinderWidget.tsx
git commit -m "refactor: extract shared getFromPrice helper"
```

---

### Task 3: Build the ServiceTicker component

**Files:**
- Create: `src/components/sections/ServiceTicker.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `e2e/home.spec.ts`

**Interfaces:**
- Consumes: `getFromPrice` from `src/lib/pricing.ts` (Task 2), `services` from `src/content/services.ts` (existing), `formatPrice` from `src/lib/format.ts` (existing).
- Produces: `ServiceTicker({locale}: {locale: Locale})` — renders `data-testid="service-ticker"` wrapping one `data-testid="ticker-item"` per service in `src/content/services.ts`. Not consumed by any later task, but must render on the homepage directly under the Hero (Task 4 also touches `page.tsx`, immediately after this task — order matters, this task lands first).

- [ ] **Step 1: Write the failing e2e test**

Add to `e2e/home.spec.ts`:

```typescript
test('service ticker lists every service with its starting price', async ({page}) => {
  await page.goto('/');
  const ticker = page.getByTestId('service-ticker');
  await expect(ticker.getByTestId('ticker-item')).toHaveCount(5);
  await expect(ticker).toContainText('ab 80 €');
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e -- home.spec.ts -g "service ticker"`
Expected: FAIL — `getByTestId('service-ticker')` finds no element.

- [ ] **Step 3: Build the component**

Create `src/components/sections/ServiceTicker.tsx`:

```typescript
import {services} from '@/content/services';
import {getFromPrice} from '@/lib/pricing';
import {formatPrice} from '@/lib/format';
import type {Locale} from '@/content/schema';

/** Homepage-only bar under the Hero: every service, at a glance, with its starting price. */
export function ServiceTicker({locale}: {locale: Locale}) {
  return (
    <div data-testid="service-ticker" className="border-y border-line bg-forest">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-3 text-xs font-semibold tracking-wide text-bone uppercase sm:text-sm">
        {services.map((service) => {
          const from = getFromPrice(service);
          return (
            <span key={service.slug} data-testid="ticker-item" className="whitespace-nowrap">
              {service.name[locale]}
              {from !== null && (
                <>
                  {' — '}
                  {locale === 'de' ? 'ab' : 'from'} {formatPrice(from, locale)}
                </>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wire it into the homepage, directly under the Hero**

In `src/app/[locale]/page.tsx`, add the import:

```typescript
import {ServiceTicker} from '@/components/sections/ServiceTicker';
```

and render it right after `<Hero .../>`:

```typescript
      <Hero
        locale={locale}
        kicker={home.hero.kicker}
        headline={home.hero.headline}
        body={home.hero.body}
        ctaLabel={bookCta[locale]}
      />
      <ServiceTicker locale={locale} />
      <Gallery locale={locale} />
```

(Task 4 will add an `image` prop to this same `<Hero>` call — expect that line to change again in the next task.)

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test:e2e -- home.spec.ts`
Expected: PASS (all `home.spec.ts` tests, including the new one). The lowest price site-wide is Wellness & Recovery Massage at €80 (`src/content/services.ts`), so `formatPrice(80, 'de')` renders `80 €` and the German ticker item reads "...ab 80 €" — matching the test's `toContainText('ab 80 €')`.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/ServiceTicker.tsx src/app/[locale]/page.tsx e2e/home.spec.ts
git commit -m "feat: add service ticker bar under the homepage hero"
```

---

### Task 4: Rebuild the Hero as a two-column layout with photo and background mark

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/components/sections/Gallery.tsx:60`

**Interfaces:**
- Consumes: `Figure` from `src/components/media/Figure.tsx` (existing), `images.coaching` from `src/content/images.ts` (existing — Eddie strength training at Clever Fit; chosen over `images.founder` because `FounderBlock` already uses `images.founder` further down the same homepage, and the strength-training photo fits the "athletic" mood better than a studio headshot).
- Produces: `Hero` now requires a new `image: SiteImage` prop — any other caller of `Hero` (there are none besides `page.tsx` today) would need updating too.

- [ ] **Step 1: Rebuild the component**

Replace `src/components/sections/Hero.tsx`:

```typescript
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {Figure} from '@/components/media/Figure';
import type {Locale, Localized, SiteImage} from '@/content/schema';

type Props = {
  locale: Locale;
  kicker: Localized<string>;
  headline: Localized<string[]>;
  body: Localized<string>;
  ctaLabel: string;
  image: SiteImage;
};

export function Hero({locale, kicker, headline, body, ctaLabel, image}: Props) {
  const lines = headline[locale];

  return (
    <section className="relative overflow-hidden">
      <Image
        src="/images/logo-mark.png"
        alt=""
        width={800}
        height={800}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 hidden w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-20 sm:block lg:w-[760px]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pt-16 pb-16 sm:pt-24 sm:pb-20 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
        <div className="text-center lg:text-left">
          <span className="inline-block rounded-full bg-forest px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-bone uppercase">
            {kicker[locale]}
          </span>

          {/* Each line is its own block: German words are long enough that letting
              them reflow breaks the three-line rhythm the headline depends on. */}
          <h1 className="mt-6 font-display text-4xl leading-[1.05] uppercase sm:text-6xl lg:text-7xl">
            {lines.map((line, index) => (
              <span
                key={line}
                className={`block ${index === lines.length - 1 ? 'text-sage' : ''}`}
              >
                {line}
              </span>
            ))}
          </h1>

          <p className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-muted lg:mx-0">
            {body[locale]}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link
              href="/book"
              data-testid="hero-cta"
              className="rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone transition-opacity hover:opacity-90"
            >
              {ctaLabel}
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-forest"
            >
              {locale === 'de' ? 'Leistungen ansehen' : 'Explore Services'}
            </Link>
          </div>
        </div>

        <Figure
          image={image}
          locale={locale}
          className="aspect-[4/5] rounded-2xl lg:aspect-[3/4]"
          sizes="(min-width: 1024px) 40vw, 100vw"
          priority
        />
      </div>
    </section>
  );
}
```

Notes on choices here:
- The anatomy-mark background image uses `hidden sm:block` — on phones (< 640px) there isn't enough horizontal room for both the mark and the headline to read cleanly at "decently visible" size, so it's hidden below `sm` rather than shrunk to the point of being pointless. Confirm this reads correctly at each breakpoint in Step 3.
- `priority` on the Hero's `Figure` — this is now the single largest above-the-fold image, so it's the one that should carry `priority` (see Step 2, which removes it from `Gallery`).
- The secondary CTA changed from an underlined text link to an outlined pill button (`rounded-full border border-line`), matching the mockup's two-button pair — this is a deliberate style change, not a leftover.

- [ ] **Step 2: Give the Hero the `Gallery`'s `priority` — remove it from `Gallery`'s first slide**

In `src/components/sections/Gallery.tsx`, line 60, change:

```typescript
              priority={index === 0}
```

to:

```typescript
              priority={false}
```

(Per the Global Constraints rule: only one image on the page should carry `priority`, and that's now the Hero's photo, not the Gallery's first slide.)

- [ ] **Step 3: Pass the new `image` prop from the homepage**

In `src/app/[locale]/page.tsx`, add to the existing imports:

```typescript
import {images} from '@/content/images';
```

and update the `<Hero>` call (already touched in Task 3 to add `<ServiceTicker>` after it — this edit is to the `<Hero>` tag itself):

```typescript
      <Hero
        locale={locale}
        kicker={home.hero.kicker}
        headline={home.hero.headline}
        body={home.hero.body}
        ctaLabel={bookCta[locale]}
        image={images.coaching}
      />
      <ServiceTicker locale={locale} />
```

- [ ] **Step 4: Run the full test suite and relevant e2e specs**

```bash
npm test
npm run build
npm run test:e2e -- home.spec.ts a11y.spec.ts fonts.spec.ts
```

Expected: all pass. `home.spec.ts`'s existing "hero carries the brand promise" and "hero booking CTA reaches the booking page" tests exercise the same `data-testid="hero-cta"` and `<h1>` that still exist, just restructured.

- [ ] **Step 5: Manual visual check across breakpoints, both locales**

Using the same Playwright-screenshot method used for the recent header mobile-overlap fix, capture the homepage hero at 320, 375, 390, 768, 1024, and 1280px width, for both `/` and `/en`. Confirm: no overlap between the anatomy mark, headline, and photo at any width; the headline's last line renders in the neon accent color; the photo is visible and not squeezed to nothing on mobile (single column, photo below copy); the anatomy mark is clearly visible (not a barely-there watermark) at `sm` and above. Compare side-by-side against Justin's Option A mockup screenshot.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/sections/Gallery.tsx src/app/[locale]/page.tsx
git commit -m "feat: rebuild the hero as a two-column layout with photo and background mark"
```

---

### Task 5: Header wordmark — bold uppercase treatment

**Files:**
- Modify: `src/components/layout/Header.tsx:21`

**Interfaces:**
- Consumes: `--font-display` (now Anton, from Task 1) via the existing `font-display` Tailwind utility class.

The wordmark already picks up Anton automatically from Task 1's font swap (it uses the `font-display` class). This task only adds the uppercase, tighter-tracking treatment the mockup shows — Anton is designed as an all-caps display face, and the current wordmark text is mixed-case ("PrimeBodyLab").

- [ ] **Step 1: Update the wordmark span**

In `src/components/layout/Header.tsx`, line 21, change:

```typescript
            <span className="font-display text-2xl sm:text-4xl md:text-5xl">PrimeBodyLab</span>
```

to:

```typescript
            <span className="font-display text-2xl uppercase tracking-tight sm:text-4xl md:text-5xl">PrimeBodyLab</span>
```

- [ ] **Step 2: Run the layout e2e spec**

Run: `npm run test:e2e -- layout.spec.ts`
Expected: PASS — these tests query by role/link text, not by the wordmark's visual case, so they're unaffected.

- [ ] **Step 3: Manual visual check**

Open `http://localhost:3000/` at 320px, 768px, and 1280px width. Confirm the wordmark reads "PRIMEBODYLAB" in bold condensed caps, doesn't overlap the anatomy-mark icon or the nav/language switcher at any width (the mobile-wrap fix from the prior session should still hold — if it doesn't, that's a regression to fix here, not defer).

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: bold uppercase header wordmark treatment"
```

---

### Task 6: Desaturate all photography

**Files:**
- Modify: `src/components/media/Figure.tsx`

**Interfaces:**
- No signature changes — `Figure`'s props stay identical. This is a pure rendering change.

- [ ] **Step 1: Apply the grayscale filter**

In `src/components/media/Figure.tsx`, change:

```typescript
        className="object-cover"
```

to:

```typescript
        className="object-cover grayscale contrast-110"
```

- [ ] **Step 2: Run the full test suite**

```bash
npm test
npm run build
npm run test:e2e -- home.spec.ts services.spec.ts a11y.spec.ts
```

Expected: all pass — no test asserts on image color, so this is a pure visual change with no functional risk.

- [ ] **Step 3: Manual visual check**

Open the homepage, a service detail page, and the gallery strip. Confirm every photo (hero, service cards, service detail, gallery, founder block) renders in black-and-white/desaturated, not just the hero.

- [ ] **Step 4: Commit**

```bash
git add src/components/media/Figure.tsx
git commit -m "feat: desaturate all site photography"
```

---

## Final check (after all 6 tasks)

```bash
npm test
npm run build
npm run test:e2e
```

Expected: full unit and e2e suites pass. Then do one more full-site manual pass — every page (home, services, service detail, FAQ, booking, legal, imprint) at 320/768/1280px, both locales — confirming the retheme landed everywhere with no leftover warm-theme colors, no unreadable button, and no layout regression.
