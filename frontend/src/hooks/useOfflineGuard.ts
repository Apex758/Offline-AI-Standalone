import { useCallback, useRef } from 'react';
import { useEngineStatusContext } from '../contexts/EngineStatusContext';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Returns a `guardOffline()` function that checks engine status.
 * If offline → shows a toast and returns `true` (action should be blocked).
 * If online  → returns `false` (proceed).
 * Includes 3-second dedup to prevent toast spam on rapid clicks.
 *
 * scope='llm' (default) → checks LLM (main engine). Use for chat, lesson plans, etc.
 * scope='studio'        → checks diffusion pipeline only. Use for Image Studio.
 *                         Needed because the LLM↔diffusion RAM swap unloads the
 *                         LLM before image gen; blocking image gen on LLM status
 *                         would prevent the very flow the swap enables.
 */
export function useOfflineGuard(scope: 'llm' | 'studio' = 'llm') {
  const { isEngineOnline, studioStatus } = useEngineStatusContext();
  const { toastOnly } = useNotification();
  const lastToastRef = useRef<number>(0);

  const guardOffline = useCallback((): boolean => {
    const online = scope === 'studio' ? studioStatus === 'online' : isEngineOnline();
    if (!online) {
      const now = Date.now();
      if (now - lastToastRef.current > 3000) {
        const msg = scope === 'studio'
          ? 'Image engine is not ready — please wait for it to come online.'
          : 'System is offline — please wait for the engine to come back online before generating.';
        toastOnly(msg, 'error', 5000);
        lastToastRef.current = now;
      }
      return true;
    }
    return false;
  }, [isEngineOnline, studioStatus, toastOnly, scope]);

  return { guardOffline };
}
