import {setRequestLocale} from 'next-intl/server';
import {services} from '@/content/services';
import {ServiceCard} from '@/components/sections/ServiceCard';
import {CtaBand} from '@/components/sections/CtaBand';
import type {Locale} from '@/content/schema';

type Props = {params: Promise<{locale: string}>};

export default async function ServicesPage({params}: Props) {
  const {locale: raw} = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-16 sm:pt-20">
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
