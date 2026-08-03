import {imageSchema, type SiteImage} from './schema';

/**
 * Every photograph on the site, in one place.
 *
 * `placeholder: false` — Eddie's own photography, taken from his current site.
 * `placeholder: true`  — licensed stock standing in until his shoot is done.
 *                        These render with a visible "Platzhalter" chip so no
 *                        visitor mistakes stock for his studio or his clients.
 *
 * To swap in a real photo: drop the file into public/images/, point `src` at it,
 * and set `placeholder: false`. Nothing else needs to change — the layouts are
 * already sized for these crops.
 *
 * Stock sources are Unsplash (Unsplash License: free for commercial use, no
 * attribution required). Recorded here so they can be traced and replaced.
 */
export const images = {
  founder: imageSchema.parse({
    src: '/images/eddie-founder.jpg',
    alt: {
      de: 'Eddie Ekanem, Gründer von PrimeBodyLab',
      en: 'Eddie Ekanem, founder of PrimeBodyLab',
    },
    placeholder: false,
  }),

  treatmentRoom: imageSchema.parse({
    src: '/images/treatment-room.webp',
    alt: {
      de: 'Behandlungsraum von PrimeBodyLab in Pfaffenhofen',
      en: 'The PrimeBodyLab treatment room in Pfaffenhofen',
    },
    placeholder: false,
  }),

  // Stock — placeholder until Eddie has a suitable real photo for this service.
  wellnessMassage: imageSchema.parse({
    src: '/images/stock-massage.jpg',
    alt: {
      de: 'Hände bei einer Rückenmassage',
      en: 'Hands performing a back massage',
    },
    placeholder: true,
  }),

  massage: imageSchema.parse({
    src: '/images/eddie-massage.jpg',
    alt: {
      de: 'Eddie bei einer Performance & Recovery Massage',
      en: 'Eddie performing a Performance & Recovery Massage',
    },
    placeholder: false,
  }),

  stretch: imageSchema.parse({
    src: '/images/eddie-stretch.jpg',
    alt: {
      de: 'Eddie bei der Behandlung eines Klienten',
      en: 'Eddie treating a client',
    },
    placeholder: false,
  }),

  coaching: imageSchema.parse({
    src: '/images/eddie-coaching.jpg',
    alt: {
      de: 'Eddie beim Kraftraining im Clever Fit Studio',
      en: 'Eddie strength training at Clever Fit',
    },
    placeholder: false,
    focus: 'center 25%',
  }),

  // Stock — placeholder until Eddie has a real photo for this bundle.
  bundle: imageSchema.parse({
    src: '/images/stock-massage.jpg',
    alt: {
      de: 'Hände bei einer Rückenmassage',
      en: 'Hands performing a back massage',
    },
    placeholder: true,
  }),
} satisfies Record<string, SiteImage>;
