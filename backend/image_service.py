import asyncio
import os
import sys
import subprocess
import logging
import threading
import requests
import time
import atexit
from pathlib import Path
from typing import Optional, Dict, Any, List
import base64
from io import BytesIO
import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)

def get_resource_path(relative_path: str) -> Path:
    """
    Get absolute path to resource, works for dev and production (Electron)
    """
    if hasattr(sys, '_MEIPASS'):
        base_path = Path(sys._MEIPASS)
    elif os.environ.get('ELECTRON_RESOURCE_PATH'):
        base_path = Path(os.environ['ELECTRON_RESOURCE_PATH'])
    else:
        base_path = Path(__file__).parent
    resource_path = base_path / relative_path
    logger.info(f"Resource path resolved: {relative_path} -> {resource_path}")
    return resource_path


def get_app_data_path(subfolder: str = "") -> Path:
    """
    Get user-writable data directory for caching models
    """
    if os.name == 'nt':
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Teacher Assistant' / 'cache'
    else:
        data_dir = Path.home() / '.olh_ai_education' / 'cache'
    if subfolder:
        data_dir = data_dir / subfolder
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir


# ── LoRA registry ────────────────────────────────────────────────────────────

LORA_REGISTRY = {
    "detail_tweaker": {
        "file": "Detail-Tweaker-XL.safetensors",
        "name": "Detail Tweaker XL",
        "description": "Enhances overall detail and sharpness",
        "default_weight": 1.2,
        "default_enabled": True,
    },
    "wrong_lora": {
        "file": "sdxl_wrong_lora.bin",
        "name": "SDXL Wrong LoRA",
        "description": "Improves textures, color, and anatomy (use 'wrong' in negative prompt)",
        "default_weight": 0.8,
        "default_enabled": True,
        "negative_trigger": "wrong",
    },
    "add_detail": {
        "file": "add-detail-xl.safetensors",
        "name": "Add More Details",
        "description": "General detail enhancement",
        "default_weight": 0.8,
        "default_enabled": False,
    },
}


def _load_loras(pipe, model_path: Path):
    """Load available LoRA adapters into the pipeline."""
    lora_dir = model_path / "loras"
    if not lora_dir.exists():
        logger.info("No loras directory found, skipping LoRA loading.")
        return []

    loaded = []
    adapter_names = []
    adapter_weights = []

    for lora_key, lora_info in LORA_REGISTRY.items():
        lora_path = lora_dir / lora_info["file"]
        if not lora_path.exists():
            logger.info(f"LoRA not found, skipping: {lora_info['file']}")
            continue

        try:
            logger.info(f"Loading LoRA: {lora_info['name']} ({lora_info['file']})...")
            pipe.load_lora_weights(
                str(lora_dir),
                weight_name=lora_info["file"],
                adapter_name=lora_key,
            )
            loaded.append(lora_key)
            if lora_info.get("default_enabled", False):
                adapter_names.append(lora_key)
                adapter_weights.append(lora_info["default_weight"])
            logger.info(f"LoRA loaded: {lora_info['name']} (enabled={lora_info.get('default_enabled', False)}, weight={lora_info['default_weight']})")
        except Exception as e:
            logger.warning(f"Failed to load LoRA {lora_info['name']}: {e}")

    # Activate enabled LoRAs
    if adapter_names:
        try:
            pipe.set_adapters(adapter_names, adapter_weights=adapter_weights)
            logger.info(f"Active LoRAs: {list(zip(adapter_names, adapter_weights))}")
        except Exception as e:
            logger.warning(f"Failed to set adapters: {e}")

    return loaded


# ── pipeline loaders ─────────────────────────────────────────────────────────

def _detect_openvino_device() -> str:
    """Detect best available OpenVINO device: GPU (iGPU/dGPU) if available, else CPU."""
    try:
        import openvino as ov
        core = ov.Core()
        devices = core.available_devices
        if "GPU" in devices:
            logger.info(f"OpenVINO GPU device detected — using GPU (available: {devices})")
            return "GPU"
        logger.info(f"No OpenVINO GPU found — using CPU (available: {devices})")
    except Exception as e:
        logger.warning(f"Could not detect OpenVINO devices: {e}")
    return "CPU"


def _load_openvino(model_path: Path):
    """Load SDXL-Turbo via OpenVINO with optional INT8 UNet and full perf config."""
    from optimum.intel.openvino import OVStableDiffusionXLPipeline
    import openvino as ov

    # Build OpenVINO config for optimal CPU inference latency
    cache_dir = str(model_path / ".ov_cache_v1")
    physical_cores = _get_physical_core_count()
    cpu_features = _detect_cpu_features()
    precision = "bf16" if cpu_features.get("bf16") else "f16"

    ov_config = {
        "CACHE_DIR": cache_dir,
        "PERFORMANCE_HINT": "LATENCY",
        "NUM_STREAMS": "1",
        "INFERENCE_PRECISION_HINT": precision,
        "INFERENCE_NUM_THREADS": str(physical_cores),
        "ENABLE_HYPER_THREADING": "NO",
    }
    # AFFINITY was removed in OpenVINO 2024.x -- only set if supported
    try:
        core = ov.Core()
        supported = core.get_property("CPU", "SUPPORTED_PROPERTIES")
        if "AFFINITY" in supported:
            ov_config["AFFINITY"] = "CORE"
    except Exception:
        core = ov.Core()

    logger.info(
        f"OpenVINO SDXL config: threads={physical_cores}, precision={precision}, "
        f"bf16={cpu_features.get('bf16')}, cache={cache_dir}"
    )

    pipe = OVStableDiffusionXLPipeline.from_pretrained(
        str(model_path), compile=False, device="CPU",
        ov_config=ov_config,
    )

    # Use INT8 quantized UNet if available
    int8_unet_path = model_path / "optimized_unet" / "openvino_model.xml"
    if int8_unet_path.exists():
        logger.info("Loading INT8 quantized UNet for faster inference...")
        pipe.unet.model = core.read_model(str(int8_unet_path))
        pipe.unet.request = None
        logger.info("INT8 UNet loaded.")

    pipe.compile()
    return pipe


def _load_openvino_img2img(model_path: Path):
    """Load SDXL-Turbo Image-to-Image pipeline via OpenVINO with full perf config."""
    from optimum.intel.openvino import OVStableDiffusionXLImg2ImgPipeline
    import openvino as ov

    # Reuse same perf config as txt2img
    cache_dir = str(model_path / ".ov_cache_v1")
    physical_cores = _get_physical_core_count()
    cpu_features = _detect_cpu_features()
    precision = "bf16" if cpu_features.get("bf16") else "f16"

    ov_config = {
        "CACHE_DIR": cache_dir,
        "PERFORMANCE_HINT": "LATENCY",
        "NUM_STREAMS": "1",
        "INFERENCE_PRECISION_HINT": precision,
        "INFERENCE_NUM_THREADS": str(physical_cores),
        "ENABLE_HYPER_THREADING": "NO",
    }
    try:
        core = ov.Core()
        supported = core.get_property("CPU", "SUPPORTED_PROPERTIES")
        if "AFFINITY" in supported:
            ov_config["AFFINITY"] = "CORE"
    except Exception:
        core = ov.Core()

    pipe = OVStableDiffusionXLImg2ImgPipeline.from_pretrained(
        str(model_path), compile=False, device="CPU",
        ov_config=ov_config,
    )

    # Use INT8 quantized UNet if available
    int8_unet_path = model_path / "optimized_unet" / "openvino_model.xml"
    if int8_unet_path.exists():
        pipe.unet.model = core.read_model(str(int8_unet_path))
        pipe.unet.request = None

    pipe.compile()
    return pipe


def _get_negative_trigger_words() -> str:
    """Return extra negative prompt words from enabled LoRAs with negative_trigger."""
    triggers = []
    for lora_info in LORA_REGISTRY.values():
        if lora_info.get("default_enabled") and lora_info.get("negative_trigger"):
            triggers.append(lora_info["negative_trigger"])
    return ", ".join(triggers)


def _truncate_to_clip_tokens(prompt: str, max_tokens: int = 75) -> str:
    """Truncate a prompt to fit within CLIP's token limit.

    CLIP uses a simple whitespace/punctuation tokenizer where each word is
    roughly one token.  We approximate by splitting on whitespace and commas,
    keeping at most *max_tokens* pieces, then re-joining.  This avoids pulling
    in the full CLIP tokenizer as a dependency while preventing the noisy
    truncation warnings from diffusers.
    """
    # Split on comma-separated phrases first to keep logical groups together
    import re
    parts = [p.strip() for p in re.split(r',\s*', prompt) if p.strip()]
    result_parts: list[str] = []
    token_count = 0
    for part in parts:
        words = part.split()
        if token_count + len(words) > max_tokens:
            # Try to fit as many words from this part as possible
            remaining = max_tokens - token_count
            if remaining > 0:
                result_parts.append(' '.join(words[:remaining]))
            break
        result_parts.append(part)
        token_count += len(words)
    truncated = ', '.join(result_parts)
    if len(truncated) < len(prompt):
        logger.debug(f"Prompt truncated from ~{len(prompt.split())} to ~{max_tokens} tokens for CLIP")
    return truncated


def _get_physical_core_count() -> int:
    """Return the number of physical CPU cores (not logical/hyperthreaded)."""
    try:
        import psutil
        return psutil.cpu_count(logical=False) or os.cpu_count() or 4
    except ImportError:
        return os.cpu_count() or 4


_cached_vulkan_info: Optional[Dict[str, Any]] = None


def _detect_vulkan_gpu() -> Dict[str, Any]:
    """Detect first Vulkan device and its VRAM. Returns dict with keys:
      available (bool), device_name (str), vram_gb (int).
    Works vendor-agnostic: Intel, NVIDIA, AMD, Apple, Qualcomm.
    Cached per-process.
    """
    global _cached_vulkan_info
    if _cached_vulkan_info is not None:
        return _cached_vulkan_info

    info = {"available": False, "device_name": "", "vram_gb": 0}
    try:
        import subprocess, re
        # --summary for device name (fast)
        proc = subprocess.run(
            ["vulkaninfo", "--summary"],
            capture_output=True, text=True, timeout=8,
        )
        if proc.returncode != 0:
            raise RuntimeError(f"vulkaninfo exit {proc.returncode}")
        name_m = re.search(r"deviceName\s*=\s*(.+)", proc.stdout)
        if name_m:
            info["device_name"] = name_m.group(1).strip()
            info["available"] = True

        # Full dump for heap sizes (slower but only once per process)
        full = subprocess.run(
            ["vulkaninfo"],
            capture_output=True, text=True, timeout=15,
        )
        if full.returncode == 0:
            # Pick largest heap size across all devices
            heap_sizes = re.findall(r"size\s*=\s*(\d+)\s*\(0x[0-9a-f]+\)\s*\([\d.]+\s*GiB\)",
                                     full.stdout)
            if heap_sizes:
                info["vram_gb"] = max(int(s) for s in heap_sizes) // (1024 ** 3)
    except FileNotFoundError:
        logger.debug("vulkaninfo not found — no Vulkan runtime")
    except Exception as e:
        logger.debug(f"Vulkan detection failed: {e}")

    _cached_vulkan_info = info
    if info["available"]:
        logger.info(
            f"[gpu] Vulkan device: {info['device_name']} ({info['vram_gb']}GB VRAM)"
        )
    else:
        logger.info("[gpu] No Vulkan device — CPU inference path")
    return info


def _apply_vulkan_kwargs(kwargs: dict, sd_params, small_gpu_threshold_gb: int = 8) -> None:
    """Apply Vulkan-aware kwargs to sd.cpp StableDiffusion constructor.
    No-op if no Vulkan GPU detected. Falls back cleanly on CPU.
    """
    gpu = _detect_vulkan_gpu()
    if not gpu["available"]:
        return
    if gpu["vram_gb"] > 0 and gpu["vram_gb"] < small_gpu_threshold_gb:
        if "keep_clip_on_cpu" in sd_params:
            kwargs["keep_clip_on_cpu"] = True
            logger.info(
                f"[gpu] Small GPU ({gpu['vram_gb']}GB) — text encoder stays on CPU"
            )
        if "keep_vae_on_cpu" in sd_params:
            kwargs["keep_vae_on_cpu"] = False  # VAE fits
    else:
        logger.info(f"[gpu] Large GPU ({gpu['vram_gb']}GB) — full offload")


def _detect_cpu_features() -> dict:
    """Detect CPU features relevant to OpenVINO optimization."""
    features = {"bf16": False, "avx512": False}
    try:
        from openvino.runtime import Core
        core = Core()
        caps = str(core.get_property("CPU", "OPTIMIZATION_CAPABILITIES")).lower()
        if "bf16" in caps:
            features["bf16"] = True
        if "avx512" in caps:
            features["avx512"] = True
        logger.info(f"CPU optimization capabilities: {caps}")
    except Exception as e:
        logger.debug(f"Could not detect CPU features: {e}")
    return features


