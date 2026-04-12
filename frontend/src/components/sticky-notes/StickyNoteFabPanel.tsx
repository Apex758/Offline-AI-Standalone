import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import PinIconData from '@hugeicons/core-free-icons/PinIcon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import FolderOpenIconData from '@hugeicons/core-free-icons/FolderOpenIcon';
import { useStickyNotes } from '../../contexts/StickyNoteContext';

const SIcon: React.FC<{ icon: any; size?: number; style?: React.CSSProperties }> = ({ icon, size = 14, style }) => (
  <HugeiconsIcon icon={icon} size={size} style={style} />
);

interface Props {
  activeTabId: string | null;
  onClose: () => void;
}

const COLOR_OPTIONS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff', '#fed7aa'];

export const StickyNoteFabPanel: React.FC<Props> = ({ activeTabId, onClose }) => {
  const { t } = useTranslation();
  const { notes, openNoteIds, groups, createNote, openNote, deleteNote, dissolveGroup } = useStickyNotes();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Saved notes = all notes NOT currently open
  const savedNotes = notes.filter(n => !openNoteIds.includes(n.id));

  // Split into standalone and grouped
  const standaloneNotes = savedNotes.filter(n => !n.groupId);
  const groupedByGroup = groups.map(g => ({
    group: g,
    notes: savedNotes.filter(n => n.groupId === g.id),
  })).filter(g => g.notes.length > 0);

  const toggleGroupExpand = (gid: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(gid)) next.delete(gid); else next.add(gid);
      return next;
    });
  };

  const handleNewNote = () => {
    createNote({ tabId: activeTabId });
  };

  const handleClearAll = () => {
    savedNotes.forEach(n => deleteNote(n.id));
    setShowClearConfirm(false);
  };

  return (
    <div
      className="fixed bottom-20 right-4 w-72 rounded-xl shadow-2xl overflow-hidden"
      style={{
        zIndex: 1100,
        background: 'var(--bg-surface, #ffffff)',
        border: '1px solid var(--border-default, #e5e7eb)',
        maxHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border-default, #e5e7eb)' }}
      >
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-title, #111827)' }}>
          Sticky Notes
        </h3>
        <button
          className="text-xs px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
          style={{ color: 'var(--text-muted, #6b7280)' }}
          onClick={onClose}
        >
          <SIcon icon={Cancel01IconData} size={12} style={{ color: 'var(--text-muted, #6b7280)' }} />
        </button>
      </div>

      {/* New Note button */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-default, #e5e7eb)' }}>
        <button
          className="w-full py-2 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ background: '#22c55e' }}
          onClick={handleNewNote}
        >
          + New Note
        </button>
      </div>

      {/* Open notes count */}
      {openNoteIds.length > 0 && (
        <div
          className="px-4 py-2 text-xs"
          style={{
            color: 'var(--text-muted, #6b7280)',
            borderBottom: '1px solid var(--border-default, #e5e7eb)',
          }}
        >
          {openNoteIds.length} note{openNoteIds.length !== 1 ? 's' : ''} open
        </div>
      )}

      {/* Saved notes list */}
      <div className="flex-1 overflow-auto">
        {savedNotes.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-xs" style={{ color: 'var(--text-hint, #9ca3af)' }}>
              No saved notes yet. Closed notes will appear here.
            </p>
          </div>
        ) : (
          <div className="py-1">
            {/* Groups with branch tree */}
            {groupedByGroup.map(({ group: g, notes: gNotes }) => {
              const isExpanded = expandedGroups.has(g.id);
              return (
                <div key={g.id}>
                  {/* Group header */}
                  <div
                    className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => toggleGroupExpand(g.id)}
                  >
                    <SIcon icon={FolderOpenIconData} size={14} style={{ color: 'var(--text-muted)' }} />
                    <span className="flex-1 text-xs font-semibold truncate" style={{ color: 'var(--text-title, #111827)' }}>
                      {g.title}
                    </span>
                    <span
                      className="text-xs px-1.5 rounded-full"
                      style={{ background: 'rgba(94,84,117,0.1)', color: 'var(--text-muted)', fontSize: 10 }}
                    >
                      {gNotes.length}
                    </span>
                    <span
                      className="text-xs transition-transform"
                      style={{
                        color: 'var(--text-hint, #9ca3af)',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        display: 'inline-block',
                      }}
                    >
                      &#9656;
                    </span>
                  </div>

                  {/* Branch notes */}
                  {isExpanded && gNotes.map((n, i) => {
                    const isLast = i === gNotes.length - 1;
                    return (
                      <div
                        key={n.id}
                        className="flex items-stretch cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                        onClick={() => { openNote(n.id, activeTabId); onClose(); }}
                      >
                        {/* Branch line */}
                        <div className="flex flex-col items-center ml-6" style={{ width: 20 }}>
                          <div
                            className="w-px flex-1"
                            style={{ background: isLast ? 'transparent' : 'var(--border-default, #e5e7eb)' }}
                          />
                          <div className="flex items-center" style={{ height: 0 }}>
                            <div
                              className="w-px"
                              style={{ height: 20, background: 'var(--border-default, #e5e7eb)' }}
                            />
                          </div>
                          {!isLast && (
                            <div
                              className="w-px flex-1"
                              style={{ background: 'var(--border-default, #e5e7eb)' }}
                            />
                          )}
                        </div>
                        {/* Horizontal branch connector + note */}
                        <div className="flex items-center gap-2 py-2 pr-4 flex-1 min-w-0">
                          <div style={{ width: 10, height: 1, background: 'var(--border-default, #e5e7eb)' }} />
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: n.color || '#fef08a', border: '1px solid rgba(0,0,0,0.1)' }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate" style={{ color: 'var(--text-title, #111827)' }}>
                              {n.title}
                            </p>
                            <p className="text-xs truncate" style={{ color: 'var(--text-hint, #9ca3af)' }}>
                              {n.checklist
                                ? `${n.checklist.filter(c => c.completed).length}/${n.checklist.length} steps`
                                : (n.content || '').replace(/<[^>]*>/g, '').slice(0, 40) || 'Empty note'}
                            </p>
                          </div>
                          <button
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center justify-center"
                            title={t('common.delete')}
                            onClick={e => { e.stopPropagation(); deleteNote(n.id); }}
                          >
                            <SIcon icon={Cancel01IconData} size={10} style={{ color: '#ef4444' }} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Standalone notes */}
            {standaloneNotes.map(n => (
              <div
                key={n.id}
                className="flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                onClick={() => { openNote(n.id, activeTabId); onClose(); }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: n.color || '#fef08a', border: '1px solid rgba(0,0,0,0.1)' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--text-title, #111827)' }}>
                    {n.title}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-hint, #9ca3af)' }}>
                    {n.checklist
                      ? `${n.checklist.filter(c => c.completed).length}/${n.checklist.length} steps`
                      : (n.content || '').replace(/<[^>]*>/g, '').slice(0, 50) || 'Empty note'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {n.pinned && <SIcon icon={PinIconData} size={12} style={{ color: 'var(--text-hint, #9ca3af)' }} />}
                  <button
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center justify-center"
                    title={t('stickyNotes.deletePermanently')}
                    onClick={e => { e.stopPropagation(); deleteNote(n.id); }}
                  >
                    <SIcon icon={Cancel01IconData} size={10} style={{ color: '#ef4444' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {savedNotes.length > 0 && (
        <div
          className="px-4 py-2"
          style={{ borderTop: '1px solid var(--border-default, #e5e7eb)' }}
        >
          {showClearConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--text-muted, #6b7280)' }}>{t('stickyNotes.deleteAllSaved')}</span>
              <button
                className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 transition-colors"
                onClick={handleClearAll}
              >
                Yes
              </button>
              <button
                className="text-xs px-2 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-muted, #6b7280)' }}
                onClick={() => setShowClearConfirm(false)}
              >
                No
              </button>
            </div>
          ) : (
            <button
              className="text-xs hover:underline transition-colors"
              style={{ color: 'var(--text-hint, #9ca3af)' }}
              onClick={() => setShowClearConfirm(true)}
            >
              Clear All Saved
            </button>
          )}
        </div>
      )}
    </div>
  );
};
