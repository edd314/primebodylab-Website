import {setRequestLocale} from 'next-intl/server';
import {home} from '@/content/home';
import {bookCta} from '@/lib/nav';
import {Hero} from '@/components/sections/Hero';
import {ServiceTicker} from '@/components/sections/ServiceTicker';
import {Gallery} from '@/components/sections/Gallery';
import {PillarGrid} from '@/components/sections/PillarGrid';
import {FounderBlock} from '@/components/sections/FounderBlock';
import {TestimonialRow} from '@/components/sections/TestimonialRow';
import {CtaBand} from '@/components/sections/CtaBand';
import {buildMetadata} from '@/lib/metadata';
import type {Metadata} from 'next';
import type {Locale} from '@/content/schema';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: raw} = await params;
  const locale = raw as Locale;

  return buildMetadata({
    locale,
    href: '/',
    title:
      locale === 'de'
        ? 'PrimeBodyLab — Wellnessmassage, Sportmassage, Stretching & Coaching in Pfaffenhofen'
        : 'PrimeBodyLab — Wellness & Sports Massage, Stretching & Coaching in Pfaffenhofen',
    description: home.hero.body[locale],
  });
}

export default async function HomePage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  return (
    <>
      <Hero
        locale={locale}
        kicker={home.hero.kicker}
        headline={home.hero.headline}
        body={home.hero.body}
        ctaLabel={bookCta[locale]}
      />
      <ServiceTicker locale={locale} />
      <Gallery locale={locale} />
      <PillarGrid locale={locale} pillars={home.pillars} standard={home.standard} />
      <FounderBlock locale={locale} founder={home.founder} />
      <TestimonialRow locale={locale} />
      <CtaBand locale={locale} />
    </>
  );
}
