import React from 'react';
import { Skeleton } from './skeleton';
import { ShimmerBar } from './ShimmerBar';

interface DashboardSkeletonProps {
  accentColor?: string;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  accentColor = '#6366f1',
}) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[90rem] mx-auto px-4 py-6 space-y-6">

        {/* Gradient header banner */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <div
            className="relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}
          >
            <div className="px-8 py-8">
              <div className="flex items-center gap-6">
                <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.20)' }} />
                <div className="flex-1 space-y-3">
                  <ShimmerBar variant="light" className="h-7 w-48" />
                  <ShimmerBar variant="light" className="h-4 w-32" />
                  <div className="flex gap-8 mt-3">
                    {[1, 2, 3].map((i) => (
                      <ShimmerBar key={i} variant="light" className="h-5 w-20" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row - 3 cards */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl p-5 widget-glass">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <ShimmerBar accentColor={accentColor} className="h-4 w-24" />
                  <ShimmerBar accentColor={accentColor} className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart card */}
        <div className="rounded-xl p-6 widget-glass space-y-4">
          <div className="flex items-center justify-between">
            <ShimmerBar accentColor={accentColor} className="h-5 w-40" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>

        {/* Two-column content */}
        <div className="flex gap-5">

          {/* Left column - 65% */}
          <div style={{ flex: '0 0 65%' }} className="space-y-4">

            {/* Timeline card */}
            <div className="rounded-xl p-6 widget-glass space-y-4">
              <ShimmerBar accentColor={accentColor} className="h-5 w-32" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <ShimmerBar accentColor={accentColor} className="h-4 w-3/4" />
                    <ShimmerBar accentColor={accentColor} className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>

            {/* Progress card */}
            <div className="rounded-xl p-6 widget-glass space-y-4">
              <ShimmerBar accentColor={accentColor} className="h-5 w-36" />
              <Skeleton className="h-3 w-full rounded-full" />
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            </div>

          </div>

          {/* Right column - 35% */}
          <div style={{ flex: '0 0 35%' }} className="space-y-4">

            {/* Small cards */}
            <div className="rounded-xl p-5 widget-glass space-y-3">
              <ShimmerBar accentColor={accentColor} className="h-5 w-28" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <ShimmerBar accentColor={accentColor} className="h-4 w-2/3" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
