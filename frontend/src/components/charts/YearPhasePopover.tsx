import React, { useEffect, useRef } from 'react';
import type { SchoolPhase } from '../../types/insights';

const GENERIC_PHASE_ORDER: SchoolPhase[] = [
  'start_of_year', 'early_year', 'mid_year', 'pre_exam',
  'exam_period', 'post_exam', 'vacation', 'reopening',
];

const CARIBBEAN_PHASE_ORDER: SchoolPhase[] = [
  'semester_1_early', 'midterm_1_prep', 'midterm_1', 'semester_1_late',
  'inter_semester_break',
  'semester_2_early', 'midterm_2_prep', 'midterm_2', 'semester_2_late',
  'end_of_year_exam',
];

const PHASE_COLORS_SOLID: Partial<Record<SchoolPhase, string>> = {
  // Generic
  start_of_year: '#3b82f6',
  early_year:    '#22c55e',
  mid_year:      '#6b7280',
  pre_exam:      '#f97316',
  exam_period:   '#ef4444',
  post_exam:     '#a855f7',
  vacation:      '#eab308',
  reopening:     '#06b6d4',
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

const PHASE_LABELS: Partial<Record<SchoolPhase, string>> = {
  start_of_year: 'Start',
  early_year:    'Early',
  mid_year:      'Mid',
  pre_exam:      'Pre-Exam',
  exam_period:   'Exam',
  post_exam:     'Post-Exam',
  vacation:      'Vacation',
  reopening:     'Reopen',
  // Caribbean
  semester_1_early:     'S1 Early',
  midterm_1_prep:       'MT1 Prep',
  midterm_1:            'Mid-Term 1',
  semester_1_late:      'S1 Late',
  inter_semester_break: 'Break',
  semester_2_early:     'S2 Early',
  midterm_2_prep:       'MT2 Prep',
  midterm_2:            'Mid-Term 2',
  semester_2_late:      'S2 Late',
  end_of_year_exam:     'Finals',
};

// Semester boundary: which phase starts Semester 2?
const SEMESTER_2_START: SchoolPhase = 'semester_2_early';

/** Returns a CSS linear-gradient that blends from the previous phase colour → current → next */
function getSectionGradient(phases: SchoolPhase[], index: number): string {
  const curr = PHASE_COLORS_SOLID[phases[index]] || '#6b7280';
  const prev = index > 0 ? (PHASE_COLORS_SOLID[phases[index - 1]] || '#6b7280') : curr;
  const next = index < phases.length - 1 ? (PHASE_COLORS_SOLID[phases[index + 1]] || '#6b7280') : curr;
  return `linear-gradient(to right, ${prev} 0%, ${curr} 40%, ${curr} 60%, ${next} 100%)`;
}

interface YearPhasePopoverProps {
  currentPhase: SchoolPhase;
  onClose: () => void;
  /** top/left relative to the chart container */
  anchorTop: number;
  anchorLeft: number;
  showPhaseBands: boolean;
  onTogglePhaseBands: () => void;
}

const YearPhasePopover: React.FC<YearPhasePopoverProps> = ({
  currentPhase,
  onClose,
  anchorTop,
  anchorLeft,
  showPhaseBands,
  onTogglePhaseBands,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Detect if this is a Caribbean phase
  const isCaribbean = CARIBBEAN_PHASE_ORDER.includes(currentPhase);
  const phaseOrder = isCaribbean ? CARIBBEAN_PHASE_ORDER : GENERIC_PHASE_ORDER;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  // For Caribbean, split phases into S1, break, S2 rows
  const caribbeanRows: { label: string | null; phases: SchoolPhase[] }[] = [
    { label: 'Semester 1', phases: ['semester_1_early', 'midterm_1_prep', 'midterm_1', 'semester_1_late'] },
    { label: null,         phases: ['inter_semester_break'] },
    { label: 'Semester 2', phases: ['semester_2_early', 'midterm_2_prep', 'midterm_2', 'semester_2_late', 'end_of_year_exam'] },
  ];

  return (
    <div
      ref={ref}
      className="absolute z-50 rounded-xl shadow-xl border border-theme-border p-3"
      style={{
        top: anchorTop,
        left: anchorLeft + 8,
        backgroundColor: 'var(--dash-card-bg)',
        minWidth: isCaribbean ? 340 : 300,
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider mb-3"
        style={{ color: 'var(--dash-text-sub)' }}>
        {isCaribbean ? 'Caribbean Academic Calendar' : 'School Year Phases'}
      </p>

      {isCaribbean ? (
        /* Caribbean: show semester rows */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {caribbeanRows.map((row, ri) => (
            <div key={ri}>
              {row.label && (
                <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--dash-text-sub)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  {row.label}
                </p>
              )}
              <div className="flex rounded-lg overflow-hidden" style={{ height: 16 }}>
                {row.phases.map((phase, idx) => (
                  <div
                    key={phase}
                    className="flex-1 transition-opacity"
                    style={{
                      background: getSectionGradient(row.phases, idx),
                      opacity: phase === currentPhase ? 1 : 0.25,
                    }}
                    title={PHASE_LABELS[phase] || phase}
                  />
                ))}
              </div>
              <div className="flex mt-1">
                {row.phases.map(phase => {
                  const isCurrent = phase === currentPhase;
                  return (
                    <div key={phase} className="flex-1 flex flex-col items-center" style={{ minWidth: 0 }}>
                      {isCurrent && (
                        <div className="w-1 h-1 rounded-full mb-0.5"
                          style={{ backgroundColor: PHASE_COLORS_SOLID[phase] || '#6b7280' }} />
                      )}
                      <span style={{
                        fontSize: 7,
                        fontWeight: isCurrent ? 700 : 400,
                        color: isCurrent ? (PHASE_COLORS_SOLID[phase] || '#6b7280') : 'var(--dash-text-sub)',
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        transform: 'rotate(180deg)',
                        maxHeight: 44,
                        overflow: 'hidden',
                        textAlign: 'center',
                      }}>
                        {PHASE_LABELS[phase] || phase}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Generic: original single row */
        <>
          <div className="flex rounded-lg overflow-hidden h-5 mb-2">
            {phaseOrder.map((phase, idx) => (
              <div
                key={phase}
                className="flex-1 transition-opacity"
                style={{
                  background: getSectionGradient(phaseOrder, idx),
                  opacity: phase === currentPhase ? 1 : 0.25,
                }}
              />
            ))}
          </div>
          <div className="flex">
            {phaseOrder.map(phase => {
              const isCurrent = phase === currentPhase;
              return (
                <div key={phase} className="flex-1 flex flex-col items-center" style={{ minWidth: 0 }}>
                  {isCurrent && (
                    <div className="w-1 h-1 rounded-full mb-0.5"
                      style={{ backgroundColor: PHASE_COLORS_SOLID[phase] || '#6b7280' }} />
                  )}
                  <span
                    className="text-center leading-tight"
                    style={{
                      fontSize: 8,
                      fontWeight: isCurrent ? 700 : 400,
                      color: isCurrent ? (PHASE_COLORS_SOLID[phase] || '#6b7280') : 'var(--dash-text-sub)',
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)',
                      maxHeight: 48,
                      overflow: 'hidden',
                    }}
                  >
                    {PHASE_LABELS[phase]}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Phase bands toggle */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t" style={{ borderColor: 'var(--dash-border)' }}>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--dash-text-sub)' }}>
          Phase colours on graph
        </span>
        <button
          onClick={onTogglePhaseBands}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
          title={showPhaseBands ? 'Hide phase colours' : 'Show phase colours'}
        >
          <span style={{
            width: 30, height: 16, borderRadius: 8, display: 'inline-block', position: 'relative', flexShrink: 0,
            background: showPhaseBands ? '#3b82f6' : 'var(--dash-border, #e2e8f0)',
            transition: 'background 0.2s',
          }}>
            <span style={{
              position: 'absolute', top: 3, width: 10, height: 10, borderRadius: '50%', background: 'white',
              left: showPhaseBands ? 17 : 3,
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default YearPhasePopover;
