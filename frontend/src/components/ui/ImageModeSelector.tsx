import React, {
  useRef, useState, useLayoutEffect, useEffect, useCallback, useMemo,
} from 'react';
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

interface PillGeometry {
  left: number;
  width: number;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState<PillGeometry>({ left: 0, width: 0 });

  const options = useMemo(
    (): (ImageModeOption & { disabled?: boolean; badge?: string })[] => [
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
        : [{
            id: 'ai' as ImageMode,
            label: labels.ai ?? 'AI Generated',
            desc: descs.ai ?? 'Auto-create images',
            disabled: true,
            badge: 'Tier 3',
          }]),
    ],
    [labels, descs, hasVision, hasDiffusion, disableAi],
  );

  const updatePill = useCallback(() => {
    const activeIdx = options.findIndex(o => o.id === imageMode);
    if (activeIdx === -1) return;
    const btn = buttonRefs.current[activeIdx];
    const container = containerRef.current;
    if (!btn || !container) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setPill({ left: btnRect.left - containerRect.left, width: btnRect.width });
  }, [options, imageMode]);

  useLayoutEffect(() => { updatePill(); }, [updatePill]);

  useEffect(() => {
    const observer = new ResizeObserver(() => updatePill());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updatePill]);

  return (
    <div
      ref={containerRef}
      className="ng-segment ng-rect w-full"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        '--ng-accent': accentColor,
      } as React.CSSProperties}
    >
      {/* Sliding pill */}
      <div
        className="ng-segment-pill"
        style={{ left: pill.left, width: pill.width }}
        aria-hidden="true"
      />

      {options.map((opt, idx) => {
        const active = imageMode === opt.id;
        const disabled = opt.disabled ?? false;
        return (
          <button
            key={opt.id}
            ref={el => { buttonRefs.current[idx] = el; }}
            type="button"
            onClick={() => !disabled && onModeChange(opt.id)}
            disabled={disabled}
            className={`ng-segment-btn flex-col gap-0.5 py-2.5${active ? ' ng-seg-active' : ''}`}
            style={{
              height: 'auto',
              opacity: disabled ? 0.45 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
              borderRadius: '5px',
            }}
          >
            <span className="text-xs font-semibold leading-tight">{opt.label}</span>
            <span className="text-[10px] leading-tight" style={{ opacity: 0.7 }}>{opt.desc}</span>
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
