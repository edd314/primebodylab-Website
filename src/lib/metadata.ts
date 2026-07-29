import type {Metadata} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import type {Locale} from '@/content/schema';

export const SITE_URL = 'https://www.primebodylab.de';

/**
 * `href` is next-intl's route href — either a pathname declared in
 * `routing.pathnames`, or `{pathname, params}` for a dynamic route. Borrowing
 * the type from getPathname keeps it correct without restating the union.
 */
type Href = Parameters<typeof getPathname>[0]['href'];

type Args = {
  locale: Locale;
  href: Href;
  title: string;
  description: string;
};

export function buildMetadata({locale, href, title, description}: Args): Metadata {
  const languages: Record<string, string> = {};

  for (const candidate of routing.locales) {
    languages[candidate] = SITE_URL + getPathname({locale: candidate, href});
  }

  const canonical = SITE_URL + getPathname({locale, href});

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {...languages, 'x-default': languages[routing.defaultLocale]},
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'PrimeBodyLab',
      locale: locale === 'de' ? 'de_DE' : 'en_GB',
      type: 'website',
    },
  };
}
