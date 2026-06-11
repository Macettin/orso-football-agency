create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  section text not null,
  content_key text not null,
  locale text not null check (locale in ('en', 'tr', 'ru', 'ar')),
  value text not null,
  updated_at timestamptz not null default now(),
  unique (page, section, content_key, locale)
);

create index if not exists site_content_locale_page_idx
  on public.site_content (locale, page);

alter table public.admin_users enable row level security;
alter table public.site_content enable row level security;

grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
grant select on public.admin_users to authenticated;

drop policy if exists "Public content is readable" on public.site_content;
create policy "Public content is readable"
  on public.site_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert content" on public.site_content;
create policy "Admins can insert content"
  on public.site_content
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can update content" on public.site_content;
create policy "Admins can update content"
  on public.site_content
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can delete content" on public.site_content;
create policy "Admins can delete content"
  on public.site_content
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can read admin list" on public.admin_users;
create policy "Admins can read admin list"
  on public.admin_users
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.set_site_content_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
before update on public.site_content
for each row execute function public.set_site_content_updated_at();
