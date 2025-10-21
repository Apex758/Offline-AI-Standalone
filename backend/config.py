import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import json

# Base directory
BASE_DIR = Path(__file__).parent
MODEL_NAME = "PEARL_AI.gguf"

# Models directory - at root level of the project
PROJECT_ROOT = BASE_DIR.parent

# CRITICAL: Allow overriding models directory via environment variable (for packaged apps)
if os.environ.get('MODELS_DIR'):
    MODELS_DIR = Path(os.environ.get('MODELS_DIR'))
    print(f"✓ [CONFIG] Using MODELS_DIR from environment: {MODELS_DIR}", flush=True)
else:
    MODELS_DIR = PROJECT_ROOT / "models"
    print(f"✓ [CONFIG] Using default MODELS_DIR: {MODELS_DIR}", flush=True)

# Verify models directory exists
if MODELS_DIR.exists():
    print(f"✓ [CONFIG] Models directory exists", flush=True)
    # List available models
    model_files = list(MODELS_DIR.glob("*.gguf"))
    if model_files:
        print(f"✓ [CONFIG] Found {len(model_files)} model(s):", flush=True)
        for mf in model_files:
            print(f"    - {mf.name}", flush=True)
    else:
        print(f"✗ [CONFIG] WARNING: No .gguf models found in {MODELS_DIR}", flush=True)
else:
    print(f"✗ [CONFIG] ERROR: Models directory does not exist: {MODELS_DIR}", flush=True)

# Model configuration file
MODEL_CONFIG_FILE = MODELS_DIR / ".model-config.json"

def get_selected_model():
    """Get the currently selected model from config file."""
    if MODEL_CONFIG_FILE.exists():
        try:
            with open(MODEL_CONFIG_FILE, 'r') as f:
                config = json.load(f)
                return config.get('selectedModel', MODEL_NAME)
        except Exception:
            pass
    return MODEL_NAME

def set_selected_model(model_name):
    """Save the selected model to config file."""
    try:
        MODEL_CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(MODEL_CONFIG_FILE, 'w') as f:
            json.dump({'selectedModel': model_name}, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving model config: {e}", flush=True)
        return False

def get_model_path():
    """Get the full path to the currently selected model."""
    selected_model = get_selected_model()
    model_path = MODELS_DIR / selected_model
    print(f"✓ [CONFIG] Selected model: {selected_model}", flush=True)
    print(f"✓ [CONFIG] Full model path: {model_path}", flush=True)
    print(f"✓ [CONFIG] Model exists: {model_path.exists()}", flush=True)
    return str(model_path)

# Update MODEL_PATH to use selected model
MODEL_PATH = get_model_path()

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
    "max_tokens": 2500,
    "threads": 4,
    "temperature": 0.6,
    "top_p": 0.9,
    "context_size": 4096,
    "timeout": 400,
    "conversation_history_length": 2,
    "batch_size": 512,
    "repeat_penalty": 1.1,
}

# WebSocket specific settings
WEBSOCKET_SETTINGS = {
    "ping_interval": 30,
    "ping_timeout": 10,
    "close_timeout": 10,
    "max_message_size": 1024 * 1024,
}

# Lesson plan specific settings
LESSON_PLAN_SETTINGS = {
    "max_generation_time": 180,
    "stream_chunk_size": 50,
    "send_interval": 0.1,
    "max_retries": 3,
}

# CORS origins
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# AI Model Configuration
MODEL_VERBOSE = False
MODEL_N_CTX = 4096
MODEL_MAX_TOKENS = 2000
MODEL_TEMPERATURE = 0.7