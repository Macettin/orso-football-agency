'use client';

import {useActionState, useEffect, useState} from 'react';
import {Pencil, Save, X} from 'lucide-react';
import {useRouter} from 'next/navigation';
import type {Locale} from '@/i18n/routing';
import {saveVisualContent, type VisualEditState} from '@/app/admin/visual-actions';

const localeDetails: Record<Locale, {label: string; dir: 'ltr' | 'rtl'}> = {
  en: {label: 'English', dir: 'ltr'},
  tr: {label: 'Turkish', dir: 'ltr'},
  ru: {label: 'Russian', dir: 'ltr'},
  ar: {label: 'Arabic', dir: 'rtl'}
};

const initialState: VisualEditState = {status: 'idle', message: ''};

export function VisualEditModal({
  page,
  section,
  contentKey,
  values,
  offset
}: {
  page: string;
  section: string;
  contentKey: string;
  values: Record<Locale, string>;
  offset: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(saveVisualContent, initialState);

  useEffect(() => {
    if (state.status === 'success') {
      setOpen(false);
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute end-3 z-30 inline-flex h-9 items-center gap-2 rounded-sm border border-blue-400/60 bg-[#04102a]/95 px-3 text-[10px] font-bold uppercase tracking-wider text-blue-200 shadow-blue-soft backdrop-blur hover:bg-brand"
        style={{top: `${12 + offset * 42}px`}}
      >
        <Pencil className="h-3.5 w-3.5" /> Edit
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-accent/50 bg-[#07111f] shadow-blue">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-[#07111f]/95 p-5 backdrop-blur sm:p-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400">Visual editor</div>
                <h2 className="mt-2 font-display text-2xl font-semibold text-white">{contentKey}</h2>
                <p className="mt-1 font-mono text-xs text-slate-500">{page} / {section}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="p-2 text-slate-400 hover:text-white" aria-label="Close editor">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={action}>
              <input type="hidden" name="page" value={page} />
              <input type="hidden" name="section" value={section} />
              <input type="hidden" name="contentKey" value={contentKey} />
              <div className="grid gap-px bg-line lg:grid-cols-2">
                {(Object.keys(localeDetails) as Locale[]).map((locale) => (
                  <label key={locale} className="block bg-panel p-5 sm:p-6">
                    <span className="font-display text-lg font-semibold text-white">
                      {localeDetails[locale].label}
                    </span>
                    <textarea
                      name={`value:${locale}`}
                      defaultValue={values[locale]}
                      dir={localeDetails[locale].dir}
                      rows={5}
                      className="mt-3 w-full resize-y border border-line bg-ink px-4 py-3 text-sm leading-7 text-white outline-none focus:border-accent"
                    />
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line p-5 sm:p-6">
                <p className={`text-sm ${state.status === 'error' ? 'text-red-300' : 'text-emerald-300'}`}>
                  {state.message}
                </p>
                <button
                  disabled={pending}
                  className="inline-flex h-11 items-center gap-2 bg-brand px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-accent disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> {pending ? 'Saving...' : 'Save all languages'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
