const API_HOST = 'localhost';
const API_PORT = '8000';

export const API_CONFIG = {
  BASE_URL: `http://${API_HOST}:${API_PORT}`,
  WS_URL: `ws://${API_HOST}:${API_PORT}`,
  WSS_URL: `wss://${API_HOST}:${API_PORT}`,
} as const;

/**
 * Get WebSocket URL based on environment
 * @param endpoint - WebSocket endpoint path (e.g., '/ws/chat')
 * @param isElectron - Whether running in Electron environment
 * @returns Properly formatted WebSocket URL
 */
export const getWebSocketUrl = (endpoint: string, isElectron: boolean): string => {
  if (isElectron) {
    // Electron: Direct connection to backend
    return `${API_CONFIG.WS_URL}${endpoint}`;
  }
  
  // Vite Dev: Use proxy through dev server
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  return `${protocol}//${host}${endpoint}`;
};

/**
 * Check if running in Electron environment
 */
export const isElectronEnvironment = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).electronAPI;
};