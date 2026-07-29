'use client';

import {useState} from 'react';
import type {FaqGroup, Locale} from '@/content/schema';

export function FaqAccordion({locale, groups}: {locale: Locale; groups: FaqGroup[]}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="mt-12 space-y-16">
      {groups.map((group) => (
        <section key={group.id} data-testid="faq-group">
          <h2 className="font-display text-2xl">{group.title[locale]}</h2>

          <div className="mt-6 border-t border-line">
            {group.items.map((item) => {
              const isOpen = open === item.id;

              return (
                <div key={item.id} data-testid="faq-item" className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`answer-${item.id}`}
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-sage"
                  >
                    <span className="text-base">{item.question[locale]}</span>
                    <span aria-hidden="true" className="shrink-0 text-lg text-sage">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <div
                    id={`answer-${item.id}`}
                    role="region"
                    hidden={!isOpen}
                    className="max-w-[68ch] pb-6 text-base leading-relaxed whitespace-pre-line text-muted"
                  >
                    {item.answer[locale]}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
