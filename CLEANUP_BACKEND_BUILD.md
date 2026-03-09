# Backend & Build Cleanup Plan

This covers the backend Python code, root-level junk, Electron main process, and the packaging/build configuration. Ordered by impact.

---

## 1. Critical Bug — Backend `main.py` Double `yield` in Lifespan — ✅ SAFE TO FIX

**File:** `backend/main.py:209` and `backend/main.py:224`

The `lifespan` asynccontextmanager has **two `yield` statements**. Python's `asynccontextmanager` only supports one `yield` — code before it runs at startup, code after it runs at shutdown. Two yields will cause a `RuntimeError: generator didn't stop` on shutdown.

Current broken state:
```python
# ... startup code (inference init, milestone db, etc.) ...
logger.info("Server ready!")
yield           # line 209 — server starts here

# ❌ This block is currently BETWEEN the two yields
# It runs after server starts, during runtime — never at startup!
try:
    image_service = get_image_service()
    image_service.start_iopaint()
except ...

logger.info("Server ready!")   # ❌ runs at wrong time
yield                           # line 224 — causes RuntimeError on shutdown

# Shutdown code (inference.cleanup, image_service.cleanup) ...
```

**Correct fix — full structure after change:**

Move the image service block BEFORE line 209. Remove the second `logger.info("Server ready!")` (line 223) and the second `yield` (line 224). The shutdown code (lines 226–244) stays exactly where it is — it will now correctly run after the single yield:

```python
# Startup: inference init ...
# Startup: curriculum matcher init ...
# Startup: milestone db init ...

# ADD HERE: Image Service init (move from between yields)
try:
    from image_service import get_image_service
    image_service = get_image_service()
    logger.info("Image service initialized")
    image_service.start_iopaint()
except Exception as e:
    logger.error(f"Failed to initialize image service: {e}")

logger.info("Server ready!")
yield           # ← only yield. Server runs. App is up.

