import React, { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Rocket01IconData from '@hugeicons/core-free-icons/Rocket01Icon';

interface NudgeToastProps {
  message: string;
  ctaLabel: string;
  onEnable: () => void;
  onDismiss: () => void;
}

const NudgeToast: React.FC<NudgeToastProps> = ({ message, ctaLabel, onEnable, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    const showTimer = setTimeout(() => setVisible(true), 50);
    // Auto-dismiss after 8s
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 8000);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, [onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleEnable = () => {
    setVisible(false);
    setTimeout(onEnable, 300);
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-[9000] max-w-sm transition-all duration-300"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="rounded-xl p-4 shadow-2xl"
        style={{
          backgroundColor: '#1D362D',
          border: '1px solid rgba(242,166,49,0.25)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Close */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-full transition-colors"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          <HugeiconsIcon icon={Cancel01IconData} size={14} />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3 pr-4">
          <div className="flex-shrink-0 mt-0.5">
            <HugeiconsIcon icon={Rocket01IconData} size={18} style={{ color: '#F2A631' }} />
          </div>
          <div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {message}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleEnable}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#F2A631', color: '#1D362D' }}
              >
                {ctaLabel}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NudgeToast;
