"""
Model Recommender — Hardware-aware model recommendation engine.

Given the user's system specs (RAM, GPU/VRAM, CPU cores), recommends
the best LLM, diffusion model, and OCR model from those available on disk.
Pure functions — no FastAPI imports, no side effects, no I/O.
"""

import re
from typing import Optional

# ---------------------------------------------------------------------------
# Quant metadata
# ---------------------------------------------------------------------------

# Bytes per parameter for each GGUF quant level
QUANT_BYTES_PER_PARAM: dict[str, float] = {
    "Q2_K":   0.31,
    "Q3_K_S": 0.41,
    "Q3_K_M": 0.44,
    "Q3_K_L": 0.47,
    "Q4_0":   0.50,
    "Q4_K_S": 0.54,
    "Q4_K_M": 0.57,
    "Q5_0":   0.63,
    "Q5_K_S": 0.66,
    "Q5_K_M": 0.69,
    "Q6_K":   0.75,
    "Q8_0":   1.00,
    "F16":    2.00,
    "F32":    4.00,
}

# Higher = better quality (used for ranking when param_b is tied)
QUANT_QUALITY_RANK: dict[str, int] = {
    "Q2_K":   1,
    "Q3_K_S": 2, "Q3_K_M": 3, "Q3_K_L": 4,
    "Q4_0":   5, "Q4_K_S": 6, "Q4_K_M": 7,
    "Q5_0":   8, "Q5_K_S": 9, "Q5_K_M": 10,
    "Q6_K":   11,
    "Q8_0":   12,
    "F16":    13,
    "F32":    14,
}

# ---------------------------------------------------------------------------
# Hardware tier definitions
# ---------------------------------------------------------------------------

HARDWARE_TIERS: dict[str, dict] = {
    "low": {
        "min_ram_gb":   4,
        "min_vram_mb":  0,
        "min_cores":    4,
        "label":        "Low-End",
        "desc":         "Suitable for small Q4 models (≤3B params). Text generation only.",
        "cap_tier":     1,
    },
    "mid": {
        "min_ram_gb":   8,
        "min_vram_mb":  0,
        "min_cores":    6,
        "label":        "Mid-Range",
        "desc":         "Suitable for 7B Q4 models and basic CPU image generation.",
        "cap_tier":     2,
    },
    "high": {
        "min_ram_gb":   16,
        "min_vram_mb":  4096,
        "min_cores":    8,
        "label":        "High-End",
        "desc":         "Suitable for 7B Q8 or 13B Q4 models with full image generation.",
        "cap_tier":     3,
    },
    "ultra": {
        "min_ram_gb":   32,
        "min_vram_mb":  8192,
        "min_cores":    12,
        "label":        "Ultra",
        "desc":         "Suitable for 14B+ models and all advanced features.",
        "cap_tier":     3,
    },
}

# Known model families (mirrors llama_inference.MODEL_FAMILIES keys)
_KNOWN_FAMILIES = ["qwen3", "qwen2.5-vl", "qwen2-vl", "qwen2", "phi4-mm", "phi-4", "lfm2", "llava"]

# ---------------------------------------------------------------------------
# GGUF filename parser
# ---------------------------------------------------------------------------

def parse_gguf_metadata(filename: str) -> dict:
    """
    Parse a GGUF filename into structured metadata.

    Returns:
        {
          "param_b": float | None,   # parameter count in billions
          "quant":   str | None,     # quant tag e.g. "Q4_K_M"
          "family":  str,            # model family key or "generic"
          "estimated_ram_gb": float | None,
        }
    """
    name = filename.lower()

    # --- parameter count ---
    param_b: Optional[float] = None
    m = re.search(r'(\d+\.?\d*)\s*b(?=[^a-z]|$)', name)
    if m:
        try:
            param_b = float(m.group(1))
        except ValueError:
            pass

    # --- quant level ---
    quant: Optional[str] = None
    quant_pattern = r'(Q\d+_K_[MSL]|Q\d+_\d|Q\d+_K|Q\d+|F16|F32)'
    qm = re.search(quant_pattern, filename, flags=re.IGNORECASE)
    if qm:
        quant = qm.group(1).upper()

    # --- model family ---
    family = "generic"
    for fk in _KNOWN_FAMILIES:
        if fk in name:
            family = fk
            break

    # --- estimated RAM ---
    estimated_ram_gb: Optional[float] = None
    if param_b is not None:
        bpp = QUANT_BYTES_PER_PARAM.get(quant or "", 0.57)
        raw_gb = (param_b * 1e9 * bpp) / (1024 ** 3)
        estimated_ram_gb = round(raw_gb * 1.2, 1)  # 20% overhead

    return {
        "param_b": param_b,
        "quant": quant,
        "family": family,
        "estimated_ram_gb": estimated_ram_gb,
    }


# ---------------------------------------------------------------------------
# Hardware profile
# ---------------------------------------------------------------------------

