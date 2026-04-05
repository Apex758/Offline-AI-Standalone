import React from 'react';
import type { CurrentPhaseInfo } from '../hooks/useCurrentPhase';

interface PhaseContextBannerProps {
  phase: CurrentPhaseInfo;
  onClear: () => void;
}

const PhaseContextBanner: React.FC<PhaseContextBannerProps> = ({ phase, onClear }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 20px',
      background: `${phase.color}10`,
      borderBottom: `1px solid ${phase.color}30`,
      fontSize: 12,
      fontWeight: 600,
      color: phase.color,
      flexShrink: 0,
    }}
  >
    <span style={{ width: 5, height: 5, borderRadius: '50%', background: phase.color, flexShrink: 0 }} />
    Viewing: {phase.phase_label} ({new Date(phase.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – {new Date(phase.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})
    <button
      onClick={onClear}
      style={{
        marginLeft: 'auto',
        fontSize: 11,
        color: 'var(--text-secondary, #6b7280)',
        background: 'none',
        border: '1px solid var(--border-color, #e5e7eb)',
        borderRadius: 4,
        padding: '2px 8px',
        cursor: 'pointer',
      }}
    >
      Clear
    </button>
  </div>
);

export default PhaseContextBanner;
