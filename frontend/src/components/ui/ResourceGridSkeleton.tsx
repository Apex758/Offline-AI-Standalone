import React from 'react';
import { Skeleton } from './skeleton';
import { ShimmerBar } from './ShimmerBar';
import { SkeletonWrapper } from './SkeletonWrapper';

interface ResourceGridSkeletonProps {
  accentColor?: string;
  variant?: 'grid' | 'calendar' | 'roster';
}

export const ResourceGridSkeleton: React.FC<ResourceGridSkeletonProps> = ({
  accentColor = '#3b82f6',
  variant = 'grid',
}) => {
  if (variant === 'roster') {
    return (
      <SkeletonWrapper>
      <div className="h-full bg-theme-surface flex overflow-hidden">
        {/* Left sidebar */}
        <div className="w-[22%] min-w-[170px] max-w-[260px] border-r border-theme flex-shrink-0 flex flex-col">
          <div className="p-3">
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {Array(5).fill(0).map((_, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 px-2 py-2 rounded-lg">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-5 h-5 rounded" />
                  <ShimmerBar accentColor={accentColor} className="h-4 flex-1" />
                  <Skeleton className="w-5 h-5 rounded-full" />
                </div>
                {[1, 2].map(j => (
                  <div key={j} className="flex items-center gap-2 px-2 py-1.5 ml-6">
                    <Skeleton className="w-4 h-4 rounded" />
                    <ShimmerBar accentColor={accentColor} className="h-3.5 flex-1" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Hero banner */}
          <div className="px-8 py-8" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}>
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <div className="flex-1 space-y-2">
                <ShimmerBar variant="light" className="h-7 w-48" />
                <ShimmerBar variant="light" className="h-4 w-32" />
              </div>
              <Skeleton className="h-9 w-28 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
            </div>
          </div>

          {/* Stats row */}
          <div className="px-8 py-4 border-b border-theme">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="space-y-1">
                    <ShimmerBar accentColor={accentColor} className="h-3 w-16" />
                    <ShimmerBar accentColor={accentColor} className="h-5 w-10" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <ShimmerBar accentColor={accentColor} className="h-5 w-24 mb-4" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="rounded-xl border border-theme p-4 space-y-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <ShimmerBar accentColor={accentColor} className="h-4 w-3/4" />
                  <ShimmerBar accentColor={accentColor} className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </SkeletonWrapper>
    );
  }

  if (variant === 'calendar') {
    return (
      <SkeletonWrapper>
      <div className="h-full flex flex-col" style={{ background: 'var(--bg-primary, var(--tab-content-bg))' }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-theme">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="space-y-1">
              <ShimmerBar accentColor={accentColor} className="h-6 w-40" />
              <ShimmerBar accentColor={accentColor} className="h-3 w-56" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>

        {/* Stats strip */}
        <div className="px-6 py-3 border-b border-theme flex gap-3">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-full" />
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel */}
          <div className="w-72 flex-shrink-0 border-r border-theme p-4 space-y-4 overflow-y-auto">
            {[1, 2, 3].map(s => (
              <div key={s} className="space-y-2">
                <ShimmerBar accentColor={accentColor} className="h-4 w-20" />
                <div className="rounded-lg border border-theme p-3 space-y-2">
                  <ShimmerBar accentColor={accentColor} className="h-3 w-full" />
                  <ShimmerBar accentColor={accentColor} className="h-3 w-3/4" />
                </div>
              </div>
            ))}
            {/* Quick add form */}
            <div className="space-y-2 pt-2 border-t border-theme">
              <ShimmerBar accentColor={accentColor} className="h-4 w-16" />
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>

          {/* Calendar grid */}
          <div className="flex-1 p-4">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-8 w-8 rounded" />
              <ShimmerBar accentColor={accentColor} className="h-6 w-36" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {Array(7).fill(0).map((_, i) => (
                <ShimmerBar key={i} accentColor={accentColor} className="h-4 mx-auto w-8" />
              ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {Array(35).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
      </SkeletonWrapper>
    );
  }

  // Default: grid variant
  return (
    <SkeletonWrapper>
    <div className="h-full flex tab-content-bg">
      {/* Sidebar */}
      <div className="w-60 flex-shrink-0 bg-theme-surface border-r border-theme flex flex-col h-full">
        <div className="p-4 border-b border-theme">
          <ShimmerBar accentColor={accentColor} className="h-4 w-24" />
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {Array(9).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg">
              <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
              <ShimmerBar accentColor={accentColor} className="h-4 flex-1" />
              <Skeleton className="w-6 h-4 rounded-full flex-shrink-0" />
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-theme space-y-2">
          <div className="flex justify-between">
            <ShimmerBar accentColor={accentColor} className="h-3 w-10" />
            <ShimmerBar accentColor={accentColor} className="h-3 w-6" />
          </div>
          <div className="flex justify-between">
            <ShimmerBar accentColor={accentColor} className="h-3 w-14" />
            <ShimmerBar accentColor={accentColor} className="h-3 w-6" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-theme-surface border-b border-theme p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <ShimmerBar accentColor={accentColor} className="h-6 w-36" />
              <ShimmerBar accentColor={accentColor} className="h-3 w-20" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl border border-theme bg-theme-surface p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="w-6 h-6 rounded" />
                </div>
                <ShimmerBar accentColor={accentColor} className="h-4 w-4/5" />
                <div className="flex gap-2">
                  <ShimmerBar accentColor={accentColor} className="h-3 w-20" />
                  <ShimmerBar accentColor={accentColor} className="h-3 w-14" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </SkeletonWrapper>
  );
};

