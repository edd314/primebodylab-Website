import {formatPrice} from '@/lib/format';
import {munichGroupIncludes, munichGroupLabels, munichServices} from '@/content/munich';
import type {Locale, MunichService} from '@/content/schema';

const GROUP_ORDER: MunichService['group'][] = ['wellness', 'performance', 'stretch', 'bundle'];

export function MunichGrid({locale}: {locale: Locale}) {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2">
      {GROUP_ORDER.map((group) => {
        const items = munichServices.filter((service) => service.group === group);
        if (items.length === 0) return null;

        return (
          <div key={group} className="rounded-3xl bg-surface px-7 py-8">
            <p className="text-sm font-medium">{munichGroupLabels[group][locale]}</p>

            <h3 className="mt-5 text-xs uppercase tracking-[0.2em] text-muted">
              {locale === 'de' ? 'Enthaltene Techniken' : 'Treatments Include'}
            </h3>
            <ul className="mt-3 space-y-1.5">
              {munichGroupIncludes[group][locale].map((item) => (
                <li key={item} className="text-sm text-muted">
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-xs uppercase tracking-[0.2em] text-muted">
              {locale === 'de' ? 'Dauer & Preis' : 'Duration & Price'}
            </h3>
            <ul className="mt-3 space-y-3">
              {items.map((service) => (
                <li key={service.id} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted">
                    {service.minutes} {locale === 'de' ? 'Min.' : 'min'}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="tabular-nums font-medium">
                      {formatPrice(service.price, locale)}
                    </span>
                    <a
                      href={service.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-forest px-4 py-1.5 text-xs font-medium text-bone transition-opacity hover:opacity-90"
                    >
                      {locale === 'de' ? 'Buchen' : 'Book'}
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
