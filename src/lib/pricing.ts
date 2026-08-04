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
