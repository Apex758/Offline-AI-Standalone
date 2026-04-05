import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import Trophy01IconData from '@hugeicons/core-free-icons/Award01Icon';
import Medal01IconData from '@hugeicons/core-free-icons/Medal01Icon';
import StarIconData from '@hugeicons/core-free-icons/StarIcon';
import type { NewlyEarnedAchievement, AchievementRarity, AchievementCategory } from '../../types/achievement';
import { getTrophyType } from '../../config/trophyMap';
import { getTrophyImageForTier, type TrophyTier } from '../../assets/trophyImagesLazy';

/* ─── Inspirational teaching quotes ─── */
const TEACHING_QUOTES: string[] = [
  '"Education is the most powerful weapon which you can use to change the world." — Nelson Mandela',
  '"The art of teaching is the art of assisting discovery." — Mark Van Doren',
  '"A teacher affects eternity; they can never tell where their influence stops." — Henry Adams',
  '"Teaching is the greatest act of optimism." — Colleen Wilcox',
  '"The best teachers are those who show you where to look but don\'t tell you what to see." — Alexandra K. Trenfor',
  '"Education is not the filling of a pail, but the lighting of a fire." — W.B. Yeats',
  '"Every child deserves a champion." — Rita Pierson',
  '"What a teacher writes on the blackboard of life can never be erased." — Unknown',
  '"Teachers plant the seeds of knowledge that grow forever." — Unknown',
  '"The influence of a good teacher can never be erased." — Unknown',
  '"To teach is to learn twice." — Joseph Joubert',
  '"It takes a big heart to help shape little minds." — Unknown',
  '"Teachers can change lives with just the right mix of chalk and challenges." — Joyce Meyer',
  '"The dream begins with a teacher who believes in you." — Dan Rather',
  '"Good teaching is one-quarter preparation and three-quarters theatre." — Gail Godwin',
  '"Children are not things to be moulded, but people to be unfolded." — Jess Lair',
  '"The task of the modern educator is not to cut down jungles, but to irrigate deserts." — C.S. Lewis',
  '"In learning you will teach, and in teaching you will learn." — Phil Collins',
  '"Teachers who love teaching teach children to love learning." — Unknown',
  '"The beautiful thing about learning is that nobody can take it away from you." — B.B. King',
];

const CATEGORY_MESSAGES: Record<string, string[]> = {
  'content-creation': [
    'Every lesson plan is a blueprint for a brighter future.',
    'Your creativity shapes how students see the world.',
    'Great content creates great learning moments.',
  ],
  'student-management': [
    'Behind every name on your roster is a story waiting to unfold.',
    'Knowing your students is the first step to reaching them.',
    'You\'re building a community, one student at a time.',
  ],
  'assessment': [
    'Assessment isn\'t just grading — it\'s understanding.',
    'Every mark you give is a step on a student\'s journey.',
    'Fair assessment opens doors to growth.',
  ],
  'attendance': [
    'Showing up matters — and so does tracking it.',
    'Consistency in tracking leads to consistency in learning.',
    'Every present student is a chance to make an impact.',
  ],
  'curriculum': [
    'Milestones aren\'t just markers — they\'re proof of progress.',
    'You\'re not just following a curriculum, you\'re bringing it to life.',
    'Each completed standard is a promise kept.',
  ],
  'exploration': [
    'Curiosity in a teacher inspires curiosity in students.',
    'Exploring new tools makes you a more versatile educator.',
    'The best teachers never stop discovering.',
  ],
  'power-user': [
    'Dedication like yours moves mountains.',
    'Consistency is the secret ingredient of great teaching.',
    'Your commitment to your craft is inspiring.',
  ],
  'chat': [
    'Asking questions is how great ideas are born.',
    'Every conversation with PEARL sparks new possibilities.',
    'Collaboration — even with AI — makes teaching stronger.',
  ],
  'brain-dump': [
    'Turning thoughts into action is a superpower.',
    'Your ideas deserve to become reality.',
    'From brainstorm to classroom — that\'s the magic.',
  ],
  'analytics': [
    'Data-driven teaching leads to data-driven results.',
    'Understanding your tools helps you understand your impact.',
    'Every generation is a step toward better education.',
  ],
};

function getQuoteForAchievement(category: AchievementCategory): string {
  const catMessages = CATEGORY_MESSAGES[category];
  if (catMessages && catMessages.length > 0) {
    // 50% chance of category-specific, 50% general quote
    if (Math.random() < 0.5) {
      return catMessages[Math.floor(Math.random() * catMessages.length)];
    }
  }
  return TEACHING_QUOTES[Math.floor(Math.random() * TEACHING_QUOTES.length)];
}

