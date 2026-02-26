-- ============================================
-- SAFE MIGRATION: Fix price format and ensure tables exist
-- ============================================
-- This migration:
-- 1. Converts old grosze prices to PLN in bookings table
-- 2. Ensures page_texts table exists with proper RLS
-- 3. Ensures blocked_slots table has proper structure
-- 4. Updates column comments to reflect PLN storage
-- ============================================

-- ============================================
-- STEP 1: Convert grosze to PLN in bookings
-- ============================================
-- Old data stored prices in grosze (e.g., 18000 = 180 PLN)
-- New data stores prices in PLN (e.g., 200)
-- We detect old format by checking if price > 1000 (unlikely to have 1000+ PLN booking)
-- and convert by dividing by 100

UPDATE public.bookings
SET price_pln = ROUND(price_pln / 100)
WHERE price_pln > 1000;

-- Update column comment to reflect PLN storage
COMMENT ON COLUMN public.bookings.price_pln IS 'Price in PLN (whole units), e.g., 200 = 200 PLN';

-- ============================================
-- STEP 2: Ensure page_texts table exists
-- ============================================
CREATE TABLE IF NOT EXISTS public.page_texts (
    key TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_page_texts_updated ON public.page_texts(updated_at);

-- Enable RLS
ALTER TABLE public.page_texts ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure correct setup
DROP POLICY IF EXISTS "Service role full access to page_texts" ON public.page_texts;
CREATE POLICY "Service role full access to page_texts" ON public.page_texts
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Anyone can view page texts" ON public.page_texts;
CREATE POLICY "Anyone can view page texts" ON public.page_texts
    FOR SELECT USING (true);

-- Insert default texts if they don't exist
INSERT INTO public.page_texts (key, title, content, updated_at) VALUES
    ('video_help_intro', 'Wprowadzenie', 'Wideo pomoc to innowacyjne rozwiązanie umożliwiające konsultacje online.', NOW()),
    ('video_help_disclaimer', 'Zastrzeżenie', 'Wideo konsultacje nie zastępują wizyty osobistej.', NOW()),
    ('video_help_package', 'Pakiet Wideo', 'Pakiet zawiera dostęp do materiałów wideo i konsultacji online.', NOW())
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- STEP 3: Ensure blocked_slots has all columns
-- ============================================
ALTER TABLE public.blocked_slots ADD COLUMN IF NOT EXISTS date DATE;
ALTER TABLE public.blocked_slots ADD COLUMN IF NOT EXISTS time_start TIME;
ALTER TABLE public.blocked_slots ADD COLUMN IF NOT EXISTS time_end TIME;
ALTER TABLE public.blocked_slots ADD COLUMN IF NOT EXISTS is_full_day BOOLEAN DEFAULT false;
ALTER TABLE public.blocked_slots ADD COLUMN IF NOT EXISTS reason TEXT;
ALTER TABLE public.blocked_slots ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Enable RLS
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

-- Ensure service role has full access
DROP POLICY IF EXISTS "Service role full access to blocked_slots" ON public.blocked_slots;
CREATE POLICY "Service role full access to blocked_slots" ON public.blocked_slots
    FOR ALL USING (auth.role() = 'service_role');

-- Anyone can view blocked slots (for availability checking)
DROP POLICY IF EXISTS "Anyone can view blocked slots" ON public.blocked_slots;
CREATE POLICY "Anyone can view blocked slots" ON public.blocked_slots
    FOR SELECT USING (true);

-- ============================================
-- STEP 4: Ensure bookings table has proper RLS
-- ============================================
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to bookings" ON public.bookings;
CREATE POLICY "Service role full access to bookings" ON public.bookings
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- STEP 5: Refresh PostgREST schema cache
-- ============================================
NOTIFY pgrst, 'reload schema';

-- ============================================
-- VERIFICATION QUERIES (run after migration)
-- ============================================
-- Check price values are reasonable:
-- SELECT id, service_type, price_pln, date FROM bookings ORDER BY date DESC LIMIT 10;
--
-- Check page_texts exists:
-- SELECT * FROM page_texts;
--
-- Check blocked_slots structure:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'blocked_slots';
