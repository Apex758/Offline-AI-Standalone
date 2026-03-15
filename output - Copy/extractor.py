import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

PROJECT_ROOT = Path(__file__).parent
INPUT_DIR = PROJECT_ROOT / "input"
OUTPUT_DIR = PROJECT_ROOT / "output"
OUTPUT_DIR.mkdir(exist_ok=True)


def normalize(text: str) -> str:
    """Clean up whitespace and special characters"""
    return " ".join(text.replace("\xa0", " ").split()).strip()


def clean_text_encoding(text: str) -> str:
    """Fix common HTML encoding issues"""
    replacements = {
        'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢': "'",
        'ÃƒÂ¢Ã¢â€šÂ¬Ã…"': '"',
        'ÃƒÂ¢Ã¢â€šÂ¬': '"',
        'ÃƒÂ¢Ã¢â‚¬"': '•',
        'ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢': '•',
        '\u2019': "'",
        '\u201c': '"',
        '\u201d': '"',
        '\u2022': '•',
        '\u2013': '-',
        '\u2014': '—',
    }
    
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    return text

def clean_resource_text(text: str) -> str:
    """Remove junk artifacts and extra whitespace from resource text."""
    # Remove image markers like IMG:page:11:1
    text = re.sub(r'IMG:page:\d+(:\d+)*', '', text)
    # Remove strings that are just page numbers or separators
    if re.match(r'^\d+$', text.strip()) or re.match(r'^-+$', text.strip()):
        return ""
    return " ".join(text.split())

def classify_resource_type(text: str, links: list) -> str:
    """Determine the type of resource based on content and links."""
    text_lower = text.lower()
    
    # Check links first
    for link in links:
        url = link.get('url', '').lower()
        if 'youtube.com' in url or 'youtu.be' in url:
            return "Videos"
        if url.endswith('.pdf'):
            return "Documents/PDFs"
        if any(ext in url for ext in ['.jpg', '.png', '.jpeg', 'pinterest']):
            return "Images/Visuals"
    
    # Check text content
    if any(x in text_lower for x in ['video', 'watch', 'clip']):
        return "Videos"
    if any(x in text_lower for x in ['read', 'book', 'article', 'text', 'pdf']):
        return "Reading/Texts"
    if any(x in text_lower for x in ['game', 'activity', 'checklist', 'worksheet', 'rubric']):
        return "Activities/Tools"
    
    # Default
    return "Websites" if links else "Teacher Materials"

# ===========================================================================
# RESOURCE CLEANUP PIPELINE
# Runs after initial categorization inside organize_strand_resources().
# Fixes seven classes of noise in the raw extracted output:
#   1. Shell items     – section headers/labels with no content or links
#   2. Duplicates      – same text appearing multiple times across categories
#   3. Mega-blobs      – multiple numbered resources crammed into one item
#   4. Preamble blobs  – ELO intros bundling 3+ links, descs still concatenated
#   5. Misclassified   – items in the wrong category bucket
#   6. Fragments       – strategy tables shattered into header + desc pairs
#   7. Editorial notes – embedded author comments like "Please remove..."
# ===========================================================================

# --- 1. SHELL FILTER ----------------------------------------------------------
# Items that are section labels, activity-type headers, or orphan fragments
# with no actionable content or links.

SHELL_PHRASES = {
    # Section / resource headers that leaked through as items
    "elements from local culture",
    "resources for a learner who is struggling",
    "opportunities for subject integration",
    "teacher resources and strategic guidance",
    "additional useful content knowledge for the teacher",
    "resources and integration guidance",
    "resources and strategies for listening and speaking",
    "listening and speaking strategies / integration",
    "integration strategy",
    "instructional resources",
    "content area",
    "storyboarding",
    "resources",
    "website",
    "digital/printed resource",
    "speaking",
    "strategies",
    "strategy description",
    "comprehensive strategies",
    # Activity-type labels with no description attached
    "role-playing scenarios",
    "information sharing sessions",
    "peer teaching",
    "self-reflection",
    "peer reflection",
    "project-based learning",
    "collaborative learning",
    # Strategy-table row-headers (orphaned halves; the merge pass below
    # reassembles them first — this is belt-and-suspenders for any stragglers)
    "retelling",
    "connecting",
    "visualising",
    "predicting",
    "recognizing literal meaning",
    "making inferences",
    "identifying main idea",
    "drawing conclusions",
    "analysing reasoning",
    "finding evidence",
    # Bullet fragments that broke off from "Listening centres provide opportunities"
    "for technology integration",
    "to cater for different learning abilities in the classroom",
    "enhance listening and speaking activities",
    # Boilerplate / meta
    "scan the qr code to view the picture",
    "organisation of eastern caribbean states grade 5 language arts curriculum",
    "video creator for schools",
    "reading across the curriculum",
}


def _is_shell(item: dict) -> bool:
    """True if the item is a header/label with no real content."""
    desc = item["description"].strip().rstrip(":").lower()
    if desc in SHELL_PHRASES:
        return True
    # Very short items with no links are almost always orphan labels
    if len(item["description"].strip()) < 25 and not item.get("links"):
        return True
    return False


# --- 2. CROSS-CATEGORY DEDUPLICATION ------------------------------------------

def _deduplicate_resources(resources: dict) -> dict:
    """Remove duplicates within AND across categories in one strand."""
    seen_global = set()
    cleaned = {}
    for category, items in resources.items():
        unique = []
        for item in items:
            # First 200 chars is long enough to catch near-duplicates
            key = item["description"][:200].strip()
            if key in seen_global:
                continue
            seen_global.add(key)
            unique.append(item)
        if unique:
            cleaned[category] = unique
    return cleaned


# --- 3. MEGA-BLOB SPLITTER ----------------------------------------------------
# Handles items where multiple numbered resources with inline URLs got
# concatenated into one string (e.g. a table cell containing Folk Songs,
# National Anthems, and National Symbols all run together).

