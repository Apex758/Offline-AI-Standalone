import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import type { PhaseHistoryEntry, AcademicPhaseSummary } from '../types/insights';

interface Props {
  entry: PhaseHistoryEntry;
  teacherId: string;
  onClose: () => void;
}

const DIMENSION_LABELS: Record<string, string> = {
  curriculum:   'Curriculum',
  performance:  'Performance',
  content:      'Content',
  attendance:   'Attendance',
  achievements: 'Achievements',
};

const DIMENSION_COLORS: Record<string, string> = {
  curriculum:   '#3b82f6',
  performance:  '#22c55e',
  content:      '#a855f7',
  attendance:   '#f97316',
  achievements: '#eab308',
};

function scoreToGrade(score: number): string {
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

function gradeColor(score: number): string {
  if (score >= 90) return '#22c55e';
  if (score >= 80) return '#3b82f6';
  if (score >= 70) return '#eab308';
  if (score >= 60) return '#f97316';
  return '#ef4444';
}

function fmtDate(s: string) {
  try { return format(parseISO(s), 'MMM d, yyyy'); } catch { return s; }
}

function fmtShort(s: string) {
  try { return format(parseISO(s), 'MMM d'); } catch { return s; }
}

const PhaseBreakdownModal: React.FC<Props> = ({ entry, teacherId, onClose }) => {
  const [summary, setSummary] = useState<AcademicPhaseSummary | null>(entry.phase_summary);
  const [generating, setGenerating] = useState(false);

  const snapshots = entry.snapshots;

  useEffect(() => {
    // Auto-generate summary if there are snapshots but no summary yet
    if (snapshots.length > 0 && !summary) {
      generateSummary();
    }
  }, []);

  const generateSummary = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(
        `/api/teacher-metrics/phase-summary/${entry.phase_key}?teacher_id=${teacherId}`
      );
      setSummary(res.data.summary);
    } catch {
      // summary stays null, show computed stats only
    } finally {
      setGenerating(false);
    }
  };

  const avgScore = summary?.avg_composite
    ?? (snapshots.length > 0
      ? snapshots.reduce((s, n) => s + n.composite_score, 0) / snapshots.length
      : 0);
  const peakScore = summary?.peak_composite
    ?? (snapshots.length > 0 ? Math.max(...snapshots.map(s => s.composite_score)) : 0);
  const lowScore = summary?.low_composite
    ?? (snapshots.length > 0 ? Math.min(...snapshots.map(s => s.composite_score)) : 0);

  const chartData = snapshots.map(s => ({
    date: s.computed_at,
    score: s.composite_score,
    dateFormatted: fmtShort(s.computed_at),
  }));

  const dimKeys = ['curriculum', 'performance', 'content', 'attendance', 'achievements'];
  const dimDeltas = summary?.dimension_deltas ?? (() => {
    if (snapshots.length < 2) return {};
    const first = snapshots[0];
    const last = snapshots[snapshots.length - 1];
    return {
      curriculum:   Math.round(((last.curriculum_score ?? 0) - (first.curriculum_score ?? 0)) * 10) / 10,
      performance:  Math.round(((last.performance_score ?? 0) - (first.performance_score ?? 0)) * 10) / 10,
      content:      Math.round(((last.content_score ?? 0) - (first.content_score ?? 0)) * 10) / 10,
      attendance:   Math.round(((last.attendance_score ?? 0) - (first.attendance_score ?? 0)) * 10) / 10,
      achievements: Math.round(((last.achievements_score ?? 0) - (first.achievements_score ?? 0)) * 10) / 10,
    };
  })();

  const scoreKey: Record<string, keyof typeof snapshots[0]> = {
    curriculum:   'curriculum_score',
    performance:  'performance_score',
    content:      'content_score',
    attendance:   'attendance_score',
    achievements: 'achievements_score',
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 110,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: 'var(--dash-card-bg)',
        borderRadius: 16,
        padding: 28,
        width: 600,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        border: '1px solid var(--dash-border)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            {entry.semester && (
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--dash-text-sub)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                {entry.semester}
              </p>
            )}
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--dash-text)' }}>
              {entry.phase_label}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--dash-text-sub)' }}>
              {fmtDate(entry.start_date)} — {fmtDate(entry.end_date)}
              {' · '}{snapshots.length} report{snapshots.length !== 1 ? 's' : ''} logged
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 20, color: 'var(--dash-text-sub)', lineHeight: 1, padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {snapshots.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--dash-text-sub)', textAlign: 'center', padding: '24px 0' }}>
            No reports were logged during this phase.
          </p>
        ) : (
          <>
            {/* Score summary row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Average', score: avgScore },
                { label: 'Peak', score: peakScore },
                { label: 'Lowest', score: lowScore },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '12px 14px', borderRadius: 10,
                  backgroundColor: 'var(--dash-bg)',
                  border: '1px solid var(--dash-border)',
                  textAlign: 'center',
                }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: 'var(--dash-text-sub)', fontWeight: 600 }}>{item.label}</p>
                  <span style={{ fontSize: 22, fontWeight: 800, color: gradeColor(item.score) }}>
                    {scoreToGrade(Math.round(item.score))}
                  </span>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--dash-text-sub)' }}>
                    {Math.round(item.score * 10) / 10}
                  </p>
                </div>
              ))}
            </div>

            {/* Trend chart */}
            {chartData.length > 1 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--dash-text-sub)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Score Progression
                </p>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="pbGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradeColor(avgScore)} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={gradeColor(avgScore)} stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-border)" vertical={false} />
                    <XAxis dataKey="dateFormatted" tick={{ fontSize: 10, fill: 'var(--dash-text-sub)' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--dash-text-sub)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      content={({ active, payload }: any) => {
                        if (!active || !payload?.length) return null;
                        const snap = payload[0]?.payload;
                        return (
                          <div style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-border)', borderRadius: 8, padding: '6px 10px', fontSize: 12 }}>
                            <p style={{ margin: 0, color: 'var(--dash-text-sub)' }}>{snap.dateFormatted}</p>
                            <p style={{ margin: 0, fontWeight: 700, color: gradeColor(snap.score) }}>{scoreToGrade(snap.score)} ({snap.score})</p>
                          </div>
                        );
                      }}
                    />
                    <Area type="monotone" dataKey="score" stroke={gradeColor(avgScore)} strokeWidth={2} fill="url(#pbGrad)" dot={{ r: 3, fill: gradeColor(avgScore), strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Dimension deltas */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--dash-text-sub)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Dimension Progress (Start → End)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dimKeys.map(dk => {
                  const delta = dimDeltas[dk] ?? 0;
                  const sk = scoreKey[dk];
                  const lastScore = snapshots.length > 0 ? (snapshots[snapshots.length - 1][sk] as number) ?? 0 : 0;
                  const firstScore = snapshots.length > 0 ? (snapshots[0][sk] as number) ?? 0 : 0;
                  const color = DIMENSION_COLORS[dk];
                  const deltaColor = delta > 0 ? '#22c55e' : delta < 0 ? '#ef4444' : 'var(--dash-text-sub)';

                  return (
                    <div key={dk} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px', borderRadius: 8,
                      backgroundColor: 'var(--dash-bg)',
                      border: '1px solid var(--dash-border)',
                    }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text)', flex: 1 }}>
                        {DIMENSION_LABELS[dk]}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--dash-text-sub)' }}>
                        {Math.round(firstScore)} → {Math.round(lastScore)}
                      </span>
                      <span style={{
                        fontSize: 12, fontWeight: 700, color: deltaColor,
                        minWidth: 36, textAlign: 'right',
                      }}>
                        {delta > 0 ? '+' : ''}{delta}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Narrative */}
            {summary?.narrative && (
              <div style={{
                padding: '14px 16px', borderRadius: 10,
                backgroundColor: 'rgba(59,130,246,0.06)',
                border: '1px solid rgba(59,130,246,0.2)',
                marginBottom: 16,
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Phase Summary
                </p>
                <p style={{ fontSize: 13, color: 'var(--dash-text)', lineHeight: 1.6, margin: 0 }}>
                  {summary.narrative}
                </p>
              </div>
            )}

            {generating && (
              <p style={{ fontSize: 12, color: 'var(--dash-text-sub)', textAlign: 'center' }}>
                Generating phase summary…
              </p>
            )}

            {/* Snapshot list */}
            {snapshots.length > 0 && (
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--dash-text-sub)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  All Reports ({snapshots.length})
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {snapshots.map((snap, i) => (
                    <div key={snap.id || i} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '6px 10px', borderRadius: 7,
                      backgroundColor: 'var(--dash-bg)',
                    }}>
                      <span style={{ fontSize: 11, color: 'var(--dash-text-sub)', minWidth: 56 }}>
                        {fmtShort(snap.computed_at)}
                      </span>
                      <span style={{
                        fontSize: 13, fontWeight: 700,
                        color: gradeColor(snap.composite_score),
                      }}>
                        {scoreToGrade(snap.composite_score)}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--dash-text-sub)' }}>
                        {snap.composite_score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PhaseBreakdownModal;