def get_hardware_profile(specs: dict) -> dict:
    """
    Map system specs to a hardware tier.

    Args:
        specs: dict from metrics_service._get_system_specs()
                Keys used: ram_total_gb, has_gpu, gpu_vram_total_mb, cpu_count_logical

    Returns:
        {
          "tier": "low" | "mid" | "high" | "ultra",
          "label": str,
          "desc": str,
          "ram_gb": float,
          "vram_mb": int,
          "cpu_cores": int,
          "has_gpu": bool,
          "supported_capability_tier": int,
        }
    """
    ram_gb: float = specs.get("ram_total_gb", 4)
    has_gpu: bool = specs.get("has_gpu", False)
    vram_mb: int = specs.get("gpu_vram_total_mb", 0) if has_gpu else 0
    cpu_cores: int = specs.get("cpu_count_logical", 4)

    # Walk tiers from best to worst, pick the highest that fits
    tier_key = "low"
    for key in ("ultra", "high", "mid", "low"):
        t = HARDWARE_TIERS[key]
        if ram_gb >= t["min_ram_gb"] and vram_mb >= t["min_vram_mb"] and cpu_cores >= t["min_cores"]:
            tier_key = key
            break

    tier_info = HARDWARE_TIERS[tier_key]
    return {
        "tier": tier_key,
        "label": tier_info["label"],
        "desc": tier_info["desc"],
        "ram_gb": ram_gb,
        "vram_mb": vram_mb,
        "cpu_cores": cpu_cores,
        "has_gpu": has_gpu,
        "supported_capability_tier": tier_info["cap_tier"],
    }


# ---------------------------------------------------------------------------
# Recommendation logic
# ---------------------------------------------------------------------------

def _recommend_llm(
    available_llms: list,
    ram_gb: float,
    vram_mb: int,
    has_gpu: bool,
) -> Optional[dict]:
    """
    Pick the best LLM for the given hardware.

    Strategy:
    - Filter: estimated_ram_gb < ram_gb * 0.6
    - Sort: highest param_b first, then highest quant quality
    - GPU bonus: if model's estimated_ram_gb fits in VRAM, flag it
    """
    candidates = []
    for model in available_llms:
        meta = parse_gguf_metadata(model["name"])
        est = meta.get("estimated_ram_gb")
        # If we can't estimate size, fall back to actual file size
        if est is None:
            est = model.get("size_mb", 0) / 1024

        # Must fit comfortably in RAM (60% budget — leaves room for OS + OCR)
        if est > ram_gb * 0.6:
            continue

        fits_in_vram = has_gpu and vram_mb > 0 and est * 1024 <= vram_mb

        candidates.append({
            "name": model["name"],
            "param_b": meta["param_b"] or 0,
            "quant": meta["quant"],
            "quant_rank": QUANT_QUALITY_RANK.get(meta["quant"] or "", 0),
            "estimated_ram_gb": round(est, 1),
            "fits_in_vram": fits_in_vram,
            "family": meta["family"],
        })

    if not candidates:
        return None

    # Sort: GPU-fit first, then largest params, then best quant
    candidates.sort(key=lambda c: (
        -int(c["fits_in_vram"]),
        -(c["param_b"] or 0),
        -c["quant_rank"],
    ))
    best = candidates[0]

    # Build reason string
    if best["param_b"]:
        size_str = f"{best['param_b']}B {best['quant'] or ''}"
        ram_str = f"~{best['estimated_ram_gb']} GB"
        if best["fits_in_vram"]:
            reason = f"Best GPU-fit for your {vram_mb // 1024} GB VRAM — {size_str} uses {ram_str}"
        else:
            reason = f"Best fit for your {ram_gb:.0f} GB RAM — {size_str} uses {ram_str}, leaves room for OCR and image gen"
    else:
        reason = f"Best available model within your {ram_gb:.0f} GB RAM budget"

    return {
        "name": best["name"],
        "reason": reason,
        "estimated_ram_gb": best["estimated_ram_gb"],
        "param_b": best["param_b"] or None,
        "quant": best["quant"],
        "family": best["family"],
        "fits_in_vram": best["fits_in_vram"],
    }


