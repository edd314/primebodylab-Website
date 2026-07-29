import type {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {bodyFont, displayFont} from '@/lib/fonts';
import {Header} from '@/components/layout/Header';
import {Footer} from '@/components/layout/Footer';
import {MobileContactBar} from '@/components/layout/MobileContactBar';
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
        <NextIntlClientProvider>
          <Header locale={locale} />
          <main className="pb-20 sm:pb-0">{children}</main>
          <Footer locale={locale} />
          <MobileContactBar locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
