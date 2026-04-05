# Performance Optimization Report & Full-Stack Guide

What was done to speed up the OECS Learning Hub, and lessons learned for building fast full-stack apps.

---

## What Was Done

### Electron (Frontend Shell)

| Change | Before | After | Why It Matters |
|--------|--------|-------|----------------|
| Upgraded Electron 28 to 40 | Chromium 120, Node 18 | Chromium 144, Node 24 | 12 major versions of V8/Chromium engine optimizations, faster JS execution, better memory management |
| Upgraded electron-builder 24 to 26 | Older ASAR packaging | Modern build pipeline | Better compression, faster packaging |

### Backend (Python/FastAPI)

| Change | Before | After | Why It Matters |
|--------|--------|-------|----------------|
| Upgraded FastAPI 0.108 to 0.135 | Older Starlette 0.32 | Starlette 1.0 | Internal routing and middleware performance improvements |
| Upgraded uvicorn 0.38 to 0.43 | Default HTTP parser | httptools HTTP parser enabled | httptools is a C-based HTTP parser, significantly faster than the pure-Python fallback |
| GZip compression middleware | Uncompressed responses | Auto-compress responses >1KB | 70-80% smaller payloads over the network between backend and frontend |
| orjson as default JSON serializer | stdlib `json` module | `orjson` (Rust-based) | 3-5x faster JSON serialization/deserialization on every API response |
| Wrapped blocking HTTP calls in executor | `requests.get/post` blocking the event loop | Offloaded to thread pool | The async event loop was freezing for up to 60s during IOPaint calls. Now it stays responsive |
| Parallelized startup initialization | 4 DB inits running one after another | `asyncio.gather()` runs them concurrently | Startup time reduced by running MilestoneDB, StudentDB, AchievementDB, and ImageService init simultaneously |
| Dynamic LLM thread count | Hardcoded `threads: 4` | Auto-detect CPU cores, use `cores - 1` | A machine with 8 cores was only using half its potential. Now scales to the hardware |
| SQLite PRAGMA tuning | Default SQLite settings | WAL mode, NORMAL sync, 10MB cache, 30MB mmap, temp in RAM | WAL allows concurrent reads during writes. NORMAL sync is safe but skips redundant fsyncs. mmap lets the OS handle page caching |
| Added 6 missing SQLite indexes | Full table scans on foreign keys | Indexed `student_id` and `teacher_id` columns | Queries that filter/join on these columns go from O(n) to O(log n) |
| Enabled mmap for llama.cpp | Model loaded entirely into RAM | OS memory-maps the model file | Only the pages of the model actively being used get loaded. Faster cold start, lower peak memory |
| lru_cache on system prompts | Prompt strings rebuilt on every call | Cached after first lookup | Avoids redundant dictionary lookups and string construction across 15+ websocket endpoints |

### Frontend (React/Vite)

| Change | Before | After | Why It Matters |
|--------|--------|-------|----------------|
| Lazy-loaded trophyImages.ts (8.4MB) | Loaded at app startup | Loaded on-demand when achievements are viewed | 8.4MB of base64 images was being parsed and held in memory from the moment the app opened |
| Terser minification with console stripping | Default esbuild minify | Terser with `drop_console` and `drop_debugger` | Smaller production bundle, no console.log overhead in release builds |
| Removed 10 empty PNG files | Broken 0-byte images in public/ | Clean asset directory | Eliminates failed image loads and keeps the build clean |

---

## General Performance Playbook

If you're building a full-stack Electron + React + Python app (or similar), these are the things to get right from the start.

### 1. Don't Block the Event Loop

This is the single most common performance killer in async Python backends.

- **Never** call `requests.get()`, `time.sleep()`, or any synchronous I/O inside an `async def` endpoint
- Wrap blocking calls with `await asyncio.to_thread(blocking_function)` or `loop.run_in_executor(None, fn)`
- Use `aiohttp` instead of `requests` for HTTP calls in async code
- SQLite is inherently synchronous -- wrap DB calls in executors if you're in an async context

```python
# Bad - blocks the entire server
async def get_status():
    response = requests.get("http://localhost:9000/status", timeout=5)
    return response.json()

# Good - runs in thread pool
async def get_status():
    response = await asyncio.to_thread(
        requests.get, "http://localhost:9000/status", timeout=5
    )
    return response.json()
```

### 2. Use Fast Serialization

stdlib `json` is written in Python. Alternatives are 3-10x faster:

- **orjson** (Rust) -- fastest, handles datetime/numpy natively
- **msgspec** -- fast with built-in validation
- **ujson** -- C-based, drop-in replacement

