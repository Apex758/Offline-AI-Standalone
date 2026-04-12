import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useAssistantName } from '../hooks/useAssistantName';
import type { NewlyEarnedAchievement, AchievementRarity, AchievementCategory } from '../types/achievement';

/* ─── Rarity color themes ─── */
const RARITY_THEME: Record<AchievementRarity, {
  primary: string; accent: string; glow: string; badge: string; badgeText: string; label: string;
}> = {
  common:    { primary: '#9ca3af', accent: '#d1d5db', glow: 'rgba(156,163,175,0.35)', badge: 'rgba(156,163,175,0.18)', badgeText: '#d1d5db', label: 'Common' },
  uncommon:  { primary: '#22c55e', accent: '#4ade80', glow: 'rgba(34,197,94,0.35)',  badge: 'rgba(34,197,94,0.18)',  badgeText: '#86efac', label: 'Uncommon' },
  rare:      { primary: '#3b82f6', accent: '#60a5fa', glow: 'rgba(59,130,246,0.35)', badge: 'rgba(59,130,246,0.18)', badgeText: '#93c5fd', label: 'Rare' },
  epic:      { primary: '#a855f7', accent: '#c084fc', glow: 'rgba(139,92,246,0.35)', badge: 'rgba(139,92,246,0.18)', badgeText: '#c4b5fd', label: 'Epic' },
  legendary: { primary: '#f59e0b', accent: '#fde68a', glow: 'rgba(236,168,48,0.35)', badge: 'rgba(245,158,11,0.18)', badgeText: '#fde68a', label: 'Legendary' },
};

const RARITY_PERCENTAGES: Record<AchievementRarity, string> = {
  common: '',
  uncommon: 'Top 45%',
  rare: 'Top 20%',
  epic: 'Top 8%',
  legendary: 'Top 3%',
};

const CATEGORY_TIPS: Record<AchievementCategory, string> = {
  'content-creation': 'Keep creating lessons, worksheets, and presentations to maintain your edge.',
  'student-management': 'Continue building your classroom community and managing students.',
  'assessment': 'Stay on top of grading and assessment to keep this achievement.',
  'attendance': 'Track attendance consistently to hold onto this award.',
  'curriculum': 'Keep hitting curriculum milestones and tracking standards.',
  'exploration': 'Never stop exploring new features and tools.',
  'power-user': 'Maintain your daily streak and stay active.',
  'chat': 'Keep chatting with {assistantName} to grow your skills.',
  'brain-dump': 'Turn more ideas into action with Brain Dump.',
  'analytics': 'Keep generating reports and using analytics tools.',
};

/* ─── Component ─── */
interface TrophyDetailCardProps {
  achievement: NewlyEarnedAchievement;
  trophyImageSrc: string;
  earnedAt?: string;
  onClose: () => void;
}

