import {companiesSchema, type Companies} from './schema';

/**
 * New copy, not transcribed from anywhere — both languages are our first
 * draft and belong in review.json until Eddie approves them, same as any
 * other fresh content here.
 */
const data: Companies = {
  eyebrow: {de: 'Für Unternehmen', en: 'For Companies'},
  headline: {
    de: 'Verspannung kostet Ihr Team jeden Tag Zeit',
    en: 'Tension costs your team time, every day',
  },
  body: {
    de: 'Bildschirmarbeit und Termindruck zeigen sich in Fehltagen, Konzentration und Stimmung. PrimeBodyLab bringt Massage und Stretch-Therapie direkt in Ihr Büro — im Raum Pfaffenhofen, Freising, Ingolstadt, Wolnzach, Mainburg und München.',
    en: 'Desk work and deadline pressure show up in sick days, focus and mood. PrimeBodyLab brings massage and stretch therapy straight to your office — around Pfaffenhofen, Freising, Ingolstadt, Wolnzach, Mainburg and Munich.',
  },
  stats: [
    {
      id: 'fehltage',
      value: {de: '19,5', en: '19.5'},
      label: {
        de: 'Fehltage pro Beschäftigtem im Jahr, im Schnitt (DAK, 2025)',
        en: 'Sick days per employee per year, on average (DAK, 2025)',
      },
    },
    {
      id: 'muskel-skelett',
      value: {de: '≈18 %', en: '≈18%'},
      label: {
        de: 'aller Fehltage entfallen rechnerisch auf Muskel-Skelett-Beschwerden',
        en: 'of all sick days are attributable to musculoskeletal complaints',
      },
    },
    {
      id: 'roi',
      value: {de: '1 : 2,7', en: '1 : 2.7'},
      label: {
        de: 'durchschnittlicher ROI betrieblicher Gesundheitsförderung (iga.Report)',
        en: 'average ROI of workplace health promotion (iga.Report)',
      },
    },
    {
      id: 'einstieg',
      value: {de: 'ab 72 €', en: 'from €72'},
      label: {
        de: 'pro Person für einen 60-Minuten-Termin vor Ort (Firmenrate)',
        en: 'per person for a 60-minute on-site session (corporate rate)',
      },
    },
  ],
  // Real, cited sources — replaces the earlier placeholder figures.
  // "Fehltage" and the ROI figure are quoted directly from the named
  // reports. The musculoskeletal share is NOT an official DAK percentage —
  // it's calculated here from two real DAK 2025 figures (347 Tage je 100
  // Versicherte ÷ 19,5 Tage pro Kopf × 100 ≈ 17.8%, rounded to "≈18 %") and
  // labelled as such so it isn't mistaken for an official stat.
  statsSource: {
    de: 'Quellen: DAK-Gesundheitsreport 2025 (19,5 Fehltage/Jahr; Muskel-Skelett-Anteil eigene Berechnung aus 347 Tagen je 100 Versicherte); iga.Report 28/40, Initiative Gesundheit & Arbeit (ROI 1:2,7). Firmenrate: 10 % Rabatt auf den Praxispreis.',
    en: 'Sources: DAK-Gesundheitsreport 2025 (19.5 sick days/year; musculoskeletal share is our own calculation from 347 days per 100 insured); iga.Report 28/40, Initiative Gesundheit & Arbeit (ROI 1:2.7). Corporate rate: 10% off the standard studio price.',
  },
  steps: [
    {
      id: 'erstgespraech',
      title: {de: 'Erstgespräch', en: 'Initial call'},
      body: {
        de: 'Kurzes Telefonat — Teamgröße, Wunschtag und Raum vor Ort klären wir gemeinsam.',
        en: 'A short call — we work out team size, preferred day and the room on site together.',
      },
    },
    {
      id: 'probetag',
      title: {de: 'Probetag', en: 'Trial day'},
      body: {
        de: 'Ein erster Termin bei Ihnen im Büro, unverbindlich kennenlernen.',
        en: 'A first session at your office, no strings attached.',
      },
    },
    {
      id: 'rhythmus',
      title: {de: 'Fester Rhythmus', en: 'A regular rhythm'},
      body: {
        de: 'Wöchentlich, alle zwei Wochen oder monatlich — je öfter, desto günstiger pro Termin.',
        en: 'Weekly, fortnightly or monthly — the more regular the rhythm, the lower the price per session.',
      },
    },
  ],
  calculator: {
    heading: {de: 'Rechner: Was kostet ein Team-Tag?', en: 'Calculator: what does a team day cost?'},
    employeesLabel: {de: 'Mitarbeitende pro Termin', en: 'Employees per session'},
    durationLabel: {de: 'Dauer pro Person', en: 'Duration per person'},
    frequencyLabel: {de: 'Rhythmus', en: 'Rhythm'},
    totalLabel: {de: 'pro Team-Tag', en: 'per team day'},
    perHeadLabel: {de: 'pro Person', en: 'per person'},
    minuteOptions: [20, 30, 60],
    defaultEmployees: 10,
    minEmployees: 4,
    maxEmployees: 24,
    // Extra discount on top of the 10% base corporate rate (pricing.ts),
    // scaled to commitment — a weekly standing booking costs us less to
    // service per session than a one-off, so it's priced accordingly.
    frequencyOptions: [
      {
        id: 'monatlich',
        label: {de: 'Monatlich', en: 'Monthly'},
        extraDiscountPercent: 0,
      },
      {
        id: 'alle-zwei-wochen',
        label: {de: 'Alle 2 Wochen', en: 'Every 2 weeks'},
        extraDiscountPercent: 5,
      },
      {
        id: 'woechentlich',
        label: {de: 'Wöchentlich', en: 'Weekly'},
        extraDiscountPercent: 10,
      },
    ],
    // Purely optional — see the schema comment. Never required to book.
    commitmentOptions: [
      {
        id: 'keine',
        months: 0,
        label: {de: 'Keine Festlegung', en: 'No commitment'},
        extraDiscountPercent: 0,
      },
      {
        id: 'drei-monate',
        months: 3,
        label: {de: '3 Monate im Voraus', en: '3 months upfront'},
        extraDiscountPercent: 3,
      },
      {
        id: 'sechs-monate',
        months: 6,
        label: {de: '6 Monate im Voraus', en: '6 months upfront'},
        extraDiscountPercent: 5,
      },
      {
        id: 'zwoelf-monate',
        months: 12,
        label: {de: '12 Monate im Voraus', en: '12 months upfront'},
        extraDiscountPercent: 8,
      },
    ],
  },
  trust: {
    eyebrow: {de: 'Bereits vor Ort bei', en: 'Already on-site at'},
    // Only real, confirmed on-site clients belong here — never padded with
    // companies PrimeBodyLab hasn't actually served, even for visual balance.
    clients: [{id: 'positiv-fitness-wolnzach', name: 'Positiv Fitness Wolnzach'}],
    note: {
      de: 'Weitere Unternehmen folgen hier, sobald neue Firmenkunden dazukommen.',
      en: 'More companies will appear here as new corporate clients come on board.',
    },
  },
  faq: [
    {
      id: 'umziehen',
      question: {de: 'Müssen sich Mitarbeitende umziehen?', en: 'Do employees need to change clothes?'},
      answer: {
        de: 'Nein. Chair-Massage und Stretch funktionieren bekleidet, direkt am Arbeitsplatz oder in einem ruhigen Raum.',
        en: 'No. Chair massage and stretching work fully clothed, right at the desk or in a quiet room.',
      },
    },
    {
      id: 'platz',
      question: {de: 'Wie viel Platz brauchen wir?', en: 'How much space do we need?'},
      answer: {
        de: 'Ein ruhiger Raum ab ca. 2×3 m reicht — Liege oder Stuhl, Öle und Desinfektion bringe ich mit.',
        en: 'A quiet room from about 2×3 m is enough — I bring the table or chair, oils and disinfection myself.',
      },
    },
    {
      id: 'laufzeit',
      question: {de: 'Gibt es eine Mindestlaufzeit?', en: 'Is there a minimum contract term?'},
      answer: {
        de: 'Nein — Sie testen mit einem Probetag und entscheiden danach über den Rhythmus.',
        en: 'No — you start with a trial day, then decide on a rhythm afterwards.',
      },
    },
  ],
  ctaLabel: {de: 'Erstgespräch anfragen', en: 'Request an initial call'},
  requestPage: {
    eyebrow: {de: 'Für Unternehmen', en: 'For Companies'},
    title: {
      de: 'Stellen Sie sich Ihr Angebot zusammen',
      en: 'Put together your own plan',
    },
    intro: {
      de: 'Teamgröße, Dauer, Rhythmus — und optional eine Vorab-Festlegung für einen besseren Preis. Danach senden Sie Ihre Anfrage direkt per WhatsApp, ganz ohne Mindestlaufzeit.',
      en: 'Team size, duration, rhythm — and an optional upfront commitment for a better price. Then send your request straight over WhatsApp, with no minimum term required.',
    },
    form: {
      companyNameLabel: {de: 'Unternehmen', en: 'Company'},
      contactNameLabel: {de: 'Ansprechpartner/in', en: 'Contact person'},
      emailLabel: {de: 'E-Mail', en: 'Email'},
      phoneLabel: {de: 'Telefon', en: 'Phone'},
      phoneOptionalNote: {de: '(optional)', en: '(optional)'},
      submitLabel: {de: 'Anfrage vorbereiten', en: 'Prepare request'},
      privacyNote: {
        de: 'Ihre Angaben werden ausschließlich zur Bearbeitung dieser Anfrage verwendet.',
        en: 'Your details are used only to process this request.',
      },
    },
    confirmation: {
      heading: {de: 'Ihre Anfrage ist bereit', en: 'Your request is ready'},
      body: {
        de: 'Öffnen Sie WhatsApp, um die vorbereitete Nachricht mit allen Details direkt an uns zu senden.',
        en: 'Open WhatsApp to send the prepared message with all the details straight to us.',
      },
      whatsappButtonLabel: {de: 'In WhatsApp öffnen', en: 'Open in WhatsApp'},
      copyButtonLabel: {de: 'Nachricht kopieren', en: 'Copy message'},
      copiedLabel: {de: 'Kopiert', en: 'Copied'},
    },
  },
};

export const companies = companiesSchema.parse(data);
