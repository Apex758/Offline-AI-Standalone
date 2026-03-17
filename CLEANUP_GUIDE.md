# Cleanup Guide — Dead Code & Useless Files




### Sparkles Icon Usage
The `Sparkles` icon (✨) is heavily used — it's on the AI Assistant header, every "AI Assistant" button across generators, Brain Dump, Image Studio, Settings features section, and analytics widgets. This icon has become a visual cliche for "AI feature."

**Suggestion:** Replace `Sparkles` with more purposeful icons:
- AI Assistant panel header: Use `MessageSquare` (it's a chat) or a custom PEARL icon/logo
- Generator "Assistant" buttons: Use `MessageSquare` (opening a chat panel)
- BrainDump process button: Use `Zap` or `ArrowRight` (processing/converting)
- Image Studio generate: Use `Palette` or `Image` (you're making images)
- Settings features: Use `Sliders` or `ToggleLeft` (configuration)

Reserve `Sparkles` for, at most, ONE place — or don't use it at all.

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
 



