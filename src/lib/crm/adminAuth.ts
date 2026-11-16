// src/lib/crm/adminAuth.ts
//
// Server-only session guards for admin pages, layouts and server actions.
// Kept out of session.ts on purpose: session.ts is imported by the Edge proxy,
// and this file pulls in next/headers + next/navigation.
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {COOKIE_NAME, verifySessionToken} from './session';

export async function hasAdminSession(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/**
 * Defense in depth: the proxy already gates /admin, but every admin page and
 * server action calls this too, so a matcher gap (or a direct server-action
 * POST) can never reach client data without a valid session.
 */
export async function requireAdminSession(): Promise<void> {
  if (!(await hasAdminSession())) {
    redirect('/admin/login');
  }
}
