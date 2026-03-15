"""
Shared curriculum context utilities for all generator endpoints.
Prioritizes user-selected ELO/SCOs over generic curriculum matcher results.
"""
from typing import Optional


def build_curriculum_system_context(
    form_data: dict,
    curriculum_matcher,
    base_system_prompt: str,
    prompt: str = ""
) -> str:
    """
    Add curriculum context to the system prompt.
    Prioritizes teacher-selected ELO/SCOs from the form data.
    Falls back to automatic curriculum matching if no selections exist.

    Args:
        form_data: The form data dict from the frontend (may contain essentialOutcomes, specificOutcomes).
        curriculum_matcher: The CurriculumMatcher instance (may be None).
        base_system_prompt: The base system prompt to append context to.
        prompt: The user prompt (used as fallback query for curriculum matching).

    Returns:
        The system prompt with curriculum context appended.
    """
    user_elo = ""
    user_scos = ""
    if isinstance(form_data, dict) and form_data:
        user_elo = str(form_data.get("essentialOutcomes", "")).strip()
        user_scos = str(form_data.get("specificOutcomes", "")).strip()

    # If teacher selected specific outcomes, use those
    if user_elo or user_scos:
        selected_context = "\n\nTeacher-Selected Curriculum Outcomes (align output to these):"
        if user_elo:
            selected_context += f"\n\nEssential Learning Outcome:\n{user_elo}"
        if user_scos:
            sco_list = [s.strip() for s in user_scos.split("\n") if s.strip()]
            selected_context += "\n\nSpecific Curriculum Outcomes:"
            for i, sco in enumerate(sco_list, 1):
                selected_context += f"\n  {i}. {sco}"
        return base_system_prompt + selected_context

    # Otherwise, fall back to automatic curriculum matching
    if curriculum_matcher:
        grade_filter = ""
        subject_filter = ""
        query = ""
        if isinstance(form_data, dict) and form_data:
            grade_filter = str(form_data.get("gradeLevel", "")).strip()
            subject_filter = str(form_data.get("subject", "")).strip()
            topic_parts = [
                str(form_data.get("topic", "")),
                str(form_data.get("strand", "")),
                str(form_data.get("subject", "")),
            ]
            query = " ".join(p for p in topic_parts if p and p != "None")
        if not query:
            query = prompt
        if query:
            matches = curriculum_matcher.find_matching_pages(
                query, top_k=3,
                grade=grade_filter, subject=subject_filter
            )
            context_blocks = []
            for m in matches:
                ctx = curriculum_matcher.get_curriculum_context(m.get("id"))
                if ctx:
                    context_blocks.append(ctx)
            if context_blocks:
                return base_system_prompt + "\n\nCurriculum Alignment Context:\n" + "\n\n".join(context_blocks)

    return base_system_prompt


def get_curriculum_refs(form_data: dict, curriculum_matcher, prompt: str = "") -> list:
    """
    Get curriculum reference objects to send back to the frontend.

    Returns:
        List of curriculum reference dicts.
    """
    if not curriculum_matcher:
        return []

    grade_filter = ""
    subject_filter = ""
    query = ""
    if isinstance(form_data, dict) and form_data:
        grade_filter = str(form_data.get("gradeLevel", "")).strip()
        subject_filter = str(form_data.get("subject", "")).strip()
        topic_parts = [
            str(form_data.get("topic", "")),
            str(form_data.get("strand", "")),
            str(form_data.get("subject", "")),
        ]
        query = " ".join(p for p in topic_parts if p and p != "None")
    if not query:
        query = prompt
    if not query:
        return []

    matches = curriculum_matcher.find_matching_pages(
        query, top_k=3,
        grade=grade_filter, subject=subject_filter
    )
    return [
        {
            "id": m.get("id"),
            "displayName": m.get("displayName"),
            "grade": m.get("grade"),
            "subject": m.get("subject"),
            "route": m.get("route"),
            "matchScore": m.get("matchScore"),
        }
        for m in matches
    ]
