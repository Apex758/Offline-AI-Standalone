content = r"""
---

## STAGE 1 — Teacher Unboxing: Download, Install, First Launch

*Goal: Confirm the teacher can get the app onto their machine and it reaches the main UI without errors.*

### 1.1 Installation

- [ ] Installer (`.exe` / `.msi` / `.dmg`) downloads from the release URL `[CRITICAL]`
- [ ] Installer runs without admin-permission errors `[HIGH]`
- [ ] App icon appears in Start menu / Applications `[MEDIUM]`
- [ ] Bundled backend Python venv launches automatically on first run `[CRITICAL]`
- [ ] AppData folder created at `%APPDATA%/OECS Class Coworker/data` (Win) on first run `[HIGH]`
- [ ] Models directory exists or app prompts user to download a model `[HIGH]`
- Findings: ___

### 1.2 App Launch

- [ ] App opens without crash or console error `[CRITICAL]`
- [ ] HeartbeatLoader / loading spinner appears during startup `[MEDIUM]`
- [ ] App reaches the main UI within reasonable time (< 30s) `[HIGH]`
- Findings: ___

### 1.3 Engine Health Check

- [ ] `EngineStatusContext` shows `online` status indicator `[CRITICAL]`
- [ ] Disconnect backend -> status switches to `offline`, toast appears `[HIGH]`
- [ ] Reconnect -> status recovers, "Engine is back online" toast `[HIGH]`
- Findings: ___

### 1.4 Login Screen (if enabled)

- [ ] `Login.tsx` renders correctly (even if bypassed) `[MEDIUM]`
- [ ] Auto-login as "admin" works as expected `[HIGH]`
- Findings: ___

### 1.5 Offline & Multi-Window

- [ ] App works fully offline (kill internet -> all local features still work) `[CRITICAL]`
- [ ] Multi-window: open a second app window does not crash backend `[MEDIUM]`
- [ ] Close All Dialog (`CloseAllDialog.tsx`) appears when closing multiple tabs at once `[MEDIUM]`
- Findings: ___

### 1.6 UI Shell — Tab Navigation

- [ ] Click each of the 23 sidebar items — correct component loads `[CRITICAL]`
- [ ] Open multiple tabs of the same type (e.g., two Lesson Planners) `[HIGH]`
- [ ] Close a tab via X button `[HIGH]`
- [ ] Draft Save Dialog appears when closing a tab with unsaved work `[HIGH]`
- [ ] Tab titles display correctly `[MEDIUM]`
- Findings: ___

### 1.7 UI Shell — Split-View Mode

- [ ] Right-click a tab -> split view option appears `[HIGH]`
- [ ] Split activates: two panes visible side by side `[HIGH]`
- [ ] Switch active pane (left <-> right) `[HIGH]`
- [ ] Close split view -> returns to single pane `[HIGH]`
- [ ] Split state persists in localStorage `[MEDIUM]`
- Findings: ___

### 1.8 UI Shell — Command Palette

- [ ] Keyboard shortcut opens Command Palette overlay `[HIGH]`
- [ ] Search for a tab name — result appears `[HIGH]`
- [ ] Navigate to result — correct tab opens `[HIGH]`
- [ ] Mic button -> STT input works `[MEDIUM]`
- [ ] Close palette without action works `[HIGH]`
- Findings: ___

### 1.9 UI Shell — Tab Busy State

- [ ] Start a generation — tab shows busy indicator `[HIGH]`
- [ ] Attempt to close busy tab — blocked or warned `[HIGH]`
- [ ] Active Generation Dialog shows current jobs across tabs `[HIGH]`
- Findings: ___

---

## STAGE 2 — First-Run Setup Wizard (OAK vs Manual)

*Goal: Walk through the full setup wizard on a clean install, testing both the OAK path and the manual path.*

### 2.1 Welcome Step — Choice View

- [ ] SetupWizard appears on fresh install / cleared localStorage `[HIGH]`
- [ ] Welcome shows two buttons: **Activate with OAK** and **Continue without OAK (manual setup)** `[HIGH]`
- [ ] Clicking **Activate with OAK** reveals inline OAK input + Activate button `[HIGH]`
- [ ] Clicking **Continue without OAK** advances directly to the profile step `[HIGH]`
- Findings: ___

### 2.2 OAK Path

- [ ] Entering an invalid OAK shows an inline error and stays on the welcome step `[HIGH]`
- [ ] Entering a valid OAK activates the license, closes the OAK view, advances to profile `[CRITICAL]`
- [ ] Profile step shows a green **"Verified via OAK"** banner with the retrieved school and territory `[HIGH]`
- [ ] Profile step only asks for **name** and **grades/subjects** (no school input) `[HIGH]`
- [ ] "Back" on OAK input view returns to the choice view without deactivating an already-activated license `[MEDIUM]`
- [ ] After Finish, localStorage `app-settings-main.profile.schoolSource === 'oak'` and `profile.school` + `profile.territory` are populated `[HIGH]`
- Findings: ___

### 2.3 Manual Path

- [ ] Profile step only asks for **name** and **grades/subjects** (no school input, no OAK banner) `[HIGH]`
- [ ] After Finish, `profile.schoolSource === null` and `profile.school`/`profile.territory` are empty `[HIGH]`
- [ ] Dashboard welcome sticky-note checklist shows "Set up your profile (name)" — without the "& school" suffix `[MEDIUM]`
- Findings: ___

### 2.4 Feature Picker + Completion

- [ ] Step 3 — Feature Picker: toggle features on/off `[HIGH]`
- [ ] Step 4 — Completion: confirm and launch `[HIGH]`
- [ ] After completion, wizard does not reappear on restart `[HIGH]`
- Findings: ___

### 2.5 Welcome Modal

- [ ] WelcomeModal appears on first visit `[MEDIUM]`
- [ ] Dismiss works, does not reappear `[MEDIUM]`
- Findings: ___

### 2.6 OAK License Gate

- [ ] `LicenseGate` wraps the app and triggers `checkForUpdates` when license is valid `[HIGH]`
- [ ] App does not block access if license missing (gate is passive, not blocking) `[HIGH]`
- [ ] Entering valid OAK key in Settings unlocks licensed state `[CRITICAL]`
- [ ] Invalid/expired key displays correct error message `[HIGH]`
- [ ] License state persists across restart `[HIGH]`
- [ ] `validate_oak` RPC returns `school_name` and `territory_name` (new in v2 migration) `[HIGH]`
- [ ] `LicenseSettingsBridge` writes `profile.school`, `profile.territory`, `profile.schoolSource = 'oak'` into settings after activation `[CRITICAL]`
- [ ] Deactivating OAK clears `profile.school` / `profile.territory` and resets `schoolSource` to `null` `[HIGH]`
- [ ] Settings > Profile shows **locked** School + Country/Territory fields with a "Verified via OAK" badge when `schoolSource === 'oak'` `[HIGH]`
- [ ] Settings > Profile hides the School field entirely for manual users (no editable input) `[HIGH]`
- [ ] Manual-setup user -> Settings > License -> activate OAK -> Settings > Profile now shows locked School + Territory without a reload `[HIGH]`
- [ ] Settings > License status card shows `schoolName` / `territoryName` (human-readable) instead of raw IDs `[MEDIUM]`
- Findings: ___

"""

with open('C:/Users/LG/Desktop/Projects/Offline AI Standalone/plans/TESTING_PLAN.md', 'a', encoding='utf-8') as f:
    f.write(content)
print('Stages 1-2 appended OK, chars:', len(content))
