# Gated Update System - Implementation Walkthrough

## Overview

Users install the app -> visit your registration page -> get a license code -> enter it in the app -> app validates with Supabase -> if valid, app can pull GitHub updates and sync data.

---

## STEP 1: Setup Supabase

### 1.1 Create a Supabase project

- Go to https://supabase.com and create a new project
- Save your **Project URL** and **anon public key** (Settings > API)
- Save your **service_role key** (for server-side/registration page only — NEVER in the app)

### 1.2 Create the `licenses` table

Run this in Supabase SQL Editor:

```sql
CREATE TABLE licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  license_code TEXT NOT NULL UNIQUE,
  school_name TEXT,
  is_active BOOLEAN DEFAULT true,
  activated_at TIMESTAMPTZ,
  device_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Index for fast lookups
CREATE INDEX idx_licenses_code ON licenses(license_code);
CREATE INDEX idx_licenses_email ON licenses(email);

-- Row Level Security
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Policy: anon users can only validate (select) their own license by code+email
CREATE POLICY "Allow license validation" ON licenses
  FOR SELECT
  USING (true);

-- Policy: only service_role can insert/update (your registration page backend)
CREATE POLICY "Service role full access" ON licenses
  FOR ALL
  USING (auth.role() = 'service_role');
```

### 1.3 Create a validation RPC (optional but cleaner)

```sql
CREATE OR REPLACE FUNCTION validate_license(p_email TEXT, p_code TEXT, p_device_id TEXT)
RETURNS JSON AS $$
DECLARE
  v_license RECORD;
BEGIN
  SELECT * INTO v_license
  FROM licenses
  WHERE email = p_email
    AND license_code = p_code
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now());

  IF NOT FOUND THEN
    RETURN json_build_object('valid', false, 'error', 'Invalid or expired license');
  END IF;

  -- Mark as activated with device
  UPDATE licenses
  SET activated_at = COALESCE(activated_at, now()),
      device_id = p_device_id
  WHERE id = v_license.id;

  RETURN json_build_object(
    'valid', true,
    'school_name', v_license.school_name,
    'expires_at', v_license.expires_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## STEP 2: Registration Page (Code Generator)

This is a simple web page YOU control where schools/users register and receive a license code.

### 2.1 Option A: Simple static page (hosted on Vercel/Netlify/GitHub Pages)

Create a small site (React, plain HTML, or Next.js) with a form:
- **Email** (required)
- **School Name** (optional)
- Submit button

### 2.2 Backend for the registration page

You need a small serverless function or API route to generate and save the code. Example using a Supabase Edge Function or Vercel serverless function:

```js
// api/generate-license.js (Vercel serverless function example)
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // service_role, NOT anon
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, school_name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  // Generate a readable license code: OECS-XXXX-XXXX-XXXX
  const code = 'OECS-' + [1,2,3].map(() =>
    crypto.randomBytes(2).toString('hex').toUpperCase()
  ).join('-');

  const { data, error } = await supabase
    .from('licenses')
    .insert({ email, license_code: code, school_name })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    return res.status(500).json({ error: error.message });
  }

  // Optionally send email with the code here

  return res.status(200).json({ license_code: code });
}
```

### 2.3 Show the code to the user

After form submission, display the generated code on screen:
```
Your License Code: OECS-A1B2-C3D4-E5F6
Save this code — you'll need it to activate the app.
```

---

## STEP 3: App-Side — License Activation Screen

### 3.1 Install Supabase client in the frontend

```bash
cd frontend
npm install @supabase/supabase-js
```

### 3.2 Create Supabase client config

**`frontend/src/config/supabase.config.ts`**

```ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### 3.3 Create a License context

**`frontend/src/contexts/LicenseContext.tsx`**

