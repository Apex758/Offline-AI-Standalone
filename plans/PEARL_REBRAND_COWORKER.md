# PEARL → Configurable Coworker Name Rebrand Plan
*All user-facing and AI-persona references to "PEARL" replaced with a user-configurable name (default `"Coworker"`).*

---

## Goal

The user can set their AI assistant's name in **Settings → Profile** (e.g. "Coworker", "Ada", "Mr. Helper"). That name is then used everywhere in the UI and passed into backend system prompts so the model refers to itself by it.

Default name: `"Coworker"` (used if the user hasn't set one).

---

## Step 1 — Storage & Access Layer

### 1a. Extend `UserProfile` type
- [ ] `frontend/src/contexts/SettingsContext.tsx`
  - Add field to `UserProfile` interface:
    ```ts
    coworkerName: string; // user-set name for the AI assistant, default "Coworker"
    ```
  - Default value in initial profile state: `coworkerName: 'Coworker'`
  - Migration: if loaded profile has no `coworkerName`, set to `'Coworker'`

### 1b. Helper hook
- [ ] `frontend/src/hooks/useCoworkerName.ts` *(new file)*
  ```ts
  import { useSettings } from '../contexts/SettingsContext';
  export function useCoworkerName(): string {
    const { userProfile } = useSettings();
    return userProfile?.coworkerName?.trim() || 'Coworker';
  }
  ```
  - Use this hook in any component that renders the name.

### 1c. Non-component helper (for data files / libs)
- [ ] `frontend/src/lib/coworkerName.ts` *(new file)*
  ```ts
  // For non-React contexts (data files, nudges, analytics). Reads directly from the settings localStorage key.
  export function getCoworkerName(): string {
    try {
      const raw = localStorage.getItem('userProfile');
      if (!raw) return 'Coworker';
      const parsed = JSON.parse(raw);
      return (parsed?.coworkerName || '').trim() || 'Coworker';
    } catch { return 'Coworker'; }
  }
  ```
  *Confirm the exact localStorage key from `SettingsContext.tsx` before coding.*

---

## Step 2 — Settings UI (new input field)

- [ ] `frontend/src/components/Settings.tsx` (Profile tab)
  - Add a new text input: **"Coworker Name"**
    - Label: `"What should your AI assistant be called?"`
    - Placeholder: `"Coworker"`
    - Max length: 30
    - Trims whitespace on save
    - Empty value → falls back to `"Coworker"`
  - Wire to `userProfile.coworkerName` via `updateUserProfile({ coworkerName: value })`
  - Also in this file:
    - `"Customize PEARL"` → `"Customize your Coworker"` (section heading, uses dynamic name at render time via hook)
    - `"Tell PEARL about yourself"` → `` `Tell ${coworkerName} about yourself` ``
    - `pearl_sticky_notes` → `app_sticky_notes`
    - `pearl_sticky_note_groups` → `app_sticky_note_groups`

---

## Step 3 — i18n Strings (use interpolation, not hardcoded)

All PEARL references in locale files become `{{coworkerName}}` placeholders. Callers pass the resolved name via i18next interpolation.

- [ ] `frontend/src/locales/en.json`
  - `"askPearl"` label → `"Ask {{coworkerName}}"`
  - All descriptions/tips containing `"PEARL"` → `"{{coworkerName}}"`

- [ ] `frontend/src/locales/es.json`
  - `"Preguntar a PEARL"` → `"Preguntar a {{coworkerName}}"`
  - All descriptions → use `{{coworkerName}}`

- [ ] `frontend/src/locales/fr.json`
  - `"Demander a PEARL"` → `"Demander à {{coworkerName}}"`
  - All descriptions → use `{{coworkerName}}`

> At call sites: `t('askPearl', { coworkerName })` where `coworkerName` comes from `useCoworkerName()`.

---

## Step 4 — UI Components (dynamic name via hook)

Each component uses `useCoworkerName()` and interpolates into rendered text (or passes into `t()`).

- [ ] `frontend/src/components/Chat.tsx`
  - `"Ask PEARL"` → dynamic `Ask ${coworkerName}`
  - `"Chat with PEARL"` → dynamic `Chat with ${coworkerName}`
  - When sending chat requests to backend, include `coworker_name` in the request payload (see Step 7).

- [ ] `frontend/src/components/Dashboard.tsx`
  - `"Ask PEARL"` → dynamic

- [ ] `frontend/src/components/SupportReporting.tsx`
  - All FAQ text `"PEARL"` → dynamic

- [ ] `frontend/src/components/TrophyDetailCard.tsx`
  - `"chatting with PEARL"` → `` `chatting with ${coworkerName}` ``

- [ ] `frontend/src/components/TutorialOverlay.tsx`
  - `"Chat with PEARL"` → dynamic

- [ ] `frontend/src/components/Achievements.tsx`
  - `"conversations with PEARL"` → dynamic
  - `"Ask PEARL"` category label → dynamic

---

## Step 5 — Frontend Data & Logic

These are mostly static data files. Replace `"PEARL"` with a sentinel `{coworkerName}` placeholder string, and resolve it at render time in the component that consumes the data.

- [ ] `frontend/src/data/featureDiscoveryData.ts`
  - Feature name `"Ask PEARL"` → `"Ask {coworkerName}"`
  - Description text → `"{coworkerName}"`
  - **Consumer must substitute** `{coworkerName}` → `getCoworkerName()` before display.

- [ ] `frontend/src/data/searchIndex.ts`
  - Title `"Ask PEARL"` → `"Ask {coworkerName}"`
  - Keyword `'pearl'` → `'coworker'` (plus current user name if set — optional)

- [ ] `frontend/src/data/tutorialSteps.ts`
  - Tutorial name + step text → use `{coworkerName}` placeholder

- [ ] `frontend/src/lib/analyticsHelpers.ts`
  - `"Chat with PEARL"` → `"Chat with Coworker"` (analytics event name — **keep stable** for historical data; do NOT make dynamic, or analytics will fragment)

- [ ] `frontend/src/lib/nudgeRules.ts`
  - `"PEARL can help even more..."` → use `getCoworkerName()` at nudge build time

- [ ] `frontend/src/lib/workflowProgression.ts`
  - `"Ask PEARL"` → `"Ask {coworkerName}"` (resolve at display)

- [ ] `frontend/src/lib/featureModules.ts`
  - `"Ask PEARL"` → `"Ask {coworkerName}"` (resolve at display)

- [ ] `frontend/src/utils/spellCheck.ts`
  - Remove `'PEARL'` from allowed words. Instead, dynamically add `getCoworkerName()` to the allowed list at runtime.

- [ ] `frontend/src/components/CommandPalette.tsx`
  - `'pearl'` keyword → `'coworker'` (plus current `coworkerName.toLowerCase()` as an extra keyword)

- [ ] `frontend/src/config/trophyMap.ts`
  - Comment `// Chat Bubble — Ask PEARL` → `// Chat Bubble — Ask Coworker` (just a comment)

---

## Step 6 — localStorage Key Rename (independent of name feature)

- [ ] `frontend/src/contexts/StickyNoteContext.tsx`
  - `'pearl_sticky_notes'` → `'app_sticky_notes'`
  - `'pearl_sticky_note_groups'` → `'app_sticky_note_groups'`
  - Add one-time migration: on first load, if old keys exist, copy to new keys and delete old.

- [ ] `frontend/src/components/sticky-notes/StickyNoteGroup.tsx`
  - `'pearl_folder_close_pref'` → `'app_folder_close_pref'` (with same migration)

- [ ] `frontend/src/components/Settings.tsx` (import/export paths from Step 2)
  - Update to read/write the new keys.

---

## Step 7 — Backend (accept coworker name per request)

The backend needs to know what name to use so system prompts address the model correctly.

### 7a. Chat API contract
- [ ] Chat request payload gains optional field: `coworker_name: string` (default `"Coworker"` server-side if absent).
- [ ] Frontend `Chat.tsx` (and any other caller) passes `coworker_name: useCoworkerName()` in the request body.

### 7b. Prompt files
- [ ] `backend/tier1_prompts.py`
  - `"You are PEARL, an AI assistant for Caribbean primary school teachers..."`
  - → `` f"You are {coworker_name}, a helpful teaching assistant for Caribbean primary school teachers (K-6)..." ``
  - Function signature takes `coworker_name: str = "Coworker"`.

- [ ] `backend/tier2_prompts.py`
  - `"You are PEARL, an AI teaching assistant built for OECS Caribbean primary school teachers..."`
  - → `` f"You are {coworker_name}, a helpful teaching assistant built for OECS Caribbean primary school teachers..." ``
  - Function signature takes `coworker_name: str = "Coworker"`.

- [ ] `backend/smart_search_prompt.py`
  - `"embedded in PEARL, an offline AI teaching tool"` → `` f"embedded in {coworker_name}, an offline AI teaching tool inside the Class Coworker app" ``
  - `"Ask PEARL"` feature references → `"Ask {coworker_name}"` via f-string
  - Function signature takes `coworker_name: str = "Coworker"`.

- [ ] Whichever route file calls the above (likely the main chat/search handler) — read `coworker_name` from request and pass through.

### 7c. Achievement strings
- [ ] `backend/achievement_service.py`
  - These strings are persisted in the achievements DB/JSON. Keep them stable and generic (do **not** interpolate the user's custom name here — it would desync across users and historical records):
    - `"Hello PEARL"` → `"Hello Coworker"`
    - `"Have 10 conversations with PEARL"` → `"Have 10 conversations with your Coworker"`
    - `"Send 100 messages to PEARL"` → `"Send 100 messages to your Coworker"`
    - `"Send 500 messages to PEARL"` → `"Send 500 messages to your Coworker"`
    - `"PEARL Companion"` → `"Coworker Companion"`
    - `"Earn all Ask PEARL achievements"` → `"Earn all Ask Coworker achievements"`
  - **Frontend rendering** of these achievement titles/descriptions can *optionally* run a string replace `"Coworker"` → `userProfile.coworkerName` at display time if you want the personalization to carry into Achievements UI. Decide before implementing — simpler to leave static.

---

## Step 8 — Scripts & Misc

- [ ] `scripts/generate_demo_data.py`
  - Docstring `"""Generate realistic PEARL AI chat conversations."""` → `"""Generate realistic Coworker AI chat conversations."""`

---

## Replacement Rules Summary

| Pattern | Replacement |
|---|---|
| `"Ask PEARL"` (UI text) | `Ask ${coworkerName}` via hook/placeholder |
| `"Chat with PEARL"` | `Chat with ${coworkerName}` |
| `"PEARL"` (standalone AI name in UI) | `${coworkerName}` |
| `"You are PEARL, ..."` (backend prompts) | `` f"You are {coworker_name}, ..." `` (param-driven) |
| `pearl_sticky_notes` | `app_sticky_notes` (with migration) |
| `pearl_sticky_note_groups` | `app_sticky_note_groups` (with migration) |
| `pearl_folder_close_pref` | `app_folder_close_pref` (with migration) |
| Analytics event `"Chat with PEARL"` | `"Chat with Coworker"` **(static — do NOT dynamic)** |
| Achievement titles referencing PEARL | Static `"Coworker"` (optional frontend re-map) |

> **Do NOT change:** `PEARL_AI.gguf` (internal model filename), curriculum text mentions of "Pearl" as an author name or "pearls" as the gemstone.

---

## Files to SKIP (not the AI name)

| File | Why |
|---|---|
| `backend/config.py` — `PEARL_AI.gguf` | Internal model filename only |
| `curriculum_text_dumps/*` | "Pearl" = author name or gemstone |
| `frontend/src/curriculum/grade1-subjects/...` | Same — author name "Pearlina Carrington" |
| `frontend/src/data/curriculum/grade4-social-studies-curriculum.json` | Curriculum content, not AI name |
| `plans/*.md` | Documentation only, no runtime impact |
| `PROMPT_REVIEW.py` | Not a runtime file |

---

## Implementation Order (recommended)

1. **Step 1** — storage/hook foundation (nothing else works without it)
2. **Step 2** — Settings UI input (so you can test end-to-end)
3. **Step 7a + 7b** — backend payload + prompt plumbing
4. **Step 4** — UI component updates (Chat first, then Dashboard, etc.)
5. **Step 3** — locale files
6. **Step 5** — data/lib files
7. **Step 6** — localStorage migration (can be done any time; isolated)
8. **Step 7c, 8** — achievements + scripts cleanup

---

## Open Questions (confirm before coding)

1. Should achievement titles personalize per user at display time (Step 7c), or stay static `"Coworker"`?
2. Max name length — 30 chars OK, or tighter (e.g. 20)?
3. Should the name be sanitized (strip emoji/special chars) or allow freeform?
4. Locale files: i18next interpolation uses `{{var}}` by default — confirm this project uses default i18next syntax.

---

*Switch to Code mode to implement. Start with Step 1 and verify end-to-end with a single component (Chat.tsx) before spreading to the rest.*
