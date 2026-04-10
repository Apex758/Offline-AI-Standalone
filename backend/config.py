import os
import sys
import re
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
    print(f"[OK] [CONFIG] Using MODELS_DIR from environment: {MODELS_DIR}", flush=True)
else:
    MODELS_DIR = PROJECT_ROOT / "models"
    print(f"[OK] [CONFIG] Using default MODELS_DIR: {MODELS_DIR}", flush=True)

# Verify models directory exists
if MODELS_DIR.exists():
    print(f"[OK] [CONFIG] Models directory exists", flush=True)
    # List available models
    model_files = list(MODELS_DIR.glob("*.gguf"))
    if model_files:
        print(f"[OK] [CONFIG] Found {len(model_files)} model(s):", flush=True)
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
# LLM MODEL REGISTRY
# Maps filename → display metadata (tier, type, display name)
# ============================================================================

LLM_MODEL_REGISTRY = {
    "Qwen3.5-2B-Text.gguf": {
        "display_name": "Qwen 3.5 2B",
        "tier": 1,
        "model_type": "text",
    },
    "Phi4-Mini-Text.gguf": {
        "display_name": "Phi 4 Mini",
        "tier": 1,
        "model_type": "text",
    },
    "gemma-4-E2B-it-Q4_K_M.gguf": {
        "display_name": "Gemma 4 E2B (Q4)",
        "tier": 2,
        "model_type": "vision",
    },
    "gemma-4-E2B-it-Q5_K_M.gguf": {
        "display_name": "Gemma 4 E2B (Q5)",
        "tier": 2,
        "model_type": "vision",
    },
    "gemma-4-E4B-it-Q4_K_M.gguf": {
        "display_name": "Gemma 4 E4B (Q4)",
        "tier": 3,
        "model_type": "vision",
    },
    "gemma-4-E4B-it-Q5_K_M.gguf": {
        "display_name": "Gemma 4 E4B (Q5)",
        "tier": 3,
        "model_type": "vision",
    },
    "Qwen2.5-VL-7B-Vision.gguf": {
        "display_name": "Qwen 2.5 VL 7B",
        "tier": 4,
        "model_type": "vision",
    },
}

# ============================================================================
# DIFFUSION MODEL CONFIGURATION
# ============================================================================

IMAGE_MODELS_DIR = MODELS_DIR / "image_generation"
LAMA_MODEL_PATH = IMAGE_MODELS_DIR / "lama" / "big-lama.pt"
DEFAULT_DIFFUSION_MODEL = ""  # Empty = disabled by default (Tier 1 start)
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
        print(f"[OK] [CONFIG] Using diffusion model from user data: {user_model_path}", flush=True)
        return str(user_model_path)
    # Fall back to bundled
    bundled_path = IMAGE_MODELS_DIR / selected
    print(f"[OK] [CONFIG] Using bundled diffusion model: {bundled_path}", flush=True)
    return str(bundled_path)

