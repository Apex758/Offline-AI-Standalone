# Smart Search & Sticky Notes Plan

## Issues & Status

| # | Issue | Status | Location |
|---|-------|--------|----------|
| 1 | AI steps too shallow / generic | **Needs fix** | `backend/smart_search_prompt.py` |
| 2 | Settings tab data bug (existing tab ignores initialData) | **Already fixed** | `Dashboard.tsx:884-888` + `Settings.tsx:344-349` |
| 3 | `settingsSection` may be missing from AI response | **Needs fix** | `backend/smart_search_prompt.py` |
| 4 | Scroll timing may miss render (400ms timeout) | **Needs fix** | `Dashboard.tsx:617-628` |
| 5 | Tutorial system not leveraged in AI responses | **Needs fix** | `backend/smart_search_prompt.py` |

### Verified: Issue 2 is already fixed

**`Dashboard.tsx:884-888`** — `updateTabData` is called on the existing tab before switching:
```typescript
if (existing) {
  if (initialData) {
    updateTabData(existing.id, initialData);
  }
  navigateToExistingTab(existing);
  return;
}
```

**`Settings.tsx:344-349`** — `useEffect` reacts to section changes from external navigation:
```typescript
useEffect(() => {
  if (savedData?.initialSection) {
    setActiveSection(savedData.initialSection as SettingsSection);
  }
}, [savedData?.initialSection]);
```

No code change needed.

---

## Fix 0: Step Phrasing — User Is Already In The App

**Applies to:** All prompts, examples, and workflows in `backend/smart_search_prompt.py`

The teacher is already inside the app when they use Smart Search. Steps should **never** say "Open the app", "Launch PEARL", or similar. Every step sequence should start with the first **in-app navigation action** (e.g., clicking a sidebar item or a tab).

### What to change

1. **System prompt examples** — rewrite so step 1 is always a sidebar click or direct action:
   - ~~`"Open Lesson Plan from the sidebar"`~~ → `"Click 'Lesson Plan' in the sidebar"`
   - ~~`"Open Settings"`~~ → `"Click 'Settings' in the sidebar"`
2. **Common Workflows section** — same treatment (already addressed in 1C below, but call it out as a rule)
3. **Add to Rules section:**
   ```
   - The teacher is already inside the app. NEVER start steps with "Open the app" or "Launch PEARL". Start with the first in-app action (e.g., "Click 'Lesson Plan' in the sidebar").
   ```

---

## Fix 0B: Smart Context Feeding — Don't Overload the Small Model

**Problem:** The enriched knowledge base (settings structure, tool form fields, detailed workflows, tutorial system) adds a lot of tokens. The local model is ~1.5B parameters — it works well but has a limited effective context window. Dumping everything into one giant system prompt risks the model ignoring or confusing later sections.

### Strategy: Tiered Context Injection

Instead of one monolithic prompt, **split the knowledge base into topic chunks** and only inject the relevant chunk(s) based on a lightweight keyword/intent pre-filter (done in Python before the LLM call).

#### Context Chunks

| Chunk ID | Content | Inject when query matches |
|----------|---------|---------------------------|
| `core` | Tool list, response format, rules, examples | **Always** (this is the base prompt — keep it lean) |
| `settings` | Settings panel structure, all settingsSection values | Query contains: settings, theme, dark mode, font, color, model, tutorial, reset, appearance, brightness, night |
| `tools-forms` | Tool form fields (lesson planner fields, quiz builder fields, etc.) | Query contains: create, make, build, generate, plan, quiz, rubric, worksheet, image, lesson |
| `workflows` | Detailed step-by-step workflows | Query contains: how, steps, guide, help, where, find, change, use |
| `tutorials` | Tutorial system info | Query contains: tutorial, learn, help, how do I use, walkthrough, guide |

#### Implementation in `smart_search_prompt.py`

