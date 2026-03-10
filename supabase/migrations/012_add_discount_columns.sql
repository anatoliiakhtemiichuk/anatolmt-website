-- Migration: Add discount columns to bookings table
-- Purpose: Support 10% discount for first-time clients

-- Add discount_percent column (default 0 = no discount)
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS discount_percent INTEGER DEFAULT 0;

-- Add final_price_pln column (stores the price after discount)
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS final_price_pln INTEGER;

-- For existing bookings, set final_price_pln = price_pln (no discount applied retroactively)
UPDATE public.bookings
SET final_price_pln = price_pln
WHERE final_price_pln IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.bookings.discount_percent IS 'Discount percentage applied to the booking (e.g., 10 for 10% off)';
COMMENT ON COLUMN public.bookings.final_price_pln IS 'Final price after discount in PLN (groszy)';