export default function TrophyDetailCard({ achievement, trophyImageSrc, earnedAt, onClose }: TrophyDetailCardProps) {
  const { t } = useTranslation();
  const assistantName = useAssistantName();
  const [flipped, setFlipped] = useState(false);
  const [visible, setVisible] = useState(false);

  const theme = RARITY_THEME[achievement.rarity];
  const pct = RARITY_PERCENTAGES[achievement.rarity];

  // Format date
  const dateStr = earnedAt
    ? new Date(earnedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  // Split achievement name into two lines for headline styling
  const words = achievement.name.split(' ');
  const midpoint = Math.ceil(words.length / 2);
  const line1 = words.slice(0, midpoint).join(' ');
  const line2 = words.slice(midpoint).join(' ');

  // Entrance animation
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .tdc-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      opacity: 0;
      transition: opacity 0.35s ease;
      padding: 2rem;
    }
    .tdc-overlay.tdc-visible { opacity: 1; }

    .tdc-card-wrapper {
      position: relative;
      width: 620px;
      min-width: 620px;
      max-width: 620px;
      flex-shrink: 0;
      transform: scale(0.9);
      transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    .tdc-visible .tdc-card-wrapper { transform: scale(1); }

    .tdc-orb-1 {
      position: absolute;
      width: 280px; height: 280px;
      border-radius: 50%;
      background: radial-gradient(circle, ${theme.glow} 0%, transparent 70%);
      top: -80px; left: -60px;
      pointer-events: none;
      animation: tdc-pulse1 6s ease-in-out infinite;
    }
    .tdc-orb-2 {
      position: absolute;
      width: 200px; height: 200px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%);
      bottom: -60px; right: -40px;
      pointer-events: none;
      animation: tdc-pulse2 7s ease-in-out infinite;
    }
    .tdc-orb-3 {
      position: absolute;
      width: 150px; height: 150px;
      border-radius: 50%;
      background: radial-gradient(circle, ${theme.glow.replace('0.35', '0.2')} 0%, transparent 70%);
      bottom: 40px; right: 120px;
      pointer-events: none;
      animation: tdc-pulse1 5s ease-in-out infinite reverse;
    }

    @keyframes tdc-pulse1 {
      0%, 100% { transform: scale(1) translate(0,0); opacity: 0.7; }
      50% { transform: scale(1.15) translate(10px, -10px); opacity: 1; }
    }
    @keyframes tdc-pulse2 {
      0%, 100% { transform: scale(1) translate(0,0); opacity: 0.6; }
      50% { transform: scale(1.1) translate(-8px, 8px); opacity: 0.9; }
    }

    .tdc-card {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0;
      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 28px;
      overflow: visible;
      padding: 16px 0 10px;
      box-sizing: border-box;
      width: 620px;
      min-width: 620px;
      max-width: 620px;
      height: 420px;
      min-height: 420px;
      max-height: 420px;
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.05) inset,
        0 40px 80px rgba(0,0,0,0.5),
        0 0 60px ${theme.glow.replace('0.35', '0.08')};
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .tdc-card:hover {
      transform: translateY(-4px);
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.08) inset,
        0 50px 100px rgba(0,0,0,0.6),
        0 0 80px ${theme.glow.replace('0.35', '0.15')};
    }

    .tdc-card-noise {
      position: absolute;
      inset: 0;
      border-radius: 28px;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
      pointer-events: none;
      opacity: 0.4;
    }

    .tdc-card-shine {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 50%;
      background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%);
      border-radius: 28px 28px 0 0;
      pointer-events: none;
    }

    .tdc-content {
      flex: none;
      width: 340px;
      min-width: 340px;
      max-width: 340px;
      z-index: 4;
      position: relative;
      padding-left: 40px;
    }

    .tdc-text-glass {
      position: relative;
      width: 435px;
      min-width: 435px;
      max-width: 435px;
      margin-bottom: 16px;
      perspective: 1000px;
      cursor: pointer;
    }

    .tdc-text-glass-inner {
      position: relative;
      width: 100%;
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .tdc-text-glass.tdc-flipped .tdc-text-glass-inner {
      transform: rotateY(180deg);
    }

    .tdc-text-glass-front,
    .tdc-text-glass-back {
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(20px) saturate(160%);
      -webkit-backdrop-filter: blur(20px) saturate(160%);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 32px 36px 32px;
      overflow: hidden;
      width: 435px;
      min-width: 435px;
      max-width: 435px;
      box-sizing: border-box;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    .tdc-text-glass-front::before,
    .tdc-text-glass-back::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 40%;
      background: linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%);
      border-radius: 20px 20px 0 0;
      pointer-events: none;
    }

    .tdc-text-glass-back {
      position: absolute;
      top: 0; left: 0;
      transform: rotateY(180deg);
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 14px;
    }

    .tdc-back-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .tdc-back-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${theme.badge};
      border: 1px solid ${theme.primary}59;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .tdc-back-icon svg { width: 14px; height: 14px; }
    .tdc-back-item-title {
      font-family: 'Syne', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 3px;
    }
    .tdc-back-item-desc {
      font-size: 12px;
      color: rgba(255,255,255,0.45);
      line-height: 1.5;
    }

    .tdc-flip-arrow {
      position: absolute;
      bottom: 12px;
      right: 14px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: scale(0.8);
      transition: opacity 0.25s ease, transform 0.25s ease, background 0.2s;
      z-index: 10;
    }
    .tdc-text-glass:hover .tdc-flip-arrow {
      opacity: 1;
      transform: scale(1);
    }
    .tdc-flip-arrow:hover { background: rgba(255,255,255,0.16) !important; }
    .tdc-text-glass.tdc-flipped .tdc-flip-arrow svg { transform: scaleX(-1); }

    .tdc-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: ${theme.badge};
      border: 1px solid ${theme.primary}59;
      border-radius: 100px;
      padding: 6px 14px;
      margin-bottom: 20px;
      margin-top: -16px;
      flex-shrink: 0;
      white-space: nowrap;
    }
    .tdc-badge-icon {
      width: 20px; height: 20px;
      border-radius: 50%;
      background: ${theme.primary}80;
      display: flex; align-items: center; justify-content: center;
    }
    .tdc-badge-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: ${theme.badgeText};
    }
    .tdc-badge-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: ${theme.badgeText};
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .tdc-headline {
      font-family: 'Syne', sans-serif;
      font-size: 36px;
      font-weight: 800;
      line-height: 1.12;
      color: #ffffff;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
      flex-shrink: 0;
    }
    .tdc-headline span {
      background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 50%, ${theme.primary} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .tdc-description {
      font-family: 'DM Sans', sans-serif;
      font-size: 14.5px;
      font-weight: 400;
      color: rgba(255,255,255,0.5);
      line-height: 1.65;
      width: 360px;
      min-width: 360px;
      max-width: 360px;
      margin-bottom: 0;
      flex-shrink: 0;
    }

    .tdc-stats-row {
      display: flex;
      align-items: flex-start;
      border-top: 1px solid rgba(255,255,255,0.08);
      padding-top: 16px;
      width: 435px;
      min-width: 435px;
      max-width: 435px;
      flex-shrink: 0;
    }
    .tdc-stat {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      padding: 0 18px;
    }
    .tdc-stat:first-child { padding-left: 0; flex: 0.65; }
    .tdc-stat:last-child  { padding-right: 0; }
    .tdc-stat-divider {
      display: block;
      width: 1px;
      min-width: 1px;
      background: rgba(255,255,255,0.08);
      align-self: stretch;
      flex-shrink: 0;
    }
    .tdc-stat-num {
      font-family: 'Syne', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      white-space: nowrap;
    }
    .tdc-stat-label {
      font-size: 10px;
      font-weight: 500;
      color: rgba(255,255,255,0.35);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .tdc-trophy-side {
      position: relative;
      width: 620px;
      min-width: 620px;
      max-width: 620px;
      height: 420px;
      min-height: 420px;
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      margin-right: -80px;
      margin-left: -50px;
      overflow: visible;
    }
    .tdc-trophy-glow {
      position: absolute;
      width: 680px; height: 680px;
      border-radius: 50%;
      background: radial-gradient(circle, ${theme.glow.replace('0.35', '0.45')} 0%, transparent 70%);
      animation: tdc-glow-pulse 3s ease-in-out infinite;
      z-index: 1;
    }
    @keyframes tdc-glow-pulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.2); opacity: 1; }
    }

    .tdc-trophy-img {
      position: relative;
      width: 680px;
      min-width: 680px;
      max-width: 680px;
      margin-top: -200px;
      margin-bottom: -120px;
      z-index: 3;
      height: auto;
      flex-shrink: 0;
      filter: drop-shadow(0 20px 40px ${theme.glow.replace('0.35', '0.4')}) drop-shadow(0 0 20px ${theme.glow.replace('0.35', '0.2')});
      animation: tdc-float 4s ease-in-out infinite;
    }
    @keyframes tdc-float {
      0%, 100% { transform: translateY(0px) rotate(-1deg); }
      50% { transform: translateY(-12px) rotate(1deg); }
    }

    .tdc-close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 20;
      transition: background 0.2s;
    }
    .tdc-close-btn:hover { background: rgba(255,255,255,0.16); }
  `;

  return createPortal(
    <>
      <style>{styles}</style>
      <div
        className={`tdc-overlay${visible ? ' tdc-visible' : ''}`}
        onClick={handleBackdropClick}
      >
        <div className="tdc-card-wrapper">
          <div className="tdc-orb-1" />
          <div className="tdc-orb-2" />
          <div className="tdc-orb-3" />

          <div className="tdc-card">
            <div className="tdc-card-noise" />
            <div className="tdc-card-shine" />

            {/* Close button */}
            <div className="tdc-close-btn" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 3l8 8M11 3l-8 8" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <div className="tdc-content">
              {/* Rarity badge */}
              <div className="tdc-badge">
                <div className="tdc-badge-icon">
                  <div className="tdc-badge-dot" />
                </div>
                <span className="tdc-badge-label">{theme.label}</span>
              </div>

              {/* Flippable text panel */}
              <div
                className={`tdc-text-glass${flipped ? ' tdc-flipped' : ''}`}
                onClick={() => setFlipped(f => !f)}
              >
                <div className="tdc-text-glass-inner">
                  {/* Front */}
                  <div className="tdc-text-glass-front">
                    <h2 className="tdc-headline">
                      {line1}<br />
                      <span>{line2}</span>
                    </h2>
                    <p className="tdc-description">
                      {achievement.description}
                    </p>
                  </div>
                  {/* Back */}
                  <div className="tdc-text-glass-back">
                    <div className="tdc-back-item">
                      <div className="tdc-back-icon">
                        <svg viewBox="0 0 14 14" fill="none">
                          <path d="M7 1.5C4 1.5 1.5 4 1.5 7S4 12.5 7 12.5 12.5 10 12.5 7 10 1.5 7 1.5Z" stroke={theme.primary} strokeWidth="1.2"/>
                          <path d="M7 6v4M7 4.5v.5" stroke={theme.primary} strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <div className="tdc-back-item-title">{t('trophy.aboutAward')}</div>
                        <div className="tdc-back-item-desc">{achievement.description}</div>
                      </div>
                    </div>
                    <div className="tdc-back-item">
                      <div className="tdc-back-icon">
                        <svg viewBox="0 0 14 14" fill="none">
                          <path d="M2 7l3.5 3.5L12 3.5" stroke={theme.primary} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <div className="tdc-back-item-title">{t('trophy.howToKeep')}</div>
                        <div className="tdc-back-item-desc">
                          {(CATEGORY_TIPS[achievement.category] || 'Stay active and keep progressing to maintain your achievements.').replace(/\{assistantName\}/g, assistantName)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tdc-flip-arrow">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Stats row */}
              <div className="tdc-stats-row">
                <div className="tdc-stat">
                  <span className="tdc-stat-num">+{achievement.points} pts</span>
                  <span className="tdc-stat-label">{t('trophy.earned')}</span>
                </div>
                <div className="tdc-stat-divider" />
                <div className="tdc-stat">
                  <span className="tdc-stat-num">{dateStr}</span>
                  <span className="tdc-stat-label">Date</span>
                </div>
                {pct && (
                  <>
                    <div className="tdc-stat-divider" />
                    <div className="tdc-stat">
                      <span className="tdc-stat-num">{pct}</span>
                      <span className="tdc-stat-label">of Educators</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Trophy image */}
            <div className="tdc-trophy-side">
              <div className="tdc-trophy-glow" />
              <img
                className="tdc-trophy-img"
                src={trophyImageSrc}
                alt={`${achievement.name} trophy`}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
