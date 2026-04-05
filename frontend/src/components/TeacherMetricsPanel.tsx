import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import UserIconData from '@hugeicons/core-free-icons/UserIcon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import Calendar01IconData from '@hugeicons/core-free-icons/Calendar01Icon';
import Award01IconData from '@hugeicons/core-free-icons/Award01Icon';
import ArrowUp01IconData from '@hugeicons/core-free-icons/ArrowUp01Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import type { TeacherMetrics, MetricSnapshot, DimensionMetric } from '../types/insights';
import TeacherMetricsChart from './charts/TeacherMetricsChart';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

interface TeacherMetricsPanelProps {
  metrics: TeacherMetrics | null;
  history: MetricSnapshot[];
  previousMetrics?: TeacherMetrics | null;
  loading?: boolean;
  expanded?: boolean;
  onToggleExpanded?: (expanded: boolean) => void;
  onDimensionClick?: (dimension: string) => void;
}

const DIMENSION_CONFIG: Record<string, { icon: any; color: string }> = {
  curriculum: { icon: BookOpen01IconData, color: '#3b82f6' },
  performance: { icon: UserIconData, color: '#22c55e' },
  content: { icon: File01IconData, color: '#a855f7' },
  attendance: { icon: Calendar01IconData, color: '#f97316' },
  achievements: { icon: Award01IconData, color: '#eab308' },
};

function getGradeColor(score: number): string {
  if (score >= 90) return '#22c55e';
  if (score >= 80) return '#3b82f6';
  if (score >= 70) return '#eab308';
  if (score >= 60) return '#f97316';
  return '#ef4444';
}

function getTrend(current: number, previous: number | undefined): 'up' | 'down' | 'neutral' {
  if (previous === undefined) return 'neutral';
  const diff = current - previous;
  if (diff > 1) return 'up';
  if (diff < -1) return 'down';
  return 'neutral';
}

const TeacherMetricsPanel: React.FC<TeacherMetricsPanelProps> = ({
  metrics,
  history,
  previousMetrics,
  loading = false,
  expanded: controlledExpanded,
  onToggleExpanded,
  onDimensionClick,
}) => {
  const { t } = useTranslation();
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const toggleExpanded = () => {
    const next = !expanded;
    if (onToggleExpanded) onToggleExpanded(next);
    else setInternalExpanded(next);
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-theme-border bg-theme-bg-secondary p-4 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-theme-bg-tertiary" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 rounded bg-theme-bg-tertiary" />
            <div className="h-3 w-48 rounded bg-theme-bg-tertiary" />
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const compositeColor = getGradeColor(metrics.composite_score);

  // Sort dimensions lowest-score-first for expanded view
  const sortedDimensions = Object.entries(metrics.dimensions)
    .sort(([, a], [, b]) => a.score - b.score);

  // Count areas to improve (below C range)
  const areasToImprove = sortedDimensions.filter(([, d]) => d.score < 70).length;
  const summaryText = areasToImprove > 0
    ? `${areasToImprove} area${areasToImprove > 1 ? 's' : ''} to improve`
    : 'Strong across all areas';

  return (
    <div className="rounded-xl border border-theme-border bg-theme-bg-secondary overflow-hidden">
      {/* Collapsed header bar — always visible */}
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center gap-4 p-4 hover:bg-theme-bg-tertiary/50 transition-colors text-left"
      >
        {/* Composite score */}
        <div
          className="w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
          style={{ backgroundColor: compositeColor + '15', border: `2px solid ${compositeColor}30` }}
        >
          <span className="text-xl font-bold" style={{ color: compositeColor }}>
            {Math.round(metrics.composite_score)}
          </span>
          <span className="text-xs font-semibold" style={{ color: compositeColor }}>
            {metrics.composite_grade}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-theme-primary">{t('charts.teachingEffectiveness')}</span>
            {metrics.phase.phase_label && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-theme-bg-tertiary text-theme-secondary">
                {metrics.phase.phase_label}
              </span>
            )}
          </div>
          <p className="text-xs text-theme-secondary mt-0.5">{summaryText}</p>
        </div>

        {/* Expand chevron */}
        <svg
          className={`w-5 h-5 text-theme-muted transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-theme-border pt-4">
          {/* Timeline chart */}
          {history.length > 0 && (
            <TeacherMetricsChart data={history} height={280} />
          )}
          {history.length === 0 && (
            <div className="text-center py-6 text-theme-secondary text-sm">
              Generate more reports to see your progress over time
            </div>
          )}

          {/* Dimension cards — sorted lowest first */}
          <div className="space-y-2">
            {sortedDimensions.map(([key, dim]) => {
              const config = DIMENSION_CONFIG[key];
              const prevDim = previousMetrics?.dimensions?.[key as keyof typeof previousMetrics.dimensions];
              const trend = getTrend(dim.score, prevDim?.score);
              const barColor = getGradeColor(dim.score);
              const weightPct = Math.round(dim.weight * 100);

              return (
                <div
                  key={key}
                  className={`rounded-lg border border-theme-border p-3 ${onDimensionClick && dim.score < 70 ? 'cursor-pointer hover:bg-theme-bg-tertiary/50' : ''}`}
                  onClick={() => onDimensionClick && dim.score < 70 ? onDimensionClick(key) : undefined}
                >
                  <div className="flex items-center gap-3">
                    {config && (
                      <Icon icon={config.icon} className="w-4" style={{ color: config.color }} />
                    )}
                    <span className="text-sm font-medium text-theme-primary capitalize flex-1">{key}</span>

                    {/* Trend arrow */}
                    {trend === 'up' && <Icon icon={ArrowUp01IconData} className="w-3.5" style={{ color: '#22c55e' }} />}
                    {trend === 'down' && <Icon icon={ArrowDown01IconData} className="w-3.5" style={{ color: '#ef4444' }} />}
                    {trend === 'neutral' && <Icon icon={ArrowRight01IconData} className="w-3.5" style={{ color: '#9ca3af' }} />}

                    {/* Grade badge */}
                    <span
                      className="text-xs font-semibold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: barColor + '20', color: barColor }}
                    >
                      {dim.grade}
                    </span>

                    {/* Weight */}
                    <span className="text-xs text-theme-muted">{weightPct}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 h-2 rounded-full bg-theme-bg-tertiary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${dim.score}%`, backgroundColor: barColor }}
                    />
                  </div>

                  {/* Description + tips */}
                  <p className="text-xs text-theme-secondary mt-1.5">{dim.description}</p>
                  {dim.tips.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {dim.tips.map((tip, i) => (
                        <p key={i} className="text-xs text-theme-muted pl-3 border-l-2 border-theme-border">
                          {tip}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherMetricsPanel;
