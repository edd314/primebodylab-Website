import {z} from 'zod';
import {serviceSchema, type Service} from './schema';
import {images} from './images';

/**
 * English copy is transcribed verbatim from primebodylab.de/services.
 * German is our translation and is listed in `review.ts` until Eddie approves it.
 *
 * `acuityTypeId` is either a numeric Acuity appointment type id, or a
 * `category:Name` string when the service maps to an Acuity category rather
 * than a single appointment type (values must stay URL-encoded, e.g. `&` as
 * `%26`, since they're substituted directly into the booking query string).
 * A null `price` renders as "Auf Anfrage" / "On request", never as a blank.
 *
 * Order here drives the order on /leistungen — Eddie asked for Wellness &
 * Recovery first since it's his best-selling service.
 */
const data: Service[] = [
  {
    slug: 'wellness-recovery-massage',
    acuityTypeId: 'category:Wellness%20%26%20Recovery%20Massage%20',
    image: images.wellnessMassage,
    name: {de: 'Wellness & Recovery Massage', en: 'Wellness & Recovery Massage'},
    tagline: {de: 'Entspannen & Regenerieren', en: 'Relax & Restore'},
    description: {
      de: 'Unsere beliebteste Behandlung — eine entspannende, regenerierende Massage mit Schröpftherapie und beruhigenden Aromaölen, abgerundet mit Tee und einem kleinen Geschenk zum Mitnehmen.',
      en: 'Our most-loved treatment — a relaxing, restorative massage enhanced with cupping therapy and calming aroma oils, finished with tea and a small treat for the road.',
    },
    includes: {
      de: [
        'Klassische Massage',
        'Schröpftherapie',
        'Aromaöle zur Entspannung',
        'Tee (nur im Studio)',
        'Kleines Geschenk zum Abschluss',
      ],
      en: [
        'Classic Massage',
        'Cupping Therapy',
        'Aroma Oils for Relaxation',
        'Tea (studio only)',
        'A Small Treat for the Road',
      ],
    },
    durations: [
      {minutes: 60, price: 80},
      {minutes: 90, price: 90},
      {minutes: 120, price: 105},
    ],
  },
  {
    slug: 'performance-massage',
    acuityTypeId: 'category:Performance%20%26%20Recovery%20Massage',
    image: images.massage,
    name: {de: 'Performance & Recovery Massage', en: 'Performance & Recovery Massage'},
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
    // "From" price per duration — lowest of the three Performance sub-types
    // (Sports, Deep Tissue, Brazilian Lymphatic Drainage) at that duration.
    // Classic Massage's numbers moved to Wellness & Recovery, where that
    // sub-type now actually lives in Acuity.
    durations: [
      {minutes: 60, price: 85},
      {minutes: 90, price: 90},
      {minutes: 120, price: 110},
    ],
  },
  {
    slug: 'stretch-therapy',
    acuityTypeId: '95688044',
    image: images.stretch,
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
      {minutes: 90, price: 140},
      {minutes: 120, price: 150},
    ],
  },
  {
    slug: 'performance-recovery-bundle',
    acuityTypeId: 'category:Performance%20%26%20Recovery%20Bundle',
    image: images.bundle,
    name: {de: 'Performance & Recovery Bundle', en: 'Performance & Recovery Bundle'},
    tagline: {de: 'Von der Matte auf die Liege', en: 'From the Mats to the Table'},
    description: {
      de: 'Ein kompletter Reset in einem Termin — eine assistierte Stretching-Einheit gefolgt von einer klassischen Massage, kombiniert in einem zweistündigen Besuch. Mehr Zeit ist gegen Aufpreis buchbar.',
      en: 'A complete reset in one visit — an assisted stretch session followed by a classic massage, combined into a single two-hour appointment. Extra time can be booked for an additional cost.',
    },
    includes: {
      de: ['Assistierte Stretching-Einheit', 'Klassische Massage-Einheit', 'Komplettes Reset-Erlebnis'],
      en: ['Assisted Stretch Session', 'Classic Massage Session', 'Complete Reset Experience'],
    },
    durations: [{minutes: 120, price: 225}],
  },
  {
    slug: 'performance-coaching',
    acuityTypeId: 'category:Coaching',
    image: images.coaching,
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
