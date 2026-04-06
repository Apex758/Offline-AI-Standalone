import React, { useCallback, useRef } from 'react';

export interface NeuroSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** sm | md (default) */
  size?: 'sm' | 'md';
  /** Orientation: horizontal (default) | vertical */
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
}

export const NeuroSlider: React.FC<NeuroSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  size = 'md',
  orientation = 'horizontal',
  disabled = false,
  className = '',
  ...rest
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const pct = ((value - min) / (max - min)) * 100;

  const commit = useCallback(
    (clientPos: number) => {
      const track = trackRef.current;
      if (!track || disabled) return;
      const rect = track.getBoundingClientRect();
      let ratio: number;
      if (orientation === 'vertical') {
        ratio = 1 - (clientPos - rect.top) / rect.height;
      } else {
        ratio = (clientPos - rect.left) / rect.width;
      }
      ratio = Math.max(0, Math.min(1, ratio));
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      const clamped = Math.max(min, Math.min(max, stepped));
      if (clamped !== value) onChange(clamped);
    },
    [disabled, min, max, step, value, onChange, orientation]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      const pos = orientation === 'vertical' ? e.clientY : e.clientX;
      commit(pos);
    },
    [disabled, commit, orientation]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || !e.buttons) return;
      const pos = orientation === 'vertical' ? e.clientY : e.clientX;
      commit(pos);
    },
    [disabled, commit, orientation]
  );

  const isVert = orientation === 'vertical';
  const sizeClass = `ng-slider-${size}`;
  const orientClass = isVert ? 'ng-slider-vertical' : 'ng-slider-horizontal';

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-disabled={disabled}
      aria-orientation={orientation}
      tabIndex={disabled ? -1 : 0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      className={`ng-slider-track ${sizeClass} ${orientClass}${disabled ? ' ng-disabled' : ''} ${className}`.trim()}
      aria-label={rest['aria-label']}
      onKeyDown={(e) => {
        if (disabled) return;
        const inc = e.shiftKey ? step * 5 : step;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          onChange(Math.min(max, value + inc));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          onChange(Math.max(min, value - inc));
        }
      }}
    >
      {/* Fill */}
      <div
        className="ng-slider-fill"
        style={
          isVert
            ? { height: `${pct}%`, bottom: 0 }
            : { width: `${pct}%` }
        }
      />
      {/* Thumb */}
      <div
        className="ng-slider-thumb"
        style={
          isVert
            ? { bottom: `${pct}%`, transform: `translateX(-50%) translateY(50%)`, left: '50%' }
            : { left: `${pct}%`, transform: `translateX(-50%) translateY(-50%)`, top: '50%' }
        }
      />
    </div>
  );
};
