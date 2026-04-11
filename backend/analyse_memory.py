"""
Feature 4: Analyse Chat.

Ephemeral in-memory session store for the "Analyse" mode on the AI Assistant
Panel. Unlike chat_memory, nothing here is persisted — each generation gets a
fresh session that lives in RAM until the user closes the panel.

Public surface:
  - AnalyseSession (dataclass)
  - Section (dataclass)
  - detect_sections(content, content_type) -> List[Section]
  - reconstitute(sections) -> str
  - AnalyseMemory class with create_session / get_session / update_section
    / close_session
  - Prompt builders: build_analyse_greeting, build_section_enhance_prompt,
    build_section_edit_prompt, build_analyse_chat_prompt
  - get_analyse_memory() singleton
"""

import re
import threading
import uuid
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple


# ── Data classes ──────────────────────────────────────────────────────

@dataclass
class Section:
    id: str              # stable slug, e.g. "assessment"
    name: str            # human-readable label, e.g. "Assessment"
    header: str          # the exact markdown header line (e.g. "## Assessment")
    body: str            # the section body (everything between this header and the next)
    start_idx: int       # char offset in the original content (header start)
    end_idx: int         # char offset one-past the section body end


@dataclass
class AnalyseSession:
    id: str
    content: str
    content_type: str
    sections: List[Section] = field(default_factory=list)
    # Lightweight chat history (for the 'chat' message type, not persisted)
    chat_history: List[Dict] = field(default_factory=list)


# ── Section detection ─────────────────────────────────────────────────
# One (section_id, regex) pair per row. First matching header wins.
# Regex matches only the text of the header, not the markdown marks.

