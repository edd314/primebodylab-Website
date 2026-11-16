// src/lib/crm/__tests__/session.test.ts
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {createSessionToken, verifySessionToken} from '../session';

describe('session token', () => {
  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = 'test-secret';
  });

  afterEach(() => {
    delete process.env.ADMIN_SESSION_SECRET;
  });

  it('a freshly created token verifies as valid', async () => {
    const token = await createSessionToken();
    await expect(verifySessionToken(token)).resolves.toBe(true);
  });

  it('a tampered token fails verification', async () => {
    const token = await createSessionToken();
    const tampered = token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a');
    await expect(verifySessionToken(tampered)).resolves.toBe(false);
  });

  it('an expired token fails verification', async () => {
    const issuedAt = Date.now() - 31 * 24 * 60 * 60 * 1000;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('test-secret'),
      {name: 'HMAC', hash: 'SHA-256'},
      false,
      ['sign'],
    );
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(issuedAt.toString()));
    const hex = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    await expect(verifySessionToken(`${issuedAt}.${hex}`)).resolves.toBe(false);
  });

  it('an empty token fails verification', async () => {
    await expect(verifySessionToken(undefined)).resolves.toBe(false);
  });
});
