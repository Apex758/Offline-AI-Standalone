// @refresh reset
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';
import { useSettings } from './SettingsContext';
import { useNotification } from './NotificationContext';

export type QueueItemStatus = 'waiting' | 'generating' | 'completed' | 'error';

export interface QueueItem {
  id: string;
  label: string;        // e.g. "Quiz - Grade 5 Math"
  toolType: string;      // e.g. "Quiz", "Lesson Plan"
  tabId: string;
  endpoint: string;
  prompt: string;
  generationMode: string;
  extraMessageData?: Record<string, unknown>; // Additional data to include in the WebSocket message
  status: QueueItemStatus;
  addedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
}

interface QueueContextValue {
  queue: QueueItem[];
  activeItem: QueueItem | null;
  enqueue: (item: Omit<QueueItem, 'id' | 'status' | 'addedAt'>) => void;
  removeFromQueue: (id: string) => void;
  cancelGenerating: (id: string) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  queueEnabled: boolean;
  /** Returns true (once) if a waiting item for this tabId+endpoint was cancelled. */
  consumeCancelled: (tabId: string, endpoint: string) => boolean;
}

const QueueContext = createContext<QueueContextValue | undefined>(undefined);

const TOOL_NAMES: Record<string, string> = {
  '/ws/quiz': 'Quiz',
  '/ws/rubric': 'Rubric',
  '/ws/lesson-plan': 'Lesson Plan',
  '/ws/kindergarten': 'Kindergarten Plan',
  '/ws/multigrade': 'Multigrade Plan',
  '/ws/cross-curricular': 'Cross-Curricular Plan',
  '/ws/worksheet': 'Worksheet',
  '/ws/brain-dump': 'Brain Dump',
};

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const { getConnection, getIsStreaming, subscribe } = useWebSocket();
  const { settings } = useSettings();
  const { notify } = useNotification();
  const processingRef = useRef(false);
  const currentItemRef = useRef<QueueItem | null>(null);
  const queueRef = useRef<QueueItem[]>([]);

  // Track cancelled waiting items so generators can clear their loading state.
  // Keys are "tabId::endpoint". Using a ref + counter to trigger re-renders.
  const cancelledKeysRef = useRef<Set<string>>(new Set());
  const [, setCancelTick] = useState(0);

  const queueEnabled = settings.generationMode === 'queued';

  // Keep ref in sync
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const processNext = useCallback(() => {
    if (processingRef.current) return;

    const currentQueue = queueRef.current;
    const nextItem = currentQueue.find(item => item.status === 'waiting');
    if (!nextItem) return;

    processingRef.current = true;
    currentItemRef.current = nextItem;

    // Update status to generating
    setQueue(prev => prev.map(item =>
      item.id === nextItem.id
        ? { ...item, status: 'generating' as QueueItemStatus, startedAt: new Date() }
        : item
    ));

    // Get WebSocket connection and send
    try {
      const ws = getConnection(nextItem.tabId, nextItem.endpoint);

      const waitForOpen = () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            prompt: nextItem.prompt,
            generationMode: nextItem.generationMode,
            jobId: nextItem.id,
            ...(nextItem.extraMessageData || {}),
          }));

          // Subscribe to know when generation completes
          const unsubscribe = subscribe(nextItem.tabId, nextItem.endpoint, () => {
            const isStillStreaming = getIsStreaming(nextItem.tabId, nextItem.endpoint);
            if (!isStillStreaming && processingRef.current && currentItemRef.current?.id === nextItem.id) {
              // Generation finished
              processingRef.current = false;
              currentItemRef.current = null;
              unsubscribe();

              setQueue(prev => {
                const updated = prev.map(item =>
                  item.id === nextItem.id
                    ? { ...item, status: 'completed' as QueueItemStatus, completedAt: new Date() }
                    : item
                );
                // Schedule next processing
                setTimeout(() => {
                  const remaining = queueRef.current.find(i => i.status === 'waiting');
                  if (remaining) processNext();
                }, 500);
                return updated;
              });
            }
          });
        } else if (ws.readyState === WebSocket.CONNECTING) {
          setTimeout(waitForOpen, 100);
        } else {
          // Connection failed
          processingRef.current = false;
          currentItemRef.current = null;
          setQueue(prev => prev.map(item =>
            item.id === nextItem.id
              ? { ...item, status: 'error' as QueueItemStatus, errorMessage: 'Connection failed' }
              : item
          ));
          // Try next item
          setTimeout(processNext, 500);
        }
      };

      waitForOpen();
    } catch (error) {
      processingRef.current = false;
      currentItemRef.current = null;
      setQueue(prev => prev.map(item =>
        item.id === nextItem.id
          ? { ...item, status: 'error' as QueueItemStatus, errorMessage: String(error) }
          : item
      ));
      setTimeout(processNext, 500);
    }
  }, [getConnection, getIsStreaming, subscribe]);

  const enqueue = useCallback((item: Omit<QueueItem, 'id' | 'status' | 'addedAt'>) => {
    const newItem: QueueItem = {
      ...item,
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      status: 'waiting',
      addedAt: new Date(),
    };

    setQueue(prev => {
      const updated = [...prev, newItem];
      queueRef.current = updated;
      return updated;
    });

    notify(`${item.toolType} added to queue`);

    // Schedule processing
    setTimeout(() => {
      if (!processingRef.current) {
        processNext();
      }
    }, 50);
  }, [processNext, notify]);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => {
      const item = prev.find(i => i.id === id);
      // If the item was waiting (not yet started), signal cancellation
      if (item && item.status === 'waiting') {
        const key = `${item.tabId}::${item.endpoint}`;
        cancelledKeysRef.current.add(key);
        setCancelTick(t => t + 1);
        notify(`${item.label} cancelled`);
      }
      return prev.filter(i => i.id !== id);
    });
  }, [notify]);

  const cancelGenerating = useCallback((id: string) => {
    const item = queueRef.current.find(i => i.id === id);
    if (!item || item.status !== 'generating') return;

    // Call the backend cancel REST endpoint
    fetch(`http://localhost:8000/api/cancel/${encodeURIComponent(id)}`, { method: 'POST' })
      .catch(() => {/* fire and forget */});

    // Mark as cancelled/error in the queue immediately
    processingRef.current = false;
    currentItemRef.current = null;
    setQueue(prev => prev.map(i =>
      i.id === id ? { ...i, status: 'error' as QueueItemStatus, errorMessage: 'Cancelled' } : i
    ));
    notify(`${item.label} cancelled`);

    // Kick off next waiting item
    setTimeout(() => {
      if (!processingRef.current) processNext();
    }, 300);
  }, [notify, processNext]);

  const reorderQueue = useCallback((fromIndex: number, toIndex: number) => {
    setQueue(prev => {
      // Only reorder waiting items
      const waitingItems = prev.filter(item => item.status === 'waiting');
      const nonWaitingItems = prev.filter(item => item.status !== 'waiting');

      // fromIndex and toIndex are relative to waiting items only
      if (fromIndex < 0 || fromIndex >= waitingItems.length || toIndex < 0 || toIndex >= waitingItems.length) {
        return prev;
      }

      const reordered = [...waitingItems];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, moved);

      // Rebuild: generating first, then reordered waiting, then completed/error
      const generating = nonWaitingItems.filter(item => item.status === 'generating');
      const done = nonWaitingItems.filter(item => item.status === 'completed' || item.status === 'error');

      return [...generating, ...reordered, ...done];
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setQueue(prev => prev.filter(item => item.status !== 'completed' && item.status !== 'error'));
  }, []);

  const clearAll = useCallback(() => {
    // Signal cancellation for all waiting items
    setQueue(prev => {
      for (const item of prev) {
        if (item.status === 'waiting') {
          cancelledKeysRef.current.add(`${item.tabId}::${item.endpoint}`);
        }
      }
      setCancelTick(t => t + 1);
      return prev.filter(item => item.status === 'generating');
    });
  }, []);

  /** Returns true (once) if a waiting item for this tabId+endpoint was cancelled. Clears the flag. */
  const consumeCancelled = useCallback((tabId: string, endpoint: string): boolean => {
    const key = `${tabId}::${endpoint}`;
    if (cancelledKeysRef.current.has(key)) {
      cancelledKeysRef.current.delete(key);
      return true;
    }
    return false;
  }, []);

  const activeItem = queue.find(item => item.status === 'generating') || null;

  return (
    <QueueContext.Provider value={{
      queue,
      activeItem,
      enqueue,
      removeFromQueue,
      cancelGenerating,
      reorderQueue,
      clearCompleted,
      clearAll,
      queueEnabled,
      consumeCancelled,
    }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within QueueProvider');
  }
  return context;
};
