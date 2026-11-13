-- ====================================================================
-- A SEAT TO STUDY - CONSOLIDATED SUPABASE POSTGRESQL MIGRATION
-- ====================================================================
-- Description: Consolidated PostgreSQL schema, relationships, indexes, 
--              and Row-Level Security (RLS) policies for A Seat to Study.
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. USERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'ADMIN', 'FACILITY_STAFF')),
    department TEXT DEFAULT 'Lovely Professional University — School of Computer Science & Engineering',
    academic_standing VARCHAR(50) DEFAULT 'Undergraduate',
    rfid_card_uid VARCHAR(100) UNIQUE,
    weekly_quota_hours NUMERIC(4, 1) DEFAULT 25.0,
    used_quota_hours NUMERIC(4, 1) DEFAULT 0.0,
    no_show_strikes INTEGER DEFAULT 0,
    avatar_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. SEATS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seat_number VARCHAR(20) UNIQUE NOT NULL,
    desk_code VARCHAR(50) NOT NULL,
    floor_level INTEGER NOT NULL CHECK (floor_level IN (1, 2, 3)),
    zone_id VARCHAR(50) NOT NULL,
    zone_name VARCHAR(200) NOT NULL,
    current_status VARCHAR(30) DEFAULT 'AVAILABLE' 
        CHECK (current_status IN ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'OFFLINE', 'MAINTENANCE')),
    amenities JSONB DEFAULT '{
        "powerSocket": true,
        "dualMonitor": false,
        "ergonomicChair": true,
        "naturalLight": false,
        "whiteboardAccess": false,
        "powerSpecs": "Dual 100W USB-C PD + AC"
    }'::jsonb,
    noise_rating VARCHAR(100) DEFAULT 'Whisper Quiet (<35 dB)',
    current_reservation_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. RESERVATIONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_code VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    seat_id UUID NOT NULL REFERENCES public.seats(id) ON DELETE CASCADE,
    seat_number VARCHAR(20) NOT NULL,
    desk_code VARCHAR(50),
    floor_level INTEGER NOT NULL,
    zone_name VARCHAR(200),
    date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    duration_hours NUMERIC(3, 1) NOT NULL,
    status VARCHAR(30) DEFAULT 'CONFIRMED' 
        CHECK (status IN ('HOLD_PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'AUTO_RELEASED', 'CANCELLED')),
    hold_expires_at TIMESTAMPTZ,
    checked_in_at TIMESTAMPTZ,
    academic_purpose VARCHAR(50) DEFAULT 'INDIVIDUAL' 
        CHECK (academic_purpose IN ('INDIVIDUAL', 'GROUP_STUDY', 'EXAM_PREP', 'RESEARCH_PROJECT')),
    sms_notification_enabled BOOLEAN DEFAULT true,
    companion_mode_enabled BOOLEAN DEFAULT false,
    rfid_tap_verified BOOLEAN DEFAULT false,
    extended_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foreign key linking seats to active reservation
ALTER TABLE public.seats 
    DROP CONSTRAINT IF EXISTS fk_seats_current_reservation;
ALTER TABLE public.seats 
    ADD CONSTRAINT fk_seats_current_reservation 
    FOREIGN KEY (current_reservation_id) 
    REFERENCES public.reservations(id) 
    ON DELETE SET NULL;

-- --------------------------------------------------------------------
-- 4. TELEMETRY LOGS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.telemetry_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    floor_level INTEGER CHECK (floor_level IN (1, 2, 3)),
    zone_id VARCHAR(50),
    category VARCHAR(50) NOT NULL,
    event_detail TEXT NOT NULL,
    target_seat_number VARCHAR(20),
    student_id VARCHAR(50),
    decibel_level NUMERIC(4, 1),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. TURNSTILE GATES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.turnstile_gates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    status VARCHAR(30) DEFAULT 'OPERATIONAL' CHECK (status IN ('OPERATIONAL', 'LOCKED_OVERFLOW', 'MAINTENANCE')),
    latency_ms INTEGER DEFAULT 8,
    total_swipes_today INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. OPERATIONAL LOGS TABLE (Admin Audit Trail)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.operational_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time_label VARCHAR(30) NOT NULL,
    category VARCHAR(50) NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    event_detail TEXT NOT NULL,
    target_unit VARCHAR(50) NOT NULL,
    floor_name VARCHAR(100) NOT NULL,
    status_color VARCHAR(30) DEFAULT 'tertiary',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. PERFORMANCE & LOOKUP INDEXES
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_student_id ON public.users(student_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_seats_seat_number ON public.seats(seat_number);
CREATE INDEX IF NOT EXISTS idx_seats_floor_status ON public.seats(floor_level, current_status);
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON public.reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_seat_id ON public.reservations(seat_id);
CREATE INDEX IF NOT EXISTS idx_reservations_code ON public.reservations(reservation_code);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_hold_expires ON public.reservations(hold_expires_at);
CREATE INDEX IF NOT EXISTS idx_operational_logs_created ON public.operational_logs(created_at DESC);

-- --------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turnstile_gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operational_logs ENABLE ROW LEVEL SECURITY;

-- Seats read access
DROP POLICY IF EXISTS "Public can view seats" ON public.seats;
CREATE POLICY "Public can view seats" ON public.seats FOR SELECT USING (true);

-- Turnstiles read access
DROP POLICY IF EXISTS "Public can view turnstile gates" ON public.turnstile_gates;
CREATE POLICY "Public can view turnstile gates" ON public.turnstile_gates FOR SELECT USING (true);

-- Telemetry read access
DROP POLICY IF EXISTS "Public can view telemetry" ON public.telemetry_logs;
CREATE POLICY "Public can view telemetry" ON public.telemetry_logs FOR SELECT USING (true);

-- Full access for service role (Express backend with SUPABASE_SECRET_KEY)
DROP POLICY IF EXISTS "Service role full access on reservations" ON public.reservations;
CREATE POLICY "Service role full access on reservations" ON public.reservations FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access on users" ON public.users;
CREATE POLICY "Service role full access on users" ON public.users FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access on seats" ON public.seats;
CREATE POLICY "Service role full access on seats" ON public.seats FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access on telemetry" ON public.telemetry_logs;
CREATE POLICY "Service role full access on telemetry" ON public.telemetry_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access on turnstiles" ON public.turnstile_gates;
CREATE POLICY "Service role full access on turnstiles" ON public.turnstile_gates FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access on logs" ON public.operational_logs;
CREATE POLICY "Service role full access on logs" ON public.operational_logs FOR ALL USING (true);

-- --------------------------------------------------------------------
-- 9. SCHEMA & TABLE PRIVILEGES FOR API ROLES
-- --------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;


