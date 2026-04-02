import type { AchievementDefinition, AchievementRarity } from '../types/achievement';
import { getTrophyType } from '../config/trophyMap';
import { getTrophyImageForTier, type TrophyTier } from '../assets/trophyImages';

const RARITY_THEME: Record<AchievementRarity, {
  primary: string; accent: string; glow: string; label: string;
  darkBg: string; lightBg: string; darkBorder: string; lightBorder: string;
}> = {
  common: {
    primary: '#9ca3af', accent: '#d1d5db', glow: 'rgba(156,163,175,0.35)', label: 'COMMON',
    darkBg: 'rgba(156,163,175,0.08)', lightBg: 'rgba(156,163,175,0.10)',
    darkBorder: 'rgba(156,163,175,0.20)', lightBorder: 'rgba(156,163,175,0.25)',
  },
  uncommon: {
    primary: '#22c55e', accent: '#4ade80', glow: 'rgba(34,197,94,0.35)', label: 'UNCOMMON',
    darkBg: 'rgba(34,197,94,0.08)', lightBg: 'rgba(34,197,94,0.08)',
    darkBorder: 'rgba(34,197,94,0.20)', lightBorder: 'rgba(34,197,94,0.25)',
  },
  rare: {
    primary: '#3b82f6', accent: '#60a5fa', glow: 'rgba(59,130,246,0.35)', label: 'RARE',
    darkBg: 'rgba(59,130,246,0.08)', lightBg: 'rgba(59,130,246,0.08)',
    darkBorder: 'rgba(59,130,246,0.20)', lightBorder: 'rgba(59,130,246,0.25)',
  },
  epic: {
    primary: '#a855f7', accent: '#c084fc', glow: 'rgba(139,92,246,0.35)', label: 'EPIC',
    darkBg: 'rgba(139,92,246,0.08)', lightBg: 'rgba(139,92,246,0.08)',
    darkBorder: 'rgba(139,92,246,0.20)', lightBorder: 'rgba(139,92,246,0.25)',
  },
  legendary: {
    primary: '#f59e0b', accent: '#fde68a', glow: 'rgba(236,168,48,0.35)', label: 'LEGENDARY',
    darkBg: 'rgba(245,158,11,0.08)', lightBg: 'rgba(245,158,11,0.08)',
    darkBorder: 'rgba(245,158,11,0.20)', lightBorder: 'rgba(245,158,11,0.25)',
  },
};

interface MiniTrophyCardProps {
  definition: AchievementDefinition;
  earnedAt?: string;
  onClick?: () => void;
}

export default function MiniTrophyCard({ definition, onClick }: MiniTrophyCardProps) {
  const theme = RARITY_THEME[definition.rarity];
  const trophyType = getTrophyType(definition.id);
  const tier = (definition.tier ?? 'gold') as TrophyTier;
  const trophyImg = trophyType ? (getTrophyImageForTier(trophyType, tier) ?? null) : null;

  const words = definition.name.split(' ');
  const midpoint = Math.ceil(words.length / 2);
  const line1 = words.slice(0, midpoint).join(' ');
  const line2 = words.slice(midpoint).join(' ');

  const uid = `mtc-${definition.id}`;

  return (
    <>
      <style>{`
        .${uid} {
          position: relative;
          width: 130px;
          min-width: 130px;
          height: 68px;
          background: color-mix(in srgb, var(--dash-card-bg) 88%, ${theme.primary} 12%);
          border: 1px solid ${theme.darkBorder};
          border-radius: 12px;
          padding: 0;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          box-shadow:
            0 0 0 1px color-mix(in srgb, ${theme.primary} 5%, transparent) inset,
            0 6px 16px var(--dash-card-shadow, rgba(0,0,0,0.3)),
            0 0 14px ${theme.glow.replace('0.35', '0.06')};
          overflow: visible;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .${uid}:hover {
          border-color: ${theme.primary}60;
          box-shadow:
            0 0 0 1px color-mix(in srgb, ${theme.primary} 10%, transparent) inset,
            0 12px 28px var(--dash-card-shadow, rgba(0,0,0,0.4)),
            0 0 22px ${theme.glow.replace('0.35', '0.18')};
        }
        .${uid} .mtc-shine {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(180deg, color-mix(in srgb, ${theme.primary} 6%, transparent) 0%, transparent 100%);
          border-radius: 12px 12px 0 0;
          pointer-events: none;
        }
        .${uid} .mtc-content {
          flex: 1;
          min-width: 0;
          padding: 6px 0 6px 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 2;
        }
        .${uid} .mtc-name {
          font-family: 'Syne', sans-serif;
          font-size: 9px;
          font-weight: 800;
          line-height: 1.15;
          color: var(--dash-text);
          letter-spacing: -0.02em;
        }
        .${uid} .mtc-name span {
          background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .${uid} .mtc-trophy-side {
          position: relative;
          width: 60px;
          min-width: 60px;
          height: 68px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          overflow: visible;
          transition: transform 0.25s ease;
          z-index: 5;
        }
        .${uid} .mtc-trophy-glow {
          position: absolute;
          width: 44px; height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle, ${theme.glow.replace('0.35', '0.3')} 0%, transparent 70%);
          animation: mtc-glow-${definition.id} 3s ease-in-out infinite;
        }
        @keyframes mtc-glow-${definition.id} {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.85; }
        }
        .${uid} .mtc-trophy-img {
          position: absolute;
          width: 130px;
          min-width: 95px;
          height: auto;
          z-index: 5;
          right: -30px;
          top: -10px;
          filter: drop-shadow(0 4px 8px ${theme.glow.replace('0.35', '0.3')});
          animation: mtc-float-${definition.id} 4s ease-in-out infinite;
        }
        .${uid}:hover .mtc-trophy-side {
          transform: scale(1.35);
          z-index: 20;
        }
        .${uid}:hover {
          z-index: 10;
        }
        @keyframes mtc-float-${definition.id} {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
      <div className={uid} onClick={onClick} title={definition.description}>
        <div className="mtc-shine" />
        <div className="mtc-content">
          <div className="mtc-name">
            {line1}<br />
            <span>{line2}</span>
          </div>
        </div>
        {trophyImg && (
          <div className="mtc-trophy-side">
            <div className="mtc-trophy-glow" />
            <img
              className="mtc-trophy-img"
              src={trophyImg}
              alt={definition.name}
              draggable={false}
            />
          </div>
        )}
      </div>
    </>
  );
}
