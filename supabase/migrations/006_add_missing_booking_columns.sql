-- ============================================
-- SAFE MIGRATION: Add missing columns to bookings
-- ============================================
-- This migration ONLY adds columns that don't exist.
-- It does NOT drop or recreate tables.
-- Existing data is preserved.
-- ============================================

-- Required columns from src/types/admin.ts Booking interface:
-- id, service_type, duration_minutes, price_pln, date, time,
-- first_name, last_name, phone, email, notes, status,
-- created_at, updated_at

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS price_pln INTEGER DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS date DATE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS time TIME;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'confirmed';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);

-- Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Add policy if not exists (drop first to avoid duplicate error)
DROP POLICY IF EXISTS "Service role full access to bookings" ON public.bookings;
CREATE POLICY "Service role full access to bookings" ON public.bookings
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- BLOCKED_SLOTS: Add missing columns safely
-- ============================================

ALTER TABLE public.blocked_slots ADD COLUMN IF NOT EXISTS date DATE;
ALTER TABLE public.blocked_slots ADD COLUMN IF NOT EXISTS time_start TIME;
ALTER TABLE public.blocked_slots ADD COLUMN IF NOT EXISTS time_end TIME;
ALTER TABLE public.blocked_slots ADD COLUMN IF NOT EXISTS is_full_day BOOLEAN DEFAULT false;
ALTER TABLE public.blocked_slots ADD COLUMN IF NOT EXISTS reason TEXT;
ALTER TABLE public.blocked_slots ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON public.blocked_slots(date);

ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to blocked_slots" ON public.blocked_slots;
CREATE POLICY "Service role full access to blocked_slots" ON public.blocked_slots
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Anyone can view blocked slots" ON public.blocked_slots;
CREATE POLICY "Anyone can view blocked slots" ON public.blocked_slots
    FOR SELECT USING (true);

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
