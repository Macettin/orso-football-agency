alter table public.news_posts enable row level security;
alter table public.transfers enable row level security;

grant select on public.news_posts, public.transfers to anon, authenticated;
grant insert, update, delete on public.news_posts, public.transfers to authenticated;

create unique index if not exists news_posts_slug_idx on public.news_posts (slug);
create index if not exists news_posts_publication_idx
  on public.news_posts (is_published, published_at desc);
create index if not exists transfers_public_order_idx
  on public.transfers (is_published, is_top_deal desc, season desc, display_order);

drop policy if exists "Public can read published news" on public.news_posts;
create policy "Public can read published news"
on public.news_posts for select
using (
  is_published = true
  or exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can insert news" on public.news_posts;
create policy "Admins can insert news"
on public.news_posts for insert
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update news" on public.news_posts;
create policy "Admins can update news"
on public.news_posts for update
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete news" on public.news_posts;
create policy "Admins can delete news"
on public.news_posts for delete
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Public can read published transfers" on public.transfers;
create policy "Public can read published transfers"
on public.transfers for select
using (
  is_published = true
  or exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can insert transfers" on public.transfers;
create policy "Admins can insert transfers"
on public.transfers for insert
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update transfers" on public.transfers;
create policy "Admins can update transfers"
on public.transfers for update
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete transfers" on public.transfers;
create policy "Admins can delete transfers"
on public.transfers for delete
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Public can view news media" on storage.objects;
create policy "Public can view news media"
on storage.objects for select
using (bucket_id = 'news');

drop policy if exists "Admins can upload news media" on storage.objects;
create policy "Admins can upload news media"
on storage.objects for insert
with check (
  bucket_id = 'news'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update news media" on storage.objects;
create policy "Admins can update news media"
on storage.objects for update
using (
  bucket_id = 'news'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'news'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete news media" on storage.objects;
create policy "Admins can delete news media"
on storage.objects for delete
using (
  bucket_id = 'news'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Public can view transfer media" on storage.objects;
create policy "Public can view transfer media"
on storage.objects for select
using (bucket_id = 'transfers');

drop policy if exists "Admins can upload transfer media" on storage.objects;
create policy "Admins can upload transfer media"
on storage.objects for insert
with check (
  bucket_id = 'transfers'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update transfer media" on storage.objects;
create policy "Admins can update transfer media"
on storage.objects for update
using (
  bucket_id = 'transfers'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'transfers'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete transfer media" on storage.objects;
create policy "Admins can delete transfer media"
on storage.objects for delete
using (
  bucket_id = 'transfers'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);
