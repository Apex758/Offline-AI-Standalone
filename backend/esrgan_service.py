"""
esrgan_service.py - Real-ESRGAN CPU Image Enhancement
------------------------------------------------------
Pure PyTorch implementation of RRDBNet (the Real-ESRGAN architecture).
No basicsr / realesrgan packages required - uses only torch + Pillow
which are already in requirements.txt.

Tiled inference keeps CPU RAM usage manageable for large images.
"""

import logging
import math
import threading
from io import BytesIO
from pathlib import Path
from typing import Optional, Tuple

import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Torch availability guard
# ---------------------------------------------------------------------------
try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    _TORCH_OK = True
except ImportError:
    _TORCH_OK = False


# ---------------------------------------------------------------------------
# RRDBNet architecture (mirrors basicsr exactly so .pth weights load cleanly)
# ---------------------------------------------------------------------------

if _TORCH_OK:

    def _pixel_unshuffle(x: "torch.Tensor", scale: int) -> "torch.Tensor":
        b, c, h, w = x.shape
        out_h, out_w = h // scale, w // scale
        x = x.view(b, c, out_h, scale, out_w, scale)
        return x.permute(0, 1, 3, 5, 2, 4).contiguous().view(
            b, c * scale * scale, out_h, out_w
        )

    class _ResidualDenseBlock(nn.Module):
        def __init__(self, num_feat: int = 64, num_grow_ch: int = 32):
            super().__init__()
            self.conv1 = nn.Conv2d(num_feat, num_grow_ch, 3, 1, 1)
            self.conv2 = nn.Conv2d(num_feat + num_grow_ch, num_grow_ch, 3, 1, 1)
            self.conv3 = nn.Conv2d(num_feat + 2 * num_grow_ch, num_grow_ch, 3, 1, 1)
            self.conv4 = nn.Conv2d(num_feat + 3 * num_grow_ch, num_grow_ch, 3, 1, 1)
            self.conv5 = nn.Conv2d(num_feat + 4 * num_grow_ch, num_feat, 3, 1, 1)
            self.lrelu = nn.LeakyReLU(negative_slope=0.2, inplace=True)

        def forward(self, x):
            x1 = self.lrelu(self.conv1(x))
            x2 = self.lrelu(self.conv2(torch.cat((x, x1), 1)))
            x3 = self.lrelu(self.conv3(torch.cat((x, x1, x2), 1)))
            x4 = self.lrelu(self.conv4(torch.cat((x, x1, x2, x3), 1)))
            x5 = self.conv5(torch.cat((x, x1, x2, x3, x4), 1))
            return x5 * 0.2 + x

    class _RRDB(nn.Module):
        def __init__(self, num_feat: int, num_grow_ch: int = 32):
            super().__init__()
            self.rdb1 = _ResidualDenseBlock(num_feat, num_grow_ch)
            self.rdb2 = _ResidualDenseBlock(num_feat, num_grow_ch)
            self.rdb3 = _ResidualDenseBlock(num_feat, num_grow_ch)

        def forward(self, x):
            out = self.rdb1(x)
            out = self.rdb2(out)
            out = self.rdb3(out)
            return out * 0.2 + x

    class RRDBNet(nn.Module):
        """
        Residual-in-Residual Dense Block Network used by Real-ESRGAN.
        Matches the official basicsr architecture so pretrained .pth weights
        load without modification.

        x4plus model: scale=4, num_in_ch=3
        x2plus model: scale=2, num_in_ch=3 (pixel-unshuffle handled in forward)
        """
        def __init__(
            self,
            num_in_ch: int = 3,
            num_out_ch: int = 3,
            scale: int = 4,
            num_feat: int = 64,
            num_block: int = 23,
            num_grow_ch: int = 32,
        ):
            super().__init__()
            self.scale = scale
            # For scale=2 the model expects pixel-unshuffled input (3*4=12 ch)
            first_in_ch = num_in_ch * 4 if scale == 2 else num_in_ch
            self.conv_first = nn.Conv2d(first_in_ch, num_feat, 3, 1, 1)
            self.body = nn.Sequential(
                *[_RRDB(num_feat=num_feat, num_grow_ch=num_grow_ch) for _ in range(num_block)]
            )
            self.conv_body = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
            self.conv_up1  = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
            self.conv_up2  = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
            self.conv_hr   = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
            self.conv_last = nn.Conv2d(num_feat, num_out_ch, 3, 1, 1)
            self.lrelu = nn.LeakyReLU(negative_slope=0.2, inplace=True)

        def forward(self, x):
            if self.scale == 2:
                x = _pixel_unshuffle(x, 2)
            feat = self.conv_first(x)
            body_feat = self.conv_body(self.body(feat))
            feat = feat + body_feat
            feat = self.lrelu(
                self.conv_up1(F.interpolate(feat, scale_factor=2, mode="nearest"))
            )
            feat = self.lrelu(
                self.conv_up2(F.interpolate(feat, scale_factor=2, mode="nearest"))
            )
            return self.conv_last(self.lrelu(self.conv_hr(feat)))


