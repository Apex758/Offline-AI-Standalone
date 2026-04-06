import React, { useCallback, useState } from 'react';

export interface NeuroSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** sm: 36x20 | md: 52x28 (default) | lg: 72x40 */
  size?: 'sm' | 'md' | 'lg';
  /** Icon shown when OFF */
  offIcon?: React.ReactNode;
  /** Icon shown when ON */
  onIcon?: React.ReactNode;
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const NeuroSwitch: React.FC<NeuroSwitchProps> = ({
  checked,
  onChange,
  size = 'md',
  offIcon,
  onIcon,
  disabled = false,
  className = '',
  ...rest
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const id = Date.now();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipples((r) => [...r, { id, x, y }]);
      onChange(!checked);
    },
    [disabled, checked, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onChange(!checked);
      }
    },
    [disabled, checked, onChange]
  );

  const removeRipple = useCallback((id: number) => {
    setRipples((r) => r.filter((rp) => rp.id !== id));
  }, []);

  const hasIcons = offIcon != null || onIcon != null;

  return (
    <div
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`ng-track ng-${size}${checked ? ' ng-on' : ''}${disabled ? ' ng-disabled' : ''} ${className}`.trim()}
      aria-label={rest['aria-label']}
    >
      <div className="ng-thumb">
        {hasIcons && (
          <>
            <span
              className={`ng-icon-off ${checked ? 'ng-icon-hidden' : 'ng-icon-visible'}`}
            >
              {offIcon}
            </span>
            <span
              className={`ng-icon-on ${checked ? 'ng-icon-visible' : 'ng-icon-hidden'}`}
            >
              {onIcon}
            </span>
          </>
        )}
      </div>

      {ripples.map((rp) => (
        <span
          key={rp.id}
          className="ng-ripple"
          style={{
            left: rp.x - 4,
            top: rp.y - 4,
            width: 8,
            height: 8,
          }}
          onAnimationEnd={() => removeRipple(rp.id)}
        />
      ))}
    </div>
  );
};
