import {Link} from '@/i18n/navigation';
import {site} from '@/content/site';
import {bookCta, legalItems, navItems} from '@/lib/nav';
import type {Locale} from '@/content/schema';

export function Footer({locale}: {locale: Locale}) {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl">PrimeBodyLab</p>
          <address className="mt-3 text-sm leading-relaxed text-muted not-italic">
            {site.ownerName}
            <br />
            {site.street}
            <br />
            {site.postcode} {site.city}
            <br />
            <a href={site.phoneHref} className="transition-colors hover:text-ink">
              {site.phone}
            </a>
            <br />
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-ink">
              {site.email}
            </a>
          </address>
          <p className="mt-3 text-sm text-muted">
            {locale === 'de' ? 'Steuernummer' : 'Tax ID'}: {site.taxId}
          </p>
        </div>

        {/* Carries the main navigation on mobile, where the header hides it. */}
        <nav aria-label={locale === 'de' ? 'Fußzeilennavigation' : 'Footer navigation'}>
          <p className="text-xs uppercase tracking-widest text-muted">
            {locale === 'de' ? 'Navigation' : 'Navigation'}
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted transition-colors hover:text-ink">
                  {item.label[locale]}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/book" className="text-muted transition-colors hover:text-ink">
                {bookCta[locale]}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            {locale === 'de' ? 'Qualifikationen' : 'Qualifications'}
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            {site.qualifications[locale].map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>

          <ul className="mt-5 flex gap-4 text-sm">
            <li>
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-ink"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={site.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-ink"
              >
                TikTok
              </a>
            </li>
            <li>
              <a
                href={site.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-ink"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            {locale === 'de' ? 'Rechtliches' : 'Legal'}
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {legalItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted transition-colors hover:text-ink">
                  {item.label[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
