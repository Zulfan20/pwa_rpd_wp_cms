-- CMS admin access setup for Radio PPI Dunia
-- Run this in Supabase SQL Editor before using /admin/dashboard.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_admin_users_updated_at on public.admin_users;
create trigger trg_admin_users_updated_at
before update on public.admin_users
for each row
execute function public.set_updated_at();

alter table public.admin_users enable row level security;

-- Signed in users can read only their own admin row.
drop policy if exists "admin_users_select_own" on public.admin_users;
create policy "admin_users_select_own"
on public.admin_users
for select
to authenticated
using (auth.uid() = user_id);

-- Service role can manage admin_users (used by Supabase dashboard / secure backend tasks).
drop policy if exists "admin_users_service_all" on public.admin_users;
create policy "admin_users_service_all"
on public.admin_users
for all
to service_role
using (true)
with check (true);

-- Optional hardening for CMS content tables:
-- Only authenticated admin users can mutate data.
-- Keep your existing public read policies as needed.

do $$
declare
  t text;
  cms_tables text[] := array[
    'poster_slides',
    'music_list',
    'site_settings',
    'center_poster',
    'information',
    'members',
    'podcasts'
  ];
begin
  foreach t in array cms_tables loop
    if to_regclass(format('public.%I', t)) is null then
      continue;
    end if;

    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists %I on public.%I;', 'cms_admin_insert_' || t, t);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active = true));',
      'cms_admin_insert_' || t,
      t
    );

    execute format('drop policy if exists %I on public.%I;', 'cms_admin_update_' || t, t);
    execute format(
      'create policy %I on public.%I for update to authenticated using (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active = true)) with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active = true));',
      'cms_admin_update_' || t,
      t
    );

    execute format('drop policy if exists %I on public.%I;', 'cms_admin_delete_' || t, t);
    execute format(
      'create policy %I on public.%I for delete to authenticated using (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active = true));',
      'cms_admin_delete_' || t,
      t
    );
  end loop;
end $$;

-- Example: promote existing auth user to admin (replace email)
-- insert into public.admin_users (user_id, email, full_name)
-- select id, email, 'Main Admin'
-- from auth.users
-- where email = 'admin@yourdomain.com'
-- on conflict (user_id) do update
-- set email = excluded.email, full_name = excluded.full_name, is_active = true;
