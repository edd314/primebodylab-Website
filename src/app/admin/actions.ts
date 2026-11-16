// src/app/admin/actions.ts
'use server';

import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {COOKIE_NAME} from '@/lib/crm/session';
import {requireAdminSession} from '@/lib/crm/adminAuth';

export async function logout(): Promise<void> {
  await requireAdminSession();
  (await cookies()).delete(COOKIE_NAME);
  redirect('/admin/login');
}
