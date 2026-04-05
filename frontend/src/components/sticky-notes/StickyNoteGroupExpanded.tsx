import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import ArrowUpRight01IconData from '@hugeicons/core-free-icons/ArrowUpRight01Icon';
import { useStickyNotes, StickyNoteGroup } from '../../contexts/StickyNoteContext';
import { useTranslation } from 'react-i18next';

const SIcon: React.FC<{ icon: any; size?: number; style?: React.CSSProperties }> = ({ icon, size = 14, style }) => (
  <HugeiconsIcon icon={icon} size={size} style={style} />
);

interface Props {
  group: StickyNoteGroup;
  zIndex: number;
  activeTabId: string | null;
  onNavigateAction?: (action: { toolType: string; settingsSection?: string }) => void;
  onClose?: () => void;
  animState?: 'idle' | 'opening' | 'closing';
}

export const StickyNoteGroupExpanded: React.FC<Props> = ({ group, zIndex, activeTabId, onNavigateAction, onClose, animState = 'idle' }) => {
  const { t } = useTranslation();
  const {
    notes, updateGroup, toggleGroupExpanded, dissolveGroup,
    removeNoteFromGroup, openNote, createNote, addNoteToGroup,
  } = useStickyNotes();

  const handleClose = onClose || (() => toggleGroupExpanded(group.id));
  const [showDissolveConfirm, setShowDissolveConfirm] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const groupNotes = notes.filter(n => group.noteIds.includes(n.id));

  // Theme colors matching the folder
  const panelBg = isDark
    ? 'linear-gradient(148deg, #4a2e12 0%, #2e1a08 55%, #1e1204 100%)'
    : 'linear-gradient(148deg, #2a2a3c 0%, #1a1a2a 55%, #121220 100%)';
  const panelGloss = isDark
    ? 'linear-gradient(158deg, rgba(255,200,120,0.1) 0%, rgba(255,200,120,0.03) 30%, transparent 50%)'
    : 'linear-gradient(158deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%)';
  const textPrimary = isDark ? '#f5d5a8' : '#e0dce8';
  const textSecondary = isDark ? '#c49860' : '#b0a8c0';
  const textMuted = isDark ? '#9a7040' : '#7a7898';
  const subtleBg = isDark ? 'rgba(255,200,120,0.06)' : 'rgba(255,255,255,0.05)';
  const subtleBorder = isDark ? 'rgba(255,200,120,0.1)' : 'rgba(255,255,255,0.06)';
  const backdropColor = isDark ? 'rgba(18, 10, 2, 0.6)' : 'rgba(10, 8, 18, 0.55)';

  const handleAddNew = () => {
    const newNote = createNote({ tabId: activeTabId, groupId: group.id });
    addNoteToGroup(group.id, newNote.id);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: zIndex + 1000,
        transition: 'opacity 0.2s ease',
        opacity: animState === 'closing' ? 0 : 1,
      }}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: backdropColor,
          backdropFilter: 'blur(8px)',
          animation: 'sn-fade-in 0.2s ease',
        }}
      />

      {/* Expanded panel — dark folder aesthetic */}
      <div
        className="relative rounded-2xl max-w-lg w-full mx-4 overflow-hidden"
        style={{
          background: panelBg,
          border: `1px solid ${subtleBorder}`,
          maxHeight: '70vh',
          animation: 'sn-scale-in 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          transform: animState === 'closing' ? 'scale(0.9)' : 'scale(1)',
          transition: animState === 'closing' ? 'transform 0.2s ease, opacity 0.2s ease' : 'none',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Gloss */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: panelGloss,
            borderRadius: 'inherit',
          }}
        />

        {/* Header */}
        <div className="relative px-5 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${subtleBorder}` }}>
          {isEditingTitle ? (
            <input
              className="text-sm font-bold bg-transparent border-b outline-none"
              style={{ color: textPrimary, borderColor: subtleBorder }}
              value={group.title}
              autoFocus
              onChange={e => updateGroup(group.id, { title: e.target.value })}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={e => e.key === 'Enter' && setIsEditingTitle(false)}
            />
          ) : (
            <h3
              className="text-sm font-bold cursor-text"
              style={{ color: textPrimary }}
              onDoubleClick={() => setIsEditingTitle(true)}
            >
              {group.title}
              <span className="ml-2 font-normal" style={{ color: textMuted }}>({groupNotes.length} notes)</span>
            </h3>
          )}
          <div className="flex items-center gap-1">
            <button
              className="text-xs px-2.5 py-1 rounded-lg transition-colors"
              style={{ color: textSecondary, background: subtleBg }}
              onClick={() => setShowDissolveConfirm(true)}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Ungroup
            </button>
            <button
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: textSecondary }}
              onClick={handleClose}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <SIcon icon={Cancel01IconData} size={14} style={{ color: textSecondary }} />
            </button>
          </div>
        </div>

        {/* Dissolve confirmation */}
        {showDissolveConfirm && (
          <div className="relative mx-5 mt-3 p-3 rounded-xl" style={{ background: subtleBg, border: `1px solid ${subtleBorder}` }}>
            <p className="text-xs mb-2" style={{ color: textSecondary }}>{t('stickyNotes.ungroupNotes')}</p>
            <div className="flex gap-2">
              <button
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={{ background: subtleBg, color: textPrimary }}
                onClick={() => dissolveGroup(group.id, false)}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Keep notes
              </button>
              <button
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}
                onClick={() => dissolveGroup(group.id, true)}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
              >
                Delete all
              </button>
              <button
                className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{ color: textMuted }}
                onClick={() => setShowDissolveConfirm(false)}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Notes grid */}
        <div className="relative p-5 grid grid-cols-2 gap-3 overflow-auto" style={{ maxHeight: 'calc(70vh - 60px)' }}>
          {groupNotes.map(n => (
            <div
              key={n.id}
              className="rounded-xl p-3 cursor-pointer group relative transition-all"
              style={{
                background: n.color || '#fef08a',
                border: '1px solid rgba(255,255,255,0.4)',
                minHeight: 80,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
              onClick={() => {
                removeNoteFromGroup(group.id, n.id);
                openNote(n.id, activeTabId);
                handleClose();
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'; }}
            >
              <p className="text-xs font-semibold truncate mb-1" style={{ color: '#1a1a1a' }}>
                {n.title}
              </p>
              <p className="text-xs line-clamp-3" style={{ color: 'rgba(0,0,0,0.5)' }}>
                {n.checklist
                  ? `${n.checklist.filter(c => c.completed).length}/${n.checklist.length} steps`
                  : (n.content || '').replace(/<[^>]*>/g, '').slice(0, 60) || 'Empty note'}
              </p>
              <span
                className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-50 transition-opacity"
                title="Open & remove from group"
              >
                <SIcon icon={ArrowUpRight01IconData} size={12} style={{ color: '#1a1a1a' }} />
              </span>
            </div>
          ))}

          {/* Add new note */}
          <button
            className="rounded-xl p-3 flex items-center justify-center transition-colors"
            style={{
              minHeight: 80,
              border: `2px dashed ${subtleBorder}`,
              background: subtleBg,
            }}
            onClick={handleAddNew}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <span className="text-2xl" style={{ color: textMuted }}>+</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes sn-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sn-scale-in { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};
