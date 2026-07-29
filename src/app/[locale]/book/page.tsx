import {setRequestLocale} from 'next-intl/server';
import {getService} from '@/content/services';
import {BookingGate} from '@/components/booking/BookingGate';
import {buildMetadata} from '@/lib/metadata';
import type {Metadata} from 'next';
import type {Locale} from '@/content/schema';

type Props = {
  params: Promise<{locale: string}>;
  searchParams: Promise<{service?: string}>;
};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale: raw} = await params;
  const locale = raw as Locale;

  return buildMetadata({
    locale,
    href: '/book',
    title: locale === 'de' ? 'Termin buchen | PrimeBodyLab Pfaffenhofen' : 'Book an appointment | PrimeBodyLab Pfaffenhofen',
    description: locale === 'de' ? 'Buche deinen Termin für Sportmassage, assistiertes Stretching oder Performance-Coaching in Pfaffenhofen.' : 'Book your appointment for sports massage, assisted stretching or performance coaching in Pfaffenhofen.',
  });
}

export default async function BookPage({params, searchParams}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);

  const {service: slug} = await searchParams;
  const service = slug ? (getService(slug) ?? null) : null;

  return <BookingGate locale={raw as Locale} service={service} />;
}
