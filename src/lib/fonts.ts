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
