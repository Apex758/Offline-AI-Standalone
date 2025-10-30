# Fix for llama_cpp Module Error on First Run

## Problem
On the **first run** of the Electron app, the backend fails with:
```
ModuleNotFoundError: No module named 'llama_cpp'
```

However, on **restart**, everything works fine. This indicates a **Python import path initialization timing issue**.

## Root Cause

### The Issue
The `llama_cpp` module is a **compiled C extension** (.pyd file on Windows). Unlike pure Python modules, compiled extensions require their directories to be in `sys.path` **before** Python even attempts to import them.

### Current Problem
The old `start_backend.py` added paths at runtime:
```python
# This happens AFTER Python starts
sys.path.insert(0, script_dir)
sys.path.insert(0, os.path.join(script_dir, "python_libs"))
```

On **first run**, Windows hasn't cached the file locations yet, making the timing issue more apparent. On **restart**, file caching makes it work.

## Solution Applied

### 1. Created `sitecustomize.py`
Python automatically loads `sitecustomize.py` **before any other imports**. This ensures paths are set early enough:

```python
import sys
import os

# Add paths BEFORE any other imports
script_dir = os.path.dirname(os.path.abspath(__file__))
python_libs = os.path.join(script_dir, 'python_libs')

if python_libs not in sys.path:
    sys.path.insert(0, python_libs)
if script_dir not in sys.path:
    sys.path.insert(0, script_dir)
```

### 2. Created `.pth` Files
For embedded Python, added `backend_libs.pth` in the `python-embed` directory:

```python
import sys; import os
bundle_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(bundle_dir, 'python_libs'))
sys.path.insert(0, bundle_dir)
```

### 3. Updated `start_backend.py`
Improved the startup script to set paths more robustly:

```python
# CRITICAL: Import path setup MUST happen before any other imports
import sys
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
python_libs = os.path.join(script_dir, "python_libs")

# Add paths FIRST
if python_libs not in sys.path:
    sys.path.insert(0, python_libs)
if script_dir not in sys.path:
    sys.path.insert(0, script_dir)

# Set PYTHONPATH for subprocess compatibility
os.environ["PYTHONPATH"] = f"{python_libs}{os.pathsep}{script_dir}"
```

## Files Modified

### build-scripts/package-backend.py
- ✅ Added `create_python_path_file()` function
- ✅ Creates `sitecustomize.py` for path initialization
- ✅ Creates `.pth` files for embedded Python
- ✅ Updated `create_startup_script()` for better path handling
- ✅ Integrated into main packaging flow

## How to Apply the Fix

### Step 1: Rebuild the Backend Bundle
```bash
python build-scripts/package-backend.py
```

This will:
1. Clean the old `backend-bundle` directory
2. Copy backend files
3. Install Python dependencies
4. **Create the new path configuration files** (sitecustomize.py, .pth files)
5. Create updated startup script

### Step 2: Rebuild the Electron App
```bash
npm run electron:build:win
```

### Step 3: Test First Run
1. **Uninstall** the old version completely
2. **Delete** app data: `C:\Users\[USER]\AppData\Roaming\OECS Learning Hub`
3. **Install** the new version
4. **Run** the app - should work on first launch!

## Verification Checklist

After rebuild:

- [ ] Check `backend-bundle/sitecustomize.py` exists
- [ ] Check `backend-bundle/python-embed/backend_libs.pth` exists
- [ ] Verify updated `backend-bundle/start_backend.py` has path setup at top
- [ ] Test fresh install (delete AppData first)
- [ ] Verify no `ModuleNotFoundError` on first run
- [ ] Verify streaming works properly (from ELECTRON_STREAMING_FIX.md)

## Technical Details

### Why `.pth` Files?
Python reads `.pth` files in the site-packages directory **before loading any modules**. This guarantees path availability.

### Why `sitecustomize.py`?
Python automatically imports `sitecustomize.py` (if present) **very early** in the startup process, before most other imports.

### Execution Order
1. Python starts
2. Reads `.pth` files → paths added
3. Imports `sitecustomize.py` → paths confirmed/added
4. Imports `start_backend.py` → paths set via code
5. Now `llama_cpp` can be found!

## Alternative Solutions Considered

### ❌ Installing llama_cpp to system Python
- Would break portability
- Requires user to have Python installed

### ❌ Using PYTHONPATH environment variable only
- Not reliable on Windows
- May be overridden by system settings

### ❌ Modifying sys.path at import time
- Too late for compiled extensions
- Causes intermittent failures

### ✅ Multi-layer path initialization (CHOSEN)
- `sitecustomize.py` for early initialization
- `.pth` files for embedded Python
- Runtime checks in startup script
- Most robust solution

## Related Issues

This fix complements the streaming fix in [`ELECTRON_STREAMING_FIX.md`](ELECTRON_STREAMING_FIX.md). Both issues were Electron-specific timing problems:

1. **Streaming Issue**: WebSocket frame buffering in Electron's IPC layer
2. **Import Issue**: Python path initialization timing on first run

## Future Improvements

If issues persist:
1. Add detailed logging to `sitecustomize.py` to track path setup
2. Implement retry logic for module imports
3. Consider pre-importing `llama_cpp` in a separate initialization step
4. Add diagnostic script to verify bundled Python environment

## Success Criteria

✅ First-run installation works without errors
✅ No `ModuleNotFoundError` on fresh install
✅ Backend starts successfully on first launch
✅ Streaming works correctly in Electron
✅ All generators function properly