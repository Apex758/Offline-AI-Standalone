import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ReferenceArea, Line
} from 'recharts';
import { useContainerSize } from '../../hooks/useContainerSize';
import { format, parseISO } from 'date-fns';
import type { MetricSnapshot, SchoolPhase } from '../../types/insights';

const PHASE_COLORS_SOLID: Partial<Record<SchoolPhase, string>> = {
  // Generic
  start_of_year: '#3b82f6', early_year: '#22c55e', mid_year: '#6b7280',
  pre_exam: '#f97316', exam_period: '#ef4444', post_exam: '#a855f7',
  vacation: '#eab308', reopening: '#06b6d4',
  // Caribbean
  semester_1_early:     '#3b82f6',
  midterm_1_prep:       '#f97316',
  midterm_1:            '#ef4444',
  semester_1_late:      '#6366f1',
  inter_semester_break: '#eab308',
  semester_2_early:     '#22c55e',
  midterm_2_prep:       '#f97316',
  midterm_2:            '#ef4444',
  semester_2_late:      '#14b8a6',
  end_of_year_exam:     '#dc2626',
};

interface TeacherMetricsChartProps {
  data: MetricSnapshot[];
  height?: number;
  compact?: boolean;
  phaseBadgeRef?: React.Ref<HTMLButtonElement>;
  onPhaseClick?: () => void;
  showPhaseBands?: boolean;
  onChartMouseEnter?: () => void;
  onChartMouseLeave?: () => void;
  currentScore?: number;
  currentGrade?: string;
  periodAvgColor?: string;
}

// Grade scale: A=83-100, B=77-82, C=70-76, D=60-69, E=50-59, F=0-49
const GRADE_COLORS: Record<string, string> = {
  A: '#22c55e',
  B: '#3b82f6',
  C: '#eab308',
  D: '#f97316',
  E: '#f43f5e',
  F: '#ef4444',
};

// Ordered LOW-to-HIGH
const SCORE_BANDS = [
  { min: 0,  max: 50,  label: 'F', color: '#ef4444' },
  { min: 50, max: 60,  label: 'E', color: '#f43f5e' },
  { min: 60, max: 70,  label: 'D', color: '#f97316' },
  { min: 70, max: 77,  label: 'C', color: '#eab308' },
  { min: 77, max: 83,  label: 'B', color: '#3b82f6' },
  { min: 83, max: 100, label: 'A', color: '#22c55e' },
];

const PHASE_COLORS: Partial<Record<SchoolPhase, string>> = {
  // Generic
  start_of_year: 'rgba(59,130,246,0.06)',
  early_year: 'rgba(34,197,94,0.06)',
  mid_year: 'rgba(107,114,128,0.04)',
  pre_exam: 'rgba(249,115,22,0.08)',
  exam_period: 'rgba(239,68,68,0.08)',
  post_exam: 'rgba(168,85,247,0.06)',
  vacation: 'rgba(234,179,8,0.06)',
  reopening: 'rgba(6,182,212,0.06)',
  // Caribbean
  semester_1_early:     'rgba(59,130,246,0.06)',
  midterm_1_prep:       'rgba(249,115,22,0.07)',
  midterm_1:            'rgba(239,68,68,0.08)',
  semester_1_late:      'rgba(99,102,241,0.06)',
  inter_semester_break: 'rgba(234,179,8,0.06)',
  semester_2_early:     'rgba(34,197,94,0.06)',
  midterm_2_prep:       'rgba(249,115,22,0.07)',
  midterm_2:            'rgba(239,68,68,0.08)',
  semester_2_late:      'rgba(20,184,166,0.06)',
  end_of_year_exam:     'rgba(220,38,38,0.09)',
};

const DIMENSION_SERIES = [
  { key: 'curriculum_score',   name: 'Curriculum',   color: '#3b82f6' },
  { key: 'performance_score',  name: 'Performance',  color: '#22c55e' },
  { key: 'content_score',      name: 'Content',      color: '#a855f7' },
  { key: 'attendance_score',   name: 'Attendance',   color: '#f97316' },
  { key: 'achievements_score', name: 'Achievements', color: '#eab308' },
];

