import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import Trophy01IconData from '@hugeicons/core-free-icons/Award01Icon';
import Lock01IconData from '@hugeicons/core-free-icons/LockIcon';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import StarIconData from '@hugeicons/core-free-icons/StarIcon';
import Medal01IconData from '@hugeicons/core-free-icons/Medal01Icon';
import ArrowDownIconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import PinIconData from '@hugeicons/core-free-icons/PinIcon';
import QuestionIconData from '@hugeicons/core-free-icons/HelpCircleIcon';
// Category background icons
import ContentIconData from '@hugeicons/core-free-icons/PencilEdit01Icon';
import StudentIconData from '@hugeicons/core-free-icons/UserGroupIcon';
import AssessmentIconData from '@hugeicons/core-free-icons/TaskDone01Icon';
import AttendanceIconData from '@hugeicons/core-free-icons/Calendar01Icon';
import CurriculumIconData from '@hugeicons/core-free-icons/LibraryIcon';
import ExplorationIconData from '@hugeicons/core-free-icons/Compass01Icon';
import PowerIconData from '@hugeicons/core-free-icons/FlashIcon';
import ChatIconData from '@hugeicons/core-free-icons/AiChat01Icon';
import BrainIconData from '@hugeicons/core-free-icons/Brain01Icon';
import AnalyticsIconData from '@hugeicons/core-free-icons/Analytics01Icon';
import { useAchievementContext } from '../contexts/AchievementContext';
import { useSettings } from '../contexts/SettingsContext';
import AchievementUnlockModal from './modals/AchievementUnlockModal';
import { useRefetchOnActivation } from '../hooks/useRefetchOnActivation';
import TrophyDetailCard from './TrophyDetailCard';
import { getTrophyImageForTier, type TrophyTier } from '../assets/trophyImagesLazy';
import { getTrophyType } from '../config/trophyMap';
import LevelJourneyPath from './LevelJourneyPath';
import type { AchievementDefinition, AchievementCategory, AchievementRarity, AchievementTier, NewlyEarnedAchievement } from '../types/achievement';
import { DashboardSkeleton } from './ui/DashboardSkeleton';

const RARITY_COLORS: Record<AchievementRarity, string> = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
};

const RARITY_LABELS: Record<AchievementRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

// Simulated rarity percentages (single-user app — based on typical distribution)
const RARITY_PERCENTAGES: Record<AchievementRarity, string> = {
  common: '',
  uncommon: 'Top 45% of educators',
  rare: 'Top 20% of educators',
  epic: 'Top 8% of educators',
  legendary: 'Top 3% of educators',
};

const TIER_COLORS: Record<AchievementTier, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  diamond: '#b9f2ff',
};

const TIER_LABELS: Record<AchievementTier, string> = {
  bronze: 'I',
  silver: 'II',
  gold: 'III',
  diamond: 'IV',
};

// Impact stat labels for check_keys
const IMPACT_LABELS: Record<string, (n: number) => string> = {
  lesson_plans: (n) => `${n} lesson plan${n !== 1 ? 's' : ''} created`,
  quizzes: (n) => `${n} quiz${n !== 1 ? 'zes' : ''} created`,
  worksheets: (n) => `${n} worksheet${n !== 1 ? 's' : ''} created`,
  rubrics: (n) => `${n} rubric${n !== 1 ? 's' : ''} created`,
  presentations: (n) => `${n} presentation${n !== 1 ? 's' : ''} built`,
  students: (n) => `${n} student${n !== 1 ? 's' : ''} added`,
  quiz_grades: (n) => `${n} quiz${n !== 1 ? 'zes' : ''} graded`,
  worksheet_grades: (n) => `${n} worksheet${n !== 1 ? 's' : ''} graded`,
  attendance_records: (n) => `${n} attendance record${n !== 1 ? 's' : ''}`,
  attendance_dates: (n) => `${n} day${n !== 1 ? 's' : ''} tracked`,
  milestones_completed: (n) => `${n} milestone${n !== 1 ? 's' : ''} completed`,
  chat_conversations: (n) => `${n} conversation${n !== 1 ? 's' : ''} with PEARL`,
  chat_messages: (n) => `${n} message${n !== 1 ? 's' : ''} sent`,
  total_resources: (n) => `${n} total resource${n !== 1 ? 's' : ''} created`,
  total_generations: (n) => `${n} AI generation${n !== 1 ? 's' : ''}`,
  total_image_generations: (n) => `${n} image${n !== 1 ? 's' : ''} generated`,
  streak_days: (n) => `${n} day streak`,
  total_active_days: (n) => `${n} day${n !== 1 ? 's' : ''} active`,
  images: (n) => `${n} image${n !== 1 ? 's' : ''} created`,
  brain_dump_uses: (n) => `${n} brain dump${n !== 1 ? 's' : ''}`,
  distinct_tools: (n) => `${n} tool${n !== 1 ? 's' : ''} explored`,
  kindergarten_plans: (n) => `${n} early childhood plan${n !== 1 ? 's' : ''}`,
  multigrade_plans: (n) => `${n} multigrade plan${n !== 1 ? 's' : ''}`,
  cross_curricular_plans: (n) => `${n} integrated plan${n !== 1 ? 's' : ''}`,
  hidden_achievements_earned: (n) => `${n} secret${n !== 1 ? 's' : ''} found`,
};

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  'content-creation': 'Content Creation',
  'student-management': 'Student Management',
  'assessment': 'Assessment',
  'attendance': 'Attendance',
  'curriculum': 'Curriculum',
  'exploration': 'Exploration',
  'power-user': 'Power User',
  'chat': 'Ask PEARL',
  'brain-dump': 'Brain Dump',
  'analytics': 'Analytics',
};

