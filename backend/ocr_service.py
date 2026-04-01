"""
HunyuanOCR Service — 4-bit quantized OCR for worksheet/quiz grading.

First run: downloads from HuggingFace, quantizes to 4-bit NF4, saves to models/hunyuan-ocr-4bit/.
Subsequent runs: loads the pre-quantized model directly from disk (~500MB, fast load).
"""

import logging
import threading
import io
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

logger = logging.getLogger(__name__)

# Singleton state
_ocr_model = None
_ocr_processor = None
_ocr_lock = threading.Lock()
_ocr_loaded = False
_ocr_loading = False
_ocr_executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="ocr")

# Model ID on HuggingFace
HUNYUAN_OCR_MODEL_ID = "tencent/HunyuanOCR"

# Local folder name inside models/
LOCAL_OCR_FOLDER = "hunyuan-ocr-4bit"


def _get_local_ocr_path() -> Path:
    """Get the local path where the quantized OCR model is saved."""
    from config import MODELS_DIR
    return MODELS_DIR / LOCAL_OCR_FOLDER


def _is_locally_saved() -> bool:
    """Check if the quantized model has already been saved locally."""
    local_path = _get_local_ocr_path()
    # Check for key files that indicate a complete saved model
    return (
        local_path.exists()
        and (local_path / "config.json").exists()
        and (local_path / "tokenizer_config.json").exists()
    )


def is_ocr_available() -> bool:
    """Check if HunyuanOCR dependencies are installed."""
    try:
        import torch
        import transformers
        # bitsandbytes only required for GPU (4-bit quantization); CPU path skips it
        if torch.cuda.is_available():
            import bitsandbytes
        return True
    except ImportError:
        return False


def is_ocr_loaded() -> bool:
    """Check if the OCR model is currently loaded in memory."""
    return _ocr_loaded


def is_ocr_loading() -> bool:
    """Check if the OCR model is currently being loaded."""
    return _ocr_loading


def _load_model():
    """Load HunyuanOCR.

    - GPU available: 4-bit NF4 quantization via bitsandbytes (~500MB VRAM).
    - CPU only: 4-bit int4 quantization via optimum-quanto (~500MB RAM).
    - If a pre-saved copy exists in models/hunyuan-ocr-4bit/, load from there.
    - Otherwise, download from HuggingFace, save locally, then keep in memory.
    """
    global _ocr_model, _ocr_processor, _ocr_loaded, _ocr_loading

    if _ocr_loaded:
        return

    _ocr_loading = True
    try:
        import torch
        from transformers import AutoProcessor, HunYuanVLForConditionalGeneration

        has_cuda = torch.cuda.is_available()
        local_path = _get_local_ocr_path()
        has_local = _is_locally_saved()

        if not has_local:
            raise RuntimeError(
                f"HunyuanOCR model not found at {local_path}. "
                "Run: backend/python-embed/python.exe models/download_hunyuan_ocr.py"
            )

        model_source = str(local_path)
        mode_label = 'GPU 4-bit NF4' if has_cuda else 'CPU 4-bit int4'
        logger.info(f"Loading HunyuanOCR from {local_path} ({mode_label})...")

        # Load processor
        _ocr_processor = AutoProcessor.from_pretrained(
            model_source,
            use_fast=False,
        )

        # GPU: 4-bit NF4 via bitsandbytes
        # CPU: 4-bit int4 via optimum-quanto (QuantoConfig) — quantized in-memory each load
        if has_cuda:
            from transformers import BitsAndBytesConfig
            quant_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_quant_type="nf4",
                bnb_4bit_compute_dtype=torch.float16,
                bnb_4bit_use_double_quant=True,
            )
            _ocr_model = HunYuanVLForConditionalGeneration.from_pretrained(
                model_source,
                quantization_config=quant_config,
                device_map="auto",
                attn_implementation="eager",
            )
        else:
            from transformers import QuantoConfig
            quant_config = QuantoConfig(weights="int4")
            _ocr_model = HunYuanVLForConditionalGeneration.from_pretrained(
                model_source,
                quantization_config=quant_config,
                device_map="cpu",
                attn_implementation="eager",
            )

        _ocr_loaded = True
        logger.info(f"HunyuanOCR loaded successfully ({mode_label})")

    except Exception as e:
        logger.error(f"Failed to load HunyuanOCR: {e}")
        _ocr_model = None
        _ocr_processor = None
        _ocr_loaded = False
        raise
    finally:
        _ocr_loading = False


