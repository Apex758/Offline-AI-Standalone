/**
 * Client for backend LLM ↔ diffusion RAM swap endpoints.
 *
 * Backend auto-skips the swap when mode === 'simultaneous'. We still send the
 * mode so the server logs match. All calls are best-effort: network failures
 * are logged but never thrown — image generation must not break if swap fails.
 */

import { API_CONFIG } from '../config/api.config';

export type GenerationMode = 'queued' | 'simultaneous';
export type SwapState = 'llm' | 'image' | 'both' | 'none';

interface SwapResult {
  swapped: boolean;
  skipped_reason?: string;
  tookMs: number;
  state: SwapState;
  unloaded_image?: boolean;
  reloaded_llm?: boolean;
}

async function post(path: string, body: Record<string, unknown>): Promise<SwapResult | null> {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.warn(`[swapApi] ${path} returned ${res.status}`);
      return null;
    }
    return (await res.json()) as SwapResult;
  } catch (e) {
    console.warn(`[swapApi] ${path} failed:`, e);
    return null;
  }
}

export const swapApi = {
  /** Unload LLM before image generation. Skipped if simultaneous. */
  toImage(mode: GenerationMode = 'queued'): Promise<SwapResult | null> {
    return post('/api/swap/to-image', { generationMode: mode });
  },
  /** Unload diffusion + reload LLM after image generation done. */
  toLlm(mode: GenerationMode = 'queued', preload = true): Promise<SwapResult | null> {
    return post('/api/swap/to-llm', { generationMode: mode, preload });
  },
  /** Current residency state. */
  async getState(): Promise<{ state: SwapState; lastSwapAgeSec: number } | null> {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/swap/state`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};
