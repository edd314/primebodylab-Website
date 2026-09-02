import {z} from 'zod';
import {munichServiceSchema, type MunichService, type Localized} from './schema';

/**
 * Munich Pop-Up — every other Saturday at a Munich location, starting
 * 3 Oct 2026. Each duration below is its own distinct Acuity appointment
 * type (see the Duplicate-based build-out), priced €10 over the matching
 * Studio duration. Deliberately no venue name in any copy here — Eddie
 * doesn't want the location advertised yet.
 */
const data: MunichService[] = [
  {id: 'munich-wellness-60', group: 'wellness', minutes: 60, price: 90, bookingUrl: 'https://opensessions.as.me/?appointmentType=97851114'},
  {id: 'munich-wellness-90', group: 'wellness', minutes: 90, price: 100, bookingUrl: 'https://opensessions.as.me/?appointmentType=97851163'},
  {id: 'munich-wellness-120', group: 'wellness', minutes: 120, price: 115, bookingUrl: 'https://opensessions.as.me/?appointmentType=97851214'},
  {id: 'munich-performance-60', group: 'performance', minutes: 60, price: 95, bookingUrl: 'https://opensessions.as.me/?appointmentType=97851467'},
  {id: 'munich-performance-90', group: 'performance', minutes: 90, price: 100, bookingUrl: 'https://opensessions.as.me/?appointmentType=97851499'},
  {id: 'munich-performance-120', group: 'performance', minutes: 120, price: 120, bookingUrl: 'https://opensessions.as.me/?appointmentType=97851531'},
  {id: 'munich-stretch-90', group: 'stretch', minutes: 90, price: 150, bookingUrl: 'https://opensessions.as.me/?appointmentType=97851568'},
  {id: 'munich-stretch-120', group: 'stretch', minutes: 120, price: 160, bookingUrl: 'https://opensessions.as.me/?appointmentType=97851596'},
  {id: 'munich-bundle-120', group: 'bundle', minutes: 120, price: 235, bookingUrl: 'https://opensessions.as.me/?appointmentType=97851651'},
];

export const munichServices = z.array(munichServiceSchema).parse(data);

export const munichGroupLabels: Record<MunichService['group'], Localized<string>> = {
  wellness: {de: 'Wellness & Recovery Massage', en: 'Wellness & Recovery Massage'},
  performance: {de: 'Performance & Recovery Massage', en: 'Performance & Recovery Massage'},
  stretch: {de: 'Assistiertes Stretching', en: 'Assisted Stretch Therapy'},
  bundle: {de: 'Performance & Recovery Bundle', en: 'Performance & Recovery Bundle'},
};

/**
 * Mirrors the "Treatments Include" lists on the matching Studio service pages
 * (src/content/services.ts). Wellness's studio-only perks (tea, small gift)
 * are dropped here rather than copied verbatim — there's no studio at the
 * pop-up. Everything else is copied as-is since it's technique, not venue.
 */
export const munichGroupIncludes: Record<MunichService['group'], Localized<string[]>> = {
  wellness: {
    de: ['Klassische Massage', 'Schröpftherapie', 'Aromaöle zur Entspannung'],
    en: ['Classic Massage', 'Cupping Therapy', 'Aroma Oils for Relaxation'],
  },
  performance: {
    de: [
      'Sportmassage',
      'Tiefengewebsmassage',
      'Regenerationsmassage',
      'Triggerpunkt-Therapie',
      'Brasilianische Lymphdrainage',
      'Myofasziale Entspannung',
    ],
    en: [
      'Sports Massage',
      'Deep Tissue Massage',
      'Recovery Massage',
      'Trigger Point Therapy',
      'Brazilian Lymphatic Drainage',
      'Myofascial Release',
    ],
  },
  stretch: {
    de: [
      'Assistiertes Stretching',
      'PNF-Stretching',
      'Mobilitätstherapie',
      'Verbesserung des Bewegungsumfangs',
      'Wiederherstellung der Bewegung',
    ],
    en: [
      'Assisted Stretching',
      'PNF Stretching',
      'Mobility Therapy',
      'Range of Motion Improvement',
      'Movement Restoration',
    ],
  },
  bundle: {
    de: [
      '60 Min. assistiertes Stretching (inkl. PNF-Stretching & Mobilitätstherapie)',
      '60 Min. Wellness-Massage (inkl. Schröpftherapie & Aromaöle)',
      'Massage individuell auf deine Bedürfnisse abgestimmt',
    ],
    en: [
      '60 min Full Assisted Stretch Session (incl. PNF Stretching & Mobility Therapy)',
      '60 min Wellness Massage (incl. Cupping Therapy & Aroma Oils)',
      'Massage customised to your needs',
    ],
  },
};

export const munichPageCopy: {
  title: Localized<string>;
  metaTitle: Localized<string>;
  metaDescription: Localized<string>;
  intro: Localized<string>;
  schedule: Localized<string>;
  scheduleDates: Localized<string>;
  ctaLabel: Localized<string>;
} = {
  title: {
    de: 'München Pop-Up',
    en: 'Munich Pop-Up',
  },
  metaTitle: {
    de: 'Massage München | PrimeBodyLab Pop-Up (jeden 2. Samstag)',
    en: 'Massage Munich | PrimeBodyLab Pop-Up (Every Other Saturday)',
  },
  metaDescription: {
    de: 'Sport- und Wellnessmassage, Stretch-Therapie und mehr — jeden zweiten Samstag in München. PrimeBodyLab-Pop-Up, online buchbar, ab 3. Oktober 2026.',
    en: 'Sports and wellness massage, stretch therapy, and more — every other Saturday in Munich. PrimeBodyLab pop-up, bookable online, starting October 3rd, 2026.',
  },
  intro: {
    de: 'Jeden zweiten Samstag bringen wir PrimeBodyLab nach München. Alle Behandlungen unseres Studios sind vor Ort buchbar — der genaue Standort wird nach der Buchung mitgeteilt.',
    en: "Every other Saturday, PrimeBodyLab comes to Munich. Every treatment from our studio is bookable on-site — the exact location is shared after booking.",
  },
  schedule: {
    de: 'Verfügbar an alternierenden Samstagen, 10:00–19:00 Uhr, ab dem 3. Oktober 2026. Zeigt dein bevorzugter Samstag keine freien Termine, ist es wahrscheinlich eine Pause-Woche — der Kalender zeigt nur echte Pop-Up-Termine an.',
    en: "Available on alternating Saturdays, 10:00 AM–7:00 PM, starting October 3rd, 2026. If your preferred Saturday shows no open times, it's likely an off week — the calendar only shows real pop-up dates.",
  },
  scheduleDates: {
    de: 'Nächste Termine: 3. Okt, 17. Okt, 31. Okt …',
    en: 'Upcoming dates: Oct 3, Oct 17, Oct 31 …',
  },
  ctaLabel: {
    de: 'Termin buchen',
    en: 'Book Now',
  },
};
