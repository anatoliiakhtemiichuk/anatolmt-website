-- Migration: Create video tables for "Wideo Pomoc" feature
-- Created: 2026-02-07

-- ============================================
-- VIDEOS TABLE
-- Stores educational exercise videos
-- ============================================
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    when_to_do TEXT,           -- Kiedy wykonywać
    when_not_to_do TEXT,       -- Kiedy NIE wykonywać
    embed_url TEXT,            -- Vimeo/Cloudflare Stream embed URL
    thumbnail_url TEXT,        -- Preview image URL
    duration_seconds INTEGER,  -- Video duration
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_videos_slug ON videos(slug);
CREATE INDEX idx_videos_active ON videos(active);

-- ============================================
-- VIDEO PURCHASES TABLE
-- Stores purchase records and access tokens
-- ============================================
CREATE TABLE IF NOT EXISTS video_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_session_id VARCHAR(255) UNIQUE,
    stripe_payment_intent VARCHAR(255),
    product_type VARCHAR(20) NOT NULL CHECK (product_type IN ('single', 'standard', 'full')),
    video_id UUID REFERENCES videos(id) ON DELETE SET NULL,  -- NULL for full package
    access_token VARCHAR(64) UNIQUE NOT NULL,
    customer_email VARCHAR(255),
    amount_paid INTEGER NOT NULL,  -- Amount in cents (EUR)
    currency VARCHAR(3) DEFAULT 'eur',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired', 'refunded')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accessed_at TIMESTAMP WITH TIME ZONE,  -- First access timestamp
    access_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_video_purchases_token ON video_purchases(access_token);
CREATE INDEX idx_video_purchases_stripe_session ON video_purchases(stripe_session_id);
CREATE INDEX idx_video_purchases_status ON video_purchases(status);
CREATE INDEX idx_video_purchases_expires ON video_purchases(expires_at);

