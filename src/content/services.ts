import {z} from 'zod';
import {serviceSchema, type Service} from './schema';

/**
 * English copy is transcribed verbatim from primebodylab.de/services.
 * German is our translation and is listed in `review.ts` until Eddie approves it.
 *
 * `acuityTypeId` stays null until Eddie supplies the appointment type ids from
 * Acuity. Until then every booking link lands on his general calendar.
 * A null `price` renders as "Auf Anfrage" / "On request", never as a blank.
 */
const data: Service[] = [
  {
    slug: 'performance-massage',
    acuityTypeId: null,
    name: {de: 'Performance Massage', en: 'Performance Massage'},
    tagline: {de: 'Schneller regenerieren', en: 'Recover Faster'},
    description: {
      de: 'Therapeutische Massage, die Muskelverspannungen reduziert, die Regeneration beschleunigt und die sportliche Leistung optimiert.',
      en: 'Therapeutic massage designed to minimise muscle tension, accelerate recovery, and optimise athletic performance.',
    },
    includes: {
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
    durations: [
      {minutes: 60, price: 80},
      {minutes: 90, price: null},
      {minutes: 120, price: null},
    ],
  },
  {
    slug: 'stretch-therapy',
    acuityTypeId: null,
    name: {de: 'Assistiertes Stretching', en: 'Assisted Stretch Therapy'},
    tagline: {de: 'Besser bewegen', en: 'Move Better'},
    description: {
      de: 'Spezialisiertes Stretching-Programm zur Verbesserung der Mobilität, Steigerung der Flexibilität und Wiederherstellung der Bewegungsfreiheit.',
      en: 'Specialised stretching programme designed to enhance mobility, increase flexibility, and restore freedom of movement.',
    },
    includes: {
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
    durations: [
      {minutes: 60, price: null},
      {minutes: 90, price: null},
      {minutes: 120, price: null},
    ],
  },
  {
    slug: 'performance-coaching',
    acuityTypeId: null,
    name: {de: 'Performance Coaching', en: 'Performance Coaching'},
    tagline: {de: 'Klüger trainieren', en: 'Train Smarter'},
    description: {
      de: 'Individuelles Coaching-Programm, das Kraft aufbaut, Bewegungsmuster verbessert und nachhaltige Ergebnisse erzielt.',
      en: 'Individualised coaching programme designed to build strength, improve movement patterns, and produce sustainable outcomes.',
    },
    includes: {
      de: [
        'Persönliches Performance-Programm',
        'Wöchentliche Betreuung',
        'Ernährungsberatung',
        'Integrierte Regeneration',
        'Fortschrittskontrolle',
      ],
      en: [
        'Personalised Performance Programme',
        'Weekly Accountability',
        'Nutrition Guidance',
        'Recovery Integration',
        'Progress Tracking',
      ],
    },
    durations: [{minutes: 30, price: null}],
  },
];

export const services = z.array(serviceSchema).parse(data);

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
