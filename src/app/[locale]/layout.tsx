import type {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {bodyFont, displayFont} from '@/lib/fonts';
import {Header} from '@/components/layout/Header';
import {Footer} from '@/components/layout/Footer';
import {MobileContactBar} from '@/components/layout/MobileContactBar';
import {WelcomePopup} from '@/components/WelcomePopup';
import {ServiceFinderWidget} from '@/components/ServiceFinderWidget';
import {JsonLd} from '@/components/seo/JsonLd';
import {site} from '@/content/site';
import {SITE_URL} from '@/lib/metadata';
import type {Locale} from '@/content/schema';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

type Props = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export default async function LocaleLayout({children, params}: Props) {
  const {locale: raw} = await params;

  if (!hasLocale(routing.locales, raw)) {
    notFound();
  }

  setRequestLocale(raw);
  const locale = raw as Locale;

  return (
    <html lang={locale} className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="bg-bone text-ink antialiased">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'HealthAndBeautyBusiness',
            name: 'PrimeBodyLab',
            url: SITE_URL,
            telephone: site.phone,
            email: site.email,
            founder: {'@type': 'Person', name: site.ownerName},
            address: {
              '@type': 'PostalAddress',
              streetAddress: site.street,
              postalCode: site.postcode,
              addressLocality: site.city,
              addressCountry: site.country,
            },
            sameAs: Object.values(site.socials),
          }}
        />

        <NextIntlClientProvider>
          <Header locale={locale} />
          <main className="pb-20 sm:pb-0">{children}</main>
          <Footer locale={locale} />
          <MobileContactBar locale={locale} />
          <WelcomePopup locale={locale} />
          <ServiceFinderWidget locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
