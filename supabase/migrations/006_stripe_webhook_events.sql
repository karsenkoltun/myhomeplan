-- Stripe webhook event log for idempotency
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id TEXT PRIMARY KEY,                         -- Stripe event ID (evt_xxx)
  type TEXT NOT NULL,                          -- e.g. checkout.session.completed
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  data JSONB                                   -- raw event payload (optional, for debugging)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_type ON stripe_webhook_events(type);
