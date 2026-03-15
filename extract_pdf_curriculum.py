"""
Extract curriculum data from PDF files into JSON format compatible with
rebuild_curriculum_index.py.

Reads PDFs from 'Delon Curriculum Docs/' and writes JSON to 'output - Copy/'.
Produces the same schema as the existing HTML-based extractor.py.
"""
import json
import re
import sys
import io
from pathlib import Path
from pypdf import PdfReader

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = Path(__file__).parent
PDF_DIR = PROJECT_ROOT / "Delon Curriculum Docs"
OUTPUT_DIR = PROJECT_ROOT / "output - Copy"

# ── Filename → metadata mapping ──────────────────────────────────────────────
FILE_META = {
    "grade1-language-arts-curriculum.pdf": ("Grade 1", "Language Arts"),
    "grade1-mathematics-curriculum.pdf": ("Grade 1", "Mathematics"),
    "grade1-science-curriculum.pdf": ("Grade 1", "Science"),
    "grade1-social-studies-curriculum.pdf": ("Grade 1", "Social Studies"),
    "grade2-language-arts-curriculum.pdf": ("Grade 2", "Language Arts"),
    "grade2-mathematics-curriculum.pdf": ("Grade 2", "Mathematics"),
    "grade2-science-curriculum.pdf": ("Grade 2", "Science"),
    "grade2-social-studies-curriculum.pdf": ("Grade 2", "Social Studies"),
    "grade3-language-arts-curriculum.pdf": ("Grade 3", "Language Arts"),
    "grade3-mathematics-curriculum.pdf": ("Grade 3", "Mathematics"),
    "grade3-science-curriculum.pdf": ("Grade 3", "Science"),
    "grade3-social-studies-curriculum.pdf": ("Grade 3", "Social Studies"),
    "grade4-language-arts-curriculum.pdf": ("Grade 4", "Language Arts"),
    "grade4-mathematics-curriculum.pdf": ("Grade 4", "Mathematics"),
    "grade4-science-curriculum.pdf": ("Grade 4", "Science"),
    "grade4-social-studies-curriculum.pdf": ("Grade 4", "Social Studies"),
    "grade5-language-arts-curriculum.pdf": ("Grade 5", "Language Arts"),
    "grade5-mathematics-curriculum.pdf": ("Grade 5", "Mathematics"),
    "grade5-science-curriculum.pdf": ("Grade 5", "Science"),
    "grade5-social-studies-curriculum.pdf": ("Grade 5", "Social Studies"),
    "grade6-language-arts-curriculum.pdf": ("Grade 6", "Language Arts"),
    "grade6-mathematics-curriculum.pdf": ("Grade 6", "Mathematics"),
    "grade6-science-curriculum.pdf": ("Grade 6", "Science"),
    "grade6-social-studies-curriculum.pdf": ("Grade 6", "Social Studies"),
    "kindergarten-belonging-unit.pdf": ("Kindergarten", "Kindergarten"),
    "kindergarten-celebrations-unit.pdf": ("Kindergarten", "Kindergarten"),
    "kindergarten-games-unit.pdf": ("Kindergarten", "Kindergarten"),
    "kindergarten-plants-and-animals-unit.pdf": ("Kindergarten", "Kindergarten"),
    "kindergarten-weather-unit.pdf": ("Kindergarten", "Kindergarten"),
}

# ── Known strand names by subject ────────────────────────────────────────────
# These help us detect strand boundaries in the PDF text.
LA_STRANDS = [
    "Speaking and Listening", "Listening and Speaking",
    "Reading and Viewing", "Reading & Viewing",
    "Writing and Representing", "Writing & Representing",
]

MATH_STRANDS = [
    "Number Sense",
    "Operations", "Operations with Numbers",
    "Patterns and Relationships", "Patterns & Relationships",
    "Pattern and Relationship", "Pattern & Relationship",
    "Geometric Thinking", "Geometrical Thinking", "Geometry",
    "Measurement",
    "Data Handling and Probability", "Data Handling & Probability",
    "Data Handling",
]

