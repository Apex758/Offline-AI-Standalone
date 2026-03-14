import React, { useState } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { BarChart2 } from 'lucide-react';
import type { DistributionData } from '../../types/analytics';

interface ResourceDistributionChartProps {
  data: DistributionData[];
  tabColors?: { [key: string]: string };
}

const resourceToToolType: { [key: string]: string } = {
  lesson: 'lesson-planner',
  quiz: 'quiz-generator',
  rubric: 'rubric-generator',
  kindergarten: 'kindergarten-planner',
  multigrade: 'multigrade-planner',
  'cross-curricular': 'cross-curricular-planner',
  worksheet: 'worksheet-generator',
  image: 'image-studio',
};

const ResourceDistributionChart: React.FC<ResourceDistributionChartProps> = ({ data, tabColors = {} }) => {
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());

  const toggleItem = (name: string) =>
    setHiddenItems(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const max = Math.max(...data.map((d) => d.count), 1);

  const getColor = (type: string): string => tabColors[resourceToToolType[type]] || '#6b7280';

  const allRadialData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: d.label,
      value: Math.round((d.count / max) * 100),
      count: d.count,
      percentage: d.percentage,
      fill: getColor(d.type),
    }));

  const radialData = allRadialData.filter((d) => !hiddenItems.has(d.name));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div
        className="rounded-xl p-3"
        style={{
          backgroundColor: 'white',
          border: '1px solid #E8EAE3',
          boxShadow: '0 8px 24px rgba(29, 54, 45, 0.15)',
          minWidth: 150,
        }}
      >
        <p className="font-semibold mb-1 text-xs" style={{ color: d.fill }}>{d.name}</p>
        <p className="text-xs" style={{ color: '#552A01' }}>
          Count: <span className="font-semibold" style={{ color: '#020D03' }}>{d.count}</span>
        </p>
        <p className="text-xs" style={{ color: '#552A01' }}>
          Share: <span className="font-semibold" style={{ color: '#020D03' }}>{d.percentage}%</span>
        </p>
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
        <BarChart2 className="w-5 h-5" style={{ color: '#1D362D' }} />
        <h3 className="font-bold" style={{ color: '#020D03' }}>Resource Type Distribution</h3>
      </div>

      {/* Chart + Legend */}
      <div className="flex gap-6 items-center flex-1 min-h-0">
        {/* Radial Bar Chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={380}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius={28}
              outerRadius={130}
              barSize={10}
              startAngle={90}
              endAngle={-270}
              data={radialData}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={5}
                background={{ fill: 'rgba(29, 54, 45, 0.05)' }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Toggleable Legend */}
        <div className="w-44 space-y-2.5">
          <div className="text-center mb-3">
            <div className="text-2xl font-bold" style={{ color: '#020D03' }}>{total}</div>
            <div className="text-xs font-medium" style={{ color: '#552A01' }}>Total</div>
          </div>
          {allRadialData.map((entry, i) => {
            const hidden = hiddenItems.has(entry.name);
            return (
              <button
                key={i}
                onClick={() => toggleItem(entry.name)}
                className="flex items-center gap-2 w-full transition-opacity"
                style={{ opacity: hidden ? 0.35 : 1, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: hidden ? '#d1d5db' : entry.fill,
                  flexShrink: 0, display: 'inline-block',
                  transition: 'background 0.2s',
                }} />
                <span className="text-xs truncate" style={{
                  color: hidden ? '#9ca3af' : '#552A01',
                  textDecoration: hidden ? 'line-through' : 'none',
                  transition: 'color 0.2s',
                }}>
                  {entry.name}
                </span>
                <span className="text-xs font-semibold ml-auto" style={{ color: hidden ? '#9ca3af' : '#020D03' }}>
                  {entry.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResourceDistributionChart;