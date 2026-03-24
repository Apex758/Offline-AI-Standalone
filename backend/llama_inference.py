import logging
import asyncio
import sys
import os
import queue
import time
import subprocess
import shutil
import base64
from typing import Optional, Dict, Any, List
from llama_cpp import Llama

logger = logging.getLogger(__name__)


def detect_gpu() -> dict:
    """Detect available GPU and return config for llama-cpp-python."""
    # Check for NVIDIA GPU via nvidia-smi
    nvidia_smi = shutil.which("nvidia-smi")
    if nvidia_smi:
        try:
            result = subprocess.run(
                [nvidia_smi, "--query-gpu=name,memory.total", "--format=csv,noheader,nounits"],
                capture_output=True, text=True, timeout=5,
            )
            if result.returncode == 0 and result.stdout.strip():
                gpu_info = result.stdout.strip().split("\n")[0]
                gpu_name, vram_mb = [x.strip() for x in gpu_info.split(",")]
                vram_mb = int(vram_mb)
                logger.info(f"🖥️ NVIDIA GPU detected: {gpu_name} ({vram_mb} MB VRAM)")
                return {
                    "n_gpu_layers": -1,  # Offload all layers
                    "n_batch": 512,
                    "gpu_name": gpu_name,
                    "vram_mb": vram_mb,
                }
        except Exception as e:
            logger.debug(f"nvidia-smi check failed: {e}")

    # No GPU found — CPU fallback
    logger.info("🖥️ No GPU detected, using CPU-only mode")
    return {
        "n_gpu_layers": 0,
        "n_batch": 8,
        "gpu_name": None,
        "vram_mb": 0,
    }

class SilenceOutput:
    """Suppress llama.cpp console noise."""
    def __enter__(self):
        self._stdout = sys.stdout
        self._stderr = sys.stderr
        sys.stdout = open(os.devnull, "w")
        sys.stderr = open(os.devnull, "w")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            sys.stdout.close()
            sys.stderr.close()
        except:
            pass
        sys.stdout = self._stdout
        sys.stderr = self._stderr


