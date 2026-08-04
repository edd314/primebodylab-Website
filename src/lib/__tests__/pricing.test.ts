import {describe, expect, it} from 'vitest';
import {getFromPrice} from '../pricing';
import type {Service} from '@/content/schema';

function makeService(durations: {minutes: number; price: number | null}[]): Service {
  return {
    slug: 'test-service',
    acuityTypeId: null,
    image: {src: '/images/test.jpg', alt: {de: 'Test', en: 'Test'}, placeholder: false, focus: 'center'},
    name: {de: 'Test', en: 'Test'},
    tagline: {de: 'Test', en: 'Test'},
    description: {de: 'Test', en: 'Test'},
    includes: {de: ['Test'], en: ['Test']},
    durations,
  };
}

describe('getFromPrice', () => {
  it('returns the lowest non-null price across durations', () => {
    const service = makeService([
      {minutes: 60, price: 90},
      {minutes: 90, price: 85},
      {minutes: 120, price: 110},
    ]);
    expect(getFromPrice(service)).toBe(85);
  });

  it('ignores null (price-on-request) durations when finding the minimum', () => {
    const service = makeService([
      {minutes: 30, price: null},
      {minutes: 60, price: 80},
    ]);
    expect(getFromPrice(service)).toBe(80);
  });

  it('returns null when every duration is price-on-request', () => {
    const service = makeService([{minutes: 30, price: null}]);
    expect(getFromPrice(service)).toBeNull();
  });
});
