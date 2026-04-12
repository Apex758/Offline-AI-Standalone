"""
TTS Text Preprocessor -- normalizes text for more natural speech synthesis.

Handles number expansion, abbreviation expansion, and smart sentence splitting.
Runs BEFORE Piper synthesis to improve naturalness without any model changes.
"""

import re
import logging

logger = logging.getLogger(__name__)

# Pre-import optional dependencies at module load so the first TTS call
# doesn't pay the import cost (preload endpoint triggers this early).
try:
    from num2words import num2words as _num2words
except ImportError:
    _num2words = None
    logger.warning("num2words not installed -- number expansion disabled")

try:
    import nltk as _nltk
except ImportError:
    _nltk = None
    logger.info("NLTK not installed -- using regex sentence splitter")


# ---------------------------------------------------------------------------
# Number-to-words expansion
# ---------------------------------------------------------------------------

def _expand_numbers(text: str) -> str:
    """Convert numeric values to spoken words for natural TTS."""
    if _num2words is None:
        return text

    num2words = _num2words  # local alias for closures below

    def _replace_decimal(match):
        """Handle decimal numbers like 3.14"""
        try:
            return num2words(float(match.group()), lang='en')
        except Exception:
            return match.group()

    def _replace_integer(match):
        """Handle plain integers like 123"""
        try:
            num = int(match.group())
            # Don't expand years (1900-2099) -- they sound better as-is
            if 1900 <= num <= 2099:
                return match.group()
            return num2words(num, lang='en')
        except Exception:
            return match.group()

    # Times first (e.g., "3:00" -> "three o'clock", "3:30" -> "three thirty")
    def _replace_time(match):
        try:
            hour = int(match.group(1))
            minute = int(match.group(2))
            hour_word = num2words(hour, lang='en')
            if minute == 0:
                return f"{hour_word} o'clock"
            else:
                minute_word = num2words(minute, lang='en')
                if minute < 10:
                    return f"{hour_word} oh {minute_word}"
                return f"{hour_word} {minute_word}"
        except Exception:
            return match.group()

    text = re.sub(r'\b(\d{1,2}):(\d{2})\b', _replace_time, text)

    # Decimals (so "3.14" doesn't get split at the period)
    text = re.sub(r'\b\d+\.\d+\b', _replace_decimal, text)
    # Then plain integers
    text = re.sub(r'\b\d+\b', _replace_integer, text)

    return text


# ---------------------------------------------------------------------------
# Abbreviation & symbol expansion
# ---------------------------------------------------------------------------

# Common abbreviations that TTS engines often mispronounce
ABBREVIATIONS = {
    r'\bDr\.':   'Doctor',
    r'\bMr\.':   'Mister',
    r'\bMrs\.':  'Misses',
    r'\bMs\.':   'Miss',
    r'\bProf\.': 'Professor',
    r'\bSt\.':   'Saint',
    r'\bvs\.':   'versus',
    r'\betc\.':  'et cetera',
    r'\be\.g\.': 'for example',
    r'\bi\.e\.': 'that is',
    r'\bJr\.':   'Junior',
    r'\bSr\.':   'Senior',
    r'\bInc\.':  'Incorporated',
    r'\bCo\.':   'Company',
    r'\bLtd\.':  'Limited',
    r'\bGen\.':  'General',
    r'\bSgt\.':  'Sergeant',
    r'\bCpl\.':  'Corporal',
    r'\bCpt\.':  'Captain',
    r'\bLt\.':   'Lieutenant',
    r'\bGov\.':  'Governor',
    r'\bPres\.': 'President',
    r'\bSec\.':  'Secretary',
}

# Symbols that should be spoken
SYMBOL_MAP = {
    '&': ' and ',
    '%': ' percent',
    '+': ' plus ',
    '=': ' equals ',
    '@': ' at ',
    '#': ' number ',
}


def _expand_abbreviations(text: str) -> str:
    """Expand common abbreviations for clearer TTS output."""
    for pattern, replacement in ABBREVIATIONS.items():
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    return text


