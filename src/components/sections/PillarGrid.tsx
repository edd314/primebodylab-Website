import type {Home, Locale, Localized} from '@/content/schema';

type Props = {
  locale: Locale;
  pillars: Home['pillars'];
  standard: Localized<string>;
};

export function PillarGrid({locale, pillars, standard}: Props) {
  return (
    <section className="border-y border-line">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <h2 className="max-w-[24ch] font-display text-2xl text-balance sm:text-3xl">
          {standard[locale]}
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl sm:grid-cols-3">
        {pillars.map((pillar) => (
          <div
            key={pillar.id}
            data-testid="pillar"
            className="border-b border-line px-8 py-12 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
          >
            <h3 className="font-display text-2xl">{pillar.title[locale]}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{pillar.body[locale]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
