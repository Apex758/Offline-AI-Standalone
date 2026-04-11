import { useState, useEffect, useCallback, useRef } from 'react';
import { achievementApi } from '../lib/achievementApi';
import type {
  AchievementDefinition,
  AchievementCheckResult,
  AchievementCollection,
  NewlyEarnedAchievement,
  EarnedAchievement,
  TeacherRank,
  CategoryBreakdown,
  AchievementProgress,
} from '../types/achievement';

interface UseAchievementsReturn {
  definitions: AchievementDefinition[];
  earned: EarnedAchievement[];
  totalPoints: number;
  rank: TeacherRank | null;
  byCategory: Record<string, CategoryBreakdown>;
  progress: Record<string, AchievementProgress>;
  totalAvailable: number;
  collections: AchievementCollection[];
  counts: Record<string, number>;
  showcase: string[];
  updateShowcase: (ids: string[]) => void;
  pendingUnlocks: NewlyEarnedAchievement[];
  dismissUnlock: () => void;
  triggerCheck: () => void;
  isLoading: boolean;
}

// One-time migration: clear the legacy `achievements-viewed-ids` localStorage
// entry. This key previously held a client-side filter that silently swallowed
// any achievement ID it contained — if the backend DB ever drifted from the
// localStorage list (via data imports, DB resets, cancelled checks, etc.) the
// filter would strip legitimate new-earnings and the popup would never fire.
// The backend's `newly_earned` is already authoritative, so this filter is
// removed. The migration flag prevents us from deleting user state twice.
const LEGACY_VIEWED_KEY = 'achievements-viewed-ids';
const VIEWED_MIGRATION_FLAG = 'achievements-viewed-migration-v1';
if (typeof window !== 'undefined' && !localStorage.getItem(VIEWED_MIGRATION_FLAG)) {
  localStorage.removeItem(LEGACY_VIEWED_KEY);
  localStorage.setItem(VIEWED_MIGRATION_FLAG, '1');
}

export function useAchievements(teacherId: string | null): UseAchievementsReturn {
  const [definitions, setDefinitions] = useState<AchievementDefinition[]>([]);
  const [earned, setEarned] = useState<EarnedAchievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [rank, setRank] = useState<TeacherRank | null>(null);
  const [byCategory, setByCategory] = useState<Record<string, CategoryBreakdown>>({});
  const [progress, setProgress] = useState<Record<string, AchievementProgress>>({});
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [collections, setCollections] = useState<AchievementCollection[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [showcase, setShowcase] = useState<string[]>([]);
  const [pendingUnlocks, setPendingUnlocks] = useState<NewlyEarnedAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  // Load definitions once on mount
  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    achievementApi.getDefinitions().then(defs => {
      if (!cancelled) setDefinitions(defs);
    }).catch(() => {});

    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, []);

  // Load showcase
  useEffect(() => {
    if (!teacherId) return;
    achievementApi.getShowcase(teacherId).then(ids => {
      if (mountedRef.current) setShowcase(ids);
    }).catch(() => {});
  }, [teacherId]);

  const applyCheckResult = useCallback((result: AchievementCheckResult) => {
    if (!mountedRef.current) return;
    setEarned(result.all_earned);
    setTotalPoints(result.total_points);
    setRank(result.rank);
    setByCategory(result.by_category);
    setProgress(result.progress);
    setTotalAvailable(result.total_available);
    setCollections(result.collections || []);
    setCounts(result.counts || {});

    if (result.newly_earned.length > 0) {
      setPendingUnlocks(prev => [...prev, ...result.newly_earned]);
    }
  }, []);

  // Run initial check on mount
  useEffect(() => {
    if (!teacherId) return;
    setIsLoading(true);
    achievementApi.check(teacherId)
      .then(result => {
        applyCheckResult(result);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [teacherId, applyCheckResult]);

  const triggerCheck = useCallback(() => {
    if (!teacherId) return;
    // Debounce 300ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      achievementApi.check(teacherId)
        .then(applyCheckResult)
        .catch(e => console.error('[Achievements] triggerCheck failed:', e));
    }, 300);
  }, [teacherId, applyCheckResult]);

  // Periodic fallback poll every 2 minutes — catches any achievements missed by triggerCheck
  useEffect(() => {
    if (!teacherId) return;
    const id = setInterval(() => {
      achievementApi.check(teacherId)
        .then(applyCheckResult)
        .catch(() => {});
    }, 2 * 60 * 1000);
    return () => clearInterval(id);
  }, [teacherId, applyCheckResult]);

  const dismissUnlock = useCallback(() => {
    setPendingUnlocks(prev => prev.length === 0 ? prev : prev.slice(1));
  }, []);

  const updateShowcaseFn = useCallback((ids: string[]) => {
    if (!teacherId) return;
    setShowcase(ids);
    achievementApi.updateShowcase(teacherId, ids).catch(() => {});
  }, [teacherId]);

  return {
    definitions,
    earned,
    totalPoints,
    rank,
    byCategory,
    progress,
    totalAvailable,
    collections,
    counts,
    showcase,
    updateShowcase: updateShowcaseFn,
    pendingUnlocks,
    dismissUnlock,
    triggerCheck,
    isLoading,
  };
}
