"""
Scan template HTML position extractor.

Parses the data-region attributes embedded in scan template HTML
and converts them to absolute page coordinates for the answer_region_templates table.

This is a FALLBACK path. The preferred path is using slots_json from the frontend
directly in the export-class-pack endpoint.
"""

import json
import re
import logging

logger = logging.getLogger(__name__)

# Must match scanTemplateRenderer.ts constants exactly
PAGE_W = 595       # A4 width in pt
PAGE_H = 842       # A4 height in pt
MARGIN = 56.7      # 1.5cm
HEADER_H_PAGE1 = 90
HEADER_H_SUBSEQUENT = 30
MARKER_SIZE = 14.2
MARKER_MARGIN = 14.2


def extract_regions_from_scan_html(html: str, doc_id: str, doc_type: str) -> dict:
    """Parse scan template HTML and extract absolute-page answer regions.

    Reads data-q, data-type, data-slot-height, and data-region attributes
    from each question slot div. Computes absolute Y positions by tracking
    cumulative slot offsets across pages.

    Returns a dict ready for student_service.save_answer_region_template().
    """
    regions = []

    # Find all page divs
    page_pattern = re.compile(
        r'<div[^>]*class="scan-page"[^>]*data-page="(\d+)"[^>]*>(.*?)</div>\s*(?=<div[^>]*class="scan-page"|</body>)',
        re.DOTALL
    )
    slot_pattern = re.compile(
        r'<div[^>]*class="scan-slot"[^>]*'
        r'data-q="(\d+)"[^>]*'
        r'data-type="([^"]*)"[^>]*'
        r'data-slot-height="([^"]*)"[^>]*'
        r"data-region='([^']*)'",
        re.DOTALL
    )

    for page_match in page_pattern.finditer(html):
        page_num = int(page_match.group(1))
        page_html = page_match.group(2)
        header_h = HEADER_H_PAGE1 if page_num == 1 else HEADER_H_SUBSEQUENT
        running_y = 0.0

        for slot_match in slot_pattern.finditer(page_html):
            q_idx = int(slot_match.group(1))
            q_type = slot_match.group(2)
            slot_h = float(slot_match.group(3))
            region_json_str = slot_match.group(4).replace("&#39;", "'")

            try:
                rel_region = json.loads(region_json_str)
            except json.JSONDecodeError:
                logger.warning(f"Failed to parse region JSON for Q{q_idx}")
                running_y += slot_h
                continue

            abs_y = MARGIN + header_h + running_y
            abs_x = MARGIN

            region_entry = {
                "question_index": q_idx,
                "page": page_num,
            }

            # Classify type for bubble_detector compatibility
            if q_type in ("multiple-choice", "mc"):
                region_entry["type"] = "multiple-choice"
            elif q_type in ("true-false", "true_false", "tf"):
                region_entry["type"] = "true-false"
            elif "fill" in q_type or q_type == "word-bank":
                region_entry["type"] = "fill-blank"
            else:
                region_entry["type"] = "open-answer"

            # Convert relative coords to absolute
            if "bubbles" in rel_region:
                region_entry["bubbles"] = [
                    {
                        "label": b["label"],
                        "x": round(abs_x + b["x"]),
                        "y": round(abs_y + b["y"]),
                        "w": b["w"],
                        "h": b["h"],
                    }
                    for b in rel_region["bubbles"]
                ]
            elif "checkboxes" in rel_region:
                region_entry["checkboxes"] = [
                    {
                        "label": c["label"],
                        "x": round(abs_x + c["x"]),
                        "y": round(abs_y + c["y"]),
                        "w": c["w"],
                        "h": c["h"],
                    }
                    for c in rel_region["checkboxes"]
                ]
            elif "text_box" in rel_region:
                tb = rel_region["text_box"]
                region_entry["text_box"] = {
                    "x": round(abs_x + tb["x"]),
                    "y": round(abs_y + tb["y"]),
                    "w": tb["w"],
                    "h": tb["h"],
                }

            regions.append(region_entry)
            running_y += slot_h

    # Standard alignment markers (matching CSS fixed positions)
    alignment_markers = [
        {"position": "top-left",     "x": MARKER_MARGIN, "y": MARKER_MARGIN,
         "w": MARKER_SIZE, "h": MARKER_SIZE},
        {"position": "bottom-left",  "x": MARKER_MARGIN,
         "y": PAGE_H - MARKER_MARGIN - MARKER_SIZE,
         "w": MARKER_SIZE, "h": MARKER_SIZE},
        {"position": "bottom-right", "x": PAGE_W - MARKER_MARGIN - MARKER_SIZE,
         "y": PAGE_H - MARKER_MARGIN - MARKER_SIZE,
         "w": MARKER_SIZE, "h": MARKER_SIZE},
    ]

    qr_position = {
        "x": PAGE_W - MARGIN - 56,
        "y": MARKER_MARGIN,
        "w": 56,
        "h": 56,
    }

    return {
        "doc_id": doc_id,
        "doc_type": doc_type,
        "page_size": "a4",
        "regions": regions,
        "alignment_markers": alignment_markers,
        "qr_position": qr_position,
    }