def _recommend_diffusion(
    available_diffusion: list,
    ram_gb: float,
    vram_mb: int,
    has_gpu: bool,
) -> Optional[dict]:
    """
    Pick the best diffusion model for the given hardware.

    Strategy:
    - Filter: ram_required_gb <= ram_gb - 4 (leave 4 GB for LLM + OS)
    - If GPU: prefer models with vram_required_mb <= vram_mb
    - Otherwise: prefer CPU OpenVINO models, smallest first
    """
    from config import IMAGE_MODEL_REGISTRY

    candidates = []
    for model in available_diffusion:
        reg = IMAGE_MODEL_REGISTRY.get(model["name"], {})
        req_ram = reg.get("ram_required_gb", 6)
        req_vram = reg.get("vram_required_mb", 0)

        if req_ram > ram_gb - 4:
            continue

        gpu_beneficial = has_gpu and req_vram > 0 and req_vram <= vram_mb

        candidates.append({
            "name": model["name"],
            "ram_required_gb": req_ram,
            "vram_required_mb": req_vram,
            "gpu_beneficial": gpu_beneficial,
            "description": reg.get("description", model["name"]),
        })

    if not candidates:
        return None

    # Sort: GPU-beneficial first, then lowest RAM requirement (most accessible)
    candidates.sort(key=lambda c: (
        -int(c["gpu_beneficial"]),
        c["ram_required_gb"],
    ))
    best = candidates[0]

    if best["gpu_beneficial"]:
        reason = f"Best GPU-accelerated image model for your {vram_mb // 1024} GB VRAM"
    elif ram_gb <= 8:
        reason = f"Lightest image model for your {ram_gb:.0f} GB RAM — requires ~{best['ram_required_gb']} GB"
    else:
        reason = f"Best CPU-based image model for your {ram_gb:.0f} GB RAM"

    return {
        "name": best["name"],
        "reason": reason,
        "ram_required_gb": best["ram_required_gb"],
        "description": best["description"],
    }


def _recommend_ocr(
    available_ocr: list,
    ram_gb: float,
) -> Optional[dict]:
    """
    Validate OCR model compatibility. OCR only needs ~856 MB, so it's
    compatible on almost any machine with ≥2 GB RAM.
    """
    if not available_ocr:
        return None

    # Pick the first (usually only) available OCR model
    model = available_ocr[0]
    size_mb = model.get("size_mb", 856)
    size_gb = round(size_mb / 1024, 2)
    compatible = ram_gb >= 2

    if compatible:
        reason = f"Compatible with your hardware — ~{size_mb:.0f} MB, well within your {ram_gb:.0f} GB RAM"
    else:
        reason = f"May not load — requires ~{size_gb} GB but only {ram_gb} GB RAM available"

    return {
        "name": model["name"],
        "reason": reason,
        "size_mb": round(size_mb, 1),
        "compatible": compatible,
    }


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def recommend_models(
    hw_profile: dict,
    available_llms: list,
    available_diffusion: list,
    available_ocr: list,
    specs: dict,
) -> dict:
    """
    Build hardware-aware model recommendations.

    Args:
        hw_profile:         Output of get_hardware_profile()
        available_llms:     Output of scan_models_directory() in main.py
        available_diffusion: Output of scan_diffusion_models()
        available_ocr:      Output of scan_ocr_models()
        specs:              Raw system specs from _get_system_specs()

    Returns a dict with hardware info + per-category recommendations.
    """
    ram_gb: float = hw_profile["ram_gb"]
    vram_mb: int = hw_profile["vram_mb"]
    has_gpu: bool = hw_profile["has_gpu"]

    warnings: list[str] = []

    if not has_gpu:
        warnings.append("No NVIDIA GPU detected — image generation will run on CPU (slower)")
    elif vram_mb < 4096:
        warnings.append(f"GPU VRAM is low ({vram_mb} MB) — larger models may not fully offload to GPU")

    if ram_gb < 8:
        warnings.append(f"Low RAM detected ({ram_gb:.1f} GB) — only small models (≤3B) recommended")

    rec_llm = _recommend_llm(available_llms, ram_gb, vram_mb, has_gpu)
    rec_diffusion = _recommend_diffusion(available_diffusion, ram_gb, vram_mb, has_gpu)
    rec_ocr = _recommend_ocr(available_ocr, ram_gb)

    # Build per-LLM compatibility map for the UI warning system
    llm_compatibility: dict[str, dict] = {}
    for model in available_llms:
        meta = parse_gguf_metadata(model["name"])
        est = meta.get("estimated_ram_gb")
        if est is None:
            est = model.get("size_mb", 0) / 1024
        fits = est <= ram_gb * 0.85  # warn if > 85% of RAM
        comfortable = est <= ram_gb * 0.6
        llm_compatibility[model["name"]] = {
            "estimated_ram_gb": round(est, 1),
            "fits": fits,
            "comfortable": comfortable,
            "param_b": meta["param_b"],
            "quant": meta["quant"],
        }

    return {
        "hardware_tier": hw_profile["tier"],
        "hardware_label": hw_profile["label"],
        "hardware_description": hw_profile["desc"],
        "ram_gb": ram_gb,
        "vram_mb": vram_mb,
        "cpu_cores": hw_profile["cpu_cores"],
        "has_gpu": has_gpu,
        "gpu_name": specs.get("gpu_name"),
        "processor": specs.get("processor"),
        "recommended_llm": rec_llm,
        "recommended_diffusion": rec_diffusion,
        "recommended_ocr": rec_ocr,
        "supported_capability_tier": hw_profile["supported_capability_tier"],
        "llm_compatibility": llm_compatibility,
        "warnings": warnings,
    }
