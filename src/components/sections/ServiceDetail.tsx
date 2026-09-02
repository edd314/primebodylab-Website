import {Link} from '@/i18n/navigation';
import {formatPrice} from '@/lib/format';
import {Figure} from '@/components/media/Figure';
import {PackageList} from '@/components/sections/PackageList';
import {TransformationSection} from '@/components/sections/TransformationSection';
import type {Locale, Service} from '@/content/schema';

export function ServiceDetail({service, locale}: {service: Service; locale: Locale}) {
  const isKinetic = service.slug === 'performance-coaching';

  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
      <p
        className={
          isKinetic
            ? 'font-kinetic text-xs font-semibold tracking-[0.2em] text-sage uppercase'
            : 'text-xs uppercase tracking-[0.2em] text-sage'
        }
      >
        {isKinetic && <span aria-hidden className="mr-1.5 opacity-60">//</span>}
        {service.tagline[locale]}
      </p>

      <h1
        className={
          isKinetic
            ? 'font-kinetic mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl'
            : 'mt-3 font-display text-4xl text-balance sm:text-5xl'
        }
      >
        {service.name[locale]}
      </h1>

      <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-muted">
        {service.description[locale]}
      </p>

      {isKinetic ? (
        <div
          className="relative mt-10 max-w-md overflow-hidden rounded-none shadow-2xl shadow-black/60 ring-1 ring-white/10"
          style={{clipPath: 'polygon(0 0, 100% 0, 100% 92%, 92% 100%, 0 100%)'}}
        >
          <Figure
            image={service.detailImage ?? service.image}
            locale={locale}
            className="aspect-[4/5]"
            sizes="448px"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{background: 'linear-gradient(135deg, transparent 60%, rgba(198,255,61,0.12) 100%)'}}
          />
        </div>
      ) : (
        <Figure
          image={service.detailImage ?? service.image}
          locale={locale}
          className="mt-10 aspect-[16/9] sm:aspect-[21/9]"
          sizes="(min-width: 1280px) 1152px, 100vw"
        />
      )}

      <div className={isKinetic ? 'mt-14 grid gap-6 sm:grid-cols-2' : 'mt-14 grid gap-12 sm:grid-cols-2'}>
        <div
          className={isKinetic ? 'bg-surface p-6 shadow-xl shadow-black/40 ring-1 ring-white/5' : undefined}
          style={
            isKinetic
              ? {clipPath: 'polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))'}
              : undefined
          }
        >
          <h2
            className={
              isKinetic
                ? 'font-kinetic text-xs tracking-[0.2em] text-sage uppercase'
                : 'text-xs uppercase tracking-[0.2em] text-muted'
            }
          >
            {locale === 'de' ? 'Enthaltene Techniken' : 'Treatments Include'}
          </h2>
          <ul className="mt-4 space-y-2 text-base">
            {service.includes[locale].map((item) => (
              <li
                key={item}
                className={isKinetic ? 'border-b border-dashed border-line pb-2' : 'border-b border-line pb-2'}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={isKinetic ? 'bg-surface p-6 shadow-xl shadow-black/40 ring-1 ring-white/5' : undefined}
          style={
            isKinetic
              ? {clipPath: 'polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))'}
              : undefined
          }
        >
          <h2
            className={
              isKinetic
                ? 'font-kinetic text-xs tracking-[0.2em] text-sage uppercase'
                : 'text-xs uppercase tracking-[0.2em] text-muted'
            }
          >
            {locale === 'de' ? 'Dauer & Preis' : 'Duration & Price'}
          </h2>
          <ul className="mt-4 space-y-2 text-base">
            {service.durations.map((duration) => (
              <li
                key={duration.minutes}
                data-testid="duration-row"
                className={
                  isKinetic
                    ? 'flex justify-between gap-4 border-b border-dashed border-line pb-2'
                    : 'flex justify-between gap-4 border-b border-line pb-2'
                }
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
            className={
              isKinetic
                ? 'font-kinetic mt-8 inline-block rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-bone shadow-[0_0_0_0_rgba(198,255,61,0.5)] transition-all duration-200 hover:shadow-[0_0_24px_2px_rgba(198,255,61,0.35)]'
                : 'mt-8 inline-block rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone transition-opacity hover:opacity-90'
            }
          >
            {locale === 'de' ? 'Termin buchen →' : 'Book Now →'}
          </Link>
        </div>
      </div>

      <PackageList service={service} locale={locale} />

      {isKinetic && <TransformationSection locale={locale} />}
    </section>
  );
}