def load_ocr_model():
    """Thread-safe lazy load of the OCR model."""
    if _ocr_loaded:
        return
    with _ocr_lock:
        if _ocr_loaded:
            return
        _load_model()


def unload_ocr_model():
    """Unload OCR model to free VRAM."""
    global _ocr_model, _ocr_processor, _ocr_loaded

    with _ocr_lock:
        if _ocr_model is not None:
            import torch
            del _ocr_model
            del _ocr_processor
            _ocr_model = None
            _ocr_processor = None
            _ocr_loaded = False
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            logger.info("HunyuanOCR unloaded, VRAM freed")


def _run_ocr(image_bytes: bytes, prompt: str, max_new_tokens: int = 4096) -> str:
    """Run OCR inference synchronously (called in thread pool)."""
    import torch
    from PIL import Image

    load_ocr_model()

    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    messages = [
        {"role": "system", "content": ""},
        {
            "role": "user",
            "content": [
                {"type": "image", "image": "placeholder"},
                {"type": "text", "text": prompt},
            ],
        },
    ]

    text_input = _ocr_processor.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )

    inputs = _ocr_processor(
        text=[text_input],
        images=img,
        padding=True,
        return_tensors="pt",
    )

    device = next(_ocr_model.parameters()).device
    inputs = inputs.to(device)

    with torch.no_grad():
        generated_ids = _ocr_model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            do_sample=False,
        )

    # Trim input tokens from output
    if "input_ids" in inputs:
        input_ids = inputs.input_ids
    else:
        input_ids = inputs.inputs

    generated_ids_trimmed = [
        out_ids[len(in_ids):]
        for in_ids, out_ids in zip(input_ids, generated_ids)
    ]

    output_text = _ocr_processor.batch_decode(
        generated_ids_trimmed,
        skip_special_tokens=True,
        clean_up_tokenization_spaces=False,
    )[0]

    return output_text.strip()


async def extract_text(image_bytes: bytes) -> str:
    """Extract all text from an image."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        _ocr_executor,
        _run_ocr,
        image_bytes,
        "Extract all the text in this image.",
    )


async def extract_text_for_grading(image_bytes: bytes) -> str:
    """Extract text optimized for worksheet/quiz grading.

    Returns structured text with question numbers and student answers.
    """
    prompt = (
        "This is a student's completed worksheet or quiz. "
        "Extract ALL text you can see, preserving the structure: "
        "student name/ID at the top, then each question number followed by "
        "the student's written answer. For multiple choice, extract the letter chosen. "
        "For handwritten answers, transcribe exactly what the student wrote. "
        "If you cannot read something, write [unclear]. "
        "Return the extracted text only, no commentary."
    )
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        _ocr_executor,
        _run_ocr,
        image_bytes,
        prompt,
    )


async def extract_document(image_bytes: bytes) -> str:
    """Parse a document image to markdown."""
    prompt = (
        "Parse all text in this document image using markdown format. "
        "Represent tables in HTML format. Represent formulas in LaTeX format. "
        "Organize by reading order."
    )
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        _ocr_executor,
        _run_ocr,
        image_bytes,
        prompt,
    )


def get_ocr_status() -> dict:
    """Get current OCR service status."""
    local_path = _get_local_ocr_path()
    saved_locally = _is_locally_saved()

    # Calculate local model size if saved
    local_size_mb = 0
    if saved_locally:
        try:
            total_size = sum(
                f.stat().st_size for f in local_path.rglob('*') if f.is_file()
            )
            local_size_mb = round(total_size / (1024 * 1024))
        except Exception:
            pass

    return {
        "available": is_ocr_available(),
        "loaded": is_ocr_loaded(),
        "loading": is_ocr_loading(),
        "model_id": HUNYUAN_OCR_MODEL_ID,
        "quantization": "4-bit NF4",
        "estimated_vram_mb": 500,
        "saved_locally": saved_locally,
        "local_path": str(local_path) if saved_locally else None,
        "local_size_mb": local_size_mb,
    }
