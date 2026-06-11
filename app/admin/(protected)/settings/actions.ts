'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {
  DEFAULT_HERO_YOUTUBE_URL,
  getYouTubeVideoId
} from '@/lib/youtube';
import {requireAdmin} from '@/src/lib/supabase/admin';

function settingsUrl(result: string) {
  return `/admin/settings?result=${encodeURIComponent(result)}`;
}

export async function saveSettings(formData: FormData) {
  const youtubeUrl =
    String(formData.get('hero_youtube_url') ?? '').trim() ||
    DEFAULT_HERO_YOUTUBE_URL;
  const startTimeValue = Number(
    String(formData.get('hero_video_start_time') ?? '0')
  );
  const startTime =
    Number.isFinite(startTimeValue) && startTimeValue >= 0
      ? Math.floor(startTimeValue)
      : 0;
  const enabled = formData.get('hero_video_enabled') === 'on';

  if (!getYouTubeVideoId(youtubeUrl)) {
    redirect(settingsUrl('invalid-youtube-url'));
  }

  const {supabase} = await requireAdmin();
  const {error} = await supabase.from('site_settings').upsert(
    [
      {setting_key: 'hero_youtube_url', setting_value: youtubeUrl},
      {
        setting_key: 'hero_video_start_time',
        setting_value: String(startTime)
      },
      {
        setting_key: 'hero_video_enabled',
        setting_value: String(enabled)
      }
    ],
    {onConflict: 'setting_key'}
  );

  if (error) redirect(settingsUrl(error.message));

  for (const locale of routing.locales) {
    revalidatePath(`/${locale}`);
  }
  revalidatePath('/admin/settings');
  redirect(settingsUrl('saved'));
}
