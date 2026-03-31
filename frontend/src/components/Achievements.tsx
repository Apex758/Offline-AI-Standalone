import React, { useState, useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Trophy01IconData from '@hugeicons/core-free-icons/Award01Icon';
import Lock01IconData from '@hugeicons/core-free-icons/LockIcon';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import StarIconData from '@hugeicons/core-free-icons/StarIcon';
import Medal01IconData from '@hugeicons/core-free-icons/Medal01Icon';
import ArrowDownIconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
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
import type { AchievementDefinition, AchievementCategory, AchievementRarity, NewlyEarnedAchievement } from '../types/achievement';

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
}

export default function Achievements({ tabId }: AchievementsProps) {
  const {
    definitions,
    earned,
    totalPoints,
    rank,
    byCategory,
    progress,
    totalAvailable,
    isLoading,
  } = useAchievementContext();
  const { settings } = useSettings();
  const tabColor = settings.tabColors['achievements'] || '#f59e0b';

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<AchievementRarity | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'earned' | 'locked'>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [headerHovered, setHeaderHovered] = useState(false);
  const [viewingAchievement, setViewingAchievement] = useState<NewlyEarnedAchievement | null>(null);

  const earnedIds = useMemo(() => new Set(earned.map(e => e.achievement_id)), [earned]);
  const earnedMap = useMemo(() => {
    const map: Record<string, string> = {};
    earned.forEach(e => { map[e.achievement_id] = e.earned_at; });
    return map;
  }, [earned]);

  const filteredDefinitions = useMemo(() => {
    return definitions.filter(d => {
      if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
      if (selectedRarity !== 'all' && d.rarity !== selectedRarity) return false;
      if (selectedStatus === 'earned' && !earnedIds.has(d.id)) return false;
      if (selectedStatus === 'locked' && earnedIds.has(d.id)) return false;
      return true;
    });
  }, [definitions, selectedCategory, selectedRarity, selectedStatus, earnedIds]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse" style={{ color: 'var(--dash-text-sub)' }}>Loading achievements...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: 'var(--tab-content-bg, var(--dash-bg))' }}>
      <div className="max-w-6xl mx-auto p-6 space-y-6">

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
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Points</div>
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
                width: 28,
                height: 28,
                backgroundColor: (headerHovered || filtersOpen) ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: `1px solid ${(headerHovered || filtersOpen) ? 'rgba(255,255,255,0.3)' : 'transparent'}`,
                opacity: (headerHovered || filtersOpen) ? 1 : 0,
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
              maxHeight: filtersOpen ? 400 : 0,
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
                          {s === 'all' ? 'All' : s === 'earned' ? 'Earned' : 'Locked'}
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
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--dash-text-sub)' }}>Category</span>
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
            </div>
          </div>
        </div>

        {/* Achievement grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative" style={{ isolation: 'isolate' }}>
          {sortedDefinitions.map((defn, i) => (
            <AchievementCard
              key={defn.id}
              definition={defn}
              isEarned={earnedIds.has(defn.id)}
              earnedAt={earnedMap[defn.id]}
              progress={progress[defn.id]}
              index={i}
              onView={(def, eAt) => setViewingAchievement({
                achievement_id: def.id,
                earned_at: eAt || '',
                name: def.name,
                description: def.description,
                category: def.category,
                icon_name: def.icon_name,
                rarity: def.rarity,
                points: def.points,
              })}
            />
          ))}
        </div>

        {/* View achievement modal */}
        <AchievementUnlockModal
          achievement={viewingAchievement}
          onDismiss={() => setViewingAchievement(null)}
          viewOnly
        />

        {sortedDefinitions.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--dash-text-sub)' }}>
            No achievements in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}


