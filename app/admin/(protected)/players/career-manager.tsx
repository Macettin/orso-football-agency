'use client';

import {useActionState, useEffect, useRef} from 'react';
import {useRouter} from 'next/navigation';
import {Plus, Save, Trash2} from 'lucide-react';
import {
  createCareerEntry,
  deleteCareerEntry,
  initialCareerActionState,
  updateCareerEntry,
  type CareerActionState
} from './career-actions';

export type CareerEntryFormValue = {
  id: string;
  season: string;
  club: string;
  country: string;
  appearances: number | null;
  goals: number | null;
  assists: number | null;
  display_order: number;
};

export function CareerManager({
  playerId,
  playerSlug,
  entries
}: {
  playerId: string;
  playerSlug: string;
  entries: CareerEntryFormValue[];
}) {
  return (
    <section className="border-t border-line bg-navy/30 p-5 sm:p-6">
      <h3 className="font-display text-xl font-semibold text-white">Career history</h3>
      <p className="mt-2 text-sm text-mist">
        Add seasons in the order they should appear on the public profile.
      </p>

      <details className="mt-5 border border-line bg-ink/50">
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider text-blue-300">
          <Plus className="h-4 w-4" /> Add career entry
        </summary>
        <CareerForm mode="create" playerId={playerId} playerSlug={playerSlug} />
      </details>

      <div className="mt-4 space-y-3">
        {entries.map((entry) => (
          <details key={entry.id} className="border border-line bg-ink/50">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-white">
              {entry.season} · {entry.club}
            </summary>
            <CareerForm
              mode="update"
              playerId={playerId}
              playerSlug={playerSlug}
              entry={entry}
            />
            <DeleteCareerButton
              id={entry.id}
              playerId={playerId}
              playerSlug={playerSlug}
            />
          </details>
        ))}
        {!entries.length ? (
          <p className="border border-dashed border-line px-4 py-5 text-sm text-slate-500">
            No career entries yet.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function CareerForm({
  mode,
  playerId,
  playerSlug,
  entry
}: {
  mode: 'create' | 'update';
  playerId: string;
  playerSlug: string;
  entry?: CareerEntryFormValue;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const action = mode === 'create' ? createCareerEntry : updateCareerEntry;
  const [state, formAction, pending] = useActionState(action, initialCareerActionState);
  const handledRequestId = useRef('');

  useEffect(() => {
    if (!state.requestId || handledRequestId.current === state.requestId) return;
    handledRequestId.current = state.requestId;
    if (state.status === 'success') {
      if (mode === 'create') formRef.current?.reset();
      router.refresh();
    }
  }, [mode, router, state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-3 border-t border-line p-4 sm:grid-cols-2">
      <input type="hidden" name="player_id" value={playerId} />
      <input type="hidden" name="player_slug" value={playerSlug} />
      {entry ? <input type="hidden" name="id" value={entry.id} /> : null}
      <CareerField label="Season" name="season" defaultValue={entry?.season} required />
      <CareerField label="Club" name="club" defaultValue={entry?.club} required />
      <CareerField label="Country" name="country" defaultValue={entry?.country} />
      <CareerField label="Appearances" name="appearances" type="number" defaultValue={entry?.appearances ?? ''} />
      <CareerField label="Goals" name="goals" type="number" defaultValue={entry?.goals ?? ''} />
      <CareerField label="Assists" name="assists" type="number" defaultValue={entry?.assists ?? ''} />
      <CareerField label="Display order" name="display_order" type="number" defaultValue={entry?.display_order ?? 0} />
      {state.message ? <CareerMessage state={state} /> : null}
      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center gap-2 bg-brand px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {pending ? 'Saving...' : mode === 'create' ? 'Add entry' : 'Save entry'}
        </button>
      </div>
    </form>
  );
}

function DeleteCareerButton({
  id,
  playerId,
  playerSlug
}: {
  id: string;
  playerId: string;
  playerSlug: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    deleteCareerEntry,
    initialCareerActionState
  );
  const handledRequestId = useRef('');

  useEffect(() => {
    if (!state.requestId || handledRequestId.current === state.requestId) return;
    handledRequestId.current = state.requestId;
    if (state.status === 'success') router.refresh();
  }, [router, state]);

  return (
    <form action={formAction} className="border-t border-line px-4 pb-4 pt-3">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="player_id" value={playerId} />
      <input type="hidden" name="player_slug" value={playerSlug} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center gap-2 border border-red-500/50 px-4 text-xs font-bold uppercase tracking-wider text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" /> {pending ? 'Deleting...' : 'Delete'}
      </button>
      {state.status === 'error' ? <div className="mt-3"><CareerMessage state={state} /></div> : null}
    </form>
  );
}

function CareerField({
  label,
  name,
  defaultValue,
  type = 'text',
  required
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <input
        name={name}
        type={type}
        min={type === 'number' ? 0 : undefined}
        defaultValue={defaultValue}
        required={required}
        className="h-11 w-full border border-line bg-panel px-3 text-sm text-white outline-none focus:border-accent"
      />
    </label>
  );
}

function CareerMessage({state}: {state: CareerActionState}) {
  return (
    <p
      className={`sm:col-span-2 border-s-2 px-3 py-2 text-sm ${
        state.status === 'success'
          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200'
          : 'border-red-500 bg-red-500/10 text-red-200'
      }`}
    >
      {state.message}
    </p>
  );
}
