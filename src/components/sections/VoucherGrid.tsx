import {formatPrice} from '@/lib/format';
import {voucherPageCopy, vouchers} from '@/content/vouchers';
import {site} from '@/content/site';
import type {Locale} from '@/content/schema';

export function VoucherGrid({locale}: {locale: Locale}) {
  const studio = vouchers.filter((voucher) => voucher.location === 'studio');
  const mobile = vouchers.filter((voucher) => voucher.location === 'mobile');

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2">
      <div className="rounded-3xl bg-surface px-7 py-8">
        <p className="text-sm font-medium">{voucherPageCopy.studioLabel[locale]}</p>
        <ul className="mt-4 space-y-3">
          {studio.map((voucher) => (
            <li key={voucher.id} className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-muted">
                {voucher.minutes} {locale === 'de' ? 'Min.' : 'min'}
              </span>
              <span className="tabular-nums font-medium">{formatPrice(voucher.price, locale)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl bg-surface px-7 py-8">
        <p className="text-sm font-medium">{voucherPageCopy.mobileLabel[locale]}</p>
        <ul className="mt-4 space-y-3">
          {mobile.map((voucher) => (
            <li key={voucher.id} className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-muted">
                {voucher.minutes} {locale === 'de' ? 'Min.' : 'min'}
              </span>
              <span className="tabular-nums font-medium">{formatPrice(voucher.price, locale)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sm:col-span-2">
        <p className="text-xs text-muted">{voucherPageCopy.validity[locale]}</p>
        <a
          href={site.voucherStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone shadow-[0_10px_24px_rgba(107,74,49,0.25)] transition-opacity hover:opacity-90"
        >
          {voucherPageCopy.ctaLabel[locale]}
        </a>
      </div>
    </div>
  );
}
