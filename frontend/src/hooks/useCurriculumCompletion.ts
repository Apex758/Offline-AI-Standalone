// Phase 6: fetch the set of ELO / SCO strings this teacher has already
// covered, so generator dropdowns can tag them as "completed".
//
// Returns two Set<string>s with normalized (trimmed, collapsed) outcome text.
// Both sets are empty while loading or on error, so consumers can call
// `.has(text)` without null checks.

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { getTeacherId } from '../lib/teacherId';

interface UseCurriculumCompletionResult {
  completedELOs: Set<string>;
  completedSCOs: Set<string>;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

function normalize(text: string): string {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

export function useCurriculumCompletion(
  subject: string | undefined,
  gradeLevel: string | undefined,
): UseCurriculumCompletionResult {
  const [elos, setElos] = useState<string[]>([]);
  const [scos, setScos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!subject || !gradeLevel) {
      setElos([]);
      setScos([]);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    const teacherId = getTeacherId();
    setLoading(true);
    setError(null);
    axios
      .get(
        `http://localhost:8000/api/school-year/curriculum-completion/${encodeURIComponent(teacherId)}`,
        { params: { subject, grade_level: gradeLevel } },
      )
      .then(res => {
        if (cancelled) return;
        setElos(res.data?.completed_elos || []);
        setScos(res.data?.completed_scos || []);
      })
      .catch(e => {
        if (cancelled) return;
        setError(e?.message || 'Failed to load');
        setElos([]);
        setScos([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [subject, gradeLevel, refreshKey]);

  // Listen for cross-component invalidation events (fired by CurriculumTracker
  // after a milestone / checklist update) so the completion sets stay fresh
  // without a full tab refresh.
  useEffect(() => {
    const handler = () => setRefreshKey(k => k + 1);
    window.addEventListener('curriculum-completion-changed', handler);
    return () => window.removeEventListener('curriculum-completion-changed', handler);
  }, []);

  const completedELOs = useMemo(
    () => new Set(elos.map(normalize)),
    [elos],
  );
  const completedSCOs = useMemo(
    () => new Set(scos.map(normalize)),
    [scos],
  );

  return {
    completedELOs,
    completedSCOs,
    loading,
    error,
    refresh: () => setRefreshKey(k => k + 1),
  };
}
