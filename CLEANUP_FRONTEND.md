# App Cleanup Plan

This document covers all unnecessary code, dead assets, and build inefficiencies found in the codebase. Ordered by impact.

---

## 1. Dead Files — Delete These

### 1a. `src/lib/supabase.ts` — DELETE the entire file

- Imports `@supabase/supabase-js`, which is **not installed** (not in `package.json`)
- **Not imported anywhere** in the codebase — zero references found across all 442 source files
- The file is completely inert and broken

**Action:** Delete `src/lib/supabase.ts`.

---

## 2. Dead Code Blocks — Remove from Source Files

### 2a. `src/components/Settings.tsx` — Three permanently-hidden sections

Three JSX blocks are wrapped in `{false && ...}`, making them permanently unreachable. They still bloat the bundle because the code is included in the build even though it never renders.

| Lines | Section |
|-------|---------|
| 420–443 | OECS Authentication Key (OAK) section |
| 518–539 | Export Data section (Export Chats, Plans, Quizzes, Rubrics) |
| 563–600 | Generation Behavior section (Queued / Simultaneous radio) |

**Action:** Delete each `{false && <Card ...>...</Card>}` block and its surrounding comment. Verified: the following are **only** used inside these hidden blocks and must also be deleted:

- `Eye`, `EyeOff` imports from lucide-react — only used in OAK block
- `showPassword` state variable (line 30) — only used in OAK block
- `handleExportChats`, `handleExportLessonPlans`, `handleExportQuizzes`, `handleExportRubrics` functions — only called from Export block
- `generationMode` state (if any) — only used in Generation Behavior block

All of the above are confirmed dead after block removal. Safe to delete together.

---

### 2b. `src/components/WorksheetEditor.tsx:405–406` — Console log + unimplemented TODO

```ts
// Line 405
console.log('Saving worksheet:', worksheetData);
// Line 406
// TODO: Implement actual save
```

The save button logs to console but does nothing. Either implement the save or remove the dead handler code.

**Action:** Implement the save logic (mirrors how other editors save), or if this feature isn't ready, remove the `console.log` at minimum.

---

### 2c. `src/components/CurriculumViewer.tsx` — Debug console.log statements

Multiple `console.log` calls left from development, firing on every curriculum navigation:

| Line | Content |
|------|---------|
| 60 | `'📍 Navigating to curriculum path:'` |
| 109 | `'Skipping dynamic route:'` |
| 123 | `'Looking for component at:'` |
| 124 | `'Possible paths:'` |
| 136 | `'Found match:'` |

**Action:** Delete all five `console.log` lines. The `console.error` calls (lines 144, 153) are legitimate error handling — keep those.

---

## 3. Duplicate Code — Consolidate

### 3a. `GRADE_SPECS` object duplicated in 6 files (~1,500+ lines total)

> **⚠️ SAFETY VERIFIED — DO NOT extract naively. See below.**

The GRADE_SPECS objects share the same base 6 fields across all files, but **each file adds different domain-specific fields** on top. They are NOT identical:

| File | Extra fields beyond the base 6 |
|------|-------------------------------|
| `lessonPromptBuilder.ts` | None (base only) |
| `quizPromptBuilder.ts` | `readingLevel`, `sentenceStructure`, `vocabulary`, `concepts`, `questionComplexity`, `examples`, `cognitiveDepth` (+7 fields) |
| `rubricPromptBuilder.ts` | `criteriaCount`, `performanceDescriptors`, `pointSystem` (+3 fields) |
| `worksheetPromptBuilder.ts` | Worksheet-specific fields |
| `multigradePromptBuilder.ts` | Multigrade-specific fields |
| `crossCurricularPromptBuilder.ts` | Cross-curricular fields |

**Safe extraction option:** You can extract only the shared base 6 fields into `src/utils/gradeSpecs.ts` and have each builder spread them with its own additions:
```ts
// gradeSpecs.ts — shared base only
export const GRADE_SPECS_BASE = { 'K': { name, pedagogicalApproach, activityTypes, ... }, ... }

// quizPromptBuilder.ts — extend with quiz-specific fields
const GRADE_SPECS = Object.fromEntries(
  Object.entries(GRADE_SPECS_BASE).map(([k, v]) => [k, { ...v, readingLevel: '...', ... }])
);
```
This is moderately complex. If unsure, skip this refactor — the duplication is annoying but not harmful.

