-- ============================================================================
-- Migration: add Instagram/TikTok URL columns
--
-- Only needed if your project already existed before these fields were
-- added. Run this once in Supabase → SQL Editor. If you're setting up a
-- brand new project, the updated schema.sql already includes this.
-- ============================================================================

alter table public.site_settings add column if not exists instagram_url text not null default '';
alter table public.site_settings add column if not exists tiktok_url text not null default '';
