import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface TutorialButtonProps {
  tutorialId: string;
  onStartTutorial: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const TutorialButton: React.FC<TutorialButtonProps> = ({
  tutorialId,
  onStartTutorial,
  position = 'bottom-right'
}) => {
  const { settings, isTutorialCompleted } = useSettings();
  
  // Don't render if user disabled floating buttons
  if (!settings.tutorials.tutorialPreferences.showFloatingButtons) {
    return null;
  }

  const isCompleted = isTutorialCompleted(tutorialId);
  const tooltipText = isCompleted ? 'Replay Tutorial' : 'Start Tutorial';

  // Position styles based on prop
  const positionStyles: Record<typeof position, string> = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <button
      onClick={onStartTutorial}
      className={`fixed ${positionStyles[position]} w-13 h-13 text-white rounded-2xl flex items-center justify-center z-[9999] group`}
      style={{
        width: '52px',
        height: '52px',
        background: 'linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(var(--primary) / 0.75) 100%)',
        boxShadow: '0 8px 32px rgb(var(--ring) / 0.45), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.12)',
        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1) translateY(-2px)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgb(var(--ring) / 0.6), 0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1) translateY(0)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgb(var(--ring) / 0.45), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)';
      }}
      title={tooltipText}
      aria-label={tooltipText}
    >
      <HelpCircle className="w-5 h-5" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />

      {/* Pulsing dot indicator if tutorial not completed */}
      {!isCompleted && (
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#f43f5e' }}></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5" style={{ background: 'linear-gradient(135deg, #fb7185, #f43f5e)', boxShadow: '0 0 6px rgba(244,63,94,0.6)' }}></span>
        </span>
      )}

      {/* Tooltip on hover */}
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
        {tooltipText}
        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent" style={{ borderTopColor: 'rgba(15,15,25,0.9)' }}></span>
      </span>
    </button>
  );
};

export default TutorialButton;