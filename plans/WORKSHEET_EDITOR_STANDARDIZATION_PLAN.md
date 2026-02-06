# Worksheet Editor Standardization Plan

## Problem Statement

The worksheet editor doesn't match the visual style and functionality of other editors (lesson plans, quizzes, rubrics), and viewing/editing worksheets from the Resource Manager is not working properly.

## Issues Identified

### 1. ResourceManager Missing Worksheet Support

**File**: [`frontend/src/components/ResourceManager.tsx`](frontend/src/components/ResourceManager.tsx)

- Line 200-211: `getEndpointForType()` function missing `'worksheet'` entry
- Line 226-238: `getTypeIcon()` function missing worksheet icon mapping
- Line 240-251: `getTypeColor()` function missing worksheet color scheme

### 2. Dashboard Missing Worksheet Handling

**File**: [`frontend/src/components/Dashboard.tsx`](frontend/src/components/Dashboard.tsx)

- Line 684-692: `handleViewResource()` typeToToolType mapping missing `'worksheet': 'worksheet-generator'`
- Line 729-737: `handleEditResource()` typeToToolType mapping missing `'worksheet': 'worksheet-generator'`
- Lines 712-721: Tab data structure doesn't include worksheet-specific fields (generatedWorksheet, parsedWorksheet)

### 3. WorksheetGenerator Layout Inconsistency

**File**: [`frontend/src/components/WorksheetGenerator.tsx`](frontend/src/components/WorksheetGenerator.tsx)

- Uses 50/50 split with form on left, preview on right (similar to LessonPlanner)
- However, the visual styling doesn't match the cohesive look of LessonPlanner/QuizGenerator
- Missing consistent header styling and color accent system
- Edit mode is inline text editing rather than structured editor component

### 4. No Dedicated WorksheetEditor Component

**Current State**: [`frontend/src/components/WorksheetEditor.tsx`](frontend/src/components/WorksheetEditor.tsx) exists but:

- It's a standalone worksheet builder (not for editing generated worksheets)
- Not integrated with WorksheetGenerator like LessonEditor/LessonPlanner relationship
- Doesn't follow the same modal/overlay edit pattern

### 5. Missing Edit Mode Integration

**File**: [`frontend/src/components/WorksheetGenerator.tsx`](frontend/src/components/WorksheetGenerator.tsx)

- Doesn't check for `savedData.startInEditMode` flag
- Doesn't have structured edit mode like LessonPlanner's `isEditing` state
- Edit button (line 1443-1455) opens inline textarea, not structured editor

## Architecture Analysis

### Current Pattern (LessonPlanner/QuizGenerator)

```
┌─────────────────────────────────────────────────┐
│ Generator Component (e.g., LessonPlanner)       │
│                                                 │
│ ┌─────────────┐  ┌──────────────────────────┐  │
│ │   Form      │  │   Preview/Display        │  │
│ │   Panel     │  │   - Formatted view       │  │
│ │   (50%)     │  │   - Edit button          │  │
│ │             │  │   - Export/Save          │  │
│ └─────────────┘  └──────────────────────────┘  │
│                                                 │
│ When Edit clicked:                              │
│ ┌───────────────────────────────────────────┐  │
│ │  LessonEditor Modal/Component             │  │
│ │  - Structured editing interface           │  │
│ │  - Add/Remove sections                    │  │
│ │  - Reorder content                        │  │
│ │  - Save/Cancel actions                    │  │
│ └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Current Worksheet Pattern (Inconsistent)

```
┌─────────────────────────────────────────────────┐
│ WorksheetGenerator                              │
│                                                 │
│ ┌─────────────┐  ┌──────────────────────────┐  │
│ │   Form      │  │   Template Preview       │  │
│ │   Panel     │  │   - Live template render │  │
│ │   (50%)     │  │   - Edit button          │  │
│ │             │  │   - Version toggle       │  │
│ └─────────────┘  └──────────────────────────┘  │
│                                                 │
│ When Edit clicked:                              │
│ │  Inline textarea overlay (NOT structured)   │ │
└─────────────────────────────────────────────────┘

