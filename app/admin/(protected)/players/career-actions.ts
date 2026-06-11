'use server';

import {revalidatePath} from 'next/cache';
import {requireAdmin} from '@/src/lib/supabase/admin';

export type CareerActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  requestId: string;
};

export const initialCareerActionState: CareerActionState = {
  status: 'idle',
  message: '',
  requestId: ''
};

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function optionalNumber(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) return null;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) {
    throw new Error(`${key.replace('_', ' ')} must be a positive whole number.`);
  }
  return number;
}

function values(formData: FormData) {
  return {
    season: text(formData, 'season'),
    club: text(formData, 'club'),
    country: text(formData, 'country'),
    appearances: optionalNumber(formData, 'appearances'),
    goals: optionalNumber(formData, 'goals'),
    assists: optionalNumber(formData, 'assists'),
    display_order: optionalNumber(formData, 'display_order') ?? 0
  };
}

function result(status: 'success' | 'error', message: string): CareerActionState {
  return {status, message, requestId: crypto.randomUUID()};
}

function errorResult(error: unknown) {
  const message =
    typeof (error as {message?: string})?.message === 'string'
      ? (error as {message: string}).message
      : 'An unexpected error occurred.';
  return result('error', message);
}

function revalidateCareer(slug: string) {
  revalidatePath('/admin/players');
  for (const locale of ['en', 'tr', 'ru', 'ar']) {
    revalidatePath(`/${locale}/players/${slug}`);
  }
}

export async function createCareerEntry(
  _previousState: CareerActionState,
  formData: FormData
): Promise<CareerActionState> {
  const {supabase} = await requireAdmin();
  const playerId = text(formData, 'player_id');
  const slug = text(formData, 'player_slug');

  try {
    const entry = values(formData);
    if (!playerId || !slug || !entry.season || !entry.club) {
      throw new Error('Season and club are required.');
    }

    const {error} = await supabase
      .from('player_career_entries')
      .insert({...entry, player_id: playerId});
    if (error) throw error;

    revalidateCareer(slug);
    return result('success', 'Career entry added successfully.');
  } catch (error) {
    return errorResult(error);
  }
}

export async function updateCareerEntry(
  _previousState: CareerActionState,
  formData: FormData
): Promise<CareerActionState> {
  const {supabase} = await requireAdmin();
  const id = text(formData, 'id');
  const playerId = text(formData, 'player_id');
  const slug = text(formData, 'player_slug');

  try {
    const entry = values(formData);
    if (!id || !playerId || !slug || !entry.season || !entry.club) {
      throw new Error('Season and club are required.');
    }

    const {error} = await supabase
      .from('player_career_entries')
      .update(entry)
      .eq('id', id)
      .eq('player_id', playerId);
    if (error) throw error;

    revalidateCareer(slug);
    return result('success', 'Career entry updated successfully.');
  } catch (error) {
    return errorResult(error);
  }
}

export async function deleteCareerEntry(
  _previousState: CareerActionState,
  formData: FormData
): Promise<CareerActionState> {
  const {supabase} = await requireAdmin();
  const id = text(formData, 'id');
  const playerId = text(formData, 'player_id');
  const slug = text(formData, 'player_slug');

  try {
    if (!id || !playerId || !slug) throw new Error('Career entry is missing.');

    const {error} = await supabase
      .from('player_career_entries')
      .delete()
      .eq('id', id)
      .eq('player_id', playerId);
    if (error) throw error;

    revalidateCareer(slug);
    return result('success', 'Career entry deleted successfully.');
  } catch (error) {
    return errorResult(error);
  }
}
