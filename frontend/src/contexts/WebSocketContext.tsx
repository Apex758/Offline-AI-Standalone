// @refresh reset
import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { useNotification } from './NotificationContext';

const TOOL_NAMES: Record<string, string> = {
  '/ws/quiz': 'Quiz',
  '/ws/rubric': 'Rubric',
  '/ws/lesson-plan': 'Lesson Plan',
  '/ws/kindergarten': 'Kindergarten Plan',
  '/ws/multigrade': 'Multigrade Plan',
  '/ws/cross-curricular': 'Cross-Curricular Plan',
  '/ws/worksheet': 'Worksheet',
  '/ws/brain-dump': 'Brain Dump',
  '/ws/storybook': 'Storybook',
  '/ws/educator-insights': 'Educator Insights',
};

interface WebSocketConnection {
  ws: WebSocket;
  isStreaming: boolean;
  streamingContent: string;
  customData: Record<string, any>;
  listeners: Set<() => void>;
}

export interface ActiveStream {
  tabId: string;
  endpoint: string;
  toolName: string;
}

interface WebSocketContextValue {
  getConnection: (tabId: string, endpoint: string) => WebSocket;
  getStreamingContent: (tabId: string, endpoint: string) => string;
  getIsStreaming: (tabId: string, endpoint: string) => boolean;
  getIsTabBusy: (tabId: string) => boolean;
  getActiveStreams: () => ActiveStream[];
  getCustomData: (tabId: string, endpoint: string, key: string) => any;
  clearStreaming: (tabId: string, endpoint: string) => void;
  closeConnection: (tabId: string, endpoint: string) => void;
  cancelStream: (tabId: string, endpoint: string) => void;
  subscribe: (tabId: string, endpoint: string, listener: () => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

// ✅ Helper to create unique keys per (tabId + endpoint)
const getConnectionKey = (tabId: string, endpoint: string): string => {
  return `${tabId}::${endpoint}`;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const connectionsRef = useRef<Map<string, WebSocketConnection>>(new Map());
  const [, forceUpdate] = useState({});
  const { notify } = useNotification();
  const notifyRef = useRef(notify);
  notifyRef.current = notify;

  // ✅ Debounce re-renders to avoid render storm
  const updateTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const scheduleUpdate = useCallback((key: string) => {
    // Clear existing timer
    const existingTimer = updateTimersRef.current.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // ✅ Batch updates every 16ms (60 FPS)
    const timer = setTimeout(() => {
      const conn = connectionsRef.current.get(key);
      if (conn) {
        conn.listeners.forEach(listener => listener());
        forceUpdate({});
      }
      updateTimersRef.current.delete(key);
    }, 16);

    updateTimersRef.current.set(key, timer);
  }, []);

  const getConnection = useCallback((tabId: string, endpoint: string): WebSocket => {
    const key = getConnectionKey(tabId, endpoint);
    let conn = connectionsRef.current.get(key);

    if (!conn || conn.ws.readyState === WebSocket.CLOSED || conn.ws.readyState === WebSocket.CLOSING) {
      const isElectron = typeof window !== 'undefined' && 'electronAPI' in window;
      const wsUrl = isElectron
        ? `ws://127.0.0.1:8000${endpoint}`
        : `ws://localhost:8000${endpoint}`;

      const ws = new WebSocket(wsUrl);

      conn = {
        ws,
        isStreaming: false,
        streamingContent: '',
        customData: {},
        listeners: new Set()
      };
      connectionsRef.current.set(key, conn);

      ws.onopen = () => {
        console.log(`[WebSocket ${key}] Connected`);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const conn = connectionsRef.current.get(key);
        if (!conn) return;

        if (data.type === 'token') {
          // ✅ Accumulate content immediately (no delay)
          conn.streamingContent += data.content;
          conn.isStreaming = true;

          // ✅ Schedule batched update instead of immediate forceUpdate
          scheduleUpdate(key);
        } else if (data.type === 'done' || data.type === 'cancelled') {
          conn.isStreaming = false;
          // ✅ Force immediate update on completion
          const existingTimer = updateTimersRef.current.get(key);
          if (existingTimer) {
            clearTimeout(existingTimer);
            updateTimersRef.current.delete(key);
          }
          conn.listeners.forEach(listener => listener());
          forceUpdate({});
          const toolName = TOOL_NAMES[endpoint];
          const [connTabId] = key.split('::');
          if (toolName) notifyRef.current(`${toolName} generated!`, 'success', connTabId);
        } else if (data.type === 'curriculum_refs') {
          conn.customData.curriculumRefs = data.references || [];
          conn.listeners.forEach(listener => listener());
          forceUpdate({});
        } else if (data.type === 'error') {
          console.error(`[WebSocket ${key}] Error:`, data.message);
          conn.isStreaming = false;
          conn.listeners.forEach(listener => listener());
          forceUpdate({});
          const toolName = TOOL_NAMES[endpoint];
          const [errTabId] = key.split('::');
          if (toolName) notifyRef.current(`${toolName} generation failed`, 'error', errTabId);
        }
      };

      ws.onerror = (error) => {
        console.error(`[WebSocket ${key}] Connection error:`, error);
      };

      ws.onclose = () => {
        console.log(`[WebSocket ${key}] Connection closed`);
        const conn = connectionsRef.current.get(key);
        if (conn) {
          conn.isStreaming = false;
        }
      };
    }

    return conn.ws;
  }, [scheduleUpdate]);

  const getStreamingContent = useCallback((tabId: string, endpoint: string): string => {
    const key = getConnectionKey(tabId, endpoint);
    return connectionsRef.current.get(key)?.streamingContent || '';
  }, []);

  const getIsStreaming = useCallback((tabId: string, endpoint: string): boolean => {
    const key = getConnectionKey(tabId, endpoint);
    return connectionsRef.current.get(key)?.isStreaming || false;
  }, []);

  const getIsTabBusy = useCallback((tabId: string): boolean => {
    for (const [key, conn] of connectionsRef.current.entries()) {
      if (key.startsWith(`${tabId}::`) && conn.isStreaming) return true;
    }
    return false;
  }, []);

  const getActiveStreams = useCallback((): ActiveStream[] => {
    const streams: ActiveStream[] = [];
    for (const [key, conn] of connectionsRef.current.entries()) {
      if (conn.isStreaming) {
        const [tabId, endpoint] = key.split('::');
        streams.push({ tabId, endpoint, toolName: TOOL_NAMES[endpoint] || endpoint });
      }
    }
    return streams;
  }, []);

  const getCustomData = useCallback((tabId: string, endpoint: string, key: string): any => {
    const connKey = getConnectionKey(tabId, endpoint);
    return connectionsRef.current.get(connKey)?.customData?.[key] ?? null;
  }, []);

  const clearStreaming = useCallback((tabId: string, endpoint: string) => {
    const key = getConnectionKey(tabId, endpoint);
    const conn = connectionsRef.current.get(key);
    if (conn) {
      conn.streamingContent = '';
      conn.isStreaming = false;
      conn.listeners.forEach(listener => listener());
      forceUpdate({});
    }
  }, []);

  const closeConnection = useCallback((tabId: string, endpoint: string) => {
    const key = getConnectionKey(tabId, endpoint);
    const conn = connectionsRef.current.get(key);
    if (conn && conn.ws.readyState === WebSocket.OPEN) {
      conn.ws.close();
      connectionsRef.current.delete(key);
      console.log(`[WebSocket] Closed connection for ${key}`);
    }
  }, []);

  const cancelStream = useCallback((tabId: string, endpoint: string) => {
    // Immediately mark as not streaming so components stop their loading state
    clearStreaming(tabId, endpoint);
    // Close the WebSocket — backend detects disconnect and breaks its streaming loop
    closeConnection(tabId, endpoint);
  }, [clearStreaming, closeConnection]);

  const subscribe = useCallback((tabId: string, endpoint: string, listener: () => void): (() => void) => {
    const key = getConnectionKey(tabId, endpoint);
    const conn = connectionsRef.current.get(key);
    if (conn) {
      conn.listeners.add(listener);
      return () => {
        conn.listeners.delete(listener);
      };
    }
    return () => {};
  }, []);

  return (
    <WebSocketContext.Provider value={{
      getConnection,
      getStreamingContent,
      getIsStreaming,
      getIsTabBusy,
      getActiveStreams,
      getCustomData,
      clearStreaming,
      closeConnection,
      cancelStream,
      subscribe
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};