class LlamaInference:
    """
    TRUE REAL-TIME STREAMING - Tokens appear AS they're generated!
    
    Key: Use a queue to get tokens from llama-cpp thread immediately.
    """
    
    def __init__(self, model_path: str, n_ctx: int = 4096, verbose: bool = False,
                 clip_model_path: Optional[str] = None):
        """Load the model, optionally with a vision projector."""
        self.model_path = model_path
        self.model: Optional[Llama] = None
        self.is_loaded = False
        self.has_vision = False
        self.gpu_info = detect_gpu()

        try:
            chat_handler = None
            if clip_model_path and os.path.exists(clip_model_path):
                try:
                    from llama_cpp.llama_chat_format import Llava15ChatHandler
                    chat_handler = Llava15ChatHandler(clip_model_path=clip_model_path, verbose=False)
                    self.has_vision = True
                    logger.info(f"✅ Vision projector loaded: {clip_model_path}")
                except Exception as ve:
                    logger.warning(f"⚠️ Could not load vision projector, continuing text-only: {ve}")

            with SilenceOutput():
                self.model = Llama(
                    model_path=model_path,
                    n_ctx=n_ctx,
                    verbose=False,
                    n_threads=4,
                    n_batch=self.gpu_info["n_batch"],
                    n_gpu_layers=self.gpu_info["n_gpu_layers"],
                    **({"chat_handler": chat_handler} if chat_handler else {}),
                )
            self.is_loaded = True
            gpu_status = f"GPU: {self.gpu_info['gpu_name']}" if self.gpu_info["gpu_name"] else "CPU-only"
            vision_status = " + Vision" if self.has_vision else ""
            logger.info(f"✅ Local model loaded ({gpu_status}{vision_status}): {model_path}")
        except Exception as e:
            logger.error(f"❌ Failed to load model: {e}")
            raise

    async def generate(
        self,
        tool_name: str,
        input_data: str,
        prompt_template: Optional[str] = None,
        max_tokens: int = 2000,
        temperature: float = 0.7,
        top_p: float = 0.9,
        stop: Optional[list] = None,
    ) -> Dict[str, Any]:
        """Generate complete response (non-streaming)."""
        if not self.is_loaded or not self.model:
            return {
                "tool_name": tool_name,
                "result": None,
                "metadata": {"status": "error", "error_message": "Model not loaded"},
            }
        
        try:
            prompt = prompt_template if prompt_template else input_data
            if stop is None:
                stop = ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"]

            gen_start = time.perf_counter()

            # Run in thread pool (blocking call)
            def blocking_generate():
                with SilenceOutput():
                    return self.model(
                        prompt,
                        max_tokens=max_tokens,
                        temperature=temperature,
                        top_p=top_p,
                        stop=stop,
                        echo=False,
                    )

            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, blocking_generate)

            gen_end = time.perf_counter()
            total_time_ms = (gen_end - gen_start) * 1000

            generated = response["choices"][0]["text"]
            usage = response.get("usage", {})

            # Record metrics
            try:
                from metrics_service import get_metrics_collector
                get_metrics_collector().record_inference(
                    model_name=os.path.basename(self.model_path),
                    task_type=tool_name,
                    prompt_tokens=usage.get("prompt_tokens", 0),
                    completion_tokens=usage.get("completion_tokens", 0),
                    ttft_ms=total_time_ms,  # Non-streaming: TTFT ≈ total time
                    total_time_ms=total_time_ms,
                )
            except Exception as me:
                logger.debug(f"Metrics recording skipped: {me}")

            return {
                "tool_name": tool_name,
                "input_summary": input_data[:100] + "..." if len(input_data) > 100 else input_data,
                "result": generated.strip(),
                "metadata": {
                    "status": "success",
                    "tokens_used": {
                        "prompt_tokens": usage.get("prompt_tokens", 0),
                        "completion_tokens": usage.get("completion_tokens", 0),
                        "total_tokens": usage.get("total_tokens", 0),
                    },
                },
            }
        
        except Exception as e:
            logger.error(f"❌ Generation error: {e}")
            return {
                "tool_name": tool_name,
                "result": None,
                "metadata": {"status": "error", "error_message": str(e)},
            }

    async def generate_stream(
        self,
        tool_name: str,
        input_data: str,
        prompt_template: Optional[str] = None,
        max_tokens: int = 2000,
        temperature: float = 0.7,
        top_p: float = 0.9,
        stop: Optional[list] = None,
    ):
        """
        TRUE REAL-TIME STREAMING!
        
        Tokens appear IMMEDIATELY as llama-cpp generates them.
        Uses a queue to communicate between thread and async generator.
        """
        if not self.is_loaded or not self.model:
            yield {"token": None, "finished": True, "error": "Model not loaded"}
            return
        
        try:
            prompt = prompt_template if prompt_template else input_data
            if stop is None:
                stop = ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"]

            # ✅ Queue for real-time communication (thread -> async)
            token_queue = queue.Queue(maxsize=100)
            DONE = object()  # Sentinel value

            # Metrics timing
            gen_start = time.perf_counter()
            first_token_time = [None]  # Mutable container for thread access
            token_count = [0]

            def stream_in_thread():
                """Runs in thread - puts tokens in queue AS they're generated."""
                try:
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
                            if first_token_time[0] is None:
                                first_token_time[0] = time.perf_counter()
                            token_count[0] += 1
                            token_queue.put(token)  # Put immediately!
                except Exception as e:
                    token_queue.put(("ERROR", str(e)))
                finally:
                    token_queue.put(DONE)  # Signal completion

            # ✅ Start streaming in background thread
            loop = asyncio.get_event_loop()
            stream_task = loop.run_in_executor(None, stream_in_thread)

            # ✅ Yield tokens as they arrive in queue
            while True:
                # Get next token (non-blocking with timeout)
                try:
                    item = await loop.run_in_executor(
                        None,
                        lambda: token_queue.get(timeout=0.1)
                    )
                except queue.Empty:
                    await asyncio.sleep(0)
                    continue

                # Check if done
                if item is DONE:
                    break

                # Check for error
                if isinstance(item, tuple) and item[0] == "ERROR":
                    yield {"token": None, "finished": True, "error": item[1]}
                    return

                # Yield token IMMEDIATELY
                yield {"token": item, "finished": False}
                await asyncio.sleep(0)  # Let other tasks run

            # All done!
            yield {"token": "", "finished": True}

            # Wait for thread to finish
            await stream_task

            # Record metrics after generation completes
            gen_end = time.perf_counter()
            total_time_ms = (gen_end - gen_start) * 1000
            ttft_ms = ((first_token_time[0] - gen_start) * 1000) if first_token_time[0] else 0
            try:
                from metrics_service import get_metrics_collector
                get_metrics_collector().record_inference(
                    model_name=os.path.basename(self.model_path),
                    task_type=tool_name,
                    completion_tokens=token_count[0],
                    ttft_ms=ttft_ms,
                    total_time_ms=total_time_ms,
                )
            except Exception as me:
                logger.debug(f"Metrics recording skipped: {me}")
        
        except Exception as e:
            logger.error(f"❌ Streaming error: {e}")
            yield {"token": None, "finished": True, "error": str(e)}

    async def analyze_image(
        self,
        image_base64: str,
        prompt: str = "Describe this image in detail.",
        max_tokens: int = 1024,
        temperature: float = 0.4,
    ) -> Dict[str, Any]:
        """Analyze an image using the vision projector.

        Args:
            image_base64: Base64-encoded image (JPEG/PNG).
            prompt: The question or instruction about the image.
            max_tokens: Max tokens for the response.
            temperature: Sampling temperature.

        Returns:
            Dict with 'result' (text) and 'metadata'.
        """
        if not self.is_loaded or not self.model:
            return {"result": None, "metadata": {"status": "error", "error_message": "Model not loaded"}}

        if not self.has_vision:
            return {"result": None, "metadata": {"status": "error", "error_message": "Vision not available — no projector loaded"}}

        try:
            # Build data URI if raw base64 was provided
            if not image_base64.startswith("data:"):
                image_base64 = f"data:image/png;base64,{image_base64}"

            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": image_base64}},
                    ],
                }
            ]

            gen_start = time.perf_counter()

            def blocking_vision():
                with SilenceOutput():
                    return self.model.create_chat_completion(
                        messages=messages,
                        max_tokens=max_tokens,
                        temperature=temperature,
                    )

            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, blocking_vision)

            gen_end = time.perf_counter()
            total_time_ms = (gen_end - gen_start) * 1000

            result_text = response["choices"][0]["message"]["content"]
            usage = response.get("usage", {})

            # Record metrics
            try:
                from metrics_service import get_metrics_collector
                get_metrics_collector().record_inference(
                    model_name=os.path.basename(self.model_path),
                    task_type="vision_analyze",
                    prompt_tokens=usage.get("prompt_tokens", 0),
                    completion_tokens=usage.get("completion_tokens", 0),
                    ttft_ms=total_time_ms,
                    total_time_ms=total_time_ms,
                )
            except Exception as me:
                logger.debug(f"Metrics recording skipped: {me}")

            return {
                "result": result_text.strip(),
                "metadata": {
                    "status": "success",
                    "total_time_ms": round(total_time_ms, 1),
                    "tokens_used": {
                        "prompt_tokens": usage.get("prompt_tokens", 0),
                        "completion_tokens": usage.get("completion_tokens", 0),
                        "total_tokens": usage.get("total_tokens", 0),
                    },
                },
            }

        except Exception as e:
            logger.error(f"❌ Vision analysis error: {e}")
            return {"result": None, "metadata": {"status": "error", "error_message": str(e)}}

    async def cleanup(self):
        """Cleanup model."""
        if self.model:
            try:
                with SilenceOutput():
                    del self.model
                self.model = None
                self.is_loaded = False
                logger.info("✅ Local model cleaned up")
            except Exception as e:
                logger.error(f"❌ Cleanup error: {e}")


