// src/lib/crm/__tests__/types.test.ts
import {describe, expect, it} from 'vitest';
import {remainingSessions} from '../types';

describe('remainingSessions', () => {
  it('subtracts used sessions from the total', () => {
    expect(remainingSessions({totalSessions: 5, usedSessions: 2})).toBe(3);
  });

  it('can reach exactly zero', () => {
    expect(remainingSessions({totalSessions: 5, usedSessions: 5})).toBe(0);
  });
});
