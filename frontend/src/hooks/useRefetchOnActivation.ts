import { useEffect, useRef } from 'react';

/**
 * Triggers a refetch callback when a tab transitions from inactive to active.
 * Skips the initial mount (existing useEffect hooks handle that).
 * Optional minIntervalMs (default 30s) prevents refetching if data was recently loaded.
 */
export function useRefetchOnActivation(
  isActive: boolean,
  refetch: () => void,
  minIntervalMs: number = 30_000
) {
  const prevActiveRef = useRef(isActive);
  const hasMountedRef = useRef(false);
  const lastRefetchRef = useRef<number>(Date.now()); // treat mount as a "fetch"

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      prevActiveRef.current = isActive;
      return;
    }

    if (isActive && !prevActiveRef.current) {
      const elapsed = Date.now() - lastRefetchRef.current;
      if (elapsed >= minIntervalMs) {
        lastRefetchRef.current = Date.now();
        refetch();
      }
    }
    prevActiveRef.current = isActive;
  }, [isActive, refetch, minIntervalMs]);
}
