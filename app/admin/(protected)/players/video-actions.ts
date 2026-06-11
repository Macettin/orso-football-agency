'use server';

import {revalidatePath} from 'next/cache';
import {getYouTubeVideoId} from '@/lib/youtube';
import {requireAdmin} from '@/src/lib/supabase/admin';

export type VideoActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  requestId: string;
};

export const initialVideoActionState: VideoActionState = {
  status: 'idle',
  message: '',
  requestId: ''
};

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function displayOrder(formData: FormData) {
  const value = Number(text(formData, 'display_order') || 0);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('Display order must be a positive whole number.');
  }
  return value;
}

function values(formData: FormData) {
  const youtubeUrl = text(formData, 'youtube_url');
  if (!getYouTubeVideoId(youtubeUrl)) {
    throw new Error('Enter a valid YouTube watch, youtu.be or Shorts URL.');
  }

  return {
    title: text(formData, 'title'),
    youtube_url: youtubeUrl,
    display_order: displayOrder(formData),
    is_published: formData.get('is_published') === 'on'
  };
}

function result(status: 'success' | 'error', message: string): VideoActionState {
  return {status, message, requestId: crypto.randomUUID()};
}

function errorResult(error: unknown) {
  const message =
    typeof (error as {message?: string})?.message === 'string'
      ? (error as {message: string}).message
      : 'An unexpected error occurred.';
  return result('error', message);
}

function revalidateVideos(slug: string) {
  revalidatePath('/admin/players');
  for (const locale of ['en', 'tr', 'ru', 'ar']) {
    revalidatePath(`/${locale}/players/${slug}`);
  }
}

export async function createPlayerVideo(
  _previousState: VideoActionState,
  formData: FormData
): Promise<VideoActionState> {
  const {supabase} = await requireAdmin();
  const playerId = text(formData, 'player_id');
  const slug = text(formData, 'player_slug');

  try {
    const video = values(formData);
    if (!playerId || !slug || !video.title) {
      throw new Error('Video title and YouTube URL are required.');
    }

    const {error} = await supabase
      .from('player_videos')
      .insert({...video, player_id: playerId});
    if (error) throw error;

    revalidateVideos(slug);
    return result('success', 'Video added successfully.');
  } catch (error) {
    return errorResult(error);
  }
}

export async function updatePlayerVideo(
  _previousState: VideoActionState,
  formData: FormData
): Promise<VideoActionState> {
  const {supabase} = await requireAdmin();
  const id = text(formData, 'id');
  const playerId = text(formData, 'player_id');
  const slug = text(formData, 'player_slug');

  try {
    const video = values(formData);
    if (!id || !playerId || !slug || !video.title) {
      throw new Error('Video title and YouTube URL are required.');
    }

    const {error} = await supabase
      .from('player_videos')
      .update(video)
      .eq('id', id)
      .eq('player_id', playerId);
    if (error) throw error;

    revalidateVideos(slug);
    return result('success', 'Video updated successfully.');
  } catch (error) {
    return errorResult(error);
  }
}

export async function deletePlayerVideo(
  _previousState: VideoActionState,
  formData: FormData
): Promise<VideoActionState> {
  const {supabase} = await requireAdmin();
  const id = text(formData, 'id');
  const playerId = text(formData, 'player_id');
  const slug = text(formData, 'player_slug');

  try {
    if (!id || !playerId || !slug) throw new Error('Video record is missing.');

    const {error} = await supabase
      .from('player_videos')
      .delete()
      .eq('id', id)
      .eq('player_id', playerId);
    if (error) throw error;

    revalidateVideos(slug);
    return result('success', 'Video deleted successfully.');
  } catch (error) {
    return errorResult(error);
  }
}
