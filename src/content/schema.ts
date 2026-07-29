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

export const serviceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  acuityTypeId: z.string().nullable(),
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

export type Service = z.infer<typeof serviceSchema>;
export type FaqGroup = z.infer<typeof faqGroupSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