def scan_diffusion_models():
    """Scan the image_generation directory for available diffusion models.

    Registry-aware: when multiple registry entries share the same folder
    (e.g. two GGUF quant variants), each gets its own entry in the list
    so the user can select them independently.
    """
    models = []
    if not IMAGE_MODELS_DIR.exists():
        return models

    selected = get_selected_diffusion_model()
    exclude_dirs = {'lama', 'realesrgan', '__pycache__'}
    seen_names = set()
    covered_folders = set()

    try:
        # Pass 1: emit one entry per registry key whose folder exists on disk
        for reg_key, reg_info in IMAGE_MODEL_REGISTRY.items():
            folder = reg_info.get("folder", reg_key)
            folder_path = IMAGE_MODELS_DIR / folder
            if folder_path.is_dir() and folder not in exclude_dirs:
                if reg_key not in seen_names:
                    # For GGUF variants sharing a folder, only count the
                    # variant-specific model file + shared support files
                    gguf_file = reg_info.get("gguf_file")
                    if gguf_file:
                        variant_files = [folder_path / gguf_file]
                        # Add shared support files (clip, t5xxl, vae)
                        for f in folder_path.iterdir():
                            if f.is_file() and f.name != gguf_file and not f.name.startswith('.'):
                                # Skip other GGUF model variants in same folder
                                if f.suffix == '.gguf':
                                    continue
                                variant_files.append(f)
                        total_size = sum(f.stat().st_size for f in variant_files if f.exists())
                    else:
                        total_size = sum(f.stat().st_size for f in folder_path.rglob('*') if f.is_file())
                    size_mb = total_size / (1024 * 1024)
                    models.append({
                        "name": reg_key,
                        "path": str(folder_path),
                        "size_mb": round(size_mb, 2),
                        "is_active": reg_key == selected,
                        "description": reg_info.get("description", ""),
                    })
                    seen_names.add(reg_key)
                    covered_folders.add(folder)

        # Pass 2: pick up any folders not covered by the registry
        for item in IMAGE_MODELS_DIR.iterdir():
            if item.is_dir() and item.name not in exclude_dirs and not item.name.startswith('.'):
                if item.name not in seen_names and item.name not in covered_folders:
                    total_size = sum(f.stat().st_size for f in item.rglob('*') if f.is_file())
                    if total_size == 0:
                        continue  # skip empty folders
                    size_mb = total_size / (1024 * 1024)
                    models.append({
                        "name": item.name,
                        "path": str(item),
                        "size_mb": round(size_mb, 2),
                        "is_active": item.name == selected
                    })
                    seen_names.add(item.name)

        models.sort(key=lambda x: x["name"])
    except Exception as e:
        print(f"Error scanning diffusion models: {e}", flush=True)

    return models


# ============================================================================
# IMAGE MODEL REGISTRY (multi-model support)
# ============================================================================

