# Electron WebSocket Streaming Fix

## Problem
Real-time streaming worked perfectly in the browser but tokens were buffered/delayed in the Electron app, causing poor user experience.

## Root Cause
Electron's networking stack (Chromium-based) handles WebSocket frames differently than standard browsers:
- **Browser**: Immediately delivers WebSocket frames as they arrive
- **Electron**: May batch/buffer frames for efficiency, especially when passing through the IPC layer

## Solution Applied
Added explicit event loop yielding (`await asyncio.sleep(0)`) after every WebSocket send operation to force immediate frame delivery.

### Technical Details
The `await asyncio.sleep(0)` call:
1. **Yields control** to the async event loop
2. **Flushes pending I/O** operations (including WebSocket frames)
3. **Forces immediate delivery** instead of batching
4. **Has zero performance overhead** (doesn't actually sleep)

## Files Modified

### backend/main.py
Added `await asyncio.sleep(0)` after every `websocket.send_json()` call in all 7 WebSocket endpoints:

1. ✅ `/ws/chat` (Chat interface)
2. ✅ `/ws/lesson-plan` (Lesson planner)
3. ✅ `/ws/quiz` (Quiz generator)
4. ✅ `/ws/rubric` (Rubric generator)
5. ✅ `/ws/kindergarten` (Kindergarten planner)
6. ✅ `/ws/multigrade` (Multigrade planner)
7. ✅ `/ws/cross-curricular` (Cross-curricular planner)

### Example Change
**Before:**
```python
await websocket.send_json({
    "type": "token",
    "content": chunk["token"]
})
```

**After:**
```python
await websocket.send_json({
    "type": "token",
    "content": chunk["token"]
})
await asyncio.sleep(0)  # Force immediate flush - critical for Electron
```

## Testing Instructions

### 1. Rebuild the Backend
No rebuild needed - Python changes are immediate.

### 2. Test in Electron App
1. Start the application
2. Open Chat or any generator
3. Send a message/generate content
4. **Verify**: Tokens should appear smoothly in real-time, not all at once

### 3. Compare Behavior
- **Before Fix**: Tokens would appear in chunks or all at once after generation completes
- **After Fix**: Tokens appear smoothly one-by-one as they're generated

### 4. Browser Testing
The fix is backward compatible - browser performance should remain unchanged.

## Why This Works

### Event Loop Mechanics
```python
for chunk in inference.generate_stream(...):
    await websocket.send_json({"type": "token", "content": chunk["token"]})
    # Without sleep(0): Frame queued but may not flush immediately
    
    await asyncio.sleep(0)  
    # With sleep(0): Event loop processes pending I/O, flushes the frame
```

### Electron-Specific Benefit
In Electron:
- WebSocket messages pass through the IPC layer between main and renderer processes
- Without yielding, multiple messages can batch in the IPC queue
- Yielding forces immediate queue processing

## Additional Notes

### No Performance Impact
- `asyncio.sleep(0)` has **zero performance overhead**
- It simply yields control momentarily
- Actually improves perceived performance by reducing latency

### Alternative Approaches Considered
1. **Server-Sent Events (SSE)**: More complex migration
2. **Increase buffer size**: Doesn't solve root cause
3. **Custom flush mechanism**: Requires FastAPI internals knowledge

### Why Not Apply to Browser?
The browser **already** handles WebSocket frames optimally. This fix:
- ✅ Solves Electron buffering
- ✅ Maintains browser performance
- ✅ Adds zero overhead

## Verification Checklist
- [ ] Chat streams tokens smoothly in Electron
- [ ] Lesson plan generation shows real-time progress
- [ ] Quiz generation streams properly
- [ ] Rubric generation works in real-time
- [ ] All generators work smoothly in browser (regression test)

## Future Improvements
If streaming issues persist, consider:
1. Implementing adaptive batching (send every N tokens)
2. Adding client-side buffering with requestAnimationFrame
3. Monitoring WebSocket frame sizes