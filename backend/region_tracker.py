"""
AnswerRegionTracker: tracks answer region positions during document generation
for use by the scan-grading pipeline.
"""


class AnswerRegionTracker:
    """Tracks answer region positions during DOCX/PDF generation."""

    def __init__(self, page_width_pt=612, page_height_pt=792):
        self.page_width = page_width_pt
        self.page_height = page_height_pt
        self.regions = []
        self.current_y = 0
        self.current_page = 1

    def add_mc_region(self, question_index: int, num_options: int,
                      y_pos: float, x_start: float = 120):
        """Record bubble positions for a multiple-choice question."""
        labels = ['A', 'B', 'C', 'D', 'E'][:num_options]
        bubbles = []
        spacing = 45  # points between bubble centers
        for i, label in enumerate(labels):
            bubbles.append({
                "label": label,
                "x": x_start + i * spacing,
                "y": y_pos,
                "w": 18,
                "h": 18
            })
        self.regions.append({
            "question_index": question_index,
            "type": "multiple-choice",
            "page": self.current_page,
            "options": labels,
            "bubbles": bubbles
        })

    def add_tf_region(self, question_index: int, y_pos: float,
                      x_start: float = 120):
        """Record checkbox positions for a true/false question."""
        self.regions.append({
            "question_index": question_index,
            "type": "true-false",
            "page": self.current_page,
            "checkboxes": [
                {"label": "True",  "x": x_start,      "y": y_pos, "w": 18, "h": 18},
                {"label": "False", "x": x_start + 80,  "y": y_pos, "w": 18, "h": 18}
            ]
        })

    def add_open_region(self, question_index: int, y_pos: float,
                        height: float = 100, x_start: float = 72,
                        width: float = 468):
        """Record text box position for an open-answer question."""
        self.regions.append({
            "question_index": question_index,
            "type": "open-answer",
            "page": self.current_page,
            "text_box": {"x": x_start, "y": y_pos, "w": width, "h": height}
        })

    def add_fill_blank_region(self, question_index: int, y_pos: float,
                              x_start: float = 200, width: float = 250):
        """Record the blank line region for fill-in-the-blank."""
        self.regions.append({
            "question_index": question_index,
            "type": "fill-blank",
            "page": self.current_page,
            "text_box": {"x": x_start, "y": y_pos, "w": width, "h": 24}
        })

    def new_page(self):
        """Advance to next page."""
        self.current_page += 1
        self.current_y = 0

    def to_json(self) -> list[dict]:
        return self.regions
