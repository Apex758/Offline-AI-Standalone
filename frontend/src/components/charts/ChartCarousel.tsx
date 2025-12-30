import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import ResourceTrendChart from './ResourceTrendChart';
import ResourceDistributionChart from './ResourceDistributionChart';
import LessonPlanComparisonChart from './LessonPlanComparisonChart';
import type { ResourceTrendData, DistributionData, Timeframe } from '../../types/analytics';

interface ChartCarouselProps {
  trendData: ResourceTrendData[];
  distributionData: DistributionData[];
  lessonPlanComparison: { type: string; count: number }[];
  timeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
}

const ChartCarousel: React.FC<ChartCarouselProps> = ({
  trendData,
  distributionData,
  lessonPlanComparison,
  timeframe,
  onTimeframeChange
}) => {
  const views: Array<'trend' | 'distribution'> = ['trend', 'distribution'];
  const [currentView, setCurrentView] = useState<'trend' | 'distribution'>('trend');
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setCurrentView(prev => {
        const currentIndex = views.indexOf(prev);
        const nextIndex = (currentIndex + 1) % views.length;
        return views[nextIndex];
      });
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handlePrevious = () => {
    setCurrentView(prev => {
      const currentIndex = views.indexOf(prev);
      const prevIndex = (currentIndex - 1 + views.length) % views.length;
      return views[prevIndex];
    });
    setIsAutoRotating(false);
  };

  const handleNext = () => {
    setCurrentView(prev => {
      const currentIndex = views.indexOf(prev);
      const nextIndex = (currentIndex + 1) % views.length;
      return views[nextIndex];
    });
    setIsAutoRotating(false);
  };

  const toggleAutoRotate = () => {
    setIsAutoRotating(prev => !prev);
  };

  return (
    <div className="relative">
      {/* Chart Container */}
      <div className="relative overflow-hidden">
        {/* Trend Chart View */}
        <div
          className={`transition-all duration-500 ${
            currentView === 'trend'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-full absolute inset-0 pointer-events-none'
          }`}
        >
          <ResourceTrendChart
            data={trendData}
            timeframe={timeframe}
            onTimeframeChange={onTimeframeChange}
          />
        </div>

        {/* Distribution & Comparison Charts View */}
        <div
          className={`transition-all duration-500 ${
            currentView === 'distribution'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-full absolute inset-0 pointer-events-none'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResourceDistributionChart data={distributionData} />
            
            {lessonPlanComparison.length > 0 && (
              <LessonPlanComparisonChart data={lessonPlanComparison} />
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
        {/* View Indicator */}
        <div 
          className="flex items-center gap-1 rounded-lg px-2 py-1"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 8px rgba(29, 54, 45, 0.1)'
          }}
        >
          <button
            onClick={() => setCurrentView('trend')}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: currentView === 'trend' ? '#1D362D' : '#E8EAE3',
              width: currentView === 'trend' ? '1.5rem' : '0.5rem'
            }}
            aria-label="View Trend Chart"
          />
          <button
            onClick={() => setCurrentView('distribution')}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: currentView === 'distribution' ? '#1D362D' : '#E8EAE3',
              width: currentView === 'distribution' ? '1.5rem' : '0.5rem'
            }}
            aria-label="View Distribution Charts"
          />
        </div>

        {/* Auto-rotate Toggle */}
        <button
          onClick={toggleAutoRotate}
          className="p-2 rounded-lg transition-colors"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 8px rgba(29, 54, 45, 0.1)'
          }}
          title={isAutoRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
        >
          {isAutoRotating ? (
            <Pause className="w-4 h-4" style={{ color: '#552A01' }} />
          ) : (
            <Play className="w-4 h-4" style={{ color: '#552A01' }} />
          )}
        </button>

        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="p-2 rounded-lg transition-colors"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 8px rgba(29, 54, 45, 0.1)'
          }}
          aria-label="Previous View"
        >
          <ChevronLeft className="w-4 h-4" style={{ color: '#552A01' }} />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="p-2 rounded-lg transition-colors"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 8px rgba(29, 54, 45, 0.1)'
          }}
          aria-label="Next View"
        >
          <ChevronRight className="w-4 h-4" style={{ color: '#552A01' }} />
        </button>
      </div>

      {/* View Label */}
      <div 
        className="absolute bottom-4 left-4 rounded-lg px-3 py-1.5"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(29, 54, 45, 0.1)'
        }}
      >
        <span className="text-xs font-semibold" style={{ color: '#552A01' }}>
          {currentView === 'trend' ? 'Resource Creation Trend' : 'Resource Breakdown'}
        </span>
      </div>
    </div>
  );
};

export default ChartCarousel;