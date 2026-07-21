-- ============================================================================
-- Migration: allow 'system' as a default_theme value
--
-- Only needed if you already ran the original schema.sql (which only
-- allowed 'light'/'dark'). Run this once in Supabase → SQL Editor.
-- If you're setting up a brand new project instead, the updated
-- schema.sql already includes this — you don't need this file too.
-- ============================================================================

-- Find and drop whatever the existing check constraint on this column is
-- named (Postgres auto-generates the name, so this doesn't assume it).
do $$
declare
  existing_constraint text;
begin
  select con.conname into existing_constraint
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_attribute att on att.attrelid = rel.oid and att.attnum = any(con.conkey)
  where rel.relname = 'site_settings'
    and att.attname = 'default_theme'
    and con.contype = 'c';

  if existing_constraint is not null then
    execute format('alter table public.site_settings drop constraint %I', existing_constraint);
  end if;
end $$;

alter table public.site_settings
  add constraint site_settings_default_theme_check
  check (default_theme in ('light', 'dark', 'system'));

-- Optional: switch your existing row to follow system preference by
-- default instead of the old fixed 'light' — remove this statement if you'd
-- rather keep whatever you already have set.
update public.site_settings set default_theme = 'system' where id = 1 and default_theme = 'light';
