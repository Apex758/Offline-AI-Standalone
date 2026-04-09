# Storybook Introduction Page - Implementation Plan

## Problem Statement

The storybook generator currently has **no dedicated Introduction page**. The intro content is buried within Page 1's text segments without any visual distinction or separate identity.

**Current flow:**

```
Cover → [Intro buried in Page 1's textSegments] → Page 2 → ...
```

**Desired flow:**

```
Cover → Introduction (separate page) → Page 1 → Page 2 → ...
```

---

## Root Cause Analysis

The pacing guide (`buildPacingGuide()` in `storybookPromptBuilder.ts`) instructs the AI to use ~20% of pages for "intro" content, but:

1. The AI generates intro content as part of Page 1's `textSegments`
2. There's no `introPage` field in the JSON schema
3. The frontend doesn't render intro as a separate page
4. Exports don't include a distinct intro page

---

## Solution Overview

Add a dedicated `introPage` field to the storybook JSON structure that represents a separate introduction page shown BEFORE the story begins.

---

## Files to Modify

### 1. `frontend/src/types/storybook.ts`

Add the `IntroPage` interface and add it to `ParsedStorybook`:

```typescript
export interface IntroPage {
  text: string;
  sceneId?: string;
  bundledSceneId?: string;
  backgroundImageData?: string;
  imagePlacement?: "left" | "right" | "none";
}

export interface ParsedStorybook {
  title: string;
  gradeLevel: "K" | "1" | "2";
  characters?: string[];
  characterDescriptions?: Record<string, string>;
  voiceAssignments?: Record<string, VoiceName>;
  styleSuffix?: string;
  scenes: StoryScene[];
  pages: StoryPage[];
  introPage?: IntroPage; // NEW
  comprehensionQuestions?: ComprehensionQuestion[];
  learningObjectiveSummary?: string;
  characterReferenceImages?: Record<string, string>;
  coverPage?: CoverPage;
}
```

### 2. `frontend/src/utils/storybookPromptBuilder.ts`

Update `buildPacingGuide()` and `buildExampleJSON()`:

**`buildPacingGuide()` changes:**

- Remove "Page 1" from intro range
- Add explicit instruction for separate intro page

**`buildExampleJSON()` changes:**

- Add `introPage` example to the JSON template

**Prompt changes:**

- Update the pacing guide to be clearer about intro being a separate page
- Tell AI to generate intro content in `introPage.text` field, NOT in page 1

### 3. `backend/schemas/storybook_schema.py`

Add `IntroPageOutput` to the schema:

```python
class IntroPageOutput(BaseModel):
    text: str
    sceneId: Optional[str] = None

class StorybookOutput(BaseModel):
    title: str
    gradeLevel: str
    learningObjectiveSummary: Optional[str] = None
    characters: List[str] = []
    characterDescriptions: Dict[str, str] = {}
    voiceAssignments: Dict[str, str] = {}
    scenes: List[StoryScene] = []
    pages: List[StoryPageOutput] = []
    introPage: Optional[IntroPageOutput] = None  # NEW
```

### 4. `backend/tier1_prompts.py`

Update the storybook system prompt to include `introPage` in the JSON structure example.

### 5. `backend/tier2_prompts.py`

Update the storybook system prompt to include `introPage` in the JSON structure.

### 6. `frontend/src/components/StoryBookCreator.tsx`

**Parsing changes:**

- Update `tryParsePartialPages()` and `tryParseFullBook()` to handle `introPage` field
- When parsing, extract `introPage` from the JSON

**State changes:**

- Add `introPage` to the parsed book state
- `currentPageIdx = -2` could represent the intro page (or keep it separate)

**Rendering changes:**

- Add intro page thumbnail in the page strip (shown between cover and page 1)
- Add `IntroPagePreview` component similar to `CoverPagePreview` and `PagePreview`
- Navigation: Cover → Introduction → Page 1 → Page 2 → ...

**Editor changes:**

- Allow editing intro page text/scenes similar to story pages
- Show intro page in the main preview area when selected

### 7. `frontend/src/utils/storybookExportUtils.ts`

**PDF export:**

- Add intro page HTML between cover and first story page
- Similar layout to other pages but with "Introduction" label

**PPTX export:**

- Add intro slide between cover and first story slide
- Use distinct styling to differentiate intro from story pages

**Animated HTML:**

- Add intro page to `STORY_PAGES` array
- Handle it in `showPage()` function
- Display intro page in the player between cover overlay and story pages

---

## Navigation Flow (Proposed)

```
Cover Page (idx = -1)
    ↓
Introduction Page (idx = -2) ← NEW
    ↓
Page 1 (idx = 0)
Page 2 (idx = 1)
...
```

Or alternatively, keep intro as part of pages array with a flag:

```
Cover (idx = -1)
Page 0 = Introduction (pageNumber = 0, isIntro = true)
Page 1 (pageNumber = 1)
...
```

---

## Backward Compatibility

- `introPage` is optional - old storybooks without it will still work
- Default intro page can be auto-generated from page 1's content if missing (fallback)

---

## Testing Checklist

- [ ] Generate a new storybook - verify intro page appears
- [ ] Navigate through: Cover → Intro → Page 1 → ...
- [ ] Edit intro page text
- [ ] PDF export includes intro page
- [ ] PPTX export includes intro slide
- [ ] Animated HTML player shows intro page
- [ ] Old storybooks (without introPage) still work
- [ ] Curriculum-aligned stories still work

---

## Estimated Scope

| File                        | Lines Changed (est.) |
| --------------------------- | -------------------- |
| `types/storybook.ts`        | ~10                  |
| `storybookPromptBuilder.ts` | ~40                  |
| `storybook_schema.py`       | ~8                   |
| `tier1_prompts.py`          | ~5                   |
| `tier2_prompts.py`          | ~5                   |
| `StoryBookCreator.tsx`      | ~150                 |
| `storybookExportUtils.ts`   | ~50                  |
| **Total**                   | **~268**             |

---

## Alternative: Simpler Approach

If a full `introPage` field is too complex, consider:

**Option B: Use page 0 with special rendering**

- Keep AI generating intro as part of story pages
- Add `pageType: 'intro' | 'story'` to pages
- Render page 0 with "Introduction" label/header
- This requires fewer schema changes

**Which approach do you prefer?**

1. **Full approach** - Separate `introPage` field (cleaner but more changes)
2. **Simple approach** - Page 0 with `pageType: 'intro'` flag (fewer changes)
