import {Link} from '@/i18n/navigation';
import {campaigns} from '@/content/campaigns';
import {getActiveCampaign} from '@/lib/campaigns';
import type {Locale} from '@/content/schema';

/**
 * Site-wide strip, directly under the header, showing whichever seasonal
 * campaign is active today (see src/content/campaigns.ts for the calendar).
 * Renders nothing outside any campaign window — most of the year, on
 * purpose, so a promo reads as an event rather than a permanent fixture.
 */
export function PromoBanner({locale}: {locale: Locale}) {
  const campaign = getActiveCampaign(campaigns);
  if (!campaign) return null;

  const href =
    campaign.cta.kind === 'service'
      ? ({pathname: '/services/[slug]', params: {slug: campaign.cta.slug}} as const)
      : campaign.cta.kind === 'services'
        ? ('/services' as const)
        : ('/book' as const);

  return (
    <div data-testid="promo-banner" className="border-b border-line bg-forest text-bone">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-6 py-2.5 text-center text-sm">
        <span className="font-semibold tracking-[0.12em] uppercase">{campaign.eyebrow[locale]}</span>
        <span className="hidden sm:inline">—</span>
        <span>{campaign.headline[locale]}</span>
        <Link href={href} className="font-semibold underline underline-offset-2 hover:no-underline">
          {campaign.ctaLabel[locale]}
        </Link>
      </div>
    </div>
  );
}
