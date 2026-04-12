import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import { StickyChecklistItem } from '../../contexts/StickyNoteContext';

interface Props {
  checklist: StickyChecklistItem[];
  onToggle: (itemId: string) => void;
  onNavigate?: (action: { toolType: string; settingsSection?: string }) => void;
}

export const StickyNoteChecklist: React.FC<Props> = ({ checklist, onToggle, onNavigate }) => {
  return (
    <div className="no-drag p-2 space-y-1">
      {checklist.map((item, i) => (
        <label
          key={item.id}
          className="flex items-start gap-2 text-xs cursor-pointer group rounded px-1 py-0.5 hover:bg-black/5"
        >
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => onToggle(item.id)}
            className="mt-0.5 rounded accent-green-600"
          />
          <span
            className="flex-1"
            style={{
              textDecoration: item.completed ? 'line-through' : 'none',
              opacity: item.completed ? 0.5 : 1,
              color: 'var(--text-heading)',
            }}
          >
            <span className="font-semibold text-green-700 mr-1">{i + 1}.</span>
            {item.text}
          </span>
          {item.action && onNavigate && (
            <button
              className="opacity-0 group-hover:opacity-100 text-green-600 hover:text-green-800 px-1 transition-opacity flex items-center"
              title={`Go to ${item.action.toolType}`}
              onClick={(e) => { e.preventDefault(); onNavigate(item.action!); }}
            >
              <HugeiconsIcon icon={ArrowRight01IconData} size={12} />
            </button>
          )}
        </label>
      ))}
    </div>
  );
};
