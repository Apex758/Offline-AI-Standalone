-- =============================================================================
-- OAK License System - Supabase Migration (Project A layout)
-- =============================================================================
-- Schema:   authz
-- Tables:   oak_licenses, support_reports
-- RPCs:     validate_oak, submit_support_report, check_support_updates
--
-- Project A notes:
--   authz.memberships PK = auth0_sub (TEXT). No UUID id column.
--   authz.schools(id TEXT PK, name TEXT, member_state_id TEXT)
--   No member_states lookup table - territory codes are resolved inline
--   in validate_oak (see oak_migration_v2_names.sql).
-- =============================================================================


-- =============================================================================
-- SECTION 1: Schema Setup
-- =============================================================================

CREATE SCHEMA IF NOT EXISTS authz;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =============================================================================
-- SECTION 2: oak_licenses Table
-- =============================================================================
-- Stores one OAK license per teacher. Bound to a device on first activation
-- in the desktop app.
-- License format: OAK-<teacherID>-<schoolID>-<salt>
-- =============================================================================

CREATE TABLE IF NOT EXISTS authz.oak_licenses (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Auth0 subject identifier for the license owner.
    -- FK to authz.memberships.auth0_sub (the real PK in Project A).
    auth0_sub           TEXT        NOT NULL
                                    REFERENCES authz.memberships(auth0_sub)
                                    ON DELETE RESTRICT,

    -- The OAK license string: OAK-<teacherID>-<schoolID>-<salt>
    oak_license         TEXT        NOT NULL UNIQUE,

    -- Identifiers embedded in the license string.
    -- Denormalised at issue time so the license keeps working even if the
    -- membership row is later edited.
    teacher_id          TEXT        NOT NULL,
    school_id           TEXT        NOT NULL,

    -- Maps to member_state_id in the memberships table.
    territory_id        TEXT        NOT NULL,

    -- Lifecycle status of this license.
    status              TEXT        NOT NULL DEFAULT 'active'
                                    CHECK (status IN ('active', 'revoked', 'expired')),

    -- Populated on first app activation; used for device binding.
    device_id           TEXT,

    -- Timestamps
    created_at          TIMESTAMPTZ DEFAULT now(),
    last_validated_at   TIMESTAMPTZ,
    expires_at          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_oak_licenses_oak_license
    ON authz.oak_licenses (oak_license);

CREATE INDEX IF NOT EXISTS idx_oak_licenses_auth0_sub
    ON authz.oak_licenses (auth0_sub);

CREATE INDEX IF NOT EXISTS idx_oak_licenses_status
    ON authz.oak_licenses (status);


-- =============================================================================
-- SECTION 3: support_reports Table
-- =============================================================================
-- Stores in-app support tickets submitted by licensed teachers.
-- Linked to an OAK license; admin_response is polled by the desktop app.
-- =============================================================================

CREATE TABLE IF NOT EXISTS authz.support_reports (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),

    license_id          UUID        REFERENCES authz.oak_licenses(id)
                                    ON DELETE SET NULL,

    oak_license         TEXT        NOT NULL,

    title               TEXT        NOT NULL,
    type                TEXT        NOT NULL
                                    CHECK (type IN ('bug', 'feature', 'ui', 'performance')),
    description         TEXT        NOT NULL,

    system_snapshot     JSONB,
    screenshot_url      TEXT,

    status              TEXT        NOT NULL DEFAULT 'pending'
                                    CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),

    admin_response      TEXT,

    created_at          TIMESTAMPTZ DEFAULT now(),
    updated_at          TIMESTAMPTZ DEFAULT now(),
    resolved_at         TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_support_reports_oak_license
    ON authz.support_reports (oak_license);

CREATE INDEX IF NOT EXISTS idx_support_reports_status
    ON authz.support_reports (status);


-- =============================================================================
-- SECTION 4: RPC - validate_oak
-- =============================================================================
-- Called by the desktop app on startup / periodic validation.
--
-- NOTE: This file creates a baseline validate_oak that returns IDs only.
-- oak_migration_v2_names.sql REPLACES this function with a version that
-- also resolves school_name and territory_name. Run v2 after this file.
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
    v_license       authz.oak_licenses%ROWTYPE;
    v_membership    authz.memberships%ROWTYPE;
    v_teacher_name  TEXT;
