import React from 'react';
import { RadialBarChart, RadialBar, Tooltip, Cell } from 'recharts';
import { useContainerSize } from '../../hooks/useContainerSize';

interface ChartEntry {
  type: string;
  label: string;
  count: number;
  color: string;
}

interface CategoryRadialChartProps {
  data: ChartEntry[];
  activeType: string;
  onTypeClick: (type: string) => void;
}

const CategoryRadialChart: React.FC<CategoryRadialChartProps> = ({ data, activeType, onTypeClick }) => {
  const { ref: chartContainerRef, width: chartWidth } = useContainerSize();

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const max = Math.max(...data.map(d => d.count), 1);

  const radialData = data
    .filter(d => d.count > 0)
    .map(d => ({
      name: d.label,
      type: d.type,
      value: Math.round((d.count / max) * 100),
      count: d.count,
      percentage: total > 0 ? Math.round((d.count / total) * 100) : 0,
      fill: d.color,
    }));

  const chartSize = Math.min(chartWidth || 180, 180);
  const outerRadius = Math.floor(chartSize / 2) - 8;
  const innerRadius = Math.max(outerRadius - (radialData.length * 9 + 4), 16);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div
        className="rounded-lg p-2 text-xs"
        style={{
          backgroundColor: 'var(--dash-card-bg, #fff)',
          border: '1px solid var(--dash-border, #e5e7eb)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <p className="font-semibold mb-0.5" style={{ color: d.fill }}>{d.name}</p>
        <p style={{ color: 'var(--dash-text-sub, #6b7280)' }}>
          {d.count} resource{d.count !== 1 ? 's' : ''} ({d.percentage}%)
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div ref={chartContainerRef} className="w-full flex justify-center" style={{ minHeight: chartSize }}>
        {chartWidth > 0 && (
          <div className="relative">
            <RadialBarChart
              width={chartSize}
              height={chartSize}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              barSize={7}
              startAngle={90}
              endAngle={-270}
              data={radialData}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={4}
                background={{ fill: 'var(--dash-radial-track, rgba(107,114,128,0.1))' }}
                isAnimationActive={true}
              >
                {radialData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    opacity={activeType === 'all' || activeType === entry.type ? 1 : 0.4}
                    cursor="pointer"
                    onClick={() => onTypeClick(activeType === entry.type ? 'all' : entry.type)}
                  />
                ))}
              </RadialBar>
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
            {/* Center label */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              style={{ width: chartSize, height: chartSize }}
            >
              <span className="text-lg font-bold" style={{ color: 'var(--dash-text, #111)' }}>{total}</span>
              <span className="text-[10px]" style={{ color: 'var(--dash-text-sub, #6b7280)' }}>total</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryRadialChart;
