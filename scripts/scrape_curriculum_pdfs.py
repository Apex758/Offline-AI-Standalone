"""
Scrape curriculum PDFs and extract ELOs/SCOs into structured JSON.
Updates curriculumIndex.json with proper eloGroups.
"""
import os
import re
import json
import pdfplumber

PDF_DIR = r"C:\Users\LG\Desktop\Projects\Offline AI Standalone\Delon Curriculum Docs"
JSON_PATH = r"C:\Users\LG\Desktop\Projects\Offline AI Standalone\frontend\src\data\curriculumIndex.json"

def extract_text_from_pdf(pdf_path):
    """Extract all text from a PDF."""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def identify_subject(filename):
    """Identify subject type from filename."""
    if "language-arts" in filename:
        return "language-arts"
    elif "mathematics" in filename:
        return "mathematics"
    elif "science" in filename:
        return "science"
    elif "social-studies" in filename:
        return "social-studies"
    elif "kindergarten" in filename:
        return "kindergarten-unit"
    return "unknown"

def extract_grade(filename):
    """Extract grade from filename."""
    m = re.match(r'(grade\d+|kindergarten)', filename)
    return m.group(1) if m else "unknown"

def parse_language_arts(text, grade):
    """Parse Language Arts curriculum - ELOs numbered, SCOs like 1.1, 2.1 etc."""
    strands = {}

    # Find ELOs - typically "ELO 1:", "ELO 2:" etc
    elo_pattern = r'ELO\s*(\d+)\s*[:\.]\s*(.+?)(?=ELO\s*\d+|$)'

    # Find SCOs - typically numbered like "1.1", "2.3" etc
    sco_pattern = r'(\d+\.\d+)\s+(.+?)(?=\d+\.\d+\s|\n\n|ELO\s*\d+|$)'

    # Try to identify strands
    strand_markers = {
        "listening-speaking": ["Listening", "Speaking", "Strand 1", "STRAND 1"],
        "reading-viewing": ["Reading", "Viewing", "Strand 2", "STRAND 2"],
        "writing-representing": ["Writing", "Representing", "Strand 3", "STRAND 3"]
    }

    return parse_generic(text, grade, "language-arts", strand_markers)

def parse_mathematics(text, grade):
    """Parse Mathematics curriculum - ELOs like 1.1, 2.1 etc."""
    strand_markers = {
        "number-sense": ["Number Sense", "NUMBER SENSE"],
        "operations-with-numbers": ["Operations with Numbers", "OPERATIONS WITH NUMBERS", "Operations With Numbers"],
        "patterns-relationships": ["Patterns and Relationships", "PATTERNS AND RELATIONSHIPS", "Patterns & Relationships"],
        "geometrical-thinking": ["Geometrical Thinking", "GEOMETRICAL THINKING", "Geometry"],
        "measurement": ["Measurement", "MEASUREMENT"],
        "data-probability": ["Data Handling", "DATA HANDLING", "Data and Probability", "DATA AND PROBABILITY"]
    }
    return parse_generic(text, grade, "mathematics", strand_markers)

def parse_science(text, grade):
    """Parse Science curriculum - ELOs numbered, SCOs in K/S/V format."""
    # Science strands vary by grade, so we need to detect them from the text
    return parse_science_generic(text, grade)

def parse_social_studies(text, grade):
    """Parse Social Studies curriculum - SCOs in K/S/V format."""
    strand_markers = {
        "civic-participation": ["Civic Participation", "CIVIC PARTICIPATION"],
        "economic-decision-making": ["Economic Decision", "ECONOMIC DECISION"],
        "historical-cultural-thinking": ["Historical", "HISTORICAL"],
        "spatial-thinking": ["Spatial Thinking", "SPATIAL THINKING", "Weather", "WEATHER"]
    }
    return parse_generic(text, grade, "social-studies", strand_markers)

def clean_text(t):
    """Clean extracted text."""
    t = re.sub(r'\s+', ' ', t).strip()
    # Remove page numbers, headers, footers
    t = re.sub(r'Page \d+ of \d+', '', t)
    t = re.sub(r'OECS\s+OHPC', '', t)
    return t.strip()

def find_elos_in_text(text):
    """Find all ELO definitions in text."""
    elos = []
    # Pattern 1: "ELO 1:" or "ELO 1.1:" style
    pattern1 = re.compile(r'ELO\s*(\d+(?:\.\d+)?)\s*[:\-\.]\s*(.+?)(?=ELO\s*\d+|Essential Learning Outcome|$)', re.IGNORECASE | re.DOTALL)
    # Pattern 2: "Essential Learning Outcome 1:" style
    pattern2 = re.compile(r'Essential Learning Outcome\s*(\d+(?:\.\d+)?)\s*[:\-\.]\s*(.+?)(?=Essential Learning Outcome|ELO|$)', re.IGNORECASE | re.DOTALL)

    for m in pattern1.finditer(text):
        num = m.group(1)
        desc = clean_text(m.group(2).split('\n')[0])
        if len(desc) > 10:
            elos.append((num, desc))

    if not elos:
        for m in pattern2.finditer(text):
            num = m.group(1)
            desc = clean_text(m.group(2).split('\n')[0])
            if len(desc) > 10:
                elos.append((num, desc))

    return elos

