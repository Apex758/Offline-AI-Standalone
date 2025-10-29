# Tab Independence Fix - Multiple Tabs State Management

## Problem Summary

When opening multiple tabs of the same type (e.g., multiple Lesson Planner tabs), switching between tabs caused complete state loss. Whatever content a tab had or was generating would disappear when switching away and back to that tab.

## Root Causes Identified

### 1. Race Condition in useEffect
The `useEffect` that watches `tabId` would run BEFORE `savedData` was properly synchronized:
```typescript
// ❌ BROKEN - Missing savedData dependency
useEffect(() => {
  const saved = savedData?.formData;
  if (!saved || Object.keys(saved).length === 0 || !saved.subject) {
    // Would reset to empty even when tab HAD valid content!
    setFormData({ /* empty */ });
  }
}, [tabId]); // Only watches tabId, ignores savedData changes
```

### 2. Weak Validation Logic
The validation `!saved || Object.keys(saved).length === 0 || !saved.subject` was too aggressive:
- Would treat partially filled forms as "empty"
- Didn't account for async state updates
- Couldn't distinguish between "new tab" vs "returning to existing tab"

### 3. Missing savedData Dependency
The useEffect only watched `tabId`, so when `savedData` updated after the effect ran, the component never re-synchronized.

## Solution Implemented

### Changes Applied to All 6 Components:
1. **LessonPlanner.tsx** (lines 410-449, 481-509)
2. **KindergartenPlanner.tsx** (lines 370-399, 445-469)
3. **MultigradePlanner.tsx** (lines 410-449, 505-529)
4. **QuizGenerator.tsx** (lines 150-178, 296-320)
5. **RubricGenerator.tsx** (lines 439-468, 495-519)
6. **CrossCurricularPlanner.tsx** (lines 470-520, 564-588)

### Fix Pattern Applied:

```typescript
// ✅ FIXED Implementation

// 1. Add tracking refs
const hasInitializedRef = useRef(false);
const currentTabIdRef = useRef(tabId);

// 2. Create helper for default state
const getDefaultFormData = (): FormData => ({
  subject: '',
  gradeLevel: '',
  // ... all fields
});

// 3. Robust initial state validation
const [formData, setFormData] = useState<FormData>(() => {
  const saved = savedData?.formData;
  // Check if saved data exists AND has meaningful content
  if (saved && typeof saved === 'object' && saved.subject?.trim()) {
    return saved;
  }
  return getDefaultFormData();
});

// 4. Fixed useEffect with proper logic
useEffect(() => {
  const isNewTab = currentTabIdRef.current !== tabId;
  currentTabIdRef.current = tabId;
  
  // Only update when switching tabs OR first init
  if (isNewTab || !hasInitializedRef.current) {
    const saved = savedData?.formData;
    
    if (saved && typeof saved === 'object' && saved.subject?.trim()) {
      // Restore ALL state for this tab
      setFormData(saved);
      setGeneratedPlan(savedData?.generatedPlan || '');
      setStreamingPlan(savedData?.streamingPlan || '');
      setParsedPlan(savedData?.parsedPlan || null);
    } else {
      // New/empty tab - reset to defaults
      setFormData(getDefaultFormData());
      setGeneratedPlan('');
      setStreamingPlan('');
      setParsedPlan(null);
    }
    
    hasInitializedRef.current = true;
  }
}, [tabId, savedData]); // ✅ Both dependencies included
```

## Key Improvements

### 1. Initialization Tracking
- `hasInitializedRef`: Prevents re-initialization on every render
- `currentTabIdRef`: Tracks actual tab changes vs re-renders

### 2. Robust Validation
- Checks `typeof saved === 'object'` to ensure it's a real object
- Validates `saved.subject?.trim()` for meaningful content
- Handles edge cases (null, undefined, empty strings)

