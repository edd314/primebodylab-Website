import type {Locale, Localized} from '@/content/schema';

/** Homepage-only bar under the Hero: a short, brand-voice motivational line. */
export function ServiceTicker({locale, quote}: {locale: Locale; quote: Localized<string>}) {
  return (
    <div data-testid="service-ticker" className="border-y border-line bg-forest">
      <p className="mx-auto max-w-6xl px-6 py-3 text-center text-sm font-semibold tracking-wide text-bone uppercase sm:text-base">
        {quote[locale]}
      </p>
    </div>
  );
}
