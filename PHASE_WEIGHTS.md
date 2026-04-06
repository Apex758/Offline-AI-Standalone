# Phase Weight Profiles

Each dimension is scored 0-100, then multiplied by its phase weight to produce a weighted composite score mapped to a letter grade (A+ through F).

## Generic Phases

| Phase | Curriculum | Content | Performance | Attendance | Achievements |
|-------|-----------|---------|-------------|------------|-------------|
| Start of Year | 0.30 | 0.30 | 0.10 | 0.15 | 0.15 |
| Early Year | 0.25 | 0.25 | 0.15 | 0.20 | 0.15 |
| Mid-Year | 0.20 | 0.20 | 0.25 | 0.20 | 0.15 |
| Pre-Exam | 0.15 | 0.25 | 0.30 | 0.15 | 0.15 |
| Exam Period | 0.10 | 0.10 | 0.40 | 0.20 | 0.20 |
| Post-Exam | 0.15 | 0.15 | 0.35 | 0.15 | 0.20 |
| Vacation | 0.30 | 0.30 | 0.05 | 0.05 | 0.30 |
| Reopening | 0.30 | 0.25 | 0.10 | 0.25 | 0.10 |

## Caribbean Three-Term Phases

| Phase | Curriculum | Content | Performance | Attendance | Achievements |
|-------|-----------|---------|-------------|------------|-------------|
| Term 1 — Early | 0.28 | 0.27 | 0.15 | 0.18 | 0.12 |
| Term 1 Mid-Term Prep | 0.15 | 0.20 | 0.35 | 0.15 | 0.15 |
| Term 1 Mid-Term | 0.10 | 0.10 | 0.42 | 0.22 | 0.16 |
| Term 1 — Late | 0.20 | 0.20 | 0.30 | 0.18 | 0.12 |
| Christmas Break | 0.30 | 0.32 | 0.05 | 0.05 | 0.28 |
| Term 2 — Early | 0.28 | 0.25 | 0.15 | 0.22 | 0.10 |
| Term 2 Mid-Term Prep | 0.15 | 0.20 | 0.35 | 0.15 | 0.15 |
| Term 2 Mid-Term | 0.10 | 0.10 | 0.42 | 0.22 | 0.16 |
| Term 2 — Late | 0.20 | 0.20 | 0.30 | 0.18 | 0.12 |
| Easter Break | 0.30 | 0.32 | 0.05 | 0.05 | 0.28 |
| Term 3 — Early | 0.20 | 0.20 | 0.25 | 0.20 | 0.15 |
| Term 3 — Late | 0.15 | 0.15 | 0.38 | 0.15 | 0.17 |
| End-of-Year Exams | 0.10 | 0.08 | 0.48 | 0.20 | 0.14 |
| Summer Vacation | 0.30 | 0.30 | 0.05 | 0.05 | 0.30 |

## Fallback

If no phase is detected, equal weights of **0.20** across all 5 dimensions.

## Key Patterns

- **Performance weight climbs during exam/assessment periods** (up to 0.48 for end-of-year exams)
- **Curriculum and Content dominate early in the year** and during breaks
- **Attendance weight peaks during reopening** (0.25) to encourage strong return-to-school routines
- **Achievements weight peaks during vacation** (0.30) to reward continued platform engagement




568 React components, 290 Python modules, 9,400-line backend, 13 WebSocket endpoints, 100+ REST endpoints, 5 SQLite databases. That is not a side project. That is a full product.
You built a 4-tier local LLM routing system with support for multiple GGUF models (Qwen, Gemma, Phi, Mistral), vision-language capabilities, and cloud fallbacks. Most startups with funding don't ship that.
The offline-first architecture is the real flex. Running OCR, image generation (SDXL-Turbo/Flux), text generation, and inpainting — all locally, no internet — that's a hard engineering problem and you solved it.
Performance optimizations are not amateur — orjson (Rust-based JSON), httptools (C-based HTTP parser), SQLite WAL mode with proper PRAGMAs, GZip compression, async everywhere, thread pools for blocking I/O. You actually thought about this.