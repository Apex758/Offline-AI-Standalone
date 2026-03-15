"""
Rebuild curriculumIndex.json from raw curriculum JSON files in 'output - Copy'.
Consolidates messy strand names into canonical slugs and produces the indexed format
consumed by the app.
"""
import json
import os
import re
from pathlib import Path
from collections import defaultdict

SOURCE_DIR = Path("output - Copy")
OUTPUT_FILE = Path("frontend/src/data/curriculumIndex.json")
BACKUP_OUTPUT = Path("backend-bundle/data/curriculumIndex.json")

# Skip non-curriculum files
SKIP_FILES = set()  # Previously skipped kindergarten guidelines, now processed

# The kindergarten guidelines file uses subject-organized strands
KINDERGARTEN_GUIDELINES_FILE = "OHPC Kindergarten Guidelines 14November2024_curriculum.json"

# Canonical strand mapping: regex pattern -> (canonical_slug, display_name)
STRAND_MAP = {
    # Language Arts
    r"listening.+speaking|speaking.+listening": ("listening-speaking", "Listening & Speaking"),
    r"reading.+viewing": ("reading-viewing", "Reading & Viewing"),
    r"writing.+representing": ("writing-representing", "Writing & Representing"),
    # Math
    r"number\s*sense": ("number-sense", "Number Sense"),
    r"operations?\s*(with)?\s*numbers?": ("operations-with-numbers", "Operations with Numbers"),
    r"pattern.+relation": ("patterns-relationships", "Patterns & Relationships"),
    r"geometr": ("geometrical-thinking", "Geometrical Thinking"),
    r"measurement|measuring|metric\s*unit": ("measurement", "Measurement"),
    r"data.+(?:handling|probability)": ("data-probability", "Data Handling & Probability"),
    # Science
    r"wave": ("waves-lights-sounds", "Waves, Lights & Sounds"),
    r"structure.+function.+(?:information|processing)": ("structure-function-processing", "Structure, Function & Information Processing"),
    r"structure.+(?:properties|matter)": ("structure-properties-matter", "Structure & Properties of Matter"),
    r"space\s*system": ("space-systems", "Space Systems"),
    r"force": ("forces-interactions", "Forces & Interactions"),
    r"interdependent": ("interdependent-relationships", "Interdependent Relationships in Ecosystems"),
    r"earth\s*system": ("earth-systems", "Earth Systems"),
    r"engineering": ("engineering-design", "Engineering Design"),
    r"inheritance|variation.+trait|life\s*cycle": ("inheritance-variation", "Inheritance & Variation of Traits"),
    r"weather\b(?!.*natural)|climate": ("weather-climate", "Weather & Climate"),
    r"energy": ("energy", "Energy"),
    r"structure.+function(?!.*inform)": ("structure-function", "Structure & Function"),
    r"chemical.+reaction": ("chemical-reactions", "Chemical Reactions"),
    r"matter.+energy.+organism": ("matter-energy-organisms-ecosystems", "Matter & Energy in Organisms & Ecosystems"),
    r"scientific.+inquiry": ("scientific-inquiry", "Scientific Inquiry"),
    # Social Studies
    r"historical|cultural.+thinking|ancestors": ("historical-cultural-thinking", "Historical & Cultural Thinking"),
    r"civic.+participation": ("civic-participation", "Civic Participation"),
    r"spatial.+thinking": ("spatial-thinking", "Spatial Thinking"),
    r"economic.+decision": ("economic-decision-making", "Economic Decision Making"),
}

# Grade 4 Science special: "Waves" alone maps differently than "Waves, Lights and Sounds"
GRADE_STRAND_OVERRIDES = {
    ("4", "Science"): {
        r"wave": ("waves", "Waves"),
        r"structure.+function": ("structure-function", "Structure & Function"),
    },
    ("6", "Science"): {
        r"wave": ("waves-electromagnetic", "Waves & Electromagnetic Radiation"),
    },
}

# Subject inference from strand names when subject is "Unknown"
SUBJECT_FROM_STRAND = {
    "number-sense": "Mathematics",
    "operations-with-numbers": "Mathematics",
    "patterns-relationships": "Mathematics",
    "geometrical-thinking": "Mathematics",
    "measurement": "Mathematics",
    "data-probability": "Mathematics",
    "listening-speaking": "Language Arts",
    "reading-viewing": "Language Arts",
    "writing-representing": "Language Arts",
    "forces-interactions": "Science",
    "interdependent-relationships": "Science",
    "weather-climate": "Science",
    "earth-systems": "Science",
    "space-systems": "Science",
    "structure-properties-matter": "Science",
    "waves-lights-sounds": "Science",
    "engineering-design": "Science",
    "energy": "Science",
    "chemical-reactions": "Science",
    "inheritance-variation": "Science",
    "historical-cultural-thinking": "Social Studies",
    "civic-participation": "Social Studies",
    "spatial-thinking": "Social Studies",
    "economic-decision-making": "Social Studies",
}


def normalize_grade(grade_str):
    """Extract grade number or 'K' from grade string."""
    if "kindergarten" in grade_str.lower():
        return "K"
    m = re.search(r"(\d+)", grade_str)
    return m.group(1) if m else grade_str


def classify_strand(strand_name, grade, subject):
    """Map a raw strand name to a canonical (slug, display_name) tuple."""
    name_lower = strand_name.lower().strip()

    # Check grade+subject overrides first
    overrides = GRADE_STRAND_OVERRIDES.get((grade, subject), {})
    for pattern, result in overrides.items():
        if re.search(pattern, name_lower):
            return result

    # General mapping
    for pattern, result in STRAND_MAP.items():
        if re.search(pattern, name_lower):
            return result

    # Fallback: skip strands we can't classify (metadata/intro strands)
    return None


def extract_keywords(strand_name, elos):
    """Generate keywords from strand content."""
    words = set()
    # From strand name
    for w in re.findall(r"[A-Za-z]+", strand_name):
        if len(w) > 3:
            words.add(w.lower())
    # From ELO descriptions (first few significant words)
    for elo in elos:
        desc = elo.get("elo_description", "")
        for w in re.findall(r"[A-Za-z]+", desc):
            if len(w) > 4:
                words.add(w.lower())
    # Remove very common words
    stopwords = {"will", "learners", "expected", "that", "their", "with", "from",
                 "about", "these", "this", "they", "have", "been", "into", "using",
                 "which", "through", "between", "other", "some", "such", "also",
                 "strand", "essential", "learning", "outcome", "outcomes"}
    return sorted(words - stopwords)[:15]


def classify_by_content(strand_name, elos, grade, subject):
    """Fallback: classify strand by looking at ELO/SCO content when the name alone isn't enough."""
    name_lower = strand_name.lower()
    # Gather all text for content analysis
    all_text = name_lower
    for elo in elos:
        all_text += " " + elo.get("elo_description", "").lower()
        for sco in elo.get("specific_curriculum_outcomes", []):
            all_text += " " + sco.lower()

    # Essential Learning Outcome patterns with content hints
    if re.match(r"essential\s*learning\s*outcome", name_lower):
        if subject == "Language Arts":
            if "speak" in all_text and "listen" in all_text:
                return ("listening-speaking", "Listening & Speaking")
            if "writ" in all_text and ("draft" in all_text or "revis" in all_text):
                return ("writing-representing", "Writing & Representing")
            if "read" in all_text and "view" in all_text:
                return ("reading-viewing", "Reading & Viewing")
        if subject == "Mathematics":
            # Math operations
            if "add" in all_text and ("subtract" in all_text or "multipl" in all_text):
                return ("operations-with-numbers", "Operations with Numbers")
            # Math patterns
            if "square" in all_text and "triangul" in all_text:
                return ("patterns-relationships", "Patterns & Relationships")
            # Fallback for Math ELOs: check for measurement, geometry, etc.
            if "measure" in all_text:
                return ("measurement", "Measurement")
            if "shape" in all_text or "geometr" in all_text:
                return ("geometrical-thinking", "Geometrical Thinking")
            if "pattern" in all_text:
                return ("patterns-relationships", "Patterns & Relationships")

    # "Essential Learning Outcome 7" in Grade 1 LA = writing-representing (word solving)
    if "word solving" in all_text or "spelling" in all_text:
        if subject == "Language Arts":
            return ("writing-representing", "Writing & Representing")

    # "Writing informational paragraph" = writing-representing
    if "writing" in name_lower and "informational" in name_lower:
        return ("writing-representing", "Writing & Representing")

    # Grade 5 Math catch-alls
    if subject == "Mathematics":
        if re.match(r"(introduction|grade\s*level|scoring)", name_lower):
            # Content-based: check what it's actually about
            if "number" in all_text and ("skip count" in all_text or "place value" in all_text
                                          or "digit" in all_text or "decimal" in all_text
                                          or "fraction" in all_text or "ratio" in all_text):
                return ("number-sense", "Number Sense")
            if "shape" in all_text or "geometric" in all_text or "spatial" in all_text:
                return ("geometrical-thinking", "Geometrical Thinking")
            if "measure" in all_text or "length" in all_text or "area" in all_text:
                return ("measurement", "Measurement")
        if "metric" in name_lower and "unit" in name_lower:
            return ("measurement", "Measurement")
        if "place\s*value" in name_lower:
            return ("number-sense", "Number Sense")
        if "scoring\s*rubric" in name_lower:
            # Check content
            if "decimal" in all_text or "fraction" in all_text:
                return ("number-sense", "Number Sense")

    # Social Studies: section-based strands
    if subject == "Social Studies":
        if "weather" in name_lower and "natural" not in name_lower:
            return ("spatial-thinking", "Spatial Thinking")
        if "section" in name_lower:
            if "govern" in all_text:
                return ("civic-participation", "Civic Participation")
            if "resource" in all_text or "land" in all_text:
                return ("economic-decision-making", "Economic Decision Making")

    # Explore word solving -> writing (only for Language Arts)
    if "explore word" in name_lower and subject == "Language Arts":
        return ("writing-representing", "Writing & Representing")

    # "Number and Operations" or "Place Value" -> number-sense
    if subject == "Mathematics":
        if "place value" in name_lower or ("number" in name_lower and "operation" in name_lower):
            return ("number-sense", "Number Sense")

    # Grade Level Expectations with ratio/proportion content -> number-sense
    if subject == "Mathematics" and "grade level" in name_lower:
        if "ratio" in all_text or "proportion" in all_text:
            return ("number-sense", "Number Sense")

    # Science/general intro -> will be skipped by caller
    if "introduction" in name_lower:
        return None

    return None


