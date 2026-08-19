import type {ReactNode} from 'react';
import {Reveal} from '@/components/motion/Reveal';
import type {Home, Locale, Localized} from '@/content/schema';

type Props = {
  locale: Locale;
  pillars: Home['pillars'];
  standard: Localized<string>;
};

/** Simple stroke icons, one per pillar id — matches the founder/service line-icon style. */
const PILLAR_ICONS: Record<string, ReactNode> = {
  performance: (
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  ),
  recovery: (
    <path d="M12 20s-7-4.4-9.5-9C.8 7.4 3 4 6.5 4 9 4 11 5.8 12 7c1-1.2 3-3 5.5-3 3.5 0 5.7 3.4 4 7-2.5 4.6-9.5 9-9.5 9Z" />
  ),
  movement: (
    <path d="M4 17c3-1 5-1 8 0s5 1 8 0M4 12c3-1 5-1 8 0s5 1 8 0M4 7c3-1 5-1 8 0s5 1 8 0" />
  ),
};

export function PillarGrid({locale, pillars, standard}: Props) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <h2 className="max-w-[24ch] font-display text-2xl text-balance sm:text-3xl">
        {standard[locale]}
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {pillars.map((pillar, index) => (
          <Reveal
            key={pillar.id}
            delay={index * 120}
            data-testid="pillar"
            className="rounded-3xl bg-surface px-7 py-8"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-bone">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="text-sage"
                aria-hidden="true"
              >
                {PILLAR_ICONS[pillar.id]}
              </svg>
            </div>
            <h3 className="mt-4 font-display text-xl">{pillar.title[locale]}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{pillar.body[locale]}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
