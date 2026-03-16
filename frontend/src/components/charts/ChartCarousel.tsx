import React, { useState, useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import ArrowLeft01IconData from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';

const IconW: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const ChevronLeft: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ArrowLeft01IconData} {...p} />;
const ChevronRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ArrowRight01IconData} {...p} />;
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ArrowDown01IconData} {...p} />;
import ResourceTrendChart from './ResourceTrendChart';
import ResourceDistributionChart from './ResourceDistributionChart';
import type { ResourceTrendData, DistributionData, Timeframe } from '../../types/analytics';

const TIMEFRAME_OPTIONS: { value: Timeframe; label: string }[] = [
  { value: 'week',    label: '1 Week' },
  { value: '2weeks',  label: '2 Weeks' },
  { value: '4weeks',  label: '4 Weeks' },
  { value: 'month',   label: 'Month' },
  { value: '3months', label: '3 Months' },
  { value: '6months', label: '6 Months' },
  { value: 'all',     label: 'All Time' },
];

const TimeframeDropdown: React.FC<{
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
}> = ({ timeframe, onTimeframeChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = TIMEFRAME_OPTIONS.find(o => o.value === timeframe)?.label || 'Month';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="absolute top-4 right-4 z-10" data-tutorial="analytics-timeframe-selector" ref={ref}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
        style={{
          backgroundColor: 'var(--dash-timeframe-bg)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px var(--dash-card-shadow)',
          color: 'var(--dash-text-sub)',
        }}
      >
        <span style={{ color: 'var(--dash-primary)' }}>{selectedLabel}</span>
        <ChevronDown
          className="w-3.5 h-3.5 transition-transform"
          style={{
            color: 'var(--dash-text-sub)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-1 rounded-lg py-1 min-w-[130px] overflow-hidden"
          style={{
            backgroundColor: 'var(--dash-timeframe-bg)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 16px var(--dash-card-shadow)',
          }}
        >
          {TIMEFRAME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onTimeframeChange(opt.value);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                backgroundColor: timeframe === opt.value ? 'var(--dash-primary)' : 'transparent',
                color: timeframe === opt.value ? 'var(--dash-primary-fg)' : 'var(--dash-text-sub)',
              }}
              onMouseEnter={(e) => {
                if (timeframe !== opt.value) {
                  e.currentTarget.style.backgroundColor = 'var(--dash-primary)';
                  e.currentTarget.style.color = 'var(--dash-primary-fg)';
                  e.currentTarget.style.opacity = '0.7';
                }
              }}
              onMouseLeave={(e) => {
                if (timeframe !== opt.value) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--dash-text-sub)';
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
    backgroundColor: 'var(--dash-edge-btn)',
    backdropFilter: 'blur(10px)',
    boxShadow: `0 2px 10px var(--dash-primary-a25)`,
    transition: 'opacity 0.2s, transform 0.2s',
    opacity: hovered ? 1 : 0,
    pointerEvents: hovered ? 'auto' : 'none',
  };

  return (
    <div
      className="widget-glass relative rounded-2xl overflow-hidden"
      data-tutorial="analytics-chart-carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxShadow: hovered
          ? `0 16px 48px var(--dash-card-shadow)`
          : `0 8px 32px var(--dash-card-shadow)`,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {/* Chart Container */}
      <div
        className="relative overflow-hidden"
        data-tutorial="analytics-chart-display"
        style={{ height: '500px' }}
      >
        {/* Timeframe Selector — overlaid top-right */}
        <TimeframeDropdown
          timeframe={timeframe}
          onTimeframeChange={onTimeframeChange}
        />

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
        <ChevronLeft className="w-4 h-4" style={{ color: 'var(--dash-text-sub)' }} />
      </button>

      {/* Right edge button */}
      <button
        onClick={handleNext}
        aria-label="Next View"
        style={{ ...edgeBtn, right: 10 }}
      >
        <ChevronRight className="w-4 h-4" style={{ color: 'var(--dash-text-sub)' }} />
      </button>
    </div>
  );
};

export default ChartCarousel;
