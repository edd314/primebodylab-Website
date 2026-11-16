'use client';

import {useState} from 'react';
import {Link} from '@/i18n/navigation';
import {navItems} from '@/lib/nav';
import type {Locale} from '@/content/schema';

/**
 * Below `sm` the header's own nav links are hidden entirely (see Header.tsx),
 * so this is mobile visitors' only way to reach Services, FAQ or the
 * corporate section without relying on homepage scroll position.
 */
export function MobileMenu({locale}: {locale: Locale}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={
          open
            ? locale === 'de'
              ? 'Menü schließen'
              : 'Close menu'
            : locale === 'de'
              ? 'Menü öffnen'
              : 'Open menu'
        }
        className="flex h-8 w-8 flex-col items-center justify-center gap-[5px]"
      >
        <span
          aria-hidden="true"
          className={`h-[1.5px] w-5 bg-ink transition-transform ${open ? 'translate-y-[6.5px] rotate-45' : ''}`}
        />
        <span aria-hidden="true" className={`h-[1.5px] w-5 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
        <span
          aria-hidden="true"
          className={`h-[1.5px] w-5 bg-ink transition-transform ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`}
        />
      </button>

      {open && (
        <nav
          aria-label={locale === 'de' ? 'Mobile Navigation' : 'Mobile navigation'}
          className="absolute top-[calc(100%+0.75rem)] right-0 flex w-56 flex-col gap-1 rounded-2xl border border-line bg-bone p-3 shadow-[0_12px_32px_rgba(107,74,49,0.14)]"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="rounded-lg px-3 py-2.5 text-sm text-ink transition-colors hover:bg-sage/10"
            >
              {item.label[locale]}
            </Link>
          ))}

          {/* Plain anchor, matching the desktop nav: points at the homepage
              section (#unternehmen), not a routed page. */}
          <a
            href={locale === 'de' ? '/#unternehmen' : '/en#unternehmen'}
            onClick={close}
            className="rounded-lg px-3 py-2.5 text-sm text-ink transition-colors hover:bg-sage/10"
          >
            {locale === 'de' ? 'Für Unternehmen' : 'For Companies'}
          </a>
        </nav>
      )}
    </div>
  );
}
