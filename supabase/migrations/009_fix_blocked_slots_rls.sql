-- ============================================
-- SAFE MIGRATION: Fix blocked_slots RLS policies
-- ============================================
-- Problem: INSERT fails with RLS error even when using service role key
--
-- Solution:
-- 1. Drop ALL existing policies on blocked_slots
-- 2. Create ONLY a SELECT policy for public access (anon/authenticated)
-- 3. Service role key bypasses RLS automatically - no INSERT/DELETE policies needed
-- 4. All writes go through server API with service role key
-- ============================================

-- Step 1: Drop ALL existing policies on blocked_slots
DROP POLICY IF EXISTS "Anyone can view blocked slots" ON public.blocked_slots;
DROP POLICY IF EXISTS "Admins can insert blocked slots" ON public.blocked_slots;
DROP POLICY IF EXISTS "Admins can update blocked slots" ON public.blocked_slots;
DROP POLICY IF EXISTS "Admins can delete blocked slots" ON public.blocked_slots;
DROP POLICY IF EXISTS "Service role full access to blocked_slots" ON public.blocked_slots;

-- Step 2: Ensure RLS is enabled
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

-- Step 3: Create ONLY the SELECT policy
-- This allows anon and authenticated users to read blocked slots
-- (needed for public booking form to check availability)
CREATE POLICY "Public read access to blocked_slots"
ON public.blocked_slots
FOR SELECT
TO anon, authenticated
USING (true);

-- Step 4: NO INSERT/UPDATE/DELETE policies!
-- The service role key (used by server API) bypasses RLS automatically
-- This is the CORRECT pattern:
-- - Frontend can only READ
-- - Server API with service role key can INSERT/DELETE

-- ============================================
-- IMPORTANT: How this works
-- ============================================
-- When SUPABASE_SERVICE_ROLE_KEY is used:
--   - It has role = 'service_role'
--   - Service role BYPASSES RLS entirely
--   - No policy needed for INSERT/DELETE
--
-- When SUPABASE_ANON_KEY is used:
--   - It has role = 'anon'
--   - RLS policies apply
--   - Only SELECT is allowed (via policy above)
--
-- This ensures:
--   1. Public can see blocked slots (for availability)
--   2. Only server can modify blocked slots
--   3. No direct browser access to INSERT/DELETE
-- ============================================

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- ============================================
-- Verification query (run after migration)
-- ============================================
-- Check policies:
-- SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'blocked_slots';
--
-- Expected output:
-- | policyname                        | cmd    | roles                  |
-- |-----------------------------------|--------|------------------------|
-- | Public read access to blocked_slots | SELECT | {anon,authenticated}   |
