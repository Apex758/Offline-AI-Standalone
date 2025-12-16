import React, { createContext, useContext, useRef, useState } from 'react';

interface WebSocketConnection {
  ws: WebSocket;
  isStreaming: boolean;
  streamingContent: string;
  listeners?: Set<() => void>;
}

interface WebSocketContextValue {
  getConnection: (tabId: string, endpoint: string) => WebSocket;
  setStreaming: (tabId: string, endpoint: string, isStreaming: boolean) => void;
  getStreamingContent: (tabId: string, endpoint: string) => string;
  setStreamingContent: (tabId: string, endpoint: string, content: string) => void;
  appendStreamingContent: (tabId: string, endpoint: string, content: string) => void;
  clearStreaming: (tabId: string, endpoint: string) => void;
  closeConnection: (tabId: string, endpoint: string) => void;
  getIsStreaming: (tabId: string, endpoint: string) => boolean;
  subscribe: (tabId: string, endpoint: string, listener: () => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const connectionsRef = useRef<Map<string, WebSocketConnection>>(new Map());
  const [, forceUpdate] = useState({});

  const getConnectionKey = (tabId: string, endpoint: string): string => {
    return `${tabId}::${endpoint}`;
  };

  // Helper to notify listeners if present (no-op for now)
  const notifyListeners = (_key: string) => {};

  const getConnection = React.useCallback((tabId: string, endpoint: string): WebSocket => {
    const key = getConnectionKey(tabId, endpoint);
    let conn = connectionsRef.current.get(key);

    if (!conn || conn.ws.readyState === WebSocket.CLOSED) {
      const isElectron = typeof window !== 'undefined' && 'electronAPI' in window;
      const wsUrl = isElectron
        ? `ws://127.0.0.1:8000${endpoint}`
        : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}${endpoint}`;

      console.log(`[WebSocketContext] Creating new WebSocket connection: ${wsUrl} (key=${key})`);
      const ws = new WebSocket(wsUrl);
      conn = { ws, isStreaming: false, streamingContent: '', listeners: new Set() };
      connectionsRef.current.set(key, conn);

      // Message handlers here in context
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const conn = connectionsRef.current.get(key);
        if (!conn) return;

        if (data.type === 'token') {
          conn.streamingContent += data.content;
          conn.isStreaming = true;
          console.log(`[WebSocketContext] Received token for key=${key}:`, data.content);
          notifyListeners(key);
          forceUpdate({});
        } else if (data.type === 'done') {
          conn.isStreaming = false;
          console.log(`[WebSocketContext] Received done for key=${key}`);
          notifyListeners(key);
          forceUpdate({});
        }
      };

      ws.onopen = () => {
        console.log(`[WebSocketContext] WebSocket connection opened for key=${key}`);
      };
      ws.onclose = () => {
        console.log(`[WebSocketContext] WebSocket connection closed for key=${key}`);
      };
      ws.onerror = (err) => {
        console.error(`[WebSocketContext] WebSocket error for key=${key}:`, err);
      };
    }
    // Fallback: if conn is still undefined, throw error (should not happen)
    if (!conn) {
      throw new Error('WebSocket connection could not be established');
    }
    return conn.ws;
  }, []);

  const setStreaming = (tabId: string, endpoint: string, isStreaming: boolean) => {
    const key = getConnectionKey(tabId, endpoint);
    console.log(`[WebSocketContext] setStreaming key=${key}`);
    const conn = connectionsRef.current.get(key);
    if (conn) {
      conn.isStreaming = isStreaming;
      forceUpdate({});
    } else {
      console.warn(`[WebSocketContext] setStreaming: No connection found for key=${key}`);
    }
  };

  const getStreamingContent = (tabId: string, endpoint: string): string => {
    const key = getConnectionKey(tabId, endpoint);
    return connectionsRef.current.get(key)?.streamingContent || '';
  };

  const setStreamingContent = (tabId: string, endpoint: string, content: string) => {
    const key = getConnectionKey(tabId, endpoint);
    console.log(`[WebSocketContext] setStreamingContent key=${key}`);
    const conn = connectionsRef.current.get(key);
    if (conn) {
      conn.streamingContent = content;
      forceUpdate({});
    } else {
      console.warn(`[WebSocketContext] setStreamingContent: No connection found for key=${key}`);
    }
  };

  const appendStreamingContent = (tabId: string, endpoint: string, content: string) => {
    const key = getConnectionKey(tabId, endpoint);
    console.log(`[WebSocketContext] appendStreamingContent key=${key}`);
    const conn = connectionsRef.current.get(key);
    if (conn) {
      conn.streamingContent += content;
      forceUpdate({});
    } else {
      console.warn(`[WebSocketContext] appendStreamingContent: No connection found for key=${key}`);
    }
  };

  const clearStreaming = (tabId: string, endpoint: string) => {
    const key = getConnectionKey(tabId, endpoint);
    const conn = connectionsRef.current.get(key);
    if (conn) {
      conn.streamingContent = '';
      conn.isStreaming = false;
      forceUpdate({});
    }
  };

  const closeConnection = (tabId: string, endpoint: string) => {
    const key = getConnectionKey(tabId, endpoint);
    const conn = connectionsRef.current.get(key);
    if (conn && conn.ws.readyState === WebSocket.OPEN) {
      conn.ws.close();
      connectionsRef.current.delete(key);
      console.log(`[WebSocketContext] Closed connection for key=${key}`);
    }
  };

  const getIsStreaming = (tabId: string, endpoint: string): boolean => {
    const key = getConnectionKey(tabId, endpoint);
    return connectionsRef.current.get(key)?.isStreaming || false;
  };

  const subscribe = (tabId: string, endpoint: string, listener: () => void): (() => void) => {
    const key = getConnectionKey(tabId, endpoint);
    let conn = connectionsRef.current.get(key);
    if (!conn) {
      // Create a dummy connection to hold listeners if not present
      conn = { ws: {} as WebSocket, isStreaming: false, streamingContent: '', listeners: new Set() };
      connectionsRef.current.set(key, conn);
    }
    if (!conn.listeners) {
      conn.listeners = new Set();
    }
    conn.listeners.add(listener);
    return () => {
      conn?.listeners?.delete(listener);
    };
  };

  return (
    <WebSocketContext.Provider value={{
      getConnection,
      setStreaming,
      getStreamingContent,
      setStreamingContent,
      appendStreamingContent,
      clearStreaming,
      closeConnection,
      getIsStreaming,
      subscribe
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Debug utility: expose a function to list all open WebSocket connections for a tab
if (typeof window !== "undefined") {
  (window as any).wsDebugListConnections = (tabId: string) => {
    // @ts-ignore
    const connectionsRef = (window as any).wsDebugConnectionsRef || undefined;
    let ref = connectionsRef;
    // Try to get the actual ref if not set
    if (!ref && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      // Try to find the ref in React context (best effort, not always possible)
      // This is a fallback for debugging only
    }
    // Use the ref from this module if possible
    if (!ref && typeof require !== "undefined") {
      try {
        // @ts-ignore
        ref = require("./WebSocketContext").connectionsRef;
      } catch {}
    }
    // Fallback: use a global variable if set
    if (!ref && (window as any).wsDebugConnectionsRef) {
      ref = (window as any).wsDebugConnectionsRef;
    }
    // If still not found, try to access from closure (will work in this file)
    if (!ref && typeof connectionsRef !== "undefined") {
      ref = connectionsRef;
    }
    if (!ref) {
      console.warn("[wsDebugListConnections] Could not access connectionsRef");
      return;
    }
    const map = ref.current as Map<string, any>;
    const keys = Array.from(map.keys());
    const matches = keys.filter(k => k.startsWith(tabId + "::"));
    if (matches.length === 0) {
      console.log(`[wsDebugListConnections] No open WebSocket connections for tabId=${tabId}`);
    } else {
      console.log(`[wsDebugListConnections] Open WebSocket connections for tabId=${tabId}:`);
      matches.forEach(k => {
        const conn = map.get(k);
        console.log(`  key=${k}, readyState=${conn?.ws?.readyState}`);
      });
    }
  };
  // Expose the ref for debugging
  (window as any).wsDebugConnectionsRef = connectionsRef;
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};