def build_template_from_slots_json(slots_json: str, doc_id: str, doc_type: str) -> dict:
    """Build an AnswerRegionTemplate directly from the frontend's slots JSON.

    This is the PREFERRED path -- no HTML parsing needed.
    The slots_json is the serialized ScanSlotMeta[] array from generateScanTemplate().
    """
    slots = json.loads(slots_json)
    regions = []

    for slot in slots:
        q_idx = slot["questionIndex"]
        q_type = slot["type"]
        page_num = slot["pageNumber"]
        slot_top_y = slot["slotTopY"]
        region = slot.get("region", {})

        header_h = HEADER_H_PAGE1 if page_num == 1 else HEADER_H_SUBSEQUENT
        abs_y = MARGIN + header_h + slot_top_y
        abs_x = MARGIN

        region_entry = {
            "question_index": q_idx,
            "page": page_num,
        }

        # Classify
        if q_type in ("multiple-choice", "mc"):
            region_entry["type"] = "multiple-choice"
        elif q_type in ("true-false", "true_false", "tf"):
            region_entry["type"] = "true-false"
        elif "fill" in q_type or q_type == "word-bank":
            region_entry["type"] = "fill-blank"
        else:
            region_entry["type"] = "open-answer"

        if "bubbles" in region:
            region_entry["bubbles"] = [
                {"label": b["label"], "x": round(abs_x + b["x"]),
                 "y": round(abs_y + b["y"]), "w": b["w"], "h": b["h"]}
                for b in region["bubbles"]
            ]
        elif "checkboxes" in region:
            region_entry["checkboxes"] = [
                {"label": c["label"], "x": round(abs_x + c["x"]),
                 "y": round(abs_y + c["y"]), "w": c["w"], "h": c["h"]}
                for c in region["checkboxes"]
            ]
        elif "text_box" in region:
            tb = region["text_box"]
            region_entry["text_box"] = {
                "x": round(abs_x + tb["x"]), "y": round(abs_y + tb["y"]),
                "w": tb["w"], "h": tb["h"],
            }

        regions.append(region_entry)

    alignment_markers = [
        {"position": "top-left",     "x": MARKER_MARGIN, "y": MARKER_MARGIN, "w": MARKER_SIZE, "h": MARKER_SIZE},
        {"position": "bottom-left",  "x": MARKER_MARGIN, "y": PAGE_H - MARKER_MARGIN - MARKER_SIZE, "w": MARKER_SIZE, "h": MARKER_SIZE},
        {"position": "bottom-right", "x": PAGE_W - MARKER_MARGIN - MARKER_SIZE, "y": PAGE_H - MARKER_MARGIN - MARKER_SIZE, "w": MARKER_SIZE, "h": MARKER_SIZE},
    ]
    qr_position = {"x": PAGE_W - MARGIN - 56, "y": MARKER_MARGIN, "w": 56, "h": 56}

    return {
        "doc_id": doc_id,
        "doc_type": doc_type,
        "page_size": "a4",
        "regions": regions,
        "alignment_markers": alignment_markers,
        "qr_position": qr_position,
    }