/* ─── rarity themes ─── */
const RARITY_THEMES: Record<AchievementRarity, {
  primary: string; glow: string; gradient: string; accent: string; particle: string[];
}> = {
  common: {
    primary: '#9ca3af',
    glow: 'rgba(156,163,175,0.35)',
    gradient: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #d1d5db 100%)',
    accent: '#d1d5db',
    particle: ['#9ca3af', '#d1d5db', '#e5e7eb', '#6b7280'],
  },
  uncommon: {
    primary: '#22c55e',
    glow: 'rgba(34,197,94,0.35)',
    gradient: 'linear-gradient(135deg, #15803d 0%, #22c55e 50%, #86efac 100%)',
    accent: '#86efac',
    particle: ['#22c55e', '#4ade80', '#86efac', '#15803d', '#bbf7d0'],
  },
  rare: {
    primary: '#3b82f6',
    glow: 'rgba(59,130,246,0.35)',
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #93c5fd 100%)',
    accent: '#93c5fd',
    particle: ['#3b82f6', '#60a5fa', '#93c5fd', '#1d4ed8', '#dbeafe'],
  },
  epic: {
    primary: '#a855f7',
    glow: 'rgba(168,85,247,0.35)',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d8b4fe 100%)',
    accent: '#d8b4fe',
    particle: ['#a855f7', '#c084fc', '#d8b4fe', '#7c3aed', '#f3e8ff'],
  },
  legendary: {
    primary: '#f59e0b',
    glow: 'rgba(245,158,11,0.4)',
    gradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 40%, #fde68a 100%)',
    accent: '#fde68a',
    particle: ['#f59e0b', '#fbbf24', '#fde68a', '#d97706', '#fff7ed'],
  },
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
  /** If true, show as a "view" modal (no confetti, no auto-dismiss) */
  viewOnly?: boolean;
}

