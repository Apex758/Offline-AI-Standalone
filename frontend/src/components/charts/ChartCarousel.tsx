import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import ResourceTrendChart from './ResourceTrendChart';
import ResourceDistributionChart from './ResourceDistributionChart';
import type { ResourceTrendData, DistributionData, Timeframe } from '../../types/analytics';

interface ChartCarouselProps {
  trendData: ResourceTrendData[];
  distributionData: DistributionData[];
  timeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
  forcePaused?: boolean;
  tabColors?: { [key: string]: string };
}

const ChartCarousel: React.FC<ChartCarouselProps> = ({
  trendData,
  distributionData,
  timeframe,
  onTimeframeChange,
  forcePaused = false,
  tabColors = {}
}) => {
  const views: Array<'trend' | 'distribution'> = ['trend', 'distribution'];
  const [currentView, setCurrentView] = useState<'trend' | 'distribution'>('trend');
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating || forcePaused) return;

    const interval = setInterval(() => {
      setCurrentView(prev => {
        const currentIndex = views.indexOf(prev);
        const nextIndex = (currentIndex + 1) % views.length;
        return views[nextIndex];
      });
    }, 10000); // Rotate every 10 seconds

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
    <div className="relative" data-tutorial="analytics-chart-carousel">
      {/* Chart Container */}
      <div className="relative overflow-hidden" data-tutorial="analytics-chart-display" style={{ height: '500px' }}>
        {/* Trend Chart View */}
        <div
          className={`transition-all duration-500 h-full ${
            currentView === 'trend'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-full absolute inset-0 pointer-events-none'
          }`}
        >
          <ResourceTrendChart
            data={trendData}
            timeframe={timeframe}
            onTimeframeChange={onTimeframeChange}
            tabColors={tabColors}
          />
        </div>

        {/* Distribution Chart View */}
        <div
          className={`transition-all duration-500 h-full ${
            currentView === 'distribution'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-full absolute inset-0 pointer-events-none'
          }`}
        >
          <ResourceDistributionChart data={distributionData} tabColors={tabColors} />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10" data-tutorial="analytics-chart-navigation">
        {/* View Indicator */}
        <div
          className="flex items-center gap-1 rounded-lg px-2 py-1"
          data-tutorial="analytics-chart-indicators"
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