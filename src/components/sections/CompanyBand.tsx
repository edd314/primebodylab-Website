import type {Companies, Locale} from '@/content/schema';
import {Link} from '@/i18n/navigation';
import {Reveal} from '@/components/motion/Reveal';
import {CompanyCalculator} from './CompanyCalculator';
import {CompanyFaq} from './CompanyFaq';

type Props = {
  locale: Locale;
  companies: Companies;
  ratePerMinute: number;
};

/**
 * Homepage band pitching on-site corporate massage/stretch days. Deliberately
 * a rounded dark card inset into the light "Soft Modern" page (an asymmetric
 * blob corner echoing the Hero photo crop), not a full-bleed dark section —
 * and uses the site's own `sage` accent rather than a gold/forest-green
 * combo, so it reads as PrimeBodyLab's own take on a data-heavy B2B pitch
 * rather than a lift from any one reference site.
 */
export function CompanyBand({locale, companies, ratePerMinute}: Props) {
  return (
    <section id="unternehmen" className="mx-auto max-w-6xl px-6 py-6 sm:py-10">
      <Reveal className="relative overflow-hidden rounded-[64px_20px_56px_16px] bg-ink px-6 py-10 text-bone sm:px-10 sm:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-sage/20 blur-2xl"
        />

        <div className="relative">
          <span className="text-xs font-semibold tracking-[0.08em] text-sage uppercase">
            {companies.eyebrow[locale]}
          </span>
          <h2 className="mt-3 max-w-[22ch] font-display text-2xl text-balance sm:text-3xl">
            {companies.headline[locale]}
          </h2>
          <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-bone/75">{companies.body[locale]}</p>
        </div>

        <div className="relative mt-8 flex flex-col gap-4" data-testid="company-stats">
          {companies.stats.map((stat) => (
            <div key={stat.id} className="border-l-2 border-sage py-1 pl-4">
              <span className="font-display text-2xl text-sage italic">{stat.value[locale]}</span>
              <span className="ml-3 text-xs leading-snug text-bone/70">{stat.label[locale]}</span>
            </div>
          ))}
        </div>
        <p className="relative mt-3 text-[10px] text-bone/40">{companies.statsSource[locale]}</p>

        <div className="relative mt-10 flex flex-col gap-6" data-testid="company-steps">
          {companies.steps.map((step, index) => (
            <div key={step.id} className="relative pl-14">
              <span
                aria-hidden="true"
                className="absolute -top-4 -left-1 font-display text-5xl text-bone/10 italic"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-sm font-semibold">{step.title[locale]}</h3>
              <p className="mt-1 text-sm leading-relaxed text-bone/70">{step.body[locale]}</p>
            </div>
          ))}
        </div>

        <CompanyCalculator locale={locale} labels={companies.calculator} ratePerMinute={ratePerMinute} />

        <Link
          href="/companies"
          className="relative mt-6 inline-flex items-center rounded-full bg-sage px-6 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
        >
          {companies.ctaLabel[locale]}
        </Link>

        <div className="relative mt-10">
          <span className="text-xs font-semibold tracking-[0.08em] text-sage uppercase">
            {companies.trust.eyebrow[locale]}
          </span>
          <div className="mt-3 flex flex-wrap gap-2" data-testid="company-trust">
            {companies.trust.clients.map((client) => (
              <span key={client.id} className="rounded-full border border-bone/25 px-4 py-2 text-xs font-semibold">
                {client.name}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-bone/45">{companies.trust.note[locale]}</p>
        </div>

        <div className="relative mt-10">
          <span className="text-xs font-semibold tracking-[0.08em] text-sage uppercase">
            {locale === 'de' ? 'Was Unternehmen uns fragen' : 'What companies ask us'}
          </span>
          <CompanyFaq locale={locale} items={companies.faq} />
        </div>
      </Reveal>
    </section>
  );
}
