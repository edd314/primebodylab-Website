import type {Locale} from '@/content/schema';

export function formatPrice(amount: number, locale: Locale): string {
  return locale === 'de' ? `${amount} €` : `€${amount}`;
}
