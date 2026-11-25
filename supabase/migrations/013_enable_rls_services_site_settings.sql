-- ============================================
-- MIGRATION: Enable RLS on public.services and public.site_settings
-- ============================================
-- Supabase Security Advisor: "RLS Disabled in Public" for both tables.
--
-- How the code uses them:
-- - site_settings: read and written only on the server with the
--   service_role key (src/lib/site-settings.ts, getSupabaseClient).
--   The browser gets settings through /api/site-settings, never directly.
-- - services: not used by the code at all.
--
-- So neither table needs any policy for anon/authenticated.
-- RLS enabled + no policies = anon/authenticated are denied everything,
-- service_role bypasses RLS and keeps working.
-- ============================================

-- site_settings: drop old policies from 004_site_settings_table.sql
-- (public SELECT and admin INSERT/UPDATE are not used by the code)
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Service role full access to site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- services: created outside migrations, so guard with IF EXISTS
ALTER TABLE IF EXISTS public.services ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE/DELETE policies on purpose.
-- All access goes through the server with the service_role key.
