import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

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

function getDeviceId(): string {
  const stored = localStorage.getItem('oecs_device_id');
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem('oecs_device_id', id);
  return id;
}

export function LicenseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LicenseState>({
    isLicensed: false,
    loading: true,
    email: null,
    schoolName: null,
    error: null,
  });

  useEffect(() => {
    const stored = localStorage.getItem('oecs_license');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        revalidate(parsed.email, parsed.code);
      } catch {
        localStorage.removeItem('oecs_license');
        setState(s => ({ ...s, loading: false }));
      }
    } else {
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  async function revalidate(email: string, code: string) {
    try {
      const deviceId = getDeviceId();
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
      const stored = localStorage.getItem('oecs_license');
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({
          isLicensed: true,
          loading: false,
          email: parsed.email,
          schoolName: null,
          error: null,
        });
      } else {
        setState(s => ({ ...s, loading: false }));
      }
    }
  }

  async function activate(email: string, code: string): Promise<boolean> {
    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const deviceId = getDeviceId();
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

      localStorage.setItem('oecs_license', JSON.stringify({ email, code }));

      setState({
        isLicensed: true,
        loading: false,
        email,
        schoolName: data.school_name,
        error: null,
      });
      return true;
    } catch {
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

export function useLicense() {
  const ctx = useContext(LicenseContext);
  if (!ctx) throw new Error('useLicense must be used within LicenseProvider');
  return ctx;
}
