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

interface SwapStateResult {
  state: SwapState;
  lastSwapAgeSec: number;
  imageBusy: boolean;
  observedMode: GenerationMode;
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
  /** Current residency state. Includes `imageBusy` (diffusion inference in
   * progress) and `observedMode` (last generationMode seen by backend). */
  async getState(): Promise<SwapStateResult | null> {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/swap/state`);
      if (!res.ok) return null;
      return (await res.json()) as SwapStateResult;
    } catch {
      return null;
    }
  },
};

/**
 * Poll `/api/health` until `model_loaded === true` or timeout. Called after
 * `swapApi.toLlm()` so the caller can be confident the LLM is ready BEFORE
 * the existing `guardOffline()` check (which reads engine-status poll) kicks in.
 */
async function waitForLlmOnline(timeoutMs = 45000, intervalMs = 600): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/health`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.model_loaded) return true;
      }
    } catch {
      // ignore — keep polling
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  return false;
}

/**
 * Generic pre-flight for any LLM-using action (chat, storybook, PPT,
 * worksheet, lesson plan, etc.). Handles three cases introduced by the
 * LLM↔diffusion RAM swap:
 *
 *   1. Diffusion is actively inferring (`imageBusy`) → show busy toast,
 *      abort. Caller supplies `onBusy` to render the message.
 *   2. LLM is not resident but diffusion is (state === 'image'), OR the
 *      Image Studio tab is flagged open → prompt the user to swap back
 *      to LLM (unloads diffusion, reloads LLM, waits until online).
 *   3. Everything already fine (state 'llm' or 'both' or 'none') → return
 *      true immediately.
 *
 * IMPORTANT: this does NOT replace the existing `guardOffline()` guard.
 * Callers should continue to call `guardOffline()` afterwards — this helper
 * simply ensures the LLM is brought online first so `guardOffline()` passes
 * on its next poll. Belt-and-suspenders; do not remove either guard.
 *
 * Returns true when it's safe to proceed, false when aborted.
 * Skips all checks when `mode === 'simultaneous'`.
 */
export async function guardLlmReady(
  mode: GenerationMode = 'queued',
  onBusy?: () => void,
): Promise<boolean> {
  if (mode === 'simultaneous') return true;

  let state: SwapStateResult | null = null;
  try {
    state = await swapApi.getState();
  } catch {
    // If we can't read state, fall through — existing guardOffline will
    // handle the offline case with its own toast.
    return true;
  }

  if (state?.imageBusy) {
    onBusy?.();
    return false;
  }

  const studioActive = Boolean((window as any).__imageStudioActive);
  const llmDown = state?.state === 'image';
  const needsSwap = studioActive || llmDown;
  if (!needsSwap) return true;

  const msg = studioActive
    ? 'Image Studio is still open. Close it to free memory and load the text model for this action?\n\nOK = close Image Studio, swap to text model, continue\nCancel = keep Image Studio, abort this action'
    : 'The text model is not loaded (image model currently active). Swap back to the text model for this action?\n\nOK = unload image model, load text model (~10-30s), continue\nCancel = abort this action';

  const ok = window.confirm(msg);
  if (!ok) return false;

  if (studioActive) (window as any).__imageStudioActive = false;
  await swapApi.toLlm(mode);
  // Wait for the LLM to actually be ready so the caller's subsequent
  // guardOffline() doesn't trip on a stale status poll.
  await waitForLlmOnline();
  return true;
}

/**
 * Backwards-compatible alias. Existing Chat.tsx import stays working.
 * New callers should prefer `guardLlmReady`.
 */
export const confirmImageStudioClose = guardLlmReady;
