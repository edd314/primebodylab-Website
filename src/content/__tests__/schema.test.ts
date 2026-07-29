import {describe, expect, it} from 'vitest';
import {z} from 'zod';
import {localized} from '@/content/schema';

describe('localized', () => {
  it('accepts a record with both locales', () => {
    const schema = localized(z.string());
    expect(schema.parse({de: 'Hallo', en: 'Hello'})).toEqual({
      de: 'Hallo',
      en: 'Hello',
    });
  });

  it('rejects a record missing German', () => {
    const schema = localized(z.string());
    expect(() => schema.parse({en: 'Hello'})).toThrow();
  });

  it('rejects a record missing English', () => {
    const schema = localized(z.string());
    expect(() => schema.parse({de: 'Hallo'})).toThrow();
  });

  it('rejects an empty string in either locale', () => {
    const schema = localized(z.string().min(1));
    expect(() => schema.parse({de: '', en: 'Hello'})).toThrow();
  });
});
