# Warm Calm Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retheme PrimeBodyLab from the black-background/neon-yellow-green "Athletic Evolution" identity to a light, warm "Warm Calm" identity (cream background, coffee-brown + olive-green accents, soft editorial serif/sans typography), site-wide, with no changes to content, structure, or booking flow.

**Architecture:** Repoint the same 7 color tokens and 2 font tokens this project has repointed twice before (`src/styles/globals.css` / `src/lib/fonts.ts`) — every component that reads tokens by name updates for free. Three small, explicitly-scoped component tweaks (Hero case/italic/opacity, Header wordmark font, ServiceTicker fill) round it out. Unlike the last theme swap, no cross-cutting contrast-fix sweep is needed: `bone` and `forest` are flipping brightness *together* (bone: dark→light, forest: bright neon→dark-enough brown), so the existing `bg-forest`+`text-bone` pairing used across ~14 components keeps working unchanged.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4 (`@theme` tokens), next-intl, next/font/google (self-hosted), Vitest, Playwright.

## Global Constraints

- Token **names** stay stable (`bone`, `ink`, `forest`, `sage`, `muted`, `line`, `surface`). Only their hex values change in this plan.
- Fonts must stay self-hosted via `next/font/google` (Fraunces for `--font-display`, Inter for `--font-body`). Never add a `<link>` to Google's font CDN — `e2e/fonts.spec.ts` fails the build if a request to `fonts.googleapis.com`/`fonts.gstatic.com` is made.
- The `bg-forest` + `text-bone` pairing (established in the prior redesign, used on: Header's Book button hover, LocaleSwitcher's active pill, ServiceCard's CTA, ServiceDetail's CTA, BookingGate's CTA, the Service Finder bubble + 2 more of its buttons, WelcomePopup's 2 buttons, the Hero CTA, CtaBand's button) is **not touched by this plan** — verify in Task 4 that it still reads correctly at the new hex values, but no task edits those pairings.
- `npm test` and `npm run build` must both pass before every commit.

---

### Task 1: Retheme color tokens and fonts

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `src/lib/fonts.ts`
- Modify: `e2e/fonts.spec.ts`

**Interfaces:**
- Produces: `--color-bone: #F7F1E7`, `--color-ink: #2B2116`, `--color-forest: #6B4A31`, `--color-sage: #5C6640`, `--color-muted: #7A6B54`, `--color-line: #DCCEB0`, `--color-surface: #EFE6D3` — later tasks (2-4) reference these tokens by name only, never hardcode hex.
- Produces: `--font-display` resolves to Fraunces (normal + italic styles, weights 400/500/600), `--font-body` resolves to Inter.

This task does not touch `Hero.tsx`, `Header.tsx`, or `ServiceTicker.tsx` — those are Tasks 2-4.

- [ ] **Step 1: Repoint the color tokens and fonts**

Replace `src/styles/globals.css` in full:

```css
@import "tailwindcss";

/**
 * "Warm Calm" theme — light cream background, coffee-brown accent, olive-
 * green secondary accent, soft editorial type. Replaces "Athletic
 * Evolution" (black background, neon yellow-green). Token NAMES stay
 * stable (bone/ink/forest/sage/muted/line/surface) — only the values
 * moved, same mechanism as every previous theme swap on this project:
 *
 * - bone    page background: near-black -> warm cream.
 * - ink     primary text: off-white -> warm espresso (not pure black).
 * - forest  primary accent (solid-fill buttons, bands): neon yellow-green
 *           -> coffee brown. `bone`'s new cream value is still light
 *           enough to read on `forest`'s new brown value, so every
 *           existing `bg-forest` + `text-bone` pairing keeps working
 *           unchanged — no contrast-fix sweep needed this time, unlike
 *           the last theme swap.
 * - sage    secondary accent (taglines, hero last line, hover states):
 *           was the same neon as `forest`; now a *distinct* olive green,
 *           not the same value as `forest` — this palette uses two
 *           accent colors, not one.
 * - muted / line / surface were re-picked to sit correctly against the
 *           new light cream `bone` (surface: a step darker than bone,
 *           for the ticker bar and other elevated panels; line: a soft
 *           warm tan border).
 */
@theme {
  --color-bone: #F7F1E7;
  --color-ink: #2B2116;
  --color-forest: #6B4A31;
  --color-sage: #5C6640;
  --color-muted: #7A6B54;
  --color-line: #DCCEB0;
  --color-surface: #EFE6D3;

  --font-display: var(--font-fraunces), Georgia, serif;
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

- [ ] **Step 2: Swap the self-hosted fonts**

Replace `src/lib/fonts.ts` in full:

```typescript
import {Fraunces, Inter} from 'next/font/google';

/**
 * The CSS variable names here must NOT match the Tailwind theme keys
 * (`--font-display` / `--font-body`), or `@theme` ends up defining a variable
 * in terms of itself and the font silently falls back.
 */
export const displayFont = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-fraunces',
});