def _load_flux_schnell_ov(model_path: Path):
    """Load FLUX.1 Schnell INT4 via OpenVINO.

    Uses OVDiffusionPipeline with a reshape skip to work around a shape
    inference bug in optimum-intel's dynamic reshape for FLUX transformers.
    Configures OpenVINO for optimal CPU latency with model caching.
    """
    from optimum.intel.openvino import modeling_diffusion, OVDiffusionPipeline

    # Build OpenVINO config for optimal CPU inference latency
    cache_dir = str(model_path / ".ov_cache_v1")
    physical_cores = _get_physical_core_count()

    # Detect CPU capabilities for precision selection
    cpu_features = _detect_cpu_features()
    precision = "bf16" if cpu_features.get("bf16") else "f16"

    ov_config = {
        "CACHE_DIR": cache_dir,
        "PERFORMANCE_HINT": "LATENCY",
        "NUM_STREAMS": "1",
        "INFERENCE_PRECISION_HINT": precision,
        "INFERENCE_NUM_THREADS": str(physical_cores),
        "ENABLE_HYPER_THREADING": "NO",
    }
    # AFFINITY was removed in OpenVINO 2024.x — only set if supported
    try:
        import openvino as ov
        core = ov.Core()
        supported = core.get_property("CPU", "SUPPORTED_PROPERTIES")
        if "AFFINITY" in supported:
            ov_config["AFFINITY"] = "CORE"
    except Exception:
        pass
    logger.info(
        f"OpenVINO Flux config: threads={physical_cores}, precision={precision}, "
        f"bf16={cpu_features.get('bf16')}, cache={cache_dir}"
    )

    # Skip the automatic reshape in __init__ which fails on FLUX models
    _orig_reshape = modeling_diffusion.OVDiffusionPipeline.reshape
    modeling_diffusion.OVDiffusionPipeline.reshape = lambda self, *a, **kw: None
    try:
        pipe = OVDiffusionPipeline.from_pretrained(
            str(model_path), compile=False, ov_config=ov_config
        )
    finally:
        modeling_diffusion.OVDiffusionPipeline.reshape = _orig_reshape

    pipe.compile()
    return pipe


def _load_sdxl_turbo_gguf(model_path: Path, gguf_file: str = None):
    """Load SDXL-Turbo GGUF via stable-diffusion-cpp-python (CPU)."""
    from stable_diffusion_cpp import StableDiffusion

    if gguf_file is None:
        gguf_file = "sdxl-turbo-q4_k_m.gguf"

    model_file = str(model_path / gguf_file)

    if not Path(model_file).exists():
        raise FileNotFoundError(f"SDXL-Turbo GGUF not found: {model_file}")

    n_threads = _get_physical_core_count()
    logger.info(f"Loading SDXL-Turbo GGUF: {gguf_file}, threads={n_threads}")

    # vae_decode_only=False to retain VAE encoder for img2img support
    import inspect
    sd_params = inspect.signature(StableDiffusion.__init__).parameters

    kwargs = dict(
        model_path=model_file,
        n_threads=n_threads,
        vae_decode_only=False,
    )
    if "flash_attn" in sd_params:
        kwargs["flash_attn"] = True
        logger.info("Enabled flash_attn for SDXL GGUF")
    if "vae_conv_direct" in sd_params:
        kwargs["vae_conv_direct"] = True
        logger.info("Enabled vae_conv_direct for SDXL GGUF")
    _apply_vulkan_kwargs(kwargs, sd_params)

    sd = StableDiffusion(**kwargs)
    return sd


def _load_sd3_gguf(model_path: Path, gguf_file: str = None):
    """Load SD 3.5 GGUF via stable-diffusion-cpp-python (CPU)."""
    from stable_diffusion_cpp import StableDiffusion

    if gguf_file is None:
        gguf_file = "sd3.5_medium-Q5_K_M.gguf"

    model_file  = str(model_path / gguf_file)
    clip_l_path = str(model_path / "clip_l.safetensors")
    clip_g_path = str(model_path / "clip_g.safetensors")
    t5xxl_path  = str(model_path / "t5xxl_fp16.safetensors")

    for fpath, label in [
        (model_file,  "SD 3.5 diffusion model"),
        (clip_l_path, "CLIP-L"),
        (clip_g_path, "CLIP-G"),
        (t5xxl_path,  "T5-XXL"),
    ]:
        if not Path(fpath).exists():
            raise FileNotFoundError(f"SD3.5 {label} not found: {fpath}")

    n_threads = _get_physical_core_count()
    logger.info(f"Loading SD3.5 GGUF: {gguf_file}, threads={n_threads}")

    import inspect
    sd_params = inspect.signature(StableDiffusion.__init__).parameters

    kwargs = dict(
        clip_l_path=clip_l_path,
        t5xxl_path=t5xxl_path,
        vae_decode_only=True,
        n_threads=n_threads,
    )
    # SD3.5 uses flow matching — must be set explicitly since sd.cpp cannot
    # auto-detect the prediction type from a quantised GGUF file.
    if "diffusion_model_path" in sd_params:
        # Prefer diffusion_model_path for standalone diffusion GGUFs
        kwargs["diffusion_model_path"] = model_file
    else:
        kwargs["model_path"] = model_file
    if "prediction" in sd_params:
        kwargs["prediction"] = "flow"
        logger.info("Set prediction=flow for SD3.5 (flow matching)")
    # clip_g is required for SD3.5 — only pass if the binding supports it
    if "clip_g_path" in sd_params:
        kwargs["clip_g_path"] = clip_g_path
    # VAE is required for GGUF diffusion-only models (VAE tensors are not in the GGUF).
    # Support full VAE (sd3_vae.safetensors) or Tiny AutoEncoder (taesd3_decoder.safetensors).
    vae_path = model_path / "sd3_vae.safetensors"
    taesd_path = model_path / "taesd3_decoder.safetensors"
    if vae_path.exists() and "vae_path" in sd_params:
        kwargs["vae_path"] = str(vae_path)
        logger.info(f"Using separate VAE: {vae_path}")
    elif taesd_path.exists() and "taesd_path" in sd_params:
        kwargs["taesd_path"] = str(taesd_path)
        logger.info(f"Using TAESD3 (Tiny AutoEncoder): {taesd_path}")
    elif "diffusion_model_path" in kwargs:
        # GGUF diffusion-only file won't have VAE tensors embedded
        raise FileNotFoundError(
            "SD3.5 requires a VAE decoder but none was found. "
            "Place one of the following in " + str(model_path) + ": "
            "sd3_vae.safetensors (full VAE, ~300MB) or "
            "taesd3_decoder.safetensors (Tiny AutoEncoder, ~5MB)"
        )
    if "flash_attn" in sd_params:
        kwargs["flash_attn"] = True
    if "vae_conv_direct" in sd_params:
        kwargs["vae_conv_direct"] = True
        logger.info("Enabled vae_conv_direct for SD3.5 GGUF")
    _apply_vulkan_kwargs(kwargs, sd_params)

    return StableDiffusion(**kwargs)


