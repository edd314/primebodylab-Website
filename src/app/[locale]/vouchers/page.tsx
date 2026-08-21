import {setRequestLocale} from 'next-intl/server';
import {voucherPageCopy} from '@/content/vouchers';
import {VoucherGrid} from '@/components/sections/VoucherGrid';
import {buildMetadata} from '@/lib/metadata';
import type {Metadata} from 'next';
import type {Locale} from '@/content/schema';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale: raw} = await params;
  const locale = raw as Locale;

  return buildMetadata({
    locale,
    href: '/vouchers',
    title: locale === 'de' ? 'Gutscheine | PrimeBodyLab' : 'Gift Vouchers | PrimeBodyLab',
    description:
      locale === 'de'
        ? 'PrimeBodyLab-Gutscheine für Massagen im Studio oder mobil — digital, sofort verfügbar und online einlösbar.'
        : 'PrimeBodyLab gift vouchers for studio or mobile massages — digital, delivered instantly, redeemable online.',
  });
}

export default async function VouchersPage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  return (
    <section className="mx-auto max-w-3xl px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
      <h1 className="font-display text-4xl sm:text-5xl">{voucherPageCopy.title[locale]}</h1>
      <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-muted">
        {voucherPageCopy.intro[locale]}
      </p>

      <VoucherGrid locale={locale} />
    </section>
  );
}
