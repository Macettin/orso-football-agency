import {createClient} from '@supabase/supabase-js';
import {unstable_noStore as noStore} from 'next/cache';
import type {Locale} from '@/i18n/routing';
import {getFallbackMessages} from './catalog';
import {getSupabaseConfig, isSupabaseConfigured} from '@/src/lib/supabase/config';

type ContentRow = {
  page: string;
  content_key: string;
  value: string;
};

function setNestedValue(
  target: Record<string, unknown>,
  path: string,
  value: string
) {
  const parts = path.split('.');
  let current = target;

  for (const part of parts.slice(0, -1)) {
    const next = current[part];
    if (!next || typeof next !== 'object') {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }

  current[parts.at(-1)!] = value;
}

export async function getMessagesWithOverrides(locale: Locale) {
  noStore();
  const messages = getFallbackMessages(locale);

  if (!isSupabaseConfigured()) {
    return messages;
  }

  try {
    const {url, key} = getSupabaseConfig();
    const supabase = createClient(url, key, {
      auth: {persistSession: false, autoRefreshToken: false}
    });
    const {data, error} = await supabase
      .from('site_content')
      .select('page, content_key, value')
      .eq('locale', locale);

    if (error || !data) {
      return messages;
    }

    for (const row of data as ContentRow[]) {
      const page = messages[row.page];
      if (page && typeof page === 'object') {
        setNestedValue(page, row.content_key, row.value);
      }
    }
  } catch {
    return messages;
  }

  return messages;
}
