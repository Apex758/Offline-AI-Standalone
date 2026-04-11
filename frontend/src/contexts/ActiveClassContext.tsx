// Global "active class" context.
//
// Lets teachers pick a class ONCE and have every generator auto-fill from it.
// Each generator can still expose its own picker (which writes through to this
// context), but the selection is now shared across the whole app and persisted
// across reloads.
//
// Usage:
//   const { activeClass, setActiveClass, config, hasConfig } = useActiveClass();
//
// Inside a generator:
//   useEffect(() => {
//     if (hasConfig) applyClassConfig(config, label);
//   }, [activeClass?.key, hasConfig]);

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ClassConfig, fetchClassConfig } from '../lib/classConfig';

const STORAGE_KEY = 'activeClass.v1';

export interface ActiveClassSelection {
  className: string;
  gradeLevel?: string;
  // A stable identifier suitable for useEffect dependencies.
  key: string;
  // Display label for UI ("Grade 4 — Blue").
  label: string;
}

interface ActiveClassContextValue {
  activeClass: ActiveClassSelection | null;
  setActiveClass: (sel: ActiveClassSelection | null) => void;
  config: ClassConfig;
  hasConfig: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ActiveClassContext = createContext<ActiveClassContextValue | null>(null);

function loadFromStorage(): ActiveClassSelection | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.className === 'string') {
      return parsed as ActiveClassSelection;
    }
  } catch {
    // ignore
  }
  return null;
}

function saveToStorage(sel: ActiveClassSelection | null): void {
  try {
    if (sel) localStorage.setItem(STORAGE_KEY, JSON.stringify(sel));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function buildSelection(
  className: string,
  gradeLevel?: string
): ActiveClassSelection {
  const gl = gradeLevel && gradeLevel.trim() !== '' ? gradeLevel : undefined;
  return {
    className,
    gradeLevel: gl,
    key: `${gl || ''}::${className}`,
    label: `${gl ? `Grade ${gl} — ` : ''}Class ${className}`,
  };
}

export const ActiveClassProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeClass, setActiveClassState] = useState<ActiveClassSelection | null>(
    () => loadFromStorage()
  );
  const [config, setConfig] = useState<ClassConfig>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqId = useRef(0);

  const load = useCallback(async () => {
    if (!activeClass) {
      setConfig({});
      setError(null);
      return;
    }
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    try {
      const cfg = await fetchClassConfig(activeClass.className, activeClass.gradeLevel);
      if (id === reqId.current) setConfig(cfg || {});
    } catch (e: any) {
      if (id === reqId.current) setError(e?.message || 'Failed to load class config');
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, [activeClass]);

  useEffect(() => {
    load();
  }, [load]);

  const setActiveClass = useCallback((sel: ActiveClassSelection | null) => {
    setActiveClassState(sel);
    saveToStorage(sel);
  }, []);

  const value = useMemo<ActiveClassContextValue>(
    () => ({
      activeClass,
      setActiveClass,
      config,
      hasConfig: Object.keys(config || {}).length > 0,
      loading,
      error,
      refresh: load,
    }),
    [activeClass, setActiveClass, config, loading, error, load]
  );

  return (
    <ActiveClassContext.Provider value={value}>
      {children}
    </ActiveClassContext.Provider>
  );
};

export function useActiveClass(): ActiveClassContextValue {
  const ctx = useContext(ActiveClassContext);
  if (!ctx) {
    throw new Error('useActiveClass must be used inside <ActiveClassProvider>');
  }
  return ctx;
}
