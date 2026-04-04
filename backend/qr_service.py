"""
QR code generation, decoding, version hash computation, and answer re-mapping
for the scan-grading pipeline.
"""

import json
import io
import hashlib
import numpy as np
import cv2
import qrcode
from pyzbar.pyzbar import decode as decode_qr


# ── QR Generation ───────────────────────────────────────────────────────────

def generate_page_qr(
    doc_type: str,          # "q" or "w"
    doc_id: str,            # quiz_id or worksheet_id
    student_id: str,        # from students table
    version_hash: str       # "0000" if not randomized
) -> bytes:
    """Generate a QR code PNG as bytes for embedding in DOCX/PDF."""
    payload = json.dumps({
        "t": doc_type,
        "id": doc_id,
        "sid": student_id,
        "v": version_hash
    }, separators=(',', ':'))  # compact JSON

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(payload)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


# ── QR Decoding ─────────────────────────────────────────────────────────────

def extract_qr_from_scan(image_bytes: bytes) -> dict | None:
    """Detect and decode the QR code from a scanned worksheet/quiz image.

    Returns parsed payload dict or None if no QR found.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return None

    # Try original image first
    results = decode_qr(img)

    if not results:
        # Try with preprocessing for better detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        sharp = cv2.filter2D(gray, -1, np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]]))
        results = decode_qr(sharp)

    if not results:
        # Try adaptive threshold
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        results = decode_qr(thresh)

    if not results:
        # Try rotations (90, 180, 270 degrees)
        for angle in [90, 180, 270]:
            h, w = img.shape[:2]
            center = (w // 2, h // 2)
            M = cv2.getRotationMatrix2D(center, angle, 1.0)
            # Compute new bounding dimensions
            cos_a = abs(M[0, 0])
            sin_a = abs(M[0, 1])
            new_w = int(h * sin_a + w * cos_a)
            new_h = int(h * cos_a + w * sin_a)
            M[0, 2] += (new_w - w) / 2
            M[1, 2] += (new_h - h) / 2
            rotated = cv2.warpAffine(img, M, (new_w, new_h))
            results = decode_qr(rotated)
            if results:
                break

    if not results:
        return None

    # Find the QR that matches our payload format
    for r in results:
        try:
            data = json.loads(r.data.decode('utf-8'))
            if 't' in data and 'id' in data and 'sid' in data:
                return {
                    "type": "quiz" if data["t"] == "q" else "worksheet",
                    "doc_id": data["id"],
                    "student_id": data["sid"],
                    "version_hash": data.get("v", "0000"),
                    "qr_bounds": {
                        "x": r.rect.left,
                        "y": r.rect.top,
                        "w": r.rect.width,
                        "h": r.rect.height
                    }
                }
        except (json.JSONDecodeError, UnicodeDecodeError):
            continue

    return None


# ── Version Hash ────────────────────────────────────────────────────────────

def compute_version_hash(student_id: str, question_order: list[int]) -> str:
    """Generate a 4-char hash that uniquely identifies this student's question arrangement."""
    raw = f"{student_id}:{','.join(map(str, question_order))}"
    return hashlib.md5(raw.encode()).hexdigest()[:4]


# ── Answer Re-Mapping ───────────────────────────────────────────────────────

def remap_answers(detected_answers: list[str], question_order: list[int]) -> dict[int, str]:
    """Map answers from randomized printed order back to original question indices.

    Args:
        detected_answers: Answers in the order they appear on the printed page
        question_order: The mapping — question_order[i] = original question index at position i

    Returns:
        Dict mapping original question index -> student's answer
    """
    remapped = {}
    for printed_position, original_index in enumerate(question_order):
        if printed_position < len(detected_answers):
            remapped[original_index] = detected_answers[printed_position]
    return remapped


def remap_mc_option(selected_label: str, option_map: list[int]) -> str:
    """Convert a shuffled MC option back to the original option letter.

    Args:
        selected_label: The letter the student filled (e.g., "C")
        option_map: Shuffle map — option_map[i] = original index of option now at position i
                    e.g., [2, 0, 3, 1] means position A was originally C, etc.

    Returns:
        The original option letter (e.g., "A")
    """
    labels = ['A', 'B', 'C', 'D', 'E']
    try:
        selected_index = labels.index(selected_label.upper())
    except ValueError:
        return selected_label
    if selected_index < len(option_map):
        original_index = option_map[selected_index]
        if original_index < len(labels):
            return labels[original_index]
    return selected_label