WorksheetEditor exists but is standalone builder
```

## Solution Architecture

### Phase 1: Fix ResourceManager Support

**Goal**: Enable worksheets to appear and be managed in Resource Manager

#### Changes to [`ResourceManager.tsx`](frontend/src/components/ResourceManager.tsx:200)

1. **Add worksheet endpoint** (line ~208):

```typescript
const getEndpointForType = (type: string): string => {
  const endpoints: { [key: string]: string } = {
    'lesson': 'http://localhost:8000/api/lesson-plan-history',
    'quiz': 'http://localhost:8000/api/quiz-history',
    'worksheet': 'http://localhost:8000/api/worksheet-history', // ADD THIS
    'rubric': 'http://localhost:8000/api/rubric-history',
    // ... rest
  };
```

2. **Add worksheet icon** (line ~227):

```typescript
const getTypeIcon = (type: string) => {
  const icons: { [key: string]: any } = {
    'lesson': BookMarked,
    'quiz': ListChecks,
    'worksheet': FileSpreadsheet, // ADD THIS (already imported)
    'rubric': FileText,
    // ... rest
  };
```

3. **Add worksheet color** (line ~241):

```typescript
const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    'lesson': 'bg-purple-100 text-purple-700 border-purple-200',
    'quiz': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'worksheet': 'bg-blue-100 text-blue-700 border-blue-200', // ADD THIS
    'rubric': 'bg-amber-100 text-amber-700 border-amber-200',
    // ... rest
  };
```

### Phase 2: Fix Dashboard Resource Handling

**Goal**: Enable view/edit of worksheets from Resource Manager

#### Changes to [`Dashboard.tsx`](frontend/src/components/Dashboard.tsx:683)

1. **Add worksheet mapping in handleViewResource** (line ~691):

```typescript
const typeToToolType: { [key: string]: string } = {
  lesson: "lesson-planner",
  quiz: "quiz-generator",
  worksheet: "worksheet-generator", // ADD THIS
  rubric: "rubric-generator",
  // ... rest
};
```

2. **Add worksheet mapping in handleEditResource** (line ~736):

```typescript
const typeToToolType: { [key: string]: string } = {
  lesson: "lesson-planner",
  quiz: "quiz-generator",
  worksheet: "worksheet-generator", // ADD THIS
  rubric: "rubric-generator",
  // ... rest
};
```

3. **Update tab data structure to include worksheet fields** (line ~712):

```typescript
data: {
  formData: resource.formData,
  generatedQuiz: resource.generatedQuiz,
  generatedPlan: resource.generatedPlan,
  generatedWorksheet: resource.generatedWorksheet, // ADD THIS
  generatedRubric: resource.generatedRubric,
  parsedQuiz: resource.parsedQuiz,
  parsedWorksheet: resource.parsedWorksheet, // ADD THIS
  streamingQuiz: resource.streamingQuiz,
  startInEditMode: false,
  // ... rest
}
```

### Phase 3: Standardize WorksheetGenerator Visual Style

**Goal**: Match the visual styling of LessonPlanner/QuizGenerator

#### Changes to [`WorksheetGenerator.tsx`](frontend/src/components/WorksheetGenerator.tsx)

**Current Issues**:

- Header styling doesn't match
- Button placement is different
- Color scheme not consistent
- History panel behavior different

**Recommended Changes**:

1. **Standardize header section** (around line 1200-1250):
   - Use consistent gradient background (`bg-gradient-to-r from-blue-50 to-indigo-50`)
   - Standardize icon placement
   - Match title/subtitle pattern from LessonPlanner

2. **Standardize button bar** (around line 1430-1575):
   - Group action buttons consistently
   - Match icon sizes (w-5 h-5 for headers, w-4 h-4 for buttons)
   - Use consistent color scheme (blue for primary, green for save, orange for clear)

3. **Add accent color system**:
   - Define `accentColor = '#3b82f6'` (blue for worksheets)
   - Use throughout component for consistency
   - Match pattern from LessonPlanner's amber/QuizGenerator's cyan

### Phase 4: Create Proper WorksheetStructuredEditor

**Goal**: Enable structured editing like LessonEditor/QuizEditor

#### New Component: `WorksheetStructuredEditor.tsx`

This should be similar to the existing [`WorksheetEditor.tsx`](frontend/src/components/WorksheetEditor.tsx) but:

- Accept an existing parsed worksheet as input
- Provide structured editing interface
- Match styling of LessonEditor/QuizEditor
- Return edited worksheet on save

**Component Interface**:

```typescript
interface WorksheetStructuredEditorProps {
  worksheet: ParsedWorksheet;
  onSave: (editedWorksheet: ParsedWorksheet) => void;
  onCancel: () => void;
  accentColor?: string;
}
```

**Features**:

- Edit metadata (title, subject, grade, strand)
- Add/remove/reorder questions
- Edit question content and options
- Match visual style of LessonEditor (gradient header, structured sections)

### Phase 5: Integrate Edit Mode in WorksheetGenerator

**Goal**: Support structured editing workflow

#### Changes to [`WorksheetGenerator.tsx`](frontend/src/components/WorksheetGenerator.tsx)

1. **Add edit mode detection** (after line 200):

```typescript
const [isEditingStructured, setIsEditingStructured] = useState(false);

// Check for startInEditMode from savedData
useEffect(() => {
  if (savedData?.startInEditMode && parsedWorksheet) {
    setIsEditingStructured(true);
  }
}, [savedData]);
```

2. **Replace inline text edit with structured editor** (around line 1443):

```typescript
<button
  onClick={() => {
    if (parsedWorksheet) {
      setIsEditingStructured(true); // Use structured editor
    } else {
      setEditBuffer(generatedWorksheet);
      setIsEditing(true); // Fallback to text edit
    }
  }}
  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
>
  <FileText className="w-4 h-4 mr-2" />
  Edit
</button>
```

3. **Add conditional rendering for structured editor**:

```typescript
{isEditingStructured && parsedWorksheet && (
  <WorksheetStructuredEditor
    worksheet={parsedWorksheet}
    onSave={(edited) => {
      setParsedWorksheet(edited);
      setGeneratedWorksheet(worksheetToDisplayText(edited));
      setIsEditingStructured(false);
    }}
    onCancel={() => setIsEditingStructured(false)}
    accentColor="#3b82f6"
  />
)}
```

## Implementation Steps

### Step 1: ResourceManager Updates ✅

- [ ] Add worksheet endpoint to `getEndpointForType()`
- [ ] Add worksheet icon to `getTypeIcon()`
- [ ] Add worksheet color to `getTypeColor()`
- [ ] Import FileSpreadsheet icon if not already imported

### Step 2: Dashboard Updates ✅

- [ ] Add 'worksheet' mapping in `handleViewResource()`
- [ ] Add 'worksheet' mapping in `handleEditResource()`
- [ ] Add generatedWorksheet and parsedWorksheet to tab data
- [ ] Test clicking worksheet from Resource Manager opens tab

### Step 3: Visual Styling Standardization ✅

- [ ] Update WorksheetGenerator header styling
- [ ] Standardize button bar layout
- [ ] Add consistent accent color system
- [ ] Match spacing/padding with other generators
- [ ] Test visual consistency with LessonPlanner/QuizGenerator

### Step 4: WorksheetStructuredEditor Component ✅

- [ ] Create new WorksheetStructuredEditor.tsx
- [ ] Implement metadata editing
- [ ] Implement question editing (add/remove/reorder)
- [ ] Add gradient header matching LessonEditor
- [ ] Add Save/Cancel actions
- [ ] Test standalone editing functionality

### Step 5: Edit Mode Integration ✅

- [ ] Add isEditingStructured state to WorksheetGenerator
- [ ] Detect startInEditMode from savedData
- [ ] Update Edit button to use structured editor
- [ ] Add conditional rendering for WorksheetStructuredEditor
- [ ] Create worksheetToDisplayText() helper if needed
- [ ] Test full edit workflow from Resource Manager

### Step 6: End-to-End Testing ✅

- [ ] Generate a new worksheet
- [ ] Save worksheet
- [ ] View worksheet in Resource Manager
- [ ] Click "View" - should open in view mode (student version)
- [ ] Click "Edit" - should open in edit mode with structured editor
- [ ] Make edits and save
- [ ] Verify changes persist
- [ ] Test export functionality
- [ ] Test version toggle (student/teacher)

## Technical Considerations

### Data Flow for Edit Mode

```
Resource Manager (Click Edit)
    ↓
Dashboard.handleEditResource()
    ↓
Create new tab with:
    - formData
    - generatedWorksheet
    - parsedWorksheet
    - startInEditMode: true
    ↓
WorksheetGenerator mounts
    ↓
Detects startInEditMode + parsedWorksheet
    ↓
Opens WorksheetStructuredEditor automatically
    ↓
User makes edits
    ↓
Save updates parsedWorksheet + generatedWorksheet
    ↓
Auto-save to history API
```

### Backward Compatibility

- Existing text-based editing should remain as fallback
- If parsedWorksheet is null, use text edit mode
- All existing worksheets should load correctly
- No breaking changes to API or data structures

### Styling Consistency Matrix

| Component              | Accent Color    | Header Gradient       | Icon Size | Button Style |
| ---------------------- | --------------- | --------------------- | --------- | ------------ |
| LessonPlanner          | #f59e0b (amber) | amber-50 to orange-50 | w-5 h-5   | Rounded-lg   |
| QuizGenerator          | #06b6d4 (cyan)  | cyan-50 to blue-50    | w-5 h-5   | Rounded-lg   |
| **WorksheetGenerator** | #3b82f6 (blue)  | blue-50 to indigo-50  | w-5 h-5   | Rounded-lg   |
| RubricGenerator        | #f59e0b (amber) | amber-50 to orange-50 | w-5 h-5   | Rounded-lg   |

## Files to Modify

1. **[`frontend/src/components/ResourceManager.tsx`](frontend/src/components/ResourceManager.tsx)** - Add worksheet support
2. **[`frontend/src/components/Dashboard.tsx`](frontend/src/components/Dashboard.tsx)** - Add worksheet handlers
3. **[`frontend/src/components/WorksheetGenerator.tsx`](frontend/src/components/WorksheetGenerator.tsx)** - Standardize UI, add edit mode
4. **[`frontend/src/components/WorksheetStructuredEditor.tsx`](frontend/src/components/WorksheetStructuredEditor.tsx)** - CREATE NEW
5. **[`frontend/src/types/worksheet.ts`](frontend/src/types/worksheet.ts)** - Add helper function `worksheetToDisplayText()` if needed

## Success Criteria

- ✅ Worksheets appear correctly in Resource Manager with proper icon/color
- ✅ Clicking "View" opens worksheet in read-only mode
- ✅ Clicking "Edit" opens worksheet in structured edit mode
- ✅ WorksheetGenerator visual style matches LessonPlanner/QuizGenerator
- ✅ Edit interface provides structured question editing
- ✅ Changes save and persist correctly
- ✅ No regression in existing worksheet generation functionality
- ✅ Student/Teacher version toggle works correctly

## Priority

**HIGH** - This affects core usability of the worksheet feature and user experience consistency.

## Estimated Scope

- **Phase 1**: 30 minutes (ResourceManager updates)
- **Phase 2**: 30 minutes (Dashboard updates)
- **Phase 3**: 1-2 hours (Visual standardization)
- **Phase 4**: 2-3 hours (WorksheetStructuredEditor component)
- **Phase 5**: 1 hour (Edit mode integration)
- **Phase 6**: 1 hour (Testing)

**Total**: 6-8 hours

## Notes

- The existing WorksheetEditor.tsx can be kept as-is or renamed to WorksheetBuilder.tsx to avoid confusion
- Consider adding worksheet type to Resource interface if not already present
- May need to update backend API if generatedWorksheet field is missing from history
- The FileSpreadsheet icon should already be imported in ResourceManager (line 22)
