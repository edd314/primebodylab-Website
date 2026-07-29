import {describe, expect, it} from 'vitest';
import {formatPrice} from '@/lib/format';

describe('formatPrice', () => {
  it('formats euros in German convention', () => {
    expect(formatPrice(80, 'de')).toBe('80 €');
  });

  it('formats euros in English convention', () => {
    expect(formatPrice(80, 'en')).toBe('€80');
  });
});
