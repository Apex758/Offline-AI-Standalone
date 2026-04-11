import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
    oakLicense: null,
    teacherName: null,
    schoolId: null,
    schoolName: null,
    territoryId: null,
    territoryName: null,
    error: null,
  });

  useEffect(() => {
    const stored = localStorage.getItem('oecs_oak_license');
    if (stored) {
      revalidate(stored);
    } else {
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  async function revalidate(oakLicense: string) {
    try {
      const deviceId = getDeviceId();
      const { data, error } = await supabase.rpc('validate_oak', {
        p_oak_license: oakLicense,
        p_device_id: deviceId,
      });

      if (error || !data?.valid) {
        // License failed server validation -- clear it
        localStorage.removeItem('oecs_oak_license');
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
      const stored = localStorage.getItem('oecs_oak_license');
      if (stored) {
        setState({
          isLicensed: true,
          loading: false,
          oakLicense: stored,
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
      const deviceId = getDeviceId();
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
      localStorage.setItem('oecs_oak_license', oakLicense);

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
    localStorage.removeItem('oecs_oak_license');
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