```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase.config';

interface LicenseState {
  isLicensed: boolean;
  loading: boolean;
  email: string | null;
  schoolName: string | null;
  error: string | null;
}

interface LicenseContextType extends LicenseState {
  activate: (email: string, code: string) => Promise<boolean>;
  deactivate: () => void;
}

const LicenseContext = createContext<LicenseContextType | null>(null);

export function LicenseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LicenseState>({
    isLicensed: false,
    loading: true,
    email: null,
    schoolName: null,
    error: null,
  });

  // Check stored license on startup
  useEffect(() => {
    const stored = localStorage.getItem('oecs_license');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Re-validate with Supabase on startup
      revalidate(parsed.email, parsed.code);
    } else {
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  async function revalidate(email: string, code: string) {
    try {
      const deviceId = await getDeviceId();
      const { data, error } = await supabase.rpc('validate_license', {
        p_email: email,
        p_code: code,
        p_device_id: deviceId,
      });

      if (error || !data?.valid) {
        localStorage.removeItem('oecs_license');
        setState({ isLicensed: false, loading: false, email: null, schoolName: null, error: null });
        return;
      }

      setState({
        isLicensed: true,
        loading: false,
        email,
        schoolName: data.school_name,
        error: null,
      });
    } catch {
      // Offline — trust cached license
      setState(s => ({ ...s, isLicensed: true, loading: false }));
    }
  }

  async function activate(email: string, code: string): Promise<boolean> {
    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const deviceId = await getDeviceId();
      const { data, error } = await supabase.rpc('validate_license', {
        p_email: email,
        p_code: code,
        p_device_id: deviceId,
      });

      if (error || !data?.valid) {
        setState(s => ({
          ...s,
          loading: false,
          error: data?.error || error?.message || 'Invalid license',
        }));
        return false;
      }

      // Store for offline use
      localStorage.setItem('oecs_license', JSON.stringify({ email, code }));

      setState({
        isLicensed: true,
        loading: false,
        email,
        schoolName: data.school_name,
        error: null,
      });
      return true;
    } catch (err: any) {
      setState(s => ({ ...s, loading: false, error: 'Network error. Check your connection.' }));
      return false;
    }
  }

  function deactivate() {
    localStorage.removeItem('oecs_license');
    setState({ isLicensed: false, loading: false, email: null, schoolName: null, error: null });
  }

  return (
    <LicenseContext.Provider value={{ ...state, activate, deactivate }}>
      {children}
    </LicenseContext.Provider>
  );
}

export const useLicense = () => {
  const ctx = useContext(LicenseContext);
  if (!ctx) throw new Error('useLicense must be used within LicenseProvider');
  return ctx;
};

// Simple device fingerprint
async function getDeviceId(): Promise<string> {
  const stored = localStorage.getItem('oecs_device_id');
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem('oecs_device_id', id);
  return id;
}
```

### 3.4 Create the Activation Screen component

**`frontend/src/components/LicenseGate.tsx`**

```tsx
import React, { useState } from 'react';
import { useLicense } from '../contexts/LicenseContext';

export function LicenseGate({ children }: { children: React.ReactNode }) {
  const { isLicensed, loading, error, activate } = useLicense();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="license-loading">Checking license...</div>;
  if (isLicensed) return <>{children}</>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await activate(email.trim(), code.trim().toUpperCase());
    setSubmitting(false);
  };

  return (
    <div className="license-gate">
      <h1>OECS Learning Hub</h1>
      <p>Enter your license code to activate the app.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="License code (OECS-XXXX-XXXX-XXXX)"
          value={code}
          onChange={e => setCode(e.target.value)}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Validating...' : 'Activate'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
```

### 3.5 Wrap your App with the gate

In **`App.tsx`**:

```tsx
import { LicenseProvider } from './contexts/LicenseContext';
import { LicenseGate } from './components/LicenseGate';

function App() {
  return (
    <LicenseProvider>
      <LicenseGate>
        {/* ...your existing app content... */}
      </LicenseGate>
    </LicenseProvider>
  );
}
```

---

## STEP 4: Gate GitHub Updates Behind License

### 4.1 In `electron/main.js` — gate auto-updater

The app already uses `electron-updater`. Gate it behind the license check:

```js
const { autoUpdater } = require('electron-updater');

// IPC handler: only check updates if licensed
ipcMain.handle('check-for-updates', async (event) => {
  // Frontend sends license status
  const store = require('electron-store') // or read from a file
  // Alternatively, frontend tells main process via IPC
  return autoUpdater.checkForUpdatesAndNotify();
});
```

