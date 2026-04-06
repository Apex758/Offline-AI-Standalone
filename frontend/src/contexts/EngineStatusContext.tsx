import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useNotification } from './NotificationContext';
import { API_CONFIG } from '../config/api.config';

type EngineStatus = 'online' | 'starting' | 'offline' | 'checking';

interface EngineStatusContextValue {
  engineStatus: EngineStatus;
  isEngineOnline: () => boolean;
}

const EngineStatusContext = createContext<EngineStatusContextValue | undefined>(undefined);

const FAST_POLL = 3_000;   // 3s while waiting for model to load
const SLOW_POLL = 30_000;  // 30s once engine is fully online

export const EngineStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notify, toastOnly } = useNotification();
  const statusRef = useRef<EngineStatus>('checking');
  const [engineStatus, setEngineStatus] = useState<EngineStatus>('checking');
  const failCountRef = useRef(0);

  const isEngineOnline = useCallback(() => statusRef.current === 'online', []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const schedule = () => {
      const interval = statusRef.current === 'online' ? SLOW_POLL : FAST_POLL;
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
        const newStatus: EngineStatus = data.model_loaded ? 'online' : 'starting';

        failCountRef.current = 0;
        statusRef.current = newStatus;
        setEngineStatus(newStatus);

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

        // Require 2 consecutive failures before declaring offline from starting/checking
        if ((prev === 'starting' || prev === 'checking') && failCountRef.current < 2) {
          return; // keep current state, retry on next poll
        }

        statusRef.current = 'offline';
        setEngineStatus('offline');

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
    <EngineStatusContext.Provider value={{ engineStatus, isEngineOnline }}>
      {children}
    </EngineStatusContext.Provider>
  );
};

export const useEngineStatusContext = () => {
  const ctx = useContext(EngineStatusContext);
  if (!ctx) throw new Error('useEngineStatusContext must be used within EngineStatusProvider');
  return ctx;
};
