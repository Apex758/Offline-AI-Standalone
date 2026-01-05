import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { ResourceTrendData, Timeframe } from '../../types/analytics';

interface ResourceTrendChartProps {
  data: ResourceTrendData[];
  timeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
}

const ResourceTrendChart: React.FC<ResourceTrendChartProps> = ({
  data,
  timeframe,
  onTimeframeChange
}) => {
  // Filter data to only include entries from June 2025 onward
  const minDate = new Date('2025-06-01');
  const filteredData = data.filter(d => {
    const entryDate = typeof d.date === 'string' ? new Date(d.date) : d.date;
    return entryDate >= minDate;
  });

  const timeframeButtons: { value: Timeframe; label: string }[] = [
    { value: 'week', label: '1 Week' },
    { value: '2weeks', label: '2 Weeks' },
    { value: '4weeks', label: '4 Weeks' },
    { value: 'month', label: 'Month' },
    { value: 'all', label: 'All Time' }
  ];

  const formatXAxis = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (timeframe === 'week' || timeframe === '2weeks') {
        return format(date, 'MMM d');
      } else {
        return format(date, 'MMM d');
      }
    } catch {
      return dateString;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="rounded-lg p-3"
          style={{
            backgroundColor: 'white',
            border: '1px solid #E8EAE3',
            boxShadow: '0 4px 12px rgba(29, 54, 45, 0.15)'
          }}
        >
          <p className="font-semibold mb-2" style={{ color: '#020D03' }}>
            {format(parseISO(label), 'MMM d, yyyy')}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span style={{ color: '#552A01' }}>{entry.name}:</span>
              <span className="font-semibold" style={{ color: '#020D03' }}>{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="rounded-2xl p-6"
      style={{
        backgroundColor: 'white',
        boxShadow: '0 4px 16px rgba(29, 54, 45, 0.08)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" style={{ color: '#1D362D' }} />
          <h3 className="font-bold" style={{ color: '#020D03' }}>Resource Creation Trends</h3>
        </div>

        {/* Timeframe Toggle */}
        <div
          className="flex items-center space-x-1 rounded-lg p-1"
          data-tutorial="analytics-timeframe-selector"
          style={{ backgroundColor: '#F8E59D40' }}
        >
          {timeframeButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => onTimeframeChange(btn.value)}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
              style={{
                backgroundColor: timeframe === btn.value ? '#1D362D' : 'transparent',
                color: timeframe === btn.value ? '#F8E59D' : '#552A01',
                boxShadow: timeframe === btn.value ? '0 2px 4px rgba(29, 54, 45, 0.2)' : 'none'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAE3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12, fill: '#552A01' }}
            stroke="#E8EAE3"
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#552A01' }}
            stroke="#E8EAE3"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#F2A631"
            strokeWidth={3}
            name="Total"
            dot={{ r: 4, fill: '#F2A631' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="lessonPlans"
            stroke="#1D362D"
            strokeWidth={2}
            name="Lesson Plans"
            dot={{ r: 3, fill: '#1D362D' }}
          />
          <Line
            type="monotone"
            dataKey="quizzes"
            stroke="#552A01"
            strokeWidth={2}
            name="Quizzes"
            dot={{ r: 3, fill: '#552A01' }}
          />
          <Line
            type="monotone"
            dataKey="rubrics"
            stroke="#F8E59D"
            strokeWidth={2}
            name="Rubrics"
            dot={{ r: 3, fill: '#F8E59D' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResourceTrendChart;