-- ============================================
-- MIGRATION: Fix page_texts RLS policies
-- ============================================
-- Problem: UPSERT fails with RLS error even when using service role key
--
-- Root cause: The policy "Service role full access to page_texts"
-- uses auth.role() = 'service_role', which doesn't match the actual
-- service role key behavior in Supabase.
--
-- Solution:
-- 1. Drop ALL existing policies on page_texts
-- 2. Create ONLY a SELECT policy for public access (anon/authenticated)
-- 3. Service role key bypasses RLS automatically - no INSERT/UPDATE/DELETE policies needed
-- 4. All writes go through server API with service role key
-- ============================================

-- Step 1: Drop ALL existing policies on page_texts
DROP POLICY IF EXISTS "Anyone can view page texts" ON public.page_texts;
DROP POLICY IF EXISTS "Service role full access to page_texts" ON public.page_texts;
DROP POLICY IF EXISTS "Public read access to page_texts" ON public.page_texts;

-- Step 2: Ensure RLS is enabled
ALTER TABLE public.page_texts ENABLE ROW LEVEL SECURITY;

-- Step 3: Create ONLY the SELECT policy
-- This allows anon and authenticated users to read page texts
-- (needed for public website to display content)
CREATE POLICY "Public read access to page_texts"
ON public.page_texts
FOR SELECT
TO anon, authenticated
USING (true);

-- Step 4: NO INSERT/UPDATE/DELETE policies!
-- The service role key (used by server API) bypasses RLS automatically
-- This is the CORRECT pattern:
-- - Frontend/public can only READ
-- - Server API with service role key can INSERT/UPDATE/DELETE

-- ============================================
-- IMPORTANT: How this works
-- ============================================
-- When SUPABASE_SERVICE_ROLE_KEY is used:
--   - It has role = 'service_role'
--   - Service role BYPASSES RLS entirely
--   - No policy needed for INSERT/UPDATE/DELETE
--
-- When SUPABASE_ANON_KEY is used:
--   - It has role = 'anon'
--   - RLS policies apply
--   - Only SELECT is allowed (via policy above)
--
-- This ensures:
--   1. Public can read page texts (for display on website)
--   2. Only server can modify page texts
--   3. No direct browser access to INSERT/UPDATE/DELETE
-- ============================================

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- ============================================
-- Verification query (run after migration)
-- ============================================
-- Check policies:
-- SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'page_texts';
--
-- Expected output:
-- | policyname                    | cmd    | roles                  |
-- |-------------------------------|--------|------------------------|
-- | Public read access to page_texts | SELECT | {anon,authenticated}   |
--
-- ============================================
-- TEST: After running this migration
-- ============================================
-- 1. Go to Admin -> Treści
-- 2. Click "Edytuj" on any text
-- 3. Change title or content
-- 4. Click "Zapisz"
-- 5. Should see green "Zapisano" confirmation
-- 6. Refresh page - changes should persist
