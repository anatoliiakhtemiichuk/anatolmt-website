-- ============================================
-- FINAL BOOKINGS SCHEMA FIX
-- ============================================
-- This migration ensures the bookings table matches
-- exactly what the API code expects.
--
-- Strategy: DROP and RECREATE to ensure clean schema
-- ============================================

-- Drop existing table and policies (clean slate)
DROP POLICY IF EXISTS "Service role full access to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can view bookings" ON public.bookings;
DROP TABLE IF EXISTS public.bookings CASCADE;

-- Create bookings table with ALL required columns
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    price_pln INTEGER NOT NULL DEFAULT 0,
    date DATE NOT NULL,
    time TIME NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_bookings_date ON public.bookings(date);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_email ON public.bookings(email);
CREATE INDEX idx_bookings_date_time ON public.bookings(date, time);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Service role full access (API uses service role key)
CREATE POLICY "Service role full access to bookings" ON public.bookings
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- BLOCKED SLOTS TABLE (also recreate for consistency)
-- ============================================

DROP POLICY IF EXISTS "Service role full access to blocked_slots" ON public.blocked_slots;
DROP POLICY IF EXISTS "Anyone can view blocked slots" ON public.blocked_slots;
DROP TABLE IF EXISTS public.blocked_slots CASCADE;

CREATE TABLE public.blocked_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    time_start TIME,
    time_end TIME,
    is_full_day BOOLEAN NOT NULL DEFAULT false,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blocked_slots_date ON public.blocked_slots(date);

ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to blocked_slots" ON public.blocked_slots
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can view blocked slots" ON public.blocked_slots
    FOR SELECT USING (true);

-- ============================================
-- REFRESH SCHEMA CACHE
-- ============================================
NOTIFY pgrst, 'reload schema';
