-- =============================================================================
-- OAK Migration v2: validate_oak returns display names
-- =============================================================================
-- Replaces the baseline validate_oak RPC with a version that also returns
-- human-readable school_name and territory_name. The desktop app displays
-- these as locked, verified fields in Settings > Profile after OAK activation.
--
-- Idempotent: CREATE OR REPLACE FUNCTION. Safe to re-run.
--
-- PREREQUISITE: oak_migration.sql MUST be run first. This script only replaces
-- the validate_oak function body; it does not create tables.
--
-- Project A schema (confirmed):
--   authz.memberships(auth0_sub PK, full_name, school_id, member_state_id, status, role)
--   authz.schools(id PK, name, member_state_id)
--   No member_states lookup table - OECS territory codes resolved inline.
-- =============================================================================

CREATE OR REPLACE FUNCTION authz.validate_oak(
    p_oak_license   TEXT,
    p_device_id     TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_license         authz.oak_licenses%ROWTYPE;
    v_membership      authz.memberships%ROWTYPE;
    v_teacher_name    TEXT;
    v_school_name     TEXT;
    v_territory_name  TEXT;
BEGIN

    -- ------------------------------------------------------------------
    -- Step 1: Fetch the license record
    -- ------------------------------------------------------------------
    SELECT *
      INTO v_license
      FROM authz.oak_licenses
     WHERE oak_license = p_oak_license;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'error', 'License not found');
    END IF;

    -- ------------------------------------------------------------------
    -- Step 2: Check license status
    -- ------------------------------------------------------------------
    IF v_license.status != 'active' THEN
        RETURN jsonb_build_object('valid', false, 'error', 'License is ' || v_license.status);
    END IF;

    IF v_license.expires_at IS NOT NULL AND v_license.expires_at < now() THEN
        UPDATE authz.oak_licenses SET status = 'expired' WHERE id = v_license.id;
        RETURN jsonb_build_object('valid', false, 'error', 'License has expired');
    END IF;

    -- ------------------------------------------------------------------
    -- Step 3: Fetch and validate the linked membership (join via auth0_sub)
    -- ------------------------------------------------------------------
    SELECT *
      INTO v_membership
      FROM authz.memberships
     WHERE auth0_sub = v_license.auth0_sub;

    IF NOT FOUND OR v_membership.status != 'approved' THEN
        RETURN jsonb_build_object('valid', false, 'error', 'Membership is not approved');
    END IF;

    v_teacher_name := COALESCE(v_membership.full_name, v_license.teacher_id);

    -- ------------------------------------------------------------------
    -- Step 3b: Resolve school display name from authz.schools(id, name).
    -- ------------------------------------------------------------------
    SELECT name
      INTO v_school_name
      FROM authz.schools
     WHERE id = v_license.school_id;

    v_school_name := COALESCE(v_school_name, v_license.school_id);

    -- ------------------------------------------------------------------
    -- Step 3c: Resolve territory name from OECS member state codes.
    -- No lookup table exists, so hardcode the member states here.
    -- ------------------------------------------------------------------
    v_territory_name := CASE UPPER(COALESCE(v_license.territory_id, ''))
        WHEN 'AIA'  THEN 'Anguilla'
        WHEN 'ATG'  THEN 'Antigua and Barbuda'
        WHEN 'DMA'  THEN 'Dominica'
        WHEN 'GRD'  THEN 'Grenada'
        WHEN 'MSR'  THEN 'Montserrat'
        WHEN 'KNA'  THEN 'Saint Kitts and Nevis'
        WHEN 'LCA'  THEN 'Saint Lucia'
        WHEN 'VCT'  THEN 'Saint Vincent and the Grenadines'
        WHEN 'VGB'  THEN 'British Virgin Islands'
        WHEN 'MTQ'  THEN 'Martinique'
        WHEN 'GLP'  THEN 'Guadeloupe'
        WHEN 'JAM'  THEN 'Jamaica'
        WHEN 'TCA'  THEN 'Turks and Caicos Islands'
        WHEN ''     THEN NULL
        WHEN 'NONE' THEN NULL
        ELSE v_license.territory_id
    END;

    v_territory_name := COALESCE(v_territory_name, v_license.territory_id);

    -- ------------------------------------------------------------------
    -- Step 4: Device binding
    -- ------------------------------------------------------------------
    IF v_license.device_id IS NULL THEN
        UPDATE authz.oak_licenses
           SET device_id = p_device_id, last_validated_at = now()
         WHERE id = v_license.id;
    ELSIF v_license.device_id != p_device_id THEN
        RETURN jsonb_build_object('valid', false, 'error', 'License bound to another device');
    ELSE
        UPDATE authz.oak_licenses SET last_validated_at = now() WHERE id = v_license.id;
    END IF;

    -- ------------------------------------------------------------------
    -- Step 5: Return success payload with display names
    -- ------------------------------------------------------------------
    RETURN jsonb_build_object(
        'valid',          true,
        'teacher_name',   v_teacher_name,
        'school_id',      v_license.school_id,
        'school_name',    v_school_name,
        'territory_id',   v_license.territory_id,
        'territory_name', v_territory_name
    );

END;
$$;
