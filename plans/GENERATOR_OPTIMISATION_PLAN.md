# Generator Optimisation Plan

> Lesson Planners · Quiz Generator · Rubric Generator

---

## What We're Solving

Right now teachers have to:

- Re-type **the same Grade + Subject** in every tool, every time
- Re-enter **strand, outcomes, and topic** from scratch in each generator
- Click through all checkboxes for **pedagogical strategies and learning styles** from zero each time
- Type freehand numbers for **duration and student count** when the app already knows those from the Timetable
- Re-enter **learning objectives** in the Rubric Generator even after just creating a Lesson Plan for that same topic
- Scroll past fields you never use just to reach the ones you do

---

## What Data the App Already Has

| Data                                          | Source                                      | Currently Used In                       |
| --------------------------------------------- | ------------------------------------------- | --------------------------------------- |
| Teacher's Grade → Subject mapping             | `SettingsContext.profile.gradeSubjects`     | All planners (filtered dropdowns)       |
| Class name, duration, student count           | `TimetableContext` / `useTimetableAutofill` | LessonPlanner only                      |
| Strand, essential outcomes, specific outcomes | `CurriculumAlignmentFields`                 | All planners (manual selection)         |
| Prior lesson plans                            | `lesson-plan-history` API                   | QuizGenerator (locked lesson plan only) |
| Teacher name, school                          | `LicenseContext`                            | Nowhere in generators                   |

---

## Optimisation Areas

### 1 — Duration Quick-Pick Chips

**Problem:** Every planner/generator has a plain text field where teachers type `40`, `45`, `60`, `80` every time.

**Fix:** Replace the text input with a row of single-click chip buttons for the most common durations, with a free-text fallback.

```
[ 30 min ] [ 40 min ] [ 45 min ] [ 60 min ] [ 80 min ] [ Other: ___ ]
```

**Affected:** `LessonPlanner`, `KindergartenPlanner`, `MultigradePlanner`, `CrossCurricularPlanner`

**Files to change:**

- `frontend/src/components/ui/DurationPicker.tsx` ← new shared component
- Wire into each planner's Step 1

---

### 2 — Quiz Presets

**Problem:** Teachers set `numberOfQuestions`, `questionTypes`, and `cognitiveLevels` from scratch every single time. These combos are repetitive.

**Fix:** Preset chips at the top of the quiz form that fill in the common combinations with one click.

| Preset                | numberOfQuestions | questionTypes               | cognitiveLevels                                 |
| --------------------- | ----------------- | --------------------------- | ----------------------------------------------- |
| **Quick Check**       | 10                | Multiple Choice             | Knowledge, Comprehension                        |
| **Full Test**         | 25                | Multiple Choice, True/False | Knowledge, Comprehension, Application, Analysis |
| **Mixed Assessment**  | 15                | Multiple Choice, Open-Ended | Comprehension, Application, Analysis            |
| **Short Answer Only** | 10                | Open-Ended                  | Application, Analysis, Evaluation               |

Each preset is just a one-click fill — teacher can still tweak afterwards.

**Files to change:**

- `frontend/src/data/generatorPresets.ts` ← new presets data file
- `frontend/src/components/QuizGenerator.tsx` — add preset row above Step 1 fields

---

### 3 — Rubric Presets (by Assignment Type)

**Problem:** When you pick "Essay" as the assignment type, you still have to manually tick all the relevant focus areas and set performance levels.

**Fix:** Selecting an assignment type auto-populates sensible defaults for `focusAreas`, `performanceLevels`, and an optional `specificRequirements` hint.

| assignmentType   | Auto-filled focusAreas                                               | performanceLevels |
| ---------------- | -------------------------------------------------------------------- | ----------------- |
| Essay            | Content Knowledge, Critical Thinking, Communication, Organisation    | 4                 |
| Presentation     | Communication, Presentation Skills, Creativity, Organisation         | 4                 |
| Project          | Content Knowledge, Research Skills, Collaboration, Problem Solving   | 4                 |
| Lab Report       | Content Knowledge, Technical Skills, Critical Thinking, Organisation | 4                 |
| Group Work       | Collaboration, Communication, Problem Solving, Creativity            | 3                 |
| Creative Writing | Creativity, Communication, Organisation, Content Knowledge           | 4                 |
| Portfolio        | Creativity, Organisation, Research Skills, Content Knowledge         | 4                 |

These are soft defaults — teacher can modify any field after selection.

**Files to change:**

- `frontend/src/data/generatorPresets.ts` — add rubric presets
- `frontend/src/components/RubricGenerator.tsx` — trigger preset fill on `assignmentType` change

---

### 4 — Teaching Style Preset for LessonPlanner

