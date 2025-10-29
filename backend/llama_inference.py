"""
Centralized Llama Model Inference System

This module provides a singleton pattern for managing Llama model inference.
The model is loaded once at startup and reused for all requests, eliminating
the overhead of repeated model loading.

Key Features:
- Singleton pattern (only one model instance)
- Silent operation (no console output from llama.cpp)
- Thread-safe for concurrent requests
- Structured JSON responses
- Centralized error handling
"""

import logging
import threading
import contextlib
import sys
import os
from typing import Optional, Dict, Any
from llama_cpp import Llama

# Configure logging - ERROR level only
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)


class SilenceOutput:
    """Context manager to suppress all stdout/stderr output from llama.cpp"""
    
    def __enter__(self):
        self._original_stdout = sys.stdout
        self._original_stderr = sys.stderr
        sys.stdout = open(os.devnull, 'w')
        sys.stderr = open(os.devnull, 'w')
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        sys.stdout.close()
        sys.stderr.close()
        sys.stdout = self._original_stdout
        sys.stderr = self._original_stderr


class LlamaInference:
    """
    Singleton class for managing Llama model inference.
    
    This class ensures only one instance of the model is loaded into memory,
    which is reused for all inference requests. The model is loaded silently
    without any console output.
    
    Usage:
        llama = LlamaInference.get_instance()
        result = llama.generate(
            tool_name="chat",
            input_data="Hello, how are you?",
            max_tokens=500
        )
    """
    
    _instance: Optional['LlamaInference'] = None
    _lock = threading.Lock()
    _model_lock = threading.Lock()  # Separate lock for model operations
    
    def __init__(self, model_path: str, n_ctx: int = 4096, verbose: bool = False):
        """
        Initialize the Llama model.
        
        Args:
            model_path: Path to the GGUF model file
            n_ctx: Context window size (default: 4096)
            verbose: Enable verbose output (default: False, always False for silent operation)
        
        Note:
            This should not be called directly. Use get_instance() instead.
        """
        self.model_path = model_path
        self.model: Optional[Llama] = None
        self.is_loaded = False
        
        # Load model silently
        try:
            with SilenceOutput():
                self.model = Llama(
                    model_path=model_path,
                    n_ctx=n_ctx,
                    verbose=False,  
                    n_threads=4,
                    n_batch=8
                )
            self.is_loaded = True
        except Exception as e:
            logger.error(f"Failed to load model from {model_path}: {e}")
            self.is_loaded = False
            raise
    
    @classmethod
    def get_instance(cls, model_path: Optional[str] = None, n_ctx: int = 4096) -> 'LlamaInference':
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    if model_path is None:
                        raise ValueError("model_path must be provided on first initialization")
                    cls._instance = cls(model_path=model_path, n_ctx=n_ctx)
        return cls._instance
    
    @classmethod
    def is_initialized(cls) -> bool:
        """Check if the singleton instance has been created."""
        return cls._instance is not None and cls._instance.is_loaded
    
    def generate(
        self,
        tool_name: str,
        input_data: str,
        prompt_template: Optional[str] = None,
        max_tokens: int = 2000,
        temperature: float = 0.7,
        top_p: float = 0.9,
        stop: Optional[list] = None
    ) -> Dict[str, Any]:
        """
        Generate text using the loaded Llama model.
        
        Args:
            tool_name: Identifier for the requesting module (e.g., "chat", "quiz", "rubric")
            input_data: The content or task-specific input
            prompt_template: Optional custom task instructions (if None, uses input_data directly)
            max_tokens: Maximum tokens to generate (default: 2000)
            temperature: Sampling temperature (default: 0.7)
            top_p: Top-p sampling parameter (default: 0.9)
            stop: List of stop sequences (default: None)
        
        Returns:
            Dictionary with structured response:
            {
                "tool_name": str,
                "input_summary": str,
                "result": str,
                "metadata": {
                    "status": "success",
                    "tokens_used": {
                        "prompt_tokens": int,
                        "completion_tokens": int,
                        "total_tokens": int
                    }
                }
            }
            
            On error:
            {
                "tool_name": str,
                "result": None,
                "metadata": {
                    "status": "error",
                    "error_message": str
                }
            }
        """
        if not self.is_loaded or self.model is None:
            return {
                "tool_name": tool_name,
                "result": None,
                "metadata": {
                    "status": "error",
                    "error_message": "Model not loaded"
                }
            }
        
        try:
            # Build the prompt
            if prompt_template:
                prompt = prompt_template
            else:
                prompt = input_data
            
            # Create input summary (first 100 chars)
            input_summary = input_data[:100] + "..." if len(input_data) > 100 else input_data
            
            # Default stop sequences if not provided
            if stop is None:
                stop = ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"]
            
            # Thread-safe generation with silent output
            with self._model_lock:
                with SilenceOutput():
                    response = self.model(
                        prompt,
                        max_tokens=max_tokens,
                        temperature=temperature,
                        top_p=top_p,
                        stop=stop,
                        echo=False
                    )
            
            # Extract generated text
            generated_text = response["choices"][0]["text"]
            
            # Extract token usage
            usage = response.get("usage", {})
            prompt_tokens = usage.get("prompt_tokens", 0)
            completion_tokens = usage.get("completion_tokens", 0)
            total_tokens = usage.get("total_tokens", 0)
            
            return {
                "tool_name": tool_name,
                "input_summary": input_summary,
                "result": generated_text.strip(),
                "metadata": {
                    "status": "success",
                    "tokens_used": {
                        "prompt_tokens": prompt_tokens,
                        "completion_tokens": completion_tokens,
                        "total_tokens": total_tokens
                    }
                }
            }
            
        except Exception as e:
            logger.error(f"Generation error for {tool_name}: {e}")
            return {
                "tool_name": tool_name,
                "result": None,
                "metadata": {
                    "status": "error",
                    "error_message": str(e)
                }
            }
    
    def generate_stream(
        self,
        tool_name: str,
        input_data: str,
        prompt_template: Optional[str] = None,
        max_tokens: int = 2000,
        temperature: float = 0.7,
        top_p: float = 0.9,
        stop: Optional[list] = None
    ):
        """
        Generate text using streaming (yields tokens as they're generated).
        
        Args:
            tool_name: Identifier for the requesting module
            input_data: The content or task-specific input
            prompt_template: Optional custom task instructions
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature
            top_p: Top-p sampling parameter
            stop: List of stop sequences
        
        Yields:
            Dict with token data: {"token": str, "finished": bool}
        """
        if not self.is_loaded or self.model is None:
            yield {
                "token": None,
                "finished": True,
                "error": "Model not loaded"
            }
            return
        
        try:
            prompt = prompt_template if prompt_template else input_data
            
            if stop is None:
                stop = ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"]
            
            with self._model_lock:
                with SilenceOutput():
                    stream = self.model(
                        prompt,
                        max_tokens=max_tokens,
                        temperature=temperature,
                        top_p=top_p,
                        stop=stop,
                        echo=False,
                        stream=True
                    )
                    
                    for output in stream:
                        token = output["choices"][0]["text"]
                        yield {
                            "token": token,
                            "finished": False
                        }
            
            yield {"token": "", "finished": True}
            
        except Exception as e:
            logger.error(f"Streaming error for {tool_name}: {e}")
            yield {
                "token": None,
                "finished": True,
                "error": str(e)
            }
    
    def cleanup(self):
        """
        Cleanup the model and free resources.
        
        Note: This should only be called on application shutdown.
        """
        if self.model is not None:
            try:
                with SilenceOutput():
                    del self.model
                self.model = None
                self.is_loaded = False
            except Exception as e:
                logger.error(f"Error during cleanup: {e}")
    
    @classmethod
    def reset_instance(cls):
        """
        Reset the singleton instance (for testing purposes).
        
        Warning: This should not be used in production code.
        """
        with cls._lock:
            if cls._instance is not None:
                cls._instance.cleanup()
                cls._instance = None