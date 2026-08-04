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

  it('never has a result summary for a slug that is not a real service', () => {
    const serviceSlugs = services.map((s) => s.slug);
    for (const result of serviceFinder.results) {
      expect(serviceSlugs).toContain(result.id);
    }
  });
});
