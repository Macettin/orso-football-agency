'use server';

import {revalidatePath} from 'next/cache';
import {routing} from '@/i18n/routing';
import {isValidContentSelection} from '@/lib/content/catalog';
import {requireAdmin} from '@/src/lib/supabase/admin';

export type VisualEditState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

export async function saveVisualContent(
  _previousState: VisualEditState,
  formData: FormData
): Promise<VisualEditState> {
  const page = String(formData.get('page') ?? '');
  const section = String(formData.get('section') ?? '');
  const contentKey = String(formData.get('contentKey') ?? '');

  if (!isValidContentSelection(page, section, contentKey)) {
    return {status: 'error', message: 'This content key is not editable.'};
  }

  const {supabase} = await requireAdmin();
  const rows = routing.locales.map((locale) => ({
    page,
    section,
    content_key: contentKey,
    locale,
    value: String(formData.get(`value:${locale}`) ?? '')
  }));
  const {error} = await supabase
    .from('site_content')
    .upsert(rows, {onConflict: 'page,section,content_key,locale'});

  if (error) {
    return {status: 'error', message: error.message};
  }

  for (const locale of routing.locales) {
    revalidatePath(`/${locale}`, 'layout');
  }

  return {status: 'success', message: 'All four languages were saved.'};
}
