import {Fraunces, Inter, Space_Grotesk} from 'next/font/google';

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

/**
 * Used only on the Performance Coaching page's "Kinetic Lab" dark treatment
 * (technical headline face). Not applied at the root layout, so it's only
 * fetched when that page's wrapper opts in — see
 * src/app/[locale]/services/[slug]/page.tsx.
 */
export const kineticFont = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
});
