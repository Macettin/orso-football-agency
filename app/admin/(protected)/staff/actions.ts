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
  return `/admin/staff?result=${encodeURIComponent(result)}`;
}

function values(formData: FormData, photoUrl: string | null) {
  return {
    name: text(formData, 'name'),
    slug: text(formData, 'slug').toLowerCase(),
    role: text(formData, 'role'),
    email: optional(formData, 'email'),
    phone: optional(formData, 'phone'),
    photo_url: photoUrl,
    linkedin_url: optional(formData, 'linkedin_url'),
    instagram_url: optional(formData, 'instagram_url'),
    display_order: Math.max(0, Number(text(formData, 'display_order')) || 0),
    is_published: formData.get('is_published') === 'on'
  };
}

function revalidateStaff() {
  for (const locale of ['en', 'tr', 'ru', 'ar']) {
    revalidatePath(`/${locale}/about`);
  }
  revalidatePath('/admin/staff');
}

export async function createStaffMember(formData: FormData) {
  const {supabase} = await requireAdmin();
  try {
    const photoUrl = await uploadPublicImage(supabase, 'staff', 'photos', formData.get('photo'));
    const row = values(formData, photoUrl);
    if (!row.name || !row.slug || !row.role) throw new Error('Name, slug and role are required.');
    const {error} = await supabase.from('staff_members').insert(row);
    if (error) throw error;
  } catch (error) {
    redirect(resultUrl(error instanceof Error ? error.message : 'create-error'));
  }
  revalidateStaff();
  redirect(resultUrl('created'));
}

export async function updateStaffMember(formData: FormData) {
  const {supabase} = await requireAdmin();
  const id = text(formData, 'id');
  try {
    const uploaded = await uploadPublicImage(supabase, 'staff', 'photos', formData.get('photo'));
    const row = values(formData, uploaded ?? optional(formData, 'current_photo_url'));
    if (!id || !row.name || !row.slug || !row.role) throw new Error('Name, slug and role are required.');
    const {error} = await supabase.from('staff_members').update(row).eq('id', id);
    if (error) throw error;
  } catch (error) {
    redirect(resultUrl(error instanceof Error ? error.message : 'update-error'));
  }
  revalidateStaff();
  redirect(resultUrl('updated'));
}

export async function deleteStaffMember(formData: FormData) {
  const {supabase} = await requireAdmin();
  const id = text(formData, 'id');
  if (!id) redirect(resultUrl('missing-record'));
  const {error} = await supabase.from('staff_members').delete().eq('id', id);
  if (error) redirect(resultUrl(error.message));
  revalidateStaff();
  redirect(resultUrl('deleted'));
}
