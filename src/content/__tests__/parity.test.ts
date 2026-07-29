import {describe, expect, it} from 'vitest';
import {site} from '@/content/site';
import {pendingGermanReview} from '@/content/review';

describe('site content', () => {
  it('carries the owner’s exact business details', () => {
    expect(site.phone).toBe('+49 176 83248394');
    expect(site.email).toBe('book_primebodylab@proton.me');
    expect(site.taxId).toBe('154/214/50789');
    expect(site.postcode).toBe('85276');
    expect(site.city).toBe('Pfaffenhofen');
  });

  it('lists qualifications in both locales with equal length', () => {
    expect(site.qualifications.de).toHaveLength(site.qualifications.en.length);
  });
});

describe('review register', () => {
  it('is an array of string ids', () => {
    expect(Array.isArray(pendingGermanReview)).toBe(true);
    for (const id of pendingGermanReview) {
      expect(typeof id).toBe('string');
    }
  });
});
