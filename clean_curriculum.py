"""
Clean curriculumIndex.json specificOutcomes and essentialOutcomes.
Reads from .bak (original), writes cleaned result.
"""

import json
import re
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

INPUT = Path(__file__).parent / "frontend" / "src" / "data" / "curriculumIndex.json.bak"
OUTPUT = Path(__file__).parent / "frontend" / "src" / "data" / "curriculumIndex.json"


def fix_chars(t: str) -> str:
    for ch in ['Ø', '●', '○', '•']:
        t = t.replace(ch, '-')
    t = re.sub(r'\s{2,}', ' ', t)
    return t.strip()


def strip_headers(t: str) -> str:
    """Strip all known header prefixes, repeatedly."""
    changed = True
    while changed:
        old = t
        for p in [
            r'^Specific Curriculum Outcomes\s*',
            r'^Learners (?:will be|are) (?:expected|able) to:\s*',
            r'^By the end of (?:Grade \w+|Kindergarten),?\s*(?:the )?learners? will be expected to:\s*',
            r'^Students should be able to:\s*',
            r'^Key Skills?(?:/Concepts?)?:\s*',
            r'^The learner will (?:speak and listen|explore|develop):\s*',
        ]:
            t = re.sub(p, '', t, count=1, flags=re.IGNORECASE).strip()
        changed = (t != old)
    return t


def is_noise(t: str) -> bool:
    """Things that are NOT learning outcomes."""
    if not t or len(t) < 5:
        return True
    if re.match(r'^\d+\.?\s*$', t):
        return True
    if re.match(r'^Knowledge:\s*\d+\.\s*$', t, re.IGNORECASE):
        return True
    noise = [
        r'^Additional Useful Content',
        r'^Inclusive Resources and Materials',
        r'^Opportunities for Subject\s*$',
        r'^Integration:',
        r'^Elements from Local\s*$',
        r'^Culture:',
        r'^Specialists:',
        r'^Regional\s*$',
        r'^Wonderwall:',
        r'www\.\w+\.\w+',
        r'https?://',
        r'^(sewing|designs hair|fixes vehicles|provides massages|makes breads)',
        r'^(fishButcher|meatGoods|sewingHair)',
        r'^Goods are objects that satisfy',
        r'^Services are things people do',
        r'^\w+:\s*\d+\.\s*$',  # "Studies: 1."
        r'^\(Note\s',
    ]
    for p in noise:
        if re.search(p, t, re.IGNORECASE):
            return True
    return False


def split_ksv_blocks(text: str) -> list:
    """
    Split text at Knowledge/Skills/Values boundaries.
    "...observation.SkillsObserve objects..." -> ["...observation.", "Skills Observe objects..."]
    """
    parts = re.split(
        r'(?<=[\.\!\?])\s*(?=(Knowledge|Skills?|Values?|Attitudes?(?:/Values?)?)[\s:\-A-Z])',
        text, flags=re.IGNORECASE
    )
    result = []
    for p in parts:
        p = p.strip()
        if p and not re.match(r'^(Knowledge|Skills?|Values?|Attitudes?(?:/Values?)?)$', p, re.IGNORECASE):
            result.append(p)
    return result if len(result) > 1 else [text]


