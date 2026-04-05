"""
Inference Factory - Unified interface for different LLM backends.

DESIGN PATTERN: Factory Pattern + Singleton (for local models)
WHY: Allows switching between different AI providers without changing
the rest of the codebase. Local models use a singleton to avoid
reloading multi-GB files from disk on every request.
"""

import logging
import threading
from config import (
    INFERENCE_BACKEND,
    GEMMA_API_KEY,
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
    MODEL_PATH,
    MODEL_N_CTX,
    get_selected_model,
    resolve_vision_projector_path,
    resolve_model_path,
    get_tier_config,
    compute_effective_tier,
)

logger = logging.getLogger(__name__)

# Singleton for local model (shared across queued requests)
_local_instance = None
_local_instance_lock = threading.Lock()


def get_inference_instance(use_singleton: bool = True):
    """
    Get an inference instance.

    For API backends (openrouter, gemma): always creates a fresh instance
    (cheap HTTP wrappers, no shared state issues).

    For local backend:
      - use_singleton=True  → reuses a single loaded model (for queued mode)
      - use_singleton=False → creates a fresh instance (for simultaneous mode)
    """

    if INFERENCE_BACKEND == "openrouter":
        logger.info("Creating new OpenRouter API instance...")
        from openrouter_inference import OpenRouterInference

        if not OPENROUTER_API_KEY:
            raise ValueError(
                "OPENROUTER_API_KEY environment variable must be set when using openrouter backend"
            )

        return OpenRouterInference(
            api_key=OPENROUTER_API_KEY,
            model_id=OPENROUTER_MODEL
        )

    elif INFERENCE_BACKEND == "gemma_api":
        logger.info("Creating new Gemma API instance...")
        from gemma_inference import GemmaInference

        if not GEMMA_API_KEY:
            raise ValueError(
                "GEMMA_API_KEY environment variable must be set when using gemma_api backend"
            )

        return GemmaInference(api_key=GEMMA_API_KEY)

    elif INFERENCE_BACKEND == "local":
        if use_singleton:
            return _get_local_singleton()
        else:
            logger.info("Creating new local Llama instance (simultaneous mode)...")
            from llama_inference import LlamaInference
            clip_path = resolve_vision_projector_path(get_selected_model())
            try:
                return LlamaInference(model_path=MODEL_PATH, n_ctx=MODEL_N_CTX, clip_model_path=clip_path)
            except Exception as e:
                if clip_path:
                    logger.warning(f"Failed to load model with vision projector, retrying without: {e}")
                    return LlamaInference(model_path=MODEL_PATH, n_ctx=MODEL_N_CTX, clip_model_path=None)
                raise

    else:
        raise ValueError(
            f"Unknown INFERENCE_BACKEND: {INFERENCE_BACKEND}. "
            f"Must be 'local', 'gemma_api', or 'openrouter'"
        )


def _get_local_singleton():
    """Get or create the singleton local model instance (thread-safe)."""
    global _local_instance
    if _local_instance is not None and _local_instance.is_loaded:
        return _local_instance

    with _local_instance_lock:
        # Double-check after acquiring lock
        if _local_instance is not None and _local_instance.is_loaded:
            return _local_instance

        logger.info("Loading local Llama model (singleton)...")
        from llama_inference import LlamaInference
        clip_path = resolve_vision_projector_path(get_selected_model())
        try:
            _local_instance = LlamaInference(model_path=MODEL_PATH, n_ctx=MODEL_N_CTX, clip_model_path=clip_path)
        except Exception as e:
            if clip_path:
                logger.warning(f"Failed to load model with vision projector, retrying without: {e}")
                _local_instance = LlamaInference(model_path=MODEL_PATH, n_ctx=MODEL_N_CTX, clip_model_path=None)
            else:
                raise
        return _local_instance


