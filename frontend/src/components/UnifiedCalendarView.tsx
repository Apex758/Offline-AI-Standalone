/**
 * Unified Calendar View (Phase 4 — Phase 1+2+3 backend)
 *
 * Pulls from /api/calendar/unified — the single derived event layer fed by
 * school_year_events, timetable_slots, milestones, lesson_plans, holidays,
 * scheduled_results, and daily_plans.
 *
 * Read-only "single pane of glass" view of every time/date system in the app.
 * Auto-refreshes when isActive becomes true so it picks up changes from
 * the other flip-card panels without a page reload.
 */

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import { getTeacherId } from '../lib/teacherId';
import { HeartbeatLoader } from './ui/HeartbeatLoader';

interface UnifiedEvent {
  id: string;
  source_type: string;
  source_id: string;
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime?: string;
  all_day: number;
  status: string;
  color?: string;
  grade_level?: string;
  subject?: string;
  metadata?: Record<string, any>;
  is_occurrence?: boolean;
  parent_id?: string;
}

interface Conflict {
  kind: string;
  severity: 'warning' | 'error';
  message: string;
  lesson_plan_id?: string;
  timetable_slot_id?: string;
  holiday_id?: string;
}

interface UnifiedCalendarViewProps {
  isActive?: boolean;
}

const SOURCE_COLORS: Record<string, string> = {
  school_year:    '#0d9488', // teal
  holiday:        '#dc2626', // red
  timetable_slot: '#4f46e5', // indigo
  milestone:      '#059669', // emerald
  lesson_plan:    '#f59e0b', // amber
  scheduled_task: '#7c3aed', // violet
  daily_plan:     '#10b981', // green
};

const SOURCE_LABELS: Record<string, string> = {
  school_year:    'Calendar Event',
  holiday:        'Holiday',
  timetable_slot: 'Class Session',
  milestone:      'Milestone Due',
  lesson_plan:    'Lesson Plan',
  scheduled_task: 'Scheduled Task',
  daily_plan:     'Daily Plan',
};