BEGIN

    SELECT *
      INTO v_license
      FROM authz.oak_licenses
     WHERE oak_license = p_oak_license;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'error', 'License not found');
    END IF;

    IF v_license.status != 'active' THEN
        RETURN jsonb_build_object('valid', false, 'error', 'License is ' || v_license.status);
    END IF;

    IF v_license.expires_at IS NOT NULL AND v_license.expires_at < now() THEN
        UPDATE authz.oak_licenses SET status = 'expired' WHERE id = v_license.id;
        RETURN jsonb_build_object('valid', false, 'error', 'License has expired');
    END IF;

    -- Join membership via auth0_sub (the real PK in Project A)
    SELECT *
      INTO v_membership
      FROM authz.memberships
     WHERE auth0_sub = v_license.auth0_sub;

    IF NOT FOUND OR v_membership.status != 'approved' THEN
        RETURN jsonb_build_object('valid', false, 'error', 'Membership is not approved');
    END IF;

    v_teacher_name := COALESCE(v_membership.full_name, v_license.teacher_id);

    -- Device binding
    IF v_license.device_id IS NULL THEN
        UPDATE authz.oak_licenses
           SET device_id = p_device_id, last_validated_at = now()
         WHERE id = v_license.id;
    ELSIF v_license.device_id != p_device_id THEN
        RETURN jsonb_build_object('valid', false, 'error', 'License bound to another device');
    ELSE
        UPDATE authz.oak_licenses SET last_validated_at = now() WHERE id = v_license.id;
    END IF;

    RETURN jsonb_build_object(
        'valid',        true,
        'teacher_name', v_teacher_name,
        'school_id',    v_license.school_id,
        'territory_id', v_license.territory_id
    );

END;
$$;


-- =============================================================================
-- SECTION 5: RPC - submit_support_report
-- =============================================================================

CREATE OR REPLACE FUNCTION authz.submit_support_report(
    p_oak_license       TEXT,
    p_title             TEXT,
    p_type              TEXT,
    p_description       TEXT,
    p_system_snapshot   JSONB  DEFAULT NULL,
    p_screenshot_url    TEXT   DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_license_id    UUID;
    v_report_id     UUID;
BEGIN

    SELECT id
      INTO v_license_id
      FROM authz.oak_licenses
     WHERE oak_license = p_oak_license
       AND status      = 'active';

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Active license not found');
    END IF;

    IF p_type NOT IN ('bug', 'feature', 'ui', 'performance') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid report type: ' || p_type);
    END IF;

    INSERT INTO authz.support_reports (
        license_id, oak_license, title, type, description,
        system_snapshot, screenshot_url, status, created_at, updated_at
    )
    VALUES (
        v_license_id, p_oak_license, p_title, p_type, p_description,
        p_system_snapshot, p_screenshot_url, 'pending', now(), now()
    )
    RETURNING id INTO v_report_id;

    RETURN jsonb_build_object('success', true, 'report_id', v_report_id);

END;
$$;


-- =============================================================================
-- SECTION 6: RPC - check_support_updates
-- =============================================================================

CREATE OR REPLACE FUNCTION authz.check_support_updates(
    p_oak_license TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_reports JSONB;
BEGIN

    SELECT jsonb_agg(
        jsonb_build_object(
            'report_id',       id,
            'title',           title,
            'type',            type,
            'description',     description,
            'status',          status,
            'admin_response',  admin_response,
            'created_at',      created_at,
            'resolved_at',     resolved_at
        )
        ORDER BY resolved_at DESC
    )
    INTO v_reports
    FROM authz.support_reports
    WHERE oak_license    = p_oak_license
      AND status         = 'resolved'
      AND admin_response IS NOT NULL;

    RETURN COALESCE(v_reports, '[]'::jsonb);

END;
$$;


-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
