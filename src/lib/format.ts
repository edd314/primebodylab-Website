export type Locale = 'de' | 'en';

export function formatPrice(amount: number, locale: Locale): string {
  return locale === 'de' ? `${amount} €` : `€${amount}`;
}