SCIENCE_STRANDS = [
    "Structure and Properties of Matter", "Structure & Properties of Matter",
    "Structure, Function and Information Processing",
    "Structure, Function & Information Processing",
    "Structure and Function", "Structure & Function",
    "Space Systems",
    "Forces and Interactions", "Forces & Interactions",
    "Interdependent Relationships in Ecosystems", "Interdependent Relationships",
    "Earth Systems", "Earth Systems and Processes", "Earth's Systems",
    "Engineering Design", "Engineering",
    "Inheritance and Variation of Traits", "Inheritance & Variation of Traits",
    "Life Cycles", "Life Cycle",
    "Weather and Climate", "Weather & Climate",
    "Energy",
    "Chemical Reactions",
    "Matter and Energy in Organisms and Ecosystems",
    "Waves, Lights and Sounds", "Waves, Lights & Sounds",
    "Waves and Electromagnetic Radiation", "Waves & Electromagnetic Radiation",
    "Waves",
    "Scientific Inquiry",
]

SS_STRANDS = [
    "Historical and Cultural Thinking", "Historical & Cultural Thinking",
    "Civic Participation",
    "Spatial Thinking",
    "Economic Decision Making", "Economic Decision-Making",
]


def normalize(text: str) -> str:
    """Clean whitespace and special chars."""
    text = text.replace("\xa0", " ").replace("\u2019", "'").replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2013", "-").replace("\u2014", "-").replace("\u2022", "")
    text = text.replace("\uf0b7", "").replace("\uf0a7", "")
    return " ".join(text.split()).strip()


def extract_full_text(pdf_path: Path) -> str:
    """Extract all text from a PDF, page by page."""
    reader = PdfReader(str(pdf_path))
    pages = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages.append(text)
    return "\n\n".join(pages)


def find_strand_boundaries(full_text: str, subject: str) -> list:
    """Find strand section boundaries in the text. Returns [(strand_name, start_pos, end_pos), ...]"""
    if subject == "Language Arts":
        known_strands = LA_STRANDS
    elif subject == "Mathematics":
        known_strands = MATH_STRANDS
    elif subject == "Science":
        known_strands = SCIENCE_STRANDS
    elif subject == "Social Studies":
        known_strands = SS_STRANDS
    else:
        return []

    # Build patterns for strand detection
    # Look for strand names appearing as section headers (typically on their own line or after "Strand")
    boundaries = []

    for strand_name in known_strands:
        # Pattern: strand name as a header, possibly preceded by "Strand:" or "Strand (Topic):"
        escaped = re.escape(strand_name)
        patterns = [
            # Standalone header line
            rf'(?:^|\n)\s*{escaped}\s*(?:\n|$)',
            # After "Strand (Topic):" or "Strand:"
            rf'(?:Strand\s*(?:\(Topic\))?\s*:?\s*){escaped}',
            # As an "Introduction to Strand" section
            rf'Introduction to (?:the )?Strand\s*[:\n]*\s*{escaped}',
        ]

        for pattern in patterns:
            for m in re.finditer(pattern, full_text, re.IGNORECASE):
                # Avoid duplicates - check if we already found this strand nearby
                pos = m.start()
                already_found = any(abs(pos - b[1]) < 200 and b[0].lower() == strand_name.lower()
                                    for b in boundaries)
                if not already_found:
                    boundaries.append((strand_name, pos, -1))
                    break  # Take first match for this pattern
            if any(b[0].lower() == strand_name.lower() for b in boundaries):
                break

    # Sort by position
    boundaries.sort(key=lambda x: x[1])

    # Remove duplicates (same strand appearing multiple times - keep first major occurrence)
    seen_strands = set()
    unique = []
    for name, start, end in boundaries:
        canonical = name.lower().replace("&", "and").replace(",", "").strip()
        # Normalize similar names
        canonical = re.sub(r'\s+', ' ', canonical)
        # Normalize word order for "listening and speaking" vs "speaking and listening"
        words = sorted(canonical.split(" and "))
        canonical = " and ".join(words)
        if canonical not in seen_strands:
            # Check if a more specific version already exists (e.g. "waves" when
            # "waves and electromagnetic radiation" is already found)
            is_subset = any(seen.startswith(canonical) and seen != canonical
                            for seen in seen_strands)
            if not is_subset:
                # Remove any less-specific version already in the list
                # (e.g. remove "waves" if we're adding "waves and electromagnetic radiation")
                to_remove = {s for s in seen_strands if canonical.startswith(s) and s != canonical}
                if to_remove:
                    unique = [(n, s, e) for n, s, e in unique
                              if n.lower().replace("&", "and").replace(",", "").strip() not in to_remove]
                    seen_strands -= to_remove
                seen_strands.add(canonical)
                unique.append((name, start, end))
    boundaries = unique

    # Set end positions
    for i in range(len(boundaries)):
        if i + 1 < len(boundaries):
            boundaries[i] = (boundaries[i][0], boundaries[i][1], boundaries[i + 1][1])
        else:
            boundaries[i] = (boundaries[i][0], boundaries[i][1], len(full_text))

    return boundaries


