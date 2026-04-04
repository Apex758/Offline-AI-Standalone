import React, { useState, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import UserIconData from '@hugeicons/core-free-icons/UserIcon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import Calendar01IconData from '@hugeicons/core-free-icons/Calendar01Icon';
import Award01IconData from '@hugeicons/core-free-icons/Award01Icon';
import ArrowUp01IconData from '@hugeicons/core-free-icons/ArrowUp01Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import type { TeacherMetrics, MetricSnapshot, InsightsData } from '../types/insights';
import TeacherMetricsChart from './charts/TeacherMetricsChart';
import YearPhasePopover from './charts/YearPhasePopover';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 16;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

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

export interface DimensionClickContext {
  score: number;
  grade: string;
  weight: number;
  description: string;
  phaseLabel: string;
  breakdown: { label: string; value: string; note?: string }[];
}

interface InsightsGraphRowProps {
  metrics: TeacherMetrics | null;
  metricsHistory: MetricSnapshot[];
  previousMetrics?: TeacherMetrics | null;
  insightsData?: InsightsData | null;
  loading?: boolean;
  onDimensionClick?: (dimension: string, ctx: DimensionClickContext) => void;
}

const InsightsGraphRow: React.FC<InsightsGraphRowProps> = ({
  metrics,
  metricsHistory,
  previousMetrics,
  insightsData,
  loading = false,
  onDimensionClick,
}) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [phasePopoverOpen, setPhasePopoverOpen] = useState(false);
  const [showPhaseBands, setShowPhaseBands] = useState(true);
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);
  const phaseBadgeRef = useRef<HTMLButtonElement>(null);

  // Loading skeleton
  if (loading && !metrics) {
    return (
      <div className="flex-none bg-theme-bg-secondary" style={{ height: 300 }}>
        <div className="h-full flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-theme-bg-tertiary rounded" />
        </div>
      </div>
    );
  }

  const compositeColor = metrics ? getGradeColor(metrics.composite_score) : '#9ca3af';
  const sortedDimensions = metrics
    ? Object.entries(metrics.dimensions).sort(([, a], [, b]) => a.score - b.score)
    : [];

  return (
    <div className="bg-theme-bg-secondary overflow-hidden h-full">
      <div className="flex h-full">
        {/* ── Graph area ── */}
        <div className="flex-1 relative min-w-0 px-2 pt-2 pb-1">
          {/* Year phase popover */}
          {phasePopoverOpen && metrics && phaseBadgeRef.current && (() => {
            const btn = phaseBadgeRef.current;
            const container = btn.closest('.relative') as HTMLElement | null;
            if (!container) return null;
            const btnRect = btn.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            return (
              <YearPhasePopover
                currentPhase={metrics.phase.phase}
                onClose={() => setPhasePopoverOpen(false)}
                anchorTop={btnRect.top - containerRect.top}
                anchorLeft={btnRect.right - containerRect.left}
                showPhaseBands={showPhaseBands}
                onTogglePhaseBands={() => setShowPhaseBands(p => !p)}
              />
            );
          })()}

          {metricsHistory.length > 0 ? (
            <TeacherMetricsChart
              data={metricsHistory}
              phaseBadgeRef={phaseBadgeRef}
              onPhaseClick={() => setPhasePopoverOpen(p => !p)}
              showPhaseBands={showPhaseBands}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-theme-secondary">
              {metrics
                ? 'Generate more reports to see your progress over time'
                : 'No metrics data yet — generate a report to begin'}
            </div>
          )}

          {/* ── Grade badge + vertical stats (top-right) ── */}
          {metrics && (
            <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
              {/* Grade badge — clicking toggles breakdown panel */}
              <button
                onClick={() => setPanelOpen(p => !p)}
                title={panelOpen ? 'Hide breakdown' : 'Show dimension breakdown'}
                className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 transition-opacity hover:opacity-75"
                style={{
                  backgroundColor: compositeColor + '18',
                  border: `2px solid ${panelOpen ? compositeColor : compositeColor + '35'}`,
                }}
              >
                <span className="text-lg font-bold leading-none" style={{ color: compositeColor }}>
                  {Math.round(metrics.composite_score)}
                </span>
                <span className="text-xs font-semibold" style={{ color: compositeColor }}>
                  {metrics.composite_grade}
                </span>
              </button>

              {/* 5 data metrics stacked vertically below the grade */}
              {insightsData && (
                <div className="flex flex-col items-end gap-3 bg-theme-bg/85 backdrop-blur-sm rounded-lg px-3.5 py-3 border border-theme-border/60" style={{ minWidth: '10.5rem' }}>
                  {/* Curriculum */}
                  <div className="flex flex-col items-end leading-none gap-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-theme-muted">Curriculum</span>
                    <span className="text-base font-bold text-theme-primary">
                      {insightsData.curriculum?.has_data ? `${insightsData.curriculum.pct}%` : '--'}
                    </span>
                    <span className="text-xs text-theme-muted">
                      {insightsData.curriculum?.has_data
                        ? `${insightsData.curriculum.completed}/${insightsData.curriculum.total} milestones`
                        : 'No milestones tracked'}
                    </span>
                  </div>

                  <div className="w-full h-px bg-theme-border/40" />

                  {/* Performance */}
                  <div className="flex flex-col items-end leading-none gap-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-theme-muted">Performance</span>
                    <span className="text-base font-bold text-theme-primary">
                      {insightsData.performance?.has_data ? `${insightsData.performance.avgScore}%` : '--'}
                    </span>
                    <span className="text-xs text-theme-muted">
                      {insightsData.performance?.has_data
                        ? `${insightsData.performance.totalStudents} students tracked`
                        : 'No grades recorded'}
                    </span>
                  </div>

                  <div className="w-full h-px bg-theme-border/40" />

                  {/* Content */}
                  <div className="flex flex-col items-end leading-none gap-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-theme-muted">Content</span>
                    <span className="text-base font-bold text-theme-primary">
                      {insightsData.content?.has_data ? `${insightsData.content.totalResources}` : '--'}
                    </span>
                    <span className="text-xs text-theme-muted">
                      {insightsData.content?.has_data ? `Top: ${insightsData.content.topType}` : 'No content created'}
                    </span>
                  </div>

                  <div className="w-full h-px bg-theme-border/40" />

                  {/* Attendance */}
                  <div className="flex flex-col items-end leading-none gap-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-theme-muted">Attendance</span>
                    <span className="text-base font-bold text-theme-primary">
                      {insightsData.attendance?.has_data ? `${insightsData.attendance.avgRate}%` : '--'}
                    </span>
                    <span className="text-xs text-theme-muted">
                      {insightsData.attendance?.has_data
                        ? `${insightsData.attendance.atRiskCount} at-risk students`
                        : 'No attendance recorded'}
                    </span>
                  </div>

                  <div className="w-full h-px bg-theme-border/40" />

                  {/* Achievements */}
                  <div className="flex flex-col items-end leading-none gap-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-theme-muted">Achievements</span>
                    <span className="text-base font-bold text-theme-primary">
                      {insightsData.achievements?.has_data
                        ? `${insightsData.achievements.totalEarned}/${insightsData.achievements.totalAvailable}`
                        : '--'}
                    </span>
                    <span className="text-xs text-theme-muted">
                      {insightsData.achievements?.has_data
                        ? `${insightsData.achievements.rank?.title || 'Newcomer'} · ${insightsData.achievements.streakDays}d streak`
                        : 'No achievements yet'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right expansion panel ── */}
        <div
          className="border-l border-theme-border overflow-hidden flex-shrink-0 transition-all duration-[250ms] ease-in-out"
          style={{ width: panelOpen ? '18rem' : '0' }}
        >
          {/* Inner div is always 18rem so content doesn't re-flow during animation */}
          <div className="w-72 h-full overflow-y-auto flex flex-col">
            <div className="px-3 pt-3 pb-1.5 border-b border-theme-border">
              <p className="text-xs font-bold uppercase tracking-wider text-theme-secondary">
                Dimension Breakdown
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {sortedDimensions.map(([key, dim]) => {
                const config = DIMENSION_CONFIG[key];
                const prevDim = previousMetrics?.dimensions?.[key as keyof typeof previousMetrics.dimensions];
                const trend = getTrend(dim.score, prevDim?.score);
                const barColor = getGradeColor(dim.score);
                const weightPct = Math.round(dim.weight * 100);
                const isExpanded = expandedDimension === key;

                const breakdown: { label: string; value: string; note?: string }[] = [];
                if (key === 'curriculum' && insightsData?.curriculum) {
                  const c = insightsData.curriculum;
                  breakdown.push({ label: 'Completion rate', value: c.has_data ? `${c.pct}%` : '--', note: '60% of score' });
                  breakdown.push({ label: 'Milestones done', value: c.has_data ? `${c.completed} / ${c.total}` : '--' });
                  if (c.gaps?.length) breakdown.push({ label: 'Gaps found', value: `${c.gaps.length} topic${c.gaps.length > 1 ? 's' : ''}`, note: 'Penalises score' });
                } else if (key === 'performance' && insightsData?.performance) {
                  const p = insightsData.performance;
                  breakdown.push({ label: 'Class average', value: p.has_data ? `${p.avgScore}%` : '--', note: 'Primary driver' });
                  breakdown.push({ label: 'Students tracked', value: p.has_data ? `${p.totalStudents}` : '--' });
                  if (p.bySubject?.length) breakdown.push({ label: 'Subjects covered', value: `${p.bySubject.length}` });
                } else if (key === 'content' && insightsData?.content) {
                  const c = insightsData.content;
                  breakdown.push({ label: 'Total resources', value: c.has_data ? `${c.totalResources}` : '--', note: 'Volume drives score' });
                  breakdown.push({ label: 'Top type', value: c.has_data ? c.topType : '--' });
                  if (c.recent7d !== undefined) breakdown.push({ label: 'Last 7 days', value: `${c.recent7d}`, note: 'Recency bonus' });
                  const typeCount = c.byType ? Object.keys(c.byType).length : 0;
                  if (typeCount) breakdown.push({ label: 'Content types', value: `${typeCount}`, note: 'Diversity bonus' });
                } else if (key === 'attendance' && insightsData?.attendance) {
                  const a = insightsData.attendance;
                  breakdown.push({ label: 'Average rate', value: a.has_data ? `${a.avgRate}%` : '--', note: 'Primary driver' });
                  breakdown.push({ label: 'At-risk students', value: a.has_data ? `${a.atRiskCount}` : '--', note: a.atRiskCount > 0 ? 'Penalises score' : undefined });
                } else if (key === 'achievements' && insightsData?.achievements) {
                  const a = insightsData.achievements;
                  breakdown.push({ label: 'Trophies earned', value: a.has_data ? `${a.totalEarned} / ${a.totalAvailable}` : '--', note: '40% of score' });
                  breakdown.push({ label: 'Activity streak', value: a.has_data ? `${a.streakDays} days` : '--', note: '30% of score' });
                  breakdown.push({ label: 'Active days total', value: a.has_data ? `${a.totalActiveDays}` : '--', note: '30% of score' });
                  if (a.rank) breakdown.push({ label: 'Current rank', value: a.rank.title });
                  if (a.rank?.next_title) breakdown.push({ label: 'Next rank', value: a.rank.next_title, note: a.rank.achievements_for_next ? `${a.rank.achievements_for_next} more needed` : undefined });
                }

                return (
                  <div key={key} className="rounded-lg border border-theme-border overflow-hidden">
                    {/* Header row — click to expand */}
                    <div
                      className="flex items-center gap-2 p-3 cursor-pointer hover:bg-theme-bg-tertiary/40 transition-colors select-none"
                      onClick={() => setExpandedDimension(isExpanded ? null : key)}
                    >
                      {config && <Icon icon={config.icon} className="w-4" style={{ color: config.color }} />}
                      <span className="text-sm font-medium text-theme-primary capitalize flex-1">{key}</span>

                      {trend === 'up' && <Icon icon={ArrowUp01IconData} className="w-3.5" style={{ color: '#22c55e' }} />}
                      {trend === 'down' && <Icon icon={ArrowDown01IconData} className="w-3.5" style={{ color: '#ef4444' }} />}
                      {trend === 'neutral' && <Icon icon={ArrowRight01IconData} className="w-3.5" style={{ color: '#9ca3af' }} />}

                      <span className="text-sm font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: barColor + '20', color: barColor }}>
                        {dim.grade}
                      </span>
                      <span className="text-sm text-theme-muted">{weightPct}%</span>
                      <svg
                        className="w-3.5 h-3.5 text-theme-muted flex-shrink-0 transition-transform duration-200"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Progress bar */}
                    <div className="mx-3 mb-2.5 h-1.5 rounded-full bg-theme-bg-tertiary overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${dim.score}%`, backgroundColor: barColor }} />
                    </div>

                    {/* Expanded section */}
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-2 border-t border-theme-border/50 space-y-2.5">
                        <p className="text-xs text-theme-secondary leading-snug">{dim.description}</p>

                        {breakdown.length > 0 && (
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">What contributes</p>
                            {breakdown.map((row, i) => (
                              <div key={i} className="flex items-center justify-between gap-2">
                                <span className="text-xs text-theme-secondary">{row.label}</span>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  {row.note && <span className="text-[10px] text-theme-muted italic">{row.note}</span>}
                                  <span className="text-xs font-semibold text-theme-primary">{row.value}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {onDimensionClick && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const ctx: DimensionClickContext = {
                                score: dim.score,
                                grade: dim.grade,
                                weight: dim.weight,
                                description: dim.description,
                                phaseLabel: metrics?.phase?.phase_label || '',
                                breakdown,
                              };
                              onDimensionClick(key, ctx);
                            }}
                            className="w-full text-xs font-medium py-1.5 px-2 rounded-md border transition-colors text-left"
                            style={{ borderColor: barColor + '50', color: barColor, backgroundColor: barColor + '0d' }}
                          >
                            Talk to Coach about {key} →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {sortedDimensions.length === 0 && (
                <p className="text-xs text-theme-muted text-center py-4">No dimension data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsGraphRow;
