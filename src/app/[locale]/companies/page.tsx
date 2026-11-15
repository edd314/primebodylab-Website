import {setRequestLocale} from 'next-intl/server';
import {companies} from '@/content/companies';
import {site} from '@/content/site';
import {getService} from '@/content/services';
import {getCompanyRatePerMinute} from '@/lib/pricing';
import {CompanyRequestForm} from '@/components/sections/CompanyRequestForm';
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

  return buildMetadata({
    locale,
    href: '/companies',
    title:
      locale === 'de'
        ? 'Firmenangebot konfigurieren | PrimeBodyLab'
        : 'Configure your corporate plan | PrimeBodyLab',
    description:
      locale === 'de'
        ? 'Teamgröße, Dauer und Rhythmus wählen, Preis sehen und die Anfrage direkt per WhatsApp senden — ohne Mindestlaufzeit.'
        : 'Pick team size, duration and rhythm, see the price, and send your request straight over WhatsApp — no minimum term.',
  });
}

export default async function CompaniesPage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  return (
    <section className="mx-auto max-w-3xl px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
      <span className="text-xs font-semibold tracking-[0.08em] text-sage uppercase">
        {companies.requestPage.eyebrow[locale]}
      </span>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">{companies.requestPage.title[locale]}</h1>
      <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-muted">
        {companies.requestPage.intro[locale]}
      </p>

      <div className="mt-10">
        <CompanyRequestForm
          locale={locale}
          companies={companies}
          ratePerMinute={companyRatePerMinute}
          whatsappBaseUrl={site.whatsapp}
        />
      </div>
    </section>
  );
}
