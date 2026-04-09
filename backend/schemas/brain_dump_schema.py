"""
Pydantic schemas for structured brain dump output.

Used by llama-cpp-python's response_format / grammar enforcement
to guarantee valid, parseable JSON from all 3 brain dump passes:
1. Primary analysis  — parse teacher notes into actions + unmatched
2. Single action generation — create one action from confirmed suggestion
3. Suggestions — match unmatched text to possible tool types
"""
from pydantic import BaseModel
from typing import List, Optional, Literal, Dict


# ── Primary Analysis Output ──────────────────────────────────────────────────

class BrainDumpActionOutput(BaseModel):
    type: str
    title: str
    description: str
    details: Dict[str, str] = {}
    priority: Optional[Literal["normal", "high", "urgent"]] = "normal"


class BrainDumpAnalysisOutput(BaseModel):
    actions: List[BrainDumpActionOutput] = []
    unmatched: List[str] = []


BRAIN_DUMP_ANALYSIS_SCHEMA = BrainDumpAnalysisOutput.model_json_schema()


# ── Single Action Generation ─────────────────────────────────────────────────

BRAIN_DUMP_ACTION_SCHEMA = BrainDumpActionOutput.model_json_schema()


# ── Suggestion Output ────────────────────────────────────────────────────────

class BrainDumpSuggestionItem(BaseModel):
    text: str
    suggestedTypes: List[str]
    confidence: Literal["low", "medium"]


class BrainDumpSuggestionOutput(BaseModel):
    suggestions: List[BrainDumpSuggestionItem] = []


BRAIN_DUMP_SUGGESTION_SCHEMA = BrainDumpSuggestionOutput.model_json_schema()
