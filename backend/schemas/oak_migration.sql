-- =============================================================================
-- OAK License System - Supabase Migration
-- =============================================================================
-- Schema:   authz
-- Tables:   oak_licenses, support_reports
-- RPCs:     validate_oak, submit_support_report, check_support_updates
-- =============================================================================


-- =============================================================================
-- SECTION 1: Schema Setup
-- =============================================================================

CREATE SCHEMA IF NOT EXISTS authz;

-- Enable UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =============================================================================
-- SECTION 2: oak_licenses Table
-- =============================================================================
-- Stores one OAK license per teacher membership.
-- Binds to a device on first activation in the desktop app.
-- License format: OAK-<teacherID>-<schoolID>-<salt>
-- =============================================================================

CREATE TABLE IF NOT EXISTS authz.oak_licenses (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- FK to the teacher's membership record in the authz schema
    membership_id       UUID        NOT NULL
                                    REFERENCES authz.memberships(id)
                                    ON DELETE RESTRICT,

    -- Auth0 subject identifier for the license owner
    auth0_sub           TEXT        NOT NULL,

    -- The OAK license string: OAK-<teacherID>-<schoolID>-<salt>
    oak_license         TEXT        NOT NULL UNIQUE,

    -- Identifiers embedded in the license string
    teacher_id          TEXT        NOT NULL,
    school_id           TEXT        NOT NULL,

    -- Maps to member_state_id in the memberships table
    territory_id        TEXT        NOT NULL,

    -- Lifecycle status of this license
    status              TEXT        NOT NULL DEFAULT 'active'
                                    CHECK (status IN ('active', 'revoked', 'expired')),

    -- Populated on first app activation; used for device binding
    device_id           TEXT,

    -- Timestamps
    created_at          TIMESTAMPTZ DEFAULT now(),
    last_validated_at   TIMESTAMPTZ,
    expires_at          TIMESTAMPTZ
);

-- Index: fast lookups by the license string (used in every validation call)
CREATE INDEX IF NOT EXISTS idx_oak_licenses_oak_license
    ON authz.oak_licenses (oak_license);

-- Index: look up all licenses belonging to a given Auth0 user
CREATE INDEX IF NOT EXISTS idx_oak_licenses_auth0_sub
    ON authz.oak_licenses (auth0_sub);

-- Index: filter by status (e.g. fetch all active or all expired licenses)
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

    -- FK to the license that submitted this report (nullable on orphan cleanup)
    license_id          UUID        REFERENCES authz.oak_licenses(id)
                                    ON DELETE SET NULL,

    -- Denormalised license string for fast lookups without a join
    oak_license         TEXT        NOT NULL,

    -- Report metadata
    title               TEXT        NOT NULL,
    type                TEXT        NOT NULL
                                    CHECK (type IN ('bug', 'feature', 'ui', 'performance')),
    description         TEXT        NOT NULL,

    -- Optional: JSON blob containing system specs, logs, model info, etc.
    system_snapshot     JSONB,

    -- Optional: Supabase Storage URL for an attached screenshot
    screenshot_url      TEXT,

    -- Workflow status of this ticket
    status              TEXT        NOT NULL DEFAULT 'pending'
                                    CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),

    -- Admin reply shown to the teacher when status = 'resolved'
    admin_response      TEXT,

    -- Timestamps
    created_at          TIMESTAMPTZ DEFAULT now(),
    updated_at          TIMESTAMPTZ DEFAULT now(),
    resolved_at         TIMESTAMPTZ
);

-- Index: fetch all reports for a given license string
CREATE INDEX IF NOT EXISTS idx_support_reports_oak_license
    ON authz.support_reports (oak_license);

-- Index: filter reports by workflow status
CREATE INDEX IF NOT EXISTS idx_support_reports_status
    ON authz.support_reports (status);


