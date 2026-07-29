import {setRequestLocale} from 'next-intl/server';
import {faqs} from '@/content/faqs';
import {FaqAccordion} from '@/components/sections/FaqAccordion';
import {JsonLd} from '@/components/seo/JsonLd';
import {CtaBand} from '@/components/sections/CtaBand';
import {buildMetadata} from '@/lib/metadata';
import type {Metadata} from 'next';
import type {Locale} from '@/content/schema';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale: raw} = await params;
  const locale = raw as Locale;

  return buildMetadata({
    locale,
    href: '/faq',
    title: locale === 'de' ? 'Häufige Fragen | PrimeBodyLab' : 'FAQs | PrimeBodyLab',
    description: locale === 'de' ? 'Antworten zu Buchung, Ablauf, Vorbereitung, Stornierung und Coaching bei PrimeBodyLab.' : 'Answers on booking, sessions, preparation, cancellation and coaching at PrimeBodyLab.',
  });
}

export default async function FaqPage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.flatMap((group) =>
      group.items.map((item) => ({
        '@type': 'Question',
        name: item.question[locale],
        acceptedAnswer: {'@type': 'Answer', text: item.answer[locale]},
      })),
    ),
  };

  return (
    <>
      <JsonLd data={faqPageSchema} />

      <section className="mx-auto max-w-3xl px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <h1 className="font-display text-4xl sm:text-5xl">
          {locale === 'de' ? 'Häufige Fragen' : 'FAQs'}
        </h1>
        <FaqAccordion locale={locale} groups={faqs} />
      </section>

      <CtaBand locale={locale} />
    </>
  );
}
