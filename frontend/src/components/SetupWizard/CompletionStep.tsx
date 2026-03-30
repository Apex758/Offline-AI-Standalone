import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import { FeatureModuleId } from '../../types/feature-disclosure';
import { FEATURE_MODULES } from '../../lib/featureModules';

interface CompletionStepProps {
  selectedModules: FeatureModuleId[];
  teacherName: string;
  onFinish: () => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ selectedModules, teacherName, onFinish }) => {
  const enabledModules = FEATURE_MODULES.filter(m => selectedModules.includes(m.id));

  return (
    <div className="flex flex-col items-center text-center px-8 py-10">
      {/* Success icon */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: 'rgba(242,166,49,0.15)', border: '2px solid #F2A631' }}
      >
        <HugeiconsIcon icon={Tick01IconData} size={32} style={{ color: '#F2A631' }} />
      </div>

      <h2 className="text-2xl font-bold mb-2" style={{ color: '#F8E59D' }}>
        You're all set{teacherName ? `, ${teacherName.split(' ').pop()}` : ''}!
      </h2>
      <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
        Your workspace is ready with {enabledModules.length} feature{enabledModules.length !== 1 ? 's' : ''} enabled.
      </p>

      {/* Summary */}
      <div className="w-full max-w-sm mb-8">
        <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>ENABLED FEATURES</p>
          <div className="space-y-2">
            {enabledModules.map((mod) => (
              <div key={mod.id} className="flex items-center gap-2">
                <HugeiconsIcon icon={Tick01IconData} size={14} style={{ color: '#F2A631' }} />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{mod.name}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
          You can change these anytime in Settings.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onFinish}
        className="px-10 py-3 rounded-xl font-semibold text-base transition-all hover:scale-105 active:scale-95"
        style={{
          backgroundColor: '#F2A631',
          color: '#1D362D',
          boxShadow: '0 4px 16px rgba(242,166,49,0.3)',
        }}
      >
        Start Teaching
      </button>
    </div>
  );
};

export default CompletionStep;