// Gradient stops per rarity — [light-from, light-to, dark-from, dark-to]
const RARITY_GRADIENTS: Record<AchievementRarity, [string, string, string, string]> = {
  common:    ['#6b7280', '#d1d5db', '#1f2937', '#4b5563'],
  uncommon:  ['#15803d', '#4ade80', '#14532d', '#16a34a'],
  rare:      ['#1d4ed8', '#60a5fa', '#1e3a8a', '#2563eb'],
  epic:      ['#6d28d9', '#c084fc', '#3b0764', '#7c3aed'],
  legendary: ['#b45309', '#fbbf24', '#78350f', '#d97706'],
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
  onView,
}: {
  definition: AchievementDefinition;
  isEarned: boolean;
  earnedAt?: string;
  progress?: { current: number; target: number };
  index: number;
  onView?: (def: AchievementDefinition, earnedAt?: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  // Keep in sync if theme changes
  React.useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark'))
    );
    obs.observe(document.documentElement, { attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const [gFrom, gTo, gDarkFrom, gDarkTo] = RARITY_GRADIENTS[definition.rarity];
  const gradientFrom = dark ? gDarkFrom : gFrom;
  const gradientTo   = dark ? gDarkTo   : gTo;
  const color        = RARITY_COLORS[definition.rarity];
  const bgIcon       = CATEGORY_ICONS[definition.category];
  const progressPercent = progress
    ? Math.min(100, Math.round((progress.current / progress.target) * 100))
    : 0;

  return (
    <div
      className="achievement-glare achievement-card-enter rounded-2xl overflow-hidden relative flex flex-col"
      onMouseEnter={() => isEarned && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => isEarned && onView?.(definition, earnedAt)}
      style={{
        animationDelay: `${Math.min(index * 40, 600)}ms`,
        minHeight: 180,
        background: isEarned
          ? `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`
          : dark
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
            : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
        border: isEarned
          ? `1px solid ${color}40`
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: hovered
          ? `0 24px 48px rgba(0,0,0,0.4), 0 0 32px ${color}40`
          : isEarned
            ? `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${color}20`
            : '0 4px 16px rgba(0,0,0,0.2)',
        transform: hovered ? 'scale(1.045) translateY(-5px)' : 'scale(1) translateY(0)',
        transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease',
        filter: isEarned ? 'none' : 'grayscale(0.65) brightness(0.8)',
        zIndex: hovered ? 2 : undefined,
        cursor: isEarned ? 'pointer' : 'default',
      }}
    >
      {/* Large watermark background icon */}
      <div
        className="absolute"
        style={{
          right: -10,
          bottom: -10,
          opacity: isEarned ? 0.12 : 0.07,
          pointerEvents: 'none',
        }}
      >
        <HugeiconsIcon icon={bgIcon as any} size={110} style={{ color: '#ffffff' }} />
      </div>

      {/* Inner glass overlay — dark mode only, earned only */}
      {isEarned && dark && (
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Card content */}
      <div className="relative flex flex-col h-full p-4 z-10">

        {/* Top row: index + rarity */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[11px] font-bold tracking-widest"
            style={{ color: isEarned ? 'rgba(255,255,255,0.55)' : 'rgba(128,128,128,0.6)' }}
          >
            {String(index + 1).padStart(2, '0')} /
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: isEarned ? 'rgba(255,255,255,0.2)' : `${color}25`,
              color: isEarned ? '#fff' : color,
              backdropFilter: 'blur(4px)',
            }}
          >
            {RARITY_LABELS[definition.rarity]}
          </span>
        </div>

        {/* Small icon badge */}
        <div
          className="flex items-center justify-center rounded-xl mb-3"
          style={{
            width: 36,
            height: 36,
            backgroundColor: isEarned ? 'rgba(255,255,255,0.2)' : 'rgba(128,128,128,0.12)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {isEarned
            ? <HugeiconsIcon icon={Medal01IconData} size={18} style={{ color: '#fff' }} />
            : <HugeiconsIcon icon={Lock01IconData} size={18} style={{ color: 'rgba(128,128,128,0.7)' }} />
          }
        </div>

        {/* Name */}
        <h4
          className="text-sm font-bold leading-tight mb-1"
          style={{ color: isEarned ? '#fff' : (dark ? 'rgba(200,200,200,0.6)' : 'rgba(60,60,60,0.7)') }}
        >
          {definition.name}
        </h4>

        {/* Description */}
        <p
          className="text-[11px] leading-snug flex-1"
          style={{ color: isEarned ? 'rgba(255,255,255,0.65)' : 'rgba(128,128,128,0.6)' }}
        >
          {definition.description}
        </p>

        {/* Bottom row */}
        <div className="mt-3">
          {/* Points */}
          <div className="flex items-center gap-1.5 mb-2">
            <HugeiconsIcon
              icon={StarIconData}
              size={11}
              style={{ color: isEarned ? 'rgba(255,255,255,0.7)' : 'rgba(128,128,128,0.5)' }}
            />
            <span
              className="text-[11px] font-semibold"
              style={{ color: isEarned ? 'rgba(255,255,255,0.7)' : 'rgba(128,128,128,0.5)' }}
            >
              {definition.points} pts
            </span>
          </div>

          {/* Achieved date */}
          {isEarned && earnedAt && (
            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Achieved on {new Date(earnedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          )}

          {/* Progress bar (locked only) */}
          {!isEarned && progress && (
            <>
              <div className="flex justify-between text-[10px] mb-1" style={{ color: 'rgba(128,128,128,0.6)' }}>
                <span>{progress.current}/{progress.target}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(128,128,128,0.2)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%`, backgroundColor: color }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
