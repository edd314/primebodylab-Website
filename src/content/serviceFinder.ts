import {serviceFinderContentSchema} from './schema';

/**
 * Content for the Service Finder quiz widget (src/components/ServiceFinderWidget.tsx).
 * German copy here is our translation, pending Eddie's approval — see review.json.
 *
 * `results` gives a one-line "why this fits" summary per service slug, keyed
 * to the real slugs in src/content/services.ts (checked by
 * src/content/__tests__/serviceFinder.test.ts). The "Not sure" path doesn't
 * use `results` at all — it uses `fallbackHeading`/`fallbackBody` instead,
 * since it isn't recommending a specific service.
 */
export const serviceFinder = serviceFinderContentSchema.parse({
  bubbleLabel: {
    de: 'Welche Leistung passt zu mir?',
    en: 'Which service fits me?',
  },
  panelHeading: {
    de: 'Finde deine passende Leistung',
    en: 'Find your right service',
  },
  questions: [
    {
      id: 'goal',
      question: {
        de: 'Was ist dein Hauptziel heute?',
        en: "What's your main goal today?",
      },
      options: [
        {id: 'relax', label: {de: 'Entspannen & Stress abbauen', en: 'Relax and de-stress'}},
        {id: 'recover', label: {de: 'Vom Training erholen', en: 'Recover from training or sport'}},
        {id: 'mobility', label: {de: 'Beweglichkeit verbessern', en: 'Improve flexibility & mobility'}},
        {
          id: 'coaching',
          label: {de: 'Kraft & Struktur aufbauen', en: 'Build strength with ongoing coaching'},
        },
        {id: 'unsure', label: {de: 'Ich bin mir nicht sicher', en: 'Not sure'}},
      ],
    },
    {
      id: 'massageType',
      question: {
        de: 'Was ist dir gerade wichtiger?',
        en: 'What matters more right now?',
      },
      options: [
        {
          id: 'relaxation',
          label: {
            de: 'Allgemeine Entspannung & Stressabbau',
            en: 'Overall relaxation & stress relief',
          },
        },
        {
          id: 'targeted',
          label: {
            de: 'Gezielte Muskel- & Sporterholung',
            en: 'Targeted muscle soreness / sports recovery',
          },
        },
      ],
    },
    {
      id: 'combine',
      question: {
        de: 'Möchtest du das mit assistiertem Stretching in einem Termin kombinieren — ein komplettes 2-Stunden-Reset?',
        en: 'Want that combined with assisted stretching in the same visit — a full 2-hour reset?',
      },
      options: [
        {id: 'yes', label: {de: 'Ja, gerne', en: 'Yes, please'}},
        {id: 'no', label: {de: 'Nein, nur die Behandlung', en: 'No, just the treatment'}},
      ],
    },
    {
      id: 'frequency',
      question: {
        de: 'Nur dieses eine Mal, oder möchtest du regelmäßig kommen?',
        en: 'Just this once, or would you like to come regularly?',
      },
      options: [
        {id: 'onetime', label: {de: 'Nur dieses eine Mal', en: 'Just this once'}},
        {
          id: 'regular',
          label: {de: 'Ich möchte regelmäßig kommen', en: "I'd like to come regularly"},
        },
      ],
    },
  ],
  results: [
    {
      id: 'wellness-recovery-massage',
      summary: {
        de: 'Perfekt für Entspannung, Stressabbau und allgemeines Wohlbefinden.',
        en: 'Perfect for relaxation, stress relief, and overall wellbeing.',
      },
    },
    {
      id: 'performance-massage',
      summary: {
        de: 'Ideal, um gezielt Muskelverspannungen zu lösen und die Erholung zu beschleunigen.',
        en: 'Ideal for targeting muscle tension and speeding up recovery.',
      },
    },
    {
      id: 'stretch-therapy',
      summary: {
        de: 'Genau richtig, um Beweglichkeit und Bewegungsfreiheit zurückzugewinnen.',
        en: 'Just right for restoring mobility and freedom of movement.',
      },
    },
    {
      id: 'performance-recovery-bundle',
      summary: {
        de: 'Ein komplettes Reset-Erlebnis — Stretching und Massage in einem Termin.',
        en: 'A complete reset experience — stretching and massage in one visit.',
      },
    },
    {
      id: 'performance-coaching',
      summary: {
        de: 'Für strukturierten, langfristigen Fortschritt mit persönlicher Betreuung.',
        en: 'For structured, long-term progress with personal accountability.',
      },
    },
  ],
  fallbackHeading: {
    de: 'Lass uns gemeinsam die richtige Wahl treffen',
    en: "Let's figure out the right fit together",
  },
  fallbackBody: {
    de: 'Buche eine kurze Performance Strategy Session — wir besprechen deine Ziele und ich empfehle dir die passende Leistung.',
    en: "Book a quick Performance Strategy Session — we'll talk through your goals and I'll recommend the right service for you.",
  },
  fallbackCta: {
    de: 'Strategy Session buchen',
    en: 'Book a Strategy Session',
  },
  bookLabel: {
    de: 'Termin buchen',
    en: 'Book Now',
  },
  backLabel: {
    de: 'Zurück',
    en: 'Back',
  },
  restartLabel: {
    de: 'Neu starten',
    en: 'Start over',
  },
});