def _split_mega_blob(item: dict) -> list:
    desc = item["description"]
    links = item.get("links", [])

    url_count = len(re.findall(r'https?://\S+', desc))
    if len(links) < 3 and url_count < 2:
        return [item]  # nothing to split

    # Insert newlines before numbered-entry boundaries
    # "...Folk song4. https://" -> "...Folk song\n4. https://"
    normalised = re.sub(
        r'(?<=[a-zA-Z\.\s])(\d+\.)\s*(https?://)',
        r'\n\1 \2',
        desc
    )
    # Split on known mid-blob section headers
    for header in ["National Anthems", "National Symbols",
                   "Celebrations and Festivals", "Folk Songs"]:
        normalised = normalised.replace(header, f"\n{header}\n")

    lines = [l.strip() for l in normalised.split("\n") if l.strip()]
    link_lookup = {link["url"]: link for link in links}

    results = []
    for line in lines:
        # Pure section headers — skip, don't emit
        if line in ["National Anthems", "National Symbols",
                    "Celebrations and Festivals", "Folk Songs"]:
            continue

        # Match URLs present in this line
        urls_in_line = re.findall(r'(https?://\S+)', line)
        matched_links = []
        for url in urls_in_line:
            url_clean = url.rstrip('.,;)')
            matched_links.append(
                link_lookup.get(url_clean, {"text": url_clean, "url": url_clean})
            )

        # Strip URLs and leading numbering from the description
        clean_desc = line
        for url in urls_in_line:
            clean_desc = clean_desc.replace(url, "").strip()
        clean_desc = re.sub(r'^\d+\.\s*', '', clean_desc).strip(' -•*')

        if not clean_desc and not matched_links:
            continue
        if not clean_desc and matched_links:
            clean_desc = matched_links[0].get("text", matched_links[0]["url"])

        results.append({
            "description": clean_desc,
            "links": matched_links,
            "original_section": item.get("original_section", "")
        })

    return results if results else [item]


# --- 4. PREAMBLE-BLOB SPLITTER ------------------------------------------------
# Handles items where BS4 pulled all <a> links into links[] but the per-link
# description text stayed concatenated, separated by double-spaces (the gaps
# where <a> tags used to sit).  The first segment is typically an ELO preamble
# and gets discarded; each subsequent segment pairs with the next link in order.

def _split_preamble_blob(item: dict) -> list:
    desc = item["description"]
    links = item.get("links", [])

    segments = [s.strip() for s in desc.split("  ") if s.strip()]
    if len(segments) <= 1:
        return [item]

    # Drop the preamble segment if present
    preamble_markers = ["elo ", "learner", "the following suggested"]
    start_idx = 0
    if segments and any(segments[0].lower().startswith(m) for m in preamble_markers):
        start_idx = 1

    results = []
    link_idx = 0
    for seg in segments[start_idx:]:
        seg = seg.strip(" •-*")
        if not seg:
            continue

        link = links[link_idx] if link_idx < len(links) else None
        link_idx += 1

        # Clean any trailing text BS4 concatenated onto the URL
        # (e.g. "...curriculumThis" where "This" bled from adjacent text)
        if link:
            url_match = re.match(
                r'(https?://[A-Za-z0-9\-._~:/?#\[\]@!$&\'()*+,;=%]+)',
                link["url"]
            )
            if url_match:
                clean_url = re.sub(r'[A-Z][a-z]*$', '', url_match.group(1))
                link = {"text": link.get("text", ""), "url": clean_url}

        results.append({
            "description": seg,
            "links": [link] if link else [],
            "original_section": item.get("original_section", "")
        })

    return results if results else [item]


# --- 5. RECLASSIFY ------------------------------------------------------------

def _reclassify(item: dict) -> str | None:
    """Return corrected category if the item is misclassified, else None."""
    desc_lower = item["description"].lower()
    all_urls = [l.get("url", "") for l in item.get("links", [])]

    # liveworksheets.com is an activity platform, not a video
    if any("liveworksheet" in u for u in all_urls):
        return "Activities/Tools"

    # Image filenames in description -> Images/Visuals
    if re.search(r'\b\w+\.(jpg|jpeg|png|gif)\b', desc_lower) and not any(
        x in desc_lower for x in ["video", "read", "book", "article"]
    ):
        return "Images/Visuals"

    return None


# --- 6. FRAGMENT MERGER -------------------------------------------------------
# Two patterns appear in the raw output:
#   A) A two-column strategy table extracted as alternating single-word headers
#      and their descriptions: "Retelling", "Learners retelling...", ...
#   B) A bullet list whose items each became separate resource entries:
#      "Listening centres provide opportunities:", "for technology integration", ...

_STRATEGY_HEADERS = {
    "retelling", "connecting", "visualising", "predicting",
    "recognizing literal meaning", "making inferences",
    "identifying main idea", "drawing conclusions",
    "analysing reasoning", "finding evidence",
}

_LISTENING_BULLET_STARTS = [
    "for technology integration",
    "to cater for different learning abilities",
    "to allow teachers to tailor",
    "enhance listening and speaking activities",
]


def _merge_strategy_fragments(items: list) -> list:
    merged = []
    i = 0
    while i < len(items):
        desc = items[i]["description"].strip().rstrip(":")
        desc_lower = desc.lower()

        # Pattern A: strategy header + next item is its description
        if desc_lower in _STRATEGY_HEADERS and i + 1 < len(items):
            next_desc = items[i + 1]["description"].strip()
            merged.append({
                "description": f"{desc}: {next_desc}",
                "links": items[i].get("links", []) + items[i + 1].get("links", []),
                "original_section": items[i].get("original_section", "")
            })
            i += 2
            continue

        # Pattern B: "Listening centres..." + scattered bullet fragments
        if ("listening centres provide opportunities" in desc_lower
                or "listing centres provide opportunities" in desc_lower):
            bullet_texts = [desc]
            j = i + 1
            while j < len(items):
                next_lower = items[j]["description"].strip().lower()
                if any(next_lower.startswith(m) for m in _LISTENING_BULLET_STARTS):
                    bullet_texts.append(items[j]["description"].strip())
                    j += 1
                else:
                    break
            merged.append({
                "description": " ".join(bullet_texts),
                "links": [],
                "original_section": items[i].get("original_section", "")
            })
            i = j
            continue

        merged.append(items[i])
        i += 1

    return merged


