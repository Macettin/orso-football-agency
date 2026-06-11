alter table public.player_translations enable row level security;
alter table public.player_career_entries enable row level security;

grant select on public.player_translations, public.player_career_entries
to anon, authenticated;

grant insert, update, delete
on public.player_translations, public.player_career_entries
to authenticated;

create unique index if not exists player_translations_player_locale_idx
  on public.player_translations (player_id, locale);

create index if not exists player_career_entries_player_order_idx
  on public.player_career_entries (player_id, display_order, created_at);

drop policy if exists "Public can read published player translations"
on public.player_translations;
create policy "Public can read published player translations"
on public.player_translations
for select
using (
  exists (
    select 1
    from public.players
    where players.id = player_translations.player_id
      and players.is_published = true
  )
  or exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can insert player translations"
on public.player_translations;
create policy "Admins can insert player translations"
on public.player_translations
for insert
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update player translations"
on public.player_translations;
create policy "Admins can update player translations"
on public.player_translations
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

drop policy if exists "Admins can delete player translations"
on public.player_translations;
create policy "Admins can delete player translations"
on public.player_translations
for delete
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Public can read published player careers"
on public.player_career_entries;
create policy "Public can read published player careers"
on public.player_career_entries
for select
using (
  exists (
    select 1
    from public.players
    where players.id = player_career_entries.player_id
      and players.is_published = true
  )
  or exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can insert player careers"
on public.player_career_entries;
create policy "Admins can insert player careers"
on public.player_career_entries
for insert
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update player careers"
on public.player_career_entries;
create policy "Admins can update player careers"
on public.player_career_entries
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

drop policy if exists "Admins can delete player careers"
on public.player_career_entries;
create policy "Admins can delete player careers"
on public.player_career_entries
for delete
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

update storage.buckets
set public = false
where id = 'player-documents';

drop policy if exists "Public can view player documents" on storage.objects;
drop policy if exists "Admins can view player documents" on storage.objects;
create policy "Admins can view player documents"
on storage.objects
for select
using (
  bucket_id = 'player-documents'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can upload player documents" on storage.objects;
create policy "Admins can upload player documents"
on storage.objects
for insert
with check (
  bucket_id = 'player-documents'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update player documents" on storage.objects;
create policy "Admins can update player documents"
on storage.objects
for update
using (
  bucket_id = 'player-documents'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'player-documents'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete player documents" on storage.objects;
create policy "Admins can delete player documents"
on storage.objects
for delete
using (
  bucket_id = 'player-documents'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);
