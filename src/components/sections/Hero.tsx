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
      <Image
        src="/images/logo-mark.png"
        alt=""
        width={800}
        height={800}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 hidden w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-20 sm:block lg:w-[760px]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pt-16 pb-16 sm:pt-24 sm:pb-20 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
        <div className="text-center lg:text-left">
          <span className="inline-block rounded-full bg-forest px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-bone uppercase">
            {kicker[locale]}
          </span>

          {/* Each line is its own block: German words are long enough that letting
              them reflow breaks the three-line rhythm the headline depends on. */}
          <h1 className="mt-6 font-display text-4xl leading-[1.05] uppercase sm:text-6xl lg:text-7xl">
            {lines.map((line, index) => (
              <span
                key={line}
                className={`block ${index === lines.length - 1 ? 'text-sage' : ''}`}
              >
                {line}
              </span>
            ))}
          </h1>

          <p className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-muted lg:mx-0">
            {body[locale]}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link
              href="/book"
              data-testid="hero-cta"
              className="rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone transition-opacity hover:opacity-90"
            >
              {ctaLabel}
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-forest"
            >
              {locale === 'de' ? 'Leistungen ansehen' : 'Explore Services'}
            </Link>
          </div>
        </div>

        <Figure
          image={image}
          locale={locale}
          className="aspect-[4/5] rounded-2xl lg:aspect-[3/4]"
          sizes="(min-width: 1024px) 40vw, 100vw"
          priority
        />
      </div>
    </section>
  );
}
