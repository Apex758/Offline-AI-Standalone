# Cleanup Guide — Dead Code & Useless Files






## P1 — HIGH (Clearly Noticeable)

---

### 9. Synchronous directory copy blocks Electron on first run
**File:** `electron/main.js` lines 92-111, 159
**Issue:** `copyDirectorySync()` recursively copies image generation models synchronously on first launch, freezing the entire UI.
**Fix:** Use `fs.promises.cp()` (Node 16.7+) or async recursive copy.
**Impact:** Eliminates multi-second UI freeze on first run

---



## P2 — MEDIUM (Worth Doing)


---



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



---


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
 
 