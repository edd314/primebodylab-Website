import {Link} from '@/i18n/navigation';
import {bookCta, navItems} from '@/lib/nav';
import type {Locale} from '@/content/schema';
import {LocaleSwitcher} from './LocaleSwitcher';

export function Header({locale}: {locale: Locale}) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="font-display text-2xl leading-none">
          PrimeBodyLab
        </Link>

        <nav
          aria-label={locale === 'de' ? 'Hauptnavigation' : 'Main navigation'}
          className="flex items-center gap-5 sm:gap-7"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden text-sm text-muted transition-colors hover:text-ink sm:inline"
            >
              {item.label[locale]}
            </Link>
          ))}

          <LocaleSwitcher current={locale} />

          <Link
            href="/book"
            className="rounded-full border border-forest px-5 py-2.5 text-sm text-forest transition-colors hover:bg-forest hover:text-bone"
          >
            {bookCta[locale]}
          </Link>
        </nav>
      </div>
    </header>
  );
}
