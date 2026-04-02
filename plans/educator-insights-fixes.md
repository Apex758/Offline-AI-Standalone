# EducatorInsights Fixes Plan

## Issues to Fix

### 1. Pass Ordering During Generation

**Problem**: During generation, the passes should appear in order (1-7), but the UI shows them in a confusing order.

**Backend Order** (defined in `backend/main.py:3163-3171`):

1. Curriculum Coverage
2. Student Performance
3. Content Creation
4. Attendance & Engagement
5. Achievements & Engagement
6. Teaching Recommendations
7. Final Synthesis

**Current UI Behavior**: Passes that are skipped or pending may not display in the correct order.

### 2. Streaming Content into Sections

**Problem**: When content is generated, it should stream into the appropriate section in real-time. Currently completed passes may disappear from the UI.

**Expected Behavior**:

- As each pass completes, its output should appear in its designated section
- Content should stream in progressively as tokens arrive from WebSocket

### 3. No Data / Skipped Pass Display

**Problem**: When a pass has no data to analyze, it should clearly show "No data available" or similar message instead of hiding the section.

**Expected Behavior**:

- Skipped passes should display with "No data available" or the skip message
- Passes with no changes (for recommendations) should show appropriate message

### 4. Executive Summary Title Duplicated

**Problem**: The output shows "Executive Summary" twice - once as section header, once as content header.

### 5. LLM Sections Contradict Summary Cards

**Observed Issue**: Summary cards show: "9/125 milestones", "48 resources", "23/71 achievements"
But LLM sections say: "No data available", "No data"

This suggests the LLM synthesis pass is not receiving or not properly using the data from previous passes.

### 6. Executive Summary Too Verbose/Generic

**Problem**: Even with some data available, the summary says "The current data collection period has not yet yielded any..." suggesting the synthesis pass isn't properly incorporating the other pass outputs.

---

## Files to Modify

1. **`frontend/src/components/EducatorInsights.tsx`**
   - Fix pass rendering logic to show all passes in correct order during generation
   - Ensure streaming content appears in correct sections
   - Show "No data available" / "No changes" for skipped passes
   - Keep all 7 pass sections visible during generation (not just completed ones)
   - Fix duplicated "Executive Summary" title

2. **`backend/main.py`** (possibly)
   - Check synthesis pass logic to ensure it receives outputs from previous passes

---

## Implementation Steps

### Step 1: Review current pass rendering logic

- Look at how `PASS_NAMES`, `passResults`, and `isGenerating` interact
- Understand why passes disappear during generation
- Check how "Executive Summary" title is rendered

### Step 2: Fix pass visibility during generation

- All 7 passes should be visible in the sidebar/header during generation
- Currently streaming pass should be highlighted/active
- Completed passes should show their content
- Pending passes should show "Waiting..." or similar

### Step 3: Fix streaming display

- Ensure `passResults[pass.key].streaming` updates in real-time
- Content should appear in the correct section as it streams

### Step 4: Fix skipped/no-data display

- When `skipped: true`, show "No data available for [pass name]"
- When pass has no meaningful changes, show appropriate message
- Don't hide skipped passes - show them with the skip message

### Step 5: Verify ordering

- Passes should appear in `PASS_NAMES` order (1-7)
- The progress indicator should reflect correct pass number

### Step 6: Check synthesis pass (backend)

- Verify that synthesis pass receives all previous pass outputs
- Ensure synthesis prompt includes data from all 6 analysis passes

---

## Backend Context

The backend sends these WebSocket messages:

- `{ type: "status", pass: 1, passName: "Curriculum Coverage", total: 7 }` - indicates new pass starting
- `{ type: "token", content: "..." }` - streaming tokens
- `{ type: "pass_complete", pass: 1, passName: "...", result: "...", skipped: false }` - pass finished

The frontend should use `msg.pass` to identify which pass is active, not rely on `PASS_NAMES` array index during streaming.