---

## 4. Build / Bundle Inefficiencies

### 4a. `src/components/CurriculumViewer.tsx:18` — Eager glob loads ALL curriculum files into main bundle — ✅ SAFE

```ts
// Current — BAD for bundle size
const allCurriculumPages = import.meta.glob('../curriculum/**/*.tsx', { eager: true });
```

`eager: true` means every single `.tsx` file in `src/curriculum/` (~400 files) is synchronously bundled into the main JS chunk and parsed on app startup — even if the user never opens the Curriculum tab.

**Action:** Remove `eager: true` to switch to lazy (dynamic) loading. The rest of the loading logic already handles async modules, so this is a safe drop-in change:

```ts
// After — lazy loads curriculum pages only when navigated to
const curriculumPages = import.meta.glob('../curriculum/**/*.tsx');
```

Then **also delete the entire `reduce` wrapper block (lines 21–28)**. The `allCurriculumPages` variable and its reduce are only needed because of eager loading. With lazy loading, the glob already returns functions that return Promises — exactly the same interface the rest of the code expects.

```ts
// Full replacement — just this one line:
const curriculumPages = import.meta.glob('../curriculum/**/*.tsx');
// Line 138 (curriculumPages[path]()) already works unchanged.
```

**Impact:** Massive reduction in initial bundle size and parse time. Curriculum pages load on demand.

---

### 4b. `vite.config.ts:35` — `manualChunks: undefined` disables code splitting

```ts
// Current
rollupOptions: {
  output: {
    manualChunks: undefined,
  },
},
```

Setting `manualChunks: undefined` tells Rollup to put everything in one chunk. Combined with the eager glob above, this creates a single enormous JS bundle.

**Action:** Remove the `rollupOptions.output` block entirely (or set `manualChunks` to a real config). Rollup's default automatic code splitting is better than `undefined`:

```ts
build: {
  assetsDir: 'assets',
  copyPublicDir: true,
},
```

If you want explicit splitting, a minimal config that separates vendor libs:

```ts
rollupOptions: {
  output: {
    manualChunks: {
      vendor: ['react', 'react-dom', 'react-router-dom'],
      charts: ['recharts'],
      motion: ['framer-motion'],
    },
  },
},
```

---

### 4c. `vite.config.ts` — Alias redundancy — ✅ SAFE (remove from both files)

```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@/components': path.resolve(__dirname, './src/components'),  // redundant
    '@/curriculum': path.resolve(__dirname, './src/curriculum'),  // redundant
  },
},
```

`@/components` and `@/curriculum` are redundant — Vite resolves `@/components/Foo` through the `@` alias automatically.

`tsconfig.app.json` also has matching explicit aliases. You must remove them from **both files at the same time** to stay in sync:

In `vite.config.ts` — remove the two redundant entries, keep only `'@': path.resolve(__dirname, './src')`.

In `tsconfig.app.json` — remove these two lines from `"paths"`:
```json
"@/components/*": ["components/*"],
"@/curriculum/*": ["curriculum/*"]
```
Keep `"@/*": ["*"]`.

**Do not remove from only one file** — that creates a Vite/TypeScript config mismatch that will break IDE type checking while build still works (confusing).

---

## 5. Unused Public Assets — Remove to Reduce Dist Size

`vite.config.ts` has `copyPublicDir: true`, which copies **all 244 files** from `public/` into `dist/` on every build. The files below are **not referenced anywhere** in source code and add unnecessary weight to the packaged app.

### 5a. Placeholder / Misnamed Files (safe to delete immediately)

| File | Reason |
|------|--------|
| `public/image-name.png` | Obvious placeholder name, unreferenced |
| `public/favlogo.png` | Unreferenced; `OECS.png` is the actual favicon |
| `public/favicon.ico` | Not referenced in `index.html` (uses `OECS.png`) |
| `public/favicon.png` | Same — not referenced |
| `public/favicon.svg` | Same — not referenced |
| `public/apple-touch-icon.png` | Not referenced in `index.html` or any source file |
| `public/manifest.json` | Not referenced anywhere (no PWA setup) |
| `public/robots.txt` | Not needed for a desktop Electron app |
| `public/sitemap.xml` | Not needed for a desktop Electron app |

---

### 5b. Branding / Avatar Assets — Unreferenced

| File |
|------|
| `public/oecsnavlogo.png` |
| `public/Pearl_A.png` |
| `public/Pearl_LTW.png` |
| `public/Pearl_sign.png` |
| `public/psticker.png` |
| `public/diverse-avatars.png` |

---

### 5c. Stock / Placeholder Educational Images — Unreferenced

These appear to be stock photos downloaded for possible future content but never wired into the codebase:

| File |
|------|
| `public/educational-dashboard.png` |
| `public/school-administrator-desk.png` |
| `public/student-tablet-learning.png` |
| `public/teacher-and-students-collaborating-on-writing-at-a.png` |
| `public/teacher-digital-tools.png` |
| `public/parent-child-computer.png` |
| `public/modern-indigenous-caribbean.png` |
| `public/resources.png` |
| `public/grade-1-classroom.png` |
| `public/grade-6-classroom.png` |
| `public/elementary-language-arts.png` |
| `public/elementary-mathematics.png` |
| `public/elementary-school-grade-2.png` |
| `public/elementary-school-grade-3.png` |
| `public/elementary-school-grade-4.png` |
| `public/elementary-school-grade-5.png` |
| `public/elementary-science-class.png` |
| `public/g1la.png` |
| `public/g1mathematics.png` |
| `public/g1math-graphs.png` |
| `public/g1science.png` |
| `public/g1ss.png` |

---

### 5d. Caribbean-Themed Images — Unreferenced

| File |
|------|
| `public/caribbean-arrival.png` |
| `public/caribbean-children-creating-family-tree-with-col.png` |
| `public/caribbean-children-creating-neighborhood-maps-wit.png` |
| `public/caribbean-children-observing-weather-types.png` |
| `public/caribbean-children-role-playing-community-helpers.png` |
| `public/caribbean-children-sharing-cultural-items-and-tr.png` |
| `public/caribbean-children-sorting-needs-wants-items-into.png` |
| `public/caribbean-children-using-compass-and-maps-for-tr.png` |
| `public/caribbean-cultural-festival.png` |
| `public/caribbean-indigenous-gathering.png` |
| `public/caribbean-migration-map.png` |
| `public/caribbean-resistance.png` |
| `public/caribbean-tropical-weather-types.png` |
| `public/caribbean-weather-chart.png` |
| `public/caribbean-weather-crafts.png` |
| `public/caribbean-weather-dance.png` |
| `public/caribbean-weather-drawing.png` |
| `public/caribbean-weather-gallery.png` |
| `public/caribbean-weather-scenes.png` |
| `public/caribbean-weather-stations.png` |

---

### 5e. Children Activity Images — Unreferenced

| File |
|------|
| `public/celebrations.png` |
| `public/children-arranging-colorful-story-sequence-cards-o.png` |
| `public/children-comparing-photos.png` |
| `public/children-creating-memory-books-about-celebrations.png` |
| `public/children-ecosystem.png` |
| `public/children-magnet-experiment.png` |
| `public/children-performing-puppet-show-with-colorful-sock.png` |
| `public/children-time-capsule.png` |
| `public/children-working-at-different-learning-centers-wit.png` |
| `public/different-material-properties.png` |
| `public/disassembled-reassembled-objects.png` |
| `public/life-cycles-children.png` |
| `public/persuasive-writing-campaign.png` |

---

### 5f. Kindergarten Images — Unreferenced

| File |
|------|
| `public/kindergarten-board-games.png` |
| `public/kindergarten-caribbean-family-cooking.png` |
| `public/kindergarten-children-giving-presentations-about-c.png` |
| `public/kindergarten-children-presenting-celebrations-to-f.png` |
| `public/kindergarten-children-sitting-in-circle-discussing.png` |
| `public/kindergarten-community-helpers.png` |
| `public/kindergarten-exploration.png` |
| `public/kindergarten-game-materials.png` |
| `public/kindergarten-games.png` |
| `public/kindergarten-outdoor-games.png` |
| `public/kindergarten-rainy-day.png` |
| `public/kindergarten-seasons.png` |
| `public/kindergarten-teamwork-games.png` |
| `public/kindergarten-weather-clothing.png` |
| `public/kindergarten-weather-learning.png` |

