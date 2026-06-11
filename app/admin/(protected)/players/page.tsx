import {Pencil, Plus, UserRound} from 'lucide-react';
import {requireAdmin} from '@/src/lib/supabase/admin';
import {
  CreatePlayerForm,
  DeletePlayerForm,
  EditPlayerForm,
  PlayerPageMessage
} from './player-actions';
import {CareerManager, type CareerEntryFormValue} from './career-manager';
import {VideoManager, type PlayerVideoFormValue} from './video-manager';
import type {PlayerTranslationFormValue} from './player-actions';
import {playerSlug} from '@/lib/slug';

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

type TranslationRow = PlayerTranslationFormValue & {
  player_id: string;
};

type CareerRow = CareerEntryFormValue & {
  player_id: string;
};

type VideoRow = PlayerVideoFormValue & {
  player_id: string;
};

export default async function AdminPlayersPage({
  searchParams
}: {
  searchParams: Promise<{result?: string}>;
}) {
  const query = await searchParams;
  const {supabase} = await requireAdmin();
  const [
    {data: playerData, error: playerError},
    {data: translationData, error: translationError},
    {data: careerData, error: careerError},
    {data: videoData, error: videoError}
  ] = await Promise.all([
    supabase.from('players').select('*').order('created_at', {ascending: false}),
    supabase
      .from('player_translations')
      .select('player_id,locale,short_bio,strengths,career_summary'),
    supabase
      .from('player_career_entries')
      .select('id,player_id,season,club,country,appearances,goals,assists,display_order')
      .order('display_order', {ascending: true})
      .order('created_at', {ascending: true}),
    supabase
      .from('player_videos')
      .select('id,player_id,title,youtube_url,display_order,is_published')
      .order('display_order', {ascending: true})
      .order('created_at', {ascending: true})
  ]);
  const players = (playerData ?? []) as PlayerRow[];
  const translations = (translationData ?? []) as TranslationRow[];
  const careerEntries = (careerData ?? []) as CareerRow[];
  const videos = (videoData ?? []) as VideoRow[];
  const pageError = playerError ?? translationError ?? careerError ?? videoError;

  return (
    <>
      <div className="max-w-3xl">
        <div className="eyebrow">Player database</div>
        <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">
          Manage players
        </h1>
        <p className="mt-4 text-lg leading-8 text-mist">
          Publish profiles, feature selected players and upload photos to Supabase Storage.
        </p>
      </div>

      <PlayerPageMessage result={query.result ?? pageError?.message} />

      <details className="mt-10 border border-accent/40 bg-panel" open={!players.length}>
        <summary className="flex cursor-pointer items-center gap-3 p-5 font-display text-xl font-semibold text-white sm:p-6">
          <Plus className="h-5 w-5 text-blue-400" /> Add player
        </summary>
        <CreatePlayerForm />
      </details>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold text-white">Player profiles</h2>
          <span className="text-sm text-slate-500">{players.length} records</span>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {players.map((player) => (
            <article key={player.id} className="overflow-hidden border border-line bg-panel">
              <div className="grid grid-cols-[130px_1fr]">
                {player.photo_url ? (
                  <div
                    className="min-h-40 bg-slate-900 bg-cover bg-center"
                    style={{backgroundImage: `url("${player.photo_url}")`}}
                    role="img"
                    aria-label={player.name}
                  />
                ) : (
                  <div className="flex min-h-40 items-center justify-center bg-blue-950/40">
                    <UserRound className="h-10 w-10 text-blue-400" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{player.is_published ? 'Published' : 'Draft'}</Badge>
                    {player.is_featured ? <Badge>Featured</Badge> : null}
                  </div>
                  <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Public card preview
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white">{player.name}</h3>
                  <p className="mt-1 text-sm text-blue-300">{player.position}</p>
                  <p className="mt-3 text-sm text-mist">{player.current_club || 'No current club'}</p>
                </div>
              </div>
              <details className="border-t border-line">
                <summary className="flex cursor-pointer items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider text-blue-300">
                  <Pencil className="h-4 w-4" /> Edit player
                </summary>
                <EditPlayerForm
                  player={player}
                  translations={translations.filter((item) => item.player_id === player.id)}
                />
                <CareerManager
                  playerId={player.id}
                  playerSlug={playerSlug(player.slug, player.name)}
                  entries={careerEntries.filter((item) => item.player_id === player.id)}
                />
                <VideoManager
                  playerId={player.id}
                  playerSlug={playerSlug(player.slug, player.name)}
                  videos={videos.filter((item) => item.player_id === player.id)}
                />
                <DeletePlayerForm id={player.id} />
              </details>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Badge({children}: {children: React.ReactNode}) {
  return <span className="bg-blue-950/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">{children}</span>;
}