export default function AchievementUnlockModal({ achievement, onDismiss, viewOnly }: AchievementUnlockModalProps) {
  const [phase, setPhase] = useState<'idle' | 'entering' | 'visible' | 'exiting'>('idle');
  const [trophySrc, setTrophySrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!achievement) { setTrophySrc(undefined); return; }
    const tType = getTrophyType(achievement.achievement_id);
    if (!tType) { setTrophySrc(undefined); return; }
    getTrophyImageForTier(tType, (achievement.tier ?? 'gold') as TrophyTier).then(src => setTrophySrc(src));
  }, [achievement?.achievement_id, achievement?.tier]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stable quote per achievement (doesn't change on re-renders)
  const quote = useMemo(() => {
    if (!achievement) return '';
    return getQuoteForAchievement(achievement.category);
  }, [achievement?.achievement_id]); // eslint-disable-line react-hooks/exhaustive-deps

  const dismiss = useCallback(() => {
    setPhase('exiting');
    setTimeout(onDismiss, viewOnly ? 800 : 500);
  }, [onDismiss, viewOnly]);

  useEffect(() => {
    if (achievement) {
      setPhase('entering');
      const t1 = requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase('visible'));
      });
      // Auto-dismiss for unlock notifications only
      if (!viewOnly) {
        const timer = setTimeout(dismiss, 10000);
        return () => { cancelAnimationFrame(t1); clearTimeout(timer); };
      }
      return () => cancelAnimationFrame(t1);
    } else {
      setPhase('idle');
    }
  }, [achievement, viewOnly, dismiss]);

  if (!achievement || phase === 'idle') return null;

  const theme = RARITY_THEMES[achievement.rarity];
  const show = phase === 'visible';
  const hiding = phase === 'exiting';

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={dismiss}
      style={{
        backgroundColor: hiding ? 'rgba(0,0,0,0)' : show ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0)',
        backdropFilter: show && !hiding ? 'blur(16px) saturate(1.2)' : 'blur(0px)',
        WebkitBackdropFilter: show && !hiding ? 'blur(16px) saturate(1.2)' : 'blur(0px)',
        transition: 'background-color 0.6s ease, backdrop-filter 0.6s ease, -webkit-backdrop-filter 0.6s ease',
      }}
    >
      <style>{`
        @keyframes ach-ring-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes ach-ring-spin-rev { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
        @keyframes ach-pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
        @keyframes ach-sparkle-float {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          15% { transform: translateY(-20px) scale(1); opacity: 1; }
          100% { transform: translateY(-120px) scale(0); opacity: 0; }
        }
        @keyframes ach-confetti-fall {
          0% { transform: translateY(-60vh) rotate(0deg) scale(1); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateY(60vh) rotate(540deg) scale(0.5); opacity: 0; }
        }
        @keyframes ach-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes ach-icon-entrance {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; filter: blur(10px); }
          50% { transform: scale(1.2) rotate(5deg); opacity: 1; filter: blur(0px); }
          70% { transform: scale(0.95) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0px); }
        }
        @keyframes ach-text-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes ach-border-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ach-ray {
          0% { opacity: 0.15; transform: rotate(0deg) scale(1); }
          50% { opacity: 0.3; transform: rotate(180deg) scale(1.1); }
          100% { opacity: 0.15; transform: rotate(360deg) scale(1); }
        }
      `}</style>

      {/* Sparkle/confetti particles — only for unlock, not view */}
      {!viewOnly && show && !hiding && Array.from({ length: 50 }).map((_, i) => {
        const isSparkle = i < 12;
        if (isSparkle) {
          const angle = (i / 12) * 360;
          const dist = 100 + Math.random() * 80;
          return (
            <div
              key={`s-${i}`}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: theme.particle[i % theme.particle.length],
                boxShadow: `0 0 6px 2px ${theme.particle[i % theme.particle.length]}`,
                marginLeft: Math.cos((angle * Math.PI) / 180) * dist,
                marginTop: Math.sin((angle * Math.PI) / 180) * dist,
                animation: `ach-sparkle-float ${2 + Math.random() * 2}s ease-out ${0.3 + Math.random() * 1.5}s forwards`,
                opacity: 0,
                pointerEvents: 'none',
              }}
            />
          );
        }
        return (
          <div
            key={`c-${i}`}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: '-5%',
              width: `${5 + Math.random() * 8}px`,
              height: `${5 + Math.random() * 8}px`,
              borderRadius: Math.random() > 0.4 ? '50%' : '2px',
              backgroundColor: theme.particle[i % theme.particle.length],
              animation: `ach-confetti-fall ${2.5 + Math.random() * 3}s ease-in ${Math.random() * 2}s forwards`,
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* ─── Main card ─── */}
      <div
        className={viewOnly ? (hiding ? 'animate__animated animate__zoomOutDown' : show ? 'animate__animated animate__zoomInDown' : '') : ''}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: 380,
          width: '100%',
          borderRadius: 24,
          overflow: 'visible',
          ...(viewOnly
            ? {
                animationDuration: hiding ? '0.7s' : '0.6s',
                opacity: !show && !hiding ? 0 : undefined,
              }
            : {
                transform: show && !hiding ? 'scale(1) translateY(0)' : hiding ? 'scale(0.9) translateY(30px)' : 'scale(0.7) translateY(40px)',
                opacity: show && !hiding ? 1 : 0,
                transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
              }),
        }}
      >
        {/* Animated border gradient */}
        <div
          style={{
            position: 'absolute',
            inset: -2,
            borderRadius: 26,
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent}, ${theme.primary}, ${theme.accent})`,
            backgroundSize: '300% 300%',
            animation: 'ach-border-shimmer 4s ease infinite',
            opacity: 0.7,
          }}
        />

        {/* Card body */}
        <div
          style={{
            position: 'relative',
            borderRadius: 24,
            background: 'linear-gradient(170deg, rgba(20,20,25,0.97) 0%, rgba(10,10,14,0.99) 100%)',
            padding: '40px 32px 32px',
            textAlign: 'center',
          }}
        >
          {/* Progress bar at top */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            borderRadius: '24px 24px 0 0',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.06)',
          }}>
            <div style={{
              height: '100%',
              width: show && !viewOnly ? '100%' : '100%',
              background: theme.gradient,
              borderRadius: '0 4px 4px 0',
              transition: viewOnly ? 'none' : 'width 10s linear',
            }} />
          </div>

          {/* "ACHIEVEMENT UNLOCKED" / "ACHIEVEMENT" label */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginBottom: 28,
              background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent}, ${theme.primary})`,
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: show ? 'ach-shimmer 3s linear infinite' : 'none',
              opacity: show && !hiding ? 1 : 0,
              transform: show && !hiding ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
            }}
          >
            {viewOnly ? 'Achievement' : 'Achievement Unlocked'}
          </div>

          {/* ─── Icon area with rings & glow ─── */}
          <div style={{
            position: 'relative',
            width: 140,
            height: 140,
            margin: '0 auto 24px',
          }}>
            {/* Radial glow */}
            <div style={{
              position: 'absolute',
              inset: -30,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
              animation: show ? 'ach-pulse-glow 3s ease-in-out infinite' : 'none',
            }} />

            {/* Light rays */}
            <div style={{
              position: 'absolute',
              inset: -40,
              background: `conic-gradient(from 0deg, transparent, ${theme.primary}15, transparent, ${theme.primary}10, transparent, ${theme.primary}15, transparent)`,
              borderRadius: '50%',
              animation: show ? 'ach-ray 12s linear infinite' : 'none',
            }} />

            {/* Outer ring */}
            <svg
              width="140" height="140"
              viewBox="0 0 140 140"
              style={{
                position: 'absolute',
                inset: 0,
                animation: show ? 'ach-ring-spin 20s linear infinite' : 'none',
              }}
            >
              <defs>
                <linearGradient id="ach-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={theme.primary} stopOpacity="0.6" />
                  <stop offset="50%" stopColor={theme.accent} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={theme.primary} stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <circle
                cx="70" cy="70" r="66" fill="none"
                stroke="url(#ach-ring-grad)" strokeWidth="1.5"
                strokeDasharray="8 12"
              />
            </svg>

            {/* Inner ring */}
            <svg
              width="140" height="140"
              viewBox="0 0 140 140"
              style={{
                position: 'absolute',
                inset: 0,
                animation: show ? 'ach-ring-spin-rev 15s linear infinite' : 'none',
              }}
            >
              <circle
                cx="70" cy="70" r="52" fill="none"
                stroke={theme.primary}
                strokeWidth="1"
                strokeDasharray="4 16"
                opacity="0.4"
              />
            </svg>

            {/* Center icon — trophy image when available, generic icon fallback */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: show ? 'ach-icon-entrance 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.15s both' : 'none',
            }}>
              {trophySrc ? (
                  <img
                    src={trophySrc}
                    alt={achievement.name}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: 'contain',
                      filter: `drop-shadow(0 4px 20px ${theme.primary}60)`,
                    }}
                  />
                ) : (
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${theme.primary}30 0%, ${theme.primary}10 100%)`,
                    border: `1.5px solid ${theme.primary}40`,
                    backdropFilter: 'blur(8px)',
                    boxShadow: `0 8px 32px ${theme.primary}30, inset 0 1px 0 ${theme.accent}20`,
                  }}>
                    <HugeiconsIcon
                      icon={achievement.rarity === 'legendary' ? Trophy01IconData : Medal01IconData}
                      size={38}
                      style={{
                        color: theme.accent,
                        filter: `drop-shadow(0 0 8px ${theme.primary}80)`,
                      }}
                    />
                  </div>
                )}
            </div>
          </div>

          {/* Name */}
          <h3 style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 8,
            letterSpacing: '-0.01em',
            animation: show ? 'ach-text-up 0.5s ease 0.3s both' : 'none',
          }}>
            {achievement.name}
          </h3>

          {/* Description */}
          <p style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.5,
            marginBottom: 12,
            maxWidth: 280,
            marginLeft: 'auto',
            marginRight: 'auto',
            animation: show ? 'ach-text-up 0.5s ease 0.4s both' : 'none',
          }}>
            {achievement.description}
          </p>

          {/* Inspirational quote */}
          {quote && (
            <p style={{
              fontSize: 11,
              color: `${theme.primary}99`,
              lineHeight: 1.6,
              marginBottom: 20,
              maxWidth: 300,
              marginLeft: 'auto',
              marginRight: 'auto',
              fontStyle: 'italic',
              animation: show ? 'ach-text-up 0.5s ease 0.45s both' : 'none',
            }}>
              {quote}
            </p>
          )}

          {/* Rarity + Points badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 28,
            animation: show ? 'ach-text-up 0.5s ease 0.5s both' : 'none',
          }}>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '5px 14px',
              borderRadius: 20,
              background: `linear-gradient(135deg, ${theme.primary}25 0%, ${theme.primary}10 100%)`,
              color: theme.primary,
              border: `1px solid ${theme.primary}30`,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {RARITY_LABELS[achievement.rarity]}
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '5px 14px',
              borderRadius: 20,
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}>
              <HugeiconsIcon icon={StarIconData} size={12} style={{ color: theme.accent }} />
              +{achievement.points} pts
            </span>
          </div>

          {/* Earned date (view mode) */}
          {viewOnly && achievement.earned_at && (
            <p style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 20,
              animation: show ? 'ach-text-up 0.5s ease 0.55s both' : 'none',
            }}>
              Earned on {new Date(achievement.earned_at).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          )}

          {/* Continue / Close button */}
          <button
            onClick={dismiss}
            style={{
              padding: '10px 36px',
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primary}cc 100%)`,
              border: 'none',
              cursor: 'pointer',
              boxShadow: `0 4px 20px ${theme.primary}40, 0 1px 0 inset ${theme.accent}30`,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              animation: show ? 'ach-text-up 0.5s ease 0.6s both' : 'none',
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
              (e.target as HTMLButtonElement).style.boxShadow = `0 6px 28px ${theme.primary}60, 0 1px 0 inset ${theme.accent}30`;
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1)';
              (e.target as HTMLButtonElement).style.boxShadow = `0 4px 20px ${theme.primary}40, 0 1px 0 inset ${theme.accent}30`;
            }}
          >
            {viewOnly ? 'Close' : 'Continue'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