def extract_elos_from_text(text: str, subject: str) -> list:
    """Extract Essential Learning Outcomes and their SCOs from a strand text block."""
    elos = []

    # Pattern 1: "Essential Learning Outcome N:" or "Essential Learning Outcome:"
    elo_pattern = re.compile(
        r'Essential\s+Learning\s+Outcome\s*:?\s*'
        r'(?:ELO\s*\d*\s*:?\s*)?'
        r'(.*?)(?=Essential\s+Learning\s+Outcome|Specific\s+Curriculum\s+Outcomes|$)',
        re.IGNORECASE | re.DOTALL
    )

    # Try to find ELOs
    elo_matches = list(elo_pattern.finditer(text))

    if elo_matches:
        for m in elo_matches:
            elo_text = normalize(m.group(1))
            # Truncate at common section headers
            for cutoff in ["Specific Curriculum Outcomes", "Inclusive Assessment",
                           "Inclusive Learning", "Grade Level Expectations",
                           "Clarification Statement", "Assessment Boundary"]:
                idx = elo_text.find(cutoff)
                if idx > 0:
                    elo_text = elo_text[:idx].strip()

            if len(elo_text) > 15:
                # Now extract SCOs from the text following this ELO
                scos = extract_scos(text[m.start():], subject)
                elos.append({
                    "elo_code": f"ELO-{len(elos) + 1}",
                    "elo_description": elo_text[:500],
                    "specific_curriculum_outcomes": scos,
                })
    else:
        # No explicit ELO markers - try to extract the intro text as ELO
        # and numbered items as SCOs
        intro_match = re.search(
            r'(?:Introduction to (?:the )?Strand|Introduction to Subject).*?\n(.*?)(?=Specific\s+Curriculum|Learner[s]?\s+are\s+expected)',
            text, re.IGNORECASE | re.DOTALL
        )
        intro_text = ""
        if intro_match:
            intro_text = normalize(intro_match.group(1))[:500]

        scos = extract_scos(text, subject)

        if intro_text or scos:
            elos.append({
                "elo_code": "ELO-1",
                "elo_description": intro_text if intro_text else "See specific curriculum outcomes",
                "specific_curriculum_outcomes": scos,
            })

    return elos


