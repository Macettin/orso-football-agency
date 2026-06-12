'use client';

import {useActionState, useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Plus, Save, Trash2, Video} from 'lucide-react';
import {buildYouTubeEmbedUrl} from '@/lib/youtube';
import {
  createPlayerVideo,
  deletePlayerVideo,
  initialVideoActionState,
  updatePlayerVideo,
  type VideoActionState
} from './video-actions';

export type PlayerVideoFormValue = {
  id: string;
  title: string;
  youtube_url: string;
  display_order: number;
  is_published: boolean;
};

export function VideoManager({
  playerId,
  playerSlug,
  videos
}: {
  playerId: string;
  playerSlug: string;
  videos: PlayerVideoFormValue[];
}) {
  return (
    <section className="border-t border-line bg-navy/30 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <Video className="mt-1 h-5 w-5 text-blue-400" />
        <div>
          <h3 className="font-display text-xl font-semibold text-white">Highlights and videos</h3>
          <p className="mt-2 text-sm text-mist">
            Add YouTube videos in the order they should appear on the public profile.
          </p>
        </div>
      </div>

      <details className="mt-5 border border-line bg-ink/50">
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider text-blue-300">
          <Plus className="h-4 w-4" /> Add video
        </summary>
        <VideoForm mode="create" playerId={playerId} playerSlug={playerSlug} />
      </details>

      <div className="mt-4 space-y-3">
        {videos.map((video) => (
          <details key={video.id} className="border border-line bg-ink/50">
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-white">
              <span>{video.title}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                {video.is_published ? 'Published' : 'Draft'} / Order {video.display_order}
              </span>
            </summary>
            <VideoForm
              mode="update"
              playerId={playerId}
              playerSlug={playerSlug}
              video={video}
            />
            <DeleteVideoButton
              id={video.id}
              playerId={playerId}
              playerSlug={playerSlug}
            />
          </details>
        ))}
        {!videos.length ? (
          <p className="border border-dashed border-line px-4 py-5 text-sm text-slate-500">
            No videos yet.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function VideoForm({
  mode,
  playerId,
  playerSlug,
  video
}: {
  mode: 'create' | 'update';
  playerId: string;
  playerSlug: string;
  video?: PlayerVideoFormValue;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const action = mode === 'create' ? createPlayerVideo : updatePlayerVideo;
  const [state, formAction, pending] = useActionState(action, initialVideoActionState);
  const [title, setTitle] = useState(video?.title ?? '');
  const [youtubeUrl, setYoutubeUrl] = useState(video?.youtube_url ?? '');
  const handledRequestId = useRef('');
  const embedUrl = buildYouTubeEmbedUrl(youtubeUrl);

  useEffect(() => {
    if (!state.requestId || handledRequestId.current === state.requestId) return;
    handledRequestId.current = state.requestId;
    if (state.status === 'success') {
      if (mode === 'create') {
        formRef.current?.reset();
        setTitle('');
        setYoutubeUrl('');
      }
      router.refresh();
    }
  }, [mode, router, state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 border-t border-line p-4 lg:grid-cols-[1fr_320px]">
      <input type="hidden" name="player_id" value={playerId} />
      <input type="hidden" name="player_slug" value={playerSlug} />
      {video ? <input type="hidden" name="id" value={video.id} /> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <VideoField
          label="Title"
          name="title"
          value={title}
          onChange={setTitle}
          required
        />
        <VideoField
          label="Display order"
          name="display_order"
          type="number"
          defaultValue={video?.display_order ?? 0}
        />
        <label className="sm:col-span-2">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            YouTube URL
          </span>
          <input
            name="youtube_url"
            type="url"
            value={youtubeUrl}
            onChange={(event) => setYoutubeUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
            className="h-11 w-full border border-line bg-panel px-3 text-sm text-white outline-none focus:border-accent"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-300 sm:col-span-2">
          <input
            name="is_published"
            type="checkbox"
            defaultChecked={video?.is_published ?? true}
            className="h-4 w-4 accent-blue-600"
          />
          Published
        </label>
        {state.message ? <VideoMessage state={state} /> : null}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 items-center gap-2 bg-brand px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {pending ? 'Saving...' : mode === 'create' ? 'Add video' : 'Save video'}
          </button>
        </div>
      </div>

      <aside>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Video preview
        </div>
        {embedUrl ? (
          <div className="overflow-hidden border border-line bg-[#071426]">
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                title={title || 'YouTube video preview'}
                className="h-full w-full border-0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <p className="border-t border-line px-3 py-3 text-sm font-semibold text-white">
              {title || 'Video title'}
            </p>
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center border border-dashed border-line bg-panel text-center text-sm text-slate-500">
            Enter a supported YouTube URL to preview the video.
          </div>
        )}
      </aside>
    </form>
  );
}

function DeleteVideoButton({
  id,
  playerId,
  playerSlug
}: {
  id: string;
  playerId: string;
  playerSlug: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    deletePlayerVideo,
    initialVideoActionState
  );
  const handledRequestId = useRef('');

  useEffect(() => {
    if (!state.requestId || handledRequestId.current === state.requestId) return;
    handledRequestId.current = state.requestId;
    if (state.status === 'success') router.refresh();
  }, [router, state]);

  return (
    <form action={formAction} className="border-t border-line px-4 pb-4 pt-3">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="player_id" value={playerId} />
      <input type="hidden" name="player_slug" value={playerSlug} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center gap-2 border border-red-500/50 px-4 text-xs font-bold uppercase tracking-wider text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" /> {pending ? 'Deleting...' : 'Delete video'}
      </button>
      {state.status === 'error' ? <div className="mt-3"><VideoMessage state={state} /></div> : null}
    </form>
  );
}

function VideoField({
  label,
  name,
  value,
  onChange,
  defaultValue,
  type = 'text',
  required
}: {
  label: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={onChange ? value : undefined}
        defaultValue={onChange ? undefined : defaultValue}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        min={type === 'number' ? 0 : undefined}
        required={required}
        className="h-11 w-full border border-line bg-panel px-3 text-sm text-white outline-none focus:border-accent"
      />
    </label>
  );
}

function VideoMessage({state}: {state: VideoActionState}) {
  return (
    <p
      className={`sm:col-span-2 border-s-2 px-3 py-2 text-sm ${
        state.status === 'success'
          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200'
          : 'border-red-500 bg-red-500/10 text-red-200'
      }`}
    >
      {state.message}
    </p>
  );
}
