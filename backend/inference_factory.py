"""
Inference Factory - Unified interface for different LLM backends.

Why this approach?
- Single point of configuration for switching backends
- Your existing code doesn't need to know which backend is active
- Easy to add more backends later (Anthropic, OpenAI, etc.)
"""

import logging
from typing import Union
from config import INFERENCE_BACKEND, GEMMA_API_KEY, MODEL_PATH, MODEL_N_CTX

logger = logging.getLogger(__name__)

def get_inference_instance():
    """
    Get the appropriate inference instance based on configuration.
    
    Returns the same interface regardless of backend:
    - generate() method for non-streaming
    - generate_stream() method for streaming
    - cleanup() method for resource cleanup
    
    This is the ONLY place you need to change to switch backends.
    """
    
    if INFERENCE_BACKEND == "gemma_api":
        logger.info("Initializing Gemma API backend...")
        from gemma_inference import GemmaInference
        
        if not GEMMA_API_KEY:
            raise ValueError(
                "GEMMA_API_KEY environment variable must be set when using gemma_api backend"
            )
        
        return GemmaInference.get_instance(api_key=GEMMA_API_KEY)
    
    elif INFERENCE_BACKEND == "local":
        logger.info("Initializing local Llama backend...")
        from llama_inference import LlamaInference
        
        return LlamaInference.get_instance(
            model_path=MODEL_PATH,
            n_ctx=MODEL_N_CTX
        )
    
    else:
        raise ValueError(
            f"Unknown INFERENCE_BACKEND: {INFERENCE_BACKEND}. "
            f"Must be 'local' or 'gemma_api'"
        )