def extract_scos(text: str, subject: str) -> list:
    """Extract Specific Curriculum Outcomes from text."""
    scos = []

    # Pattern: numbered outcomes like "1.1", "2.3", "N1.1", "6-HCT-K-1", etc.
    # Also simple numbered: "1.", "2.", etc.
    sco_patterns = [
        # Decimal numbered: 1.1, 2.3, etc.
        re.compile(r'(?:^|\n)\s*(\d+\.\d+)\s+(.*?)(?=\n\s*\d+\.\d+|\n\s*\n|\n\s*Essential|\n\s*Strand|$)',
                    re.DOTALL),
        # Code-based: N1.1, 6-HCT-K-1, etc.
        re.compile(r'(?:^|\n)\s*(\d+-[A-Z]+-[A-Z]+-\d+)\s*[-:]?\s*(.*?)(?=\n\s*\d+-[A-Z]+|\n\s*\n|$)',
                    re.DOTALL),
        # Simple numbered in "Learners are expected to:" sections
        re.compile(r'(?:^|\n)\s*(\d+)\.\s+(.*?)(?=\n\s*\d+\.|\n\s*\n|\n\s*Skills|\n\s*Values|$)',
                    re.DOTALL),
    ]

    # Also look for bullet-point outcomes (lines starting with bullet chars)
    bullet_pattern = re.compile(r'(?:^|\n)\s*[●•▪➢>\-]\s*(.*?)(?=\n\s*[●•▪➢>\-]|\n\s*\n|$)', re.DOTALL)

    for pattern in sco_patterns:
        matches = list(pattern.finditer(text))
        if len(matches) >= 2:  # Need at least 2 matches to be confident
            for m in matches:
                code = m.group(1).strip()
                desc = normalize(m.group(2))
                if len(desc) > 10:
                    # Remove assessment/learning strategy content
                    for cutoff in ["Formative Assessment", "Inclusive Assessment",
                                   "Inclusive Learning", "Summative Assessment",
                                   "Teacher Resources"]:
                        idx = desc.find(cutoff)
                        if idx > 0:
                            desc = desc[:idx].strip()
                    scos.append(f"{code} {desc}"[:300])
            if scos:
                return scos

    # Fallback: bullet points
    bullet_matches = list(bullet_pattern.finditer(text))
    for m in bullet_matches:
        desc = normalize(m.group(1))
        if len(desc) > 15 and not any(skip in desc.lower() for skip in
                                       ["formative", "summative", "assessment strategy",
                                        "teacher will", "teacher should", "resources for"]):
            scos.append(desc[:300])

    return scos[:30]  # Limit to 30 SCOs per ELO


def extract_grade_level_expectations(text: str) -> list:
    """Extract Grade Level Expectations as additional SCOs."""
    gle_pattern = re.compile(
        r'Grade\s+Level\s+Expectations?\s*(?:and/or\s+Focus\s+Questions?)?\s*:?\s*(.*?)(?=Essential\s+Learning|Specific\s+Curriculum|Introduction|$)',
        re.IGNORECASE | re.DOTALL
    )
    expectations = []
    for m in gle_pattern.finditer(text):
        block = m.group(1)
        # Extract bullet points
        for line in re.split(r'\n', block):
            line = normalize(line)
            line = re.sub(r'^[●•▪➢>\-\d.]+\s*', '', line)
            if len(line) > 15:
                expectations.append(line[:300])
    return expectations[:20]


