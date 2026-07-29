import {site} from '@/content/site';
import type {Home, Locale} from '@/content/schema';

/**
 * The bordered block is the photography slot. When Eddie's shoot lands, replace
 * it with next/image — the layout is already sized for a 4:5 portrait, so no
 * other change is needed.
 */
export function FounderBlock({locale, founder}: {locale: Locale; founder: Home['founder']}) {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:grid-cols-[1fr_1.2fr] sm:py-28">
      <div
        aria-hidden="true"
        className="aspect-[4/5] border border-line bg-[color-mix(in_srgb,var(--color-line)_35%,var(--color-bone))]"
      />

      <div className="self-center">
        <h2 className="max-w-[18ch] font-display text-3xl leading-snug text-balance">
          {founder.heading[locale]}
        </h2>
        <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted">
          {founder.body[locale]}
        </p>

        <ul className="mt-7 space-y-2 text-sm text-muted">
          {site.qualifications[locale].map((qualification) => (
            <li key={qualification} className="border-l-2 border-sage pl-3">
              {qualification}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
