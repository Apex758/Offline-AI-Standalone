import React, { useState, useEffect } from 'react';
import { DURATION_CHIPS } from '../../data/generatorPresets';

interface DurationPickerProps {
  value: string;
  onChange: (value: string) => void;
  accentColor: string;
  hasError?: boolean;
  placeholder?: string;
  chips?: number[];
}

/**
 * Shared duration picker: row of one-click chips for the most common
 * lesson durations + a free-text fallback for anything else.
 *
 * value/onChange use string to match existing form-state shape across planners.
 */
const DurationPicker: React.FC<DurationPickerProps> = ({
  value,
  onChange,
  accentColor,
  hasError,
  placeholder = 'e.g., 50',
  chips = DURATION_CHIPS,
}) => {
  const numericValue = value?.trim() || '';
  const isChipValue = chips.some(c => String(c) === numericValue);

  // "Other" mode is sticky once the user has opened it, even while empty.
  const [otherMode, setOtherMode] = useState<boolean>(
    !!numericValue && !isChipValue
  );

  // If form is reset externally to a chip value, collapse "Other".
  useEffect(() => {
    if (numericValue && isChipValue) {
      setOtherMode(false);
    }
  }, [numericValue, isChipValue]);

  const handleChipClick = (mins: number) => {
    setOtherMode(false);
    onChange(String(mins));
  };

  const handleOtherClick = () => {
    setOtherMode(true);
    if (isChipValue) {
      // clear so the input becomes editable from scratch
      onChange('');
    }
  };

  return (
    <div
      data-validation-error={hasError ? 'true' : undefined}
      className={`flex flex-wrap items-center gap-2 ${hasError ? 'validation-error rounded-lg p-1' : ''}`}
    >
      {chips.map(mins => {
        const selected = !otherMode && String(mins) === numericValue;
        return (
          <button
            type="button"
            key={mins}
            onClick={() => handleChipClick(mins)}
            className="px-3 py-1.5 text-sm rounded-full border transition"
            style={
              selected
                ? {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                    color: '#fff',
                  }
                : {
                    backgroundColor: 'transparent',
                    borderColor: 'var(--theme-strong, #d1d5db)',
                    color: 'var(--theme-label, #374151)',
                  }
            }
          >
            {mins} min
          </button>
        );
      })}

      <button
        type="button"
        onClick={handleOtherClick}
        className="px-3 py-1.5 text-sm rounded-full border transition"
        style={
          otherMode
            ? {
                backgroundColor: accentColor,
                borderColor: accentColor,
                color: '#fff',
              }
            : {
                backgroundColor: 'transparent',
                borderColor: 'var(--theme-strong, #d1d5db)',
                color: 'var(--theme-label, #374151)',
              }
        }
      >
        Other
      </button>

      {otherMode && (
        <input
          type="number"
          value={numericValue}
          onChange={e => onChange(e.target.value)}
          min={1}
          max={300}
          placeholder={placeholder}
          autoFocus
          className="ml-1 w-24 px-3 py-1.5 text-sm border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
        />
      )}
    </div>
  );
};

export default DurationPicker;
