"""
Pydantic schema for structured presentation output.

Used by llama-cpp-python's response_format / grammar enforcement
to guarantee the model outputs valid, parseable JSON matching
the expected slide structure.
"""
from pydantic import BaseModel
from typing import List, Optional, Literal


class SlideContent(BaseModel):
    headline: str
    subtitle: Optional[str] = None
    badge: Optional[str] = None
    body: Optional[str] = None
    bullets: Optional[List[str]] = None
    imagePlacement: Optional[Literal["right", "left", "top", "half", "background", "bottom-right", "none"]] = None
    imageScene: Optional[str] = None


class Slide(BaseModel):
    id: str
    layout: Literal["title", "objectives", "hook", "instruction", "activity", "assessment", "closing"]
    content: SlideContent


class PresentationOutput(BaseModel):
    slides: List[Slide]


# Pre-computed JSON Schema dict for llama-cpp-python response_format
PRESENTATION_JSON_SCHEMA = PresentationOutput.model_json_schema()
