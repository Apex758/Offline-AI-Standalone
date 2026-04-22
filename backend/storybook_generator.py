"""
Orchestrator for the two-pass storybook pipeline (v2).

Exposes `generate_storybook` as an async generator that yields events the
WebSocket layer can forward verbatim. Keeps transport concerns (websockets)
out of the pipeline logic.

Event shapes:
    {type: "status",       status: "planning"|"writing_pages"|"rendering_images"|"packaging"}
    {type: "bible_token",  content: str}
    {type: "bible",        content: dict}                  # parsed bible
    {type: "pages_token",  content: str}
    {type: "pages",        content: dict}                  # parsed pages + comprehension
    {type: "page_image",   page: int, image_path?: str, placeholder?: bool, error?: str}
    {type: "manifest",     manifest: dict}
    {type: "done"}
    {type: "error",        message: str}
    {type: "cancelled"}
"""
from __future__ import annotations

import asyncio
import base64
import json
import logging
import time
import uuid
from pathlib import Path
from typing import AsyncIterator, Callable, Optional

from image_service import get_app_data_path, get_image_service
from schemas.storybook_v2 import StorybookBible, StorybookPages
from storybook_prompts_v2 import (
    BIBLE_SYSTEM_PROMPT,
    PAGES_SYSTEM_PROMPT,
    assemble_image_prompt,
    build_bible_prompt,
    build_pages_prompt,
)

logger = logging.getLogger(__name__)


# ── Helpers ─────────────────────────────────────────────────────────────────

def _build_prompt(system: str, user: str) -> str:
    """Match the project's existing chat-template convention (see main.build_prompt)."""
    try:
        from main import build_prompt  # late import to avoid circular
        return build_prompt(system, user)
    except Exception:
        # Fallback: plain concatenation. Most models accept this.
        return f"<|system|>\n{system}\n<|user|>\n{user}\n<|assistant|>\n"


def _storybook_root() -> Path:
    root = get_app_data_path("storybooks")
    root.mkdir(parents=True, exist_ok=True)
    return root


def _book_dir(book_id: str) -> Path:
    d = _storybook_root() / book_id
    (d / "images").mkdir(parents=True, exist_ok=True)
    return d


# ── LLM pass runner ─────────────────────────────────────────────────────────

async def _run_llm_pass(
    inference,
    *,
    user_prompt: str,
    system_prompt: str,
    json_schema: dict,
    max_tokens: int,
    temperature: float,
    repeat_penalty: float,
    token_event_type: str,
    is_cancelled: Callable[[], bool],
) -> AsyncIterator[dict]:
    """Stream one LLM pass. Yields `{type: token_event_type, content}` chunks
    plus a final sentinel `{type: "__done__", text: <full_text>}` on success,
    `{type: "cancelled"}` if cancelled, or `{type: "error", message}`."""
    full_prompt = _build_prompt(system_prompt, user_prompt)
    collected: list[str] = []
    buf = ""
    last_flush = time.monotonic()

    try:
        async for chunk in inference.generate_stream(
            tool_name="storybook",
            input_data=user_prompt,
            prompt_template=full_prompt,
            max_tokens=max_tokens,
            temperature=temperature,
            repeat_penalty=repeat_penalty,
            json_schema=json_schema,
        ):
            if is_cancelled():
                if buf:
                    yield {"type": token_event_type, "content": buf}
                yield {"type": "cancelled"}
                return

            if chunk.get("error"):
                if buf:
                    yield {"type": token_event_type, "content": buf}
                yield {"type": "error", "message": chunk["error"]}
                return

            if chunk.get("finished"):
                if buf:
                    yield {"type": token_event_type, "content": buf}
                    buf = ""
                yield {"type": "__done__", "text": "".join(collected)}
                return

            tok = chunk.get("token")
            if tok:
                collected.append(tok)
                buf += tok
                now = time.monotonic()
                if (now - last_flush) >= 0.030 or "\n" in tok:
                    yield {"type": token_event_type, "content": buf}
                    buf = ""
                    last_flush = now
    except Exception as e:
        logger.exception("LLM pass failed")
        yield {"type": "error", "message": f"LLM pass failed: {e}"}
        return

    # Stream ended without a finished sentinel — still return what we have.
    if buf:
        yield {"type": token_event_type, "content": buf}
    yield {"type": "__done__", "text": "".join(collected)}


