import logging
import threading
import sys
import os
from typing import Optional, Dict, Any, Iterator
from llama_cpp import Llama

# Configure logging - ERROR level only
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)


class SilenceOutput:
    """Context manager to suppress all stdout/stderr output from llama.cpp."""

    def __enter__(self):
        self._original_stdout = sys.stdout
        self._original_stderr = sys.stderr
        sys.stdout = open(os.devnull, "w")
        sys.stderr = open(os.devnull, "w")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            sys.stdout.close()
        except Exception:
            pass
        try:
            sys.stderr.close()
        except Exception:
            pass
        sys.stdout = self._original_stdout
        sys.stderr = self._original_stderr


class LlamaInference:
    """
    Manages a single Llama model instance for inference.

    Singleton access:
        Use LlamaInference.get_instance() to obtain a shared instance.

    Notes:
      - This class loads a Llama model silently (suppresses llama.cpp stdout/stderr).
      - Calls to the underlying model are guarded by a lock to avoid concurrent
        access issues in multi-threaded scenarios.
    """

    _instance = None
    _instance_lock = threading.Lock()

    @classmethod
    def get_instance(
        cls,
        model_path: str = "models/llama-2-7b-chat.Q4_K_M.gguf",
        n_ctx: int = 4096,
        verbose: bool = False,  # kept for API compatibility; ignored for silent operation
    ):
        """Return singleton instance (thread-safe)."""
        if cls._instance is None:
            with cls._instance_lock:
                if cls._instance is None:
                    cls._instance = cls(model_path=model_path, n_ctx=n_ctx, verbose=verbose)
        return cls._instance

    def __init__(self, model_path: str, n_ctx: int = 4096, verbose: bool = False):
        """
        Initialize the Llama model.

        Args:
            model_path: Path to the GGUF model file
            n_ctx: Context window size (default: 4096)
            verbose: Ignored; model is always loaded with verbose=False to keep silent.
        """
        self.model_path = model_path
        self.model: Optional[Llama] = None
        self.is_loaded = False

        # Guard model calls (llama_cpp wrapper is not reliably thread-safe).
        self._gen_lock = threading.Lock()

        try:
            with SilenceOutput():
                self.model = Llama(
                    model_path=model_path,
                    n_ctx=n_ctx,
                    verbose=False,
                    n_threads=4,
                    n_batch=8,
                )
            self.is_loaded = True
        except Exception as e:
            logger.error(f"Failed to load model from {model_path}: {e}")
            self.is_loaded = False
            raise

    def generate(
        self,
        tool_name: str,
        input_data: str,
        prompt_template: Optional[str] = None,
        max_tokens: int = 2000,
        temperature: float = 0.7,
        top_p: float = 0.9,
        stop: Optional[list] = None,
    ) -> Dict[str, Any]:
        """Generate a full completion (non-streaming)."""
        if not self.is_loaded or self.model is None:
            return {
                "tool_name": tool_name,
                "result": None,
                "metadata": {"status": "error", "error_message": "Model not loaded"},
            }

        try:
            prompt = prompt_template if prompt_template else input_data
            input_summary = input_data[:100] + "..." if len(input_data) > 100 else input_data

            if stop is None:
                stop = ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"]

            with self._gen_lock:
                with SilenceOutput():
                    response = self.model(
                        prompt,
                        max_tokens=max_tokens,
                        temperature=temperature,
                        top_p=top_p,
                        stop=stop,
                        echo=False,
                    )

            generated_text = response["choices"][0]["text"]

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
                        "total_tokens": total_tokens,
                    },
                },
            }

        except Exception as e:
            logger.error(f"Generation error for {tool_name}: {e}")
            return {
                "tool_name": tool_name,
                "result": None,
                "metadata": {"status": "error", "error_message": str(e)},
            }

    def generate_stream(
        self,
        tool_name: str,
        input_data: str,
        prompt_template: Optional[str] = None,
        max_tokens: int = 2000,
        temperature: float = 0.7,
        top_p: float = 0.9,
        stop: Optional[list] = None,
    ) -> Iterator[Dict[str, Any]]:
        """
        Generate using streaming (yields tokens as they're generated).

        Yields:
            {"token": str, "finished": bool} or {"error": str, "finished": True}
        """
        if not self.is_loaded or self.model is None:
            yield {"token": None, "finished": True, "error": "Model not loaded"}
            return

        prompt = prompt_template if prompt_template else input_data

        if stop is None:
            stop = ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"]

        try:
            # IMPORTANT: lock held for the whole stream to prevent concurrent model access.
            with self._gen_lock:
                with SilenceOutput():
                    stream = self.model(
                        prompt,
                        max_tokens=max_tokens,
                        temperature=temperature,
                        top_p=top_p,
                        stop=stop,
                        echo=False,
                        stream=True,
                    )

                    for output in stream:
                        token = output["choices"][0]["text"]
                        yield {"token": token, "finished": False}

            yield {"token": "", "finished": True}

        except Exception as e:
            logger.error(f"Streaming error for {tool_name}: {e}")
            yield {"token": None, "finished": True, "error": str(e)}

    def cleanup(self):
        """Cleanup model resources (call on application shutdown)."""
        if self.model is not None:
            try:
                with self._gen_lock:
                    with SilenceOutput():
                        del self.model
                self.model = None
                self.is_loaded = False
            except Exception as e:
                logger.error(f"Error during cleanup: {e}")


# Standalone, picklable inference function for process pool use
def run_llama_inference(prompt: str, settings: dict) -> dict:
    """
    Standalone function to run Llama inference for use in process pools.
    NOTE: This loads a fresh model each call (expensive). Prefer LlamaInference singleton for normal use.
    """
    model_path = settings.get("model_path")
    if not model_path:
        return {
            "tool_name": settings.get("tool_name", "llama_pool"),
            "result": None,
            "metadata": {"status": "error", "error_message": "settings.model_path is required"},
        }

    n_ctx = settings.get("n_ctx", 4096)
    max_tokens = settings.get("max_tokens", 2000)
    temperature = settings.get("temperature", 0.7)
    top_p = settings.get("top_p", 0.9)
    stop = settings.get("stop", ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"])
    tool_name = settings.get("tool_name", "llama_pool")
    prompt_template = settings.get("prompt_template", None)

    try:
        with SilenceOutput():
            model = Llama(
                model_path=model_path,
                n_ctx=n_ctx,
                verbose=False,
                n_threads=4,
                n_batch=8,
            )

        prompt_text = prompt_template if prompt_template else prompt
        input_summary = prompt[:100] + "..." if len(prompt) > 100 else prompt

        with SilenceOutput():
            response = model(
                prompt_text,
                max_tokens=max_tokens,
                temperature=temperature,
                top_p=top_p,
                stop=stop,
                echo=False,
            )

        generated_text = response["choices"][0]["text"]
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
                    "total_tokens": total_tokens,
                },
            },
        }

    except Exception as e:
        return {
            "tool_name": tool_name,
            "result": None,
            "metadata": {"status": "error", "error_message": str(e)},
        }
