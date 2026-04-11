// Project weekly timetable slots onto upcoming calendar dates.
//
// A TimetableSlot describes a *recurring* weekly appearance ("Grade 1 Blue
// Math, Mondays 9:00-10:00"). Generators need to target a *specific* upcoming
// occurrence of that slot ("next Monday Oct 5"). This helper does the
// projection: given a list of slots and a reference date, it returns the next
// N concrete occurrences, sorted by date ascending.
//
// Blocked dates (e.g. holidays with blocks_classes=1) are skipped.

import type { TimetableSlot } from '../contexts/TimetableContext';

const DAY_NAME_TO_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export interface UpcomingOccurrence {
  slotId: string;
  date: Date;              // the concrete calendar date of this occurrence
  dateISO: string;         // YYYY-MM-DD (local)
  dayOfWeek: string;       // "Monday", etc
  startTime: string;       // "09:00"
  endTime: string;         // "10:00"
  durationMinutes: number;
  subject: string;
  gradeLevel: string;
  className: string | null;
}

function dayIndex(name: string | undefined): number {
  if (!name) return -1;
  const n = DAY_NAME_TO_INDEX[name.toLowerCase()];
  return n == null ? -1 : n;
}

function minutesBetween(start: string, end: string): number {
  try {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    return (eh * 60 + em) - (sh * 60 + sm);
  } catch {
    return 0;
  }
}

function toLocalISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Find the next calendar date (>= from) whose day-of-week matches `targetDow`.
 * Returns null if targetDow is invalid.
 */
function nextDateForDow(from: Date, targetDow: number): Date | null {
  if (targetDow < 0 || targetDow > 6) return null;
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const delta = (targetDow - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + delta);
  return d;
}

/**
 * Project a list of weekly recurring slots onto upcoming calendar dates.
 *
 * @param slots    The weekly slots to project (can be pre-filtered by class).
 * @param fromDate Reference "today". The first occurrence returned will be on
 *                 or after this date.
 * @param limit    Max number of occurrences to return.
 * @param blockedDates Set of YYYY-MM-DD strings (local) that should be skipped
 *                     (e.g. holidays with blocks_classes=1).
 * @returns Occurrences sorted by date ascending, then by start time.
 */
export function projectUpcomingOccurrences(
  slots: TimetableSlot[],
  fromDate: Date,
  limit = 10,
  blockedDates: Set<string> = new Set(),
): UpcomingOccurrence[] {
  if (!Array.isArray(slots) || slots.length === 0) return [];

  const from = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const occurrences: UpcomingOccurrence[] = [];

  // Per slot, walk forward weekly until we have enough or hit a safety cap.
  const weeksHorizon = Math.max(12, limit * 2); // cap ~3+ months worth
  for (const slot of slots) {
    const dow = dayIndex(slot.day_of_week);
    if (dow < 0) continue;
    const first = nextDateForDow(from, dow);
    if (!first) continue;

    for (let w = 0; w < weeksHorizon; w++) {
      const d = new Date(first.getFullYear(), first.getMonth(), first.getDate() + w * 7);
      const iso = toLocalISO(d);
      if (blockedDates.has(iso)) continue;
      occurrences.push({
        slotId: slot.id,
        date: d,
        dateISO: iso,
        dayOfWeek: slot.day_of_week,
        startTime: slot.start_time,
        endTime: slot.end_time,
        durationMinutes: minutesBetween(slot.start_time, slot.end_time),
        subject: slot.subject,
        gradeLevel: slot.grade_level,
        className: slot.class_name,
      });
    }
  }

  // Sort by date then start time, and cap.
  occurrences.sort((a, b) => {
    if (a.dateISO !== b.dateISO) return a.dateISO < b.dateISO ? -1 : 1;
    return a.startTime < b.startTime ? -1 : 1;
  });

  return occurrences.slice(0, limit);
}

/** Filter slots to just those belonging to a specific class (+ optional grade). */
export function filterSlotsByClass(
  slots: TimetableSlot[],
  className: string,
  gradeLevel?: string,
): TimetableSlot[] {
  const gKey = gradeLevel
    ? String(gradeLevel).toLowerCase().replace(/^grade\s*/, '').trim()
    : undefined;
  return slots.filter(s => {
    if ((s.class_name || '') !== className) return false;
    if (!gKey) return true;
    const sKey = String(s.grade_level || '').toLowerCase().replace(/^grade\s*/, '').trim();
    return sKey === gKey;
  });
}

/** Compact human label: "Mon Oct 5 • 9:00–10:00 • Math (60m)". */
export function formatOccurrenceLabel(occ: UpcomingOccurrence): string {
  const d = occ.date;
  const weekday = d.toLocaleDateString(undefined, { weekday: 'short' });
  const md = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const subj = occ.subject ? ` • ${occ.subject}` : '';
  return `${weekday} ${md} • ${occ.startTime}–${occ.endTime}${subj} (${occ.durationMinutes}m)`;
}

/** Human-friendly relative hint: "today", "tomorrow", "in 3 days", "in 2 weeks". */
export function formatRelativeHint(occDate: Date, fromDate: Date): string {
  const a = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()).getTime();
  const b = new Date(occDate.getFullYear(), occDate.getMonth(), occDate.getDate()).getTime();
  const diffDays = Math.round((b - a) / 86400000);
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  if (diffDays < 0) return `${-diffDays}d ago`;
  if (diffDays < 7) return `in ${diffDays} days`;
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  if (weeks === 1 && days === 0) return 'in 1 week';
  if (days === 0) return `in ${weeks} weeks`;
  return `in ${weeks}w ${days}d`;
}
