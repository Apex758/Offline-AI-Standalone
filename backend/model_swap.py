"""
Model swap manager — coordinates LLM ↔ diffusion RAM handoff on low-memory boxes.

On 16GB machines holding both llama.cpp (Tier-1 ~4GB) and stable-diffusion.cpp
(SDXL ~6GB) resident causes pagefile thrash. This module exposes two primitives
used by the /api/swap/* endpoints and the safety-net middleware:

    swap_to_image()  → unload LLM, leave diffusion to lazy-load on next request
    swap_to_llm()    → unload diffusion pipeline, reload LLM singleton

Both are no-ops when generationMode == "simultaneous" (user opted in to
concurrent residency, or has enough RAM to not care).

No inference code is touched. All heavy lifting delegates to existing:
    inference_factory.unload_all_models()
    inference_factory.reload_local_model()
    inference_factory.is_model_loaded()
    image_service.get_image_service().unload_pipeline()
"""

import asyncio
import logging
import time
from typing import Dict, Literal, Optional

logger = logging.getLogger(__name__)

_swap_lock = asyncio.Lock()
_last_swap_ts: float = 0.0

# Server-wide observed generation mode. Updated whenever a frontend caller
# hits one of the /api/swap/* endpoints (mode flows in the request body).
# Used by the sync safety-net helpers below so that model load paths
# (inference_factory._get_local_singleton, image_service.initialize_pipeline)
# can decide whether to auto-unload the other model without needing an async
# context or a per-request mode hand-off. Defaults to 'queued' → swap-on.
_observed_mode: str = "queued"

State = Literal["llm", "image", "none", "both"]


def set_observed_mode(mode: Optional[str]) -> None:
    """Remember the latest generationMode seen from the frontend. Called from
    the /api/swap/* endpoints. Defaults to 'queued' on unknown values."""
    global _observed_mode
    m = (mode or "").strip().lower()
    if m in ("queued", "simultaneous"):
        _observed_mode = m


def get_observed_mode() -> str:
    return _observed_mode


def auto_unload_image_if_needed_sync() -> bool:
    """Sync safety-net: called from the LLM load path. If diffusion is
    currently resident AND the observed mode is not 'simultaneous', unload
    the diffusion pipeline to make room for the LLM. Returns True if a
    pipeline was actually unloaded.

    Safe to call from non-async code (unload_pipeline is threading.Lock-based).
    Swallows all errors — this is a best-effort hint, not a hard barrier.
    """
    if _observed_mode == "simultaneous":
        return False
    if not _is_image_loaded():
        return False
    try:
        from image_service import get_image_service
        svc = get_image_service()
        svc.unload_pipeline()
        logger.info("[swap] auto_unload_image: diffusion pipeline unloaded before LLM load")
        return True
    except Exception as e:
        logger.warning(f"[swap] auto_unload_image failed: {e}")
        return False


def auto_unload_llm_if_needed_sync() -> bool:
    """Sync safety-net: called from the diffusion load path. If the LLM is
    currently resident AND observed mode is not 'simultaneous', unload it.
    Returns True if the LLM was actually unloaded."""
    if _observed_mode == "simultaneous":
        return False
    if not _is_llm_loaded():
        return False
    try:
        from inference_factory import unload_all_models
        unload_all_models()
        logger.info("[swap] auto_unload_llm: LLM released before diffusion load")
        return True
    except Exception as e:
        logger.warning(f"[swap] auto_unload_llm failed: {e}")
        return False


def _is_llm_loaded() -> bool:
    try:
        from inference_factory import is_model_loaded
        return bool(is_model_loaded())
    except Exception as e:
        logger.warning(f"[swap] is_llm_loaded probe failed: {e}")
        return False


def _is_image_loaded() -> bool:
    try:
        from image_service import get_image_service
        svc = get_image_service()
        return bool(getattr(svc, "pipeline", None))
    except Exception as e:
        logger.warning(f"[swap] is_image_loaded probe failed: {e}")
        return False


def get_state() -> State:
    llm = _is_llm_loaded()
    img = _is_image_loaded()
    if llm and img:
        return "both"
    if llm:
        return "llm"
    if img:
        return "image"
    return "none"


def is_simultaneous(mode: Optional[str]) -> bool:
    return (mode or "").strip().lower() == "simultaneous"


