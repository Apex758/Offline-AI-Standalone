# StoryBook Real-Time Streaming Fix Plan

## Root Cause Analysis

The StoryBook component shows generated content **only after all tokens finish streaming** (~518 seconds in your log) instead of incrementally during streaming. The root cause is a **no-op listener** in the subscribe call.

### The Bug (Line 1571 of `StoryBookCreator.tsx`)

```typescript
// ❌ Current code - listener does nothing
const unsubscribe = subscribe(tabId, WS_ENDPOINT, () => {});

// ✅ Fix - listener triggers re-render via useState
const unsubscribe = subscribe(tabId, WS_ENDPOINT, () => {
  setStreamingUpdate((prev) => prev + 1); // Increment to force re-render
});
```

### Data Flow Analysis

```
Backend (llama.cpp)
    │
    │ WebSocket: { type: "token", content: "..." }
    ▼
WebSocketContext.tsx (line 112-118)
    │
    ├─► conn.streamingContent += data.content  ← Content accumulated
    │
    ├─► scheduleUpdate(key)  ← Schedules listener notification (16ms debounce)
    │       │
    │       ▼
    │   setTimeout 16ms → conn.listeners.forEach(listener => listener())
    │       │
    │       ▼
    └─► ❌ listener = () => {}  ← NO-OP! Component never re-renders
            │
            ▼
         Component stays frozen until 'done' message

'token' messages: scheduleUpdate → listeners called → NO-OP → no re-render
'done' messages: forceUpdate({}) called directly → content appears all at once
```

### WebSocketContext Architecture

| Message Type | Action                                 | Re-render Triggered? |
| ------------ | -------------------------------------- | -------------------- |
| `token`      | Accumulate content, `scheduleUpdate()` | ❌ NO (via listener) |
| `done`       | Force immediate `forceUpdate({})`      | ✅ YES               |
| `cancelled`  | Force immediate `forceUpdate({})`      | ✅ YES               |
| `error`      | Force immediate `forceUpdate({})`      | ✅ YES               |

---

## Implementation Fix

### File: `frontend/src/components/StoryBookCreator.tsx`

**Step 1:** Add streaming update state variable near other state declarations (~line 300-350)

**Step 2:** Modify the subscribe useEffect (line 1570-1572)

```typescript
// Before (line 1570-1572)
useEffect(() => {
  const unsubscribe = subscribe(tabId, WS_ENDPOINT, () => {});
  return unsubscribe;
}, [tabId, subscribe, WS_ENDPOINT]);

// After
useEffect(() => {
  const unsubscribe = subscribe(tabId, WS_ENDPOINT, () => {
    setStreamingUpdate((prev) => prev + 1);
  });
  return unsubscribe;
}, [tabId, subscribe, WS_ENDPOINT]);
```

**Step 3:** Use `getStreamingContent(tabId, WS_ENDPOINT)` to read incremental content

---

## Verification Checklist

- [ ] Verify the subscribe call is updated with a working listener
- [ ] Check if other components have the same no-op listener issue:
  - [ ] `QuizGenerator.tsx`
  - [ ] `WorksheetGenerator.tsx`
  - [ ] `LessonPlanner.tsx`
  - [ ] `KindergartenPlanner.tsx`
  - [ ] `CrossCurricularPlanner.tsx`
  - [ ] `MultigradePlanner.tsx`
  - [ ] `RubricGenerator.tsx`
  - [ ] `PresentationBuilder.tsx`
  - [ ] `BrainDump.tsx`
  - [ ] `Chat.tsx`
  - [ ] `EducatorInsights.tsx`
- [ ] Test streaming in browser - tokens should appear incrementally, not all at once
- [ ] Verify no render storms (debouncing at 16ms should handle this)

---

## Architecture Decision: Why subscribe Exists

Looking at `scheduleUpdate`, it batches updates every 16ms (60 FPS) to avoid render storms. The `subscribe` pattern allows multiple components sharing the same WebSocket connection to each get notified and re-render.

However, StoryBookCreator's useEffect at line 1565-1567 pre-creates the connection:

```typescript
useEffect(() => {
  getConnection(tabId, WS_ENDPOINT);
}, [tabId]);
```

This ensures the connection exists before `subscribe` is called. But then `subscribe` registers a no-op, defeating the entire purpose.

---

## Summary

| Item              | Details                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------- |
| **Problem**       | StoryBook content appears only after all generation completes (~8.6 min), not incrementally |
| **Root Cause**    | `subscribe(tabId, WS_ENDPOINT, () => {})` - empty listener                                  |
| **Fix**           | Replace `() => {}` with `() => setStreamingUpdate(n => n + 1)`                              |
| **Files Changed** | `frontend/src/components/StoryBookCreator.tsx` (2 lines)                                    |
| **Risk**          | Low - one-line change with existing debounce architecture                                   |
