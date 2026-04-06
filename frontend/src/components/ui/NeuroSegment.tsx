import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export interface NeuroSegmentOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface NeuroSegmentProps<T extends string = string> {
  options: NeuroSegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** sm: compact | md: standard (default) | lg: prominent */
  size?: 'sm' | 'md' | 'lg';
  /** invert: for use on dark/colored backgrounds */
  variant?: 'default' | 'invert';
  /**
   * pill: fully rounded (for icon-only segments)
   * rect: rounded rectangle (for text-label segments)
   * auto (default): rect when any option has a text label, pill otherwise
   */
  shape?: 'pill' | 'rect' | 'auto';
  className?: string;
  'aria-label'?: string;
}

interface PillGeometry {
  left: number;
  width: number;
}

export function NeuroSegment<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  variant = 'default',
  shape = 'auto',
  className = '',
  ...rest
}: NeuroSegmentProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState<PillGeometry>({ left: 0, width: 0 });

  const updatePill = useCallback(() => {
    const activeIdx = options.findIndex((o) => o.value === value);
    if (activeIdx === -1) return;

    const btn = buttonRefs.current[activeIdx];
    const container = containerRef.current;
    if (!btn || !container) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    setPill({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    });
  }, [options, value]);

  // Use layout effect so pill position is set synchronously before paint
  useLayoutEffect(() => {
    updatePill();
  }, [updatePill]);

  // Also update on resize
  useEffect(() => {
    const observer = new ResizeObserver(() => updatePill());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updatePill]);

  const variantClass = variant === 'invert' ? ' ng-invert' : '';
  const hasText = options.some((o) => o.label && o.label.trim().length > 0);
  const shapeClass =
    shape === 'rect' || (shape === 'auto' && hasText) ? ' ng-rect' : '';

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={rest['aria-label']}
      className={`ng-segment ng-${size}${variantClass}${shapeClass} ${className}`.trim()}
    >
      {/* Sliding pill */}
      <div
        className="ng-segment-pill"
        style={{
          left: pill.left,
          width: pill.width,
        }}
        aria-hidden="true"
      />

      {options.map((opt, idx) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              buttonRefs.current[idx] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={opt.disabled}
            onClick={() => {
              if (!opt.disabled) onChange(opt.value);
            }}
            className={`ng-segment-btn${isActive ? ' ng-seg-active' : ''}`}
          >
            {opt.icon && opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
