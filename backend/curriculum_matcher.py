import os
import json
import re
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path

class CurriculumMatcher:
    """
    CurriculumMatcher provides methods to search and match curriculum pages
    from a curriculum index, supporting fuzzy matching, keyword extraction,
    and context formatting as specified in the requirements.
    """

    def __init__(self, curriculum_index_path: Optional[str] = None):
        """
        Initialize the matcher and load the curriculum index.

        Args:
            curriculum_index_path (str, optional): Path to curriculumIndex.json.
                If not provided, will look for it in the default frontend location.
        """
        if curriculum_index_path is None:
            # Default: look for frontend/src/data/curriculumIndex.json relative to backend
            base_dir = Path(__file__).parent.parent
            curriculum_index_path = base_dir / "frontend" / "src" / "data" / "curriculumIndex.json"
        self.curriculum_index_path = str(curriculum_index_path)
        self.pages = self._load_curriculum_index()
        self._build_inverted_index()

    def _load_curriculum_index(self) -> List[Dict[str, Any]]:
        """
        Load and parse the curriculum index JSON.

        Returns<write_to_file>
<path>backend/curriculum_matcher.py</path>
<content>
import os
import json
import re
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path

class CurriculumMatcher:
    """
    """

    def __init__(self, curriculum_index_path: Optional[str] = None):
        """
        Initialize the matcher by loading the curriculum index JSON.

        Args:
            curriculum_index_path (str, optional): Path to curriculumIndex.json.
                If None, will look for frontend/src/data/curriculumIndex.json
                relative to the backend directory.
        """
        if curriculum_index_path is None:
            # Default: look for curriculumIndex.json in frontend/src/data/
            base_dir = Path(__file__).parent.parent
            curriculum_index_path = base_dir / "frontend" / "src" / "data" / "curriculumIndex.json"
        self.curriculum_index_path = str(curriculum_index_path)
        self.pages = self._load_curriculum_index()

    def _load_curriculum_index(self) -> List[Dict[str, Any]]:
        """
        Load and parse the curriculum index JSON file.

        Returns:
            List of curriculum page dictionaries.
        """
        if not os.path.exists(self.curriculum_index_path):
            raise FileNotFoundError(f"Curriculum index not found at {self.curriculum_index_path}")
        with open(self.curriculum_index_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data.get("indexedPages", [])

    @staticmethod
    def _normalize(text: str) -> str:
        """
        Normalize text for comparison: lowercase, remove punctuation, collapse whitespace.

        Args:
            text (str): Input text.

        Returns:
            str: Normalized text.
        """
        text = text.lower()
        text = re.sub(r"[^\w\s]", " ", text)
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    @staticmethod
    def _tokenize(text: str) -> List[str]:
        """
        Tokenize text into words, normalized.

        Args:
            text (str): Input text.

        Returns:
            List[str]: List of tokens.
        """
        return CurriculumMatcher._normalize(text).split()

    @staticmethod
    def _fuzzy_score(a: str, b: str) -> float:
        """
        Compute a simple fuzzy match score between two strings.
        Uses token overlap and partial ratio.

        Args:
            a (str): First string.
            b (str): Second string.

        Returns:
            float: Score between 0 and 1.
        """
        tokens_a = set(CurriculumMatcher._tokenize(a))
        tokens_b = set(CurriculumMatcher._tokenize(b))
        if not tokens_a or not tokens_b:
            return 0.0
        overlap = tokens_a & tokens_b
        overlap_score = len(overlap) / max(len(tokens_a), len(tokens_b))
        # Partial ratio: how much of a is in b and vice versa
        partial_a = sum(1 for t in tokens_a if t in tokens_b) / len(tokens_a)
        partial_b = sum(1 for t in tokens_b if t in tokens_a) / len(tokens_b)
        return 0.5 * overlap_score + 0.25 * (partial_a + partial_b)

    @staticmethod
    def _extract_keywords(text: str, max_keywords: int = 8) -> List[str]:
        """
        Extract keywords from text using simple frequency and length heuristics.

        Args:
            text (str): Input text.
            max_keywords (int): Maximum number of keywords to extract.

        Returns:
            List[str]: List of keywords.
        """
        tokens = CurriculumMatcher._tokenize(text)
        freq = {}
        for t in tokens:
            if len(t) > 2:
                freq[t] = freq.get(t, 0) + 1
        # Sort by frequency, then by length, then alphabetically
        sorted_tokens = sorted(freq.items(), key=lambda x: (-x[1], -len(x[0]), x[0]))
        return [t for t, _ in sorted_tokens[:max_keywords]]

    def find_matching_pages(
        self,
        query: str,
        top_k: int = 5,
        min_score: float = 0.25
    ) -> List[Dict[str, Any]]:
        """
        Find curriculum pages that best match the query using fuzzy logic and keyword overlap.

        Args:
            query (str): User query.
            top_k (int): Number of top results to return.
            min_score (float): Minimum score threshold.

        Returns:
            List[Dict]: List of matching curriculum page dicts, sorted by score.
        """
        query_norm = self._normalize(query)
        query_keywords = set(self._extract_keywords(query))
        results: List[Tuple[float, Dict[str, Any]]] = []

        for page in self.pages:
            # Combine searchable fields
            fields = [
                page.get("displayName", ""),
                page.get("subject", ""),
                page.get("strand", ""),
                " ".join(page.get("keywords", [])),
                " ".join(page.get("essentialOutcomes", [])),
                " ".join(page.get("specificOutcomes", [])),
                page.get("summary", ""),
            ]
            page_text = " ".join(fields)
            page_norm = self._normalize(page_text)
            page_keywords = set(page.get("keywords", []))
            # Fuzzy score
            fuzzy = self._fuzzy_score(query_norm, page_norm)
            # Keyword overlap
            keyword_overlap = len(query_keywords & page_keywords) / (len(query_keywords) + 1e-6)
            # Weighted score: 70% fuzzy, 30% keyword
            score = 0.7 * fuzzy + 0.3 * keyword_overlap
            if score >= min_score:
                results.append((score, page))

        # Sort by score descending
        results.sort(key=lambda x: -x[0])
        return [
            {**page, "matchScore": round(score, 3)}
            for score, page in results[:top_k]
        ]

    def search_by_query(
        self,
        query: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Search curriculum pages by query, returning top matches.

        Args:
            query (str): User query.
            top_k (int): Number of results.

        Returns:
            List[Dict]: List of matching curriculum page dicts.
        """
        return self.find_matching_pages(query, top_k=top_k)

    def get_curriculum_context(
        self,
        page_id: str
    ) -> Optional[str]:
        """
        Get a formatted context string for a curriculum page by its ID.

        Args:
            page_id (str): The curriculum page ID.

        Returns:
            str or None: Formatted context string, or None if not found.
        """
        page = next((p for p in self.pages if p.get("id") == page_id), None)
        if not page:
            return None
        # Format context as specified
        context = [
            f"Title: {page.get('displayName', '')}",
            f"Grade: {page.get('grade', '')}",
            f"Subject: {page.get('subject', '')}",
            f"Strand: {page.get('strand', '')}",
            f"Keywords: {', '.join(page.get('keywords', []))}",
            f"Essential Outcomes: {'; '.join(page.get('essentialOutcomes', []))}",
            f"Specific Outcomes: {'; '.join(page.get('specificOutcomes', []))}",
            f"Summary: {page.get('summary', '')}",
            f"Route: {page.get('route', '')}",
        ]
        return "\n".join(context)

    def get_page_by_id(self, page_id: str) -> Optional[Dict[str, Any]]:
        """
        Get the raw curriculum page dictionary by its ID.

        Args:
            page_id (str): The curriculum page ID.

        Returns:
            dict or None: The page dict, or None if not found.
        """
        return next((p for p in self.pages if p.get("id") == page_id), None)

    def all_page_ids(self) -> List[str]:
        """
        Get a list of all curriculum page IDs.

        Returns:
            List[str]: List of page IDs.
        """
        return [p.get("id") for p in self.pages if "id" in p]