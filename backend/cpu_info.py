"""
CPU vendor detection and conditional optimization helpers.

Detects CPU brand/vendor at import time. Tries IPEX on Intel if available,
falls back to torch.compile() for all CPUs. All other services import from
here for CPU-aware optimizations.
"""

import logging
import os

from metrics_service import _get_cpu_name

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# CPU detection (runs once at import time)
# ---------------------------------------------------------------------------

CPU_BRAND: str = _get_cpu_name()
_brand_lower = CPU_BRAND.lower()

if "intel" in _brand_lower:
    CPU_VENDOR = "intel"
elif "amd" in _brand_lower:
    CPU_VENDOR = "amd"
elif "apple" in _brand_lower:
    CPU_VENDOR = "apple"
elif "arm" in _brand_lower or "aarch64" in _brand_lower:
    CPU_VENDOR = "arm"
else:
    CPU_VENDOR = "unknown"

IS_INTEL: bool = CPU_VENDOR == "intel"
IS_AMD: bool = CPU_VENDOR == "amd"

# ---------------------------------------------------------------------------
# IPEX (Intel Extension for PyTorch) — optional, Intel-only
# ---------------------------------------------------------------------------

IPEX_AVAILABLE: bool = False
_ipex = None

if IS_INTEL:
    try:
        import intel_extension_for_pytorch as _ipex  # type: ignore
        IPEX_AVAILABLE = True
    except ImportError:
        pass

# ---------------------------------------------------------------------------
# torch.compile availability (PyTorch 2.x+, works on all CPUs)
# ---------------------------------------------------------------------------

TORCH_COMPILE_AVAILABLE: bool = False
try:
    import torch
    if hasattr(torch, "compile"):
        TORCH_COMPILE_AVAILABLE = True
except ImportError:
    pass

logger.info(
    "[cpu_info] CPU: %s | vendor=%s | IPEX=%s | torch.compile=%s",
    CPU_BRAND, CPU_VENDOR, IPEX_AVAILABLE, TORCH_COMPILE_AVAILABLE,
)


def optimize_model(model, dtype=None):
    """Apply the best available optimization to a PyTorch model.

    Priority: IPEX (Intel only) -> torch.compile (all CPUs) -> no-op.
    Safe to call on any CPU — returns the model untouched if nothing applies.
    """
    # Try IPEX first (Intel-only, best gains when available)
    if IPEX_AVAILABLE and _ipex is not None:
        try:
            optimized = (
                _ipex.optimize(model, dtype=dtype)
                if dtype is not None
                else _ipex.optimize(model)
            )
            logger.info("[cpu_info] Applied IPEX optimization")
            return optimized
        except Exception as exc:
            logger.warning("[cpu_info] IPEX optimize failed, trying fallback: %s", exc)

    # torch.compile with inductor requires a C compiler (cl.exe on Windows).
    # Skip it entirely to avoid runtime errors on machines without MSVC.

    return model


# Keep old name as alias for callsites that already use it
ipex_optimize = optimize_model


# ---------------------------------------------------------------------------
# Shared thread-count helper (used by llama_inference + ocr_service)
# ---------------------------------------------------------------------------

def optimal_thread_count() -> int:
    """Return a sensible thread count for CPU inference.

    Uses physical core count (not logical/hyperthreaded) when possible,
    leaving 1 core free for the OS / event-loop.
    """
    try:
        physical = os.cpu_count()
        import psutil
        physical = psutil.cpu_count(logical=False) or physical
    except Exception:
        physical = os.cpu_count() or 4
    return max(2, (physical or 4) - 1)
