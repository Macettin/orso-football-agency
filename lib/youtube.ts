export const DEFAULT_HERO_YOUTUBE_URL =
  'https://www.youtube.com/watch?v=L3374C3OyrY';

function validVideoId(value: string | null | undefined) {
  return value && /^[a-zA-Z0-9_-]{11}$/.test(value) ? value : null;
}

export function getYouTubeVideoId(value: string) {
  const candidate = value.trim();
  if (validVideoId(candidate)) return candidate;

  try {
    const url = new URL(candidate);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return validVideoId(url.pathname.split('/').filter(Boolean)[0]);
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') return validVideoId(url.searchParams.get('v'));
      const parts = url.pathname.split('/').filter(Boolean);
      if (['embed', 'shorts', 'live'].includes(parts[0] ?? '')) {
        return validVideoId(parts[1]);
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function buildHeroEmbedUrl(youtubeUrl: string, startTime: number) {
  const videoId =
    getYouTubeVideoId(youtubeUrl) ??
    getYouTubeVideoId(DEFAULT_HERO_YOUTUBE_URL);

  if (!videoId) return null;

  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    controls: '0',
    loop: '1',
    playlist: videoId,
    playsinline: '1',
    modestbranding: '1',
    rel: '0'
  });

  if (startTime > 0) params.set('start', String(Math.floor(startTime)));
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function buildYouTubeEmbedUrl(youtubeUrl: string) {
  const videoId = getYouTubeVideoId(youtubeUrl);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}
