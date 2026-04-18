import React, { useState, useMemo, useId, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ReferenceArea, Line
} from 'recharts';
import { format, parseISO } from 'date-fns';
import type { MetricSnapshot, SchoolPhase } from '../../types/insights';

const PHASE_COLORS_SOLID: Partial<Record<SchoolPhase, string>> = {
  // Generic
  start_of_year: '#3b82f6', early_year: '#22c55e', mid_year: '#6b7280',
  pre_exam: '#f97316', exam_period: '#ef4444', post_exam: '#a855f7',
  vacation: '#eab308', reopening: '#06b6d4',
  // Caribbean
  term_1_early:         '#3b82f6',
  term_1_midterm_prep:  '#f97316',
  term_1_midterm:       '#ef4444',
  term_1_late:          '#6366f1',
  christmas_break:      '#eab308',
  term_2_early:         '#22c55e',
  term_2_midterm_prep:  '#f97316',
  term_2_midterm:       '#ef4444',
  term_2_late:          '#14b8a6',
  easter_break:         '#a855f7',
  term_3_early:         '#06b6d4',
  term_3_late:          '#0ea5e9',
  end_of_year_exam:     '#dc2626',
  summer_vacation:      '#84cc16',
};

interface TeacherMetricsChartProps {
  data: MetricSnapshot[];
  height?: number;
  compact?: boolean;
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
  // Generic — solid color blocks at consistent opacity
  start_of_year: 'rgba(59,130,246,0.12)',
  early_year:    'rgba(34,197,94,0.12)',
  mid_year:      'rgba(107,114,128,0.10)',
  pre_exam:      'rgba(249,115,22,0.14)',
  exam_period:   'rgba(239,68,68,0.14)',
  post_exam:     'rgba(168,85,247,0.12)',
  vacation:      'rgba(234,179,8,0.12)',
  reopening:     'rgba(6,182,212,0.12)',
  // Caribbean
  term_1_early:         'rgba(59,130,246,0.12)',
  term_1_midterm_prep:  'rgba(249,115,22,0.14)',
  term_1_midterm:       'rgba(239,68,68,0.14)',
  term_1_late:          'rgba(99,102,241,0.12)',
  christmas_break:      'rgba(234,179,8,0.12)',
  term_2_early:         'rgba(34,197,94,0.12)',
  term_2_midterm_prep:  'rgba(249,115,22,0.14)',
  term_2_midterm:       'rgba(239,68,68,0.14)',
  term_2_late:          'rgba(20,184,166,0.12)',
  easter_break:         'rgba(168,85,247,0.12)',
  term_3_early:         'rgba(6,182,212,0.12)',
  term_3_late:          'rgba(14,165,233,0.12)',
  end_of_year_exam:     'rgba(220,38,38,0.15)',
  summer_vacation:      'rgba(132,204,22,0.12)',
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
  if (score >= 87) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 83) return 'A-';
  if (score >= 81) return 'B+';
  if (score >= 79) return 'B';
  if (score >= 77) return 'B-';
  if (score >= 75) return 'C+';
  if (score >= 72) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 60) return 'D';
  if (score >= 50) return 'E';
  return 'F';
}

// Renders a grade string with superscript +/- modifier (JSX only, not SVG)
function GradeText({ grade, style }: { grade: string; style?: React.CSSProperties }) {
  const base = grade[0];
  const mod  = grade.slice(1);
  return (
    <span style={style}>
      {base}
      {mod && <sup style={{ fontSize: '0.65em', lineHeight: 0, verticalAlign: 'super' }}>{mod}</sup>}
    </span>
  );
}

// Linear Y-axis — raw score values used directly, grade boundaries at SCORE_BANDS min values
const SNAPSHOT_COLOR = '#94a3b8';
// A+ visual reference: same gap as B→A (83-77=6), so A+ sits at 83+6=89
const APLUS_Y = 89;
const APLUS_COLOR = '#22c55e';

