-- ============================================================================
-- Migration: remove the categories feature from an existing database
--
-- Optional — the app no longer reads or writes categories at all, so
-- leaving these in place is harmless. Run this once in Supabase → SQL
-- Editor only if you'd also like the schema itself cleaned up.
-- ============================================================================

alter table public.gallery_images drop column if exists category_id;
drop table if exists public.categories;