# --- 7. EDITORIAL NOTE STRIPPER -----------------------------------------------

def _strip_editorial_notes(item: dict) -> dict:
    """Remove embedded author comments like 'Please remove these links...'"""
    item["description"] = re.sub(
        r'\s*Please remove[^.]*\.?', '', item["description"], flags=re.IGNORECASE
    ).strip()
    return item


# --- 8. ELO-PREAMBLE FILTER ---------------------------------------------------
# Items like "ELO 1 focuses on allowing learners to..." just restate what's
# already in elo_description.  Remove unless they carry links (in which case
# the preamble-blob splitter above breaks them into useful pieces).

def _is_elo_preamble(item: dict) -> bool:
    if not re.match(r'^(ELO \d+|Learner[s]? will be expected to)',
                    item["description"], re.IGNORECASE):
        return False
    return len(item.get("links", [])) == 0


# --- MASTER PIPELINE ----------------------------------------------------------
# Order is intentional:
#   1  Strip editorial notes   (text mutation — do first so later checks see clean text)
#   2  Remove link-less ELO preambles
#   3  Merge strategy fragments (BEFORE shell filter — the headers look like shells
#                                 but are needed as merge targets)
#   4  Shell filter
#   5  Split mega-blobs         (numbered-URL concatenations)
#   6  Split preamble-blobs     (ELO intros with 3+ links, double-space separated)
#   7  Reclassify misplaced items
#   8  Cross-category deduplication

def _clean_resources(resources: dict) -> dict:
    if not resources:
        return resources

    # 1 — editorial notes
    for cat in resources:
        resources[cat] = [_strip_editorial_notes(item) for item in resources[cat]]

    # 2 — link-less ELO preambles
    for cat in list(resources.keys()):
        resources[cat] = [item for item in resources[cat] if not _is_elo_preamble(item)]

    # 3 — merge strategy fragments (before shell filter)
    if "Teacher Materials" in resources:
        resources["Teacher Materials"] = _merge_strategy_fragments(
            resources["Teacher Materials"]
        )

    # 4 — shells
    for cat in list(resources.keys()):
        resources[cat] = [item for item in resources[cat] if not _is_shell(item)]

    # 5 — mega-blob split
    for cat in list(resources.keys()):
        expanded = []
        for item in resources[cat]:
            expanded.extend(_split_mega_blob(item))
        resources[cat] = expanded

    # 6 — preamble-blob split (3+ links, double-space-separated descriptions)
    for cat in list(resources.keys()):
        expanded = []
        for item in resources[cat]:
            if len(item.get("links", [])) >= 3 and "  " in item["description"]:
                expanded.extend(_split_preamble_blob(item))
            else:
                expanded.append(item)
        resources[cat] = expanded

    # 7 — reclassify (collect moves first, apply in reverse so indices stay valid)
    moves = []
    for cat in list(resources.keys()):
        for idx, item in enumerate(resources[cat]):
            new_cat = _reclassify(item)
            if new_cat and new_cat != cat:
                moves.append((cat, idx, new_cat, item))
    for from_cat, idx, to_cat, item in reversed(moves):
        resources[from_cat].pop(idx)
        resources.setdefault(to_cat, []).append(item)

    # 8 — cross-category dedup
    resources = _deduplicate_resources(resources)

    # Remove empty categories
    return {k: v for k, v in resources.items() if v}


def organize_strand_resources(raw_resources: list) -> dict:
    """Clean, merge, and categorize a flat list of resources."""
    cleaned = {
        "Videos": [],
        "Reading/Texts": [],
        "Activities/Tools": [],
        "Websites": [],
        "Images/Visuals": [],
        "Documents/PDFs": [],
        "Teacher Materials": []
    }
    
    # Temporary storage to merge orphaned links with previous descriptions
    processed_items = []
    
    for res in raw_resources:
        text = clean_resource_text(res.get('text', ''))
        links = res.get('links', [])
        section = res.get('section', '')
        
        if not text and not links:
            continue
            
        # Skip generic headers that got caught as resources
        if text.lower().strip() in [
            "additional resources and materials", 
            "resource links and descriptions",
            "teacher resources", 
            "links",
            "grade 5 language arts curriculum",
            "grade 1 social studies curriculum", # Added
            "organisation of eastern caribbean states", # Added
            "introduction",
            "category", # Added
            "description", # Added
            "description/activities", # Added
            "integrations (continued)", # Added
            "specific activity", # Added
            "resource type", # Added
            "description and link" # Added
        ]:
            continue

        # Logic to merge "orphan" links with previous text context
        # Example: Text: "Watch this video:" -> Next Item: "https://youtube..."
        if links and not text and processed_items:
            processed_items[-1]['links'].extend(links)
            continue
            
        # Create clean item
        item = {
            "description": text,
            "links": links,
            "original_section": section
        }
        processed_items.append(item)

    # Deduplicate and Categorize
    seen = set()
    
    for item in processed_items:
        # Create a unique key to check for duplicates
        key = item['description'] + str([l['url'] for l in item['links']])
        if key in seen:
            continue
        seen.add(key)
        
        category = classify_resource_type(item['description'], item['links'])
        cleaned[category].append(item)

    # Remove empty categories, then run the full cleanup pipeline
    cleaned = {k: v for k, v in cleaned.items() if v}
    return _clean_resources(cleaned)


