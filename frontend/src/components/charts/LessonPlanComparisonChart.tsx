import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface LessonPlanComparisonChartProps {
  data: {
    type: string;
    count: number;
  }[];
}

const LessonPlanComparisonChart: React.FC<LessonPlanComparisonChartProps> = ({ data }) => {
  const colorMap: { [key: string]: string } = {
    'Standard': '#8b5cf6',
    'Kindergarten': '#ec4899',
    'Multigrade': '#6366f1',
    'Cross-Curricular': '#14b8a6'
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 mb-1">{payload[0].payload.type}</p>
          <p className="text-sm text-gray-700">
            Count: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-gray-900">Lesson Plan Comparison</h3>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="type"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            stroke="#9ca3af"
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            stroke="#9ca3af"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorMap[entry.type] || '#6b7280'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: colorMap[entry.type] || '#6b7280' }}
                />
                <span className="text-xs text-gray-700">{entry.type}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{entry.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonPlanComparisonChart;