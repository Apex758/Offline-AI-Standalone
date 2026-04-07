import { useEffect, useRef } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

/**
 * Centralized preload hook -- loads models in priority order at app startup:
 *   1. LLM (brain) -- must load first, needed by most tabs
 *   2. TTS -- lightweight, loads alongside or right after LLM
 *   3. OCR -- loads after LLM completes (if available)
 *   Diffusion stays lazy (loaded on image tab switch by Dashboard.tsx)
 *
 * Uses a ref guard to prevent double-fire in React StrictMode.
 */
export function usePreload() {
  const called = useRef(false);
  useEffect(() => {
    if (called.current) return;
    called.current = true;

    (async () => {
      try {
        // Step 1: LLM first (highest priority) -- MUST succeed before anything else loads
        await axios.post(`${API_CONFIG.BASE_URL}/api/model/preload`);
      } catch {
        // Brain failed to load -- do not attempt OCR or TTS
        return;
      }

      // Step 2: TTS (fast, fire and forget)
      axios.post(`${API_CONFIG.BASE_URL}/api/tts/preload`).catch(() => {});

      // Step 3: OCR (after LLM is loaded)
      try {
        const caps = await axios.get(`${API_CONFIG.BASE_URL}/api/capabilities`);
        const hasOcr = caps.data?.has_ocr === true;
        if (hasOcr) {
          axios.post(`${API_CONFIG.BASE_URL}/api/ocr/load`).catch(() => {});
        }
      } catch {
        // Capabilities check failed -- skip OCR preload
      }
    })();
  }, []);
}
