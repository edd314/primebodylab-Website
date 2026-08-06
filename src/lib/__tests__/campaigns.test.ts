import {describe, expect, it} from 'vitest';
import {getActiveCampaign, isCampaignActive} from '@/lib/campaigns';
import type {Campaign} from '@/content/schema';

function campaign(overrides: Partial<Campaign>): Campaign {
  return {
    id: 'test',
    start: {month: 6, day: 1},
    end: {month: 6, day: 10},
    eyebrow: {de: '', en: ''},
    headline: {de: '', en: ''},
    body: {de: '', en: ''},
    ctaLabel: {de: '', en: ''},
    ctaHref: '/services',
    discountCode: null,
    ...overrides,
  };
}

describe('isCampaignActive', () => {
  it('is true inside a same-year window, including both boundary days', () => {
    const c = campaign({start: {month: 6, day: 1}, end: {month: 6, day: 10}});
    expect(isCampaignActive(c, new Date(2027, 5, 1))).toBe(true);
    expect(isCampaignActive(c, new Date(2027, 5, 5))).toBe(true);
    expect(isCampaignActive(c, new Date(2027, 5, 10))).toBe(true);
  });

  it('is false just outside a same-year window', () => {
    const c = campaign({start: {month: 6, day: 1}, end: {month: 6, day: 10}});
    expect(isCampaignActive(c, new Date(2027, 4, 31))).toBe(false);
    expect(isCampaignActive(c, new Date(2027, 5, 11))).toBe(false);
  });

  it('wraps across New Year when end sorts before start', () => {
    const c = campaign({start: {month: 12, day: 26}, end: {month: 1, day: 15}});
    expect(isCampaignActive(c, new Date(2027, 11, 26))).toBe(true);
    expect(isCampaignActive(c, new Date(2027, 11, 31))).toBe(true);
    expect(isCampaignActive(c, new Date(2027, 0, 1))).toBe(true);
    expect(isCampaignActive(c, new Date(2027, 0, 15))).toBe(true);
    expect(isCampaignActive(c, new Date(2027, 0, 16))).toBe(false);
    expect(isCampaignActive(c, new Date(2027, 11, 25))).toBe(false);
  });

  it('recurs every year regardless of the year value', () => {
    const c = campaign({start: {month: 6, day: 1}, end: {month: 6, day: 10}});
    expect(isCampaignActive(c, new Date(2030, 5, 5))).toBe(true);
    expect(isCampaignActive(c, new Date(1999, 5, 5))).toBe(true);
  });
});

describe('getActiveCampaign', () => {
  it('returns the first matching campaign in list order', () => {
    const first = campaign({id: 'first', start: {month: 6, day: 1}, end: {month: 6, day: 10}});
    const second = campaign({id: 'second', start: {month: 6, day: 5}, end: {month: 6, day: 15}});
    expect(getActiveCampaign([first, second], new Date(2027, 5, 5))?.id).toBe('first');
  });

  it('returns null when no campaign window contains the date', () => {
    const c = campaign({start: {month: 6, day: 1}, end: {month: 6, day: 10}});
    expect(getActiveCampaign([c], new Date(2027, 6, 1))).toBeNull();
  });

  it('returns null for an empty campaign list', () => {
    expect(getActiveCampaign([], new Date())).toBeNull();
  });
});
