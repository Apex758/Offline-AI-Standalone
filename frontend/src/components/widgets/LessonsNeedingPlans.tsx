// Phase 5: compact "Lessons needing plans" widget.
//
// Queries /api/school-year/upcoming-unplanned and shows a count plus a preview
// list of the next few unplanned sessions. Clicking an item stores the target
// in-context so a generator can pre-fill when opened next.
//
// This is a lightweight display widget — it does NOT open a generator on
// click because the generators live inside a tabbed Dashboard and we'd have
// to plumb tab-switching through several layers. The click handler is a hook
// the parent can override.

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getTeacherId } from '../../lib/teacherId';
import { useNotification } from '../../contexts/NotificationContext';

export interface UnplannedOccurrence {
  slot_id: string;
  date: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  subject: string;
  grade_level: string;
  class_name: string | null;
}

interface LessonsNeedingPlansProps {
  /** How many days to look ahead. Default 14. */
  withinDays?: number;
  /** Max items to show in the preview list. Default 5. */
  maxPreview?: number;
  /** Optional override click handler. */
  onItemClick?: (occ: UnplannedOccurrence) => void;
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  const weekday = d.toLocaleDateString(undefined, { weekday: 'short' });
  const md = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${weekday} ${md}`;
}

const LessonsNeedingPlans: React.FC<LessonsNeedingPlansProps> = ({
  withinDays = 14,
  maxPreview = 5,
  onItemClick,
}) => {
  const [occurrences, setOccurrences] = useState<UnplannedOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();
  const notifiedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const teacherId = getTeacherId();
    setLoading(true);
    setError(null);
    axios
      .get(`http://localhost:8000/api/school-year/upcoming-unplanned/${encodeURIComponent(teacherId)}`, {
        params: { within_days: withinDays },
      })
      .then(res => {
        if (cancelled) return;
        const list: UnplannedOccurrence[] = res.data?.occurrences || [];
        setOccurrences(list);

        // Notification: fire once per session when we first discover unplanned
        // upcoming lessons. sessionStorage prevents spam across component
        // remounts (tab switches), and notifiedRef prevents double-fires
        // within the same mount cycle.
        const sessionKey = `lessonsNeedingPlans.notified.${withinDays}`;
        if (
          list.length > 0 &&
          !notifiedRef.current &&
          typeof sessionStorage !== 'undefined' &&
          !sessionStorage.getItem(sessionKey)
        ) {
          notifiedRef.current = true;
          try { sessionStorage.setItem(sessionKey, '1'); } catch { /* ignore */ }
          const msg = list.length === 1
            ? `1 upcoming lesson has no plan yet.`
            : `${list.length} upcoming lessons have no plans yet.`;
          notify(msg, 'info', 'dashboard');
        }
      })
      .catch(e => {
        if (cancelled) return;
        setError(e?.message || 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [withinDays, notify]);

  const count = occurrences.length;
  const preview = occurrences.slice(0, maxPreview);

  return (
    <div className="rounded-xl widget-glass p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-theme-heading">Lessons Needing Plans</h3>
        {!loading && !error && (
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{
              backgroundColor: count === 0 ? 'rgba(16,185,129,0.15)' : 'rgba(249,115,22,0.15)',
              color: count === 0 ? 'rgb(5,150,105)' : 'rgb(234,88,12)',
            }}
          >
            {count}
          </span>
        )}
      </div>

      {loading && (
        <p className="text-xs text-theme-muted">Loading…</p>
      )}

      {!loading && error && (
        <p className="text-xs text-amber-600">Could not load. {error}</p>
      )}

      {!loading && !error && count === 0 && (
        <p className="text-xs text-theme-muted">
          All upcoming sessions in the next {withinDays} days have plans. 🎉
        </p>
      )}

      {!loading && !error && count > 0 && (
        <>
          <p className="text-xs text-theme-muted mb-2">
            {count} session{count === 1 ? '' : 's'} in the next {withinDays} days without a plan.
          </p>
          <ul className="space-y-1.5">
            {preview.map(occ => (
              <li key={`${occ.slot_id}::${occ.date}`}>
                <button
                  type="button"
                  onClick={() => onItemClick?.(occ)}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-theme-subtle text-xs flex items-center justify-between gap-2"
                >
                  <span className="flex-1 min-w-0 truncate">
                    <strong>{formatDateLabel(occ.date)}</strong>
                    <span className="text-theme-muted">
                      {' '}• {occ.start_time}–{occ.end_time} • {occ.subject || 'class'}
                    </span>
                  </span>
                  <span className="text-[10px] shrink-0 text-theme-muted">
                    {occ.class_name || occ.grade_level}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {count > maxPreview && (
            <p className="text-[11px] text-theme-muted mt-2 text-center">
              + {count - maxPreview} more
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default LessonsNeedingPlans;
