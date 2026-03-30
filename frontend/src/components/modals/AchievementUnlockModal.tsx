import React, { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Trophy01IconData from '@hugeicons/core-free-icons/Award01Icon';
import type { NewlyEarnedAchievement, AchievementRarity } from '../../types/achievement';

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

interface AchievementUnlockModalProps {
  achievement: NewlyEarnedAchievement | null;
  onDismiss: () => void;
}

export default function AchievementUnlockModal({ achievement, onDismiss }: AchievementUnlockModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      requestAnimationFrame(() => setVisible(true));
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 400);
      }, 8000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  const color = RARITY_COLORS[achievement.rarity];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={() => { setVisible(false); setTimeout(onDismiss, 400); }}
    >
      {/* Confetti particles */}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes achievement-glow {
          0%, 100% { box-shadow: 0 0 30px ${color}40, 0 0 60px ${color}20; }
          50% { box-shadow: 0 0 50px ${color}60, 0 0 100px ${color}30; }
        }
        @keyframes badge-pop {
          0% { transform: scale(0) rotate(-30deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .confetti-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          animation: confetti-fall linear forwards;
          pointer-events: none;
        }
      `}</style>

      {/* Confetti */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="confetti-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-5%',
            backgroundColor: [color, '#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#ec4899'][i % 7],
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 1.5}s`,
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}

      {/* Modal card */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative rounded-2xl p-8 max-w-sm w-full text-center"
        style={{
          backgroundColor: 'var(--dash-bg, #1a1a1a)',
          border: `2px solid ${color}60`,
          animation: visible ? 'achievement-glow 2s ease-in-out infinite' : 'none',
          transform: visible ? 'scale(1)' : 'scale(0.8)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
        }}
      >
        {/* Achievement unlocked label */}
        <div
          className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
          style={{
            color,
            background: `linear-gradient(90deg, ${color}, ${color}aa, ${color})`,
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 3s linear infinite',
          }}
        >
          Achievement Unlocked!
        </div>

        {/* Icon */}
        <div
          className="mx-auto mb-4 flex items-center justify-center rounded-full"
          style={{
            width: 80,
            height: 80,
            background: `radial-gradient(circle, ${color}30, transparent 70%)`,
            animation: visible ? 'badge-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
          }}
        >
          <HugeiconsIcon icon={Trophy01IconData} size={40} style={{ color }} />
        </div>

        {/* Name */}
        <h3
          className="text-xl font-bold mb-2"
          style={{ color: 'var(--dash-text, #fff)' }}
        >
          {achievement.name}
        </h3>

        {/* Description */}
        <p
          className="text-sm mb-4"
          style={{ color: 'var(--dash-text-sub, #aaa)' }}
        >
          {achievement.description}
        </p>

        {/* Rarity + Points */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {RARITY_LABELS[achievement.rarity]}
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: 'var(--dash-text-sub, #aaa)' }}
          >
            +{achievement.points} pts
          </span>
        </div>

        {/* Continue button */}
        <button
          onClick={() => { setVisible(false); setTimeout(onDismiss, 400); }}
          className="px-6 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
          style={{
            backgroundColor: `${color}20`,
            color,
            border: `1px solid ${color}40`,
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
