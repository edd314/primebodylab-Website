import type {Service} from '@/content/schema';

/**
 * Session packages are derived from each duration's Studio price — never
 * hand-typed — so a package can never drift out of sync with the single
 * price already maintained in `src/content/services.ts`.
 *
 * Packages are Studio-only. Mobile sessions cost more to deliver (travel),
 * so a package priced off Studio rates should not be redeemable 1:1 for a
 * Mobile visit — that decision is deliberately out of scope here.
 */
const PACKAGE_TIERS = [
  {sessions: 5, discount: 0.1},
  {sessions: 10, discount: 0.15},
] as const;

export type SessionPackage = {
  sessions: number;
  regularPrice: number;
  packagePrice: number;
  savings: number;
  savingsPercent: number;
  perSessionPrice: number;
};

export type DurationPackages = {
  minutes: number;
  packages: SessionPackage[];
};

function roundDownToFive(value: number): number {
  return Math.floor(value / 5) * 5;
}

function buildPackage(pricePerSession: number, sessions: number, discount: number): SessionPackage {
  const regularPrice = pricePerSession * sessions;
  const packagePrice = roundDownToFive(regularPrice * (1 - discount));
  const savings = regularPrice - packagePrice;
  return {
    sessions,
    regularPrice,
    packagePrice,
    savings,
    savingsPercent: Math.floor((savings / regularPrice) * 100),
    perSessionPrice: Math.round(packagePrice / sessions),
  };
}

/**
 * Services excluded from packages entirely (Performance Coaching — not part
 * of the package offer per Eddie's decision).
 */
const PACKAGE_ELIGIBLE_SLUGS = new Set([
  'wellness-recovery-massage',
  'performance-massage',
  'stretch-therapy',
]);

export function getPackagesForService(service: Service): DurationPackages[] {
  if (!PACKAGE_ELIGIBLE_SLUGS.has(service.slug)) return [];

  return service.durations
    .filter((d): d is {minutes: number; price: number} => d.price !== null)
    .map((duration) => ({
      minutes: duration.minutes,
      packages: PACKAGE_TIERS.map((tier) => buildPackage(duration.price, tier.sessions, tier.discount)),
    }));
}
