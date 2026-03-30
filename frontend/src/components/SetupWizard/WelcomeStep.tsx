import React from 'react';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center text-center px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#F8E59D' }}>
          Welcome to the OECS Learning Hub
        </h1>
        <p className="text-lg" style={{ color: '#F2A631' }}>
          Empowering Teachers Across the Eastern Caribbean
        </p>
      </div>

      {/* Body */}
      <div className="max-w-md mb-10">
        <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Let's personalize your experience so you only see the tools you need.
        </p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
          This takes less than a minute. You can always change your choices later in Settings.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onNext}
        className="px-8 py-3 rounded-xl font-semibold text-base transition-all hover:scale-105 active:scale-95"
        style={{
          backgroundColor: '#F2A631',
          color: '#1D362D',
          boxShadow: '0 4px 16px rgba(242,166,49,0.3)',
        }}
      >
        Get Started
      </button>
    </div>
  );
};

export default WelcomeStep;
