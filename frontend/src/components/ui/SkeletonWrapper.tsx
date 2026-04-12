import React from 'react';
import { HeartbeatLoader } from './HeartbeatLoader';

interface SkeletonWrapperProps {
  children: React.ReactNode;
  /** HeartbeatLoader size in px (default 22) */
  size?: number;
  /** Extra classes on the outer container */
  className?: string;
}

export const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  children,
  size = 22,
  className = '',
}) => {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <div className="absolute top-8 right-12 z-10 opacity-60">
        <HeartbeatLoader size={size} />
      </div>
      {children}
    </div>
  );
};
