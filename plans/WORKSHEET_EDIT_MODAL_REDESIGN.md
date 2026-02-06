# Worksheet Edit Modal Redesign Plan

## Problem Statement

The worksheet edit interface (shown when clicking "Edit" button) uses a plain textarea for editing, unlike the structured, visually styled editors used for Lesson Plans and Quizzes.

## Current State

### Current Edit Modal (WorksheetGenerator lines 1580-1610)

```typescript
{isEditing ? (
  <div className="bg-white rounded-lg border border-gray-200 h-full overflow-y-auto p-4 space-y-4">
    <h4 className="text-lg font-semibold text-gray-800">Edit Worksheet Text</h4>
    <textarea
      value={editBuffer}
      onChange={(e) => setEditBuffer(e.target.value)}
      className="w-full h-96 border border-gray-300 rounded-lg p-3 font-mono text-sm"
    />
    <div className="flex justify-end gap-2">
      <button onClick={() => setIsEditing(false)}>Cancel</button>
      <button onClick={handleSaveEdit}>Save Changes</button>
    </div>
  </div>
) : (
  // Preview content...
)}
```

**Problems**:

- ❌ Plain textarea - not user-friendly for structured content
- ❌ No visual styling (no gradient header, no accent colors)
- ❌ Doesn't match LessonEditor/QuizEditor visual design
- ❌ No structured editing (can't add/remove questions easily)
- ❌ Easy to break formatting by accident
- ❌ Generic white background, basic border

### Comparison with Other Editors

#### LessonEditor (lines 77-560)

```typescript
<div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
  {/* Gradient Header */}
  <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-amber-50 to-orange-50">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Lesson Plan</h2>
    {/* Metadata editing with structured inputs */}
  </div>

  {/* Structured content sections */}
  {/* Add/remove/reorder functionality */}

  {/* Action buttons */}
  <div className="flex justify-end gap-3 p-6 border-t">
    <button className="px-4 py-2 rounded bg-gray-100">Cancel</button>
    <button className="px-4 py-2 rounded bg-amber-600 text-white">Save Changes</button>
  </div>
</div>
```

**Features**:

- ✅ Gradient header (amber-50 to orange-50)
- ✅ Structured metadata editing
- ✅ Section-by-section editing
- ✅ Add/remove/reorder sections
- ✅ Styled buttons with accent colors
- ✅ Professional shadow and rounded corners

#### QuizEditor (lines 77-345)

```typescript
<div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
  {/* Gradient Header */}
  <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-cyan-50 to-blue-50">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Quiz</h2>
    {/* Metadata editing */}
  </div>

  {/* Question-by-question editing */}
  {/* Add/remove/reorder questions */}

  {/* Action buttons */}
  <div className="flex justify-end gap-3 p-6 border-t">
    <button className="px-4 py-2 rounded bg-gray-100">Cancel</button>
    <button className="px-4 py-2 rounded bg-cyan-600 text-white">Save Changes</button>
  </div>
</div>
```

**Features**:

- ✅ Gradient header (cyan-50 to blue-50)
- ✅ Question metadata (type, points, cognitive level)
- ✅ Add/remove/reorder questions
- ✅ Option editing for multiple choice
- ✅ Styled buttons with cyan accent
- ✅ Professional shadow and rounded corners

## Solution: WorksheetStructuredEditor Component

### Design Mockup

```
┌─────────────────────────────────────────────────────────────┐
│  Edit Worksheet                                             │
│  [bg-gradient-to-r from-blue-50 to-indigo-50]              │
│                                                             │
│  Title: [input field]          Subject: [input field]      │
│  Grade: [input field]          Strand: [input field]       │
└─────────────────────────────────────────────────────────────┘
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Question 1                               [↑] [↓] [×]  │ │
│  │ ┌─────────────────────────────────────────────────┐   │ │
│  │ │ The plant's _________ is underground...        │   │ │
│  │ └─────────────────────────────────────────────────┘   │ │
│  │ Correct Answer: roots                                 │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Question 2                               [↑] [↓] [×]  │ │
│  │ [Question text input]                                 │ │
│  │ Correct Answer: [input]                               │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  [+ Add Question]                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
│  [Cancel]                          [Save Changes]          │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure

**File**: `frontend/src/components/WorksheetStructuredEditor.tsx` (NEW)

```typescript
import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Check, X, ChevronUp, ChevronDown } from 'lucide-react';
import { ParsedWorksheet, WorksheetQuestion } from '../types/worksheet';

interface WorksheetStructuredEditorProps {
  worksheet: ParsedWorksheet;
  onSave: (editedWorksheet: ParsedWorksheet) => void;
  onCancel: () => void;
  accentColor?: string;
}

