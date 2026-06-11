'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {playerSlug} from '@/lib/slug';
import {requireAdmin} from '@/src/lib/supabase/admin';
import {uploadPublicImage} from '@/src/lib/supabase/media';

const text = (data: FormData, key: string) => String(data.get(key) ?? '').trim();
const optional = (data: FormData, key: string) => text(data, key) || null;
const resultUrl = (result: string) => `/admin/news?result=${encodeURIComponent(result)}`;

function values(data: FormData, imageUrl: string | null) {
  const title = text(data, 'title');
  const rawPublishedAt = text(data, 'published_at');
  const publishedAt = rawPublishedAt ? new Date(rawPublishedAt) : new Date();
  if (Number.isNaN(publishedAt.getTime())) throw new Error('Published date is invalid.');
  return {
    slug: playerSlug(text(data, 'slug'), title),
    title,
    excerpt: text(data, 'excerpt'),
    content: text(data, 'content'),
    image_url: imageUrl,
    published_at: publishedAt.toISOString(),
    is_published: data.get('is_published') === 'on'
  };
}

function refresh(slug?: string) {
  revalidatePath('/admin/news');
  for (const locale of ['en', 'tr', 'ru', 'ar']) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/news`);
    if (slug) revalidatePath(`/${locale}/news/${slug}`);
  }
}

export async function createNewsPost(data: FormData) {
  const {supabase} = await requireAdmin();
  try {
    const image = await uploadPublicImage(supabase, 'news', 'posts', data.get('image'));
    const row = values(data, image);
    if (!row.title || !row.slug) throw new Error('Title is required.');
    const {error} = await supabase.from('news_posts').insert(row);
    if (error) throw error;
    refresh(row.slug);
  } catch (error) {
    redirect(resultUrl(error instanceof Error ? error.message : 'Unable to create news post.'));
  }
  redirect(resultUrl('created'));
}

export async function updateNewsPost(data: FormData) {
  const {supabase} = await requireAdmin();
  const id = text(data, 'id');
  try {
    const image = await uploadPublicImage(supabase, 'news', 'posts', data.get('image'));
    const row = values(data, image ?? optional(data, 'current_image_url'));
    if (!id || !row.title || !row.slug) throw new Error('Title is required.');
    const {error} = await supabase.from('news_posts').update(row).eq('id', id);
    if (error) throw error;
    refresh(row.slug);
  } catch (error) {
    redirect(resultUrl(error instanceof Error ? error.message : 'Unable to update news post.'));
  }
  redirect(resultUrl('updated'));
}

export async function deleteNewsPost(data: FormData) {
  const {supabase} = await requireAdmin();
  const id = text(data, 'id');
  const {error} = await supabase.from('news_posts').delete().eq('id', id);
  if (error) redirect(resultUrl(error.message));
  refresh();
  redirect(resultUrl('deleted'));
}
