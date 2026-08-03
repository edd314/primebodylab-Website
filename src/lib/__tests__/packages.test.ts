import {describe, expect, it} from 'vitest';
import {isPackageEligible} from '@/lib/packages';

describe('isPackageEligible', () => {
  it('is true for the three services that have session packages', () => {
    expect(isPackageEligible('wellness-recovery-massage')).toBe(true);
    expect(isPackageEligible('performance-massage')).toBe(true);
    expect(isPackageEligible('stretch-therapy')).toBe(true);
  });

  it('is false for services without session packages', () => {
    expect(isPackageEligible('performance-recovery-bundle')).toBe(false);
    expect(isPackageEligible('performance-coaching')).toBe(false);
  });

  it('is false for an unknown slug', () => {
    expect(isPackageEligible('not-a-real-service')).toBe(false);
  });
});
