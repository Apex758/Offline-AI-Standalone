# OAK Deployment Guide

Complete step-by-step instructions for deploying the OAK (OECS Authentication Key) system
across the Electron desktop app and the OAK Portal web app.

---

## Prerequisites

Before starting, make sure you have access to:

- **Supabase Project A** dashboard (the one with `authz.memberships` table)
  - URL: `https://lkdwldwtdzouvahvrcbe.supabase.co`
- **Auth0** dashboard (`dev-omn0pkrp0pd78lwa.us.auth0.com`)
- **Vercel** account (SSO Demo already deployed)
- **GitHub** repo for the SSO SandBox Demo
- A packaged build of OECS Teacher Assistant (`.exe` installer)

---

## Step 1: Run the SQL Migration on Supabase A

This creates the OAK license and support tables plus the RPC functions.

1. Open your Supabase Project A dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **New query**
4. Open the file `backend/schemas/oak_migration.sql` from the Offline AI Standalone project
5. Copy the entire contents and paste into the SQL Editor
6. Click **Run**

You should see output confirming creation of:
- `authz.oak_licenses` table
- `authz.support_reports` table
- `authz.validate_oak()` function
- `authz.submit_support_report()` function
- `authz.check_support_updates()` function

### Verify it worked

Run these test queries in the SQL Editor:

```sql
-- Should return: {"valid": false, "error": "License not found"}
SELECT authz.validate_oak('OAK-TEST-001-abcdef', 'device-test-123');

-- Should return: []
SELECT authz.check_support_updates('OAK-TEST-001-abcdef');
```

### Add school_id to memberships (if missing)

If your memberships table does not already have a `school_id` column:

```sql
ALTER TABLE authz.memberships
ADD COLUMN IF NOT EXISTS school_id TEXT;
```

---

## Step 2: Create Supabase Storage Buckets

Go to **Storage** in the Supabase Project A dashboard.

### Bucket 1: releases

1. Click **New bucket**
2. Name: `releases`
3. Public bucket: **OFF** (private)
4. File size limit: `500` MB
5. Allowed MIME types: leave blank (allow all)
6. Click **Create bucket**

This bucket stores packaged app installers and model files. The folder structure should be:

```
releases/
  app/
    v2.0.0/
      OECS-Teacher-Assistant-Setup-2.0.0.exe
    v2.1.0/
      OECS-Teacher-Assistant-Setup-2.1.0.exe
  models/
    gemma-2b.gguf
    image_generation/
      sdxl-turbo.safetensors
```

### Bucket 2: support-attachments

1. Click **New bucket**
2. Name: `support-attachments`
3. Public bucket: **OFF** (private)
4. File size limit: `10` MB
5. Allowed MIME types: `image/png, image/jpeg, image/webp, application/json`
6. Click **Create bucket**

### Set Storage Policies

Go to **Storage > Policies** and add:

For the `support-attachments` bucket:

```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'support-attachments'
);
```

The `releases` bucket needs no public policies -- downloads are done via signed URLs
generated server-side using the service role key.

---

## Step 3: Update Electron App Environment Variables

The desktop app needs to point to Supabase Project A (replacing the old project).

Edit `frontend/.env`:

```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://lkdwldwtdzouvahvrcbe.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-A-anon-key>
```

To find the anon key:
1. Go to Supabase Project A dashboard
2. Go to **Settings > API**
3. Copy the `anon` / `public` key
4. Paste it as the value for `VITE_SUPABASE_ANON_KEY`

IMPORTANT: The old Supabase URL (`tovqnymwmpgmmvprxhpv.supabase.co`) is being replaced.
The `validate_license` RPC on the old project is no longer used. The new `validate_oak`
RPC lives on Project A.

---

## Step 4: Push the OAK Portal to Vercel

The SSO SandBox Demo has been extended with OAK routes. Push it to trigger a Vercel redeploy.

```bash
cd "C:\Users\LG\Desktop\Projects\SSO SandBox Demo\sso-demo"
git add -A
git commit -m "Add OAK license system, support routes, and admin panel extensions"
git push
```

### Verify Vercel Environment Variables

In the Vercel dashboard for the SSO Demo project, confirm these environment variables are set:

```
# Auth0
APP_BASE_URL=https://<your-vercel-domain>.vercel.app
AUTH0_DOMAIN=dev-omn0pkrp0pd78lwa.us.auth0.com
AUTH0_CLIENT_ID=<your-auth0-client-id>
AUTH0_CLIENT_SECRET=<your-auth0-client-secret>
AUTH0_SECRET=<random-32-character-string>
AUTH0_AUDIENCE=https://demo-sso-api

# Supabase A (Primary)
NEXT_PUBLIC_SUPABASE_URL_A=https://lkdwldwtdzouvahvrcbe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_A=<supabase-a-anon-key>
SUPABASE_SERVICE_ROLE_KEY_A=<supabase-a-service-role-key>
```

If you still have Supabase B and C variables, they can stay -- the existing SSO Demo pages
that reference them will still work. But the OAK system only uses Project A.

### Update Auth0 Callback URLs

In the Auth0 dashboard, go to your application settings and make sure the following URLs
include your Vercel domain:

- **Allowed Callback URLs**: `https://<your-vercel-domain>.vercel.app/auth/callback`
- **Allowed Logout URLs**: `https://<your-vercel-domain>.vercel.app`
- **Allowed Web Origins**: `https://<your-vercel-domain>.vercel.app`

---

## Step 5: Upload the First App Release

### Build the Electron app

```powershell
cd "C:\Users\LG\Desktop\Projects\Offline AI Standalone"
.\build-release.ps1
```

This produces the packaged installer in the `dist/` directory.

### Upload to Supabase Storage

1. Go to Supabase Project A dashboard > **Storage**
2. Open the `releases` bucket
3. Create folder: `app/v2.0.0/`
4. Upload the `.exe` installer into that folder
5. The full path should be: `app/v2.0.0/OECS-Teacher-Assistant-Setup-2.0.0.exe`

### Upload model files (optional)

If you want to gate model downloads too:

1. Create folder: `models/` in the `releases` bucket
2. Upload `.gguf` files and image generation models
3. These will be downloadable via signed URLs from the OAK Portal

---

## Step 6: Test the Full Flow

### A. Teacher generates OAK license (Web Portal)

1. Go to your Vercel URL (the OAK Portal)
2. Click **Login** -- Auth0 login screen appears
3. Log in with a teacher account
4. If membership is approved, you land on the Dashboard
5. Click **Generate OAK License**
6. The license appears in format: `OAK-XXXXXXXX-SCHOOLID-XXXXXXXX`
7. Copy the license string

### B. Teacher enters OAK in the desktop app

1. Open OECS Teacher Assistant
2. Go to **Settings > OAK License** tab
3. Paste the OAK license string
4. Click **Activate OAK License**
5. Should show green "OAK License Active" with teacher name, school, and territory
6. "Check for Updates" button should work

### C. Teacher downloads the app (Web Portal)

1. On the Dashboard, scroll to the **Downloads** section
2. Click **Download Latest Release**
3. A signed URL is generated (expires in 5 minutes)
4. The download starts in a new tab

### D. Teacher sends a support report (Desktop App)

1. In the app, go to the **Support** tab
2. Flip to **Report** side
3. Fill in a bug report with subject and description
4. Click **Submit** -- ticket is saved locally
5. Expand the ticket in the list
6. Click **Send to Cloud** button (blue, appears when OAK is active and online)
7. Button changes to "Sent" with green checkmark

### E. Admin responds to the report (Web Portal)

1. Log in as admin on the OAK Portal
2. Go to **SSO Control** (admin panel)
3. Click the **Support** tab
4. The submitted report appears under "Pending"
5. Click **Respond** on the report
6. Type a response and set status to "Resolved"
7. Click **Submit Response**

### F. Teacher sees the response (Desktop App)

1. The app polls for resolved reports every 5 minutes
2. When a response comes back:
   - The ticket status updates to "Resolved"
   - A green "Admin Response" box appears in the ticket details
3. The teacher can read the admin's reply directly in the app

---

## Architecture Overview

```
Teacher (Browser)                    Teacher (Desktop App)
       |                                      |
       v                                      v
  OAK Portal (Vercel)                 OECS Teacher Assistant
  - Auth0 login                       - OAK license input
  - Generate OAK                      - Validate via Supabase RPC
  - Download app                      - Send support via RPC
  - View support history              - Poll for responses
       |                                      |
       v                                      v
  +-------------------------------------------------+
  |           Supabase Project A                     |
  |                                                  |
  |  authz.memberships    (user management)          |
  |  authz.roster_entries (auto-approval list)       |
  |  authz.oak_licenses   (license records)          |
  |  authz.support_reports (support tickets)         |
  |                                                  |
  |  Storage: releases/         (app + models)       |
  |  Storage: support-attachments/ (screenshots)     |
  |                                                  |
  |  RPCs:                                           |
  |    validate_oak()           (license validation) |
  |    submit_support_report()  (ticket submission)  |
  |    check_support_updates()  (poll for responses) |
  +-------------------------------------------------+
       ^
       |
  Admin (Browser)
  - OAK Portal /sso-control
  - Manage users, licenses, support
```

---

## API Reference

### OAK License Endpoints (Web Portal)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/oak/generate` | Auth0 session | Generate OAK for logged-in teacher |
| POST | `/api/oak/validate` | None (OAK in body) | Validate OAK license (desktop app) |
| POST | `/api/oak/revoke` | Auth0 session | Revoke and regenerate license |
| POST | `/api/oak/download-link` | Auth0 session | Get signed download URL (5 min) |
| GET | `/api/oak/licenses?status=active` | Auth0 session | List all licenses (admin) |
| PATCH | `/api/oak/licenses/[id]` | Auth0 session | Update license status (admin) |

### Support Endpoints (Web Portal)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/support/submit` | None (OAK in body) | Submit support report (desktop app) |
| POST | `/api/support/check` | None (OAK in body) | Poll for resolved reports (desktop app) |
| GET | `/api/support/list?status=pending` | Auth0 session | List reports (admin) |
| PATCH | `/api/support/[id]/respond` | Auth0 session | Admin responds to report |

### Supabase RPCs (Called directly by Desktop App)

| Function | Parameters | Description |
|----------|-----------|-------------|
| `validate_oak` | `p_oak_license`, `p_device_id` | Validate license, bind device |
| `submit_support_report` | `p_oak_license`, `p_title`, `p_type`, `p_description`, `p_system_snapshot?`, `p_screenshot_url?` | Submit ticket |
| `check_support_updates` | `p_oak_license` | Get resolved tickets with admin responses |

---

## OAK License Format

```
OAK-<TEACHER_ID>-<SCHOOL_ID>-<SALT>
```

- **TEACHER_ID**: First 8 characters of the membership UUID (dashes stripped, uppercased)
- **SCHOOL_ID**: From the memberships table `school_id` field (or "NONE")
- **SALT**: Random 8-character hex string (unique per license)

Example: `OAK-A1B2C3D4-SCH001-F9E8D7C6`

---

## Troubleshooting

### "License not found" when activating in the desktop app
- Confirm you ran `oak_migration.sql` on Supabase A (not the old project)
- Confirm `frontend/.env` points to Supabase A URL and anon key
- Confirm the OAK license was generated on the web portal and exists in `authz.oak_licenses`

### "License bound to another device"
- Each OAK license binds to the first device that activates it
- To unbind: log into the OAK Portal, go to Dashboard, click **Revoke & Regenerate**
- This creates a new license with a new salt and clears the device binding

### "Membership is not approved"
- The teacher's membership must be `status = 'approved'` in `authz.memberships`
- Admin needs to approve them via the SSO Control panel on the web portal

### "Students are not permitted to generate licenses"
- Only teachers and admins can generate OAK licenses
- Students need their role changed to 'teacher' by an admin

### Support reports not syncing
- Confirm the desktop app is online (can reach Supabase)
- Confirm the OAK license is active (green status in Settings)
- The app polls every 5 minutes -- wait or restart the app to trigger an immediate check
- Check browser console for errors: `Cloud sync error: ...`

### Vercel deployment fails
- Confirm all environment variables are set in Vercel dashboard
- Supabase B and C variables are optional for OAK (but needed if old SSO Demo pages are kept)
- Check the Vercel build logs for TypeScript errors

### Auth0 callback errors
- Confirm callback URLs in Auth0 dashboard include your Vercel domain
- Both `http://localhost:3000` (dev) and `https://<vercel-domain>.vercel.app` (prod)

---

## Files Reference

### Offline AI Standalone (Desktop App)

| File | Purpose |
|------|---------|
| `backend/schemas/oak_migration.sql` | Supabase schema -- tables and RPCs |
| `backend/schemas/SUPABASE_SETUP.md` | Supabase setup reference |
| `frontend/.env` | Supabase URL and anon key |
| `frontend/src/contexts/LicenseContext.tsx` | OAK license state management |
| `frontend/src/components/Settings.tsx` | OAK license input UI (LicenseSection) |
| `frontend/src/components/SupportReporting.tsx` | Support with cloud sync |
| `frontend/src/components/LicenseGate.tsx` | Auto-update trigger on license |
| `frontend/src/lib/supabase.ts` | Supabase client |

### SSO SandBox Demo (OAK Portal)

| File | Purpose |
|------|---------|
| `app/api/oak/generate/route.ts` | Generate OAK license |
| `app/api/oak/validate/route.ts` | Validate OAK (desktop app) |
| `app/api/oak/revoke/route.ts` | Revoke and regenerate |
| `app/api/oak/download-link/route.ts` | Signed download URL |
| `app/api/oak/licenses/route.ts` | List licenses (admin) |
| `app/api/oak/licenses/[id]/route.ts` | Update license status |
| `app/api/support/submit/route.ts` | Receive support report |
| `app/api/support/check/route.ts` | Poll for resolved reports |
| `app/api/support/list/route.ts` | List reports (admin) |
| `app/api/support/[id]/respond/route.ts` | Admin responds |
| `app/dashboard/page.tsx` | Teacher dashboard |
| `app/dashboard/GenerateLicenseButton.tsx` | License generation UI |
| `app/dashboard/DownloadButton.tsx` | Gated download UI |
| `app/sso-control/page.tsx` | Admin panel (Users + Licenses + Support) |
| `lib/supabaseAdmin.ts` | Supabase service role clients |
| `lib/sso-check.ts` | Membership lookup logic |
| `lib/auth0.ts` | Auth0 client |
| `middleware.ts` | Auth0 session middleware |
