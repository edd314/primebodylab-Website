// src/app/admin/login/actions.ts
'use server';

import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {checkPassword} from '@/lib/crm/password';
import {COOKIE_NAME, MAX_AGE_SECONDS, createSessionToken} from '@/lib/crm/session';

export type LoginState = {error: string | null};

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get('password') ?? '');

  if (!checkPassword(password)) {
    return {error: 'Wrong password.'};
  }

  const token = await createSessionToken();
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: MAX_AGE_SECONDS,
    path: '/',
  });

  redirect('/admin');
}
