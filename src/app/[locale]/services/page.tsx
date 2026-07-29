import {setRequestLocale} from 'next-intl/server';
import {services} from '@/content/services';
import {ServiceCard} from '@/components/sections/ServiceCard';
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
    href: '/services',
    title: locale === 'de' ? 'Leistungen — Sportmassage, Stretching & Coaching | PrimeBodyLab' : 'Services — Sports Massage, Stretching & Coaching | PrimeBodyLab',
    description: locale === 'de' ? 'Sportmassage, assistiertes Stretching und Performance-Coaching in Pfaffenhofen. Eine Philosophie, drei spezialisierte Leistungen.' : 'Sports massage, assisted stretching and performance coaching in Pfaffenhofen. One philosophy, three specialised services.',
  });
}

export default async function ServicesPage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <h1 className="font-display text-4xl sm:text-5xl">
          {locale === 'de' ? 'Leistungen' : 'Services'}
        </h1>
        <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted">
          {locale === 'de'
            ? 'Eine Philosophie. Drei spezialisierte Leistungen. Ein erstklassiges Erlebnis.'
            : 'One philosophy. Three specialised services. One premium experience.'}
        </p>

        <div className="mt-8">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} locale={locale} />
          ))}
        </div>
      </section>

      <CtaBand locale={locale} />
    </>
  );
}
