import os
import sys
import subprocess
import logging
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
        data_dir = Path(app_data) / 'OECS Learning Hub' / 'cache'
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
    """Load SDXL-Turbo via OpenVINO with optional Tiny Autoencoder and INT8 UNet."""
    from optimum.intel.openvino import OVStableDiffusionXLPipeline
    import openvino as ov

    # INT8 quantized models produce NaN on GPU — force CPU for reliability
    pipe = OVStableDiffusionXLPipeline.from_pretrained(
        str(model_path), compile=False, device="CPU",
        ov_config={"CACHE_DIR": ""},
    )

    core = ov.Core()

    # Use INT8 quantized UNet if available
    int8_unet_path = model_path / "optimized_unet" / "openvino_model.xml"
    if int8_unet_path.exists():
        logger.info("Loading INT8 quantized UNet for faster inference...")
        pipe.unet.model = core.read_model(str(int8_unet_path))
        pipe.unet.request = None
        logger.info("INT8 UNet loaded.")

    # NOTE: LoRA loading is not supported by OVStableDiffusionXLPipeline (OpenVINO IR).
    # LoRAs must be fused into model weights before OpenVINO conversion, or use
    # openvino_genai.Text2ImagePipeline which supports runtime LoRA adapters.

    pipe.compile()
    return pipe


def _load_openvino_img2img(model_path: Path):
    """Load SDXL-Turbo Image-to-Image pipeline via OpenVINO."""
    from optimum.intel.openvino import OVStableDiffusionXLImg2ImgPipeline
    import openvino as ov

    # INT8 quantized models produce NaN on GPU — force CPU for reliability (same as txt2img)
    pipe = OVStableDiffusionXLImg2ImgPipeline.from_pretrained(
        str(model_path), compile=False, device="CPU",
        ov_config={"CACHE_DIR": ""},
    )

    core = ov.Core()

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


def _load_flux_schnell_ov(model_path: Path):
    """Load FLUX.1 Schnell INT4 via OpenVINO.

    Uses OVDiffusionPipeline with a reshape skip to work around a shape
    inference bug in optimum-intel's dynamic reshape for FLUX transformers.
    """
    from optimum.intel.openvino import modeling_diffusion, OVDiffusionPipeline
    # Skip the automatic reshape in __init__ which fails on FLUX models
    _orig_reshape = modeling_diffusion.OVDiffusionPipeline.reshape
    modeling_diffusion.OVDiffusionPipeline.reshape = lambda self, *a, **kw: None
    try:
        pipe = OVDiffusionPipeline.from_pretrained(str(model_path), compile=True)
    finally:
        modeling_diffusion.OVDiffusionPipeline.reshape = _orig_reshape
    return pipe


def _load_flux_schnell_gguf(model_path: Path, gguf_file: str = None):
    """Load FLUX.1 Schnell GGUF via stable-diffusion-cpp-python (CPU)."""
    from stable_diffusion_cpp import StableDiffusion

    if gguf_file is None:
        gguf_file = "flux1-schnell-Q4_K_M.gguf"

    diffusion_path = str(model_path / gguf_file)
    clip_l_path    = str(model_path / "clip_l.safetensors")
    t5xxl_path     = str(model_path / "t5-v1_1-xxl-encoder-Q8_0.gguf")
    vae_path       = str(model_path / "ae.safetensors")

    for fpath, label in [(diffusion_path, "diffusion model"),
                         (clip_l_path, "CLIP-L"),
                         (t5xxl_path, "T5-XXL"),
                         (vae_path, "VAE")]:
        if not Path(fpath).exists():
            raise FileNotFoundError(f"FLUX GGUF {label} not found: {fpath}")

    logger.info(f"Loading FLUX GGUF: {gguf_file}")
    logger.info(f"  CLIP-L: clip_l.safetensors")
    logger.info(f"  T5-XXL: t5-v1_1-xxl-encoder-Q8_0.gguf")
    logger.info(f"  VAE:    ae.safetensors")

    sd = StableDiffusion(
        diffusion_model_path=diffusion_path,
        clip_l_path=clip_l_path,
        t5xxl_path=t5xxl_path,
        vae_path=vae_path,
        vae_decode_only=True,
    )
    return sd


