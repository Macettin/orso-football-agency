'use server';

import {revalidatePath} from 'next/cache';
import {playerSlug} from '@/lib/slug';
import {requireAdmin} from '@/src/lib/supabase/admin';

const PLAYER_BUCKET = 'players';
const PLAYER_LOCALES = ['en', 'tr', 'ru', 'ar'] as const;

export type PlayerActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  result?: 'created' | 'updated' | 'deleted';
  requestId: string;
};

export const initialPlayerActionState: PlayerActionState = {
  status: 'idle',
  message: '',
  requestId: ''
};

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function optionalText(formData: FormData, key: string) {
  return text(formData, key) || null;
}

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
}

function actionError(error: unknown): PlayerActionState {
  const candidate = error as {code?: string; message?: string};
  const message =
    typeof candidate?.message === 'string' && candidate.message
      ? candidate.message
      : error instanceof Error
        ? error.message
        : 'An unexpected error occurred.';
  const duplicateSlug =
    candidate?.code === '23505' ||
    (/duplicate key/i.test(message) && /slug/i.test(message));

  return {
    status: 'error',
    message: duplicateSlug
      ? 'A player with this slug already exists. Please use a different slug.'
      : message,
    requestId: crypto.randomUUID()
  };
}

function success(
  result: 'created' | 'updated' | 'deleted',
  message: string
): PlayerActionState {
  return {
    status: 'success',
    result,
    message,
    requestId: crypto.randomUUID()
  };
}

async function uploadPhoto(
  supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase'],
  formData: FormData
) {
  const file = formData.get('photo');
  if (!(file instanceof File) || file.size === 0) return null;
  if (!file.type.startsWith('image/')) throw new Error('Only image files are allowed.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Images must be smaller than 10 MB.');

  const path = `photos/${crypto.randomUUID()}-${safeFileName(file.name) || 'photo'}`;
  const {error} = await supabase.storage.from(PLAYER_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false
  });

  if (error) throw error;
  return supabase.storage.from(PLAYER_BUCKET).getPublicUrl(path).data.publicUrl;
}

function playerValues(formData: FormData, photoUrl: string | null, slug: string) {
  const ageValue = text(formData, 'age');

  return {
    name: text(formData, 'name'),
    slug,
    position: text(formData, 'position'),
    nationality: text(formData, 'nationality'),
    age: ageValue ? Number(ageValue) : null,
    current_club: text(formData, 'current_club'),
    height: text(formData, 'height'),
    preferred_foot: text(formData, 'preferred_foot'),
    contract_status: text(formData, 'contract_status'),
    photo_url: photoUrl,
    transfermarkt_url: optionalText(formData, 'transfermarkt_url'),
    video_url: optionalText(formData, 'video_url'),
    is_featured: formData.get('is_featured') === 'on',
    is_published: formData.get('is_published') === 'on'
  };
}

function translationValues(formData: FormData, playerId: string) {
  return PLAYER_LOCALES.map((locale) => ({
    player_id: playerId,
    locale,
    short_bio: text(formData, `${locale}_short_bio`),
    strengths: text(formData, `${locale}_strengths`),
    career_summary: text(formData, `${locale}_career_summary`)
  }));
}

async function saveTranslations(
  supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase'],
  formData: FormData,
  playerId: string
) {
  const {error} = await supabase
    .from('player_translations')
    .upsert(translationValues(formData, playerId), {
      onConflict: 'player_id,locale'
    });
  if (error) throw error;
}

function revalidatePlayers(slug?: string) {
  for (const locale of ['en', 'tr', 'ru', 'ar']) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/players`);
    if (slug) revalidatePath(`/${locale}/players/${slug}`);
  }
  revalidatePath('/admin/players');
}

export async function createPlayer(
  _previousState: PlayerActionState,
  formData: FormData
): Promise<PlayerActionState> {
  const {supabase} = await requireAdmin();

  try {
    const name = text(formData, 'name');
    const slug = playerSlug(text(formData, 'slug'), name);
    if (!name) {
      throw new Error('Name is required.');
    }
    if (!slug) {
      throw new Error('Please enter a URL-safe slug for this player.');
    }

    const {data: existing, error: lookupError} = await supabase
      .from('players')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) {
      return actionError({
        code: '23505',
        message: 'duplicate key value violates unique constraint players_slug_key'
      });
    }

    const photoUrl = await uploadPhoto(supabase, formData);
    const {data: created, error} = await supabase
      .from('players')
      .insert(playerValues(formData, photoUrl, slug))
      .select('id')
      .single();
    if (error) throw error;

    try {
      await saveTranslations(supabase, formData, created.id);
    } catch (translationError) {
      await supabase.from('players').delete().eq('id', created.id);
      throw translationError;
    }

    revalidatePlayers(slug);
    return success('created', 'Player created successfully');
  } catch (error) {
    return actionError(error);
  }
}

export async function updatePlayer(
  _previousState: PlayerActionState,
  formData: FormData
): Promise<PlayerActionState> {
  const {supabase} = await requireAdmin();
  const id = text(formData, 'id');
  const currentPhotoUrl = optionalText(formData, 'current_photo_url');

  try {
    const name = text(formData, 'name');
    const slug = playerSlug(text(formData, 'slug'), name);
    if (!id || !name) {
      throw new Error('Name is required.');
    }
    if (!slug) {
      throw new Error('Please enter a URL-safe slug for this player.');
    }

    const {data: existing, error: lookupError} = await supabase
      .from('players')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) {
      return actionError({
        code: '23505',
        message: 'duplicate key value violates unique constraint players_slug_key'
      });
    }

    const uploadedPhoto = await uploadPhoto(supabase, formData);
    const values = playerValues(formData, uploadedPhoto ?? currentPhotoUrl, slug);
    const {error} = await supabase.from('players').update(values).eq('id', id);
    if (error) throw error;
    await saveTranslations(supabase, formData, id);

    revalidatePlayers(slug);
    return success('updated', 'Player updated successfully');
  } catch (error) {
    return actionError(error);
  }
}

export async function deletePlayer(
  _previousState: PlayerActionState,
  formData: FormData
): Promise<PlayerActionState> {
  const {supabase} = await requireAdmin();
  const id = text(formData, 'id');

  try {
    if (!id) throw new Error('Player record is missing.');
    const {error} = await supabase.from('players').delete().eq('id', id);
    if (error) throw error;

    revalidatePlayers();
    return success('deleted', 'Player deleted successfully');
  } catch (error) {
    return actionError(error);
  }
}
