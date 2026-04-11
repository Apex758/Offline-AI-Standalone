/**
 * useUnifiedCalendarFeed (Phase 5)
 *
 * React hook that fetches /api/calendar/unified for the current month and
 * returns a {date: events[]} dict suitable for the CompactCalendar widget.
 * Gates the fetch on teacherId presence to avoid the sidebar-render-before-auth
 * race that the original 4-prop CompactCalendar implementation had.
 */

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getTeacherId } from '../lib/teacherId';

export interface UnifiedFeedEvent {
  id: string;
  source_type: string;
  title: string;
  start_datetime: string;
  end_datetime?: string;
  status: string;
  color?: string;
  is_occurrence?: boolean;
}

export interface UseUnifiedCalendarFeedResult {
  eventsByDate: Record<string, UnifiedFeedEvent[]>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function startOfMonth(d: Date): string {
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}
function endOfMonth(d: Date): string {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).toISOString();
}

export function useUnifiedCalendarFeed(monthAnchor: Date): UseUnifiedCalendarFeedResult {
  const [events, setEvents] = useState<UnifiedFeedEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const teacherId = getTeacherId();

  useEffect(() => {
    if (!teacherId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    axios
      .get('http://localhost:8000/api/calendar/unified', {
        params: {
          teacher_id: teacherId,
          start: startOfMonth(monthAnchor),
          end: endOfMonth(monthAnchor),
        },
      })
      .then(res => {
        if (!cancelled) setEvents(res.data?.events ?? []);
      })
      .catch(err => {
        if (!cancelled) {
          setError(err?.message || 'Failed to load unified calendar');
          setEvents([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [monthAnchor.getFullYear(), monthAnchor.getMonth(), teacherId, tick]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, UnifiedFeedEvent[]> = {};
    for (const ev of events) {
      const day = (ev.start_datetime || '').slice(0, 10);
      if (!day) continue;
      if (!map[day]) map[day] = [];
      map[day].push(ev);
    }
    return map;
  }, [events]);

  return {
    eventsByDate,
    loading,
    error,
    refetch: () => setTick(t => t + 1),
  };
}
