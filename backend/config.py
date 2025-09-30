import os

# Base directory
BASE_DIR = os.path.dirname(__file__)

# File paths
MODEL_PATH = os.path.join(BASE_DIR, "llama-3.2-1b-instruct-Q5_K_M.gguf")

# llama-cli.exe is in bin/Release subdirectory
LLAMA_CLI_PATH = os.path.join(BASE_DIR, "bin", "Release", "llama-cli.exe")

# Fallback paths if the above doesn't exist
if not os.path.exists(LLAMA_CLI_PATH):
    # Check if it's directly in backend folder
    if os.path.exists(os.path.join(BASE_DIR, "llama-cli.exe")):
        LLAMA_CLI_PATH = os.path.join(BASE_DIR, "llama-cli.exe")
    elif os.path.exists(os.path.join(BASE_DIR, "llama-cli")):
        LLAMA_CLI_PATH = os.path.join(BASE_DIR, "llama-cli")
    else:
        # Keep the bin/Release path as default
        LLAMA_CLI_PATH = os.path.join(BASE_DIR, "bin", "Release", "llama-cli.exe")

# Llama CLI parameters
LLAMA_PARAMS = {
    "max_tokens": 256,        # Maximum tokens to generate (-n) - Reduced for faster responses
    "threads": 4,             # Number of threads (-t) - Adjust based on your CPU
    "temperature": 0.7,       # Sampling temperature (--temp)
    "top_p": 0.9,            # Top-p sampling (--top-p)
    "context_size": 2048,    # Context window size (-c)
    "timeout": 120,          # Timeout in seconds for generation - Increased to 120
    "conversation_history_length": 3  # Number of previous messages to include - Reduced to 3
}

# You can add more parameters supported by llama-cli:
# --top-k: Top-k sampling
# --repeat-penalty: Penalize repetition
# --seed: Random seed for reproducibility
# etc.

# CORS origins
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]