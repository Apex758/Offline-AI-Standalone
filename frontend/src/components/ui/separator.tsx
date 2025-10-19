import React from 'react';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  decorative?: boolean;
}

export function Separator({ 
  orientation = 'horizontal', 
  className = '',
  decorative = true 
}: SeparatorProps) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={orientation}
      className={`
        ${orientation === 'horizontal' 
          ? 'h-px w-full' 
          : 'h-full w-px'
        }
        bg-gray-200
        ${className}
      `}
    />
  );
}

export default Separator;