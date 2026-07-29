'use client';

import {useState} from 'react';
import {formatPrice} from '@/lib/format';
import type {Locale, Service} from '@/content/schema';

const ACUITY_BASE = 'https://opensessions.as.me/schedule.php';

/**
 * Acuity is US-hosted and sets cookies, so it must not load on page view.
 * Nothing here contacts a third party until the visitor presses the button —
 * that is what keeps the whole site free of a consent banner.
 * Do not "simplify" this into a plain embed.
 */
export function BookingGate({locale, service}: {locale: Locale; service: Service | null}) {
  const [loaded, setLoaded] = useState(false);

  const src = service?.acuityTypeId
    ? `${ACUITY_BASE}?appointmentType=${service.acuityTypeId}`
    : ACUITY_BASE;

  const copy = {
    de: {
      heading: 'Termin buchen',
      selected: 'Ausgewählte Leistung',
      any: 'Alle Leistungen',
      notice:
        'Der Buchungskalender wird von Acuity Scheduling bereitgestellt. Beim Laden werden Daten an Acuity übertragen. Der Kalender wird erst nach deinem Klick geladen.',
      button: 'Buchungskalender laden',
      alt: 'Lieber direkt sprechen?',
      call: 'Anrufen',
    },
    en: {
      heading: 'Book an appointment',
      selected: 'Selected service',
      any: 'All services',
      notice:
        'The booking calendar is provided by Acuity Scheduling. Loading it transfers data to Acuity. The calendar loads only after you click.',
      button: 'Load booking calendar',
      alt: 'Prefer to talk it through?',
      call: 'Call',
    },
  }[locale];

  return (
    <section className="mx-auto max-w-3xl px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
      <h1 className="font-display text-4xl sm:text-5xl">{copy.heading}</h1>

      <div className="mt-8 border border-line p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{copy.selected}</p>
        <p data-testid="selected-service" className="mt-2 font-display text-2xl">
          {service ? service.name[locale] : copy.any}
        </p>

        {service && (
          <ul className="mt-5 space-y-2 text-sm">
            {service.durations.map((duration) => (
              <li
                key={duration.minutes}
                className="flex justify-between gap-4 border-b border-line pb-2 last:border-b-0"
              >
                <span>
                  {duration.minutes} {locale === 'de' ? 'Min.' : 'min'}
                </span>
                <span className="text-muted tabular-nums">
                  {duration.price === null
                    ? locale === 'de'
                      ? 'Auf Anfrage'
                      : 'On request'
                    : formatPrice(duration.price, locale)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {loaded ? (
        <iframe
          data-testid="booking-frame"
          src={src}
          title={copy.heading}
          className="mt-8 h-[800px] w-full border border-line"
        />
      ) : (
        <div className="mt-8 border border-line bg-[color-mix(in_srgb,var(--color-bone)_55%,white)] p-8 text-center">
          <p
            data-testid="booking-notice"
            className="mx-auto max-w-[54ch] text-sm leading-relaxed text-muted"
          >
            {copy.notice}
          </p>

          <button
            type="button"
            data-testid="load-booking"
            onClick={() => setLoaded(true)}
            className="mt-6 rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone transition-opacity hover:opacity-90"
          >
            {copy.button}
          </button>
        </div>
      )}
    </section>
  );
}
