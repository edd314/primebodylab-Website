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

  // Stock — Unsplash photo nMVUTY8_gGw
  massage: imageSchema.parse({
    src: '/images/stock-massage.jpg',
    alt: {
      de: 'Hände bei einer Rückenmassage',
      en: 'Hands performing a back massage',
    },
    placeholder: true,
  }),

  // Stock — Unsplash photo gavoj4Q_C_Q
  stretch: imageSchema.parse({
    src: '/images/stock-stretch.jpg',
    alt: {
      de: 'Therapeut dehnt das Bein eines Klienten auf der Behandlungsliege',
      en: 'Therapist stretching a client’s leg on the treatment table',
    },
    placeholder: true,
  }),

  // Stock — Unsplash photo 8DcwvlVXIVw
  coaching: imageSchema.parse({
    src: '/images/stock-coaching.jpg',
    alt: {
      de: 'Kurzhanteln für das Krafttraining',
      en: 'Dumbbells used for strength training',
    },
    placeholder: true,
  }),
} satisfies Record<string, SiteImage>;
