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


# ── pipeline loaders ─────────────────────────────────────────────────────────

def _load_openvino(model_path: Path):
    """Load SDXL-Turbo via OpenVINO."""
    from optimum.intel.openvino import OVStableDiffusionXLPipeline
    return OVStableDiffusionXLPipeline.from_pretrained(str(model_path), compile=True)


def _load_sdxl_lightning(model_path: Path):
    """Load SDXL Lightning 4-step pipeline.

    Builds the UNet from config + lightning weights so we don't need
    the full base SDXL UNet checkpoint (~5 GB) on disk.
    """
    import torch
    from diffusers import StableDiffusionXLPipeline, EulerDiscreteScheduler, UNet2DConditionModel
    from safetensors.torch import load_file

    base_path = model_path / "sdxl-base"
    unet_ckpt = model_path / "sdxl_lightning_4step_unet.safetensors"

    scheduler = EulerDiscreteScheduler.from_pretrained(
        str(base_path), subfolder="scheduler", timestep_spacing="trailing"
    )

    # Build UNet from config and load lightning weights directly
    unet = UNet2DConditionModel.from_config(
        str(base_path / "unet" / "config.json")
    )
    unet.load_state_dict(load_file(str(unet_ckpt)), strict=False)

    pipe = StableDiffusionXLPipeline.from_pretrained(
        str(base_path), scheduler=scheduler, unet=unet, torch_dtype=torch.float32,
    )
    pipe.to("cpu")
    return pipe


def _load_sdxl_lcm(model_path: Path):
    """Load base SDXL + LCM-LoRA adapter."""
    import torch
    from diffusers import StableDiffusionXLPipeline, LCMScheduler

    base_candidates = [
        model_path.parent / "sdxl-lightning" / "sdxl-base",
        model_path.parent / "sdxl-turbo-openvino",
    ]
    base_path = next((p for p in base_candidates if p.exists()), None)
    if base_path is None:
        raise RuntimeError(
            "LCM-LoRA requires the SDXL base model. "
            "Download sdxl-lightning first (it includes sdxl-base)."
        )
    pipe = StableDiffusionXLPipeline.from_pretrained(
        str(base_path), torch_dtype=torch.float32
    )
    pipe.scheduler = LCMScheduler.from_config(pipe.scheduler.config)
    pipe.load_lora_weights(str(model_path))
    pipe.fuse_lora()
    pipe.to("cpu")
    return pipe


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


def _load_sd35_medium(model_path: Path):
    """Load SD 3.5 Medium pipeline (requires diffusers >= 0.31)."""
    import torch
    from diffusers import StableDiffusion3Pipeline
    pipe = StableDiffusion3Pipeline.from_pretrained(
        str(model_path), torch_dtype=torch.bfloat16,
    )
    pipe.to("cpu")
    return pipe


def _load_sana(model_path: Path):
    """Load SANA 1600M pipeline (requires diffusers >= 0.32)."""
    import torch
    from diffusers import SanaPipeline
    pipe = SanaPipeline.from_pretrained(
        str(model_path), torch_dtype=torch.bfloat16,
    )
    pipe.to("cpu")
    return pipe


# Map backend key → loader function
_LOADERS = {
    "openvino":            _load_openvino,
    "openvino_flux":       _load_flux_schnell_ov,
    "diffusers_lightning": _load_sdxl_lightning,
    "diffusers_lcm":       _load_sdxl_lcm,
    "diffusers_sd3":       _load_sd35_medium,
    "diffusers_sana":      _load_sana,
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
                    import io
                    init_pil = Image.open(io.BytesIO(init_image)).convert("RGB")
                    result = self.pipeline(
                        prompt=prompt, negative_prompt=negative_prompt,
                        image=init_pil, strength=strength,
                        num_inference_steps=num_inference_steps,
                        guidance_scale=guidance_scale,
                        width=width, height=height,
                    )
                else:
                    result = self.pipeline(
                        prompt=prompt, negative_prompt=negative_prompt,
                        num_inference_steps=num_inference_steps,
                        guidance_scale=guidance_scale,
                        width=width, height=height,
                    )

            elif backend == "openvino_flux":
                # FLUX INT4 OpenVINO — no negative_prompt support
                result = self.pipeline(
                    prompt=prompt,
                    num_inference_steps=num_inference_steps,
                    guidance_scale=guidance_scale,
                    height=height, width=width,
                )

            elif backend in ("diffusers_lightning", "diffusers_lcm"):
                result = self.pipeline(
                    prompt=prompt, negative_prompt=negative_prompt,
                    num_inference_steps=num_inference_steps,
                    guidance_scale=guidance_scale,
                    width=width, height=height,
                    generator=generator,
                )

            elif backend == "diffusers_sd3":
                result = self.pipeline(
                    prompt=prompt, negative_prompt=negative_prompt,
                    num_inference_steps=num_inference_steps,
                    guidance_scale=guidance_scale,
                    width=width, height=height,
                    generator=generator,
                )

            elif backend == "diffusers_sana":
                result = self.pipeline(
                    prompt=prompt, negative_prompt=negative_prompt,
                    num_inference_steps=num_inference_steps,
                    guidance_scale=guidance_scale,
                    height=height, width=width,
                    generator=generator,
                )

            else:
                logger.error(f"Unknown backend: {backend}")
                return None

            gen_elapsed = time.time() - gen_start
            logger.info(f"Generation took {gen_elapsed:.1f}s ({num_inference_steps} steps, {width}x{height})")

            image = result.images[0]

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
