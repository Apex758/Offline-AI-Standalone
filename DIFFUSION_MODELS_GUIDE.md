# Diffusion Model Integration Guide

## Overview

This guide covers:
1. [Models Downloaded & Folder Structure](#1-models-downloaded--folder-structure)
2. [System Constraints to Know](#2-system-constraints-to-know)
3. [Part A — VS Code Testing Changes](#3-part-a--vs-code-testing-changes)
4. [Part B — Production App: Diffusion Model Selector](#4-part-b--production-app-diffusion-model-selector)

---

## 1. Models Downloaded & Folder Structure

```
models/image_generation/
├── sdxl-turbo-openvino/     ← EXISTING (OpenVINO, used now)
├── lama/                    ← EXISTING (IOPaint inpainting)
│
├── sdxl-lightning/          ← NEW: SDXL Lightning 4-step
│   ├── sdxl_lightning_4step_unet.safetensors  (~6.6 GB)
│   └── sdxl-base/           ← base tokenizers, VAE, scheduler
│
├── sdxl-lcm/                ← NEW: LCM-LoRA adapter (~197 MB)
│   └── pytorch_lora_weights.safetensors
│
├── flux-schnell/            ← NEW: FLUX.1 Schnell (~23 GB bf16)
│   ├── transformer/
│   ├── text_encoder/
│   ├── text_encoder_2/
│   ├── tokenizer/
│   ├── tokenizer_2/
│   ├── vae/
│   └── scheduler/
│
├── sd35-medium/             ← NEW: SD 3.5 Medium (~12 GB, GATED)
│   └── ... (see gated model note below)
│
├── sana-1600m/              ← NEW: SANA 1600M BF16 (~6 GB)
│   └── ...
│
└── download_models.py       ← Re-run any download if needed
```

### Re-running Downloads

```powershell
# From project root, using embedded Python
backend\python-embed\python.exe models\image_generation\download_models.py sdxl-lightning
backend\python-embed\python.exe models\image_generation\download_models.py sdxl-lcm
backend\python-embed\python.exe models\image_generation\download_models.py flux-schnell
backend\python-embed\python.exe models\image_generation\download_models.py sana-1600m
backend\python-embed\python.exe models\image_generation\download_models.py sd35-medium
```

### SD 3.5 Medium — Gated Model (Requires HF Login)

SD 3.5 Medium requires agreeing to Stability AI's license:
1. Visit `https://huggingface.co/stabilityai/stable-diffusion-3.5-medium` and click **Agree**
2. Generate a token at `https://huggingface.co/settings/tokens`
3. Run: `backend\python-embed\python.exe -c "from huggingface_hub import login; login()"`
4. Paste your token, then re-run: `download_models.py sd35-medium`

---

## 2. System Constraints to Know

| Constraint | Detail |
|---|---|
| **No GPU** | PyTorch 2.9.1+cpu — all inference runs on CPU |
| **Diffusers 0.27.2** | SD3.5/SANA need newer versions. FLUX uses OpenVINO — no upgrade needed. |
| **RAM** | Large models require 16–32 GB RAM for CPU inference |
| **Speed** | SDXL Lightning: ~2-5 min/image · FLUX: 30-90 min/image (CPU) |

### Diffusers Upgrade Required for SD 3.5 / SANA

> **FLUX.1 Schnell** uses the `OpenVINO/FLUX.1-schnell-int4-ov` model via `optimum.intel` — **no upgrade needed**.

Before testing SD 3.5 or SANA, upgrade diffusers in the embedded Python:

```powershell
backend\python-embed\python.exe -m pip install "diffusers>=0.32.0" --upgrade
```

> **Risk:** Upgrading diffusers *may* break the existing OpenVINO SDXL-Turbo pipeline.
> Test SDXL-Turbo after upgrading to confirm.
> If it breaks, pin back: `pip install "diffusers==0.27.2"`

---

## 3. Part A — VS Code Testing Changes

Make these changes to test each new model in VS Code **without rebuilding the Electron app**.

### Step 1 — Add Image Model Config to `backend/config.py`

Add this block **at the end** of `backend/config.py`:

```python
# ============================================================================
# IMAGE GENERATION MODEL CONFIGURATION
# ============================================================================

IMAGE_MODEL_CONFIG_FILE = PROJECT_ROOT / "models" / "image_generation" / ".image-model-config.json"

# Default image model to use
DEFAULT_IMAGE_MODEL = "sdxl-turbo-openvino"

# Registry of all supported diffusion models
IMAGE_MODEL_REGISTRY = {
    "sdxl-turbo-openvino": {
        "folder":      "sdxl-turbo-openvino",
        "backend":     "openvino",
        "description": "SDXL-Turbo (OpenVINO) — fast 1-2 steps, ~4 GB",
        "steps":       2,
        "guidance":    0.0,
        "min_diffusers": "0.27.0",
    },
    "sdxl-lightning": {
        "folder":      "sdxl-lightning",
        "backend":     "diffusers_lightning",
        "description": "SDXL Lightning 4-step — good quality, ~6.6 GB UNet",
        "steps":       4,
        "guidance":    0.0,
        "min_diffusers": "0.27.0",
    },
    "sdxl-lcm": {
        "folder":      "sdxl-lcm",
        "backend":     "diffusers_lcm",
        "description": "SDXL + LCM-LoRA — 4-8 steps, needs base SDXL",
        "steps":       4,
        "guidance":    1.0,
        "min_diffusers": "0.27.0",
    },
    "flux-schnell": {
        "folder":      "flux-schnell",
        "backend":     "openvino_flux",
        "description": "FLUX.1 Schnell INT4 (OpenVINO) — high quality, CPU-optimised",
        "steps":       4,
        "guidance":    0.0,
        "min_diffusers": "0.27.0",  # uses optimum.intel, not diffusers FluxPipeline
    },
    "sd35-medium": {
        "folder":      "sd35-medium",
        "backend":     "diffusers_sd3",
        "description": "SD 3.5 Medium — balanced quality/speed, ~12 GB",
        "steps":       28,
        "guidance":    4.5,
        "min_diffusers": "0.31.0",
    },
    "sana-1600m": {
        "folder":      "sana-1600m",
        "backend":     "diffusers_sana",
        "description": "SANA 1600M — efficient, ~6 GB",
        "steps":       20,
        "guidance":    5.0,
        "min_diffusers": "0.32.0",
    },
}

def get_selected_image_model() -> str:
    """Get currently selected image model from config file."""
    if IMAGE_MODEL_CONFIG_FILE.exists():
        try:
            import json
            with open(IMAGE_MODEL_CONFIG_FILE, 'r') as f:
                config = json.load(f)
                return config.get('selectedImageModel', DEFAULT_IMAGE_MODEL)
        except Exception:
            pass
    return DEFAULT_IMAGE_MODEL

def set_selected_image_model(model_key: str) -> bool:
    """Save selected image model to config file."""
    try:
        import json
        IMAGE_MODEL_CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(IMAGE_MODEL_CONFIG_FILE, 'w') as f:
            json.dump({'selectedImageModel': model_key}, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving image model config: {e}", flush=True)
        return False

def get_image_model_path(model_key: str = None) -> Path:
    """Resolve the local folder path for the given model key."""
    if model_key is None:
        model_key = get_selected_image_model()
    info = IMAGE_MODEL_REGISTRY.get(model_key)
    if not info:
        raise ValueError(f"Unknown image model key: {model_key}")
    return PROJECT_ROOT / "models" / "image_generation" / info["folder"]
```

---

### Step 2 — Replace `backend/image_service.py`

Replace the entire `image_service.py` with the multi-model version below.
The key change: `ImageService` now accepts a `model_key` parameter and dispatches to the right pipeline loader.

```python
# backend/image_service.py  (MULTI-MODEL VERSION)
import os, sys, subprocess, logging, requests, time, atexit
from pathlib import Path
from typing import Optional, Dict, Any, List
import base64
from io import BytesIO
from PIL import Image

logger = logging.getLogger(__name__)

# ── path helpers (unchanged) ──────────────────────────────────────────────────
def get_resource_path(relative_path: str) -> Path:
    if hasattr(sys, '_MEIPASS'):
        base_path = Path(sys._MEIPASS)
    elif os.environ.get('ELECTRON_RESOURCE_PATH'):
        base_path = Path(os.environ['ELECTRON_RESOURCE_PATH'])
    else:
        base_path = Path(__file__).parent
    return base_path / relative_path

def get_app_data_path(subfolder: str = "") -> Path:
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
    """Load existing SDXL-Turbo via OpenVINO (unchanged behaviour)."""
    from optimum.intel.openvino import OVStableDiffusionXLPipeline
    return OVStableDiffusionXLPipeline.from_pretrained(str(model_path), compile=True)


def _load_sdxl_lightning(model_path: Path):
    """Load SDXL Lightning 4-step pipeline."""
    import torch
    from diffusers import StableDiffusionXLPipeline, EulerDiscreteScheduler, UNet2DConditionModel
    from safetensors.torch import load_file

    base_path   = model_path / "sdxl-base"
    unet_ckpt   = model_path / "sdxl_lightning_4step_unet.safetensors"

    # Load scheduler config from base, but use Euler (required for lightning)
    scheduler = EulerDiscreteScheduler.from_pretrained(
        str(base_path), subfolder="scheduler", timestep_spacing="trailing"
    )
    pipe = StableDiffusionXLPipeline.from_pretrained(
        str(base_path),
        scheduler=scheduler,
        torch_dtype=torch.float32,
    )
    # Swap in Lightning UNet weights
    pipe.unet.load_state_dict(load_file(str(unet_ckpt)), strict=False)
    pipe.to("cpu")
    return pipe


def _load_sdxl_lcm(model_path: Path):
    """Load base SDXL + LCM-LoRA adapter."""
    import torch
    from diffusers import StableDiffusionXLPipeline, LCMScheduler

    # LCM-LoRA needs the base SDXL model — reuse sdxl-lightning/sdxl-base if present
    base_candidates = [
        model_path.parent / "sdxl-lightning" / "sdxl-base",
        model_path.parent / "sdxl-turbo-openvino",   # fallback, might not work
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
    """Load FLUX.1 Schnell INT4 via OpenVINO (same library as SDXL-Turbo)."""
    from optimum.intel.openvino import OVFluxPipeline
    pipe = OVFluxPipeline.from_pretrained(str(model_path), compile=True)
    return pipe


def _load_sd35_medium(model_path: Path):
    """Load SD 3.5 Medium pipeline (requires diffusers >= 0.31)."""
    import torch
    from diffusers import StableDiffusion3Pipeline   # needs diffusers >= 0.31
    pipe = StableDiffusion3Pipeline.from_pretrained(
        str(model_path),
        torch_dtype=torch.bfloat16,
    )
    pipe.to("cpu")
    return pipe


def _load_sana(model_path: Path):
    """Load SANA 1600M pipeline (requires diffusers >= 0.32)."""
    import torch
    from diffusers import SanaPipeline              # needs diffusers >= 0.32
    pipe = SanaPipeline.from_pretrained(
        str(model_path),
        torch_dtype=torch.bfloat16,
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


# ── ImageService ──────────────────────────────────────────────────────────────

class ImageService:
    """Manages image generation (multi-model) and inpainting (IOPaint)."""

    def __init__(self,
                 model_key: Optional[str] = None,
                 iopaint_port: int = 8080):
        from config import (
            get_selected_image_model, IMAGE_MODEL_REGISTRY, get_image_model_path
        )

        if model_key is None:
            model_key = get_selected_image_model()

        self.model_key   = model_key
        self.model_info  = IMAGE_MODEL_REGISTRY.get(model_key, {})
        self.model_path  = get_image_model_path(model_key)
        self.iopaint_port = iopaint_port
        self.iopaint_process: Optional[subprocess.Popen] = None
        self.pipeline = None

        self.iopaint_cache_dir = get_app_data_path("iopaint")
        self._setup_iopaint_cache()
        atexit.register(self.cleanup)

        logger.info(f"ImageService init: model_key={model_key}, path={self.model_path}")

    # ── IOPaint helpers (unchanged) ──────────────────────────────────────────

    def _setup_iopaint_cache(self):
        torch_hub_dir = self.iopaint_cache_dir.parent / "hub" / "checkpoints"
        torch_hub_dir.mkdir(parents=True, exist_ok=True)
        lama_cache = torch_hub_dir / "big-lama.pt"
        if not lama_cache.exists():
            bundled = get_resource_path("../models/image_generation/lama/big-lama.pt")
            if bundled.exists():
                import shutil
                shutil.copy2(bundled, lama_cache)

    def _find_iopaint_executable(self) -> Optional[str]:
        return sys.executable if os.path.exists(sys.executable) else None

    def is_iopaint_running(self) -> bool:
        try:
            r = requests.get(
                f"http://127.0.0.1:{self.iopaint_port}/api/v1/server-config", timeout=2
            )
            return r.status_code == 200
        except requests.RequestException:
            return False

    def start_iopaint(self) -> bool:
        if self.is_iopaint_running():
            return True
        try:
            python_exe = self._find_iopaint_executable()
            if not python_exe:
                return False
            env = os.environ.copy()
            env['TORCH_HOME'] = str(self.iopaint_cache_dir.parent)
            cmd = [python_exe, "-m", "iopaint", "start",
                   "--model=lama", "--device=cpu",
                   f"--port={self.iopaint_port}", "--host=127.0.0.1"]
            startupinfo, flags = None, 0
            if os.name == 'nt':
                startupinfo = subprocess.STARTUPINFO()
                startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
                startupinfo.wShowWindow = subprocess.SW_HIDE
                flags = subprocess.CREATE_NO_WINDOW
            self.iopaint_process = subprocess.Popen(
                cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                startupinfo=startupinfo, creationflags=flags, env=env
            )
            for _ in range(30):
                time.sleep(1)
                if self.is_iopaint_running():
                    return True
            return False
        except Exception as e:
            logger.error(f"Error starting IOPaint: {e}")
            return False

    # ── Pipeline loading ─────────────────────────────────────────────────────

    def initialize_pipeline(self) -> bool:
        if self.pipeline is not None:
            return True
        if not self.model_path.exists():
            logger.error(f"Model folder not found: {self.model_path}")
            return False
        backend = self.model_info.get("backend", "openvino")
        loader  = _LOADERS.get(backend)
        if loader is None:
            logger.error(f"No loader for backend: {backend}")
            return False
        try:
            logger.info(f"Loading {self.model_key} via backend={backend}...")
            self.pipeline = loader(self.model_path)
            logger.info("Pipeline loaded successfully.")
            return True
        except Exception as e:
            logger.error(f"Failed to load pipeline: {e}")
            return False

    # Keep old name as alias so existing code doesn't break
    def initialize_sdxl(self) -> bool:
        return self.initialize_pipeline()

    # ── Image generation ─────────────────────────────────────────────────────

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

        if not self.initialize_pipeline():
            return None

        # Use model defaults if caller didn't specify
        if num_inference_steps is None:
            num_inference_steps = self.model_info.get("steps", 2)
        if guidance_scale is None:
            guidance_scale = self.model_info.get("guidance", 0.0)

        import torch
        generator = torch.manual_seed(seed) if seed is not None else None

        backend = self.model_info.get("backend", "openvino")

        try:
            if backend == "openvino":
                # OpenVINO pipeline (original code path)
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
                image = result.images[0]

            elif backend in ("diffusers_lightning", "diffusers_lcm"):
                result = self.pipeline(
                    prompt=prompt, negative_prompt=negative_prompt,
                    num_inference_steps=num_inference_steps,
                    guidance_scale=guidance_scale,
                    width=width, height=height,
                    generator=generator,
                )
                image = result.images[0]

            elif backend == "openvino_flux":
                # FLUX INT4 OpenVINO — no negative_prompt support
                result = self.pipeline(
                    prompt=prompt,
                    num_inference_steps=num_inference_steps,
                    guidance_scale=guidance_scale,
                    height=height, width=width,
                )
                image = result.images[0]

            elif backend == "diffusers_sd3":
                result = self.pipeline(
                    prompt=prompt, negative_prompt=negative_prompt,
                    num_inference_steps=num_inference_steps,
                    guidance_scale=guidance_scale,
                    width=width, height=height,
                    generator=generator,
                )
                image = result.images[0]

            elif backend == "diffusers_sana":
                result = self.pipeline(
                    prompt=prompt, negative_prompt=negative_prompt,
                    num_inference_steps=num_inference_steps,
                    guidance_scale=guidance_scale,
                    height=height, width=width,
                    generator=generator,
                )
                image = result.images[0]

            else:
                logger.error(f"Unknown backend: {backend}")
                return None

            buf = BytesIO()
            image.save(buf, format='PNG')
            return buf.getvalue()

        except Exception as e:
            logger.error(f"Error generating image: {e}")
            return None

    # ── Inpainting (unchanged) ────────────────────────────────────────────────

    def inpaint_image(self, image_data: bytes, mask_data: bytes,
                      seed: Optional[int] = None) -> Optional[bytes]:
        if not self.is_iopaint_running():
            if not self.start_iopaint():
                return None
        image_b64 = base64.b64encode(image_data).decode()
        mask_b64  = base64.b64encode(mask_data).decode()
        payload = {
            "image": f"data:image/png;base64,{image_b64}",
            "mask":  f"data:image/png;base64,{mask_b64}",
            "ldmSteps": 25, "ldmSampler": "plms",
            "hdStrategy": "Original", "seed": seed if seed else -1,
        }
        try:
            r = requests.post(
                f"http://127.0.0.1:{self.iopaint_port}/api/v1/inpaint",
                json=payload, timeout=60
            )
            return r.content if r.status_code == 200 else None
        except Exception as e:
            logger.error(f"Inpainting error: {e}")
            return None

    def generate_batch_images(self, prompt, negative_prompt="", width=1024,
                               height=512, num_inference_steps=None,
                               guidance_scale=None, num_images=1):
        import random
        results = []
        for i in range(num_images):
            seed = random.randint(0, 2**32 - 1)
            img  = self.generate_image(prompt, negative_prompt, width, height,
                                       num_inference_steps, guidance_scale, seed)
            if img:
                results.append({"image_data": img, "seed": seed})
        return results

    def cleanup(self):
        if self.pipeline:
            try:
                del self.pipeline
                self.pipeline = None
            except Exception:
                pass
        if self.iopaint_process:
            try:
                self.iopaint_process.terminate()
                self.iopaint_process.wait(timeout=5)
            except Exception:
                try:
                    self.iopaint_process.kill()
                except Exception:
                    pass
            finally:
                self.iopaint_process = None


# ── Singleton ─────────────────────────────────────────────────────────────────
_image_service_instance: Optional[ImageService] = None

def get_image_service(model_key: Optional[str] = None,
                      iopaint_port: int = 8080) -> ImageService:
    global _image_service_instance
    if _image_service_instance is None:
        _image_service_instance = ImageService(model_key, iopaint_port)
    return _image_service_instance

def reset_image_service(new_model_key: str, iopaint_port: int = 8080) -> ImageService:
    """Destroy the current singleton and create a new one with a different model."""
    global _image_service_instance
    if _image_service_instance:
        _image_service_instance.cleanup()
    _image_service_instance = ImageService(new_model_key, iopaint_port)
    return _image_service_instance
```

---

### Step 3 — Add Two API Endpoints to `backend/main.py`

Add these two routes alongside the existing `/api/models` endpoints (around line 1900):

```python
# ── Image model listing and selection ─────────────────────────────────────────

@app.get("/api/image-models")
async def list_image_models():
    """List all registered diffusion models and which one is active."""
    from config import IMAGE_MODEL_REGISTRY, get_selected_image_model, get_image_model_path
    current = get_selected_image_model()
    models  = []
    for key, info in IMAGE_MODEL_REGISTRY.items():
        folder_path = get_image_model_path(key)
        models.append({
            "key":         key,
            "description": info["description"],
            "backend":     info["backend"],
            "steps":       info["steps"],
            "is_active":   key == current,
            "available":   folder_path.exists(),
            "path":        str(folder_path),
        })
    return JSONResponse(content={"success": True, "models": models, "current": current})


@app.post("/api/image-models/select")
async def select_image_model(request: Request):
    """Switch to a different diffusion model (takes effect immediately)."""
    from config import set_selected_image_model, IMAGE_MODEL_REGISTRY
    from image_service import reset_image_service
    data      = await request.json()
    model_key = data.get("modelKey", "")
    if model_key not in IMAGE_MODEL_REGISTRY:
        return JSONResponse(status_code=400,
                            content={"error": f"Unknown model key: {model_key}"})
    set_selected_image_model(model_key)
    try:
        reset_image_service(model_key)
        return JSONResponse(content={"success": True, "selectedModel": model_key})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
```

---

### Step 4 — Quick VS Code Test Script

Create `backend/test_diffusion_model.py` and run it to test a specific model without starting the full server:

```python
# backend/test_diffusion_model.py
# Usage: python test_diffusion_model.py sdxl-lightning
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
os.environ['MODELS_DIR'] = str(__import__('pathlib').Path(__file__).parent.parent / 'models')

model_key = sys.argv[1] if len(sys.argv) > 1 else "sdxl-lightning"
print(f"Testing model: {model_key}")

from image_service import ImageService

svc = ImageService(model_key=model_key)
img = svc.generate_image(
    prompt="A colorful cartoon parrot on a tropical tree, educational illustration",
    width=512, height=512,
)

if img:
    out = f"test_output_{model_key.replace('-','_')}.png"
    with open(out, 'wb') as f:
        f.write(img)
    print(f"Success! Image saved to {out}")
else:
    print("FAILED — check logs above for errors")
```

Run from VS Code terminal:
```powershell
cd backend
..\backend\python-embed\python.exe test_diffusion_model.py sdxl-lightning
..\backend\python-embed\python.exe test_diffusion_model.py sdxl-lcm
..\backend\python-embed\python.exe test_diffusion_model.py flux-schnell   # after diffusers upgrade
..\backend\python-embed\python.exe test_diffusion_model.py sana-1600m     # after diffusers upgrade
```

---

## 4. Part B — Production App: Diffusion Model Selector

These changes add a **"Diffusion Model"** selector card to Settings, mirroring the existing LLM model selector.

### Step 5 — Add to `frontend/src/components/Settings.tsx`

**5a. Add new state variables** (after line 36, inside the `Settings` component):

```tsx
// --- Diffusion model state ---
const [availableImageModels, setAvailableImageModels] = useState<ImageModelInfo[]>([]);
const [loadingImageModels, setLoadingImageModels]     = useState(false);
const [selectedImageModel, setSelectedImageModel]     = useState('');
const [isSelectingImageModel, setIsSelectingImageModel] = useState(false);
const [imageModelMessage, setImageModelMessage]       = useState('');
```

**5b. Add the `ImageModelInfo` interface** (alongside the existing `ModelInfo` interface, around line 20):

```tsx
interface ImageModelInfo {
  key:         string;
  description: string;
  backend:     string;
  steps:       number;
  is_active:   boolean;
  available:   boolean;
}
```

**5c. Add fetch + select functions** (alongside `fetchAvailableModels`):

```tsx
const fetchAvailableImageModels = async () => {
  setLoadingImageModels(true);
  try {
    const response = await axios.get('http://localhost:8000/api/image-models');
    if (response.data.success) {
      setAvailableImageModels(response.data.models);
      const active = response.data.models.find((m: ImageModelInfo) => m.is_active);
      if (active) setSelectedImageModel(active.key);
    }
  } catch (error) {
    console.error('Failed to fetch image models:', error);
  } finally {
    setLoadingImageModels(false);
  }
};

const handleImageModelSelect = async (modelKey: string) => {
  if (modelKey === selectedImageModel) return;
  setIsSelectingImageModel(true);
  setImageModelMessage('');
  try {
    const response = await fetch('http://localhost:8000/api/image-models/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelKey }),
    });
    if (response.ok) {
      setSelectedImageModel(modelKey);
      setImageModelMessage(`✅ Switched to ${modelKey}. The new model will load on next image generation.`);
    } else {
      const err = await response.json();
      setImageModelMessage(`❌ Error: ${err.error || 'Failed to switch model'}`);
    }
  } catch {
    setImageModelMessage('❌ Error: Failed to communicate with backend');
  } finally {
    setIsSelectingImageModel(false);
  }
};
```

**5d. Call fetch on mount** — add inside the existing `useEffect` that calls `fetchAvailableModels()`:

```tsx
useEffect(() => {
  fetchAvailableModels();
  fetchAvailableImageModels();   // ← add this line
}, []);
```

**5e. Add the Diffusion Model Card** in the JSX, right after the existing `{/* Model Selection Section */}` card (around line 417):

```tsx
{/* Diffusion Model Selection Section */}
<Card className="mb-6">
  <CardHeader>
    <CardTitle>Diffusion Model (Image Generation)</CardTitle>
    <CardDescription>
      Select which AI model generates images in Image Studio and Worksheet Generator
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      <div className="flex gap-2">
        <select
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
          value={selectedImageModel}
          onChange={(e) => handleImageModelSelect(e.target.value)}
          disabled={isSelectingImageModel || loadingImageModels || availableImageModels.length === 0}
        >
          {loadingImageModels ? (
            <option>Loading models...</option>
          ) : availableImageModels.length === 0 ? (
            <option>No models found</option>
          ) : (
            availableImageModels.map((m) => (
              <option key={m.key} value={m.key} disabled={!m.available}>
                {m.description}{!m.available ? ' — not downloaded' : ''}
              </option>
            ))
          )}
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAvailableImageModels}
          disabled={loadingImageModels}
          className="px-3"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loadingImageModels ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {imageModelMessage && (
        <div className={`mt-2 p-3 rounded-lg text-sm ${
          imageModelMessage.startsWith('✅')
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {imageModelMessage}
        </div>
      )}

      <p className="text-xs text-gray-500">
        ⚠ SD 3.5 and SANA require <code>diffusers&nbsp;0.31+</code>.
        SDXL Lightning, LCM, and FLUX INT4 OV all work with current packages.
      </p>
    </div>
  </CardContent>
</Card>
```

---

## Summary Checklist

### For VS Code Testing (Dev)
- [ ] Add image model config block to `backend/config.py`
- [ ] Replace `backend/image_service.py` with multi-model version
- [ ] Create `backend/test_diffusion_model.py`
- [ ] Run `test_diffusion_model.py sdxl-lightning` to verify
- [ ] Upgrade diffusers if testing FLUX/SD3.5/SANA: `pip install "diffusers>=0.32"`

### For Production Build
- [ ] All of the above, plus:
- [ ] Add 2 new API routes to `backend/main.py`
- [ ] Update `frontend/src/components/Settings.tsx` (Steps 5a–5e)
- [ ] Rebuild: `npm run build` in frontend, then package Electron

### Model Compatibility Quick Reference

| Model | Diffusers | Steps | CPU Speed | VRAM (GPU) |
|---|---|---|---|---|
| SDXL-Turbo OpenVINO | 0.27+ (current) | 1–2 | ~30 sec | — (OpenVINO) |
| SDXL Lightning 4-step | 0.27+ (current) | 4 | ~3–8 min | 8 GB |
| LCM-LoRA SDXL | 0.27+ (current) | 4–8 | ~3–8 min | 8 GB |
| FLUX.1 Schnell INT4 OV | 0.27+ (current) | 4 | ~5–15 min | — (OpenVINO) |
| SD 3.5 Medium | **0.31+** | 20–28 | 20–60 min | 8 GB |
| SANA 1600M | **0.32+** | 20 | 15–45 min | 6 GB |

> **Note:** All CPU times are rough estimates on a mid-range CPU with 16 GB RAM.
> Actual times depend on resolution and prompt complexity.