IMAGE_MODEL_REGISTRY = {
    "sdxl-turbo-int8": {
        "folder":      "sdxl-turbo-int8",
        "backend":     "openvino",
        "description": "SDXL-Turbo INT8 (OpenVINO) — fast 2-step, CPU-optimised",
        "steps":       2,
        "guidance":    0.0,
        "default_width":  512,
        "default_height": 512,
        "max_width":      512,
        "max_height":     512,
        "supports_negative_prompt": False,
        "supports_img2img":        True,
        "ram_required_gb":  4,
        "vram_required_mb": 0,
    },
    "flux-schnell": {
        "folder":      "flux-schnell",
        "backend":     "openvino_flux",
        "description": "FLUX.1 Schnell INT4 (OpenVINO) — high quality, CPU-optimised",
        "steps":       2,
        "guidance":    0.0,
        "default_width":  512,
        "default_height": 512,
        "max_width":      512,
        "max_height":     512,
        "supports_negative_prompt": False,
        "supports_img2img":        False,
        "ram_required_gb":  8,
        "vram_required_mb": 0,
    },
    "sdxl-turbo-gguf-q8": {
        "folder":      "sdxl-turbo-gguf",
        "backend":     "sd_cpp_sdxl",
        "gguf_file":   "stable-diffusion-xl-1.0-turbo-Q8_0.gguf",
        "description": "SDXL-Turbo Q8 (GGUF) — fast 2-step, ~5 GB",
        "steps":       2,
        "guidance":    1.0,
        "default_width":  512,
        "default_height": 512,
        "max_width":      512,
        "max_height":     512,
        "supports_negative_prompt": False,
        "supports_img2img":        True,
        "ram_required_gb":  6,
        "vram_required_mb": 0,
        "downloadable":     True,
        "download_size_gb": 5.0,
        "download_label":   "SDXL-Turbo (2-step, Q8)",
        "download_files": [
            {"hf_repo": "gpustack/stable-diffusion-xl-1.0-turbo-GGUF", "filename": "stable-diffusion-xl-1.0-turbo-Q8_0.gguf"},
        ],
    },
    # ── Downloadable models ───────────────────────────────────────────────────
    "sdxl-lightning-q5": {
        "folder":      "sdxl-lightning-gguf",
        "backend":     "sd_cpp_sdxl",
        "gguf_file":   "sdxl_lightning_4step.q5_0.gguf",
        "description": "SDXL Lightning 4-step Q5 — sharp 1024px in ~2 min",
        "steps":       4,
        "guidance":    1.0,
        "supports_negative_prompt": True,
        "supports_img2img":         True,
        "ram_required_gb":  6,
        "vram_required_mb": 0,
        "downloadable":     True,
        "download_size_gb": 3.0,
        "download_label":   "SDXL Lightning (4-step, Q5)",
        "download_files": [
            {"hf_repo": "mzwing/SDXL-Lightning-GGUF", "filename": "sdxl_lightning_4step.q5_0.gguf"},
        ],
    },
    "sd35-medium-q5": {
        "folder":      "sd35-medium-gguf",
        "backend":     "sd_cpp_sd3",
        "gguf_file":   "sd3.5_medium-Q5_K_M.gguf",
        "description": "SD 3.5 Medium Q5_K_M — top-tier prompt accuracy",
        "steps":       4,
        "step_presets": {"fast": 2, "balanced": 4, "quality": 8},
        "guidance":    4.5,
        "supports_negative_prompt": True,
        "supports_img2img":         False,
        "ram_required_gb":  12,
        "vram_required_mb": 0,
        "downloadable":             True,
        "download_size_gb":         5.0,
        "download_label":           "SD 3.5 Medium (Q5_K_M)",
        "download_files": [
            {"hf_repo": "city96/stable-diffusion-3.5-medium-gguf",        "filename": "sd3.5_medium-Q5_K_M.gguf"},
            {"hf_repo": "second-state/stable-diffusion-3.5-medium-GGUF",  "filename": "clip_l.safetensors"},
            {"hf_repo": "second-state/stable-diffusion-3.5-medium-GGUF",  "filename": "clip_g.safetensors"},
            {"hf_repo": "second-state/stable-diffusion-3.5-medium-GGUF",  "filename": "t5xxl_fp16.safetensors"},
            {"hf_repo": "ND911/SD35_Blur_Canny_Depth",                    "filename": "SD3.5_Vae.safetensors", "local_name": "sd3_vae.safetensors"},
        ],
    },
}

