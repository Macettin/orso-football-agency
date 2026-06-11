import {ExternalLink, Save, Settings2, Video} from 'lucide-react';
import {
  buildHeroEmbedUrl,
  DEFAULT_HERO_YOUTUBE_URL
} from '@/lib/youtube';
import {requireAdmin} from '@/src/lib/supabase/admin';
import {saveSettings} from './actions';

type SettingRow = {
  setting_key: string;
  setting_value: string;
};

export default async function AdminSettingsPage({
  searchParams
}: {
  searchParams: Promise<{result?: string}>;
}) {
  const query = await searchParams;
  const {supabase} = await requireAdmin();
  const {data, error} = await supabase
    .from('site_settings')
    .select('setting_key,setting_value')
    .in('setting_key', [
      'hero_youtube_url',
      'hero_video_start_time',
      'hero_video_enabled'
    ]);
  const settings = new Map(
    ((data ?? []) as SettingRow[]).map((row) => [
      row.setting_key,
      row.setting_value
    ])
  );
  const youtubeUrl =
    settings.get('hero_youtube_url') || DEFAULT_HERO_YOUTUBE_URL;
  const startTime = settings.get('hero_video_start_time') || '0';
  const enabled =
    (settings.get('hero_video_enabled') ?? 'true').toLowerCase() === 'true';
  const previewUrl = buildHeroEmbedUrl(youtubeUrl, Number(startTime) || 0);

  return (
    <>
      <div className="max-w-3xl">
        <div className="eyebrow">Website configuration</div>
        <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">
          Homepage video
        </h1>
        <p className="mt-4 text-lg leading-8 text-mist">
          Change the hero YouTube source, choose its starting point or temporarily
          disable the video background.
        </p>
      </div>

      {query.result === 'saved' ? (
        <p className="mt-6 border-s-2 border-emerald-500 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Homepage video settings were saved successfully.
        </p>
      ) : null}
      {query.result && query.result !== 'saved' ? (
        <p className="mt-6 border-s-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {query.result === 'invalid-youtube-url'
            ? 'Enter a valid YouTube watch, share, Shorts or embed URL.'
            : decodeURIComponent(query.result)}
        </p>
      ) : null}
      {error ? (
        <p className="mt-6 border-s-2 border-amber-500 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          The site_settings table could not be read. Apply the latest Supabase
          migration before saving.
        </p>
      ) : null}

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_.85fr]">
        <form action={saveSettings} className="border border-line bg-panel">
          <div className="flex items-center gap-3 border-b border-line p-5 sm:p-6">
            <Settings2 className="h-6 w-6 text-blue-400" />
            <h2 className="font-display text-2xl font-semibold text-white">
              Hero background settings
            </h2>
          </div>
          <div className="space-y-6 p-5 sm:p-6">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                YouTube URL
              </span>
              <input
                name="hero_youtube_url"
                type="url"
                required
                defaultValue={youtubeUrl}
                placeholder={DEFAULT_HERO_YOUTUBE_URL}
                className="h-12 w-full border border-line bg-ink px-4 text-sm text-white outline-none focus:border-accent"
              />
              <span className="mt-2 block text-xs leading-5 text-slate-500">
                Watch, youtu.be, Shorts and embed links are supported.
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Start time in seconds
              </span>
              <input
                name="hero_video_start_time"
                type="number"
                min="0"
                step="1"
                defaultValue={startTime}
                className="h-12 w-full border border-line bg-ink px-4 text-sm text-white outline-none focus:border-accent"
              />
            </label>

            <label className="flex items-center gap-3 border border-line bg-ink/60 p-4 text-sm text-slate-200">
              <input
                name="hero_video_enabled"
                type="checkbox"
                defaultChecked={enabled}
                className="h-4 w-4 accent-blue-600"
              />
              Enable homepage background video
            </label>

            <button className="inline-flex h-11 items-center gap-2 bg-brand px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-accent">
              <Save className="h-4 w-4" /> Save settings
            </button>
          </div>
        </form>

        <aside className="overflow-hidden border border-line bg-panel">
          <div className="flex items-center gap-3 border-b border-line p-5">
            <Video className="h-5 w-5 text-blue-400" />
            <h2 className="font-display text-xl font-semibold text-white">
              Current source
            </h2>
          </div>
          <div className="p-5">
            <div className="aspect-video overflow-hidden bg-[#020817]">
              {enabled && previewUrl ? (
                <iframe
                  src={previewUrl}
                  title="Homepage video preview"
                  className="h-full w-full border-0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,rgba(11,75,211,.22),transparent_55%),#020817] text-sm text-slate-400">
                  Video background disabled
                </div>
              )}
            </div>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300"
            >
              Open on YouTube <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
