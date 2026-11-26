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
  /**
   * Cities/towns Mobile service also covers, beyond the home base in
   * `city`. Plain strings, not localized — place names don't translate.
   */
  serviceArea: z.array(z.string().min(1)).min(1),
  socials: z.object({
    instagram: webUrl,
    tiktok: webUrl,
    facebook: webUrl,
  }),
  qualifications: localized(z.array(z.string().min(1)).min(1)),
  /**
   * Acuity's "Direct Link to Store" for the Gift Vouchers category — shows
   * every voucher so the visitor picks the exact duration/location they
   * want, rather than us maintaining eight separate per-voucher links.
   */
  voucherStoreUrl: webUrl,
});

export type Site = z.infer<typeof siteSchema>;

/** One purchasable gift-voucher tier — mirrors an Acuity gift certificate 1:1. */
export const voucherSchema = z.object({
  id: z.string().min(1),
  minutes: z.number().int().positive(),
  location: z.enum(['studio', 'mobile']),
  price: z.number().positive(),
});

export type Voucher = z.infer<typeof voucherSchema>;

export const durationSchema = z.object({
  minutes: z.number().int().positive(),
  price: z.number().positive().nullable(),
});

/**
 * One bookable duration of the Munich Pop-Up offering. Unlike the Studio
 * services in serviceSchema, each duration here is its own distinct Acuity
 * appointment type (not a shared category), so it links straight out to its
 * own Acuity booking page rather than going through the /book?service= flow.
 */
export const munichServiceSchema = z.object({
  id: z.string().min(1),
  group: z.enum(['wellness', 'performance', 'stretch', 'bundle']),
  minutes: z.number().int().positive(),
  price: z.number().positive(),
  bookingUrl: z.url({protocol: /^https$/, hostname: z.regexes.domain}),
});

export type MunichService = z.infer<typeof munichServiceSchema>;

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

export type GalleryItem = {kind: 'image'} & SiteImage;

/**
 * The homepage "watch a session" moment — a tap-to-play clip with real
 * audio (voiceover-free background music), unlike `videoClipSchema`'s
 * always-muted ambient loop. Visitor-initiated playback is what lets
 * browsers allow the sound at all.
 */
export const videoIntroSchema = z.object({
  src: z.string().startsWith('/videos/'),
  poster: z.string().startsWith('/images/'),
  alt: localizedText,
  eyebrow: localizedText,
  heading: localizedText,
  body: localizedText,
  playLabel: localizedText,
});

export type VideoIntro = z.infer<typeof videoIntroSchema>;

export const serviceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  acuityTypeId: z.string().nullable(),
  image: imageSchema,
  /** Optional second photo shown only on the service's own detail page. Falls back to `image` when unset. */
  detailImage: imageSchema.optional(),
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

export const companyStatSchema = z.object({
  id: z.string().min(1),
  value: localizedText,
  label: localizedText,
});

export const companyStepSchema = z.object({
  id: z.string().min(1),
  title: localizedText,
  body: localizedText,
});

export const companyFaqItemSchema = z.object({
  id: z.string().min(1),
  question: localizedText,
  answer: localizedText,
});

/**
 * Homepage "Für Unternehmen" band — a corporate on-site massage/stretch
 * pitch aimed at companies, distinct from the individual-client content
 * above. `calculator.minuteOptions` drives the duration buttons shown in
 * `CompanyCalculator`; `defaultEmployees` must fall within
 * [minEmployees, maxEmployees].
 */
export const companiesSchema = z.object({
  eyebrow: localizedText,
  headline: localizedText,
  body: localizedText,
  stats: z.array(companyStatSchema).min(1),
  /** Attribution/disclaimer shown under the stat row — see content/companies.ts for why these are still placeholders. */
  statsSource: localizedText,
  steps: z.array(companyStepSchema).length(3),
  calculator: z.object({
    heading: localizedText,
    employeesLabel: localizedText,
    durationLabel: localizedText,
    frequencyLabel: localizedText,
    totalLabel: localizedText,
    perHeadLabel: localizedText,
    minuteOptions: z.array(z.number().int().positive()).min(2),
    defaultEmployees: z.number().int().positive(),
    minEmployees: z.number().int().positive(),
    maxEmployees: z.number().int().positive(),
    /** Extra % off on top of the base corporate rate, keyed by booking rhythm — first entry is the default selection. */
    frequencyOptions: z
      .array(
        z.object({
          id: z.string().min(1),
          label: localizedText,
          extraDiscountPercent: z.number().min(0).max(100),
        }),
      )
      .min(2),
    /**
     * OPTIONAL upfront commitment, stacked on top of the rhythm discount —
     * never a requirement. The company FAQ ("Gibt es eine Mindestlaufzeit?")
     * explicitly promises no minimum term; this only rewards a voluntary
     * commitment with a better price, it never gates booking on one.
     * First entry is the default ("no commitment") selection.
     */
    commitmentOptions: z
      .array(
        z.object({
          id: z.string().min(1),
          months: z.number().int().min(0),
          label: localizedText,
          extraDiscountPercent: z.number().min(0).max(100),
        }),
      )
      .min(2),
  }),
  trust: z.object({
    eyebrow: localizedText,
    /** Real on-site clients only — never pad this with companies PrimeBodyLab hasn't actually served. */
    clients: z.array(z.object({id: z.string().min(1), name: z.string().min(1)})).min(1),
    note: localizedText,
  }),
  faq: z.array(companyFaqItemSchema).min(1),
  ctaLabel: localizedText,
  /** The dedicated /companies request page — configurator + lead form. */
  requestPage: z.object({
    eyebrow: localizedText,
    title: localizedText,
    intro: localizedText,
    form: z.object({
      companyNameLabel: localizedText,
      contactNameLabel: localizedText,
      emailLabel: localizedText,
      phoneLabel: localizedText,
      phoneOptionalNote: localizedText,
      submitLabel: localizedText,
      privacyNote: localizedText,
    }),
    confirmation: z.object({
      heading: localizedText,
      body: localizedText,
      whatsappButtonLabel: localizedText,
      copyButtonLabel: localizedText,
      copiedLabel: localizedText,
    }),
  }),
});

export type Companies = z.infer<typeof companiesSchema>;

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
