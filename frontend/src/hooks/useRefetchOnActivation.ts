import { useEffect, useRef } from 'react';

/**
 * Triggers a refetch callback when a tab transitions from inactive to active.
 * Skips the initial mount (existing useEffect hooks handle that).
 */
export function useRefetchOnActivation(isActive: boolean, refetch: () => void) {
  const prevActiveRef = useRef(isActive);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      prevActiveRef.current = isActive;
      return;
    }

    if (isActive && !prevActiveRef.current) {
      refetch();
    }
    prevActiveRef.current = isActive;
  }, [isActive, refetch]);
}