def extract_sco_number(text: str) -> tuple:
    """
    REASONING: Extract SCO numbering like "5.1", "6.2" from text.
    
    WHY: Some curricula (Language Arts) don't have explicit "Essential Learning Outcome:" 
    markers. Instead, they use numbered SCOs where the first number indicates the ELO.
    
    PATTERN: "5.1 Generate ideas..." means ELO 5, SCO 1
             "6.1 Analyze text..." means ELO 6, SCO 1 (new ELO!)
    
    Returns: (elo_number, sco_number, cleaned_text)
             e.g., (5, 1, "Generate ideas...") 
             or (None, None, original_text) if no pattern found
    """
    # Look for pattern: optional whitespace + digit(s) + . + digit(s) at start
    match = re.match(r'^\s*(\d+)\.(\d+)\s+(.+)', text)
    
    if match:
        elo_num = int(match.group(1))
        sco_num = int(match.group(2))
        cleaned = match.group(3).strip()
        return (elo_num, sco_num, cleaned)
    
    return (None, None, text)


def split_table_content(text: str) -> list:
    """
    REASONING: Split table cell content into separate items.
    
    WHY: Table cells often contain multiple strategies/assessments separated by bullets
    or other markers. We need to extract each one separately.
    
    HOW: Try multiple splitting strategies in order of specificity.
    """
    text = clean_text_encoding(text)
    
    items = []
    
    # First, check if there's SCO numbering (like 5.1, 5.2 or 3.2.)
    # If so, split on those patterns
    if re.search(r'\d+\.\d+', text):
        # Split on patterns like "5.1 ", "3.2. " — trailing dot is optional
        # because some curricula use "3.2." and others use "3.2"
        parts = re.split(r'(?=\d+\.\d+\.?\s)', text)
        for part in parts:
            part = part.strip()
            if part and len(part) > 3:
                items.append(part)
        if items:  # If we successfully split, return
            return items
    
    # Otherwise, use original bullet-based splitting
    if '•' in text:
        parts = text.split('•')
    elif text.count('- ') > 1:
        parts = text.split('- ')
    else:
        # Split by patterns like "K - ", "S - ", "V - " or "Word: "
        parts = re.split(r'(?=[A-Z] - |[A-Z][a-z]+: )', text)
    
    for part in parts:
        part = part.strip()
        if part and len(part) > 3:
            items.append(part)
    
    return items if items else [text]  # Return original if no splits found


def is_valid_strand_name(text: str) -> bool:
    """Check if text is a valid strand name"""
    text_lower = text.lower()
    
    # Common page headers that aren't strand names
    invalid_phrases = [
        "indexed", ".pdf", "curriculum", "grade 1", "grade 2", "grade 3",
        "grade 4", "grade 5", "grade 6", "social studies", "mathematics",
        "science", "language arts", "organisation of eastern caribbean states", "oecs",
        "page ", "img:page",
        # ADDED: Block resource section headers from being treated as strands
        "additional resources", "useful content knowledge", "inclusive resources",
        "resources and materials", "subject integration", "local culture"
    ]
    
    if any(phrase in text_lower for phrase in invalid_phrases):
        return False
    
    word_count = len(text.split())
    if word_count > 8 or word_count < 2:
        return False
    
    if not text.strip():
        return False
    
    # Known valid strand patterns
    valid_patterns = [
        "thinking", "participation", "spatial", "economic",
        "historical", "cultural", "civic", "geographic",
        "reading", "writing", "listening", "speaking", "representing"
    ]
    
    if any(pattern in text_lower for pattern in valid_patterns):
        return True
    
    if len(text) > 50:
        return False
    
    return True


def is_junk_text(text: str) -> bool:
    """Check if text is junk (page markers, headers, etc.)"""
    text_lower = text.lower().strip()
    
    # Page markers
    if re.match(r'^\d+\s*\|\s*p\s*a\s*g\s*e', text_lower):
        return True
    
    # Image markers
    if text.startswith('IMG:') or text.startswith('img:'):
        return True
    
    # Generic headers
    if text_lower in ['grade 1 social studies curriculum', 'organisation of eastern caribbean states']:
        return True
    
    # Very short text
    if len(text.strip()) < 5:
        return True
    
    return False


def clean_elo_description(text: str) -> str:
    """Clean ELO description but PRESERVE Section info if present"""
    clean_text = text
    
    # Remove "Essential Learning Outcome(s)" prefix (handles both singular and plural)
    if re.search(r'(?i)Essential Learning Outcomes?', clean_text):
        if ":" in clean_text:
            clean_text = clean_text.split(":", 1)[1].strip()
        else:
            clean_text = re.sub(r'(?i)Essential Learning Outcomes?\s*', '', clean_text).strip()
    
    # Fix: Do NOT remove "Section X" text, as it distinguishes identical ELOs
    # (Previously: if "Section " in text: text = text.split("Section ")[0]...)
    
    # Strip any leading bare number left after prefix removal (e.g. "5 The learner will…")
    clean_text = re.sub(r'^\d+\s+', '', clean_text).strip()
    clean_text = clean_text_encoding(clean_text)
    
    return clean_text


def is_three_column_table(table):
    """Check if table has the three required columns"""
    headers = [normalize(th.get_text()) for th in table.find_all("th")]
    header_text = " ".join(headers).lower()
    
    required = ["specific curriculum outcomes", "inclusive assessment"]
    third_col = ["inclusive learning", "suggested learning"]
    return all(req in header_text for req in required) and any(t in header_text for t in third_col)


def extract_table_data(table):
    """
    REASONING: Extract data from three-column curriculum table.
    
    CRITICAL CHANGE: Now returns a list of row data instead of merging everything.
    This allows us to detect SCO numbering and create ELOs appropriately.
    
    Returns: List of dicts, one per row: [
        {
            "specific_curriculum_outcomes": [...],
            "inclusive_assessment_strategies": [...],
            "inclusive_learning_strategies": [...]
        },
        ...
    ]
    """
    rows_data = []
    
    rows = table.find_all("tr")
    
    for row in rows:
        cells = row.find_all("td")
        
        if len(cells) < 3:
            continue
        
        sco_text = clean_resource_text(normalize(cells[0].get_text()))
        assessment_text = clean_resource_text(normalize(cells[1].get_text()))
        learning_text = clean_resource_text(normalize(cells[2].get_text()))
        
        
        row_data = {
            "specific_curriculum_outcomes": [],
            "inclusive_assessment_strategies": [],
            "inclusive_learning_strategies": []
        }
        
        if sco_text:
            sco_items = split_table_content(sco_text)
            row_data["specific_curriculum_outcomes"].extend(sco_items)
        
        if assessment_text:
            assessment_items = split_table_content(assessment_text)
            row_data["inclusive_assessment_strategies"].extend(assessment_items)
        
        if learning_text:
            learning_items = split_table_content(learning_text)
            row_data["inclusive_learning_strategies"].extend(learning_items)
        
        # Only add if there's actual content
        if (row_data["specific_curriculum_outcomes"] or 
            row_data["inclusive_assessment_strategies"] or 
            row_data["inclusive_learning_strategies"]):
            rows_data.append(row_data)
    
    return rows_data


