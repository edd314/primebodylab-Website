# PrimeBodyLab — Custom Site Rebuild

**Date:** 2026-07-29
**Status:** Approved design, ready for implementation planning
**Client:** Eddie Ekanem, PrimeBodyLab, Pfaffenhofen (Bavaria, Germany)
**Repo:** `D:\dev\sites\primebodylab`

---

## 1. Context

PrimeBodyLab is a one-person performance and recovery practice: sports massage, assisted
stretch therapy, and online performance coaching. It currently runs on Squarespace at
`primebodylab.de`, in English only, with booking delegated to Acuity
(`opensessions.as.me`).

The owner is not a developer but will have the same tooling as us — VS Code with Claude
Code — so he can maintain content himself through his agent.

### Current site inventory

| Page | Content |
| --- | --- |
| `/` | Hero "Recover Stronger. Train Smarter. Move Better.", what-is section, three pillars (Performance / Recovery / Movement), founder intro, 4 testimonials, FAQ teaser, footer with legal details |
| `/services` | Performance Massage (from €80), Assisted Stretch Therapy (no price), Performance Coaching (no price) |
| `/faqs-2` | ~19 Q&As: booking, massage/stretch, coaching |
| `/appointments` | Acuity embed |
| `/terms-conditions-and-privacy-policy` | Combined legal page |

Existing brand: **Anton** (display) + **Epilogue** (body), both Google Fonts. Eight images
total on the homepage. Business details: `+49 176 83248394`,
`book_primebodylab@proton.me`, WhatsApp, Hans-Kohlman-str, 85276 Pfaffenhofen, Tax ID
`154/214/50789`.

### Goal

Rebuild custom with a design upgrade — same services and substance, sharper execution,
faster, German-first for local search, and owner-maintainable without a CMS subscription.

---

## 2. Decisions

These were settled during brainstorming and are not open for re-litigation during
implementation.

| Decision | Choice | Rationale |
| --- | --- | --- |
| Scope | Rebuild + design upgrade | Same content, redesigned visual layer and page structure |
| Booking | Keep Acuity, embed in-brand | Calendar, deposits and reminders already live there; zero migration risk |
| Languages | German (default) + English | Local search in Pfaffenhofen is German; English retained for expat and online coaching |
| Content editing | Typed files in repo, edited via Claude Code | Owner has the same tooling; no CMS cost or schema layer |
| Visual direction | **B — Recovery Clinic** | Client base skews professional (two doctors in testimonials); clinic positioning justifies €80+ better than gym positioning |
| Photography | Design for scarcity now, stock as accents, real shoot later | Owner is arranging a shoot; layout must not depend on it |
| Blog | In scope, agent-authored, human-approved | Owner intends to run it with an AI agent |
| Legal copy | Carry across the owner's existing wording verbatim | Client states current content is compliant; not our call to rewrite |

### Non-goals

- No custom booking engine, payments, or calendar. Acuity owns that.
- No CMS (Sanity, Payload, or otherwise).
- No user accounts, client portal, or programme delivery app.
- No dark mode. The chosen direction is a light palette; a second theme is unused surface.
- No unit tests on presentational components.

---

## 3. Architecture

### Stack

- **Next.js (App Router) + TypeScript** — fully statically generated, no runtime server
- **Tailwind CSS** with CSS-variable design tokens
- **next-intl** for i18n, configured for static rendering (`generateStaticParams` +
  `setRequestLocale` per the current next-intl App Router docs)
- **MDX** for journal posts
- **Vercel** hosting; static output is free at this traffic level
- **Plausible** (EU-hosted, cookieless) for analytics

### Routing

German is the default locale and takes unprefixed URLs; English is prefixed.

```
primebodylab.de/       → German
primebodylab.de/en/    → English
```

`next-intl` `defineRouting` with `localePrefix: 'as-needed'`, `defaultLocale: 'de'`, and
localised pathnames.

Every page emits `hreflang` alternates and a canonical URL via Next's `alternates`
metadata, plus a localised `sitemap.ts` with `alternates.languages` entries.

### Site map