export const bodyFont = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});
```

`Fraunces` needs both `style: ['normal', 'italic']` — Task 2 sets the hero headline's last line to `italic`, so the italic cut must actually be loaded, not just the upright one. Weight is pinned to `'400'` only: `globals.css`'s `h1, h2, h3 { font-weight: 400; }` rule is the only weight any heading actually renders (no heading in the codebase pairs `font-display` with a `font-semibold`/`font-bold` utility), so loading heavier weights would just be unused bytes.

- [ ] **Step 3: Update the font e2e test to expect the new body font**

In `e2e/fonts.spec.ts`, change line 24:

```typescript
  expect(fontFamily).toContain('Inter');
```

(was `expect(fontFamily).toContain('Epilogue');`)

- [ ] **Step 4: Run the full test suite and the font e2e spec**

```bash
npm test
npm run build
npm run test:e2e -- fonts.spec.ts
```

Expected: all pass. The `fonts.spec.ts` "display font is applied" assertion should now pass against `Inter`.

- [ ] **Step 5: Manual visual check**

Start the dev server (`npm run dev`) and open `http://localhost:3000/`. Confirm: page background is a warm cream, not black; primary buttons (header "Book Now", CtaBand, service cards) are solid coffee-brown with cream text; headline text renders in the new serif. Colors will look "right" but the page will still show the old bold uppercase Hero headline and neon ServiceTicker bar — that's expected, Tasks 2-4 fix those.

- [ ] **Step 6: Commit**

```bash
git add src/styles/globals.css src/lib/fonts.ts e2e/fonts.spec.ts
git commit -m "feat: retheme to Warm Calm colors and fonts"
```

---

### Task 2: Hero — sentence case, italic accent, softer background mark

**Files:**
- Modify: `src/components/sections/Hero.tsx`

**Interfaces:**
- No prop/signature changes — `Hero`'s props stay identical. Pure className edits.

- [ ] **Step 1: Remove `uppercase` from the headline, add `italic` to its last line, and soften the background mark**

In `src/components/sections/Hero.tsx`, three separate edits.

Line 34 — the background anatomy-mark `<Image>`, change:

```typescript
              className="pointer-events-none absolute top-1/2 left-1/2 hidden w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-20 sm:block lg:w-[760px]"
```

to:

```typescript
              className="pointer-events-none absolute top-1/2 left-1/2 hidden w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-10 sm:block lg:w-[760px]"
```

Line 43 — the `<h1>`, change:

```typescript
            <h1 className="relative mt-6 font-display text-4xl leading-[1.05] uppercase sm:text-6xl lg:text-7xl">
```

to:

```typescript
            <h1 className="relative mt-6 font-display text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
```

Line 47 — the last-line accent span, change:

```typescript
                  className={`block ${index === lines.length - 1 ? 'text-sage' : ''}`}
```

to:

```typescript
                  className={`block ${index === lines.length - 1 ? 'text-sage italic' : ''}`}
```

- [ ] **Step 2: Run the home e2e spec**

```bash
npm run test:e2e -- home.spec.ts
```

Expected: PASS. `home.spec.ts`'s "hero carries the brand promise" and "hero booking CTA reaches the booking page" tests query by heading role and `data-testid="hero-cta"` — neither depends on case or the italic styling, so they're unaffected by this purely visual change.

- [ ] **Step 3: Manual visual check**

Open `http://localhost:3000/` and `http://localhost:3000/en`. Confirm: the headline now reads in normal sentence case (e.g. "Stärker regenerieren." not "STÄRKER REGENERIEREN."), the last line ("Besser bewegen." / "Move Better.") is italic and in the olive `sage` color, and the background anatomy mark is present but noticeably fainter than before — a quiet accent, not a bold graphic.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: soften the hero headline for the Warm Calm theme"
```

---

### Task 3: Header wordmark — drop the display-serif, keep it in the body sans

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Interfaces:**
- No signature changes.

An all-caps, letter-spaced wordmark set in a serif display font (Fraunces, as of Task 1) reads oddly — the approved mockup uses the body sans (Inter) for the wordmark instead, uppercase and tracked, which is also how the Soulhouse reference treats its own nav logo (sans caps wordmark, serif reserved for headlines). This task removes the `font-display` class from the wordmark so it falls back to the page's default body font — no other class changes.

- [ ] **Step 1: Update the wordmark span**

In `src/components/layout/Header.tsx`, line 21, change:

```typescript
            <span className="font-display text-2xl uppercase tracking-tight sm:text-4xl md:text-5xl">PrimeBodyLab</span>
