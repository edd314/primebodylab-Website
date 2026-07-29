import {defineRouting} from 'next-intl/routing';

/**
 * German is the default and takes the unprefixed URLs — that is where the local
 * search volume is. English lives under /en.
 *
 * The keys below are the INTERNAL routes used in the app/ directory. The values
 * are what users and search engines actually see.
 */
export const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  localePrefix: 'as-needed',

  /**
   * Deliberately off. With detection enabled, any visitor sending an English
   * Accept-Language header gets redirected from / to /en — including Googlebot,
   * which crawls as en-US. That would leave the German homepage unindexed at the
   * root URL, defeating the point of putting German on the clean URLs.
   * Visitors choose English explicitly via the locale switcher.
   */
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/services': {de: '/leistungen', en: '/services'},
    '/services/[slug]': {de: '/leistungen/[slug]', en: '/services/[slug]'},
    '/book': {de: '/buchen', en: '/book'},
    '/faq': {de: '/faq', en: '/faq'},
    '/imprint': {de: '/impressum', en: '/imprint'},
    '/privacy': {de: '/datenschutz', en: '/privacy'},
    '/terms': {de: '/agb', en: '/terms'},
  },
});
