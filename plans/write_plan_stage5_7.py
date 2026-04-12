content = r"""
---

## STAGE 5 — Class Build-Out: Grade 1/2/4 x Math/Language Arts/Science x 3 sections (1A/1B/1C)

*Goal: Build the full multi-class scenario: 3 grades x 3 subjects x 3 sections = 27 classes. This is the spine of all downstream testing.*

### 5.1 Grade 1 Classes (9 classes)

- [ ] Create class **Grade 1 Math 1A**, **1B**, **1C** `[CRITICAL]`
- [ ] Create class **Grade 1 Language Arts 1A**, **1B**, **1C** `[CRITICAL]`
- [ ] Create class **Grade 1 Science 1A**, **1B**, **1C** `[CRITICAL]`
- Findings: ___

### 5.2 Grade 2 Classes (9 classes)

- [ ] Repeat the 9-class set for **Grade 2** (2A/2B/2C x Math/LA/Science) `[CRITICAL]`
- Findings: ___

### 5.3 Grade 4 Classes (9 classes)

- [ ] Repeat the 9-class set for **Grade 4** (4A/4B/4C x Math/LA/Science) `[CRITICAL]`
- Findings: ___

### 5.4 Class Roster Verification

- [ ] All 27 classes appear in `My Classes` and the global class picker `[HIGH]`
- [ ] Backend `/api/classes` returns all 27 with correct grade_level + subject `[HIGH]`
- [ ] No duplicate-class warning falsely fires across different subjects with same section name `[MEDIUM]`
- [ ] Sidebar/global active-class picker can switch between any of the 27 without UI lag `[MEDIUM]`
- [ ] ClassConfig saved per class is independent (changing 1A Math doesn't bleed into 1A Language Arts) `[HIGH]`
- Findings: ___

### 5.5 Class CRUD

- [ ] Create a class `[HIGH]`
- [ ] Rename a class `[MEDIUM]`
- [ ] Delete a class `[HIGH]`
- [ ] View class roster `[HIGH]`
- Findings: ___

---

## STAGE 6 — Student Rostering (Manual + Bulk Import)

*Goal: Populate students into the 27 classes with full demographic and IEP data.*

### 6.1 Manual Student Entry

- [ ] Add a new student (all fields) `[CRITICAL]`
- [ ] Edit student details `[HIGH]`
- [ ] Delete a student `[HIGH]`
- [ ] Student ID auto-generated `[MEDIUM]`
- [ ] Filter students by class `[HIGH]`
- [ ] Filter students by grade `[HIGH]`
- Findings: ___

### 6.2 Full-Field Rostering

- [ ] Roster sample students into Grade 1A across all three subjects (verify they are scoped per class) `[HIGH]`
- [ ] For each student capture: full name, DOB, gender, parent contact (phone + email), learning style, IEP/accommodations `[HIGH]`
- Findings: ___

### 6.3 Bulk Import

- [ ] Download sample Excel template `[HIGH]`
- [ ] Fill template and upload `[HIGH]`
- [ ] Students imported correctly to database `[CRITICAL]`
- [ ] Validation errors shown for bad data `[HIGH]`
- [ ] Bulk-import a CSV of 25 students into Grade 2B Math `[HIGH]`
- [ ] Bulk-import an XLSX of 25 students into Grade 4C Science `[HIGH]`
- [ ] Validation errors surface clear messages on bad rows (missing required field, malformed DOB) `[HIGH]`
- Findings: ___

### 6.4 Cross-Class Student Handling

- [ ] Same student in multiple classes (e.g. a G2B kid takes Math + Science with same teacher) is supported without duplication `[MEDIUM]`
- [ ] Deleting a student detaches them from all classes (no orphaned grades) `[HIGH]`
- [ ] Student count badge per class matches actual roster size `[MEDIUM]`
- Findings: ___

---

## STAGE 7 — Timetable Construction (incl. multi-block periods)

*Goal: Schedule all 27 classes across a realistic 5-day week using the timetable, including double-block Science labs.*

### 7.1 Schedule All 27 Classes

- [ ] Schedule all 27 classes across a realistic 5-day week without overlap conflicts `[HIGH]`
- [ ] Use a mix of single-block and double-block periods (e.g. Science labs as 2 blocks) `[HIGH]`
- Findings: ___

### 7.2 Modal Length Selector

- [ ] Click an empty cell -> new "Length" dropdown appears below the Class field with options "1 block (single period)", "2 blocks (double period)", "3 blocks", ... capped by how many blocks remain in the day `[HIGH]`
- [ ] Modal header live-updates "Monday 9:00 AM - 11:00 AM (2 blocks)" when Length changes `[MEDIUM]`
- [ ] Saving with Length=2 creates a slot whose `end_time` matches the second block's end `[HIGH]`
- [ ] Editing an existing 2-block slot -> the Length dropdown pre-selects "2 blocks" `[HIGH]`
- Findings: ___

### 7.3 Rendering

- [ ] Multi-block slot renders as a single taller cell spanning N rows in the grid `[HIGH]`
- [ ] Cells inside a multi-block slot are not rendered separately (no duplicate clickable area) `[HIGH]`
- [ ] Clicking anywhere on a multi-block slot opens the edit modal `[MEDIUM]`
- Findings: ___

### 7.4 Overlap Validation

- [ ] Try to create a 3-block slot that would overlap an existing slot on the same day -> error: "That span overlaps another slot on this day." `[HIGH]`
- [ ] Try to create a slot near end-of-day whose span exceeds remaining blocks -> error: "Span of N blocks would run past the end of the day." `[MEDIUM]`
- [ ] Editing an existing double period to span=1 frees up the second block (no overlap false positive because the edit ignores its own ID) `[HIGH]`
- [ ] Conflict detector blocks creating two slots in the same room/time `[HIGH]`
- [ ] A timetable slot deleted in the UI cleanly removes the unified-calendar projection `[HIGH]`
- Findings: ___

### 7.5 Weekly Load Summary

- [ ] Below the legend, a "Weekly Load" strip shows one chip per `(grade, class, subject)` combination `[MEDIUM]`
- [ ] Each chip shows weekly total time (e.g. "Grade 1 - Blue - Mathematics 3h/week") `[MEDIUM]`
- [ ] Weekly Load summary shows weekly hours per class accurately `[MEDIUM]`
- [ ] Tooltip shows the session count ("3 sessions per week") `[LOW]`
- [ ] Hides entirely when no slots exist `[LOW]`
- Findings: ___

"""

with open('C:/Users/LG/Desktop/Projects/Offline AI Standalone/plans/TESTING_PLAN.md', 'a', encoding='utf-8') as f:
    f.write(content)
print('Stages 5-7 appended OK, chars:', len(content))