| Route (de) | Route (en) | Notes |
| --- | --- | --- |
| `/` | `/en` | Homepage |
| `/leistungen` | `/en/services` | Services overview |
| `/leistungen/[slug]` | `/en/services/[slug]` | **New** — one page per service, full pricing |
| `/buchen` | `/en/book` | Acuity, click-to-load |
| `/faq` | `/en/faq` | Structured Q&As |
| `/gutscheine` | `/en/gift-vouchers` | **New** — gift vouchers |
| `/leistungen/[slug]/[stadt]` | `/en/services/[slug]/[city]` | **New** — local SEO landing pages |
| `/journal` | `/en/journal` | Blog index |
| `/journal/[slug]` | `/en/journal/[slug]` | Blog post |
| `/impressum` | `/en/impressum` | **Split out** — required, one click from every page |
| `/datenschutz` | `/en/privacy` | **Split out** |
| `/agb` | `/en/terms` | **Split out** |

**Why per-service pages:** each service is a distinct search term and a distinct decision.
A single shared page cannot rank for three services or present three price lists clearly.

**Why the legal pages split:** German sites require a separately reachable Impressum. The
current combined page is consolidated for convenience rather than structured as required.

**Why local pages nest under services:** a root-level `/[stadt]/[leistung]` pattern would
sit at the same level as `/faq`, `/buchen` and `/impressum`. Next.js resolves static
segments first so it would function, but any mistyped static route silently falls through
to a location page instead of a clean 404. Nesting under `/leistungen/[slug]/` removes the
ambiguity, keeps both keywords in the URL, and makes breadcrumbs coherent.

### Component architecture

Section components take typed props and never read content files directly. Pages compose
sections and pass data in. This is what makes owner edits safe — changing a price touches
one data file and cannot break a layout.

Planned sections: `Hero`, `PillarGrid`, `ServiceCard`, `ServiceDetail`, `FounderBlock`,
`TestimonialRow`, `FaqAccordion`, `BookingGate`, `CtaBand`, `LocalIntro`, `Footer`.

---

## 4. Content model

```
content/
  services.ts        names, slugs, prices, durations, inclusions, Acuity IDs (de + en)
  faqs.ts            every Q&A, grouped by category (de + en)
  testimonials.ts    reviews, ratings, attribution (de + en)
  site.ts            phone, email, address, hours, tax ID, social links
  locations.ts       towns and service combinations for local SEO pages
  journal/de/*.mdx
  journal/en/*.mdx
```

One typed file per content type, with German and English adjacent inside each record so
translations cannot drift apart unnoticed. Types are defined such that omitting a locale
is a compile error.

A repo-root `CLAUDE.md` maps plain-language requests to files — "change the 90-minute
massage price" → `content/services.ts`, the `durations` array — so the owner's agent edits
the right thing without exploring.

### Journal pipeline

Agent-authored MDX with typed frontmatter (`title`, `description`, `locale`, `slug`,
`date`, `author`, `published`). Posts are written with `published: false` and only appear
on the site once the owner flips the flag. This is a quality gate, not a legal one: content
published under his name and credentials gets a human read first.

---

## 5. Design system

Direction **B — Recovery Clinic**: warm, airy, editorial. Reads as a private practice
rather than a gym.

### Tokens

| Token | Value | Use |
| --- | --- | --- |
| `bone` | `#F6F3ED` | Page background |
| `ink` | `#1D2420` | Body text |
| `forest` | `#2E3A33` | Primary buttons, headings |
| `sage` | `#3E6B54` | Accent, emphasis |
| `muted` | `#5C635A` | Secondary text |
| `line` | `#DFDBD2` | Hairline rules |

All exposed as CSS variables so a future shift toward a darker, photo-led treatment is a
token change rather than a rebuild.

### Typography

**Instrument Serif** (display) + **Inter** (body), both **self-hosted via `next/font`**.

Self-hosting is required, not preferred: loading fonts from Google's CDN transmits visitor
IP addresses to the US, which has produced damages rulings and warning-letter campaigns in
Germany. Self-hosting removes the exposure and is faster.

### Handling image scarcity

Layout carries the design: generous whitespace, a strong type scale, hairline-ruled section
breaks, asymmetric two-column blocks. Image slots are defined but degrade gracefully — a
page must look deliberate with two images and better with twenty.

Stock imagery is limited to environment, texture and detail (interiors, equipment,
non-identifiable hands-on shots). No stock portrait may stand in for the owner, and no
stock interior may be presented as his studio. Every slot is structured so real photography
drops in as a file swap with no layout change.

