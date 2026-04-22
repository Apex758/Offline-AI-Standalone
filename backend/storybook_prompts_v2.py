"""
Prompts + deterministic image-prompt assembly for the two-pass storybook
generator (v2).

Pipeline:
    Pass 1 (LLM) : user brief      -> StorybookBible
    Pass 2 (LLM) : bible + brief   -> StorybookPages (+ comprehension)
    Stage 3 (py) : bible + page    -> (positive_prompt, negative_prompt)
    Stage 4 (img): txt2img per page
    Stage 5 (py) : manifest + disk layout

This module owns stages 1-3. Stage 4 is image_service. Stage 5 is
storybook_generator.
"""
from __future__ import annotations

import json
from typing import Tuple

from schemas.storybook_v2 import StorybookBible, StoryPage


# ── Module-level constants ──────────────────────────────────────────────────

# Age-tier keyed negative prompts. All tiers block text artifacts and anatomy
# glitches; lower tiers additionally block anything remotely scary.
NEGATIVE_PROMPT_LIBRARY: dict[str, str] = {
    "3-5": (
        "scary, dark, creepy, monsters, weapons, blood, violence, sad, "
        "crying, shadows, nightmare, adult themes, realistic photo, "
        "text, words, letters, numbers, watermark, signature, "
        "deformed, distorted, blurry, extra fingers, mutated hands, "
        "bad anatomy, extra limbs, ugly, low quality"
    ),
    "6-8": (
        "graphic violence, weapons, blood, gore, horror, adult themes, "
        "realistic photo, text, words, letters, numbers, watermark, "
        "signature, deformed, distorted, blurry, extra fingers, "
        "mutated hands, bad anatomy, extra limbs, ugly, low quality"
    ),
    "9-12": (
        "explicit content, graphic violence, gore, nudity, adult themes, "
        "realistic photo, text, words, letters, numbers, watermark, "
        "signature, deformed, distorted, blurry, extra fingers, "
        "bad anatomy, extra limbs, ugly, low quality"
    ),
}

# Appended to every positive prompt. Keeps composition readable as a
# children's book illustration regardless of scene content.
COMPOSITION_HINTS: str = (
    "centered composition, clear focal point, children's book illustration, "
    "warm lighting, wide landscape framing, no text"
)


# ── System prompts ──────────────────────────────────────────────────────────

BIBLE_SYSTEM_PROMPT = (
    "You are the planning head of a children's picture-book studio. "
    "Given a teacher's brief, design the story bible: title, learning "
    "objective, target age tier, visual style anchor, page-by-page outline, "
    "cast of characters with detailed visual descriptions, and world.\n\n"
    "CRITICAL: This is a STORY, not a lesson plan. The learning objective is "
    "embedded through what the characters DO and DISCOVER during the story. "
    "Characters must NOT lecture the reader or address the class directly. "
    "No 'today we are going to learn about X'. The reader learns by watching "
    "the character experience the world.\n\n"
    "The visual_description for each character will be pasted verbatim into "
    "every image prompt that features them, so it must be detailed, "
    "unambiguous, and visually specific (species, age, build, hair, eyes, "
    "clothing, accessories, palette). Do NOT describe emotions or actions "
    "in visual_description -- only the unchanging look of the character. "
    "Return ONLY valid JSON matching the schema."
)

PAGES_SYSTEM_PROMPT = (
    "You are the page-writing head of a children's picture-book studio. "
    "Given a completed story bible, produce: (1) one introduction_page "
    "(narrator-only mood-setter before page 1), (2) every numbered story "
    "page, and (3) comprehension_questions.\n\n"
    "TEXT FORMAT -- CRITICAL:\n"
    "Every page (intro + story) uses text_segments, an ordered list of "
    "{speaker, text} entries. speaker is either the literal string "
    "'narrator' or a character.id from the bible. NEVER put character "
    "dialogue inside a narrator segment and NEVER put narration inside a "
    "character segment. Rules:\n"
    "- Narrator segments describe scene, action, and the character's "
    "  behavior in third person. No first-person voice. No dialogue.\n"
    "- Character segments are ONLY what that character literally says out "
    "  loud. Quotes are implicit; do not wrap the text in quotation marks.\n"
    "- A page typically alternates narrator + one or two character lines.\n"
    "- Characters must NOT address the reader or the class. They speak to "
    "  each other or think out loud, never 'hello everyone' to an audience.\n\n"
    "INTRODUCTION PAGE:\n"
    "Exactly 3-5 narrator-only segments. Open with setting (weather, place, "
    "time). Name the main characters. State where they are and what they "
    "are about to do. Plain concrete language, no poetic metaphors, no "
    "personification, no foreshadowing of problems. Page 1 must pick up "
    "directly from the intro.\n\n"
    "STORY PAGES:\n"
    "- scene_description: visual prompt fragment describing WHAT IS "
    "  HAPPENING VISUALLY (setting, action, mood, composition). 20-40 "
    "  words. Do NOT repeat character appearance -- bible handles that.\n"
    "- characters_present: list of character.id values from the bible.\n"
    "- emotion / action / location: short phrases.\n"
    "- The learning objective is revealed through what the characters "
    "  observe, try, and figure out -- never through a lecture.\n\n"
    "COMPREHENSION (4-6 questions) mixes literal recall, inference, and "
    "(if curriculum provided) curriculum connection. Each has a brief "
    "expected answer.\n\n"
    "Return ONLY valid JSON matching the schema."
)


# ── Pass 1 builder ──────────────────────────────────────────────────────────

