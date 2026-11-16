// src/lib/crm/dates.ts

/**
 * @vercel/postgres returns DATE / TIMESTAMPTZ columns as JS Date objects at
 * runtime, even though our hand-written row types are strings. These
 * normalize either shape into the string form the rest of the CRM expects.
 */
export function toDateOnlyString(value: string | Date): string;
export function toDateOnlyString(value: string | Date | null): string | null;
export function toDateOnlyString(value: string | Date | null): string | null {
  if (value === null) return null;
  // A DATE column is parsed as local midnight by the driver; format with local
  // getters so the calendar day doesn't shift when the server isn't on UTC.
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return value.slice(0, 10);
}

export function toIsoTimestampString(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value;
}

/** Today's date (YYYY-MM-DD) in German local time, not UTC. */
export function todayInGermany(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}
