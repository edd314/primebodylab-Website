import {services} from '@/content/services';
import {getFromPrice} from '@/lib/pricing';
import {formatPrice} from '@/lib/format';
import type {Locale} from '@/content/schema';

/** Homepage-only bar under the Hero: every service, at a glance, with its starting price. */
export function ServiceTicker({locale}: {locale: Locale}) {
  return (
    <div data-testid="service-ticker" className="border-y border-line bg-forest">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-3 text-xs font-semibold tracking-wide text-bone uppercase sm:text-sm">
        {services.map((service) => {
          const from = getFromPrice(service);
          return (
            <span key={service.slug} data-testid="ticker-item" className="whitespace-nowrap">
              {service.name[locale]}
              {from !== null && (
                <>
                  {' — '}
                  {locale === 'de' ? 'ab' : 'from'} {formatPrice(from, locale)}
                </>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