# ---------------------------------------------------------------------------
# ESRGANService
# ---------------------------------------------------------------------------

class ESRGANService:
    """
    Manages Real-ESRGAN model loading and CPU-tiled inference.

    Models are lazy-loaded on first use and cached.
    Tiling prevents RAM spikes on large images.
    """

    # Tile size (input pixels). Smaller = less RAM, more overhead.
    # 256 is a safe default for 8 GB machines.
    TILE_SIZE = 256
    TILE_PAD  = 10   # overlap in pixels to eliminate seam artifacts

    def __init__(self, model_dir: Optional[Path] = None):
        self._lock = threading.Lock()
        self._models: dict = {}        # key: scale (2 or 4) -> nn.Module
        self._model_dir = model_dir
        self._device = "cpu"

    # ------------------------------------------------------------------
    # Public interface
    # ------------------------------------------------------------------

    def is_available(self) -> bool:
        """True if torch is importable."""
        return _TORCH_OK

    def is_loaded(self, scale: int) -> bool:
        return scale in self._models

    def model_file_exists(self, scale: int) -> bool:
        path = self._model_path(scale)
        return path is not None and path.exists()

    def load(self, scale: int) -> bool:
        """Lazy-load the ESRGAN model for the requested scale (2 or 4)."""
        if not _TORCH_OK:
            logger.error("torch is not available - cannot load ESRGAN")
            return False
        if scale in self._models:
            return True
        path = self._model_path(scale)
        if path is None or not path.exists():
            logger.error(f"ESRGAN x{scale} model not found at {path}")
            return False
        with self._lock:
            if scale in self._models:
                return True
            try:
                logger.info(f"Loading ESRGAN x{scale} from {path} ...")
                net = RRDBNet(scale=scale)
                weights = torch.load(str(path), map_location="cpu", weights_only=False)
                # Handle different save formats
                if isinstance(weights, dict):
                    state = (
                        weights.get("params_ema")
                        or weights.get("params")
                        or weights.get("state_dict")
                        or weights
                    )
                else:
                    state = weights
                net.load_state_dict(state, strict=True)
                net.eval()
                self._models[scale] = net
                logger.info(f"ESRGAN x{scale} loaded OK")
                return True
            except Exception as exc:
                logger.error(f"Failed to load ESRGAN x{scale}: {exc}")
                return False

    def enhance(self, image_bytes: bytes, scale: int) -> Tuple[bytes, Tuple[int, int], Tuple[int, int]]:
        """
        Upscale image_bytes by `scale` (2 or 4) using tiled inference.

        Returns:
            (png_bytes, (orig_w, orig_h), (out_w, out_h))
        """
        if not _TORCH_OK:
            raise RuntimeError("torch not available")
        if scale not in (2, 4):
            raise ValueError(f"scale must be 2 or 4, got {scale}")

        if not self.load(scale):
            raise RuntimeError(f"ESRGAN x{scale} model could not be loaded")

        pil_img = Image.open(BytesIO(image_bytes)).convert("RGB")
        orig_w, orig_h = pil_img.size
        logger.info(f"ESRGAN enhance: {orig_w}x{orig_h} -> x{scale} ...")

        img_np = np.array(pil_img, dtype=np.float32) / 255.0
        out_np = self._tiled_inference(img_np, scale)
        out_np = np.clip(out_np * 255.0, 0, 255).astype(np.uint8)

        out_img = Image.fromarray(out_np, "RGB")
        out_w, out_h = out_img.size

        buf = BytesIO()
        out_img.save(buf, format="PNG", optimize=False)
        logger.info(f"ESRGAN done: {out_w}x{out_h}")
        return buf.getvalue(), (orig_w, orig_h), (out_w, out_h)

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _model_path(self, scale: int) -> Optional[Path]:
        filename = f"RealESRGAN_x{scale}plus.pth"
        # 1. Explicit directory provided
        if self._model_dir and (self._model_dir / filename).exists():
            return self._model_dir / filename
        # 2. Relative to this file (backend/../models/image_generation/realesrgan/)
        candidate = Path(__file__).parent.parent / "models" / "image_generation" / "realesrgan" / filename
        if candidate.exists():
            return candidate
        # 3. Electron resource path env var
        import os
        res = os.environ.get("ELECTRON_RESOURCE_PATH")
        if res:
            ep = Path(res) / "models" / "image_generation" / "realesrgan" / filename
            if ep.exists():
                return ep
        return candidate  # return expected path even if missing (for error messages)

    def _tiled_inference(self, img_np: np.ndarray, scale: int) -> np.ndarray:
        """
        Run the model in tiles to limit peak RAM.
        Each tile is processed independently then stitched.
        Overlapping pads are used to avoid seam artifacts.
        """
        model = self._models[scale]
        h, w, c = img_np.shape
        tile = self.TILE_SIZE
        pad  = self.TILE_PAD

        # Output array (already scaled)
        out_h, out_w = h * scale, w * scale
        output = np.zeros((out_h, out_w, c), dtype=np.float32)

        # Number of tiles along each axis
        tiles_x = math.ceil(w / tile)
        tiles_y = math.ceil(h / tile)
        total   = tiles_x * tiles_y

        logger.info(f"ESRGAN tiling: {tiles_y}x{tiles_x} tiles ({total} total)")

        with torch.no_grad():
            for ty in range(tiles_y):
                for tx in range(tiles_x):
                    idx = ty * tiles_x + tx
                    if (idx % max(1, total // 5)) == 0:
                        logger.info(f"  tile {idx+1}/{total}")

                    # Input tile bounds (with padding, clamped to image)
                    x0 = max(tx * tile - pad, 0)
                    y0 = max(ty * tile - pad, 0)
                    x1 = min((tx + 1) * tile + pad, w)
                    y1 = min((ty + 1) * tile + pad, h)

                    tile_np = img_np[y0:y1, x0:x1, :]  # (H, W, 3)
                    tile_t = (
                        torch.from_numpy(tile_np)
                        .permute(2, 0, 1)
                        .unsqueeze(0)
                        .float()
                    )

                    out_tile_t = model(tile_t)  # (1, 3, H*scale, W*scale)
                    out_tile_np = (
                        out_tile_t.squeeze(0).permute(1, 2, 0).numpy()
                    )

                    # Destination bounds in output (corresponds to non-padded region)
                    ox0 = tx * tile * scale
                    oy0 = ty * tile * scale
                    ox1 = min((tx + 1) * tile * scale, out_w)
                    oy1 = min((ty + 1) * tile * scale, out_h)

                    # Crop the output tile to match the non-padded region
                    left_pad   = (tx * tile - x0) * scale
                    top_pad    = (ty * tile - y0) * scale
                    crop_w     = ox1 - ox0
                    crop_h     = oy1 - oy0

                    cropped = out_tile_np[
                        top_pad : top_pad + crop_h,
                        left_pad : left_pad + crop_w,
                        :
                    ]
                    output[oy0:oy1, ox0:ox1, :] = cropped

        return output
