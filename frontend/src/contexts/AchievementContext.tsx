import React, { createContext, useContext } from 'react';
import { useAchievements } from '../hooks/useAchievements';
import type {
  AchievementDefinition,
  EarnedAchievement,
  NewlyEarnedAchievement,
  TeacherRank,
  CategoryBreakdown,
  AchievementProgress,
} from '../types/achievement';

interface AchievementContextValue {
  definitions: AchievementDefinition[];
  earned: EarnedAchievement[];
  totalPoints: number;
  rank: TeacherRank | null;
  byCategory: Record<string, CategoryBreakdown>;
  progress: Record<string, AchievementProgress>;
  totalAvailable: number;
  pendingUnlocks: NewlyEarnedAchievement[];
  dismissUnlock: () => void;
  triggerCheck: () => void;
  isLoading: boolean;
}

const AchievementContext = createContext<AchievementContextValue>({
  definitions: [],
  earned: [],
  totalPoints: 0,
  rank: null,
  byCategory: {},
  progress: {},
  totalAvailable: 0,
  pendingUnlocks: [],
  dismissUnlock: () => {},
  triggerCheck: () => {},
  isLoading: true,
});

export function AchievementProvider({
  teacherId,
  children,
}: {
  teacherId: string | null;
  children: React.ReactNode;
}) {
  const achievements = useAchievements(teacherId);
  return (
    <AchievementContext.Provider value={achievements}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievementContext() {
  return useContext(AchievementContext);
}

export function useAchievementTrigger() {
  const { triggerCheck } = useContext(AchievementContext);
  return triggerCheck;
}