```python
# Instead of one big SMART_SEARCH_SYSTEM_PROMPT, split into:
SMART_SEARCH_CORE_PROMPT = """..."""        # ~400 tokens — always sent
SMART_SEARCH_SETTINGS_CHUNK = """..."""     # ~200 tokens — settings queries
SMART_SEARCH_TOOLS_CHUNK = """..."""        # ~300 tokens — generation queries
SMART_SEARCH_WORKFLOWS_CHUNK = """..."""    # ~250 tokens — how-to queries
SMART_SEARCH_TUTORIALS_CHUNK = """..."""    # ~100 tokens — tutorial queries

CHUNK_KEYWORDS = {
    "settings": ["settings", "theme", "dark", "light", "font", "color", "model", "tutorial", "reset", "appearance", "brightness", "night", "tone"],
    "tools": ["create", "make", "build", "generate", "plan", "quiz", "rubric", "worksheet", "image", "lesson", "slide"],
    "workflows": ["how", "steps", "guide", "help", "where", "find", "change", "use"],
    "tutorials": ["tutorial", "learn", "walkthrough", "guide", "how do i use"],
}

def build_smart_search_prompt(query: str) -> str:
    """Assemble prompt from core + only the relevant chunks."""
    query_lower = query.lower()
    prompt = SMART_SEARCH_CORE_PROMPT

    for chunk_id, keywords in CHUNK_KEYWORDS.items():
        if any(kw in query_lower for kw in keywords):
            prompt += "\n" + globals()[f"SMART_SEARCH_{chunk_id.upper()}_CHUNK"]

    return prompt
```

