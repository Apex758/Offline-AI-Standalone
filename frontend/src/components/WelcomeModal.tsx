import React from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;

interface WelcomeModalProps {
  onClose: () => void;
  onStartTour: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose, onStartTour }) => {
  const { t } = useTranslation();
  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Semi-transparent backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleSkip}
      />
      
      {/* Modal card */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header with gradient */}
        <div className="p-10 text-white" style={{ backgroundColor: '#1D362D' }}>
          <h1 className="text-3xl font-bold text-center mb-3" style={{ color: '#F8E59D' }}>
            {t('dialogs.welcome.title')}
          </h1>
          <p className="text-center text-lg" style={{ color: '#F2A631' }}>
            {t('dialogs.welcome.subtitle')}
          </p>
        </div>

        {/* Content */}
        <div className="p-8" style={{ backgroundColor: '#FDFDF8' }}>
          <div className="space-y-4 mb-8">
            <p className="text-lg leading-relaxed" style={{ color: '#2D2D2D' }}>
              The OECS Teacher Assistant is designed to help teachers create engaging lesson plans, quizzes, rubrics, and more - all tailored to the OECS curriculum.
            </p>

            <div className="rounded-lg p-4" style={{ backgroundColor: '#F8E59D', border: '1px solid #E8EAE3' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#1D362D' }}>Key Features:</h3>
              <ul className="space-y-2" style={{ color: '#3A3A3A' }}>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Lesson planning for multiple grade levels</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Customizable quiz and rubric generation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>OECS curriculum alignment and navigation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Multi-tab workspace with split-screen viewing</span>
                </li>
              </ul>
            </div>

          </div>


          {/* Action buttons */}
          <div className="flex justify-center">
            <button
              onClick={onStartTour}
              className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: '#1D362D',
                color: '#F8E59D',
                boxShadow: '0 4px 12px rgba(29, 54, 45, 0.2)'
              }}
            >
              {t('dialogs.welcome.getStarted')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;