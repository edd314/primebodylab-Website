'use client';

import {useEffect, useRef, useState} from 'react';
import {Link} from '@/i18n/navigation';
import {serviceFinder} from '@/content/serviceFinder';
import {
  getNextStep,
  SERVICE_FINDER_OPEN_EVENT,
  type ServiceFinderAnswers,
  type ServiceFinderResult,
} from '@/lib/serviceFinder';
import {getService} from '@/content/services';
import {getPackagesForService} from '@/lib/packages';
import {formatPrice} from '@/lib/format';
import {PackageList} from '@/components/sections/PackageList';
import type {Locale, ServiceFinderQuestionId} from '@/content/schema';

const OPEN_EVENT = SERVICE_FINDER_OPEN_EVENT;

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

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) panelRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step.type, step.type === 'question' ? step.questionId : undefined]);

  return (
    <>
      <button
        type="button"
        data-testid="service-finder-bubble"
        onClick={launch}
        aria-label={serviceFinder.bubbleLabel[locale]}
        className="fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-2xl text-bone shadow-lg transition-opacity hover:opacity-90 sm:right-6 sm:bottom-6"
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
            ref={panelRef}
            tabIndex={-1}
            className="relative max-h-[85vh] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface p-7 motion-reduce:transition-none"
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
              <ResultStep
                result={step.result}
                locale={locale}
                answers={answers}
                onRestart={launch}
                onClose={close}
              />
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
  answers,
  onRestart,
  onClose,
}: {
  result: ServiceFinderResult;
  locale: Locale;
  answers: ServiceFinderAnswers;
  onRestart: () => void;
  onClose: () => void;
}) {
  const strategySessionLink = (
    <Link
      href={{pathname: '/book', query: {service: 'performance-coaching'}}}
      onClick={onClose}
      className="mt-4 inline-block rounded-full border border-forest px-6 py-2.5 text-sm text-sage transition-colors hover:bg-forest hover:text-bone"
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
        className="mt-5 inline-block rounded-full bg-forest px-7 py-3 text-sm font-medium text-bone transition-opacity hover:opacity-90"
      >
        {serviceFinder.bookLabel[locale]}
      </Link>

      {packages.length > 0 && answers.frequency === 'regular' && (
        <PackageList service={service} locale={locale} />
      )}

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
