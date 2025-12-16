import logging
import asyncio
import sys
import os
import queue
from typing import Optional, Dict, Any
from llama_cpp import Llama

logger = logging.getLogger(__name__)

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
    
    def __init__(self, model_path: str, n_ctx: int = 4096, verbose: bool = False):
        """Load the model."""
        self.model_path = model_path
        self.model: Optional[Llama] = None
        self.is_loaded = False
        
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
            logger.info(f"✅ Local model loaded: {model_path}")
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
            
            generated = response["choices"][0]["text"]
            usage = response.get("usage", {})
            
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
        
        except Exception as e:
            logger.error(f"❌ Streaming error: {e}")
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
        with SilenceOutput():
            model = Llama(
                model_path=model_path,
                n_ctx=settings.get("n_ctx", 4096),
                verbose=False,
                n_threads=4,
                n_batch=8,
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