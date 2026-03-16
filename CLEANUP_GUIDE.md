# Cleanup Guide — Dead Code & Useless Files






## P1 — HIGH (Clearly Noticeable)

---

### 9. Synchronous directory copy blocks Electron on first run
**File:** `electron/main.js` lines 92-111, 159
**Issue:** `copyDirectorySync()` recursively copies image generation models synchronously on first launch, freezing the entire UI.
**Fix:** Use `fs.promises.cp()` (Node 16.7+) or async recursive copy.
**Impact:** Eliminates multi-second UI freeze on first run

---

### 10. DevTools enabled in production builds
**File:** `electron/main.js` line 405
**Issue:** `devTools: true` is hardcoded. DevTools initialization adds ~200-500ms startup time and 50-100MB memory.
**Fix:** `devTools: isDev`
**Impact:** Faster startup + lower memory in production

---

## P2 — MEDIUM (Worth Doing)

### 11. CurriculumMatcher has no result caching
**File:** `backend/main.py` lines 905-926
**Issue:** `curriculum_matcher.find_matching_pages()` iterates all curriculum pages on every lesson/quiz/worksheet generation. Same grade+subject+topic query gets recomputed every time.
**Fix:** Add LRU cache keyed on `(query, grade, subject)`:
```python
from functools import lru_cache
@lru_cache(maxsize=128)
def find_matching_pages(self, query, top_k, grade, subject): ...
```
**Impact:** 30-50% faster batch lesson generation

---

### 12. Spell check dictionary built at startup
**File:** `frontend/src/utils/spellCheck.ts` (638 lines) + `frontend/src/App.tsx` line 33
**Issue:** `initSpellCheck()` is called at app startup (via `requestIdleCallback`), building an in-memory dictionary of thousands of words. Blocks main thread for 50-100ms.
**Fix:** Lazy-initialize on first use — only build when user opens SmartTextArea or SmartInput.
**Impact:** Faster initial render, eliminates idle-time jank

---

### 13. tutorialSteps.ts (45KB) imported by 13 components
**File:** `frontend/src/data/tutorialSteps.ts` (993 lines)
**Issue:** Entire tutorial step database imported eagerly by Dashboard, LessonPlanner, QuizGenerator, RubricGenerator, etc. — even if tutorials are disabled.
**Fix:** Lazy-load per tool: `const steps = await import('../data/tutorialSteps').then(m => m[toolId])` or split into per-tool files.
**Impact:** 45KB deferred from initial bundle

---

### 14. SettingsContext causes broad re-renders
**File:** `frontend/src/contexts/SettingsContext.tsx`
**Issue:** Single monolithic context stores everything (theme, font size, tab colors for 16+ tools, tutorial state, profiles). Changing any setting re-renders every component that calls `useSettings()`.
**Fix:** Split into focused contexts (ThemeContext, FontContext, etc.) or use `useSyncExternalStore` with selectors.
**Impact:** Reduces unnecessary re-renders across the app

---

### 15. Synchronous file I/O in Electron IPC handlers
**File:** `electron/main.js` lines 508-541
**Issue:** `readFileSync` / `writeFileSync` in async IPC handlers blocks the main Electron thread.
**Fix:** Switch to `fs.promises.readFile` / `fs.promises.writeFile`.
**Impact:** Prevents brief UI freezes when saving/loading tasks data

---

### 16. Image pipeline loaded lazily but with no preload signal
**File:** `backend/image_service.py` lines 287-309
**Issue:** Diffusion pipeline loads on first image request (3-10s delay). No way for the UI to trigger preloading.
**Fix:** Add a `/api/image/preload` endpoint. Call it in the background after backend starts. Add status endpoint for loading progress.
**Impact:** Eliminates surprise wait on first image generation

---

### 17. No ASAR archive in Electron build
**File:** `package.json` lines 41-105
**Issue:** No explicit ASAR config. Files ship as raw directory tree (thousands of individual files).
**Fix:** Add to electron-builder config:
```json
"asar": true,
"asarUnpack": ["**/*.node", "**/*.pyd"]
```
**Impact:** 20-30% smaller install, faster app launch

---

## P3 — LOW (Nice to Have)

### 18. lucide-react excluded from Vite optimization
**File:** `frontend/vite.config.ts` line 16
**Issue:** `optimizeDeps: { exclude: ['lucide-react'] }` prevents Vite from pre-bundling icons. Dashboard alone imports 30+ icons.
**Fix:** Remove the `exclude` line.
**Impact:** Faster dev server, slightly smaller bundle

---

### 19. Dashboard is a "god component" (2,627 lines, 36+ state vars, 16+ useEffects)
**File:** `frontend/src/components/Dashboard.tsx`
**Issue:** Massive component with too much responsibility. Any state change triggers complex re-render logic.
**Fix:** Extract TabManager, ToolbarManager, ContextMenuHandler, ModalHandler into sub-components.
**Impact:** Smoother tab switching, less render overhead

---

### 20. ImageStudio is a "god component" (2,975 lines, 50+ state vars)
**File:** `frontend/src/components/ImageStudio.tsx`
**Issue:** Canvas manipulation, image processing, style profiles, annotations, history — all in one component with no memoization.
**Fix:** Split into ImageGenerator, ImageEditor, AnnotationTools, StyleProfiles sub-components.
**Impact:** Faster tab switching to/from ImageStudio

---

### 21. Missing useMemo/useCallback in Dashboard
**File:** `frontend/src/components/Dashboard.tsx`
**Issue:** Only 1 `useMemo` and 1 `useCallback` across 2,627 lines. Inline functions in render cause unnecessary child re-renders.
**Fix:** Wrap event handlers and computed values in `useCallback`/`useMemo`.
**Impact:** Smoother interactions, fewer wasted renders

---

### 22. WebSocket token batching is conservative
**File:** `backend/main.py` lines 710, 1022, 1305 etc.
**Issue:** Tokens sent every 5 tokens or 50ms. Could batch to 10 tokens / 100ms with no perceived difference.
**Fix:** Increase buffer threshold from 5→10 tokens and 50ms→100ms.
**Impact:** 5-10% lower CPU during streaming

---

### 23. Duplicate imports in backend/main.py
**File:** `backend/main.py` lines 2/26, 3/28
**Issue:** `import os` and `import sys` appear twice.
**Fix:** Remove duplicates at lines 26, 28.
**Impact:** Negligible — code hygiene only

---

## Summary Table

| Priority | # | Area | Fix Effort | Expected Speedup |
|----------|---|------|-----------|-----------------|
| **P0** | 1 | Frontend | 1 line | -500KB bundle |
| **P0** | 2 | Build | 5 min | -40-50% initial load |
| **P0** | 3 | Frontend | 30 min | -600KB deferred |
| **P0** | 4 | Electron | 2 hrs | -30-60s perceived startup |
| **P0** | 5 | Backend | 30 min | -5-30s per generation |
| **P1** | 6 | Frontend | 1 hr | -1MB deferred |
| **P1** | 7 | Backend | 30 min | -200-500ms history loads |
| **P1** | 8 | Backend | 1 line | 2-3x concurrent throughput |
| **P1** | 9 | Electron | 30 min | No first-run freeze |
| **P1** | 10 | Electron | 1 line | -200ms startup, -50MB RAM |
| **P2** | 11-17 | Mixed | 1-4 hrs ea | Various moderate gains |
| **P3** | 18-23 | Mixed | 2-8 hrs ea | Polish & smoothness |
