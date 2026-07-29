import {Link} from '@/i18n/navigation';
import type {Locale, Localized} from '@/content/schema';

type Props = {
  locale: Locale;
  kicker: Localized<string>;
  headline: Localized<string[]>;
  body: Localized<string>;
  ctaLabel: string;
};

export function Hero({locale, kicker, headline, body, ctaLabel}: Props) {
  const lines = headline[locale];

  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 text-center sm:pt-24 sm:pb-28">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{kicker[locale]}</p>

      <h1 className="mx-auto mt-6 max-w-[15ch] font-display text-4xl leading-[1.08] text-balance sm:text-6xl">
        {lines.map((line, index) => (
          <span key={line} className={index === lines.length - 1 ? 'text-sage' : undefined}>
            {line}{' '}
          </span>
        ))}
      </h1>

      <p className="mx-auto mt-6 max-w-[58ch] text-base leading-relaxed text-muted">
        {body[locale]}
      </p>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link
          href="/book"
          data-testid="hero-cta"
          className="rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone transition-opacity hover:opacity-90"
        >
          {ctaLabel}
        </Link>
        <Link
          href="/services"
          className="border-b border-line px-4 py-3.5 text-sm font-medium text-forest transition-colors hover:border-forest"
        >
          {locale === 'de' ? 'Leistungen ansehen' : 'Explore Services'}
        </Link>
      </div>
    </section>
  );
}
