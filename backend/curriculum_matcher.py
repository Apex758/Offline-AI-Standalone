import os
import json
import re
from typing import List, Dict, Any, Optional
from pathlib import Path


class CurriculumMatcher:
    """
    Loads curriculum JSON files from frontend/src/data/curriculum/ and provides
    direct lookup by grade + subject + strand, plus context formatting for LLM prompts.
    """

    def __init__(self, curriculum_dir: Optional[str] = None):
        if curriculum_dir is None:
            base_dir = Path(__file__).parent.parent
            curriculum_dir = base_dir / "frontend" / "src" / "data" / "curriculum"
        self.curriculum_dir = Path(curriculum_dir)
        self.files: Dict[str, Any] = {}  # key: "grade-subject" -> loaded JSON
        self._load_all_files()

    def _load_all_files(self):
        """Load all curriculum JSON files from the curriculum directory."""
        if not self.curriculum_dir.exists():
            raise FileNotFoundError(f"Curriculum directory not found: {self.curriculum_dir}")

        for f in self.curriculum_dir.glob("*.json"):
            with open(f, "r", encoding="utf-8") as fh:
                data = json.load(fh)
            key = f.stem  # e.g. "grade1-language-arts", "kindergarten-belonging-unit"
            self.files[key] = data

    @staticmethod
    def _normalize_grade(grade: str) -> str:
        """Normalize grade input: 'Grade 1' -> '1', 'Kindergarten' -> 'K', etc."""
        g = grade.strip()
        if g.lower().startswith("kindergarten") or g.lower() == "k":
            return "K"
        m = re.match(r"(?i)grade\s*(\d+)", g)
        if m:
            return m.group(1)
        # Already a number?
        if g.isdigit():
            return g
        return g

    def _get_file_key(self, grade: str, subject: str) -> Optional[str]:
        """Map grade + subject to the file key."""
        g = self._normalize_grade(grade)
        grade_prefix = "kindergarten" if g == "K" else f"grade{g}"
        subject_slug = subject.strip().lower().replace(" ", "-")
        key = f"{grade_prefix}-{subject_slug}"
        if key in self.files:
            return key
        return None

    def get_curriculum_data(self, grade: str, subject: str) -> Optional[Dict]:
        """Get the full curriculum data for a grade + subject."""
        key = self._get_file_key(grade, subject)
        if key is None:
            return None
        return self.files.get(key)

    def get_strand_data(self, grade: str, subject: str, strand: str) -> Optional[Dict]:
        """Get a specific strand's data."""
        data = self.get_curriculum_data(grade, subject)
        if not data:
            return None
        for s in data.get("strands", []):
            if s.get("strand_name", "").lower() == strand.lower():
                return s
        # Partial match
        for s in data.get("strands", []):
            if strand.lower() in s.get("strand_name", "").lower():
                return s
        return None

    def find_matching_pages(
        self,
        query: str,
        top_k: int = 5,
        min_score: float = 0.0,
        grade: str = "",
        subject: str = ""
    ) -> List[Dict[str, Any]]:
        """
        Find curriculum strands matching the query. When grade and subject are provided,
        directly loads that file and returns matching strands.
        Falls back to searching all files if grade/subject not specified.
        """
        results = []
        query_lower = query.lower().strip()
        query_tokens = set(re.findall(r'\w+', query_lower))

        grade_norm = self._normalize_grade(grade) if grade else ""
        subject_norm = subject.strip().lower()

        for key, data in self.files.items():
            meta = data.get("metadata", {})
            file_grade = meta.get("grade", "")
            file_subject = meta.get("subject", "").lower()

            # Filter by grade/subject if provided
            if grade_norm and file_grade != grade_norm:
                continue
            if subject_norm and file_subject != subject_norm:
                continue

            for strand in data.get("strands", []):
                strand_name = strand.get("strand_name", "")
                strand_slug = strand_name.lower().replace(" ", "-")
                grade_prefix = "kindergarten" if file_grade == "K" else f"grade{file_grade}"

                # Build searchable text from strand content
                search_parts = [strand_name.lower()]
                for elo in strand.get("essential_learning_outcomes", []):
                    search_parts.append(elo.get("elo_description", "").lower())
                    for sco in elo.get("specific_curriculum_outcomes", []):
                        search_parts.append(sco.get("description", "").lower())
                search_text = " ".join(search_parts)
                search_tokens = set(re.findall(r'\w+', search_text))

                # Score: token overlap
                if query_tokens:
                    overlap = len(query_tokens & search_tokens)
                    score = overlap / len(query_tokens) if query_tokens else 0
                else:
                    score = 0.5 if grade_norm or subject_norm else 0

                if score >= min_score or (grade_norm and subject_norm):
                    results.append({
                        "id": f"{grade_prefix}-{file_subject.replace(' ', '-')}-{strand_slug}",
                        "displayName": strand_name,
                        "grade": file_grade,
                        "subject": meta.get("subject", ""),
                        "strand": strand_name,
                        "route": f"/curriculum/{grade_prefix}-subjects/{file_subject.replace(' ', '-')}/{strand_slug}",
                        "matchScore": round(score, 3),
                        "_strand_data": strand,
                    })

        results.sort(key=lambda x: -x["matchScore"])
        return results[:top_k]

    def get_curriculum_context(self, page_id: str = "", grade: str = "", subject: str = "", strand: str = "") -> Optional[str]:
        """
        Get formatted curriculum context for LLM consumption.
        Can be called with page_id (backward compat) or with grade+subject+strand.
        Now includes assessment strategies and learning strategies.
        """
        strand_data = None
        grade_label = ""
        subject_label = ""
        strand_name = ""

        if grade and subject and strand:
            s = self.get_strand_data(grade, subject, strand)
            if s:
                strand_data = s
                g = self._normalize_grade(grade)
                grade_label = "Kindergarten" if g == "K" else f"Grade {g}"
                subject_label = subject
                strand_name = s.get("strand_name", strand)

        elif page_id:
            # Parse page_id to find the strand: e.g. "grade1-language-arts-listening-speaking"
            for key, data in self.files.items():
                meta = data.get("metadata", {})
                file_grade = meta.get("grade", "")
                file_subject = meta.get("subject", "")
                grade_prefix = "kindergarten" if file_grade == "K" else f"grade{file_grade}"
                sub_slug = file_subject.lower().replace(" ", "-")

                for s in data.get("strands", []):
                    sn = s.get("strand_name", "")
                    strand_slug = sn.lower().replace(" ", "-")
                    expected_id = f"{grade_prefix}-{sub_slug}-{strand_slug}"
                    if expected_id == page_id:
                        strand_data = s
                        grade_label = "Kindergarten" if file_grade == "K" else f"Grade {file_grade}"
                        subject_label = file_subject
                        strand_name = sn
                        break
                if strand_data:
                    break

        if not strand_data:
            return None

        lines = [
            f"--- {strand_name} ({grade_label} {subject_label}) ---",
        ]

        for elo in strand_data.get("essential_learning_outcomes", []):
            elo_desc = elo.get("elo_description", "")
            elo_code = elo.get("elo_code", "")
            lines.append(f"\nEssential Outcome{f' [{elo_code}]' if elo_code else ''}: {elo_desc}")

            lines.append("\nSpecific Outcomes (students should be able to):")
            for sco in elo.get("specific_curriculum_outcomes", []):
                code = sco.get("sco_code", "")
                desc = sco.get("description", "")
                lines.append(f"  - [{code}] {desc}" if code else f"  - {desc}")

            # Include assessment strategies
            strategies = elo.get("inclusive_assessment_strategies", [])
            if strategies:
                lines.append("\nAssessment Strategies:")
                for strat in strategies[:5]:
                    lines.append(f"  - {strat[:200]}")

            # Include learning strategies
            learning = elo.get("inclusive_learning_strategies", [])
            if learning:
                lines.append("\nLearning Strategies:")
                for strat in learning[:5]:
                    lines.append(f"  - {strat[:200]}")

        return "\n".join(lines)

    def get_page_by_id(self, page_id: str) -> Optional[Dict[str, Any]]:
        """Get curriculum strand data by page ID."""
        for key, data in self.files.items():
            meta = data.get("metadata", {})
            file_grade = meta.get("grade", "")
            file_subject = meta.get("subject", "")
            grade_prefix = "kindergarten" if file_grade == "K" else f"grade{file_grade}"
            sub_slug = file_subject.lower().replace(" ", "-")

            for s in data.get("strands", []):
                sn = s.get("strand_name", "")
                strand_slug = sn.lower().replace(" ", "-")
                expected_id = f"{grade_prefix}-{sub_slug}-{strand_slug}"
                if expected_id == page_id:
                    return {
                        "id": expected_id,
                        "displayName": sn,
                        "grade": file_grade,
                        "subject": file_subject,
                        "strand": sn,
                        "strand_data": s,
                    }
        return None

    def all_page_ids(self) -> List[str]:
        """Get all curriculum page IDs."""
        ids = []
        for key, data in self.files.items():
            meta = data.get("metadata", {})
            file_grade = meta.get("grade", "")
            file_subject = meta.get("subject", "")
            grade_prefix = "kindergarten" if file_grade == "K" else f"grade{file_grade}"
            sub_slug = file_subject.lower().replace(" ", "-")
            for s in data.get("strands", []):
                sn = s.get("strand_name", "")
                strand_slug = sn.lower().replace(" ", "-")
                ids.append(f"{grade_prefix}-{sub_slug}-{strand_slug}")
        return ids
