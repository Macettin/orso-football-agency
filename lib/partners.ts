import {unstable_noStore as noStore} from 'next/cache';
import {createClient} from '@/src/lib/supabase/server';
import {isSupabaseConfigured} from '@/src/lib/supabase/config';

export type Partner = {
  id: string;
  name: string;
  website_url: string | null;
  logo_url: string | null;
  description: string | null;
  display_order: number;
  is_published: boolean;
};

export async function getPublishedPartners() {
  noStore();
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const {data, error} = await supabase
      .from('partners')
      .select('id,name,website_url,logo_url,description,display_order,is_published')
      .eq('is_published', true)
      .order('display_order', {ascending: true})
      .order('name', {ascending: true})
      .abortSignal(AbortSignal.timeout(4000));

    if (error) return [];
    return (data ?? []) as Partner[];
  } catch {
    return [];
  }
}
