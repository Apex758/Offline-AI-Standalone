import React, { useEffect, useRef } from 'react';
import type { SchoolPhase } from '../../types/insights';

const PHASE_ORDER: SchoolPhase[] = [
  'start_of_year', 'early_year', 'mid_year', 'pre_exam',
  'exam_period', 'post_exam', 'vacation', 'reopening',
];

const PHASE_COLORS_SOLID: Record<SchoolPhase, string> = {
  start_of_year: '#3b82f6',
  early_year:    '#22c55e',
  mid_year:      '#6b7280',
  pre_exam:      '#f97316',
  exam_period:   '#ef4444',
  post_exam:     '#a855f7',
  vacation:      '#eab308',
  reopening:     '#06b6d4',
};

const PHASE_LABELS: Record<SchoolPhase, string> = {
  start_of_year: 'Start',
  early_year:    'Early',
  mid_year:      'Mid',
  pre_exam:      'Pre-Exam',
  exam_period:   'Exam',
  post_exam:     'Post-Exam',
  vacation:      'Vacation',
  reopening:     'Reopen',
};

interface YearPhasePopoverProps {
  currentPhase: SchoolPhase;
  onClose: () => void;
  /** top/left relative to the chart container */
  anchorTop: number;
  anchorLeft: number;
}

const YearPhasePopover: React.FC<YearPhasePopoverProps> = ({
  currentPhase,
  onClose,
  anchorTop,
  anchorLeft,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-50 rounded-xl shadow-xl border border-theme-border p-3"
      style={{
        top: anchorTop,
        left: anchorLeft + 8,
        backgroundColor: 'var(--dash-card-bg)',
        minWidth: 300,
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider mb-3"
        style={{ color: 'var(--dash-text-sub)' }}>
        School Year Phases
      </p>

      {/* Mini year bar */}
      <div className="flex rounded-lg overflow-hidden h-5 mb-2">
        {PHASE_ORDER.map(phase => (
          <div
            key={phase}
            className="flex-1 transition-opacity"
            style={{
              backgroundColor: PHASE_COLORS_SOLID[phase],
              opacity: phase === currentPhase ? 1 : 0.25,
            }}
          />
        ))}
      </div>

      {/* Phase labels below bar */}
      <div className="flex">
        {PHASE_ORDER.map(phase => {
          const isCurrent = phase === currentPhase;
          return (
            <div
              key={phase}
              className="flex-1 flex flex-col items-center"
              style={{ minWidth: 0 }}
            >
              {isCurrent && (
                <div
                  className="w-1 h-1 rounded-full mb-0.5"
                  style={{ backgroundColor: PHASE_COLORS_SOLID[phase] }}
                />
              )}
              <span
                className="text-center leading-tight"
                style={{
                  fontSize: 8,
                  fontWeight: isCurrent ? 700 : 400,
                  color: isCurrent ? PHASE_COLORS_SOLID[phase] : 'var(--dash-text-sub)',
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
    </div>
  );
};

export default YearPhasePopover;
