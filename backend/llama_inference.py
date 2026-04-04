import logging
import asyncio
import sys
import os
import io
import queue
import threading
import time
import subprocess
import shutil
import base64
from typing import Optional, Dict, Any, List
from llama_cpp import Llama

# Monkey-patch llama-cpp-python ≤0.3.19 __del__ bug
# (AttributeError: 'LlamaModel' object has no attribute 'sampler')
try:
    from llama_cpp._internals import LlamaModel as _LlamaModel
    _original_del = _LlamaModel.__del__
    def _safe_del(self):
        try:
            _original_del(self)
        except AttributeError:
            pass
    _LlamaModel.__del__ = _safe_del
except Exception:
    pass

def _optimal_thread_count() -> int:
    """Return a sensible thread count for llama-cpp inference.

    Uses physical core count (not logical/hyperthreaded) when possible,
    capped to leave 1 core free for the OS/event-loop.
    """
    try:
        physical = os.cpu_count()  # logical cores
        # On most consumer CPUs, physical ~ logical/2 (hyperthreading).
        # llama-cpp benefits more from physical cores than HT threads.
        import psutil
        physical = psutil.cpu_count(logical=False) or physical
    except Exception:
        physical = os.cpu_count() or 4
    # Use all physical cores minus 1, minimum 2
    return max(2, (physical or 4) - 1)

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
        "n_batch": 512,
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
    
    # Model family detection and config
    MODEL_FAMILIES = {
        "qwen3": {
            "handler_class": "Llava15ChatHandler",
            "stop_tokens": ["<|im_end|>", "<|endoftext|>", "<|im_start|>"],
            "prompt_format": "chatml",
            "supports_thinking": True,
        },
        "qwen2.5-vl": {
            "handler_class": "Qwen25VLChatHandler",
            "stop_tokens": ["<|im_end|>", "<|endoftext|>", "<|im_start|>"],
            "prompt_format": "chatml",
            "supports_thinking": True,
        },
        "qwen2-vl": {
            "handler_class": "Qwen25VLChatHandler",
            "stop_tokens": ["<|im_end|>", "<|endoftext|>", "<|im_start|>"],
            "prompt_format": "chatml",
            "supports_thinking": True,
        },
        "qwen2": {
            "handler_class": "Llava15ChatHandler",
            "stop_tokens": ["<|im_end|>", "<|endoftext|>", "<|im_start|>"],
            "prompt_format": "chatml",
            "supports_thinking": True,
        },
        "phi4-mm": {
            "handler_class": "Llava15ChatHandler",
            "stop_tokens": ["<|end|>", "<|endoftext|>"],
            "prompt_format": "phi",
            "supports_thinking": False,
            "vision_chat_format": (
                "{% for message in messages %}"
                "{% if message.role == 'system' %}<|system|>{{ message.content }}<|end|>\n{% endif %}"
                "{% if message.role == 'user' %}<|user|>"
                "{% if message.content is string %}{{ message.content }}"
                "{% endif %}"
                "{% if message.content is iterable %}"
                "{% for content in message.content %}"
                "{% if content.type == 'image_url' and content.image_url is string %}{{ content.image_url }}{% endif %}"
                "{% if content.type == 'image_url' and content.image_url is mapping %}{{ content.image_url.url }}{% endif %}"
                "{% endfor %}"
                "{% for content in message.content %}{% if content.type == 'text' %}{{ content.text }}{% endif %}{% endfor %}"
                "{% endif %}"
                "<|end|>\n{% endif %}"
                "{% if message.role == 'assistant' and message.content is not none %}"
                "<|assistant|>{{ message.content }}<|end|>\n{% endif %}"
                "{% endfor %}"
                "{% if add_generation_prompt %}<|assistant|>{% endif %}"
            ),
        },
        "phi-4": {
            "handler_class": "Llava15ChatHandler",
            "stop_tokens": ["<|end|>", "<|endoftext|>"],
            "prompt_format": "phi",
            "supports_thinking": False,
        },
        "lfm2": {
            "handler_class": "Llava15ChatHandler",
            "stop_tokens": ["<|im_end|>", "<|endoftext|>", "<|im_start|>"],
            "prompt_format": "chatml",
            "supports_thinking": False,
        },
        "llava": {
            "handler_class": "Llava15ChatHandler",
            "stop_tokens": ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"],
            "prompt_format": "llama",
            "supports_thinking": False,
        },
        "gemma4": {
            "handler_class": "Llava15ChatHandler",
            "stop_tokens": ["<end_of_turn>", "<eos>"],
            "prompt_format": "gemma",
            "supports_thinking": False,
        },
    }

    @staticmethod
    def detect_model_family(model_path: str) -> dict:
        """Detect model family from filename and return config."""
        name = os.path.basename(model_path).lower()
        for family_key, config in LlamaInference.MODEL_FAMILIES.items():
            if family_key in name:
                return {"family": family_key, **config}
        # Default fallback
        return {
            "family": "generic",
            "handler_class": "Llava15ChatHandler",
            "stop_tokens": ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"],
            "prompt_format": "llama",
            "supports_thinking": False,
        }

    def __init__(self, model_path: str, n_ctx: int = 4096, verbose: bool = False,
                 clip_model_path: Optional[str] = None):
        """Load the model, optionally with a vision projector."""
        self.model_path = model_path
        self.model: Optional[Llama] = None
        self.is_loaded = False
        self.has_vision = False
        self.gpu_info = detect_gpu()
        self.model_config = self.detect_model_family(model_path)
        logger.info(f"Detected model family: {self.model_config['family']} (prompt: {self.model_config['prompt_format']})")

        try:
            chat_handler = None
            if clip_model_path and os.path.exists(clip_model_path):
                try:
                    handler_name = self.model_config["handler_class"]
                    from llama_cpp import llama_chat_format
                    HandlerClass = getattr(llama_chat_format, handler_name)

                    # Load vision handler with timeout to avoid hanging on incompatible models
                    import concurrent.futures
                    def _init_handler():
                        return HandlerClass(clip_model_path=clip_model_path, verbose=False)

                    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                        future = pool.submit(_init_handler)
                        chat_handler = future.result(timeout=60)

                    # Override handler's chat format if model family needs it
                    vision_fmt = self.model_config.get("vision_chat_format")
                    if vision_fmt and chat_handler is not None:
                        chat_handler.CHAT_FORMAT = vision_fmt
                        logger.info(f"Overrode vision chat format for {self.model_config['family']}")

                    self.has_vision = True
                    logger.info(f"✅ Vision projector loaded ({handler_name}): {clip_model_path}")
                except concurrent.futures.TimeoutError:
                    logger.warning(f"⚠️ Vision projector timed out after 60s, continuing text-only")
                    chat_handler = None
                except Exception as ve:
                    logger.warning(f"⚠️ Could not load vision projector, continuing text-only: {ve}")
                    chat_handler = None

            n_threads = _optimal_thread_count()
            with SilenceOutput():
                self.model = Llama(
                    model_path=model_path,
                    n_ctx=n_ctx,
                    verbose=False,
                    n_threads=n_threads,
                    n_batch=self.gpu_info["n_batch"],
                    n_gpu_layers=self.gpu_info["n_gpu_layers"],
                    **({"chat_handler": chat_handler} if chat_handler else {}),
                )
            self.n_ctx = n_ctx
            self.is_loaded = True
            gpu_status = f"GPU: {self.gpu_info['gpu_name']}" if self.gpu_info["gpu_name"] else "CPU-only"
            vision_status = " + Vision" if self.has_vision else ""
            logger.info(f"✅ Local model loaded ({gpu_status}{vision_status}, threads={n_threads}): {model_path}")
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
        repeat_penalty: float = 1.1,
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
                stop = self.model_config["stop_tokens"]

            gen_start = time.perf_counter()

            # Run in thread pool (blocking call)
            resource_snapshot = [0.0, 0.0]  # [cpu_percent, ram_mb]
            def blocking_generate():
                with SilenceOutput():
                    result = self.model(
                        prompt,
                        max_tokens=max_tokens,
                        temperature=temperature,
                        top_p=top_p,
                        repeat_penalty=repeat_penalty,
                        stop=stop,
                        echo=False,
                    )
                # Capture resources while model is still hot in memory
                try:
                    import psutil
                    proc = psutil.Process(os.getpid())
                    resource_snapshot[0] = proc.cpu_percent(interval=None)
                    resource_snapshot[1] = round(proc.memory_info().rss / (1024 * 1024), 2)
                except Exception:
                    pass
                return result

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
                    ttft_ms=0,  # Non-streaming: no meaningful TTFT
                    total_time_ms=total_time_ms,
                    cpu_percent=resource_snapshot[0],
                    ram_usage_mb=resource_snapshot[1],
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
        repeat_penalty: float = 1.1,
        cancel_event: Optional[threading.Event] = None,
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
                stop = self.model_config["stop_tokens"]

            # Safety: check prompt token count before sending to native code
            try:
                prompt_tokens = self.model.tokenize(prompt.encode("utf-8"))
                max_prompt_tokens = self.n_ctx - max_tokens - 64  # leave margin
                if len(prompt_tokens) > max_prompt_tokens:
                    logger.warning(f"Prompt too long: {len(prompt_tokens)} tokens (max {max_prompt_tokens}). Truncating.")
                    prompt_tokens = prompt_tokens[:max_prompt_tokens]
                    prompt = self.model.detokenize(prompt_tokens).decode("utf-8", errors="replace")
            except Exception as te:
                logger.warning(f"Token count check failed: {te}")

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
                            repeat_penalty=repeat_penalty,
                            stop=stop,
                            echo=False,
                            stream=True,
                        )
                        for output in stream:
                            if cancel_event and cancel_event.is_set():
                                break
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

                # Check for cancellation
                if cancel_event and cancel_event.is_set():
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
            # Capture resources while model is still hot
            snap_cpu, snap_ram = 0.0, 0.0
            try:
                import psutil
                proc = psutil.Process(os.getpid())
                snap_cpu = proc.cpu_percent(interval=None)
                snap_ram = round(proc.memory_info().rss / (1024 * 1024), 2)
            except Exception:
                pass
            try:
                from metrics_service import get_metrics_collector
                get_metrics_collector().record_inference(
                    model_name=os.path.basename(self.model_path),
                    task_type=tool_name,
                    completion_tokens=token_count[0],
                    ttft_ms=ttft_ms,
                    total_time_ms=total_time_ms,
                    cpu_percent=snap_cpu,
                    ram_usage_mb=snap_ram,
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

            resource_snapshot = [0.0, 0.0]
            def blocking_vision():
                with SilenceOutput():
                    result = self.model.create_chat_completion(
                        messages=messages,
                        max_tokens=max_tokens,
                        temperature=temperature,
                    )
                try:
                    import psutil
                    proc = psutil.Process(os.getpid())
                    resource_snapshot[0] = proc.cpu_percent(interval=None)
                    resource_snapshot[1] = round(proc.memory_info().rss / (1024 * 1024), 2)
                except Exception:
                    pass
                return result

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
                    ttft_ms=0,  # Non-streaming: no meaningful TTFT
                    total_time_ms=total_time_ms,
                    cpu_percent=resource_snapshot[0],
                    ram_usage_mb=resource_snapshot[1],
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

    async def generate_stream_vision(
        self,
        messages: list,
        images_base64: list,
        max_tokens: int = 2000,
        temperature: float = 0.7,
    ):
        """
        Streaming generation with vision support.

        Uses create_chat_completion with image content for multimodal input.
        Falls back to text-only if vision is not available.
        """
        if not self.is_loaded or not self.model:
            yield {"token": None, "finished": True, "error": "Model not loaded"}
            return

        if not self.has_vision:
            yield {"token": None, "finished": True, "error": "Vision not available — no projector loaded"}
            return

        try:
            # Build multimodal messages for the vision model
            # Preprocess and convert images to data URIs
            image_content = []
            for img_b64 in images_base64[:2]:  # Cap at 2 images
                # Strip data URI prefix if present
                raw_b64 = img_b64.split(",", 1)[-1] if img_b64.startswith("data:") else img_b64
                # Resize image to reduce token count and speed up processing
                try:
                    import base64 as b64module
                    from PIL import Image as PILImage
                    img_bytes = b64module.b64decode(raw_b64)
                    img = PILImage.open(io.BytesIO(img_bytes))
                    # Resize to max 512px on longest side (smaller = faster CLIP encoding)
                    max_dim = 512
                    if max(img.size) > max_dim:
                        ratio = max_dim / max(img.size)
                        new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
                        img = img.resize(new_size, PILImage.LANCZOS)
                        logger.info(f"Resized image from {img.size} to {new_size} for vision")
                    # Re-encode as JPEG for smaller payload
                    buf = io.BytesIO()
                    img.convert("RGB").save(buf, format="JPEG", quality=85)
                    raw_b64 = b64module.b64encode(buf.getvalue()).decode("ascii")
                except Exception as resize_err:
                    logger.debug(f"Image resize skipped: {resize_err}")
                data_uri = f"data:image/jpeg;base64,{raw_b64}"
                image_content.append({"type": "image_url", "image_url": {"url": data_uri}})

            # Build the chat messages with images in the last user message
            chat_messages = []
            for msg in messages:
                if msg["role"] == "system":
                    chat_messages.append({"role": "system", "content": msg["content"]})
                elif msg["role"] == "assistant":
                    chat_messages.append({"role": "assistant", "content": msg["content"]})
                elif msg["role"] == "user" and msg.get("_is_current"):
                    # Current message: attach images
                    content_parts = [{"type": "text", "text": msg["content"]}] + image_content
                    chat_messages.append({"role": "user", "content": content_parts})
                else:
                    chat_messages.append({"role": "user", "content": msg["content"]})

            token_queue = queue.Queue(maxsize=100)
            DONE = object()

            gen_start = time.perf_counter()
            first_token_time = [None]
            token_count = [0]

            def stream_vision_in_thread():
                try:
                    with SilenceOutput():
                        stream = self.model.create_chat_completion(
                            messages=chat_messages,
                            max_tokens=max_tokens,
                            temperature=temperature,
                            stream=True,
                            stop=self.model_config["stop_tokens"] + ["USER:", "user:", "<|start_header_id|>", "<|im_start|>"],
                        )
                        accumulated = ""
                        for chunk in stream:
                            delta = chunk["choices"][0].get("delta", {})
                            token = delta.get("content", "")
                            if token:
                                # Stop if model starts hallucinating a new user turn
                                accumulated += token
                                if "USER:" in accumulated or "user:" in accumulated or "<|start_header_id|>" in accumulated or "<|user|>" in accumulated:
                                    break
                                if first_token_time[0] is None:
                                    first_token_time[0] = time.perf_counter()
                                token_count[0] += 1
                                token_queue.put(token)
                except Exception as e:
                    token_queue.put(("ERROR", str(e)))
                finally:
                    token_queue.put(DONE)

            loop = asyncio.get_event_loop()
            stream_task = loop.run_in_executor(None, stream_vision_in_thread)

            while True:
                try:
                    item = await loop.run_in_executor(
                        None,
                        lambda: token_queue.get(timeout=0.1)
                    )
                except queue.Empty:
                    await asyncio.sleep(0)
                    continue

                if item is DONE:
                    break

                if isinstance(item, tuple) and item[0] == "ERROR":
                    yield {"token": None, "finished": True, "error": item[1]}
                    return

                yield {"token": item, "finished": False}
                await asyncio.sleep(0)

            yield {"token": "", "finished": True}
            await stream_task

            # Record metrics
            gen_end = time.perf_counter()
            total_time_ms = (gen_end - gen_start) * 1000
            ttft_ms = ((first_token_time[0] - gen_start) * 1000) if first_token_time[0] else 0
            snap_cpu, snap_ram = 0.0, 0.0
            try:
                import psutil
                proc = psutil.Process(os.getpid())
                snap_cpu = proc.cpu_percent(interval=None)
                snap_ram = round(proc.memory_info().rss / (1024 * 1024), 2)
            except Exception:
                pass
            try:
                from metrics_service import get_metrics_collector
                get_metrics_collector().record_inference(
                    model_name=os.path.basename(self.model_path),
                    task_type="chat_vision",
                    completion_tokens=token_count[0],
                    ttft_ms=ttft_ms,
                    total_time_ms=total_time_ms,
                    cpu_percent=snap_cpu,
                    ram_usage_mb=snap_ram,
                )
            except Exception as me:
                logger.debug(f"Metrics recording skipped: {me}")

        except Exception as e:
            logger.error(f"❌ Vision streaming error: {e}")
            yield {"token": None, "finished": True, "error": str(e)}

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