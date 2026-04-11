// Compact banner shown at the top of a generator when a class is active and
// has stored defaults. Summarizes which fields were auto-filled and offers an
// "Override" toggle that reveals the otherwise-collapsed inputs.
//
// Usage:
//   const [overrideOpen, setOverrideOpen] = useState(false);
//   <ClassDefaultsBanner
//     classLabel="Grade 4 Blue"
//     filledFieldLabels={['Subject', 'Strand', 'Learning Styles', ...]}
//     overrideOpen={overrideOpen}
//     onToggleOverride={() => setOverrideOpen(v => !v)}
//     accentColor={tabColor}
//   />
//
// When no class is active, render nothing (the parent checks `hasConfig`).

import React from 'react';

interface ClassDefaultsBannerProps {
  classLabel: string;
  filledFieldLabels: string[];
  overrideOpen: boolean;
  onToggleOverride: () => void;
  accentColor?: string;
}

const ClassDefaultsBanner: React.FC<ClassDefaultsBannerProps> = ({
  classLabel,
  filledFieldLabels,
  overrideOpen,
  onToggleOverride,
  accentColor = '#4f46e5',
}) => {
  const count = filledFieldLabels.length;
  if (count === 0) return null;

  const preview = filledFieldLabels.slice(0, 4).join(' • ');
  const extra = count > 4 ? ` • +${count - 4} more` : '';

  return (
    <div
      className="rounded-xl p-3 border flex items-center justify-between gap-3"
      style={{
        borderColor: accentColor,
        backgroundColor: `${accentColor}12`,
      }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div
          className="flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold shrink-0 mt-0.5"
          style={{ backgroundColor: accentColor }}
          aria-hidden
        >
          [OK]
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-theme-heading truncate">
            Using class: {classLabel}
          </div>
          <div className="text-xs text-theme-muted truncate">
            {count} field{count === 1 ? '' : 's'} auto-filled — {preview}
            {extra}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggleOverride}
        className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition hover:bg-theme-subtle"
        style={{ borderColor: accentColor, color: accentColor }}
      >
        {overrideOpen ? 'Hide overrides' : 'Override'}
      </button>
    </div>
  );
};

export default ClassDefaultsBanner;
