import React, { useCallback, useState } from 'react';

export interface NeuroChevronProps {
  expanded: boolean;
  onToggle: () => void;
  /** sm: 24px | md: 32px (default) */
  size?: 'sm' | 'md';
  'aria-label'?: string;
  /** When true, the button is purely decorative — keyboard nav handled by parent */
  'aria-hidden'?: boolean;
  className?: string;
}

export const NeuroChevron: React.FC<NeuroChevronProps> = ({
  expanded,
  onToggle,
  size = 'md',
  className = '',
  ...rest
}) => {
  const [pressed, setPressed] = useState(false);

  const handleClick = useCallback(() => {
    onToggle();
  }, [onToggle]);

  const iconSize = size === 'sm' ? 12 : 16;

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      aria-expanded={expanded}
      aria-label={rest['aria-label']}
      aria-hidden={rest['aria-hidden']}
      tabIndex={rest['aria-hidden'] ? -1 : 0}
      className={`ng-chevron-btn ng-chevron-${size}${pressed ? ' ng-chevron-pressed' : ''} ${className}`.trim()}
    >
      <svg
        className={`ng-chevron-icon${expanded ? ' ng-chevron-expanded' : ''}`}
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
};
