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

create table if not exists public.program_banners (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_program_banners_updated_at on public.program_banners;
create trigger trg_program_banners_updated_at
before update on public.program_banners
for each row
execute function public.set_updated_at();

alter table public.program_banners enable row level security;

drop policy if exists "program_banners_select_public" on public.program_banners;
create policy "program_banners_select_public"
on public.program_banners
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "program_banners_service_all" on public.program_banners;
create policy "program_banners_service_all"
on public.program_banners
for all
to service_role
using (true)
with check (true);

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
    'program_banners',
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

-- Storage setup for CMS image uploads.
-- MediaUploader defaults to bucket: cms-images
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'cms-images') then
    perform storage.create_bucket('cms-images', public => true, file_size_limit => 10485760, allowed_mime_types => array['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
  end if;
end $$;

-- Allow public read of uploaded objects in cms-images.
drop policy if exists "cms_images_public_read" on storage.objects;
create policy "cms_images_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'cms-images');

-- Allow authenticated admins to upload into cms-images.
drop policy if exists "cms_images_admin_insert" on storage.objects;
create policy "cms_images_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'cms-images'
  and exists (
    select 1
    from public.admin_users a
    where a.user_id = auth.uid() and a.is_active = true
  )
);

-- Allow authenticated admins to update objects in cms-images.
drop policy if exists "cms_images_admin_update" on storage.objects;
create policy "cms_images_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'cms-images'
  and exists (
    select 1
    from public.admin_users a
    where a.user_id = auth.uid() and a.is_active = true
  )
)
with check (
  bucket_id = 'cms-images'
  and exists (
    select 1
    from public.admin_users a
    where a.user_id = auth.uid() and a.is_active = true
  )
);

-- Allow authenticated admins to delete objects in cms-images.
drop policy if exists "cms_images_admin_delete" on storage.objects;
create policy "cms_images_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'cms-images'
  and exists (
    select 1
    from public.admin_users a
    where a.user_id = auth.uid() and a.is_active = true
  )
);

-- Example: promote existing auth user to admin (replace email)
-- insert into public.admin_users (user_id, email, full_name)
-- select id, email, 'Main Admin'
-- from auth.users
-- where email = 'admin@yourdomain.com'
-- on conflict (user_id) do update
-- set email = excluded.email, full_name = excluded.full_name, is_active = true;
