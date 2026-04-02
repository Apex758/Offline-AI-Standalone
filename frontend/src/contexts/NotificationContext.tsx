import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: NotificationType;
  tabId?: string;
}

export interface HistoryItem {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  tabId?: string;
}

interface NotificationContextValue {
  toasts: Toast[];
  history: HistoryItem[];
  unreadCount: number;
  notify: (message: string, type?: NotificationType, tabId?: string) => void;
  toastOnly: (message: string, type?: NotificationType, duration?: number) => void;
  dismiss: (id: string) => void;
  markAllRead: () => void;
  clearHistory: () => void;
  navigateToTab: (tabId: string) => void;
  registerNavigator: (fn: (tabId: string) => void) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const navigatorRef = useRef<((tabId: string) => void) | null>(null);

  const registerNavigator = useCallback((fn: (tabId: string) => void) => {
    navigatorRef.current = fn;
  }, []);

  const navigateToTab = useCallback((tabId: string) => {
    if (navigatorRef.current) navigatorRef.current(tabId);
  }, []);

  const notify = useCallback((message: string, type: NotificationType = 'success', tabId?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setToasts(prev => [...prev, { id, message, type, tabId }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);

    setHistory(prev => [{ id, message, type, timestamp: new Date(), read: false, tabId }, ...prev]);
  }, []);

  const toastOnly = useCallback((message: string, type: NotificationType = 'info', duration = 4000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setHistory(prev => prev.map(item => ({ ...item, read: true })));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const unreadCount = history.filter(item => !item.read).length;

  return (
    <NotificationContext.Provider value={{ toasts, history, unreadCount, notify, toastOnly, dismiss, markAllRead, clearHistory, navigateToTab, registerNavigator }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};
