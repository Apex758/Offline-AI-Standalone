import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useNotification } from './NotificationContext';
import { API_CONFIG } from '../config/api.config';

type EngineStatus = 'online' | 'offline' | 'checking';

interface EngineStatusContextValue {
  engineStatus: EngineStatus;
  isEngineOnline: () => boolean;
}

const EngineStatusContext = createContext<EngineStatusContextValue | undefined>(undefined);

const POLL_INTERVAL = 30_000;

export const EngineStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notify, toastOnly } = useNotification();
  const statusRef = useRef<EngineStatus>('checking');
  const [engineStatus, setEngineStatus] = useState<EngineStatus>('checking');

  const isEngineOnline = useCallback(() => statusRef.current === 'online', []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    const check = async () => {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/health`, {
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error('unhealthy');

        const prev = statusRef.current;
        statusRef.current = 'online';
        setEngineStatus('online');

        if (prev === 'checking') {
          toastOnly('Engine is online', 'success', 3000);
        } else if (prev === 'offline') {
          notify('Engine is back online', 'success');
        }
      } catch {
        const prev = statusRef.current;
        statusRef.current = 'offline';
        setEngineStatus('offline');

        if (prev === 'online' || prev === 'checking') {
          notify('Engine is offline', 'error');
        }
      }
    };

    check();
    timer = setInterval(check, POLL_INTERVAL);

    return () => clearInterval(timer);
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