def find_scos_in_text(text, subject_type):
    """Find all SCOs in text based on subject type."""
    scos = []

    if subject_type in ["science", "social-studies"]:
        # K/S/V format
        patterns = [
            r'K\s*(\d+)\s*[:\.\-]\s*(.+?)(?=K\s*\d+|S\s*\d+|V\s*\d+|ELO|$)',
            r'S\s*(\d+)\s*[:\.\-]\s*(.+?)(?=K\s*\d+|S\s*\d+|V\s*\d+|ELO|$)',
            r'V\s*(\d+)\s*[:\.\-]\s*(.+?)(?=K\s*\d+|S\s*\d+|V\s*\d+|ELO|$)',
        ]
        for p in patterns:
            prefix = p[0]  # K, S, or V
            for m in re.finditer(p, text, re.DOTALL):
                num = m.group(1)
                desc = clean_text(m.group(2))
                if len(desc) > 5:
                    scos.append(f"{prefix}{num}: {desc}")

    elif subject_type == "language-arts":
        # Numbered SCOs like 1.1, 2.3
        for m in re.finditer(r'(\d+\.\d+)\s+(.+?)(?=\d+\.\d+\s|\n\n|ELO|$)', text, re.DOTALL):
            num = m.group(1)
            desc = clean_text(m.group(2))
            if len(desc) > 5:
                scos.append(f"{num} {desc}")

    elif subject_type == "mathematics":
        # Bullet point SCOs under each ELO
        # These are typically sentences starting with verbs
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            # Skip empty lines, headers, ELO lines
            if not line or len(line) < 10:
                continue
            if re.match(r'ELO\s', line, re.IGNORECASE):
                continue
            # Look for bullet-like items
            cleaned = re.sub(r'^[\u2022\u2023\u25E6\u2043\u2219\-\*]\s*', '', line)
            cleaned = re.sub(r'^\d+[\.\)]\s*', '', cleaned)
            if len(cleaned) > 10 and cleaned[0].isupper():
                scos.append(cleaned)

    return scos

def parse_generic(text, grade, subject, strand_markers):
    """Generic parser that tries to split text into strands and extract ELOs/SCOs."""
    results = {}

    # Split text by strand markers
    strand_positions = []
    for strand_key, markers in strand_markers.items():
        for marker in markers:
            pos = text.lower().find(marker.lower())
            if pos != -1:
                strand_positions.append((pos, strand_key, marker))
                break

    strand_positions.sort(key=lambda x: x[0])

    for i, (pos, strand_key, marker) in enumerate(strand_positions):
        end_pos = strand_positions[i + 1][0] if i + 1 < len(strand_positions) else len(text)
        strand_text = text[pos:end_pos]

        page_id = f"{grade}-{subject}-{strand_key}"
        elos = find_elos_in_text(strand_text)
        scos = find_scos_in_text(strand_text, subject)

        if elos or scos:
            results[page_id] = {
                "essentialOutcomes": [f"ELO {num}: {desc}" for num, desc in elos],
                "specificOutcomes": scos,
                "eloGroups": []
            }

    return results

def parse_science_generic(text, grade):
    """Parse science PDFs which have varying strand names."""
    results = {}

    # Try to find strand/topic boundaries
    # Science strands are usually introduced with their full names
    # Look for ELO patterns and group them
    elo_positions = []
    for m in re.finditer(r'ELO[\s\-]*(\d+(?:\.\d+)?)\s*[:\-\.]\s*(.+)', text, re.IGNORECASE):
        elo_positions.append((m.start(), m.group(1), clean_text(m.group(2))))

    if elo_positions:
        print(f"  Found {len(elo_positions)} ELOs in science text")

    return results

def process_pdf(pdf_path, filename):
    """Process a single PDF and return extracted data."""
    print(f"\nProcessing: {filename}")
    text = extract_text_from_pdf(pdf_path)

    if not text.strip():
        print(f"  WARNING: No text extracted from {filename}")
        return {}

    print(f"  Extracted {len(text)} characters")

    grade = extract_grade(filename)
    subject = identify_subject(filename)

    print(f"  Grade: {grade}, Subject: {subject}")

    if subject == "language-arts":
        return parse_language_arts(text, grade)
    elif subject == "mathematics":
        return parse_mathematics(text, grade)
    elif subject == "science":
        return parse_science(text, grade)
    elif subject == "social-studies":
        return parse_social_studies(text, grade)

    return {}

def dump_pdf_text(pdf_path, output_dir):
    """Dump raw text from PDF to a text file for manual inspection."""
    filename = os.path.basename(pdf_path).replace('.pdf', '.txt')
    text = extract_text_from_pdf(pdf_path)
    output_path = os.path.join(output_dir, filename)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"  Dumped {len(text)} chars to {filename}")
    return text

def main():
    # First, let's dump all PDFs to text files for inspection
    output_dir = os.path.join(os.path.dirname(PDF_DIR), "curriculum_text_dumps")
    os.makedirs(output_dir, exist_ok=True)

    pdf_files = sorted([f for f in os.listdir(PDF_DIR) if f.endswith('.pdf')])
    print(f"Found {len(pdf_files)} PDF files")

    for pdf_file in pdf_files:
        pdf_path = os.path.join(PDF_DIR, pdf_file)
        dump_pdf_text(pdf_path, output_dir)

    print(f"\nAll text dumps saved to: {output_dir}")
    print("Review the text files and use the targeted updater scripts to update curriculumIndex.json")

if __name__ == "__main__":
    main()
