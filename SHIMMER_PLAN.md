# Shimmer Animation Plan for Skeleton Loaders

## Overview

Replace the current `animate-pulse` (opacity fade) on **text-like** skeleton bars with a **shimmer sweep animation** — a moving gradient that slides left-to-right. The gradient colors are derived from each skeleton's `accentColor` prop so every tab gets its own themed shimmer.

**Reference component:** `frontend/src/components/ShimmerSkeleton.tsx`

**Pattern:**
```tsx
background: "linear-gradient(90deg, dark 0%, medium 15%, bright 30%, brightest 40%, bright 50%, medium 65%, dark 80%, dark 100%)"
backgroundSize: "200% 100%"
animation: "shimmer 1.4s linear infinite"
```

---

## Scope

### In Scope
- `GeneratorSkeleton.tsx` — used by LessonPlanner, QuizGenerator, RubricGenerator, WorksheetGenerator, KindergartenPlanner, MultigradePlanner, CrossCurricularPlanner
- `DashboardSkeleton.tsx` — used by Achievements, EducatorInsights, PerformanceMetrics
- `TreeBrowserSkeleton.tsx` — used by CurriculumTracker, CurriculumPlan, CurriculumViewer
- `ResourceGridSkeleton.tsx` — used by ResourceManager, ClassManagement, SchoolYearCalendar
- `SettingsPanelSkeleton.tsx` — used by Settings, SupportReporting (use gray `#6b7280` as default color)

### Also In Scope (Inline Skeletons in Components)
- `PresentationBuilder.tsx` — initialLoad skeleton with text labels (tab: `presentation-builder` / `#f97316`)
- `Chat.tsx` — initialLoad skeleton, title + subtitle only (tab: `chat` / `#3b82f6`)
- `ImageStudio.tsx` — initialLoad skeleton with section/field labels (tab: `image-studio` / `#ec4899`)
- `BrainDump.tsx` — TWO skeleton states: initialLoad + showSkeleton AI-generating (tab: `brain-dump` / `#a855f7`)
- `AnalyticsDashboard.tsx` — full dashboard skeleton across 6 widget sections (uses `var(--dash-border)`)
- `TeacherMetricsPanel.tsx` — small card skeleton with 2 text bars (uses `bg-theme-bg-tertiary`)
- `ComprehensionTemplate.tsx` — 7 passage text lines + question bars (inline styles, `palette.accentBorder` / `#e2e8f0`)
- `MultipleChoiceTemplate.tsx` — question text + 4 answer bars per question (inline `#e2e8f0`)
- `MatchingTemplate.tsx` — 2 text bars per matching row (inline `palette.accentBorder`)
- `ListBasedTemplate.tsx` — 1 text bar per question (inline `#e2e8f0`)
- `MathTemplate.tsx` — 1 text bar per question (inline `#e2e8f0`)

### Out of Scope
- `KidsStorybookSkeletonDay.tsx` / `KidsStorybookSkeletonNight.tsx` — already have custom shimmer `Bone` component
- `curriculum/**/loading.tsx` (37+ files) — basic route-level skeletons, no accentColor
- `InsightsGraphRow.tsx` — solid block chart placeholder, not text
- `InsightsCoachPanel.tsx` — "Thinking..." text pulse, not structural
- `AIAssistantPanel.tsx` — cursor blink only
- `EducatorCoachDrawer.tsx` — "Thinking..." text pulse only
- `CommandPalette.tsx` — status dot pulse only
- `CloseAllDialog.tsx` — status dot pulse only
- `TutorialOverlay.tsx` — icon pulse only
- `fallback-image.tsx` — full-area image fallback, not text

---

## Step 1: Create `ShimmerBar` Component

**File:** `frontend/src/components/ui/ShimmerBar.tsx` (NEW)

A drop-in replacement for `<Skeleton>` on text-representing elements.

```tsx
import React from "react";

interface ShimmerBarProps {
  accentColor?: string;
  variant?: "default" | "light";
  className?: string;
  style?: React.CSSProperties;
  animationDelay?: string;
}

export const ShimmerBar: React.FC<ShimmerBarProps> = ({
  accentColor = "#6b7280",
  variant = "default",
  className = "",
  style = {},
  animationDelay,
}) => {
  const gradient =
    variant === "light"
      ? `linear-gradient(90deg,
          rgba(255,255,255,0.08) 0%,
          rgba(255,255,255,0.15) 15%,
          rgba(255,255,255,0.30) 30%,
          rgba(255,255,255,0.40) 40%,
          rgba(255,255,255,0.30) 50%,
          rgba(255,255,255,0.15) 65%,
          rgba(255,255,255,0.08) 80%,
          rgba(255,255,255,0.08) 100%)`
      : `linear-gradient(90deg,
          ${accentColor}15 0%,
          ${accentColor}30 15%,
          ${accentColor}70 30%,
          ${accentColor}99 40%,
          ${accentColor}70 50%,
          ${accentColor}30 65%,
          ${accentColor}15 80%,
          ${accentColor}15 100%)`;

  return (
    <div
      className={`rounded-md ${className}`}
      style={{
        background: gradient,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s linear infinite",
        animationDelay: animationDelay || "0s",
        ...style,
      }}
    />
  );
};
```

### Props
- `accentColor` — hex color from tab config (e.g. `#f59e0b`)
- `variant="light"` — white-tinted shimmer for text sitting on colored banners
- `className` — Tailwind sizing classes (e.g. `h-4 w-3/4`)
- `style` — additional inline styles
- `animationDelay` — stagger shimmer across rows

---

## Step 2: Add Keyframes to Global CSS

**File:** `frontend/src/styles/index.css` (or whichever global CSS exists)

Add this rule:

```css
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: 0% 0; }
}
```

---

## Step 3: Update Each Skeleton File

### Classification Rule

**Replace with ShimmerBar (text-like):**
- Short height bars: `h-3`, `h-3.5`, `h-4`, `h-5`, `h-6`, `h-7`, `h-8`
- With partial widths: `w-XX`, `w-X/Y`, `flex-1` with `max-w-[...]`

**Keep as Skeleton (NOT text):**
- Icons: square or round (e.g. `w-8 h-8 rounded-full`, `w-10 h-10 rounded-lg`)
- Buttons / inputs: `h-9`, `h-10` with `w-full` or `rounded-lg`
- Large blocks: `h-16`, `h-20`, `h-48`
- Progress bars: `h-2`, `h-3` with `w-full rounded-full`
- Toggle switches: `h-6 w-11 rounded-full`
- Badge chips: small `rounded-full` with fixed widths

---

### 3A. GeneratorSkeleton.tsx

**File:** `frontend/src/components/ui/GeneratorSkeleton.tsx`
**accentColor:** passed as prop (default `#6366f1`)

#### Lines to replace:

**Header (lines 18-19):**
```tsx
// BEFORE
<Skeleton className="h-6 w-56" />
<Skeleton className="h-4 w-36" />
// AFTER
<ShimmerBar accentColor={accentColor} className="h-6 w-56" />
<ShimmerBar accentColor={accentColor} className="h-4 w-36" />
```

**Banner section (lines 31-36):**
```tsx
// BEFORE
<Skeleton className="h-5 w-24 rounded-full" style={{ backgroundColor: `${accentColor}20` }} />
<Skeleton className="h-8 w-72" style={{ backgroundColor: `${accentColor}15` }} />
<Skeleton className="h-4 w-20" style={{ backgroundColor: `${accentColor}12` }} />
<Skeleton className="h-4 w-24" style={{ backgroundColor: `${accentColor}12` }} />
<Skeleton className="h-4 w-28" style={{ backgroundColor: `${accentColor}12` }} />
// AFTER
<ShimmerBar accentColor={accentColor} className="h-5 w-24 rounded-full" />
<ShimmerBar accentColor={accentColor} className="h-8 w-72" />
<ShimmerBar accentColor={accentColor} className="h-4 w-20" />
<ShimmerBar accentColor={accentColor} className="h-4 w-24" />
<ShimmerBar accentColor={accentColor} className="h-4 w-28" />
```

**Section 1 (lines 45-50):**
```tsx
// BEFORE
<Skeleton className="h-5 w-40" />
<Skeleton className="h-4 w-full" />
<Skeleton className="h-4 w-11/12" />
<Skeleton className="h-4 w-3/4" />
// AFTER
<ShimmerBar accentColor={accentColor} className="h-5 w-40" />
<ShimmerBar accentColor={accentColor} className="h-4 w-full" />
<ShimmerBar accentColor={accentColor} className="h-4 w-11/12" />
<ShimmerBar accentColor={accentColor} className="h-4 w-3/4" />
```

**Section 2 heading (line 55):**
```tsx
// BEFORE
<Skeleton className="h-5 w-48" />
// AFTER
<ShimmerBar accentColor={accentColor} className="h-5 w-48" />
```

**Quiz type — question text + answer options (lines 61-67):**
```tsx
// BEFORE
<Skeleton className="h-4 w-5/6" />
<Skeleton className="h-3.5 w-2/3" />
<Skeleton className="h-3.5 w-1/2" />
<Skeleton className="h-3.5 w-3/5" />
<Skeleton className="h-3.5 w-1/2" />
// AFTER
<ShimmerBar accentColor={accentColor} className="h-4 w-5/6" />
<ShimmerBar accentColor={accentColor} className="h-3.5 w-2/3" />
<ShimmerBar accentColor={accentColor} className="h-3.5 w-1/2" />
<ShimmerBar accentColor={accentColor} className="h-3.5 w-3/5" />
<ShimmerBar accentColor={accentColor} className="h-3.5 w-1/2" />
```