# Process pool function (if needed for old code)
def run_llama_inference(prompt: str, settings: dict) -> dict:
    """Standalone function for process pools (not recommended)."""
    model_path = settings.get("model_path")
    if not model_path:
        return {
            "tool_name": settings.get("tool_name", "llama_pool"),
            "result": None,
            "metadata": {"status": "error", "error_message": "model_path required"},
        }
    
    try:
        gpu = detect_gpu()
        with SilenceOutput():
            model = Llama(
                model_path=model_path,
                n_ctx=settings.get("n_ctx", 4096),
                verbose=False,
                n_threads=4,
                n_batch=gpu["n_batch"],
                n_gpu_layers=gpu["n_gpu_layers"],
            )
        
        prompt_text = settings.get("prompt_template") or prompt
        stop = settings.get("stop", ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"])
        
        with SilenceOutput():
            response = model(
                prompt_text,
                max_tokens=settings.get("max_tokens", 2000),
                temperature=settings.get("temperature", 0.7),
                top_p=settings.get("top_p", 0.9),
                stop=stop,
                echo=False,
            )
        
        return {
            "tool_name": settings.get("tool_name", "llama_pool"),
            "input_summary": prompt[:100] + "..." if len(prompt) > 100 else prompt,
            "result": response["choices"][0]["text"].strip(),
            "metadata": {
                "status": "success",
                "tokens_used": response.get("usage", {}),
            },
        }
    except Exception as e:
        return {
            "tool_name": settings.get("tool_name", "llama_pool"),
            "result": None,
            "metadata": {"status": "error", "error_message": str(e)},
        }