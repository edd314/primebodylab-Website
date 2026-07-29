import {setRequestLocale} from 'next-intl/server';
import {legal} from '@/content/legal';
import {LegalText} from '@/components/sections/LegalText';
import {buildMetadata} from '@/lib/metadata';
import type {Metadata} from 'next';
import type {Locale} from '@/content/schema';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale: raw} = await params;
  const locale = raw as Locale;

  return buildMetadata({
    locale,
    href: '/imprint',
    title: locale === 'de' ? 'Impressum | PrimeBodyLab' : 'Imprint | PrimeBodyLab',
    description: locale === 'de' ? 'Anbieterkennzeichnung gemäß § 5 DDG für PrimeBodyLab, Pfaffenhofen.' : 'Legal notice pursuant to § 5 DDG for PrimeBodyLab, Pfaffenhofen.',
  });
}

export default async function ImprintPage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  return (
    <LegalText
      heading={locale === 'de' ? 'Impressum' : 'Imprint'}
      body={legal.imprint[locale]}
    />
  );
}
