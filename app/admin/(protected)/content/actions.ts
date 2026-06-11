'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {getContentEntry, isValidContentSelection} from '@/lib/content/catalog';
import {requireAdmin} from '@/src/lib/supabase/admin';

function contentUrl(
  page: string,
  section: string,
  contentKey: string,
  result: string
) {
  const params = new URLSearchParams({
    page,
    section,
    contentKey,
    result
  });
  return `/admin/content?${params.toString()}`;
}

export async function saveContent(formData: FormData) {
  const page = String(formData.get('page') ?? '');
  const section = String(formData.get('section') ?? '');
  const contentKey = String(formData.get('contentKey') ?? '');

  if (!isValidContentSelection(page, section, contentKey)) {
    redirect(contentUrl(page, section, contentKey, 'invalid-selection'));
  }

  const rows = routing.locales.map((locale) => {
    const fallback = getContentEntry(page, section, contentKey, locale);
    if (!fallback) {
      redirect(contentUrl(page, section, contentKey, 'missing-fallback'));
    }

    return {
      page,
      section,
      content_key: contentKey,
      locale,
      value: String(formData.get(`value:${locale}`) ?? '')
    };
  });

  const {supabase} = await requireAdmin();
  const {error} = await supabase
    .from('site_content')
    .upsert(rows, {onConflict: 'page,section,content_key,locale'});

  if (error) {
    redirect(contentUrl(page, section, contentKey, 'save-error'));
  }

  for (const locale of routing.locales as readonly Locale[]) {
    revalidatePath(`/${locale}`, 'layout');
  }

  redirect(contentUrl(page, section, contentKey, 'saved'));
}
