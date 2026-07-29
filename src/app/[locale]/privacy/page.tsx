import {setRequestLocale} from 'next-intl/server';
import {legal} from '@/content/legal';
import {LegalText} from '@/components/sections/LegalText';
import type {Locale} from '@/content/schema';

type Props = {params: Promise<{locale: string}>};

export default async function PrivacyPage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  return (
    <LegalText
      heading={locale === 'de' ? 'Datenschutz' : 'Privacy Policy'}
      body={legal.privacy[locale]}
    />
  );
}
