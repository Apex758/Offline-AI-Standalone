# Comprehensive Export/Import Enhancement Plan

## Overview

The current Settings → Backup & Restore feature exports 11 categories of data. However, several important data types are missing from the export, including Brain Dump entries, Calendar Tasks, Presentations, Achievements, and Milestones.

## Current Export Categories

The following categories are **currently exported** via `Settings > Backup & Restore`:

| Category         | Data Source             | Storage Location                |
| ---------------- | ----------------------- | ------------------------------- |
| chats            | Chat history            | Backend chat_memory             |
| lesson_plans     | Lesson plans            | `lesson_plan_history.json`      |
| quizzes          | Quiz history            | `quiz_history.json`             |
| rubrics          | Rubric history          | `rubric_history.json`           |
| kindergarten     | Early childhood plans   | `kindergarten_history.json`     |
| multigrade       | Multi-level plans       | `multigrade_history.json`       |
| cross_curricular | Integrated lesson plans | `cross_curricular_history.json` |
| worksheets       | Worksheet history       | `worksheet_history.json`        |
| images           | Generated images        | `images_history.json`           |
| students         | Student records         | Backend student_service         |
| settings         | App settings            | Frontend SettingsContext        |

---

## Missing Export Categories

The following data types are **NOT currently included** in the export/import:

### 1. Brain Dump Entries ⭐ HIGH PRIORITY

- **Description**: Teacher brain dump entries with analyzed actions
- **Storage**: Frontend localStorage (`brain-dump-entries`)
- **Data Structure**: Array of BrainDumpEntry objects containing actions, text, and metadata
- **Impact**: Teachers lose their collected ideas and organized tasks when migrating

### 2. Dashboard Tasks / Calendar Tasks ⭐ HIGH PRIORITY

- **Description**: Teacher tasks and reminders created from brain dumps or manually
- **Storage**: Frontend localStorage (`dashboard-tasks`)
- **Data Structure**: Array of Task objects with title, description, date, priority, status
- **Impact**: Teachers lose their task lists and reminders

### 3. Presentation History ⭐ MEDIUM PRIORITY

- **Description**: PowerPoint/presentation builds created by the teacher
- **Storage**: Backend `presentation_history.json`
- **Data Structure**: Array of presentation objects with content, metadata, timestamps
- **Impact**: Teachers lose their presentation drafts

### 4. Achievements ⭐ MEDIUM PRIORITY

- **Description**: Teacher achievements and earned badges
- **Storage**: Backend achievement_service
- **Data Structure**: Array of earned achievements with achievement_id, earned_at, teacher_id
- **Impact**: Teachers lose their achievement progress

### 5. Milestones / Progress Tracker ⭐ MEDIUM PRIORITY

- **Description**: Curriculum milestone progress and checklist states
- **Storage**: Backend milestone_db
- **Data Structure**: Array of milestones with status, due dates, notes, checklist progress
- **Impact**: Teachers lose their curriculum tracking progress

### 6. Chat Memory Files ⭐ LOW PRIORITY

- **Description**: Additional chat memory/context files
- **Storage**: Backend `chat_memory.json`
- **Impact**: Chat loses context/history

### 7. Lesson Drafts ⭐ LOW PRIORITY

- **Description**: In-progress lesson plans that haven't been finalized
- **Storage**: Backend `lesson_drafts.json`
- **Impact**: Teachers lose draft lesson plans

---

## Implementation Plan

### Phase 1: High Priority (Frontend localStorage data)

#### 1.1 Add Brain Dump Export

**Files to modify:**

- `frontend/src/components/Settings.tsx` - Add `brain_dumps` to DATA_CATEGORIES
- `backend/main.py` - Add brain dump export/import handlers (or handle in frontend)

**Implementation approach:**

- Since brain dumps are stored in localStorage, handle export in frontend
- Add to the export payload alongside 'settings'
- On import, restore to localStorage

#### 1.2 Add Dashboard Tasks Export

**Files to modify:**

- `frontend/src/components/Settings.tsx` - Add `tasks` to DATA_CATEGORIES

**Implementation approach:**

- Export from localStorage `dashboard-tasks`
- On import, restore to localStorage

---

### Phase 2: Medium Priority (Backend data)

#### 2.1 Add Presentation History Export

**Files to modify:**

- `backend/main.py` - Add `presentations` to export_data and import_data
- `frontend/src/components/Settings.tsx` - Add `presentations` to DATA_CATEGORIES

