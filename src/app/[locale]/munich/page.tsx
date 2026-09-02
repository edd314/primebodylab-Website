import {setRequestLocale} from 'next-intl/server';
import {munichPageCopy, munichServices} from '@/content/munich';
import {MunichGrid} from '@/components/sections/MunichGrid';
import {buildMetadata, SITE_URL} from '@/lib/metadata';
import {JsonLd} from '@/components/seo/JsonLd';
import {site} from '@/content/site';
import type {Metadata} from 'next';
import type {Locale} from '@/content/schema';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale: raw} = await params;
  const locale = raw as Locale;

  return buildMetadata({
    locale,
    href: '/munich',
    title: munichPageCopy.metaTitle[locale],
    description: munichPageCopy.metaDescription[locale],
  });
}

export default async function MunichPage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  const minPrice = Math.min(...munichServices.map((service) => service.price));

  return (
    <section className="mx-auto max-w-3xl px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: locale === 'de' ? 'Massage & Sportregeneration' : 'Massage & Sports Recovery',
          name: munichPageCopy.metaTitle[locale],
          description: munichPageCopy.metaDescription[locale],
          url: SITE_URL + (locale === 'de' ? '/muenchen' : '/en/munich'),
          areaServed: {'@type': 'City', name: 'München', containedInPlace: {'@type': 'AdministrativeArea', name: 'Bayern'}},
          provider: {
            '@type': 'HealthAndBeautyBusiness',
            name: 'PrimeBodyLab',
            url: SITE_URL,
            telephone: site.phone,
          },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            lowPrice: minPrice,
            highPrice: Math.max(...munichServices.map((service) => service.price)),
            offerCount: munichServices.length,
            availability: 'https://schema.org/InStock',
          },
        }}
      />

      <h1 className="font-display text-4xl sm:text-5xl">{munichPageCopy.title[locale]}</h1>
      <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-muted">
        {munichPageCopy.intro[locale]}
      </p>

      <div className="mt-6 rounded-2xl border border-line bg-surface px-6 py-5">
        <p className="text-sm leading-relaxed">{munichPageCopy.schedule[locale]}</p>
        <p className="mt-2 text-xs tracking-wide text-muted uppercase">
          {munichPageCopy.scheduleDates[locale]}
        </p>
      </div>

      <MunichGrid locale={locale} />
    </section>
  );
}
