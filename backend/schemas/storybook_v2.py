"""
Pydantic schemas for the two-pass storybook generator (v2).

Pass 1 (Bible)  — title, style anchor, outline, characters, world
Pass 2 (Pages)  — per-page narration, scene description, metadata, and
                  comprehension questions (folded in to save an LLM call)

Both schemas are exported as JSON schemas (model_json_schema) for
llama-cpp-python grammar enforcement.
"""
from pydantic import BaseModel, Field
from typing import List, Literal


# ── Pass 1: Bible ────────────────────────────────────────────────────────────

AgeTier = Literal["3-5", "6-8", "9-12"]


class OutlineBeat(BaseModel):
    page: int
    beat: str
    purpose: str


class Character(BaseModel):
    id: str
    name: str
    species_or_type: str
    visual_description: str
    personality: str
    role: str


class World(BaseModel):
    setting: str
    time_period: str
    mood: str
    color_palette: str
    recurring_locations: List[str]


class StorybookBible(BaseModel):
    title: str
    learning_objective: str
    target_age: AgeTier
    style_anchor: str
    outline: List[OutlineBeat]
    characters: List[Character]
    world: World


# ── Pass 2: Pages + comprehension ────────────────────────────────────────────

class TextSegment(BaseModel):
    """One line of text on a page, tagged by its speaker.

    speaker is either the literal string "narrator" or a character.id from
    the bible. The frontend styles narrator vs character lines differently
    (italic prose vs quoted dialogue bubbles).
    """
    speaker: str
    text: str


class IntroductionPage(BaseModel):
    """Narrator-only mood-setting page between cover and page 1.

    The prompt forbids dialogue here. 3-5 simple sentences that introduce
    setting + characters + what they are about to do. Page 1 must pick up
    directly from where the intro leaves off.
    """
    text_segments: List[TextSegment]
    scene_description: str
    location: str


class StoryPage(BaseModel):
    page: int
    text_segments: List[TextSegment]
    scene_description: str
    characters_present: List[str]
    emotion: str
    action: str
    location: str


class ComprehensionQuestion(BaseModel):
    question: str
    answer: str
    outcome_ref: str = Field(default="")


class StorybookPages(BaseModel):
    introduction_page: IntroductionPage
    pages: List[StoryPage]
    comprehension_questions: List[ComprehensionQuestion]


# ── JSON schemas for grammar enforcement ────────────────────────────────────

BIBLE_JSON_SCHEMA = StorybookBible.model_json_schema()
PAGES_JSON_SCHEMA = StorybookPages.model_json_schema()
