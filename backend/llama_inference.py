import logging
import asyncio
import sys
import os
import io
import queue
import re
import threading
import time
import subprocess
import shutil
import base64
from typing import Optional, Dict, Any, List
from llama_cpp import Llama, LlamaGrammar

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

from cpu_info import (
    optimal_thread_count as _optimal_thread_count,
    optimal_batch_thread_count as _optimal_batch_thread_count,
)

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
    # n_batch=1024 is better for CPU prompt processing throughput on modern
    # multi-core chips. The cost is a small bump in peak memory during the
    # prompt phase; during generation the working set is the same.
    logger.info("🖥️ No GPU detected, using CPU-only mode")
    return {
        "n_gpu_layers": 0,
        "n_batch": 1024,
        "gpu_name": None,
        "vram_mb": 0,
    }

def _should_use_mlock(model_path: str) -> bool:
    """Decide whether to pin the model in RAM via use_mlock.

    Returns True only when the system has enough free memory to hold the
    model plus reasonable headroom. On constrained systems we fall back to
    mmap-only so the app still loads. The decision is made at runtime per
    machine — no hardcoded assumptions about the host.
    """
    try:
        model_size_bytes = os.path.getsize(model_path)
    except Exception:
        return False

    try:
        import psutil
        vm = psutil.virtual_memory()
        # Require the model to fit within ~60% of available RAM, leaving
        # room for the KV cache, OS, and the rest of the app. This is a
        # conservative safety margin — if the system is already tight on
        # memory we'd rather let mmap handle paging than fail the load.
        required = int(model_size_bytes * 1.6)
        if vm.available >= required:
            logger.info(
                "[llama] use_mlock enabled (model=%d MB, available=%d MB)",
                model_size_bytes // (1024 * 1024),
                vm.available // (1024 * 1024),
            )
            return True
        logger.info(
            "[llama] use_mlock disabled — not enough free RAM "
            "(model=%d MB, available=%d MB, required=%d MB)",
            model_size_bytes // (1024 * 1024),
            vm.available // (1024 * 1024),
            required // (1024 * 1024),
        )
        return False
    except Exception as e:
        logger.debug("[llama] mlock RAM check failed (%s); defaulting to False", e)
        return False


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

    # ------------------------------------------------------------------
    # Compiled-grammar cache
    #
    # LlamaGrammar.from_json_schema() is expensive — it builds a GBNF
    # state machine that can take hundreds of ms on complex schemas.
    # Without caching, we rebuild the same grammar on every single
    # schema-constrained request, which on CPU accounts for a measurable
    # chunk of the per-request overhead.
    #
    # Keyed by a stable hash of the schema JSON so two different schemas
    # never collide. CPython dict operations are atomic under the GIL,
    # so no lock is needed for simple get/set. If two requests race to
    # compile the same schema the worst case is a redundant compile on
    # the loser — never a correctness issue.
    # ------------------------------------------------------------------
    _grammar_cache: Dict[str, "LlamaGrammar"] = {}

    @classmethod
    def _get_cached_grammar(cls, json_schema: Any) -> "Optional[LlamaGrammar]":
        """Return a compiled LlamaGrammar for the given JSON schema.

        On first use for a given schema, compiles and caches. On subsequent
        calls, returns the cached instance immediately. Returns None on
        compilation failure so callers can degrade gracefully.
        """
        try:
            import json as _json
            # sort_keys ensures equivalent schemas map to the same cache key
            # regardless of dict insertion order.
            key = _json.dumps(json_schema, sort_keys=True, default=str)
        except Exception:
            # If the schema isn't JSON-serializable at all, we can't cache it.
            try:
                return LlamaGrammar.from_json_schema(
                    _json.dumps(json_schema), verbose=False
                )
            except Exception:
                return None

        cached = cls._grammar_cache.get(key)
        if cached is not None:
            return cached

        try:
            import json as _json
            compiled = LlamaGrammar.from_json_schema(
                _json.dumps(json_schema), verbose=False
            )
            cls._grammar_cache[key] = compiled
            logger.info(
                "[llama] Compiled new grammar (cache_size=%d)",
                len(cls._grammar_cache),
            )
            return compiled
        except Exception as exc:
            logger.warning("[llama] Grammar compilation failed: %s", exc)
            return None

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
            "stop_tokens": ["<turn|>", "<eos>"],
            "prompt_format": "gemma4",
            "supports_thinking": False,
        },
        "gemma-4": {
            "handler_class": "Llava15ChatHandler",
            "stop_tokens": ["<turn|>", "<eos>"],
            "prompt_format": "gemma4",
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
            # Token gen uses P-cores only on hybrid chips; prefill uses all
            # physical cores because prompt eval is throughput-bound and
            # E-cores contribute without hurting per-token latency.
            n_threads_batch = _optimal_batch_thread_count()
            # use_mlock pins the model in RAM to prevent Windows/Linux from
            # paging it to disk under memory pressure. Only enable when the
            # OS has enough free memory to hold the model; otherwise the
            # allocation fails and we fall back to mmap-only.
            _want_mlock = _should_use_mlock(model_path)
            _n_batch = self.gpu_info["n_batch"]
            with SilenceOutput():
                _llama_kwargs = dict(
                    model_path=model_path,
                    n_ctx=n_ctx,
                    verbose=False,
                    n_threads=n_threads,
                    n_threads_batch=n_threads_batch,
                    n_batch=_n_batch,
                    # n_ubatch equal to n_batch removes an internal prefill
                    # micro-batch split, improving SIMD utilization on CPU.
                    n_ubatch=_n_batch,
                    n_gpu_layers=self.gpu_info["n_gpu_layers"],
                    use_mmap=True,
                    use_mlock=_want_mlock,
                    # Flash Attention cuts attention memory bandwidth ~30%;
                    # works on any AVX2 x86-64 CPU (2013+). Required for
                    # quantized V-cache (type_v="q8_0") in current llama.cpp.
                    flash_attn=True,
                    # q8_0 KV cache halves KV memory with negligible quality
                    # loss (<0.1 perplexity delta; grammar-constrained output
                    # filters any marginal logit wobble anyway). Meaningful
                    # RAM relief on 8GB distribution targets.
                    type_k="q8_0",
                    type_v="q8_0",
                )
                if chat_handler is not None:
                    _llama_kwargs["chat_handler"] = chat_handler

                def _try_load(kwargs):
                    return Llama(**kwargs)

                # Layered fallback: each new kwarg below may be unsupported
                # on an older llama-cpp-python version shipped to a distro
                # target. If loading fails with a kwarg-related error, drop
                # the most recent additions and retry — model still loads,
                # just without that specific optimization.
                _OPTIONAL_KWARGS = (
                    "type_k", "type_v",      # q8_0 KV cache
                    "flash_attn",            # flash attention
                    "n_ubatch",              # prefill micro-batch
                    "n_threads_batch",       # split thread pools
                )
                try:
                    self.model = _try_load(_llama_kwargs)
                except TypeError as _kw_err:
                    # llama-cpp-python raises TypeError on unknown kwargs.
                    msg = str(_kw_err)
                    dropped = []
                    _retry = dict(_llama_kwargs)
                    for _k in _OPTIONAL_KWARGS:
                        if _k in msg or _k in _retry:
                            _retry.pop(_k, None)
                            dropped.append(_k)
                    if dropped:
                        logger.warning(
                            "[llama] kwargs unsupported (%s); retrying without: %s",
                            _kw_err, ", ".join(dropped),
                        )
                        try:
                            self.model = _try_load(_retry)
                        except Exception as _mlock_err:
                            if _want_mlock and "mlock" in str(_mlock_err).lower():
                                logger.warning(
                                    "[llama] use_mlock=True failed (%s); retrying with use_mlock=False",
                                    _mlock_err,
                                )
                                _retry["use_mlock"] = False
                                self.model = _try_load(_retry)
                            else:
                                raise
                    else:
                        raise
                except Exception as _load_err:
                    # Non-TypeError load failure — most commonly mlock on a
                    # low-RAM machine. Retry without mlock, keeping the rest
                    # of the optimizations.
                    if _want_mlock and "mlock" in str(_load_err).lower():
                        logger.warning(
                            "[llama] use_mlock=True failed (%s); retrying with use_mlock=False",
                            _load_err,
                        )
                        _llama_kwargs["use_mlock"] = False
                        try:
                            self.model = _try_load(_llama_kwargs)
                        except TypeError as _kw_err2:
                            # Optimizations unsupported on this version too.
                            _retry = dict(_llama_kwargs)
                            for _k in _OPTIONAL_KWARGS:
                                _retry.pop(_k, None)
                            logger.warning(
                                "[llama] retrying without optimization kwargs: %s",
                                _kw_err2,
                            )
                            self.model = _try_load(_retry)
                    else:
                        # Could be q8_0 KV not supported without flash_attn on
                        # a patched-out build, or flash_attn unavailable on a
                        # pre-AVX2 CPU. Progressive drop of optional kwargs.
                        _retry = dict(_llama_kwargs)
                        dropped_any = False
                        for _k in _OPTIONAL_KWARGS:
                            if _k in _retry:
                                _retry.pop(_k)
                                dropped_any = True
                        if dropped_any:
                            logger.warning(
                                "[llama] load failed (%s); retrying without optional optimizations",
                                _load_err,
                            )
                            self.model = _try_load(_retry)
                        else:
                            raise
            self.n_ctx = n_ctx
            self.is_loaded = True
            gpu_status = f"GPU: {self.gpu_info['gpu_name']}" if self.gpu_info["gpu_name"] else "CPU-only"
            vision_status = " + Vision" if self.has_vision else ""
            logger.info(f"✅ Local model loaded ({gpu_status}{vision_status}, gen_threads={n_threads}, batch_threads={n_threads_batch}): {model_path}")
        except Exception as e:
            logger.error(f"❌ Failed to load model: {e}")
            raise

    @property
    def _use_chat_completion(self) -> bool:
        """Whether this model needs create_chat_completion.

        Gemma models use the raw completion path with special=True tokenization
        to correctly handle special tokens (<|turn>, <turn|>, etc.).
        The Llava15ChatHandler would hijack create_chat_completion and reformat
        the prompt into LLaVA format, which breaks Gemma.
        """
        return False

    def _parse_prompt_to_messages(self, prompt: str) -> List[Dict[str, str]]:
        """Parse a formatted prompt back into chat messages for create_chat_completion.

        Gemma's <start_of_turn>/<end_of_turn> tokens are special-only tokens that
        the raw completion API tokenizes as plain text, causing garbage output.
        This method extracts the content so create_chat_completion can inject the
        correct token IDs via the model's built-in Jinja template.
        """
        fmt = self.model_config.get("prompt_format", "llama")

        if fmt == "gemma4":
            # Gemma 4 format: <|turn>role\n{content}<turn|>
            messages = []
            for role_tag, content in re.findall(
                r'<\|turn>(system|user|model)\n(.*?)<turn\|>', prompt, re.DOTALL
            ):
                if role_tag == "model":
                    role = "assistant"
                else:
                    role = role_tag  # "system" or "user"
                messages.append({"role": role, "content": content.strip()})
            if messages:
                return messages
        elif fmt == "gemma":
            # Gemma 2/3 format: <start_of_turn>role\n{content}<end_of_turn>
            messages = []
            for role_tag, content in re.findall(
                r'<start_of_turn>(user|model)\n(.*?)<end_of_turn>', prompt, re.DOTALL
            ):
                role = "assistant" if role_tag == "model" else "user"
                messages.append({"role": role, "content": content.strip()})
            if messages:
                return messages
        elif fmt == "chatml":
            messages = []
            sys_match = re.search(r'<\|im_start\|>system\n(.*?)<\|im_end\|>', prompt, re.DOTALL)
            if sys_match:
                messages.append({"role": "system", "content": sys_match.group(1).strip()})
            user_match = re.search(r'<\|im_start\|>user\n(.*?)<\|im_end\|>', prompt, re.DOTALL)
            if user_match:
                messages.append({"role": "user", "content": user_match.group(1).strip()})
            if messages:
                return messages
        else:  # llama
            messages = []
            sys_match = re.search(
                r'<\|start_header_id\|>system<\|end_header_id\|>\s*(.*?)<\|eot_id\|>', prompt, re.DOTALL
            )
            if sys_match:
                messages.append({"role": "system", "content": sys_match.group(1).strip()})
            user_match = re.search(
                r'<\|start_header_id\|>user<\|end_header_id\|>\s*(.*?)<\|eot_id\|>', prompt, re.DOTALL
            )
            if user_match:
                messages.append({"role": "user", "content": user_match.group(1).strip()})
            if messages:
                return messages

        # Fallback: treat entire prompt as user message
        return [{"role": "user", "content": prompt}]

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
        json_schema: Optional[dict] = None,
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
            use_chat = self._use_chat_completion
            chat_messages = self._parse_prompt_to_messages(prompt) if use_chat else None

            # Gemma models need special=True tokenization for turn markers
            _needs_special = self.model_config.get("prompt_format") in ("gemma", "gemma4")
            prompt_token_ids = None
            if not use_chat and _needs_special:
                try:
                    prompt_token_ids = self.model.tokenize(
                        prompt.encode("utf-8"), add_bos=True, special=True
                    )
                except Exception:
                    prompt_token_ids = None

            # Build grammar from JSON schema if provided (for structured output)
            _grammar = None
            _response_format = None
            if json_schema:
                try:
                    import json as _json
                    if use_chat:
                        _response_format = {"type": "json_object", "schema": json_schema}
                    else:
                        _grammar = LlamaGrammar.from_json_schema(
                            _json.dumps(json_schema), verbose=False
                        )
                except Exception as _ge:
                    logger.warning(f"Failed to compile JSON schema grammar: {_ge}")

            def blocking_generate():
                with SilenceOutput():
                    if use_chat and chat_messages:
                        chat_kwargs = dict(
                            messages=chat_messages,
                            max_tokens=max_tokens,
                            temperature=temperature,
                            top_p=top_p,
                            repeat_penalty=repeat_penalty,
                            stop=stop,
                        )
                        if _response_format:
                            chat_kwargs["response_format"] = _response_format
                        result = self.model.create_chat_completion(**chat_kwargs)
                    else:
                        raw_prompt = prompt_token_ids if prompt_token_ids else prompt
                        raw_kwargs = dict(
                            max_tokens=max_tokens,
                            temperature=temperature,
                            top_p=top_p,
                            repeat_penalty=repeat_penalty,
                            stop=stop,
                            echo=False,
                        )
                        if _grammar:
                            raw_kwargs["grammar"] = _grammar
                        result = self.model(raw_prompt, **raw_kwargs)
                # Capture resources while model is still hot in memory
                try:
                    import psutil
                    proc = psutil.Process(os.getpid())
                    resource_snapshot[0] = proc.cpu_percent(interval=None)
                    resource_snapshot[1] = round(proc.memory_info().rss / (1024 * 1024), 2)
                except Exception:
                    pass
                return result

            loop = asyncio.get_running_loop()
            response = await asyncio.wait_for(
                loop.run_in_executor(None, blocking_generate),
                timeout=120
            )

            gen_end = time.perf_counter()
            total_time_ms = (gen_end - gen_start) * 1000

            if use_chat:
                generated = response["choices"][0]["message"]["content"]
            else:
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
        json_schema: Optional[dict] = None,
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

            use_chat = self._use_chat_completion
            chat_messages = self._parse_prompt_to_messages(prompt) if use_chat else None

            # Gemma models use special tokens (<|turn>, <turn|>, <start_of_turn>, etc.)
            # that must be tokenized with special=True to get correct token IDs.
            _needs_special = self.model_config.get("prompt_format") in ("gemma", "gemma4")
            prompt_token_ids = None
            if not use_chat and _needs_special:
                try:
                    prompt_token_ids = self.model.tokenize(
                        prompt.encode("utf-8"), add_bos=True, special=True
                    )
                    available = self.n_ctx - len(prompt_token_ids) - 64
                    if available < max_tokens:
                        if available >= 256:
                            logger.warning(f"Prompt uses {len(prompt_token_ids)} tokens, clamping max_tokens {max_tokens} -> {available} to fit n_ctx={self.n_ctx}")
                            max_tokens = available
                        else:
                            logger.warning(f"Prompt too long: {len(prompt_token_ids)} tokens, only {available} left for generation (n_ctx={self.n_ctx}). Truncating prompt.")
                            max_prompt_tokens = self.n_ctx - max_tokens - 64
                            prompt_token_ids = prompt_token_ids[:max_prompt_tokens]
                except Exception as te:
                    logger.warning(f"Special tokenization failed: {te}")
                    prompt_token_ids = None
            elif not use_chat:
                try:
                    prompt_tokens = self.model.tokenize(prompt.encode("utf-8"))
                    available = self.n_ctx - len(prompt_tokens) - 64
                    if available < max_tokens:
                        if available >= 256:
                            logger.warning(f"Prompt uses {len(prompt_tokens)} tokens, clamping max_tokens {max_tokens} -> {available} to fit n_ctx={self.n_ctx}")
                            max_tokens = available
                        else:
                            logger.warning(f"Prompt too long: {len(prompt_tokens)} tokens, only {available} left for generation (n_ctx={self.n_ctx}). Truncating prompt.")
                            max_prompt_tokens = self.n_ctx - max_tokens - 64
                            prompt_tokens = prompt_tokens[:max_prompt_tokens]
                            prompt = self.model.detokenize(prompt_tokens).decode("utf-8", errors="replace")
                except Exception as te:
                    logger.warning(f"Token count check failed: {te}")

            # Build grammar from JSON schema if provided (for structured output).
            # Uses the class-level cache to skip repeat compilation overhead
            # on every request — same schema compiles once per process lifetime.
            _grammar = None
            _response_format = None
            if json_schema:
                try:
                    if use_chat:
                        _response_format = {"type": "json_object", "schema": json_schema}
                    else:
                        _grammar = self._get_cached_grammar(json_schema)
                    if _grammar is not None or _response_format is not None:
                        logger.info(f"[stream] JSON schema enforcement enabled for {tool_name}")
                except Exception as _ge:
                    logger.warning(f"[stream] Failed to compile JSON schema grammar: {_ge}")

            # Queue for real-time communication (thread -> async)
            token_queue = queue.Queue(maxsize=100)
            DONE = object()  # Sentinel value

            # Metrics timing
            gen_start = time.perf_counter()
            first_token_time = [None]  # Mutable container for thread access
            token_count = [0]

            def stream_in_thread():
                """Runs in thread - puts tokens in queue AS they're generated."""
                try:
                    _tok_info = f"token_ids={len(prompt_token_ids)}" if prompt_token_ids else f"prompt_len={len(prompt)}"
                    print(f"[stream] use_chat={use_chat}, special_tokens={_needs_special}, {_tok_info}, max_tokens={max_tokens}")
                    print(f"[stream] prompt_preview: {prompt[:300]!r}")
                    with SilenceOutput():
                        if use_chat and chat_messages:
                            chat_kwargs = dict(
                                messages=chat_messages,
                                max_tokens=max_tokens,
                                temperature=temperature,
                                top_p=top_p,
                                repeat_penalty=repeat_penalty,
                                stop=stop,
                                stream=True,
                            )
                            if _response_format:
                                chat_kwargs["response_format"] = _response_format
                            stream = self.model.create_chat_completion(**chat_kwargs)
                            for chunk in stream:
                                if cancel_event and cancel_event.is_set():
                                    break
                                delta = chunk["choices"][0].get("delta", {})
                                token = delta.get("content", "")
                                if token:
                                    if first_token_time[0] is None:
                                        first_token_time[0] = time.perf_counter()
                                    token_count[0] += 1
                                    token_queue.put(token)
                        else:
                            print("[stream] Creating raw completion stream...")
                            raw_prompt = prompt_token_ids if prompt_token_ids else prompt
                            raw_kwargs = dict(
                                max_tokens=max_tokens,
                                temperature=temperature,
                                top_p=top_p,
                                repeat_penalty=repeat_penalty,
                                stop=stop,
                                echo=False,
                                stream=True,
                            )
                            if _grammar:
                                raw_kwargs["grammar"] = _grammar
                            stream = self.model(raw_prompt, **raw_kwargs)
                            print("[stream] Stream created, iterating tokens...")
                            for output in stream:
                                if cancel_event and cancel_event.is_set():
                                    break
                                token = output["choices"][0]["text"]
                                if first_token_time[0] is None:
                                    first_token_time[0] = time.perf_counter()
                                    print(f"[stream] First token received: {token!r}")
                                token_count[0] += 1
                                token_queue.put(token)  # Put immediately!
                except Exception as e:
                    token_queue.put(("ERROR", str(e)))
                finally:
                    # Record metrics here — pure model compute time, always runs
                    # before DONE is queued so caller early-exit can't skip it.
                    _gen_end = time.perf_counter()
                    _total_ms = (_gen_end - gen_start) * 1000
                    _ttft_ms = ((first_token_time[0] - gen_start) * 1000) if first_token_time[0] else 0
                    _snap_cpu, _snap_ram = 0.0, 0.0
                    try:
                        import psutil as _psutil
                        _proc = _psutil.Process(os.getpid())
                        _snap_cpu = _proc.cpu_percent(interval=None)
                        _snap_ram = round(_proc.memory_info().rss / (1024 * 1024), 2)
                    except Exception:
                        pass
                    try:
                        from metrics_service import get_metrics_collector
                        get_metrics_collector().record_inference(
                            model_name=os.path.basename(self.model_path),
                            task_type=tool_name,
                            completion_tokens=token_count[0],
                            ttft_ms=_ttft_ms,
                            total_time_ms=_total_ms,
                            cpu_percent=_snap_cpu,
                            ram_usage_mb=_snap_ram,
                        )
                    except Exception as _me:
                        logger.debug(f"Metrics recording skipped: {_me}")
                    print(f"[stream] DONE: {token_count[0]} tokens in {_total_ms:.0f}ms, ttft={_ttft_ms:.0f}ms")
                    token_queue.put(DONE)  # Signal completion

            # ✅ Start streaming in background thread
            loop = asyncio.get_running_loop()
            stream_task = loop.run_in_executor(None, stream_in_thread)
            stream_start = time.perf_counter()
            STREAM_TIMEOUT = 900  # 15 minutes max for streaming (CPU-only inference is slow)

            # ✅ Yield tokens as they arrive in queue
            while True:
                # Get next token (non-blocking with timeout)
                try:
                    item = await loop.run_in_executor(
                        None,
                        lambda: token_queue.get(timeout=0.01)
                    )
                except queue.Empty:
                    await asyncio.sleep(0)
                    if time.perf_counter() - stream_start > STREAM_TIMEOUT:
                        yield {"token": None, "finished": True, "error": "Generation timed out"}
                        return
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

            loop = asyncio.get_running_loop()
            response = await asyncio.wait_for(
                loop.run_in_executor(None, blocking_vision),
                timeout=120
            )

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

            loop = asyncio.get_running_loop()
            stream_task = loop.run_in_executor(None, stream_vision_in_thread)
            stream_start = time.perf_counter()
            STREAM_TIMEOUT = 900  # 15 minutes max for streaming (CPU-only inference is slow)

            while True:
                try:
                    item = await loop.run_in_executor(
                        None,
                        lambda: token_queue.get(timeout=0.01)
                    )
                except queue.Empty:
                    await asyncio.sleep(0)
                    if time.perf_counter() - stream_start > STREAM_TIMEOUT:
                        yield {"token": None, "finished": True, "error": "Generation timed out"}
                        return
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

    def cleanup_sync(self):
        """Synchronous cleanup for use outside async context."""
        if self.model:
            try:
                with SilenceOutput():
                    del self.model
                self.model = None
                self.is_loaded = False
                logger.info("✅ Local model cleaned up")
            except Exception as e:
                logger.error(f"❌ Cleanup error: {e}")

    async def cleanup(self):
        """Async cleanup wrapper."""
        self.cleanup_sync()


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
                n_threads=_optimal_thread_count(),
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