import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface StickyChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  action?: { toolType: string; settingsSection?: string };
}

export interface StickyNote {
  id: string;
  title: string;
  content: string;
  checklist?: StickyChecklistItem[];
  color?: string;
  pinned: boolean;
  tabId: string | null;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minimized: boolean;
  groupId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StickyNoteGroup {
  id: string;
  title: string;
  noteIds: string[];
  color?: string;
  pinned: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minimized: boolean;
  expanded: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StickyNoteContextValue {
  // Notes
  notes: StickyNote[];
  openNoteIds: string[];
  createNote: (partial?: Partial<StickyNote>) => StickyNote;
  updateNote: (id: string, updates: Partial<StickyNote>) => void;
  deleteNote: (id: string) => void;
  openNote: (id: string) => void;
  closeNote: (id: string) => void;
  bringToFront: (id: string) => void;
  toggleChecklistItem: (noteId: string, itemId: string) => void;

  // Groups
  groups: StickyNoteGroup[];
  createGroup: (noteIdA: string, noteIdB: string) => StickyNoteGroup | null;
  addNoteToGroup: (groupId: string, noteId: string) => void;
  removeNoteFromGroup: (groupId: string, noteId: string) => void;
  dissolveGroup: (groupId: string, deleteNotes?: boolean) => void;
  updateGroup: (id: string, updates: Partial<StickyNoteGroup>) => void;
  toggleGroupExpanded: (groupId: string) => void;

  // Z-ordering
  zOrder: string[];

  // FAB panel
  fabPanelOpen: boolean;
  setFabPanelOpen: (open: boolean) => void;
}

const StickyNoteContext = createContext<StickyNoteContextValue | null>(null);

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'pearl_sticky_notes';
const GROUP_STORAGE_KEY = 'pearl_sticky_note_groups';
const MAX_NOTES = 50;

function loadNotes(): StickyNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadGroups(): StickyNoteGroup[] {
  try {
    const raw = localStorage.getItem(GROUP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: StickyNote[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function saveGroups(groups: StickyNoteGroup[]) {
  localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(groups));
}

let _idCounter = 0;
function uid(prefix = 'sn') {
  return `${prefix}_${Date.now()}_${++_idCounter}`;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export const StickyNoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<StickyNote[]>(loadNotes);
  const [groups, setGroups] = useState<StickyNoteGroup[]>(loadGroups);
  const [openNoteIds, setOpenNoteIds] = useState<string[]>([]);
  const [zOrder, setZOrder] = useState<string[]>([]);
  const [fabPanelOpen, setFabPanelOpen] = useState(false);

  // Debounced save
  const saveTimerNotes = useRef<ReturnType<typeof setTimeout>>();
  const saveTimerGroups = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(saveTimerNotes.current);
    saveTimerNotes.current = setTimeout(() => saveNotes(notes), 300);
  }, [notes]);

  useEffect(() => {
    clearTimeout(saveTimerGroups.current);
    saveTimerGroups.current = setTimeout(() => saveGroups(groups), 300);
  }, [groups]);

  // ---- Note CRUD ----
  const createNote = useCallback((partial?: Partial<StickyNote>): StickyNote => {
    const now = new Date().toISOString();
    const note: StickyNote = {
      id: uid('sn'),
      title: partial?.title || 'New Note',
      content: partial?.content || '',
      checklist: partial?.checklist,
      color: partial?.color,
      pinned: partial?.pinned ?? false,
      tabId: partial?.tabId ?? null,
      position: partial?.position || { x: 80 + Math.random() * 80, y: 80 + Math.random() * 80 },
      size: partial?.size || { width: 340, height: 380 },
      minimized: false,
      groupId: partial?.groupId ?? null,
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => {
      const next = [note, ...prev].slice(0, MAX_NOTES);
      return next;
    });
    setOpenNoteIds(prev => [...prev, note.id]);
    setZOrder(prev => [...prev, note.id]);
    return note;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<StickyNote>) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    setOpenNoteIds(prev => prev.filter(x => x !== id));
    setZOrder(prev => prev.filter(x => x !== id));
    // Also remove from any group
    setGroups(prev =>
      prev
        .map(g => ({ ...g, noteIds: g.noteIds.filter(nid => nid !== id) }))
        .filter(g => g.noteIds.length > 0)
    );
  }, []);

  const openNote = useCallback((id: string) => {
    setOpenNoteIds(prev => (prev.includes(id) ? prev : [...prev, id]));
    setZOrder(prev => [...prev.filter(x => x !== id), id]);
  }, []);

  const closeNote = useCallback((id: string) => {
    setOpenNoteIds(prev => prev.filter(x => x !== id));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setZOrder(prev => [...prev.filter(x => x !== id), id]);
  }, []);

  const toggleChecklistItem = useCallback((noteId: string, itemId: string) => {
    setNotes(prev =>
      prev.map(n => {
        if (n.id !== noteId || !n.checklist) return n;
        return {
          ...n,
          checklist: n.checklist.map(c => (c.id === itemId ? { ...c, completed: !c.completed } : c)),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  // ---- Group CRUD ----
  const createGroup = useCallback((noteIdA: string, noteIdB: string): StickyNoteGroup | null => {
    const noteA = notes.find(n => n.id === noteIdA);
    const noteB = notes.find(n => n.id === noteIdB);
    if (!noteA || !noteB) return null;

    // If either note is already in a group, add to that group instead
    if (noteA.groupId) {
      setGroups(prev =>
        prev.map(g =>
          g.id === noteA.groupId && !g.noteIds.includes(noteIdB)
            ? { ...g, noteIds: [...g.noteIds, noteIdB], updatedAt: new Date().toISOString() }
            : g
        )
      );
      setNotes(prev =>
        prev.map(n => (n.id === noteIdB ? { ...n, groupId: noteA.groupId, updatedAt: new Date().toISOString() } : n))
      );
      return groups.find(g => g.id === noteA.groupId) || null;
    }
    if (noteB.groupId) {
      setGroups(prev =>
        prev.map(g =>
          g.id === noteB.groupId && !g.noteIds.includes(noteIdA)
            ? { ...g, noteIds: [...g.noteIds, noteIdA], updatedAt: new Date().toISOString() }
            : g
        )
      );
      setNotes(prev =>
        prev.map(n => (n.id === noteIdA ? { ...n, groupId: noteB.groupId, updatedAt: new Date().toISOString() } : n))
      );
      return groups.find(g => g.id === noteB.groupId) || null;
    }

    const now = new Date().toISOString();
    const group: StickyNoteGroup = {
      id: uid('sg'),
      title: 'Group',
      noteIds: [noteIdA, noteIdB],
      color: noteA.color,
      pinned: noteA.pinned || noteB.pinned,
      position: { ...noteB.position },
      size: { width: 260, height: 220 },
      minimized: false,
      expanded: false,
      createdAt: now,
      updatedAt: now,
    };

    setGroups(prev => [...prev, group]);
    setNotes(prev =>
      prev.map(n => {
        if (n.id === noteIdA || n.id === noteIdB) {
          return { ...n, groupId: group.id, updatedAt: now };
        }
        return n;
      })
    );
    // Close individual notes — they'll be accessed via the group now
    setOpenNoteIds(prev => prev.filter(x => x !== noteIdA && x !== noteIdB));
    setZOrder(prev => [...prev.filter(x => x !== noteIdA && x !== noteIdB), group.id]);
    return group;
  }, [notes, groups]);

  const addNoteToGroup = useCallback((groupId: string, noteId: string) => {
    setGroups(prev =>
      prev.map(g =>
        g.id === groupId && !g.noteIds.includes(noteId)
          ? { ...g, noteIds: [...g.noteIds, noteId], updatedAt: new Date().toISOString() }
          : g
      )
    );
    setNotes(prev =>
      prev.map(n => (n.id === noteId ? { ...n, groupId, updatedAt: new Date().toISOString() } : n))
    );
    setOpenNoteIds(prev => prev.filter(x => x !== noteId));
  }, []);

  const removeNoteFromGroup = useCallback((groupId: string, noteId: string) => {
    setGroups(prev => {
      const updated = prev
        .map(g =>
          g.id === groupId
            ? { ...g, noteIds: g.noteIds.filter(id => id !== noteId), updatedAt: new Date().toISOString() }
            : g
        )
        .filter(g => g.noteIds.length > 1); // dissolve if < 2 notes
      // If group dissolved, un-group remaining note
      const dissolved = !updated.find(g => g.id === groupId) && prev.find(g => g.id === groupId);
      if (dissolved) {
        const remainingId = dissolved.noteIds.find(id => id !== noteId);
        if (remainingId) {
          setNotes(p =>
            p.map(n => (n.id === remainingId ? { ...n, groupId: null, updatedAt: new Date().toISOString() } : n))
          );
          setOpenNoteIds(p => (p.includes(remainingId) ? p : [...p, remainingId]));
        }
      }
      return updated;
    });
    setNotes(prev =>
      prev.map(n => (n.id === noteId ? { ...n, groupId: null, updatedAt: new Date().toISOString() } : n))
    );
    setOpenNoteIds(prev => (prev.includes(noteId) ? prev : [...prev, noteId]));
  }, []);

  const dissolveGroup = useCallback((groupId: string, deleteNotes = false) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    if (deleteNotes) {
      setNotes(prev => prev.filter(n => !group.noteIds.includes(n.id)));
      setOpenNoteIds(prev => prev.filter(x => !group.noteIds.includes(x)));
    } else {
      setNotes(prev =>
        prev.map(n =>
          group.noteIds.includes(n.id) ? { ...n, groupId: null, updatedAt: new Date().toISOString() } : n
        )
      );
      // Re-open the notes
      setOpenNoteIds(prev => [...new Set([...prev, ...group.noteIds])]);
    }
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setZOrder(prev => prev.filter(x => x !== groupId));
  }, [groups]);

  const updateGroup = useCallback((id: string, updates: Partial<StickyNoteGroup>) => {
    setGroups(prev =>
      prev.map(g => (g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g))
    );
  }, []);

  const toggleGroupExpanded = useCallback((groupId: string) => {
    setGroups(prev =>
      prev.map(g => (g.id === groupId ? { ...g, expanded: !g.expanded, updatedAt: new Date().toISOString() } : g))
    );
  }, []);

  return (
    <StickyNoteContext.Provider
      value={{
        notes,
        openNoteIds,
        createNote,
        updateNote,
        deleteNote,
        openNote,
        closeNote,
        bringToFront,
        toggleChecklistItem,
        groups,
        createGroup,
        addNoteToGroup,
        removeNoteFromGroup,
        dissolveGroup,
        updateGroup,
        toggleGroupExpanded,
        zOrder,
        fabPanelOpen,
        setFabPanelOpen,
      }}
    >
      {children}
    </StickyNoteContext.Provider>
  );
};

export function useStickyNotes() {
  const ctx = useContext(StickyNoteContext);
  if (!ctx) throw new Error('useStickyNotes must be used within StickyNoteProvider');
  return ctx;
}
