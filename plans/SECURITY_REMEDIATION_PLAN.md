# Comprehensive Security Remediation Plan

## Context
An adversarial review of the OECS Teacher Assistant uncovered 17 critical/high and 24+ medium severity issues across the Electron + React + FastAPI stack. The app is offline-first with a LAN-accessible Photo Transfer feature, so fixes must preserve that functionality while locking down everything else. Backend `main.py` is 9,516 lines; splitting it is out of scope.

---

## PHASE 1: CRITICAL (Do First)
**~8 files touched, 1 new file, 1 npm install**

### C1: Rotate Exposed API Keys
- **`backend/.env`** lines 6, 10 -- keys are plaintext in the working tree
- Rotate OpenRouter key and GitHub PAT on their respective platforms immediately
- Run `git log --all -p -- backend/.env` to check git history; if found, purge with `git filter-repo`
- Create `backend/.env.example` with placeholder values

### C2: Fix XSS via dangerouslySetInnerHTML
- `npm install dompurify @types/dompurify` in `frontend/`
- Create **new file** `frontend/src/utils/sanitize.ts` -- exports `sanitizeHtml()` with an allowlist of safe HTML tags (b, i, em, strong, a, p, br, ul, ol, li, h1-h4, span, div, blockquote, code, pre)
- **`frontend/src/components/BrainDump.tsx:2392`** -- wrap `entry.text` in `sanitizeHtml()`
- **`frontend/src/components/StoryBookCreator.tsx:1119`** -- wrap SVG output in `sanitizeHtml()` (defense-in-depth; it already uses `escapeXml`)

### C3: Secure File Upload (Photo Transfer)
- **`backend/routes/photo_transfer.py`** lines 198-229:
  1. Add extension allowlist: `{'.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif', '.bmp'}`
  2. Add 50MB file size limit (read max+1 bytes, reject if exceeded)
  3. Add path containment check: `file_path.resolve().parent == session_dir.resolve()`
  4. Add magic-byte validation (JPEG `\xff\xd8\xff`, PNG `\x89PNG`, GIF `GIF8`, etc.)

### C4: Restrict LAN Access to Photo Transfer Only
- **`backend/main.py`** (after line 326) -- add `LocalOnlyMiddleware`:
  - Allows ALL requests from `127.0.0.1` / `::1`
  - Allows LAN requests ONLY to paths starting with `/api/photo-transfer/`
  - Returns 403 for LAN requests to any other endpoint
- This is the highest-risk change -- must test phone camera upload end-to-end

### C5: Fix CORS Configuration
- **`backend/main.py`** lines 320-326:
  - Set `allow_credentials=False` (wildcard + credentials is a browser security violation)
  - Keep `allow_origins=["*"]` since `LocalOnlyMiddleware` (C4) handles access control
  - Narrow `allow_methods` to `["GET", "POST", "PUT", "DELETE", "OPTIONS"]`
- Depends on C4 being in place

### Phase 1 Verification
- [ ] Old API keys fail authentication
- [ ] XSS payload `<img src=x onerror=alert(1)>` stripped in BrainDump
- [ ] `.py` file renamed to `.jpg` rejected on upload
- [ ] 60MB upload returns 413
- [ ] `curl http://<LAN-IP>:8000/api/health` returns 403
- [ ] `curl http://<LAN-IP>:8000/api/photo-transfer/sessions` returns 200
- [ ] Electron app has no CORS errors

---

## PHASE 2: HIGH (After Phase 1)
**~15 files touched, 2 new files**

### H1: WebSocket Authentication
- Create **new file** `backend/auth.py` -- generates a per-startup session token (`secrets.token_urlsafe(32)`)
- Add startup endpoint `GET /api/auth/token` (localhost-only via C4 middleware) that returns the token
- **`backend/main.py`** -- all 13 WebSocket handlers (lines 895, 1465, 1678, 1831, 1986, 2115, 2248, 2379, 2546, 2666, 3035, 3210, 3752): after `websocket.accept()`, read first message as auth token, close with 4001 if invalid
- **`frontend/src/contexts/WebSocketContext.tsx`** -- after `ws.onopen`, send auth token as first message
- **`electron/main.js`** -- fetch token from backend after startup, pass to renderer via IPC/env