SECTION_PATTERNS: Dict[str, List[Tuple[str, str, re.Pattern]]] = {
    "lesson": [
        ("objectives",      "Objectives",      re.compile(r"^\s{0,3}#{1,6}\s*(?:Learning\s+)?Objectives?\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("introduction",    "Introduction",    re.compile(r"^\s{0,3}#{1,6}\s*(?:Introduction|Opening|Warm[- ]?up)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("main_activity",   "Main Activity",   re.compile(r"^\s{0,3}#{1,6}\s*(?:Main\s+)?Activit(?:y|ies)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("assessment",      "Assessment",      re.compile(r"^\s{0,3}#{1,6}\s*(?:Assessment|Evaluation)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("differentiation", "Differentiation", re.compile(r"^\s{0,3}#{1,6}\s*Differentiation\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("materials",       "Materials",       re.compile(r"^\s{0,3}#{1,6}\s*(?:Materials|Resources)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("closure",         "Closure",         re.compile(r"^\s{0,3}#{1,6}\s*Clos(?:ure|ing)\b.*$", re.IGNORECASE | re.MULTILINE)),
    ],
    "quiz": [
        ("instructions", "Instructions", re.compile(r"^\s{0,3}#{1,6}\s*Instructions?\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("questions",    "Questions",    re.compile(r"^\s{0,3}#{1,6}\s*Questions?\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("answer_key",   "Answer Key",   re.compile(r"^\s{0,3}#{1,6}\s*Answer\s+Key\b.*$", re.IGNORECASE | re.MULTILINE)),
    ],
    "rubric": [
        ("criteria",      "Criteria",      re.compile(r"^\s{0,3}#{1,6}\s*(?:Criteria|Dimensions?)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("levels",        "Performance Levels", re.compile(r"^\s{0,3}#{1,6}\s*(?:Levels|Performance\s+Levels|Scale)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("descriptors",   "Descriptors",   re.compile(r"^\s{0,3}#{1,6}\s*Descriptors?\b.*$", re.IGNORECASE | re.MULTILINE)),
    ],
    "worksheet": [
        ("instructions", "Instructions", re.compile(r"^\s{0,3}#{1,6}\s*Instructions?\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("warmup",       "Warm-Up",      re.compile(r"^\s{0,3}#{1,6}\s*Warm[- ]?Up\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("practice",     "Practice",     re.compile(r"^\s{0,3}#{1,6}\s*(?:Practice|Exercises?|Problems?)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("challenge",    "Challenge",    re.compile(r"^\s{0,3}#{1,6}\s*(?:Challenge|Extension|Bonus)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("answer_key",   "Answer Key",   re.compile(r"^\s{0,3}#{1,6}\s*Answer\s+Key\b.*$", re.IGNORECASE | re.MULTILINE)),
    ],
    "kindergarten": [
        ("objectives",      "Objectives",      re.compile(r"^\s{0,3}#{1,6}\s*(?:Learning\s+)?Objectives?\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("circle_time",     "Circle Time",     re.compile(r"^\s{0,3}#{1,6}\s*(?:Circle|Opening|Greeting)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("main_activity",   "Main Activity",   re.compile(r"^\s{0,3}#{1,6}\s*(?:Main\s+)?Activit(?:y|ies)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("learning_centers","Learning Centers",re.compile(r"^\s{0,3}#{1,6}\s*(?:Learning\s+)?Centers?\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("assessment",      "Assessment",      re.compile(r"^\s{0,3}#{1,6}\s*(?:Assessment|Observation)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("closure",         "Closure",         re.compile(r"^\s{0,3}#{1,6}\s*Clos(?:ure|ing)\b.*$", re.IGNORECASE | re.MULTILINE)),
    ],
    "multigrade": [
        ("objectives",     "Objectives",     re.compile(r"^\s{0,3}#{1,6}\s*(?:Learning\s+)?Objectives?\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("shared_intro",   "Shared Introduction", re.compile(r"^\s{0,3}#{1,6}\s*(?:Shared|Whole\s+Class|Introduction)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("grade_tasks",    "Grade Tasks",    re.compile(r"^\s{0,3}#{1,6}\s*(?:Grade\s+Tasks|Differentiated|Group\s+Work)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("assessment",     "Assessment",     re.compile(r"^\s{0,3}#{1,6}\s*(?:Assessment|Evaluation)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("closure",        "Closure",        re.compile(r"^\s{0,3}#{1,6}\s*Clos(?:ure|ing)\b.*$", re.IGNORECASE | re.MULTILINE)),
    ],
    "cross-curricular": [
        ("objectives",   "Objectives",   re.compile(r"^\s{0,3}#{1,6}\s*(?:Learning\s+)?Objectives?\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("connections",  "Connections",  re.compile(r"^\s{0,3}#{1,6}\s*(?:Connections|Subject\s+Links)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("activities",   "Activities",   re.compile(r"^\s{0,3}#{1,6}\s*Activit(?:y|ies)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("assessment",   "Assessment",   re.compile(r"^\s{0,3}#{1,6}\s*Assessment\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("closure",      "Closure",      re.compile(r"^\s{0,3}#{1,6}\s*Clos(?:ure|ing)\b.*$", re.IGNORECASE | re.MULTILINE)),
    ],
    "presentation": [
        ("title_slide",    "Title Slide",    re.compile(r"^\s{0,3}#{1,6}\s*(?:Title|Slide\s*1)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("objectives",     "Objectives",     re.compile(r"^\s{0,3}#{1,6}\s*Objectives?\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("content_slides", "Content Slides", re.compile(r"^\s{0,3}#{1,6}\s*(?:Content|Main\s+Content|Slides?)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("summary",        "Summary",        re.compile(r"^\s{0,3}#{1,6}\s*(?:Summary|Conclusion|Wrap[- ]?Up)\b.*$", re.IGNORECASE | re.MULTILINE)),
    ],
    "storybook": [
        ("characters", "Characters", re.compile(r"^\s{0,3}#{1,6}\s*Characters?\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("setting",    "Setting",    re.compile(r"^\s{0,3}#{1,6}\s*Setting\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("story",      "Story",      re.compile(r"^\s{0,3}#{1,6}\s*(?:Story|Narrative|Pages?)\b.*$", re.IGNORECASE | re.MULTILINE)),
        ("moral",      "Moral",      re.compile(r"^\s{0,3}#{1,6}\s*(?:Moral|Theme|Lesson)\b.*$", re.IGNORECASE | re.MULTILINE)),
    ],
}


def detect_sections(content: str, content_type: str) -> List[Section]:
    """Split generated content into named sections by markdown headers.

    Only sections that actually exist in the content are returned. The
    first matching header for each section_id is taken (duplicates ignored).
    Sections are returned in document order, not pattern order.
    """
    if not content or not content_type:
        return []
    patterns = SECTION_PATTERNS.get(content_type, [])
    if not patterns:
        return []

    # Collect (match_start, match_end, section_id, name, header_line) hits
    hits: List[Tuple[int, int, str, str, str]] = []
    seen_ids: set = set()
    for section_id, display_name, pat in patterns:
        if section_id in seen_ids:
            continue
        m = pat.search(content)
        if m:
            hits.append((m.start(), m.end(), section_id, display_name, m.group(0)))
            seen_ids.add(section_id)

    if not hits:
        return []

    hits.sort(key=lambda h: h[0])  # document order

    sections: List[Section] = []
    for i, (start, hdr_end, sid, name, header_line) in enumerate(hits):
        # Body runs from after the header line to the start of the next section
        body_start = hdr_end
        # Skip the newline right after the header
        if body_start < len(content) and content[body_start] == "\n":
            body_start += 1
        body_end = hits[i + 1][0] if i + 1 < len(hits) else len(content)
        body = content[body_start:body_end].rstrip()
        sections.append(Section(
            id=sid,
            name=name,
            header=header_line,
            body=body,
            start_idx=start,
            end_idx=body_end,
        ))
    return sections


def reconstitute(sections: List[Section], trailing: str = "") -> str:
    """Rebuild a markdown document from sections. Useful after section edits."""
    parts: List[str] = []
    for sec in sections:
        parts.append(sec.header)
        if sec.body:
            parts.append("\n" + sec.body)
        parts.append("\n\n")
    out = "".join(parts).rstrip()
    if trailing:
        out += "\n\n" + trailing.lstrip()
    return out


# ── Session store ─────────────────────────────────────────────────────

class AnalyseMemory:
    def __init__(self):
        self._sessions: Dict[str, AnalyseSession] = {}
        self._lock = threading.Lock()

    def create_session(self, content: str, content_type: str, session_id: Optional[str] = None) -> AnalyseSession:
        sid = session_id or str(uuid.uuid4())
        sections = detect_sections(content, content_type)
        session = AnalyseSession(
            id=sid,
            content=content,
            content_type=content_type,
            sections=sections,
        )
        with self._lock:
            self._sessions[sid] = session
        return session

    def get_session(self, session_id: str) -> Optional[AnalyseSession]:
        with self._lock:
            return self._sessions.get(session_id)

    def update_section(self, session_id: str, section_id: str, new_body: str) -> Optional[AnalyseSession]:
        """Replace a section's body and re-derive the full content.

        Returns the updated session, or None if the session/section was missing.
        """
        with self._lock:
            session = self._sessions.get(session_id)
            if not session:
                return None
            target = next((s for s in session.sections if s.id == section_id), None)
            if not target:
                return None
            target.body = new_body.rstrip()
            session.content = reconstitute(session.sections)
            return session

    def add_chat_turn(self, session_id: str, role: str, content: str):
        with self._lock:
            session = self._sessions.get(session_id)
            if not session:
                return
            session.chat_history.append({"role": role, "content": content})
            # Cap at the last 12 turns (6 pairs)
            if len(session.chat_history) > 12:
                session.chat_history = session.chat_history[-12:]

    def close_session(self, session_id: str):
        with self._lock:
            self._sessions.pop(session_id, None)

    def session_count(self) -> int:
        with self._lock:
            return len(self._sessions)


# ── Prompt builders ───────────────────────────────────────────────────

CONTENT_TYPE_LABELS = {
    "lesson":           "lesson plan",
    "quiz":             "quiz",
    "rubric":           "rubric",
    "worksheet":        "worksheet",
    "kindergarten":     "early-childhood lesson plan",
    "multigrade":       "multi-grade lesson plan",
    "cross-curricular": "integrated cross-curricular lesson plan",
    "presentation":     "presentation",
    "storybook":        "storybook",
}


def _label(content_type: str) -> str:
    return CONTENT_TYPE_LABELS.get(content_type, content_type)


def build_analyse_greeting(content_type: str, section_count: int) -> str:
    """The AI's opening line when the Analyse panel connects."""
    label = _label(content_type)
    if section_count >= 2:
        return (
            f"I've reviewed your {label}. I can see {section_count} sections. "
            f"Would you like me to expand the whole thing into a more detailed "
            f"version, or focus on one section? You can also just ask me "
            f"anything about this {label}."
        )
    return (
        f"I've reviewed your {label}. I can expand it into a more detailed "
        f"version, edit specific parts, or just answer questions about it."
    )


def build_section_enhance_prompt(
    full_content: str,
    section: Section,
    content_type: str,
) -> str:
    """Prompt for expanding a single section as part of a full-doc enhance pass."""
    label = _label(content_type)
    return (
        f"You are enhancing a {label} for a Caribbean primary school teacher.\n\n"
        f"FULL {label.upper()} (read-only context -- do NOT reproduce the entire document):\n"
        f"---\n{full_content}\n---\n\n"
        f"TASK: Rewrite ONLY the \"{section.name}\" section. Make it more detailed, "
        f"more actionable, and more specific than the original. Add concrete examples, "
        f"timing, and questions where appropriate.\n\n"
        f"CURRENT {section.name.upper()} SECTION:\n{section.body}\n\n"
        f"RULES:\n"
        f"- Output ONLY the replacement body for the {section.name} section.\n"
        f"- Do NOT include the section header (\"{section.header}\") in your output.\n"
        f"- Do NOT include content from other sections.\n"
        f"- Maintain the same markdown formatting style (lists, bold, etc.).\n"
        f"- Keep it coherent with the rest of the document.\n"
        f"- Offline-first: no internet-dependent suggestions.\n\n"
        f"Write the expanded {section.name} body now:"
    )


def build_section_edit_prompt(
    full_content: str,
    section: Section,
    instruction: str,
    content_type: str,
) -> str:
    """Prompt for an explicit user-requested edit to a single section."""
    label = _label(content_type)
    return (
        f"You are editing a {label} for a Caribbean primary school teacher.\n\n"
        f"FULL {label.upper()} (read-only context -- do NOT reproduce the entire document):\n"
        f"---\n{full_content}\n---\n\n"
        f"TASK: Rewrite ONLY the \"{section.name}\" section based on this instruction:\n"
        f"{instruction}\n\n"
        f"CURRENT {section.name.upper()} SECTION:\n{section.body}\n\n"
        f"RULES:\n"
        f"- Output ONLY the replacement body for the {section.name} section.\n"
        f"- Do NOT include the section header (\"{section.header}\") in your output.\n"
        f"- Do NOT include content from other sections.\n"
        f"- Maintain the same markdown formatting style.\n"
        f"- Keep it coherent with the rest of the document.\n"
        f"- Offline-first: no internet-dependent suggestions.\n\n"
        f"Write the revised {section.name} body now:"
    )


def build_analyse_chat_prompt(full_content: str, content_type: str) -> str:
    """System prompt for the 'chat' message type (questions about the content)."""
    label = _label(content_type)
    return (
        f"You are a teaching assistant helping a Caribbean primary school teacher "
        f"review their generated {label}.\n\n"
        f"CONTENT:\n{full_content}\n\n"
        f"### Instructions\n"
        f"- Answer questions about this content directly. Reference specific sections when useful.\n"
        f"- Offer concrete suggestions, not general praise.\n"
        f"- Keep responses concise. Match depth to the question.\n"
        f"- No filler. No \"Great question!\" openers.\n"
        f"- Offline-first: no internet-dependent suggestions."
    )


# ── Singleton ─────────────────────────────────────────────────────────

_instance: Optional[AnalyseMemory] = None
_instance_lock = threading.Lock()


def get_analyse_memory() -> AnalyseMemory:
    global _instance
    with _instance_lock:
        if _instance is None:
            _instance = AnalyseMemory()
    return _instance