**Rubric type — LEAVE AS IS** (h-8 column headers + h-16 cells are table blocks, not text)

**Default type text lines (lines 88-91):**
```tsx
// BEFORE
<Skeleton className="h-4 w-full" />
<Skeleton className="h-4 w-5/6" />
<Skeleton className="h-4 w-full" />
<Skeleton className="h-4 w-2/3" />
// AFTER
<ShimmerBar accentColor={accentColor} className="h-4 w-full" />
<ShimmerBar accentColor={accentColor} className="h-4 w-5/6" />
<ShimmerBar accentColor={accentColor} className="h-4 w-full" />
<ShimmerBar accentColor={accentColor} className="h-4 w-2/3" />
```

**Section 3 (lines 99-104):**
```tsx
// BEFORE
<Skeleton className="h-5 w-36" />
<Skeleton className="h-4 w-full" />
<Skeleton className="h-4 w-4/5" />
<Skeleton className="h-4 w-11/12" />
// AFTER
<ShimmerBar accentColor={accentColor} className="h-5 w-36" />
<ShimmerBar accentColor={accentColor} className="h-4 w-full" />
<ShimmerBar accentColor={accentColor} className="h-4 w-4/5" />
<ShimmerBar accentColor={accentColor} className="h-4 w-11/12" />
```

**Import change:**
```tsx
import { ShimmerBar } from './ShimmerBar';
```
Keep `Skeleton` import — still used for rubric grid cells.

---

### 3B. DashboardSkeleton.tsx

**File:** `frontend/src/components/ui/DashboardSkeleton.tsx`
**accentColor:** passed as prop (default `#6366f1`)

#### Banner area (white on color) — use `variant="light"`:

**Lines 25-26 (title + subtitle on banner):**
```tsx
// AFTER
<ShimmerBar variant="light" className="h-7 w-48" />
<ShimmerBar variant="light" className="h-4 w-32" />
```

**Line 29 (stat pills on banner):**
```tsx
// AFTER
<ShimmerBar variant="light" className="h-5 w-20" />
```

#### Body area — use `accentColor`:

**Lines 45-46 (stat card text):**
```tsx
// BEFORE
<Skeleton className="h-4 w-24" />
<Skeleton className="h-6 w-16" />
// AFTER
<ShimmerBar accentColor={accentColor} className="h-4 w-24" />
<ShimmerBar accentColor={accentColor} className="h-6 w-16" />
```

**Line 56 (chart title):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-5 w-40" />
```

**Line 74 (timeline heading):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-5 w-32" />
```

**Lines 79-80 (timeline item text):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 w-3/4" />
<ShimmerBar accentColor={accentColor} className="h-3 w-1/2" />
```

**Line 88 (progress heading):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-5 w-36" />
```

**Line 104 (right column heading):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-5 w-28" />
```

**Lines 109-110 (right column item text):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 w-2/3" />
```

#### Keep as Skeleton:
- Line 23: icon `w-16 h-16 rounded-xl`
- Line 43: stat icon `w-10 h-10 rounded-full`
- Line 59: filter pills `h-8 w-20 rounded-full`
- Line 63: chart area `h-48`
- Line 77: timeline avatar `w-8 h-8 rounded-full`
- Line 89: progress bar `h-3 w-full rounded-full`
- Line 93: block cards `h-16 rounded-lg`
- Line 107: avatar `w-10 h-10 rounded-lg`
- Line 111: progress bar `h-2 w-full rounded-full`

---

### 3C. TreeBrowserSkeleton.tsx

**File:** `frontend/src/components/ui/TreeBrowserSkeleton.tsx`
**accentColor:** passed as prop (default `#22c55e`)

#### contentOnly mode:

**Lines 17-18 (title + subtitle):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-7 w-64" />
<ShimmerBar accentColor={accentColor} className="h-4 w-96" />
```

**Lines 25-26 (item text):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 w-3/4" />
<ShimmerBar accentColor={accentColor} className="h-3 w-1/2" />
```

Keep as Skeleton: icon `w-10 h-10 rounded-lg` (line 24), badge chip `h-6 w-16 rounded-full` (line 28)

#### Full mode:

**Header banner (white on color) — lines 48-49:**
```tsx
<ShimmerBar variant="light" className="h-7 w-48" />
<ShimmerBar variant="light" className="h-4 w-64" />
```

**Header stat box (white on color) — lines 53-54:**
```tsx
<ShimmerBar variant="light" className="h-3 w-24" />
<ShimmerBar variant="light" className="h-7 w-12" />
```

**Tree row text (line 88):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 flex-1 max-w-[200px]" />
```

**Sub-row text (line 95):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-3.5 w-36" />
```

