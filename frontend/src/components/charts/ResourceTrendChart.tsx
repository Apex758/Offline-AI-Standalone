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
    // Defensive: handle both string and Date for d.date
    const entryDate = typeof d.date === 'string' ? new Date(d.date) : d.date;
    return entryDate >= minDate;
  });
  const timeframeButtons: { value: Timeframe; label: string }[] = [
    { value: 'week', label: '1 Week' },
    { value: '2weeks', label: '2 Weeks' },
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
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 mb-2">
            {format(parseISO(label), 'MMM d, yyyy')}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700">{entry.name}:</span>
              <span className="font-semibold text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Resource Creation Trends</h3>
        </div>

        {/* Timeframe Toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          {timeframeButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => onTimeframeChange(btn.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                timeframe === btn.value
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            stroke="#9ca3af"
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            stroke="#9ca3af"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Total"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="lessonPlans"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="Lesson Plans"
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="quizzes"
            stroke="#10b981"
            strokeWidth={2}
            name="Quizzes"
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="rubrics"
            stroke="#f59e0b"
            strokeWidth={2}
            name="Rubrics"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResourceTrendChart;