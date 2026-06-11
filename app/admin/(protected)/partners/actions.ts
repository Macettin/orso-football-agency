'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {requireAdmin} from '@/src/lib/supabase/admin';
import {uploadPublicImage} from '@/src/lib/supabase/media';

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function optional(formData: FormData, key: string) {
  return text(formData, key) || null;
}

function resultUrl(result: string) {
  return `/admin/partners?result=${encodeURIComponent(result)}`;
}

function values(formData: FormData, logoUrl: string | null) {
  return {
    name: text(formData, 'name'),
    website_url: optional(formData, 'website_url'),
    logo_url: logoUrl,
    description: optional(formData, 'description'),
    display_order: Math.max(0, Number(text(formData, 'display_order')) || 0),
    is_published: formData.get('is_published') === 'on'
  };
}

function revalidatePartners() {
  for (const locale of ['en', 'tr', 'ru', 'ar']) {
    revalidatePath(`/${locale}`);
  }
  revalidatePath('/admin/partners');
}

export async function createPartner(formData: FormData) {
  const {supabase} = await requireAdmin();
  try {
    const logoUrl = await uploadPublicImage(supabase, 'partners', 'logos', formData.get('logo'));
    const row = values(formData, logoUrl);
    if (!row.name) throw new Error('Partner name is required.');
    const {error} = await supabase.from('partners').insert(row);
    if (error) throw error;
  } catch (error) {
    redirect(resultUrl(error instanceof Error ? error.message : 'create-error'));
  }
  revalidatePartners();
  redirect(resultUrl('created'));
}

export async function updatePartner(formData: FormData) {
  const {supabase} = await requireAdmin();
  const id = text(formData, 'id');
  try {
    const uploaded = await uploadPublicImage(supabase, 'partners', 'logos', formData.get('logo'));
    const row = values(formData, uploaded ?? optional(formData, 'current_logo_url'));
    if (!id || !row.name) throw new Error('Partner name is required.');
    const {error} = await supabase.from('partners').update(row).eq('id', id);
    if (error) throw error;
  } catch (error) {
    redirect(resultUrl(error instanceof Error ? error.message : 'update-error'));
  }
  revalidatePartners();
  redirect(resultUrl('updated'));
}

export async function deletePartner(formData: FormData) {
  const {supabase} = await requireAdmin();
  const id = text(formData, 'id');
  if (!id) redirect(resultUrl('missing-record'));
  const {error} = await supabase.from('partners').delete().eq('id', id);
  if (error) redirect(resultUrl(error.message));
  revalidatePartners();
  redirect(resultUrl('deleted'));
}
