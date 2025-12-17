import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

interface WebSocketConnection {
  ws: WebSocket;
  isStreaming: boolean;
  streamingContent: string;
  listeners: Set<() => void>;
}

interface WebSocketContextValue {
  getConnection: (tabId: string, endpoint: string) => WebSocket;
  getStreamingContent: (tabId: string, endpoint: string) => string;
  getIsStreaming: (tabId: string, endpoint: string) => boolean;
  clearStreaming: (tabId: string, endpoint: string) => void;
  closeConnection: (tabId: string, endpoint: string) => void;
  subscribe: (tabId: string, endpoint: string, listener: () => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

// ✅ Helper to create unique keys per (tabId + endpoint)
const getConnectionKey = (tabId: string, endpoint: string): string => {
  return `${tabId}::${endpoint}`;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ✅ CRITICAL: This must be inside the component
  const connectionsRef = useRef<Map<string, WebSocketConnection>>(new Map());
  const [, forceUpdate] = useState({});

  const notifyListeners = useCallback((key: string) => {
    const conn = connectionsRef.current.get(key);
    if (conn) {
      conn.listeners.forEach(listener => listener());
    }
  }, []);

  const getConnection = useCallback((tabId: string, endpoint: string): WebSocket => {
    const key = getConnectionKey(tabId, endpoint);
    let conn = connectionsRef.current.get(key);
    
    if (!conn || conn.ws.readyState === WebSocket.CLOSED) {
      const isElectron = typeof window !== 'undefined' && 'electronAPI' in window;
      const wsUrl = isElectron
        ? `ws://127.0.0.1:8000${endpoint}`
        : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}${endpoint}`;
      
      const ws = new WebSocket(wsUrl);
      
      conn = {
        ws,
        isStreaming: false,
        streamingContent: '',
        listeners: new Set()
      };
      connectionsRef.current.set(key, conn);
      
      // ✅ CRITICAL: Message handlers live HERE in context, not in components
      ws.onopen = () => {
        console.log(`[WebSocket ${key}] Connected`);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const conn = connectionsRef.current.get(key);
        if (!conn) return;

        if (data.type === 'token') {
          // ✅ Accumulate content - works even when tab is inactive
          conn.streamingContent += data.content;
          conn.isStreaming = true;
          notifyListeners(key);
          forceUpdate({});
        } else if (data.type === 'done') {
          // ✅ Mark streaming as complete
          conn.isStreaming = false;
          notifyListeners(key);
          forceUpdate({});
        } else if (data.type === 'error') {
          console.error(`[WebSocket ${key}] Error:`, data.message);
          conn.isStreaming = false;
          notifyListeners(key);
          forceUpdate({});
        }
      };

      ws.onerror = (error) => {
        console.error(`[WebSocket ${key}] Connection error:`, error);
        const conn = connectionsRef.current.get(key);
        if (conn) {
          conn.isStreaming = false;
          notifyListeners(key);
          forceUpdate({});
        }
      };

      ws.onclose = () => {
        console.log(`[WebSocket ${key}] Connection closed`);
        const conn = connectionsRef.current.get(key);
        if (conn) {
          conn.isStreaming = false;
          notifyListeners(key);
        }
      };
      
      console.log(`[WebSocket] Created new connection for ${key}`);
    }
    
    return conn.ws;
  }, [notifyListeners]);

  const getStreamingContent = useCallback((tabId: string, endpoint: string): string => {
    const key = getConnectionKey(tabId, endpoint);
    return connectionsRef.current.get(key)?.streamingContent || '';
  }, []);

  const getIsStreaming = useCallback((tabId: string, endpoint: string): boolean => {
    const key = getConnectionKey(tabId, endpoint);
    return connectionsRef.current.get(key)?.isStreaming || false;
  }, []);

  const clearStreaming = useCallback((tabId: string, endpoint: string) => {
    const key = getConnectionKey(tabId, endpoint);
    const conn = connectionsRef.current.get(key);
    if (conn) {
      conn.streamingContent = '';
      conn.isStreaming = false;
      notifyListeners(key);
      forceUpdate({});
    }
  }, [notifyListeners]);

  const closeConnection = useCallback((tabId: string, endpoint: string) => {
    const key = getConnectionKey(tabId, endpoint);
    const conn = connectionsRef.current.get(key);
    if (conn && conn.ws.readyState === WebSocket.OPEN) {
      conn.ws.close();
      connectionsRef.current.delete(key);
      console.log(`[WebSocket] Closed connection for ${key}`);
    }
  }, []);

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
      clearStreaming,
      closeConnection,
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