function getGradeColor(score: number): string {
  if (score >= 83) return GRADE_COLORS.A;
  if (score >= 77) return GRADE_COLORS.B;
  if (score >= 70) return GRADE_COLORS.C;
  if (score >= 60) return GRADE_COLORS.D;
  if (score >= 50) return GRADE_COLORS.E;
  return GRADE_COLORS.F;
}

function getGradeLabel(score: number): string {
  if (score >= 83) return 'A';
  if (score >= 77) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  if (score >= 50) return 'E';
  return 'F';
}

// Linear Y-axis — raw score values used directly, grade boundaries at SCORE_BANDS min values
const SNAPSHOT_COLOR = '#94a3b8';

const TeacherMetricsChart: React.FC<TeacherMetricsChartProps> = ({
  data,
  height = 340,
  compact = false,
  phaseBadgeRef,
  onPhaseClick,
  showPhaseBands = true,
  onChartMouseEnter,
  onChartMouseLeave,
  currentScore,
  currentGrade,
  periodAvgColor,
}) => {
  const { t } = useTranslation();
  const { ref: chartContainerRef, width: chartWidth, height: chartContainerHeight } = useContainerSize();
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const toggleSeries = (key: string) =>
    setHiddenSeries(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  // Build base chart data with formatted dates
  const chartData = useMemo(() => {
    return data.map(snap => ({
      ...snap,
      dateFormatted: (() => {
        try { return format(parseISO(snap.computed_at), 'MMM d'); } catch { return snap.computed_at; }
      })(),
    }));
  }, [data]);

  // Compute cumulative running average + stamp badge score onto every point
  const transformedData = useMemo(() => {
    let runningSum = 0;
    return chartData.map((snap, idx) => {
      runningSum += snap.composite_score ?? 0;
      const runningAvg = Math.round((runningSum / (idx + 1)) * 10) / 10;
      return { ...snap, running_avg: runningAvg, badge_score: currentScore ?? null };
    });
  }, [chartData, currentScore]);

  // Build phase bands for ReferenceArea backgrounds
  const phaseBands = useMemo(() => {
    if (chartData.length < 2) return [];
    const bands: { x1: string; x2: string; phase: SchoolPhase; label: string }[] = [];
    let currentPhase = chartData[0].phase;
    let bandStart = chartData[0].computed_at;

    for (let i = 1; i < chartData.length; i++) {
      if (chartData[i].phase !== currentPhase) {
        bands.push({ x1: bandStart, x2: chartData[i - 1].computed_at, phase: currentPhase, label: chartData[i - 1].phase_label || currentPhase });
        currentPhase = chartData[i].phase;
        bandStart = chartData[i].computed_at;
      }
    }
    bands.push({ x1: bandStart, x2: chartData[chartData.length - 1].computed_at, phase: currentPhase, label: chartData[chartData.length - 1].phase_label || currentPhase });
    return bands;
  }, [chartData]);

  // Badge area color — reflects the live badge's grade
  const badgeAreaColor = useMemo(() => getGradeColor(currentScore ?? 0), [currentScore]);

  // Period avg color — from the tab color set in Settings, fallback to a neutral
  const avgColor = periodAvgColor ?? '#d97706';

  // Y-axis ticks at each grade's start boundary only — no 100 to avoid duplicate A
  const yAxisTicks = SCORE_BANDS.map(b => b.min);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const snap = payload[0]?.payload;
    if (!snap) return null;
    const snapshotScore = snap.composite_score ?? 0;
    const badgeScore = currentScore ?? snapshotScore;
    const badgeGrade = currentGrade ?? getGradeLabel(badgeScore);
    const badgeColor = getGradeColor(badgeScore);

    // Shared row renderer for snapshot + avg
    const ScoreRow = ({ label: rowLabel, score, color }: { label: string; score: number; color: string }) => (
      <div className="flex items-center gap-2 text-xs">
        <span style={{ color: 'var(--dash-text-sub)', minWidth: 52 }}>{rowLabel}</span>
        <span className="font-semibold" style={{ color }}>{score}</span>
        <span
          className="font-bold px-1 py-0.5 rounded ml-auto"
          style={{ backgroundColor: color + '22', color, minWidth: '1.4rem', textAlign: 'center', fontSize: 10 }}
        >
          {getGradeLabel(score)}
        </span>
      </div>
    );

    return (
      <div
        className="rounded-xl p-3"
        style={{
          backgroundColor: 'var(--dash-card-bg)',
          border: '1px solid var(--dash-border)',
          boxShadow: '0 8px 24px var(--dash-card-shadow)',
          minWidth: 200,
        }}
      >
        {/* Date */}
        <p className="font-semibold mb-2 text-xs" style={{ color: 'var(--dash-text)' }}>
          {(() => { try { return format(parseISO(label), 'MMM d, yyyy'); } catch { return label; } })()}
        </p>

        {/* Badge — styled like the actual grade badge button */}
        <div className="flex items-center justify-center mb-3">
          <div
            className="flex flex-col items-center justify-center rounded-xl px-4 py-2"
            style={{
              backgroundColor: badgeColor + '18',
              border: `2px solid ${badgeColor + '55'}`,
              minWidth: 64,
            }}
          >
            <span className="text-xl font-bold leading-none" style={{ color: badgeColor }}>{badgeScore}</span>
            <span className="text-xs font-semibold mt-0.5" style={{ color: badgeColor }}>{badgeGrade}</span>
          </div>
        </div>

        {/* Snapshot + avg rows */}
        <div className="flex flex-col gap-1.5 mb-2">
          <ScoreRow label="Snapshot" score={snapshotScore} color={getGradeColor(snapshotScore)} />
          {snap.running_avg !== undefined && (
            <ScoreRow label="Period avg" score={snap.running_avg} color={getGradeColor(snap.running_avg)} />
          )}
        </div>

        {/* Phase */}
        {snap.phase_label && (
          <p className="text-xs mb-2 pt-1.5" style={{ color: 'var(--dash-text-sub)', borderTop: '1px solid var(--dash-border)' }}>
            Phase: {snap.phase_label}
          </p>
        )}

        {/* Dimensions */}
        {!compact && (
          <div className="flex flex-col gap-0.5">
            {payload.slice(2).map((entry: any, i: number) => {
              const val = Math.round((snap[entry.dataKey] ?? 0));
              const gradeColor = getGradeColor(val);
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: entry.color, flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ color: 'var(--dash-text-sub)' }}>{entry.name}</span>
                  <span className="font-semibold ml-auto" style={{ color: 'var(--dash-text)' }}>{val}</span>
                  <span className="font-bold text-[10px] px-1 py-0.5 rounded" style={{ backgroundColor: gradeColor + '22', color: gradeColor, minWidth: '1.4rem', textAlign: 'center' }}>{getGradeLabel(val)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const CustomYAxisTick = ({ x, y, payload }: any) => {
    const val = payload.value;
    // Find the grade label for this tick (boundary = start of that grade's band)
    const band = SCORE_BANDS.find(b => b.min === val);
    if (!band) return null;
    return (
      <text x={x} y={y} dy={4} textAnchor="end" fontSize={11} fontWeight={700} fill={band.color}>
        {band.label}
      </text>
    );
  };

  if (chartData.length === 0) {
    return (
      <div
        className="rounded-2xl p-6 h-full flex flex-col items-center justify-center"
        style={{ backgroundColor: 'var(--dash-card-bg)', boxShadow: '0 4px 16px var(--dash-card-shadow)' }}
      >
        <p className="text-sm" style={{ color: 'var(--dash-text-sub)' }}>
          Generate more reports to see your progress over time
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl px-4 pt-3 pb-20 h-full flex flex-col tmc-root"
      style={{ backgroundColor: 'var(--dash-card-bg)', boxShadow: '0 4px 16px var(--dash-card-shadow)', outline: 'none' }}
    >
      <style>{`.tmc-root *:focus { outline: none !important; }`}</style>
      {!compact && (
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-bold" style={{ color: 'var(--dash-text)' }}>{t('charts.teachingEffectiveness')}</h3>
          {chartData.length > 0 && onPhaseClick && (
            <button
              ref={phaseBadgeRef}
              onClick={onPhaseClick}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border transition-opacity hover:opacity-80"
              style={{
                backgroundColor: 'var(--dash-card-bg)',
                borderColor: 'var(--dash-border)',
                color: 'var(--dash-text-sub)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: PHASE_COLORS_SOLID[chartData[chartData.length - 1].phase] || '#6b7280' }}
              />
              {chartData[chartData.length - 1].phase_label}
            </button>
          )}
        </div>
      )}

      <div
        ref={chartContainerRef}
        className="flex-1"
        style={{ width: '100%', outline: 'none' }}
        onMouseDown={e => e.preventDefault()}
        onMouseEnter={onChartMouseEnter}
        onMouseLeave={onChartMouseLeave}
      >
        {chartWidth > 0 && chartContainerHeight > 0 && (
          <AreaChart width={chartWidth} height={chartContainerHeight} data={transformedData} margin={{ top: 8, right: 8, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="tmcAvgGradientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={avgColor} stopOpacity={0.45} />
                <stop offset="95%" stopColor={avgColor} stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="tmcBadgeGradientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={badgeAreaColor} stopOpacity={0.45} />
                <stop offset="95%" stopColor={badgeAreaColor} stopOpacity={0.04} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-border)" vertical={false} />


            {/* Phase background bands (layered on top of grade bands) */}
            {showPhaseBands && phaseBands.map((band, i) => (
              <ReferenceArea
                key={`phase-${i}`}
                x1={band.x1}
                x2={band.x2}
                fill={PHASE_COLORS[band.phase] || 'transparent'}
                fillOpacity={1}
              />
            ))}

            {/* Grade boundary dashed lines at raw score boundaries */}
            {SCORE_BANDS.slice(1).map((band, i) => (
              <ReferenceLine
                key={`grade-line-${i}`}
                y={band.min}
                stroke={band.color}
                strokeDasharray="5 5"
                strokeOpacity={0.5}
              />
            ))}

            <XAxis
              dataKey="computed_at"
              tickFormatter={(v: string) => { try { return format(parseISO(v), 'MMM d'); } catch { return v; } }}
              tick={{ fontSize: 11, fill: 'var(--dash-axis-tick)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              ticks={yAxisTicks}
              tick={<CustomYAxisTick />}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Badge area — color reflects live badge grade */}
            <Area
              type="monotone"
              dataKey="badge_score"
              name="Badge"
              stroke={badgeAreaColor}
              strokeWidth={2}
              fill="url(#tmcBadgeGradientFill)"
              dot={false}
              activeDot={{ r: 5, fill: badgeAreaColor, strokeWidth: 0 }}
              hide={hiddenSeries.has('badge_score')}
              connectNulls
            />

            {/* Period average area — color from Settings tab color */}
            <Area
              type="monotone"
              dataKey="running_avg"
              name="Period Avg"
              stroke={avgColor}
              strokeWidth={2.5}
              fill="url(#tmcAvgGradientFill)"
              dot={false}
              activeDot={{ r: 5, fill: avgColor, strokeWidth: 0 }}
              hide={hiddenSeries.has('running_avg')}
            />

            {/* Snapshot line — point-in-time composite at each report (no fill) */}
            <Line
              type="monotone"
              dataKey="composite_score"
              name="Snapshots"
              stroke={SNAPSHOT_COLOR}
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={{ r: 4, fill: SNAPSHOT_COLOR, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: SNAPSHOT_COLOR, strokeWidth: 0 }}
              hide={hiddenSeries.has('composite_score')}
            />

            {/* Dimension overlay lines (non-compact only) */}
            {!compact && DIMENSION_SERIES.map(s => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 3 }}
                hide={hiddenSeries.has(s.key)}
              />
            ))}
          </AreaChart>
        )}
      </div>

      {/* Toggleable legend for snapshot line + dimension overlays */}
      {!compact && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 px-1">
          {/* Badge toggle */}
          {currentScore !== undefined && (() => {
            const hidden = hiddenSeries.has('badge_score');
            return (
              <button
                onClick={() => toggleSeries('badge_score')}
                className="flex items-center gap-1.5 transition-opacity"
                style={{ opacity: hidden ? 0.35 : 1, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              >
                <span style={{
                  width: 16, height: 10, borderRadius: 3,
                  background: hidden ? 'var(--dash-hidden-dot)' : badgeAreaColor + '55',
                  border: `2px solid ${hidden ? 'var(--dash-hidden-dot)' : badgeAreaColor}`,
                  flexShrink: 0, display: 'inline-block',
                }} />
                <span style={{
                  fontSize: 13,
                  color: hidden ? 'var(--dash-hidden-text)' : 'var(--dash-text-sub)',
                  textDecoration: hidden ? 'line-through' : 'none',
                }}>
                  Badge
                </span>
              </button>
            );
          })()}
          {/* Period Avg toggle */}
          {(() => {
            const hidden = hiddenSeries.has('running_avg');
            return (
              <button
                onClick={() => toggleSeries('running_avg')}
                className="flex items-center gap-1.5 transition-opacity"
                style={{ opacity: hidden ? 0.35 : 1, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              >
                <span style={{
                  width: 16, height: 10, borderRadius: 3,
                  background: hidden ? 'var(--dash-hidden-dot)' : avgColor + '55',
                  border: `2px solid ${hidden ? 'var(--dash-hidden-dot)' : avgColor}`,
                  flexShrink: 0, display: 'inline-block',
                }} />
                <span style={{
                  fontSize: 13,
                  color: hidden ? 'var(--dash-hidden-text)' : 'var(--dash-text-sub)',
                  textDecoration: hidden ? 'line-through' : 'none',
                }}>
                  Period Avg
                </span>
              </button>
            );
          })()}
          {/* Snapshots toggle */}
          {(() => {
            const hidden = hiddenSeries.has('composite_score');
            return (
              <button
                onClick={() => toggleSeries('composite_score')}
                className="flex items-center gap-1.5 transition-opacity"
                style={{ opacity: hidden ? 0.35 : 1, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              >
                <span style={{
                  width: 16, height: 2, borderRadius: 1,
                  background: hidden ? 'var(--dash-hidden-dot)' : SNAPSHOT_COLOR,
                  flexShrink: 0, display: 'inline-block',
                }} />
                <span style={{
                  fontSize: 13,
                  color: hidden ? 'var(--dash-hidden-text)' : 'var(--dash-text-sub)',
                  textDecoration: hidden ? 'line-through' : 'none',
                }}>
                  Snapshots
                </span>
              </button>
            );
          })()}
          {/* Dimension toggles */}
          {DIMENSION_SERIES.map(s => {
            const hidden = hiddenSeries.has(s.key);
            return (
              <button
                key={s.key}
                onClick={() => toggleSeries(s.key)}
                className="flex items-center gap-1.5 transition-opacity"
                style={{ opacity: hidden ? 0.35 : 1, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              >
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: hidden ? 'var(--dash-hidden-dot)' : s.color,
                  flexShrink: 0, display: 'inline-block',
                }} />
                <span style={{
                  fontSize: 13,
                  color: hidden ? 'var(--dash-hidden-text)' : 'var(--dash-text-sub)',
                  textDecoration: hidden ? 'line-through' : 'none',
                }}>
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherMetricsChart;
