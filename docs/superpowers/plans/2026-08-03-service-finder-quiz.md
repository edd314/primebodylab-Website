# Service Finder Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a rule-based (no AI/LLM) decision-tree widget that helps an undecided visitor pick the right PrimeBodyLab service in under 30 seconds, or routes them to book a Performance Strategy Session (a coaching consultation call) if their answers are unclear.

**Architecture:** A pure branching function (`getNextStep`) drives a small client-side state machine (`ServiceFinderWidget`), reading question/option/result copy from a new bilingual content file validated the same way every other content file on the site is. No backend, no external API, no persisted state — every session starts fresh.

**Tech Stack:** Next.js 16 (App Router), React 19, next-intl, Zod, Tailwind v4, Vitest, Playwright.

## Global Constraints

- Every user-facing string needs both `de` and `en` — enforced via the existing `localizedText`/`localized()` Zod helpers in `src/content/schema.ts`. A missing translation must fail `npm test`, exactly like every other content file.
- No third-party script, no AI/LLM API call, no analytics, no persisted answers (no localStorage, no server logging) — this is intentionally a static, stateless decision tree.
- Reuse existing real data — service names, taglines, prices, and package pricing must be read live from `src/content/services.ts` and `src/lib/packages.ts`, never hand-typed or duplicated.
- Follow existing UI conventions: dark-theme Tailwind tokens already in use (`bg-surface`, `border-line`, `text-muted`, `bg-forest`, `text-sage`, `font-display`), the `role="dialog"` / focus-trap-free-but-Escape-closes pattern already established in `src/components/WelcomePopup.tsx`, and `motion-reduce:` Tailwind variants for animation (see `src/components/motion/Reveal.tsx`).
- Booking links must reuse the existing `/book?service=<slug>` deep-link pattern (see `src/components/sections/ServiceDetail.tsx:66-71`) — never construct an Acuity URL directly in this feature's code.

---

### Task 1: Export `isPackageEligible` from `src/lib/packages.ts`

**Files:**
- Modify: `src/lib/packages.ts`
- Create: `src/lib/__tests__/packages.test.ts`

**Interfaces:**
- Produces: `isPackageEligible(slug: string): boolean` — exported function, used by Task 3's branching logic to decide whether to ask the frequency question.

The quiz's branching logic needs to know whether a given service slug has session packages, without duplicating the slug list that already lives in `packages.ts`. Currently `PACKAGE_ELIGIBLE_SLUGS` is a private `const`; this task exposes it through a function instead of exporting the raw `Set` (keeps the internal data structure private, only the check is public).

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/packages.test.ts`:

```ts
import {describe, expect, it} from 'vitest';
import {isPackageEligible} from '@/lib/packages';

