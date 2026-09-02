import type {Localized} from '@/content/schema';

export type NavItem = {
  href: '/services' | '/vouchers' | '/munich' | '/faq';
  label: Localized<string>;
};

export const navItems: NavItem[] = [
  {href: '/services', label: {de: 'Leistungen', en: 'Services'}},
  {href: '/vouchers', label: {de: 'Gutscheine', en: 'Vouchers'}},
  {href: '/munich', label: {de: 'München Pop-Up', en: 'Munich Pop-Up'}},
  {href: '/faq', label: {de: 'FAQ', en: 'FAQ'}},
];

export const bookCta: Localized<string> = {
  de: 'Termin buchen',
  en: 'Book Now',
};

export const legalItems: {
  href: '/imprint' | '/privacy' | '/terms';
  label: Localized<string>;
}[] = [
  {href: '/imprint', label: {de: 'Impressum', en: 'Imprint'}},
  {href: '/privacy', label: {de: 'Datenschutz', en: 'Privacy'}},
  {href: '/terms', label: {de: 'AGB', en: 'Terms'}},
];