-- ============================================
-- VIDEO CATEGORIES (Reference data)
-- ============================================
CREATE TABLE IF NOT EXISTS video_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),  -- Lucide icon name
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SEED DATA: Categories
-- ============================================
INSERT INTO video_categories (name, slug, description, icon, sort_order) VALUES
    ('Kręgosłup szyjny', 'kregoslup-szyjny', 'Ćwiczenia na odcinek szyjny kręgosłupa', 'activity', 1),
    ('Odcinek piersiowy', 'odcinek-piersiowy', 'Ćwiczenia na odcinek piersiowy kręgosłupa', 'heart', 2),
    ('Odcinek lędźwiowy', 'odcinek-ledźwiowy', 'Ćwiczenia na odcinek lędźwiowy kręgosłupa', 'move', 3),
    ('Bark', 'bark', 'Ćwiczenia na staw barkowy', 'hand', 4),
    ('Biodro', 'biodro', 'Ćwiczenia na staw biodrowy', 'footprints', 5),
    ('Kolano', 'kolano', 'Ćwiczenia na staw kolanowy', 'circle-dot', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED DATA: Sample Videos (Placeholders)
-- ============================================
INSERT INTO videos (title, slug, category, description, when_to_do, when_not_to_do, embed_url, sort_order) VALUES
    -- Kręgosłup szyjny
    ('Mobilizacja odcinka szyjnego', 'mobilizacja-szyjnego', 'kregoslup-szyjny',
     'Delikatne ćwiczenie mobilizujące kręgosłup szyjny, idealne na początek dnia.',
     'Wykonuj rano po przebudzeniu lub po długim siedzeniu przy komputerze. Najlepiej 2-3 razy dziennie.',
     'Nie wykonuj przy ostrym bólu, zawrotach głowy, po urazie głowy lub szyi.',
     'https://player.vimeo.com/video/placeholder1', 1),

    ('Rozciąganie mięśni karku', 'rozciaganie-karku', 'kregoslup-szyjny',
     'Rozciąganie bocznych mięśni szyi dla redukcji napięcia.',
     'Po długiej pracy przy biurku, przed snem dla rozluźnienia.',
     'Przy zawrotach głowy, ostrym bólu promieniującym do ramion.',
     'https://player.vimeo.com/video/placeholder2', 2),

    -- Odcinek piersiowy
    ('Mobilizacja klatki piersiowej', 'mobilizacja-klatki', 'odcinek-piersiowy',
     'Ćwiczenie poprawiające ruchomość odcinka piersiowego.',
     'Rano lub po długim siedzeniu. Świetne przed ćwiczeniami.',
     'Przy świeżych urazach żeber, silnym bólu w klatce piersiowej.',
     'https://player.vimeo.com/video/placeholder3', 1),

    ('Rozciąganie mięśni międzyżebrowych', 'rozciaganie-miedzyzebrowych', 'odcinek-piersiowy',
     'Głębokie rozciąganie poprawiające oddychanie.',
     'Po przebudzeniu, przy uczuciu sztywności w klatce piersiowej.',
     'Przy ostrym bólu przy oddychaniu, świeżych urazach.',
     'https://player.vimeo.com/video/placeholder4', 2),

    -- Odcinek lędźwiowy
    ('Stabilizacja lędźwiowa', 'stabilizacja-ledźwiowa', 'odcinek-ledźwiowy',
     'Podstawowe ćwiczenie stabilizujące dolny odcinek kręgosłupa.',
     'Codziennie rano i wieczorem. Kluczowe przy pracy siedzącej.',
     'Przy ostrym bólu rwy kulszowej, wypadnięciu dysku.',
     'https://player.vimeo.com/video/placeholder5', 1),

    ('Rozciąganie mięśni biodrowo-lędźwiowych', 'rozciaganie-biodrowo-ledźwiowych', 'odcinek-ledźwiowy',
     'Ćwiczenie na skrócone zginacze biodra.',
     'Po długim siedzeniu, przed i po aktywności fizycznej.',
     'Przy ostrym bólu biodra lub pachwiny.',
     'https://player.vimeo.com/video/placeholder6', 2),

    -- Bark
    ('Mobilizacja stawu barkowego', 'mobilizacja-barku', 'bark',
     'Ćwiczenie przywracające pełen zakres ruchu w barku.',
     'Rano, przed treningiem, po długim siedzeniu.',
     'Przy świeżym urazie barku, zwichnięciu, silnym bólu.',
     'https://player.vimeo.com/video/placeholder7', 1),

    ('Wzmacnianie rotatorów barku', 'wzmacnianie-rotatorow', 'bark',
     'Ćwiczenie wzmacniające mięśnie stabilizujące bark.',
     'Co drugi dzień, jako część rutyny ćwiczeniowej.',
     'Przy zapaleniu ścięgien, bezpośrednio po urazie.',
     'https://player.vimeo.com/video/placeholder8', 2),

    -- Biodro
    ('Mobilizacja stawu biodrowego', 'mobilizacja-biodra', 'biodro',
     'Ćwiczenie poprawiające ruchomość w stawie biodrowym.',
     'Codziennie, szczególnie przy siedzącym trybie życia.',
     'Przy ostrym bólu w pachwinie, po endoprotezie (bez konsultacji).',
     'https://player.vimeo.com/video/placeholder9', 1),

    ('Rozciąganie mięśni pośladkowych', 'rozciaganie-posladkow', 'biodro',
     'Ćwiczenie na napięte mięśnie pośladkowe.',
     'Po długim siedzeniu, przed i po bieganiu.',
     'Przy ostrym bólu rwy kulszowej.',
     'https://player.vimeo.com/video/placeholder10', 2),

    -- Kolano
    ('Mobilizacja rzepki', 'mobilizacja-rzepki', 'kolano',
     'Delikatna mobilizacja poprawiająca ruch rzepki.',
     'Przed aktywnością fizyczną, przy sztywności kolana.',
     'Przy świeżym urazie kolana, obrzęku, niestabilności.',
     'https://player.vimeo.com/video/placeholder11', 1),

    ('Wzmacnianie mięśnia czworogłowego', 'wzmacnianie-czworoglowego', 'kolano',
     'Ćwiczenie wzmacniające przednią część uda.',
     'Co drugi dzień, jako część rehabilitacji kolana.',
     'Przy ostrym bólu kolana, bezpośrednio po urazie.',
     'https://player.vimeo.com/video/placeholder12', 2)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_purchases_updated_at
    BEFORE UPDATE ON video_purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_categories ENABLE ROW LEVEL SECURITY;

-- Videos: Public read for active videos
CREATE POLICY "Anyone can view active videos" ON videos
    FOR SELECT USING (active = true);

-- Videos: Service role can do everything
CREATE POLICY "Service role full access to videos" ON videos
    FOR ALL USING (auth.role() = 'service_role');

-- Video categories: Public read
CREATE POLICY "Anyone can view active categories" ON video_categories
    FOR SELECT USING (active = true);

-- Video purchases: Service role only (no public access)
CREATE POLICY "Service role full access to purchases" ON video_purchases
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE videos IS 'Educational exercise videos for post-therapy support';
COMMENT ON TABLE video_purchases IS 'Purchase records with secure access tokens';
COMMENT ON TABLE video_categories IS 'Video category definitions';
COMMENT ON COLUMN video_purchases.access_token IS 'Secure token for video access (64 chars)';
COMMENT ON COLUMN video_purchases.expires_at IS '30-day access window from purchase';
