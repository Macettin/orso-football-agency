alter table public.player_videos enable row level security;

grant select on public.player_videos to anon, authenticated;
grant insert, update, delete on public.player_videos to authenticated;

create index if not exists player_videos_player_order_idx
  on public.player_videos (player_id, is_published, display_order, created_at);

drop policy if exists "Public can read published player videos"
on public.player_videos;
create policy "Public can read published player videos"
on public.player_videos
for select
using (
  (
    is_published = true
    and exists (
      select 1
      from public.players
      where players.id = player_videos.player_id
        and players.is_published = true
    )
  )
  or exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can insert player videos"
on public.player_videos;
create policy "Admins can insert player videos"
on public.player_videos
for insert
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update player videos"
on public.player_videos;
create policy "Admins can update player videos"
on public.player_videos
for update
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete player videos"
on public.player_videos;
create policy "Admins can delete player videos"
on public.player_videos
for delete
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);
