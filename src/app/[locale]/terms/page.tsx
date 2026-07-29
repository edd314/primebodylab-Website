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
    href: '/terms',
    title: locale === 'de' ? 'AGB | PrimeBodyLab' : 'Terms & Conditions | PrimeBodyLab',
    description: locale === 'de' ? 'Allgemeine Geschäftsbedingungen für Leistungen von PrimeBodyLab.' : 'Terms and conditions for services provided by PrimeBodyLab.',
  });
}

export default async function TermsPage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  return (
    <LegalText
      heading={locale === 'de' ? 'AGB' : 'Terms & Conditions'}
      body={legal.terms[locale]}
    />
  );
}
