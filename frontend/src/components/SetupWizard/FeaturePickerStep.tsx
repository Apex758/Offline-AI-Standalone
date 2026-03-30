import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import BookBookmark01IconData from '@hugeicons/core-free-icons/BookBookmark01Icon';
import Search01IconData from '@hugeicons/core-free-icons/Search01Icon';
import PenTool01IconData from '@hugeicons/core-free-icons/PenTool01Icon';
import UserMultipleIconData from '@hugeicons/core-free-icons/UserMultipleIcon';
import BrainIconData from '@hugeicons/core-free-icons/BrainIcon';
import ColorsIconData from '@hugeicons/core-free-icons/ColorsIcon';

import { FeatureModuleId } from '../../types/feature-disclosure';
import { FEATURE_MODULES, PERSONA_PRESETS } from '../../lib/featureModules';

const iconDataMap: Record<string, any> = {
  BookMarked: BookBookmark01IconData,
  Search: Search01IconData,
  PenTool: PenTool01IconData,
  UsersRound: UserMultipleIconData,
  Brain: BrainIconData,
  Palette: ColorsIconData,
};

interface FeaturePickerStepProps {
  selectedModules: FeatureModuleId[];
  onToggleModule: (id: FeatureModuleId) => void;
  onApplyPreset: (modules: FeatureModuleId[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const FeaturePickerStep: React.FC<FeaturePickerStepProps> = ({
  selectedModules, onToggleModule, onApplyPreset, onNext, onBack,
}) => {
  const canContinue = selectedModules.length > 0;

  return (
    <div className="px-8 py-6">
      <h2 className="text-2xl font-bold mb-1" style={{ color: '#F8E59D' }}>Choose your tools</h2>
      <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>Pick what you need now — you can enable more anytime in Settings.</p>

      {/* Persona Presets */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PERSONA_PRESETS.map((preset) => {
          const isActive = preset.modules.length === selectedModules.length &&
            preset.modules.every(m => selectedModules.includes(m));
          return (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset.modules)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: isActive ? 'rgba(242,166,49,0.2)' : 'rgba(255,255,255,0.06)',
                border: `1.5px solid ${isActive ? '#F2A631' : 'rgba(255,255,255,0.12)'}`,
                color: isActive ? '#F2A631' : 'rgba(255,255,255,0.5)',
              }}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Feature Module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}>
        {FEATURE_MODULES.map((mod) => {
          const selected = selectedModules.includes(mod.id);
          const iconData = iconDataMap[mod.icon];
          return (
            <button
              key={mod.id}
              onClick={() => onToggleModule(mod.id)}
              className="relative text-left p-4 rounded-xl transition-all"
              style={{
                backgroundColor: selected ? 'rgba(242,166,49,0.08)' : 'rgba(255,255,255,0.04)',
                border: `2px solid ${selected ? '#F2A631' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {/* Checkmark */}
              {selected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F2A631' }}>
                  <HugeiconsIcon icon={Tick01IconData} size={12} style={{ color: '#1D362D' }} />
                </div>
              )}

              {/* Icon & Title */}
              <div className="flex items-center gap-2.5 mb-2">
                {iconData && (
                  <HugeiconsIcon
                    icon={iconData}
                    size={20}
                    style={{ color: selected ? '#F2A631' : 'rgba(255,255,255,0.4)' }}
                  />
                )}
                <span className="text-sm font-semibold" style={{ color: selected ? '#F8E59D' : 'rgba(255,255,255,0.7)' }}>
                  {mod.name}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {mod.description}
              </p>

              {/* Tool list */}
              <div className="flex flex-wrap gap-1">
                {mod.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: selected ? 'rgba(242,166,49,0.12)' : 'rgba(255,255,255,0.06)',
                      color: selected ? '#F2A631' : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ color: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          Back
        </button>
        <div className="flex items-center gap-3">
          {!canContinue && (
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Select at least 1 module</span>
          )}
          <button
            onClick={onNext}
            disabled={!canContinue}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
            style={{
              backgroundColor: '#F2A631',
              color: '#1D362D',
              boxShadow: canContinue ? '0 4px 16px rgba(242,166,49,0.3)' : 'none',
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturePickerStep;
