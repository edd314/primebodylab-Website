<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# PrimeBodyLab — working on this site

This is Eddie Ekanem's site for PrimeBodyLab (Pfaffenhofen, Germany). It's a
Next.js site deployed on Vercel. Pushing to `main` deploys automatically.

## Where content lives

All copy is in `src/content/`. You almost never need to touch anything else.

| I want to change… | Edit this file |
| --- | --- |
| A price or session length | `src/content/services.ts` → that service's `durations` |
| A service name, description, or what's included | `src/content/services.ts` |
| A question or answer on the FAQ page | `src/content/faqs.ts` |
| A customer review | `src/content/testimonials.ts` |
| Phone, email, address, tax number, social links | `src/content/site.ts` |
| Homepage headline, the three pillars, the founder blurb | `src/content/home.ts` |
| Impressum, privacy policy, terms | `src/content/legal.ts` |
| Menu labels and button text | `src/lib/nav.ts` |

## Rules that must not be broken

1. **Every piece of text needs both German and English.** Fields look like
   `{de: '…', en: '…'}`. Leaving one out will not build. That's deliberate — it
   stops half-translated pages reaching visitors.

2. **Never load a third-party script on page load.** The booking calendar loads
   only when the visitor clicks the button
   (`src/components/booking/BookingGate.tsx`). This is the only reason the site
   has no cookie banner. Do not "simplify" it into a normal embed — there is a
   test that will fail if you do.

3. **Fonts are self-hosted.** Never add a `<link>` to Google Fonts. Loading fonts
   from Google's servers sends visitor IP addresses abroad and has produced
   damages claims in Germany. `src/lib/fonts.ts` handles this correctly, and a
   test enforces it.

4. **Impressum, Datenschutz and AGB stay three separate pages.**

5. **German is the default language and has no `/de` prefix.** English lives
   under `/en`. Automatic language detection is switched off on purpose — see the
   comment in `src/i18n/routing.ts` before changing it.

## Before publishing a change

```bash
npm test          # content checks
npm run build     # catches missing translations
```

Both must pass. If the build complains about a missing `de` or `en` field,
that's rule 1 doing its job.

## German copy approval

`src/content/review.json` lists every piece of German text that is still our
translation rather than Eddie's own wording. When Eddie approves a section,
delete its id from that list. `npm run check:release` fails while anything
remains, so unapproved copy cannot go live by accident.

Open questions for Eddie are tracked in `docs/client-questions.md`.

## Booking

Bookings are handled by Acuity, not by this site. To change availability or what
customers can book, log in to Acuity. The prices shown on this website are
separate — update both, or they will disagree.

To make each "Book now" button open the right service, put the Acuity
appointment type ids into `acuityTypeId` in `src/content/services.ts`. Until
then, every button opens the general calendar.

## Photography

Image slots are already laid out (see `src/components/sections/FounderBlock.tsx`).
When real photos exist, drop them in and swap the placeholder block for
`next/image` — no layout changes needed.
