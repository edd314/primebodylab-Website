import type {MetadataRoute} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {services} from '@/content/services';
import {SITE_URL} from '@/lib/metadata';

type Href = Parameters<typeof getPathname>[0]['href'];

const staticHrefs: Href[] = [
  '/',
  '/services',
  '/vouchers',
  '/munich',
  '/book',
  '/faq',
  '/imprint',
  '/privacy',
  '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const serviceHrefs: Href[] = services.map((service) => ({
    pathname: '/services/[slug]' as const,
    params: {slug: service.slug},
  }));

  return [...staticHrefs, ...serviceHrefs].map((href) => ({
    url: SITE_URL + getPathname({locale: routing.defaultLocale, href}),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, SITE_URL + getPathname({locale, href})]),
      ),
    },
  }));
}