def is_resource_section_header(text: str) -> tuple:
    """
    Check if text is a resource section header.
    Returns (is_header, section_type)
    """
    text_lower = text.lower().strip()
    
    # Remove trailing colons, dashes for comparison
    text_lower = text_lower.rstrip(':').rstrip('-').strip()
    
    # Main resource sections
    if "useful content knowledge" in text_lower or "content knowledge for the teacher" in text_lower:
        return (True, "teacher_resources")
    
    if "additional resources and materials" in text_lower:
        return (True, "additional_resources")
    
    if "inclusive resources and materials" in text_lower:
        return (True, "inclusive_resources")
    
    if "opportunities for subject integration" in text_lower:
        return (True, "subject_integration")
    
    if "elements from local culture" in text_lower:
        return (True, "local_culture")
    
    if "resources for a learner who is struggling" in text_lower:
        return (True, "struggling_learner_resources")
    
    # Subsections within resources (these should be skipped, not stored as resources)
    subsection_markers = [
        'printed materials', 'internet resources', 'folk songs', 'national anthems', 
        'national symbols', 'celebrations and festivals', 'resource links and descriptions'
    ]
    
    if text_lower in subsection_markers:
        return (True, "subsection")
    
    return (False, None)


def extract_links_from_element(element):
    """Extract all links from an element"""
    links = []
    for a in element.find_all('a', href=True):
        link_text = normalize(a.get_text())
        link_url = a['href']
        if link_url and not link_url.startswith('#'):  # Skip anchor links
            links.append({
                "text": link_text if link_text else link_url,
                "url": link_url
            })
    return links


def extract_resources_for_strand(blocks, start_idx, section_type):
    """
    Extract resources for the current strand starting from a resource section header.
    Returns: (list of resources, next_index_to_process)
    """
    resources = []
    idx = start_idx
    
    # Skip subsection markers
    if section_type == "subsection":
        return ([], idx)
    
    while idx < len(blocks):
        block = blocks[idx]
        text = normalize(block.get_text())
        
        # Stop when we hit another H1 (new strand)
        if block.name == "h1":
            break
            
        # CRITICAL FIX: Stop if we hit a new ELO definition in a paragraph
        if block.name == "p" and text.lower().startswith("essential learning outcome"):
            break
        
        # Check if this is a new resource section
        if block.name in ["p", "h2", "h3"]:
            is_header, new_section_type = is_resource_section_header(text)
            
            # If we hit another main resource section, stop here
            if is_header and new_section_type != "subsection":
                break
            
            # Skip subsection headers and continue
            if is_header and new_section_type == "subsection":
                idx += 1
                continue
        
        # Extract resource content from paragraphs, lists, and tables
        if block.name == "p":
            if text and not is_junk_text(text):
                links = extract_links_from_element(block)
                resources.append({
                    "text": text,
                    "links": links,
                    "section": section_type
                })
        
        elif block.name in ["ul", "ol"]:
            for li in block.find_all("li", recursive=False):
                li_text = normalize(li.get_text())
                if li_text:
                    links = extract_links_from_element(li)
                    resources.append({
                        "text": li_text,
                        "links": links,
                        "section": section_type
                    })
        
        elif block.name == "table":
            # If the table looks like a curriculum table (SCOs), STOP resource extraction
            if is_three_column_table(block):
                break
                
            for row in block.find_all("tr"):
                cells = row.find_all(["td", "th"])
                for cell in cells:
                    cell_text = normalize(cell.get_text())
                    if cell_text and not is_junk_text(cell_text):
                        links = extract_links_from_element(cell)
                        resources.append({
                            "text": cell_text,
                            "links": links,
                            "section": section_type
                        })
        
        idx += 1
    
    return (resources, idx)


def _parse_single_col_elo_table(table):
    """
    Pattern A (new HTML): strand name + ELO packed into a single <th>.
    Example <th>:
        "Historical and Cultural Thinking\\nEssential Learning Outcome: To understand…\\nSection 3: …"
    Returns (strand_name or None, elo_description or None).
    Returns (None, None) if this table is not an ELO declaration.
    """
    ths = table.find_all("th")
    if len(ths) != 1:
        return (None, None)

    th_text = ths[0].get_text(separator="\n")
    if "essential learning outcome" not in th_text.lower():
        return (None, None)

    # Everything before "Essential Learning Outcome" is the optional strand name
    parts = re.split(r'(?i)(Essential Learning Outcome)', th_text, maxsplit=1)
    strand_name = parts[0].strip() if parts[0].strip() else None
    elo_full = (parts[1] + parts[2]).strip() if len(parts) > 2 else ""
    elo_description = clean_elo_description(elo_full) if elo_full else None

    return (strand_name, elo_description)


def _parse_info_table_elo(table):
    """
    Pattern B (new HTML): strand and ELO live as separate <td> cells in an info table.
    Triggered only when a <td> starts with "Strand:" — that is the reliable gate.
    Returns (strand_name or None, elo_description or None).
    Returns (None, None) if no Strand cell is found.
    """
    strand_name = None
    elo_description = None

    for td in table.find_all("td"):
        cell_text = td.get_text(separator=" ").strip()

        # Strand cell — handles "Strand:", "Strand (Topic) - Strand:", "Strand (Topic):"
        if strand_name is None:
            m = re.match(r'(?i)strand\s*(\([^)]*\)\s*-?\s*(strand\s*)?)?:\s*(.*)', cell_text)
            if m and m.group(3).strip():
                strand_name = m.group(3).strip()

        # ELO cell
        if elo_description is None and re.search(r'(?i)essential learning outcome', cell_text):
            desc = clean_elo_description(cell_text)
            # Accept the description only if it's substantive (not just a number or
            # a short label like the strand name). Otherwise fall through to grab
            # the first real description from a subsequent <td>.
            if desc and len(desc) > 40:
                elo_description = desc
            else:
                # Search forward for the first td that is a real description:
                # skip any td that contains another "Essential Learning Outcome"
                # or is too short to be a description.
                tds = table.find_all("td")
                td_idx = tds.index(td)
                for candidate in tds[td_idx + 1:]:
                    cand_text = candidate.get_text(separator=" ").strip()
                    if re.search(r'(?i)essential learning outcome', cand_text):
                        continue  # skip duplicate ELO headers
                    if len(cand_text) > 40:
                        elo_description = cand_text
                        break

    # Only fire if we actually found a Strand cell (avoids false positives)
    if strand_name:
        return (strand_name, elo_description)
    return (None, None)


def extract_metadata(soup: BeautifulSoup, filename: str):
    """Extract metadata from document with improved subject detection"""
    text = soup.get_text()[:5000]  # Only scan the first 5000 chars for metadata to avoid false positives
    filename_lower = filename.lower()
    
    # Extract curriculum info
    curriculum = ""
    if "OHCP" in text:
        curriculum = "OHCP"
    
    # Extract grade
    grade = ""
    grade_patterns = [
        r'Grade\s+(\d+)',
        r'grade\s+(\d+)',
        r'GRADE\s+(\d+)'
    ]
    
    for pattern in grade_patterns:
        match = re.search(pattern, text)
        if match:
            grade = f"Grade {match.group(1)}"
            break
    
    # Check for Kindergarten
    if not grade and re.search(r'Kindergarten|kindergarten|KINDERGARTEN', text):
        grade = "Kindergarten"
    
    # Subject Detection Logic
    subject = "Unknown"
    
    # 1. Check Filename first (Highest Priority)
    if "social" in filename_lower and "studies" in filename_lower:
        subject = "Social Studies"
    elif "language" in filename_lower and "arts" in filename_lower:
        subject = "Language Arts"
    elif "math" in filename_lower:
        subject = "Mathematics"
    elif "science" in filename_lower:
        subject = "Science"
    
    # 2. If not in filename, check Title/Header text
    if subject == "Unknown":
        title_text = text.lower()
        if "social studies" in title_text:
            subject = "Social Studies"
        elif "language arts" in title_text or "english" in title_text:
            subject = "Language Arts"
        elif "mathematics" in title_text:
            subject = "Mathematics"
        elif "science" in title_text and "technology" in title_text:
            subject = "Science & Technology"
        elif "science" in title_text:
            subject = "Science"
    
    return {
        "filename": filename,
        "curriculum": curriculum,
        "grade": grade,
        "subject": subject
    }

def merge_duplicate_strands(strands):
    """Merge strands with the same name"""
    merged = {}
    
    for strand in strands:
        name = strand["strand_name"]
        
        if name in merged:
            merged[name]["essential_learning_outcomes"].extend(
                strand["essential_learning_outcomes"]
            )
            if "resources" in strand:
                if "resources" not in merged[name]:
                    merged[name]["resources"] = []
                merged[name]["resources"].extend(strand["resources"])
        else:
            merged[name] = strand
    
    return list(merged.values())


def deduplicate_elos(strands):
    """Remove duplicate ELOs within each strand"""
    for strand in strands:
        seen = set()
        unique_elos = []
        
        for elo in strand["essential_learning_outcomes"]:
            desc = elo["elo_description"]
            if desc not in seen:
                seen.add(desc)
                unique_elos.append(elo)
        
        for i, elo in enumerate(unique_elos, 1):
            elo["elo_code"] = f"ELO-{i}"
        
        strand["essential_learning_outcomes"] = unique_elos
    
    return strands