def get_image_model_info(model_key: str = None) -> dict:
    """Get registry info for a model key, falling back to selected model."""
    if model_key is None:
        model_key = get_selected_diffusion_model()
    fallback = IMAGE_MODEL_REGISTRY.get("flux-schnell", {})
    return IMAGE_MODEL_REGISTRY.get(model_key, fallback)

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

    Conventions:
    - phi4-mm-Q4_K_M.gguf  →  phi4-mm-vision-q8.gguf  (prefix + 'vision')
    - Qwen2.5-VL-7B-Instruct-Q4_K_M.gguf  →  mmproj-Qwen2.5-VL-7B-F16.gguf  (mmproj + model family)
    """
    base = model_filename.replace(".gguf", "").replace(".bin", "")
    name_lower = model_filename.lower()

    # Derive the model prefix (everything before the quant tag)
    prefix = base.split("-Q")[0].split("-q")[0]  # strip quant suffix

    search_dirs = [MODELS_DIR, Path(os.path.expandvars("%APPDATA%")) / "Offline AI Standalone" / "models"]

    # Collect all matching projectors, then pick the best one
    candidates = []

    for search_dir in search_dirs:
        if not search_dir.exists():
            continue
        for f in search_dir.iterdir():
            if not f.is_file() or f.suffix.lower() != ".gguf":
                continue
            fname = f.name.lower()

            # Match 1: prefix + 'vision' (e.g. phi4-mm-vision-q8.gguf)
            # Skip the model file itself to prevent self-matching (e.g. Gemma4-E2B-Vision.gguf matching itself)
            if "vision" in fname and prefix and fname.startswith(prefix.lower()) and f.name != model_filename:
                candidates.append(f)
                continue

            # Match 2: mmproj file matching model family (e.g. mmproj-Qwen2.5-VL-7B-F16.gguf)
            if "mmproj" in fname:
                matched = False
                # Check if model family matches (e.g. both contain "qwen2.5-vl")
                for family in ["qwen2.5-vl", "qwen2-vl", "llava", "phi4", "minicpm", "lfm2", "gemma4", "gemma-4"]:
                    family_variants = [family, family.replace("-", "")]
                    if any(v in name_lower for v in family_variants) and any(v in fname for v in family_variants):
                        # For model families with sub-variants (e.g. gemma4 E2B vs E4B),
                        # ensure the mmproj matches the specific variant
                        for variant in ["e2b", "e4b", "1b", "2b", "4b", "7b", "12b", "27b"]:
                            if variant in name_lower and variant not in fname:
                                break  # variant mismatch — skip this candidate
                        else:
                            candidates.append(f)
                            matched = True
                        break
                if not matched:
                    # Also match generic mmproj if model family is in the mmproj name
                    if prefix.lower().replace("-instruct", "").replace("-chat", "") in fname:
                        candidates.append(f)

    if not candidates:
        return None

    # Prefer quantized projectors (Q4/Q5/Q8) over F16/F32 for faster CPU inference
    def projector_priority(path):
        name = path.name.lower()
        if any(q in name for q in ["q4_", "q4-", "q4.", "q5_", "q5-", "q5."]):
            return 0  # Best: smaller quantized
        if any(q in name for q in ["q8_", "q8-", "q8.", "q8"]):
            return 1  # Good: Q8 quantized
        if "f16" in name:
            return 2  # Fallback: F16
        if "f32" in name:
            return 3  # Last resort: F32
        return 1  # Unknown quant, treat as Q8-tier

    candidates.sort(key=projector_priority)
    chosen = candidates[0]
    print(f"[OK] [CONFIG] Found vision projector: {chosen.name} (selected from {len(candidates)} candidate(s))", flush=True)
    return str(chosen)

_config_printed = False

def resolve_model_path(model_filename: str) -> str:
    """Resolve model path: check user data directory first, then bundled."""
    user_models_dir = Path(os.path.expandvars("%APPDATA%")) / "Offline AI Standalone" / "models"
    user_model_path = user_models_dir / model_filename

    if user_model_path.exists():
        if not _config_printed:
            print(f"[OK] [CONFIG] Using model from user data: {user_model_path}", flush=True)
        return str(user_model_path)
    else:
        bundled_path = MODELS_DIR / model_filename
        if not _config_printed:
            print(f"[OK] [CONFIG] Using bundled model: {bundled_path}", flush=True)
        return str(bundled_path)

def get_model_path():
    """Get the full path to the currently selected model."""
    global _config_printed
    selected_model = get_selected_model()
    model_path = resolve_model_path(selected_model)
    if not _config_printed:
        print(f"[OK] [CONFIG] Selected model: {selected_model}", flush=True)
        print(f"[OK] [CONFIG] Full model path: {model_path}", flush=True)
        print(f"[OK] [CONFIG] Model exists: {Path(model_path).exists()}", flush=True)
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

def _default_thread_count() -> int:
    """Use physical cores minus 1, clamped to [2, 16]."""
    import os
    try:
        import psutil
        cores = psutil.cpu_count(logical=False) or os.cpu_count() or 4
    except ImportError:
        cores = os.cpu_count() or 4
    return max(2, min(cores - 1, 16))

# Improved Llama CLI parameters for better reliability and speed
LLAMA_PARAMS = {
    # Maximum tokens to generate in a single response
    "max_tokens": 2000,
    "threads": _default_thread_count(),
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
MODEL_N_CTX = 12288
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

# ============================================================================
# OCR CONFIGURATION (PaddleOCR-VL)
# ============================================================================

OCR_ENABLED = os.environ.get("OCR_ENABLED", "true").lower() == "true"
OCR_CONFIG_FILE = MODELS_DIR / ".ocr-config.json"

def get_ocr_enabled() -> bool:
    """Check if OCR grading is enabled (persisted preference)."""
    if OCR_CONFIG_FILE.exists():
        try:
            with open(OCR_CONFIG_FILE, 'r') as f:
                config = json.load(f)
                return config.get('enabled', True)
        except Exception:
            pass
    return OCR_ENABLED

def set_ocr_enabled(enabled: bool):
    """Save OCR enabled/disabled preference."""
    try:
        OCR_CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(OCR_CONFIG_FILE, 'w') as f:
            json.dump({'enabled': enabled}, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving OCR config: {e}", flush=True)
        return False

print(f"[OK] [CONFIG] OCR grading: {'enabled' if get_ocr_enabled() else 'disabled'}", flush=True)

# OCR model selection (supports multiple OCR models)
DEFAULT_OCR_MODEL = "PaddleOCR-VL-1.5-Q4_K_M"
OCR_MODEL_CONFIG_FILE = MODELS_DIR / ".ocr-model-config.json"

def get_selected_ocr_model() -> str:
    """Get the currently selected OCR model from config file."""
    if OCR_MODEL_CONFIG_FILE.exists():
        try:
            with open(OCR_MODEL_CONFIG_FILE, 'r') as f:
                config = json.load(f)
                return config.get('selectedModel', DEFAULT_OCR_MODEL)
        except Exception:
            pass
    return DEFAULT_OCR_MODEL

def set_selected_ocr_model(model_name: str) -> bool:
    """Save the selected OCR model to config file."""
    try:
        OCR_MODEL_CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(OCR_MODEL_CONFIG_FILE, 'w') as f:
            json.dump({'selectedModel': model_name}, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving OCR model config: {e}", flush=True)
        return False

def scan_ocr_models() -> list:
    """Scan MODELS_DIR for available OCR models (those in the ocr_models tier list)."""
    models = []
    if not MODELS_DIR.exists():
        return models

    tier_config = get_tier_config()
    ocr_model_names = tier_config.get("ocr_models", [])
    selected = get_selected_ocr_model()

    for model_name in ocr_model_names:
        # Look for the main GGUF file
        main_gguf = MODELS_DIR / f"{model_name}.gguf"
        if not main_gguf.exists():
            continue

        # Look for a matching mmproj file — strip quant suffix (e.g. -Q4_K_M)
        # to match mmproj with different quant (e.g. mmproj-PaddleOCR-VL-1.5-Q8_0.gguf)
        base_name = re.sub(r'-Q\d.*$', '', model_name)  # PaddleOCR-VL-1.5
        mmproj_matches = list(MODELS_DIR.glob(f"mmproj-{base_name}*.gguf"))
        if not mmproj_matches:
            # Fallback: try exact name match
            mmproj_matches = list(MODELS_DIR.glob(f"mmproj-{model_name}*.gguf"))
        if not mmproj_matches:
            continue

        mmproj_file = mmproj_matches[0]
        total_size_mb = (main_gguf.stat().st_size + mmproj_file.stat().st_size) / (1024 * 1024)

        models.append({
            "name": model_name,
            "main_file": main_gguf.name,
            "mmproj_file": mmproj_file.name,
            "size_mb": round(total_size_mb, 2),
            "is_active": model_name == selected,
        })

    models.sort(key=lambda x: x["name"])
    return models

# ============================================================================
# TIER CONFIGURATION (auto-detected model capability tiers)
# ============================================================================

TIER_CONFIG_FILE = MODELS_DIR / ".tier-config.json"

DEFAULT_TIER_CONFIG = {
    "tier1_models": ["PEARL_AI.gguf"],
    "tier2_models": [],
    "ocr_models": ["PaddleOCR-VL-1.5-Q4_K_M"],
    "tier2_diffusion_models": ["sdxl-turbo-gguf-q8", "sdxl-turbo-int8"],
    "tier3_diffusion_models": ["sdxl-lightning-q5"],
    "tier4_diffusion_models": ["flux-schnell", "sd35-medium-q5"],
    "dual_model": {
        "enabled": False,
        "fast_model": None,
        "task_routing": {
            "chat": "primary",
            "lesson-plan": "primary",
            "quiz": "fast",
            "rubric": "fast",
            "kindergarten": "primary",
            "multigrade": "primary",
            "cross-curricular": "primary",
            "worksheet": "fast",
            "presentation": "primary",
            "brain-dump": "fast",
            "title-generation": "fast",
            "autocomplete": "fast",
            "organize-note": "fast",
            "smart-search": "fast",
            "insights-curriculum": "primary",
            "insights-performance": "primary",
            "insights-content": "primary",
            "insights-attendance": "primary",
            "insights-achievements": "primary",
            "insights-recommendations": "primary",
            "insights-synthesis": "primary"
        }
    }
}


def get_tier_config() -> dict:
    """Read tier config, creating with defaults if missing."""
    if TIER_CONFIG_FILE.exists():
        try:
            with open(TIER_CONFIG_FILE, 'r') as f:
                config = json.load(f)
                # Merge with defaults for any missing keys
                for key, value in DEFAULT_TIER_CONFIG.items():
                    if key not in config:
                        config[key] = value
                # Merge dual_model sub-keys
                if "dual_model" in config and isinstance(config["dual_model"], dict):
                    for dk, dv in DEFAULT_TIER_CONFIG["dual_model"].items():
                        if dk not in config["dual_model"]:
                            config["dual_model"][dk] = dv
                    # Merge task_routing defaults
                    if "task_routing" in config["dual_model"]:
                        for tk, tv in DEFAULT_TIER_CONFIG["dual_model"]["task_routing"].items():
                            if tk not in config["dual_model"]["task_routing"]:
                                config["dual_model"]["task_routing"][tk] = tv
                return config
        except Exception:
            pass
    # Create default config
    TIER_CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
    TIER_CONFIG_FILE.write_text(json.dumps(DEFAULT_TIER_CONFIG, indent=2))
    return dict(DEFAULT_TIER_CONFIG)


def set_tier_config(config: dict):
    """Save updated tier config."""
    try:
        TIER_CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
        TIER_CONFIG_FILE.write_text(json.dumps(config, indent=2))
        return True
    except Exception as e:
        print(f"Error saving tier config: {e}", flush=True)
        return False


def get_model_tier(model_name: str, tier_config: dict = None) -> int:
    """Determine which tier a model belongs to. Defaults to 1."""
    if tier_config is None:
        tier_config = get_tier_config()
    if not model_name:
        return 1
    name_lower = model_name.lower()
    for m in tier_config.get("tier2_models", []):
        if m.lower() in name_lower or name_lower in m.lower():
            return 2
    return 1


def compute_effective_tier(tier_config: dict = None) -> dict:
    """Compute the effective tier and capability flags based on current state."""
    if tier_config is None:
        tier_config = get_tier_config()

    selected_llm = get_selected_model()
    llm_tier = get_model_tier(selected_llm, tier_config)

    # Vision check (from model's vision projector availability)
    has_vision = resolve_vision_projector_path(selected_llm) is not None

    # OCR check — requires selected OCR model GGUF + mmproj to be present
    selected_ocr = get_selected_ocr_model()
    ocr_main = MODELS_DIR / f"{selected_ocr}.gguf"
    ocr_base = re.sub(r'-Q\d.*$', '', selected_ocr)
    ocr_mmproj_matches = list(MODELS_DIR.glob(f"mmproj-{ocr_base}*.gguf")) if MODELS_DIR.exists() else []
    has_ocr_model = ocr_main.exists() and len(ocr_mmproj_matches) > 0
    has_ocr = has_ocr_model and get_ocr_enabled()

    # Diffusion check - tier based on model quality class
    diffusion_model = get_selected_diffusion_model()
    tier2_diff = tier_config.get("tier2_diffusion_models", [])
    tier3_diff = tier_config.get("tier3_diffusion_models", [])
    tier4_diff = tier_config.get("tier4_diffusion_models", [])
    all_diffusion = tier2_diff + tier3_diff + tier4_diff
    available_diffusion = scan_diffusion_models()
    available_names = {m["name"] for m in available_diffusion}
    has_diffusion = diffusion_model in all_diffusion and diffusion_model in available_names

    diffusion_tier = 0
    if has_diffusion:
        if diffusion_model in tier4_diff:
            diffusion_tier = 4
        elif diffusion_model in tier3_diff:
            diffusion_tier = 3
        else:
            diffusion_tier = 2

    # LaMa inpainting model check
    has_lama = LAMA_MODEL_PATH.exists()

    # Compute effective tier
    # The LLM tier is the base. Vision/OCR can bump 1→2, but only if the
    # LLM is actually multimodal (has a vision projector) OR OCR is enabled
    # alongside a vision-capable model. Diffusion bumps tier to 3 when enabled,
    # allowing tier 1 + diffusion to unlock image generation.
    tier = llm_tier
    if has_vision:
        tier = max(tier, 2)
    if diffusion_tier > 0:
        tier = max(tier, diffusion_tier)

    # Dual model info
    dual_model = tier_config.get("dual_model", DEFAULT_TIER_CONFIG["dual_model"])
    # Auto-disable dual model if tier < 2
    if tier < 2:
        dual_model = {**dual_model, "enabled": False}

    # Thinking support check (Qwen2.5/Qwen3 models)
    supports_thinking = False
    if selected_llm:
        from llama_inference import LlamaInference
        model_family = LlamaInference.detect_model_family(selected_llm)
        supports_thinking = model_family.get("supports_thinking", False)

    return {
        "tier": tier,
        "has_llm": bool(selected_llm),
        "has_vision": has_vision,
        "has_ocr": has_ocr,
        "has_diffusion": has_diffusion,
        "diffusion_tier": diffusion_tier,
        "has_lama": has_lama,
        "has_ocr_model": has_ocr_model,
        "selected_llm": selected_llm,
        "selected_diffusion": diffusion_model,
        "selected_ocr": selected_ocr,
        "dual_model": dual_model,
        "supports_thinking": supports_thinking,
    }


print(f"[OK] [CONFIG] Inference backend: {INFERENCE_BACKEND}", flush=True)
if INFERENCE_BACKEND == "gemma_api":
    if GEMMA_API_KEY:
        print(f"[OK] [CONFIG] Gemma API key configured", flush=True)
    else:
        print(f"✗ [CONFIG] WARNING: INFERENCE_BACKEND is 'gemma_api' but GEMMA_API_KEY not set!", flush=True)
elif INFERENCE_BACKEND == "openrouter":
    if OPENROUTER_API_KEY:
        print(f"[OK] [CONFIG] OpenRouter API key configured", flush=True)
        print(f"[OK] [CONFIG] OpenRouter model: {OPENROUTER_MODEL}", flush=True)
    else:
        print(f"✗ [CONFIG] WARNING: INFERENCE_BACKEND is 'openrouter' but OPENROUTER_API_KEY not set!", flush=True)