# Map backend key → loader function
_LOADERS = {
    "openvino":            _load_openvino,
    "openvino_flux":       _load_flux_schnell_ov,
    "sd_cpp_flux":         _load_flux_schnell_gguf,
}


class ImageService:
    """Manages image generation (multi-model) and inpainting (IOPaint)"""

    def __init__(self,
                 sdxl_model_path: Optional[str] = None,
                 iopaint_port: int = 8080,
                 model_key: Optional[str] = None):
        """
        Initialize ImageService with automatic path resolution.
        Supports multi-model backends via model_key or legacy sdxl_model_path.
        """
        self.iopaint_port = iopaint_port
        self.iopaint_process: Optional[subprocess.Popen] = None
        self.pipeline = None
        self.img2img_pipeline = None  # Separate img2img pipeline for OpenVINO
        self.model_info = {}
        self.model_key = None


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
                self.model_key = "sdxl-turbo-openvino"
                self.model_info = IMAGE_MODEL_REGISTRY.get(self.model_key, {})
        except ImportError:
            # Fallback if config not available
            if sdxl_model_path:
                self.model_path = Path(sdxl_model_path)
            else:
                self.model_path = get_resource_path("../models/image_generation/sdxl-turbo-openvino")
            self.model_key = "sdxl-turbo-openvino"
            self.model_info = {"backend": "openvino", "steps": 2, "guidance": 0.0}

        # Setup IOPaint cache directory
        self.iopaint_cache_dir = get_app_data_path("iopaint")
        self._setup_iopaint_cache()

        # Register cleanup on exit
        atexit.register(self.cleanup)

        logger.info(f"ImageService initialized")
        logger.info(f"  Model: {self.model_key}, path: {self.model_path}")
        logger.info(f"  Backend: {self.model_info.get('backend', 'unknown')}")
        logger.info(f"  IOPaint cache: {self.iopaint_cache_dir}")

    # Backward compatibility alias
    @property
    def sdxl_pipeline(self):
        return self.pipeline

    @property
    def sdxl_model_path(self):
        return self.model_path

    def _setup_iopaint_cache(self):
        """Setup IOPaint model cache in app data folder"""
        torch_hub_dir = self.iopaint_cache_dir.parent / "hub" / "checkpoints"
        torch_hub_dir.mkdir(parents=True, exist_ok=True)
        lama_cache_file = torch_hub_dir / "big-lama.pt"

        if not lama_cache_file.exists():
            logger.info("Setting up IOPaint cache...")
            bundled_lama = get_resource_path("../models/image_generation/lama/big-lama.pt")
            if bundled_lama.exists():
                logger.info(f"Copying LaMa model to torch hub cache: {bundled_lama} -> {lama_cache_file}")
                try:
                    import shutil
                    shutil.copy2(bundled_lama, lama_cache_file)
                    logger.info("LaMa model cached successfully")
                except Exception as e:
                    logger.error(f"Failed to cache LaMa model: {e}")
            else:
                logger.warning(f"Bundled LaMa model not found at: {bundled_lama}")
                logger.info("IOPaint will download on first use")
        else:
            logger.info(f"IOPaint cache already exists: {lama_cache_file}")

    def initialize_pipeline(self) -> bool:
        """Initialize the image generation pipeline (lazy loading)."""
        if self.pipeline is not None:
            return True

        if not self.model_path.exists():
            logger.error(f"Model folder not found: {self.model_path}")
            return False

        backend = self.model_info.get("backend", "openvino")
        loader = _LOADERS.get(backend)
        if loader is None:
            logger.error(f"No loader for backend: {backend}")
            return False

        try:
            logger.info(f"Loading {self.model_key} via backend={backend} from {self.model_path}...")
            if backend == "sd_cpp_flux":
                self.pipeline = loader(self.model_path, gguf_file=self.model_info.get("gguf_file"))
            else:
                self.pipeline = loader(self.model_path)
            logger.info("Pipeline loaded successfully.")
            return True
        except Exception as e:
            logger.error(f"Failed to initialize pipeline ({self.model_key}): {e}")
            return False

    def initialize_sdxl(self) -> bool:
        """Backward-compatible alias for initialize_pipeline."""
        return self.initialize_pipeline()

    def start_iopaint(self) -> bool:
        """Start IOPaint server as subprocess"""
        if self.is_iopaint_running():
            logger.info(f"IOPaint already running on port {self.iopaint_port}")
            return True

        try:
            iopaint_cmd = self._find_iopaint_executable()
            if not iopaint_cmd:
                logger.error("IOPaint executable not found")
                return False

            env = os.environ.copy()
            env['TORCH_HOME'] = str(self.iopaint_cache_dir.parent)

            cmd = [
                iopaint_cmd, "-m", "iopaint", "start",
                "--model=lama",
                "--device=cpu",
                f"--port={self.iopaint_port}",
                "--host=127.0.0.1"
            ]

            logger.info(f"Starting IOPaint: {' '.join(cmd)}")

            startupinfo = None
            creation_flags = 0
            if os.name == 'nt':
                startupinfo = subprocess.STARTUPINFO()
                startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
                startupinfo.wShowWindow = subprocess.SW_HIDE
                creation_flags = subprocess.CREATE_NO_WINDOW

            self.iopaint_process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                startupinfo=startupinfo,
                creationflags=creation_flags,
                env=env
            )

            for i in range(30):
                time.sleep(1)
                if self.is_iopaint_running():
                    logger.info(f"IOPaint started successfully on port {self.iopaint_port}")
                    return True

            logger.error("IOPaint failed to start within 30 seconds")
            if self.iopaint_process:
                try:
                    stdout, stderr = self.iopaint_process.communicate(timeout=5)
                    logger.error(f"IOPaint stdout: {stdout.decode('utf-8', errors='ignore') if stdout else 'None'}")
                    logger.error(f"IOPaint stderr: {stderr.decode('utf-8', errors='ignore') if stderr else 'None'}")
                except Exception as e:
                    logger.error(f"Error reading IOPaint output: {e}")
            return False

        except Exception as e:
            logger.error(f"Error starting IOPaint: {e}")
            return False

    def _find_iopaint_executable(self) -> Optional[str]:
        """Find Python executable to run iopaint as module"""
        logger.info(f"sys.prefix: {sys.prefix}")
        logger.info(f"sys.executable: {sys.executable}")
        python_exe = sys.executable
        if os.path.exists(python_exe):
            logger.info(f"Will use Python module: {python_exe} -m iopaint")
            return python_exe
        logger.error("Python executable not found")
        return None

    def _command_exists(self, command: str) -> bool:
        """Check if command exists in PATH"""
        try:
            subprocess.run([command, '--version'],
                         capture_output=True,
                         timeout=5,
                         creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0)
            return True
        except (subprocess.SubprocessError, FileNotFoundError):
            return False

    def is_iopaint_running(self) -> bool:
        """Check if IOPaint server is responding"""
        try:
            response = requests.get(
                f"http://127.0.0.1:{self.iopaint_port}/api/v1/server-config",
                timeout=2
            )
            return response.status_code == 200
        except requests.RequestException:
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
        try:
            if not self.initialize_pipeline():
                logger.error("Pipeline not initialized")
                return None

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

            # Auto-inject LoRA negative trigger words (e.g. "wrong" for wrong_lora)
            extra_neg = _get_negative_trigger_words()
            if extra_neg and extra_neg not in negative_prompt:
                negative_prompt = f"{negative_prompt}, {extra_neg}"

            # SDXL-Turbo anatomy fix: inject negative prompt and prompt tweaks
            if self.model_key and self.model_key.startswith("sdxl-turbo"):
                anatomy_neg = "deformed fingers, extra fingers, fused fingers, bad hands, malformed hands, bad eyes, crossed eyes, deformed face, extra limbs, mutated hands, poorly drawn hands, poorly drawn face, disfigured, ugly"
                if anatomy_neg not in negative_prompt:
                    negative_prompt = f"{negative_prompt}, {anatomy_neg}"
                # Avoid close-up anatomy issues — nudge toward mid-distance framing
                if "close-up" not in prompt.lower() and "closeup" not in prompt.lower():
                    if "mid-distance" not in prompt.lower() and "wide shot" not in prompt.lower():
                        prompt = f"{prompt}, mid-distance shot, well-proportioned"

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

            if backend in ("openvino",):
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
                if init_image is not None:
                    logger.warning("FLUX Schnell does not support img2img — init_image ignored")
                result = self.pipeline(
                    prompt=prompt,
                    num_inference_steps=num_inference_steps,
                    guidance_scale=guidance_scale,
                    height=height, width=width,
                    output_type="np",
                )

            elif backend == "sd_cpp_flux":
                # FLUX GGUF via stable-diffusion.cpp — no negative_prompt or img2img
                if init_image is not None:
                    logger.warning("FLUX GGUF does not support img2img — init_image ignored")
                output = self.pipeline.txt_to_img(
                    prompt=prompt,
                    width=width,
                    height=height,
                    cfg_scale=guidance_scale,
                    sample_steps=num_inference_steps,
                    seed=seed if seed is not None else -1,
                )
                # sd.cpp returns a list of PIL Images; wrap for compatibility
                class _SDCppResult:
                    def __init__(self, images):
                        self.images = images
                result = _SDCppResult(output)

            else:
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
            logger.error(f"Error generating image: {e}")
            return None

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

    def inpaint_image(self,
                     image_data: bytes,
                     mask_data: bytes,
                     seed: Optional[int] = None) -> Optional[bytes]:
        """Remove objects from image using IOPaint (LaMa model)"""
        try:
            logger.info("=== STARTING INPAINT_IMAGE ===")
            logger.info(f"Image data size: {len(image_data)} bytes")
            logger.info(f"Mask data size: {len(mask_data)} bytes")

            if not self.is_iopaint_running():
                logger.info("IOPaint not running, starting it...")
                if not self.start_iopaint():
                    logger.error("Failed to start IOPaint")
                    return None

            image_b64 = base64.b64encode(image_data).decode('utf-8')
            mask_b64 = base64.b64encode(mask_data).decode('utf-8')

            payload = {
                "image": f"data:image/png;base64,{image_b64}",
                "mask": f"data:image/png;base64,{mask_b64}",
                "ldmSteps": 25,
                "ldmSampler": "plms",
                "hdStrategy": "Original",
                "seed": seed if seed else -1
            }

            url = f"http://127.0.0.1:{self.iopaint_port}/api/v1/inpaint"
            logger.info(f"Sending POST request to {url}")
            response = requests.post(url, json=payload, timeout=60)

            logger.info(f"IOPaint response status: {response.status_code}")

            if response.status_code == 200:
                logger.info("Inpainting completed successfully")
                return response.content
            else:
                logger.error(f"IOPaint error: {response.status_code}")
                logger.error(f"Response text: {response.text}")
                return None

        except Exception as e:
            logger.error(f"Error in inpainting: {e}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
            return None

    def cleanup(self):
        """Cleanup resources and stop IOPaint"""
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

        if self.iopaint_process:
            try:
                self.iopaint_process.terminate()
                self.iopaint_process.wait(timeout=5)
                logger.info("IOPaint process terminated")
            except Exception as e:
                logger.error(f"Error stopping IOPaint: {e}")
                try:
                    self.iopaint_process.kill()
                except:
                    pass
            finally:
                self.iopaint_process = None


# Singleton instance
_image_service_instance: Optional[ImageService] = None

def get_image_service(sdxl_model_path: Optional[str] = None,
                     iopaint_port: int = 8080) -> ImageService:
    """Get or create ImageService singleton"""
    global _image_service_instance
    if _image_service_instance is None:
        _image_service_instance = ImageService(sdxl_model_path, iopaint_port)
    return _image_service_instance

def reset_image_service(new_model_key: str, iopaint_port: int = 8080) -> ImageService:
    """Destroy the current singleton and create a new one with a different model."""
    global _image_service_instance
    if _image_service_instance:
        _image_service_instance.cleanup()
    _image_service_instance = ImageService(model_key=new_model_key, iopaint_port=iopaint_port)
    return _image_service_instance
