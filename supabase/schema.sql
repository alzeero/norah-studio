-- ============================================================================
-- NORAH STUDIO — Supabase schema
--
-- Run this once against your Supabase project:
--   Dashboard → SQL Editor → New query → paste this file → Run
-- Every statement is idempotent, so it's safe to re-run.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  comment text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Single-row table (id is always 1) holding hero text/image, WhatsApp
-- settings and the default theme — everything editable from "General".
create table if not exists public.site_settings (
  id integer primary key default 1,
  hero_title text not null default 'NORAH STUDIO',
  hero_subtitle text not null default 'Photography & Videography',
  hero_image_path text,
  hero_image_url text,
  whatsapp_phone text not null default '',
  whatsapp_message text not null default '',
  default_theme text not null default 'system' check (default_theme in ('light', 'dark', 'system')),
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

create index if not exists gallery_images_sort_order_idx on public.gallery_images (sort_order);
create index if not exists testimonials_sort_order_idx on public.testimonials (sort_order);

-- Seed the one settings row so dashboard updates always have a row to target.
insert into public.site_settings (id, hero_title, hero_subtitle, whatsapp_message, default_theme)
values (
  1,
  'NORAH STUDIO',
  'Photography & Videography',
  E'مرحبًا بك في NORAH | STUDIO 🤍\n\nحيث تتحول اللحظات إلى صور تُحكى.\n\nشكرًا لتواصلك معنا، ونتشرف بتوثيق أجمل لحظاتكم.\n\nأرغب في حجز جلسة تصوير.',
  'system'
)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- Anyone can read (the public site needs this). Only a signed-in session —
-- the one studio admin created manually, see README.md — can write.
-- ----------------------------------------------------------------------------

alter table public.gallery_images enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public read gallery_images" on public.gallery_images;
create policy "Public read gallery_images" on public.gallery_images for select using (true);
drop policy if exists "Admin write gallery_images" on public.gallery_images;
create policy "Admin write gallery_images" on public.gallery_images for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Public read testimonials" on public.testimonials;
create policy "Public read testimonials" on public.testimonials for select using (true);
drop policy if exists "Admin write testimonials" on public.testimonials;
create policy "Admin write testimonials" on public.testimonials for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Public read site_settings" on public.site_settings;
create policy "Public read site_settings" on public.site_settings for select using (true);
drop policy if exists "Admin write site_settings" on public.site_settings;
create policy "Admin write site_settings" on public.site_settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- Storage — one public bucket for everything uploaded from the dashboard
-- (gallery/ and hero/ folders live inside it).
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media" on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Admin upload media" on storage.objects;
create policy "Admin upload media" on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "Admin update media" on storage.objects;
create policy "Admin update media" on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "Admin delete media" on storage.objects;
create policy "Admin delete media" on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');
