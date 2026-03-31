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

const VIEWED_KEY = 'achievements-viewed-ids';

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
      // Filter out already-viewed unlocks
      const viewedRaw = localStorage.getItem(VIEWED_KEY);
      const viewed: string[] = viewedRaw ? JSON.parse(viewedRaw) : [];
      const fresh = result.newly_earned.filter(a => !viewed.includes(a.achievement_id));
      if (fresh.length > 0) {
        setPendingUnlocks(prev => [...prev, ...fresh]);
      }
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
        .catch(() => {});
    }, 300);
  }, [teacherId, applyCheckResult]);

  const dismissUnlock = useCallback(() => {
    setPendingUnlocks(prev => {
      if (prev.length === 0) return prev;
      // Mark the first one as viewed
      const dismissed = prev[0];
      const viewedRaw = localStorage.getItem(VIEWED_KEY);
      const viewed: string[] = viewedRaw ? JSON.parse(viewedRaw) : [];
      if (!viewed.includes(dismissed.achievement_id)) {
        viewed.push(dismissed.achievement_id);
        localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
      }
      return prev.slice(1);
    });
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
