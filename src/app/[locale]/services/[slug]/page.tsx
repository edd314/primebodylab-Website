import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {getService, services} from '@/content/services';
import {routing} from '@/i18n/routing';
import {ServiceDetail} from '@/components/sections/ServiceDetail';
import {CtaBand} from '@/components/sections/CtaBand';
import {buildMetadata} from '@/lib/metadata';
import {site} from '@/content/site';
import {kineticFont} from '@/lib/fonts';
import type {Metadata} from 'next';
import type {CSSProperties} from 'react';
import type {Locale} from '@/content/schema';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((service) => ({locale, slug: service.slug})),
  );
}

type Props = {params: Promise<{locale: string; slug: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: raw, slug} = await params;
  const locale = raw as Locale;
  const service = getService(slug);
  if (!service) return {};

  return buildMetadata({
    locale,
    href: {pathname: '/services/[slug]', params: {slug}},
    title: `${service.name[locale]} — PrimeBodyLab ${site.city}`,
    description: service.description[locale],
  });
}

export default async function ServiceDetailPage({params}: Props) {
  const {locale: raw, slug} = await params;
  setRequestLocale(raw);

  const service = getService(slug);
  if (!service) notFound();

  const locale = raw as Locale;

  const content = (
    <>
      <ServiceDetail service={service} locale={locale} />
      <CtaBand locale={locale} />
    </>
  );

  // Performance Coaching gets its own bold, dark "Kinetic Lab" look — scoped
  // to this page only via a CSS custom-property override plus a page-local
  // technical display font, not a global retheme. Every other service page
  // is unaffected.
  if (service.slug !== 'performance-coaching') return content;

  return (
    <div
      className={`${kineticFont.variable} bg-bone text-ink`}
      style={
        {
          '--color-bone': '#0E1013',
          '--color-ink': '#EEF1EA',
          '--color-forest': '#C6FF3D',
          '--color-sage': '#C6FF3D',
          '--color-muted': '#8B958C',
          '--color-line': '#23282C',
          '--color-surface': '#14171A',
          backgroundImage:
            'linear-gradient(rgba(198,255,61,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(198,255,61,0.045) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        } as CSSProperties
      }
    >
      {content}
    </div>
  );
}
