'use client';

import {useMemo, useState} from 'react';
import type {Companies, Locale} from '@/content/schema';

type Props = {
  locale: Locale;
  labels: Companies['calculator'];
  ratePerMinute: number;
};

export function CompanyCalculator({locale, labels, ratePerMinute}: Props) {
  const [employees, setEmployees] = useState(labels.defaultEmployees);
  const [minutes, setMinutes] = useState(labels.minuteOptions[0]);
  const [frequencyId, setFrequencyId] = useState(labels.frequencyOptions[0].id);

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-GB', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const extraDiscountPercent =
    labels.frequencyOptions.find((option) => option.id === frequencyId)?.extraDiscountPercent ?? 0;

  const {total, perHead} = useMemo(() => {
    const effectiveRate = ratePerMinute * (1 - extraDiscountPercent / 100);
    const totalValue = Math.round(employees * minutes * effectiveRate);
    return {total: totalValue, perHead: Math.round(totalValue / employees)};
  }, [employees, minutes, ratePerMinute, extraDiscountPercent]);

  return (
    <div className="relative mt-10 border-t border-bone/15 pt-6" data-testid="company-calculator">
      <h3 className="font-display text-lg">{labels.heading[locale]}</h3>

      <label className="mt-5 flex items-center justify-between text-xs font-semibold text-bone/85">
        <span>{labels.employeesLabel[locale]}</span>
        <span>{employees}</span>
      </label>
      <input
        type="range"
        min={labels.minEmployees}
        max={labels.maxEmployees}
        value={employees}
        onChange={(event) => setEmployees(Number(event.target.value))}
        className="mt-2 w-full accent-sage"
        aria-label={labels.employeesLabel[locale]}
      />

      <p className="mt-5 text-xs font-semibold text-bone/85">{labels.durationLabel[locale]}</p>
      <div className="mt-2 flex gap-2">
        {labels.minuteOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMinutes(option)}
            aria-pressed={minutes === option}
            className={`flex-1 rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${
              minutes === option
                ? 'border-sage bg-sage text-ink'
                : 'border-bone/25 text-bone/80 hover:border-bone/50'
            }`}
          >
            {option} {locale === 'de' ? 'Min' : 'min'}
          </button>
        ))}
      </div>

      <p className="mt-5 text-xs font-semibold text-bone/85">{labels.frequencyLabel[locale]}</p>
      <div className="mt-2 flex gap-2">
        {labels.frequencyOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFrequencyId(option.id)}
            aria-pressed={frequencyId === option.id}
            className={`flex-1 rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${
              frequencyId === option.id
                ? 'border-sage bg-sage text-ink'
                : 'border-bone/25 text-bone/80 hover:border-bone/50'
            }`}
          >
            {option.label[locale]}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-8">
        <div>
          <span className="block font-display text-2xl text-sage italic">{currency.format(total)}</span>
          <span className="text-[11px] text-bone/60">{labels.totalLabel[locale]}</span>
        </div>
        <div>
          <span className="block font-display text-2xl text-sage italic">{currency.format(perHead)}</span>
          <span className="text-[11px] text-bone/60">{labels.perHeadLabel[locale]}</span>
        </div>
      </div>
    </div>
  );
}
