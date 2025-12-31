import logging
import asyncio
from typing import Optional, Dict, Any
import aiohttp
import queue

logger = logging.getLogger(__name__)

class OpenRouterInference:
    """
    OpenRouter API inference with real-time streaming.
    
    Uses OpenAI-compatible API format - this is the industry standard
    that many providers (OpenRouter, Together, etc.) support.
    """
    
    def __init__(self, api_key: str, model_id: str = "nvidia/nemotron-3-nano-30b-a3b:free"):
        """Initialize OpenRouter API client."""
        self.api_key = api_key
        self.model_id = model_id
        self.base_url = "https://openrouter.ai/api/v1"
        self.is_loaded = True
        logger.info(f"✅ OpenRouter API initialized: {self.model_id}")
    
    def _clean_prompt(self, prompt: str) -> list:
        """
        Convert Llama-format prompt to OpenAI chat format.
        
        WHY: Your app uses Llama's format (<|start_header_id|> tags),
        but OpenRouter expects OpenAI's format (list of message dicts).
        
        This function extracts the meaningful parts and restructures them.
        """
        import re
        
        # Remove Llama control tokens
        prompt = prompt.replace("<|begin_of_text|>", "")
        prompt = prompt.replace("<|eot_id|>", "")
        prompt = prompt.replace("<|end_of_text|>", "")
        
        # Extract system prompt
        system_match = re.search(
            r'<\|start_header_id\|>system<\|end_header_id\|>\s*(.*?)\s*<\|start_header_id\|>',
            prompt, re.DOTALL
        )
        system_content = system_match.group(1).strip() if system_match else ""
        
        # Extract all user/assistant exchanges
        messages = []
        if system_content:
            messages.append({"role": "system", "content": system_content})
        
        # Find all user messages
        user_matches = re.finditer(
            r'<\|start_header_id\|>user<\|end_header_id\|>\s*(.*?)\s*(?:<\|start_header_id\||$)',
            prompt, re.DOTALL
        )
        for match in user_matches:
            content = match.group(1).strip()
            if content:
                messages.append({"role": "user", "content": content})
        
        # If no structured format found, treat whole prompt as user message
        if len(messages) <= 1:  # Only system or empty
            messages.append({"role": "user", "content": prompt})
        
        return messages
    
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
        """
        Generate complete response (non-streaming).
        
        DESIGN CHOICE: We make an HTTP request instead of using an SDK.
        WHY: OpenRouter doesn't have an official Python SDK, and using
        raw HTTP gives us full control and transparency.
        """
        if not self.is_loaded:
            return {
                "tool_name": tool_name,
                "result": None,
                "metadata": {"status": "error", "error_message": "API not initialized"},
            }
        
        try:
            prompt = prompt_template if prompt_template else input_data
            messages = self._clean_prompt(prompt)
            
            # Build request payload
            payload = {
                "model": self.model_id,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "top_p": top_p,
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://your-app.com",  # Optional but recommended
                "X-Title": "OECS Learning Hub",  # Optional but helpful for tracking
            }
            
            # Make async HTTP request
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/chat/completions",
                    json=payload,
                    headers=headers
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise Exception(f"API error {response.status}: {error_text}")
                    
                    data = await response.json()
            
            # Extract response
            result_text = data["choices"][0]["message"]["content"]
            usage = data.get("usage", {})
            
            return {
                "tool_name": tool_name,
                "input_summary": input_data[:100] + "..." if len(input_data) > 100 else input_data,
                "result": result_text.strip(),
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
        TRUE REAL-TIME STREAMING with Server-Sent Events (SSE).
        
        STREAMING EXPLAINED:
        Instead of waiting for the entire response, the server sends
        tokens as they're generated. Think of it like a live broadcast
        vs. a recorded video.
        
        OpenRouter uses SSE (Server-Sent Events) format:
        - Each line starts with "data: "
        - Lines containing "[DONE]" signal completion
        - We parse each chunk and yield tokens immediately
        """
        if not self.is_loaded:
            yield {"token": None, "finished": True, "error": "API not initialized"}
            return
        
        try:
            prompt = prompt_template if prompt_template else input_data
            messages = self._clean_prompt(prompt)
            
            payload = {
                "model": self.model_id,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "top_p": top_p,
                "stream": True,  # ← KEY: Enable streaming
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://your-app.com",
                "X-Title": "OECS Learning Hub",
            }
            
            # Stream response
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/chat/completions",
                    json=payload,
                    headers=headers
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        yield {"token": None, "finished": True, "error": f"API error {response.status}: {error_text}"}
                        return
                    
                    # Read stream line by line
                    async for line in response.content:
                        line = line.decode('utf-8').strip()
                        
                        # Skip empty lines and non-data lines
                        if not line or not line.startswith('data: '):
                            continue
                        
                        # Remove "data: " prefix
                        data_str = line[6:]
                        
                        # Check for stream end
                        if data_str == '[DONE]':
                            break
                        
                        # Parse JSON chunk
                        try:
                            import json
                            chunk_data = json.loads(data_str)
                            delta = chunk_data["choices"][0]["delta"]
                            
                            # Extract token if present
                            if "content" in delta:
                                token = delta["content"]
                                yield {"token": token, "finished": False}
                                await asyncio.sleep(0)  # Let other tasks run
                        
                        except json.JSONDecodeError:
                            continue  # Skip malformed chunks
            
            # All done!
            yield {"token": "", "finished": True}
        
        except Exception as e:
            logger.error(f"❌ Streaming error: {e}")
            yield {"token": None, "finished": True, "error": str(e)}
    
    def cleanup(self):
        """Cleanup (no-op for API)."""
        self.is_loaded = False
        logger.info("✅ OpenRouter API cleaned up")