const ALL_CATEGORIES: AchievementCategory[] = [
  'content-creation',
  'student-management',
  'assessment',
  'attendance',
  'curriculum',
  'exploration',
  'power-user',
  'chat',
  'brain-dump',
  'analytics',
];

interface AchievementsProps {
  tabId: string;
  savedData?: any;
  onDataChange?: (data: any) => void;
  isActive?: boolean;
}

export default function Achievements({ tabId, isActive = true }: AchievementsProps) {
  const { t } = useTranslation();
  const {
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
    updateShowcase,
    triggerCheck,
    isLoading,
  } = useAchievementContext();
  const { settings } = useSettings();

  useRefetchOnActivation(isActive, useCallback(() => { triggerCheck(); }, [triggerCheck]));
  const tabColor = settings.tabColors['achievements'] || '#f59e0b';

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<AchievementRarity | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'earned' | 'locked'>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [headerHovered, setHeaderHovered] = useState(false);
  const [viewingAchievement, setViewingAchievement] = useState<NewlyEarnedAchievement | null>(null);
  const [viewingTrophySrc, setViewingTrophySrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!viewingAchievement) { setViewingTrophySrc(undefined); return; }
    const tType = getTrophyType(viewingAchievement.achievement_id);
    if (!tType) { setViewingTrophySrc(undefined); return; }
    getTrophyImageForTier(tType, (viewingAchievement.tier ?? 'gold') as TrophyTier)
      .then(src => setViewingTrophySrc(src));
  }, [viewingAchievement?.achievement_id, viewingAchievement?.tier]); // eslint-disable-line react-hooks/exhaustive-deps

  const earnedIds = useMemo(() => new Set(earned.map(e => e.achievement_id)), [earned]);
  const earnedMap = useMemo(() => {
    const map: Record<string, string> = {};
    earned.forEach(e => { map[e.achievement_id] = e.earned_at; });
    return map;
  }, [earned]);

  // Filter: hidden achievements only show if earned
  const visibleDefinitions = useMemo(() => {
    return definitions.filter(d => !d.hidden || earnedIds.has(d.id));
  }, [definitions, earnedIds]);

  const hiddenCount = useMemo(() => {
    return definitions.filter(d => d.hidden && !earnedIds.has(d.id)).length;
  }, [definitions, earnedIds]);

  const filteredDefinitions = useMemo(() => {
    return visibleDefinitions.filter(d => {
      if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
      if (selectedRarity !== 'all' && d.rarity !== selectedRarity) return false;
      if (selectedStatus === 'earned' && !earnedIds.has(d.id)) return false;
      if (selectedStatus === 'locked' && earnedIds.has(d.id)) return false;
      return true;
    });
  }, [visibleDefinitions, selectedCategory, selectedRarity, selectedStatus, earnedIds]);

  // Sort: earned first, then by rarity (legendary first)
  const rarityOrder: Record<AchievementRarity, number> = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
  const sortedDefinitions = useMemo(() => {
    return [...filteredDefinitions].sort((a, b) => {
      const aEarned = earnedIds.has(a.id) ? 0 : 1;
      const bEarned = earnedIds.has(b.id) ? 0 : 1;
      if (aEarned !== bEarned) return aEarned - bEarned;
      // Earned: legendary first (high to low); Locked: common first (low to high)
      if (aEarned === 0) return rarityOrder[a.rarity] - rarityOrder[b.rarity];
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    });
  }, [filteredDefinitions, earnedIds]);

  const earnedCount = earned.length;
  const progressPercent = totalAvailable > 0 ? Math.round((earnedCount / totalAvailable) * 100) : 0;

  const toggleShowcase = (achievementId: string) => {
    if (showcase.includes(achievementId)) {
      updateShowcase(showcase.filter(id => id !== achievementId));
    } else if (showcase.length < 5) {
      updateShowcase([...showcase, achievementId]);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton accentColor={tabColor} />;
  }

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: 'var(--tab-content-bg, var(--dash-bg))' }}>
      <div className="max-w-[90rem] mx-auto px-4 py-6 space-y-6">

        {/* ========== TEMPORARY TROPHY PREVIEW — UNCOMMENT TO USE ==========
        <div style={{ background: '#111', borderRadius: 16, padding: 24 }}>
          <h2 style={{ color: '#fff', marginBottom: 16, fontSize: 18, fontWeight: 700 }}>Trophy Image Preview (TEMP)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {(['scroll','quill','mortarboard','scale','clipboard','milestone','compass','flame','chat-bubble','brain','bar-chart','owl','lightning'] as const).map(tType => (
              ['bronze','silver','gold','diamond'] as const).map(tier => {
                const src = getTrophyImageForTier(tType, tier);
                return (
                  <div key={`${tType}-${tier}`} style={{ textAlign: 'center', background: '#1a1a1e', borderRadius: 12, padding: 12 }}>
                    {src ? (
                      <img src={src} alt={`${tType} ${tier}`} style={{ width: 100, height: 100, objectFit: 'contain', margin: '0 auto' }} />
                    ) : (
                      <div style={{ width: 100, height: 100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>N/A</div>
                    )}
                    <div style={{ color: '#aaa', fontSize: 11, marginTop: 6 }}>{tType}</div>
                    <div style={{ color: tier === 'diamond' ? '#b9f2ff' : tier === 'gold' ? '#fbbf24' : tier === 'silver' ? '#c0c0c0' : '#cd7f32', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>{tier}</div>
                  </div>
                );
              })
            ).flat()}
          </div>
        </div>
        ========== END TEMPORARY TROPHY PREVIEW ========== */}

        {/* Header + collapsible filters */}
        <div
          className="rounded-2xl overflow-hidden shadow-lg"
          onMouseEnter={() => setHeaderHovered(true)}
          onMouseLeave={() => setHeaderHovered(false)}
        >
          {/* Themed gradient header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${tabColor}, ${tabColor}dd, ${tabColor}bb)` }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${tabColor}e6, ${tabColor}cc)` }} />
            {/* Decorative watermark */}
            <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none">
              <HugeiconsIcon icon={Trophy01IconData} size={140} style={{ color: '#fff' }} />
            </div>

            <div className="relative px-8 py-8">
              <div className="flex flex-wrap items-center gap-6">
                {/* Rank badge */}
                <div
                  className="flex items-center justify-center rounded-xl backdrop-blur-sm"
                  style={{
                    width: 64,
                    height: 64,
                    background: 'rgba(255,255,255,0.2)',
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <HugeiconsIcon icon={Trophy01IconData} size={32} style={{ color: '#fff' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-white">
                    {rank?.title || 'Newcomer'}
                  </h2>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Level {rank?.level || 1}
                    {rank?.next_title && (
                      <span> &middot; {rank.achievements_for_next! - earnedCount > 0
                        ? `${rank.achievements_for_next! - earnedCount} more to ${rank.next_title}`
                        : `Next: ${rank.next_title}`
                      }</span>
                    )}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{earnedCount}/{totalAvailable}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Unlocked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{totalPoints}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('achievements.points')}</div>
                  </div>
                  {/* Progress ring */}
                  <div className="relative" style={{ width: 56, height: 56 }}>
                    <svg width="56" height="56" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
                      <circle
                        cx="28" cy="28" r="24" fill="none"
                        stroke="#fff"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 24}`}
                        strokeDashoffset={`${2 * Math.PI * 24 * (1 - progressPercent / 100)}`}
                        transform="rotate(-90 28 28)"
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                      />
                    </svg>
                    <div
                      className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white"
                    >
                      {progressPercent}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle arrow — visible on hover */}
          <div className="relative flex justify-center py-2" style={{ background: `linear-gradient(to bottom, ${tabColor}bb, ${tabColor}99)` }}>
            <button
              onClick={() => setFiltersOpen(o => !o)}
              className="flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                width: 30,
                height: 30,
                backgroundColor: (headerHovered || filtersOpen) ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.3)',
                border: `1px solid rgba(255,255,255,0.5)`,
                opacity: 1,
                color: '#fff',
                transform: filtersOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease, opacity 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
              }}
              title={filtersOpen ? 'Hide filters' : 'Show filters'}
            >
              <HugeiconsIcon icon={ArrowDownIconData} size={14} />
            </button>
          </div>

          {/* Collapsible filter panel */}
          <div
            style={{
              maxHeight: filtersOpen ? 700 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
            }}
          >
            <div
              className="mx-4 mb-4 rounded-xl p-4 space-y-3"
              style={{ border: '1px solid var(--dash-border, #333)', backgroundColor: 'var(--dash-bg, #111)' }}
            >
              {/* Row 1: two columns — Status | Rarity */}
              <div className="grid grid-cols-2 gap-4">
                {/* Status column */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--dash-text-sub)' }}>Status</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['all', 'earned', 'locked'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedStatus(s)}
                        className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                        style={{
                          backgroundColor: selectedStatus === s ? `${tabColor}20` : 'transparent',
                          color: selectedStatus === s ? tabColor : 'var(--dash-text-sub)',
                          border: `1px solid ${selectedStatus === s ? `${tabColor}50` : 'var(--dash-border, #333)'}`,
                        }}
                      >
                        <span className="inline-flex items-center gap-1">
                          {s === 'earned' && <HugeiconsIcon icon={Tick01IconData} size={12} />}
                          {s === 'locked' && <HugeiconsIcon icon={Lock01IconData} size={12} />}
                          {s === 'all' ? 'All' : s === 'earned' ? t('achievements.earned') : 'Locked'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rarity column */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--dash-text-sub)' }}>Rarity</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map(r => {
                      const color = r === 'all' ? tabColor : RARITY_COLORS[r as AchievementRarity];
                      const isActive = selectedRarity === r;
                      return (
                        <button
                          key={r}
                          onClick={() => setSelectedRarity(r)}
                          className="px-3 py-1 rounded-full text-xs font-semibold transition-all capitalize"
                          style={{
                            backgroundColor: isActive ? `${color}20` : 'transparent',
                            color: isActive ? color : 'var(--dash-text-sub)',
                            border: `1px solid ${isActive ? `${color}50` : 'var(--dash-border, #333)'}`,
                          }}
                        >
                          {r === 'all' ? 'All Rarities' : RARITY_LABELS[r as AchievementRarity]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px" style={{ backgroundColor: 'var(--dash-border, #333)' }} />

              {/* Row 2: Category (full width) */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--dash-text-sub)' }}>{t('achievements.category')}</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: selectedCategory === 'all' ? `${tabColor}20` : 'transparent',
                      color: selectedCategory === 'all' ? tabColor : 'var(--dash-text-sub)',
                      border: `1px solid ${selectedCategory === 'all' ? `${tabColor}50` : 'var(--dash-border, #333)'}`,
                    }}
                  >
                    All
                  </button>
                  {ALL_CATEGORIES.map(cat => {
                    const catData = byCategory[cat];
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                        style={{
                          backgroundColor: isActive ? `${tabColor}20` : 'transparent',
                          color: isActive ? tabColor : 'var(--dash-text-sub)',
                          border: `1px solid ${isActive ? `${tabColor}50` : 'var(--dash-border, #333)'}`,
                        }}
                      >
                        {CATEGORY_LABELS[cat]}{catData ? ` ${catData.earned}/${catData.total}` : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active filter summary */}
              {(selectedCategory !== 'all' || selectedRarity !== 'all' || selectedStatus !== 'all') && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>
                    Showing {filteredDefinitions.length} of {totalAvailable}
                  </span>
                  <button
                    onClick={() => { setSelectedCategory('all'); setSelectedRarity('all'); setSelectedStatus('all'); }}
                    className="text-xs underline transition-opacity hover:opacity-70"
                    style={{ color: tabColor }}
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* Collections */}
              {collections.length > 0 && (
                <>
                  <div className="h-px" style={{ backgroundColor: 'var(--dash-border, #333)' }} />
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--dash-text-sub)' }}>{t('achievements.collections')}</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                      {collections.map(coll => {
                        const pct = Math.round((coll.earned_count / coll.total_count) * 100);
                        return (
                          <div
                            key={coll.id}
                            className="rounded-lg p-2.5 transition-all"
                            style={{
                              border: `1px solid ${coll.completed ? `${tabColor}50` : 'var(--dash-border, #333)'}`,
                              backgroundColor: coll.completed ? `${tabColor}10` : 'transparent',
                            }}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-bold truncate" style={{ color: coll.completed ? tabColor : 'var(--dash-text)' }}>
                                {coll.name}
                              </span>
                              <span className="text-[10px] font-semibold ml-1 shrink-0" style={{ color: 'var(--dash-text-sub)' }}>
                                {coll.earned_count}/{coll.total_count}
                              </span>
                            </div>
                            <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--dash-border, #333)' }}>
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: coll.completed ? tabColor : 'var(--dash-text-sub)',
                                }}
                              />
                            </div>
                            {coll.completed && (
                              <div className="mt-1 text-[9px] font-semibold" style={{ color: tabColor }}>
                                Complete!
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Achievement grid + Journey path */}
        <div className="flex gap-5 items-start">
          {/* Cards — 65% */}
          <div className="min-w-0" style={{ flex: '0 0 65%' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 relative" style={{ isolation: 'isolate' }}>
              {sortedDefinitions.map((defn, i) => (
                <AchievementCard
                  key={defn.id}
                  definition={defn}
                  isEarned={earnedIds.has(defn.id)}
                  earnedAt={earnedMap[defn.id]}
                  progress={progress[defn.id]}
                  index={i}
                  impactCount={counts[defn.check_key]}
                  isPinned={showcase.includes(defn.id)}
                  onTogglePin={() => toggleShowcase(defn.id)}
                  canPin={showcase.length < 5 || showcase.includes(defn.id)}
                  onView={(def, eAt) => setViewingAchievement({
                    achievement_id: def.id,
                    earned_at: eAt || '',
                    name: def.name,
                    description: def.description,
                    category: def.category,
                    icon_name: def.icon_name,
                    rarity: def.rarity,
                    points: def.points,
                    tier: def.tier,
                  })}
                />
              ))}
            </div>

            {/* Hidden achievements hint */}
            {hiddenCount > 0 && (
              <div
                className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl"
                style={{ border: '1px dashed var(--dash-border, #333)', color: 'var(--dash-text-sub)' }}
              >
                <HugeiconsIcon icon={QuestionIconData} size={16} />
                <span className="text-xs">
                  {hiddenCount} secret achievement{hiddenCount !== 1 ? 's' : ''} remaining — keep exploring to discover them!
                </span>
              </div>
            )}
          </div>

          {/* Journey path — right side 35%, sticky */}
          <div className="hidden xl:block sticky top-6" style={{ flex: '0 0 35%' }}>
            <LevelJourneyPath
              rank={rank}
              earnedCount={earnedCount}
              tabColor={tabColor}
            />
          </div>
        </div>

        {/* View achievement detail — use TrophyDetailCard when image available, else fallback */}
        {viewingAchievement && (viewingTrophySrc ? (
          <TrophyDetailCard
            achievement={viewingAchievement}
            trophyImageSrc={viewingTrophySrc}
            earnedAt={viewingAchievement.earned_at}
            onClose={() => setViewingAchievement(null)}
          />
        ) : (
          <AchievementUnlockModal
            achievement={viewingAchievement}
            onDismiss={() => setViewingAchievement(null)}
            viewOnly
          />
        ))}

        {sortedDefinitions.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--dash-text-sub)' }}>
            No achievements in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}


// Rarity theme for glass cards
const RARITY_GLASS_THEME: Record<AchievementRarity, {
  primary: string; accent: string; glow: string; badgeBg: string; badgeBorder: string; badgeText: string;
  bgFrom: string; bgMid: string; bgTo: string;
  bgLightFrom: string; bgLightMid: string; bgLightTo: string;
}> = {
  common:    { primary: '#9ca3af', accent: '#d1d5db', glow: 'rgba(156,163,175,0.10)', badgeBg: 'rgba(156,163,175,0.18)', badgeBorder: 'rgba(156,163,175,0.32)', badgeText: '#d1d5db', bgFrom: '#1e1e22', bgMid: '#16161a', bgTo: '#101014', bgLightFrom: '#6b7280', bgLightMid: '#555d6a', bgLightTo: '#414852' },
  uncommon:  { primary: '#22c55e', accent: '#86efac', glow: 'rgba(34,197,94,0.10)',   badgeBg: 'rgba(34,197,94,0.18)',   badgeBorder: 'rgba(34,197,94,0.32)',   badgeText: '#86efac', bgFrom: '#0a1f14', bgMid: '#081a10', bgTo: '#05120b', bgLightFrom: '#22c55e', bgLightMid: '#189a48', bgLightTo: '#15803d' },
  rare:      { primary: '#3b82f6', accent: '#93c5fd', glow: 'rgba(59,130,246,0.10)',  badgeBg: 'rgba(59,130,246,0.18)',  badgeBorder: 'rgba(59,130,246,0.32)',  badgeText: '#93c5fd', bgFrom: '#0a1428', bgMid: '#08101e', bgTo: '#050b16', bgLightFrom: '#3b82f6', bgLightMid: '#2563eb', bgLightTo: '#1d4ed8' },
  epic:      { primary: '#a855f7', accent: '#c4b5fd', glow: 'rgba(139,92,246,0.10)',  badgeBg: 'rgba(139,92,246,0.18)',  badgeBorder: 'rgba(139,92,246,0.32)',  badgeText: '#c4b5fd', bgFrom: '#1a0a2e', bgMid: '#12081e', bgTo: '#0c0516', bgLightFrom: '#a855f7', bgLightMid: '#8b5cf6', bgLightTo: '#7c3aed' },
  legendary: { primary: '#eca830', accent: '#f5d485', glow: 'rgba(236,168,48,0.10)',  badgeBg: 'rgba(236,168,48,0.18)',  badgeBorder: 'rgba(236,168,48,0.32)',  badgeText: '#f5d485', bgFrom: '#1e1508', bgMid: '#181006', bgTo: '#120c04', bgLightFrom: '#d97706', bgLightMid: '#b45309', bgLightTo: '#92400e' },
};

const CATEGORY_ICONS: Record<AchievementCategory, object> = {
  'content-creation':   ContentIconData,
  'student-management': StudentIconData,
  'assessment':         AssessmentIconData,
  'attendance':         AttendanceIconData,
  'curriculum':         CurriculumIconData,
  'exploration':        ExplorationIconData,
  'power-user':         PowerIconData,
  'chat':               ChatIconData,
  'brain-dump':         BrainIconData,
  'analytics':          AnalyticsIconData,
};

function AchievementCard({
  definition,
  isEarned,
  earnedAt,
  progress,
  index,
  impactCount,
  isPinned,
  onTogglePin,
  canPin,
  onView,
}: {
  definition: AchievementDefinition;
  isEarned: boolean;
  earnedAt?: string;
  progress?: { current: number; target: number };
  index: number;
  impactCount?: number;
  isPinned: boolean;
  onTogglePin: () => void;
  canPin: boolean;
  onView?: (def: AchievementDefinition, earnedAt?: string) => void;
}) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  React.useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark'))
    );
    obs.observe(document.documentElement, { attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const theme = RARITY_GLASS_THEME[definition.rarity];
  const color = RARITY_COLORS[definition.rarity];
  const bgIcon = CATEGORY_ICONS[definition.category];
  const progressPercent = progress
    ? Math.min(100, Math.round((progress.current / progress.target) * 100))
    : 0;
  const isHiddenEarned = definition.hidden && isEarned;
  const tierColor = definition.tier ? TIER_COLORS[definition.tier] : null;
  const rarityPct = RARITY_PERCENTAGES[definition.rarity];
  const impactLabel = isEarned && impactCount != null && impactCount > 0 && IMPACT_LABELS[definition.check_key]
    ? IMPACT_LABELS[definition.check_key](impactCount)
    : null;

  // Split name for gradient accent on last word(s)
  const words = definition.name.split(' ');
  const midpoint = Math.max(1, Math.ceil(words.length / 2));
  const nameLine1 = words.slice(0, midpoint).join(' ');
  const nameLine2 = words.slice(midpoint).join(' ');

  const dateStr = earnedAt
    ? new Date(earnedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <div
      className="achievement-card-enter relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => isEarned && onView?.(definition, earnedAt)}
      style={{
        animationDelay: `${Math.min(index * 40, 600)}ms`,
        borderRadius: 24,
        background: dark
          ? `linear-gradient(145deg, ${theme.bgFrom} 0%, ${theme.bgMid} 40%, ${theme.bgTo} 100%)`
          : `linear-gradient(145deg, ${theme.bgLightFrom} 0%, ${theme.bgLightMid} 40%, ${theme.bgLightTo} 100%)`,
        border: dark
          ? `1px solid ${isEarned ? `${theme.primary}25` : 'rgba(255,255,255,0.07)'}`
          : `1px solid ${isEarned ? `${theme.primary}30` : 'rgba(0,0,0,0.06)'}`,
        boxShadow: hovered
          ? dark
            ? `0 0 0 1px rgba(255,255,255,0.07) inset, 0 40px 80px rgba(0,0,0,0.65), 0 0 80px ${theme.glow.replace('0.10', '0.20')}`
            : `0 40px 80px rgba(0,0,0,0.15), 0 0 60px ${theme.glow.replace('0.10', '0.15')}`
          : dark
            ? `0 0 0 1px rgba(255,255,255,0.04) inset, 0 20px 50px rgba(0,0,0,0.45), 0 0 40px ${theme.glow}`
            : `0 20px 50px rgba(0,0,0,0.08), 0 0 30px ${theme.glow}`,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
        filter: isEarned ? 'none' : (dark ? 'grayscale(0.6) brightness(0.55)' : 'grayscale(0.5) brightness(0.7)'),
        zIndex: hovered ? 2 : undefined,
        cursor: isEarned ? 'pointer' : 'default',
      }}
    >
      {(() => {
        // Theme-aware color helpers
        // Both modes: white text — light mode uses text-shadow for contrast against lighter areas
        const txtShadow = dark ? 'none' : '0 1px 4px rgba(0,0,0,0.5)';
        const textPrimary = '#fff';
        const textMuted = 'rgba(255,255,255,0.8)';
        const textSub = 'rgba(255,255,255,0.75)';
        const textLabel = 'rgba(255,255,255,0.8)';
        const textFooter = 'rgba(255,255,255,0.8)';
        const lineDivider = 'rgba(255,255,255,0.12)';
        const iconBoxBg = 'rgba(255,255,255,0.1)';
        const iconBoxBorder = 'rgba(255,255,255,0.15)';
        const iconColor = 'rgba(255,255,255,0.75)';
        const iconLockedColor = 'rgba(255,255,255,0.35)';
        const watermarkColor = '#ffffff';
        const shineBg = dark
          ? 'linear-gradient(180deg, rgba(255,255,255,0.055) 0%, transparent 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)';

        return <>
          {/* Shine overlay */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: shineBg, borderRadius: '24px 24px 0 0', pointerEvents: 'none' }} />

          {/* Glow orb */}
          <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, ${theme.glow.replace('0.10', dark ? '0.18' : '0.25')} 0%, transparent 70%)`, top: -80, right: -60, pointerEvents: 'none' }} />

          {/* Category watermark */}
          <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: isEarned ? 0.06 : 0.03, pointerEvents: 'none' }}>
            <HugeiconsIcon icon={bgIcon as any} size={90} style={{ color: watermarkColor }} />
          </div>

          {/* Pin button (earned, on hover) */}
          {isEarned && hovered && (
            <button
              className="absolute top-3 right-3 z-20 flex items-center justify-center rounded-full transition-all"
              onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
              title={isPinned ? 'Unpin from showcase' : canPin ? 'Pin to showcase' : 'Showcase full (5 max)'}
              style={{
                width: 26, height: 26,
                backgroundColor: isPinned ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.2)',
                border: `1px solid ${isPinned ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)'}`,
                opacity: canPin || isPinned ? 1 : 0.4,
                cursor: canPin || isPinned ? 'pointer' : 'not-allowed',
              }}
            >
              <HugeiconsIcon icon={PinIconData} size={12} style={{ color: '#fff' }} />
            </button>
          )}

          {/* Body */}
          <div style={{ position: 'relative', zIndex: 2, padding: '22px 22px 0', textShadow: txtShadow }}>
            {/* Top row: number + badges */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 400, color: textMuted, letterSpacing: '0.06em' }}>
                  No. {String(index + 1).padStart(2, '0')}
                </span>
                {definition.tier && (
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, backgroundColor: `${tierColor}25`, color: tierColor!, border: `1px solid ${tierColor}40` }}>
                    {TIER_LABELS[definition.tier]}
                  </span>
                )}
                {isHiddenEarned && (
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 100, backgroundColor: '#ffd70025', color: '#ffd700', border: '1px solid #ffd70040', letterSpacing: '0.1em' }}>
                    SECRET
                  </span>
                )}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 100, padding: '4px 11px', backdropFilter: 'blur(8px)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' as const, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  {RARITY_LABELS[definition.rarity]}
                </span>
              </div>
            </div>

            {/* Icon */}
            <div style={{ width: 40, height: 40, borderRadius: 12, background: iconBoxBg, border: `1px solid ${iconBoxBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              {isEarned
                ? <HugeiconsIcon icon={Medal01IconData} size={18} style={{ color: iconColor }} />
                : <HugeiconsIcon icon={Lock01IconData} size={18} style={{ color: iconLockedColor }} />
              }
            </div>

            {/* Title */}
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: textPrimary, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 6 }}>
              {nameLine1}{nameLine2 && <>{' '}<span style={{ color: theme.accent, textShadow: dark ? 'none' : `0 1px 4px rgba(0,0,0,0.5)` }}>{nameLine2}</span></>}
            </div>

            {/* Description */}
            <div style={{ fontSize: 12, fontWeight: 400, color: textSub, lineHeight: 1.65, marginBottom: 20 }}>
              {definition.description}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: lineDivider, marginBottom: 16 }} />

            {/* Stats row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', paddingBottom: 20 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 3 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: theme.accent }}>
                  +{definition.points} pts
                </span>
                <span style={{ fontSize: 9.5, fontWeight: 500, color: textLabel, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{t('achievements.earned')}</span>
              </div>

              {isEarned && impactLabel ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 3, paddingLeft: 12, borderLeft: `1px solid ${lineDivider}` }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: textPrimary, whiteSpace: 'nowrap' as const }}>{impactCount}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 500, color: textLabel, letterSpacing: '0.08em', textTransform: 'uppercase' as const, lineHeight: 1.3, whiteSpace: 'pre-line' as const }}>{definition.check_key.replace(/_/g, '\n')}</span>
                </div>
              ) : !isEarned && progress ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 3, paddingLeft: 12, borderLeft: `1px solid ${lineDivider}` }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: textPrimary, whiteSpace: 'nowrap' as const }}>{progress.current}/{progress.target}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 500, color: textLabel, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{t('achievements.progress')}</span>
                </div>
              ) : null}

              {rarityPct && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 3, paddingLeft: 12, borderLeft: `1px solid ${lineDivider}` }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: textPrimary, whiteSpace: 'nowrap' as const }}>{rarityPct.replace(' of educators', '')}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 500, color: textLabel, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Educators</span>
                </div>
              )}
            </div>

            {/* Progress bar (locked only) */}
            {!isEarned && progress && (
              <div style={{ paddingBottom: 16 }}>
                <div style={{ height: 3, borderRadius: 100, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 100, width: `${progressPercent}%`, background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textShadow: txtShadow }}>
            <span style={{ fontSize: 10.5, fontWeight: 400, color: textFooter, letterSpacing: '0.03em' }}>
              {isEarned && dateStr ? dateStr : !isEarned ? `${progressPercent}% complete` : ''}
            </span>
            {isPinned && isEarned && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: 500, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.8)' }} />
                Showcased
              </div>
            )}
          </div>
        </>;
      })()}
    </div>
  );
}
