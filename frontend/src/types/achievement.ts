export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type AchievementCategory =
  | 'content-creation'
  | 'student-management'
  | 'assessment'
  | 'attendance'
  | 'curriculum'
  | 'exploration'
  | 'power-user'
  | 'chat'
  | 'brain-dump'
  | 'analytics';

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon_name: string;
  rarity: AchievementRarity;
  points: number;
  check_key: string;
  check_value: number;
}

export interface EarnedAchievement {
  achievement_id: string;
  earned_at: string;
}

export interface NewlyEarnedAchievement extends EarnedAchievement {
  name: string;
  description: string;
  category: AchievementCategory;
  icon_name: string;
  rarity: AchievementRarity;
  points: number;
}

export interface TeacherRank {
  level: number;
  title: string;
  next_title: string | null;
  achievements_for_next: number | null;
}

export interface CategoryBreakdown {
  earned: number;
  total: number;
}

export interface AchievementProgress {
  current: number;
  target: number;
}

export interface AchievementCheckResult {
  newly_earned: NewlyEarnedAchievement[];
  all_earned: EarnedAchievement[];
  total_points: number;
  rank: TeacherRank;
  by_category: Record<string, CategoryBreakdown>;
  progress: Record<string, AchievementProgress>;
  total_available: number;
}

export interface AchievementStats {
  all_earned: EarnedAchievement[];
  total_points: number;
  rank: TeacherRank;
  by_category: Record<string, CategoryBreakdown>;
  total_available: number;
}
