"""
Image alignment and perspective correction for scanned worksheets/quizzes.
Uses alignment markers (3 corner squares) to deskew and normalize scans.
"""

import cv2
import numpy as np


def find_alignment_markers(image: np.ndarray,
                           min_area_ratio: float = 0.0001,
                           max_area_ratio: float = 0.001) -> list[dict]:
    """Detect filled square alignment markers in page corners.

    Args:
        image: BGR image (scanned page)
        min_area_ratio: Minimum marker area as fraction of image area
        max_area_ratio: Maximum marker area as fraction of image area

    Returns:
        List of marker dicts with {cx, cy, x, y, w, h, area}
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    img_area = image.shape[0] * image.shape[1]
    min_area = img_area * min_area_ratio
    max_area = img_area * max_area_ratio

    candidates = []
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < min_area or area > max_area:
            continue
        x, y, w, h = cv2.boundingRect(cnt)
        aspect = w / h if h > 0 else 0
        if 0.7 <= aspect <= 1.3:  # roughly square
            candidates.append({
                "cx": x + w // 2,
                "cy": y + h // 2,
                "x": x, "y": y, "w": w, "h": h,
                "area": area
            })

    return candidates


def identify_corners(markers: list[dict], img_shape: tuple) -> dict | None:
    """Identify which markers correspond to top-left, bottom-left, bottom-right.

    Args:
        markers: List of detected marker dicts
        img_shape: (height, width, channels)

    Returns:
        Dict with keys 'top_left', 'bottom_left', 'bottom_right' or None
    """
    if len(markers) < 3:
        return None

    # Sort by different criteria to identify corners
    top_left = min(markers, key=lambda m: m["cx"] + m["cy"])
    bottom_left = min(markers, key=lambda m: m["cx"] - m["cy"] + img_shape[0])
    bottom_right = min(markers, key=lambda m: -m["cx"] - m["cy"])

    # Validate they're actually in different corners
    h, w = img_shape[:2]
    mid_x, mid_y = w // 2, h // 2

    if not (top_left["cx"] < mid_x and top_left["cy"] < mid_y):
        return None
    if not (bottom_left["cx"] < mid_x and bottom_left["cy"] > mid_y):
        return None
    if not (bottom_right["cx"] > mid_x and bottom_right["cy"] > mid_y):
        return None

    return {
        "top_left": top_left,
        "bottom_left": bottom_left,
        "bottom_right": bottom_right
    }


def align_scanned_page(image_bytes: bytes,
                       target_width: int = 595,
                       target_height: int = 842,
                       marker_margin: int = 14) -> tuple[np.ndarray | None, dict]:
    """Detect alignment markers and apply perspective correction.

    Args:
        image_bytes: Raw image bytes
        target_width: Expected page width in points (default: 595 = A4)
        target_height: Expected page height in points (default: 842 = A4)
        marker_margin: Expected distance of marker centers from page edge (default: 14pt ~= 5mm)

    Returns:
        (aligned_image, info_dict) or (None, error_dict)
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return None, {"error": "Failed to decode image"}

    markers = find_alignment_markers(img)
    corners = identify_corners(markers, img.shape)

    if corners is None:
        return img, {"aligned": False, "reason": "markers_not_found",
                     "candidates": len(markers)}

    # Source points (detected marker centers)
    tl = corners["top_left"]
    bl = corners["bottom_left"]
    br = corners["bottom_right"]

    src_pts = np.float32([
        [tl["cx"], tl["cy"]],
        [bl["cx"], bl["cy"]],
        [br["cx"], br["cy"]],
        # Infer top-right from the other three
        [br["cx"], tl["cy"]]
    ])

    # Destination points (expected positions)
    dst_pts = np.float32([
        [marker_margin, marker_margin],
        [marker_margin, target_height - marker_margin],
        [target_width - marker_margin, target_height - marker_margin],
        [target_width - marker_margin, marker_margin]
    ])

    M = cv2.getPerspectiveTransform(src_pts, dst_pts)
    aligned = cv2.warpPerspective(img, M, (target_width, target_height))

    return aligned, {"aligned": True, "markers_found": 3}


def crop_region(image: np.ndarray, x: float, y: float,
                w: float, h: float, padding: int = 2) -> np.ndarray:
    """Crop a rectangular region from the aligned image.

    Args:
        image: Aligned/corrected image
        x, y, w, h: Region coordinates in points
        padding: Extra pixels around the region

    Returns:
        Cropped image region
    """
    ih, iw = image.shape[:2]
    x1 = max(0, int(x) - padding)
    y1 = max(0, int(y) - padding)
    x2 = min(iw, int(x + w) + padding)
    y2 = min(ih, int(y + h) + padding)
    return image[y1:y2, x1:x2]