**Problem:** Step 2 of the Lesson Planner has ~20 checkboxes for `pedagogicalStrategies`, `learningStyles`, `learningPreferences`, and `multipleIntelligences`. Teachers check almost identical boxes every week.

**Fix A — Remember Last Used:** When a lesson plan is successfully generated, save the Step 2 selections to a key in `localStorage` (`lesson_teaching_style_defaults`). On next open, pre-populate those fields rather than starting blank.

**Fix B — Teaching Style Preset Chips:** Provide 3 quick-start presets:

| Preset                          | What gets pre-filled                                                  |
| ------------------------------- | --------------------------------------------------------------------- |
| **My Usual**                    | Restores their last-saved Step 2 selections (from Fix A)              |
| **Interactive & Collaborative** | Cooperative Learning + Visual + Kinaesthetic + Interpersonal/Social   |
| **Direct Instruction**          | Direct Teaching + Auditory + Linguistic/Verbal + Logical/Mathematical |
| **Inquiry-Based**               | Problem-Based + Kinaesthetic + Visual + Naturalist/Scientific         |

**Files to change:**

- `frontend/src/components/LessonPlanner.tsx` — add preset row to Step 2, persist Step 2 to localStorage on generation
- `frontend/src/data/generatorPresets.ts` — add teaching style presets

---

### 5 — Import Lesson Plan into RubricGenerator

**Problem:** QuizGenerator already has a "locked lesson plan" feature that imports subject, grade, strand, outcomes and learning objectives from a saved plan. RubricGenerator doesn't — yet teachers almost always create a rubric for an assignment that follows a lesson plan.

**Fix:** Add an "Import from Lesson Plan" button to the RubricGenerator form (same UI pattern as QuizGenerator). When clicked, it opens a lesson plan selector modal. On selection it fills in:

- `subject`, `gradeLevel`, `strand`
- `essentialOutcomes`, `specificOutcomes`
- `learningObjectives` ← pulled from the parsed lesson's `learningObjectives[]`

**Files to change:**