async def swap_to_image(mode: Optional[str] = None, force: bool = False) -> Dict:
    """Unload LLM so diffusion has RAM headroom.

    No-op in simultaneous mode unless force=True (safety-net middleware may force).
    Returns dict: { swapped: bool, skipped_reason?: str, tookMs: int, state: State }.
    """
    t0 = time.time()
    if is_simultaneous(mode) and not force:
        return {
            "swapped": False,
            "skipped_reason": "simultaneous_mode",
            "tookMs": 0,
            "state": get_state(),
        }

    async with _swap_lock:
        if not _is_llm_loaded():
            return {
                "swapped": False,
                "skipped_reason": "llm_not_loaded",
                "tookMs": int((time.time() - t0) * 1000),
                "state": get_state(),
            }
        logger.info("[swap] swap_to_image: unloading LLM...")
        loop = asyncio.get_event_loop()
        try:
            from inference_factory import unload_all_models
            await loop.run_in_executor(None, unload_all_models)
        except Exception as e:
            logger.error(f"[swap] unload_all_models failed: {e}")
            return {
                "swapped": False,
                "skipped_reason": f"unload_error: {e}",
                "tookMs": int((time.time() - t0) * 1000),
                "state": get_state(),
            }

        global _last_swap_ts
        _last_swap_ts = time.time()
        took = int((time.time() - t0) * 1000)
        logger.info(f"[swap] swap_to_image done in {took}ms")
        return {"swapped": True, "tookMs": took, "state": get_state()}


async def swap_to_llm(mode: Optional[str] = None, force: bool = False, preload: bool = True) -> Dict:
    """Unload diffusion pipeline, reload LLM singleton.

    No-op in simultaneous mode unless force=True.
    If preload=False, only unloads diffusion and leaves LLM lazy-load on next
    request (saves cold-start latency when caller is just freeing image RAM).
    """
    t0 = time.time()
    if is_simultaneous(mode) and not force:
        return {
            "swapped": False,
            "skipped_reason": "simultaneous_mode",
            "tookMs": 0,
            "state": get_state(),
        }

    async with _swap_lock:
        loop = asyncio.get_event_loop()
        unloaded_image = False
        if _is_image_loaded():
            logger.info("[swap] swap_to_llm: unloading diffusion pipeline...")
            try:
                from image_service import get_image_service
                svc = get_image_service()
                await loop.run_in_executor(None, svc.unload_pipeline)
                unloaded_image = True
            except Exception as e:
                logger.error(f"[swap] unload_pipeline failed: {e}")
                return {
                    "swapped": False,
                    "skipped_reason": f"unload_image_error: {e}",
                    "tookMs": int((time.time() - t0) * 1000),
                    "state": get_state(),
                }

        reloaded_llm = False
        if preload and not _is_llm_loaded():
            logger.info("[swap] swap_to_llm: reloading LLM singleton...")
            try:
                from inference_factory import reload_local_model
                await loop.run_in_executor(None, reload_local_model)
                reloaded_llm = True
            except Exception as e:
                logger.error(f"[swap] reload_local_model failed: {e}")
                return {
                    "swapped": unloaded_image,
                    "skipped_reason": f"reload_llm_error: {e}",
                    "tookMs": int((time.time() - t0) * 1000),
                    "state": get_state(),
                }

        global _last_swap_ts
        _last_swap_ts = time.time()
        took = int((time.time() - t0) * 1000)
        logger.info(
            f"[swap] swap_to_llm done in {took}ms "
            f"(unloaded_image={unloaded_image}, reloaded_llm={reloaded_llm})"
        )
        return {
            "swapped": unloaded_image or reloaded_llm,
            "tookMs": took,
            "state": get_state(),
            "unloaded_image": unloaded_image,
            "reloaded_llm": reloaded_llm,
        }


def last_swap_age_seconds() -> float:
    """Seconds since the last successful swap. Used by middleware for debounce."""
    if _last_swap_ts == 0.0:
        return float("inf")
    return time.time() - _last_swap_ts


def is_image_busy() -> bool:
    """True when a diffusion inference is in progress (_inference_lock held).
    Frontend checks this before firing LLM actions so it can show a 'Images
    still generating' toast instead of blocking the user in a long queue."""
    try:
        from image_service import get_image_service
        svc = get_image_service()
        lock = getattr(svc, "_inference_lock", None)
        if lock is None:
            return False
        acquired = lock.acquire(blocking=False)
        if acquired:
            lock.release()
            return False
        return True
    except Exception as e:
        logger.debug(f"[swap] is_image_busy probe failed: {e}")
        return False
