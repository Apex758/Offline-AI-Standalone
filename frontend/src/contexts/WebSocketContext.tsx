import React, { createContext, useContext, useRef, useState } from 'react';

interface WebSocketConnection {
  ws: WebSocket;
  isStreaming: boolean;
  streamingContent: string;
}

interface WebSocketContextValue {
  getConnection: (tabId: string, endpoint: string) => WebSocket;
  setStreaming: (tabId: string, isStreaming: boolean) => void;
  getStreamingContent: (tabId: string) => string;
  setStreamingContent: (tabId: string, content: string) => void;
  appendStreamingContent: (tabId: string, content: string) => void;
  clearStreaming: (tabId: string) => void;
  closeConnection: (tabId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const connectionsRef = useRef<Map<string, WebSocketConnection>>(new Map());
  const [, forceUpdate] = useState({});

  const getConnection = (tabId: string, endpoint: string): WebSocket => {
    let conn = connectionsRef.current.get(tabId);
    
    if (!conn || conn.ws.readyState === WebSocket.CLOSED) {
      const isElectron = typeof window !== 'undefined' && 'electronAPI' in window;
      const wsUrl = isElectron
        ? `ws://127.0.0.1:8000${endpoint}`
        : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}${endpoint}`;
      
      const ws = new WebSocket(wsUrl);
      conn = {
        ws,
        isStreaming: false,
        streamingContent: ''
      };
      connectionsRef.current.set(tabId, conn);
      
      console.log(`[WebSocket] Created new connection for tab ${tabId}`);
    }
    
    return conn.ws;
  };

  const setStreaming = (tabId: string, isStreaming: boolean) => {
    const conn = connectionsRef.current.get(tabId);
    if (conn) {
      conn.isStreaming = isStreaming;
      forceUpdate({});
    }
  };

  const getStreamingContent = (tabId: string): string => {
    return connectionsRef.current.get(tabId)?.streamingContent || '';
  };

  const setStreamingContent = (tabId: string, content: string) => {
    const conn = connectionsRef.current.get(tabId);
    if (conn) {
      conn.streamingContent = content;
      forceUpdate({});
    }
  };

  const appendStreamingContent = (tabId: string, content: string) => {
    const conn = connectionsRef.current.get(tabId);
    if (conn) {
      conn.streamingContent += content;
      forceUpdate({});
    }
  };

  const clearStreaming = (tabId: string) => {
    const conn = connectionsRef.current.get(tabId);
    if (conn) {
      conn.streamingContent = '';
      conn.isStreaming = false;
      forceUpdate({});
    }
  };

  const closeConnection = (tabId: string) => {
    const conn = connectionsRef.current.get(tabId);
    if (conn && conn.ws.readyState === WebSocket.OPEN) {
      conn.ws.close();
      connectionsRef.current.delete(tabId);
      console.log(`[WebSocket] Closed connection for tab ${tabId}`);
    }
  };

  return (
    <WebSocketContext.Provider value={{
      getConnection,
      setStreaming,
      getStreamingContent,
      setStreamingContent,
      appendStreamingContent,
      clearStreaming,
      closeConnection
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