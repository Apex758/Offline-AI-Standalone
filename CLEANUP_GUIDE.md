# Project Cleanup Guide

> Generated on 2026-03-15. Review each item before deleting.

---

## Phase 1: SAFE TO DELETE (No Risk)

These files are backups, temp artifacts, stale docs, or one-off scripts with no active references.

### Huge Temp File (~2.3 GB)

| File | Size | Why Safe |
|------|------|----------|
| `llama-model-temp.gguf` | **2.3 GB** | Named "temp", not referenced by active code |

### Build Artifacts & Old Releases (~3.5 GB)

| Path | Size | Why Safe |
|------|------|----------|
| `dist-electron/` | ~1.6 GB | Old Electron build output — regenerate with `npm run electron:build:win` |
| `RELEASE/` | ~1.6 GB | Old release folder with outdated installer + models |
| `frontend/dist/` | ~309 MB | Frontend build output — regenerate with `npm run build` in frontend |

### BFG Tool & Report (~14 MB)

| Path | Size | Why Safe |
|------|------|----------|
| `bfg.jar` | 14 MB | BFG Repo-Cleaner JAR — dev tool, not part of the app |
| `.bfg-report/` | Minimal | Old BFG run report, historical artifact |

### Backup / Copy Files (~20 MB)

| Path | Size | Why Safe |
|------|------|----------|
| `charts - Copy.tsx` | 13 KB | Backup copy of a charts component, not imported anywhere |
| `GlassSidebar.jsx` | 26 KB | Standalone JSX backup in root, not in the component tree |
| `output - Copy/` | ~7 MB | Duplicate of curriculum output data |

### Stale Documentation & Guides (~170 KB)

None of these are referenced by the app. They are old implementation notes:

| Path | Size |
|------|------|
| `DIFFUSION_MODELS_GUIDE.md` | 35 KB |
| `DOCUMENTATION.md` | 51 KB |
| `FINAL_IMPLEMENTATION_GUIDE.md` | 14 KB |
| `GATED_UPDATE_SYSTEM.md` | 17 KB |
| `GRADER.md` | 4.7 KB |
| `HYBRID_IMAGE_APPROACH.md` | 11 KB |
| `IMAGE_GENERATION_GUIDE.md` | 9.7 KB |
| `IMPLEMENTATION_COMPLETE.md` | 7.5 KB |
| `SETUP.md` | 3.2 KB |
| `NOTES.MD` | 0.6 KB |

### Root-Level Python Scripts (One-Off Utilities, ~130 KB)

These are standalone data-processing scripts not imported by backend or frontend:

| Path | Size |
|------|------|
| `clean_curriculum.py` | 11.5 KB |
| `convert_curriculum_pages.py` | 4.7 KB |
| `extract_kindergarten_guidelines.py` | 19 KB |
| `extract_pdf_curriculum.py` | 20.5 KB |
| `generate_curriculum_tree.py` | 4.8 KB |
| `memory_copy.py` | 29.5 KB |
| `rebuild_curriculum_index.py` | 20 KB |
| `run.py` | 4.8 KB |
| `scan_kindergarten_imports.py` | 2.7 KB |
| `curriculum_strands_analysis.json` | 20 KB |

### Old Build/Setup Scripts (~25 KB)

Superseded by the npm scripts and electron-builder in `package.json`:

| Path | Size |
|------|------|
| `build-all.ps1` | 1.5 KB |
| `build-release.ps1` | 8.2 KB |
| `manual-package.ps1` | 7 KB |
| `pre-build-cleanup.ps1` | 925 B |
| `setup-models.ps1` | 6.7 KB |
| `setup-embedded-python.bat` | 276 B |
| `build-scripts/` (entire folder) | ~15 KB |

### Misc Junk

| Path | Size | Why Safe |
|------|------|----------|
| `main - Shortcut.lnk` | 1.4 KB | Windows shortcut, dev artifact |
| `.npmignore` | 34 B | Minimal file, not needed unless publishing to npm |
| `plans/` | 0 B | Empty directory |
| `screenshots/` | ~16 KB | Old screenshot(s), not referenced |

### Backend Test & Dev Files

| Path | Size | Why Safe |
|------|------|----------|
| `backend/test_flux.png` | 32 KB | Test output image |
| `backend/wmremove-transformed.jpeg` | 393 KB | Test image |
| `backend/X.jpg` | 352 KB | Test image |
| `backend/test_diffusion_model.py` | 2.3 KB | Test script |
| `backend/test_presets.py` | 639 B | Test script |
| `backend/audit_preset_coverage.py` | 2.4 KB | Dev utility |
| `backend/blip_executor.py` | 1.3 KB | Unused executor |
| `backend/check_specific_strand.py` | 1.3 KB | Debug tool |
| `backend/generate_comprehensive_presets.py` | 1.3 KB | One-time data gen |
| `backend/llama_executor.py` | 1.3 KB | Unused executor |
| `backend/run_flow.py` | 298 B | Test script |
| `backend/run_pipeline.py` | 1.6 KB | Test script |
| `backend/process_cleanup_patch.py` | 1.8 KB | Utility patch |
| `backend/build_enhanced_presets.py` | 32 KB | One-time data gen |
| `backend/build_full_presets.py` | 24 KB | One-time data gen |

### Verify Before Deleting

| Path | Size | Note |
|------|------|------|
| `Supabase info.md` | 593 B | **Contains API keys/credentials** — make sure you have these saved elsewhere before deleting |

---

## Phase 2: REGENERABLE (Low Risk, Saves Disk Space)

These can all be regenerated but take time to reinstall/rebuild:

| Path | Est. Size | How to Regenerate |
|------|-----------|-------------------|
| `node_modules/` | ~500 MB | `npm install` in root |
| `frontend/node_modules/` | ~500 MB | `npm install` in frontend/ |
| `__pycache__/` (all, recursively) | ~500 MB | Auto-created when Python runs |
| `*.pyc` files (all, recursively) | ~100 MB | Auto-created when Python runs |
| `backend-bundle/` | ~550 KB | Regenerate via build scripts |

---

## Phase 3: CONDITIONAL (Delete Only If Not Needed)

| Path | Est. Size | Condition |
|------|-----------|-----------|
| `python-embed/` (root) | ~700 MB | Delete if bundled in backend or using system Python |
| `backend/python-embed/` | ~700 MB | Delete if using system Python for development |
| `resources/` | Varies | Check if contents are duplicated in frontend/src/data |

---

## DO NOT DELETE

These are critical to the application:

| Path | Why |
|------|-----|
| `models/` | All ML models — app cannot run without these |
| `backend/` (core files) | Backend Python server |
| `frontend/` (source files) | Frontend React app |
| `electron/` | Electron shell |
| `build/` | Contains `OECS.ico` and `installer.nsh` used by electron-builder |
| `package.json` | Project config |
| `package-lock.json` | Dependency lock |
| `.gitignore` | Git config |
| `.gitattributes` | Git config |
| `requirements.txt` | Python dependencies |
| `.claude/` | Claude Code config |

---

## Quick Delete Commands

**Phase 1 only (safest):**

```powershell
# From project root — run in PowerShell

# Large files & build artifacts
Remove-Item -Recurse -Force "dist-electron", "RELEASE", "frontend/dist"
Remove-Item -Force "llama-model-temp.gguf", "bfg.jar"
Remove-Item -Recurse -Force ".bfg-report"

# Backups & copies
Remove-Item -Force "charts - Copy.tsx", "GlassSidebar.jsx"
Remove-Item -Recurse -Force "output - Copy"

# Stale docs
Remove-Item -Force DIFFUSION_MODELS_GUIDE.md, DOCUMENTATION.md, FINAL_IMPLEMENTATION_GUIDE.md, GATED_UPDATE_SYSTEM.md, GRADER.md, HYBRID_IMAGE_APPROACH.md, IMAGE_GENERATION_GUIDE.md, IMPLEMENTATION_COMPLETE.md, SETUP.md, NOTES.MD

# Root python scripts
Remove-Item -Force clean_curriculum.py, convert_curriculum_pages.py, extract_kindergarten_guidelines.py, extract_pdf_curriculum.py, generate_curriculum_tree.py, memory_copy.py, rebuild_curriculum_index.py, run.py, scan_kindergarten_imports.py, curriculum_strands_analysis.json

# Old build scripts
Remove-Item -Force build-all.ps1, build-release.ps1, manual-package.ps1, pre-build-cleanup.ps1, setup-models.ps1, setup-embedded-python.bat
Remove-Item -Recurse -Force build-scripts

# Misc junk
Remove-Item -Force "main - Shortcut.lnk", ".npmignore"
Remove-Item -Recurse -Force plans, screenshots

# Backend test/dev files
Remove-Item -Force backend/test_flux.png, backend/wmremove-transformed.jpeg, backend/X.jpg
Remove-Item -Force backend/test_diffusion_model.py, backend/test_presets.py, backend/audit_preset_coverage.py, backend/blip_executor.py, backend/check_specific_strand.py, backend/generate_comprehensive_presets.py, backend/llama_executor.py, backend/run_flow.py, backend/run_pipeline.py, backend/process_cleanup_patch.py, backend/build_enhanced_presets.py, backend/build_full_presets.py
```

**Phase 2 (regenerable caches):**

```powershell
Remove-Item -Recurse -Force node_modules, frontend/node_modules
Remove-Item -Recurse -Force backend-bundle

# Clean all __pycache__ and .pyc
Get-ChildItem -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force
Get-ChildItem -Recurse -Filter "*.pyc" | Remove-Item -Force
```

---

## Estimated Space Savings

| Phase | Estimated Savings |
|-------|-------------------|
| Phase 1 | **~7.5 GB** (mostly llama-model-temp.gguf, dist-electron, RELEASE) |
| Phase 2 | **~1.5 GB** (node_modules, pycache) |
| Phase 3 | **~1.4 GB** (python-embed) |
| **Total** | **~10.4 GB** |