def parse_document(soup: BeautifulSoup, filename: str):
    curriculum = {
        "metadata": extract_metadata(soup, filename),
        "strands": []
    }
    
    current_strand = None
    current_elo = None
    global_elo_counter = 0 
    last_detected_elo_num = None
    elo_from_explicit_source = False  # Tracks if ELO was created from paragraph or ELO declaration table
    
    blocks = soup.find_all(["h1", "h2", "h3", "p", "table", "ul", "ol"])
    
    print(f"\nProcessing {len(blocks)} blocks...")
    
    i = 0
    while i < len(blocks):
        block = blocks[i]
        text = normalize(block.get_text())
        
        # --- STRAND START (H1) ---
        if block.name == "h1":
            # 1. Check if it's a Strand
            if is_valid_strand_name(text):
                # Save previous strand
                if current_strand:
                    current_strand["essential_learning_outcomes"] = [
                        elo for elo in current_strand["essential_learning_outcomes"]
                        if elo["specific_curriculum_outcomes"]
                    ]
                    if current_strand["essential_learning_outcomes"]:
                        curriculum["strands"].append(current_strand)
                
                current_strand = {
                    "strand_name": text,
                    "essential_learning_outcomes": [],
                    "resources": []
                }
                current_elo = None
                last_detected_elo_num = None
                elo_from_explicit_source = False
                i += 1
                continue
            
            # 2. If not a strand, CHECK IF IT IS A RESOURCE HEADER
            # (This was missing before)
            is_header, section_type = is_resource_section_header(text)
            if is_header and current_strand is not None:
                resources, new_idx = extract_resources_for_strand(blocks, i + 1, section_type)
                current_strand["resources"].extend(resources)
                i = new_idx
                continue
                
            # If neither, just skip
            i += 1
            continue
        
        # --- SUBHEADERS (H2, H3) ---
        elif block.name in ["h2", "h3"]:
            if not text:
                i += 1
                continue

            # Check if this h2/h3 is a strand name (for Kindergarten and similar formats)
            # Look for "Strand X:" pattern or valid strand names
            is_strand_header = is_valid_strand_name(text) or text.lower().startswith("strand ")
            
            if is_strand_header:
                # Save previous strand if it has ELOs
                if current_strand and current_strand["essential_learning_outcomes"]:
                    curriculum["strands"].append(current_strand)
                
                current_strand = {
                    "strand_name": text,
                    "essential_learning_outcomes": [],
                    "resources": []
                }
                current_elo = None
                last_detected_elo_num = None
                elo_from_explicit_source = False
                i += 1
                continue

            is_header, section_type = is_resource_section_header(text)
            if is_header and current_strand is not None:
                resources, new_idx = extract_resources_for_strand(blocks, i + 1, section_type)
                current_strand["resources"].extend(resources)
                i = new_idx
                continue
            
            i += 1
            continue

        # --- PARAGRAPH (Explicit ELOs or Resources in P tags) ---
        elif block.name == "p":
            if not text:
                i += 1
                continue
            
            # Check for resource header inside <p> tag
            is_header, section_type = is_resource_section_header(text)
            if is_header and current_strand is not None:
                resources, new_idx = extract_resources_for_strand(blocks, i + 1, section_type)
                current_strand["resources"].extend(resources)
                i = new_idx
                continue
            
            # Explicit ELO marker
            if text.lower().startswith("essential learning outcome") and current_strand is not None:
                description = clean_elo_description(text)
                if not description:
                    i += 1
                    continue
                
                global_elo_counter += 1
                current_elo = {
                    "elo_code": f"ELO-{global_elo_counter}",
                    "elo_description": description,
                    "specific_curriculum_outcomes": [],
                    "inclusive_assessment_strategies": [],
                    "inclusive_learning_strategies": []
                }
                current_strand["essential_learning_outcomes"].append(current_elo)
                elo_from_explicit_source = True
        
        # --- TABLES ---
        elif block.name == "table":
            # 1. Check if it's the standard Curriculum Table
            if is_three_column_table(block):
                rows_data = extract_table_data(block)
                for row_data in rows_data:
                    # Detect SCO numbers
                    detected_elo_num = None
                    for sco in row_data["specific_curriculum_outcomes"]:
                        elo_num, sco_num, cleaned_text = extract_sco_number(sco)
                        if elo_num is not None:
                            detected_elo_num = elo_num
                            break
                    
                    # Create a NEW ELO if:
                    # 1. We detected a new ELO number, OR
                    # 2. We have no current ELO and this is the first row (handles non-numbered SCOs)
                    should_create_elo = (
                        (detected_elo_num is not None and detected_elo_num != last_detected_elo_num) or
                        (current_elo is None and current_strand is not None)
                    )
                    
                    if should_create_elo:
                        
                        # FIX: If we *just* created an ELO via the Paragraph tag or ELO declaration table,
                        # AND it has no numbered SCOs yet (only intro text), we ADOPT it instead of creating new.
                        has_numbered_scos = any(
                            re.match(r'^\s*\d+\.\d+', sco) 
                            for sco in (current_elo["specific_curriculum_outcomes"] if current_elo else [])
                        )
                        if current_elo and elo_from_explicit_source and not has_numbered_scos:
                            # Adopt the existing ELO - it's the one we want
                            last_detected_elo_num = detected_elo_num
                            elo_from_explicit_source = False  # Now it's "adopted" by table data
                        else:
                            # Create new ELO
                            global_elo_counter += 1
                            sco_list = row_data["specific_curriculum_outcomes"]
                            first_sco = sco_list[0] if sco_list else ""
                            _, _, desc = extract_sco_number(first_sco)
                            
                            current_elo = {
                                "elo_code": f"ELO-{global_elo_counter}",
                                "elo_description": desc if desc else f"Learning outcomes for section {detected_elo_num}",
                                "specific_curriculum_outcomes": [],
                                "inclusive_assessment_strategies": [],
                                "inclusive_learning_strategies": []
                            }
                            if current_strand is None:
                                print(f"DEBUG: current_strand is None when trying to append ELO at block {i}, detected_elo_num={detected_elo_num}")
                            else:
                                current_strand["essential_learning_outcomes"].append(current_elo)
                            last_detected_elo_num = detected_elo_num

                    if current_elo is not None:
                        # --- Cross-table sentence continuation fix ---
                        # Some curricula split one sentence across two <table> elements.
                        # Detect: first incoming SCO starts with a lowercase letter
                        # (a real SCO always starts uppercase, a KSV prefix, or a number).
                        # When detected, glue it onto the previous SCO.
                        new_scos = row_data["specific_curriculum_outcomes"]
                        if (new_scos
                                and new_scos[0]
                                and new_scos[0][0].islower()
                                and current_elo["specific_curriculum_outcomes"]):
                            current_elo["specific_curriculum_outcomes"][-1] = (
                                current_elo["specific_curriculum_outcomes"][-1].rstrip()
                                + " " + new_scos[0].strip()
                            )
                            new_scos = new_scos[1:]  # drop the merged fragment
                        current_elo["specific_curriculum_outcomes"].extend(new_scos)
                        current_elo["inclusive_assessment_strategies"].extend(row_data["inclusive_assessment_strategies"])
                        current_elo["inclusive_learning_strategies"].extend(row_data["inclusive_learning_strategies"])
            
            # 2. Check if the table ITSELF is a Resource Section
            else:
                # --- NEW: ELO declaration tables (two patterns) ---
                # Pattern A: single <th> containing "Essential Learning Outcome"
                strand_name, elo_desc = _parse_single_col_elo_table(block)
                if elo_desc is None:
                    # Pattern B: info table with a "Strand:" td cell
                    strand_name, elo_desc = _parse_info_table_elo(block)

                if strand_name or elo_desc:
                    # Create / switch strand if the name changed or none exists yet
                    if strand_name and (current_strand is None or current_strand["strand_name"] != strand_name):
                        if current_strand:
                            current_strand["essential_learning_outcomes"] = [
                                elo for elo in current_strand["essential_learning_outcomes"]
                                if elo["specific_curriculum_outcomes"]
                            ]
                            if current_strand["essential_learning_outcomes"]:
                                curriculum["strands"].append(current_strand)
                        current_strand = {
                            "strand_name": strand_name,
                            "essential_learning_outcomes": [],
                            "resources": []
                        }
                        current_elo = None
                        last_detected_elo_num = None
                        elo_from_explicit_source = False
                    elif current_strand is None:
                        # No strand name available (partial extract); fall back to subject
                        current_strand = {
                            "strand_name": curriculum["metadata"]["subject"],
                            "essential_learning_outcomes": [],
                            "resources": []
                        }
                        current_elo = None
                        last_detected_elo_num = None

                        elo_from_explicit_source = False

                    # Create the ELO
                    if elo_desc and current_strand is not None:
                        global_elo_counter += 1
                        current_elo = {
                            "elo_code": f"ELO-{global_elo_counter}",
                            "elo_description": elo_desc,
                            "specific_curriculum_outcomes": [],
                            "inclusive_assessment_strategies": [],
                            "inclusive_learning_strategies": []
                        }
                        current_strand["essential_learning_outcomes"].append(current_elo)

                        elo_from_explicit_source = True

                    i += 1
                    continue
                # --- END NEW ---

                # Check table headers for resource keywords
                headers = [normalize(th.get_text()) for th in block.find_all(["th", "td"])]
                header_text = " ".join(headers)
                is_header, section_type = is_resource_section_header(header_text)
                
                if is_header and current_strand is not None:
                    # Extract links/text from the whole table
                    resources = []
                    for row in block.find_all("tr"):
                        for cell in row.find_all(["td", "th"]):
                            cell_text = normalize(cell.get_text())
                            # Skip the header text itself
                            if cell_text and not is_resource_section_header(cell_text)[0]:
                                links = extract_links_from_element(cell)
                                resources.append({
                                    "text": cell_text,
                                    "links": links,
                                    "section": section_type
                                })
                    current_strand["resources"].extend(resources)

        i += 1
    
    # Final cleanup
    if current_strand:
        current_strand["essential_learning_outcomes"] = [
            elo for elo in current_strand["essential_learning_outcomes"]
            if elo["specific_curriculum_outcomes"]
        ]
        if current_strand["essential_learning_outcomes"]:
            curriculum["strands"].append(current_strand)

    curriculum["strands"] = merge_duplicate_strands(curriculum["strands"])

    # Organize Resources for every strand
    for strand in curriculum["strands"]:
        if "resources" in strand:
            strand["resources"] = organize_strand_resources(strand["resources"])
     
    return reindex_all_elos(curriculum)