def reload_local_model():
    """Force reload the singleton (e.g. after switching models in settings)."""
    global _local_instance
    with _local_instance_lock:
        if _local_instance is not None:
            logger.info("Releasing old local model...")
            try:
                _local_instance.cleanup_sync()
            except Exception:
                pass
            _local_instance = None
        logger.info("Reloading local model...")
        from llama_inference import LlamaInference
        from config import get_model_path, resolve_vision_projector_path, get_selected_model, MODEL_N_CTX
        # Re-resolve model path to pick up the newly selected model
        new_model_path = get_model_path()
        clip_path = resolve_vision_projector_path(get_selected_model())
        logger.info(f"Loading model: {new_model_path}, clip: {clip_path}")
        try:
            _local_instance = LlamaInference(model_path=new_model_path, n_ctx=MODEL_N_CTX, clip_model_path=clip_path)
        except Exception as e:
            if clip_path:
                logger.warning(f"Failed to load model with vision projector, retrying without: {e}")
                _local_instance = LlamaInference(model_path=new_model_path, n_ctx=MODEL_N_CTX, clip_model_path=None)
            else:
                raise
        return _local_instance


# ============================================================================
# DUAL-MODEL SUPPORT (fast model for simple tasks)
# ============================================================================

_fast_model_instance = None
_fast_model_name = None
_fast_model_lock = threading.Lock()


def _get_fast_model_singleton(model_name: str):
    """Get or create a singleton for the fast (Tier 1) model."""
    global _fast_model_instance, _fast_model_name

    if (
        _fast_model_instance is not None
        and _fast_model_name == model_name
        and _fast_model_instance.is_loaded
    ):
        return _fast_model_instance

    with _fast_model_lock:
        # Double-check after acquiring lock
        if (
            _fast_model_instance is not None
            and _fast_model_name == model_name
            and _fast_model_instance.is_loaded
        ):
            return _fast_model_instance

        # Release old fast model if different
        if _fast_model_instance is not None:
            logger.info(f"Releasing old fast model ({_fast_model_name})...")
            try:
                _fast_model_instance.cleanup_sync()
            except Exception:
                pass

        logger.info(f"Loading fast model: {model_name}")
        from llama_inference import LlamaInference
        model_path = resolve_model_path(model_name)
        clip_path = resolve_vision_projector_path(model_name)
        _fast_model_instance = LlamaInference(
            model_path=model_path, n_ctx=MODEL_N_CTX, clip_model_path=clip_path
        )
        _fast_model_name = model_name
        return _fast_model_instance


def reload_fast_model():
    """Force release the fast model singleton (e.g. after config change)."""
    global _fast_model_instance, _fast_model_name
    with _fast_model_lock:
        if _fast_model_instance is not None:
            logger.info("Releasing fast model...")
            try:
                _fast_model_instance.cleanup_sync()
            except Exception:
                pass
            _fast_model_instance = None
            _fast_model_name = None


def resolve_inference_for_task(task_type: str):
    """Return the inference instance for the given task type.

    Uses dual-model routing if enabled and tier >= 2.
    Falls back to the primary model if the fast model is not configured
    or dual-model is disabled.
    """
    # Only attempt dual-model for local backend
    if INFERENCE_BACKEND != "local":
        return get_inference_instance(use_singleton=True)

    try:
        caps = compute_effective_tier()
        if caps["tier"] < 2:
            return get_inference_instance(use_singleton=True)

        tier_config = get_tier_config()
        dual = tier_config.get("dual_model", {})

        if not dual.get("enabled") or not dual.get("fast_model"):
            return get_inference_instance(use_singleton=True)

        routing = dual.get("task_routing", {})
        target = routing.get(task_type, "primary")

        if target == "fast":
            fast_model = dual["fast_model"]
            # Don't use fast model if it's the same as the primary
            if fast_model.lower() == get_selected_model().lower():
                return get_inference_instance(use_singleton=True)
            return _get_fast_model_singleton(fast_model)

        return get_inference_instance(use_singleton=True)
    except Exception as e:
        logger.warning(f"Dual-model routing failed for task '{task_type}', falling back to primary: {e}")
        return get_inference_instance(use_singleton=True)