---

## 6. Broken Image References (In Code, Missing from Public)

These image filenames are referenced in `src/curriculum/**` pages but the files **do not exist** in `public/`. They currently show as broken images at runtime. Either add the missing images or remove the broken `<img>` tags.

| Missing File | Likely Location in Code |
|---|---|
| `biodegradable-plastics-lab.png` | Grade 6 science |
| `climate-monitoring-network.png` | Grade 5/6 science |
| `community-helpers-interview.png` | Social studies |
| `community-map-makers.png` | Social studies |
| `conflict-resolution-heroes.png` | Social studies |
| `coral-reef-restoration.png` | Science/environment |
| `cultural-celebration-day.png` | Social studies |
| `family-tree-explorer.png` | Social studies |
| `goods-and-services-sort.png` | Economics unit |
| `hurricane-engineering-challenge.png` | Science/engineering |
| `renewable-energy-island.png` | Science |
| `space-agriculture-mission.png` | Science |
| `kindergarten-fall-leaves.png` | Kindergarten weather/seasons |
| `kindergarten-leaf-art.png` | Kindergarten |
| `kindergarten-meteorologist-play.png` | Kindergarten weather |
| `kindergarten-outdoor-observation.png` | Kindergarten |
| `kindergarten-paper-windmills.png` | Kindergarten weather |
| `kindergarten-seasons-sorting.png` | Kindergarten |
| `kindergarten-seasons-spring.png` | Kindergarten |
| `kindergarten-spring-flowers.png` | Kindergarten |
| `kindergarten-spring-nature-walk.png` | Kindergarten |
| `kindergarten-summer-activities.png` | Kindergarten |
| `kindergarten-summer-crafts.png` | Kindergarten |
| `kindergarten-weather-graphs.png` | Kindergarten weather |
| `kindergarten-weather-journals.png` | Kindergarten weather |
| `kindergarten-weather-predictions.png` | Kindergarten weather |
| `kindergarten-weather-preparation.png` | Kindergarten weather |
| `kindergarten-weather-reports.png` | Kindergarten weather |
| `kindergarten-weather-safety.png` | Kindergarten weather |
| `kindergarten-weather-types.png` | Kindergarten weather |
| `kindergarten-winter-activities.png` | Kindergarten |
| `kindergarten-winter-crafts.png` | Kindergarten |

---

## 7. Minor / Low Priority

### 7a. `src/app/actions/curriculum-standards.ts` — Misplaced directory

