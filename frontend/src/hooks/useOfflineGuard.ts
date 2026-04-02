import { useCallback, useRef } from 'react';
import { useEngineStatusContext } from '../contexts/EngineStatusContext';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Returns a `guardOffline()` function that checks engine status.
 * If offline → shows a toast and returns `true` (action should be blocked).
 * If online  → returns `false` (proceed).
 * Includes 3-second dedup to prevent toast spam on rapid clicks.
 */
export function useOfflineGuard() {
  const { isEngineOnline } = useEngineStatusContext();
  const { toastOnly } = useNotification();
  const lastToastRef = useRef<number>(0);

  const guardOffline = useCallback((): boolean => {
    if (!isEngineOnline()) {
      const now = Date.now();
      if (now - lastToastRef.current > 3000) {
        toastOnly('System is offline — please wait for the engine to come back online before generating.', 'error', 5000);
        lastToastRef.current = now;
      }
      return true;
    }
    return false;
  }, [isEngineOnline, toastOnly]);

  return { guardOffline };
}