def _try_parse_json(text: str) -> Optional[dict]:
    """Parse JSON, tolerating stray prose/markdown around a single object."""
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Strip code fences
    stripped = text.strip()
    if stripped.startswith("```"):
        stripped = stripped.strip("`")
        if stripped.lower().startswith("json"):
            stripped = stripped[4:]
    # Bracket slice
    try:
        start = stripped.index("{")
        end = stripped.rindex("}") + 1
        return json.loads(stripped[start:end])
    except Exception:
        return None


# ── Image rendering ─────────────────────────────────────────────────────────

def _render_page_image_sync(
    positive: str,
    negative: str,
    out_path: Path,
    seed: Optional[int] = None,
) -> Optional[tuple[str, bytes]]:
    """Blocking image gen. Returns (absolute_path, png_bytes) on success."""
    svc = get_image_service()
    # Children's-book landscape aspect — matches previous pipeline defaults.
    img_bytes = svc.generate_image(
        prompt=positive,
        negative_prompt=negative,
        width=1024,
        height=576,
        seed=seed,
    )
    if not img_bytes:
        return None
    try:
        out_path.write_bytes(img_bytes)
        return (str(out_path), img_bytes)
    except Exception as e:
        logger.error(f"Failed writing image to {out_path}: {e}")
        return None


# ── Public generator ────────────────────────────────────────────────────────

