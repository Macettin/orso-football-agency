'use client';

import {Save} from 'lucide-react';
import {useFormStatus} from 'react-dom';

export function AdminSubmitButton({label}: {label: string}) {
  const {pending} = useFormStatus();
  return (
    <button disabled={pending} className="inline-flex h-11 items-center gap-2 bg-brand px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50">
      <Save className="h-4 w-4" /> {pending ? 'Saving...' : label}
    </button>
  );
}
