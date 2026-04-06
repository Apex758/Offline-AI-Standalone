"""
Pydantic schema for structured smart-search output.

Used by llama-cpp-python's response_format / grammar enforcement
to guarantee the model outputs valid, parseable JSON matching
the expected smart-search structure.
"""
from pydantic import BaseModel
from typing import List, Optional, Literal


class SmartSearchAction(BaseModel):
    toolType: Optional[str] = None
    settingsSection: Optional[str] = None
    actionName: Optional[str] = None
    prefill: Optional[dict] = None


class SmartSearchOutput(BaseModel):
    intent: Literal["navigation", "generation", "settings", "info"]
    summary: str
    steps: List[str]
    action: Optional[SmartSearchAction] = None
    confidence: float


# Pre-computed JSON Schema dict for llama-cpp-python response_format
SMART_SEARCH_JSON_SCHEMA = SmartSearchOutput.model_json_schema()
