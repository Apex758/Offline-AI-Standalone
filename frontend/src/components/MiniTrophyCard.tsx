import type { AchievementDefinition, AchievementRarity } from '../types/achievement';
import { getTrophyType } from '../config/trophyMap';
import TROPHY_IMAGES from '../assets/trophyImages';

const RARITY_THEME: Record<AchievementRarity, {
  primary: string; accent: string; glow: string; badge: string; badgeText: string; label: string;
}> = {
  common:    { primary: '#9ca3af', accent: '#d1d5db', glow: 'rgba(156,163,175,0.35)', badge: 'rgba(156,163,175,0.18)', badgeText: '#d1d5db', label: 'COMMON' },
  uncommon:  { primary: '#22c55e', accent: '#4ade80', glow: 'rgba(34,197,94,0.35)',  badge: 'rgba(34,197,94,0.18)',  badgeText: '#86efac', label: 'UNCOMMON' },
  rare:      { primary: '#3b82f6', accent: '#60a5fa', glow: 'rgba(59,130,246,0.35)', badge: 'rgba(59,130,246,0.18)', badgeText: '#93c5fd', label: 'RARE' },
  epic:      { primary: '#a855f7', accent: '#c084fc', glow: 'rgba(139,92,246,0.35)', badge: 'rgba(139,92,246,0.18)', badgeText: '#c4b5fd', label: 'EPIC' },
  legendary: { primary: '#f59e0b', accent: '#fde68a', glow: 'rgba(236,168,48,0.35)', badge: 'rgba(245,158,11,0.18)', badgeText: '#fde68a', label: 'LEGENDARY' },
};

interface MiniTrophyCardProps {
  definition: AchievementDefinition;
  earnedAt?: string;
  onClick?: () => void;
}

export default function MiniTrophyCard({ definition, onClick }: MiniTrophyCardProps) {
  const theme = RARITY_THEME[definition.rarity];
  const trophyType = getTrophyType(definition.id);
  const trophyImg = trophyType ? TROPHY_IMAGES[trophyType] : null;

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
          width: 100px;
          min-width: 100px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px;
          padding: 8px 6px 8px;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03) inset,
            0 6px 16px rgba(0,0,0,0.3),
            0 0 14px ${theme.glow.replace('0.35', '0.06')};
          overflow: hidden;
          flex-shrink: 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .${uid}:hover {
          transform: translateY(-3px) scale(1.04);
          border-color: ${theme.primary}50;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06) inset,
            0 12px 28px rgba(0,0,0,0.4),
            0 0 22px ${theme.glow.replace('0.35', '0.18')};
        }
        .${uid} .mtc-shine {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%);
          border-radius: 14px 14px 0 0;
          pointer-events: none;
        }
        .${uid} .mtc-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: ${theme.badge};
          border: 1px solid ${theme.primary}40;
          border-radius: 100px;
          padding: 2px 7px;
          margin-bottom: 4px;
        }
        .${uid} .mtc-badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: ${theme.badgeText};
        }
        .${uid} .mtc-badge-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 7px;
          font-weight: 600;
          color: ${theme.badgeText};
          letter-spacing: 0.06em;
        }
        .${uid} .mtc-trophy-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 72px;
          margin: 0 -4px 4px;
        }
        .${uid} .mtc-trophy-glow {
          position: absolute;
          width: 50px; height: 50px;
          border-radius: 50%;
          background: radial-gradient(circle, ${theme.glow.replace('0.35', '0.3')} 0%, transparent 70%);
          animation: mtc-glow-${definition.id} 3s ease-in-out infinite;
        }
        @keyframes mtc-glow-${definition.id} {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.85; }
        }
        .${uid} .mtc-trophy-img {
          position: relative;
          width: 76px;
          height: auto;
          z-index: 2;
          filter: drop-shadow(0 4px 8px ${theme.glow.replace('0.35', '0.3')});
          animation: mtc-float-${definition.id} 4s ease-in-out infinite;
        }
        @keyframes mtc-float-${definition.id} {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .${uid} .mtc-name {
          font-family: 'Syne', sans-serif;
          font-size: 9px;
          font-weight: 700;
          line-height: 1.15;
          color: #ffffff;
          letter-spacing: -0.01em;
        }
        .${uid} .mtc-name span {
          background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      <div className={uid} onClick={onClick} title={definition.description}>
        <div className="mtc-shine" />
        <div className="mtc-badge">
          <div className="mtc-badge-dot" />
          <span className="mtc-badge-label">{theme.label}</span>
        </div>
        {trophyImg && (
          <div className="mtc-trophy-wrap">
            <div className="mtc-trophy-glow" />
            <img
              className="mtc-trophy-img"
              src={trophyImg}
              alt={definition.name}
              draggable={false}
            />
          </div>
        )}
        <div className="mtc-name">
          {line1}<br />
          <span>{line2}</span>
        </div>
      </div>
    </>
  );
}
