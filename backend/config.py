# Updated config.py with better parameters for reliability

import os
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Base directory
BASE_DIR = os.path.dirname(__file__)

# File paths
# Model name (centralized configuration)
MODEL_NAME = "PEARL_AI_qwen4bit copy.gguf"

# Construct model path dynamically using the model name
MODEL_PATH = os.path.join(BASE_DIR, MODEL_NAME)

# llama-cli.exe is in bin/Release subdirectory
LLAMA_CLI_PATH = os.path.join(BASE_DIR, "bin", "Release", "llama-cli.exe")

# Fallback paths if the above doesn't exist
if not os.path.exists(LLAMA_CLI_PATH):
    if os.path.exists(os.path.join(BASE_DIR, "llama-cli.exe")):
        LLAMA_CLI_PATH = os.path.join(BASE_DIR, "llama-cli.exe")
    elif os.path.exists(os.path.join(BASE_DIR, "llama-cli")):
        LLAMA_CLI_PATH = os.path.join(BASE_DIR, "llama-cli")
    else:
        LLAMA_CLI_PATH = os.path.join(BASE_DIR, "bin", "Release", "llama-cli.exe")

# Improved Llama CLI parameters for better reliability and speed
LLAMA_PARAMS = {
    "max_tokens": 2500,       # Reduced for faster lesson plan generation
    "threads": 4,             # Number of threads (-t)
    "temperature": 0.6,       # Lower temperature for more focused output
    "top_p": 0.9,            # Top-p sampling (--top-p)
    "context_size": 4096,    # Increased context window size (-c)
    "timeout": 180,          # Timeout in seconds for generation
    "conversation_history_length": 2,  # Reduced history for lesson planning
    "batch_size": 512,       # Batch size for faster processing
    "repeat_penalty": 1.1,   # Slight penalty to avoid repetition
}

# WebSocket specific settings
WEBSOCKET_SETTINGS = {
    "ping_interval": 30,     # Send ping every 30 seconds
    "ping_timeout": 10,      # Wait 10 seconds for pong
    "close_timeout": 10,     # Wait 10 seconds when closing
    "max_message_size": 1024 * 1024,  # 1MB max message size
}

# Lesson plan specific settings
LESSON_PLAN_SETTINGS = {
    "max_generation_time": 180,  # 3 minutes max
    "stream_chunk_size": 50,     # Characters per chunk for streaming
    "send_interval": 0.1,        # Send updates every 100ms
    "max_retries": 3,           # Max connection retries
}

# CORS origins
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]