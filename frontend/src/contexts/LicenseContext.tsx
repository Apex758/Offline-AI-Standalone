import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface LicenseState {
  isLicensed: boolean;
  loading: boolean;
  oakLicense: string | null;
  teacherName: string | null;
  schoolId: string | null;
  schoolName: string | null;
  territoryId: string | null;
  territoryName: string | null;
  error: string | null;
}

interface LicenseContextType extends LicenseState {
  activate: (oakLicense: string) => Promise<boolean>;
  deactivate: () => void;
}

const LicenseContext = createContext<LicenseContextType | null>(null);

// Secure storage helpers -- use Electron safeStorage when available, localStorage fallback
async function secureGet(key: string): Promise<string | null> {
  try {
    const val = await window.electronAPI?.getSecureData?.(key);
    if (val !== null && val !== undefined) return val;
  } catch { /* fall through */ }
  return localStorage.getItem(key);
}

async function secureSet(key: string, value: string): Promise<void> {
  try {
    const ok = await window.electronAPI?.storeSecureData?.(key, value);
    if (ok) {
      // Successfully stored in safeStorage -- remove plaintext copy
      localStorage.removeItem(key);
      return;
    }
  } catch { /* fall through */ }
  // Fallback: localStorage (dev mode or safeStorage unavailable)
  localStorage.setItem(key, value);
}

async function secureRemove(key: string): Promise<void> {
  try {
    await window.electronAPI?.storeSecureData?.(key, null);
  } catch { /* ignore */ }
  localStorage.removeItem(key);
}

async function getDeviceId(): Promise<string> {
  // Check secure storage first, then localStorage
  const stored = await secureGet('oecs_device_id');
  if (stored) return stored;
  const id = crypto.randomUUID();
  await secureSet('oecs_device_id', id);
  return id;
}

export function LicenseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LicenseState>({
    isLicensed: false,
    loading: true,
    oakLicense: null,
    teacherName: null,
    schoolId: null,
    schoolName: null,
    territoryId: null,
    territoryName: null,
    error: null,
  });

  const lastCheckRef = useRef<number>(Date.now());

  useEffect(() => {
    (async () => {
      const stored = await secureGet('oecs_oak_license');
      if (stored) {
        revalidate(stored);
      } else {
        setState(s => ({ ...s, loading: false }));
      }
    })();
  }, []);

  useEffect(() => {
    if (!state.isLicensed || !state.oakLicense) return;

    const FOUR_HOURS = 4 * 60 * 60 * 1000;
    const ONE_HOUR = 60 * 60 * 1000;
    const license = state.oakLicense;

    const intervalId = setInterval(() => {
      revalidate(license);
    }, FOUR_HOURS);

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - lastCheckRef.current;
        if (elapsed > ONE_HOUR) {
          revalidate(license);
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.isLicensed, state.oakLicense]);

  async function revalidate(oakLicense: string) {
    lastCheckRef.current = Date.now();
    try {
      const deviceId = await getDeviceId();
      const { data, error } = await supabase.rpc('validate_oak', {
        p_oak_license: oakLicense,
        p_device_id: deviceId,
      });

      if (error || !data?.valid) {
        // License failed server validation -- clear it
        secureRemove('oecs_oak_license');
        setState({
          isLicensed: false,
          loading: false,
          oakLicense: null,
          teacherName: null,
          schoolId: null,
          schoolName: null,
          territoryId: null,
          territoryName: null,
          error: null,
        });
        return;
      }

      setState({
        isLicensed: true,
        loading: false,
        oakLicense,
        teacherName: data.teacher_name,
        schoolId: data.school_id,
        schoolName: data.school_name ?? data.school_id ?? null,
        territoryId: data.territory_id,
        territoryName: data.territory_name ?? data.territory_id ?? null,
        error: null,
      });
    } catch {
      // Offline -- trust the cached OAK license string
      if (oakLicense) {
        setState({
          isLicensed: true,
          loading: false,
          oakLicense,
          teacherName: null,
          schoolId: null,
          schoolName: null,
          territoryId: null,
          territoryName: null,
          error: null,
        });
      } else {
        setState(s => ({ ...s, loading: false }));
      }
    }
  }

  async function activate(oakLicense: string): Promise<boolean> {
    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const deviceId = await getDeviceId();
      const { data, error } = await supabase.rpc('validate_oak', {
        p_oak_license: oakLicense,
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

      // Store just the OAK license string (not JSON)
      await secureSet('oecs_oak_license', oakLicense);

      setState({
        isLicensed: true,
        loading: false,
        oakLicense,
        teacherName: data.teacher_name,
        schoolId: data.school_id,
        schoolName: data.school_name ?? data.school_id ?? null,
        territoryId: data.territory_id,
        territoryName: data.territory_name ?? data.territory_id ?? null,
        error: null,
      });
      return true;
    } catch {
      setState(s => ({ ...s, loading: false, error: 'Network error. Check your connection.' }));
      return false;
    }
  }

  function deactivate() {
    secureRemove('oecs_oak_license');
    setState({
      isLicensed: false,
      loading: false,
      oakLicense: null,
      teacherName: null,
      schoolId: null,
      schoolName: null,
      territoryId: null,
      territoryName: null,
      error: null,
    });
  }

  return (
    <LicenseContext.Provider value={{ ...state, activate, deactivate }}>
      {children}
    </LicenseContext.Provider>
  );
}

export function useLicense() {
  const ctx = useContext(LicenseContext);
  if (!ctx) throw new Error('useLicense must be used within LicenseProvider');
  return ctx;
}