async def generate_storybook(
    *,
    inference,
    brief: str,
    page_count: int,
    target_age: str,
    curriculum_info: str = "",
    max_tokens: int = 3500,
    temperature: float = 0.7,
    repeat_penalty: float = 1.1,
    generation_mode: str = "queued",
    is_cancelled: Callable[[], bool] = lambda: False,
    book_id: Optional[str] = None,
) -> AsyncIterator[dict]:
    """Two-pass storybook generation with per-page unified scene images."""
    book_id = book_id or f"sb_{uuid.uuid4().hex[:12]}"
    book_dir = _book_dir(book_id)

    # ── Pass 1: Bible ────────────────────────────────────────────────────
    yield {"type": "status", "status": "planning", "bookId": book_id}

    from schemas.storybook_v2 import BIBLE_JSON_SCHEMA
    bible_prompt = build_bible_prompt(
        user_brief=brief,
        page_count=page_count,
        target_age=target_age,
        curriculum_info=curriculum_info,
    )

    bible_text = ""
    async for ev in _run_llm_pass(
        inference,
        user_prompt=bible_prompt,
        system_prompt=BIBLE_SYSTEM_PROMPT,
        json_schema=BIBLE_JSON_SCHEMA,
        max_tokens=max_tokens,
        temperature=temperature,
        repeat_penalty=repeat_penalty,
        token_event_type="bible_token",
        is_cancelled=is_cancelled,
    ):
        if ev["type"] == "__done__":
            bible_text = ev["text"]
            break
        if ev["type"] in ("cancelled", "error"):
            yield ev
            return
        yield ev

    bible_dict = _try_parse_json(bible_text)
    if not bible_dict:
        yield {"type": "error", "message": "Pass 1 produced unparseable JSON for the story bible."}
        return
    try:
        bible = StorybookBible.model_validate(bible_dict)
    except Exception as e:
        yield {"type": "error", "message": f"Pass 1 JSON failed schema validation: {e}"}
        return

    yield {"type": "bible", "content": bible.model_dump()}

    # ── Pass 2: Pages + comprehension ────────────────────────────────────
    yield {"type": "status", "status": "writing_pages", "bookId": book_id}

    from schemas.storybook_v2 import PAGES_JSON_SCHEMA
    pages_prompt = build_pages_prompt(
        bible=bible,
        page_count=page_count,
        curriculum_info=curriculum_info,
    )

    pages_text = ""
    async for ev in _run_llm_pass(
        inference,
        user_prompt=pages_prompt,
        system_prompt=PAGES_SYSTEM_PROMPT,
        json_schema=PAGES_JSON_SCHEMA,
        max_tokens=max_tokens,
        temperature=temperature,
        repeat_penalty=repeat_penalty,
        token_event_type="pages_token",
        is_cancelled=is_cancelled,
    ):
        if ev["type"] == "__done__":
            pages_text = ev["text"]
            break
        if ev["type"] in ("cancelled", "error"):
            yield ev
            return
        yield ev

    pages_dict = _try_parse_json(pages_text)
    if not pages_dict:
        yield {"type": "error", "message": "Pass 2 produced unparseable JSON for pages."}
        return
    try:
        pages_model = StorybookPages.model_validate(pages_dict)
    except Exception as e:
        yield {"type": "error", "message": f"Pass 2 JSON failed schema validation: {e}"}
        return

    yield {"type": "pages", "content": pages_model.model_dump()}

    # ── Stage 4: Images ──────────────────────────────────────────────────
    # Hand RAM from LLM to diffusion (no-op in simultaneous mode).
    try:
        from model_swap import swap_to_image
        await swap_to_image(mode=generation_mode)
    except Exception as e:
        logger.warning(f"swap_to_image failed (continuing): {e}")

    yield {"type": "status", "status": "rendering_images", "bookId": book_id}

    image_records: list[dict] = []
    loop = asyncio.get_running_loop()
    for page in pages_model.pages:
        if is_cancelled():
            yield {"type": "cancelled"}
            return

        positive, negative = assemble_image_prompt(bible, page)
        out_file = book_dir / "images" / f"page_{page.page}.png"

        try:
            result = await loop.run_in_executor(
                None,
                _render_page_image_sync,
                positive,
                negative,
                out_file,
                None,
            )
        except Exception as e:
            logger.exception(f"Page {page.page} image crashed")
            yield {
                "type": "page_image",
                "page": page.page,
                "placeholder": True,
                "error": str(e),
            }
            image_records.append({
                "page": page.page,
                "image_path": None,
                "placeholder": True,
            })
            continue

        if not result:
            yield {
                "type": "page_image",
                "page": page.page,
                "placeholder": True,
                "error": "image generation returned no bytes",
            }
            image_records.append({
                "page": page.page,
                "image_path": None,
                "placeholder": True,
            })
            continue

        abs_path, png_bytes = result
        rel_path = f"images/page_{page.page}.png"
        b64 = base64.b64encode(png_bytes).decode("ascii")
        yield {
            "type": "page_image",
            "page": page.page,
            "image_path": rel_path,
            "absolute_path": abs_path,
            "imageDataBase64": b64,
        }
        image_records.append({"page": page.page, "image_path": rel_path, "placeholder": False})

    # ── Stage 5: Manifest ────────────────────────────────────────────────
    yield {"type": "status", "status": "packaging", "bookId": book_id}

    image_path_by_page = {r["page"]: r for r in image_records}

    manifest = {
        "bookId": book_id,
        "metadata": {
            "title": bible.title,
            "learning_objective": bible.learning_objective,
            "target_age": bible.target_age,
            "style_anchor": bible.style_anchor,
        },
        "introduction_page": pages_model.introduction_page.model_dump(),
        "pages": [
            {
                "page": p.page,
                "text_segments": [s.model_dump() for s in p.text_segments],
                "image_path": image_path_by_page.get(p.page, {}).get("image_path"),
                "placeholder": image_path_by_page.get(p.page, {}).get("placeholder", False),
                "characters_present": p.characters_present,
                "emotion": p.emotion,
                "action": p.action,
                "location": p.location,
                "scene_description": p.scene_description,
            }
            for p in pages_model.pages
        ],
        "comprehension_questions": [q.model_dump() for q in pages_model.comprehension_questions],
        "bible": bible.model_dump(),
    }

    try:
        (book_dir / "manifest.json").write_text(
            json.dumps(manifest, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
    except Exception as e:
        logger.error(f"Failed to write manifest.json: {e}")

    yield {"type": "manifest", "manifest": manifest}
    yield {"type": "done", "bookId": book_id}
