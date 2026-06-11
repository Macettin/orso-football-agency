'use client';

import {useEffect, useMemo, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {getContentEntry} from '@/lib/content/catalog';
import {createClient} from '@/src/lib/supabase/client';
import {VisualEditModal} from './visual-edit-modal';

export function VisualEditButton({
  page,
  section,
  contentKey,
  offset = 0
}: {
  page: string;
  section: string;
  contentKey: string;
  offset?: number;
}) {
  const fallbackValues = useMemo(
    () => Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        getContentEntry(page, section, contentKey, locale)?.fallback ?? ''
      ])
    ) as Record<Locale, string>,
    [contentKey, page, section]
  );
  const [values, setValues] = useState(fallbackValues);
  const [isAdmin, setIsAdmin] = useState(false);
  const searchParams = useSearchParams();
  const editMode = searchParams.get('edit') === 'true';

  useEffect(() => {
    let active = true;

    async function loadEditor() {
      if (!editMode) {
        setIsAdmin(false);
        return;
      }

      try {
        const supabase = createClient();
        const {data: userData} = await supabase.auth.getUser();
        if (!userData.user) return;

        const {data: admin} = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', userData.user.id)
          .maybeSingle();
        if (!admin || !active) return;

        const {data: overrides} = await supabase
          .from('site_content')
          .select('locale,value')
          .eq('page', page)
          .eq('section', section)
          .eq('content_key', contentKey)
          .in('locale', [...routing.locales]);

        if (!active) return;
        setValues((current) => ({
          ...current,
          ...Object.fromEntries(
            overrides?.map((row: {locale: string; value: string}) => [
              row.locale as Locale,
              row.value
            ]) ?? []
          )
        }));
        setIsAdmin(true);
      } catch {
        // The editor remains invisible when auth or Supabase is unavailable.
      }
    }

    void loadEditor();
    return () => {
      active = false;
    };
  }, [contentKey, editMode, page, section]);

  if (!editMode || !isAdmin) return null;

  return (
    <VisualEditModal
      page={page}
      section={section}
      contentKey={contentKey}
      values={values}
      offset={offset}
    />
  );
}
