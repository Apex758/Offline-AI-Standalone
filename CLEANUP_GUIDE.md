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

 

## P3 — LOW (Nice to Have)

### 18. lucide-react excluded from Vite optimization
**File:** `frontend/vite.config.ts` line 16
**Issue:** `optimizeDeps: { exclude: ['lucide-react'] }` prevents Vite from pre-bundling icons. Dashboard alone imports 30+ icons.
**Fix:** Remove the `exclude` line.
**Impact:** Faster dev server, slightly smaller bundle

---




