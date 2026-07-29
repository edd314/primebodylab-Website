import {z} from 'zod';
import {faqGroupSchema, type FaqGroup} from './schema';

/**
 * English answers are transcribed verbatim from primebodylab.de/faqs-2 and the
 * homepage FAQ section. German is our translation, pending Eddie's approval.
 *
 * Two deliberate deviations, both flagged in docs/client-questions.md:
 *  - `what-to-wear` heading: the live site reads "What should i wear?" with a
 *    lowercase i. Corrected here as an obvious typo.
 *  - `cancellation`: /faqs-2 says only "24 hours", while the homepage gives the
 *    fuller and more accurate 24h studio / 48h mobile split. The homepage
 *    wording is used because it is his own and strictly more informative.
 */
const data: FaqGroup[] = [
  {
    id: 'booking',
    title: {de: 'Buchung & Termine', en: 'Booking & Appointments'},
    items: [
      {
        id: 'walk-ins',
        question: {de: 'Sind spontane Besuche ohne Termin möglich?', en: 'Do you accept walk-ins?'},
        answer: {
          de: 'Nein. PrimeBodyLab arbeitet ausschließlich nach Terminvereinbarung, damit jeder Kunde ein persönliches, fokussiertes und erstklassiges Erlebnis erhält.',
          en: 'No. PrimeBodyLab operates strictly by appointment to ensure every client receives a personalised, focused, and premium experience.',
        },
      },
      {
        id: 'cancellation',
        question: {
          de: 'Wie lautet die Stornierungsrichtlinie?',
          en: 'What is your cancellation policy?',
        },
        answer: {
          de: 'Termine können bis zu 24 Stunden vor dem vereinbarten Termin storniert oder verschoben werden. Bei verspäteter Absage oder Nichterscheinen kann eine Stornogebühr anfallen. Wenn sich deine Umstände ändern, melde dich einfach und wir finden gemeinsam die beste Lösung. Für Studio-Termine gilt eine Frist von mindestens 24 Stunden, für mobile Termine (bei dir zu Hause) 48 Stunden. Alle weiteren Bedingungen zu deinen Terminen oder deinem Coaching-Plan werden vorab klar erklärt.',
          en: 'Appointments can be cancelled or rescheduled up to 24 hours before your scheduled session. Late cancellations or missed appointments may incur a cancellation fee. If your circumstances change, just get in touch and we’ll find the best option together. Studio sessions require at least 24 hours’ notice, while mobile (in-home) sessions require 48 hours’ notice. Any additional terms specific to your sessions or coaching plan will be explained clearly before you begin.',
        },
      },
      {
        id: 'which-service',
        question: {de: 'Welche Leistung ist die richtige für mich?', en: 'Which service is right for me?'},
        answer: {
          de: 'Wenn du dir nicht sicher bist, welche Leistung zu dir passt — kein Problem. Buche einfach eine Performance Strategy Session oder melde dich, und ich empfehle dir die passende Option auf Basis deiner Ziele, deines Alltags und deiner aktuellen Verfassung.',
          en: 'If you’re unsure which service is right for you, don’t worry. Simply book a Performance Strategy Session or get in touch, and I’ll recommend the most suitable option based on your goals, lifestyle, and current condition.',
        },
      },
      {
        id: 'gift-vouchers',
        question: {de: 'Bietest du Gutscheine an?', en: 'Do you offer gift vouchers?'},
        answer: {
          de: 'Ja. Perfekt für Geburtstage, Weihnachten und Firmengeschenke.',
          en: 'Yes, Perfect for birthdays, Christmas and corporate gifts.',
        },
      },
      {
        id: 'insurance',
        question: {
          de: 'Werden die Kosten von der Krankenkasse übernommen?',
          en: 'Are sessions covered by health insurance?',
        },
        answer: {
          de: 'Die Behandlungen sind Selbstzahlerleistungen und werden nicht von der gesetzlichen Krankenversicherung übernommen. Du erhältst jedoch für jede Sitzung (auch für Pakete) eine Quittung, die du bei deinem Steuerberater einreichen kannst — viele Kunden können diese unter Umständen steuerlich geltend machen.',
          en: 'Sessions are private pay and not covered by statutory health insurance. However, you’ll receive a receipt for every session (including packages) which you can submit to your tax accountant — many clients are sometimes able to claim these as deductible expenses.',
        },
      },
    ],
  },
  {
    id: 'treatments',
    title: {
      de: 'Massage & Assistiertes Stretching',
      en: 'Performance Massage & Assisted Stretch Therapy',
    },
    items: [
      {
        id: 'what-to-wear',
        question: {de: 'Was soll ich anziehen?', en: 'What should I wear?'},
        answer: {
          de: 'Trage bequeme Kleidung, in der du dich frei bewegen kannst — besonders bei assistierten Stretching-Einheiten. Vermeide einschränkende Kleidung wie Jeans, Gürtel oder schwere Kleidungsstücke. Bitte komme frisch geduscht, im Sinne des Komforts für dich und deinen Therapeuten.',
          en: 'Wear comfortable clothing that allows you to move freely, particularly for assisted stretch sessions. Avoid restrictive clothing such as jeans, belts, or heavy garments. For the comfort of both you and your therapist, please arrive freshly showered.',
        },
      },
      {
        id: 'preparation',
        question: {
          de: 'Wie bereite ich mich auf meinen Termin vor?',
          en: 'How should I prepare for my appointments?',
        },
        answer: {
          de: 'Für Hausbesuche: Lege zwei große Handtücher bereit. Komme frisch geduscht. Gib eine genaue Adresse und alle nötigen Zugangsinformationen an (Türcodes, Etage, Parkmöglichkeiten). Sorge für ausreichend Platz für die Massageliege und für Bewegung.\n\nFür Studio-Termine: Komme 5–10 Minuten früher, um anzukommen. Komme frisch geduscht. Informiere mich vor Beginn über Verletzungen, Schmerzen oder Bewegungseinschränkungen.',
          en: 'For home visits: Prepare two large towels. Be freshly showered. Provide a clear address and any necessary entry instructions (building codes, floor number, parking info). Ensure you have enough space for the massage table and movement.\n\nFor studio sessions: Arrive 5–10 minutes early to settle in. Come freshly showered. Inform of any injuries, pain, or mobility limitations before the session begins.',
        },
      },
      {
        id: 'session-length',
        question: {de: 'Wie lange dauern die Sitzungen?', en: 'How long are the sessions?'},
        answer: {
          de: 'Massage- und assistierte Stretching-Einheiten sind als 60-, 90- und 120-Minuten-Termine buchbar. Für Kunden, die eine umfassendere Behandlung und Regeneration benötigen, gibt es zusätzlich erweiterte Performance-Recovery-Sitzungen.',
          en: 'Massage and assisted stretch sessions are available in 60, 90, and 120-minute appointments. Extended Performance Recovery Sessions are available for clients requiring more comprehensive treatment and recovery',
        },
      },
      {
        id: 'what-to-expect',
        question: {
          de: 'Was erwartet mich während der Sitzung?',
          en: 'What to Expect During Your Session',
        },
        answer: {
          de: 'Bei deiner Ankunft beginnen wir mit einem kurzen Gespräch, um deine Ziele zu verstehen, deine Bewegung einzuschätzen und Bereiche mit Verspannungen oder Beschwerden zu erkennen. So wird jede Sitzung genau auf dich abgestimmt.\n\nWährend deiner Sitzung erwartet dich:\n✔ Persönliche Behandlung mit den Händen\n✔ Klare Kommunikation während der gesamten Sitzung\n✔ Eine ruhige, professionelle Umgebung\n✔ Bewegungs- und Atemhinweise, wo sinnvoll\n✔ Ein strukturierter Ansatz mit Fokus auf langfristige Ergebnisse',
          en: 'When you arrive, we’ll begin with a brief consultation to understand your goals, assess your movement, and identify any areas of tension or discomfort. This allows every session to be tailored specifically to your needs.\n\nThroughout your session, you can expect:\n✔ Personalised hands-on treatment\n✔ Clear communication throughout\n✔ A calm, professional environment\n✔ Movement and breathing guidance where appropriate\n✔ A structured approach focused on long-term results',
        },
      },
      {
        id: 'combining-services',
        question: {de: 'Kann ich Leistungen kombinieren?', en: 'Can I combine services?'},
        answer: {
          de: 'Auf jeden Fall. Viele Kunden profitieren davon, Performance Massage, assistiertes Stretching und Coaching zu kombinieren, um Leistung und Regeneration ganzheitlicher anzugehen. Ich empfehle dir die passende Kombination auf Basis deiner Ziele.',
          en: 'Absolutely. Many clients benefit from combining performance massage, assisted stretch therapy, and coaching to create a more complete approach to performance and recovery. I’ll recommend the most appropriate combination based on your goals.',
        },
      },
      {
        id: 'non-athletes',
        question: {
          de: 'Ist PrimeBodyLab auch für Nicht-Sportler geeignet?',
          en: 'Is PrimeBodyLab suitable for non-athletes?',
        },
        answer: {
          de: 'Ja. PrimeBodyLab ist für alle gedacht, die sich besser bewegen, gut regenerieren und ihre Gesundheit und ihr Wohlbefinden verbessern möchten. Du musst kein Sportler sein, um von einem persönlichen Ansatz zu profitieren.',
          en: 'Yes. PrimeBodyLab is designed for anyone who wants to move better, recover well, and improve their overall health and wellbeing. You don’t need to be an athlete to benefit from a personalised approach.',
        },
      },
    ],
  },
  {
    id: 'coaching',
    title: {de: 'Performance Coaching', en: 'Performance Coaching'},
    items: [
      {
        id: 'gym-membership',
        question: {de: 'Brauche ich eine Mitgliedschaft im Fitnessstudio?', en: 'Do I need a gym membership?'},
        answer: {
          de: 'Überhaupt nicht. Dein Programm kann für ein kommerzielles Fitnessstudio, ein Heimstudio oder minimale Ausrüstung zu Hause gestaltet werden.',
          en: 'Not at all. Your programme can be designed for a commercial gym, a home gym, or minimal equipment at home.',
        },
      },
      {
        id: 'beginners',
        question: {de: 'Ist das Coaching auch für Anfänger geeignet?', en: 'Is this coaching suitable for beginners?'},
        answer: {
          de: 'Auf jeden Fall. Ob du völlig neu im Training bist oder jahrelange Erfahrung hast — dein Programm wird auf dein aktuelles Fitnessniveau und deine Ziele zugeschnitten.',
          en: 'Absolutely. Whether you’re completely new to training or have years of experience, your programme will be designed around your current fitness level and goals.',
        },
      },
      {
        id: 'how-online-works',
        question: {de: 'Wie funktioniert das Online-Coaching?', en: 'How does online coaching work?'},
        answer: {
          de: 'Nach deinem Erstgespräch erhältst du ein persönliches Performance-Programm sowie laufende Unterstützung, regelmäßige Check-ins und Anpassungen des Programms, damit du weiter vorankommst.',
          en: 'After your consultation, you’ll receive a personalised performance programme, along with ongoing support, regular check-ins, and programme adjustments to keep you progressing.',
        },
      },
      {
        id: 'communication-frequency',
        question: {de: 'Wie oft haben wir Kontakt?', en: 'How often do we communicate?'},
        answer: {
          de: 'Du erhältst wöchentliche Check-ins, um deinen Fortschritt zu besprechen. Zwischen den Check-ins steht dir Support per Nachricht zur Verfügung, falls du Fragen hast.',
          en: 'You’ll receive weekly check-ins to review your progress, with messaging support available if you have questions between reviews.',
        },
      },
      {
        id: 'personalisation',
        question: {
          de: 'Wird mein Performance-Programm individuell erstellt?',
          en: 'Will my Performance Programme be personalised?',
        },
        answer: {
          de: 'Ja. Jedes Programm wird speziell für dich erstellt und berücksichtigt deine Ziele, deine Erfahrung, deinen Zeitplan, deinen Alltag und die dir zur Verfügung stehende Ausrüstung.',
          en: 'Yes. Every programme is built specifically for you, taking into account your goals, experience, schedule, lifestyle, and the equipment you have available.',
        },
      },
      {
        id: 'injuries',
        question: {
          de: 'Was, wenn ich eine Verletzung oder Bewegungseinschränkung habe?',
          en: 'What if I have an injury or movement limitation?',
        },
        answer: {
          de: 'Dein Programm wird, wo sinnvoll, an viele Verletzungen oder Bewegungseinschränkungen angepasst. Dank meines Hintergrunds in Massagetherapie und Mobilität liegt mein Fokus darauf, dass du sicher und effektiv trainierst. Bei medizinischen Beschwerden oder in der Rehabilitation empfehle ich die Zusammenarbeit mit deinem behandelnden Arzt oder Therapeuten.',
          en: 'Your programme will be adapted to accommodate many injuries or movement restrictions where appropriate. Thanks to my background in massage therapy and mobility, I focus on helping you train safely and effectively. For medical conditions or rehabilitation, I recommend working alongside your healthcare professional.',
        },
      },
      {
        id: 'nutrition',
        question: {de: 'Bietest du auch Ernährungsberatung an?', en: 'Do you provide nutrition advice?'},
        answer: {
          de: 'Ja. Du erhältst praktische Ernährungshinweise zur Unterstützung deiner Ziele. Der Fokus liegt auf praktikablen, nachhaltigen Gewohnheiten statt auf strengen Diäten oder kurzfristigen Lösungen.',
          en: 'Yes. You’ll receive practical nutrition guidance to support your goals. The focus is on practical, sustainable habits rather than restrictive diets or short-term fixes.',
        },
      },
      {
        id: 'results-timeline',
        question: {de: 'Wie lange dauert es, bis ich Ergebnisse sehe?', en: 'How long before I see results?'},
        answer: {
          de: 'Die Ergebnisse sind von Person zu Person unterschiedlich und hängen von Faktoren wie Konstanz, Einsatz, Ernährung, Regeneration und deinem Ausgangspunkt ab. Meine Aufgabe ist es, dir zu helfen, nachhaltige Gewohnheiten aufzubauen, die zu dauerhaften Ergebnissen führen.',
          en: 'Results vary from person to person and depend on factors such as consistency, effort, nutrition, recovery, and your starting point. My role is to help you build sustainable habits that lead to lasting results.',
        },
      },
      {
        id: 'consistency',
        question: {
          de: 'Was, wenn es mir bisher schwergefallen ist, dranzubleiben?',
          en: 'What if I’ve struggled to stay consistent in the past?',
        },
        answer: {
          de: 'Genau da hilft Coaching. Du bekommst einen strukturierten Plan, regelmäßige Verbindlichkeit und laufende Unterstützung, damit du motiviert bleibst und deinen Zielen näherkommst.',
          en: 'That’s exactly where coaching can help. You’ll have a structured plan, regular accountability, and ongoing support to help you stay motivated and keep moving towards your goals.',
        },
      },
    ],
  },
];

export const faqs = z.array(faqGroupSchema).parse(data);
