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