def _load_wan_gguf(model_path: Path, gguf_file: str = None):
    """Load Wan 2.1 GGUF via stable-diffusion-cpp-python (CPU)."""
    from stable_diffusion_cpp import StableDiffusion

    if gguf_file is None:
        gguf_file = "wan2.1-t2v-1.3B-Q5_K_M.gguf"

    model_file = str(model_path / gguf_file)
    if not Path(model_file).exists():
        raise FileNotFoundError(f"Wan GGUF not found: {model_file}")

    n_threads = _get_physical_core_count()
    logger.info(f"Loading Wan GGUF: {gguf_file}, threads={n_threads}")

    import inspect
    sd_params = inspect.signature(StableDiffusion.__init__).parameters

    kwargs = dict(
        model_path=model_file,
        vae_decode_only=True,
        n_threads=n_threads,
    )
    if "flash_attn" in sd_params:
        kwargs["flash_attn"] = True
    if "vae_conv_direct" in sd_params:
        kwargs["vae_conv_direct"] = True
        logger.info("Enabled vae_conv_direct for Wan GGUF")
    _apply_vulkan_kwargs(kwargs, sd_params)

    return StableDiffusion(**kwargs)


def _load_zimage_turbo_gguf(model_path: Path, gguf_file: str = None):
    """Load Z-Image Turbo GGUF via stable-diffusion-cpp-python (CPU).

    Z-Image Turbo is a 6B DiT model using Qwen3 as text encoder and FLUX VAE.
    """
    from stable_diffusion_cpp import StableDiffusion

    if gguf_file is None:
        gguf_file = "z_image_turbo-Q4_0.gguf"

    # Resolve file paths from registry extra_files or defaults
    try:
        from config import get_image_model_info
        info = get_image_model_info("z-image-turbo-q4")
        extra = info.get("extra_files", {})
    except Exception:
        extra = {}

    model_file = str(model_path / gguf_file)
    llm_file   = str(model_path / extra.get("llm_file", "Qwen3-4B-Instruct-2507-Q4_K_M.gguf"))
    vae_file   = str(model_path / extra.get("vae_file", "ae.safetensors"))

    for fpath, label in [
        (model_file, "Z-Image Turbo diffusion model"),
        (llm_file,   "Qwen3 text encoder"),
        (vae_file,   "VAE (ae.safetensors)"),
    ]:
        if not Path(fpath).exists():
            raise FileNotFoundError(f"Z-Image Turbo {label} not found: {fpath}")

    try:
        from cpu_info import optimal_thread_count
        n_threads = optimal_thread_count()
    except Exception:
        n_threads = _get_physical_core_count()
    logger.info(f"Loading Z-Image Turbo GGUF: {gguf_file}, threads={n_threads}")

    import inspect
    sd_params = inspect.signature(StableDiffusion.__init__).parameters

    kwargs = dict(
        vae_path=vae_file,
        vae_decode_only=True,
        n_threads=n_threads,
    )
    # Use diffusion_model_path for DiT-based models
    if "diffusion_model_path" in sd_params:
        kwargs["diffusion_model_path"] = model_file
    else:
        kwargs["model_path"] = model_file
    # Qwen3 as text encoder via llm_path
    if "llm_path" in sd_params:
        kwargs["llm_path"] = llm_file
    else:
        logger.warning("stable-diffusion-cpp-python does not support llm_path — upgrade to >=0.4.6")
        raise RuntimeError("stable-diffusion-cpp-python >=0.4.6 required for Z-Image (llm_path support)")
    if "diffusion_flash_attn" in sd_params:
        kwargs["diffusion_flash_attn"] = True
        logger.info("Enabled diffusion_flash_attn for Z-Image Turbo")
    elif "flash_attn" in sd_params:
        kwargs["flash_attn"] = True
    if "vae_conv_direct" in sd_params:
        kwargs["vae_conv_direct"] = True
    if "enable_mmap" in sd_params:
        kwargs["enable_mmap"] = True
    _apply_vulkan_kwargs(kwargs, sd_params)

    return StableDiffusion(**kwargs)


def _load_flux2_klein_gguf(model_path: Path, gguf_file: str = None):
    """Load FLUX.2 Klein 4B GGUF via stable-diffusion-cpp-python (CPU).

    FLUX.2 Klein uses Qwen3 as text encoder and FLUX2 VAE.
    """
    from stable_diffusion_cpp import StableDiffusion

    if gguf_file is None:
        gguf_file = "flux-2-klein-4b-Q4_0.gguf"

    try:
        from config import get_image_model_info
        info = get_image_model_info("flux2-klein-4b-q4")
        extra = info.get("extra_files", {})
    except Exception:
        extra = {}

    model_file = str(model_path / gguf_file)
    llm_file   = str(model_path / extra.get("llm_file", "Qwen3-4B-Instruct-2507-Q4_K_M.gguf"))
    vae_file   = str(model_path / extra.get("vae_file", "flux2_ae.safetensors"))

    for fpath, label in [
        (model_file, "FLUX.2 Klein diffusion model"),
        (llm_file,   "Qwen3 text encoder"),
        (vae_file,   "FLUX.2 VAE"),
    ]:
        if not Path(fpath).exists():
            raise FileNotFoundError(f"FLUX.2 Klein {label} not found: {fpath}")

    n_threads = _get_physical_core_count()
    logger.info(f"Loading FLUX.2 Klein GGUF: {gguf_file}, threads={n_threads}")

    import inspect
    sd_params = inspect.signature(StableDiffusion.__init__).parameters

    kwargs = dict(
        vae_path=vae_file,
        vae_decode_only=True,
        n_threads=n_threads,
    )
    if "diffusion_model_path" in sd_params:
        kwargs["diffusion_model_path"] = model_file
    else:
        kwargs["model_path"] = model_file
    if "llm_path" in sd_params:
        kwargs["llm_path"] = llm_file
    else:
        raise RuntimeError("stable-diffusion-cpp-python >=0.4.6 required for FLUX.2 Klein (llm_path support)")
    if "diffusion_flash_attn" in sd_params:
        kwargs["diffusion_flash_attn"] = True
        logger.info("Enabled diffusion_flash_attn for FLUX.2 Klein")
    elif "flash_attn" in sd_params:
        kwargs["flash_attn"] = True
    if "vae_conv_direct" in sd_params:
        kwargs["vae_conv_direct"] = True
    if "offload_params_to_cpu" in sd_params:
        kwargs["offload_params_to_cpu"] = True
    _apply_vulkan_kwargs(kwargs, sd_params)

    return StableDiffusion(**kwargs)


# Map backend key → loader function
_LOADERS = {
    "openvino":            _load_openvino,
    "openvino_flux":       _load_flux_schnell_ov,
    "sd_cpp_sdxl":         _load_sdxl_turbo_gguf,
    "sd_cpp_sd3":          _load_sd3_gguf,
    "sd_cpp_wan":          _load_wan_gguf,
    "sd_cpp_zimage":       _load_zimage_turbo_gguf,
    "sd_cpp_flux2klein":   _load_flux2_klein_gguf,
}


