import type {Locale} from '@/i18n/routing';
import {unstable_noStore as noStore} from 'next/cache';
import {createClient as createSupabaseClient} from '@supabase/supabase-js';
import {players as fallbackPlayers, type Player} from '@/lib/data';
import {getSupabaseConfig, isSupabaseConfigured} from '@/src/lib/supabase/config';
import {playerSlug} from '@/lib/slug';
import {buildYouTubeEmbedUrl} from '@/lib/youtube';

type PlayerRow = {
  id: string;
  name: string;
  slug: string;
  position: string;
  nationality: string;
  age: number | null;
  current_club: string;
  height: string;
  preferred_foot: string;
  contract_status: string;
  photo_url: string | null;
  transfermarkt_url: string | null;
  video_url: string | null;
  is_featured: boolean;
  is_published: boolean;
};

type PlayerTranslationRow = {
  locale: Locale;
  short_bio: string | null;
  strengths: string | null;
  career_summary: string | null;
};

export type PlayerCareerEntry = {
  id?: string;
  season: string;
  club: string;
  country: string;
  appearances: number | null;
  goals: number | null;
  assists: number | null;
  displayOrder: number;
};

export type PlayerVideo = {
  id: string;
  title: string;
  youtubeUrl: string;
  embedUrl: string;
  displayOrder: number;
};

export type PlayerProfile = Player & {
  shortBio: string;
  careerSummary: string;
  localizedStrengths: string[];
  careerEntries: PlayerCareerEntry[];
  videos: PlayerVideo[];
};

const locales: Locale[] = ['en', 'tr', 'ru', 'ar'];

function createPublicClient() {
  const {url, key} = getSupabaseConfig();
  return createSupabaseClient(url, key, {
    auth: {persistSession: false, autoRefreshToken: false}
  });
}

function localized(value: string) {
  return Object.fromEntries(locales.map((locale) => [locale, value])) as Record<Locale, string>;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function normalizePlayer(row: PlayerRow): Player {
  return {
    id: row.id,
    slug: playerSlug(row.slug, row.name),
    name: row.name,
    initials: initials(row.name),
    position: localized(row.position),
    nationality: localized(row.nationality),
    age: row.age ?? 0,
    club: row.current_club,
    height: row.height,
    foot: localized(row.preferred_foot),
    contract: localized(row.contract_status),
    bio: localized(
      `${row.name} is represented by Orso Football Agency with an international career development strategy.`
    ),
    strengths: [
      localized('Professional profile'),
      localized('International potential'),
      localized('Career development'),
      localized('Dedicated representation')
    ],
    career: row.current_club
      ? [{
          years: 'Current',
          club: row.current_club,
          detail: localized('Current club')
        }]
      : [],
    tone: 'from-blue-500/35 via-blue-950 to-slate-950',
    photoUrl: row.photo_url,
    transfermarktUrl: row.transfermarkt_url,
    videoUrl: row.video_url,
    isFeatured: row.is_featured,
    isPublished: row.is_published
  };
}

function parseStrengths(value: string | null) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()));
    }
  } catch {
    // Plain text values are stored one strength per line.
  }

  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function fallbackProfile(player: Player, locale: Locale): PlayerProfile {
  return {
    ...player,
    shortBio: player.bio[locale] || player.bio.en || '',
    careerSummary: '',
    localizedStrengths: player.strengths
      .map((strength) => strength[locale] || strength.en || '')
      .filter(Boolean),
    careerEntries: player.career.map((item, index) => ({
      season: item.years,
      club: item.club,
      country: item.detail[locale] || item.detail.en || '',
      appearances: null,
      goals: null,
      assists: null,
      displayOrder: index
    })),
    videos: []
  };
}

async function fetchPlayers(featuredOnly = false) {
  noStore();
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('players')
      .select(
        'id,name,slug,position,nationality,age,current_club,height,preferred_foot,contract_status,photo_url,transfermarkt_url,video_url,is_featured,is_published'
      )
      .eq('is_published', true)
      .order('created_at', {ascending: false});

    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }

    const {data, error} = await query;
    if (error) return null;
    return (data as PlayerRow[]).map(normalizePlayer);
  } catch {
    return null;
  }
}

