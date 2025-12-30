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
  // Natural color palette
  const colorMap: { [key: string]: string } = {
    'Standard': '#1D362D',
    'Kindergarten': '#F2A631',
    'Multigrade': '#552A01',
    'Cross-Curricular': '#F8E59D'
  };

  const CustomTooltip = ({ active, payload }: any) => {
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
          <p className="font-semibold mb-1" style={{ color: '#020D03' }}>{payload[0].payload.type}</p>
          <p className="text-sm" style={{ color: '#552A01' }}>
            Count: <span className="font-semibold">{payload[0].value}</span>
          </p>
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
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-5 h-5" style={{ color: '#1D362D' }} />
        <h3 className="font-bold" style={{ color: '#020D03' }}>Lesson Plan Comparison</h3>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAE3" />
          <XAxis
            dataKey="type"
            tick={{ fontSize: 12, fill: '#552A01' }}
            stroke="#E8EAE3"
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#552A01' }}
            stroke="#E8EAE3"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorMap[entry.type] || '#552A01'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Summary */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid #E8EAE3' }}>
        <div className="grid grid-cols-2 gap-3">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: colorMap[entry.type] || '#552A01' }}
                />
                <span className="text-xs" style={{ color: '#552A01' }}>{entry.type}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: '#020D03' }}>{entry.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonPlanComparisonChart;