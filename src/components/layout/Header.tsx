import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {bookCta, navItems} from '@/lib/nav';
import type {Locale} from '@/content/schema';
import {LocaleSwitcher} from './LocaleSwitcher';

export function Header({locale}: {locale: Locale}) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-3 sm:gap-6 sm:px-6 sm:py-5">
        <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Image
            src="/images/logo-mark.png"
            alt=""
            width={80}
            height={80}
            className="h-11 w-11 sm:h-16 sm:w-16 md:h-20 md:w-20"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl sm:text-4xl md:text-5xl">PrimeBodyLab</span>
            <span className="mt-1 text-[0.55rem] tracking-[0.2em] text-muted uppercase sm:mt-1.5 sm:text-[0.65rem] sm:tracking-[0.25em] md:text-xs">
              Massage &amp; Sports Recovery
            </span>
          </span>
        </Link>

        <nav
          aria-label={locale === 'de' ? 'Hauptnavigation' : 'Main navigation'}
          className="flex shrink-0 items-center gap-3 sm:gap-5 md:gap-7"
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
            className="rounded-full border border-forest px-3 py-1.5 text-xs whitespace-nowrap text-sage transition-colors hover:bg-forest hover:text-ink sm:px-5 sm:py-2.5 sm:text-sm"
          >
            {bookCta[locale]}
          </Link>
        </nav>
      </div>
    </header>
  );
}
