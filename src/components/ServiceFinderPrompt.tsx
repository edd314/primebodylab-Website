'use client';

import type {Locale} from '@/content/schema';
import {serviceFinder} from '@/content/serviceFinder';
import {SERVICE_FINDER_OPEN_EVENT} from '@/lib/serviceFinder';

/**
 * Text entry point for the Service Finder quiz (ServiceFinderWidget.tsx),
 * placed on /leistungen where an undecided visitor is already standing.
 * Dispatches the same window event the floating bubble button listens for.
 */
export function ServiceFinderPrompt({locale}: {locale: Locale}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(SERVICE_FINDER_OPEN_EVENT))}
      className="mt-4 text-sm text-sage underline-offset-2 hover:underline"
    >
      {serviceFinder.promptLabel[locale]}
    </button>
  );
}
