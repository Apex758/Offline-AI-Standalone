# Skeleton Loader Unmounting on Split-Screen Toggle — Root Cause & Fix

## Problem

When toggling split-screen view on/off, skeleton loaders (and all component state) were being lost. A tab showing a skeleton loader would lose it the moment split view was activated or deactivated.

## Root Cause

`renderTabContent()` in `Dashboard.tsx` (line 1252) returned **completely different React tree structures** for normal mode vs split mode:

**Normal mode** returned:
```jsx
<>
  {tabs.map(tab => <div key={tab.id}>...</div>)}
</>
```

**Split mode** returned:
```jsx
<>
  <div className="flex">
    {/* left pane — rendered directly, no map */}
    <div>{renderSingleTabContent(leftTab)}</div>
    {/* right pane — rendered directly, no map */}
    <div>{renderSingleTabContent(rightTab)}</div>
  </div>
  {/* remaining tabs via filtered map */}
  {tabs.filter(...).map(tab => <div key={tab.id}>...</div>)}
</>
```

React's reconciliation algorithm compares trees **by position and type**. When the tree structure changes fundamentally (from a single mapped list to a direct-render wrapper + filtered map), React cannot match old components to new ones. It **unmounts everything and creates fresh instances**, destroying all internal state including skeleton loader flags.

## Fix

Unified both modes into a **single `tabs.map()` with consistent `key={tab.id}`**. The same components are always rendered in the same order — only CSS styling changes between modes:

```jsx
return (
  <div className={isSplit ? 'flex h-full gap-1 p-1' : ''}>
    {tabs.map(tab => {
      if (!isSplit) {
        // Normal: absolute positioned, show/hide via display
        return (
          <div key={tab.id} style={{ display: tab.id === activeTabId ? 'block' : 'none' }}>
            {renderSingleTabContent(tab)}
          </div>
        );
      }
      // Split: show left/right panes, hide others
      const isLeft = tab.id === splitView.leftTabId;
      const isRight = tab.id === splitView.rightTabId;
      if (!isLeft && !isRight) {
        return <div key={tab.id} style={{ display: 'none' }}>{renderSingleTabContent(tab)}</div>;
      }
      return (
        <div key={tab.id} className="flex-1 overflow-hidden relative">
          {renderSingleTabContent(tab)}
        </div>
      );
    })}
  </div>
);
```

### Why this works

- Every tab always has the same `key={tab.id}` in the same `tabs.map()` call
- React matches components by key, so toggling split view never unmounts them
- Only wrapper div CSS properties change (display, flex, border, etc.)
- All internal component state (skeleton loaders, form data, streaming state) is preserved

## Additional Fix: localStorage Persistence

`localLoadingMap` (skeleton loader state) was being persisted to localStorage and restored on mount. This caused stale skeleton loaders to appear after page refresh. Fixed by making `localLoadingMap` runtime-only state — it is never saved to or restored from localStorage.

Affected generators: QuizGenerator, LessonPlanner, KindergartenPlanner, WorksheetGenerator.
