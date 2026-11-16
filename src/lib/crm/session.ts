// src/lib/crm/session.ts
export const COOKIE_NAME = 'admin_session';
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function requireSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set');
  return secret;
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    {name: 'HMAC', hash: 'SHA-256'},
    false,
    ['sign'],
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createSessionToken(): Promise<string> {
  const issuedAt = Date.now().toString();
  const key = await getKey(requireSecret());
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(issuedAt));
  return `${issuedAt}.${toHex(signature)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;

  const [issuedAt, signatureHex] = token.split('.');
  if (!issuedAt || !signatureHex) return false;

  const age = Date.now() - Number(issuedAt);
  if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_SECONDS * 1000) return false;

  const key = await getKey(requireSecret());
  const expectedSignature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(issuedAt));
  return toHex(expectedSignature) === signatureHex;
}
