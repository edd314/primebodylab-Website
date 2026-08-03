'use client';

import {useParams} from 'next/navigation';
import {Link, usePathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import type {Locale} from '@/content/schema';

const LABELS: Record<Locale, {short: string; full: string}> = {
  de: {short: 'DE', full: 'Deutsch'},
  en: {short: 'EN', full: 'English'},
};

/**
 * Shows BOTH languages rather than just the one you'd switch to.
 *
 * A lone "EN" link tells a German visitor nothing about what it does, and a lone
 * "DE" tells an English visitor nothing either — you have to already know the
 * site is bilingual to understand it. A two-state pill reads as a language
 * control on sight, in any language.
 *
 * Each link keeps the visitor on the page they're already reading: `pathname` is
 * the internal route, so /leistungen/performance-massage lands on
 * /en/services/performance-massage rather than dumping them on the homepage.
 */
export function LocaleSwitcher({current}: {current: Locale}) {
  const pathname = usePathname();
  const params = useParams();

  return (
    <div
      role="group"
      aria-label={current === 'de' ? 'Sprache wählen' : 'Choose language'}
      className="flex items-center rounded-full border border-line p-0.5"
    >
      {routing.locales.map((locale) => {
        const isActive = locale === current;

        return (
          <Link
            key={locale}
            // @ts-expect-error -- params always match the current route
            href={{pathname, params}}
            locale={locale}
            hrefLang={locale}
            aria-current={isActive ? 'true' : undefined}
            className={
              isActive
                ? 'rounded-full bg-forest px-2.5 py-1 text-[11px] font-medium tracking-wider text-ink'
                : 'rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wider text-muted transition-colors hover:text-ink'
            }
          >
            <span className="sr-only">{LABELS[locale].full}</span>
            <span aria-hidden="true">{LABELS[locale].short}</span>
          </Link>
        );
      })}
    </div>
  );
}
