// src/lib/crm/__tests__/password.test.ts
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {checkPassword} from '../password';

describe('checkPassword', () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = 'correct-password';
  });

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
  });

  it('accepts the correct password', () => {
    expect(checkPassword('correct-password')).toBe(true);
  });

  it('rejects an incorrect password', () => {
    expect(checkPassword('wrong')).toBe(false);
  });

  it('rejects any password when ADMIN_PASSWORD is not set', () => {
    delete process.env.ADMIN_PASSWORD;
    expect(checkPassword('anything')).toBe(false);
  });
});
