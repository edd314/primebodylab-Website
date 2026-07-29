import {setRequestLocale} from 'next-intl/server';
import {getService} from '@/content/services';
import {BookingGate} from '@/components/booking/BookingGate';
import type {Locale} from '@/content/schema';

type Props = {
  params: Promise<{locale: string}>;
  searchParams: Promise<{service?: string}>;
};

export default async function BookPage({params, searchParams}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);

  const {service: slug} = await searchParams;
  const service = slug ? (getService(slug) ?? null) : null;

  return <BookingGate locale={raw as Locale} service={service} />;
}
