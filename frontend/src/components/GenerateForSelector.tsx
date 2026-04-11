// Generator "Generate for..." selector.
//
// Given the teacher's active class (via ActiveClassContext) and the timetable,
// shows a compact control at the top of a generator that lets the teacher
// target a specific upcoming class session. On pick, it calls onPick with the
// full occurrence metadata (date, day, start/end, subject, duration) so the
// parent generator can auto-fill its form and — in Phase 5 — link the
// generated plan to that concrete calendar instance.
//
// UX:
//   [ Generate for: Wed Oct 7 • 9:00–10:00 • Math ▾ ]  [ 📅 Jump to date ]
//
// - The dropdown lists the next N (default 10) upcoming occurrences for the
//   active class, skipping holidays that block classes.
// - The date-jump input lets teachers pick any date; if the active class has
//   a slot on that date, it's selected automatically.
// - If no class is active, the control renders a disabled hint instead.

import React, { useMemo, useState, useEffect } from 'react';
import { useActiveClass } from '../contexts/ActiveClassContext';
import { useTimetable } from '../contexts/TimetableContext';
import {
  projectUpcomingOccurrences,
  filterSlotsByClass,
  formatOccurrenceLabel,
  formatRelativeHint,
  UpcomingOccurrence,
} from '../lib/upcomingSlots';

interface GenerateForSelectorProps {
  /** Currently selected occurrence slotId+date pair ("<slotId>::<dateISO>") or null. */
  value: string | null;
  onPick: (occ: UpcomingOccurrence | null) => void;
  /** Max upcoming dates to show in the dropdown. */
  limit?: number;
  /** Accent color (per-generator tab color). */
  accentColor?: string;
  /** Set of YYYY-MM-DD dates to treat as blocked (holidays). Optional. */
  blockedDates?: Set<string>;
}

function buildValue(occ: UpcomingOccurrence): string {
  return `${occ.slotId}::${occ.dateISO}`;
}

const GenerateForSelector: React.FC<GenerateForSelectorProps> = ({
  value,
  onPick,
  limit = 10,
  accentColor = '#4f46e5',
  blockedDates,
}) => {
  const { activeClass } = useActiveClass();
  const { slots: allSlots } = useTimetable();
  const [jumpDate, setJumpDate] = useState<string>('');

  const today = useMemo(() => new Date(), []);

  const occurrences = useMemo(() => {
    if (!activeClass) return [];
    const classSlots = filterSlotsByClass(allSlots, activeClass.className, activeClass.gradeLevel);
    return projectUpcomingOccurrences(classSlots, today, limit, blockedDates || new Set());
  }, [activeClass, allSlots, today, limit, blockedDates]);

  const selected = useMemo(
    () => occurrences.find(o => buildValue(o) === value) || null,
    [occurrences, value],
  );

  // When the active class changes, clear any stale selection so we don't point
  // at a slot belonging to a previously active class.
  useEffect(() => {
    if (!activeClass) {
      onPick(null);
      return;
    }
    if (selected && selected.className !== activeClass.className) {
      onPick(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClass?.key]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    if (!v) { onPick(null); return; }
    const match = occurrences.find(o => buildValue(o) === v);
    onPick(match || null);
  };

  const handleJump = (e: React.ChangeEvent<HTMLInputElement>) => {
    const iso = e.target.value;
    setJumpDate(iso);
    if (!iso || !activeClass) return;
    // Find any occurrence of the active class's slots on that date.
    const classSlots = filterSlotsByClass(allSlots, activeClass.className, activeClass.gradeLevel);
    // Re-project over a wider window so the user can jump weeks/months ahead.
    const wide = projectUpcomingOccurrences(classSlots, today, Math.max(limit, 60), blockedDates || new Set());
    const match = wide.find(o => o.dateISO === iso);
    if (match) onPick(match);
  };

  // Not-active state
  if (!activeClass) {
    return (
      <div
        className="rounded-xl p-3 text-xs border border-dashed"
        style={{ borderColor: 'var(--color-border)', color: 'var(--text-muted)' }}
      >
        Pick a class above to target a specific lesson from your timetable.
      </div>
    );
  }

  // Active class with no timetable slots
  if (occurrences.length === 0) {
    return (
      <div
        className="rounded-xl p-3 text-xs border border-dashed"
        style={{ borderColor: 'var(--color-border)', color: 'var(--text-muted)' }}
      >
        <strong>{activeClass.label}</strong> has no upcoming timetable slots. Schedule this class in the Timetable
        to target a specific lesson — or continue without a target and generate a one-off plan.
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-3 border flex flex-col gap-2"
      style={{ borderColor: accentColor, backgroundColor: `${accentColor}10` }}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
          Generate for
        </div>
        {selected && (
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {formatRelativeHint(selected.date, today)}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={value || ''}
          onChange={handleSelect}
          className="flex-1 min-w-[260px] px-3 py-2 rounded-lg border border-theme-strong bg-theme-surface text-theme-label text-sm focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
        >
          <option value="">— Pick an upcoming session (optional) —</option>
          {occurrences.map(occ => (
            <option key={buildValue(occ)} value={buildValue(occ)}>
              {formatOccurrenceLabel(occ)}
            </option>
          ))}
        </select>

        <label
          className="flex items-center gap-1.5 text-xs px-2 py-2 rounded-lg border border-theme-strong bg-theme-surface cursor-pointer"
          title="Jump to a specific date"
        >
          <span style={{ color: 'var(--text-muted)' }}>Jump to</span>
          <input
            type="date"
            value={jumpDate}
            onChange={handleJump}
            className="text-xs bg-transparent outline-none"
            style={{ color: 'var(--text-label)' }}
          />
        </label>

        {selected && (
          <button
            type="button"
            onClick={() => onPick(null)}
            className="text-[11px] px-2 py-1 rounded-md border border-theme-strong hover:bg-theme-subtle"
            style={{ color: 'var(--text-muted)' }}
            title="Clear target"
          >
            Clear
          </button>
        )}
      </div>

      {selected && (
        <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          Subject, duration and grade level will auto-fill from this slot and override class defaults.
        </div>
      )}
    </div>
  );
};

export default GenerateForSelector;
