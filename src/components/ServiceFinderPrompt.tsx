'use client';

import type {Locale} from '@/content/schema';

const OPEN_EVENT = 'pbl:open-service-finder';

/**
 * Text entry point for the Service Finder quiz (ServiceFinderWidget.tsx),
 * placed on /leistungen where an undecided visitor is already standing.
 * Dispatches the same window event the floating bubble button listens for.
 */
export function ServiceFinderPrompt({locale}: {locale: Locale}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_EVENT))}
      className="mt-4 text-sm text-sage underline-offset-2 hover:underline"
    >
      {locale === 'de'
        ? 'Nicht sicher, welche Leistung passt? Mach unseren 30-Sekunden-Quiz.'
        : "Not sure which service fits? Take our 30-second quiz."}
    </button>
  );
}
