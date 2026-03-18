import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import ChartIncreaseIconData from '@hugeicons/core-free-icons/ChartIncreaseIcon';

const IconW: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const TrendingUp: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ChartIncreaseIconData} {...p} />;
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useContainerSize } from '../../hooks/useContainerSize';
import { format, parseISO } from 'date-fns';
import type { ResourceTrendData, Timeframe } from '../../types/analytics';

interface ResourceTrendChartProps {
  data: ResourceTrendData[];
  timeframe: Timeframe;
  tabColors?: { [key: string]: string };
}

const SERIES = [
  { key: 'lessonPlans',  name: 'Lesson Plans',           toolType: 'lesson-planner' },
  { key: 'quizzes',      name: 'Quizzes',              toolType: 'quiz-generator' },
  { key: 'rubrics',      name: 'Rubrics',              toolType: 'rubric-generator' },
  { key: 'kindergarten', name: 'Early Childhood Plans', toolType: 'kindergarten-planner' },
  { key: 'multigrade',   name: 'Multi-Level Plans',    toolType: 'multigrade-planner' },
  { key: 'worksheets',   name: 'Worksheets',           toolType: 'worksheet-generator' },
  { key: 'images',       name: 'Images',               toolType: 'image-studio' },
];

const ResourceTrendChart: React.FC<ResourceTrendChartProps> = ({
  data,
  timeframe,
  tabColors = {}
}) => {
  const { ref: chartContainerRef, width: chartWidth } = useContainerSize();
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const toggleSeries = (key: string) =>
    setHiddenSeries(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const isWeekly = timeframe === '3months' || timeframe === '6months' || timeframe === 'all';

  const getColor = (toolType: string): string => tabColors[toolType] || '#6b7280';

  const formatXAxis = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d');
    } catch { return dateString; }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className="rounded-xl p-3"
        style={{
          backgroundColor: 'var(--dash-card-bg)',
          border: `1px solid var(--dash-border)`,
          boxShadow: `0 8px 24px var(--dash-card-shadow)`,
          minWidth: 160,
        }}
      >
        <p className="font-semibold mb-2 text-xs" style={{ color: 'var(--dash-text)' }}>
          {isWeekly ? `Week of ${format(parseISO(label), 'MMM d, yyyy')}` : format(parseISO(label), 'MMM d, yyyy')}
        </p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs mb-1">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, flexShrink: 0, display: 'inline-block' }} />
            <span style={{ color: 'var(--dash-text-sub)' }}>{entry.name}</span>
            <span className="font-semibold ml-auto" style={{ color: 'var(--dash-text)' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="rounded-2xl p-6 h-full flex flex-col"
      style={{ backgroundColor: 'var(--dash-card-bg)', boxShadow: `0 4px 16px var(--dash-card-shadow)` }}
    >
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5" style={{ color: 'var(--dash-primary)' }} />
        <h3 className="font-bold" style={{ color: 'var(--dash-text)' }}>Resource Creation Trends</h3>
      </div>

      {/* Stacked Area Chart */}
      <div ref={chartContainerRef} style={{ width: '100%', height: 340 }}>
        {chartWidth > 0 && (
        <AreaChart width={chartWidth} height={340} data={data} margin={{ top: 8, right: 8, left: 0, bottom: 5 }}>
          <defs>
            {SERIES.map((s) => {
              const color = getColor(s.toolType);
              return (
                <linearGradient key={s.key} id={`rtg-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.45} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.04} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-border)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 11, fill: 'var(--dash-axis-tick)' }}
            axisLine={false}
            tickLine={false}
            interval={
              timeframe === '6months' ? 3
              : timeframe === 'all' ? 3
              : timeframe === '3months' ? 1
              : timeframe === '4weeks' ? 3
              : timeframe === '2weeks' ? 1
              : 0
            }
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--dash-axis-tick)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {SERIES.map((s) => {
            const color = getColor(s.toolType);
            return (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stackId="1"
                stroke={color}
                strokeWidth={1.5}
                fill={`url(#rtg-${s.key})`}
                dot={false}
                activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
                connectNulls
                hide={hiddenSeries.has(s.key)}
              />
            );
          })}
        </AreaChart>
        )}
      </div>

      {/* Toggleable Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 px-1">
        {SERIES.map((s) => {
          const color = getColor(s.toolType);
          const hidden = hiddenSeries.has(s.key);
          return (
            <button
              key={s.key}
              onClick={() => toggleSeries(s.key)}
              className="flex items-center gap-1.5 transition-opacity"
              style={{ opacity: hidden ? 0.35 : 1, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
            >
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: hidden ? 'var(--dash-hidden-dot)' : color,
                flexShrink: 0, display: 'inline-block',
                transition: 'background 0.2s',
              }} />
              <span style={{
                fontSize: 13,
                color: hidden ? 'var(--dash-hidden-text)' : 'var(--dash-text-sub)',
                textDecoration: hidden ? 'line-through' : 'none',
                transition: 'color 0.2s',
              }}>
                {s.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceTrendChart;
