import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import HelpCircleIconData from '@hugeicons/core-free-icons/HelpCircleIcon';
import Search01IconData from '@hugeicons/core-free-icons/Search01Icon';
import GraduationScrollIconData from '@hugeicons/core-free-icons/GraduationScrollIcon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Camera01IconData from '@hugeicons/core-free-icons/Camera01Icon';
import Moon02IconData from '@hugeicons/core-free-icons/Moon02Icon';
import Sun01IconData from '@hugeicons/core-free-icons/Sun01Icon';
import Sun02IconData from '@hugeicons/core-free-icons/Sun02Icon';
import FireIconData from '@hugeicons/core-free-icons/FireIcon';
import { useSettings } from '../contexts/SettingsContext';
import { NeuroSwitch } from './ui/NeuroSwitch';
import { NeuroSlider } from './ui/NeuroSlider';
import PencilEdit01IconData from '@hugeicons/core-free-icons/PencilEdit01Icon';
import { OECS_LOGO_BASE64 } from '../utils/logoBase64';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const HelpCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={HelpCircleIconData} {...p} />;
const Search: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Search01IconData} {...p} />;
const GraduationCap: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={GraduationScrollIconData} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const Camera: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Camera01IconData} {...p} />;
const Moon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Moon02IconData} {...p} />;
const Sun: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Sun01IconData} {...p} />;
const Sun02: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Sun02IconData} {...p} />;
const Fire: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FireIconData} {...p} />;
const StickyNoteIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PencilEdit01IconData} {...p} />;

interface TutorialButtonProps {
  tutorialId: string;
  onStartTutorial: () => void;
  onOpenSearch?: () => void;
  onScreenshotTicket?: () => void;
  onStickyNote?: () => void;
  stickyNoteCount?: number;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  ghost?: boolean;
  forceExpanded?: boolean;
}

export const TutorialButton: React.FC<TutorialButtonProps> = ({
  tutorialId,
  onStartTutorial,
  onOpenSearch,
  onScreenshotTicket,
  onStickyNote,
  stickyNoteCount = 0,
  position = 'bottom-right',
  ghost = false,
  forceExpanded = false
}) => {
  const { t } = useTranslation();
  const { settings, isTutorialCompleted, updateSettings } = useSettings();
  const [expanded, setExpanded] = useState(false);
  const isExpanded = expanded || forceExpanded;
  const [displayPanelOpen, setDisplayPanelOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const containerRef = useRef<HTMLDivElement>(null);
  const displayPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Don't render if user disabled floating buttons
  if (!settings.tutorials.tutorialPreferences.showFloatingButtons) {
    return null;
  }

  const isCompleted = isTutorialCompleted(tutorialId);

  // Close when clicking outside (skip when tutorial forces expanded)
  useEffect(() => {
    if (!expanded || forceExpanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded, forceExpanded]);

  // Close on Escape (skip when tutorial forces expanded)
  useEffect(() => {
    if (!expanded || forceExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expanded, forceExpanded]);

  const positionStyles: Record<typeof position, string> = {
    'bottom-right': 'bottom-6 right-12',
    'bottom-left': 'bottom-[7rem] right-[1.5rem]',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const handleMainClick = () => {
    if (onOpenSearch) {
      setExpanded(prev => !prev);
    } else {
      onStartTutorial();
    }
  };

  const handleTutorialClick = () => {
    if (!forceExpanded) setExpanded(false);
    onStartTutorial();
  };

  const handleSearchClick = () => {
    if (!forceExpanded) setExpanded(false);
    onOpenSearch?.();
  };

  const handleScreenshotClick = async () => {
    if (!forceExpanded) setExpanded(false);
    onScreenshotTicket?.();
  };

  const handleStickyNoteClick = () => {
    if (!forceExpanded) setExpanded(false);
    onStickyNote?.();
  };

  const handleToggleTheme = () => {
    updateSettings({ theme: isDarkMode ? 'light' : 'dark' });
  };

  // Close display panel when clicking outside
  useEffect(() => {
    if (!displayPanelOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        displayPanelRef.current && !displayPanelRef.current.contains(e.target as Node) &&
        containerRef.current && !containerRef.current.contains(e.target as Node)
      ) {
        setDisplayPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [displayPanelOpen]);

  // Close display panel when FAB collapses
  useEffect(() => {
    if (!isExpanded) setDisplayPanelOpen(false);
  }, [isExpanded]);

  const mainButtonStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    background: isExpanded
      ? 'linear-gradient(135deg, rgba(100,116,139,0.95), rgba(71,85,105,0.95))'
      : 'linear-gradient(135deg, #22c55e, #16a34a)',
    boxShadow: '0 8px 32px rgba(250,204,21,0.45), 0 2px 8px rgba(245,158,11,0.25)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(34,197,94,0.4)',
    transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, background 0.2s ease',
    padding: isExpanded ? 0 : '6px',
    overflow: 'hidden',
  };

  const subButtonBase: React.CSSProperties = {
    width: '46px',
    height: '46px',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.12)',
    transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease, box-shadow 0.2s ease',
  };

  return (
    <div
      ref={containerRef}
      data-tutorial="fab-container"
      className={`fixed ${positionStyles[position]} z-[9999] flex flex-col items-center gap-3 transition-opacity duration-200`}
      style={ghost && !isExpanded ? { opacity: 0.15 } : { opacity: 1 }}
      onMouseEnter={(e) => { if (ghost) e.currentTarget.style.opacity = '1'; }}
      onMouseLeave={(e) => { if (ghost && !isExpanded) e.currentTarget.style.opacity = '0.15'; }}
    >
      {/* Expanded sub-buttons — appear above the main FAB */}
      {onOpenSearch && (
        <>
          {/* Search button */}
          <button
            onClick={handleSearchClick}
            data-tutorial="fab-search"
            className="rounded-2xl flex items-center justify-center text-white group/sub relative"
            style={{
              ...subButtonBase,
              background: 'linear-gradient(135deg, rgba(59,130,246,0.92), rgba(37,99,235,0.92))',
              boxShadow: isExpanded
                ? '0 6px 24px rgba(59,130,246,0.45), 0 2px 8px rgba(0,0,0,0.15)'
                : '0 0 0 rgba(0,0,0,0)',
              opacity: isExpanded ? 1 : 0,
              transform: isExpanded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.5)',
              pointerEvents: isExpanded ? 'auto' : 'none',
              transitionDelay: isExpanded ? '0.12s' : '0s',
            }}
            title={t('tutorialButton.searchShortcut')}
            aria-label={t('tutorialButton.search')}
          >
            <Search className="w-[18px] h-[18px]" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
            {/* Tooltip */}
            <span
              className="absolute right-full mr-3 px-3 py-1.5 text-white text-xs rounded-xl opacity-0 group-hover/sub:opacity-100 whitespace-nowrap pointer-events-none"
              style={{
                background: 'rgba(15,15,25,0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                transition: 'opacity 0.15s ease',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
            >
              {t('tutorialButton.search')}
              <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-px border-4 border-transparent" style={{ borderLeftColor: 'rgba(15,15,25,0.9)' }}></span>
            </span>
          </button>

          {/* Display controls button */}
          <button
            onClick={() => setDisplayPanelOpen(prev => !prev)}
            data-tutorial="fab-display"
            className="rounded-2xl flex items-center justify-center text-white group/sub relative"
            style={{
              ...subButtonBase,
              background: isDarkMode
                ? (displayPanelOpen
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.95), rgba(79,70,229,0.95))'
                  : 'linear-gradient(135deg, rgba(99,102,241,0.92), rgba(79,70,229,0.92))')
                : (displayPanelOpen
                  ? 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))'
                  : 'linear-gradient(135deg, rgba(251,191,36,0.92), rgba(245,158,11,0.92))'),
              boxShadow: isExpanded
                ? (isDarkMode
                  ? '0 6px 24px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.15)'
                  : '0 6px 24px rgba(251,191,36,0.45), 0 2px 8px rgba(0,0,0,0.15)')
                : '0 0 0 rgba(0,0,0,0)',
              opacity: isExpanded ? 1 : 0,
              transform: isExpanded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.5)',
              pointerEvents: isExpanded ? 'auto' : 'none',
              transitionDelay: isExpanded ? '0.09s' : '0.01s',
            }}
            title={t('tutorialButton.displayControls')}
            aria-label={t('tutorialButton.displayControls')}
          >
            {isDarkMode ? (
              <Moon className="w-[18px] h-[18px]" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
            ) : (
              <Sun02 className="w-[18px] h-[18px]" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
            )}
            {/* Tooltip */}
            <span
              className="absolute right-full mr-3 px-3 py-1.5 text-white text-xs rounded-xl opacity-0 group-hover/sub:opacity-100 whitespace-nowrap pointer-events-none"
              style={{
                background: 'rgba(15,15,25,0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                transition: 'opacity 0.15s ease',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
            >
              {t('tutorialButton.displayControls')}
              <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-px border-4 border-transparent" style={{ borderLeftColor: 'rgba(15,15,25,0.9)' }}></span>
            </span>
          </button>

          {/* Display Controls Panel */}
          {displayPanelOpen && (
            <div
              ref={displayPanelRef}
              className="absolute right-[62px] rounded-2xl p-4"
              style={{
                bottom: '0px',
                background: 'var(--ng-track-bg)',
                border: '1px solid var(--ng-thumb-border)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                filter: `brightness(${1 / (settings.brightness / 100)})`,
                minWidth: '220px',
                animation: 'fadeIn 0.2s ease',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Row 1: Vertical sliders */}
              <div className="flex gap-6 justify-center mb-4">
                {/* Brightness column */}
                <div className="flex flex-col items-center gap-2">
                  <Sun02 className="w-4 h-4" style={{ color: 'var(--ng-accent)' }} />
                  <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: 'var(--text-label, #444)' }}>
                    {t('tutorialButton.brightness')}
                  </span>
                  <NeuroSlider
                    value={settings.brightness}
                    onChange={(v) => updateSettings({ brightness: v })}
                    min={50}
                    max={150}
                    step={5}
                    size="sm"
                    orientation="vertical"
                    aria-label="Brightness"
                  />
                  <span className="text-xs font-bold" style={{ color: 'var(--text-label, #444)' }}>
                    {settings.brightness}%
                  </span>
                </div>

                {/* Warm Tone column */}
                <div className="flex flex-col items-center gap-2">
                  <Fire className="w-4 h-4" style={{ color: 'var(--ng-accent)' }} />
                  <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: 'var(--text-label, #444)' }}>
                    {t('tutorialButton.warmth')}
                  </span>
                  <NeuroSlider
                    value={settings.warmTone}
                    onChange={(v) => updateSettings({ warmTone: v })}
                    min={0}
                    max={100}
                    step={5}
                    size="sm"
                    orientation="vertical"
                    disabled={!settings.warmToneEnabled}
                    aria-label="Warm tone"
                  />
                  <span className="text-xs font-bold" style={{ color: 'var(--text-label, #444)' }}>
                    {settings.warmTone}%
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px mb-3" style={{ background: 'var(--ng-track-lo)' }} />

              {/* Row 2: Toggles */}
              <div className="flex gap-4 justify-center">
                {/* Night Mode toggle */}
                <div className="flex flex-col items-center gap-1.5 px-3 py-2">
                  {isDarkMode ? (
                    <Moon className="w-4 h-4" style={{ color: 'var(--ng-accent)' }} />
                  ) : (
                    <Sun className="w-4 h-4" style={{ color: 'var(--ng-accent)' }} />
                  )}
                  <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: 'var(--text-label, #444)' }}>
                    {isDarkMode ? t('tutorialButton.dark') : t('tutorialButton.light')}
                  </span>
                  <NeuroSwitch
                    checked={isDarkMode}
                    onChange={() => handleToggleTheme()}
                    size="sm"
                    offIcon={<Sun className="w-2.5 h-2.5" style={{ color: '#fbbf24' }} />}
                    onIcon={<Moon className="w-2.5 h-2.5" style={{ color: '#a5b4fc' }} />}
                    aria-label="Toggle theme"
                  />
                </div>

                {/* Warm Tone toggle */}
                <div className="flex flex-col items-center gap-1.5 px-3 py-2">
                  <Fire className="w-4 h-4" style={{ color: settings.warmToneEnabled ? 'var(--ng-accent)' : 'var(--text-muted, #999)' }} />
                  <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: 'var(--text-label, #444)' }}>
                    {t('tutorialButton.warmth')}
                  </span>
                  <NeuroSwitch
                    checked={settings.warmToneEnabled}
                    onChange={(v) => updateSettings({ warmToneEnabled: v })}
                    size="sm"
                    aria-label="Toggle warm tone"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Screenshot Ticket button */}
          {onScreenshotTicket && (
            <button
              onClick={handleScreenshotClick}
              data-tutorial="fab-screenshot"
              className="rounded-2xl flex items-center justify-center text-white group/sub relative"
              style={{
                ...subButtonBase,
                background: 'linear-gradient(135deg, rgba(239,68,68,0.92), rgba(220,38,38,0.92))',
                boxShadow: isExpanded
                  ? '0 6px 24px rgba(239,68,68,0.45), 0 2px 8px rgba(0,0,0,0.15)'
                  : '0 0 0 rgba(0,0,0,0)',
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.5)',
                pointerEvents: isExpanded ? 'auto' : 'none',
                transitionDelay: isExpanded ? '0.06s' : '0.02s',
              }}
              title={t('tutorialButton.reportIssue')}
              aria-label={t('tutorialButton.reportIssueDesc')}
            >
              <Camera className="w-[18px] h-[18px]" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
              {/* Tooltip */}
              <span
                className="absolute right-full mr-3 px-3 py-1.5 text-white text-xs rounded-xl opacity-0 group-hover/sub:opacity-100 whitespace-nowrap pointer-events-none"
                style={{
                  background: 'rgba(15,15,25,0.9)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  transition: 'opacity 0.15s ease',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                }}
              >
                {t('tutorialButton.reportIssueTooltip')}
                <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-px border-4 border-transparent" style={{ borderLeftColor: 'rgba(15,15,25,0.9)' }}></span>
              </span>
            </button>
          )}

          {/* Sticky Notes button */}
          {onStickyNote && (
            <button
              onClick={handleStickyNoteClick}
              data-tutorial="fab-sticky"
              className="rounded-2xl flex items-center justify-center text-white group/sub relative"
              style={{
                ...subButtonBase,
                background: 'linear-gradient(135deg, rgba(251,191,36,0.72), rgba(234,179,8,0.82))',
                boxShadow: isExpanded
                  ? '0 6px 24px rgba(234,179,8,0.45), 0 2px 8px rgba(0,0,0,0.15)'
                  : '0 0 0 rgba(0,0,0,0)',
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.5)',
                pointerEvents: isExpanded ? 'auto' : 'none',
                transitionDelay: isExpanded ? '0.04s' : '0.03s',
              }}
              title={t('tutorialButton.stickyNotes')}
              aria-label={t('tutorialButton.stickyNotes')}
            >
              <StickyNoteIcon className="w-[18px] h-[18px]" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
              {/* Count badge */}
              {stickyNoteCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white text-[9px] font-bold"
                  style={{
                    width: 16, height: 16,
                    background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                    boxShadow: '0 0 6px rgba(244,63,94,0.6)',
                  }}
                >
                  {stickyNoteCount}
                </span>
              )}
              {/* Tooltip */}
              <span
                className="absolute right-full mr-3 px-3 py-1.5 text-white text-xs rounded-xl opacity-0 group-hover/sub:opacity-100 whitespace-nowrap pointer-events-none"
                style={{
                  background: 'rgba(15,15,25,0.9)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  transition: 'opacity 0.15s ease',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                }}
              >
                {t('tutorialButton.stickyNotes')}
                <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-px border-4 border-transparent" style={{ borderLeftColor: 'rgba(15,15,25,0.9)' }}></span>
              </span>
            </button>
          )}

          {/* Tutorial button */}
          <button
            onClick={handleTutorialClick}
            data-tutorial="fab-tutorial"
            className="rounded-2xl flex items-center justify-center text-white group/sub relative"
            style={{
              ...subButtonBase,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.92), rgba(5,150,105,0.92))',
              boxShadow: isExpanded
                ? '0 6px 24px rgba(16,185,129,0.45), 0 2px 8px rgba(0,0,0,0.15)'
                : '0 0 0 rgba(0,0,0,0)',
              opacity: isExpanded ? 1 : 0,
              transform: isExpanded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.5)',
              pointerEvents: isExpanded ? 'auto' : 'none',
              transitionDelay: isExpanded ? '0.02s' : '0.04s',
            }}
            title={isCompleted ? t('tutorialButton.replayTutorial') : t('tutorialButton.startTutorial')}
            aria-label={isCompleted ? t('tutorialButton.replayTutorial') : t('tutorialButton.startTutorial')}
          >
            <GraduationCap className="w-[18px] h-[18px]" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
            {/* Pulsing dot if not completed */}
            {!isCompleted && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#f43f5e' }}></span>
                <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: 'linear-gradient(135deg, #fb7185, #f43f5e)', boxShadow: '0 0 6px rgba(244,63,94,0.6)' }}></span>
              </span>
            )}
            {/* Tooltip */}
            <span
              className="absolute right-full mr-3 px-3 py-1.5 text-white text-xs rounded-xl opacity-0 group-hover/sub:opacity-100 whitespace-nowrap pointer-events-none"
              style={{
                background: 'rgba(15,15,25,0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                transition: 'opacity 0.15s ease',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
            >
              {isCompleted ? t('tutorialButton.replayTutorial') : t('tutorialButton.startTutorial')}
              <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-px border-4 border-transparent" style={{ borderLeftColor: 'rgba(15,15,25,0.9)' }}></span>
            </span>
          </button>
        </>
      )}

      {/* Main FAB */}
      <button
        onClick={handleMainClick}
        data-tutorial="fab-main"
        className="rounded-2xl flex items-center justify-center text-white group relative"
        style={mainButtonStyle}
        onMouseEnter={e => {
          if (!isExpanded) {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1) translateY(-2px)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(250,204,21,0.55), 0 4px 12px rgba(245,158,11,0.3)';
          }
        }}
        onMouseLeave={e => {
          if (!isExpanded) {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1) translateY(0)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(250,204,21,0.45), 0 2px 8px rgba(245,158,11,0.25)';
          }
        }}
        title={onOpenSearch ? (isExpanded ? t('tutorialButton.close') : t('tutorialButton.helpAndSearch')) : (isCompleted ? t('tutorialButton.replayTutorial') : t('tutorialButton.startTutorial'))}
        aria-label={onOpenSearch ? t('tutorialButton.helpAndSearch') : t('tutorialButton.tutorial')}
      >
        {isExpanded ? (
          <X className="w-5 h-5" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))', transition: 'transform 0.2s ease', transform: 'rotate(0deg)' }} />
        ) : (
          <img
            src={OECS_LOGO_BASE64}
            alt={t('tutorialButton.oecs')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '12px',
            }}
            draggable={false}
          />
        )}

        {/* Pulsing dot — only when no onOpenSearch (old behavior) and not completed */}
        {!onOpenSearch && !isCompleted && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#f43f5e' }}></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5" style={{ background: 'linear-gradient(135deg, #fb7185, #f43f5e)', boxShadow: '0 0 6px rgba(244,63,94,0.6)' }}></span>
          </span>
        )}

        {/* Tooltip — only when not expanded and no sub-buttons */}
        {!onOpenSearch && (
          <span
            className="absolute bottom-full mb-3 px-3 py-1.5 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none"
            style={{
              background: 'rgba(15,15,25,0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              transition: 'opacity 0.15s ease, transform 0.15s ease',
              transform: 'translateX(-50%)',
              left: '50%',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            {isCompleted ? t('tutorialButton.replayTutorial') : t('tutorialButton.startTutorial')}
            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent" style={{ borderTopColor: 'rgba(15,15,25,0.9)' }}></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default TutorialButton;
