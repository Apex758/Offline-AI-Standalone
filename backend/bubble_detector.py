"""
Pixel-density bubble and checkbox detection for scan-grading.
Detects filled MC bubbles and TF checkboxes without OCR.
"""

import cv2
import numpy as np
from image_alignment import crop_region


def detect_selected_bubble(
    image: np.ndarray,
    regions: list[dict],
    min_fill: float = 0.30,
    min_confidence_gap: float = 0.10
) -> tuple[str | None, float, dict]:
    """Detect which bubble/checkbox has been filled by the student.

    Args:
        image: Aligned page image (grayscale or BGR)
        regions: List of {label, x, y, w, h} dicts for each option
        min_fill: Minimum fill ratio to consider a bubble filled (0.30 = 30%)
        min_confidence_gap: Minimum gap between top and second fill ratios

    Returns:
        (selected_label, confidence, debug_info) or (None, 0.0, ratios)
    """
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image

    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    ratios = {}
    for region in regions:
        roi = crop_region(binary, region["x"], region["y"],
                          region["w"], region["h"], padding=2)
        if roi.size == 0:
            ratios[region["label"]] = 0.0
            continue
        fill_ratio = np.count_nonzero(roi) / roi.size
        ratios[region["label"]] = round(fill_ratio, 4)

    if not ratios:
        return None, 0.0, ratios

    # Sort by fill ratio descending
    sorted_items = sorted(ratios.items(), key=lambda x: x[1], reverse=True)
    top_label, top_fill = sorted_items[0]
    second_fill = sorted_items[1][1] if len(sorted_items) > 1 else 0.0

    if top_fill < min_fill:
        return None, 0.0, ratios

    confidence = top_fill - second_fill
    if confidence < min_confidence_gap:
        return None, confidence, ratios

    return top_label, confidence, ratios


def detect_mc_answer(
    image: np.ndarray,
    bubble_regions: list[dict],
    min_fill: float = 0.30,
    min_confidence_gap: float = 0.10
) -> dict:
    """Detect which MC option a student selected.

    Args:
        image: Aligned page image
        bubble_regions: List of {label, x, y, w, h} for each MC option

    Returns:
        Dict with selected, confidence, ratios, and status
    """
    selected, confidence, ratios = detect_selected_bubble(
        image, bubble_regions, min_fill, min_confidence_gap
    )
    return {
        "selected": selected,
        "confidence": round(confidence, 4),
        "ratios": ratios,
        "status": "detected" if selected else ("ambiguous" if confidence > 0 else "empty")
    }


def detect_tf_answer(
    image: np.ndarray,
    checkbox_regions: list[dict],
    min_fill: float = 0.30,
    min_confidence_gap: float = 0.10
) -> dict:
    """Detect which TF checkbox a student selected.

    Args:
        image: Aligned page image
        checkbox_regions: List of {label, x, y, w, h} for True/False checkboxes

    Returns:
        Dict with selected, confidence, ratios, and status
    """
    selected, confidence, ratios = detect_selected_bubble(
        image, checkbox_regions, min_fill, min_confidence_gap
    )
    return {
        "selected": selected,
        "confidence": round(confidence, 4),
        "ratios": ratios,
        "status": "detected" if selected else ("ambiguous" if confidence > 0 else "empty")
    }


def detect_answers_from_template(
    image: np.ndarray,
    regions: list[dict]
) -> list[dict]:
    """Process all answer regions from a template and detect answers.

    Args:
        image: Aligned page image
        regions: Answer region template (from answer_region_templates table)

    Returns:
        List of detection results, one per question
    """
    results = []
    for region in regions:
        q_idx = region["question_index"]
        q_type = region["type"]

        if q_type == "multiple-choice":
            result = detect_mc_answer(image, region["bubbles"])
            result["question_index"] = q_idx
            result["type"] = q_type
            results.append(result)

        elif q_type == "true-false":
            result = detect_tf_answer(image, region["checkboxes"])
            result["question_index"] = q_idx
            result["type"] = q_type
            results.append(result)

        elif q_type in ("open-answer", "fill-blank"):
            # These need OCR — return the cropped region info for the OCR pipeline
            tb = region["text_box"]
            roi = crop_region(image, tb["x"], tb["y"], tb["w"], tb["h"])
            results.append({
                "question_index": q_idx,
                "type": q_type,
                "selected": None,
                "status": "needs_ocr",
                "crop_region": {"x": tb["x"], "y": tb["y"],
                                "w": tb["w"], "h": tb["h"]},
                "cropped_image": roi
            })

    return results