class ImageService:
    """Manages image generation (multi-model) and inpainting (LaMa direct)"""

    def __init__(self,
                 sdxl_model_path: Optional[str] = None,
                 model_key: Optional[str] = None):
        """
        Initialize ImageService with automatic path resolution.
        Supports multi-model backends via model_key or legacy sdxl_model_path.
        """
        self.lama_model = None  # Lazy-loaded LaMa JIT model
        self.lama_device = None
        self.pipeline = None
        # Real-ESRGAN service (lazy-init on first use)
        self._esrgan = None
        self.img2img_pipeline = None  # Separate img2img pipeline for OpenVINO
        self.model_info = {}
        self.model_key = None
        self._prompt_cache = {}  # LRU prompt embedding cache for Flux OV
        self._prompt_cache_max = 10
        self._cancel_load = threading.Event()  # Signal to abort an in-progress pipeline load


        try:
            from config import (
                get_selected_diffusion_model, IMAGE_MODEL_REGISTRY,
                get_image_model_path as config_get_image_model_path
            )

            if model_key is None and sdxl_model_path is None:
                model_key = get_selected_diffusion_model()

            if model_key is not None:
                self.model_key = model_key
                self.model_info = IMAGE_MODEL_REGISTRY.get(model_key, {})
                self.model_path = config_get_image_model_path(model_key)
                logger.info(f"Using model key: {model_key}, backend: {self.model_info.get('backend')}")
            else:
                # Legacy path: sdxl_model_path provided directly
                self.model_path = Path(sdxl_model_path)
                self.model_key = "flux-schnell"
                self.model_info = IMAGE_MODEL_REGISTRY.get(self.model_key, {})
        except ImportError:
            # Fallback if config not available
            if sdxl_model_path:
                self.model_path = Path(sdxl_model_path)
            else:
                self.model_path = get_resource_path("../models/image_generation/flux-schnell")
            self.model_key = "flux-schnell"
            self.model_info = {"backend": "openvino_flux", "steps": 1, "guidance": 0.0}

        # Resolve LaMa model path
        self.lama_model_path = self._resolve_lama_path()

        # Register cleanup on exit
        atexit.register(self.cleanup)

        logger.info(f"ImageService initialized")
        logger.info(f"  Model: {self.model_key}, path: {self.model_path}")
        logger.info(f"  Backend: {self.model_info.get('backend', 'unknown')}")
        logger.info(f"  LaMa model: {self.lama_model_path}")

    # Backward compatibility alias
    @property
    def sdxl_pipeline(self):
        return self.pipeline

    @property
    def sdxl_model_path(self):
        return self.model_path

    def _resolve_lama_path(self) -> Optional[Path]:
        """Find the big-lama.pt model file"""
        try:
            from config import LAMA_MODEL_PATH
            if LAMA_MODEL_PATH.exists():
                return LAMA_MODEL_PATH
        except ImportError:
            pass
        bundled = get_resource_path("../models/image_generation/lama/big-lama.pt")
        if bundled.exists():
            return bundled
        logger.warning("LaMa model (big-lama.pt) not found")
        return None

    def _load_lama_model(self):
        """Lazy-load the LaMa JIT model"""
        if self.lama_model is not None:
            return True
        if self.lama_model_path is None or not self.lama_model_path.exists():
            logger.error("LaMa model file not found")
            return False
        try:
            import torch
            self.lama_device = torch.device("cpu")
            logger.info(f"Loading LaMa model from {self.lama_model_path}...")
            self.lama_model = torch.jit.load(
                str(self.lama_model_path), map_location=self.lama_device
            )
            self.lama_model.eval()
            # Apply IPEX optimization on Intel CPUs (no-op otherwise)
            from cpu_info import ipex_optimize
            self.lama_model = ipex_optimize(self.lama_model)
            logger.info("LaMa model loaded successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to load LaMa model: {e}")
            self.lama_model = None
            return False

    _pipeline_lock = threading.Lock()
    _inference_lock = threading.Lock()

    def initialize_pipeline(self) -> bool:
        """Initialize the image generation pipeline (lazy loading, thread-safe)."""
        if self.pipeline is not None:
            return True

        # If a cancellation was requested, don't even start loading
        if self._cancel_load.is_set():
            logger.info("Pipeline load cancelled before start")
            self._cancel_load.clear()
            return False

        # Gate: Brain (LLM) must be loaded before diffusion can start
        try:
            import inference_factory as _inf_mod
            if _inf_mod._local_instance is None or not _inf_mod._local_instance.is_loaded:
                logger.warning("Brain model not loaded yet -- deferring pipeline init")
                return False
        except Exception:
            logger.warning("Cannot verify brain status -- deferring pipeline init")
            return False

        with self._pipeline_lock:
            # Double-check after acquiring lock
            if self.pipeline is not None:
                return True

            # Check cancellation again after acquiring lock (may have waited)
            if self._cancel_load.is_set():
                logger.info("Pipeline load cancelled while waiting for lock")
                self._cancel_load.clear()
                return False

            if not self.model_path.exists():
                logger.error(f"Model folder not found: {self.model_path}")
                return False

            backend = self.model_info.get("backend", "openvino")
            loader = _LOADERS.get(backend)
            if loader is None:
                logger.error(f"No loader for backend: {backend}")
                return False

            try:
                print(f"[IMAGE-DEBUG] Loading pipeline: model={self.model_key}, backend={backend}, path={self.model_path}", flush=True)
                logger.info(f"Loading {self.model_key} via backend={backend} from {self.model_path}...")
                if backend in ("sd_cpp_sdxl", "sd_cpp_sd3", "sd_cpp_wan", "sd_cpp_zimage", "sd_cpp_flux2klein"):
                    self.pipeline = loader(self.model_path, gguf_file=self.model_info.get("gguf_file"))
                else:
                    self.pipeline = loader(self.model_path)

                # Check if cancelled during model load — if so, immediately free what we just loaded
                if self._cancel_load.is_set():
                    logger.info("Pipeline load cancelled during model loading -- releasing immediately")
                    self._cancel_load.clear()
                    import gc
                    del self.pipeline
                    self.pipeline = None
                    gc.collect()
                    return False

                logger.info("Pipeline loaded successfully.")

                # Warmup: run a tiny dummy inference to pre-allocate buffers.
                # Hold _inference_lock so generate_image waits until warmup finishes.
                if backend in ("openvino_flux", "openvino"):
                    with self._inference_lock:
                        # Final cancellation check before warmup
                        if self._cancel_load.is_set():
                            logger.info("Pipeline load cancelled before warmup -- releasing")
                            self._cancel_load.clear()
                            import gc
                            del self.pipeline
                            self.pipeline = None
                            gc.collect()
                            return False
                        try:
                            _label = "Flux" if backend == "openvino_flux" else "SDXL"
                            logger.info(f"Running warmup inference for {_label} OpenVINO...")
                            _warmup_start = time.time()
                            self.pipeline(
                                prompt="warmup",
                                num_inference_steps=1,
                                guidance_scale=0.0,
                                height=64, width=64,
                                output_type="np",
                            )
                            logger.info(f"Warmup done in {time.time() - _warmup_start:.1f}s")
                        except Exception as warmup_err:
                            logger.warning(f"Warmup inference failed (non-fatal): {warmup_err}")

                return True
            except Exception as e:
                import traceback
                tb = traceback.format_exc()
                print(f"[IMAGE-DEBUG] Pipeline init EXCEPTION: {e}\n{tb}", flush=True)
                logger.error(f"Failed to initialize pipeline ({self.model_key}): {e}")
                logger.error(tb)
                return False

    def initialize_sdxl(self) -> bool:
        """Backward-compatible alias for initialize_pipeline."""
        return self.initialize_pipeline()

    def is_lama_loaded(self) -> bool:
        """Check if LaMa model is loaded and ready"""
        return self.lama_model is not None

    # ------------------------------------------------------------------
    # Real-ESRGAN
    # ------------------------------------------------------------------

    def _get_esrgan(self):
        """Return the ESRGANService singleton, creating it on first call."""
        if self._esrgan is None:
            from esrgan_service import ESRGANService
            self._esrgan = ESRGANService()
        return self._esrgan

    def is_esrgan_available(self) -> bool:
        """True if torch is importable (no model download check)."""
        try:
            return self._get_esrgan().is_available()
        except Exception:
            return False

    def is_esrgan_loaded(self, scale: int) -> bool:
        try:
            return self._get_esrgan().is_loaded(scale)
        except Exception:
            return False

    def esrgan_model_exists(self, scale: int) -> bool:
        try:
            return self._get_esrgan().model_file_exists(scale)
        except Exception:
            return False

    def enhance_image(self, image_bytes: bytes, scale: int):
        """Upscale image_bytes by scale (2 or 4) using Real-ESRGAN.

        Returns (png_bytes, orig_size, enhanced_size).
        Raises RuntimeError if model is unavailable.
        """
        return self._get_esrgan().enhance(image_bytes, scale)

    def prepare_prompt(self, prompt: str) -> bool:
        """Pre-encode a prompt and cache the embeddings.

        Disabled for OpenVINO Flux because its inference requests are not
        reentrant — calling encode_prompt concurrently with generate_image
        causes 'Infer Request is busy' errors. The pipeline handles encoding
        internally during generation instead.
        """
        # OpenVINO inference requests cannot run concurrently, so eager
        # encoding would race with generate_image.  Return False to skip.
        return False

    def generate_image(self,
                        prompt: str,
                        negative_prompt: str = "multiple people, group, crowd, deformed, distorted, blurry",
                        width: int = 1024,
                        height: int = 512,
                        num_inference_steps: int = None,
                        guidance_scale: float = None,
                        seed: Optional[int] = None,
                        init_image: Optional[bytes] = None,
                        strength: float = 0.8) -> Optional[bytes]:
        """Generate image using the configured model backend."""
        _holds_inference_lock = False
        try:
            if not self.initialize_pipeline():
                print("[IMAGE-DEBUG] Pipeline initialization FAILED", flush=True)
                logger.error("Pipeline not initialized")
                return None

            # Serialize inference — OpenVINO requests are not reentrant
            self._inference_lock.acquire()
            _holds_inference_lock = True

            # Use model defaults if caller didn't specify
            if num_inference_steps is None:
                num_inference_steps = self.model_info.get("steps", 2)
            if guidance_scale is None:
                guidance_scale = self.model_info.get("guidance", 0.0)

            # Clamp dimensions to model max (INT8 models have fixed shape limits)
            max_w = self.model_info.get("max_width")
            max_h = self.model_info.get("max_height")
            if max_w and width > max_w:
                logger.info(f"Clamping width {width} -> {max_w} (model limit)")
                width = max_w
            if max_h and height > max_h:
                logger.info(f"Clamping height {height} -> {max_h} (model limit)")
                height = max_h

            # SDXL-Turbo: no negative prompts or prompt tweaks (ADD training ignores them)
            if self.model_info.get("supports_negative_prompt", True):
                # Auto-inject LoRA negative trigger words (e.g. "wrong" for wrong_lora)
                extra_neg = _get_negative_trigger_words()
                if extra_neg and extra_neg not in negative_prompt:
                    negative_prompt = f"{negative_prompt}, {extra_neg}"
            else:
                negative_prompt = ""

            # Truncate prompt to CLIP's 77-token limit to avoid silent truncation
            prompt = _truncate_to_clip_tokens(prompt, max_tokens=75)

            logger.info(f"[DEBUG] generate_image params: model={self.model_key}, backend={self.model_info.get('backend')}, "
                       f"steps={num_inference_steps}, guidance={guidance_scale}, "
                       f"width={width}, height={height}, has_init_image={init_image is not None}")
            logger.info(f"Generating image: {prompt[:50]}...")

            import torch
            generator = None
            if seed is not None:
                torch.manual_seed(seed)
                generator = torch.manual_seed(seed)
                logger.info(f"Using seed: {seed}")

            backend = self.model_info.get("backend", "openvino")
            gen_start = time.time()

            if backend == "openvino":
                # OpenVINO SDXL-Turbo pipeline
                if init_image is not None:
                    try:
                        import io as _io
                        init_pil = Image.open(_io.BytesIO(init_image)).convert("RGB")
                        # Resize init image to fit model constraints (INT8 models have fixed compiled shapes)
                        target_w = max_w or width
                        target_h = max_h or height
                        if init_pil.width != target_w or init_pil.height != target_h:
                            logger.info(f"Resizing init image {init_pil.width}x{init_pil.height} -> {target_w}x{target_h}")
                            init_pil = init_pil.resize((target_w, target_h), Image.LANCZOS)
                        # Lazy-load img2img pipeline
                        if self.img2img_pipeline is None:
                            logger.info("Loading OpenVINO img2img pipeline...")
                            self.img2img_pipeline = _load_openvino_img2img(self.model_path)
                            logger.info("OpenVINO img2img pipeline loaded.")
                        # For SDXL-Turbo img2img: ensure at least 2 actual denoising steps
                        import math
                        img2img_steps = max(num_inference_steps, math.ceil(2 / max(strength, 0.1)))
                        result = self.img2img_pipeline(
                            prompt=prompt, negative_prompt=negative_prompt,
                            image=init_pil, strength=strength,
                            num_inference_steps=img2img_steps,
                            guidance_scale=guidance_scale,
                            output_type="np",
                        )
                    except Exception as img2img_err:
                        logger.warning(f"img2img failed, falling back to txt2img: {img2img_err}")
                        # Fallback: regenerate with txt2img using same prompt
                        result = self.pipeline(
                            prompt=prompt, negative_prompt=negative_prompt,
                            num_inference_steps=num_inference_steps,
                            guidance_scale=guidance_scale,
                            width=width, height=height,
                            output_type="np",
                        )
                else:
                    result = self.pipeline(
                        prompt=prompt, negative_prompt=negative_prompt,
                        num_inference_steps=num_inference_steps,
                        guidance_scale=guidance_scale,
                        width=width, height=height,
                        output_type="np",
                    )

            elif backend == "openvino_flux":
                # FLUX INT4 OpenVINO — no negative_prompt or img2img support
                # Note: OpenVINO infer requests are NOT thread-safe / reentrant,
                # so we call the pipeline directly instead of doing a separate
                # encode_prompt + pipeline(prompt_embeds=...) which races on the
                # same T5 inference request and raises "Infer Request is busy".
                if init_image is not None:
                    logger.warning("FLUX Schnell does not support img2img — init_image ignored")

                result = self.pipeline(
                    prompt=prompt,
                    num_inference_steps=num_inference_steps,
                    guidance_scale=guidance_scale,
                    height=height, width=width,
                    output_type="np",
                )

            elif backend == "sd_cpp_sdxl":
                # SDXL-Turbo GGUF via stable-diffusion.cpp — supports negative_prompt + img2img
                if init_image is not None:
                    try:
                        import io as _io
                        init_pil = Image.open(_io.BytesIO(init_image)).convert("RGB")
                        if init_pil.width != width or init_pil.height != height:
                            logger.info(f"Resizing init image {init_pil.width}x{init_pil.height} -> {width}x{height}")
                            init_pil = init_pil.resize((width, height), Image.LANCZOS)
                        output = self.pipeline.img_to_img(
                            image=init_pil,
                            prompt=prompt,
                            negative_prompt=negative_prompt,
                            width=width,
                            height=height,
                            cfg_scale=guidance_scale,
                            sample_steps=num_inference_steps,
                            strength=strength,
                            seed=seed if seed is not None else -1,
                            vae_tiling=width > 512 or height > 512,
                        )
                    except Exception as img2img_err:
                        logger.warning(f"SDXL GGUF img2img failed, falling back to txt2img: {img2img_err}")
                        output = self.pipeline.generate_image(
                            prompt=prompt,
                            negative_prompt=negative_prompt,
                            width=width,
                            height=height,
                            cfg_scale=guidance_scale,
                            sample_steps=num_inference_steps,
                            seed=seed if seed is not None else -1,
                            vae_tiling=width > 512 or height > 512,
                        )
                else:
                    output = self.pipeline.generate_image(
                        prompt=prompt,
                        negative_prompt=negative_prompt,
                        width=width,
                        height=height,
                        cfg_scale=guidance_scale,
                        sample_steps=num_inference_steps,
                        seed=seed if seed is not None else -1,
                        vae_tiling=width > 512 or height > 512,
                    )
                class _SDCppResultSDXL:
                    def __init__(self, images):
                        self.images = images
                result = _SDCppResultSDXL(output)

            elif backend in ("sd_cpp_zimage", "sd_cpp_flux2klein"):
                # Z-Image Turbo / FLUX.2 Klein — DiT models via sd.cpp, no negative prompt or img2img
                if init_image is not None:
                    logger.warning(f"{backend} does not support img2img — init_image ignored")
                gen_kwargs = dict(
                    prompt=prompt,
                    negative_prompt="",
                    width=width,
                    height=height,
                    cfg_scale=guidance_scale,
                    sample_steps=num_inference_steps,
                    seed=seed if seed is not None else -1,
                    vae_tiling=width > 512 or height > 512,
                )
                output = self.pipeline.generate_image(**gen_kwargs)
                class _SDCppResultDiT:
                    def __init__(self, images):
                        self.images = images
                result = _SDCppResultDiT(output)

            elif backend in ("sd_cpp_sd3", "sd_cpp_wan"):
                # SD 3.5 / Wan GGUF — text-to-image only, uses same sd.cpp interface
                if init_image is not None:
                    logger.warning(f"{backend} does not support img2img — init_image ignored")
                neg = negative_prompt if (negative_prompt and self.model_info.get("supports_negative_prompt")) else ""
                gen_kwargs = dict(
                    prompt=prompt,
                    negative_prompt=neg,
                    width=width,
                    height=height,
                    cfg_scale=guidance_scale,
                    sample_steps=num_inference_steps,
                    seed=seed if seed is not None else -1,
                    vae_tiling=True,
                )
                # SD3.5 flow models use a separate 'guidance' param (distilled guidance scale)
                if backend == "sd_cpp_sd3":
                    import inspect as _insp
                    gen_params = _insp.signature(self.pipeline.generate_image).parameters
                    if "guidance" in gen_params:
                        gen_kwargs["guidance"] = guidance_scale
                output = self.pipeline.generate_image(**gen_kwargs)
                class _SDCppResultSD3:
                    def __init__(self, images):
                        self.images = images
                result = _SDCppResultSD3(output)

            else:
                print(f"[IMAGE-DEBUG] Unknown backend: {backend}", flush=True)
                logger.error(f"Unknown backend: {backend}")
                return None

            gen_elapsed = time.time() - gen_start
            gen_elapsed_ms = gen_elapsed * 1000
            logger.info(f"Generation took {gen_elapsed:.1f}s ({num_inference_steps} steps, {width}x{height})")

            # Record metrics — capture resources while model is still loaded
            snap_cpu, snap_ram = 0.0, 0.0
            try:
                import psutil, os as _os
                proc = psutil.Process(_os.getpid())
                snap_cpu = proc.cpu_percent(interval=None)
                snap_ram = round(proc.memory_info().rss / (1024 * 1024), 2)
            except Exception:
                pass
            try:
                from metrics_service import get_metrics_collector
                get_metrics_collector().record_image_generation(
                    model_name=self.model_key or "unknown",
                    backend=backend,
                    width=width,
                    height=height,
                    steps=num_inference_steps,
                    total_time_ms=gen_elapsed_ms,
                    cpu_percent=snap_cpu,
                    ram_usage_mb=snap_ram,
                )
            except Exception as me:
                logger.debug(f"Metrics recording skipped: {me}")

            image = result.images[0]

            # Sanitize NaN/inf values from INT8 quantization artifacts
            if isinstance(image, np.ndarray):
                if np.any(~np.isfinite(image)):
                    logger.warning("NaN/inf pixels detected in output — sanitizing")
                    image = np.nan_to_num(image, nan=0.0, posinf=1.0, neginf=0.0)
                image = np.clip(image, 0.0, 1.0)
                image = Image.fromarray((image * 255).round().astype(np.uint8))

            buffer = BytesIO()
            image.save(buffer, format='PNG')
            image_bytes = buffer.getvalue()

            logger.info(f"Image generated successfully ({len(image_bytes)} bytes)")
            return image_bytes

        except Exception as e:
            import traceback
            tb = traceback.format_exc()
            print(f"[IMAGE-DEBUG] Exception in generate_image: {e}\n{tb}", flush=True)
            logger.error(f"Error generating image: {e}")
            logger.error(tb)
            return None
        finally:
            if _holds_inference_lock:
                self._inference_lock.release()

    def generate_batch_images(self,
                             prompt: str,
                             negative_prompt: str = "multiple people, group, crowd, deformed, distorted, blurry",
                             width: int = 1024,
                             height: int = 512,
                             num_inference_steps: int = None,
                             guidance_scale: float = None,
                             num_images: int = 1) -> List[Dict[str, Any]]:
        """Generate multiple images in batch."""
        try:
            if not self.initialize_pipeline():
                logger.error("Pipeline not initialized")
                return []

            logger.info(f"Generating batch of {num_images} images: {prompt[:50]}...")

            results = []
            for i in range(num_images):
                import random
                seed = random.randint(0, 2**32 - 1)
                image_bytes = self.generate_image(
                    prompt=prompt,
                    negative_prompt=negative_prompt,
                    width=width,
                    height=height,
                    num_inference_steps=num_inference_steps,
                    guidance_scale=guidance_scale,
                    seed=seed
                )
                if image_bytes is not None:
                    results.append({'image_data': image_bytes, 'seed': seed})
                    logger.info(f"Generated image {i+1}/{num_images} with seed {seed}")
                else:
                    logger.error(f"Failed to generate image {i+1}/{num_images}")

            logger.info(f"Batch generation completed: {len(results)}/{num_images} images generated")
            return results

        except Exception as e:
            logger.error(f"Error generating batch images: {e}")
            return []

    def _run_lama_inference(self, image_data: bytes, mask_data: bytes) -> Optional[bytes]:
        """Run LaMa inpainting directly via TorchScript JIT model (blocking)"""
        import torch

        if not self._load_lama_model():
            return None

        try:
            # Decode inputs
            image = Image.open(BytesIO(image_data)).convert("RGB")
            mask = Image.open(BytesIO(mask_data)).convert("L")

            # Resize mask to match image if needed
            if mask.size != image.size:
                mask = mask.resize(image.size, Image.NEAREST)

            orig_w, orig_h = image.size

            # Convert to numpy float32 [0,1]
            img_np = np.array(image).astype(np.float32) / 255.0
            mask_np = np.array(mask).astype(np.float32) / 255.0

            # Pad to multiple of 8 (required by LaMa architecture)
            h, w = img_np.shape[:2]
            pad_h = (8 - h % 8) % 8
            pad_w = (8 - w % 8) % 8
            if pad_h or pad_w:
                img_np = np.pad(img_np, ((0, pad_h), (0, pad_w), (0, 0)), mode="reflect")
                mask_np = np.pad(mask_np, ((0, pad_h), (0, pad_w)), mode="reflect")

            # To tensors: [1, C, H, W]
            img_t = torch.from_numpy(img_np).permute(2, 0, 1).unsqueeze(0).to(self.lama_device)
            mask_t = torch.from_numpy(mask_np).unsqueeze(0).unsqueeze(0).to(self.lama_device)

            # Inference
            with torch.inference_mode():
                output = self.lama_model(img_t, mask_t)

            # Convert back to image bytes
            result = output[0].permute(1, 2, 0).cpu().numpy()
            result = np.clip(result[:orig_h, :orig_w] * 255, 0, 255).astype(np.uint8)
            result_img = Image.fromarray(result)

            buf = BytesIO()
            result_img.save(buf, format="PNG")
            logger.info("Inpainting completed successfully")
            return buf.getvalue()

        except Exception as e:
            logger.error(f"LaMa inference error: {e}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
            return None

    def inpaint_image(self,
                      image_data: bytes,
                      mask_data: bytes,
                      seed: Optional[int] = None) -> Optional[bytes]:
        """Remove objects from image using LaMa model (direct inference)"""
        try:
            logger.info("=== STARTING INPAINT_IMAGE ===")
            logger.info(f"Image data size: {len(image_data)} bytes")
            logger.info(f"Mask data size: {len(mask_data)} bytes")

            if seed is not None and seed >= 0:
                import torch
                torch.manual_seed(seed)

            return self._run_lama_inference(image_data, mask_data)

        except Exception as e:
            logger.error(f"Error in inpainting: {e}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
            return None

    def unload_pipeline(self):
        """Unload the diffusion pipeline to free memory, but keep the service alive.

        Also cancels any in-progress pipeline load so it doesn't finish
        loading after we've freed memory.
        """
        import gc
        # Signal any in-progress initialize_pipeline() to abort
        self._cancel_load.set()
        freed = False
        # Wait for any in-flight inference to finish before destroying the pipeline
        self._inference_lock.acquire()
        try:
            if self.pipeline:
                try:
                    del self.pipeline
                    self.pipeline = None
                    freed = True
                    logger.info("Diffusion pipeline unloaded to free memory")
                except Exception as e:
                    logger.error(f"Error unloading pipeline: {e}")
            if self.img2img_pipeline:
                try:
                    del self.img2img_pipeline
                    self.img2img_pipeline = None
                    freed = True
                except Exception as e:
                    logger.error(f"Error unloading img2img pipeline: {e}")
        finally:
            self._inference_lock.release()
        self._prompt_cache.clear()
        # Clear the cancel flag so future preloads aren't blocked
        self._cancel_load.clear()
        if freed:
            gc.collect()
        return freed

    def cleanup(self):
        """Cleanup resources"""
        logger.info("Cleaning up ImageService...")

        if self.pipeline:
            try:
                del self.pipeline
                self.pipeline = None
                logger.info("Pipeline cleaned up")
            except Exception as e:
                logger.error(f"Error cleaning pipeline: {e}")

        if self.img2img_pipeline:
            try:
                del self.img2img_pipeline
                self.img2img_pipeline = None
                logger.info("Img2img pipeline cleaned up")
            except Exception as e:
                logger.error(f"Error cleaning img2img pipeline: {e}")

        if self.lama_model:
            try:
                del self.lama_model
                self.lama_model = None
                logger.info("LaMa model cleaned up")
            except Exception as e:
                logger.error(f"Error cleaning LaMa model: {e}")


# Singleton instance
_image_service_instance: Optional[ImageService] = None

def get_image_service(sdxl_model_path: Optional[str] = None) -> ImageService:
    """Get or create ImageService singleton"""
    global _image_service_instance
    if _image_service_instance is None:
        _image_service_instance = ImageService(sdxl_model_path)
    return _image_service_instance

def reset_image_service(new_model_key: str) -> ImageService:
    """Destroy the current singleton and create a new one with a different model."""
    global _image_service_instance
    if _image_service_instance:
        _image_service_instance.cleanup()
    _image_service_instance = ImageService(model_key=new_model_key)
    return _image_service_instance