def handle_g1_social_studies_ksv(lines: list) -> list:
    """
    Handle: "K -text.S" / "text V" / "text" pattern.
    Split trailing K/S/V labels from line ends and apply as prefix to next line.
    """
    expanded = []
    pending = None

    for line in lines:
        # Check for trailing K/S/V (e.g., "...nationV", "...adults V", "...is.S")
        m = re.match(r'^(.+?)[\s.]*([KSV])\s*$', line)
        if m:
            content = m.group(1).strip().rstrip('.')
            if content:
                content += '.'
            label = m.group(2)
            # Verify it's actually a label, not part of a word ending in K/S/V
            # Heuristic: the char before the label should be space, period, or lowercase
            raw_before_label = m.group(1).rstrip()
            if raw_before_label and raw_before_label[-1] in (' ', '.', '!', '?') or \
               (raw_before_label and raw_before_label[-1].islower()):
                if pending:
                    content = f"{pending}: {content.lstrip('-: ').strip()}"
                    pending = None
                if content and len(content) > 3:
                    expanded.append(content)
                pending = label
                continue

        # Apply pending prefix
        if pending:
            line = f"{pending}: {line.lstrip('-: ').strip()}"
            pending = None

        expanded.append(line)

    # Merge bare K/S/V lines with next
    merged = []
    i = 0
    while i < len(expanded):
        t = expanded[i].strip()
        if re.match(r'^[KSV]\s*$', t) and i + 1 < len(merged):
            merged.append(f"{t.strip()}: {expanded[i+1].lstrip('-: ').strip()}")
            i += 2
        else:
            merged.append(t)
            i += 1

    return merged


def normalize_prefix(t: str) -> str:
    """
    Normalize various prefix formats:
    "K -text" -> "K: text"
    "EDM Knowledge -1- text" -> "K1: text"
    "3-CP-K-1 - text" -> "3-CP-K-1: text"
    "Knowledge text" -> "K: text"
    "Skills * text" -> "S: text"
    """
    # Grade 3+ coded format: "3-CP-K-1 - Identify..."
    m = re.match(r'^(\d+-\w+-[KSV]-?\d+)\s*[-:]\s*(.+)', t)
    if m:
        return f"{m.group(1)}: {m.group(2).strip()}"
    # "3 CP S-3 - text" with spaces
    m = re.match(r'^(\d+)\s+(\w+)\s+([KSV])-?(\d+)\s*[-:]\s*(.+)', t)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}-{m.group(4)}: {m.group(5).strip()}"

    # EDM-style: "EDM Knowledge -1- text" or "EDM- Skills-3-text"
    m = re.match(
        r'^(?:\w{2,5}[\s-]*)?\s*(Knowledge|Skills?|Values?|Attitudes?(?:/Values?)?)'
        r'[\s:*\-]*(\d+)?[\s:*\-]*(.+)',
        t, re.IGNORECASE
    )
    if m and m.group(3).strip() and len(m.group(3).strip()) > 3:
        cat = m.group(1)[0].upper()
        if m.group(1).lower().startswith('attitude'):
            cat = 'V'
        num = m.group(2) or ''
        content = m.group(3).strip().lstrip('-*').strip()
        return f"{cat}{num}: {content}"

    # Simple "K -text" / "K: text" / "K-text"
    m = re.match(r'^([KSV])\s*[-:]\s*(.+)', t)
    if m and len(m.group(2).strip()) > 3:
        return f"{m.group(1)}: {m.group(2).strip()}"

    return t


def split_numbered_concat(text: str) -> list:
    """
    Split concatenated numbered items: "...data.2." "...interview.3."
    Pattern: text ending with period, then a number followed by period.
    e.g., "Ask questions to collect data.2." should become just "Ask questions to collect data."
    and the "2." is just a stray number.

    Also: "sentence1.sentence2.sentence3." with more than 200 chars - split on sentence boundaries.
    """
    # Remove trailing stray numbers: "data.2." -> "data."
    text = re.sub(r'\.\s*\d+\.\s*$', '.', text)
    # Remove leading stray numbers: "1. Ask questions" -> keep as is (that's fine)
    return [text]


