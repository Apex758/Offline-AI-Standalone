"""
Feature 7: Static Profile Context.

Reads ONLY allowlisted fields from a teacher's Settings snapshot and builds a
feature-scoped, token-capped block to inject into the system prompt.

Defense-in-depth: every field that crosses this boundary is filtered against
PROFILE_ALLOWLIST. Even if the frontend forwards extra fields, they cannot
reach the model.

Spec:
- Hard cap of 150 tokens on the rendered block.
- Different feature contexts get different slices of the profile.
- Pure function: no DB, no network, no state. Edits to Settings take effect on
  the next inference call with zero migration.
"""

import re
from typing import Dict, List, Optional, Tuple

# Hard cap on the rendered block (Feature 7 spec)
PROFILE_BLOCK_TOKEN_CAP = 150

# THE allowlist. Any path not on this list is dropped at the boundary.
PROFILE_ALLOWLIST = frozenset([
    "profile.displayName",
    "profile.coworkerName",
    "profile.gradeSubjects",
    "profile.filterContentByProfile",
    "language",
    "tutorials.enabledModules",
])

# Feature -> ordered list of allowlist fields to inject. The order controls
# the order they appear in the rendered block.
FEATURE_FIELD_MAP: Dict[str, List[str]] = {
    "chat": [
        "profile.displayName",
        "profile.coworkerName",
        "profile.gradeSubjects",
        "language",
    ],
    "lesson_planner": [
        "profile.displayName",
        "profile.gradeSubjects",
        "profile.filterContentByProfile",
        "language",
    ],
    "kindergarten_planner": [
        "profile.displayName",
        "profile.gradeSubjects",
        "profile.filterContentByProfile",
        "language",
    ],
    "multigrade_planner": [
        "profile.displayName",
        "profile.gradeSubjects",
        "profile.filterContentByProfile",
        "language",
    ],
    "cross_curricular_planner": [
        "profile.displayName",
        "profile.gradeSubjects",
        "profile.filterContentByProfile",
        "language",
    ],
    "curriculum": [
        "profile.gradeSubjects",
        "profile.filterContentByProfile",
        "language",
    ],
    "curriculum_tracker": [
        "profile.gradeSubjects",
        "profile.filterContentByProfile",
        "language",
    ],
    "quiz_generator": ["profile.gradeSubjects", "language"],
    "rubric_generator": ["profile.gradeSubjects", "language"],
    "worksheet_generator": ["profile.gradeSubjects", "language"],
    "grading": ["profile.displayName", "profile.gradeSubjects", "language"],
    "analyse": ["profile.displayName", "profile.gradeSubjects", "language"],
    "insights": ["profile.displayName", "language"],
    "performance_metrics": ["profile.displayName", "language"],
    "image_studio": ["language"],
    "presentation_builder": ["language"],
    "brain_dump": ["language"],
    "support": [],
    "settings": [],
}


def _estimate_tokens(text: str) -> int:
    if not text:
        return 0
    return max(1, int(len(text) / 3.5))


def _get_nested(d: dict, path: str):
    """Walk a dotted path through a nested dict. Returns None if any part missing."""
    if not isinstance(d, dict):
        return None
    node = d
    for part in path.split("."):
        if not isinstance(node, dict) or part not in node:
            return None
        node = node[part]
    return node


def _set_nested(d: dict, path: str, value):
    parts = path.split(".")
    node = d
    for p in parts[:-1]:
        node = node.setdefault(p, {})
    node[parts[-1]] = value


def _sanitize(settings: dict) -> dict:
    """Drop every field not on the allowlist. Run at the boundary."""
    out: dict = {}
    if not isinstance(settings, dict):
        return out
    for path in PROFILE_ALLOWLIST:
        v = _get_nested(settings, path)
        if v is None or v == "" or v == [] or v == {}:
            continue
        _set_nested(out, path, v)
    return out


def _format_grade_subjects(gs: dict, grade_hint: Optional[str] = None) -> str:
    """Format the gradeSubjects map. If grade_hint matches a key, only that
    grade is rendered (keeps the block small for grade-specific tools)."""
    if not isinstance(gs, dict) or not gs:
        return ""
    if grade_hint and grade_hint in gs:
        subjects = gs[grade_hint]
        if isinstance(subjects, list) and subjects:
            return f"Grade {grade_hint}: {', '.join(subjects)}"
    parts = []
    for grade, subjects in gs.items():
        if isinstance(subjects, list) and subjects:
            parts.append(f"Grade {grade}: {', '.join(subjects)}")
    return "; ".join(parts)


