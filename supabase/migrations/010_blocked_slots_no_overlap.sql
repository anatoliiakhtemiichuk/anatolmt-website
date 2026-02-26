-- ============================================
-- MIGRATION: Prevent overlapping blocked_slots
-- ============================================
-- This migration adds a database-level constraint to prevent
-- overlapping time slots in the blocked_slots table.
--
-- Current schema:
--   id UUID PRIMARY KEY
--   date DATE NOT NULL
--   time_start TIME (NULL = full day)
--   time_end TIME (NULL = full day)
--   is_full_day BOOLEAN DEFAULT false
--   reason TEXT
--   created_at TIMESTAMPTZ
--
-- Solution:
--   1. Enable btree_gist extension (required for EXCLUDE with ranges)
--   2. Add generated column 'slot' as tstzrange
--   3. Add EXCLUDE constraint to prevent overlapping ranges
-- ============================================

-- Step 1: Enable btree_gist extension
-- Required for EXCLUDE constraints with range types
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Step 2: Add generated column for time range
-- Combines date + time_start/time_end into a tstzrange
-- For full-day blocks (time_start/time_end = NULL), uses 00:00 to 23:59:59
DO $$
BEGIN
    -- Check if column already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'blocked_slots'
        AND column_name = 'slot'
    ) THEN
        -- Add generated column
        ALTER TABLE public.blocked_slots
        ADD COLUMN slot tstzrange GENERATED ALWAYS AS (
            tstzrange(
                -- Start: date + time_start (or 00:00:00 for full day)
                (date + COALESCE(time_start, TIME '00:00:00')) AT TIME ZONE 'Europe/Warsaw',
                -- End: date + time_end (or 23:59:59.999999 for full day)
                (date + COALESCE(time_end, TIME '23:59:59.999999')) AT TIME ZONE 'Europe/Warsaw',
                -- Bounds: [) = inclusive start, exclusive end
                '[)'
            )
        ) STORED;

        RAISE NOTICE 'Added generated column "slot" to blocked_slots';
    ELSE
        RAISE NOTICE 'Column "slot" already exists in blocked_slots';
    END IF;
END $$;

-- Step 3: Add EXCLUDE constraint to prevent overlapping ranges
DO $$
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'blocked_slots_no_overlap'
        AND conrelid = 'public.blocked_slots'::regclass
    ) THEN
        -- Add the EXCLUDE constraint
        ALTER TABLE public.blocked_slots
        ADD CONSTRAINT blocked_slots_no_overlap
        EXCLUDE USING gist (slot WITH &&);

        RAISE NOTICE 'Added EXCLUDE constraint "blocked_slots_no_overlap"';
    ELSE
        RAISE NOTICE 'Constraint "blocked_slots_no_overlap" already exists';
    END IF;
END $$;

-- Step 4: Create index on the slot column for faster lookups
CREATE INDEX IF NOT EXISTS idx_blocked_slots_slot
ON public.blocked_slots USING gist (slot);

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- ============================================
-- VERIFICATION & TEST
-- ============================================
--
-- After running this migration, test overlap prevention:
--
-- -- Test 1: Insert a blocked slot
-- INSERT INTO blocked_slots (date, time_start, time_end, is_full_day, reason)
-- VALUES ('2026-03-15', '10:00', '12:00', false, 'Test slot 1');
-- -- Expected: SUCCESS
--
-- -- Test 2: Try to insert overlapping slot (should FAIL)
-- INSERT INTO blocked_slots (date, time_start, time_end, is_full_day, reason)
-- VALUES ('2026-03-15', '11:00', '13:00', false, 'Test slot 2 - overlapping');
-- -- Expected: ERROR - conflicting key value violates exclusion constraint "blocked_slots_no_overlap"
--
-- -- Test 3: Insert non-overlapping slot (should succeed)
-- INSERT INTO blocked_slots (date, time_start, time_end, is_full_day, reason)
-- VALUES ('2026-03-15', '14:00', '16:00', false, 'Test slot 3 - non-overlapping');
-- -- Expected: SUCCESS
--
-- -- Test 4: Full day block prevents any slot on that day
-- INSERT INTO blocked_slots (date, time_start, time_end, is_full_day, reason)
-- VALUES ('2026-03-16', NULL, NULL, true, 'Full day block');
-- -- Expected: SUCCESS
--
-- INSERT INTO blocked_slots (date, time_start, time_end, is_full_day, reason)
-- VALUES ('2026-03-16', '10:00', '11:00', false, 'Slot during full day block');
-- -- Expected: ERROR - conflicting key value violates exclusion constraint
--
-- -- Cleanup test data:
-- DELETE FROM blocked_slots WHERE reason LIKE 'Test slot%' OR reason LIKE 'Full day block%';
--
-- ============================================
-- CHECK CONSTRAINT STATUS
-- ============================================
-- SELECT conname, contype, pg_get_constraintdef(oid)
-- FROM pg_constraint
-- WHERE conrelid = 'public.blocked_slots'::regclass;
--
-- ============================================
-- CHECK GENERATED COLUMN
-- ============================================
-- SELECT id, date, time_start, time_end, is_full_day, slot
-- FROM blocked_slots
-- ORDER BY date, time_start;