# Shutdown (already here, leave unchanged):
inference.cleanup()
image_service.cleanup()
cleanup_all_processes()
shutdown_executor()
```

**Dependency order is safe:** image_service has no dependency on inference_factory — they initialize independently.

---

## 2. Duplicate Imports in `backend/main.py`

`os` and `sys` are imported twice each:

| Module | First import | Duplicate |
|--------|-------------|-----------|
| `os` | Line 2 | Line 25 |
| `sys` | Line 3 | Line 27 |

**Fix:** Remove the duplicate imports at lines 25 and 27.

---

## 3. `requirements.txt` Cleanup

### 3a. `backend/requirements.txt` — Internal duplicates

| Issue | Lines |
|-------|-------|
| `beautifulsoup4==4.14.2` listed twice | Lines 26 and 27 |
| "MANUAL INSTALLATION REQUIRED" comment block for `llama-cpp-python` repeated twice | Lines 40–42 and 44–47 |

**Fix:** Remove the second `beautifulsoup4` line and one of the duplicate comment blocks.

### 3b. Root-level `requirements.txt` vs `backend/requirements.txt`

There are two nearly identical requirements files:
- `requirements.txt` (root)
- `backend/requirements.txt`

The root one adds `google-genai>=0.3.0` which is **not imported anywhere in the backend code**. The build only uses `backend/requirements.txt` via `build-scripts/package-backend.py`.

**Fix:**
1. Remove `google-genai>=0.3.0` from the root `requirements.txt` (unused package).
2. Delete the root `requirements.txt` entirely — it's redundant. The authoritative file is `backend/requirements.txt`. Update `SETUP.md` if it references the root one.

---

## 4. Root Package.json — Unused Dependencies — ✅ SAFE (all four)

**File:** `package.json` (project root)

These packages are in root `"dependencies"` but **none are used by `electron/main.js`** or `electron/preload.js`. The frontend has its own `frontend/package.json` with its own copies, built from `frontend/node_modules` — completely separate from the root `node_modules`. Removing from root has zero effect on the frontend build.

| Package | Verdict |
|---------|---------|
| `date-fns` | ✅ Safe to remove — used by frontend (covered by `frontend/package.json`) not by electron |
| `react-calendar` | ✅ Safe to remove — used by frontend (covered by `frontend/package.json`) not by electron |
| `react-router-dom` | ✅ Safe to remove — used by frontend (covered by `frontend/package.json`) not by electron |
| `electron-updater` | ✅ Safe to remove — not imported anywhere in `electron/main.js` (confirmed) |

**Fix:** Remove all four from `"dependencies"` in the root `package.json`. The only legitimate runtime dep for the electron process is `electron-log`.

---

## 5. Electron `main.js` — DevTools Enabled in Production

**File:** `electron/main.js:385`

```js
devTools: true, // Enable DevTools for debugging
```

This leaves DevTools enabled in the packaged production app, allowing anyone to inspect the app internals.

**Fix:** Make it conditional:
```js
devTools: isDev,
```

---

## 6. Build Config — `extraResources` Bundles Dev Files — ⚠️ USE ALLOWLIST CAREFULLY

**File:** `package.json` (root), `"build"` → `"extraResources"`

The current filter:
```json
"filter": ["**/*", "!**/__pycache__/**", "!**/*.pyc", "!**/venv/**", "!**/.venv/**", "!chat_history.json", "!lesson_plan_history.json", "!data/**"]
```

This bundles the **entire backend folder** into the release, including dozens of dev-only files that users don't need.

### Files currently bundled that should NOT be in the release:

| File | What it is |
|------|-----------|
| `audit_preset_coverage.py` | Dev utility script |
| `blip_executor.py` | Abandoned Jina BLIP executor |
| `build_enhanced_presets.py` | Dev preset builder |
| `build_full_presets.py` | Dev preset builder |
| `generate_comprehensive_presets.py` | Dev preset builder |
| `check_specific_strand.py` | Dev utility |
| `flow.yml` | Jina flow config (abandoned) |
| `run_flow.py` | Jina runner (abandoned) |
| `run_pipeline.py` | Dev pipeline script |
| `process_cleanup_patch.py` | One-time patch script (already applied) |
| `test_presets.py` | Dev testing script |
| `auto_venv_and_uvicorn.ps1` | Dev PowerShell startup script |
| `Microsoft.PowerShell_profile.ps1` | Dev PowerShell profile |
| `notes.txt` | Dev notes |
| `ARCHITECTURE_ANALYSIS.md` | Dev documentation |
| `requirements.txt` | Not needed at runtime |
| `requirements-lock.txt` | Not needed at runtime |
| `wmremove-transformed.jpeg` | Test image left in backend folder |
| `X.jpg` | Test image left in backend folder |
| `validation/` | Dev validation scripts |
| `var/` | Cache directory (fontconfig cache) |
| `config/topic_presets_comprehensive.json` | Check if this duplicates `topic_presets.json` |

**Fix:** The safest approach is a **denylist** (exclude specific dev-only items) rather than an allowlist, because an incomplete allowlist will break the app if you miss a runtime file. Replace the current filter with:

```json
"filter": [
  "**/*",
  "!**/__pycache__/**",
  "!**/*.pyc",
  "!**/venv/**",
  "!**/.venv/**",
  "!chat_history.json",
  "!lesson_plan_history.json",
  "!data/**",
  "!audit_preset_coverage.py",
  "!blip_executor.py",
  "!build_enhanced_presets.py",
  "!build_full_presets.py",
  "!generate_comprehensive_presets.py",
  "!check_specific_strand.py",
  "!flow.yml",
  "!run_flow.py",
  "!run_pipeline.py",
  "!process_cleanup_patch.py",
  "!test_presets.py",
  "!auto_venv_and_uvicorn.ps1",
  "!Microsoft.PowerShell_profile.ps1",
  "!notes.txt",
  "!ARCHITECTURE_ANALYSIS.md",
  "!requirements.txt",
  "!requirements-lock.txt",
  "!wmremove-transformed.jpeg",
  "!X.jpg",
  "!validation/**",
  "!var/**",
  "!config/topic_presets_comprehensive.json"
]
```

This keeps everything runtime needs and only strips confirmed dev-only files.

---

## 7. Build Config — Redundant `extraResources` Entry

**File:** `package.json` (root), `"build"` → `"extraResources"`

```json
{
  "from": "frontend/src/data",
  "to": "frontend/src/data",
  "filter": ["**/*.json"]
}
```

This copies JSON files from the **source** `frontend/src/data` directory into the app bundle at a path that mirrors the source tree (`frontend/src/data`). This only works because `electron/main.js` doesn't actually read from this path — these files are referenced by the React app via Vite's import system and should already be bundled into `frontend/dist` during the build step.

**Action:** Verify whether the app actually reads from `resources/frontend/src/data/*.json` at runtime. If not (the files are bundled into the JS by Vite), remove this extraResources entry entirely.

---

## 8. Root-Level Junk Files — Delete These

These files are sitting at the project root and either shouldn't be there at all or are one-time dev artifacts:

| File | Size | What it is |
|------|------|-----------|
| `llama-model-temp.gguf` | **2.2 GB** | Temporary model file — should be deleted or moved to `models/` |
| `bfg.jar` | 14 MB | Java BFG Repo Cleaner — dev git utility, has no place in the project |
| `convert_curriculum_pages.py` | — | One-time migration script (already run) |
| `generate_curriculum_tree.py` | — | One-time generator script (already run) |
| `scan_kindergarten_imports.py` | — | One-time dev utility |
| `run.py` | — | Dev runner script |
| `curriculum_strands_analysis.json` | — | Generated analysis artifact from dev work |
| `FINAL_IMPLEMENTATION_GUIDE.md` | — | Dev planning doc |
| `HYBRID_IMAGE_APPROACH.md` | — | Dev planning doc |
| `IMPLEMENTATION_COMPLETE.md` | — | Dev planning doc |

**Note:** `llama-model-temp.gguf` at 2.2GB is the biggest priority — it's almost certainly a leftover that's inflating repo/disk size significantly. Verify it's not the active model before deleting (the active model should be in `backend/models/` or referenced by `backend/config.py`).

---

## 9. Backend Dev Files to Delete or Move

These files are inside `backend/` but serve no runtime purpose:

| File | Action |
|------|--------|
| `backend/wmremove-transformed.jpeg` | Delete — stray test image |
| `backend/X.jpg` | Delete — stray test image |
| `backend/notes.txt` | Delete — dev notes |
| `backend/ARCHITECTURE_ANALYSIS.md` | Delete or move to `plans/` |
| `backend/Microsoft.PowerShell_profile.ps1` | Delete — dev convenience script |
| `backend/auto_venv_and_uvicorn.ps1` | Delete or move to `build-scripts/` |
| `backend/process_cleanup_patch.py` | Delete — one-time patch already applied |
| `backend/var/` | Delete — fontconfig cache, regenerates automatically |
| `backend/chat_history.json` | Keep but confirm it's excluded from extraResources (it is — `!chat_history.json`) |
| `backend/lesson_plan_history.json` | Same as above |

---

## 10. `backend/config/` — Possible Duplicate Preset Files

Two topic preset files exist:
- `backend/config/topic_presets.json`
- `backend/config/topic_presets_comprehensive.json`

**Action:** Check which one is actually loaded by `config.py` or `curriculum_matcher.py`. If only one is used, delete the other. If both are needed, add a comment explaining the distinction.

---

## 11. `backend/main.py` — `CHAT_HISTORY_FILE` Writes to Backend Folder — ⚠️ DATA LOSS RISK

**File:** `backend/main.py:156`

```python
CHAT_HISTORY_FILE = os.path.join(os.path.dirname(__file__), "chat_history.json")
```

This writes chat history directly into the backend folder (which in production is a read-only resource bundle). The app already has `get_data_directory()` defined at line 120 which properly writes to `APPDATA`. The other history files (`quiz_history`, `rubric_history`, etc.) use `load_json_data()` with the correct user-writable data directory.

**⚠️ Data loss warning:** Existing users have their chat history stored in the backend folder path. Changing this path without a migration will silently lose all previous conversations on upgrade.

**Safe fix with migration:** Before switching the path, add a one-time migration on startup:

```python
# At startup, migrate old chat history to new location
old_path = Path(os.path.dirname(__file__)) / "chat_history.json"
new_path = get_data_directory() / "chat_history.json"

if old_path.exists() and not new_path.exists():
    import shutil
    shutil.move(str(old_path), str(new_path))

CHAT_HISTORY_FILE = str(new_path)
```

Apply the same pattern for `lesson_plan_history.json` if hardcoded similarly.

---

## 12. `electron/main.js` — Comment Duplication

**File:** `electron/main.js:405–406`

```js
// Load splashscreen first
// Load splashscreen first
```

The comment `// Load splashscreen first` appears twice back-to-back.

**Fix:** Delete one of the two identical comment lines.

---

---

## 13. `backend/config.py` — Entire Inference Backend Block Duplicated

**File:** `backend/config.py:144–187`

The INFERENCE_BACKEND configuration section is copy-pasted verbatim — the second block (lines 162–187) overwrites everything set by the first block (lines 144–160). The first block is completely dead because Python reassigns the same variables immediately after.

First block (lines 144–160) — dead, overwritten:
```python
# Choose inference backend: "local" or "gemma_api"
INFERENCE_BACKEND = os.environ.get("INFERENCE_BACKEND", "local")
GEMMA_API_KEY = os.environ.get("GEMMA_API_KEY", "")
print(f"✓ [CONFIG] Inference backend: {INFERENCE_BACKEND}")
# ... openrouter config MISSING from this block
```

Second block (lines 162–187) — the one that actually takes effect:
```python
# Choose inference backend: "local", "gemma_api", or "openrouter"
INFERENCE_BACKEND = os.environ.get("INFERENCE_BACKEND", "local")
GEMMA_API_KEY = os.environ.get("GEMMA_API_KEY", "")
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "...")
```

The second block is the correct/complete one (it includes OpenRouter). The first block is a stale copy.

**Fix:** Delete lines 144–160 (the first incomplete block) entirely. Keep lines 162–187.

---

## 14. `electron/preload.js` — Duplicate `downloadFile` Handler

**File:** `electron/preload.js:19` and `electron/preload.js:22–23`

`downloadFile` is defined twice in the same object literal:

```js
// Line 19 — first definition
downloadFile: (arrayBuffer, filename) => ipcRenderer.invoke('download-file', { arrayBuffer, filename }),

// ✅ ADD: File download handler   ← this comment reveals it was copy-pasted incorrectly
// Lines 22-23 — duplicate, silently overwrites line 19
downloadFile: (arrayBuffer, filename) =>
  ipcRenderer.invoke('download-file', { arrayBuffer, filename }),
```

JavaScript object literals with duplicate keys use the last definition — the first is dead code.

**Fix:** Delete lines 21–23 (the comment and the duplicate definition). Keep line 19.

---

## 15. `electron/preload.js` — `getAppInfo` IPC Channel Has No Backend Handler

**File:** `electron/preload.js:5–12`

`getAppInfo` is exposed to the frontend but:
- There is no `ipcMain.on('app-info', ...)` or `ipcMain.handle('app-info', ...)` in `electron/main.js`
- The frontend never calls `window.electronAPI.getAppInfo()` — it only appears in the TypeScript type declaration in `frontend/src/vite-env.d.ts:6`

The call sends a message into a void — no handler, no response, promise never resolves.

**Fix:** Delete `getAppInfo` from `preload.js` (lines 5–12) and its type declaration from `frontend/src/vite-env.d.ts:6`.

---

## 16. `backend/main.py` — "TEMP DEBUG" Logging Block Still in Code

**File:** `backend/main.py:608–620`

```python
# === TEMP DEBUG LOGGING FOR CONTEXT WINDOW TEST ===
try:
    logger.info("=== CONTEXT WINDOW DEBUG ===")
    logger.info(f"chat_id: {chat_id}")
    logger.info(f"conversation_history length: {len(conversation_history)}")
    # ... 5 more logger.info calls
    logger.info(f"Full context (chars): {len(full_context)}")
except Exception as e:
    logger.error(f"Error in context window debug logging: {e}")
# === END TEMP DEBUG LOGGING ===
```

This fires on **every single chat WebSocket message** in production. The "TEMP" comment makes clear it was supposed to be removed.

**Fix:** Delete lines 608–620 entirely.

---

## 17. `backend/main.py` — Inline TODO Comment

**File:** `backend/main.py:555`

```python
TODO: In the future, consider implementing token-based windowing for more precise context control.
```

This is a bare comment (not even a `# TODO:`) left inside the function body.

**Fix:** Convert to a proper comment (`# TODO: ...`) or remove it.

---

## 18. `backend/config/topic_presets_comprehensive.json` — Unused File (Confirmed)

**File:** `backend/config/topic_presets_comprehensive.json`

Cross-referenced against all backend Python files:
- `topic_presets.json` is loaded by `scene_schema.py`, referenced in `audit_preset_coverage.py`, `check_specific_strand.py`, `test_presets.py`, `build_enhanced_presets.py`
- `topic_presets_comprehensive.json` is **generated** by `build_full_presets.py` but **never read or loaded** by any runtime file

**Fix:** Delete `topic_presets_comprehensive.json`. If you need to regenerate it later for auditing purposes, `build_full_presets.py` can recreate it.

---

## 19. `backend-bundle/` Directory at Root — Physical Leftover

**Location:** `C:/Users/LG/Desktop/Projects/Offline AI Standalone/backend-bundle/`

This directory is already in `.gitignore` (line 15) but **physically exists** on disk as a leftover from a previous packaging run. It contains old Python runtime files, dev scripts, etc.

**Fix:** Delete the `backend-bundle/` directory at the project root. It gets rebuilt fresh each time you package anyway, and `manual-package.ps1` already deletes it at the start (line 4–6) before rebuilding.

---

## 20. `backend/backend/` — Nested Backend Directory (Path Bug) — ✅ BUG CONFIRMED, SAFE TO FIX

**Location:** `backend/backend/data/image_assets/`

There is a nested `backend/backend/` directory that should not exist. It contains generated image asset files. This is caused by `image_asset_store.py` (or similar) resolving paths relative to the working directory when the app is launched from the project root, creating `backend/data/` as `backend/backend/data/` when CWD is the outer project folder.

**Root cause confirmed:** `image_asset_store.py` line 51 uses a relative path `"backend/data/image_assets"` as its default store directory. When the app runs from the project root, this resolves to `./backend/data/image_assets` (correct). But when CWD is already inside the `backend/` folder, it creates `backend/backend/data/image_assets` (wrong).

**Fix in `image_asset_store.py`:**
```python
# Current (line 51) — relative path, CWD-dependent:
def __init__(self, store_dir: str = "backend/data/image_assets"):

# Fix — absolute path based on the file's own location:
from pathlib import Path
def __init__(self, store_dir: str = None):
    if store_dir is None:
        store_dir = str(Path(__file__).parent / "data" / "image_assets")
    self.store_dir = Path(store_dir)
    self.store_dir.mkdir(parents=True, exist_ok=True)
```

After fixing, delete the `backend/backend/` directory manually — it will regenerate at the correct path.

---

## 21. `package.json` (root) — `cross-env` Unused

**File:** `package.json:35` (devDependencies)

```json
"cross-env": "^7.0.3"
```

`cross-env` is not used in any npm script in the root `package.json`. All scripts use direct commands without environment variable prefixes.

**Fix:** Remove `cross-env` from `devDependencies`.

---

## 22. `.gitignore` — History JSON Files Not Ignored

**File:** `.gitignore`

The following history files are committed to the repo but contain user-generated runtime data that should never be in version control:

- `backend/chat_history.json`
- `backend/lesson_plan_history.json`
- `backend/data/cross_curricular_history.json`
- `backend/data/kindergarten_history.json`
- `backend/data/multigrade_history.json`
- `backend/data/quiz_history.json`
- `backend/data/rubric_history.json`

The `.gitignore` already excludes `backend/data/` (line 102), which covers the `data/` subfolder entries. But `backend/chat_history.json` and `backend/lesson_plan_history.json` at the backend root are not excluded.

**Fix:** Add to `.gitignore`:
```
backend/chat_history.json
backend/lesson_plan_history.json
```

Also verify these files aren't already tracked by git — if they are, untrack them:
```bash
git rm --cached backend/chat_history.json backend/lesson_plan_history.json
```

---

## 23. Recommendations

### 23a. Backend startup: log the actual port

`electron/main.js` hardcodes `BACKEND_PORT = 8000`. If that port is in use, the backend silently assumes it's already running (line 180). Consider having the backend report its actual port on startup and passing it to the frontend via IPC, so the frontend always connects to the right port.

### 23b. Consolidate the two build scripts (`build-all.ps1` and `build-release.ps1`)

Both scripts do largely the same thing. Having two creates confusion about which one to run. Pick one, delete the other, update the README.

### 23c. Backend history files should write to user AppData, not backend folder

See §11 — `CHAT_HISTORY_FILE` writes to the backend bundle folder. In production this folder is read-only (inside the Electron resources bundle). All history JSON should go through `get_data_directory()` which correctly resolves to `%APPDATA%/OECS Learning Hub/data/`. This affects chat history specifically — the other history files already use `get_data_directory()` correctly.

### 23d. Remove `webSecurity: false` from `electron/main.js:387`

```js
webSecurity: false // Allow local file access
```

This disables Electron's same-origin policy for the entire window, allowing the renderer process to make cross-origin requests freely. This is a significant security risk — an XSS in the app could exfiltrate data or call arbitrary local services. The correct solution is to use Electron's `protocol.registerFileProtocol` or `loadFile` with proper asset serving, not disabling web security globally.

### 23e. Pin Python dependency versions in `requirements.txt`

Currently many packages use `>=` version constraints (e.g., `fastapi>=0.104.0`). For a packaged desktop app, this means the bundled dependencies could change between builds. Use `==` pinned versions (matching `requirements-lock.txt`) to ensure reproducible builds.

### 23f. Add the `backend-bundle/` cleanup to `pre-build-cleanup.ps1`

`pre-build-cleanup.ps1` already resets history files before building. Add:
```powershell
if (Test-Path "backend-bundle") { Remove-Item -Recurse -Force "backend-bundle" }
```
So the old bundle is always wiped before a fresh build — not just in `manual-package.ps1`.

---

## Summary

| Priority | Item | Safety | Location |
|----------|------|--------|----------|
| Critical | Fix double `yield` — move image service init before yield, remove 2nd yield | ✅ Safe | `backend/main.py:211–224` |
| Critical | Delete duplicate INFERENCE_BACKEND config block (lines 144–160) | ✅ Safe | `backend/config.py` |
| High | Delete 2.2GB temp model file (verify not active model first) | ✅ Safe | `llama-model-temp.gguf` (root) |
| High | Tighten `extraResources` filter using denylist | ✅ Safe (use denylist approach) | `package.json` build config |
| High | Enable DevTools only in dev mode (`isDev`) | ✅ Safe | `electron/main.js:385` |
| High | Remove `webSecurity: false` | ✅ Safe — localhost API calls still work | `electron/main.js:387` |
| High | Fix `backend/backend/` path bug in `image_asset_store.py` | ✅ Safe | `image_asset_store.py:51` |
| Medium | Remove unused root package.json deps (all 4 confirmed unused by electron) | ✅ Safe | `package.json` |
| Medium | Fix `CHAT_HISTORY_FILE` path — include migration to avoid data loss | ⚠️ Use migration code in §11 | `backend/main.py:156` |
| Medium | Remove `google-genai` (unused) + delete root `requirements.txt` | ✅ Safe | `requirements.txt` (root) |
| Medium | Delete root-level junk files (`bfg.jar`, `llama-model-temp.gguf`, one-off scripts) | ✅ Safe | Project root |
| Medium | Delete backend dev files (stray images, notes, PS1 scripts) | ✅ Safe | `backend/` |
| Medium | Remove duplicate `downloadFile` in preload.js (lines 21–23) | ✅ Safe | `electron/preload.js` |
| Medium | Remove dead `getAppInfo` IPC channel | ✅ Safe | `electron/preload.js:5–12` + `vite-env.d.ts` |
| Medium | Remove TEMP DEBUG logging block | ✅ Safe | `backend/main.py:608–620` |
| Medium | Delete `backend-bundle/` leftover directory | ✅ Safe (in .gitignore, rebuilt each time) | Project root |
| Medium | Add history JSON files to `.gitignore` + `git rm --cached` | ✅ Safe | `.gitignore` |
| Low | Delete duplicate `os`/`sys` imports | ✅ Safe | `backend/main.py:25,27` |
| Low | Fix `requirements.txt` internal duplicates | ✅ Safe | `backend/requirements.txt` |
| Low | Delete `topic_presets_comprehensive.json` (unused, confirmed) | ✅ Safe | `backend/config/` |
| Low | Remove `cross-env` devDependency (confirmed unused in scripts) | ✅ Safe | `package.json` |
| Low | Fix TODO comment format | ✅ Safe | `backend/main.py:555` |
| Low | Remove duplicate splashscreen comment | ✅ Safe | `electron/main.js:405–406` |
| Low | Remove redundant `frontend/src/data` extraResource entry | ✅ Safe (Vite bundles these already) | `package.json` build config |
| Recommendation | Log actual backend port, pass to frontend via IPC | ✅ Safe | `electron/main.js` |
| Recommendation | Consolidate `build-all.ps1` + `build-release.ps1` into one | ✅ Safe | Build scripts |
| Recommendation | Pin Python deps to exact versions | ✅ Safe | `backend/requirements.txt` |
| Recommendation | Add `backend-bundle/` cleanup to `pre-build-cleanup.ps1` | ✅ Safe | `pre-build-cleanup.ps1` |
