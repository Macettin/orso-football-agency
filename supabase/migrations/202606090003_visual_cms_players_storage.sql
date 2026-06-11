create extension if not exists "pgcrypto";

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  position text not null default '',
  nationality text not null default '',
  age integer,
  current_club text not null default '',
  height text not null default '',
  preferred_foot text not null default '',
  contract_status text not null default '',
  photo_url text,
  transfermarkt_url text,
  video_url text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists players_published_created_idx
  on public.players (is_published, created_at desc);

create index if not exists players_featured_created_idx
  on public.players (is_featured, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists players_set_updated_at on public.players;
create trigger players_set_updated_at
before update on public.players
for each row execute function public.set_updated_at();

alter table public.players enable row level security;

drop policy if exists "Public can read published players" on public.players;
create policy "Public can read published players"
on public.players
for select
using (
  is_published = true
  or exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can insert players" on public.players;
create policy "Admins can insert players"
on public.players
for insert
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update players" on public.players;
create policy "Admins can update players"
on public.players
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

drop policy if exists "Admins can delete players" on public.players;
create policy "Admins can delete players"
on public.players
for delete
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'players',
  'players',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view site media" on storage.objects;
drop policy if exists "Admins can upload site media" on storage.objects;
drop policy if exists "Admins can update site media" on storage.objects;
drop policy if exists "Admins can delete site media" on storage.objects;

drop policy if exists "Public can view player photos" on storage.objects;
create policy "Public can view player photos"
on storage.objects
for select
using (bucket_id = 'players');

drop policy if exists "Admins can upload player photos" on storage.objects;
create policy "Admins can upload player photos"
on storage.objects
for insert
with check (
  bucket_id = 'players'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update player photos" on storage.objects;
create policy "Admins can update player photos"
on storage.objects
for update
using (
  bucket_id = 'players'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'players'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete player photos" on storage.objects;
create policy "Admins can delete player photos"
on storage.objects
for delete
using (
  bucket_id = 'players'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);
