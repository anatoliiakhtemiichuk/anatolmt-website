-- Migration: Create site_settings table for storing admin settings
-- Created: 2026-02-24
--
-- This table stores site-wide settings (pricing, hours, contact, texts)
-- Required for Vercel deployment where filesystem is read-only

-- ============================================
-- SITE_SETTINGS TABLE
-- Stores JSON settings with a single row (key-value style)
-- ============================================
-- Note: If table already exists with UUID id column, this is compatible
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
    data JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on updated_at for potential ordering
CREATE INDEX IF NOT EXISTS idx_site_settings_updated_at ON site_settings(updated_at);

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_site_settings_updated_at') THEN
        CREATE TRIGGER update_site_settings_updated_at
            BEFORE UPDATE ON site_settings
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read site settings (public data for the website)
CREATE POLICY "Anyone can view site settings" ON site_settings
    FOR SELECT USING (true);

-- Service role has full access (for API routes with service key)
CREATE POLICY "Service role full access to site_settings" ON site_settings
    FOR ALL USING (auth.role() = 'service_role');

-- Admins can update site settings
CREATE POLICY "Admins can update site settings" ON site_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can insert site settings
CREATE POLICY "Admins can insert site settings" ON site_settings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE site_settings IS 'Stores site-wide settings as JSON (services, hours, contact, texts)';
COMMENT ON COLUMN site_settings.id IS 'Fixed UUID for single-row config: 00000000-0000-0000-0000-000000000001';
COMMENT ON COLUMN site_settings.data IS 'JSONB object containing all settings';
