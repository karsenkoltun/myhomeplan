-- Contractor Compensation & Pricing Pipeline
-- Adds contractor_service_rates table and contractor_payout column to service_bookings

-- 1. Add contractor_payout column to service_bookings
ALTER TABLE service_bookings
ADD COLUMN IF NOT EXISTS contractor_payout numeric;

-- 2. Create contractor_service_rates table
CREATE TABLE IF NOT EXISTS contractor_service_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_profile_id uuid NOT NULL REFERENCES contractor_profiles(id) ON DELETE CASCADE,
  service_id text NOT NULL,
  individual_rate numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(contractor_profile_id, service_id)
);

-- 3. Enable RLS
ALTER TABLE contractor_service_rates ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies - contractors can manage their own rates
CREATE POLICY "Contractors can view own rates"
  ON contractor_service_rates FOR SELECT
  USING (
    contractor_profile_id IN (
      SELECT id FROM contractor_profiles WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Contractors can insert own rates"
  ON contractor_service_rates FOR INSERT
  WITH CHECK (
    contractor_profile_id IN (
      SELECT id FROM contractor_profiles WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Contractors can update own rates"
  ON contractor_service_rates FOR UPDATE
  USING (
    contractor_profile_id IN (
      SELECT id FROM contractor_profiles WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Contractors can delete own rates"
  ON contractor_service_rates FOR DELETE
  USING (
    contractor_profile_id IN (
      SELECT id FROM contractor_profiles WHERE profile_id = auth.uid()
    )
  );

-- 5. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_contractor_service_rates_profile
  ON contractor_service_rates(contractor_profile_id);

-- 6. Backfill existing completed bookings with contractor_payout (75% of price)
UPDATE service_bookings
SET contractor_payout = price * 0.75
WHERE status = 'completed'
  AND contractor_payout IS NULL
  AND price > 0;