**Detail panel heading (line 109):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-6 w-28 rounded" />
```

**Detail panel item text (lines 114-115):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 w-3/4" />
<ShimmerBar accentColor={accentColor} className="h-3 w-1/2" />
```

Keep as Skeleton: all icons, badges (`h-3 w-12 rounded-full`, `h-5 w-14 rounded-full`), filter buttons, header icon

---

### 3D. ResourceGridSkeleton.tsx

**File:** `frontend/src/components/ui/ResourceGridSkeleton.tsx`
**accentColor:** passed as prop (default `#3b82f6`)

#### Roster variant:

**Sidebar tree text (line 27):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 flex-1" />
```

**Sidebar sub-row text (line 33):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-3.5 flex-1" />
```

**Banner title/subtitle (white on color, lines 48-49):**
```tsx
<ShimmerBar variant="light" className="h-7 w-48" />
<ShimmerBar variant="light" className="h-4 w-32" />
```

**Stat label + value (lines 62-63):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-3 w-16" />
<ShimmerBar accentColor={accentColor} className="h-5 w-10" />
```

**Content heading (line 72):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-5 w-24 mb-4" />
```

**Card text (lines 77-78):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 w-3/4" />
<ShimmerBar accentColor={accentColor} className="h-3 w-1/2" />
```

Keep as Skeleton: tree icons, sidebar search bar, banner icon, stat icons, card icons, banner button

#### Calendar variant:

**Header title/subtitle (lines 96-97):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-6 w-40" />
<ShimmerBar accentColor={accentColor} className="h-3 w-56" />
```

**Event preview heading (line 120):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 w-20" />
```

**Event text lines (lines 122-123):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-3 w-full" />
<ShimmerBar accentColor={accentColor} className="h-3 w-3/4" />
```

**Quick add label (line 129):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 w-16" />
```

**Month name (line 141):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-6 w-36" />
```

**Weekday headers (line 147):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 mx-auto w-8" />
```

Keep as Skeleton: nav buttons, stat pills, quick-add inputs, day cells (`h-20`), header icon

#### Grid variant (default):

**Sidebar heading (line 168):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 w-24" />
```

**Sidebar nav text (line 174):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 flex-1" />
```

**Sidebar footer text (lines 181-187):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-3 w-10" />
<ShimmerBar accentColor={accentColor} className="h-3 w-6" />
<ShimmerBar accentColor={accentColor} className="h-3 w-14" />
<ShimmerBar accentColor={accentColor} className="h-3 w-6" />
```

**Header title/subtitle (lines 197-198):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-6 w-36" />
<ShimmerBar accentColor={accentColor} className="h-3 w-20" />
```

**Grid card text (lines 221, 223-224):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 w-4/5" />
<ShimmerBar accentColor={accentColor} className="h-3 w-20" />
<ShimmerBar accentColor={accentColor} className="h-3 w-14" />
```

Keep as Skeleton: all icons, nav badges, buttons, search bar

---

### 3E. SettingsPanelSkeleton.tsx

**File:** `frontend/src/components/ui/SettingsPanelSkeleton.tsx`
**No accentColor prop** — add one with default `#6b7280` (gray, matches settings tab color)

#### Interface change:
```tsx
interface SettingsPanelSkeletonProps {
  sectionCount?: number;
  accentColor?: string;  // ADD THIS
}

// destructure with default:
accentColor = '#6b7280',
```

#### Sidebar:

**Logo title/subtitle (lines 17-18):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-6 w-28" />
<ShimmerBar accentColor={accentColor} className="h-3 w-20" />
```

**Nav item text (lines 27-28):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 w-24" />
<ShimmerBar accentColor={accentColor} className="h-3 w-16" />
```

#### Content panel:

**Section title/subtitle (lines 41-42):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-7 w-40" />
<ShimmerBar accentColor={accentColor} className="h-4 w-56" />
```

**Form card headings (lines 47, 60, 79):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-5 w-32" />
<ShimmerBar accentColor={accentColor} className="h-5 w-36" />
<ShimmerBar accentColor={accentColor} className="h-5 w-28" />
```

**Form labels (lines 50, 82):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 w-20" />
<ShimmerBar accentColor={accentColor} className="h-4 w-24" />
```

**Toggle labels (lines 65-66):**
```tsx
<ShimmerBar accentColor={accentColor} className="h-4 w-28" />
<ShimmerBar accentColor={accentColor} className="h-3 w-48" />
```

Keep as Skeleton: icon `w-6 h-6` (line 16), nav chevron `w-3 h-3` (line 30), nav icon `w-4 h-4` (line 25), input fields `h-10 w-full` (lines 51, 83), toggle switches `h-6 w-11 rounded-full` (line 68)

---

### 3F. PresentationBuilder.tsx

**File:** `frontend/src/components/PresentationBuilder.tsx`
**Tab color:** `settings.tabColors['presentation-builder']` (`#f97316` orange)
**Skeleton location:** `initialLoad` guard (~lines 2280-2331)

#### Text bars to replace:

**Header title + subtitle:**
```tsx
// BEFORE
<Skeleton className="h-5 w-36" />
<Skeleton className="h-3 w-24" />
// AFTER
<ShimmerBar accentColor={tabColor} className="h-5 w-36" />
<ShimmerBar accentColor={tabColor} className="h-3 w-24" />
```

**Form field labels (6 instances):**
```tsx
// BEFORE
<Skeleton className="h-4 w-20" />
// AFTER
<ShimmerBar accentColor={tabColor} className="h-4 w-20" />
```

**Style section heading:**
```tsx
// BEFORE
<Skeleton className="h-5 w-28" />
// AFTER
<ShimmerBar accentColor={tabColor} className="h-5 w-28" />
```

Keep as Skeleton: icon boxes (`w-8 h-8`), tab pills (`h-9 w-28`), input fields (`h-10 w-full`), style cards (`h-20`), generate button (`h-11`)

---

### 3G. Chat.tsx

**File:** `frontend/src/components/Chat.tsx`
**Tab color:** `settings.tabColors['chat']` (`#3b82f6` blue)
**Skeleton location:** `initialLoad` guard (~lines 1627-1680)

#### Text bars to replace:

**Header title + subtitle:**
```tsx
// BEFORE
<Skeleton className="h-5 w-36" />
<Skeleton className="h-3 w-24" />
// AFTER
<ShimmerBar accentColor={tabColor} className="h-5 w-36" />
<ShimmerBar accentColor={tabColor} className="h-3 w-24" />
```

Keep as Skeleton: icon buttons (`w-8 h-8`), chat bubble blocks (`h-10` to `h-20`), avatars, input bar, send button

---

### 3H. ImageStudio.tsx

**File:** `frontend/src/components/ImageStudio.tsx`
**Tab color:** `settings.tabColors['image-studio']` (`#ec4899` pink)
**Skeleton location:** `initialLoad` guard (~lines 2008-2052)

#### Text bars to replace:

**Section labels:**
```tsx
// BEFORE
<Skeleton className="h-5 w-24" />
<Skeleton className="h-5 w-20" />
// AFTER
<ShimmerBar accentColor={tabColor} className="h-5 w-24" />
<ShimmerBar accentColor={tabColor} className="h-5 w-20" />
```

**Field labels:**
```tsx
// BEFORE
<Skeleton className="h-4 w-16" />
<Skeleton className="h-4 w-20" />
// AFTER
<ShimmerBar accentColor={tabColor} className="h-4 w-16" />
<ShimmerBar accentColor={tabColor} className="h-4 w-20" />
```

Keep as Skeleton: tab pills (`h-8 w-28`), style cards (`h-24`), textarea (`h-32`), input fields (`h-10`), generate button (`h-11`)

---

### 3I. BrainDump.tsx

**File:** `frontend/src/components/BrainDump.tsx`
**Tab color:** `settings.tabColors['brain-dump']` (`#a855f7` purple)

#### State A: `initialLoad` skeleton (~lines 1548-1589)

**Header title + subtitle:**
```tsx
// BEFORE
<Skeleton className="h-6 w-32" />
<Skeleton className="h-3 w-20" />
// AFTER
<ShimmerBar accentColor={tabColor} className="h-6 w-32" />
<ShimmerBar accentColor={tabColor} className="h-3 w-20" />
```

**Editor body text lines (6 bars):**
```tsx
// BEFORE
<Skeleton className="h-4 w-4/5" />
<Skeleton className="h-4 w-3/5" />
<Skeleton className="h-4 w-full" />
<Skeleton className="h-4 w-2/5" />
<Skeleton className="h-4 w-3/4" />
<Skeleton className="h-4 w-1/2" />
// AFTER
<ShimmerBar accentColor={tabColor} className="h-4 w-4/5" />
<ShimmerBar accentColor={tabColor} className="h-4 w-3/5" />
<ShimmerBar accentColor={tabColor} className="h-4 w-full" />
<ShimmerBar accentColor={tabColor} className="h-4 w-2/5" />
<ShimmerBar accentColor={tabColor} className="h-4 w-3/4" />
<ShimmerBar accentColor={tabColor} className="h-4 w-1/2" />
```

Keep as Skeleton: toolbar icons (`w-8 h-8`), header buttons (`h-8 w-20`), footer button (`w-10 h-10`, `h-10 w-32`)

#### State B: `showSkeleton` AI-generating (~lines 1725-1787)

These use raw `animate-pulse` divs with `bg-theme-tertiary`, NOT the `<Skeleton>` component. Replace with `ShimmerBar` using inline style for the gradient (since these use `style={}` not className for color).

