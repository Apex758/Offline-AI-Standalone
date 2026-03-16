import { useEffect } from 'react';
import { useQueue } from '../contexts/QueueContext';

/**
 * Watches for queue cancellations for a given tab+endpoint and clears the
 * local loading state when a waiting item is removed from the queue.
 */
export function useQueueCancellation(
  tabId: string,
  endpoint: string,
  setLocalLoadingMap: React.Dispatch<React.SetStateAction<{ [tabId: string]: boolean }>>
) {
  const { queue, consumeCancelled } = useQueue();

  useEffect(() => {
    if (consumeCancelled(tabId, endpoint)) {
      setLocalLoadingMap(prev => {
        const next = { ...prev };
        delete next[tabId];
        return next;
      });
    }
  }, [tabId, endpoint, queue, consumeCancelled, setLocalLoadingMap]);
}
