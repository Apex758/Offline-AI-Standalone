import React from 'react';
import { Skeleton } from './skeleton';

interface TreeBrowserSkeletonProps {
  accentColor?: string;
  contentOnly?: boolean;
}

export const TreeBrowserSkeleton: React.FC<TreeBrowserSkeletonProps> = ({
  accentColor = '#22c55e',
  contentOnly = false,
}) => {
  if (contentOnly) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl widget-glass">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-theme-secondary">

      {/* Gradient header */}
      <div
        className="flex-shrink-0 px-6 py-4"
        style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-8 h-8 rounded bg-white/20" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48 bg-white/20" />
              <Skeleton className="h-4 w-64 bg-white/15" />
            </div>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 space-y-1">
            <Skeleton className="h-3 w-24 bg-white/15" />
            <Skeleton className="h-7 w-12 bg-white/15" />
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex-shrink-0 bg-theme-surface border-b border-theme px-6 py-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
          <div className="ml-auto flex space-x-2">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Main body: tree + detail panel */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left: tree panel */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto rounded-xl p-6 widget-glass space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i}>
                {/* Grade row */}
                <div
                  className="flex items-center space-x-3 p-3 rounded-lg"
                  style={{ backgroundColor: `${accentColor}08` }}
                >
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-6 h-6 rounded" />
                  <Skeleton className="h-4 flex-1 max-w-[200px]" />
                  <Skeleton className="h-3 w-12 rounded-full ml-auto" />
                </div>
                {/* Subject sub-rows */}
                {[1, 2].map(j => (
                  <div key={j} className="ml-8 flex items-center space-x-3 p-2.5">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-3.5 w-36" />
                    <Skeleton className="h-5 w-14 rounded-full ml-auto" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px flex-shrink-0" style={{ backgroundColor: `${accentColor}30` }} />

        {/* Right: detail panel */}
        <div className="w-80 flex-shrink-0 bg-theme-surface p-6 space-y-4">
          <Skeleton className="h-6 w-28 rounded" />
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