---

## 6. Booking flow

Acuity is US-hosted and sets cookies, so it is not loaded on page load.

1. Each service CTA deep-links to `/buchen` with its Acuity appointment type pre-selected.
2. `/buchen` renders an in-brand panel — service, duration, price, preparation notes —
   with a single "Buchungskalender laden" action.
3. Acuity's script is injected only on that click.

This is the standard German two-click embed pattern and is also better UX: the brand holds
right up to the moment of intent instead of handing off to an unfamiliar domain
mid-decision.

Phone and WhatsApp remain pinned on mobile throughout; a meaningful share of local clients
will call rather than book online.

### No cookie banner

Self-hosted fonts + cookieless analytics + click-to-load embeds means nothing on the site
requires consent. Every visitor skips a banner, which is worth real conversions.

---

## 7. SEO

- **Structured data:** `LocalBusiness` and `Service` JSON-LD with NAP matching the Google
  Business Profile exactly; `FAQPage` on the FAQ page; `Article` on journal posts;
  `BreadcrumbList` on nested routes.
- **Local pages:** town × service, restricted to towns genuinely served. Each carries
  distinct content — travel radius, what mobile service includes, local specifics. Thin
  near-duplicate town pages are treated as doorway pages and are actively harmful; six
  honest pages beat thirty templated ones.
- **Performance:** static output, self-hosted fonts, `next/image` with correct sizing.
  Core Web Vitals green on mobile.
- **Redirects:** old Squarespace URLs 301 to their new equivalents (see §9).

---

## 8. Testing

Proportionate to a static marketing site.

| Test | Purpose |
| --- | --- |
| Zod validation of `content/*.ts` at build | A service missing a German price fails the build rather than shipping blank |
| Locale parity test | Every key present in `de` must exist in `en` and vice versa — catches half-translated pages, the classic i18n failure |
| `needsReview` gate | Fails only the production release while any content still carries unapproved placeholder translation (see §10) |
| Playwright smoke tests | Every route renders in both locales; booking CTAs resolve to the correct Acuity appointment type; no console errors; no broken links |
| Lighthouse budget in CI | Fails the build if Core Web Vitals regress |

Presentational components are not unit tested — that tests markup, not behaviour.

---

## 9. Deployment and cutover

Redirect map (each also applies under `/en`):

| Old | New |
| --- | --- |
| `/services` | `/leistungen` |
| `/appointments` | `/buchen` |
| `/faqs-2` | `/faq` |
| `/terms-conditions-and-privacy-policy` | `/datenschutz` |

Sequence:

1. Build and deploy to a Vercel preview URL
2. Owner reviews on preview
3. Move DNS for `primebodylab.de` from Squarespace to Vercel
4. Confirm redirects resolve
5. Submit the new sitemap in Google Search Console
6. Cancel Squarespace **only after** propagation is confirmed

### Build phases

Each is independently shippable:

1. Foundation — Next.js, i18n routing, design tokens, layout shell, content schemas
2. Homepage and services (overview + per-service pages)
3. Booking gate, FAQ, legal pages
4. Local SEO pages and gift vouchers
5. Journal and analytics

---

## 10. Client inputs required

On the critical path — needed before phases 2 and 3 can complete:

1. German copy for every page, or approval to translate the existing English for his review
2. Acuity appointment type IDs
3. Prices for stretch therapy and performance coaching (currently unpublished)
4. Google Business Profile access
5. Logo as SVG or high-resolution PNG (current asset is a small raster)
6. Photography, when the shoot is done

### Assumptions

Stated explicitly so they can be corrected rather than discovered late:

- `primebodylab.de` is registered through Squarespace and its DNS can be repointed to
  Vercel without transferring the registrar.
- Gift vouchers will be issued through Acuity's gift certificate feature rather than a
  separate Stripe integration. If Acuity's voucher handling proves inadequate, this
  becomes a scoped follow-up, not a blocker.
- Existing testimonials may be reproduced on the new site as written.
- Until the owner's German copy arrives, German fields are filled with our own translation
  of his existing English and flagged `needsReview: true`. The parity test therefore passes
  throughout development, and a separate pre-launch gate fails while any `needsReview` flag
  remains set. This keeps CI green during the build while making unapproved copy impossible
  to ship by accident.
