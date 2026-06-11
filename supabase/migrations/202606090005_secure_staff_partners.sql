alter table public.staff_members enable row level security;
alter table public.partners enable row level security;

grant select on public.staff_members, public.partners to anon, authenticated;
grant insert, update, delete on public.staff_members, public.partners to authenticated;

drop policy if exists "Public can read published staff" on public.staff_members;
create policy "Public can read published staff"
on public.staff_members for select
using (
  is_published = true
  or exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can insert staff" on public.staff_members;
create policy "Admins can insert staff"
on public.staff_members for insert
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update staff" on public.staff_members;
create policy "Admins can update staff"
on public.staff_members for update
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

drop policy if exists "Admins can delete staff" on public.staff_members;
create policy "Admins can delete staff"
on public.staff_members for delete
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Public can read published partners" on public.partners;
create policy "Public can read published partners"
on public.partners for select
using (
  is_published = true
  or exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can insert partners" on public.partners;
create policy "Admins can insert partners"
on public.partners for insert
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update partners" on public.partners;
create policy "Admins can update partners"
on public.partners for update
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

drop policy if exists "Admins can delete partners" on public.partners;
create policy "Admins can delete partners"
on public.partners for delete
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Public can view staff media" on storage.objects;
create policy "Public can view staff media"
on storage.objects for select
using (bucket_id = 'staff');

drop policy if exists "Admins can upload staff media" on storage.objects;
create policy "Admins can upload staff media"
on storage.objects for insert
with check (
  bucket_id = 'staff'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update staff media" on storage.objects;
create policy "Admins can update staff media"
on storage.objects for update
using (
  bucket_id = 'staff'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'staff'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete staff media" on storage.objects;
create policy "Admins can delete staff media"
on storage.objects for delete
using (
  bucket_id = 'staff'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Public can view partner media" on storage.objects;
create policy "Public can view partner media"
on storage.objects for select
using (bucket_id = 'partners');

drop policy if exists "Admins can upload partner media" on storage.objects;
create policy "Admins can upload partner media"
on storage.objects for insert
with check (
  bucket_id = 'partners'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update partner media" on storage.objects;
create policy "Admins can update partner media"
on storage.objects for update
using (
  bucket_id = 'partners'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'partners'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete partner media" on storage.objects;
create policy "Admins can delete partner media"
on storage.objects for delete
using (
  bucket_id = 'partners'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);