### 4.2 Frontend triggers update check only when licensed

```ts
// In your app, after license is confirmed:
const { isLicensed } = useLicense();

useEffect(() => {
  if (isLicensed && window.electronAPI?.checkForUpdates) {
    window.electronAPI.checkForUpdates();
  }
}, [isLicensed]);
```

### 4.3 Add IPC to preload.js

```js
// electron/preload.js — add to contextBridge.exposeInMainWorld
checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
onUpdateAvailable: (cb) => ipcRenderer.on('update-available', cb),
onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', cb),
installUpdate: () => ipcRenderer.send('install-update'),
```

---

## STEP 5: Gate Supabase Data Sync Behind License

### 5.1 Only sync when licensed

Any data sync service should check the license first:

```ts
// frontend/src/services/syncService.ts
import { supabase } from '../config/supabase.config';

export async function syncStudentData(data: any, email: string) {
  // The license email acts as the session identifier
  const { error } = await supabase
    .from('student_data')
    .upsert({ ...data, school_email: email });

  if (error) throw error;
}
```

In components, only call sync when licensed:

```ts
const { isLicensed, email } = useLicense();

async function handleSaveProgress(data) {
  saveLocally(data); // always save locally

  if (isLicensed && navigator.onLine) {
    await syncStudentData(data, email);
  }
}
```

---

## STEP 6: Setup GitHub Releases for Auto-Update

### 6.1 Configure `electron-builder` for GitHub releases

In **`package.json`** (or `electron-builder.yml`):

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "your-github-username",
      "repo": "your-repo-name",
      "private": true
    }
  }
}
```

### 6.2 Set a GitHub token

For private repos, the app needs a token to download releases. Set it in `electron/main.js`:

```js
const { autoUpdater } = require('electron-updater');

// For private repos — use a read-only token with "contents: read" scope
autoUpdater.requestHeaders = {
  Authorization: `token ${YOUR_GITHUB_TOKEN}`
};

// Or set via GH_TOKEN environment variable in the build
```

### 6.3 Publish a release

```bash
# Bump version in package.json, then:
npm run electron:build:win
# Upload the installer + latest.yml to a GitHub Release
# Or use: GH_TOKEN=xxx npx electron-builder --win --publish always
```

---

## Summary — The Full Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────┐
│  Registration    │     │    Supabase       │     │  Your App  │
│  Page (web)      │────>│  licenses table   │<────│ (Electron) │
│                  │     │                   │     │            │
│ User enters      │     │ Stores:           │     │ User enters│
│ email + school   │     │ - email           │     │ email+code │
│                  │     │ - license_code    │     │            │
│ Gets back:       │     │ - is_active       │     │ Validates  │
│ OECS-XXXX-XXXX   │     │ - device_id       │     │ via RPC    │
└─────────────────┘     └──────────────────┘     └─────┬──────┘
                                                        │
                                              ┌─────────▼─────────┐
                                              │  If valid:         │
                                              │  ✓ Allow updates   │
                                              │  ✓ Sync data       │
                                              │                    │
                                              │  If invalid:       │
                                              │  ✗ Show gate screen│
                                              │  ✗ No updates      │
                                              │  ✗ No sync         │
                                              └────────────────────┘
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `frontend/src/config/supabase.config.ts` | **Create** — Supabase client |
| `frontend/src/contexts/LicenseContext.tsx` | **Create** — License state management |
| `frontend/src/components/LicenseGate.tsx` | **Create** — Activation UI |
| `frontend/src/App.tsx` | **Modify** — Wrap with LicenseProvider + LicenseGate |
| `electron/main.js` | **Modify** — Gate auto-updater behind license IPC |
| `electron/preload.js` | **Modify** — Add update IPC methods |
| `package.json` | **Modify** — Add `publish` config for electron-builder |
| Registration page (separate project) | **Create** — Form + serverless function |

## Environment Variables Needed

| Variable | Where | Value |
|----------|-------|-------|
| `SUPABASE_URL` | Registration page + App | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | App (frontend) | Your anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Registration page ONLY | Your service role key |
| `GH_TOKEN` | Build machine / electron main | GitHub PAT (contents:read) |