export async function getPublicPlayers() {
  const databasePlayers = await fetchPlayers();
  return databasePlayers?.length ? databasePlayers : fallbackPlayers;
}

export async function getFeaturedPlayers(limit = 3) {
  const [databasePlayers, featuredPlayers] = await Promise.all([
    fetchPlayers(),
    fetchPlayers(true)
  ]);

  if (!databasePlayers?.length) return fallbackPlayers.slice(0, limit);
  return (featuredPlayers ?? []).slice(0, limit);
}

export async function getPublicPlayer(slug: string, locale: Locale): Promise<PlayerProfile | null> {
  noStore();
  const safeSlug = playerSlug(slug, slug);
  const fixture = fallbackPlayers.find((player) => playerSlug(player.slug, player.name) === safeSlug);

  if (!isSupabaseConfigured()) {
    return fixture ? fallbackProfile(fixture, locale) : null;
  }

  try {
    const supabase = createPublicClient();
    const {data: exactRow, error} = await supabase
      .from('players')
      .select(
        'id,name,slug,position,nationality,age,current_club,height,preferred_foot,contract_status,photo_url,transfermarkt_url,video_url,is_featured,is_published'
      )
      .eq('slug', safeSlug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      return fixture ? fallbackProfile(fixture, locale) : null;
    }

    let row = exactRow as PlayerRow | null;
    if (!row) {
      const {data: candidates, error: candidatesError} = await supabase
        .from('players')
        .select(
          'id,name,slug,position,nationality,age,current_club,height,preferred_foot,contract_status,photo_url,transfermarkt_url,video_url,is_featured,is_published'
        )
        .eq('is_published', true);

      if (candidatesError) {
        return fixture ? fallbackProfile(fixture, locale) : null;
      }

      row = ((candidates ?? []) as PlayerRow[]).find(
        (candidate) => playerSlug(candidate.slug, candidate.name) === safeSlug
      ) ?? null;
    }

    if (!row) return fixture ? fallbackProfile(fixture, locale) : null;

    const player = normalizePlayer(row as PlayerRow);
    const [{data: translations}, {data: careerEntries}, {data: videos}] = await Promise.all([
      supabase
        .from('player_translations')
        .select('locale,short_bio,strengths,career_summary')
        .eq('player_id', row.id)
        .in('locale', locale === 'en' ? ['en'] : [locale, 'en']),
      supabase
        .from('player_career_entries')
        .select('id,season,club,country,appearances,goals,assists,display_order')
        .eq('player_id', row.id)
        .order('display_order', {ascending: true})
        .order('created_at', {ascending: true}),
      supabase
        .from('player_videos')
        .select('id,title,youtube_url,display_order')
        .eq('player_id', row.id)
        .eq('is_published', true)
        .order('display_order', {ascending: true})
        .order('created_at', {ascending: true})
    ]);

    const translationRows = (translations ?? []) as PlayerTranslationRow[];
    const translation =
      translationRows.find((item) => item.locale === locale) ??
      translationRows.find((item) => item.locale === 'en');

    return {
      ...player,
      shortBio: translation?.short_bio?.trim() ?? '',
      careerSummary: translation?.career_summary?.trim() ?? '',
      localizedStrengths: parseStrengths(translation?.strengths ?? null),
      careerEntries: (careerEntries ?? []).map((entry) => ({
        id: entry.id,
        season: entry.season,
        club: entry.club,
        country: entry.country,
        appearances: entry.appearances,
        goals: entry.goals,
        assists: entry.assists,
        displayOrder: entry.display_order
      })),
      videos: (videos ?? []).flatMap((video) => {
        const embedUrl = buildYouTubeEmbedUrl(video.youtube_url);
        return embedUrl ? [{
          id: video.id,
          title: video.title,
          youtubeUrl: video.youtube_url,
          embedUrl,
          displayOrder: video.display_order
        }] : [];
      })
    };
  } catch {
    return fixture ? fallbackProfile(fixture, locale) : null;
  }
}
