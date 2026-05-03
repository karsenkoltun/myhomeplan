-- ============================================================
-- Account Members (Option A: linked separate logins)
-- ============================================================
-- Lets a primary profile (owner) invite additional users to their
-- myhomeplan account. Each member has their own auth.users row and
-- profiles row; this table just links them to the owner and tracks
-- the invite lifecycle.
--
-- Status flow:  pending -> active  (or) pending -> revoked
--               active  -> revoked

CREATE TABLE IF NOT EXISTS account_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Whose account this membership belongs to
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- The member's profile (null until they accept the invite)
  member_id uuid REFERENCES profiles(id) ON DELETE CASCADE,

  -- Who issued the invite (usually = owner_id, but could be a manager member)
  invited_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Email the invite was sent to (used to match on signup)
  invited_email text NOT NULL,

  -- Role within the account
  role text NOT NULL DEFAULT 'member'
    CHECK (role IN ('manager', 'member', 'viewer')),

  -- Invite/membership status
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'revoked')),

  -- One-time invite token (for accepting the invite from an email link)
  invite_token text UNIQUE,
  invite_expires_at timestamptz,

  -- Timestamps
  invited_at   timestamptz NOT NULL DEFAULT now(),
  accepted_at  timestamptz,
  revoked_at   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  -- A given email can only have one outstanding membership per account
  CONSTRAINT account_members_unique_email_per_owner
    UNIQUE (owner_id, invited_email)
);

CREATE INDEX IF NOT EXISTS idx_account_members_owner
  ON account_members(owner_id);
CREATE INDEX IF NOT EXISTS idx_account_members_member
  ON account_members(member_id);
CREATE INDEX IF NOT EXISTS idx_account_members_email
  ON account_members(lower(invited_email));
CREATE INDEX IF NOT EXISTS idx_account_members_status
  ON account_members(status);

-- Keep updated_at fresh
CREATE OR REPLACE FUNCTION account_members_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_account_members_updated_at ON account_members;
CREATE TRIGGER trg_account_members_updated_at
  BEFORE UPDATE ON account_members
  FOR EACH ROW EXECUTE FUNCTION account_members_set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE account_members ENABLE ROW LEVEL SECURITY;

-- Owner: full control over rows where they are the owner
CREATE POLICY account_members_owner_select
  ON account_members FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY account_members_owner_insert
  ON account_members FOR INSERT
  WITH CHECK (owner_id = auth.uid() AND invited_by = auth.uid());

CREATE POLICY account_members_owner_update
  ON account_members FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY account_members_owner_delete
  ON account_members FOR DELETE
  USING (owner_id = auth.uid());

-- Member: can see their own membership rows (active or pending via email)
CREATE POLICY account_members_self_select
  ON account_members FOR SELECT
  USING (
    member_id = auth.uid()
    OR lower(invited_email) = lower((SELECT email FROM profiles WHERE id = auth.uid()))
  );

-- Member: can accept their own invite (pending -> active, sets member_id)
CREATE POLICY account_members_self_accept
  ON account_members FOR UPDATE
  USING (
    status = 'pending'
    AND lower(invited_email) = lower((SELECT email FROM profiles WHERE id = auth.uid()))
  )
  WITH CHECK (
    member_id = auth.uid()
    AND status = 'active'
  );

-- ============================================================
-- Helper: resolve the "account" a user is acting under
-- ============================================================
-- Returns owner_id for all profiles a user is an active member of,
-- plus their own id (they are always owner of their own account).
CREATE OR REPLACE FUNCTION user_account_ids(uid uuid)
RETURNS TABLE (account_id uuid, role text) AS $$
  SELECT uid AS account_id, 'owner'::text AS role
  UNION ALL
  SELECT owner_id AS account_id, role
  FROM account_members
  WHERE member_id = uid AND status = 'active';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION user_account_ids(uuid) TO authenticated;
