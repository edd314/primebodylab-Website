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
