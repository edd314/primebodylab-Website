import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {getService, services} from '@/content/services';
import {routing} from '@/i18n/routing';
import {ServiceDetail} from '@/components/sections/ServiceDetail';
import {CtaBand} from '@/components/sections/CtaBand';
import type {Locale} from '@/content/schema';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((service) => ({locale, slug: service.slug})),
  );
}

type Props = {params: Promise<{locale: string; slug: string}>};

export default async function ServiceDetailPage({params}: Props) {
  const {locale: raw, slug} = await params;
  setRequestLocale(raw);

  const service = getService(slug);
  if (!service) notFound();

  const locale = raw as Locale;

  return (
    <>
      <ServiceDetail service={service} locale={locale} />
      <CtaBand locale={locale} />
    </>
  );
}
