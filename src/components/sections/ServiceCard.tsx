import {Link} from '@/i18n/navigation';
import {formatPrice} from '@/lib/format';
import type {Locale, Service} from '@/content/schema';

export function ServiceCard({service, locale}: {service: Service; locale: Locale}) {
  const prices = service.durations
    .map((duration) => duration.price)
    .filter((price): price is number => price !== null);
  const from = prices.length > 0 ? Math.min(...prices) : null;

  return (
    <article
      data-testid="service-card"
      className="flex flex-col border-b border-line py-12 last:border-b-0"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-sage">{service.tagline[locale]}</p>

      <h2 className="mt-3 font-display text-3xl">{service.name[locale]}</h2>

      <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-muted">
        {service.description[locale]}
      </p>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        {service.includes[locale].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap items-center gap-6">
        <Link
          href={{pathname: '/services/[slug]', params: {slug: service.slug}}}
          className="rounded-full bg-forest px-6 py-3 text-sm font-medium text-bone transition-opacity hover:opacity-90"
        >
          {locale === 'de' ? 'Mehr erfahren' : 'Learn More'}
        </Link>

        {from !== null && (
          <span className="text-sm text-muted">
            {locale === 'de' ? 'ab' : 'from'} {formatPrice(from, locale)}
          </span>
        )}
      </div>
    </article>
  );
}
