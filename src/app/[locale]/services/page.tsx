import {setRequestLocale} from 'next-intl/server';
import {services} from '@/content/services';
import {ServiceCard} from '@/components/sections/ServiceCard';
import {Reveal} from '@/components/motion/Reveal';
import {CtaBand} from '@/components/sections/CtaBand';
import {buildMetadata} from '@/lib/metadata';
import {ServiceFinderPrompt} from '@/components/ServiceFinderPrompt';
import type {Metadata} from 'next';
import type {Locale} from '@/content/schema';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale: raw} = await params;
  const locale = raw as Locale;

  return buildMetadata({
    locale,
    href: '/services',
    title: locale === 'de' ? 'Leistungen — Wellnessmassage, Sportmassage, Stretching & Coaching | PrimeBodyLab' : 'Services — Wellness Massage, Sports Massage, Stretching & Coaching | PrimeBodyLab',
    description: locale === 'de' ? 'Wellness & Recovery Massage, Performance & Recovery Massage, assistiertes Stretching, das Performance & Recovery Bundle und Performance-Coaching in Pfaffenhofen. Eine Philosophie, fünf spezialisierte Leistungen.' : 'Wellness & Recovery Massage, Performance & Recovery Massage, assisted stretching, the Performance & Recovery Bundle, and performance coaching in Pfaffenhofen. One philosophy, five specialised services.',
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
            ? 'Eine Philosophie. Fünf spezialisierte Leistungen. Ein erstklassiges Erlebnis.'
            : 'One philosophy. Five specialised services. One premium experience.'}
        </p>

        <ServiceFinderPrompt locale={locale} />

        <div className="mt-8">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 100}>
              <ServiceCard service={service} locale={locale} />
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand locale={locale} />
    </>
  );
}
