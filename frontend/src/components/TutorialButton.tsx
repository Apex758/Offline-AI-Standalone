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
      className={`fixed ${positionStyles[position]} w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center z-[9999] group`}
      title={tooltipText}
      aria-label={tooltipText}
    >
      <HelpCircle className="w-6 h-6" />
      
      {/* Pulsing red dot indicator if tutorial not completed */}
      {!isCompleted && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      )}

      {/* Tooltip on hover */}
      <span className="absolute bottom-full mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {tooltipText}
        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></span>
      </span>
    </button>
  );
};

export default TutorialButton;