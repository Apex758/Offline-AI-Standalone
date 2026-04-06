import React, { useEffect, useRef } from 'react';
import type { SchoolPhase } from '../../types/insights';

const GENERIC_PHASE_ORDER: SchoolPhase[] = [
  'start_of_year', 'early_year', 'mid_year', 'pre_exam',
  'exam_period', 'post_exam', 'vacation', 'reopening',
];

const CARIBBEAN_PHASE_ORDER: SchoolPhase[] = [
  'term_1_early', 'term_1_midterm_prep', 'term_1_midterm', 'term_1_late',
  'christmas_break',
  'term_2_early', 'term_2_midterm_prep', 'term_2_midterm', 'term_2_late',
  'easter_break',
  'term_3_early', 'term_3_late', 'end_of_year_exam',
  'summer_vacation',
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
  term_1_early:         'T1 Early',
  term_1_midterm_prep:  'T1 MT Prep',
  term_1_midterm:       'T1 Mid-Term',
  term_1_late:          'T1 Late',
  christmas_break:      'Christmas',
  term_2_early:         'T2 Early',
  term_2_midterm_prep:  'T2 MT Prep',
  term_2_midterm:       'T2 Mid-Term',
  term_2_late:          'T2 Late',
  easter_break:         'Easter',
  term_3_early:         'T3 Early',
  term_3_late:          'T3 Late',
  end_of_year_exam:     'Finals',
  summer_vacation:      'Summer',
};


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
    { label: 'Term 1', phases: ['term_1_early', 'term_1_midterm_prep', 'term_1_midterm', 'term_1_late'] },
    { label: null,      phases: ['christmas_break'] },
    { label: 'Term 2', phases: ['term_2_early', 'term_2_midterm_prep', 'term_2_midterm', 'term_2_late'] },
    { label: null,      phases: ['easter_break'] },
    { label: 'Term 3', phases: ['term_3_early', 'term_3_late', 'end_of_year_exam'] },
    { label: null,      phases: ['summer_vacation'] },
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
                      background: PHASE_COLORS_SOLID[phase] || '#6b7280',
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
                  background: PHASE_COLORS_SOLID[phase] || '#6b7280',
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
