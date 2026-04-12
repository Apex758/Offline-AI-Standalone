"""
Pydantic schema for structured storybook output.

Used by llama-cpp-python's response_format / grammar enforcement
to guarantee the model outputs valid, parseable JSON matching
the expected storybook structure.

Fields that are constant or derivable client-side are omitted:
- textAnimation (always "fadeIn")
- characterAnimation (derived from imagePlacement)
- styleSuffix (constant, injected client-side)
- comprehensionQuestions (generated in a separate lightweight pass)
"""
from pydantic import BaseModel
from typing import List, Optional, Literal, Dict


class TextSegment(BaseModel):
    speaker: str
    text: str


class StoryPageOutput(BaseModel):
    pageNumber: int
    textSegments: List[TextSegment]
    sceneId: str
    characterScene: Optional[str] = None
    imagePlacement: Literal["left", "right", "none"] = "none"


class IntroductionPage(BaseModel):
    """
    Opening mood-setting page that appears between the cover and the
    first story page. 3-5 narrator-only sentences that introduce the
    setting and atmosphere before the story action begins.
    """
    moodText: str
    sceneId: str


class StoryScene(BaseModel):
    id: str
    description: str


class StorybookOutput(BaseModel):
    title: str
    gradeLevel: str
    learningObjectiveSummary: Optional[str] = None
    characters: List[str] = []
    characterDescriptions: Dict[str, str] = {}
    voiceAssignments: Dict[str, str] = {}
    scenes: List[StoryScene] = []
    # Mandatory — grammar enforces presence on every generation.
    introductionPage: IntroductionPage
    pages: List[StoryPageOutput] = []


# Pre-computed JSON Schema dict for llama-cpp-python response_format
STORYBOOK_JSON_SCHEMA = StorybookOutput.model_json_schema()


# ── Comprehension Questions (separate pass) ──────────────────────────────────

class ComprehensionQuestionOutput(BaseModel):
    question: str
    answer: str
    outcomeRef: Optional[str] = None


class ComprehensionOutput(BaseModel):
    questions: List[ComprehensionQuestionOutput]


COMPREHENSION_JSON_SCHEMA = ComprehensionOutput.model_json_schema()
