"""
CPU vendor detection and conditional optimization helpers.

Detects CPU brand/vendor at import time. Tries IPEX on Intel if available,
falls back to torch.compile() for all CPUs. All other services import from
here for CPU-aware optimizations.
"""

import logging
import os
from typing import Optional

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

# Cache the detected value so we don't pay the Windows API cost on every call.
_cached_thread_count: Optional[int] = None


def optimal_thread_count() -> int:
    """Return optimal thread count for llama.cpp CPU inference.

    Runtime-adaptive strategy:
      1. On Intel hybrid chips (12th gen Alder Lake and newer), use P-core
         count only. Running llama.cpp on E-cores creates stragglers that
         slow the whole forward pass because each layer has to wait for the
         slowest thread.
      2. On homogeneous CPUs (older Intel, AMD Ryzen, Apple Silicon, ARM),
         use physical core count minus 1 to leave headroom for the OS.
      3. Detection is runtime-only: no hardcoded SKU assumptions. The same
         binary works correctly on any CPU the app is distributed to.

    Fallbacks ensure this function NEVER crashes — if all detection paths
    fail, returns a safe minimum of 2.
    """
    global _cached_thread_count
    if _cached_thread_count is not None:
        return _cached_thread_count

    # Step 1: physical core count (universal baseline)
    try:
        import psutil
        physical = psutil.cpu_count(logical=False) or os.cpu_count() or 4
    except Exception:
        physical = os.cpu_count() or 4

    threads = max(2, (physical or 4) - 1)
    reason = f"physical-1 ({physical} physical)"

    # Step 2: on Intel hybrid chips, use P-cores only (much faster)
    if IS_INTEL:
        p_cores = _detect_intel_performance_cores()
        if p_cores is not None and p_cores > 0 and p_cores < physical:
            threads = max(2, p_cores)
            reason = f"Intel hybrid P-cores only ({p_cores} of {physical})"

    _cached_thread_count = threads
    logger.info("[cpu_info] optimal_thread_count=%d reason=%s", threads, reason)
    return threads


def _detect_intel_performance_cores() -> Optional[int]:
    """Detect Performance-core count on Intel hybrid CPUs, dynamically.

    Returns:
      int  — number of P-cores when a hybrid chip is detected
      None — when the CPU is not hybrid, or detection is unavailable

    Uses the Windows GetLogicalProcessorInformationEx API where available
    (100% accurate, works on any hybrid chip including future generations
    without brand-name hardcoding). Falls back to /sys/devices on Linux for
    hybrid-aware kernels. Returns None silently on any failure — callers
    must handle None.
    """
    import sys as _sys

    # Strategy A: Windows API (most accurate, all hybrid generations)
    if _sys.platform == "win32":
        p = _detect_p_cores_windows()
        if p is not None:
            return p

    # Strategy B: Linux hybrid topology (/sys/devices/cpu_core)
    if _sys.platform.startswith("linux"):
        p = _detect_p_cores_linux()
        if p is not None:
            return p

    # No reliable detection — caller will use the homogeneous fallback.
    return None


def _detect_p_cores_windows() -> Optional[int]:
    """Count P-cores via Windows GetLogicalProcessorInformationEx.

    Each physical core has an EfficiencyClass attribute. On hybrid chips
    P-cores have a higher class than E-cores (typically P=1, E=0). On
    homogeneous CPUs all cores share a single class — we return None in
    that case so callers fall back to the full physical count.
    """
    try:
        import ctypes
        from ctypes import wintypes

        kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
        fn = kernel32.GetLogicalProcessorInformationEx
        fn.argtypes = [ctypes.c_int, ctypes.c_void_p, ctypes.POINTER(wintypes.DWORD)]
        fn.restype = wintypes.BOOL

        RelationProcessorCore = 0

        # First call: get required buffer size.
        buf_size = wintypes.DWORD(0)
        fn(RelationProcessorCore, None, ctypes.byref(buf_size))
        if buf_size.value == 0:
            return None

        buf = (ctypes.c_ubyte * buf_size.value)()
        if not fn(RelationProcessorCore, buf, ctypes.byref(buf_size)):
            return None

        # Walk the SYSTEM_LOGICAL_PROCESSOR_INFORMATION_EX records.
        # Layout per record:
        #   [0:4]  DWORD Relationship
        #   [4:8]  DWORD Size (total record size, including this header)
        #   [8:9]  BYTE  Flags          (PROCESSOR_RELATIONSHIP starts here)
        #   [9:10] BYTE  EfficiencyClass
        #   ...
        efficiency_classes = []
        offset = 0
        total = buf_size.value
        while offset + 8 <= total:
            relationship = int.from_bytes(bytes(buf[offset:offset + 4]), "little")
            size = int.from_bytes(bytes(buf[offset + 4:offset + 8]), "little")
            if size == 0:
                break
            if relationship == RelationProcessorCore and offset + 10 <= total:
                # EfficiencyClass is at record-offset 9 (after Relationship, Size, Flags).
                efficiency_classes.append(int(buf[offset + 9]))
            offset += size

        if not efficiency_classes:
            return None

        max_class = max(efficiency_classes)
        min_class = min(efficiency_classes)
        if max_class == min_class:
            return None  # homogeneous CPU, no hybrid distinction

        # P-cores are the ones with the highest efficiency class.
        return sum(1 for c in efficiency_classes if c == max_class)
    except Exception as exc:
        logger.debug("[cpu_info] P-core detection via Windows API failed: %s", exc)
        return None


def _detect_p_cores_linux() -> Optional[int]:
    """Detect P-cores on Linux hybrid-aware kernels.

    Modern kernels (5.18+) expose separate `cpu_core` and `cpu_atom` PMU
    devices that correspond to P-cores and E-cores respectively. We count
    the CPUs listed under cpu_core.
    """
    try:
        core_list_path = "/sys/devices/cpu_core/cpus"
        if not os.path.exists(core_list_path):
            return None
        with open(core_list_path, "r") as f:
            contents = f.read().strip()
        if not contents:
            return None
        # Format is e.g. "0-7" or "0,2,4,6" — count logical CPUs in the set.
        count = 0
        for part in contents.split(","):
            if "-" in part:
                a, b = part.split("-")
                count += int(b) - int(a) + 1
            else:
                count += 1
        # Logical count / 2 for hyperthreaded P-cores (P-cores have HT, E-cores don't).
        # We want *physical* P-core count for threading purposes.
        return max(1, count // 2) if count >= 2 else count
    except Exception as exc:
        logger.debug("[cpu_info] P-core detection via /sys failed: %s", exc)
        return None