def _expand_symbols(text: str) -> str:
    """Expand symbols to spoken words."""
    for symbol, word in SYMBOL_MAP.items():
        text = text.replace(symbol, word)
    return text


# ---------------------------------------------------------------------------
# Acronym spacing  (FBI -> F B I)
# ---------------------------------------------------------------------------

def _expand_acronyms(text: str) -> str:
    """Add spaces between letters of all-caps acronyms so TTS spells them."""
    def _space_acronym(match):
        acronym = match.group()
        # Skip common words that happen to be uppercase (I, A, etc.)
        if len(acronym) < 2:
            return acronym
        return ' '.join(acronym)

    # Match 2+ uppercase letters surrounded by word boundaries
    text = re.sub(r'\b[A-Z]{2,}\b', _space_acronym, text)
    return text


# ---------------------------------------------------------------------------
# Smart sentence splitting (replaces naive regex)
# ---------------------------------------------------------------------------

# Abbreviations that end with a period but are NOT sentence endings
_NON_BREAKING_ABBR = {
    'dr', 'mr', 'mrs', 'ms', 'prof', 'st', 'jr', 'sr',
    'inc', 'co', 'ltd', 'vs', 'etc', 'gen', 'sgt', 'cpl',
    'cpt', 'lt', 'gov', 'pres', 'sec', 'rev', 'hon',
    'vol', 'dept', 'est', 'approx', 'assn', 'ave', 'blvd',
}


def smart_split_sentences(text: str) -> list[str]:
    """
    Split text into sentences more intelligently than regex alone.

    Tries NLTK's punkt tokenizer first (best accuracy),
    falls back to a careful regex splitter.
    """
    text = text.strip()
    if not text:
        return []

    # Try NLTK first (pre-imported at module level)
    if _nltk is not None:
        try:
            from nltk.tokenize import sent_tokenize
            sentences = sent_tokenize(text)
            return [s.strip() for s in sentences if s.strip()]
        except LookupError:
            # punkt data not downloaded yet -- download it once
            _nltk.download('punkt_tab', quiet=True)
            from nltk.tokenize import sent_tokenize
            sentences = sent_tokenize(text)
            return [s.strip() for s in sentences if s.strip()]
        except Exception as e:
            logger.warning(f"NLTK sentence split failed, using fallback: {e}")

    # Fallback: careful regex that respects abbreviations
    return _regex_split_sentences(text)


def _regex_split_sentences(text: str) -> list[str]:
    """Regex-based sentence splitter that respects abbreviations."""
    # Split on .!? followed by whitespace and an uppercase letter
    # but not after known abbreviations
    raw_parts = re.split(r'(?<=[.!?])\s+(?=[A-Z])', text)

    # Rejoin parts that were split on abbreviation periods
    sentences = []
    buffer = ''
    for part in raw_parts:
        if buffer:
            # Check if buffer ends with a known abbreviation
            last_word = re.search(r'(\w+)\.\s*$', buffer)
            if last_word and last_word.group(1).lower() in _NON_BREAKING_ABBR:
                buffer = buffer + ' ' + part
                continue
        if buffer:
            sentences.append(buffer.strip())
        buffer = part
    if buffer:
        sentences.append(buffer.strip())

    return [s for s in sentences if s]


# ---------------------------------------------------------------------------
# Main preprocessing pipeline
# ---------------------------------------------------------------------------

def preprocess_for_tts(text: str) -> str:
    """
    Run the full text normalization pipeline.

    Order matters:
    1. Abbreviations first (so "Dr." doesn't get treated as sentence end)
    2. Symbols
    3. Numbers (after symbols so "100%" becomes "one hundred percent")
    4. Acronyms last (after everything else is expanded)
    """
    if not text or not text.strip():
        return text

    text = _expand_abbreviations(text)
    text = _expand_symbols(text)
    text = _expand_numbers(text)
    text = _expand_acronyms(text)

    # Clean up any double spaces introduced by expansions
    text = re.sub(r'\s{2,}', ' ', text).strip()

    return text