def clean_specific_outcomes(outcomes: list, page: dict) -> list:
    if not outcomes:
        return outcomes

    # Phase 1: Fix chars + strip headers
    phase1 = []
    for raw in outcomes:
        t = fix_chars(raw)
        t = strip_headers(t)
        if not t or is_noise(t):
            continue
        phase1.append(t)

    # Phase 2: Split K-S-V compound blocks
    phase2 = []
    for t in phase1:
        parts = split_ksv_blocks(t)
        phase2.extend(parts)

    # Phase 3: Handle K/S/V at line boundaries
    phase3 = handle_g1_social_studies_ksv(phase2)

    # Phase 4: Normalize prefixes, merge fragments, clean
    cleaned = []
    for t in phase3:
        t = t.strip()
        if not t or is_noise(t):
            continue

        # Remove trailing asterisks and stray numbers
        t = t.rstrip('*').strip()
        t = re.sub(r'\.\s*\d+\.\s*$', '.', t)

        # Normalize prefix
        t = normalize_prefix(t)

        # Clean formatting
        t = re.sub(r'\s{2,}', ' ', t)

        # Merge sub-bullets into previous
        if t.startswith(('- ', '* ')) and cleaned:
            cleaned[-1] = cleaned[-1].rstrip('.') + '; ' + t.lstrip('-* ').strip()
            continue

        # Merge lowercase short continuations into previous
        if t and t[0].islower() and len(t) < 60 and cleaned:
            cleaned[-1] = cleaned[-1].rstrip('.') + '; ' + t
            continue

        # Skip very short non-prefixed items (likely examples like "She runs, We run")
        if len(t) < 20 and not re.match(r'^(\d+\.\d+|[KSV]\d*:|[\w]+-\w+-[KSV])', t):
            if cleaned:
                cleaned[-1] = cleaned[-1].rstrip('.') + ' (e.g., ' + t + ')'
            continue

        cleaned.append(t)

    return cleaned


def clean_essential_outcomes(outcomes: list) -> list:
    if not outcomes:
        return outcomes
    cleaned = []
    for raw in outcomes:
        t = fix_chars(raw)
        if not t or re.match(r'^\d+\.?\s*$', t):
            continue
        t = strip_headers(t)
        if not t or len(t) < 5:
            continue
        t = re.sub(r'\s{2,}', ' ', t)
        cleaned.append(t)
    return cleaned


def main():
    print(f"Reading from backup: {INPUT}")
    with open(INPUT, 'r', encoding='utf-8') as f:
        data = json.load(f)

    pages = data.get('indexedPages', [])
    so_before = sum(len(p.get('specificOutcomes', [])) for p in pages)
    eo_before = sum(len(p.get('essentialOutcomes', [])) for p in pages)

    for page in pages:
        page['specificOutcomes'] = clean_specific_outcomes(
            page.get('specificOutcomes', []), page
        )
        page['essentialOutcomes'] = clean_essential_outcomes(
            page.get('essentialOutcomes', [])
        )

    so_after = sum(len(p.get('specificOutcomes', [])) for p in pages)
    eo_after = sum(len(p.get('essentialOutcomes', [])) for p in pages)

    print(f"\nSpecific Outcomes: {so_before} -> {so_after} ({so_before - so_after} removed)")
    print(f"Essential Outcomes: {eo_before} -> {eo_after} ({eo_before - eo_after} removed)")

    # Stats
    with_prefix = sum(
        1 for p in pages for o in p.get('specificOutcomes', [])
        if re.match(r'^(\d+\.\d+\s|[KSV]\d*:\s|\d+-\w+-[KSV])', o)
    )
    total = so_after
    print(f"\nWith structured prefix: {with_prefix}/{total} ({round(with_prefix/total*100)}%)")

    # Samples
    for sid in [
        'grade1-social-studies-civic-participation',
        'grade1-mathematics-data-probability',
        'grade1-language-arts-listening-speaking',
        'grade2-social-studies-economic-decision-making',
        'grade3-social-studies-civic-participation',
        'grade1-science-space-systems',
    ]:
        p = next((p for p in pages if p['id'] == sid), None)
        if p:
            print(f"\n--- {sid} ({len(p['specificOutcomes'])} outcomes) ---")
            for o in p['specificOutcomes'][:6]:
                print(f"  {o[:140]}")
            if len(p['specificOutcomes']) > 6:
                print(f"  ...")

    print(f"\nWriting to {OUTPUT}...")
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Done!")


if __name__ == '__main__':
    main()
