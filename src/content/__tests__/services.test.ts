import {describe, expect, it} from 'vitest';
import {getService, services} from '@/content/services';
import {faqs} from '@/content/faqs';
import {testimonials} from '@/content/testimonials';

describe('services', () => {
  it('defines the five services the business offers', () => {
    expect(services.map((s) => s.slug)).toEqual([
      'wellness-recovery-massage',
      'performance-massage',
      'stretch-therapy',
      'performance-recovery-bundle',
      'performance-coaching',
    ]);
  });

  it('gives wellness & recovery massage a starting price of 80 euro', () => {
    const wellness = getService('wellness-recovery-massage')!;
    const prices = wellness.durations.map((d) => d.price);
    expect(Math.min(...prices.filter((p): p is number => p !== null))).toBe(80);
  });

  it('gives performance massage a starting price of 85 euro', () => {
    const massage = getService('performance-massage')!;
    const prices = massage.durations.map((d) => d.price);
    expect(Math.min(...prices.filter((p): p is number => p !== null))).toBe(85);
  });

  it('offers massage in 60, 90 and 120 minutes', () => {
    const massage = getService('performance-massage')!;
    expect(massage.durations.map((d) => d.minutes)).toEqual([60, 90, 120]);
  });

  it('returns undefined for an unknown slug', () => {
    expect(getService('nope')).toBeUndefined();
  });

  it('has a unique slug per service', () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('faqs', () => {
  it('has a unique id for every question', () => {
    const ids = faqs.flatMap((g) => g.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('groups questions under booking, treatments and coaching', () => {
    expect(faqs.map((g) => g.id)).toEqual(['booking', 'treatments', 'coaching']);
  });

  it('carries every question from the current site', () => {
    const ids = faqs.flatMap((g) => g.items.map((i) => i.id));
    expect(ids.length).toBeGreaterThanOrEqual(19);
  });
});

describe('testimonials', () => {
  it('carries every review added so far', () => {
    expect(testimonials.length).toBeGreaterThanOrEqual(8);
  });

  it('rates every review between 1 and 5', () => {
    for (const t of testimonials) {
      expect(t.rating).toBeGreaterThanOrEqual(1);
      expect(t.rating).toBeLessThanOrEqual(5);
    }
  });
});
