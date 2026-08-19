import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {Figure} from '@/components/media/Figure';
import type {Locale, Localized, SiteImage} from '@/content/schema';

type Props = {
  locale: Locale;
  kicker: Localized<string>;
  headline: Localized<string[]>;
  body: Localized<string>;
  ctaLabel: string;
  image: SiteImage;
};

export function Hero({locale, kicker, headline, body, ctaLabel, image}: Props) {
  const lines = headline[locale];

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pt-16 pb-16 sm:pt-24 sm:pb-20 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
        <div className="text-center lg:text-left">
          {/* Wraps just the kicker + headline (not the body copy or CTAs) so the
              background mark — centered within this wrapper, not the whole
              section — stays aligned behind the headline at every width from
              `sm` up, instead of drifting into the CTA/photo area on the
              taller single-column layout used between `sm` and `lg`. */}
          <div className="relative">
            <Image
              src="/images/logo-mark.png"
              alt=""
              width={800}
              height={533}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 hidden w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-15 sm:block lg:w-[760px]"
            />

            <span className="relative inline-block rounded-full bg-surface px-4 py-1.5 text-xs font-semibold tracking-[0.06em] text-sage">
              {kicker[locale]}
            </span>

            {/* Each line is its own block: German words are long enough that letting
                them reflow breaks the three-line rhythm the headline depends on. */}
            <h1 className="relative mt-6 font-display text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
              {lines.map((line, index) => (
                <span
                  key={line}
                  className={`block ${index === lines.length - 1 ? 'text-sage italic' : ''}`}
                >
                  {line}
                </span>
              ))}
            </h1>
          </div>

          <p className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-muted lg:mx-0">
            {body[locale]}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link
              href="/book"
              data-testid="hero-cta"
              className="rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone shadow-[0_10px_24px_rgba(107,74,49,0.25)] transition-opacity hover:opacity-90"
            >
              {ctaLabel}
            </Link>
            <Link
              href="/services"
              className="rounded-full bg-surface px-7 py-3.5 text-sm font-medium text-sage transition-colors hover:bg-line"
            >
              {locale === 'de' ? 'Leistungen ansehen' : 'Explore Services'}
            </Link>
          </div>
        </div>

        <Figure
          image={image}
          locale={locale}
          className="aspect-[4/5] rounded-[55%_45%_60%_40%/60%_55%_45%_40%] shadow-[0_24px_48px_rgba(107,74,49,0.12)] lg:aspect-[3/4]"
          sizes="(min-width: 1024px) 40vw, 100vw"
          priority
        />
      </div>
    </section>
  );
}
