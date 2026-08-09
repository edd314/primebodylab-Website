import {Link} from '@/i18n/navigation';
import {formatPrice} from '@/lib/format';
import {Figure} from '@/components/media/Figure';
import {PackageList} from '@/components/sections/PackageList';
import type {Locale, Service} from '@/content/schema';

export function ServiceDetail({service, locale}: {service: Service; locale: Locale}) {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
      <p className="text-xs uppercase tracking-[0.2em] text-sage">{service.tagline[locale]}</p>

      <h1 className="mt-3 font-display text-4xl text-balance sm:text-5xl">
        {service.name[locale]}
      </h1>

      <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-muted">
        {service.description[locale]}
      </p>

      <Figure
        image={service.detailImage ?? service.image}
        locale={locale}
        className="mt-10 aspect-[16/9] sm:aspect-[21/9]"
        sizes="(min-width: 1280px) 1152px, 100vw"
      />

      <div className="mt-14 grid gap-12 sm:grid-cols-2">
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted">
            {locale === 'de' ? 'Enthaltene Techniken' : 'Treatments Include'}
          </h2>
          <ul className="mt-4 space-y-2 text-base">
            {service.includes[locale].map((item) => (
              <li key={item} className="border-b border-line pb-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted">
            {locale === 'de' ? 'Dauer & Preis' : 'Duration & Price'}
          </h2>
          <ul className="mt-4 space-y-2 text-base">
            {service.durations.map((duration) => (
              <li
                key={duration.minutes}
                data-testid="duration-row"
                className="flex justify-between gap-4 border-b border-line pb-2"
              >
                <span>
                  {duration.minutes} {locale === 'de' ? 'Min.' : 'min'}
                </span>
                <span className="text-muted tabular-nums">
                  {duration.price === null
                    ? locale === 'de'
                      ? 'Auf Anfrage'
                      : 'On request'
                    : formatPrice(duration.price, locale)}
                </span>
              </li>
            ))}
          </ul>

          {service.slug === 'wellness-recovery-massage' && (
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {locale === 'de'
                ? 'Preise gelten für Studio-Termine. Mobil: 60 Min. 95 €, 90 Min. 110 €, 120 Min. 125 €.'
                : 'Prices shown are for Studio appointments. Mobile: 60 min €95, 90 min €110, 120 min €125.'}
            </p>
          )}

          <Link
            href={{pathname: '/book', query: {service: service.slug}}}
            className="mt-8 inline-block rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone transition-opacity hover:opacity-90"
          >
            {locale === 'de' ? 'Termin buchen' : 'Book Now'}
          </Link>
        </div>
      </div>

      <PackageList service={service} locale={locale} />
    </section>
  );
}
