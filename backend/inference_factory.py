"""
Inference Factory - Unified interface for different LLM backends.

CRITICAL FIX: Removed singleton pattern to prevent deadlocks!

Why this approach?
- Creates fresh instances per request (no shared state)
- Works with concurrent WebSocket handlers
- Lets asyncio properly schedule multiple requests
"""

import logging
from typing import Union
from config import INFERENCE_BACKEND, GEMMA_API_KEY, MODEL_PATH, MODEL_N_CTX

logger = logging.getLogger(__name__)

def get_inference_instance():
    """
    Get a NEW inference instance for each request.
    
    ✅ CRITICAL CHANGE: No longer uses singleton pattern!
    
    This creates a fresh instance each time, which means:
    - No shared locks between requests
    - No shared state that can cause deadlocks
    - Proper concurrent execution
    
    For Gemma API: Creating new client instances is cheap (just a wrapper)
    For Local: Loading models is expensive, but we can optimize later with pooling
    """
    
    if INFERENCE_BACKEND == "gemma_api":
        logger.info("Creating new Gemma API instance...")
        from gemma_inference import GemmaInference
        
        if not GEMMA_API_KEY:
            raise ValueError(
                "GEMMA_API_KEY environment variable must be set when using gemma_api backend"
            )
        
        # ✅ Create NEW instance (not singleton!)
        return GemmaInference(api_key=GEMMA_API_KEY)
    
    elif INFERENCE_BACKEND == "local":
        logger.info("Creating new local Llama instance...")
        from llama_inference import LlamaInference
        
        # ✅ Create NEW instance (not singleton!)
        return LlamaInference(
            model_path=MODEL_PATH,
            n_ctx=MODEL_N_CTX
        )
    
    else:
        raise ValueError(
            f"Unknown INFERENCE_BACKEND: {INFERENCE_BACKEND}. "
            f"Must be 'local' or 'gemma_api'"
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