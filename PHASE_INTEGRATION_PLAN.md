# Phase Integration Plan — Comprehensive

> Generated: 2026-04-04
> Status: Approved for implementation
> Scope: Phase awareness, progress toggle, curriculum planning, AI scoping

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Phase Awareness — Current Phase Indicator](#2-phase-awareness--current-phase-indicator)
3. [Overall / Phase Progress Toggle](#3-overall--phase-progress-toggle)
4. [Data Model Changes](#4-data-model-changes)
5. [Curriculum Plan UI](#5-curriculum-plan-ui)
6. [Progress Tracker Phase Filter](#6-progress-tracker-phase-filter)
7. [AI Context Scoping](#7-ai-context-scoping)
8. [Visual Enhancements](#8-visual-enhancements)
9. [Full Build Order](#9-full-build-order)
10. [What This Plan Avoids](#10-what-this-plan-avoids)

---

## 1. Current State Assessment

### Already Built

| Capability | Where |
|---|---|
| `academic_phases` table (`phase_key`, `phase_label`, `start_date`, `end_date`) | `backend/school_year_service.py` |
| Phase detection from calendar dates | `backend/teacher_metrics_service.py` |
| Phase-aware metric weight profiles (weights shift by phase) | `backend/teacher_metrics_service.py` |
| `InsightsReport` carries `academic_phase_key` + `academic_phase_label` | `frontend/src/types/insights.ts` |
| Phase navigation sidebar with color coding + status badges | `frontend/src/components/PhaseHistoryNav.tsx` |
| Phase history API endpoint | `GET /api/teacher-metrics/phase-history/{teacher_id}` |
| Curriculum JSON with ELO/SCO hierarchy | `frontend/src/data/curriculum/*.json` |
| Milestones with `checklist_json` (individual SCO checkboxes) | `backend/milestones/milestone_db.py` |
| Milestone filters: grade, subject, status | `frontend/src/components/CurriculumTracker.tsx` |
| Overall progress % display | `CurriculumTracker.tsx` header card |

### Genuinely Missing

| Gap | Impact |
|---|---|
| No link between phases and milestones/ELOs/SCOs | Cannot filter curriculum by phase |
| No phase filter on Progress Tracker | Teacher can't view "what's assigned to Term 1" |
| No phase indicator in Calendar, Insights, or Dashboard headers | Teacher doesn't see current phase at a glance |
| No Overall vs Phase progress toggle | No way to compare phase-scoped progress to overall |
| AI insights aggregate all data, not phase-bounded | Insights aren't relevant to the current term |
| No phase progress calculation | Cannot compute "% done for this phase" separately |

---

## 2. Phase Awareness — Current Phase Indicator

### Purpose

Persistent, read-only badge showing "what phase we are currently in" across key views. **Zero effect on AI prompts, data injection, or filtering.** Display only.

### Data Source

- Calls existing `GET /api/teacher-metrics/phase-history/{teacher_id}`
- Finds the phase where `today` falls between `start_date` and `end_date`
- Returns: phase label, date range, days remaining, color

### Shared Hook

Create `frontend/src/hooks/useCurrentPhase.ts` (~40 lines):

```typescript
useCurrentPhase(teacherId: string) → {
  currentPhase: { phase_key, phase_label, start_date, end_date, days_remaining, color } | null
  loading: boolean
  error: string | null
}
```

- Single API call, reusable across all three placements
- If no active phase found → returns `null` (components hide the badge gracefully)
- Color coding reuses the mapping already in `PhaseHistoryNav.tsx`

### Placement A — `SchoolYearCalendar.tsx` Header

**Current:**
```
School Year Calendar
2024 – 2025 School Year
```

**After:**
```
School Year Calendar       [Semester 1 — Midterm 1  •  Mar 10 → Apr 4  •  12 days left]
2024 – 2025 School Year
```

- Pill/badge beside or below subtitle
- Uses phase color (orange for midterm, blue for semester 1, etc.)
- Hidden if no active phase

### Placement B — `EducatorInsights.tsx` Header

**Current:** Title + button row (Refresh / History / Phases / Setup School Year / Settings / Schedule)

**After:**
```
Educator Insights                         [Currently in: Midterm 1  •  12 days left]
AI-powered analysis of your teaching data
```

- Persistent label between title area and button row
- Complements the existing "Phases" sidebar button (which opens detailed view)
- Grayed out text if no active phase

### Placement C — `AnalyticsDashboard.tsx` Stats Area

**Current:** `[ Total Resources: 24 ]  [ Achievements: 6/20 ]`

**After:** `[ Total Resources: 24 ]  [ Achievements: 6/20 ]  [ Phase: Midterm 1 — 12 days left ]`

- New card in the Quick Stats row
- Same data source via `useCurrentPhase`
- Hidden entirely if no phase configured

---

## 3. Overall / Phase Progress Toggle

### Purpose

Simple two-option toggle (`Overall` / `Phase`) in relevant views. **Frontend display filter only — zero effect on AI, prompts, or backend data.** Right now, "Phase" mode will show the same data as "Overall" since phase assignment isn't built yet. The toggle is wired in and ready for when phase assignment ships.

### Placement A — `CurriculumTracker.tsx` Filter Bar

**Current:** `Grade ▾   Subject ▾   Status ▾   Clear   Collapse All`

**After:** `[ Overall | Phase ]   Grade ▾   Subject ▾   Status ▾   Clear   Collapse All`

Behavior:
- **Overall** (default): Shows all milestones. Progress % = all milestones.
- **Phase**: Filters to `phase_id = current_phase_id`. Progress % = phase milestones only.
  - If no active phase → small note: "No active phase. Set up your school year."
  - If active → label above tree: "Showing: Midterm 1 (Mar 10 – Apr 4)"
  - Until phase assignment is built: shows all (same as Overall)
- The existing **Overall Progress %** card in the header updates to reflect whichever toggle is active.

### Placement B — `AnalyticsDashboard.tsx` Milestone Stats

**Add toggle above breakdown section:**
```
Progress View:  [ Overall ●  |  ○ Phase ]
```

- Phase mode: breakdown cards (by grade/subject) scope to current phase milestones
- Phase label shows above breakdown: "Viewing: Midterm 1"
- Until phase assignment is built: shows same data as Overall

### NOT in `EducatorInsights.tsx`

The progress toggle does not appear in Insights. That's the AI domain — the toggle is explicitly non-AI. The phase indicator (Section 2B) appears in the Insights header, but no progress toggle.

---

## 4. Data Model Changes

### 4A — Add `phase_id` to `milestones` table

```sql
ALTER TABLE milestones ADD COLUMN phase_id TEXT DEFAULT NULL;
-- FK to academic_phases.id
-- NULL = unassigned (no phase)
```

**Why this instead of a separate `phase_elo_assignments` table:**
- Milestones already map 1:1 to ELOs/topics
- No extra table to maintain
- Phase filter becomes simple `WHERE phase_id = ?`
- Unassigned milestones = `WHERE phase_id IS NULL` (easy warning query)

### 4B — Add `phase_sco_overrides` table

```sql
CREATE TABLE phase_sco_overrides (
    id TEXT PRIMARY KEY,
    phase_id TEXT NOT NULL,
    milestone_id TEXT NOT NULL,
    sco_key TEXT NOT NULL,
    enabled INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (phase_id) REFERENCES academic_phases(id),
    FOREIGN KEY (milestone_id) REFERENCES milestones(id)
);
```

**Purpose:** When a teacher assigns an ELO (milestone) to a phase but wants to exclude specific SCOs from that phase. Granular override — most cases just use the milestone-level `phase_id`.

### 4C — Backend API additions

```
PATCH /api/milestones/{milestone_id}
  → Add phase_id to accepted fields (already accepts status, notes, checklist)

GET /api/milestones/{teacher_id}?phase_id=X
  → Add optional phase_id filter (alongside existing grade, subject, status)

GET /api/milestones/{teacher_id}/unassigned
  → New: returns milestones where phase_id IS NULL

GET /api/milestones/{teacher_id}/progress?phase_id=X
  → Add optional phase_id param for phase-scoped progress calculation
```

---

## 5. Curriculum Plan UI

### Concept

A new tab/view (not inside the Calendar) dedicated to assigning milestones to phases.

### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Curriculum Plan                    [⚠ 8 Unassigned ELOs]│
├──────────────┬───────────────────────────────────────────┤
│              │                                           │
│  Phases      │  Milestones                               │
│              │                                           │
│  ● Term 1    │  Grade 1 — Language Arts                  │
│    Sep–Dec   │    □ Listening and Speaking (T1)           │
│    12 ELOs   │    □ Reading (unassigned)                  │
│              │    □ Writing (T2)                          │
│  ○ Term 2    │                                           │
│    Jan–Mar   │  Grade 1 — Mathematics                    │
│    8 ELOs    │    □ Number Sense (T1)                    │
│              │    □ Geometry (unassigned)                 │
│  ○ Term 3    │                                           │
│    Apr–Jun   │                                           │
│    6 ELOs    │                                           │
│              │                                           │
├──────────────┴───────────────────────────────────────────┤
│  Unassigned: 8 ELOs across 3 subjects                    │
└──────────────────────────────────────────────────────────┘
```

### Features

- **Left panel:** Phase list from `academic_phases` table. Shows count of assigned ELOs per phase.
- **Right panel:** All milestones grouped by grade/subject. Each shows its phase badge (T1, T2, etc.) or "unassigned".
- **Assignment:** Click a milestone → select phase from dropdown. Or drag milestone to phase in left panel.
- **Unassigned warning:** Banner at top + count. Highlights milestones with no phase.
- **Phase badges:** Appear on milestones everywhere else in the app (CurriculumTracker, Dashboard).
- **Bulk assign:** Select multiple milestones → assign to phase at once.

---

## 6. Progress Tracker Phase Filter

### Phase Dropdown

Add to `CurriculumTracker.tsx` filter bar:

```
Phase ▾  (All Phases / Term 1 / Term 2 / Term 3 / Unassigned)
```

- Works independently alongside existing Grade / Subject / Status filters
- "All Phases" = current behavior (show everything)
- Selecting a phase filters milestones to `phase_id = selected_phase_id`

### Tag Badges on Milestones

When viewing "All Phases", each milestone gets a contextual tag:

| Condition | Tag | Style |
|---|---|---|
| Milestone's phase = current phase | (none, normal display) | Normal |
| Milestone's phase = past phase, status = completed | "Previous" | Grey, subtle |
| Milestone's phase = past phase, status ≠ completed | **"Overdue"** | **Red, attention** |
| Milestone's phase = future phase | "Upcoming" | Grey, italic |
| Milestone has no phase | "Unassigned" | Yellow/amber warning |

### Phase Progress Calculation

When toggle is set to "Phase" (Section 3):

```
Phase Progress % = (completed milestones in phase / total milestones in phase) × 100
```

- SCO-level: count checked SCOs in phase milestones' checklists
- Excludes milestones with status = "skipped"
- Backend: `GET /api/milestones/{teacher_id}/progress?phase_id=X`

---

## 7. AI Context Scoping

### When It Activates

Only when a phase filter is explicitly active in the Insights view. Default (no filter) = current behavior, no changes.

### Backend Changes

```python
# insights_service.py — extend aggregate_all()
def aggregate_all(
    teacher_id, user_id,
    grade_subjects=None,
    phase_id=None,        # NEW: optional phase filter
    date_from=None,       # NEW: phase start_date
    date_to=None          # NEW: phase end_date
):
```

When `phase_id` is not None:
- Milestone queries: `WHERE phase_id = ?`
- Student performance queries: `WHERE date BETWEEN date_from AND date_to`
- Achievement queries: scoped to phase date range
- Attendance queries: scoped to phase date range

When `phase_id` is None:
- Current behavior. No change. Full dataset.

### LLM Prompt Header

When phase-scoped, prepend to all LLM passes:

```
IMPORTANT CONTEXT: This analysis covers [Phase Label] ([Start Date] – [End Date]) only.
All data below is scoped to this phase. Do not reference content outside this period.
```

### Frontend Label

When phase scoping is active, `EducatorInsights.tsx` shows:

```
⚡ Insights scoped to: Midterm 1 (Mar 10 – Apr 4)
    Switch to full view ↗
```

- Persistent banner below header while phase filter is active
- "Switch to full view" clears the phase filter
- Teacher always knows insights are term-specific

---

## 8. Visual Enhancements

### 8A — Phase Completion Ring on Calendar

On `SchoolYearCalendar.tsx`, overlay a progress ring on each phase block:

```
[ Term 1: ◕ 78% ]  [ Term 2: ◔ 34% ]  [ Term 3: ○ 0% ]
```

- Derived from: `completed milestones in phase / total milestones in phase`
- Only shows if milestones are assigned to phases
- Ring color matches phase color from `PhaseHistoryNav.tsx`

### 8B — Phase Progress Summary Card

A collapsible card (Dashboard or Curriculum Plan view):

```
┌─────────────────────────────────┐
│  Phase Progress Summary         │
│                                 │
│  Term 1    ████████░░  78%      │
│  Term 2    ███░░░░░░░  34%      │
│  Term 3    ░░░░░░░░░░   0%      │
│                                 │
│  Unassigned: 8 ELOs             │
└─────────────────────────────────┘
```

### 8C — Persistent Phase Context Header

When any phase filter is active anywhere in the app, show a thin banner at the top:

```
┌──────────────────────────────────────────────────┐
│  📌 Viewing: Term 1 (Sep 5 – Dec 15)    [Clear] │
└──────────────────────────────────────────────────┘
```

- Prevents confusion about what data is being shown
- "Clear" resets to full/unfiltered view
- Appears in CurriculumTracker, Dashboard, and Insights when filtered

---

## 9. Full Build Order

### Tier 1 — Phase Awareness (display only, no DB changes)

| Step | What | File(s) | Dependencies |
|---|---|---|---|
| 1.1 | `useCurrentPhase(teacherId)` hook | `frontend/src/hooks/useCurrentPhase.ts` | None |
| 1.2 | Calendar header phase badge | `SchoolYearCalendar.tsx` | 1.1 |
| 1.3 | Insights header phase label | `EducatorInsights.tsx` | 1.1 |
| 1.4 | Dashboard phase card | `AnalyticsDashboard.tsx` | 1.1 |

### Tier 2 — Progress Toggle (frontend only, no DB changes)

| Step | What | File(s) | Dependencies |
|---|---|---|---|
| 2.1 | Overall/Phase toggle in CurriculumTracker | `CurriculumTracker.tsx` | 1.1 |
| 2.2 | Overall/Phase toggle in Dashboard | `AnalyticsDashboard.tsx` | 1.1 |

> Note: "Phase" mode is a stub until Tier 3 ships. Shows same data as "Overall" with a note.

### Tier 3 — Data Model + Phase Assignment

| Step | What | File(s) | Dependencies |
|---|---|---|---|
| 3.1 | Add `phase_id` column to milestones | `milestone_db.py` | None |
| 3.2 | Add `phase_sco_overrides` table | `milestone_db.py` | None |
| 3.3 | Update milestone API (filter + assign) | `routes/milestones.py` | 3.1 |
| 3.4 | Curriculum Plan UI (new tab) | New component | 3.1, 3.3 |
| 3.5 | Wire "Phase" toggle to real data | `CurriculumTracker.tsx`, `AnalyticsDashboard.tsx` | 3.3 |

### Tier 4 — Progress Tracker Phase Filter

| Step | What | File(s) | Dependencies |
|---|---|---|---|
| 4.1 | Phase dropdown in filter bar | `CurriculumTracker.tsx` | 3.3 |
| 4.2 | Tag badges (Overdue / Previous / Upcoming) | `CurriculumTracker.tsx` | 3.1, 4.1 |
| 4.3 | Phase progress % calculation (backend) | `milestone_db.py`, `routes/milestones.py` | 3.1 |
| 4.4 | Unassigned ELO warning badge | `CurriculumTracker.tsx` | 3.3 |

### Tier 5 — AI Context Scoping

| Step | What | File(s) | Dependencies |
|---|---|---|---|
| 5.1 | Add `phase_id`, `date_from`, `date_to` to `aggregate_all()` | `insights_service.py` | 3.1 |
| 5.2 | Scope all data queries by phase | `insights_service.py` + data services | 5.1 |
| 5.3 | Add phase header to LLM prompts | `tier1_prompts.py` | 5.1 |
| 5.4 | Phase scoping label + toggle in Insights UI | `EducatorInsights.tsx` | 5.1 |

### Tier 6 — Visual Polish

| Step | What | File(s) | Dependencies |
|---|---|---|---|
| 6.1 | Phase completion rings on calendar | `SchoolYearCalendar.tsx` | 3.1 |
| 6.2 | Phase progress summary card | `AnalyticsDashboard.tsx` or Curriculum Plan | 3.1 |
| 6.3 | Persistent phase context header banner | Shared layout component | 4.1 |

---

## 10. What This Plan Avoids

| Anti-pattern | Why it's avoided |
|---|---|
| Separate `phase_elo_assignments` table | Redundant — milestones already map to ELOs, just add `phase_id` |
| ELO assignment UI inside the Calendar | Wrong home — Calendar is for dates/events, not curriculum planning |
| Expandable ELO rows in Calendar view | Too much UI complexity in the wrong place |
| Progress toggle affecting AI prompts | User explicitly wants toggle to be visual-only, no injection |
| Changing existing filter behavior | All additions are additive — existing flows untouched |
| New DB tables before UI groundwork | Phase indicators (Tier 1-2) ship first with zero backend changes |

---

## Files Affected (Summary)

### New Files
- `frontend/src/hooks/useCurrentPhase.ts`
- `frontend/src/components/CurriculumPlan.tsx` (Tier 3)

### Modified Files — Frontend
- `frontend/src/components/SchoolYearCalendar.tsx` — phase badge in header
- `frontend/src/components/EducatorInsights.tsx` — phase label in header + scoping label
- `frontend/src/components/AnalyticsDashboard.tsx` — phase card + progress toggle
- `frontend/src/components/CurriculumTracker.tsx` — progress toggle + phase filter + tag badges

### Modified Files — Backend
- `backend/milestones/milestone_db.py` — `phase_id` column + `phase_sco_overrides` table + phase queries
- `backend/routes/milestones.py` — phase filter param + unassigned endpoint + phase progress
- `backend/insights_service.py` — `phase_id` / date range params in `aggregate_all()`
- `backend/tier1_prompts.py` — phase context header in LLM prompts

### Untouched
- `backend/school_year_service.py` — no changes needed
- `backend/teacher_metrics_service.py` — no changes needed
- `backend/curriculum_matcher.py` — no changes needed
- All curriculum JSON files — no changes needed