"""
Document auto-detection and perspective correction.

Uses OpenCV to detect document borders in a photo, then applies a
perspective warp to produce a clean, cropped, front-facing image.
Falls back to the original image if no document is detected.
"""

import logging
from typing import Tuple

logger = logging.getLogger(__name__)

try:
    import cv2
    import numpy as np
    _CV2_AVAILABLE = True
except ImportError:
    _CV2_AVAILABLE = False
    logger.warning("opencv-python not available — document auto-crop disabled")


def _order_corners(pts: "np.ndarray") -> "np.ndarray":
    """Order 4 points as: top-left, top-right, bottom-right, bottom-left."""
    rect = np.zeros((4, 2), dtype="float32")
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]   # top-left has smallest sum
    rect[2] = pts[np.argmax(s)]   # bottom-right has largest sum
    d = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(d)]   # top-right has smallest difference
    rect[3] = pts[np.argmax(d)]   # bottom-left has largest difference
    return rect


def _find_document_contour(img: "np.ndarray", min_area_ratio: float = 0.15, max_area_ratio: float = 0.95):
    """
    Detect the largest quadrilateral contour in the image.
    Returns ordered corner points or None if no document found.
    """
    h, w = img.shape[:2]
    image_area = h * w

    # Resize for faster processing (keep aspect ratio)
    max_dim = 1000
    scale = 1.0
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        small = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    else:
        small = img.copy()

    # Convert to grayscale and blur
    gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Try multiple edge detection approaches for robustness
    best_contour = None
    best_area = 0

    for canny_low, canny_high in [(30, 100), (50, 150), (75, 200)]:
        edges = cv2.Canny(blurred, canny_low, canny_high)
        # Dilate to close gaps in edges
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        edges = cv2.dilate(edges, kernel, iterations=2)

        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for contour in sorted(contours, key=cv2.contourArea, reverse=True)[:5]:
            peri = cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, 0.02 * peri, True)

            if len(approx) != 4:
                continue

            area = cv2.contourArea(approx)
            small_area = small.shape[0] * small.shape[1]

            # Check area constraints
            if area < small_area * min_area_ratio:
                continue
            if area > small_area * max_area_ratio:
                continue

            # Check convexity
            if not cv2.isContourConvex(approx):
                continue

            if area > best_area:
                best_area = area
                best_contour = approx

    if best_contour is None:
        return None

    # Scale corners back to original image coordinates
    pts = best_contour.reshape(4, 2).astype("float32")
    if scale != 1.0:
        pts = pts / scale

    return _order_corners(pts)


def _perspective_warp(img: "np.ndarray", corners: "np.ndarray") -> "np.ndarray":
    """Apply perspective transform to get a flat rectangular view."""
    tl, tr, br, bl = corners

    # Calculate output dimensions
    width_top = np.linalg.norm(tr - tl)
    width_bottom = np.linalg.norm(br - bl)
    max_width = int(max(width_top, width_bottom))

    height_left = np.linalg.norm(bl - tl)
    height_right = np.linalg.norm(br - tr)
    max_height = int(max(height_left, height_right))

    # Ensure minimum dimensions
    max_width = max(max_width, 100)
    max_height = max(max_height, 100)

    dst = np.array([
        [0, 0],
        [max_width - 1, 0],
        [max_width - 1, max_height - 1],
        [0, max_height - 1],
    ], dtype="float32")

    M = cv2.getPerspectiveTransform(corners, dst)
    warped = cv2.warpPerspective(img, M, (max_width, max_height))
    return warped


def process_document_image(image_bytes: bytes, jpeg_quality: int = 92) -> Tuple[bytes, bool]:
    """
    Attempt to detect and crop a document from the image.

    Returns:
        (processed_bytes, was_processed) — if no document detected or
        OpenCV unavailable, returns (original_bytes, False).
    """
    if not _CV2_AVAILABLE:
        return image_bytes, False

    try:
        # Decode image
        arr = np.frombuffer(image_bytes, dtype=np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if img is None:
            return image_bytes, False

        # Detect document corners
        corners = _find_document_contour(img)
        if corners is None:
            logger.debug("No document border detected — keeping original")
            return image_bytes, False

        # Apply perspective warp
        warped = _perspective_warp(img, corners)

        # Encode back to JPEG
        ok, encoded = cv2.imencode('.jpg', warped, [cv2.IMWRITE_JPEG_QUALITY, jpeg_quality])
        if not ok:
            return image_bytes, False

        logger.info(f"Document auto-cropped: {img.shape[:2]} → {warped.shape[:2]}")
        return encoded.tobytes(), True

    except Exception as e:
        logger.warning(f"Document processing failed: {e}")
        return image_bytes, False
