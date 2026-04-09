import React from 'react';
import { ShimmerBar } from './ShimmerBar';

interface GeneratorSkeletonProps {
  accentColor?: string;
  type?: 'quiz' | 'rubric' | 'worksheet' | 'lesson' | 'plan';
}

export const GeneratorSkeleton: React.FC<GeneratorSkeletonProps> = ({
  accentColor = '#6366f1',
  type = 'lesson'
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header skeleton */}
      <div className="border-b border-theme p-4 flex items-center justify-between flex-shrink-0">
        <div className="space-y-2">
          <ShimmerBar accentColor={accentColor} className="h-6 w-56" />
          <ShimmerBar accentColor={accentColor} className="h-4 w-36" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 overflow-y-auto bg-theme-surface p-6">
        {/* Banner skeleton */}
        <div className="mb-8">
          <div
            className="rounded-2xl p-8 space-y-4"
            style={{ background: `linear-gradient(to bottom right, ${accentColor}15, ${accentColor}08)`, border: `1px solid ${accentColor}20` }}
          >
            <ShimmerBar accentColor={accentColor} className="h-5 w-24 rounded-full" />
            <ShimmerBar accentColor={accentColor} className="h-8 w-72" />
            <div className="flex gap-4">
              <ShimmerBar accentColor={accentColor} className="h-4 w-20" />
              <ShimmerBar accentColor={accentColor} className="h-4 w-24" />
              <ShimmerBar accentColor={accentColor} className="h-4 w-28" />
            </div>
          </div>
        </div>

        {/* Content blocks skeleton */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="rounded-xl p-6 widget-glass space-y-4">
            <ShimmerBar accentColor={accentColor} className="h-5 w-40" />
            <div className="space-y-2">
              <ShimmerBar accentColor={accentColor} className="h-4 w-full" />
              <ShimmerBar accentColor={accentColor} className="h-4 w-11/12" />
              <ShimmerBar accentColor={accentColor} className="h-4 w-3/4" />
            </div>
          </div>

          {/* Section 2 */}
          <div className="rounded-xl p-6 widget-glass space-y-4">
            <ShimmerBar accentColor={accentColor} className="h-5 w-48" />
            <div className="space-y-3">
              {type === 'quiz' ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2 pb-3 border-b border-theme last:border-0">
                      <ShimmerBar accentColor={accentColor} className="h-4 w-5/6" />
                      <div className="ml-4 space-y-1.5">
                        <ShimmerBar accentColor={accentColor} className="h-3.5 w-2/3" />
                        <ShimmerBar accentColor={accentColor} className="h-3.5 w-1/2" />
                        <ShimmerBar accentColor={accentColor} className="h-3.5 w-3/5" />
                        <ShimmerBar accentColor={accentColor} className="h-3.5 w-1/2" />
                      </div>
                    </div>
                  ))}
                </>
              ) : type === 'rubric' ? (
                <>
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <ShimmerBar key={i} accentColor={accentColor} className="h-8 rounded" />
                    ))}
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((j) => (
                        <ShimmerBar key={j} accentColor={accentColor} className="h-16 rounded" />
                      ))}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <ShimmerBar accentColor={accentColor} className="h-4 w-full" />
                  <ShimmerBar accentColor={accentColor} className="h-4 w-5/6" />
                  <ShimmerBar accentColor={accentColor} className="h-4 w-full" />
                  <ShimmerBar accentColor={accentColor} className="h-4 w-2/3" />
                </>
              )}
            </div>
          </div>

          {/* Section 3 */}
          <div className="rounded-xl p-6 widget-glass space-y-4">
            <ShimmerBar accentColor={accentColor} className="h-5 w-36" />
            <div className="space-y-2">
              <ShimmerBar accentColor={accentColor} className="h-4 w-full" />
              <ShimmerBar accentColor={accentColor} className="h-4 w-4/5" />
              <ShimmerBar accentColor={accentColor} className="h-4 w-11/12" />
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="mt-8 rounded-xl p-6 border" style={{
          background: `linear-gradient(to right, ${accentColor}0d, ${accentColor}1a)`,
          borderColor: `${accentColor}33`
        }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium" style={{ color: `${accentColor}dd` }}>
                {type === 'quiz' ? 'Creating your quiz' :
                 type === 'rubric' ? 'Creating your rubric' :
                 type === 'worksheet' ? 'Generating worksheet' :
                 'Creating your plan'}
              </div>
              <div className="text-sm mt-1" style={{ color: `${accentColor}99` }}>
                Content will stream in momentarily...
              </div>
            </div>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: `${accentColor}66` }}></div>
              <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: `${accentColor}99`, animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: `${accentColor}cc`, animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
