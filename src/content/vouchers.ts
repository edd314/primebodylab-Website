import {z} from 'zod';
import {voucherSchema, type Voucher, type Localized} from './schema';

const data: Voucher[] = [
  {id: 'studio-40', minutes: 40, location: 'studio', price: 50},
  {id: 'mobile-40', minutes: 40, location: 'mobile', price: 65},
  {id: 'studio-60', minutes: 60, location: 'studio', price: 80},
  {id: 'mobile-60', minutes: 60, location: 'mobile', price: 95},
  {id: 'studio-90', minutes: 90, location: 'studio', price: 90},
  {id: 'mobile-90', minutes: 90, location: 'mobile', price: 110},
  {id: 'studio-120', minutes: 120, location: 'studio', price: 105},
  {id: 'mobile-120', minutes: 120, location: 'mobile', price: 125},
];

export const vouchers = z.array(voucherSchema).parse(data);

export const voucherPageCopy: {
  title: Localized<string>;
  intro: Localized<string>;
  studioLabel: Localized<string>;
  mobileLabel: Localized<string>;
  ctaLabel: Localized<string>;
  validity: Localized<string>;
} = {
  title: {
    de: 'Gutscheine',
    en: 'Gift Vouchers',
  },
  intro: {
    de: 'Verschenke Erholung. Unsere Gutscheine sind digital, sofort per E-Mail verfügbar und online einlösbar — perfekt für Geburtstage, Feiertage oder als Dankeschön.',
    en: 'Give the gift of recovery. Our vouchers are digital, delivered instantly by email, and redeemable online — perfect for birthdays, holidays, or saying thank you.',
  },
  studioLabel: {
    de: 'Im Studio',
    en: 'In Studio',
  },
  mobileLabel: {
    de: 'Mobil (Hausbesuch)',
    en: 'Mobile (Home Visit)',
  },
  ctaLabel: {
    de: 'Gutschein kaufen',
    en: 'Buy a Gift Voucher',
  },
  validity: {
    de: 'Jeder Gutschein ist 3 Jahre gültig.',
    en: 'Every voucher is valid for 3 years.',
  },
};
