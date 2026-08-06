import {campaignSchema, type Campaign} from './schema';

/**
 * The yearly promo calendar. Windows are recurring month/day ranges (see
 * src/lib/campaigns.ts) — no year, so this list never needs updating for a
 * new year. Deliberately not back-to-back: gaps between windows are
 * intentional (agreed with Eddie) so a promo reads as an event, not a
 * permanent fixture.
 *
 * `discountCode: null` everywhere for now — none of these have a matching
 * coupon in Acuity's Coupons panel yet. Set a real code here only after
 * creating it in Acuity, same rule as welcomePopup.discountCode.
 */
const data: Campaign[] = [
  {
    id: 'valentine',
    start: {month: 2, day: 7},
    end: {month: 2, day: 14},
    eyebrow: {de: 'Valentinstag', en: "Valentine's Day"},
    headline: {
      de: 'Schenk Erholung, nicht nur Blumen.',
      en: 'Give recovery, not just flowers.',
    },
    body: {
      de: 'Ein Gutschein für eine Wellness & Recovery Massage — ein Geschenk, das dein:e Partner:in wirklich spürt.',
      en: 'A voucher for a Wellness & Recovery Massage — a gift your partner actually feels.',
    },
    ctaLabel: {de: 'Gutschein-Idee ansehen', en: 'See the gift idea'},
    cta: {kind: 'service', slug: 'wellness-recovery-massage'},
    discountCode: null,
  },
  {
    id: 'spring-reset',
    start: {month: 4, day: 15},
    end: {month: 5, day: 5},
    eyebrow: {de: 'Frühjahrs-Reset', en: 'Spring Reset'},
    headline: {
      de: 'Der Winter sitzt noch in den Hüften.',
      en: 'Winter is still sitting in your hips.',
    },
    body: {
      de: 'Stretch Therapy bringt deine Beweglichkeit zurück, bevor die Saison wieder losgeht.',
      en: 'Stretch Therapy brings your mobility back before the season picks back up.',
    },
    ctaLabel: {de: 'Stretch Therapy entdecken', en: 'Explore Stretch Therapy'},
    cta: {kind: 'service', slug: 'stretch-therapy'},
    discountCode: null,
  },
  {
    id: 'muttertag',
    start: {month: 5, day: 5},
    end: {month: 5, day: 14},
    eyebrow: {de: 'Muttertag', en: "Mother's Day"},
    headline: {
      de: 'Für die Frau, die sich nie Zeit für sich nimmt.',
      en: 'For the woman who never makes time for herself.',
    },
    body: {
      de: 'Ein Gutschein für eine Wellness & Recovery Massage — Erholung, die sie sich selbst nicht gönnen würde.',
      en: 'A voucher for a Wellness & Recovery Massage — the kind of rest she would not book for herself.',
    },
    ctaLabel: {de: 'Gutschein-Idee ansehen', en: 'See the gift idea'},
    cta: {kind: 'service', slug: 'wellness-recovery-massage'},
    discountCode: null,
  },
  {
    id: 'vatertag',
    start: {month: 5, day: 20},
    end: {month: 6, day: 5},
    eyebrow: {de: 'Vatertag', en: "Father's Day"},
    headline: {
      de: 'Auch er trägt sich manchmal zusammen.',
      en: 'He carries a lot too, sometimes.',
    },
    body: {
      de: 'Das Performance & Recovery Bundle für den Vater, der nie zugibt, dass ihm etwas wehtut.',
      en: 'The Performance & Recovery Bundle for the dad who never admits something hurts.',
    },
    ctaLabel: {de: 'Bundle ansehen', en: 'See the bundle'},
    cta: {kind: 'service', slug: 'performance-recovery-bundle'},
    discountCode: null,
  },
  {
    id: 'summer-training',
    start: {month: 7, day: 1},
    end: {month: 8, day: 24},
    eyebrow: {de: 'Sommer-Saison', en: 'Summer Training' },
    headline: {
      de: 'Mehr Kilometer, mehr Belastung. Mehr Regeneration.',
      en: 'More miles, more load. More recovery.',
    },
    body: {
      de: 'Läufer:innen und Radfahrer:innen: Die Performance & Recovery Massage hält dich in der Trainingssaison auf der Strecke.',
      en: 'Runners and cyclists: Performance & Recovery Massage keeps you on the road through peak training season.',
    },
    ctaLabel: {de: 'Performance Massage ansehen', en: 'See Performance Massage'},
    cta: {kind: 'service', slug: 'performance-massage'},
    discountCode: null,
  },
  {
    id: 'oktoberfest-recovery',
    start: {month: 9, day: 15},
    end: {month: 10, day: 6},
    eyebrow: {de: 'Nach der Wiesn', en: 'After the Wiesn'},
    headline: {
      de: 'Die Wiesn überlebt. Jetzt erhol dich richtig.',
      en: 'You survived the Wiesn. Now actually recover.',
    },
    body: {
      de: 'Eine Wellness & Recovery Massage für Rücken, Beine und Kopf nach Tagen auf den Bänken.',
      en: 'A Wellness & Recovery Massage for the back, legs, and head after days on the benches.',
    },
    ctaLabel: {de: 'Termin sichern', en: 'Book a session'},
    cta: {kind: 'service', slug: 'wellness-recovery-massage'},
    discountCode: null,
  },
  {
    id: 'back-to-training',
    start: {month: 10, day: 7},
    end: {month: 10, day: 31},
    eyebrow: {de: 'Zurück im Training', en: 'Back to Training'},
    headline: {
      de: 'Bevor eine kleine Verspannung zur Verletzung wird.',
      en: 'Before a small niggle becomes an injury.',
    },
    body: {
      de: 'Mit strukturiertem Training zurückkommen? Stretch Therapy hält deinen Körper bereit dafür.',
      en: "Easing back into structured training? Stretch Therapy keeps your body ready for it.",
    },
    ctaLabel: {de: 'Stretch Therapy entdecken', en: 'Explore Stretch Therapy'},
    cta: {kind: 'service', slug: 'stretch-therapy'},
    discountCode: null,
  },
  {
    id: 'black-friday',
    start: {month: 11, day: 20},
    end: {month: 12, day: 1},
    eyebrow: {de: 'Black Friday', en: 'Black Friday'},
    headline: {
      de: 'Das Jahresangebot für deine Regeneration.',
      en: "The year's best time to invest in your recovery.",
    },
    body: {
      de: 'Sichere dir jetzt ein Session-Paket — mehrere Termine, ein besserer Preis pro Sitzung.',
      en: 'Lock in a session package now — several visits, a better price per session.',
    },
    ctaLabel: {de: 'Pakete ansehen', en: 'See packages'},
    cta: {kind: 'services'},
    discountCode: null,
  },
  {
    id: 'christmas',
    start: {month: 12, day: 2},
    end: {month: 12, day: 24},
    eyebrow: {de: 'Weihnachten', en: 'Christmas'},
    headline: {
      de: 'Ein Geschenk, das niemand zurückgibt.',
      en: 'The one gift nobody returns.',
    },
    body: {
      de: 'Ein PrimeBodyLab-Gutschein — für die Menschen, die schon alles haben, außer Zeit für sich.',
      en: 'A PrimeBodyLab voucher — for the people who already have everything except time for themselves.',
    },
    ctaLabel: {de: 'Gutschein anfragen', en: 'Ask about a voucher'},
    cta: {kind: 'book'},
    discountCode: null,
  },
  {
    id: 'new-year',
    start: {month: 12, day: 26},
    end: {month: 1, day: 15},
    eyebrow: {de: 'Neues Jahr', en: 'New Year'},
    headline: {
      de: 'Kein Vorsatz. Nur ein besserer Start.',
      en: 'Not a resolution. Just a better starting point.',
    },
    body: {
      de: 'Beweglicher ins neue Jahr — leg direkt mit einer Leistung los, die zu deinem Ziel passt.',
      en: 'Move into the new year better — start with whichever service actually matches your goal.',
    },
    ctaLabel: {de: 'Leistungen ansehen', en: 'Explore services'},
    cta: {kind: 'services'},
    discountCode: null,
  },
];

export const campaigns: Campaign[] = data.map((campaign) => campaignSchema.parse(campaign));
