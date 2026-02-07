-- Migration: Create admin tables for booking management
-- Created: 2026-02-07

-- ============================================
-- PROFILES TABLE
-- Extends auth.users with role information
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for role lookups
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================
-- BOOKINGS TABLE
-- Stores all appointment bookings
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type VARCHAR(100) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price_pln INTEGER NOT NULL,  -- Price in groszy (cents)
    date DATE NOT NULL,
    time TIME NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_date_time ON bookings(date, time);

-- ============================================
-- BLOCKED_SLOTS TABLE
-- Stores blocked time slots for availability management
-- ============================================
CREATE TABLE IF NOT EXISTS blocked_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    time_start TIME,        -- NULL means whole day blocked
    time_end TIME,          -- NULL means whole day blocked
    is_full_day BOOLEAN DEFAULT false,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for date lookups
CREATE INDEX idx_blocked_slots_date ON blocked_slots(date);

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

-- Triggers for updated_at (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
        CREATE TRIGGER update_profiles_updated_at
            BEFORE UPDATE ON profiles
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bookings_updated_at') THEN
        CREATE TRIGGER update_bookings_updated_at
            BEFORE UPDATE ON bookings
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to create profile on signup (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_new_user();
    END IF;
END
$$;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Service role has full access
CREATE POLICY "Service role full access to profiles" ON profiles
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- BOOKINGS POLICIES
-- ============================================

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings" ON bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can insert bookings
CREATE POLICY "Admins can insert bookings" ON bookings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update bookings
CREATE POLICY "Admins can update bookings" ON bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can delete bookings
CREATE POLICY "Admins can delete bookings" ON bookings
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Service role has full access (for API routes)
CREATE POLICY "Service role full access to bookings" ON bookings
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- BLOCKED_SLOTS POLICIES
-- ============================================

-- Anyone can read blocked slots (for booking form)
CREATE POLICY "Anyone can view blocked slots" ON blocked_slots
    FOR SELECT USING (true);

-- Admins can insert blocked slots
CREATE POLICY "Admins can insert blocked slots" ON blocked_slots
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update blocked slots
CREATE POLICY "Admins can update blocked slots" ON blocked_slots
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can delete blocked slots
CREATE POLICY "Admins can delete blocked slots" ON blocked_slots
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Service role has full access
CREATE POLICY "Service role full access to blocked_slots" ON blocked_slots
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- SAMPLE DATA (optional - for testing)
-- ============================================

-- Insert sample bookings for testing
INSERT INTO bookings (service_type, duration_minutes, price_pln, date, time, first_name, last_name, phone, email, notes, status)
VALUES
    ('Masaż klasyczny', 60, 18000, CURRENT_DATE, '10:00', 'Jan', 'Kowalski', '+48 123 456 789', 'jan@example.com', 'Pierwsza wizyta', 'confirmed'),
    ('Terapia manualna', 45, 15000, CURRENT_DATE, '14:00', 'Anna', 'Nowak', '+48 987 654 321', 'anna@example.com', NULL, 'confirmed'),
    ('Masaż sportowy', 90, 25000, CURRENT_DATE + INTERVAL '1 day', '09:00', 'Piotr', 'Wiśniewski', '+48 555 666 777', 'piotr@example.com', 'Ból pleców', 'confirmed'),
    ('Fizjoterapia', 60, 20000, CURRENT_DATE + INTERVAL '2 days', '11:00', 'Maria', 'Kowalczyk', '+48 111 222 333', 'maria@example.com', NULL, 'confirmed'),
    ('Masaż relaksacyjny', 60, 18000, CURRENT_DATE + INTERVAL '3 days', '16:00', 'Tomasz', 'Zieliński', '+48 444 555 666', 'tomasz@example.com', 'Stres w pracy', 'confirmed'),
    ('Masaż klasyczny', 60, 18000, CURRENT_DATE - INTERVAL '1 day', '12:00', 'Jan', 'Kowalski', '+48 123 456 789', 'jan@example.com', 'Wizyta kontrolna', 'completed')
ON CONFLICT DO NOTHING;

-- ============================================
-- ADMIN SETUP INSTRUCTIONS
-- ============================================
-- To set up the first admin user:
--
-- 1. Create a user account via Supabase Auth (email: your-email@example.com)
--    This can be done through the Supabase Dashboard or via the signup form
--
-- 2. Find the user's ID in auth.users table
--
-- 3. Update their profile to admin role:
--    UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
--
-- Or use this command with the specific email:
-- UPDATE profiles SET role = 'admin' WHERE email = 'anatol@example.com';

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE profiles IS 'User profiles extending auth.users with role information';
COMMENT ON TABLE bookings IS 'Appointment bookings for therapy sessions';
COMMENT ON TABLE blocked_slots IS 'Blocked time slots for availability management';
COMMENT ON COLUMN profiles.role IS 'User role: user or admin';
COMMENT ON COLUMN bookings.price_pln IS 'Price in groszy (cents), e.g., 18000 = 180.00 PLN';
