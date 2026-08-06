'use client';

import dynamic from 'next/dynamic';
import type {Locale} from '@/content/schema';

/**
 * WelcomePopup and ServiceFinderWidget are both interactive extras, not
 * page content — neither renders anything visible until a client-side
 * timer/click fires. Loading their code in a separate chunk (ssr:false)
 * instead of the main bundle keeps their JS off the critical path that
 * blocks first paint/hydration on every page.
 */
const WelcomePopup = dynamic(
  () => import('@/components/WelcomePopup').then((m) => m.WelcomePopup),
  {ssr: false},
);
const ServiceFinderWidget = dynamic(
  () => import('@/components/ServiceFinderWidget').then((m) => m.ServiceFinderWidget),
  {ssr: false},
);

export function DeferredWidgets({locale}: {locale: Locale}) {
  return (
    <>
      <WelcomePopup locale={locale} />
      <ServiceFinderWidget locale={locale} />
    </>
  );
}
