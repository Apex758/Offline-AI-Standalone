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
  const [currentView, setCurrentView] = useState<'trend' | 'distribution'>('trend');
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setCurrentView(prev => (prev === 'trend' ? 'distribution' : 'trend'));
    }, 5000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handlePrevious = () => {
    setCurrentView('trend');
    setIsAutoRotating(false);
  };

  const handleNext = () => {
    setCurrentView('distribution');
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResourceDistributionChart data={distributionData} />
            
            {lessonPlanComparison.length > 0 && (
              <LessonPlanComparisonChart data={lessonPlanComparison} />
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        {/* View Indicator */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
          <button
            onClick={() => setCurrentView('trend')}
            className={`w-2 h-2 rounded-full transition-all ${
              currentView === 'trend' ? 'bg-blue-600 w-6' : 'bg-gray-300'
            }`}
            aria-label="View Trend Chart"
          />
          <button
            onClick={() => setCurrentView('distribution')}
            className={`w-2 h-2 rounded-full transition-all ${
              currentView === 'distribution' ? 'bg-blue-600 w-6' : 'bg-gray-300'
            }`}
            aria-label="View Distribution Charts"
          />
        </div>

        {/* Auto-rotate Toggle */}
        <button
          onClick={toggleAutoRotate}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
          title={isAutoRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
        >
          {isAutoRotating ? (
            <Pause className="w-4 h-4 text-gray-700" />
          ) : (
            <Play className="w-4 h-4 text-gray-700" />
          )}
        </button>

        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors disabled:opacity-50"
          disabled={currentView === 'trend'}
          aria-label="Previous View"
        >
          <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors disabled:opacity-50"
          disabled={currentView === 'distribution'}
          aria-label="Next View"
        >
          <ChevronRight className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* View Label */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
        <span className="text-xs font-semibold text-gray-700">
          {currentView === 'trend' ? 'Resource Creation Trend' : 'Resource Breakdown'}
        </span>
      </div>
    </div>
  );
};

export default ChartCarousel;