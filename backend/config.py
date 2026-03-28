import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
from typing import Optional
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

# ============================================================================
# DIFFUSION MODEL CONFIGURATION
# ============================================================================

IMAGE_MODELS_DIR = MODELS_DIR / "image_generation"
DEFAULT_DIFFUSION_MODEL = "sdxl-turbo-openvino"
DIFFUSION_CONFIG_FILE = MODELS_DIR / ".diffusion-model-config.json"

def get_selected_diffusion_model():
    """Get the currently selected diffusion model from config file."""
    if DIFFUSION_CONFIG_FILE.exists():
        try:
            with open(DIFFUSION_CONFIG_FILE, 'r') as f:
                config = json.load(f)
                return config.get('selectedModel', DEFAULT_DIFFUSION_MODEL)
        except Exception:
            pass
    return DEFAULT_DIFFUSION_MODEL

def set_selected_diffusion_model(model_name):
    """Save the selected diffusion model to config file."""
    try:
        DIFFUSION_CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(DIFFUSION_CONFIG_FILE, 'w') as f:
            json.dump({'selectedModel': model_name}, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving diffusion model config: {e}", flush=True)
        return False

def get_diffusion_model_path():
    """Get the full path to the currently selected diffusion model."""
    selected = get_selected_diffusion_model()
    # Check user data directory first
    user_models_dir = Path(os.path.expandvars("%APPDATA%")) / "Offline AI Standalone" / "models"
    user_model_path = user_models_dir / selected
    if user_model_path.exists():
        print(f"✓ [CONFIG] Using diffusion model from user data: {user_model_path}", flush=True)
        return str(user_model_path)
    # Fall back to bundled
    bundled_path = IMAGE_MODELS_DIR / selected
    print(f"✓ [CONFIG] Using bundled diffusion model: {bundled_path}", flush=True)
    return str(bundled_path)

def scan_diffusion_models():
    """Scan the image_generation directory for available diffusion models."""
    models = []
    if not IMAGE_MODELS_DIR.exists():
        return models

    selected = get_selected_diffusion_model()
    # Exclude non-model directories (e.g., lama is for inpainting)
    exclude_dirs = {'lama', '__pycache__'}

    try:
        for item in IMAGE_MODELS_DIR.iterdir():
            if item.is_dir() and item.name not in exclude_dirs and not item.name.startswith('.'):
                # Calculate directory size
                total_size = sum(f.stat().st_size for f in item.rglob('*') if f.is_file())
                size_mb = total_size / (1024 * 1024)

                models.append({
                    "name": item.name,
                    "path": str(item),
                    "size_mb": round(size_mb, 2),
                    "is_active": item.name == selected
                })

        models.sort(key=lambda x: x["name"])
    except Exception as e:
        print(f"Error scanning diffusion models: {e}", flush=True)

    return models


# ============================================================================
# IMAGE MODEL REGISTRY (multi-model support)
# ============================================================================

IMAGE_MODEL_REGISTRY = {
    "sdxl-turbo-openvino": {
        "folder":      "sdxl-turbo-openvino",
        "backend":     "openvino",
        "description": "SDXL-Turbo (OpenVINO) — 4 steps, ~4 GB",
        "steps":       2,
        "guidance":    0.0,
    },
    "flux-schnell": {
        "folder":      "flux-schnell",
        "backend":     "openvino_flux",
        "description": "FLUX.1 Schnell INT4 (OpenVINO) — high quality, CPU-optimised",
        "steps":       3,
        "guidance":    0.0,
    },
}

def get_image_model_info(model_key: str = None) -> dict:
    """Get registry info for a model key, falling back to selected model."""
    if model_key is None:
        model_key = get_selected_diffusion_model()
    return IMAGE_MODEL_REGISTRY.get(model_key, IMAGE_MODEL_REGISTRY[DEFAULT_DIFFUSION_MODEL])

def get_image_model_path(model_key: str = None) -> Path:
    """Resolve the local folder path for the given model key."""
    if model_key is None:
        model_key = get_selected_diffusion_model()
    info = IMAGE_MODEL_REGISTRY.get(model_key)
    if not info:
        # Fall back to treating model_key as a folder name
        return IMAGE_MODELS_DIR / model_key
    return IMAGE_MODELS_DIR / info["folder"]

def resolve_vision_projector_path(model_filename: str) -> Optional[str]:
    """Find a vision projector GGUF that pairs with the given model.

    Convention: looks for files containing 'vision' in the same directory.
    e.g. phi4-mm-Q4_K_M.gguf  →  phi4-mm-vision-q8.gguf
    """
    # Derive the model prefix (everything before the quant tag)
    # e.g. "phi4-mm-Q4_K_M.gguf" → "phi4-mm"
    base = model_filename.replace(".gguf", "").replace(".bin", "")

    # Try exact prefix match first
    prefix = base.split("-Q")[0].split("-q")[0]  # strip quant suffix

    for search_dir in [MODELS_DIR, Path(os.path.expandvars("%APPDATA%")) / "Offline AI Standalone" / "models"]:
        if not search_dir.exists():
            continue
        for f in search_dir.iterdir():
            if f.is_file() and "vision" in f.name.lower() and f.suffix.lower() == ".gguf":
                # Check if same model family
                if prefix and f.name.lower().startswith(prefix.lower()):
                    print(f"✓ [CONFIG] Found vision projector: {f.name}", flush=True)
                    return str(f)

    return None

_config_printed = False

def resolve_model_path(model_filename: str) -> str:
    """Resolve model path: check user data directory first, then bundled."""
    user_models_dir = Path(os.path.expandvars("%APPDATA%")) / "Offline AI Standalone" / "models"
    user_model_path = user_models_dir / model_filename

    if user_model_path.exists():
        if not _config_printed:
            print(f"✓ [CONFIG] Using model from user data: {user_model_path}", flush=True)
        return str(user_model_path)
    else:
        bundled_path = MODELS_DIR / model_filename
        if not _config_printed:
            print(f"✓ [CONFIG] Using bundled model: {bundled_path}", flush=True)
        return str(bundled_path)

def get_model_path():
    """Get the full path to the currently selected model."""
    global _config_printed
    selected_model = get_selected_model()
    model_path = resolve_model_path(selected_model)
    if not _config_printed:
        print(f"✓ [CONFIG] Selected model: {selected_model}", flush=True)
        print(f"✓ [CONFIG] Full model path: {model_path}", flush=True)
        print(f"✓ [CONFIG] Model exists: {Path(model_path).exists()}", flush=True)
        _config_printed = True
    return model_path

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
    # Maximum tokens to generate in a single response
    "max_tokens": 2000,
    "threads": 4,
    # Sampling temperature for generation
    "temperature": 0.7,
    "top_p": 0.9,
    "context_size": 16384,
    "timeout": 400,
    # Number of user+assistant message pairs to keep in context window (sliding window)
    "conversation_history_length": 4,
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
MODEL_N_CTX = 16384
MODEL_MAX_TOKENS = 2000
MODEL_TEMPERATURE = 0.7



# ============================================================================
# INFERENCE BACKEND CONFIGURATION
# ============================================================================

# Choose inference backend: "local" or "gemma_api"
INFERENCE_BACKEND = os.environ.get("INFERENCE_BACKEND", "local")

# Gemma API configuration (only used if INFERENCE_BACKEND="gemma_api")
GEMMA_API_KEY = os.environ.get("GEMMA_API_KEY", "")

# ============================================================================
# INFERENCE BACKEND CONFIGURATION
# ============================================================================

# Choose inference backend: "local", "gemma_api", or "openrouter"
INFERENCE_BACKEND = os.environ.get("INFERENCE_BACKEND", "local")

# Gemma API configuration (only used if INFERENCE_BACKEND="gemma_api")
GEMMA_API_KEY = os.environ.get("GEMMA_API_KEY", "")

# OpenRouter API configuration (only used if INFERENCE_BACKEND="openrouter")
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "nvidia/nemotron-3-nano-30b-a3b:free")

print(f"✓ [CONFIG] Inference backend: {INFERENCE_BACKEND}", flush=True)
if INFERENCE_BACKEND == "gemma_api":
    if GEMMA_API_KEY:
        print(f"✓ [CONFIG] Gemma API key configured", flush=True)
    else:
        print(f"✗ [CONFIG] WARNING: INFERENCE_BACKEND is 'gemma_api' but GEMMA_API_KEY not set!", flush=True)
elif INFERENCE_BACKEND == "openrouter":
    if OPENROUTER_API_KEY:
        print(f"✓ [CONFIG] OpenRouter API key configured", flush=True)
        print(f"✓ [CONFIG] OpenRouter model: {OPENROUTER_MODEL}", flush=True)
    else:
        print(f"✗ [CONFIG] WARNING: INFERENCE_BACKEND is 'openrouter' but OPENROUTER_API_KEY not set!", flush=True)