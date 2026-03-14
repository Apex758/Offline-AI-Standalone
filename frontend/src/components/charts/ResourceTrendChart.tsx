import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import type { ResourceTrendData, Timeframe } from '../../types/analytics';

interface ResourceTrendChartProps {
  data: ResourceTrendData[];
  timeframe: Timeframe;
  tabColors?: { [key: string]: string };
}

const SERIES = [
  { key: 'lessonPlans',  name: 'Standard Lessons',    toolType: 'lesson-planner' },
  { key: 'quizzes',      name: 'Quizzes',              toolType: 'quiz-generator' },
  { key: 'rubrics',      name: 'Rubrics',              toolType: 'rubric-generator' },
  { key: 'kindergarten', name: 'Kindergarten Plans',   toolType: 'kindergarten-planner' },
  { key: 'multigrade',   name: 'Multigrade Plans',     toolType: 'multigrade-planner' },
  { key: 'worksheets',   name: 'Worksheets',           toolType: 'worksheet-generator' },
  { key: 'images',       name: 'Images',               toolType: 'image-studio' },
];

const ResourceTrendChart: React.FC<ResourceTrendChartProps> = ({
  data,
  timeframe,
  tabColors = {}
}) => {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const toggleSeries = (key: string) =>
    setHiddenSeries(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const minDate = new Date('2025-06-01');
  const filteredData = data.filter(d => {
    const entryDate = typeof d.date === 'string' ? new Date(d.date) : d.date;
    return entryDate >= minDate;
  });

  const getColor = (toolType: string): string => tabColors[toolType] || '#6b7280';

  const formatXAxis = (dateString: string) => {
    try { return format(parseISO(dateString), 'MMM d'); } catch { return dateString; }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className="rounded-xl p-3"
        style={{
          backgroundColor: 'white',
          border: '1px solid #E8EAE3',
          boxShadow: '0 8px 24px rgba(29, 54, 45, 0.15)',
          minWidth: 160,
        }}
      >
        <p className="font-semibold mb-2 text-xs" style={{ color: '#020D03' }}>
          {format(parseISO(label), 'MMM d, yyyy')}
        </p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs mb-1">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, flexShrink: 0, display: 'inline-block' }} />
            <span style={{ color: '#552A01' }}>{entry.name}</span>
            <span className="font-semibold ml-auto" style={{ color: '#020D03' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="rounded-2xl p-6 h-full flex flex-col"
      style={{ backgroundColor: 'white', boxShadow: '0 4px 16px rgba(29, 54, 45, 0.08)' }}
    >
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5" style={{ color: '#1D362D' }} />
        <h3 className="font-bold" style={{ color: '#020D03' }}>Resource Creation Trends</h3>
      </div>

      {/* Stacked Area Chart */}
      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={filteredData} margin={{ top: 8, right: 8, left: 0, bottom: 5 }}>
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
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAE3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 11, fill: '#7a8c7e' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#7a8c7e' }}
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
      </ResponsiveContainer>

      {/* Toggleable Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 px-1">
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
                width: 8, height: 8, borderRadius: '50%',
                background: hidden ? '#d1d5db' : color,
                flexShrink: 0, display: 'inline-block',
                transition: 'background 0.2s',
              }} />
              <span style={{
                fontSize: 11,
                color: hidden ? '#9ca3af' : '#552A01',
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