In FastAPI, one line switches everything:
```python
from fastapi.responses import ORJSONResponse
app = FastAPI(default_response_class=ORJSONResponse)
```

### 3. Compress Responses

Add GZip/Brotli middleware. JSON compresses extremely well (70-80% reduction).

```python
from starlette.middleware.gzip import GZipMiddleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

### 4. Tune SQLite Properly

SQLite out of the box is configured for maximum safety, not speed. These PRAGMAs are safe for desktop apps:

```sql
PRAGMA journal_mode = WAL;       -- Allow concurrent reads during writes
PRAGMA synchronous = NORMAL;     -- Safe but faster than FULL
PRAGMA cache_size = 10000;       -- ~10MB in-memory page cache
PRAGMA mmap_size = 30000000;     -- Let the OS handle 30MB of page caching
PRAGMA temp_store = MEMORY;      -- Temp tables in RAM, not disk
```

And always index your foreign keys. SQLite doesn't do this automatically:
```sql
CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
```

### 5. Parallelize Startup

If your app initializes multiple independent services, don't do them sequentially:

```python
# Slow -- each waits for the previous
await init_database_a()
await init_database_b()
await init_service_c()

# Fast -- all run concurrently
await asyncio.gather(
    init_database_a(),
    init_database_b(),
    init_service_c(),
)
```

### 6. Lazy-Load Heavy Assets

Don't load things at startup that the user might never see:

- Large image data (base64 blobs, sprites)
- Rarely-viewed components/pages
- ML models (load on first use, not on boot)

```typescript
// Bad -- 8MB loaded immediately
import { getTrophyImage } from './trophyImages';

// Good -- loaded only when needed
const mod = await import('./trophyImages');
```

React supports this natively with `React.lazy()` for component-level splitting.

### 7. Use the Right HTTP Parser

uvicorn supports two HTTP parsers:
- `h11` (default) -- pure Python, slow
- `httptools` -- C-based, significantly faster

```python
uvicorn.run(app, host="0.0.0.0", port=8000, http="httptools")
```

On Linux/macOS, also use `uvloop` for the event loop (not available on Windows):
```python
uvicorn.run(app, host="0.0.0.0", port=8000, http="httptools", loop="uvloop")
```

### 8. Scale Threads to Hardware

Don't hardcode thread counts. Detect the hardware:

```python
import os

def optimal_threads() -> int:
    try:
        import psutil
        cores = psutil.cpu_count(logical=False) or os.cpu_count() or 4
    except ImportError:
        cores = os.cpu_count() or 4
    return max(2, min(cores - 1, 16))
```

Leave 1 core free for the OS and event loop.

### 9. Cache Repeated Work

If a function returns the same result for the same inputs, cache it:

```python
from functools import lru_cache

@lru_cache(maxsize=64)
def get_system_prompt(task_type: str) -> str:
    return PROMPTS.get(task_type, PROMPTS["default"])
```

Good candidates: prompt templates, config lookups, parsed static files, computed constants.

### 10. Keep Electron Current

Electron bundles Chromium and Node.js. Each major version brings:
- V8 engine optimizations (faster JS execution)
- Reduced memory usage
- Better garbage collection
- Security patches

Upgrading is usually low-risk since it's an npm dependency. If it breaks, revert in 10 seconds:
```bash
git checkout package.json package-lock.json && npm install
```

### 11. Minify Production Builds

Use terser over esbuild for production -- it produces smaller output and can strip dead code:

```typescript
// vite.config.ts
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,    // Remove all console.log
      drop_debugger: true,   // Remove debugger statements
    },
  },
}
```

### 12. Memory-Map Large Files

If your app loads large model files or data files, use memory-mapping instead of reading into RAM:

```python
# llama-cpp-python
model = Llama(model_path=path, use_mmap=True)

# General Python
import mmap
with open("large_file.bin", "rb") as f:
    mm = mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ)
```

The OS handles paging -- only the parts you access get loaded.

---

## Quick Reference: The Checklist

Before shipping any full-stack app, run through this:

- [ ] No synchronous I/O in async endpoints
- [ ] Fast JSON serializer (orjson/msgspec)
- [ ] Response compression enabled
- [ ] SQLite PRAGMAs tuned (WAL, cache, mmap)
- [ ] Foreign key columns indexed
- [ ] Startup tasks parallelized
- [ ] Heavy assets lazy-loaded
- [ ] Production build minified with console stripping
- [ ] Thread/worker counts scale with hardware
- [ ] Repeated computations cached
- [ ] Framework and runtime versions current
- [ ] Large files memory-mapped where possible