def build_bible_prompt(
    user_brief: str,
    page_count: int,
    target_age: str,
    curriculum_info: str = "",
) -> str:
    """Construct the Pass 1 user prompt."""
    curriculum_block = ""
    if curriculum_info.strip():
        curriculum_block = (
            "\n\nCURRICULUM ALIGNMENT (weave into learning_objective and "
            "outline, do not lecture):\n"
            f"{curriculum_info.strip()}\n"
        )

    return (
        f"TEACHER BRIEF:\n{user_brief.strip()}\n\n"
        f"CONSTRAINTS:\n"
        f"- Target age tier: {target_age}\n"
        f"- Outline contains exactly {page_count} STORY pages, numbered "
        f"1..{page_count}. The story body only. Do NOT include an "
        f"introduction page in the outline — Pass 2 generates the intro "
        f"as a separate narrator-only page before page 1. Page 1 of the "
        f"outline is the first action page of the story, not an intro.\n"
        f"- style_anchor must be a comma-separated list of visual style "
        f"descriptors appropriate for age {target_age} (e.g. "
        f"'flat vector illustration, children's book style, bold outlines, "
        f"pastel colors, bright and cheerful, simple shapes'). This string "
        f"is prepended to every image prompt, so choose it carefully.\n"
        f"- characters[] contains ONLY named, sentient, speaking actors: "
        f"people, animals, or anthropomorphised creatures that appear in "
        f"the story and can act or speak. Typical count: 1-3 characters. "
        f"Settings, locations, places, and objects are NEVER characters "
        f"(e.g. 'the garden', 'the classroom', 'the forest', 'a seed', "
        f"'the sun' are NOT characters — they go in world.setting or "
        f"world.recurring_locations). If the teacher brief only names one "
        f"protagonist, the bible has exactly one character.\n"
        f"- Each character.visual_description must be detailed enough that "
        f"an illustrator could draw the character identically across pages "
        f"from the description alone (species, age, build, clothing, "
        f"palette). Do NOT describe emotions or actions here.\n"
        f"- Characters listed are the ONLY named characters in the story; "
        f"do not introduce extras in Pass 2.\n"
        f"- world.recurring_locations should list 2-5 locations that the "
        f"story's pages will reuse (e.g. 'Garden', 'Pond', 'Greenhouse').\n"
        f"{curriculum_block}\n"
        f"Return ONLY the JSON bible. No markdown, no commentary."
    )


# ── Pass 2 builder ──────────────────────────────────────────────────────────

def build_pages_prompt(
    bible: StorybookBible | dict,
    page_count: int,
    curriculum_info: str = "",
) -> str:
    """Construct the Pass 2 user prompt. Bible is injected verbatim so the
    LLM stays grounded in the planning artifacts."""
    if isinstance(bible, StorybookBible):
        bible_json = bible.model_dump_json(indent=2)
    else:
        bible_json = json.dumps(bible, indent=2)

    curriculum_block = ""
    if curriculum_info.strip():
        curriculum_block = (
            "\n\nCURRICULUM ALIGNMENT (ground comprehension_questions in "
            "these outcomes where possible; set outcome_ref on those):\n"
            f"{curriculum_info.strip()}\n"
        )

    return (
        f"STORY BIBLE (authoritative -- do not contradict):\n"
        f"{bible_json}\n\n"
        f"TASK: Write all {page_count} pages of the story. For each page:\n"
        f"- narration: what the child reads or hears (age-appropriate, "
        f"matches bible.target_age)\n"
        f"- scene_description: a vivid visual prompt fragment describing "
        f"the page's setting, action, mood, and composition -- 20-40 words, "
        f"NO character appearance details (those come from the bible)\n"
        f"- characters_present: list of character.id values from the bible "
        f"that appear on this page\n"
        f"- emotion: the dominant emotion of the scene\n"
        f"- action: one short phrase describing what is happening\n"
        f"- location: choose from bible.world.recurring_locations or add a "
        f"new one if the story genuinely needs it\n\n"
        f"After pages, write 4-6 comprehension_questions mixing literal "
        f"recall, inferential thinking, and (if curriculum below) "
        f"curriculum connection.\n"
        f"{curriculum_block}\n"
        f"Return ONLY the JSON. No markdown, no commentary."
    )


# ── Stage 3: deterministic image-prompt assembly ────────────────────────────

def assemble_image_prompt(
    bible: StorybookBible | dict,
    page: StoryPage | dict,
) -> Tuple[str, str]:
    """
    Build (positive, negative) image prompts for a single page.

    Order is fixed and deterministic:
        style_anchor, <every present character's visual_description>,
        scene_description, composition_hints

    Negative is looked up by bible.target_age.
    """
    if isinstance(bible, StorybookBible):
        style_anchor = bible.style_anchor
        target_age = bible.target_age
        chars_by_id = {c.id: c for c in bible.characters}
    else:
        style_anchor = bible.get("style_anchor", "")
        target_age = bible.get("target_age", "6-8")
        chars_by_id = {c["id"]: c for c in bible.get("characters", [])}

    if isinstance(page, StoryPage):
        present_ids = page.characters_present
        scene_description = page.scene_description
    else:
        present_ids = page.get("characters_present", [])
        scene_description = page.get("scene_description", "")

    char_descs: list[str] = []
    for cid in present_ids:
        c = chars_by_id.get(cid)
        if c is None:
            continue
        desc = c.visual_description if hasattr(c, "visual_description") else c.get("visual_description", "")
        if desc:
            char_descs.append(desc.strip())

    parts = [style_anchor.strip()] if style_anchor else []
    parts.extend(char_descs)
    if scene_description.strip():
        parts.append(scene_description.strip())
    parts.append(COMPOSITION_HINTS)

    positive = ", ".join(p for p in parts if p)
    negative = NEGATIVE_PROMPT_LIBRARY.get(
        target_age, NEGATIVE_PROMPT_LIBRARY["6-8"]
    )
    return positive, negative
