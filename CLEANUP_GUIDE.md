# Cleanup Guide — Dead Code & Useless Files




# Performance Improvements — Priority Order

All findings from a full audit of backend, frontend, and Electron layers.

---

## P0 — CRITICAL (Massive User-Visible Impact)

### 1. Eager-load 332 curriculum pages into bundle (~500KB+ waste)
**File:** `frontend/src/components/CurriculumViewer.tsx` line 19
**Issue:** `import.meta.glob('../curriculum/**/*.tsx', { eager: true })` forces all 332 curriculum `.tsx` files into the main JS bundle. Users pay this cost on every app launch even though only one page displays at a time.
**Fix:** Change `eager: true` → `eager: false`. The glob already returns promises — the rest of the code just needs minor async handling.
**Impact:** ~500KB smaller bundle, noticeably faster startup

---

### 2. Code splitting completely disabled in Vite
**File:** `frontend/vite.config.ts` lines 34-37
**Issue:**
```js
rollupOptions: {
  output: {
    manualChunks: undefined, // ← disables all code splitting
  },
},
```
The entire app (React, recharts, framer-motion, xlsx, html2canvas, 332 curriculum pages, all components) ships as one monolithic JS file.
**Fix:** Remove `manualChunks: undefined` entirely (lets Vite auto-split), or configure smart chunks:
```js
manualChunks: {
  vendor: ['react', 'react-dom'],
  charts: ['recharts'],
  xlsx: ['xlsx'],
  canvas: ['html2canvas'],
  animation: ['framer-motion'],
}
```
**Impact:** 40-50% smaller initial load, enables browser caching of stable vendor chunks

---

### 3. All major components imported eagerly in Dashboard
**File:** `frontend/src/components/Dashboard.tsx` lines 40-72
**Issue:** Every tool component is imported at the top level — ImageStudio (144KB), ClassManagement (92KB), CrossCurricularPlanner (71KB), LessonPlanner (67KB), KindergartenPlanner (60KB), etc. Users only see one tab at a time but pay the cost of loading ALL of them.
**Fix:** Use `React.lazy()` for every tab component:
```tsx
const ImageStudio = React.lazy(() => import('./ImageStudio'));
const ClassManagement = React.lazy(() => import('./ClassManagement'));
// ... wrap render in <Suspense fallback={<Loading />}>
```
**Impact:** ~600KB+ deferred from initial load. Much faster time-to-interactive.

---

### 4. Backend startup blocks window creation
**File:** `electron/main.js` lines 607-648
**Issue:** `await startBackend()` is called before the main UI loads. The Python backend can take 10-45 seconds to start, and the user stares at a splash screen the entire time.
**Fix:** Start the backend asynchronously. Show the UI immediately with a "Connecting to backend..." indicator. Let features enable as backend becomes ready.
**Impact:** Perceived startup time drops from 30-60s to 2-5s

---

### 5. LLM model re-created on every inference call
**File:** `backend/inference_factory.py` lines 61-67
**Issue:** `get_inference_instance()` creates a NEW `LlamaInference` object each time, re-loading the model from disk. Model loading takes 5-30 seconds depending on size.
**Fix:** Create a singleton instance on first call and reuse it. Use thread-safe locking for concurrent access.
```python
_instance = None
def get_inference_instance():
    global _instance
    if _instance is None:
        _instance = LlamaInference(model_path=MODEL_PATH, n_ctx=MODEL_N_CTX)
    return _instance
```
**Impact:** Eliminates 5-30s reload penalty on every generation after the first

---

## P1 — HIGH (Clearly Noticeable)

### 6. Large JSON data files statically imported (~1 MB)
**Files:**
- `frontend/src/components/LessonPlanner.tsx` → imports `curriculumIndex.json` (460KB)
- `frontend/src/components/WorksheetGenerator.tsx` → imports `curriculumIndex.json` (460KB)
- `frontend/src/utils/curriculumHelpers.ts` → imports `curriculumIndex.json` (460KB)
- `frontend/src/components/CurriculumNavigator.tsx` → imports `curriculumTree.json` (94KB)

**Issue:** These huge JSON files are bundled into the main chunk and parsed at startup, even when the user hasn't opened those tools.
**Fix:** Dynamic import on first use:
```ts
const curriculumIndex = await import('../data/curriculumIndex.json').then(m => m.default);
```
**Impact:** ~1MB deferred from initial bundle

---

### 7. History JSON files re-read from disk on every request
**File:** `backend/main.py` lines 2367-2473 (8 endpoints)
**Issue:** Every GET to `/api/*-history` calls `load_json_data()` which opens, reads, and JSON-parses the file from disk. No caching at all.
**Fix:** Cache history data in memory. Invalidate on write.
```python
_history_cache = {}
def get_cached_history(name):
    if name not in _history_cache:
        _history_cache[name] = load_json_data(name)
    return _history_cache[name]
```
**Impact:** 200-500ms faster page loads when opening history panels

---

### 8. Process pool defaults to only 2 workers
**File:** `backend/process_pool.py` line 7
**Issue:** `DEFAULT_WORKERS = int(os.environ.get("PROCESS_POOL_WORKERS", 2))` — only 2 workers regardless of CPU count. Concurrent generation requests queue up.
**Fix:** Default to `cpu_count() - 1`:
```python
import os
DEFAULT_WORKERS = int(os.environ.get("PROCESS_POOL_WORKERS", max(2, os.cpu_count() - 1)))
```
**Impact:** 2-3x faster handling of concurrent requests

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
