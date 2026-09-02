import {setRequestLocale} from 'next-intl/server';
import {munichPageCopy} from '@/content/munich';
import {MunichGrid} from '@/components/sections/MunichGrid';
import {buildMetadata} from '@/lib/metadata';
import type {Metadata} from 'next';
import type {Locale} from '@/content/schema';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale: raw} = await params;
  const locale = raw as Locale;

  return buildMetadata({
    locale,
    href: '/munich',
    title: locale === 'de' ? 'München Pop-Up | PrimeBodyLab' : 'Munich Pop-Up | PrimeBodyLab',
    description:
      locale === 'de'
        ? 'Jeden zweiten Samstag in München — Massagen und Behandlungen von PrimeBodyLab, online buchbar.'
        : 'Every other Saturday in Munich — massages and treatments from PrimeBodyLab, bookable online.',
  });
}

export default async function MunichPage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  return (
    <section className="mx-auto max-w-3xl px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
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
