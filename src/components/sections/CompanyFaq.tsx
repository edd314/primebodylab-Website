'use client';

import {useState} from 'react';
import type {Companies, Locale} from '@/content/schema';

/**
 * Same accordion mechanics as FaqAccordion (aria-expanded/aria-controls,
 * one open item at a time), but styled for the dark "Für Unternehmen" card
 * instead of the light-theme tokens FaqAccordion assumes.
 */
export function CompanyFaq({locale, items}: {locale: Locale; items: Companies['faq']}) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="mt-3 border-t border-bone/15" data-testid="company-faq">
      {items.map((item) => {
        const isOpen = open === item.id;

        return (
          <div key={item.id} data-testid="company-faq-item" className="border-b border-bone/15">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`company-faq-${item.id}`}
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-6 py-4 text-left text-sm font-semibold text-bone"
            >
              <span>{item.question[locale]}</span>
              <span aria-hidden="true" className="shrink-0 font-display text-base text-sage italic">
                {isOpen ? '−' : '+'}
              </span>
            </button>

            <div
              id={`company-faq-${item.id}`}
              role="region"
              hidden={!isOpen}
              className="pb-4 text-sm leading-relaxed text-bone/70"
            >
              {item.answer[locale]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
