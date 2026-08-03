import {formatPrice} from '@/lib/format';
import {getPackagesForService} from '@/lib/packages';
import type {Locale, Service} from '@/content/schema';

export function PackageList({service, locale}: {service: Service; locale: Locale}) {
  const durationPackages = getPackagesForService(service);
  if (durationPackages.length === 0) return null;

  return (
    <div className="mt-14 border-t border-line pt-10">
      <h2 className="text-xs uppercase tracking-[0.2em] text-muted">
        {locale === 'de' ? 'Sparpakete' : 'Session Packages'}
      </h2>
      <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted">
        {locale === 'de'
          ? 'Im Studio einlösbar. Je mehr Sitzungen, desto größer die Ersparnis.'
          : 'Redeemable in-studio. The more sessions you buy, the more you save.'}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {durationPackages.map(({minutes, packages}) => (
          <div key={minutes} className="rounded-2xl border border-line p-5">
            <p className="text-sm font-medium">
              {minutes} {locale === 'de' ? 'Min.' : 'min'}
            </p>
            <ul className="mt-3 space-y-3">
              {packages.map((pkg) => (
                <li key={pkg.sessions} className="flex items-baseline justify-between gap-4">
                  <span className="text-sm text-muted">
                    {pkg.sessions}× {locale === 'de' ? 'Sitzungen' : 'sessions'}
                  </span>
                  <span className="text-right">
                    <span className="tabular-nums font-medium">
                      {formatPrice(pkg.packagePrice, locale)}
                    </span>
                    <span className="ml-2 text-xs tabular-nums text-sage">
                      {locale === 'de'
                        ? `spare ${pkg.savingsPercent}%`
                        : `save ${pkg.savingsPercent}%`}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