The file sits in `src/app/actions/`, which is a Next.js server actions convention. This is a Vite/React app. The file itself is fine (it's just a fetch wrapper), but the folder structure is misleading.

- Used only in `src/curriculum/standards.tsx` and `src/curriculum/standards/page.tsx`
- Consider moving to `src/lib/curriculumStandards.ts` to match the rest of the lib files

**Action:** Optional — move the file and update the two import statements.

---

### 7b. `src/components/Settings.tsx` — Imports that may become unused after removing dead blocks

After removing the three `{false && ...}` blocks (Section 2a), double-check these imports at the top of Settings.tsx and remove any that are no longer used:
- `Eye`, `EyeOff` from lucide-react (used only in the OAK password toggle)
- `handleExportChats`, `handleExportLessonPlans`, `handleExportQuizzes`, `handleExportRubrics` — likely only used in the hidden Export Data block
- `showPassword` state variable — only used in the OAK block

---

---

## 8. `src/lib/api.ts` — Delete Entire File (Boilerplate, Never Imported)

This file is scaffolding left over from project setup. It exports an `api` object with `items.list()`, `items.create()`, and `items.get()` — generic CRUD wrappers for a `/items` endpoint that doesn't exist in the backend.

- **Zero imports** across the entire codebase — confirmed not used anywhere
- The real API calls are all made directly in each component using `fetch`/`axios` against specific endpoints

**Action:** Delete `src/lib/api.ts`.

---

## 9. Hardcoded `localhost:8000` URLs — Replace with Config

The `.env.example` file defines `VITE_API_URL=http://localhost:8000` but **this variable is never actually used in the code**. Instead, `http://localhost:8000` is hardcoded directly in 30+ places. In an Electron app this works for dev, but it's a maintenance problem and would break if the port ever changes.

Files with hardcoded `http://localhost:8000`:

| File | Notes |
|------|-------|
| `src/lib/api.ts` | (delete this file — see §8) |
| `src/lib/milestoneApi.ts:4` | `const API_URL = 'http://localhost:8000/api/milestones'` |
| `src/lib/imageApi.ts:3` | `const API_URL = 'http://localhost:8000/api'` |
| `src/contexts/WebSocketContext.tsx:60–61` | WebSocket URL hardcoded |
| `src/app/actions/curriculum-standards.ts:15` | Hardcoded fetch URL |
| `src/components/ExportButton.tsx:123` | Hardcoded endpoint |
| `src/components/WorksheetGenerator.tsx` | Lines 372, 390, 761, 774, 795, 847, 893 |
| `src/components/ResourceManager.tsx` | Lines 73–80, 202–209 |
| `src/components/Login.tsx:20` | |
| `src/components/ImageStudio.tsx` | Lines 136, 404, 652 |
| `src/components/RubricGenerator.tsx` | Lines 640, 673, 697 |
| `src/components/LessonPlanner.tsx` | Lines 601, 631, 656 |
| `src/components/CrossCurricularPlanner.tsx` | Lines 672, 727, 751 |
| `src/components/QuizGenerator.tsx` | Lines 299, 328 |
| `src/components/MultigradePlanner.tsx` | Lines 477, 510, 534 |
| `src/components/KindergartenPlanner.tsx` | Lines 606, 639, 663 |
| `src/components/Settings.tsx:59` | |

**Action:**
1. In `src/config/api.config.ts` (already exists and is used), add or confirm there's a base URL export.
2. In each lib file (`milestoneApi.ts`, `imageApi.ts`), replace the hardcoded string with `import.meta.env.VITE_API_URL ?? 'http://localhost:8000'`.
3. In components that call `fetch`/`axios` directly instead of going through the lib files, refactor to use the lib or at minimum reference a single constant.
4. The `.env.example` already has the right variable — now actually use it.

---

## 10. `electron/preload.js` — `getAppInfo` IPC Channel Has No Handler

`preload.js` exposes `electronAPI.getAppInfo()` which sends an `app-info` IPC message and waits for an `app-info-response` reply. **There is no `ipcMain.on('app-info', ...)` handler in `electron/main.js`**. The frontend also never calls `getAppInfo()` — it only appears in the TypeScript type definition in `vite-env.d.ts`.

- `getAppInfo` defined in: `electron/preload.js:5–12`
- No handler in: `electron/main.js` (confirmed)
- No usage in: any `src/` frontend file (confirmed)

**Action:** Remove the `getAppInfo` entry from `preload.js` (lines 5–12) and remove its type declaration from `src/vite-env.d.ts:6`.

---

## 11. Recommendations

### 11a. Replace `VITE_API_URL` pattern with Electron IPC for API calls

Currently the frontend calls the backend via HTTP (`http://localhost:8000`). In a packaged Electron app this is fragile — if the port is in use, the entire app fails silently. A more robust pattern is:

- Keep the HTTP approach but read the port from `import.meta.env.VITE_API_URL` (see §9)
- Or: expose the backend port via IPC from `electron/main.js` so the frontend always knows the actual port the backend started on (especially useful if you add port fallback logic)

### 11b. Add `tsconfig.json` path checking (`noUnusedLocals`)

Add to `tsconfig.app.json`:
```json
"compilerOptions": {
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```
This makes TypeScript flag unused imports and variables automatically, so dead code is caught at compile time rather than manual review.

### 11c. Consider lazy-loading non-curriculum heavy components

Components like `AnalyticsDashboard`, `ImageStudio`, `ResourceManager`, and `CurriculumTracker` are all eagerly imported in `Dashboard.tsx`. Since only one tab is visible at a time, these could be lazily imported:
```ts
const AnalyticsDashboard = React.lazy(() => import('./AnalyticsDashboard'));
```
This would reduce initial parse time significantly.

### 11d. Move splashscreen out of `public/` into `electron/`

`public/splashscreen/splashscreen.html` is an Electron-only file that gets copied into `dist/` as a web asset during build. It's then extracted separately via `extraResources` in `package.json`. It makes more sense in `electron/splashscreen/` alongside the other Electron-specific files, avoiding the awkward double-copy.

### 11e. Add a `.env` for development

The frontend has `.env.example` but no actual `.env` file. Since `VITE_API_URL` is not consumed (see §9), developers have to know the port by convention. Once §9 is fixed, create `frontend/.env` with `VITE_API_URL=http://localhost:8000` and document it. The file is already gitignored (`*.local`, `.env`).

---

## Summary

| Priority | Item | Safety | Files Affected |
|----------|------|--------|----------------|
| High | Delete `supabase.ts` | ✅ Safe | 1 file |
| High | Delete `src/lib/api.ts` (unused boilerplate) | ✅ Safe | 1 file |
| High | Remove 3 `{false && ...}` blocks + orphaned state/handlers | ✅ Safe | `Settings.tsx` |
| High | Switch glob from eager to lazy + delete reduce wrapper | ✅ Safe | `CurriculumViewer.tsx` |
| High | Replace hardcoded localhost URLs (30+ places) | ✅ Safe | Multiple files |
| Medium | Extract shared `GRADE_SPECS` base (careful — files have different extra fields) | ⚠️ Read §3a notes | 6 util files + 1 new |
| Medium | Fix `manualChunks: undefined` | ✅ Safe | `vite.config.ts` |
| Medium | Remove redundant aliases (remove from BOTH vite.config + tsconfig) | ✅ Safe if both | `vite.config.ts` + `tsconfig.app.json` |
| Medium | Delete ~75 unused public images | ✅ Safe | `public/` folder |
| Medium | Fix/add 32 missing image files | ✅ Safe | `public/` + curriculum pages |
| Medium | Remove dead `getAppInfo` IPC channel | ✅ Safe | `preload.js` + `vite-env.d.ts` |
| Low | Remove debug console.logs | ✅ Safe | `CurriculumViewer.tsx` |
| Low | Remove console.log + TODO | ✅ Safe | `WorksheetEditor.tsx` |
| Low | Move `curriculum-standards.ts` | ✅ Safe | `src/app/actions/` → `src/lib/` |
| Note | `noUnusedLocals` already enabled in tsconfig.app.json | ✅ Already done | — |
| Recommendation | Lazy-load heavy Dashboard tabs | ✅ Safe | `Dashboard.tsx` |
| Recommendation | Centralize API URL config | ✅ Safe | All components |
| Recommendation | Move splashscreen to `electron/` | ✅ Safe | `public/splashscreen/` |

---

## Audit Notes (Added 2026-03-13)

All items in this document were independently verified against the live codebase. Findings:

1. **All claims confirmed accurate** — dead files, dead code blocks, duplicate IPC handlers, eager glob, hardcoded URLs, and unused public images all verified.

2. **Additional packaging concern:** The `frontend/src/data` extraResources entry in root `package.json` copies JSON files (`curriculumIndex.json`, `curriculumRoutes.json`, `curriculumTree.json`) into the packaged app at `resources/frontend/src/data/`. However, `electron/main.js` never reads from this path — Vite bundles these files into the JS during build. This entry adds ~unnecessary weight to the installer. See `CLEANUP_BACKEND_BUILD.md` §7 for the corresponding backend-side note. **Action:** Remove this extraResources entry after confirming no runtime code reads from `process.resourcesPath + '/frontend/src/data/'`.

3. **Priority recommendation for packaging:** Items §4a (eager glob), §4b (manualChunks), and §5 (unused public images) have the biggest impact on final app size. The eager glob alone pulls ~400 curriculum `.tsx` files into one JS chunk. Combined with `manualChunks: undefined` disabling code splitting, the frontend bundle is unnecessarily large. Fix these first for the biggest packaging win.

4. **GRADE_SPECS extraction (§3a):** The doc correctly warns this is complex. Each file has different extra fields. Skip this unless you have time — the duplication is annoying but won't affect packaging or runtime.