def process_pdf(pdf_path: Path, grade: str, subject: str) -> dict:
    """Process a single PDF file and return curriculum JSON."""
    print(f"  Processing: {pdf_path.name} ({grade} / {subject})")

    full_text = extract_full_text(pdf_path)
    if not full_text:
        print(f"    WARNING: No text extracted from {pdf_path.name}")
        return None

    result = {
        "metadata": {
            "filename": pdf_path.stem + "_curriculum.json",
            "curriculum": "",
            "grade": grade,
            "subject": subject,
        },
        "strands": [],
    }

    # Find strand boundaries
    boundaries = find_strand_boundaries(full_text, subject)

    if not boundaries:
        print(f"    WARNING: No strands found in {pdf_path.name}")
        # Try treating the whole document as one strand
        elos = extract_elos_from_text(full_text, subject)
        gles = extract_grade_level_expectations(full_text)
        if elos:
            if gles and elos[0]["specific_curriculum_outcomes"]:
                # Prepend GLEs to first ELO's SCOs
                elos[0]["specific_curriculum_outcomes"] = gles + elos[0]["specific_curriculum_outcomes"]
            result["strands"].append({
                "strand_name": subject,
                "essential_learning_outcomes": elos,
            })
        return result

    print(f"    Found {len(boundaries)} strands: {[b[0] for b in boundaries]}")

    for strand_name, start, end in boundaries:
        strand_text = full_text[start:end]

        # Extract ELOs and SCOs
        elos = extract_elos_from_text(strand_text, subject)

        # Also get Grade Level Expectations
        gles = extract_grade_level_expectations(strand_text)
        if gles and elos:
            # Add GLEs to first ELO's SCOs if not already present
            existing = set(s[:50] for s in elos[0].get("specific_curriculum_outcomes", []))
            for gle in gles:
                if gle[:50] not in existing:
                    elos[0]["specific_curriculum_outcomes"].insert(0, gle)

        if elos:
            result["strands"].append({
                "strand_name": strand_name,
                "essential_learning_outcomes": elos,
            })
        else:
            # Even without ELOs, try to get some content
            scos = extract_scos(strand_text, subject)
            if scos:
                result["strands"].append({
                    "strand_name": strand_name,
                    "essential_learning_outcomes": [{
                        "elo_code": "ELO-1",
                        "elo_description": f"{strand_name} curriculum outcomes",
                        "specific_curriculum_outcomes": scos,
                    }],
                })

    return result


def process_kindergarten_guidelines(pdf_path: Path) -> list:
    """Process the OHPC Kindergarten Guidelines PDF which has a different structure.
    Returns multiple result dicts (one per subject section)."""
    print(f"  Processing: {pdf_path.name} (Kindergarten Guidelines)")
    # This is a reference document - skip for now as kindergarten is unit-based
    # and the unit PDFs are the primary source
    return []


def main():
    """Process all curriculum PDFs and write JSON files."""
    print(f"PDF source directory: {PDF_DIR}")
    print(f"Output directory: {OUTPUT_DIR}")
    print()

    if not PDF_DIR.exists():
        print(f"ERROR: PDF directory not found: {PDF_DIR}")
        return

    # Only process Grade 6 PDFs (Grades 1-5 and Kindergarten already have JSON)
    # Set PROCESS_ALL = True to re-extract everything
    PROCESS_ALL = False
    PROCESS_GRADES = {"6"}  # Only Grade 6 by default

    pdf_files = sorted(PDF_DIR.glob("*.pdf"))
    processed = 0
    skipped = 0

    for pdf_path in pdf_files:
        filename = pdf_path.name

        # Skip kindergarten guidelines (reference doc, not unit-based)
        if "Guidelines" in filename or "guidelines" in filename:
            print(f"  Skipping guidelines doc: {filename}")
            continue

        if filename not in FILE_META:
            print(f"  Skipping unknown file: {filename}")
            continue

        grade, subject = FILE_META[filename]

        # Check if we should process this file
        grade_num = re.search(r'\d+', grade)
        grade_num = grade_num.group() if grade_num else "K"

        if not PROCESS_ALL and grade_num not in PROCESS_GRADES:
            skipped += 1
            continue

        # Check if output already exists (skip if not forcing re-extraction)
        output_name = filename.replace(".pdf", "_curriculum.json")
        output_path = OUTPUT_DIR / output_name

        if output_path.exists() and not PROCESS_ALL:
            print(f"  Output exists, skipping: {output_name}")
            skipped += 1
            continue

        result = process_pdf(pdf_path, grade, subject)
        if result:
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            total_scos = sum(
                len(elo.get("specific_curriculum_outcomes", []))
                for strand in result["strands"]
                for elo in strand.get("essential_learning_outcomes", [])
            )
            print(f"    Wrote: {output_name}")
            print(f"    Strands: {len(result['strands'])}, Total SCOs: {total_scos}")
            processed += 1

    print(f"\nDone! Processed: {processed}, Skipped: {skipped}")
    print(f"\nNext step: Run 'python rebuild_curriculum_index.py' to rebuild the index.")


if __name__ == "__main__":
    main()
