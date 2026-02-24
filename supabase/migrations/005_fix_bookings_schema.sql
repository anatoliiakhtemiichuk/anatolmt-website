-- Migration: Fix bookings schema to match API expectations
-- Created: 2026-02-24
--
-- This migration ensures the bookings and blocked_slots tables have
-- all columns expected by the application code.

-- ============================================
-- BOOKINGS TABLE
-- ============================================

-- Create table if not exists
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add all required columns (IF NOT EXISTS prevents errors if column already exists)
DO $$
BEGIN
    -- service_type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'service_type') THEN
        ALTER TABLE public.bookings ADD COLUMN service_type VARCHAR(100) NOT NULL DEFAULT 'Wizyta';
    END IF;

    -- duration_minutes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'duration_minutes') THEN
        ALTER TABLE public.bookings ADD COLUMN duration_minutes INTEGER NOT NULL DEFAULT 60;
    END IF;

    -- price_pln
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'price_pln') THEN
        ALTER TABLE public.bookings ADD COLUMN price_pln INTEGER NOT NULL DEFAULT 0;
    END IF;

    -- date
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'date') THEN
        ALTER TABLE public.bookings ADD COLUMN date DATE NOT NULL DEFAULT CURRENT_DATE;
    END IF;

    -- time
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'time') THEN
        ALTER TABLE public.bookings ADD COLUMN time TIME NOT NULL DEFAULT '10:00';
    END IF;

    -- first_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'first_name') THEN
        ALTER TABLE public.bookings ADD COLUMN first_name VARCHAR(100) NOT NULL DEFAULT '';
    END IF;

    -- last_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'last_name') THEN
        ALTER TABLE public.bookings ADD COLUMN last_name VARCHAR(100) NOT NULL DEFAULT '';
    END IF;

    -- phone
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'phone') THEN
        ALTER TABLE public.bookings ADD COLUMN phone VARCHAR(20) NOT NULL DEFAULT '';
    END IF;

    -- email
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'email') THEN
        ALTER TABLE public.bookings ADD COLUMN email VARCHAR(255) NOT NULL DEFAULT '';
    END IF;

    -- notes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'notes') THEN
        ALTER TABLE public.bookings ADD COLUMN notes TEXT;
    END IF;

    -- status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'status') THEN
        ALTER TABLE public.bookings ADD COLUMN status VARCHAR(20) DEFAULT 'confirmed';
    END IF;

    -- created_at (in case it wasn't created with table)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'created_at') THEN
        ALTER TABLE public.bookings ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    -- updated_at (in case it wasn't created with table)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'updated_at') THEN
        ALTER TABLE public.bookings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create indexes if not exist
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON public.bookings(date, time);

-- ============================================
-- BLOCKED_SLOTS TABLE
-- ============================================

-- Create table if not exists
CREATE TABLE IF NOT EXISTS public.blocked_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add all required columns
DO $$
BEGIN
    -- date
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blocked_slots' AND column_name = 'date') THEN
        ALTER TABLE public.blocked_slots ADD COLUMN date DATE NOT NULL DEFAULT CURRENT_DATE;
    END IF;

    -- time_start
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blocked_slots' AND column_name = 'time_start') THEN
        ALTER TABLE public.blocked_slots ADD COLUMN time_start TIME;
    END IF;

    -- time_end
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blocked_slots' AND column_name = 'time_end') THEN
        ALTER TABLE public.blocked_slots ADD COLUMN time_end TIME;
    END IF;

    -- is_full_day
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blocked_slots' AND column_name = 'is_full_day') THEN
        ALTER TABLE public.blocked_slots ADD COLUMN is_full_day BOOLEAN DEFAULT false;
    END IF;

    -- reason
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blocked_slots' AND column_name = 'reason') THEN
        ALTER TABLE public.blocked_slots ADD COLUMN reason TEXT;
    END IF;
END $$;

-- Create index if not exist
CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON public.blocked_slots(date);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Service role full access to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Service role full access to blocked_slots" ON public.blocked_slots;
DROP POLICY IF EXISTS "Anyone can view blocked slots" ON public.blocked_slots;

-- Service role full access (for API with service key)
CREATE POLICY "Service role full access to bookings" ON public.bookings
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to blocked_slots" ON public.blocked_slots
    FOR ALL USING (auth.role() = 'service_role');

-- Public can read blocked slots (for availability checking on public site)
CREATE POLICY "Anyone can view blocked slots" ON public.blocked_slots
    FOR SELECT USING (true);

-- ============================================
-- REFRESH SCHEMA CACHE
-- ============================================
NOTIFY pgrst, 'reload schema';

-- ============================================
-- VERIFICATION QUERY (run after migration to verify)
-- ============================================
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'bookings'
-- ORDER BY ordinal_position;
