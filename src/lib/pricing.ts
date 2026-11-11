import type {Service} from '@/content/schema';

/**
 * The lowest non-null price across a service's durations — what every
 * "ab €X" / "from €X" label on the site shows. Returns null when every
 * duration is price-on-request (Performance Coaching).
 */
export function getFromPrice(service: Service): number | null {
  const prices = service.durations
    .map((duration) => duration.price)
    .filter((price): price is number => price !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
}

/**
 * Eddie's own corporate pricing policy (not a market rate, just what he's
 * chosen): on-site team bookings get 10% off the public per-minute rate to
 * be a competitive B2B offer, and a recurring booking rhythm earns a further
 * discount on top — reflects the lower acquisition cost of a standing
 * client vs. one-off individual bookings. Adjust here if Eddie changes it.
 */
const CORPORATE_BASE_DISCOUNT = 0.1;

/**
 * Per-minute rate for the "Für Unternehmen" team-day calculator, derived
 * from the Wellness & Recovery Massage 60-minute price (minus the corporate
 * discount) so the estimate can never drift out of sync with the real
 * studio price list.
 */
export function getCompanyRatePerMinute(wellnessService: Service): number {
  const sixty = wellnessService.durations.find((duration) => duration.minutes === 60);
  if (!sixty || sixty.price === null) {
    throw new Error('Expected a priced 60-minute Wellness & Recovery duration');
  }
  return (sixty.price / 60) * (1 - CORPORATE_BASE_DISCOUNT);
}
