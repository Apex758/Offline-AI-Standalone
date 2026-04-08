import React, { useState, useEffect, useCallback } from 'react';

const PRESET_MATERIALS = [
  'Whiteboard',
  'Chalkboard',
  'Printer',
  'Chart paper',
  'Colored markers',
  'Rulers and measuring tools',
  'Scissors and glue',
  'Textbooks',
  'Flashcards',
  'Math manipulatives',
  'Construction paper',
];

const PRESET_LABELS: Record<string, string> = {
  'Whiteboard': 'Whiteboard',
  'Chalkboard': 'Chalkboard',
  'Printer': 'Printer',
  'Chart paper': 'Chart Paper',
  'Colored markers': 'Colored Markers',
  'Rulers and measuring tools': 'Rulers / Measuring Tools',
  'Scissors and glue': 'Scissors & Glue',
  'Textbooks': 'Textbooks',
  'Flashcards': 'Flashcards',
  'Math manipulatives': 'Math Manipulatives',
  'Construction paper': 'Construction Paper',
};

interface MaterialsSelectorProps {
  value: string;
  onChange: (val: string) => void;
  tabColor?: string;
}

function parseValue(value: string): { selected: Set<string>; other: string } {
  if (!value || !value.trim()) {
    return { selected: new Set(['Whiteboard']), other: '' };
  }
  const parts = value.split(',').map(p => p.trim()).filter(Boolean);
  const selected = new Set<string>();
  const otherParts: string[] = [];
  for (const part of parts) {
    if (PRESET_MATERIALS.includes(part)) {
      selected.add(part);
    } else {
      otherParts.push(part);
    }
  }
  if (selected.size === 0 && otherParts.length === 0) {
    selected.add('Whiteboard');
  }
  return { selected, other: otherParts.join(', ') };
}

function composeValue(selected: Set<string>, other: string): string {
  const parts = Array.from(selected);
  if (other.trim()) parts.push(other.trim());
  return parts.join(', ');
}

export function MaterialsSelector({ value, onChange, tabColor = '#4f46e5' }: MaterialsSelectorProps) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(() => parseValue(value).selected);
  const [otherText, setOtherText] = useState(() => parseValue(value).other);

  // Initialize with default if empty
  useEffect(() => {
    if (!value || !value.trim()) {
      const defaultSet = new Set(['Whiteboard']);
      setSelected(defaultSet);
      onChange('Whiteboard');
    } else {
      const parsed = parseValue(value);
      setSelected(parsed.selected);
      setOtherText(parsed.other);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleChip = useCallback((material: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(material)) {
        next.delete(material);
      } else {
        next.add(material);
      }
      // Defer onChange to avoid setState-during-render warning
      queueMicrotask(() => onChange(composeValue(next, otherText)));
      return next;
    });
  }, [otherText, onChange]);

  const handleOtherChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newOther = e.target.value;
    setOtherText(newOther);
    onChange(composeValue(selected, newOther));
  }, [selected, onChange]);

  const selectedLabels = Array.from(selected).map(s => PRESET_LABELS[s] || s);
  const summaryText = [
    ...selectedLabels,
    ...(otherText.trim() ? [otherText.trim()] : []),
  ].join(', ') || 'Whiteboard (default)';

  return (
    <div>
      <label className="block text-sm font-medium text-theme-label mb-2">
        Materials
      </label>

      {/* Collapsed state */}
      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="w-full flex items-center justify-between px-4 py-2 border border-theme-strong rounded-lg text-sm text-theme-label hover:bg-theme-subtle transition-colors text-left"
          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
        >
          <span className="truncate text-theme-muted">{summaryText}</span>
          <span className="ml-2 text-theme-muted text-xs flex-shrink-0">&#9660; expand</span>
        </button>
      )}

      {/* Expanded state */}
      {expanded && (
        <div className="border border-theme-strong rounded-lg p-3 space-y-3">
          {/* Collapse button */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-theme-hint">Tap to select available materials</p>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-xs text-theme-muted hover:text-theme-label transition-colors"
            >
              &#9650; collapse
            </button>
          </div>

          {/* Chip grid */}
          <div className="flex flex-wrap gap-2">
            {PRESET_MATERIALS.map(material => {
              const active = selected.has(material);
              return (
                <button
                  key={material}
                  type="button"
                  onClick={() => handleToggleChip(material)}
                  className="px-3 py-1.5 rounded-lg border-2 transition-all text-xs font-medium"
                  style={{
                    borderColor: active ? tabColor : 'var(--border-color, #555)',
                    background: active ? `${tabColor}18` : 'transparent',
                    color: active ? tabColor : undefined,
                  }}
                >
                  {PRESET_LABELS[material]}
                </button>
              );
            })}
          </div>

          {/* Other text field */}
          <div>
            <label className="block text-xs text-theme-hint mb-1">Other (optional)</label>
            <input
              type="text"
              value={otherText}
              onChange={handleOtherChange}
              placeholder="e.g. Globe, Science kit, Exercise books"
              className="w-full px-3 py-2 text-sm border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent bg-transparent text-theme-label placeholder:text-theme-muted"
              style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MaterialsSelector;