**Title + subtitle:**
```tsx
// BEFORE
<div className="h-4 w-2/5 rounded-lg bg-theme-tertiary animate-pulse" />
<div className="h-3 w-1/4 rounded-lg bg-theme-tertiary animate-pulse" />
// AFTER
<ShimmerBar accentColor={tabColor} className="h-4 w-2/5" />
<ShimmerBar accentColor={tabColor} className="h-3 w-1/4" />
```

**Text paragraph lines (6 bars with staggered delays):**
```tsx
// BEFORE (example, each has different width + animationDelay)
<div className="h-3 w-full rounded-lg bg-theme-tertiary animate-pulse" style={{ animationDelay: '100ms' }} />
// AFTER
<ShimmerBar accentColor={tabColor} className="h-3 w-full" animationDelay="100ms" />
```

**Card sub-text lines:**
```tsx
// BEFORE
<div className="h-3 w-1/3 rounded bg-theme-tertiary animate-pulse" />
<div className="h-2.5 w-2/3 rounded bg-theme-tertiary animate-pulse" />
// AFTER
<ShimmerBar accentColor={tabColor} className="h-3 w-1/3" />
<ShimmerBar accentColor={tabColor} className="h-2.5 w-2/3" />
```

Keep as raw div: icon box (`w-10 h-10 rounded-xl`), action icon placeholders (`w-7 h-7 rounded`)

---

### 3J. AnalyticsDashboard.tsx

**File:** `frontend/src/components/AnalyticsDashboard.tsx`
**Color context:** Uses `var(--dash-border)` for skeleton colors, not a tab accentColor.
**Note:** Need to determine appropriate shimmer color. Options:
  - Use `settings.tabColors['analytics']` (`#3b82f6`) since this is the analytics tab
  - Or derive from CSS variable

**Skeleton location:** `loading && allResourcesData.length === 0` guard (~lines 570-699)

#### Text bars to replace (use `accentColor="#3b82f6"` or read from settings):

**Header name + subtitle:**
```tsx
<ShimmerBar accentColor="#3b82f6" className="h-6 w-32" />
<ShimmerBar accentColor="#3b82f6" className="h-4 w-24" />
```

**Stat values + labels (3 sets):**
```tsx
<ShimmerBar accentColor="#3b82f6" className="h-7 w-10" />
<ShimmerBar accentColor="#3b82f6" className="h-3 w-14" />
```

**All section titles:**
```tsx
// h-5 w-36, h-5 w-44, h-5 w-36, h-5 w-28, h-5 w-20, h-5 w-32
<ShimmerBar accentColor="#3b82f6" className="h-5 w-36" />
// etc.
```

**Activity row text (4 rows):**
```tsx
<ShimmerBar accentColor="#3b82f6" className="h-4 w-3/4" />
<ShimmerBar accentColor="#3b82f6" className="h-3 w-1/3" />
```

**Task row text (3 rows):**
```tsx
<ShimmerBar accentColor="#3b82f6" className="h-4 w-4/5" />
<ShimmerBar accentColor="#3b82f6" className="h-3 w-1/4" />
```

**Tool name text (4 rows):**
```tsx
<ShimmerBar accentColor="#3b82f6" className="h-4 w-2/3" />
```

Keep as raw div: avatars, chart area (`h-56`), progress bars (`h-3 rounded-full`, `h-2 rounded-full`), cards (`h-20`), calendar cells (`h-8`), checkboxes (`w-5 h-5`), icons (`w-10 h-10`, `w-8 h-8`), filter pills (`h-8 w-16`, `h-7 w-20`)

---

### 3K. TeacherMetricsPanel.tsx

**File:** `frontend/src/components/TeacherMetricsPanel.tsx`
**Color context:** Uses `bg-theme-bg-tertiary`. No explicit tab color.
**Shimmer color:** Use a neutral gray or derive from parent context.

**Text bars to replace (lines ~80-82):**
```tsx
// BEFORE
<div className="h-4 w-24 rounded bg-theme-bg-tertiary animate-pulse" />
<div className="h-3 w-48 rounded bg-theme-bg-tertiary animate-pulse" />
// AFTER
<ShimmerBar accentColor="#6b7280" className="h-4 w-24" />
<ShimmerBar accentColor="#6b7280" className="h-3 w-48" />
```

Keep as raw div: icon box (`w-16 h-16 rounded-xl`)

---

### 3L. Worksheet Template Files

These templates use **inline pixel-based styles** (not Tailwind classes) because they render inside a print-ready worksheet preview on a white background. The shimmer gradient needs a `variant="paper"` or custom light-mode gradient since these are on white, not dark backgrounds.

**New ShimmerBar variant needed:** `variant="paper"` — gradient using the accent color on a white/light document background:
```
linear-gradient(90deg,
  #f1f5f9 0%,
  ${accentColor}25 15%,
  ${accentColor}50 30%,
  ${accentColor}70 40%,
  ${accentColor}50 50%,
  ${accentColor}25 65%,
  #f1f5f9 80%,
  #f1f5f9 100%)
```

