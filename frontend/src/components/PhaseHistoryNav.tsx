import React from 'react';
import { useTranslation } from 'react-i18next';
import { format, parseISO, isAfter } from 'date-fns';
import type { PhaseHistoryEntry } from '../types/insights';

interface Props {
  phases: PhaseHistoryEntry[];
  selectedPhaseKey: string | null;
  onSelectPhase: (phaseKey: string | null) => void;
  onViewBreakdown: (entry: PhaseHistoryEntry) => void;
}

const SEMESTER_COLORS: Record<string, string> = {
  'Semester 1': '#3b82f6',
  'Semester 2': '#22c55e',
};

const PHASE_TYPE_COLORS: Record<string, string> = {
  midterm_1:            '#f97316',
  midterm_2:            '#f97316',
  midterm_1_prep:       '#fbbf24',
  midterm_2_prep:       '#fbbf24',
  inter_semester_break: '#eab308',
  end_of_year_exam:     '#ef4444',
};

function phaseColor(phaseKey: string, semester: string | null): string {
  if (PHASE_TYPE_COLORS[phaseKey]) return PHASE_TYPE_COLORS[phaseKey];
  if (semester) return SEMESTER_COLORS[semester] || '#6b7280';
  return '#6b7280';
}

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
  try { return format(parseISO(s), 'MMM d'); } catch { return s; }
}

function phaseStatus(entry: PhaseHistoryEntry): 'completed' | 'current' | 'upcoming' {
  const today = new Date();
  const start = parseISO(entry.start_date);
  const end = parseISO(entry.end_date);
  if (isAfter(start, today)) return 'upcoming';
  if (isAfter(end, today)) return 'current';
  return 'completed';
}

const PhaseHistoryNav: React.FC<Props> = ({ phases, selectedPhaseKey, onSelectPhase, onViewBreakdown }) => {
  const { t } = useTranslation();
  if (!phases.length) {
    return (
      <div style={{ padding: '16px 12px' }}>
        <p style={{ fontSize: 12, color: 'var(--dash-text-sub)', textAlign: 'center' }}>
          {t('phases.noPhases')}
        </p>
      </div>
    );
  }

  // Group by semester
  const grouped: { semester: string | null; entries: PhaseHistoryEntry[] }[] = [];
  for (const entry of phases) {
    const last = grouped[grouped.length - 1];
    if (last && last.semester === entry.semester) {
      last.entries.push(entry);
    } else {
      grouped.push({ semester: entry.semester, entries: [entry] });
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, userSelect: 'none' }}>
      {grouped.map((group, gi) => (
        <div key={gi} style={{ marginBottom: 6 }}>
          {/* Semester header */}
          {group.semester && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 8px',
              marginBottom: 3,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                backgroundColor: SEMESTER_COLORS[group.semester] || '#6b7280',
              }} />
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: SEMESTER_COLORS[group.semester] || 'var(--dash-text-sub)',
              }}>
                {group.semester}
              </span>
            </div>
          )}
          {!group.semester && (
            <div style={{ padding: '5px 8px', marginBottom: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--dash-text-sub)' }}>
                {t('phases.break')}
              </span>
            </div>
          )}

          {/* Phase entries */}
          {group.entries.map(entry => {
            const status = phaseStatus(entry);
            const isSelected = selectedPhaseKey === entry.phase_key;
            const color = phaseColor(entry.phase_key, entry.semester);
            const avgScore = entry.phase_summary?.avg_composite
              ?? (entry.snapshots.length > 0
                ? entry.snapshots.reduce((s, n) => s + n.composite_score, 0) / entry.snapshots.length
                : null);

            return (
              <div
                key={entry.phase_key}
                onClick={() => onSelectPhase(isSelected ? null : entry.phase_key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 10px',
                  borderRadius: 8,
                  cursor: status !== 'upcoming' ? 'pointer' : 'default',
                  backgroundColor: isSelected ? color + '14' : 'transparent',
                  border: `1px solid ${isSelected ? color + '40' : 'transparent'}`,
                  transition: 'all 0.12s',
                  opacity: status === 'upcoming' ? 0.5 : 1,
                }}
              >
                {/* Color dot with status ring */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%', display: 'block',
                    backgroundColor: status === 'current' ? color : status === 'completed' ? color : 'var(--dash-border)',
                  }} />
                  {status === 'current' && (
                    <span style={{
                      position: 'absolute', inset: -3,
                      borderRadius: '50%', border: `1.5px solid ${color}`,
                      animation: 'pulse 2s infinite',
                    }} />
                  )}
                </div>

                {/* Phase label + date range */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: 0, fontSize: 12, fontWeight: isSelected || status === 'current' ? 700 : 500,
                    color: isSelected || status === 'current' ? 'var(--dash-text)' : 'var(--dash-text-sub)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {entry.phase_label}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, color: 'var(--dash-text-sub)' }}>
                    {fmtDate(entry.start_date)} → {fmtDate(entry.end_date)}
                  </p>
                </div>

                {/* Score badge (completed phases) */}
                {status === 'completed' && avgScore !== null && (
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: gradeColor(avgScore),
                    backgroundColor: gradeColor(avgScore) + '1a',
                    padding: '2px 6px', borderRadius: 5,
                    flexShrink: 0,
                  }}>
                    {scoreToGrade(avgScore)}
                  </span>
                )}

                {/* Current badge */}
                {status === 'current' && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: color,
                    backgroundColor: color + '1a',
                    padding: '2px 6px', borderRadius: 5, flexShrink: 0,
                  }}>
                    {t('phases.now')}
                  </span>
                )}

                {/* View breakdown button for completed phases */}
                {status === 'completed' && isSelected && entry.snapshots.length > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onViewBreakdown(entry); }}
                    style={{
                      fontSize: 10, fontWeight: 700, color: 'white',
                      backgroundColor: color,
                      padding: '3px 8px', borderRadius: 5,
                      border: 'none', cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    {t('phases.details')}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default PhaseHistoryNav;
