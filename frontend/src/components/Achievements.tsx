import React, { useState, useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Trophy01IconData from '@hugeicons/core-free-icons/Award01Icon';
import Lock01IconData from '@hugeicons/core-free-icons/LockIcon';
import StarIconData from '@hugeicons/core-free-icons/StarIcon';
import Medal01IconData from '@hugeicons/core-free-icons/Medal01Icon';
import { useAchievementContext } from '../contexts/AchievementContext';
import type { AchievementDefinition, AchievementCategory, AchievementRarity } from '../types/achievement';

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
};

const ALL_CATEGORIES: AchievementCategory[] = [
  'content-creation',
  'student-management',
  'assessment',
  'attendance',
  'curriculum',
  'exploration',
  'power-user',
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

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  const earnedIds = useMemo(() => new Set(earned.map(e => e.achievement_id)), [earned]);
  const earnedMap = useMemo(() => {
    const map: Record<string, string> = {};
    earned.forEach(e => { map[e.achievement_id] = e.earned_at; });
    return map;
  }, [earned]);

  const filteredDefinitions = useMemo(() => {
    if (selectedCategory === 'all') return definitions;
    return definitions.filter(d => d.category === selectedCategory);
  }, [definitions, selectedCategory]);

  // Sort: earned first, then by rarity (legendary first)
  const rarityOrder: Record<AchievementRarity, number> = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
  const sortedDefinitions = useMemo(() => {
    return [...filteredDefinitions].sort((a, b) => {
      const aEarned = earnedIds.has(a.id) ? 0 : 1;
      const bEarned = earnedIds.has(b.id) ? 0 : 1;
      if (aEarned !== bEarned) return aEarned - bEarned;
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
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

        {/* Header */}
        <div className="widget-glass rounded-2xl p-6">
          <div className="flex flex-wrap items-center gap-6">
            {/* Rank badge */}
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 64,
                height: 64,
                background: 'linear-gradient(135deg, #f59e0b20, #f59e0b10)',
                border: '2px solid #f59e0b40',
              }}
            >
              <HugeiconsIcon icon={Trophy01IconData} size={32} style={{ color: '#f59e0b' }} />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold" style={{ color: 'var(--dash-text)' }}>
                {rank?.title || 'Newcomer'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--dash-text-sub)' }}>
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
                <div className="text-2xl font-bold" style={{ color: 'var(--dash-text)' }}>{earnedCount}/{totalAvailable}</div>
                <div className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>Unlocked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{totalPoints}</div>
                <div className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>Points</div>
              </div>
              {/* Progress ring */}
              <div className="relative" style={{ width: 56, height: 56 }}>
                <svg width="56" height="56" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="var(--dash-border, #333)" strokeWidth="4" />
                  <circle
                    cx="28" cy="28" r="24" fill="none"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - progressPercent / 100)}`}
                    transform="rotate(-90 28 28)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <div
                  className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                  style={{ color: 'var(--dash-text)' }}
                >
                  {progressPercent}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              backgroundColor: selectedCategory === 'all' ? '#f59e0b20' : 'var(--dash-bg)',
              color: selectedCategory === 'all' ? '#f59e0b' : 'var(--dash-text-sub)',
              border: `1px solid ${selectedCategory === 'all' ? '#f59e0b40' : 'var(--dash-border, #333)'}`,
            }}
          >
            All ({totalAvailable})
          </button>
          {ALL_CATEGORIES.map(cat => {
            const catData = byCategory[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  backgroundColor: selectedCategory === cat ? '#f59e0b20' : 'var(--dash-bg)',
                  color: selectedCategory === cat ? '#f59e0b' : 'var(--dash-text-sub)',
                  border: `1px solid ${selectedCategory === cat ? '#f59e0b40' : 'var(--dash-border, #333)'}`,
                }}
              >
                {CATEGORY_LABELS[cat]} {catData ? `(${catData.earned}/${catData.total})` : ''}
              </button>
            );
          })}
        </div>

        {/* Achievement grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedDefinitions.map(defn => (
            <AchievementCard
              key={defn.id}
              definition={defn}
              isEarned={earnedIds.has(defn.id)}
              earnedAt={earnedMap[defn.id]}
              progress={progress[defn.id]}
            />
          ))}
        </div>

        {sortedDefinitions.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--dash-text-sub)' }}>
            No achievements in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}


function AchievementCard({
  definition,
  isEarned,
  earnedAt,
  progress,
}: {
  definition: AchievementDefinition;
  isEarned: boolean;
  earnedAt?: string;
  progress?: { current: number; target: number };
}) {
  const color = RARITY_COLORS[definition.rarity];
  const progressPercent = progress ? Math.min(100, Math.round((progress.current / progress.target) * 100)) : 0;

  return (
    <div
      className="widget-glass rounded-xl p-4 relative overflow-hidden transition-all duration-300"
      style={{
        opacity: isEarned ? 1 : 0.55,
        filter: isEarned ? 'none' : 'grayscale(0.7)',
        border: isEarned ? `1px solid ${color}50` : '1px solid var(--dash-border, #333)',
        boxShadow: isEarned ? `0 0 20px ${color}15` : 'none',
      }}
    >
      {/* Rarity badge */}
      <div
        className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{
          backgroundColor: `${color}20`,
          color,
        }}
      >
        {RARITY_LABELS[definition.rarity]}
      </div>

      {/* Icon */}
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 40,
            height: 40,
            background: isEarned ? `${color}15` : 'var(--dash-bg)',
          }}
        >
          {isEarned ? (
            <HugeiconsIcon icon={Medal01IconData} size={22} style={{ color }} />
          ) : (
            <HugeiconsIcon icon={Lock01IconData} size={22} style={{ color: 'var(--dash-text-sub)' }} />
          )}
        </div>
      </div>

      {/* Name + description */}
      <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--dash-text)' }}>
        {definition.name}
      </h4>
      <p className="text-xs mb-2" style={{ color: 'var(--dash-text-sub)' }}>
        {definition.description}
      </p>

      {/* Points */}
      <div className="flex items-center gap-2 mb-2">
        <HugeiconsIcon icon={StarIconData} size={12} style={{ color: '#f59e0b' }} />
        <span className="text-xs font-semibold" style={{ color: 'var(--dash-text-sub)' }}>
          {definition.points} pts
        </span>
      </div>

      {/* Progress bar (only for unearned) */}
      {!isEarned && progress && (
        <div className="mt-2">
          <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--dash-text-sub)' }}>
            <span>{progress.current}/{progress.target}</span>
            <span>{progressPercent}%</span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--dash-border, #333)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>
      )}

      {/* Earned date */}
      {isEarned && earnedAt && (
        <div className="text-[10px] mt-2" style={{ color: 'var(--dash-text-sub)' }}>
          Earned {new Date(earnedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
