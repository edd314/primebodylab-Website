import {setRequestLocale} from 'next-intl/server';
import {home} from '@/content/home';
import {companies} from '@/content/companies';
import {bookCta} from '@/lib/nav';
import {images} from '@/content/images';
import {getService} from '@/content/services';
import {getCompanyRatePerMinute} from '@/lib/pricing';
import {Hero} from '@/components/sections/Hero';
import {ServiceTicker} from '@/components/sections/ServiceTicker';
import {CompanyBand} from '@/components/sections/CompanyBand';
import {Gallery} from '@/components/sections/Gallery';
import {PillarGrid} from '@/components/sections/PillarGrid';
import {FounderBlock} from '@/components/sections/FounderBlock';
import {TestimonialRow} from '@/components/sections/TestimonialRow';
import {CtaBand} from '@/components/sections/CtaBand';
import {buildMetadata} from '@/lib/metadata';
import type {Metadata} from 'next';
import type {Locale} from '@/content/schema';

const wellnessService = getService('wellness-recovery-massage');
if (!wellnessService) {
  throw new Error('Expected wellness-recovery-massage service to exist');
}
const companyRatePerMinute = getCompanyRatePerMinute(wellnessService);

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: raw} = await params;
  const locale = raw as Locale;

  // Shorter and location-led on purpose: GSC data (11 Oct-10 Nov 2026) showed
  // "wellness wolnzach", "wellness pfaffenhofen" and "massagen pfaffenhofen"
  // ranking #1-2 with 0% CTR. The old title was long enough to truncate
  // before "Pfaffenhofen" in the SERP, and never mentioned Wolnzach at all —
  // so a Wolnzach searcher saw what looked like an out-of-town result.
  return buildMetadata({
    locale,
    href: '/',
    title:
      locale === 'de'
        ? 'Massage & Wellness in Pfaffenhofen & Wolnzach | PrimeBodyLab'
        : 'Massage & Wellness in Pfaffenhofen & Wolnzach | PrimeBodyLab',
    description:
      locale === 'de'
        ? 'Massage & Wellness in Pfaffenhofen an der Ilm und Wolnzach — im Studio oder mobil vor Ort. Sportmassage, Stretch-Therapie & Coaching. Jetzt Termin buchen.'
        : 'Massage & wellness in Pfaffenhofen an der Ilm and Wolnzach — studio-based or mobile on-site. Sports massage, stretch therapy & coaching. Book now.',
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
        image={images.heroPortrait}
      />
      <ServiceTicker locale={locale} quote={home.tickerQuote} />
      <CompanyBand locale={locale} companies={companies} ratePerMinute={companyRatePerMinute} />
      <Gallery locale={locale} />
      <PillarGrid locale={locale} pillars={home.pillars} standard={home.standard} />
      <FounderBlock locale={locale} founder={home.founder} />
      <TestimonialRow locale={locale} />
      <CtaBand locale={locale} />
    </>
  );
}
