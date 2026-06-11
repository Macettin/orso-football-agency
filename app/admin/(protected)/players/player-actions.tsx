'use client';

import {useActionState, useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {ImagePlus, Save, Trash2} from 'lucide-react';
import {playerSlug, slugify} from '@/lib/slug';
import {
  createPlayer,
  deletePlayer,
  initialPlayerActionState,
  updatePlayer,
  type PlayerActionState
} from './actions';

export type PlayerFormValue = {
  id: string;
  name: string;
  slug: string;
  position: string;
  nationality: string;
  age: number | null;
  current_club: string;
  height: string;
  preferred_foot: string;
  contract_status: string;
  photo_url: string | null;
  transfermarkt_url: string | null;
  video_url: string | null;
  is_featured: boolean;
  is_published: boolean;
};

export type PlayerTranslationFormValue = {
  locale: 'en' | 'tr' | 'ru' | 'ar';
  short_bio: string;
  strengths: string;
  career_summary: string;
};

export function CreatePlayerForm() {
  return <PlayerForm mode="create" />;
}

export function EditPlayerForm({
  player,
  translations
}: {
  player: PlayerFormValue;
  translations: PlayerTranslationFormValue[];
}) {
  return <PlayerForm mode="update" player={player} translations={translations} />;
}

function PlayerForm({
  mode,
  player,
  translations = []
}: {
  mode: 'create' | 'update';
  player?: PlayerFormValue;
  translations?: PlayerTranslationFormValue[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const action = mode === 'create' ? createPlayer : updatePlayer;
  const [state, formAction, pending] = useActionState(action, initialPlayerActionState);
  const [showMessage, setShowMessage] = useState(false);
  const handledRequestId = useRef('');
  const submittingRef = useRef(false);
  const slugRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!state.requestId || handledRequestId.current === state.requestId) return;
    handledRequestId.current = state.requestId;
    submittingRef.current = false;
    setShowMessage(true);
    if (state.status === 'success') {
      if (mode === 'create') formRef.current?.reset();
      router.replace(`/admin/players?result=${state.result}`);
      router.refresh();
    }
  }, [mode, router, state]);

  function beginSubmission(event: React.FormEvent<HTMLFormElement>) {
    if (submittingRef.current) {
      event.preventDefault();
      return;
    }
    submittingRef.current = true;
    setShowMessage(false);
    window.dispatchEvent(new Event('player-action-start'));
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={beginSubmission}
      className="grid gap-4 border-t border-line p-5 sm:grid-cols-2 sm:p-6"
    >
      {player ? <input type="hidden" name="id" value={player.id} /> : null}
      <input type="hidden" name="current_photo_url" value={player?.photo_url ?? ''} />
      <Field
        label="Name"
        name="name"
        defaultValue={player?.name}
        required
        onBlur={(event) => {
          if (slugRef.current && !slugRef.current.value.trim()) {
            slugRef.current.value = slugify(event.currentTarget.value);
          }
        }}
      />
      <Field
        label="Slug"
        name="slug"
        defaultValue={player ? playerSlug(player.slug, player.name) : ''}
        placeholder="Auto-generated from name"
        inputRef={slugRef}
      />
      <Field label="Position" name="position" defaultValue={player?.position} />
      <Field label="Nationality" name="nationality" defaultValue={player?.nationality} />
      <Field label="Age" name="age" type="number" defaultValue={player?.age ?? ''} />
      <Field label="Current club" name="current_club" defaultValue={player?.current_club} />
      <Field label="Height" name="height" defaultValue={player?.height} placeholder="1.84 m" />
      <Field label="Preferred foot" name="preferred_foot" defaultValue={player?.preferred_foot} />
      <Field label="Contract status" name="contract_status" defaultValue={player?.contract_status} />
      <Field label="Transfermarkt URL" name="transfermarkt_url" type="url" defaultValue={player?.transfermarkt_url ?? ''} />
      <Field label="Video URL" name="video_url" type="url" defaultValue={player?.video_url ?? ''} />
      <label>
        <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <ImagePlus className="h-4 w-4" /> Player photo
        </span>
        <input
          name="photo"
          type="file"
          accept="image/*"
          disabled={pending}
          className="block h-12 w-full border border-line bg-ink px-3 py-2 text-sm text-slate-300 file:mr-3 file:border-0 file:bg-brand file:px-3 file:py-1 file:text-xs file:font-bold file:text-white disabled:opacity-50"
        />
      </label>
      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <Check name="is_published" label="Published" defaultChecked={player?.is_published ?? true} disabled={pending} />
        <Check name="is_featured" label="Featured on homepage" defaultChecked={player?.is_featured ?? false} disabled={pending} />
      </div>
      <details className="border border-line bg-navy/40 sm:col-span-2" open>
        <summary className="cursor-pointer px-4 py-4 font-display text-lg font-semibold text-white">
          Multilingual player profile
        </summary>
        <div className="grid gap-4 border-t border-line p-4 lg:grid-cols-2">
          {([
            ['en', 'English'],
            ['tr', 'Turkish'],
            ['ru', 'Russian'],
            ['ar', 'Arabic']
          ] as const).map(([locale, label]) => {
            const translation = translations.find((item) => item.locale === locale);
            return (
              <div key={locale} className="border border-line bg-ink/60 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold text-white">{label}</h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">{locale}</span>
                </div>
                <div className="space-y-4">
                  <TextArea
                    label="Short bio"
                    name={`${locale}_short_bio`}
                    defaultValue={translation?.short_bio}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  />
                  <TextArea
                    label="Strengths (one per line)"
                    name={`${locale}_strengths`}
                    defaultValue={translation?.strengths}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    rows={4}
                  />
                  <TextArea
                    label="Career summary"
                    name={`${locale}_career_summary`}
                    defaultValue={translation?.career_summary}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </details>
      {showMessage && state.message ? <ActionMessage state={state} /> : null}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2 bg-brand px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {pending ? 'Saving...' : mode === 'create' ? 'Create player' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

export function DeletePlayerForm({id}: {id: string}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    deletePlayer,
    initialPlayerActionState
  );
  const [showMessage, setShowMessage] = useState(false);
  const handledRequestId = useRef('');
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!state.requestId || handledRequestId.current === state.requestId) return;
    handledRequestId.current = state.requestId;
    submittingRef.current = false;
    setShowMessage(true);
    if (state.status === 'success') {
      router.replace(`/admin/players?result=${state.result}`);
      router.refresh();
    }
  }, [router, state]);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (submittingRef.current) {
          event.preventDefault();
          return;
        }
        submittingRef.current = true;
        setShowMessage(false);
        window.dispatchEvent(new Event('player-action-start'));
      }}
      className="border-t border-line p-5 sm:p-6"
    >
      <input type="hidden" name="id" value={id} />
      {showMessage && state.status === 'error' ? <ActionMessage state={state} /> : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center gap-2 border border-red-500/50 px-4 text-xs font-bold uppercase tracking-wider text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" /> {pending ? 'Deleting...' : 'Delete player'}
      </button>
    </form>
  );
}

export function PlayerPageMessage({result}: {result?: string}) {
  const [visible, setVisible] = useState(Boolean(result));

  useEffect(() => {
    setVisible(Boolean(result));
  }, [result]);

  useEffect(() => {
    const clear = () => setVisible(false);
    window.addEventListener('player-action-start', clear);
    return () => window.removeEventListener('player-action-start', clear);
  }, []);

  if (!visible || !result) return null;

  const messages: Record<string, string> = {
    created: 'Player created successfully',
    updated: 'Player updated successfully',
    deleted: 'Player deleted successfully'
  };
  const success = result in messages;

  return (
    <p
      className={`mt-6 border-s-2 px-4 py-3 text-sm ${
        success
          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200'
          : 'border-red-500 bg-red-500/10 text-red-200'
      }`}
    >
      {messages[result] ?? decodeURIComponent(result)}
    </p>
  );
}

function ActionMessage({state}: {state: PlayerActionState}) {
  return (
    <p
      className={`sm:col-span-2 border-s-2 px-4 py-3 text-sm ${
        state.status === 'success'
          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200'
          : 'border-red-500 bg-red-500/10 text-red-200'
      }`}
    >
      {state.message}
    </p>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  placeholder,
  required,
  inputRef,
  onBlur
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  placeholder?: string;
  required?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <input
        ref={inputRef}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        onBlur={onBlur}
        className="h-12 w-full border border-line bg-ink px-3 text-sm text-white outline-none focus:border-accent disabled:opacity-50"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  dir,
  rows = 5
}: {
  label: string;
  name: string;
  defaultValue?: string;
  dir: 'ltr' | 'rtl';
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        dir={dir}
        rows={rows}
        className="w-full resize-y border border-line bg-panel px-3 py-3 text-sm leading-6 text-white outline-none focus:border-accent"
      />
    </label>
  );
}

function Check({
  name,
  label,
  defaultChecked,
  disabled
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
  disabled: boolean;
}) {
  return (
    <label className="flex items-center gap-3 text-sm text-slate-300">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        disabled={disabled}
        className="h-4 w-4 accent-blue-600"
      />
      {label}
    </label>
  );
}
