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
  compact?: boolean; // compact mode hides dimension overlays + legend
  phaseBadgeRef?: React.Ref<HTMLButtonElement>;
  onPhaseClick?: () => void;
  showPhaseBands?: boolean;
}

const GRADE_COLORS: Record<string, string> = {
  A: '#22c55e',
  B: '#3b82f6',
  C: '#eab308',
  D: '#f97316',
  E: '#f43f5e',
  F: '#ef4444',
};

const GRADE_BANDS = [
  { min: 90, max: 100, label: 'A', color: '#22c55e' },
  { min: 80, max: 90,  label: 'B', color: '#3b82f6' },
  { min: 70, max: 80,  label: 'C', color: '#eab308' },
  { min: 60, max: 70,  label: 'D', color: '#f97316' },
  { min: 0,  max: 60,  label: 'F', color: '#ef4444' },
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

// Which phases belong to Semester 1 vs Semester 2 (for divider rendering)
const SEMESTER_1_PHASES = new Set<SchoolPhase>([
  'start_of_year', 'early_year', 'mid_year',
  'semester_1_early', 'midterm_1_prep', 'midterm_1', 'semester_1_late',
]);
const SEMESTER_2_PHASES = new Set<SchoolPhase>([
  'semester_2_early', 'midterm_2_prep', 'midterm_2', 'semester_2_late', 'end_of_year_exam',
]);

const DIMENSION_SERIES = [
  { key: 'curriculum_score',   name: 'Curriculum',   color: '#3b82f6' },
  { key: 'performance_score',  name: 'Performance',  color: '#22c55e' },
  { key: 'content_score',      name: 'Content',      color: '#a855f7' },
  { key: 'attendance_score',   name: 'Attendance',   color: '#f97316' },
  { key: 'achievements_score', name: 'Achievements', color: '#eab308' },
];

function getGradeColor(score: number): string {
  if (score >= 90) return GRADE_COLORS.A;
  if (score >= 80) return GRADE_COLORS.B;
  if (score >= 70) return GRADE_COLORS.C;
  if (score >= 60) return GRADE_COLORS.D;
  if (score >= 50) return GRADE_COLORS.E;
  return GRADE_COLORS.F;
}

function getGradeLabel(score: number): string {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 60) return 'D';
  return 'F';
}

const TeacherMetricsChart: React.FC<TeacherMetricsChartProps> = ({
  data,
  height = 340,
  compact = false,
  phaseBadgeRef,
  onPhaseClick,
  showPhaseBands = true,
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

  // Build chart data with formatted dates
  const chartData = useMemo(() => {
    return data.map(snap => ({
      ...snap,
      dateFormatted: (() => {
        try { return format(parseISO(snap.computed_at), 'MMM d'); } catch { return snap.computed_at; }
      })(),
    }));
  }, [data]);

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

  const latestGradeColor = useMemo(() => {
    if (chartData.length === 0) return '#6b7280';
    return getGradeColor(chartData[chartData.length - 1].composite_score);
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const snap = payload[0]?.payload;
    if (!snap) return null;
    return (
      <div
        className="rounded-xl p-3"
        style={{
          backgroundColor: 'var(--dash-card-bg)',
          border: '1px solid var(--dash-border)',
          boxShadow: '0 8px 24px var(--dash-card-shadow)',
          minWidth: 180,
        }}
      >
        <p className="font-semibold mb-1 text-xs" style={{ color: 'var(--dash-text)' }}>
          {(() => { try { return format(parseISO(label), 'MMM d, yyyy'); } catch { return label; } })()}
        </p>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-lg font-bold"
            style={{ color: getGradeColor(snap.composite_score) }}
          >
            {snap.composite_score}
          </span>
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: getGradeColor(snap.composite_score) + '20',
              color: getGradeColor(snap.composite_score),
            }}
          >
            {getGradeLabel(snap.composite_score)}
          </span>
        </div>
        {snap.phase_label && (
          <p className="text-xs mb-1" style={{ color: 'var(--dash-text-sub)' }}>
            Phase: {snap.phase_label}
          </p>
        )}
        {!compact && payload.slice(1).map((entry: any, i: number) => {
          const val = Math.round(entry.value);
          const grade = getGradeLabel(val);
          const gradeColor = getGradeColor(val);
          return (
            <div key={i} className="flex items-center gap-2 text-xs mb-0.5">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: entry.color, flexShrink: 0, display: 'inline-block' }} />
              <span style={{ color: 'var(--dash-text-sub)' }}>{entry.name}</span>
              <span className="font-semibold ml-auto" style={{ color: 'var(--dash-text)' }}>{val}</span>
              <span className="font-bold text-[10px] px-1 py-0.5 rounded" style={{ backgroundColor: gradeColor + '22', color: gradeColor, minWidth: '1.4rem', textAlign: 'center' }}>{grade}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const formatYAxis = (value: number) => {
    if (value >= 90) return 'A';
    if (value >= 80) return 'B';
    if (value >= 70) return 'C';
    if (value >= 60) return 'D';
    if (value >= 50) return 'E';
    if (value === 0) return 'F';
    return '';
  };

  const CustomYAxisTick = ({ x, y, payload }: any) => {
    const label = formatYAxis(payload.value);
    if (!label) return null;
    return (
      <text
        x={x}
        y={y}
        dy={4}
        textAnchor="end"
        fontSize={11}
        fontWeight={700}
        fill={getGradeColor(payload.value)}
      >
        {label}
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

      <div ref={chartContainerRef} className="flex-1" style={{ width: '100%', outline: 'none' }} onMouseDown={e => e.preventDefault()}>
        {chartWidth > 0 && chartContainerHeight > 0 && (
          <AreaChart width={chartWidth} height={chartContainerHeight} data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="tmcGradientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={latestGradeColor} stopOpacity={0.45} />
                <stop offset="95%" stopColor={latestGradeColor} stopOpacity={0.04} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-border)" vertical={false} />

            {/* Phase background bands */}
            {showPhaseBands && phaseBands.map((band, i) => (
              <ReferenceArea
                key={i}
                x1={band.x1}
                x2={band.x2}
                fill={PHASE_COLORS[band.phase] || 'transparent'}
                fillOpacity={1}
              />
            ))}

            {/* Grade boundary reference lines */}
            {[50, 60, 70, 80, 90].map(boundary => (
              <ReferenceLine
                key={boundary}
                y={boundary}
                stroke="var(--dash-border)"
                strokeDasharray="5 5"
                strokeOpacity={0.6}
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
              ticks={[0, 50, 60, 70, 80, 90]}
              tick={<CustomYAxisTick />}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Composite score area */}
            <Area
              type="monotone"
              dataKey="composite_score"
              name="Composite"
              stroke={latestGradeColor}
              strokeWidth={3}
              fill="url(#tmcGradientFill)"
              dot={{ r: 4, fill: latestGradeColor, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: latestGradeColor, strokeWidth: 0 }}
            />

            {/* Dimension overlay lines (only in non-compact mode) */}
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

      {/* Toggleable legend for dimension overlays */}
      {!compact && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 px-1">
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