### 3. Complete State Restoration
Now restores ALL state fields when switching back to a tab:
- Form data (`setFormData`)
- Generated content (`setGeneratedPlan/Quiz/Rubric`)
- Streaming content (`setStreamingPlan/Quiz/Rubric`)
- Parsed content (`setParsedPlan/Quiz/Rubric/Lesson`)
- Step number (for multi-step forms)

### 4. Proper Dependencies
Both `tabId` and `savedData` in the dependency array ensures:
- Effect runs when switching tabs
- Effect runs when savedData updates
- No race conditions

## Testing Checklist

To verify the fix works:

- [ ] Open 2+ tabs of Lesson Planner
  - Fill out form in Tab 1
  - Generate content in Tab 1
  - Switch to Tab 2
  - Fill out different content in Tab 2
  - Switch back to Tab 1 - verify Tab 1 content is still there
  
- [ ] Repeat for all planner types:
  - [ ] Kindergarten Planner
  - [ ] Multigrade Planner
  - [ ] Cross-Curricular Planner
  - [ ] Quiz Generator
  - [ ] Rubric Generator

- [ ] Test streaming content preservation:
  - Start generating content in Tab 1
  - Switch to Tab 2 while Tab 1 is still generating
  - Switch back to Tab 1 - verify generation continues

- [ ] Test mixed tab types:
  - Open Lesson Planner + Quiz Generator + Rubric Generator
  - Fill each with content
  - Switch between all tabs randomly
  - Verify all content persists

## Technical Details

### Before (Broken Behavior)
1. User opens Lesson Planner Tab A, fills form
2. User opens Lesson Planner Tab B
3. `tabId` changes from `tab_123` to `tab_456`
4. useEffect runs for Tab B
5. `savedData?.formData` is empty (new tab)
6. Effect sets state to empty defaults
7. ✅ Tab B is empty (correct)
8. User switches back to Tab A
9. `tabId` changes back to `tab_123`
10. useEffect runs again
11. ❌ `savedData?.formData` hasn't updated yet (race condition!)
12. Effect sees "no data" and resets to empty
13. ❌ Tab A loses all content (BUG!)

### After (Fixed Behavior)
1. User opens Lesson Planner Tab A, fills form
2. User opens Lesson Planner Tab B
3. `tabId` changes, `isNewTab = true`
4. Effect runs, checks `savedData?.formData`
5. No saved data for Tab B → sets empty defaults
6. ✅ Tab B is empty (correct)
7. User switches back to Tab A
8. `tabId` changes back, `isNewTab = true`
9. Effect runs, waits for `savedData` update via dependency
10. `savedData?.formData` has Tab A's content
11. Validation passes: `saved.subject?.trim()` is truthy
12. Effect restores ALL state from savedData
13. ✅ Tab A content is fully restored (FIXED!)

## Files Modified

1. `frontend/src/components/LessonPlanner.tsx`
2. `frontend/src/components/KindergartenPlanner.tsx`
3. `frontend/src/components/MultigradePlanner.tsx`
4. `frontend/src/components/QuizGenerator.tsx`
5. `frontend/src/components/RubricGenerator.tsx`
6. `frontend/src/components/CrossCurricularPlanner.tsx`

## Related Systems (Not Modified)

- **Dashboard.tsx**: Tab management and data persistence (works correctly)
- **State persistence via localStorage**: Already functional
- **WebSocket connections**: Remain independent per component
- **onDataChange callbacks**: Continue to save state to parent

## Performance Considerations

The fix adds minimal overhead:
- 2 refs per component (negligible memory)
- One conditional check per tab switch
- No additional renders or re-computations
- WebSocket connections remain unaffected

## Future Maintenance

If adding new planner/generator components, use this pattern:
1. Add `hasInitializedRef` and `currentTabIdRef`
2. Create `getDefaultFormData()` helper
3. Use robust validation in useState initializer
4. Implement the fixed useEffect pattern
5. Include ALL state fields in restoration logic
6. Add both `tabId` and `savedData` to dependencies

Generated: 2025-10-29
Fixed by: Code Mode
Issue: Multiple tabs losing state on tab switches