def build_block(
    settings: dict,
    feature_context: str = "chat",
    grade_hint: Optional[str] = None,
) -> Tuple[str, int]:
    """Build the [Teacher Profile] block.

    Returns (block_text, token_estimate). Returns ("", 0) when there's nothing
    to inject (empty settings or feature has no fields, e.g. Settings/Support).
    """
    if not settings:
        return "", 0
    sanitized = _sanitize(settings)
    fields = FEATURE_FIELD_MAP.get(feature_context, FEATURE_FIELD_MAP["chat"])
    if not fields:
        return "", 0

    lines: List[str] = []
    for field in fields:
        v = _get_nested(sanitized, field)
        if v is None:
            continue
        if field == "profile.displayName":
            lines.append(f"- Name: {v}")
        elif field == "profile.coworkerName":
            lines.append(f"- Their AI's name: {v}")
        elif field == "profile.gradeSubjects":
            formatted = _format_grade_subjects(v, grade_hint)
            if formatted:
                lines.append(f"- Teaching: {formatted}")
        elif field == "profile.filterContentByProfile":
            if v:
                lines.append("- Strict curriculum scope: keep content within their grade/subject")
        elif field == "language":
            label = {"en": "English", "fr": "French", "es": "Spanish"}.get(v, str(v))
            lines.append(f"- Response language: {label}")
        elif field == "tutorials.enabledModules":
            if isinstance(v, list) and v:
                lines.append(f"- Active features: {', '.join(v[:6])}")

    if not lines:
        return "", 0

    block = "\n\n[Teacher Profile:\n" + "\n".join(lines) + "]"
    tokens = _estimate_tokens(block)

    # Hard cap: truncate if over budget. Reserve room for the "...]" suffix
    # so the final string still respects the token cap.
    if tokens > PROFILE_BLOCK_TOKEN_CAP:
        suffix = "...]"
        char_cap = int(PROFILE_BLOCK_TOKEN_CAP * 3.5) - len(suffix)
        block = block[:char_cap].rstrip() + suffix
        tokens = _estimate_tokens(block)
    return block, tokens


def list_known_facts(settings: dict) -> List[str]:
    """Return facts already covered by the static profile snapshot.

    Used by F6's expanded summary prompt as a 'do not re-extract' list, so the
    LLM doesn't waste tokens re-discovering things F7 already knows.
    """
    sanitized = _sanitize(settings)
    facts: List[str] = []
    name = _get_nested(sanitized, "profile.displayName")
    if name:
        facts.append(f"Teacher's name is {name}")
    gs = _get_nested(sanitized, "profile.gradeSubjects") or {}
    if isinstance(gs, dict):
        for grade, subjects in gs.items():
            if isinstance(subjects, list) and subjects:
                facts.append(f"Teaches Grade {grade}: {', '.join(subjects)}")
    lang = _get_nested(sanitized, "language")
    if lang:
        facts.append(f"Prefers responses in {lang}")
    return facts


_GRADE_PATTERN = re.compile(r"\bgrade\s+(\d+|k|kindergarten)\b", re.IGNORECASE)


def detect_conflicts(settings: dict, stored_facts: List[Dict]) -> Dict[str, str]:
    """Detect conflicts between F7 (static profile) and F6 (stored memories).

    Returns a map of {fact_id: profile_field_name}. Currently flags:
      - Stored fact mentions a grade not in profile.gradeSubjects.

    The caller is responsible for stamping conflicts_with on the recalled
    fact dict before format_block() renders the marker. We do not persist
    these to the DB — F7 is stateless and the truth source.
    """
    sanitized = _sanitize(settings)
    gs = _get_nested(sanitized, "profile.gradeSubjects") or {}
    if not isinstance(gs, dict) or not gs:
        return {}
    profile_grades = {str(k).lower() for k in gs.keys()}
    conflicts: Dict[str, str] = {}
    for f in stored_facts:
        if not isinstance(f, dict):
            continue
        fact_text = f.get("fact", "") or ""
        # Skip facts whose source is the profile itself — can't conflict with self.
        if f.get("source") == "profile":
            continue
        for match in _GRADE_PATTERN.finditer(fact_text):
            mentioned = match.group(1).lower()
            # Normalize 'kindergarten' / 'k' if needed
            if mentioned == "kindergarten":
                mentioned = "k"
            if mentioned not in profile_grades:
                fid = f.get("id")
                if fid:
                    conflicts[fid] = "profile.gradeSubjects"
                break
    return conflicts
