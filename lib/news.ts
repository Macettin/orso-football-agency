import {createClient} from '@supabase/supabase-js';
import {unstable_noStore as noStore} from 'next/cache';
import type {Locale} from '@/i18n/routing';
import {newsItems} from '@/lib/data';
import {getSupabaseConfig, isSupabaseConfigured} from '@/src/lib/supabase/config';
import {playerSlug} from '@/lib/slug';

export type NewsPost = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  published_at: string;
};

function client() {
  const {url, key} = getSupabaseConfig();
  return createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false}});
}

function fallback(locale: Locale): NewsPost[] {
  return newsItems.map((item, index) => ({
    slug: playerSlug(item.title.en, item.title.en),
    title: item.title[locale],
    excerpt: item.excerpt[locale],
    content: item.excerpt[locale],
    image_url: null,
    published_at: new Date(2026, 4 - index, 28 - index * 6).toISOString()
  }));
}

export async function getPublishedNews(locale: Locale, limit?: number) {
  noStore();
  if (!isSupabaseConfigured()) return fallback(locale).slice(0, limit);
  const {data, error} = await client()
    .from('news_posts')
    .select('id,slug,title,excerpt,content,image_url,published_at')
    .eq('is_published', true)
    .order('published_at', {ascending: false})
    .limit(limit ?? 100);
  if (error) return [];
  return (data ?? []) as NewsPost[];
}

export async function getPublishedNewsPost(slug: string, locale: Locale) {
  noStore();
  if (isSupabaseConfigured()) {
    const {data} = await client()
      .from('news_posts')
      .select('id,slug,title,excerpt,content,image_url,published_at')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();
    if (data) return data as NewsPost;
    return null;
  }
  return fallback(locale).find((item) => item.slug === slug) ?? null;
}
