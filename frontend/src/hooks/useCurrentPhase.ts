import { useState, useEffect } from 'react';
import axios from 'axios';
import { parseISO, differenceInCalendarDays, isWithinInterval } from 'date-fns';
import type { AcademicPhase } from '../types/insights';

// Color maps reused from PhaseHistoryNav
const PHASE_TYPE_COLORS: Record<string, string> = {
  term_1_early: '#3b82f6',
  term_1_midterm_prep: '#f97316',
  term_1_midterm: '#ef4444',
  term_1_late: '#6366f1',
  christmas_break: '#eab308',
  term_2_early: '#22c55e',
  term_2_midterm_prep: '#f97316',
  term_2_midterm: '#ef4444',
  term_2_late: '#14b8a6',
  easter_break: '#a855f7',
  term_3_early: '#06b6d4',
  term_3_late: '#0ea5e9',
  end_of_year_exam: '#ef4444',
  summer_vacation: '#84cc16',
};

const SEMESTER_COLORS: Record<string, string> = {
  'Semester 1': '#3b82f6',
  'Semester 2': '#22c55e',
};

function phaseColor(phaseKey: string, semester: string | null): string {
  if (PHASE_TYPE_COLORS[phaseKey]) return PHASE_TYPE_COLORS[phaseKey];
  if (semester) return SEMESTER_COLORS[semester] || '#6b7280';
  return '#6b7280';
}

export interface CurrentPhaseInfo {
  id: string;
  phase_key: string;
  phase_label: string;
  semester: string | null;
  start_date: string;
  end_date: string;
  days_remaining: number;
  color: string;
}

export function useCurrentPhase(teacherId: string) {
  const [currentPhase, setCurrentPhase] = useState<CurrentPhaseInfo | null>(null);
  const [allPhases, setAllPhases] = useState<AcademicPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teacherId) { setLoading(false); return; }

    let cancelled = false;

    axios.get(`/api/teacher-metrics/academic-phases?teacher_id=${encodeURIComponent(teacherId)}`)
      .then(res => {
        if (cancelled) return;
        const phases: AcademicPhase[] = res.data.phases || [];
        setAllPhases(phases);

        const today = new Date();
        const active = phases.find(p => {
          try {
            return isWithinInterval(today, { start: parseISO(p.start_date), end: parseISO(p.end_date) });
          } catch { return false; }
        });

        if (active) {
          const daysLeft = differenceInCalendarDays(parseISO(active.end_date), today);
          setCurrentPhase({
            id: active.id,
            phase_key: active.phase_key,
            phase_label: active.phase_label,
            semester: active.semester,
            start_date: active.start_date,
            end_date: active.end_date,
            days_remaining: Math.max(0, daysLeft),
            color: phaseColor(active.phase_key, active.semester),
          });
        } else {
          setCurrentPhase(null);
        }
      })
      .catch(err => {
        if (cancelled) return;
        setError(err?.message || 'Failed to load phases');
        setCurrentPhase(null);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [teacherId]);

  return { currentPhase, allPhases, loading, error };
}
