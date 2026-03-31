"""
Normalize output/*.json curriculum files and copy them to frontend/src/data/curriculum/.
Fixes:
  - Strand names that are actually descriptions (merges into parent strand or renames)
  - Grade values normalized ("Grade 1" -> "1", "Kindergarten" -> "K")
  - Subject values normalized ("Unknown" -> appropriate subject for K units)
  - Removes non-curriculum files (logs, OHPC guidelines which is redundant)
"""

import json
import os
import shutil
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
OUTPUT_DIR = ROOT / "output"
DEST_DIR = ROOT / "frontend" / "src" / "data" / "curriculum"

# Files to skip entirely
SKIP_FILES = {
    "extractor_run.log",
    "gapfill.log",
    "gapfill2.log",
    "rerun.log",
    "OHPC Kindergarten Guidelines 14November2024.json",  # redundant with unit files
}

# Strand name fixes: maps (filename, bad strand name) -> corrected strand name or None to merge
STRAND_FIXES = {
    # Grade 3 LA: extra strand is just a description paragraph, merge its content into strand[0]
    ("grade3-language-arts-curriculum.json",
     "Language is the foundation of communication and the primary instrument of thought. The study of Language Arts"): {
        "action": "merge_into", "target": "Listening and Speaking"
    },
    # Grade 4 LA: extra strand is a description of Reading, merge into Reading and Viewing
    ("grade4-language-arts-curriculum.json",
     "The purpose of Reading and Viewing instruction is for pleasure and personal growth and to develop re"): {
        "action": "merge_into", "target": "Reading and Viewing"
    },
    # Grade 4 Science: these are actual content strands with bad names
    ("grade4-science-curriculum.json",
     "Construct an argument that plants and animals have internal and external structures that function to support survival, growth, behavior, and reproduction"): {
        "action": "rename", "new_name": "Structure, Function, and Information Processing"
    },
    ("grade4-science-curriculum.json",
     "Use a model to describe that animals receive different information through their senses, process it in their brain and respond to it differently"): {
        "action": "rename", "new_name": "Biological Information Processing"
    },
    # Grade 3 SS: extra strands are sub-topics of existing strands
    ("grade3-social-studies-curriculum.json",
     "Historical-Cultural Thinking: Origin of our Island People"): {
        "action": "merge_into", "target": "Historical and Cultural Thinking"
    },
    ("grade3-social-studies-curriculum.json",
     "(Topic): Spatial Thinking: Water Bodies"): {
        "action": "merge_into", "target": "Spatial Thinking"
    },
    # Grade 6 SS: same pattern
    ("grade6-social-studies-curriculum.json",
     "This strand explores how the diversity of the world"): {
        "action": "merge_into", "target": "Historical and Cultural Thinking"
    },
    ("grade6-social-studies-curriculum.json",
     "(Topic): Spatial Thinking: Adaptation and Lifestyle in Diverse Climatic Regions"): {
        "action": "merge_into", "target": "Spatial Thinking"
    },
}

# Kindergarten unit -> subject mapping
KINDER_UNIT_SUBJECTS = {
    "kindergarten-belonging-unit.json": "Kindergarten",
    "kindergarten-celebrations-unit.json": "Kindergarten",
    "kindergarten-games-unit.json": "Kindergarten",
    "kindergarten-plants-and-animals-unit.json": "Kindergarten",
    "kindergarten-weather-unit.json": "Kindergarten",
}

def normalize_grade(grade_str: str) -> str:
    """Convert 'Grade 1' -> '1', 'Kindergarten' -> 'K'."""
    if not grade_str:
        return ""
    g = grade_str.strip()
    if g.lower().startswith("kindergarten"):
        return "K"
    m = re.match(r"(?i)grade\s*(\d+)", g)
    if m:
        return m.group(1)
    return g


def find_strand_fix(filename: str, strand_name: str):
    """Check if a strand needs fixing. Matches by prefix since names may be truncated."""
    for (fname, bad_prefix), fix in STRAND_FIXES.items():
        if fname == filename and strand_name.startswith(bad_prefix[:80]):
            return fix
    return None


def merge_strand_into(strands: list, source_strand: dict, target_name: str):
    """Merge source strand's ELOs/SCOs into the target strand."""
    target = None
    for s in strands:
        if s["strand_name"] == target_name:
            target = s
            break
    if target is None:
        return  # target not found, skip

    # Merge ELOs
    for elo in source_strand.get("essential_learning_outcomes", []):
        target.setdefault("essential_learning_outcomes", []).append(elo)

    # Merge assessment and learning strategies
    for key in ["inclusive_assessment_strategies", "inclusive_learning_strategies", "resources"]:
        source_items = source_strand.get(key, [])
        if source_items:
            target.setdefault(key, []).extend(source_items)


def process_file(filename: str, data: dict) -> dict:
    """Process a single curriculum file: fix strands, normalize metadata."""
    # Normalize metadata
    meta = data.get("metadata", {})
    meta["grade"] = normalize_grade(meta.get("grade", ""))

    # Fix subject for kindergarten units
    if filename in KINDER_UNIT_SUBJECTS:
        meta["subject"] = KINDER_UNIT_SUBJECTS[filename]

    # Process strands
    strands = data.get("strands", [])
    strands_to_remove = []

    for i, strand in enumerate(strands):
        fix = find_strand_fix(filename, strand["strand_name"])
        if fix:
            if fix["action"] == "merge_into":
                merge_strand_into(strands, strand, fix["target"])
                strands_to_remove.append(i)
            elif fix["action"] == "rename":
                strand["strand_name"] = fix["new_name"]

    # Remove merged strands (reverse order to preserve indices)
    for i in sorted(strands_to_remove, reverse=True):
        strands.pop(i)

    data["metadata"] = meta
    data["strands"] = strands
    return data


def get_dest_filename(src_filename: str) -> str:
    """Convert output filename to destination filename."""
    # Remove '-curriculum' suffix from grade files
    name = src_filename.replace("-curriculum.json", ".json")
    return name


def main():
    DEST_DIR.mkdir(parents=True, exist_ok=True)

    processed = 0
    skipped = 0

    for filename in sorted(os.listdir(OUTPUT_DIR)):
        if filename in SKIP_FILES:
            print(f"  SKIP: {filename}")
            skipped += 1
            continue

        if not filename.endswith(".json"):
            print(f"  SKIP (not json): {filename}")
            skipped += 1
            continue

        src_path = OUTPUT_DIR / filename
        with open(src_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Process and normalize
        data = process_file(filename, data)

        # Write to destination
        dest_filename = get_dest_filename(filename)
        dest_path = DEST_DIR / dest_filename
        with open(dest_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        strand_count = len(data.get("strands", []))
        print(f"  OK: {filename} -> {dest_filename} ({strand_count} strands)")
        processed += 1

    print(f"\nDone: {processed} files processed, {skipped} skipped")
    print(f"Output: {DEST_DIR}")


if __name__ == "__main__":
    main()
