import {site} from '@/content/site';
import {images} from '@/content/images';
import {Figure} from '@/components/media/Figure';
import type {Home, Locale} from '@/content/schema';

export function FounderBlock({locale, founder}: {locale: Locale; founder: Home['founder']}) {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:grid-cols-[1fr_1.2fr] sm:py-28">
      <Figure
        image={images.founder}
        locale={locale}
        className="aspect-[4/5]"
        sizes="(min-width: 640px) 40vw, 100vw"
      />

      <div className="self-center">
        <h2 className="max-w-[26ch] font-display text-3xl leading-snug text-balance">
          {founder.heading[locale]}
        </h2>
        <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted">
          {founder.body[locale]}
        </p>

        <ul className="mt-7 space-y-2 text-sm text-muted">
          {site.qualifications[locale].map((qualification) => (
            <li key={qualification} className="border-l-2 border-sage pl-3">
              {qualification}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
