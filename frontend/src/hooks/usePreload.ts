import { useEffect, useRef } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

/**
 * Centralized preload hook — loads LLM and TTS models once at app startup.
 * Uses a ref guard to prevent double-fire in React StrictMode.
 */
export function usePreload() {
  const called = useRef(false);
  useEffect(() => {
    if (called.current) return;
    called.current = true;
    axios.post(`${API_CONFIG.BASE_URL}/api/model/preload`).catch(() => {});
    axios.post(`${API_CONFIG.BASE_URL}/api/tts/preload`).catch(() => {});
  }, []);
}
