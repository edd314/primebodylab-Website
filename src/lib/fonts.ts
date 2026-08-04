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