def build_index():
    # Collect all strand data grouped by (grade, subject, canonical_slug)
    grouped = defaultdict(lambda: {
        "elos": [],
        "scos": [],
        "display_name": "",
        "keywords": set(),
    })

    for filename in sorted(os.listdir(SOURCE_DIR)):
        if not filename.endswith("_curriculum.json") or filename in SKIP_FILES:
            continue

        filepath = SOURCE_DIR / filename
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        meta = data.get("metadata", {})
        grade = normalize_grade(meta.get("grade", ""))
        subject = meta.get("subject", "Unknown")

        # Kindergarten files are unit-based, handle differently
        is_kindergarten = grade == "K"
        is_guidelines = filename == KINDERGARTEN_GUIDELINES_FILE

        for strand in data.get("strands", []):
            strand_name = strand.get("strand_name", "")
            elos = strand.get("essential_learning_outcomes", [])

            if is_kindergarten and is_guidelines:
                # Kindergarten guidelines: subject-organized strands
                # Classify strand by name using the standard STRAND_MAP
                result = classify_strand(strand_name, "K", subject)
                if result is None:
                    result = classify_by_content(strand_name, elos, "K", subject)
                if result is None:
                    print(f"  WARN: Unclassified kindergarten guideline strand: '{strand_name}'")
                    continue

                slug, display = result

                # Infer subject from strand
                inferred_subject = SUBJECT_FROM_STRAND.get(slug, "Kindergarten")

                key = ("K", inferred_subject, slug)
                entry = grouped[key]
                entry["display_name"] = display

                for elo in elos:
                    elo_desc = elo.get("elo_description", "").strip()
                    if elo_desc and elo_desc not in entry["elos"]:
                        entry["elos"].append(elo_desc)
                    for sco in elo.get("specific_curriculum_outcomes", []):
                        cleaned = sco.strip().lstrip("* ")
                        if cleaned and len(cleaned) > 10 and cleaned not in entry["scos"]:
                            entry["scos"].append(cleaned)
                entry["keywords"].update(extract_keywords(strand_name, elos))
                continue

            elif is_kindergarten:
                # Kindergarten units: use filename to determine unit name
                unit_slug = filename.replace("_curriculum.json", "").replace("kindergarten-", "")
                unit_display = unit_slug.replace("-", " ").replace("unit", "").strip().title()
                # Kindergarten is organized by week/unit, group all under the unit
                key = ("K", "Kindergarten", unit_slug)
                entry = grouped[key]
                entry["display_name"] = unit_display
                for elo in elos:
                    entry["elos"].append(elo.get("elo_description", ""))
                    for sco in elo.get("specific_curriculum_outcomes", []):
                        cleaned = sco.strip().lstrip("* ")
                        if cleaned and len(cleaned) > 10:
                            entry["scos"].append(cleaned)
                continue

            # For graded subjects: classify the strand
            result = classify_strand(strand_name, grade, subject)
            if result is None:
                # Try content-based classification: look at ELO descriptions and SCOs
                result = classify_by_content(strand_name, elos, grade, subject)

            if result is None:
                # Skip unclassifiable strands (intros, FAQs, scoring rubrics, etc.)
                skip_patterns = [
                    r"frequently\s*asked", r"inclusive\s*learning", r"introduction",
                    r"elements\s*that\s*are\s*integrated",
                    r"prewriting", r"modelling\s*constant",
                    r"two\s*way\s*table", r"counting\s*on",
                    r"prism\s*shape", r"division", r"myself",
                    r"week\s*(one|two|three|four|five)", r"gathering\s*assessment",
                    r"weather\s*(?:and|&)?\s*(?:the)?\s*natural",
                    r"governing", r"human\s*resource", r"resources.*land",
                    r"organization\s*of\s*eastern",
                ]
                name_lower = strand_name.lower()
                is_skip = any(re.search(p, name_lower) for p in skip_patterns)
                if not is_skip:
                    print(f"  WARN: Unclassified strand in {filename}: '{strand_name[:80]}'")
                continue

            slug, display = result

            # Fix subject if it was "Unknown" but strand tells us
            if subject == "Unknown" and slug in SUBJECT_FROM_STRAND:
                subject = SUBJECT_FROM_STRAND[slug]

            key = (grade, subject, slug)
            entry = grouped[key]
            entry["display_name"] = display

            for elo in elos:
                elo_desc = elo.get("elo_description", "").strip()
                if elo_desc and elo_desc not in entry["elos"]:
                    entry["elos"].append(elo_desc)

                for sco in elo.get("specific_curriculum_outcomes", []):
                    cleaned = sco.strip().lstrip("* ")
                    if cleaned and len(cleaned) > 10 and cleaned not in entry["scos"]:
                        entry["scos"].append(cleaned)

            entry["keywords"].update(extract_keywords(strand_name, elos))

    # Build indexed pages
    indexed_pages = []
    for (grade, subject, slug), entry in sorted(grouped.items()):
        if grade == "K" and subject == "Kindergarten":
            # Unit-based entries (Belonging, Weather, etc.)
            page_id = f"kindergarten-{slug}"
            route = f"/curriculum/kindergarten/{slug}"
        elif grade == "K":
            # Subject-based entries from Guidelines (Language Arts, Mathematics, etc.)
            subject_slug = subject.lower().replace(" ", "-")
            page_id = f"kindergarten-{subject_slug}-{slug}"
            route = f"/curriculum/kindergarten/standards/{subject_slug}/{slug}"
        else:
            subject_slug = subject.lower().replace(" ", "-")
            page_id = f"grade{grade}-{subject_slug}-{slug}"
            route = f"/curriculum/grade{grade}-subjects/{subject_slug}/{slug}"

        # Build summary from first ELO
        summary = entry["elos"][0][:200] if entry["elos"] else entry["display_name"]

        # Clean up specific outcomes - take most meaningful ones, limit length
        specific = []
        for sco in entry["scos"]:
            # Split long concatenated outcomes
            parts = re.split(r'(?<=[.!?])\s+(?=[A-Z])', sco)
            for part in parts:
                part = part.strip()
                if part and len(part) > 10 and part not in specific:
                    specific.append(part)

        page = {
            "id": page_id,
            "route": route,
            "displayName": entry["display_name"],
            "grade": grade,
            "subject": subject,
            "strand": slug,
            "keywords": sorted(list(entry["keywords"]))[:15],
            "essentialOutcomes": entry["elos"][:5],
            "specificOutcomes": specific[:25],
            "summary": summary,
        }
        indexed_pages.append(page)

    return {"indexedPages": indexed_pages}


if __name__ == "__main__":
    print(f"Reading curriculum files from: {SOURCE_DIR}")
    result = build_index()
    pages = result["indexedPages"]
    print(f"\nGenerated {len(pages)} indexed pages:")

    # Summary by grade
    grades = sorted(set(p["grade"] for p in pages))
    for g in grades:
        grade_pages = [p for p in pages if p["grade"] == g]
        subjects = sorted(set(p["subject"] for p in grade_pages))
        for s in subjects:
            sp = [p for p in grade_pages if p["subject"] == s]
            strands = [p["strand"] for p in sp]
            label = f"Kindergarten" if g == "K" else f"Grade {g}"
            print(f"  {label} - {s}: {strands}")

    # Write output
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(f"\nWrote {OUTPUT_FILE}")

    # Copy to backend-bundle if it exists
    if BACKUP_OUTPUT.parent.exists():
        with open(BACKUP_OUTPUT, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        print(f"Wrote {BACKUP_OUTPUT}")

    print("\nDone!")
