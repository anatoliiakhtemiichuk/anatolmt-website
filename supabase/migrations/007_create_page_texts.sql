-- ============================================
-- SAFE MIGRATION: Create page_texts table
-- ============================================
-- This table stores editable text content for the website

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

-- Service role full access (for API with service key)
DROP POLICY IF EXISTS "Service role full access to page_texts" ON public.page_texts;
CREATE POLICY "Service role full access to page_texts" ON public.page_texts
    FOR ALL USING (auth.role() = 'service_role');

-- Public read access (for displaying on website)
DROP POLICY IF EXISTS "Anyone can view page texts" ON public.page_texts;
CREATE POLICY "Anyone can view page texts" ON public.page_texts
    FOR SELECT USING (true);

-- Insert default texts
INSERT INTO public.page_texts (key, title, content, updated_at) VALUES
    ('video_help_intro', 'Wprowadzenie', 'Wideo pomoc to innowacyjne rozwiązanie umożliwiające konsultacje online.', NOW()),
    ('video_help_disclaimer', 'Zastrzeżenie', 'Wideo konsultacje nie zastępują wizyty osobistej.', NOW()),
    ('video_help_package', 'Pakiet Wideo', 'Pakiet zawiera dostęp do materiałów wideo i konsultacji online.', NOW())
ON CONFLICT (key) DO NOTHING;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
