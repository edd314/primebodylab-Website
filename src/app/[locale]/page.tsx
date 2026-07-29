import {setRequestLocale} from 'next-intl/server';
import {home} from '@/content/home';
import {bookCta} from '@/lib/nav';
import {Hero} from '@/components/sections/Hero';
import {PillarGrid} from '@/components/sections/PillarGrid';
import {FounderBlock} from '@/components/sections/FounderBlock';
import {TestimonialRow} from '@/components/sections/TestimonialRow';
import {CtaBand} from '@/components/sections/CtaBand';
import type {Locale} from '@/content/schema';

type Props = {params: Promise<{locale: string}>};

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
      <PillarGrid locale={locale} pillars={home.pillars} standard={home.standard} />
      <FounderBlock locale={locale} founder={home.founder} />
      <TestimonialRow locale={locale} />
      <CtaBand locale={locale} />
    </>
  );
}
