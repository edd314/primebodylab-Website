import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {bookCta, navItems} from '@/lib/nav';
import type {Locale} from '@/content/schema';
import {LocaleSwitcher} from './LocaleSwitcher';

export function Header({locale}: {locale: Locale}) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 sm:py-5">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/images/logo-mark.png"
            alt=""
            width={80}
            height={80}
            className="h-16 w-16 sm:h-20 sm:w-20"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-4xl sm:text-5xl">PrimeBodyLab</span>
            <span className="mt-1.5 text-[0.65rem] tracking-[0.25em] text-muted uppercase sm:text-xs">
              Massage &amp; Sports Recovery
            </span>
          </span>
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
            className="rounded-full border border-forest px-5 py-2.5 text-sm text-sage transition-colors hover:bg-forest hover:text-ink"
          >
            {bookCta[locale]}
          </Link>
        </nav>
      </div>
    </header>
  );
}
