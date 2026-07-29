import {homeSchema, type Home} from './schema';

/**
 * English is transcribed verbatim from the current primebodylab.de homepage.
 * German is our translation, registered in review.ts until Eddie approves it.
 */
const data: Home = {
  hero: {
    kicker: {
      de: 'Pfaffenhofen · Studio & mobil',
      en: 'Pfaffenhofen · Studio & mobile',
    },
    headline: {
      de: ['Stärker regenerieren.', 'Klüger trainieren.', 'Besser bewegen.'],
      en: ['Recover Stronger.', 'Train Smarter.', 'Move Better.'],
    },
    body: {
      de: 'Jeder Weg beginnt mit anderen Zielen. Ob Schmerzlinderung, mehr Leistung, bessere Beweglichkeit oder eine Investition in deine langfristige Gesundheit — jede PrimeBodyLab-Leistung wird auf deine individuellen Bedürfnisse zugeschnitten und mit dem Anspruch auf Qualität, persönliche Betreuung und nachhaltige Ergebnisse erbracht.',
      en: 'Every journey begins with different goals. Be it relieving pain, improving performance, enhancing mobility, or investing in your long-term health, every PrimeBodyLab service is tailored to your individual needs and delivered with a commitment to quality, personalised care, and lasting results.',
    },
  },
  standard: {
    de: 'Performance. Regeneration. Ergebnisse. Der PrimeBodyLab-Standard.',
    en: 'Performance. Recovery. Results. The PrimeBodyLab Standard.',
  },
  pillars: [
    {
      id: 'performance',
      title: {de: 'Performance', en: 'Performance'},
      body: {
        de: 'Kraft aufbauen, Bewegungsmuster verbessern und Ergebnisse erzielen, die bleiben.',
        en: 'Build strength, improve movement patterns and produce results that last.',
      },
    },
    {
      id: 'recovery',
      title: {de: 'Regeneration', en: 'Recovery'},
      body: {
        de: 'Muskelverspannungen reduzieren und schneller regenerieren — zwischen den Trainings und im Alltag.',
        en: 'Minimise muscle tension and recover faster — between sessions and in daily life.',
      },
    },
    {
      id: 'movement',
      title: {de: 'Beweglichkeit', en: 'Movement'},
      body: {
        de: 'Mobilität verbessern, Flexibilität steigern und Bewegungsfreiheit zurückgewinnen.',
        en: 'Enhance mobility, increase flexibility and restore freedom of movement.',
      },
    },
  ],
  founder: {
    heading: {
      de: 'Hi, ich bin Eddie, Gründer von PrimeBodyLab.',
      en: 'Hi i’m Eddie, founder of PrimeBodyLab.',
    },
    body: {
      de: 'Als zertifizierter Personal Trainer, Massagetherapeut und Stretch-Spezialist entwickle ich persönliche Programme für gesundheitsbewusste Menschen — eine Philosophie, drei spezialisierte Leistungen, ein erstklassiges Erlebnis.',
      en: 'As a certified personal trainer, massage therapist and stretch specialist, I build personalised programmes for health-conscious individuals — one philosophy, three specialised services, one premium experience.',
    },
  },
};

export const home = homeSchema.parse(data);
