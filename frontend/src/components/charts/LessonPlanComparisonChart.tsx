import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useContainerSize } from '../../hooks/useContainerSize';
import { HugeiconsIcon } from '@hugeicons/react';
import BarChartIconData from '@hugeicons/core-free-icons/BarChartIcon';

const IconW: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const BarChart3: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={BarChartIconData} {...p} />;

interface LessonPlanComparisonChartProps {
  data: {
    type: string;
    count: number;
  }[];
}

const LessonPlanComparisonChart: React.FC<LessonPlanComparisonChartProps> = ({ data }) => {
  const { ref: chartContainerRef, width: chartWidth } = useContainerSize();
  // Natural color palette
  const colorMap: { [key: string]: string } = {
    'Standard': '#1D362D',
    'Early Childhood': '#F2A631',
    'Multi-Level': '#552A01',
    'Integrated Lesson': '#F8E59D'
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
      <div ref={chartContainerRef} style={{ width: '100%', height: 250 }}>
        {chartWidth > 0 && (
        <BarChart width={chartWidth} height={250} data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
        )}
      </div>

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