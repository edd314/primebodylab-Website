import {site} from '@/content/site';
import type {Locale} from '@/content/schema';

/**
 * Pinned on mobile only. A meaningful share of local clients will ring rather
 * than work through a booking calendar on a phone.
 */
export function MobileContactBar({locale}: {locale: Locale}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-bone sm:hidden">
      <a
        href={site.phoneHref}
        className="py-4 text-center text-sm font-medium text-sage"
      >
        {locale === 'de' ? 'Anrufen' : 'Call'}
      </a>
      <a
        href={site.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="border-l border-line py-4 text-center text-sm font-medium text-sage"
      >
        WhatsApp
      </a>
    </div>
  );
}
