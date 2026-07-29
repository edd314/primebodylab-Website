import {testimonials} from '@/content/testimonials';
import type {Locale} from '@/content/schema';

export function TestimonialRow({locale}: {locale: Locale}) {
  return (
    <section className="border-y border-line bg-[color-mix(in_srgb,var(--color-bone)_55%,white)]">
      <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-4 px-6 py-20 sm:grid-cols-2">
        {testimonials.map((testimonial) => (
          <figure key={testimonial.id} data-testid="testimonial" className="py-6">
            <div
              className="text-sage"
              role="img"
              aria-label={`${testimonial.rating} ${locale === 'de' ? 'von 5 Sternen' : 'out of 5 stars'}`}
            >
              {'★'.repeat(testimonial.rating)}
            </div>

            <blockquote className="mt-4 max-w-[52ch] text-base leading-relaxed">
              {testimonial.quote[locale]}
            </blockquote>

            <figcaption className="mt-4 text-sm text-muted">— {testimonial.author}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
