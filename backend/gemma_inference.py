import logging
import asyncio
from typing import Optional, Dict, Any
from google import genai
from concurrent.futures import ThreadPoolExecutor
import queue
import threading

logger = logging.getLogger(__name__)

# Thread pool for blocking API calls
_executor = ThreadPoolExecutor(max_workers=4)

class GemmaInference:
    """
    TRUE REAL-TIME STREAMING - Tokens appear AS they're generated!
    
    Key: Use a queue to get tokens from API thread immediately.
    """
    
    def __init__(self, api_key: str):
        """Initialize Gemma API client."""
        self.client = genai.Client(api_key=api_key)
        self.model_id = "gemma-3-12b-it"
        self.is_loaded = True
        logger.info(f"✅ Gemma API initialized: {self.model_id}")
    
    def _clean_prompt(self, prompt: str) -> str:
        """Clean Llama-specific tags from prompt."""
        import re
        
        # Remove Llama tags
        prompt = prompt.replace("<|begin_of_text|>", "")
        prompt = prompt.replace("<|eot_id|>", "")
        prompt = prompt.replace("<|end_of_text|>", "")
        
        # Extract system prompt
        system_match = re.search(
            r'<\|start_header_id\|>system<\|end_header_id\|>\s*(.*?)\s*<\|start_header_id\|>',
            prompt, re.DOTALL
        )
        system = system_match.group(1).strip() if system_match else ""
        
        # Extract user message
        user_match = re.search(
            r'<\|start_header_id\|>user<\|end_header_id\|>\s*(.*?)\s*<\|start_header_id\|>',
            prompt, re.DOTALL
        )
        user = user_match.group(1).strip() if user_match else ""
        
        # Build clean prompt
        if system and user:
            return f"System: {system}\n\nUser: {user}\n\nAssistant:"
        elif user:
            return f"User: {user}\n\nAssistant:"
        return prompt
    
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
        if not self.is_loaded:
            return {
                "tool_name": tool_name,
                "result": None,
                "metadata": {"status": "error", "error_message": "API not initialized"},
            }
        
        try:
            prompt = prompt_template if prompt_template else input_data
            cleaned = self._clean_prompt(prompt)
            
            config = genai.types.GenerateContentConfig(
                temperature=temperature,
                top_p=top_p,
                max_output_tokens=max_tokens,
            )
            
            # Run in thread pool (blocking call)
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                _executor,
                lambda: self.client.models.generate_content(
                    model=self.model_id,
                    contents=cleaned,
                    config=config
                )
            )
            
            return {
                "tool_name": tool_name,
                "input_summary": input_data[:100] + "..." if len(input_data) > 100 else input_data,
                "result": response.text.strip(),
                "metadata": {
                    "status": "success",
                    "tokens_used": {
                        "prompt_tokens": int(len(cleaned.split()) * 1.3),
                        "completion_tokens": int(len(response.text.split()) * 1.3),
                        "total_tokens": int((len(cleaned.split()) + len(response.text.split())) * 1.3),
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
        
        Tokens appear IMMEDIATELY as the API generates them.
        Uses a queue to communicate between thread and async generator.
        """
        if not self.is_loaded:
            yield {"token": None, "finished": True, "error": "API not initialized"}
            return
        
        try:
            prompt = prompt_template if prompt_template else input_data
            cleaned = self._clean_prompt(prompt)
            
            config = genai.types.GenerateContentConfig(
                temperature=temperature,
                top_p=top_p,
                max_output_tokens=max_tokens,
            )
            
            # ✅ Queue for real-time communication (thread -> async)
            token_queue = queue.Queue(maxsize=100)
            DONE = object()  # Sentinel value
            
            def stream_in_thread():
                """Runs in thread - puts tokens in queue AS they arrive."""
                try:
                    stream = self.client.models.generate_content_stream(
                        model=self.model_id,
                        contents=cleaned,
                        config=config
                    )
                    for chunk in stream:
                        if chunk.text:
                            token_queue.put(chunk.text)  # Put immediately!
                except Exception as e:
                    token_queue.put(("ERROR", str(e)))
                finally:
                    token_queue.put(DONE)  # Signal completion
            
            # ✅ Start streaming in background thread
            loop = asyncio.get_event_loop()
            stream_task = loop.run_in_executor(_executor, stream_in_thread)
            
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
    
    def cleanup(self):
        """Cleanup (no-op for API)."""
        self.is_loaded = False
        logger.info("✅ Gemma API cleaned up")