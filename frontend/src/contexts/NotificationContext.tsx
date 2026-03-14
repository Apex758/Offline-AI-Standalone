import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: NotificationType;
}

export interface HistoryItem {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextValue {
  toasts: Toast[];
  history: HistoryItem[];
  unreadCount: number;
  notify: (message: string, type?: NotificationType) => void;
  dismiss: (id: string) => void;
  markAllRead: () => void;
  clearHistory: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const notify = useCallback((message: string, type: NotificationType = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);

    setHistory(prev => [{ id, message, type, timestamp: new Date(), read: false }, ...prev]);
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
    <NotificationContext.Provider value={{ toasts, history, unreadCount, notify, dismiss, markAllRead, clearHistory }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};