const WorksheetStructuredEditor: React.FC<WorksheetStructuredEditorProps> = ({
  worksheet: initialWorksheet,
  onSave,
  onCancel,
  accentColor = '#3b82f6' // Blue for worksheets
}) => {
  const [worksheet, setWorksheet] = useState<ParsedWorksheet>(
    JSON.parse(JSON.stringify(initialWorksheet))
  );

  // Metadata editing
  const updateMetadata = (field: string, value: string) => {
    setWorksheet(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  // Question management
  const addQuestion = () => { /* ... */ };
  const updateQuestion = (index: number, updates: Partial<WorksheetQuestion>) => { /* ... */ };
  const deleteQuestion = (index: number) => { /* ... */ };
  const moveQuestion = (index: number, direction: 'up' | 'down') => { /* ... */ };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
      {/* Gradient Header - BLUE theme for worksheets */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Worksheet</h2>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Worksheet Title
            </label>
            <input
              type="text"
              value={worksheet.metadata.title}
              onChange={(e) => updateMetadata('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* More metadata fields... */}
        </div>
      </div>

      {/* Questions Section */}
      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {worksheet.questions.map((question, index) => (
          <div
            key={question.id || index}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
          >
            {/* Question header with controls */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">Question {index + 1}</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => moveQuestion(index, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveQuestion(index, 'down')}
                  disabled={index === worksheet.questions.length - 1}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteQuestion(index)}
                  className="p-1 rounded hover:bg-red-100 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question text */}
            <textarea
              value={question.text}
              onChange={(e) => updateQuestion(index, { text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
              rows={2}
            />

            {/* Answer field (if applicable) */}
            {question.correctAnswer !== undefined && (
              <div>
                <label className="text-sm text-gray-600">Correct Answer:</label>
                <input
                  type="text"
                  value={question.correctAnswer}
                  onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                />
              </div>
            )}

            {/* Options (for multiple choice) */}
            {question.options && (
              <div className="mt-3">
                <label className="text-sm text-gray-600 mb-2 block">Options:</label>
                {question.options.map((option, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...question.options!];
                      newOptions[optIndex] = e.target.value;
                      updateQuestion(index, { options: newOptions });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Add Question Button */}
        <button
          onClick={addQuestion}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5 text-blue-600" />
          <span className="text-blue-600 font-medium">Add Question</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
        >
          <X className="w-4 h-4 inline mr-2" />
          Cancel
        </button>
        <button
          onClick={() => onSave(worksheet)}
          className="px-6 py-2 rounded-lg text-white hover:bg-blue-700 transition font-medium shadow-md"
          style={{ backgroundColor: accentColor }}
        >
          <Check className="w-4 h-4 inline mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default WorksheetStructuredEditor;
```

### Integration into WorksheetGenerator

**File**: [`frontend/src/components/WorksheetGenerator.tsx`](frontend/src/components/WorksheetGenerator.tsx:1580)

**Current Code** (line 1580-1610):

```typescript
{isEditing ? (
  <div className="bg-white rounded-lg border border-gray-200 h-full overflow-y-auto p-4 space-y-4">
    <h4 className="text-lg font-semibold text-gray-800">Edit Worksheet Text</h4>
    <textarea
      value={editBuffer}
      onChange={(e) => setEditBuffer(e.target.value)}
      className="w-full h-96 border border-gray-300 rounded-lg p-3 font-mono text-sm"
    />
    <div className="flex justify-end gap-2">
      <button onClick={() => setIsEditing(false)}>Cancel</button>
      <button onClick={handleSaveEdit}>Save Changes</button>
    </div>
  </div>
)
```

**Replace With**:

```typescript
{isEditingStructured && parsedWorksheet ? (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <WorksheetStructuredEditor
      worksheet={parsedWorksheet}
      onSave={(editedWorksheet) => {
        setParsedWorksheet(editedWorksheet);
        // Convert back to text if needed
        setGeneratedWorksheet(worksheetToDisplayText(editedWorksheet));
        setIsEditingStructured(false);
        // Auto-save
        saveWorksheet();
      }}
      onCancel={() => setIsEditingStructured(false)}
      accentColor="#3b82f6"
    />
  </div>
) : isEditing ? (
  // Fallback to text edit if parsedWorksheet is null
  <div className="bg-white rounded-lg border border-gray-200 h-full overflow-y-auto p-4 space-y-4">
    <h4 className="text-lg font-semibold text-gray-800">Edit Worksheet Text</h4>
    <textarea value={editBuffer} onChange={(e) => setEditBuffer(e.target.value)}
      className="w-full h-96 border border-gray-300 rounded-lg p-3 font-mono text-sm" />
    <div className="flex justify-end gap-2">
      <button onClick={() => setIsEditing(false)}>Cancel</button>
      <button onClick={handleSaveEdit}>Save Changes</button>
    </div>
  </div>
) : (
  // Normal preview...
)}
```

**Update Edit Button** (line ~1443):

```typescript
<button
  onClick={() => {
    if (parsedWorksheet) {
      setIsEditingStructured(true); // Use structured editor
    } else {
      // Fallback to text editing if parsing failed
      setEditBuffer(generatedWorksheet);
      setIsEditing(true);
    }
  }}
  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
  disabled={!generatedWorksheet}
>
  <FileText className="w-4 h-4 mr-2" />
  Edit {parsedWorksheet ? '' : '(Text Mode)'}
</button>
```

**Add State** (after line 337):

```typescript
const [isEditingStructured, setIsEditingStructured] = useState(false);
```

### Helper Function (if needed)

**File**: [`frontend/src/types/worksheet.ts`](frontend/src/types/worksheet.ts)

Add conversion function if not already present:

```typescript
export function worksheetToDisplayText(worksheet: ParsedWorksheet): string {
  let text = `**${worksheet.metadata.title}**\n\n`;
  text += `Subject: ${worksheet.metadata.subject}\n`;
  text += `Grade: ${worksheet.metadata.gradeLevel}\n`;
  text += `Strand: ${worksheet.metadata.strand}\n\n`;

  worksheet.questions.forEach((q, i) => {
    text += `**Question ${i + 1}:** ${q.text}\n`;
    if (q.options) {
      q.options.forEach((opt, j) => {
        text += `${String.fromCharCode(65 + j)}) ${opt}\n`;
      });
    }
    if (q.correctAnswer) {
      text += `**Answer:** ${q.correctAnswer}\n`;
    }
    text += "\n";
  });

  return text;
}
```

## Visual Styling Consistency

### Color Scheme Comparison

| Component                     | Accent Color    | Header Gradient      | Button Color |
| ----------------------------- | --------------- | -------------------- | ------------ |
| LessonEditor                  | #f59e0b (amber) | amber-50 → orange-50 | amber-600    |
| QuizEditor                    | #06b6d4 (cyan)  | cyan-50 → blue-50    | cyan-600     |
| **WorksheetStructuredEditor** | #3b82f6 (blue)  | blue-50 → indigo-50  | blue-600     |
| RubricEditor                  | #f59e0b (amber) | amber-50 → orange-50 | amber-600    |

### Layout Consistency

- ✅ Max width: `max-w-5xl`
- ✅ Shadow: `shadow-lg`
- ✅ Rounded corners: `rounded-lg`
- ✅ Header padding: `p-6`
- ✅ Content padding: `p-6`
- ✅ Border: `border-gray-200`
- ✅ Action buttons in footer with border-t

## Implementation Checklist

### Step 1: Create WorksheetStructuredEditor Component

- [ ] Create `frontend/src/components/WorksheetStructuredEditor.tsx`
- [ ] Implement gradient header (blue-50 to indigo-50)
- [ ] Add metadata editing grid (title, subject, grade, strand)
- [ ] Implement question list with add/remove/reorder
- [ ] Add question text editing
- [ ] Add answer field editing
- [ ] Add options editing (for multiple choice)
- [ ] Style action buttons (Cancel gray, Save blue-600)
- [ ] Test standalone component

### Step 2: Add Helper Functions

- [ ] Add `worksheetToDisplayText()` to `frontend/src/types/worksheet.ts`
- [ ] Test conversion from ParsedWorksheet to text
- [ ] Ensure formatting matches original

### Step 3: Integrate into WorksheetGenerator

- [ ] Import WorksheetStructuredEditor
- [ ] Add `isEditingStructured` state
- [ ] Update Edit button to use structured editor when parsedWorksheet exists
- [ ] Add modal overlay for structured editor
- [ ] Update save handler to convert back to text
- [ ] Keep text edit as fallback for unparsed worksheets
- [ ] Test edit workflow

### Step 4: Testing

- [ ] Generate a new worksheet
- [ ] Click Edit button
- [ ] Verify structured editor opens with gradient header
- [ ] Edit question text
- [ ] Add a new question
- [ ] Remove a question
- [ ] Reorder questions
- [ ] Save changes
- [ ] Verify changes appear in preview
- [ ] Export and verify formatting
- [ ] Test with different question types

### Step 5: Edge Cases

- [ ] Test with worksheet that fails parsing (should use text edit)
- [ ] Test with empty worksheet
- [ ] Test cancel without saving
- [ ] Test with very long questions
- [ ] Test with special characters

## Benefits

1. **Visual Consistency**: Matches LessonEditor and QuizEditor styling
2. **Better UX**: Structured editing instead of raw text
3. **Error Prevention**: Can't accidentally break formatting
4. **Easier Editing**: Add/remove/reorder questions with buttons
5. **Professional Look**: Gradient headers, shadows, proper spacing
6. **Maintains Functionality**: Text edit still available as fallback

## Files Modified

1. **NEW**: `frontend/src/components/WorksheetStructuredEditor.tsx`
2. **MODIFY**: `frontend/src/components/WorksheetGenerator.tsx` (lines ~337, ~1443, ~1580)
3. **MODIFY**: `frontend/src/types/worksheet.ts` (add `worksheetToDisplayText()`)

## Success Criteria

✅ Edit button opens structured editor (not textarea)
✅ Editor has blue gradient header matching other editors
✅ Can edit worksheet metadata
✅ Can add/remove/reorder questions
✅ Can edit question content and answers
✅ Save button updates worksheet correctly
✅ Cancel button discards changes
✅ Visual styling matches LessonEditor/QuizEditor
✅ Text edit still available as fallback

## Estimated Time

- WorksheetStructuredEditor component: 2-3 hours
- Integration: 30-60 minutes
- Testing: 30-60 minutes
  **Total**: 3-5 hours