### H2: Safe JSON.parse Wrapper
- Create **new file** `frontend/src/utils/safeParse.ts` -- exports `safeJsonParse<T>(raw, fallback): T`
- Priority replacements (WebSocket/network data -- crash risk):
  - `frontend/src/contexts/WebSocketContext.tsx:108`
  - `frontend/src/components/AIAssistantPanel.tsx:87`
  - `frontend/src/components/PhotoReceiver.tsx:186,193,201,206,212`
- Second pass: remaining ~75 instances across 49 files

### H3: React Error Boundary
- Create **new file** `frontend/src/components/ErrorBoundary.tsx` -- class component with Try Again + Reload buttons
- **`frontend/src/main.tsx`** -- wrap `<TutorialProvider><App /></TutorialProvider>` in `<ErrorBoundary>`
- Optionally add second boundary inside `App()` around `<AppContent />`

### H4: WebSocket Cleanup Audit
- Grep `new WebSocket|new EventSource` in frontend
- For each hit, verify `useEffect` return calls `.close()`
- Fix any missing cleanup

### H5: Atomic File Writes
- **`backend/routes/photo_transfer.py:229`** -- replace `write_bytes()` with tempfile + `os.replace()` pattern

### Phase 2 Verification
- [ ] WebSocket from LAN without token gets code 4001
- [ ] Malformed JSON via WebSocket logs warning, doesn't crash app
- [ ] Throwing error in a component shows ErrorBoundary fallback UI
- [ ] No orphan WebSocket connections after unmount (check DevTools)
- [ ] Killed mid-upload leaves no partial files

---

## PHASE 3: MEDIUM (Subsequent Sprint)
**~12-15 files touched**

### M1: Replace Broad Exception Handling
- `backend/student_service.py:64` -- keep as-is (legitimate migration pattern), add explanatory comment
- `backend/achievement_service.py` (8+ instances) -- narrow to specific exception types, add `logger.debug()`
- `backend/config.py` (5+ instances) -- same treatment

### M2: Session Locking
- `backend/routes/photo_transfer.py:110` -- add `asyncio.Lock()` around session mutations

### M3: Harden Dynamic SQL
- `backend/student_service.py:835-840` -- add `ALLOWED_DOC_TYPES` dict whitelist, raise `ValueError` for invalid `doc_type`

### M4: Add Pydantic Field Validation
- `backend/routes/photo_transfer.py:203-204` -- add `max_length`, `pattern` constraints to Form fields

### M5: Full UUID Session IDs
- `backend/routes/photo_transfer.py:154` -- change `uuid4()[:8]` to full `uuid4()`

### M6: Rate Limiting
- Install `slowapi`, add limiter to `backend/main.py`
- Apply `30/min` to AI generation endpoints, `60/min` to photo upload

### M7: Sanitize LLM Output
- Pass all AI-generated content through `sanitizeHtml()` (from C2) before rendering in frontend

### M8: Strip Paths from Health Endpoint
- `backend/main.py:6930-6937` -- return booleans only, not file paths

### M9: Remove Duplicate Config
- `backend/config.py:441-445` -- delete first `INFERENCE_BACKEND` block, keep second (lines 451-459)

### M10: Remove console.log Statements
- Add ESLint rule `"no-console": ["warn", { allow: ["warn", "error"] }]`
- Clean up 134 instances across 20 frontend files

### M11: TypeScript any Reduction (Long-term)
- Start with context/provider files where type safety matters most
- Add `noImplicitAny: true` to tsconfig incrementally

---

## Dependency Graph
```
C1 (keys)         ─── do FIRST, independent
C2 (DOMPurify)    ─── independent
C3 (upload)       ─── independent
C4 (middleware)    ─── before C5 and H1
C5 (CORS)         ─── after C4
H1 (WS auth)      ─── after C4
H2-H5             ─── independent
M1-M11            ─── independent, after Phase 1+2 stable
```

## Risk Notes
- **C4** is highest-risk -- must test phone upload end-to-end on real LAN
- **H1** touches 13 WS endpoints + electron + frontend context -- deploy atomically
- **C1** is urgent -- keys are live and exposed NOW