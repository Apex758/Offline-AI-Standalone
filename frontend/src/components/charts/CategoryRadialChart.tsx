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

  const chartSize = Math.min(chartWidth || 220, 220);
  const outerRadius = Math.floor(chartSize / 2) - 8;
  const innerRadius = Math.max(outerRadius - (radialData.length * 8 + 6), 28);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div
        className="rounded-xl p-3"
        style={{
          backgroundColor: 'var(--dash-card-bg)',
          border: '1px solid var(--dash-border)',
          boxShadow: '0 8px 24px var(--dash-card-shadow)',
          minWidth: 140,
        }}
      >
        <p className="font-semibold mb-1 text-xs" style={{ color: d.fill }}>{d.name}</p>
        <p className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>
          Count: <span className="font-semibold" style={{ color: 'var(--dash-text)' }}>{d.count}</span>
        </p>
        <p className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>
          Share: <span className="font-semibold" style={{ color: 'var(--dash-text)' }}>{d.percentage}%</span>
        </p>
      </div>
    );
  };

  return (
    <div
      className="rounded-2xl p-4 flex flex-col items-center"
      style={{
        backgroundColor: 'var(--dash-card-bg)',
        boxShadow: '0 4px 16px var(--dash-card-shadow)',
      }}
    >
      <div
        ref={chartContainerRef}
        className="w-full flex justify-center"
        style={{ minHeight: chartSize, outline: 'none' }}
        tabIndex={-1}
      >
        {chartWidth > 0 && (
          <div className="relative" style={{ outline: 'none' }}>
            <RadialBarChart
              width={chartSize}
              height={chartSize}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              barSize={8}
              startAngle={90}
              endAngle={-270}
              data={radialData}
              style={{ outline: 'none' }}
            >
              <defs>
                {radialData.map((entry, index) => (
                  <linearGradient key={`grad-${index}`} id={`radial-grad-${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={entry.fill} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={entry.fill} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <RadialBar
                dataKey="value"
                cornerRadius={5}
                background={{ fill: 'var(--dash-radial-track, rgba(107,114,128,0.08))' }}
                isAnimationActive={true}
              >
                {radialData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#radial-grad-${index})`}
                    opacity={activeType === 'all' || activeType === entry.type ? 1 : 0.35}
                    cursor="pointer"
                    stroke="none"
                    style={{ outline: 'none' }}
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
              <span className="text-2xl font-bold" style={{ color: 'var(--dash-text)' }}>{total}</span>
              <span className="text-[10px] font-medium" style={{ color: 'var(--dash-text-sub)' }}>total</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryRadialChart;
