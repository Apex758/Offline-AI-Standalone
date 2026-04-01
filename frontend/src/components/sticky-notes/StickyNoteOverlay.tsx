import React, { useRef, useCallback } from 'react';
import { useStickyNotes } from '../../contexts/StickyNoteContext';
import { StickyNote } from './StickyNote';
import { StickyNoteGroup } from './StickyNoteGroup';

interface Props {
  activeTabId: string | null;
  onNavigateAction?: (action: { toolType: string; settingsSection?: string }) => void;
}

export const StickyNoteOverlay: React.FC<Props> = ({ activeTabId, onNavigateAction }) => {
  const { notes, openNoteIds, groups, zOrder, createGroup, addNoteToGroup } = useStickyNotes();

  // Track which element is being hovered over during drag (note or group)
  const hoverTargetRef = useRef<{ id: string; type: 'note' | 'group' } | null>(null);

  const handleDragOverNote = useCallback((_draggedId: string, targetId: string) => {
    if (!targetId) {
      hoverTargetRef.current = null;
      return;
    }
    // Check if target is a group or a note
    const isGroup = groups.some(g => g.id === targetId);
    hoverTargetRef.current = { id: targetId, type: isGroup ? 'group' : 'note' };
  }, [groups]);

  const handleDragEndNote = useCallback((draggedId: string) => {
    const target = hoverTargetRef.current;
    hoverTargetRef.current = null;
    if (!target || target.id === draggedId) return;

    if (target.type === 'group') {
      addNoteToGroup(target.id, draggedId);
    } else {
      createGroup(draggedId, target.id);
    }
  }, [createGroup, addNoteToGroup]);

  // Filter visible notes: open + (pinned OR belongs to current tab) + not in a group
  const visibleNotes = notes.filter(n => {
    if (n.groupId) return false;
    if (!openNoteIds.includes(n.id)) return false;
    if (n.pinned) return true;
    return n.tabId === activeTabId;
  });

  // Filter visible groups
  const visibleGroups = groups.filter(g => {
    if (g.pinned) return true;
    const groupNotes = notes.filter(n => g.noteIds.includes(n.id));
    return groupNotes.some(n => n.pinned || n.tabId === activeTabId);
  });

  if (visibleNotes.length === 0 && visibleGroups.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: 900 }}>
      <div className="pointer-events-auto">
        {visibleNotes.map(note => {
          const zi = zOrder.indexOf(note.id);
          return (
            <StickyNote
              key={note.id}
              note={note}
              zIndex={901 + zi}
              activeTabId={activeTabId}
              onDragOverNote={handleDragOverNote}
              onDragEndNote={handleDragEndNote}
            />
          );
        })}

        {visibleGroups.map(group => {
          const zi = zOrder.indexOf(group.id);
          return (
            <StickyNoteGroup
              key={group.id}
              group={group}
              zIndex={901 + zi}
              activeTabId={activeTabId}
              onNavigateAction={onNavigateAction}
            />
          );
        })}
      </div>
    </div>
  );
};