```

to:

```typescript
            <span className="text-2xl uppercase tracking-tight sm:text-4xl md:text-5xl">PrimeBodyLab</span>
```

- [ ] **Step 2: Run the layout e2e spec**

```bash
npm run test:e2e -- layout.spec.ts
```

Expected: PASS — these tests query by role/link text, not by the wordmark's font, so they're unaffected. This also re-verifies the mobile header-overlap fix from an earlier session still holds, since `layout.spec.ts` includes a "switcher is reachable on mobile" test at a 390px viewport.

- [ ] **Step 3: Manual visual check**

Open `http://localhost:3000/` at 320px, 768px, and 1280px width. Confirm the wordmark now renders in the clean sans body font (not the serif), still bold/uppercase/tracked, and doesn't overlap the icon or the nav/language switcher at any width.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: set the header wordmark in the body sans instead of the display serif"
```

---

### Task 4: ServiceTicker — quiet tan bar instead of a solid accent block

**Files:**
- Modify: `src/components/sections/ServiceTicker.tsx`

**Interfaces:**
- No signature changes.

- [ ] **Step 1: Change the ticker's fill and text color**

In `src/components/sections/ServiceTicker.tsx`, change:

```typescript
    <div data-testid="service-ticker" className="border-y border-line bg-forest">
      <p className="mx-auto max-w-6xl px-6 py-3 text-center text-sm font-semibold tracking-wide text-bone uppercase sm:text-base">
```

to:

```typescript
    <div data-testid="service-ticker" className="border-y border-line bg-surface">
      <p className="mx-auto max-w-6xl px-6 py-3 text-center text-sm font-semibold tracking-wide text-ink uppercase sm:text-base">
```

- [ ] **Step 2: Run the home e2e spec**

```bash
npm run test:e2e -- home.spec.ts
```

Expected: PASS. The "service ticker shows the homepage motivational quote" test only checks for the text "Muskelkater" inside `[data-testid="service-ticker"]` — it doesn't assert on color, so it's unaffected.

- [ ] **Step 3: Full test suite and build**

```bash
npm test
npm run build
npm run test:e2e
```

Expected: full unit and e2e suites pass.

- [ ] **Step 4: Full manual visual verification (all 4 tasks combined)**

Using the same Playwright-screenshot method used earlier this project (script a headless browser to `localhost:3000`, screenshot, then use the Read tool to actually look at the images — don't just assume from code), check:

1. **Contrast spot-check** — at `http://localhost:3000/`, confirm the Hero's "Termin buchen" button (coffee-brown fill, cream text) is clearly readable, not washed out. Do the same for a ServiceCard's "Mehr erfahren" button on `http://localhost:3000/leistungen`, and for the round Service Finder "?" bubble in the bottom-right corner of any page.
2. **Mobile-overlap regression check** — screenshot the homepage header at 320px, 375px, 768px, and 1280px width, both `/` and `/en`. Confirm no overlap between the wordmark, tagline, language switcher, and Book button at any width (this exact bug was fixed in an earlier session; Task 3's font change is the one most likely to accidentally reintroduce it).
3. **Whole-homepage comparison** — screenshot the full homepage (scroll through gradually before capturing, since `Reveal.tsx`'s scroll-triggered animations won't show in a single unscrolled screenshot) and compare it against the approved mockup described in `docs/superpowers/specs/2026-08-04-warm-calm-redesign-design.md` (cream background, coffee-brown kicker pill and buttons, italic olive-green last headline word, quiet tan ticker bar, serif headline).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ServiceTicker.tsx
git commit -m "feat: quiet the service ticker's fill for the Warm Calm theme"
```

---

## Final check (after all 4 tasks)

```bash
npm test
npm run build
npm run test:e2e
```

Expected: full unit and e2e suites pass. Then do one more full-site manual pass — every page (home, services, service detail, FAQ, booking, legal, imprint) at 320/768/1280px, both locales — confirming the retheme landed everywhere with no leftover neon/black-theme colors and no layout regression.