describe('isPackageEligible', () => {
  it('is true for the three services that have session packages', () => {
    expect(isPackageEligible('wellness-recovery-massage')).toBe(true);
    expect(isPackageEligible('performance-massage')).toBe(true);
    expect(isPackageEligible('stretch-therapy')).toBe(true);
  });

  it('is false for services without session packages', () => {
    expect(isPackageEligible('performance-recovery-bundle')).toBe(false);
    expect(isPackageEligible('performance-coaching')).toBe(false);
  });

  it('is false for an unknown slug', () => {
    expect(isPackageEligible('not-a-real-service')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- packages.test.ts`
Expected: FAIL — `isPackageEligible` is not exported from `@/lib/packages`.

- [ ] **Step 3: Add the export**

In `src/lib/packages.ts`, directly below the existing `PACKAGE_ELIGIBLE_SLUGS` declaration (currently lines 53-57), add:

```ts
export function isPackageEligible(slug: string): boolean {
  return PACKAGE_ELIGIBLE_SLUGS.has(slug);
}
```

Leave the rest of the file (including `getPackagesForService`) unchanged — it can keep using `PACKAGE_ELIGIBLE_SLUGS` directly, or be left as-is; no need to refactor it to call the new function.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- packages.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/packages.ts src/lib/__tests__/packages.test.ts
git commit -m "feat: export isPackageEligible from packages lib"
```

---

### Task 2: Add Service Finder content schema and content file

**Files:**
- Modify: `src/content/schema.ts`
- Create: `src/content/serviceFinder.ts`
- Modify: `src/content/review.json`
- Create: `src/content/__tests__/serviceFinder.test.ts`

**Interfaces:**
- Produces: `serviceFinder` (parsed content object), `type ServiceFinderQuestionId = 'goal' | 'massageType' | 'combine' | 'frequency'`, `type ServiceFinderContent` — consumed by Task 3 (branching logic reads question ids) and Task 4 (widget reads all copy).

- [ ] **Step 1: Add the schema to `src/content/schema.ts`**

Add this block at the end of the file, before the final `export type Service = ...` group of type exports (i.e. directly after the `welcomePopupSchema`/`WelcomePopupContent` block, so it sits next to the other "widget content" schema):

```ts
export const serviceFinderOptionSchema = z.object({
  id: z.string().min(1),
  label: localizedText,
});

export const serviceFinderQuestionSchema = z.object({
  id: z.enum(['goal', 'massageType', 'combine', 'frequency']),
  question: localizedText,
  options: z.array(serviceFinderOptionSchema).min(2),
});

export type ServiceFinderQuestionId = z.infer<typeof serviceFinderQuestionSchema>['id'];

export const serviceFinderResultCopySchema = z.object({
  /** A service slug from src/content/services.ts. */
  id: z.string().min(1),
  /** One-line "why this fits" summary shown on the result screen. */
  summary: localizedText,
});

export const serviceFinderContentSchema = z.object({
  bubbleLabel: localizedText,
  panelHeading: localizedText,
  questions: z.array(serviceFinderQuestionSchema).length(4),
  results: z.array(serviceFinderResultCopySchema).min(1),
  fallbackHeading: localizedText,
  fallbackBody: localizedText,
  fallbackCta: localizedText,
  bookLabel: localizedText,
  backLabel: localizedText,
  restartLabel: localizedText,
});

export type ServiceFinderContent = z.infer<typeof serviceFinderContentSchema>;
```

- [ ] **Step 2: Write the failing content test**

Create `src/content/__tests__/serviceFinder.test.ts`:

```ts
import {describe, expect, it} from 'vitest';
import {serviceFinder} from '@/content/serviceFinder';
import {services} from '@/content/services';

describe('service finder content', () => {
  it('defines exactly the four questions in the right order', () => {
    expect(serviceFinder.questions.map((q) => q.id)).toEqual([
      'goal',
      'massageType',
      'combine',
      'frequency',
    ]);
  });

  it('gives every question at least two options', () => {
    for (const question of serviceFinder.questions) {
      expect(question.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('has a result summary for every real service', () => {
    const resultIds = serviceFinder.results.map((r) => r.id);
    for (const service of services) {
      expect(resultIds).toContain(service.slug);
    }
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- serviceFinder.test.ts`
Expected: FAIL — cannot find module `@/content/serviceFinder`.

- [ ] **Step 4: Create the content file**

Create `src/content/serviceFinder.ts`:

```ts
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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- serviceFinder.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 6: Register the new copy for German-approval tracking**

Open `src/content/review.json` and add `"serviceFinder"` to the array (matches the existing `"welcomePopup"` entry style — a single id covering the whole content file, not one entry per field). Insert it alphabetically-ish near `"welcomePopup"`, e.g. right after `"services.performance-coaching"` and before `"faqs.booking"`:

```json
  "services.performance-coaching",
  "serviceFinder",
  "faqs.booking",
```

- [ ] **Step 7: Run the full test suite to confirm nothing else broke**

Run: `npm test`
Expected: PASS, all test files green.

- [ ] **Step 8: Commit**

```bash
git add src/content/schema.ts src/content/serviceFinder.ts src/content/review.json src/content/__tests__/serviceFinder.test.ts
git commit -m "feat: add service finder quiz content"
```

---

### Task 3: Implement the branching logic

**Files:**
- Create: `src/lib/serviceFinder.ts`
- Create: `src/lib/__tests__/serviceFinder.test.ts`

**Interfaces:**
- Consumes: `isPackageEligible(slug: string): boolean` from Task 1 (`@/lib/packages`); `ServiceFinderQuestionId` type from Task 2 (`@/content/schema`).
- Produces: `type ServiceFinderAnswers`, `type ServiceFinderStep`, `type ServiceFinderResult`, `function getNextStep(answers: ServiceFinderAnswers): ServiceFinderStep` — consumed by Task 4 (the widget component).

This is the pure decision-tree function — no React, no DOM, fully unit-testable on its own. It takes whatever answers have been given so far and returns either "ask this question next" or "here's the result."

- [ ] **Step 1: Write the failing tests covering every path**

Create `src/lib/__tests__/serviceFinder.test.ts`:

```ts
import {describe, expect, it} from 'vitest';
import {getNextStep, type ServiceFinderAnswers} from '@/lib/serviceFinder';

describe('getNextStep', () => {
  it('asks the goal question first when there are no answers yet', () => {
    const step = getNextStep({});
    expect(step).toEqual({type: 'question', questionId: 'goal'});
  });

  it('routes "unsure" straight to the strategy session', () => {
    const answers: ServiceFinderAnswers = {goal: 'unsure'};
    expect(getNextStep(answers)).toEqual({
      type: 'result',
      result: {kind: 'strategy-session'},
    });
  });

  it('routes "coaching" straight to performance coaching, skipping every other question', () => {
    const answers: ServiceFinderAnswers = {goal: 'coaching'};
    expect(getNextStep(answers)).toEqual({
      type: 'result',
      result: {kind: 'service', slug: 'performance-coaching'},
    });
  });

  it('asks massageType after "relax" or "recover"', () => {
    expect(getNextStep({goal: 'relax'})).toEqual({type: 'question', questionId: 'massageType'});
    expect(getNextStep({goal: 'recover'})).toEqual({type: 'question', questionId: 'massageType'});
  });

  it('skips massageType for "mobility" and asks combine next', () => {
    expect(getNextStep({goal: 'mobility'})).toEqual({type: 'question', questionId: 'combine'});
  });

  it('asks combine after massageType is answered', () => {
    const answers: ServiceFinderAnswers = {goal: 'relax', massageType: 'relaxation'};
    expect(getNextStep(answers)).toEqual({type: 'question', questionId: 'combine'});
  });

  it('overrides to the bundle when combine is "yes", regardless of the massage type', () => {
    const wellness: ServiceFinderAnswers = {goal: 'relax', massageType: 'relaxation', combine: 'yes'};
    expect(getNextStep(wellness)).toEqual({
      type: 'result',
      result: {kind: 'service', slug: 'performance-recovery-bundle'},
    });

    const stretch: ServiceFinderAnswers = {goal: 'mobility', combine: 'yes'};
    expect(getNextStep(stretch)).toEqual({
      type: 'result',
      result: {kind: 'service', slug: 'performance-recovery-bundle'},
    });
  });

  it('asks frequency when combine is "no" and the service has packages', () => {
    const answers: ServiceFinderAnswers = {goal: 'relax', massageType: 'relaxation', combine: 'no'};
    expect(getNextStep(answers)).toEqual({type: 'question', questionId: 'frequency'});
  });

  it('resolves to wellness massage once frequency is answered', () => {
    const answers: ServiceFinderAnswers = {
      goal: 'relax',
      massageType: 'relaxation',
      combine: 'no',
      frequency: 'onetime',
    };
    expect(getNextStep(answers)).toEqual({
      type: 'result',
      result: {kind: 'service', slug: 'wellness-recovery-massage'},
    });
  });

  it('resolves to performance massage for the targeted massage type', () => {
    const answers: ServiceFinderAnswers = {
      goal: 'recover',
      massageType: 'targeted',
      combine: 'no',
      frequency: 'regular',
    };
    expect(getNextStep(answers)).toEqual({
      type: 'result',
      result: {kind: 'service', slug: 'performance-massage'},
    });
  });

  it('resolves to stretch therapy without ever asking massageType', () => {
    const answers: ServiceFinderAnswers = {goal: 'mobility', combine: 'no', frequency: 'onetime'};
    expect(getNextStep(answers)).toEqual({
      type: 'result',
      result: {kind: 'service', slug: 'stretch-therapy'},
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- serviceFinder.test.ts` (note: this matches both the Task 2 content test and this lib test by filename — that's fine, both should run)
Expected: FAIL — cannot find module `@/lib/serviceFinder`.

- [ ] **Step 3: Implement `src/lib/serviceFinder.ts`**

```ts
import {isPackageEligible} from '@/lib/packages';
import type {ServiceFinderQuestionId} from '@/content/schema';

export type ServiceFinderAnswers = {
  goal?: 'relax' | 'recover' | 'mobility' | 'coaching' | 'unsure';
  massageType?: 'relaxation' | 'targeted';
  combine?: 'yes' | 'no';
  frequency?: 'onetime' | 'regular';
};

export type ServiceFinderResult =
  | {kind: 'service'; slug: string}
  | {kind: 'strategy-session'};

export type ServiceFinderStep =
  | {type: 'question'; questionId: ServiceFinderQuestionId}
  | {type: 'result'; result: ServiceFinderResult};

/**
 * Pure decision tree: given the answers collected so far, returns either the
 * next question to ask or the final result. No React, no side effects —
 * the widget component just calls this after every answer.
 *
 * See docs/superpowers/specs/2026-08-03-service-finder-quiz-design.md for
 * the full branching rationale.
 */
export function getNextStep(answers: ServiceFinderAnswers): ServiceFinderStep {
  if (answers.goal === undefined) {
    return {type: 'question', questionId: 'goal'};
  }

  if (answers.goal === 'unsure') {
    return {type: 'result', result: {kind: 'strategy-session'}};
  }

  if (answers.goal === 'coaching') {
    return {type: 'result', result: {kind: 'service', slug: 'performance-coaching'}};
  }

  if (answers.goal === 'mobility') {
    return resolveMassageOrStretch('stretch-therapy', answers);
  }

  // goal is 'relax' or 'recover' — split into wellness vs. performance massage.
  if (answers.massageType === undefined) {
    return {type: 'question', questionId: 'massageType'};
  }

  const baseSlug = answers.massageType === 'relaxation' ? 'wellness-recovery-massage' : 'performance-massage';
  return resolveMassageOrStretch(baseSlug, answers);
}

function resolveMassageOrStretch(baseSlug: string, answers: ServiceFinderAnswers): ServiceFinderStep {
  if (answers.combine === undefined) {
    return {type: 'question', questionId: 'combine'};
  }

  if (answers.combine === 'yes') {
    return {type: 'result', result: {kind: 'service', slug: 'performance-recovery-bundle'}};
  }

  if (!isPackageEligible(baseSlug)) {
    return {type: 'result', result: {kind: 'service', slug: baseSlug}};
  }

  if (answers.frequency === undefined) {
    return {type: 'question', questionId: 'frequency'};
  }

  return {type: 'result', result: {kind: 'service', slug: baseSlug}};
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- serviceFinder.test.ts`
Expected: PASS (11 tests in this file, plus the 3 from Task 2's content test also matching the filename pattern)

- [ ] **Step 5: Commit**

```bash
git add src/lib/serviceFinder.ts src/lib/__tests__/serviceFinder.test.ts
git commit -m "feat: add service finder branching logic"
```

---

### Task 4: Build the `ServiceFinderWidget` component

**Files:**
- Create: `src/components/ServiceFinderWidget.tsx`

**Interfaces:**
- Consumes: `serviceFinder` content (`@/content/serviceFinder`); `getNextStep`, `type ServiceFinderAnswers`, `type ServiceFinderStep` (`@/lib/serviceFinder`); `getService` (`@/content/services`); `getPackagesForService` (`@/lib/packages`); `formatPrice` (`@/lib/format`); `PackageList` (`@/components/sections/PackageList`); `Link` (`@/i18n/navigation`); `type Locale` (`@/content/schema`).
- Produces: `ServiceFinderWidget({locale}: {locale: Locale})` component; listens for a `window` `CustomEvent` named `'pbl:open-service-finder'` (no `detail` payload) — this is the contract Task 6's prompt button dispatches against.

No automated test for this task — it's a client-only interactive component. Task 5 (mounting it) and Task 7 (e2e test) are what exercise it. Verification here is `npm run build` succeeding (confirms it type-checks) plus a manual look once the dev server is running.

- [ ] **Step 1: Create the component**

Create `src/components/ServiceFinderWidget.tsx`:

```tsx
'use client';

import {useEffect, useState} from 'react';
import {Link} from '@/i18n/navigation';
import {serviceFinder} from '@/content/serviceFinder';
import {getNextStep, type ServiceFinderAnswers, type ServiceFinderResult} from '@/lib/serviceFinder';
import {getService} from '@/content/services';
import {getPackagesForService} from '@/lib/packages';
import {formatPrice} from '@/lib/format';
import {PackageList} from '@/components/sections/PackageList';
import type {Locale, ServiceFinderQuestionId} from '@/content/schema';

const OPEN_EVENT = 'pbl:open-service-finder';

/**
 * Floating quiz widget: a bubble button that opens a short rule-based
 * decision tree (no AI, no backend) recommending one of the 5 services, or
 * a Performance Strategy Session if the visitor picks "Not sure". See
 * docs/superpowers/specs/2026-08-03-service-finder-quiz-design.md.
 *
 * Every open (via the bubble or the 'pbl:open-service-finder' window event,
 * dispatched by ServiceFinderPrompt on /leistungen) resets to question one —
 * there is no persisted state, by design.
 */
export function ServiceFinderWidget({locale}: {locale: Locale}) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<ServiceFinderAnswers>({});
  const [history, setHistory] = useState<Array<keyof ServiceFinderAnswers>>([]);

  useEffect(() => {
    function launch() {
      setAnswers({});
      setHistory([]);
      setOpen(true);
    }
    window.addEventListener(OPEN_EVENT, launch);
    return () => window.removeEventListener(OPEN_EVENT, launch);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
  }

  function launch() {
    setAnswers({});
    setHistory([]);
    setOpen(true);
  }

  function answer(questionId: keyof ServiceFinderAnswers, optionId: string) {
    setAnswers((prev) => ({...prev, [questionId]: optionId}));
    setHistory((prev) => [...prev, questionId]);
  }

  function goBack() {
    setHistory((prev) => {
      const next = [...prev];
      const last = next.pop();
      if (last) {
        setAnswers((prevAnswers) => {
          const copy = {...prevAnswers};
          delete copy[last];
          return copy;
        });
      }
      return next;
    });
  }

  const step = getNextStep(answers);

  return (
    <>
      <button
        type="button"
        data-testid="service-finder-bubble"
        onClick={launch}
        aria-label={serviceFinder.bubbleLabel[locale]}
        className="fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-2xl text-ink shadow-lg transition-opacity hover:opacity-90 sm:right-6 sm:bottom-6"
      >
        ?
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-finder-heading"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div
            data-testid="service-finder-panel"
            className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-7 motion-reduce:transition-none"
          >
            <button
              type="button"
              onClick={close}
              aria-label={locale === 'de' ? 'Schließen' : 'Close'}
              className="absolute top-4 right-4 text-muted transition-colors hover:text-ink"
            >
              ✕
            </button>

            <h2 id="service-finder-heading" className="font-display text-2xl text-balance">
              {serviceFinder.panelHeading[locale]}
            </h2>

            {step.type === 'question' ? (
              <QuestionStep
                questionId={step.questionId}
                locale={locale}
                canGoBack={history.length > 0}
                onAnswer={answer}
                onBack={goBack}
              />
            ) : (
              <ResultStep result={step.result} locale={locale} onRestart={launch} onClose={close} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function QuestionStep({
  questionId,
  locale,
  canGoBack,
  onAnswer,
  onBack,
}: {
  questionId: ServiceFinderQuestionId;
  locale: Locale;
  canGoBack: boolean;
  onAnswer: (questionId: keyof ServiceFinderAnswers, optionId: string) => void;
  onBack: () => void;
}) {
  const question = serviceFinder.questions.find((q) => q.id === questionId)!;

  return (
    <div className="mt-5">
      <p className="text-base leading-relaxed">{question.question[locale]}</p>

      <div className="mt-5 flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            data-testid="service-finder-option"
            onClick={() => onAnswer(questionId, option.id)}
            className="rounded-full border border-line px-5 py-3 text-left text-sm transition-colors hover:border-sage hover:text-sage"
          >
            {option.label[locale]}
          </button>
        ))}
      </div>

      {canGoBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-5 text-xs text-muted underline-offset-2 hover:underline"
        >
          {serviceFinder.backLabel[locale]}
        </button>
      )}
    </div>
  );
}

function ResultStep({
  result,
  locale,
  onRestart,
  onClose,
}: {
  result: ServiceFinderResult;
  locale: Locale;
  onRestart: () => void;
  onClose: () => void;
}) {
  const strategySessionLink = (
    <Link
      href={{pathname: '/book', query: {service: 'performance-coaching'}}}
      onClick={onClose}
      className="mt-4 inline-block rounded-full border border-forest px-6 py-2.5 text-sm text-sage transition-colors hover:bg-forest hover:text-ink"
    >
      {serviceFinder.fallbackCta[locale]}
    </Link>
  );

  if (result.kind === 'strategy-session') {
    return (
      <div className="mt-5 text-center">
        <p className="font-display text-xl">{serviceFinder.fallbackHeading[locale]}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{serviceFinder.fallbackBody[locale]}</p>
        {strategySessionLink}
        <RestartButton locale={locale} onRestart={onRestart} />
      </div>
    );
  }

  const service = getService(result.slug)!;
  const summary = serviceFinder.results.find((r) => r.id === result.slug)!.summary[locale];
  const prices = service.durations.map((d) => d.price).filter((p): p is number => p !== null);
  const startingPrice = prices.length > 0 ? Math.min(...prices) : null;
  const packages = getPackagesForService(service);

  return (
    <div data-testid="service-finder-result" className="mt-5">
      <p className="text-xs uppercase tracking-[0.2em] text-sage">{service.tagline[locale]}</p>
      <p className="mt-2 font-display text-2xl">{service.name[locale]}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{summary}</p>

      {startingPrice !== null && (
        <p className="mt-3 text-sm">
          {locale === 'de' ? 'Ab ' : 'From '}
          <span className="tabular-nums font-medium">{formatPrice(startingPrice, locale)}</span>
        </p>
      )}

      <Link
        href={{pathname: '/book', query: {service: service.slug}}}
        onClick={onClose}
        className="mt-5 inline-block rounded-full bg-forest px-7 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
      >
        {serviceFinder.bookLabel[locale]}
      </Link>

      {packages.length > 0 && <PackageList service={service} locale={locale} />}

      <div className="mt-6 border-t border-line pt-5 text-center">
        {strategySessionLink}
      </div>

      <RestartButton locale={locale} onRestart={onRestart} />
    </div>
  );
}

function RestartButton({locale, onRestart}: {locale: Locale; onRestart: () => void}) {
  return (
    <button
      type="button"
      onClick={onRestart}
      className="mt-4 block w-full text-center text-xs text-muted underline-offset-2 hover:underline"
    >
      {serviceFinder.restartLabel[locale]}
    </button>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ServiceFinderWidget.tsx
git commit -m "feat: add service finder widget component"
```

---

### Task 5: Mount the widget site-wide

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `ServiceFinderWidget` from Task 4 (`@/components/ServiceFinderWidget`).

- [ ] **Step 1: Import and mount it**

In `src/app/[locale]/layout.tsx`, add the import alongside the existing `WelcomePopup` import (currently line 10):

```ts
import {WelcomePopup} from '@/components/WelcomePopup';
import {ServiceFinderWidget} from '@/components/ServiceFinderWidget';
```

Then mount it right after `<WelcomePopup locale={locale} />` (currently line 63):

```tsx
          <WelcomePopup locale={locale} />
          <ServiceFinderWidget locale={locale} />
```

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: PASS, all green.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: Build succeeds with no type errors.

- [ ] **Step 4: Manual check**

Start the dev server (`npm run dev`), open `http://localhost:3000`, confirm the bubble button appears bottom-right, clicking it opens the panel on question one, Escape closes it, and clicking outside the panel closes it too.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/layout.tsx"
git commit -m "feat: mount service finder widget site-wide"
```

---

### Task 6: Add the "Take our quiz" prompt to the services page

**Files:**
- Create: `src/components/ServiceFinderPrompt.tsx`
- Modify: `src/app/[locale]/services/page.tsx`

**Interfaces:**
- Produces: `ServiceFinderPrompt({locale}: {locale: Locale})` — a small client component; dispatches the same `'pbl:open-service-finder'` `window` event that `ServiceFinderWidget` (Task 4) already listens for.

`src/app/[locale]/services/page.tsx` is a Server Component (it's an `async function` with no `'use client'`), so the click handler that opens the widget needs to live in its own small client component.

- [ ] **Step 1: Create the prompt component**

Create `src/components/ServiceFinderPrompt.tsx`:

```tsx
'use client';

import type {Locale} from '@/content/schema';

const OPEN_EVENT = 'pbl:open-service-finder';

/**
 * Text entry point for the Service Finder quiz (ServiceFinderWidget.tsx),
 * placed on /leistungen where an undecided visitor is already standing.
 * Dispatches the same window event the floating bubble button listens for.
 */
export function ServiceFinderPrompt({locale}: {locale: Locale}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_EVENT))}
      className="mt-4 text-sm text-sage underline-offset-2 hover:underline"
    >
      {locale === 'de'
        ? 'Nicht sicher, welche Leistung passt? Mach unseren 30-Sekunden-Quiz.'
        : "Not sure which service fits? Take our 30-second quiz."}
    </button>
  );
}
```

- [ ] **Step 2: Wire it into the services page**

In `src/app/[locale]/services/page.tsx`, add the import:

```ts
import {ServiceFinderPrompt} from '@/components/ServiceFinderPrompt';
```

Then render it directly after the intro paragraph (currently lines 35-39), so it reads:

```tsx
        <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted">
          {locale === 'de'
            ? 'Eine Philosophie. Fünf spezialisierte Leistungen. Ein erstklassiges Erlebnis.'
            : 'One philosophy. Five specialised services. One premium experience.'}
        </p>

        <ServiceFinderPrompt locale={locale} />
```

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 5: Manual check**

On the dev server, visit `/leistungen`, click the new prompt text, confirm the same quiz panel opens on question one.

- [ ] **Step 6: Commit**

```bash
git add src/components/ServiceFinderPrompt.tsx "src/app/[locale]/services/page.tsx"
git commit -m "feat: add service finder entry point to the services page"
```

---

### Task 7: End-to-end test for one full path

**Files:**
- Create: `e2e/service-finder.spec.ts`

**Interfaces:**
- Consumes: `data-testid` attributes from Task 4 (`service-finder-bubble`, `service-finder-panel`, `service-finder-option`, `service-finder-result`).

This walks exactly one full path through the tree end-to-end (bubble → 4 answers → result → Book Now deep-link), proving the wiring works. It is deliberately not exhaustive of every branch — that's what Task 3's unit tests already cover.

- [ ] **Step 1: Write the test**

Create `e2e/service-finder.spec.ts`:

```ts
import {expect, test} from '@playwright/test';

test('walking the full quiz to a result deep-links the correct booking page', async ({page}) => {
  await page.goto('/');

  await page.getByTestId('service-finder-bubble').click();
  await expect(page.getByTestId('service-finder-panel')).toBeVisible();

  // Q1: goal -> "Relax and de-stress"
  await page.getByTestId('service-finder-option').filter({hasText: 'Entspannen'}).click();

  // Q2: massageType -> "Overall relaxation & stress relief"
  await page.getByTestId('service-finder-option').filter({hasText: 'Allgemeine Entspannung' }).click();

  // Q3: combine -> "No, just the treatment"
  await page.getByTestId('service-finder-option').filter({hasText: 'Nein, nur die Behandlung'}).click();

  // Q4: frequency -> "Just this once"
  await page.getByTestId('service-finder-option').filter({hasText: 'Nur dieses eine Mal'}).click();

  const result = page.getByTestId('service-finder-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Wellness & Recovery Massage');

  await result.getByRole('link', {name: 'Termin buchen'}).click();
  await expect(page).toHaveURL(/\/buchen\?service=wellness-recovery-massage/);
});

test('answering "Not sure" recommends a Strategy Session instead of a service', async ({page}) => {
  await page.goto('/');

  await page.getByTestId('service-finder-bubble').click();
  await page.getByTestId('service-finder-option').filter({hasText: 'nicht sicher'}).click();

  await expect(page.getByText('Strategy Session buchen')).toBeVisible();
});
```

- [ ] **Step 2: Run it**

Run: `npm run test:e2e -- service-finder.spec.ts`
Expected: PASS (2 tests). If a selector doesn't match, check the actual German copy rendered against what Task 2 wrote — the `.filter({hasText: ...})` calls use fragments of the exact German option labels defined in `src/content/serviceFinder.ts`.

- [ ] **Step 3: Run the entire test suite one more time (unit + e2e)**

Run: `npm test && npm run test:e2e`
Expected: Everything passes.

- [ ] **Step 4: Commit**

```bash
git add e2e/service-finder.spec.ts
git commit -m "test: add e2e coverage for the service finder quiz"
```

---

## Post-implementation checklist

- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] `npm run test:e2e` passes
- [ ] Restart the dev server with a clean `.next` (per this project's standing cache-gotcha rule) and manually click through both the bubble and the `/leistungen` prompt in a browser
- [ ] Tell Eddie the new copy in `src/content/serviceFinder.ts` is pending his review (already registered in `review.json` under the id `"serviceFinder"`)
