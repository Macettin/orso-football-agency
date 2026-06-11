import {createClient} from '@supabase/supabase-js';
import {unstable_noStore as noStore} from 'next/cache';
import {transfers as fallbackTransfers} from '@/lib/data';
import {getSupabaseConfig, isSupabaseConfigured} from '@/src/lib/supabase/config';

export type TransferDeal = {
  id?: string;
  player_name: string;
  player_photo_url: string | null;
  from_club: string;
  to_club: string;
  country: string;
  season: string;
  transfer_type: string;
  announcement_url: string | null;
  image_url: string | null;
  display_order: number;
  is_top_deal: boolean;
};

function client() {
  const {url, key} = getSupabaseConfig();
  return createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false}});
}

function fallback(): TransferDeal[] {
  return fallbackTransfers.map((item, index) => ({
    player_name: item.player,
    player_photo_url: null,
    from_club: item.from,
    to_club: item.to,
    country: '',
    season: item.season,
    transfer_type: item.type,
    announcement_url: null,
    image_url: null,
    display_order: index,
    is_top_deal: index < 2
  }));
}

export async function getPublishedTransfers(options?: {topOnly?: boolean; preferTop?: boolean; limit?: number}) {
  noStore();
  if (!isSupabaseConfigured()) {
    const rows = options?.topOnly ? fallback().filter((item) => item.is_top_deal) : fallback();
    return rows.slice(0, options?.limit);
  }
  const query = client()
    .from('transfers')
    .select('id,player_name,player_photo_url,from_club,to_club,country,season,transfer_type,announcement_url,image_url,display_order,is_top_deal')
    .eq('is_published', true)
    .order('season', {ascending: false})
    .order('display_order', {ascending: true});
  const {data, error} = await query;
  if (error) return [];
  const rows = (data ?? []) as TransferDeal[];
  const selected = options?.topOnly
    ? rows.filter((item) => item.is_top_deal)
    : options?.preferTop && rows.some((item) => item.is_top_deal)
      ? rows.filter((item) => item.is_top_deal)
      : rows;
  return selected.slice(0, options?.limit);
}
