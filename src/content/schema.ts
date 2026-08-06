import {z} from 'zod';

export const LOCALES = ['de', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export type Localized<T> = {de: T; en: T};

/**
 * Wraps a schema so a value must be supplied in BOTH locales.
 * This is what makes a half-translated site a build error rather than a
 * blank space on the live page.
 */
export function localized<T extends z.ZodType>(inner: T) {
  return z.object({de: inner, en: inner});
}

export const localizedText = localized(z.string().min(1));

/**
 * Zod 4's `z.url()` accepts anything WHATWG can parse — `"sup"` passes.
 * Constraining protocol and hostname is what makes a mistyped social link fail.
 */
const webUrl = z.url({protocol: /^https$/, hostname: z.regexes.domain});

export const siteSchema = z.object({
  ownerName: z.string().min(1),
  phone: z.string().min(1),
  phoneHref: z.string().startsWith('tel:'),
  email: z.email(),
  whatsapp: webUrl,
  street: z.string().min(1),
  postcode: z.string().min(1),
  city: z.string().min(1),
  country: z.string().length(2),
  taxId: z.string().min(1),
  socials: z.object({
    instagram: webUrl,
    tiktok: webUrl,
    facebook: webUrl,
  }),
  qualifications: localized(z.array(z.string().min(1)).min(1)),
});

export type Site = z.infer<typeof siteSchema>;

export const durationSchema = z.object({
  minutes: z.number().int().positive(),
  price: z.number().positive().nullable(),
});

/**
 * `placeholder: true` means this is stock imagery standing in until Eddie's own
 * photography arrives. It makes the site render a small visible chip on the
 * image, so nobody mistakes stock for his studio. Set it to false when the real
 * photo is dropped in.
 */
export const imageSchema = z.object({
  src: z.string().startsWith('/images/'),
  alt: localizedText,
  placeholder: z.boolean(),
  /** CSS object-position value — where the crop stays anchored when the frame's aspect ratio cuts into the photo. */
  focus: z.string().default('center'),
});

export type SiteImage = z.infer<typeof imageSchema>;

/**
 * A short, muted, looping ambient clip (walking to the car, arriving at a
 * client's door, etc.) — not a produced video with sound/controls.
 * `src: null` renders as an empty "Platzhalter" tile, same convention as
 * `imageSchema`'s `placeholder: true`, until Eddie has real footage.
 */
export const videoClipSchema = z.object({
  src: z.string().startsWith('/videos/').nullable(),
  poster: z.string().startsWith('/images/').optional(),
  alt: localizedText,
});

export type VideoClip = z.infer<typeof videoClipSchema>;

export type GalleryItem = ({kind: 'image'} & SiteImage) | ({kind: 'video'} & VideoClip);

export const serviceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  acuityTypeId: z.string().nullable(),
  image: imageSchema,
  name: localizedText,
  tagline: localizedText,
  description: localizedText,
  includes: localized(z.array(z.string().min(1)).min(1)),
  durations: z.array(durationSchema).min(1),
});

export const faqGroupSchema = z.object({
  id: z.string().min(1),
  title: localizedText,
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        question: localizedText,
        answer: localizedText,
      }),
    )
    .min(1),
});

export const testimonialSchema = z.object({
  id: z.string().min(1),
  author: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  quote: localizedText,
});

export const welcomePopupSchema = z.object({
  heading: localizedText,
  body: localizedText,
  emailPlaceholder: localizedText,
  submitLabel: localizedText,
  dismissLabel: localizedText,
  confirmHeading: localizedText,
  confirmBody: localizedText,
  bookLabel: localizedText,
  errorMessage: localizedText,
  /** An Acuity coupon code — must exist in Acuity's Coupons panel or it won't actually apply a discount. */
  discountCode: z.string().min(1),
});

export type WelcomePopupContent = z.infer<typeof welcomePopupSchema>;

export const serviceFinderOptionSchema = z.object({
  id: z.string().min(1),
  label: localizedText,
});

export const serviceFinderQuestionSchema = z.object({
  id: z.enum(['goal', 'massageType', 'combine', 'frequency']),
  question: localizedText,
  options: z.array(serviceFinderOptionSchema).min(2),
});

export type ServiceFinderQuestionId = z.infer<typeof serviceFinderQuestionSchema>['id'];

export const serviceFinderResultCopySchema = z.object({
  /** A service slug from src/content/services.ts. */
  id: z.string().min(1),
  /** One-line "why this fits" summary shown on the result screen. */
  summary: localizedText,
});

export const serviceFinderContentSchema = z.object({
  bubbleLabel: localizedText,
  panelHeading: localizedText,
  promptLabel: localizedText,
  questions: z.array(serviceFinderQuestionSchema).length(4),
  results: z.array(serviceFinderResultCopySchema).min(1),
  fallbackHeading: localizedText,
  fallbackBody: localizedText,
  fallbackCta: localizedText,
  bookLabel: localizedText,
  backLabel: localizedText,
  restartLabel: localizedText,
});

export type ServiceFinderContent = z.infer<typeof serviceFinderContentSchema>;

export const legalSchema = z.object({
  imprint: localizedText,
  privacy: localizedText,
  terms: localizedText,
});

export type Legal = z.infer<typeof legalSchema>;

export const homeSchema = z.object({
  hero: z.object({
    kicker: localizedText,
    headline: localized(z.array(z.string().min(1)).min(1)),
    body: localizedText,
  }),
  tickerQuote: localizedText,
  standard: localizedText,
  pillars: z
    .array(
      z.object({
        id: z.string().min(1),
        title: localizedText,
        body: localizedText,
      }),
    )
    .length(3),
  founder: z.object({
    heading: localizedText,
    body: localizedText,
  }),
});

export type Home = z.infer<typeof homeSchema>;

/**
 * A month/day boundary for a recurring yearly promo window (no year — the
 * same window applies every year). `end` before `start` in month/day order
 * means the window wraps across New Year's (e.g. Dec 26 -> Jan 15).
 */
const monthDaySchema = z.object({
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
});

/**
 * Where the campaign's CTA links to. A plain string can't be typed against
 * next-intl's routing (German and English use different URL slugs for the
 * same page — see src/i18n/routing.ts) — this discriminated shape is built
 * into the right typed `Link` href in PromoBanner instead.
 */
export const campaignCtaSchema = z.discriminatedUnion('kind', [
  z.object({kind: z.literal('service'), slug: z.string().min(1)}),
  z.object({kind: z.literal('services')}),
  z.object({kind: z.literal('book')}),
]);

export type CampaignCta = z.infer<typeof campaignCtaSchema>;

export const campaignSchema = z.object({
  id: z.string().min(1),
  start: monthDaySchema,
  end: monthDaySchema,
  eyebrow: localizedText,
  headline: localizedText,
  body: localizedText,
  ctaLabel: localizedText,
  cta: campaignCtaSchema,
  /**
   * An Acuity coupon code — must exist in Acuity's Coupons panel or it won't
   * actually apply a discount (same rule as welcomePopupSchema.discountCode).
   * Null means the campaign promotes a service/season without a specific
   * discount attached.
   */
  discountCode: z.string().min(1).nullable(),
});

export type Campaign = z.infer<typeof campaignSchema>;

export type Service = z.infer<typeof serviceSchema>;
export type FaqGroup = z.infer<typeof faqGroupSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
