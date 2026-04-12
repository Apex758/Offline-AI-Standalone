content = r"""# PEARL — Systematic Testing Plan (Teacher Journey Order)
*2026-04-11 | Test every feature in the order a brand-new teacher encounters it*

---

## How to Use This Plan

- **Run stages in order** — every later stage depends on earlier ones being complete
- **The multi-class scenario (Stage 5)** is the spine: 3 grades x 3 subjects x 3 sections = 27 classes. All downstream stages use these classes.
- Mark each item `[x]` as you test it
- Log failures in the **Issues Log** table at the bottom
- Priority flags: `[CRITICAL]` = blocks other features | `[HIGH]` = core functionality | `[MEDIUM]` = important | `[LOW]` = nice-to-have
- For stages marked SHIPPED (especially Stage 29) the `[x]` items are verified-in-production records — do not uncheck them

---

## Teacher Journey Map

| Stage | Title | Depends On | Scope |
|-------|-------|-----------|-------|
| 0 | Vendor Pre-Deployment: License Issuing Infrastructure | — | Supabase + Vercel + Auth0 + OAK schema |
| 1 | Teacher Unboxing: Download, Install, First Launch | 0 | Installer, startup, UI shell, offline check |
| 2 | First-Run Setup Wizard (OAK vs Manual) | 1 | SetupWizard, OAK activation, profile step |
| 3 | Settings Tour: Profile, Models, Display, Sidebar, Voice, System | 2 | All Settings panels |
| 4 | School Year & Calendar Bootstrap | 3 | SchoolYearSetupModal, terms, holidays |
| 5 | Class Build-Out: G1/2/4 x Math/LA/Science x 3 sections | 4 | 27 classes created |
| 6 | Student Rostering (Manual + Bulk Import) | 5 | Students, contact info, IEP, bulk CSV/XLSX |
| 7 | Timetable Construction (incl. multi-block periods) | 5 | All 27 classes scheduled |
| 8 | ClassConfigPanel & Class Defaults Wiring | 7 | Config per class, auto-fill, focus-loss fix |
| 9 | Curriculum Browser, Standards & Milestones Initialization | 4 | Standards, skill tree, milestone setup |
| 10 | Active Class Context, Defaults Banner, Auto-Filled Sections | 8 | ActiveClassContext, ClassDefaultsBanner |
| 11 | Ask Coworker / Chat (AI Pipeline Smoke Test) | 3 | Chat, TTS/STT, memory, context budgeting |
| 12 | Brain Dump & Sticky Notes | 11 | Brain Dump, Sticky Notes full feature |
| 13 | Lesson Planning Suite | 10 | Standard / Early Childhood / Multi-Level / Cross-Curricular |
| 14 | Quiz Builder (Generation, Editing, QR, Scheduling) | 10 | Quiz gen, edit, QR, answer keys |
| 15 | Worksheet Builder (Generation, Grid, Templates, Packages) | 10 | Worksheet gen, grid editor, templates |
| 16 | Rubric Builder | 10 | Rubric gen, edit, export |
| 17 | Visual & Media Tools (Image Studio, Slide Deck, Storybook) | 11 | Image, Slides, Storybook |
| 18 | Photo Transfer (Phone PWA, Hotspot, HTTPS, Outbox) | 5 | Session, upload, SSE, outbox |
| 19 | Manual Grading (Quiz + Worksheet) | 14, 15 | Per-student score entry |
| 20 | Scan Auto-Grading Pipeline (single + bulk + stream) | 14, 15 | OCR pipeline, bulk grader |
| 21 | Attendance Tracking | 5 | Mark, view history, percentage |
| 22 | Reminders, Notifications, ICS Export/Import | 4 | Reminders, quiet hours, ICS |
| 23 | Generation Queue, Tab Pulse, Cancellation | 11 | Phase 27 content |
| 24 | Scheduled Background Tasks | 3 | Weekly ELO, Results Review |
| 25 | Analyse Panel Across Generators | 13-17 | Analyse mode, streaming edits, undo |
| 26 | My Resources & File Management | 13-17 | Resource browser, file explorer, org |
| 27 | Analytics, Educator Insights, Performance Metrics | 19, 20 | Insights, metrics, analytics dashboard |
| 28 | Achievements & Gamification | 13-20 | Unlock, showcase, collections |
| 29 | Unified Calendar System (Phase 25 shipped record) | 4, 7 | 12 sub-phases, 113 items, 96 shipped |
| 30 | Cross-Feature Integration Tests + Closed-Loop Smoke Test | All | CC.13 + full-day rehearsal |
| 31 | Tutorials, Support Reporting, System Health | Any | Tutorials, support tickets, health |
| 32 | Data Management: Export, Import, Privacy Memory Wipe | All | Export/import archive, memory wipe |
| 33 | Destructive: Factory Reset | 32 | Run LAST -- wipes everything |
| 34 | Regression Watch (RW.1-RW.4 + CC.1-CC.12 refactor checks) | All | Generator/calendar regression |
| 35 | Open Follow-ups & make user manual | All | Deferred items, user manual TODO |

---

## STAGE 0 — Vendor Pre-Deployment: License Issuing Infrastructure

*Goal: Confirm all server-side infrastructure is deployed and the OAK license pipeline is operational before the teacher receives anything.*

### 0.1 GitHub & Vercel Deploy

- [ ] Code is committed and pushed to GitHub on the correct branch `[CRITICAL]`
- [ ] Vercel detects the push and starts a deploy `[CRITICAL]`
- [ ] Vercel build is green (no TS errors, no missing env vars) `[CRITICAL]`
- [ ] Production deployment promoted (not just preview) `[HIGH]`
- [ ] Supabase Project A (`lkdwldwtdzouvahvrcbe`) reachable from sso-demo at runtime `[HIGH]`
- [ ] Required env vars set on Vercel: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, Auth0 vars `[HIGH]`
- [ ] Auth0 callback URL includes the deployed Vercel domain `[HIGH]`
- [ ] A test teacher membership exists in `authz.memberships` with `status='approved'`, `school_id`, `member_state_id` `[HIGH]`
- Findings: ___

### 0.2 sso-demo Deployment Prerequisite

The sso-demo previously assumed `authz.memberships.id` (UUID PK) which does not
exist in Project A. The generate/revoke routes now derive `teacher_id` from
`sha256(auth0_sub)` and no longer insert `membership_id`. These must be deployed
before the **Generate License** button will work.

- [ ] sso-demo branch with the `membership_id` removal + sha256 `teacher_id` is merged `[CRITICAL]`
- [ ] Vercel build for that commit is green and promoted to production `[CRITICAL]`
- [ ] (Optional local check) Run `npx tsc --noEmit` in `sso-demo/` — exit 0 `[MEDIUM]`
- [ ] Hitting `POST /api/oak/generate` no longer returns 500 with `membership.id is undefined` `[HIGH]`
- Findings: ___

### 0.3 Base Tables Created

- [ ] `SELECT table_name FROM information_schema.tables WHERE table_schema = 'authz' AND table_name IN ('oak_licenses','support_reports');` returns 2 rows `[CRITICAL]`
- [ ] In the Table Editor, `authz.oak_licenses` shows `auth0_sub TEXT REFERENCES authz.memberships(auth0_sub)` — NOT a UUID `membership_id` FK `[HIGH]`
- [ ] `idx_oak_licenses_oak_license`, `idx_oak_licenses_auth0_sub`, `idx_oak_licenses_status` indexes exist `[MEDIUM]`
- Findings: ___

### 0.4 RPCs Installed

- [ ] `SELECT proname FROM pg_proc WHERE pronamespace = 'authz'::regnamespace AND proname IN ('validate_oak','submit_support_report','check_support_updates');` returns 3 rows `[CRITICAL]`
- [ ] `SELECT pg_get_functiondef('authz.validate_oak(text,text)'::regprocedure);` shows a body that references `school_name` and `territory_name` (i.e. v2 is the one in effect) `[HIGH]`
- Findings: ___

### 0.5 Generate a Real OAK for the Smoke Test

- [ ] In the sso-demo dashboard (Vercel), click **Generate License** as a teacher whose membership has `status='approved'`, a `school_id`, and a `member_state_id` (e.g. Delon Pierre -> `school_001` / `LCA`) `[HIGH]`
- [ ] Row appears in `authz.oak_licenses` with correct `auth0_sub`, `school_id`, `territory_id`, `status='active'`, `device_id IS NULL` `[HIGH]`
- Findings: ___

### 0.6 validate_oak Happy Path

```sql
SELECT authz.validate_oak('OAK-REAL-KEY-HERE', 'smoke-test-device-001');
```

- [ ] Returns `valid: true` `[CRITICAL]`
- [ ] `teacher_name` matches the membership's `full_name` `[HIGH]`
- [ ] `school_id` is the raw code (e.g. `school_001`) `[MEDIUM]`
- [ ] `school_name` is the human-readable name from `authz.schools.name` (e.g. `Demo Primary School`) — NOT the raw ID `[HIGH]`
- [ ] `territory_id` is the raw code (e.g. `LCA`) `[MEDIUM]`
- [ ] `territory_name` is the resolved OECS name (e.g. `Saint Lucia`) `[HIGH]`
- [ ] `authz.oak_licenses.device_id` is now `'smoke-test-device-001'` and `last_validated_at` was just updated `[HIGH]`
- Findings: ___

### 0.7 validate_oak Device-Binding Enforcement

- [ ] Re-running with the SAME device_id returns `valid: true` and bumps `last_validated_at` `[HIGH]`
- [ ] Running with a DIFFERENT device_id returns `valid: false, error: "License bound to another device"` `[CRITICAL]`
- Findings: ___

### 0.8 validate_oak Error Paths

- [ ] `SELECT authz.validate_oak('OAK-DOES-NOT-EXIST', 'dev-x');` -> `valid: false, error: "License not found"` `[HIGH]`
- [ ] Manually `UPDATE authz.oak_licenses SET status='revoked' WHERE oak_license=...;` then validate -> `valid: false, error: "License is revoked"` `[HIGH]`
- [ ] Unknown territory code (e.g. `UPDATE ... SET territory_id='ZZZ'`) -> `territory_name` falls back to `'ZZZ'` (raw id), no crash `[MEDIUM]`
- [ ] Unknown `school_id` -> `school_name` falls back to the raw id, no crash `[MEDIUM]`
- Findings: ___

### 0.9 End-to-End Through the Electron App

- [ ] Paste the same OAK into Settings > License -> `LicenseSettingsBridge` writes `Demo Primary School` / `Saint Lucia` into `settings.profile` `[CRITICAL]`
- [ ] Settings > Profile shows the locked "Verified via OAK" badges with readable names (not `school_001` / `LCA`) `[HIGH]`
- [ ] Settings > License status card shows `School: Demo Primary School` and `Territory: Saint Lucia` `[MEDIUM]`
- Findings: ___

### 0.10 Cleanup After Smoke Test

- [ ] Reset `device_id` on the test license so it can be reused on a real device: `UPDATE authz.oak_licenses SET device_id=NULL WHERE oak_license='OAK-REAL-KEY-HERE';` `[MEDIUM]`
- Findings: ___

"""

with open('C:/Users/LG/Desktop/Projects/Offline AI Standalone/plans/TESTING_PLAN.md', 'w', encoding='utf-8') as f:
    f.write(content)
print('Stage 0 written OK, chars:', len(content))