const TeacherMetricsChart: React.FC<TeacherMetricsChartProps> = ({
  data,
  height = 340,
  compact = false,
  showPhaseBands = true,
  onChartMouseEnter,
  onChartMouseLeave,
  currentScore,
  currentGrade,
  periodAvgColor,
}) => {
  const { t } = useTranslation();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDims, setChartDims] = useState({ width: 0, height: 0 });
  const chartWidth = chartDims.width;
  const chartContainerHeight = chartDims.height;
  const hasData = data.length > 0;

  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const measure = () => {
      const r = el.getBoundingClientRect();
      const w = Math.round(r.width) || el.offsetWidth;
      const h = Math.round(r.height) || el.offsetHeight;
      if (w > 0 && h > 0) {
        setChartDims(prev => (prev.width !== w || prev.height !== h) ? { width: w, height: h } : prev);
      }
    };
    measure();
    const raf = requestAnimationFrame(measure);
    // Retry with escalating delays (Electron file:// timing)
    [100, 300, 600, 1000].forEach(d => timers.push(setTimeout(measure, d)));
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [hasData]);

  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const instanceId = useId().replace(/:/g, '');

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

  // Compute cumulative running average + stamp badge score; clamp all values to APLUS_Y cap
  const transformedData = useMemo(() => {
    const cap = (v: number | null | undefined) => v == null ? null : Math.min(v, APLUS_Y);
    let runningSum = 0;
    return chartData.map((snap, idx) => {
      runningSum += snap.composite_score ?? 0;
      const runningAvg = Math.round((runningSum / (idx + 1)) * 10) / 10;
      return {
        ...snap,
        // Raw values preserved for tooltip display
        composite_score_raw:    snap.composite_score,
        curriculum_score_raw:   snap.curriculum_score,
        performance_score_raw:  snap.performance_score,
        content_score_raw:      snap.content_score,
        attendance_score_raw:   snap.attendance_score,
        achievements_score_raw: snap.achievements_score,
        running_avg_raw:        runningAvg,
        // Capped values used for chart rendering
        composite_score:      cap(snap.composite_score),
        curriculum_score:     cap(snap.curriculum_score),
        performance_score:    cap(snap.performance_score),
        content_score:        cap(snap.content_score),
        attendance_score:     cap(snap.attendance_score),
        achievements_score:   cap(snap.achievements_score),
        running_avg:          cap(runningAvg),
        badge_score:          cap(currentScore ?? null),
      };
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

  // Y-axis ticks: grade boundaries + A+ cap
  const yAxisTicks = [...SCORE_BANDS.map(b => b.min), APLUS_Y];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const snap = payload[0]?.payload;
    if (!snap) return null;
    const snapshotScore = snap.composite_score_raw ?? snap.composite_score ?? 0;
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
          <GradeText grade={getGradeLabel(score)} />
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
            <span className="text-xs font-semibold mt-0.5" style={{ color: badgeColor }}>
              <GradeText grade={badgeGrade} />
            </span>
          </div>
        </div>

        {/* Snapshot + avg rows */}
        <div className="flex flex-col gap-1.5 mb-2">
          <ScoreRow label="Snapshot" score={snapshotScore} color={getGradeColor(snapshotScore)} />
          {snap.running_avg_raw !== undefined && (
            <ScoreRow label="Period avg" score={snap.running_avg_raw} color={getGradeColor(snap.running_avg_raw)} />
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
              const rawKey = entry.dataKey + '_raw';
              const val = Math.round((snap[rawKey] ?? snap[entry.dataKey] ?? 0));
              const gradeColor = getGradeColor(val);
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: entry.color, flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ color: 'var(--dash-text-sub)' }}>{entry.name}</span>
                  <span className="font-semibold ml-auto" style={{ color: 'var(--dash-text)' }}>{val}</span>
                  <span className="font-bold text-[10px] px-1 py-0.5 rounded" style={{ backgroundColor: gradeColor + '22', color: gradeColor, minWidth: '1.4rem', textAlign: 'center' }}><GradeText grade={getGradeLabel(val)} /></span>
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
    if (val === APLUS_Y) {
      return (
        <text x={x} y={y} dy={4} textAnchor="end" fontSize={11} fontWeight={700} fill={APLUS_COLOR}>
          A+
        </text>
      );
    }
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
      className="rounded-2xl pl-1 pr-4 pt-3 pb-3 h-full min-h-0 flex flex-col tmc-root"
      style={{ backgroundColor: 'var(--dash-card-bg)', boxShadow: '0 4px 16px var(--dash-card-shadow)', outline: 'none' }}
    >
      <style>{`.tmc-root *:focus { outline: none !important; }`}</style>
      {!compact && (
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-bold" style={{ color: 'var(--dash-text)' }}>{t('charts.teachingEffectiveness')}</h3>
        </div>
      )}

      <div
        ref={chartContainerRef}
        className="flex-1 min-h-0"
        style={{ width: '100%', minHeight: 200, outline: 'none', overflow: 'hidden' }}
        onMouseDown={e => e.preventDefault()}
        onMouseEnter={onChartMouseEnter}
        onMouseLeave={onChartMouseLeave}
      >
        {chartWidth > 0 && (
          <AreaChart width={chartWidth} height={chartContainerHeight || height} data={transformedData} margin={{ top: 8, right: 8, left: -8, bottom: 4 }}>
            <defs>
              <linearGradient id={`${instanceId}_avgGrad`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={avgColor} stopOpacity={0.45} />
                <stop offset="95%" stopColor={avgColor} stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id={`${instanceId}_badgeGrad`} x1="0" y1="0" x2="0" y2="1">
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

            {/* Grade boundary dashed lines */}
            {SCORE_BANDS.slice(1).map((band, i) => (
              <ReferenceLine
                key={`grade-line-${i}`}
                y={band.min}
                stroke={band.color}
                strokeDasharray="5 5"
                strokeOpacity={0.5}
              />
            ))}
            {/* A+ cap line — same gap above A as B→A */}
            <ReferenceLine
              y={APLUS_Y}
              stroke={APLUS_COLOR}
              strokeDasharray="5 5"
              strokeOpacity={0.5}
            />

            <XAxis
              dataKey="computed_at"
              tickFormatter={(v: string) => { try { return format(parseISO(v), 'MMM d'); } catch { return v; } }}
              tick={{ fontSize: 11, fill: 'var(--dash-axis-tick)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, APLUS_Y]}
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
              strokeWidth={3}
              fill={`url(#${instanceId}_badgeGrad)`}
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
              strokeWidth={3}
              fill={`url(#${instanceId}_avgGrad)`}
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
