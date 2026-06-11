import {unstable_noStore as noStore} from 'next/cache';
import {createClient} from '@/src/lib/supabase/server';
import {isSupabaseConfigured} from '@/src/lib/supabase/config';
import {
  buildHeroEmbedUrl,
  DEFAULT_HERO_YOUTUBE_URL
} from '@/lib/youtube';

export type HeroVideoSettings = {
  youtubeUrl: string;
  startTime: number;
  enabled: boolean;
  embedUrl: string | null;
};

type SettingRow = {
  setting_key: string;
  setting_value: string;
};

export async function getHeroVideoSettings(): Promise<HeroVideoSettings> {
  noStore();
  const fallback = {
    youtubeUrl: DEFAULT_HERO_YOUTUBE_URL,
    startTime: 0,
    enabled: true
  };

  if (!isSupabaseConfigured()) {
    return {...fallback, embedUrl: buildHeroEmbedUrl(fallback.youtubeUrl, 0)};
  }

  try {
    const supabase = await createClient();
    const {data, error} = await supabase
      .from('site_settings')
      .select('setting_key,setting_value')
      .in('setting_key', [
        'hero_youtube_url',
        'hero_video_start_time',
        'hero_video_enabled'
      ])
      .abortSignal(AbortSignal.timeout(4000));

    if (error) {
      return {...fallback, embedUrl: buildHeroEmbedUrl(fallback.youtubeUrl, 0)};
    }

    const settings = new Map(
      (data as SettingRow[]).map((row) => [row.setting_key, row.setting_value])
    );
    const youtubeUrl = settings.get('hero_youtube_url') || fallback.youtubeUrl;
    const parsedStartTime = Number(settings.get('hero_video_start_time') ?? 0);
    const startTime =
      Number.isFinite(parsedStartTime) && parsedStartTime > 0
        ? Math.floor(parsedStartTime)
        : 0;
    const enabled =
      (settings.get('hero_video_enabled') ?? 'true').toLowerCase() === 'true';

    return {
      youtubeUrl,
      startTime,
      enabled,
      embedUrl: enabled ? buildHeroEmbedUrl(youtubeUrl, startTime) : null
    };
  } catch {
    return {...fallback, embedUrl: buildHeroEmbedUrl(fallback.youtubeUrl, 0)};
  }
}
