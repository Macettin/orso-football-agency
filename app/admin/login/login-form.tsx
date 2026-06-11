'use client';

import {useActionState} from 'react';
import {LockKeyhole, LogIn} from 'lucide-react';
import {login, type LoginState} from './actions';

export function LoginForm() {
  const initialState: LoginState = {error: ''};
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <label className="block">
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
          Email
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-12 w-full border border-line bg-panel px-4 text-white outline-none transition focus:border-accent"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
          Password
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-12 w-full border border-line bg-panel px-4 text-white outline-none transition focus:border-accent"
        />
      </label>
      {state.error ? (
        <p role="alert" className="border-s-2 border-red-500 ps-3 text-sm text-red-300">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 bg-brand px-5 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-accent disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? <LockKeyhole className="h-4 w-4 animate-pulse" /> : <LogIn className="h-4 w-4" />}
        {pending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
