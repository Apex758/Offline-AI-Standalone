import React from 'react';
import type { ImageMode } from '../../types';

interface ImageModeOption {
  id: ImageMode;
  label: string;
  desc: string;
}

interface ImageModeSelectorProps {
  imageMode: ImageMode;
  onModeChange: (mode: ImageMode) => void;
  accentColor: string;
  hasDiffusion: boolean;
  hasVision?: boolean;
  labels?: {
    none?: string;
    suggested?: string;
    myImages?: string;
    ai?: string;
  };
  descs?: {
    none?: string;
    suggested?: string;
    myImages?: string;
    ai?: string;
  };
  /** If true, the 'ai' option renders as disabled with a Tier 3 badge */
  disableAi?: boolean;
}

const ImageModeSelector: React.FC<ImageModeSelectorProps> = ({
  imageMode,
  onModeChange,
  accentColor,
  hasDiffusion,
  hasVision = true,
  labels = {},
  descs = {},
  disableAi = false,
}) => {
  const options: (ImageModeOption & { disabled?: boolean; badge?: string })[] = [
    {
      id: 'none',
      label: labels.none ?? 'No Images',
      desc: descs.none ?? 'Text only',
    },
    {
      id: 'suggested',
      label: labels.suggested ?? 'Suggested',
      desc: descs.suggested ?? 'AI describes images',
    },
    ...(hasVision
      ? [{
          id: 'my-images' as ImageMode,
          label: labels.myImages ?? 'My Images',
          desc: descs.myImages ?? 'Upload your own',
        }]
      : []),
    ...(hasDiffusion
      ? [{
          id: 'ai' as ImageMode,
          label: labels.ai ?? 'AI Generated',
          desc: descs.ai ?? 'Auto-create images',
          disabled: disableAi,
          badge: disableAi ? 'Tier 3' : undefined,
        }]
      : !hasDiffusion
        ? [{
            id: 'ai' as ImageMode,
            label: labels.ai ?? 'AI Generated',
            desc: descs.ai ?? 'Auto-create images',
            disabled: true,
            badge: 'Tier 3',
          }]
        : []),
  ];

  const cols = options.length === 4 ? 'grid-cols-4' : options.length === 3 ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <div className={`grid gap-2 ${cols}`}>
      {options.map(opt => {
        const active = imageMode === opt.id;
        const disabled = opt.disabled ?? false;
        return (
          <button
            key={opt.id}
            onClick={() => !disabled && onModeChange(opt.id)}
            disabled={disabled}
            className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg border-2 transition-all text-center relative"
            style={{
              borderColor: active ? accentColor : 'var(--border-color, #333)',
              background: active ? `${accentColor}14` : 'transparent',
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            <span className="text-xs font-bold" style={{ color: active ? accentColor : undefined }}>
              {opt.label}
            </span>
            <span className="text-[10px] text-theme-muted leading-tight">{opt.desc}</span>
            {opt.badge && (
              <span className="text-[9px] bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-medium mt-0.5">
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ImageModeSelector;
