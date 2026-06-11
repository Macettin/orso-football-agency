'use client';

import {useState} from 'react';
import {Send} from 'lucide-react';
import {useTranslations} from 'next-intl';

export function ContactForm() {
  const t = useTranslations('contact');
  const common = useTranslations('common');
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="glass-card p-6 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t('name')} name="name" />
        <Field label={t('email')} name="email" type="email" />
        <Field label={t('phone')} name="phone" />
        <Field label={t('subject')} name="subject" />
      </div>
      <label className="mt-5 block">
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-300">{t('message')}</span>
        <textarea
          name="message"
          required
          rows={6}
          className="w-full resize-none border border-line bg-panel px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-accent"
        />
      </label>
      <p className="mt-4 text-xs leading-5 text-slate-500">{t('privacy')}</p>
      <button
        type="submit"
        className="mt-6 inline-flex min-h-12 items-center gap-2 bg-brand px-6 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-blue-soft transition hover:bg-accent hover:shadow-blue"
      >
        {common('send')} <Send className="h-4 w-4 rtl:rotate-180" />
      </button>
      {submitted ? (
        <p role="status" className="mt-5 border-s-2 border-accent ps-4 text-sm text-blue-200">{t('success')}</p>
      ) : null}
    </form>
  );
}

function Field({label, name, type = 'text'}: {label: string; name: string; type?: string}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-300">{label}</span>
      <input
        name={name}
        type={type}
        required
        className="h-12 w-full border border-line bg-panel px-4 text-sm text-white outline-none transition focus:border-accent"
      />
    </label>
  );
}
