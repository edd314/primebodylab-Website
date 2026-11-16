'use client';

import {useActionState} from 'react';
import {login, type LoginState} from './actions';

const initialState: LoginState = {error: null};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6">
      <h1 className="font-display text-2xl">Admin login</h1>
      <form action={formAction} className="mt-6 flex w-full flex-col gap-3">
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          className="rounded-full border border-line bg-bone px-5 py-3 text-sm text-ink placeholder:text-muted focus:border-sage focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-forest px-7 py-3 text-sm font-medium text-bone transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Checking…' : 'Log in'}
        </button>
      </form>
      {state.error && (
        <p role="alert" className="mt-3 text-sm text-sage">
          {state.error}
        </p>
      )}
    </main>
  );
}