#### ComprehensionTemplate.tsx

**Passage text lines (7 bars):**
```tsx
// BEFORE (inline style)
<div style={{ height: 14, width: '100%', backgroundColor: palette.accentBorder, borderRadius: 4 }} />
// ... 6 more at widths 97%, 93%, 100%, 88%, 95%, 82%
// AFTER
<ShimmerBar variant="paper" accentColor={ACCENT} style={{ height: 14, width: '100%' }} />
// ... etc.
```

**Question text bars:**
```tsx
// BEFORE
<div style={{ height: 14, width: '72%', backgroundColor: '#e2e8f0', borderRadius: 4 }} />
// AFTER
<ShimmerBar variant="paper" accentColor={ACCENT} style={{ height: 14, width: '72%' }} />
```

#### MultipleChoiceTemplate.tsx

**Question text:**
```tsx
// BEFORE
<div style={{ height: 15, width: '78%', backgroundColor: '#e2e8f0', borderRadius: 4 }} />
// AFTER
<ShimmerBar variant="paper" accentColor={ACCENT} style={{ height: 15, width: '78%' }} />
```

**Answer option text (4 per question):**
```tsx
// BEFORE
<div style={{ height: 12, flex: 1, backgroundColor: '#e2e8f0', borderRadius: 3 }} />
// AFTER
<ShimmerBar variant="paper" accentColor={ACCENT} style={{ height: 12, flex: 1 }} />
```

#### MatchingTemplate.tsx

**Column A + B text (2 per row):**
```tsx
// BEFORE
<div style={{ height: 13, flex: 1, backgroundColor: palette.accentBorder, borderRadius: 3 }} />
// AFTER
<ShimmerBar variant="paper" accentColor={ACCENT} style={{ height: 13, flex: 1 }} />
```

#### ListBasedTemplate.tsx

**Question text (1 per row):**
```tsx
// BEFORE
<div style={{ height: 14, width: '75%', backgroundColor: '#e2e8f0', borderRadius: 4 }} />
// AFTER
<ShimmerBar variant="paper" accentColor={ACCENT} style={{ height: 14, width: '75%' }} />
```

#### MathTemplate.tsx

**Question text (word-problem layout):**
```tsx
// BEFORE
<div style={{ height: 14, width: '72%', backgroundColor: '#e2e8f0', borderRadius: 4 }} />
// AFTER
<ShimmerBar variant="paper" accentColor={ACCENT} style={{ height: 14, width: '72%' }} />
```

**Header title (all templates):**
```tsx
// BEFORE
<div style={{ height: 28, width: 280/300, backgroundColor: '#e2e8f0', borderRadius: 6 }} />
// AFTER
<ShimmerBar variant="paper" accentColor={ACCENT} style={{ height: 28, width: 280 }} />
```

---

## Updated ShimmerBar Component (with `paper` variant)

