import React from 'react';

export const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`animate-pulse rounded-md bg-theme-tertiary ${className}`}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';