- `frontend/src/components/RubricGenerator.tsx` — add import button + locked state (same pattern as QuizGenerator's `lockedLessonPlan`)
- Reuse existing lesson plan history API call already in QuizGenerator

---

### 6 — "Send to Quiz" / "Send to Rubric" Buttons on Lesson Plan Output

**Problem:** After a lesson plan is generated, there's no quick path to create an assessment for it. Teachers have to navigate to QuizGenerator, then manually select the locked lesson plan from history.

**Fix:** Add two action buttons to the lesson plan output toolbar:

- **"Create Quiz →"** — opens QuizGenerator in a new tab with this lesson plan pre-locked
- **"Create Rubric →"** — opens RubricGenerator in a new tab with this lesson plan imported

These sit alongside the existing "Save", "Export", and "Assistant" buttons.

**Files to change:**

- `frontend/src/components/LessonPlanner.tsx` — add two action buttons in the output header; they call `onDataChange` / parent tab routing to open sibling tabs
- `frontend/src/components/Dashboard.tsx` — handle the "open with prefilled data" event

---

### 7 — Collapse Rarely-Used Fields

**Problem:** Several fields are almost never changed but sit in the main flow, adding scroll and visual noise.

#### LessonPlanner

| Field                  | Current                                 | Change                                             |
| ---------------------- | --------------------------------------- | -------------------------------------------------- |
| `customLearningStyles` | Always visible text area                | Move behind `+ Add custom style` toggle            |
| `specialNeedsDetails`  | Always visible when `specialNeeds=true` | Already conditional — good                         |
| `prerequisiteSkills`   | Required in Step 2 validation           | Make optional; move to Step 3 "Additional Details" |

#### QuizGenerator

| Field                  | Current        | Change                                             |
| ---------------------- | -------------- | -------------------------------------------------- |
| `timeLimitPerQuestion` | Always visible | Move into collapsible "Advanced Options" accordion |

#### RubricGenerator

| Field                  | Current                       | Change                                             |
| ---------------------- | ----------------------------- | -------------------------------------------------- |
| `specificRequirements` | Full text area always visible | Move into collapsible "Advanced Options" accordion |
| `includePointValues`   | Always visible toggle         | Keep but move to Advanced Options                  |

**Files to change:**

- `frontend/src/components/LessonPlanner.tsx`
- `frontend/src/components/QuizGenerator.tsx`
- `frontend/src/components/RubricGenerator.tsx`

---

### 8 — Persist Last-Used Quiz Settings

**Problem:** Even without presets, teachers want their last quiz settings remembered. Right now `getDefaultFormData()` in QuizGenerator always returns empty arrays for `questionTypes` and `cognitiveLevels`.

**Fix:** On successful quiz generation, store `questionTypes`, `cognitiveLevels`, `numberOfQuestions`, and `timeLimitPerQuestion` to `localStorage` under `quiz_last_settings`. On next open (new tab), pre-populate from those stored values.

**Files to change:**

- `frontend/src/components/QuizGenerator.tsx` — read from `quiz_last_settings` in `getDefaultFormData()`, write to it after generation completes

---

## New File: `frontend/src/data/generatorPresets.ts`

This single file will be the source of truth for all presets across tools:

```ts
// Quiz presets
export const QUIZ_PRESETS = [ ... ]

// Rubric presets per assignment type
export const RUBRIC_PRESETS: Record<string, RubricPreset> = { ... }

// Teaching style presets for LessonPlanner
export const TEACHING_STYLE_PRESETS = [ ... ]

// Duration chips (shared across all planners)
export const DURATION_CHIPS = [30, 40, 45, 60, 80]
```

---

## New Shared Component: `frontend/src/components/ui/DurationPicker.tsx`

```tsx
// Props: value, onChange, accentColor
// Renders: chip row for common values + "Other" freetext fallback
```

---

## Summary of Changes per File

| File                                                 | Changes                                                                                                                           |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/data/generatorPresets.ts`              | **NEW** — all preset data                                                                                                         |
| `frontend/src/components/ui/DurationPicker.tsx`      | **NEW** — shared duration chip picker                                                                                             |
| `frontend/src/components/LessonPlanner.tsx`          | Duration chips · Teaching style presets · Persist Step 2 defaults · "Send to Quiz/Rubric" buttons · Collapse customLearningStyles |
| `frontend/src/components/QuizGenerator.tsx`          | Quiz preset chips · Persist last-used settings · Collapse timeLimitPerQuestion                                                    |
| `frontend/src/components/RubricGenerator.tsx`        | Rubric assignment-type presets · Import from Lesson Plan feature · Collapse specificRequirements + includePointValues             |
| `frontend/src/components/KindergartenPlanner.tsx`    | Duration chips                                                                                                                    |
| `frontend/src/components/MultigradePlanner.tsx`      | Duration chips                                                                                                                    |
| `frontend/src/components/CrossCurricularPlanner.tsx` | Duration chips                                                                                                                    |
| `frontend/src/components/Dashboard.tsx`              | Handle "open with prefilled data" event for cross-tool navigation                                                                 |

---

## What This Does NOT Do

- Does **not** remove the curriculum alignment fields (strand/outcomes) — they're required for quality output
- Does **not** auto-submit forms — all presets are one-click fill, teacher reviews before generating
- Does **not** add new backend endpoints — all changes are frontend-only

---

## Implementation Order

1. [x] `generatorPresets.ts` and `DurationPicker.tsx` — foundational shared pieces, no risk  *(done 2026-04-11)*
2. [x] Duration chips in all planners — LessonPlanner, KindergartenPlanner, MultigradePlanner, CrossCurricularPlanner  *(done 2026-04-11)*
3. [x] Quiz presets + persist last-used settings  *(done 2026-04-11)*
4. [x] Rubric assignment-type presets  *(done 2026-04-11)*
5. [ ] Teaching style preset / remember-last for LessonPlanner Step 2
6. [ ] Import Lesson Plan into RubricGenerator
7. [ ] "Send to Quiz/Rubric" buttons on LessonPlanner output
8. [ ] Collapse rarely-used fields

---

## Implementation Notes (2026-04-11)

- `generatorPresets.ts` lives at `frontend/src/data/generatorPresets.ts` and
  exports `DURATION_CHIPS`, `QUIZ_PRESETS`, `RUBRIC_PRESETS`, plus
  `loadQuizLastSettings()` / `saveQuizLastSettings()` helpers backed by
  `localStorage` key `quiz_last_settings`.
- `DurationPicker` (`frontend/src/components/ui/DurationPicker.tsx`) is a
  controlled `value: string` / `onChange` component to match each planner's
  existing form-state shape; no migration of `FormData` types was needed.
- CrossCurricularPlanner previously accepted freeform strings like
  `"60 minutes, 2 class periods"`. It now stores a number via DurationPicker;
  the prompt builder already treats duration as a plain string so this is
  compatible, but if teachers have a strong need for freeform durations
  there, revisit by allowing DurationPicker's "Other" field to accept text.
- QuizGenerator's preset chips are above the question-count field in Step 1
  and mark themselves "active" (accent-filled) when the current form values
  exactly match a preset — so teachers can see at a glance that they've
  drifted.
- RubricGenerator auto-fill fires on every `assignmentType` change, which
  will overwrite manual `focusAreas` tweaks if the teacher changes type
  mid-edit. This matches the spec ("soft defaults") but is worth watching.
