import logging
from typing import Optional, Dict, Any, Iterator
from google import genai

logger = logging.getLogger(__name__)

class GemmaInference:
    """
    Gemma API inference wrapper that matches the LlamaInference interface.
    
    Why this design?
    - Matches LlamaInference API exactly so it's a drop-in replacement
    - Handles both streaming and non-streaming generation
    - Provides same error handling and response format
    """
    
    _instance = None
    
    @classmethod
    def get_instance(cls, api_key: str = None):
        """Return singleton instance (matches LlamaInference pattern)."""
        if cls._instance is None:
            cls._instance = cls(api_key=api_key)
        return cls._instance
    
    def __init__(self, api_key: str):
        """
        Initialize Gemma API client.
        
        Args:
            api_key: Your Google AI API key
        """
        self.client = genai.Client(api_key=api_key)
        self.model_id = "gemma-3-12b-it"  # Instruction-tuned 12B model
        self.is_loaded = True  # Always "loaded" for API
        logger.info(f"Gemma API client initialized with model: {self.model_id}")
    
    def _clean_prompt(self, prompt: str) -> str:
        """
        Clean prompt by removing Llama-specific formatting.
        
        Why? Gemma doesn't use the same chat template format as Llama.
        We extract just the actual content and let Gemma handle formatting.
        """
        # Remove Llama-specific tags
        prompt = prompt.replace("<|begin_of_text|>", "")
        prompt = prompt.replace("<|eot_id|>", "")
        prompt = prompt.replace("<|end_of_text|>", "")
        
        # Extract system and user messages
        import re
        
        # Extract system prompt
        system_match = re.search(
            r'<\|start_header_id\|>system<\|end_header_id\|>\s*(.*?)\s*(?:<\|start_header_id\|>|$)',
            prompt,
            re.DOTALL
        )
        system_prompt = system_match.group(1).strip() if system_match else ""
        
        # Extract user message
        user_match = re.search(
            r'<\|start_header_id\|>user<\|end_header_id\|>\s*(.*?)\s*(?:<\|start_header_id\|>|$)',
            prompt,
            re.DOTALL
        )
        user_message = user_match.group(1).strip() if user_match else ""
        
        # Extract conversation history (assistant responses)
        history = []
        assistant_matches = re.finditer(
            r'<\|start_header_id\|>assistant<\|end_header_id\|>\s*(.*?)\s*<\|start_header_id\|>',
            prompt,
            re.DOTALL
        )
        for match in assistant_matches:
            history.append(match.group(1).strip())
        
        # Reconstruct as simple prompt
        cleaned = ""
        if system_prompt:
            cleaned += f"System: {system_prompt}\n\n"
        if history:
            cleaned += "Previous conversation:\n"
            for i, msg in enumerate(history):
                cleaned += f"Assistant: {msg}\n"
            cleaned += "\n"
        if user_message:
            cleaned += f"User: {user_message}\n\nAssistant:"
        
        return cleaned if cleaned else prompt
    
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
        """
        Generate a full completion (non-streaming).
        
        Matches LlamaInference.generate() signature exactly.
        """
        if not self.is_loaded:
            return {
                "tool_name": tool_name,
                "result": None,
                "metadata": {"status": "error", "error_message": "API client not initialized"},
            }
        
        try:
            prompt = prompt_template if prompt_template else input_data
            cleaned_prompt = self._clean_prompt(prompt)
            input_summary = input_data[:100] + "..." if len(input_data) > 100 else input_data
            
            # Configure generation parameters
            config = genai.types.GenerateContentConfig(
                temperature=temperature,
                top_p=top_p,
                max_output_tokens=max_tokens,
            )
            
            # Generate response
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=cleaned_prompt,
                config=config
            )
            
            generated_text = response.text
            
            # Gemma API doesn't return token counts, so we estimate
            prompt_tokens = len(cleaned_prompt.split()) * 1.3  # Rough estimate
            completion_tokens = len(generated_text.split()) * 1.3
            
            return {
                "tool_name": tool_name,
                "input_summary": input_summary,
                "result": generated_text.strip(),
                "metadata": {
                    "status": "success",
                    "tokens_used": {
                        "prompt_tokens": int(prompt_tokens),
                        "completion_tokens": int(completion_tokens),
                        "total_tokens": int(prompt_tokens + completion_tokens),
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
        
        Critical: This matches LlamaInference.generate_stream() exactly.
        Your WebSocket endpoints expect this exact format.
        
        Yields:
            {"token": str, "finished": bool} or {"error": str, "finished": True}
        """
        if not self.is_loaded:
            yield {"token": None, "finished": True, "error": "API client not initialized"}
            return
        
        prompt = prompt_template if prompt_template else input_data
        cleaned_prompt = self._clean_prompt(prompt)
        
        try:
            # Configure generation parameters
            config = genai.types.GenerateContentConfig(
                temperature=temperature,
                top_p=top_p,
                max_output_tokens=max_tokens,
            )
            
            # Generate streaming response
            # Note: Gemma API streams at chunk level, not token level
            # We'll yield each chunk as a "token" to match the interface
            for chunk in self.client.models.generate_content_stream(
                model=self.model_id,
                contents=cleaned_prompt,
                config=config
            ):
                if chunk.text:
                    yield {"token": chunk.text, "finished": False}
            
            # Signal completion
            yield {"token": "", "finished": True}
        
        except Exception as e:
            logger.error(f"Streaming error for {tool_name}: {e}")
            yield {"token": None, "finished": True, "error": str(e)}
    
    def cleanup(self):
        """Cleanup (no-op for API, kept for interface compatibility)."""
        logger.info("Gemma API client cleanup (no-op)")
        self.is_loaded = False