**Implementation:**

```python
if "presentations" in cats:
    result["presentations"] = load_json_data("presentation_history.json")
```

#### 2.2 Add Achievements Export

**Files to modify:**

- `backend/routes/achievements.py` - Add export endpoint
- `backend/main.py` - Add achievements to export_data and import_data
- `frontend/src/components/Settings.tsx` - Add `achievements` to DATA_CATEGORIES

**Implementation:**

- Query earned achievements from achievement_service
- Include both definitions and earned records

#### 2.3 Add Milestones Export

**Files to modify:**

- `backend/routes/milestones.py` - Add export endpoint
- `backend/main.py` - Add milestones to export_data and import_data
- `frontend/src/components/Settings.tsx` - Add `milestones` to DATA_CATEGORIES

**Implementation:**

- Query milestones from milestone_db for the teacher
- Include all milestone data (status, checklist, notes, due dates)

---

### Phase 3: Low Priority

#### 3.1 Add Lesson Drafts Export

**Files to modify:**

- `backend/main.py` - Add `lesson_drafts` to export

#### 3.2 Add Chat Memory Files Export

**Files to modify:**

- `backend/main.py` - Add chat memory files to export

---

## UI Updates

### Settings.tsx DATA_CATEGORIES Update

```typescript
const DATA_CATEGORIES = [
  { key: "chats", label: "Chat History" },
  { key: "lesson_plans", label: "Lesson Plans" },
  { key: "kindergarten", label: "Early Childhood Plans" },
  { key: "multigrade", label: "Multi-Level Plans" },
  { key: "cross_curricular", label: "Integrated Lesson Plans" },
  { key: "quizzes", label: "Quizzes" },
  { key: "rubrics", label: "Rubrics" },
  { key: "worksheets", label: "Worksheets" },
  { key: "images", label: "Generated Images" },
  { key: "presentations", label: "Presentations" }, // NEW
  { key: "brain_dumps", label: "Brain Dumps" }, // NEW
  { key: "tasks", label: "Tasks & Reminders" }, // NEW
  { key: "milestones", label: "Progress Tracker" }, // NEW
  { key: "achievements", label: "Achievements" }, // NEW
  { key: "students", label: "Student Records" },
  { key: "settings", label: "App Settings" },
] as const;
```

---

## Data Flow Diagram

```mermaid
graph TD
    A[Settings > Backup & Restore] --> B[Select Categories]
    B --> C[handleBulkExport]
    C --> D[Frontend Data]
    C --> E[Backend API]

    D --> D1[localStorage: brain-dump-entries]
    D --> D2[localStorage: dashboard-tasks]
    D --> D3[SettingsContext]

    E --> E1[/api/export-data]
    E1 --> E1a[chats, lesson_plans, quizzes, etc.]
    E1 --> E1b[presentations - NEW]
    E1 --> E1c[achievements - NEW]
    E1 --> E1d[milestones - NEW]

    F[Import Process] --> F1[processImportFile]
    F1 --> F2[Restore Frontend Data]
    F1 --> F3[POST /api/import-data]
```

---

## Testing Checklist

After implementation, verify:

- [ ] Brain dumps export and import correctly
- [ ] Tasks & reminders export and import correctly
- [ ] Presentations export and import correctly
- [ ] Achievements export and import correctly
- [ ] Milestones export and import correctly
- [ ] Existing categories still work correctly
- [ ] Partial import (selective categories) works
- [ ] Version compatibility maintained

---

## Migration Notes

When exporting data that includes milestones and achievements:

1. These are teacher-specific - need teacher_id association
2. On import, may need to re-associate with correct teacher account
3. Consider adding version field to exported data for future compatibility

---

## Summary

| Priority | Category          | Effort | Storage  |
| -------- | ----------------- | ------ | -------- |
| HIGH     | Brain Dumps       | Low    | Frontend |
| HIGH     | Tasks & Reminders | Low    | Frontend |
| MEDIUM   | Presentations     | Low    | Backend  |
| MEDIUM   | Achievements      | Medium | Backend  |
| MEDIUM   | Milestones        | Medium | Backend  |
| LOW      | Lesson Drafts     | Low    | Backend  |
| LOW      | Chat Memory       | Low    | Backend  |

**Recommended Implementation Order**: Brain Dumps → Tasks → Presentations → Achievements → Milestones
