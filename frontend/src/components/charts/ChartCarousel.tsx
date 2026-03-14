import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ResourceTrendChart from './ResourceTrendChart';
import ResourceDistributionChart from './ResourceDistributionChart';
import type { ResourceTrendData, DistributionData, Timeframe } from '../../types/analytics';

const TIMEFRAME_BUTTONS: { value: Timeframe; label: string }[] = [
  { value: 'week',   label: '1 Week' },
  { value: '2weeks', label: '2 Weeks' },
  { value: '4weeks', label: '4 Weeks' },
  { value: 'month',  label: 'Month' },
  { value: 'all',    label: 'All Time' },
];

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
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (forcePaused || hovered) return;
    const interval = setInterval(() => {
      setCurrentView(prev => {
        const nextIndex = (views.indexOf(prev) + 1) % views.length;
        return views[nextIndex];
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [hovered, forcePaused]);

  const handlePrevious = () => {
    setCurrentView(prev => {
      const prevIndex = (views.indexOf(prev) - 1 + views.length) % views.length;
      return views[prevIndex];
    });
  };

  const handleNext = () => {
    setCurrentView(prev => {
      const nextIndex = (views.indexOf(prev) + 1) % views.length;
      return views[nextIndex];
    });
  };

  const edgeBtn: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 10px rgba(29,54,45,0.15)',
    transition: 'opacity 0.2s, transform 0.2s',
    opacity: hovered ? 1 : 0,
    pointerEvents: hovered ? 'auto' : 'none',
  };

  return (
    <div
      className="relative"
      data-tutorial="analytics-chart-carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Chart Container */}
      <div
        className="relative overflow-hidden"
        data-tutorial="analytics-chart-display"
        style={{ height: '500px' }}
      >
        {/* Timeframe Selector — overlaid top-right */}
        <div className="absolute top-4 right-4 z-10" data-tutorial="analytics-timeframe-selector">
          <div
            className="flex items-center space-x-1 rounded-lg p-1"
            style={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(29, 54, 45, 0.1)',
            }}
          >
            {TIMEFRAME_BUTTONS.map((btn) => (
              <button
                key={btn.value}
                onClick={() => onTimeframeChange(btn.value)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={{
                  backgroundColor: timeframe === btn.value ? '#1D362D' : 'transparent',
                  color: timeframe === btn.value ? '#F8E59D' : '#552A01',
                  boxShadow: timeframe === btn.value ? '0 2px 4px rgba(29, 54, 45, 0.2)' : 'none',
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trend Chart View */}
        <div
          className={`transition-all duration-500 h-full ${
            currentView === 'trend'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-full absolute inset-0 pointer-events-none'
          }`}
        >
          <ResourceTrendChart data={trendData} timeframe={timeframe} tabColors={tabColors} />
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

      {/* Left edge button */}
      <button
        onClick={handlePrevious}
        aria-label="Previous View"
        style={{ ...edgeBtn, left: 10 }}
      >
        <ChevronLeft className="w-4 h-4" style={{ color: '#552A01' }} />
      </button>

      {/* Right edge button */}
      <button
        onClick={handleNext}
        aria-label="Next View"
        style={{ ...edgeBtn, right: 10 }}
      >
        <ChevronRight className="w-4 h-4" style={{ color: '#552A01' }} />
      </button>
    </div>
  );
};

export default ChartCarousel;
