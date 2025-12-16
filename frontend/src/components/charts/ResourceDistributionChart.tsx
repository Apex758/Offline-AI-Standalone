import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import type { DistributionData } from '../../types/analytics';

interface ResourceDistributionChartProps {
  data: DistributionData[];
}

const ResourceDistributionChart: React.FC<ResourceDistributionChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 mb-1">{data.label}</p>
          <p className="text-sm text-gray-700">
            Count: <span className="font-semibold">{data.count}</span>
          </p>
          <p className="text-sm text-gray-700">
            Percentage: <span className="font-semibold">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (entry: any) => {
    return `${entry.percentage}%`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <PieChartIcon className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold text-gray-900">Resource Type Distribution</h3>
      </div>

      {/* Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={90}
              innerRadius={60}
              fill="#8884d8"
              dataKey="count"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-500 font-medium">Total</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-700 truncate">{entry.label}</span>
            <span className="text-xs font-semibold text-gray-900 ml-auto">{entry.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceDistributionChart;