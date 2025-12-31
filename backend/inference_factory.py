"""
Inference Factory - Unified interface for different LLM backends.

DESIGN PATTERN: Factory Pattern
WHY: Allows switching between different AI providers without changing
the rest of the codebase. The factory creates the right instance based
on configuration.
"""

import logging
from typing import Union
from config import (
    INFERENCE_BACKEND, 
    GEMMA_API_KEY, 
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
    MODEL_PATH, 
    MODEL_N_CTX
)

logger = logging.getLogger(__name__)

def get_inference_instance():
    """
    Get a NEW inference instance for each request.
    
    ✅ NO SINGLETON: Creates fresh instances to prevent deadlocks.
    
    REASONING:
    - API clients are cheap to create (just wrappers around HTTP)
    - Local models are expensive, but that's a separate optimization
    - Fresh instances = no shared state = no race conditions
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
        logger.info("Creating new local Llama instance...")
        from llama_inference import LlamaInference
        
        return LlamaInference(
            model_path=MODEL_PATH,
            n_ctx=MODEL_N_CTX
        )
    
    else:
        raise ValueError(
            f"Unknown INFERENCE_BACKEND: {INFERENCE_BACKEND}. "
            f"Must be 'local', 'gemma_api', or 'openrouter'"
        )


# ============================================================================
# OPTIONAL: Instance pooling for local models (future optimization)
# ============================================================================
# 
# If local model loading becomes a bottleneck, we can add pooling:
#
# from asyncio import Queue
# _local_model_pool = Queue(maxsize=2)
#
# async def get_pooled_local_instance():
#     """Get instance from pool or create new one."""
#     try:
#         return await asyncio.wait_for(_local_model_pool.get(), timeout=1.0)
#     except asyncio.TimeoutError:
#         return LlamaInference(model_path=MODEL_PATH, n_ctx=MODEL_N_CTX)
#
# async def return_to_pool(instance):
#     """Return instance to pool."""
#     try:
#         _local_model_pool.put_nowait(instance)
#     except asyncio.QueueFull:
#         await instance.cleanup()
#
# For now, keeping it simple - create fresh instances.
# ============================================================================