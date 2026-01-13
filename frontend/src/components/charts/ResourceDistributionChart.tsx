import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import type { DistributionData } from '../../types/analytics';

interface ResourceDistributionChartProps {
  data: DistributionData[];
  tabColors?: { [key: string]: string };
}

const ResourceDistributionChart: React.FC<ResourceDistributionChartProps> = ({ data, tabColors = {} }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Map resource types to tool types for color lookup
  const resourceToToolType: { [key: string]: string } = {
    lesson: 'lesson-planner',
    quiz: 'quiz-generator',
    rubric: 'rubric-generator',
    kindergarten: 'kindergarten-planner',
    multigrade: 'multigrade-planner',
    'cross-curricular': 'cross-curricular-planner',
    worksheet: 'worksheet-generator',
    image: 'image-studio'
  };

  // Get color for a resource type
  const getResourceColor = (resourceType: string): string => {
    const toolType = resourceToToolType[resourceType];
    return tabColors[toolType] || '#6b7280'; // fallback color
  };

  const dataWithColors = data.map((item) => ({
    ...item,
    color: getResourceColor(item.type)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div 
          className="rounded-lg p-3"
          style={{
            backgroundColor: 'white',
            border: '1px solid #E8EAE3',
            boxShadow: '0 4px 12px rgba(29, 54, 45, 0.15)'
          }}
        >
          <p className="font-semibold mb-1" style={{ color: '#020D03' }}>{data.label}</p>
          <p className="text-sm" style={{ color: '#552A01' }}>
            Count: <span className="font-semibold">{data.count}</span>
          </p>
          <p className="text-sm" style={{ color: '#552A01' }}>
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
    <div 
      className="rounded-2xl p-6"
      style={{
        backgroundColor: 'white',
        boxShadow: '0 4px 16px rgba(29, 54, 45, 0.08)'
      }}
    >
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <PieChartIcon className="w-5 h-5" style={{ color: '#1D362D' }} />
        <h3 className="font-bold" style={{ color: '#020D03' }}>Resource Type Distribution</h3>
      </div>

      {/* Chart and Legend */}
      <div className="flex gap-6">
        {/* Chart */}
        <div className="flex-1 relative">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={dataWithColors}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                innerRadius={80}
                fill="#8884d8"
                dataKey="count"
                paddingAngle={2}
              >
                {dataWithColors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#020D03' }}>{total}</div>
              <div className="text-xs font-medium" style={{ color: '#552A01' }}>Total</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-48 space-y-2">
          {dataWithColors.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs" style={{ color: '#552A01' }}>{entry.label}</span>
              <span className="text-xs font-semibold ml-auto" style={{ color: '#020D03' }}>{entry.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceDistributionChart;