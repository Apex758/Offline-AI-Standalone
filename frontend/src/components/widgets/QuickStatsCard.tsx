import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface QuickStatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  color: string;
  subtitle?: string;
}

const QuickStatsCard: React.FC<QuickStatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color,
  subtitle
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <span className="text-sm text-gray-500">{subtitle}</span>
            )}
          </div>
          
          {trend && (
            <div className={`flex items-center space-x-1 mt-2 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStatsCard;