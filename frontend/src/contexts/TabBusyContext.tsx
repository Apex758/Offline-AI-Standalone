import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import { useTabId } from './TabIdContext';

interface TabBusyContextValue {
  /** Mark a tab as busy with an HTTP/long-running operation */
  setTabBusy: (tabId: string, operationId: string) => void;
  /** Clear a specific operation's busy state */
  clearTabBusy: (tabId: string, operationId: string) => void;
  /** Check if a tab has any HTTP-based busy operations */
  isTabHttpBusy: (tabId: string) => boolean;
  /** Get count of busy operations for a tab */
  getTabBusyCount: (tabId: string) => number;
}

const TabBusyContext = createContext<TabBusyContextValue | undefined>(undefined);

export const TabBusyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Map of tabId -> Set of operationIds
  const busyMapRef = useRef<Map<string, Set<string>>>(new Map());
  const [, forceUpdate] = useState({});

  const setTabBusy = useCallback((tabId: string, operationId: string) => {
    if (!busyMapRef.current.has(tabId)) {
      busyMapRef.current.set(tabId, new Set());
    }
    busyMapRef.current.get(tabId)!.add(operationId);
    forceUpdate({});
  }, []);

  const clearTabBusy = useCallback((tabId: string, operationId: string) => {
    const ops = busyMapRef.current.get(tabId);
    if (ops) {
      ops.delete(operationId);
      if (ops.size === 0) busyMapRef.current.delete(tabId);
    }
    forceUpdate({});
  }, []);

  const isTabHttpBusy = useCallback((tabId: string): boolean => {
    const ops = busyMapRef.current.get(tabId);
    return !!ops && ops.size > 0;
  }, []);

  const getTabBusyCount = useCallback((tabId: string): number => {
    return busyMapRef.current.get(tabId)?.size || 0;
  }, []);

  return (
    <TabBusyContext.Provider value={{ setTabBusy, clearTabBusy, isTabHttpBusy, getTabBusyCount }}>
      {children}
    </TabBusyContext.Provider>
  );
};

export const useTabBusy = () => {
  const context = useContext(TabBusyContext);
  if (!context) {
    throw new Error('useTabBusy must be used within TabBusyProvider');
  }
  return context;
};

/**
 * Hook for child components to register busy state on their parent tab.
 * Automatically uses TabIdContext to get the tabId.
 * Returns setProcessing(true/false) — call it when an operation starts/ends.
 */
export const useTabProcessing = (operationId: string) => {
  const tabId = useTabId();
  const { setTabBusy, clearTabBusy } = useTabBusy();
  const activeRef = useRef(false);

  const setProcessing = useCallback((busy: boolean) => {
    if (!tabId) return;
    if (busy && !activeRef.current) {
      activeRef.current = true;
      setTabBusy(tabId, operationId);
    } else if (!busy && activeRef.current) {
      activeRef.current = false;
      clearTabBusy(tabId, operationId);
    }
  }, [tabId, operationId, setTabBusy, clearTabBusy]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (activeRef.current && tabId) {
        clearTabBusy(tabId, operationId);
      }
    };
  }, [tabId, operationId, clearTabBusy]);

  return setProcessing;
};
