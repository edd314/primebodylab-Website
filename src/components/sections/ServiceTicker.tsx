import type {Locale, Localized} from '@/content/schema';

/** Homepage-only bar under the Hero: a short, brand-voice motivational line. */
export function ServiceTicker({locale, quote}: {locale: Locale; quote: Localized<string>}) {
  return (
    <div data-testid="service-ticker" className="flex justify-center px-6 pb-4">
      <p className="rounded-full bg-ink px-7 py-3 text-center text-xs font-medium tracking-wide text-bone shadow-[0_12px_28px_rgba(43,33,22,0.18)] sm:text-sm">
        {quote[locale]}
      </p>
    </div>
  );
}
