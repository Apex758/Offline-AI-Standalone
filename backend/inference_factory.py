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
            return LlamaInference(model_path=MODEL_PATH, n_ctx=MODEL_N_CTX, clip_model_path=clip_path)

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
        _local_instance = LlamaInference(model_path=MODEL_PATH, n_ctx=MODEL_N_CTX, clip_model_path=clip_path)
        return _local_instance


def reload_local_model():
    """Force reload the singleton (e.g. after switching models in settings)."""
    global _local_instance
    with _local_instance_lock:
        if _local_instance is not None:
            logger.info("Releasing old local model...")
            try:
                import asyncio
                asyncio.get_event_loop().run_until_complete(_local_instance.cleanup())
            except Exception:
                pass
            _local_instance = None
        logger.info("Reloading local model...")
        from llama_inference import LlamaInference
        clip_path = resolve_vision_projector_path(get_selected_model())
        _local_instance = LlamaInference(model_path=MODEL_PATH, n_ctx=MODEL_N_CTX, clip_model_path=clip_path)
        return _local_instance