```tsx
import React from "react";

interface ShimmerBarProps {
  accentColor?: string;
  variant?: "default" | "light" | "paper";
  className?: string;
  style?: React.CSSProperties;
  animationDelay?: string;
}

export const ShimmerBar: React.FC<ShimmerBarProps> = ({
  accentColor = "#6b7280",
  variant = "default",
  className = "",
  style = {},
  animationDelay,
}) => {
  const gradient =
    variant === "light"
      ? `linear-gradient(90deg,
          rgba(255,255,255,0.08) 0%,
          rgba(255,255,255,0.15) 15%,
          rgba(255,255,255,0.30) 30%,
          rgba(255,255,255,0.40) 40%,
          rgba(255,255,255,0.30) 50%,
          rgba(255,255,255,0.15) 65%,
          rgba(255,255,255,0.08) 80%,
          rgba(255,255,255,0.08) 100%)`
      : variant === "paper"
      ? `linear-gradient(90deg,
          #f1f5f9 0%,
          ${accentColor}25 15%,
          ${accentColor}50 30%,
          ${accentColor}70 40%,
          ${accentColor}50 50%,
          ${accentColor}25 65%,
          #f1f5f9 80%,
          #f1f5f9 100%)`
      : `linear-gradient(90deg,
          ${accentColor}15 0%,
          ${accentColor}30 15%,
          ${accentColor}70 30%,
          ${accentColor}99 40%,
          ${accentColor}70 50%,
          ${accentColor}30 65%,
          ${accentColor}15 80%,
          ${accentColor}15 100%)`;

  return (
    <div
      className={`rounded-md ${className}`}
      style={{
        background: gradient,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s linear infinite",
        animationDelay: animationDelay || "0s",
        ...style,
      }}
    />
  );
};
```

---

## Step 4: Verify and Test

After all changes:

1. Run `npm run dev` and open each tab to verify:
   - Shimmer animation is smooth and visible
   - Colors match tab accent colors
   - White-on-banner variant looks correct on gradient headers
   - Non-text elements (icons, buttons, inputs) still pulse normally
   - No CSS conflicts or duplicate keyframe definitions

2. Check these specific tabs:
   - Lesson Planner (amber shimmer)
   - Quiz Generator (teal shimmer)
   - Rubric Generator (orange shimmer)
   - Achievements (amber shimmer, dashboard layout)
   - Curriculum Tracker (green shimmer, tree layout)
   - Resource Manager (lime shimmer, grid layout)
   - School Year Calendar (calendar variant)
   - Class Management (roster variant)
   - Settings (gray shimmer)
   - Presentation Builder (orange shimmer)
   - Chat (blue shimmer)
   - Image Studio (pink shimmer)
   - Brain Dump (purple shimmer — both initialLoad and AI-generating states)
   - Analytics Dashboard (blue shimmer)
   - Worksheet templates — generate a worksheet and check loading state on paper preview:
     - Comprehension (passage + question shimmer on white)
     - Multiple Choice (question + answer options shimmer)
     - Matching (column A/B shimmer)
     - List-Based (question text shimmer)
     - Math (question text shimmer)

---

## Tab Color Reference

| Tab | Key | Color |
|-----|-----|-------|
| Analytics | `analytics` | `#3b82f6` |
| Chat | `chat` | `#3b82f6` |
| Curriculum | `curriculum` | `#8b5cf6` |
| Lesson Planner | `lesson-planner` | `#f59e0b` |
| Kindergarten Planner | `kindergarten-planner` | `#ec4899` |
| Multigrade Planner | `multigrade-planner` | `#06b6d4` |
| Cross-Curricular Planner | `cross-curricular-planner` | `#6366f1` |
| Quiz Generator | `quiz-generator` | `#14b8a6` |
| Rubric Generator | `rubric-generator` | `#f97316` |
| Resource Manager | `resource-manager` | `#84cc16` |
| Curriculum Tracker | `curriculum-tracker` | `#22c55e` |
| Worksheet Generator | `worksheet-generator` | `#8b5cf6` |
| Image Studio | `image-studio` | `#ec4899` |
| Class Management | `class-management` | `#f97316` |
| Support | `support` | `#3b82f6` |
| Settings | `settings` | `#6b7280` |
| Brain Dump | `brain-dump` | `#a855f7` |
| Performance Metrics | `performance-metrics` | `#10b981` |
| Presentation Builder | `presentation-builder` | `#f97316` |
| Achievements | `achievements` | `#f59e0b` |
| Storybook | `storybook` | `#a855f7` |
| Educator Insights | `educator-insights` | `#d97706` |

---

## Files Touched (Summary)

| File | Action |
|------|--------|
| `ui/ShimmerBar.tsx` | **Create** — new reusable component (3 variants: default, light, paper) |
| `styles/index.css` (or global CSS) | **Edit** — add `@keyframes shimmer` |
| `ui/GeneratorSkeleton.tsx` | **Edit** — ~20 Skeleton -> ShimmerBar |
| `ui/DashboardSkeleton.tsx` | **Edit** — ~15 Skeleton -> ShimmerBar |
| `ui/TreeBrowserSkeleton.tsx` | **Edit** — ~14 Skeleton -> ShimmerBar |
| `ui/ResourceGridSkeleton.tsx` | **Edit** — ~20 Skeleton -> ShimmerBar |
| `ui/SettingsPanelSkeleton.tsx` | **Edit** — ~12 Skeleton -> ShimmerBar (gray default) |
| `PresentationBuilder.tsx` | **Edit** — ~9 Skeleton -> ShimmerBar |
| `Chat.tsx` | **Edit** — ~2 Skeleton -> ShimmerBar (title/subtitle only) |
| `ImageStudio.tsx` | **Edit** — ~4 Skeleton -> ShimmerBar |
| `BrainDump.tsx` | **Edit** — ~18 bars across 2 skeleton states |
| `AnalyticsDashboard.tsx` | **Edit** — ~20 raw divs -> ShimmerBar |
| `TeacherMetricsPanel.tsx` | **Edit** — ~2 raw divs -> ShimmerBar |
| `templates/ComprehensionTemplate.tsx` | **Edit** — ~8 inline divs -> ShimmerBar (paper variant) |
| `templates/MultipleChoiceTemplate.tsx` | **Edit** — ~5+ inline divs -> ShimmerBar (paper variant) |
| `templates/MatchingTemplate.tsx` | **Edit** — ~2 per row -> ShimmerBar (paper variant) |
| `templates/ListBasedTemplate.tsx` | **Edit** — ~1 per row -> ShimmerBar (paper variant) |
| `templates/MathTemplate.tsx` | **Edit** — ~1 per row -> ShimmerBar (paper variant) |
| **Total: 18 files** (1 new + 17 edits) |
