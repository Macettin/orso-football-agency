# Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and add the project URL and publishable key.
3. Run `supabase/migrations/202606090001_create_site_content.sql` in the Supabase SQL editor.
4. Create the administrator in Supabase Authentication with email/password.
5. Copy that user's UUID and run:

```sql
insert into public.admin_users (user_id)
values ('ADMIN_USER_UUID');
```

The public website can read `site_content`, but only authenticated users listed in
`admin_users` can insert, update, or delete content. Emptying a field in the admin
editor removes its database override and restores the value from `messages/*.json`.

If `site_content` already exists but the login returns to the login page, run
`supabase/migrations/202606090002_repair_admin_users.sql`, then insert the authenticated
admin user's UUID into `admin_users`.
