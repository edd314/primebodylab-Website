'use client';

import {useParams} from 'next/navigation';
import {Link, usePathname} from '@/i18n/navigation';
import type {Locale} from '@/content/schema';

export function LocaleSwitcher({current}: {current: Locale}) {
  const pathname = usePathname();
  const params = useParams();
  const target: Locale = current === 'de' ? 'en' : 'de';

  return (
    <Link
      // @ts-expect-error -- params always match the current route
      href={{pathname, params}}
      locale={target}
      aria-label={target === 'en' ? 'Switch to English' : 'Auf Deutsch wechseln'}
      className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-ink focus-visible:text-ink"
    >
      {target.toUpperCase()}
    </Link>
  );
}
