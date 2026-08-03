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
