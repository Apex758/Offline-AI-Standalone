import React from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import ChartIncreaseIconData from '@hugeicons/core-free-icons/ChartIncreaseIcon';
import ChartDecreaseIconData from '@hugeicons/core-free-icons/ChartDecreaseIcon';
import MinusSignIconData from '@hugeicons/core-free-icons/MinusSignIcon';

const IconW: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const TrendingUp: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ChartIncreaseIconData} {...p} />;
const TrendingDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ChartDecreaseIconData} {...p} />;
const Minus: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={MinusSignIconData} {...p} />;

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
  const { t } = useTranslation();
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
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
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="rounded-xl p-6 widget-glass transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            {subtitle && (
              <span className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</span>
            )}
          </div>
          
          {trend && (
            <div className={`flex items-center space-x-1 mt-2 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('widgets.vsLastPeriod')}</span>
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