# Supabase Setup Guide for OAK License System

## Prerequisites
- Supabase Project A is your primary project (the one with authz.memberships)
- You have the Supabase dashboard open or `supabase` CLI available

---

## Step 1: Run the SQL Migration

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Paste the contents of `oak_migration.sql`
4. Click **Run**

This creates:
- `authz.oak_licenses` table
- `authz.support_reports` table
- `validate_oak()` RPC function
- `submit_support_report()` RPC function
- `check_support_updates()` RPC function

---

## Step 2: Create Storage Buckets

Go to **Storage** in the Supabase dashboard and create two buckets:

### Bucket 1: `releases`
- **Name**: `releases`
- **Public**: No (private)
- **File size limit**: 500MB (for large model files)
- **Allowed MIME types**: Leave blank (allow all)

Upload structure:
```
releases/
  app/
    v2.0.0/
      OECS-Class-Coworker-Setup-2.0.0.exe
    v2.1.0/
      OECS-Class-Coworker-Setup-2.1.0.exe
  models/
    gemma-2b.gguf
    image_generation/
      sdxl-turbo.safetensors
```

### Bucket 2: `support-attachments`
- **Name**: `support-attachments`
- **Public**: No (private)
- **File size limit**: 10MB
- **Allowed MIME types**: `image/png, image/jpeg, image/webp, application/json`

---

## Step 3: Storage Policies

### releases bucket (download via signed URLs only)
```sql
-- No public access. Downloads are done via signed URLs generated server-side.
-- The web portal backend (service role key) creates signed URLs for authenticated users.
```

### support-attachments bucket
```sql
-- Allow inserts from anyone with a valid anon key (the desktop app uses this)
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'support-attachments'
);

-- Allow reads via signed URLs only (admin panel uses service role key)
```

---

## Step 4: Verify the RPC Functions

Test in the SQL Editor:

```sql
-- Test validate_oak (should return "License not found" since no licenses exist yet)
SELECT authz.validate_oak('OAK-TEST-001-abcdef', 'device-test-123');

-- Test check_support_updates (should return empty array)
SELECT authz.check_support_updates('OAK-TEST-001-abcdef');
```

---

## Step 5: Add school_id to memberships (if missing)

If your memberships table doesn't have `school_id` yet:

```sql
ALTER TABLE authz.memberships
ADD COLUMN IF NOT EXISTS school_id TEXT;
```

---

## Environment Variables Needed

### Desktop App (frontend/.env)
Already configured:
```
VITE_SUPABASE_URL=https://tovqnymwmpgmmvprxhpv.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### Web Portal (.env.local)
```
# Auth0
APP_BASE_URL=https://your-domain.vercel.app
AUTH0_DOMAIN=dev-omn0pkrp0pd78lwa.us.auth0.com
AUTH0_CLIENT_ID=<your-client-id>
AUTH0_CLIENT_SECRET=<your-client-secret>
AUTH0_SECRET=<random-32-char-string>
AUTH0_AUDIENCE=https://demo-sso-api

# Supabase A (Primary - OAK + Memberships)
NEXT_PUBLIC_SUPABASE_URL_A=https://lkdwldwtdzouvahvrcbe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_A=<anon-key>
SUPABASE_SERVICE_ROLE_KEY_A=<service-role-key>
```