def renumber_scos_for_elo(elo, elo_number):
    """Renumber all SCOs in an ELO to use the ELO number as prefix.
    
    Args:
        elo: The ELO dictionary containing SCOs
        elo_number: The ELO number to use as prefix (e.g., 6 for ELO-6)
    
    Example:
        ELO-6 with SCOs ["5.1 Generate ideas", "5.2 Analyze text"]
        becomes ["6.1 Generate ideas", "6.2 Analyze text"]
    """
    sco_counter = 1
    renumbered_scos = []
    
    for sco in elo["specific_curriculum_outcomes"]:
        # Check if SCO starts with a number pattern (e.g., "1.1", "5.2", "3.2.")
        match = re.match(r'^\s*(\d+)\.(\d+)\.?\s+(.+)', sco)
        
        if match:
            # Replace with new numbering: elo_number.sco_counter
            renumbered_sco = f"{elo_number}.{sco_counter} {match.group(3)}"
            renumbered_scos.append(renumbered_sco)
            sco_counter += 1
        else:
            # No number pattern found at start, keep as-is
            renumbered_scos.append(sco)
    
    elo["specific_curriculum_outcomes"] = renumbered_scos


def reindex_all_elos(curriculum):
    """Ensures ELO-1 to ELO-N numbering is strictly sequential across all strands,
    and renumbers SCOs to match their parent ELO number."""
    counter = 1
    for strand in curriculum["strands"]:
        for elo in strand["essential_learning_outcomes"]:
            elo["elo_code"] = f"ELO-{counter}"
            # Renumber SCOs to match ELO number
            renumber_scos_for_elo(elo, counter)
            counter += 1
    return curriculum

def process_file(path: Path):
    """Process a single HTML file"""
    print(f"\n{'='*80}")
    print(f"Processing: {path.name}")
    print(f"{'='*80}")
    
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    curriculum = parse_document(soup, path.name)
    
    output_path = OUTPUT_DIR / f"{path.stem}.json"
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(curriculum, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Saved: {output_path.name}")
    print(f"  - {len(curriculum['strands'])} strands")
    
    for strand in curriculum["strands"]:
        print(f"\n  • {strand['strand_name']}: {len(strand['essential_learning_outcomes'])} ELOs")
        
        # UPDATED: Print logic for organized resources dictionary
        resources = strand.get("resources", {})
        if resources:
            total_items = sum(len(items) for items in resources.values())
            print(f"    📚 {total_items} resource items")
            for category, items in resources.items():
                print(f"       - {category}: {len(items)} items")
        
        for elo in strand["essential_learning_outcomes"]:
            sco_count = len(elo["specific_curriculum_outcomes"])
            ias_count = len(elo["inclusive_assessment_strategies"])
            ils_count = len(elo["inclusive_learning_strategies"])
            desc_preview = elo['elo_description'][:60] + "..." if len(elo['elo_description']) > 60 else elo['elo_description']
            print(f"      - {elo['elo_code']}: {desc_preview}")
            print(f"        {sco_count} SCOs, {ias_count} assessments, {ils_count} strategies")


def main():
    html_files = list(INPUT_DIR.glob("*.html"))
    
    if not html_files:
        print("No HTML files found in input directory")
        return
    
    print(f"Found {len(html_files)} HTML file(s)")
    
    for html_file in html_files:
        process_file(html_file)
    
    print("\n✓ All files processed")


if __name__ == "__main__":
    main()