#### Why this works for a 1.5B model
- **Core prompt stays small** (~400 tokens) — the model always sees the format rules and tool list
- **Relevant detail only** — a "change tab colors" query gets `core` + `settings` + `workflows` (~850 tokens total) instead of the full ~1250 token mega-prompt
- **Worst case** — if a query matches all chunks, the model still gets everything, but this is rare
- **No model changes needed** — this is pure Python pre-processing before the LLM call
- **Tier 1 prompt stays separate** — for the smallest models, `SMART_SEARCH_TIER1_PROMPT` remains a single compact prompt with no chunking (it's already minimal)

#### Additional tips for keeping prompts small-model-friendly
- Use **terse point-form** (not prose sentences) in all knowledge chunks
- Put the **most important rules first** (small models pay more attention to early tokens)
- Keep examples **minimal** — one example per intent type max in the core prompt
- Avoid **repetition** across chunks (don't restate rules that are in core)

---

## Fix 1: Enrich AI Knowledge Base

**File:** `backend/smart_search_prompt.py`

### 1A. Add Settings page internal structure

Add as the `SMART_SEARCH_SETTINGS_CHUNK` (injected for settings queries):

```
## Settings Page Structure
Settings has a sidebar with panels. Steps MUST reference the correct panel name.
- Profile panel — teacher name, avatar photo
- Appearance panel — theme (light/dark/system), font size, brightness, night tone, tab colors
- Models panel — AI model, thinking mode, diffusion model, OCR model
- General panel — application behavior (auto-close tabs), generation behavior (queued vs simultaneous), tutorial management
- Features panel — feature modules toggle, sidebar tool ordering, writing assistant, system behavior
- Discovery panel — feature discovery preferences
- Files panel — export/import data
- License panel — license information
- Danger panel — reset settings to defaults, wipe all app data

When giving steps for ANY settings query, always include which sidebar panel to click.
Example: "Click 'Settings' in the sidebar → Click 'Appearance' in the sidebar → Scroll to 'Tab Colors' → Pick new colors"
```

### 1B. Add tool form fields

Add as the `SMART_SEARCH_TOOLS_CHUNK` (injected for generation/create queries):

```
## Tool Form Fields

### Lesson Planner
Grade Level (dropdown), Subject (dropdown), Topic (text input), Duration (selector), Additional context (text area)

### Quiz Builder
Subject (dropdown), Grade Level (dropdown), Number of Questions (slider), Learning Outcomes / Topic (text area), Question Types (checkboxes: multiple choice, true/false, short answer, matching, fill-in-the-blank), Cognitive Levels (checkboxes: remember, understand, apply, analyze, evaluate, create)

### Rubric Builder
Assignment Title (text), Assignment Type (dropdown), Subject (dropdown), Grade Level (dropdown), Learning Objectives (text area), Specific Requirements (text area), Performance Levels (selector), Include Points (toggle), Focus Areas (checkboxes)

### Worksheet Builder
Subject (dropdown), Grade Level (dropdown), Strand (dropdown), Topic (text), Question Count (number), Question Type (selector), Template Layout (selector), Include Images (toggle), Image Prompt (text, if images enabled)

### Early Childhood Planner
Theme (text), Learning Areas (checkboxes: literacy, numeracy, science, social-emotional, physical), Learning Centers, Circle Time Activities, Play-Based Activities, Assessment strategies

### Multi-Level Planner
Grade Levels (multi-select), Subject (dropdown), Common Theme (text), Shared Activities, Grade-Specific Tasks, Grouping Strategies, Shared Resources

### Integrated Lesson Planner
Grade Level (dropdown), Central Theme (text), Subjects to integrate (multi-select: Language Arts, Mathematics, Science, Social Studies, Arts), Subject Objectives, Integration Strategies

### Image Studio
Two modes — Generator: Prompt (text area), Batch Size (number) → Generate | Editor: Upload image → Draw mask → Run inpainting

### Brain Dump
Voice recording or text note → AI sorts into actionable items (tasks, lesson ideas, reminders)
```

### 1C. Replace Common Workflows with detailed versions

Add as the `SMART_SEARCH_WORKFLOWS_CHUNK` (injected for how-to queries). Note: all steps start with an in-app action, never "Open the app":

```
## Common Workflows (detailed)
- Create a lesson plan: Click "Lesson Plan" in the sidebar → Select Grade Level from the dropdown → Choose Subject → Type your Topic → Optionally set Duration → Click "Generate"
- Create a quiz: Click "Quiz Builder" in the sidebar → Select Subject and Grade Level → Set number of questions → Describe learning outcomes → Choose question types (multiple choice, true/false, etc.) → Select cognitive levels → Click "Generate"
- Create a rubric: Click "Rubric Builder" in the sidebar → Enter assignment title → Select assignment type → Choose subject and grade → Describe learning objectives → Set performance levels → Click "Generate"
- Create a worksheet: Click "Worksheet Builder" in the sidebar → Select Subject and Grade → Choose Strand → Enter Topic → Set question count and type → Pick template layout → Click "Generate"
- Change tab colors: Click "Settings" in the sidebar → Click "Appearance" in the sidebar → Scroll down to "Tab Colors" → Click the color swatch for the tab type you want to change → Pick your color
- Change theme: Click "Settings" in the sidebar → Click "Appearance" in the sidebar → Under Theme, select Light, Dark, or System
- Change font size: Click "Settings" in the sidebar → Click "Appearance" in the sidebar → Adjust the Font Size slider
- Change AI model: Click "Settings" in the sidebar → Click "Models" in the sidebar → Select from available AI models
- Reset tutorials: Click "Settings" in the sidebar → Click "General" in the sidebar → Scroll to "Tutorial Management" → Click "Reset All Tutorials"
- Find saved work: Click "My Resources" in the sidebar → Use the search bar → Filter by type (Lessons, Quizzes, Rubrics, etc.) → Click a card to view details
- Browse curriculum: Click "Curriculum Browser" in the sidebar → Select Grade Level → Choose Subject → Browse topics and learning objectives
- Manage students: Click "My Classes" in the sidebar → Add or edit students → Create classes → View quiz grades
- Generate images: Click "Image Studio" in the sidebar → Type a description → Set batch size → Click "Generate"
- Track curriculum progress: Click "Progress Tracker" in the sidebar → View overall completion → Filter by grade or subject → Click milestones to update status
```

### 1D. Add tutorial awareness

Add as the `SMART_SEARCH_TUTORIALS_CHUNK` (injected for tutorial/general-help queries):

```
## Tutorial System
Most tools have built-in interactive tutorials (step-by-step walkthrough with highlights and tooltips). For general "how do I use [tool]?" questions, suggest the tutorial. For specific task queries, give direct steps instead.

Tools with tutorials: Analytics Dashboard, Curriculum Browser, Progress Tracker, Lesson Planner, Early Childhood Planner, Multi-Level Planner, Integrated Lesson Planner, Quiz Builder, Rubric Builder, Worksheet Builder, Image Studio, Resource Manager, Settings, Ask PEARL, My Classes

For general queries, include a step like: "Tip: Click the '?' tutorial button in the top-right corner of the tool to get an interactive guided walkthrough"
```

### 1E. Enforce `settingsSection` in AI responses (Fix #3)

Add to the `Rules:` section:

```
- For ALL settings-related queries, "action" MUST include both "toolType": "settings" AND "settingsSection". Never omit settingsSection for settings queries.
- Valid settingsSection values: ai-model, diffusion-model, settings-appearance, font-size, settings-tab-colors, settings-tutorials, generation-mode, settings-notifications, visual-studio, settings-reset, brightness, night-tone, thinking-mode, ocr-model, feature-modules, sidebar-tools, writing-assistant, system-behavior, settings-wipe
```

### 1F. Update Tier 1 prompt

`SMART_SEARCH_TIER1_PROMPT` stays as a **single compact prompt** (no chunking — it's already minimal for the smallest models). Update it with:
- Settings panel names (terse, point-form)
- The `settingsSection` requirement
- The "already in app" rule (no "Open the app" steps)
- Tutorial mention for general queries
- All valid settingsSection values

### 1G. Refactor prompt assembly

Replace the current single `SMART_SEARCH_SYSTEM_PROMPT` string with the `build_smart_search_prompt(query)` function described in Fix 0B. The caller in the inference pipeline should pass the user's query so only relevant chunks are assembled.

---

## Fix 4: Improve Scroll Timing with MutationObserver

**File:** `frontend/src/components/Dashboard.tsx` lines 617-628

### Current code:
```typescript
if (entry.settingsSection) {
  const sectionId = entry.settingsSection;
  setTimeout(() => {
    const el = document.querySelector(`[data-tutorial="${sectionId}"]`) ||
               document.querySelector(`[data-search-section="${sectionId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('search-highlight-flash');
      setTimeout(() => el.classList.remove('search-highlight-flash'), 2000);
    }
  }, 400);
}
```

### Replacement:
```typescript
if (entry.settingsSection) {
  const sectionId = entry.settingsSection;

  const tryScrollTo = () => {
    const el = document.querySelector(`[data-tutorial="${sectionId}"]`) ||
               document.querySelector(`[data-search-section="${sectionId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('search-highlight-flash');
      setTimeout(() => el.classList.remove('search-highlight-flash'), 2000);
      return true;
    }
    return false;
  };

  // Try after a short delay (panel may already be rendered)
  setTimeout(() => {
    if (tryScrollTo()) return;

    // If not found, observe DOM for the element to appear (panel switching)
    const observer = new MutationObserver(() => {
      if (tryScrollTo()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Safety timeout: stop observing after 3s
    setTimeout(() => observer.disconnect(), 3000);
  }, 100);
}
```

**Why this is better:**
1. Tries after 100ms first (covers the fast case)
2. Falls back to MutationObserver that waits for the element to actually appear
3. Auto-disconnects after 3 seconds to prevent memory leaks

---

## Feature: Sticky Notes System

A floating sticky note system accessible from the FAB (Floating Action Button). Sticky notes live in the **main viewing area** (not in the tab strip or sidebar). They behave like small draggable cards overlaying the content.

### Access Point

- **FAB menu** gets a new **Sticky Note icon** (use `StickyNote01Icon` from Hugeicons — already available in the project)
- Clicking it opens a **side popup panel** (same pattern as the night-mode popup) with:
  - **"+ New Note"** button — creates a blank sticky note in the current view
  - **Saved Notes list** — shows all previously saved/closed sticky notes
  - Empty state message when no saved notes exist

### Sticky Note UI

Each sticky note is a small **draggable, resizable card** rendered in a portal/overlay layer above the main content:

| Element | Behavior |
|---------|----------|
| **Title bar** | Drag handle, title text (editable), pin icon, minimize, close buttons |
| **Body** | Free-form text area (supports basic formatting / markdown) OR checklist mode (for AI steps) |
| **Pin button** | Toggle: pinned (persists across all tabs) vs unpinned (only visible in the tab where it was created) |
| **Close button** | Closes the note and **auto-saves** it to the Saved Notes list |
| **Color strip** | Optional left-edge color indicator (user can pick) |

### Pin Behavior

| State | Scope | What happens on tab switch |
|-------|-------|---------------------------|
| **Pinned** | App-wide | Note remains visible on every tab until manually unpinned or closed |
| **Unpinned** (default) | Per-tab | Note is only visible on the tab where it was created; hidden when switching away, reappears when switching back |

### Saved Notes List (in the FAB popup)

- Each entry shows: note title (or first line preview), creation date, pin status
- Click an entry → re-opens that sticky note in the current view
- **Delete** button per entry → permanently removes the note
- **"Clear All"** button → empties the entire saved list
- Closing the popup panel does **NOT** delete notes — they persist until manually deleted
- Notes are stored in app state / local JSON (similar to how drafts work in BrainDump)

### Multiple Notes

- Users can have **multiple sticky notes open simultaneously**
- Each is independently draggable, pinnable, and closable
- Z-order: clicking a note brings it to front
- Optional: a small counter badge on the FAB sticky note icon showing number of open notes

### AI Steps → Sticky Note Conversion

When the AI (Smart Search) generates step-by-step instructions, the response UI should include two action buttons:

| Button | Behavior |
|--------|----------|
| **"Go to Result"** | Navigates directly to the final destination (existing behavior — opens the tool/tab) |
| **"Turn into Sticky Note"** | Creates a sticky note with the steps as a **checklist**, then navigates to the **first step's** destination |

#### Checklist Sticky Note behavior:
1. Each AI step becomes a checklist item in the sticky note
2. Items can be **manually checked off** (strikethrough + checkmark) as the user completes them
3. The note title auto-fills from the original query (e.g., "How to create a quiz")
4. The note is created as **pinned by default** (since the user will likely navigate across tabs to complete steps)
5. Progress indicator: "3/7 steps completed" shown in the note footer

#### Feasibility note on auto-tracking:
Automatically detecting whether a user completed a step (e.g., "clicked the Subject dropdown") would require deep instrumentation of every form field across every tool. **Manual checkbox tracking is the practical approach** — the user checks off steps as they go. This keeps complexity manageable while still providing the guided workflow benefit.

### Grouped Sticky Notes (Folder-Style Grouping)

Drag one sticky note onto another and **hold for ~2 seconds** to merge them into a group — exactly like iOS/Android app folders.

#### How Grouping Works

| Action | Behavior |
|--------|----------|
| **Drag note A onto note B + hold ~2s** | Both notes merge into a new **group card**. Visual feedback: pulsing border / glow on the target note during the hold, then animate into a single grouped card on release |
| **Drag note C onto an existing group + hold ~2s** | Note C is added to that group (same hold-to-confirm mechanic) |
| **Release before ~2s** | Normal repositioning — note drops at that position, no group created |
| **Click a group card** | Group **expands** to reveal individual notes inside (overlay grid/list, like an iOS folder popup) |
| **Drag a note out of an expanded group** | Removes it from the group, returns it to a standalone note |
| **Drag the group card itself** | Moves the entire group as one unit (all contained notes move together) |
| **Group shrinks to 1 note** | Auto-ungroups — the remaining note becomes a standalone note again |

#### Group Card Appearance

The group card replaces the individual notes visually. It looks like a slightly thicker sticky note with:

| Element | Detail |
|---------|--------|
| **Stacked preview** | 2-3 overlapping note corners/edges behind the front card (visual hint of depth, like stacked papers) |
| **Group title** | Editable — defaults to "Group (N notes)" but user can rename (e.g., "Quiz Steps", "Monday Tasks") |
| **Badge count** | Small number badge showing how many notes are inside |
| **Title bar** | Same as regular sticky note: drag handle, pin, minimize, close |
| **Color** | Inherits the color of the first note, or user can set a group color |

#### Expanded Group View

When you click a group card, it expands in-place (or as a small overlay):
- Shows all notes inside as **mini-cards** in a grid or vertical list
- Each mini-card shows: title, first line preview, color strip
- Click a mini-card → opens that note full-size
- Drag a mini-card outside the expanded view → removes it from the group (ungroups it)
- **"+ Add Note"** button inside the expanded view → creates a new blank note directly in the group
- Click outside or press Escape → collapses back to the group card

#### Group Behavior Summary

| Behavior | Detail |
|----------|--------|
| **Draggable** | Entire group moves as one unit |
| **Pinnable** | Pin/unpin applies to the whole group. Pinned = all notes inside visible across all tabs |
| **Closable** | Closing a group auto-saves all notes inside to the Saved Notes list as a sub-list under the group name |
| **Minimizable** | Collapses to a small pill/chip showing the group title + count |
| **Resizable** | Group card can be resized (affects the expanded view size) |
| **Deletable** | Option to delete group container only (notes become standalone) OR delete group + all notes inside |

#### Groups in the Saved Notes List (FAB popup)

- Groups appear as expandable entries in the saved notes list
- Click the expand arrow → shows the individual notes inside
- Can delete the whole group (deletes all notes inside) or delete individual notes from within it
- Re-opening a group from saved → restores the group card with all notes inside

#### Nesting Limit

Groups are **one level deep only** — you cannot drag a group onto another group to create nested folders. This keeps the UI simple. If you drag a group onto another group, nothing happens (no visual cue, no merge).

#### Hold Detection Logic

```typescript
// On drag over another sticky note or group:
// 1. Start a ~2-second timer when note A overlaps note B
// 2. Show visual feedback immediately (pulsing border, progress ring, or scale animation on target)
// 3. If user holds for ~2s → trigger grouping
// 4. If user moves away before ~2s → cancel timer, remove visual feedback
// 5. If user drops without holding long enough → normal repositioning (no grouping)

interface HoldToGroupState {
  targetId: string | null;       // ID of the note/group being hovered over
  holdStartTime: number | null;
  holdTimer: NodeJS.Timeout | null;
  isHolding: boolean;            // true when overlap detected, timer running
}
```

### Data Model

```typescript
interface StickyNote {
  id: string;
  title: string;
  content: string;                    // free-form text
  checklist?: StickyChecklistItem[];  // if created from AI steps
  color?: string;                     // left-edge color
  pinned: boolean;
  tabId: string | null;               // null if pinned (app-wide), otherwise the tab ID it belongs to
  position: { x: number; y: number }; // viewport-relative position
  size: { width: number; height: number };
  minimized: boolean;
  groupId: string | null;             // null = standalone, string = belongs to this group
  createdAt: string;
  updatedAt: string;
}

interface StickyNoteGroup {
  id: string;
  title: string;                      // editable — defaults to "Group (N notes)"
  noteIds: string[];                  // ordered list of note IDs in this group
  color?: string;
  pinned: boolean;
  tabId: string | null;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minimized: boolean;
  expanded: boolean;                  // whether the group is currently open/expanded
  createdAt: string;
  updatedAt: string;
}

interface StickyChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  action?: {                          // optional: navigation target for this step
    toolType: string;
    settingsSection?: string;
  };
}
```

### Storage

- Sticky notes and groups persist in local storage / JSON file (e.g., `sticky_notes.json` alongside existing draft files)
- Loaded on app startup, saved on every change (debounced)
- Maximum suggested limit: ~50 saved notes (to keep storage/performance reasonable)

### Component Architecture

| Component | Purpose |
|-----------|---------|
| `StickyNoteProvider` (context) | Global state: open notes, groups, saved notes, CRUD, grouping logic |
| `StickyNoteOverlay` | Portal-rendered layer that renders all visible notes and group cards |
| `StickyNote` | Individual draggable/resizable note card |
| `StickyNoteChecklist` | Checklist variant body (for AI step notes) |
| `StickyNoteGroup` | Group card (stacked preview, badge count, expand/collapse, drag as unit) |
| `StickyNoteGroupExpanded` | Expanded group view (mini-card grid, drag-out, add note) |
| `StickyNoteFabPanel` | The side popup panel opened from the FAB |
| `StickyNoteFabButton` | The icon button added to the FAB menu |

### Integration Points

| Where | What |
|-------|------|
| `Dashboard.tsx` — FAB section | Add `StickyNoteFabButton` alongside existing FAB items (night mode, etc.) |
| `Dashboard.tsx` — main render | Add `<StickyNoteOverlay />` in the main content area (above tab content, below modals) |
| `Dashboard.tsx` — AI search results | Add "Turn into Sticky Note" button to the step-by-step result cards |
| `App.tsx` or top-level | Wrap with `<StickyNoteProvider>` |
| Tab switching logic | Filter visible unpinned notes/groups by current `tabId` |

### Drag-and-Drop Implementation Notes

The project already uses `@dnd-kit` (used in BrainDump). The sticky note drag system should use the same library for consistency:

- **`useDraggable`** on each `StickyNote` and `StickyNoteGroup` for free-form position dragging
- **Drop detection for grouping**: use `useDroppable` on each note/group card. When a draggable note is held over a droppable note/group for >= ~2 seconds, trigger the group merge
- **Hold timer**: on `onDragOver`, start a ~2-second timer. If the drag leaves the target before the timer fires, cancel it. Visual feedback (pulsing border) starts immediately on hover to hint that holding will group
- **Drag-out from expanded group**: mini-cards inside the expanded view are draggable. Dropping outside the group boundary triggers removal from the group

---

## Implementation Order

1. **Fix 0 + 0B:** Refactor `backend/smart_search_prompt.py` — split monolithic prompt into core + chunks, add `build_smart_search_prompt()` keyword router, add "already in app" rule
2. **Fix 1A-G:** Populate the chunks — settings structure, tool form fields, detailed workflows, tutorial awareness, settingsSection enforcement, Tier 1 prompt update
3. **Fix 4:** Update `frontend/src/components/Dashboard.tsx` — MutationObserver scroll pattern
4. **Sticky Notes — Phase 1 (Core):**
   - Create `StickyNoteProvider` context with data model + local storage persistence
   - Create `StickyNote` component (draggable, resizable, pin/close/minimize)
   - Create `StickyNoteOverlay` portal layer
   - Create `StickyNoteFabButton` + `StickyNoteFabPanel` (new note, saved list)
   - Wire into `Dashboard.tsx` FAB and main render
5. **Sticky Notes — Phase 2 (AI Integration):**
   - Add "Turn into Sticky Note" button to Smart Search step results
   - Create `StickyNoteChecklist` variant with checkbox tracking + progress
   - Wire navigation from checklist items to tool destinations
6. **Sticky Notes — Phase 3 (Grouped Notes):**
   - Add `groupId` field to `StickyNote` data model, add `StickyNoteGroup` model
   - Implement hold-to-group detection in drag logic (~2s hold timer + visual feedback)
   - Create `StickyNoteGroup` component (stacked card appearance, count badge)
   - Create `StickyNoteGroupExpanded` overlay (mini-card grid, add/remove from group, drag-out)
   - Update `StickyNoteProvider` with group CRUD operations (create, dissolve, add/remove note, auto-ungroup on 1 remaining)
   - Update `StickyNoteOverlay` to render groups alongside standalone notes
   - Update `StickyNoteFabPanel` saved list to show groups as expandable sub-lists
   - Wire pin/close/delete behavior for groups
7. **Test:** Verify:
   - "how do I change tab colors" → should include Appearance panel step + settingsSection
   - "how do I use the quiz builder" → should suggest tutorial
   - "create a grade 5 math lesson" → should give detailed form field steps
   - Smart Search steps → "Turn into Sticky Note" → checklist appears pinned → manual check-off works
   - Pin/unpin → note persists/hides on tab switch
   - Close note → appears in saved list → re-open works
   - Drag note A onto note B, hold ~2s → group forms with stacked card appearance
   - Drag note C onto existing group, hold ~2s → added to group
   - Release before ~2s → no grouping, normal drop
   - Click group → expands to show contained notes in mini-card grid
   - Drag note out of expanded group → becomes standalone again
   - Drag entire group card → all notes move as one unit
   - Group down to 1 note → auto-ungroups
   - Pin/close/delete group → all contained notes follow
   - Groups in saved list → expandable sub-lists, individual or bulk delete

---

## Files to Modify

| File | Changes |
|------|---------|
| `backend/smart_search_prompt.py` | Split into core + chunks, add `build_smart_search_prompt()` router, add "already in app" rule, populate all knowledge chunks, update Tier 1 prompt. |
| `frontend/src/components/Dashboard.tsx` | Replace lines 617-628 scroll timeout with MutationObserver pattern. Add StickyNoteOverlay + FAB button. Add "Turn into Sticky Note" to AI results. |

### New Files (Sticky Notes)

| File | Purpose |
|------|---------|
| `frontend/src/contexts/StickyNoteContext.tsx` | Provider, state management, CRUD, grouping logic, local storage sync |
| `frontend/src/components/sticky-notes/StickyNote.tsx` | Individual note card (drag, resize, pin, close, minimize) |
| `frontend/src/components/sticky-notes/StickyNoteOverlay.tsx` | Portal layer rendering all visible notes and group cards |
| `frontend/src/components/sticky-notes/StickyNoteChecklist.tsx` | Checklist body variant for AI steps |
| `frontend/src/components/sticky-notes/StickyNoteGroup.tsx` | Group card (stacked appearance, badge count, expand/collapse, drag as unit) |
| `frontend/src/components/sticky-notes/StickyNoteGroupExpanded.tsx` | Expanded overlay grid for viewing/managing notes in a group |
| `frontend/src/components/sticky-notes/StickyNoteFabPanel.tsx` | Side popup: new note + saved notes list (with group sub-lists) |
| `frontend/src/components/sticky-notes/StickyNoteFabButton.tsx` | FAB menu icon entry |

**No changes needed for:** `Settings.tsx`, `CommandPalette.tsx` — already working correctly.
