"""
OCR Service — PaddleOCR-VL 1.5 (GGUF) for worksheet/quiz grading.

Uses llama-cpp-python with a dedicated lightweight 0.9B vision model.
Model: PaddleOCR-VL-1.5-Q4_K_M.gguf (~286 MB) + mmproj (~570 MB)
Loads instantly via llama.cpp — no transformers, no quantization step.
"""

import logging
import threading
import io
import base64
import asyncio
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

logger = logging.getLogger(__name__)

# Singleton state
_ocr_model = None
_ocr_lock = threading.Lock()
_ocr_loaded = False
_ocr_loading = False
_ocr_executor = ThreadPoolExecutor(max_workers=3, thread_name_prefix="ocr")

def _get_model_path() -> Path:
    from config import MODELS_DIR, get_selected_ocr_model
    selected = get_selected_ocr_model()
    return MODELS_DIR / f"{selected}.gguf"


def _get_mmproj_path() -> Path:
    import re
    from config import MODELS_DIR, get_selected_ocr_model
    selected = get_selected_ocr_model()
    # Strip quant suffix to match mmproj with different quant
    base_name = re.sub(r'-Q\d.*$', '', selected)
    matches = list(MODELS_DIR.glob(f"mmproj-{base_name}*.gguf"))
    if matches:
        return matches[0]
    # Fallback: try exact name
    matches = list(MODELS_DIR.glob(f"mmproj-{selected}*.gguf"))
    if matches:
        return matches[0]
    return MODELS_DIR / f"mmproj-{selected}-Q8_0.gguf"


def is_ocr_model_present() -> bool:
    """Check if the OCR GGUF files exist on disk."""
    return _get_model_path().exists() and _get_mmproj_path().exists()


def is_ocr_available() -> bool:
    """Check if OCR dependencies are installed and model files exist."""
    if not is_ocr_model_present():
        return False
    try:
        from llama_cpp import Llama
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
    """Load PaddleOCR-VL via llama-cpp-python with vision projector."""
    global _ocr_model, _ocr_loaded, _ocr_loading

    if _ocr_loaded:
        return

    _ocr_loading = True
    try:
        from llama_cpp import Llama
        from llama_cpp.llama_chat_format import Llava16ChatHandler

        model_path = str(_get_model_path())
        mmproj_path = str(_get_mmproj_path())

        if not _get_model_path().exists():
            raise FileNotFoundError(f"OCR model not found: {model_path}")
        if not _get_mmproj_path().exists():
            raise FileNotFoundError(f"OCR mmproj not found: {mmproj_path}")

        logger.info(f"Loading PaddleOCR-VL from {model_path}...")

        chat_handler = Llava16ChatHandler(clip_model_path=mmproj_path, verbose=False)

        _ocr_model = Llama(
            model_path=model_path,
            chat_handler=chat_handler,
            n_ctx=4096,
            n_threads=4,
            verbose=False,
        )

        _ocr_loaded = True
        logger.info("PaddleOCR-VL loaded successfully (Q4_K_M, ~856 MB total)")

    except Exception as e:
        logger.error(f"Failed to load PaddleOCR-VL: {e}")
        _ocr_model = None
        _ocr_loaded = False
        raise
    finally:
        _ocr_loading = False


def load_ocr_model():
    """Thread-safe lazy load of the OCR model."""
    if _ocr_loaded:
        return
    # Gate: Brain (LLM) must be loaded before OCR can start
    try:
        import inference_factory as _inf_mod
        if _inf_mod._local_instance is None or not _inf_mod._local_instance.is_loaded:
            raise RuntimeError("Brain model must be loaded before OCR can start")
    except ImportError:
        raise RuntimeError("Brain model must be loaded before OCR can start")
    with _ocr_lock:
        if _ocr_loaded:
            return
        _load_model()


def unload_ocr_model():
    """Unload OCR model to free RAM."""
    global _ocr_model, _ocr_loaded

    with _ocr_lock:
        if _ocr_model is not None:
            del _ocr_model
            _ocr_model = None
            _ocr_loaded = False
            logger.info("PaddleOCR-VL unloaded, RAM freed")


def _run_ocr(image_bytes: bytes, prompt: str, max_tokens: int = 4096) -> str:
    """Run OCR inference synchronously (called in thread pool)."""
    load_ocr_model()

    # Convert image to base64 data URI
    img_b64 = base64.b64encode(image_bytes).decode("ascii")
    data_uri = f"data:image/png;base64,{img_b64}"

    messages = [
        {
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": data_uri}},
                {"type": "text", "text": prompt},
            ],
        }
    ]

    response = _ocr_model.create_chat_completion(
        messages=messages,
        max_tokens=max_tokens,
        temperature=0.0,
    )

    return response["choices"][0]["message"]["content"].strip()


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
    model_path = _get_model_path()
    mmproj_path = _get_mmproj_path()
    model_present = is_ocr_model_present()

    size_mb = 0
    if model_present:
        try:
            size_mb = round(
                (model_path.stat().st_size + mmproj_path.stat().st_size) / (1024 * 1024)
            )
        except Exception:
            pass

    from config import get_selected_ocr_model
    selected = get_selected_ocr_model()

    return {
        "available": is_ocr_available(),
        "loaded": is_ocr_loaded(),
        "loading": is_ocr_loading(),
        "model_id": selected,
        "quantization": "GGUF",
        "estimated_ram_mb": size_mb if size_mb else None,
        "model_present": model_present,
        "model_path": str(model_path) if model_present else None,
        "size_mb": size_mb,
    }
