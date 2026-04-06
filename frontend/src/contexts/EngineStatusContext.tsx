import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useNotification } from './NotificationContext';
import { API_CONFIG } from '../config/api.config';

type ModelStatus = 'online' | 'starting' | 'offline' | 'checking';

interface EngineStatusContextValue {
  engineStatus: ModelStatus;
  scannerStatus: ModelStatus | null;   // null = OCR not enabled
  studioStatus: ModelStatus | null;    // null = no diffusion model selected
  isEngineOnline: () => boolean;
}

const EngineStatusContext = createContext<EngineStatusContextValue | undefined>(undefined);

const FAST_POLL = 3_000;
const SLOW_POLL = 30_000;

export const EngineStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notify, toastOnly } = useNotification();
  const statusRef = useRef<ModelStatus>('checking');
  const [engineStatus, setEngineStatus] = useState<ModelStatus>('checking');
  const [scannerStatus, setScannerStatus] = useState<ModelStatus | null>(null);
  const [studioStatus, setStudioStatus] = useState<ModelStatus | null>(null);
  const failCountRef = useRef(0);

  const isEngineOnline = useCallback(() => statusRef.current === 'online', []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const allOnline = () =>
      statusRef.current === 'online';

    const schedule = () => {
      const interval = allOnline() ? SLOW_POLL : FAST_POLL;
      timer = setTimeout(loop, interval);
    };

    const loop = async () => {
      if (cancelled) return;
      await check();
      if (!cancelled) schedule();
    };

    const check = async () => {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/health`, {
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error('unhealthy');

        const data = await res.json();
        const prev = statusRef.current;
        const newStatus: ModelStatus = data.model_loaded ? 'online' : 'starting';

        failCountRef.current = 0;
        statusRef.current = newStatus;
        setEngineStatus(newStatus);

        // Scanner (OCR) status
        if (data.ocr_enabled) {
          setScannerStatus(data.ocr_loaded ? 'online' : 'starting');
        } else {
          setScannerStatus(null);
        }

        // Studio (Diffusion) status
        if (data.diffusion_active) {
          setStudioStatus(data.diffusion_loaded ? 'online' : 'starting');
        } else {
          setStudioStatus(null);
        }

        if (newStatus === 'online' && prev !== 'online') {
          if (prev === 'checking' || prev === 'starting') {
            toastOnly('Engine is online', 'success', 3000);
          } else if (prev === 'offline') {
            notify('Engine is back online', 'success');
          }
        } else if (newStatus === 'starting' && (prev === 'offline' || prev === 'checking')) {
          toastOnly('Engine is starting...', 'info', 3000);
        }
      } catch {
        failCountRef.current += 1;
        const prev = statusRef.current;

        // Grace period: don't flicker indicators on transient failures.
        // Require 2 consecutive failures from starting/checking, 3 from online.
        const threshold = prev === 'online' ? 3 : 2;
        if (failCountRef.current < threshold) {
          return;
        }

        statusRef.current = 'offline';
        setEngineStatus('offline');
        setScannerStatus(s => s !== null ? 'offline' : null);
        setStudioStatus(s => s !== null ? 'offline' : null);

        if (prev === 'online' || prev === 'starting') {
          notify('Engine is offline', 'error');
        }
      }
    };

    check().then(() => { if (!cancelled) schedule(); });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [notify, toastOnly]);

  return (
    <EngineStatusContext.Provider value={{ engineStatus, scannerStatus, studioStatus, isEngineOnline }}>
      {children}
    </EngineStatusContext.Provider>
  );
};

export const useEngineStatusContext = () => {
  const ctx = useContext(EngineStatusContext);
  if (!ctx) throw new Error('useEngineStatusContext must be used within EngineStatusProvider');
  return ctx;
};
