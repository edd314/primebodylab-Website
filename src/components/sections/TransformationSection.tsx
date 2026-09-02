import {Figure} from '@/components/media/Figure';
import {images} from '@/content/images';
import type {Locale} from '@/content/schema';

/**
 * Real-client before/after pair for the Performance Coaching page. Shown
 * with her explicit permission; face is cropped/blurred in both photos.
 */
export function TransformationSection({locale}: {locale: Locale}) {
  return (
    <div className="mt-14 border-t border-line pt-10">
      <h2 className="text-xs uppercase tracking-[0.2em] text-muted">
        {locale === 'de' ? 'Echte Ergebnisse' : 'Real Results'}
      </h2>
      <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted">
        {locale === 'de'
          ? 'Eine Klientin hat mit einem individuellen Coaching-Programm bei PrimeBodyLab trainiert. Mit ihrer Erlaubnis geteilt.'
          : 'A client trained with a personalised coaching programme at PrimeBodyLab. Shared with her permission.'}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
        <div>
          <Figure
            image={images.transformationBefore}
            locale={locale}
            className="aspect-[3/4] rounded-2xl shadow-xl shadow-black/50 ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-1"
            sizes="(min-width: 640px) 220px, 45vw"
          />
          <p className="mt-2 text-center text-xs tracking-wide text-muted uppercase">
            {locale === 'de' ? 'Vorher' : 'Before'}
          </p>
        </div>
        <div>
          <Figure
            image={images.transformationAfter}
            locale={locale}
            className="aspect-[3/4] rounded-2xl shadow-xl shadow-black/50 ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-1"
            sizes="(min-width: 640px) 220px, 45vw"
          />
          <p className="mt-2 text-center text-xs tracking-wide text-muted uppercase">
            {locale === 'de' ? 'Nachher' : 'After'}
          </p>
        </div>
      </div>
    </div>
  );
}
