# CLAUDE.md

## Purpose
Central guidance for AI-assisted development.
Ensures consistency, cost control, and correct implementation.

---

## Core Rule (MANDATORY)
Do NOT make changes until you have **≥95% confidence** in the task.

- Ask follow-up questions if unclear
- Do not assume missing requirements
- Do not guess APIs or structures
- Prefer clarification over incorrect implementation

---

## Environment Setup (MANDATORY)

### Backend Virtual Environment
Always activate the Python venv before running any backend/Python commands:
```
cd backend
.\venv\Scripts\Activate
```
(Bash equivalent: `source backend/venv/Scripts/activate`)

Never run `pip install`, `python`, or any backend command without the venv active.

---

## Model Routing Strategy

### Default
- Use Sonnet for all tasks

### Escalation to Opus (STRICT)
Only escalate if:

1. Sonnet fails after 2 attempts  
2. Complex debugging (multi-layer issues)  
3. Architecture/system design decisions  
4. Critical correctness required (grading, validation)  
5. Output fails validation/tests  

### Never Use Opus For
- UI tweaks
- Styling
- Simple CRUD
- Small fixes
- Boilerplate

### Cost Control
- No automatic retries with Opus  
- Log every Opus usage  
- Prefer partial retries over full reruns  

---

## Tech Stack

Frontend:
- Electron
- React

Backend:
- Python

AI / ML:
- OCR models (local)
- Vision-language model

---

## Architecture Principles

- Offline-first (must work without internet)
- Modular design (separate OCR, parsing, grading)
- Clear data flow: OCR → Parse → Validate → Grade
- Avoid tight coupling between frontend and backend
- Prefer simple solutions over complex abstractions

---

## Progress Summary
(Update frequently, keep short)

- Current focus:
- Completed:
- Blockers:

---

## Coding Conventions

General:
- Write clear, readable code
- Avoid unnecessary complexity
- Use descriptive variable names

Frontend:
- Functional components (React)
- Keep components small and reusable

Backend:
- Modular Python structure
- Separate logic from I/O

AI Handling:
- Always validate model outputs
- Never trust raw AI responses
- Enforce strict schemas (JSON)

---

## Validation Rules

Before accepting any output:
- Is JSON valid?
- Does schema match expected format?
- Are required fields present?
- Does logic match expected outcome?

If ANY fail → retry or escalate

---

## Execution Strategy

1. Understand task  
2. Ask questions if <95% confidence  
3. Implement with Sonnet  
4. Validate output  
5. Retry if needed  
6. Escalate to Opus only if necessary  

---

## Context & Sub-Agent Rules

- For tasks requiring **3+ lines of reasoning** or **multi-file analysis**:  
  - Spawn a **sub-agent** to explore/research the task  
  - Sub-agent output **must be summarized**  
  - Only include **key insights** in main response  
- Avoid running full multi-file analysis on main model  
- Keep sub-agent interactions **isolated** to prevent token waste  
- Apply same **validation rules** to sub-agent outputs before merging

---

## Build & Run Commands
(Update as needed)

Frontend:
- `npm install`
- `npm run dev`

Backend:
- `pip install -r requirements.txt`
- `python main.py`

---

## Philosophy

AI is an assistant, not an authority.
Always verify, validate, and control outputs.

---

## Applied Learning (Recurring Tasks & Token Saving)

- Optimize AI usage to save tokens and reduce repetitive work.  
- Always check backend environment active before running commands.  
- Remember recurring bug fixes across multiple files; apply consistently.  
- Cache validation results to prevent repeating failed tests.  
- Learn frequent dependency versions and reuse installation commands.  
- Summarize multi-file changes to avoid redundant analysis.  
- Track recurring warnings/errors and suggest automated fixes.  
- Maintain consistent naming and folder conventions for AI recall.  
- Detect recurring pipeline steps and automate pre-run checks.  
- Note frequently escalated tasks; preemptively optimize Sonnet outputs.
