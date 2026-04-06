import React from 'react';
import { Skeleton } from './skeleton';
import { ShimmerBar } from './ShimmerBar';

interface SettingsPanelSkeletonProps {
  sectionCount?: number;
  accentColor?: string;
}

export const SettingsPanelSkeleton: React.FC<SettingsPanelSkeletonProps> = ({ sectionCount = 8, accentColor = '#6b7280' }) => {
  return (
    <div className="h-full tab-content-bg flex">

      {/* Left sidebar */}
      <div className="w-1/4 flex-shrink-0 border-r border-theme-strong/30 bg-theme-surface/50 flex flex-col">
        {/* Logo/title area */}
        <div className="px-7 pt-7 pb-4 space-y-2">
          <Skeleton className="w-6 h-6 rounded" />
          <ShimmerBar accentColor={accentColor} className="h-6 w-28" />
          <ShimmerBar accentColor={accentColor} className="h-3 w-20" />
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-5 py-3 space-y-1.5">
          {Array(sectionCount).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
              <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                <ShimmerBar accentColor={accentColor} className="h-4 w-24" />
                <ShimmerBar accentColor={accentColor} className="h-3 w-16" />
              </div>
              <Skeleton className="w-3 h-3 rounded flex-shrink-0" />
            </div>
          ))}
        </nav>
      </div>

      {/* Right content panel */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-3xl p-6 pb-20 space-y-8">
          {/* Section title */}
          <div className="space-y-2">
            <ShimmerBar accentColor={accentColor} className="h-7 w-40" />
            <ShimmerBar accentColor={accentColor} className="h-4 w-56" />
          </div>

          {/* Form card 1 */}
          <div className="rounded-xl p-6 widget-glass space-y-5">
            <ShimmerBar accentColor={accentColor} className="h-5 w-32" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <ShimmerBar accentColor={accentColor} className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Form card 2 */}
          <div className="rounded-xl p-6 widget-glass space-y-5">
            <ShimmerBar accentColor={accentColor} className="h-5 w-36" />
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <ShimmerBar accentColor={accentColor} className="h-4 w-28" />
                    <ShimmerBar accentColor={accentColor} className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-theme" />

          {/* Form card 3 */}
          <div className="rounded-xl p-6 widget-glass space-y-5">
            <ShimmerBar accentColor={accentColor} className="h-5 w-28" />
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="space-y-2">
                  <ShimmerBar accentColor={accentColor} className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

