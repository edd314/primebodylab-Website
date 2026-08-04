import {Link} from '@/i18n/navigation';
import type {Locale} from '@/content/schema';

export function CtaBand({locale}: {locale: Locale}) {
  return (
    <section className="bg-surface text-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
        <h2 className="max-w-[20ch] font-display text-3xl text-balance sm:text-4xl">
          {locale === 'de' ? 'Bereit, dich besser zu bewegen?' : 'Ready to move better?'}
        </h2>
        <Link
          href="/book"
          className="rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone transition-opacity hover:opacity-90"
        >
          {locale === 'de' ? 'Termin buchen' : 'Book Now'}
        </Link>
      </div>
    </section>
  );
}