const ALL_TYPES = Object.keys(SOURCE_LABELS);

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
}
function fmtIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function fmtTime(iso?: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

const UnifiedCalendarView: React.FC<UnifiedCalendarViewProps> = ({ isActive }) => {
  const [events, setEvents] = useState<UnifiedEvent[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enabledTypes, setEnabledTypes] = useState<Set<string>>(new Set(ALL_TYPES));
  const [monthAnchor, setMonthAnchor] = useState<Date>(new Date());

  const teacherId = getTeacherId();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const start = startOfMonth(monthAnchor).toISOString();
      const end = endOfMonth(monthAnchor).toISOString();
      const [eventsRes, conflictsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/calendar/unified', {
          params: { teacher_id: teacherId, start, end },
        }),
        axios.get('http://localhost:8000/api/calendar/conflicts', {
          params: { teacher_id: teacherId },
        }).catch(() => ({ data: { conflicts: [] } })),
      ]);
      setEvents(eventsRes.data?.events ?? []);
      setConflicts(conflictsRes.data?.conflicts ?? []);
    } catch (e: any) {
      console.error('Failed to fetch unified calendar:', e);
      setError(e?.message || 'Failed to load unified calendar');
      setEvents([]);
      setConflicts([]);
    } finally {
      setLoading(false);
    }
  }, [monthAnchor, teacherId]);

  useEffect(() => {
    if (isActive) fetchData();
  }, [isActive, fetchData]);

  const filteredEvents = useMemo(
    () => events.filter(e => enabledTypes.has(e.source_type)),
    [events, enabledTypes]
  );

  // Group events by date for the list view
  const grouped = useMemo(() => {
    const map: Record<string, UnifiedEvent[]> = {};
    for (const ev of filteredEvents) {
      const day = ev.start_datetime.slice(0, 10);
      if (!map[day]) map[day] = [];
      map[day].push(ev);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredEvents]);

  const toggleType = (t: string) => {
    setEnabledTypes(prev => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const monthLabel = monthAnchor.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });

  return (
    <div className="h-full flex flex-col p-6 gap-4" style={{ background: 'var(--bg-primary)' }}>
      {/* Header + month nav */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Unified Calendar
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Every time/date source in one synced view
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 text-sm rounded-md border"
            style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
            onClick={() => setMonthAnchor(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() - 1, 1))}
          >
            &larr; Prev
          </button>
          <span className="text-sm font-semibold w-32 text-center" style={{ color: 'var(--text-primary)' }}>
            {monthLabel}
          </span>
          <button
            className="px-3 py-1.5 text-sm rounded-md border"
            style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
            onClick={() => setMonthAnchor(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + 1, 1))}
          >
            Next &rarr;
          </button>
          <button
            className="px-3 py-1.5 text-sm rounded-md border ml-2"
            style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
            onClick={fetchData}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Source-type filter chips */}
      <div className="flex flex-wrap gap-2 flex-shrink-0">
        {ALL_TYPES.map(t => {
          const active = enabledTypes.has(t);
          const color = SOURCE_COLORS[t];
          return (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                background: active ? color : 'transparent',
                color: active ? 'white' : color,
                border: `1px solid ${color}`,
                opacity: active ? 1 : 0.6,
              }}
            >
              {SOURCE_LABELS[t]}
            </button>
          );
        })}
      </div>

      {/* Conflicts banner */}
      {conflicts.length > 0 && (
        <div
          className="flex-shrink-0 p-3 rounded-md text-sm border"
          style={{ borderColor: '#dc2626', background: '#fee2e2', color: '#991b1b' }}
        >
          <div className="font-semibold mb-1">{conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''} detected</div>
          <ul className="text-xs space-y-0.5">
            {conflicts.slice(0, 5).map((c, i) => (
              <li key={i}>&middot; {c.message}</li>
            ))}
            {conflicts.length > 5 && <li>... and {conflicts.length - 5} more</li>}
          </ul>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-auto rounded-md border" style={{ borderColor: 'var(--border-primary)' }}>
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <HeartbeatLoader className="w-8 h-8" />
          </div>
        ) : error ? (
          <div className="p-6 text-sm" style={{ color: '#dc2626' }}>{error}</div>
        ) : grouped.length === 0 ? (
          <div className="p-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            No events this month. Create a school year event, lesson plan, milestone, or timetable slot to see them appear here automatically.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
            {grouped.map(([day, dayEvents]) => (
              <div key={day} className="flex">
                <div
                  className="w-28 flex-shrink-0 px-4 py-3 text-xs font-semibold"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                >
                  {new Date(day + 'T00:00:00').toLocaleDateString(undefined, {
                    weekday: 'short', month: 'short', day: 'numeric',
                  })}
                </div>
                <div className="flex-1 p-3 space-y-1.5">
                  {dayEvents.map((ev, i) => (
                    <div
                      key={`${ev.id}_${ev.start_datetime}_${i}`}
                      className="flex items-start gap-3 px-3 py-2 rounded-md text-sm"
                      style={{
                        background: 'var(--bg-secondary)',
                        borderLeft: `3px solid ${SOURCE_COLORS[ev.source_type] || '#6b7280'}`,
                      }}
                    >
                      <span
                        className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                        style={{
                          background: SOURCE_COLORS[ev.source_type] + '22',
                          color: SOURCE_COLORS[ev.source_type],
                        }}
                      >
                        {SOURCE_LABELS[ev.source_type] || ev.source_type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {ev.title}
                        </div>
                        {(ev.subject || ev.grade_level) && (
                          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                            {ev.subject}{ev.subject && ev.grade_level ? ' · ' : ''}{ev.grade_level && `Grade ${ev.grade_level}`}
                          </div>
                        )}
                      </div>
                      {ev.all_day === 0 && (
                        <span className="flex-shrink-0 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {fmtTime(ev.start_datetime)}{ev.end_datetime ? ` - ${fmtTime(ev.end_datetime)}` : ''}
                        </span>
                      )}
                      {ev.status === 'completed' && (
                        <span className="flex-shrink-0 text-[10px] font-bold" style={{ color: '#059669' }}>
                          DONE
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 text-[11px] text-right" style={{ color: 'var(--text-muted)' }}>
        {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} shown
      </div>
    </div>
  );
};

export default UnifiedCalendarView;