-- =============================================================================
-- SECTION 4: RPC - validate_oak
-- =============================================================================
-- Called by the desktop app on startup / periodic validation.
--
-- Behaviour:
--   1. Look up the license and its membership in one join.
--   2. Reject if license status != 'active' or membership not 'approved'.
--   3. If device_id is NULL (first activation): bind device and succeed.
--   4. If device_id already set: verify it matches p_device_id.
--   5. On success: update last_validated_at and return teacher info.
--
-- Returns JSONB:
--   {valid: true,  teacher_name, school_id, territory_id}
--   {valid: false, error: <reason>}
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

    -- ------------------------------------------------------------------
    -- Step 1: Fetch the license record
    -- ------------------------------------------------------------------
    SELECT *
      INTO v_license
      FROM authz.oak_licenses
     WHERE oak_license = p_oak_license;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'License not found'
        );
    END IF;

    -- ------------------------------------------------------------------
    -- Step 2: Check license status
    -- ------------------------------------------------------------------
    IF v_license.status != 'active' THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'License is ' || v_license.status
        );
    END IF;

    -- Check expiry if an expiry date is set
    IF v_license.expires_at IS NOT NULL AND v_license.expires_at < now() THEN
        -- Mark as expired so future checks short-circuit faster
        UPDATE authz.oak_licenses
           SET status = 'expired'
         WHERE id = v_license.id;

        RETURN jsonb_build_object(
            'valid', false,
            'error', 'License has expired'
        );
    END IF;

    -- ------------------------------------------------------------------
    -- Step 3: Fetch and validate the linked membership
    -- ------------------------------------------------------------------
    SELECT *
      INTO v_membership
      FROM authz.memberships
     WHERE id = v_license.membership_id;

    IF NOT FOUND OR v_membership.status != 'approved' THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'Membership is not approved'
        );
    END IF;

    -- Resolve display name; fall back to teacher_id if the column is absent
    -- Adjust the column name below to match your memberships schema
    v_teacher_name := COALESCE(v_membership.full_name, v_license.teacher_id);

    -- ------------------------------------------------------------------
    -- Step 4: Device binding
    -- ------------------------------------------------------------------
    IF v_license.device_id IS NULL THEN
        -- First activation: bind this device to the license
        UPDATE authz.oak_licenses
           SET device_id          = p_device_id,
               last_validated_at  = now()
         WHERE id = v_license.id;

    ELSIF v_license.device_id != p_device_id THEN
        -- Device mismatch: license is already bound to a different machine
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'License bound to another device'
        );

    ELSE
        -- Correct device: just update the validation timestamp
        UPDATE authz.oak_licenses
           SET last_validated_at = now()
         WHERE id = v_license.id;
    END IF;

    -- ------------------------------------------------------------------
    -- Step 5: Return success payload
    -- ------------------------------------------------------------------
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
-- Called by the desktop app when a teacher files a support ticket.
--
-- Validates that the license is active before inserting.
-- system_snapshot and screenshot_url are optional.
--
-- Returns JSONB:
--   {success: true,  report_id: <uuid>}
--   {success: false, error: <reason>}
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

    -- ------------------------------------------------------------------
    -- Step 1: Confirm the license exists and is active
    -- ------------------------------------------------------------------
    SELECT id
      INTO v_license_id
      FROM authz.oak_licenses
     WHERE oak_license = p_oak_license
       AND status      = 'active';

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error',   'Active license not found'
        );
    END IF;

    -- ------------------------------------------------------------------
    -- Step 2: Validate the report type before inserting
    -- ------------------------------------------------------------------
    IF p_type NOT IN ('bug', 'feature', 'ui', 'performance') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error',   'Invalid report type: ' || p_type
        );
    END IF;

    -- ------------------------------------------------------------------
    -- Step 3: Insert the report
    -- ------------------------------------------------------------------
    INSERT INTO authz.support_reports (
        license_id,
        oak_license,
        title,
        type,
        description,
        system_snapshot,
        screenshot_url,
        status,
        created_at,
        updated_at
    )
    VALUES (
        v_license_id,
        p_oak_license,
        p_title,
        p_type,
        p_description,
        p_system_snapshot,
        p_screenshot_url,
        'pending',
        now(),
        now()
    )
    RETURNING id INTO v_report_id;

    -- ------------------------------------------------------------------
    -- Step 4: Return the new report id
    -- ------------------------------------------------------------------
    RETURN jsonb_build_object(
        'success',   true,
        'report_id', v_report_id
    );

END;
$$;


-- =============================================================================
-- SECTION 6: RPC - check_support_updates
-- =============================================================================
-- Called by the desktop app to poll for resolved tickets.
-- Returns all support_reports for the given license where:
--   - status = 'resolved'
--   - admin_response IS NOT NULL
--
-- Returns a JSONB array of report objects, or an empty array if none.
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
    WHERE oak_license      = p_oak_license
      AND status           = 'resolved'
      AND admin_response   IS NOT NULL;

    -- Return empty array rather than NULL when there are no results
    RETURN COALESCE(v_reports, '[]'::jsonb);

END;
$$;


-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
