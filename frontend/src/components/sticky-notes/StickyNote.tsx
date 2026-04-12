import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import PinIconData from '@hugeicons/core-free-icons/PinIcon';
import ColorsIconData from '@hugeicons/core-free-icons/ColorsIcon';
import MinusSignIconData from '@hugeicons/core-free-icons/MinusSignIcon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import CheckmarkCircle01IconData from '@hugeicons/core-free-icons/CheckmarkCircle01Icon';
import TextBoldIconData from '@hugeicons/core-free-icons/TextBoldIcon';
import TextItalicIconData from '@hugeicons/core-free-icons/TextItalicIcon';
import TextUnderlineIconData from '@hugeicons/core-free-icons/TextUnderlineIcon';
import TextStrikethroughIconData from '@hugeicons/core-free-icons/TextStrikethroughIcon';
import Heading01IconData from '@hugeicons/core-free-icons/Heading01Icon';
import Heading02IconData from '@hugeicons/core-free-icons/Heading02Icon';
import LeftToRightListBulletIconData from '@hugeicons/core-free-icons/LeftToRightListBulletIcon';
import LeftToRightListNumberIconData from '@hugeicons/core-free-icons/LeftToRightListNumberIcon';
import QuoteDownIconData from '@hugeicons/core-free-icons/QuoteDownIcon';
import Link01IconData from '@hugeicons/core-free-icons/Link01Icon';
import CleanIconData from '@hugeicons/core-free-icons/CleanIcon';
import { useStickyNotes, StickyNote as StickyNoteType } from '../../contexts/StickyNoteContext';
import { StickyNoteChecklist } from './StickyNoteChecklist';
import axios from 'axios';

const SIcon: React.FC<{ icon: any; size?: number; style?: React.CSSProperties }> = ({ icon, size = 14, style }) => (
  <HugeiconsIcon icon={icon} size={size} style={style} />
);

interface StickyNoteProps {
  note: StickyNoteType;
  zIndex: number;
  activeTabId: string | null;
  onDragOverNote?: (draggedId: string, targetId: string) => void;
  onDragEndNote?: (draggedId: string) => void;
}

const COLOR_OPTIONS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff', '#fed7aa'];

export const StickyNote: React.FC<StickyNoteProps> = ({ note, zIndex, activeTabId, onDragOverNote, onDragEndNote }) => {
  const { t } = useTranslation();
  const { updateNote, closeNote, bringToFront, toggleChecklistItem, createNote } = useStickyNotes();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [animState, setAnimState] = useState<'opening' | 'open' | 'closing'>('opening');
  const [isOrganizing, setIsOrganizing] = useState(false);

  // Opening animation
  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimState('open'));
    return () => cancelAnimationFrame(t);
  }, []);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const noteRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const bgColor = note.color || '#fef08a';
  // Darken by mixing with a bit of brown/gray
  const darkerBg = note.color
    ? `color-mix(in srgb, ${note.color} 80%, #8b7355)`
    : 'color-mix(in srgb, #fef08a 80%, #8b7355)';
  const headerBg = note.color
    ? `color-mix(in srgb, ${note.color} 90%, #6b5b3e)`
    : 'color-mix(in srgb, #fef08a 90%, #6b5b3e)';

  // --- Drag logic ---
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    e.preventDefault();
    bringToFront(note.id);
    setIsDragging(true);
    dragOffset.current = { x: e.clientX - note.position.x, y: e.clientY - note.position.y };
  }, [note.id, note.position, bringToFront]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      const x = e.clientX - dragOffset.current.x;
      const y = e.clientY - dragOffset.current.y;
      updateNote(note.id, { position: { x, y } });

      if (onDragOverNote) {
        const els = document.elementsFromPoint(e.clientX, e.clientY);
        // Look for another sticky note or a group folder under the cursor
        let foundId = '';
        for (const el of els) {
          const stickyId = el.getAttribute('data-sticky-id');
          const groupId = el.getAttribute('data-sticky-group-id');
          const id = stickyId || groupId;
          if (id && id !== note.id) {
            foundId = id;
            break;
          }
        }
        onDragOverNote(note.id, foundId);
      }
    };
    const handleUp = () => {
      setIsDragging(false);
      onDragEndNote?.(note.id);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, note.id, updateNote, onDragOverNote, onDragEndNote]);

  // --- Resize logic ---
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = { x: e.clientX, y: e.clientY, w: note.size.width, h: note.size.height };
  }, [note.size]);

  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e: MouseEvent) => {
      const w = Math.max(240, resizeStart.current.w + (e.clientX - resizeStart.current.x));
      const h = Math.max(180, resizeStart.current.h + (e.clientY - resizeStart.current.y));
      updateNote(note.id, { size: { width: w, height: h } });
    };
    const handleUp = () => setIsResizing(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isResizing, note.id, updateNote]);

  // --- Rich text formatting ---
  const execFormat = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }, []);

  const execHeading = useCallback((tag: string) => {
    editorRef.current?.focus();
    document.execCommand('formatBlock', false, tag);
  }, []);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      editorRef.current?.focus();
      document.execCommand('createLink', false, url);
    }
  }, []);

  // Sync contentEditable -> note.content
  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      updateNote(note.id, { content: editorRef.current.innerHTML });
    }
  }, [note.id, updateNote]);

  // Set initial content when mounting
  useEffect(() => {
    if (editorRef.current && !note.checklist) {
      if (editorRef.current.innerHTML !== note.content) {
        editorRef.current.innerHTML = note.content;
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Show broom button when note has enough content (~10 lines)
  const plainText = (note.content || '').replace(/<[^>]*>/g, '');
  const lineCount = plainText.split(/\n|<br\s*\/?>/).length;
  const charThreshold = plainText.length > 150;
  const showOrganize = !note.checklist && (lineCount >= 10 || charThreshold);

  const handleOrganize = async () => {
    if (isOrganizing || !note.content) return;
    setIsOrganizing(true);
    try {
      const res = await axios.post('http://localhost:8000/api/organize-note', {
        content: note.content,
      }, { timeout: 15000 });
      if (res.data?.success && res.data.organized) {
        updateNote(note.id, { content: res.data.organized });
        if (editorRef.current) {
          editorRef.current.innerHTML = res.data.organized;
        }
      }
    } catch (err) {
      console.error('Failed to organize note:', err);
    } finally {
      setIsOrganizing(false);
    }
  };

  const handleClose = () => {
    setAnimState('closing');
    setTimeout(() => closeNote(note.id), 200);
  };

  const completedCount = note.checklist?.filter(c => c.completed).length || 0;
  const totalCount = note.checklist?.length || 0;

  // Toolbar button helper
  const TBtn: React.FC<{ title: string; icon: any; onAction: () => void; size?: number }> = ({ title, icon, onAction, size = 16 }) => (
    <button
      className="p-1.5 rounded-lg hover:bg-black/8 active:bg-black/15 flex items-center justify-center transition-colors"
      title={title}
      onMouseDown={e => { e.preventDefault(); onAction(); }}
    >
      <SIcon icon={icon} size={size} style={{ color: '#555' }} />
    </button>
  );

  const animStyle: React.CSSProperties = {
    transition: 'opacity 0.2s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
    opacity: animState === 'open' ? 1 : 0,
    transform: animState === 'open' ? 'scale(1)' : 'scale(0.85)',
  };

  if (note.minimized) {
    return (
      <div
        data-sticky-id={note.id}
        className="fixed rounded-xl cursor-pointer select-none"
        style={{
          left: note.position.x,
          top: note.position.y,
          zIndex,
          background: bgColor,
          padding: '8px 14px',
          fontSize: '13px',
          fontWeight: 600,
          maxWidth: 220,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: `0 4px 16px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4)`,
          ...animStyle,
        }}
        onMouseDown={handleMouseDown}
        onClick={() => {
          bringToFront(note.id);
          updateNote(note.id, { minimized: false });
        }}
      >
        {note.title}
        {note.checklist && <span style={{ marginLeft: 6, opacity: 0.6 }}>{completedCount}/{totalCount}</span>}
      </div>
    );
  }

  return (
    <div
      ref={noteRef}
      data-sticky-id={note.id}
      className="fixed rounded-2xl select-none flex flex-col"
      style={{
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
        zIndex,
        background: bgColor,
        border: '1px solid rgba(255,255,255,0.45)',
        overflow: 'hidden',
        transition: isDragging || isResizing ? 'none' : 'box-shadow 0.25s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease',
        boxShadow: isDragging
          ? `0 20px 40px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)`
          : `0 8px 24px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)`,
        opacity: animState === 'open' ? 1 : 0,
        transform: isDragging ? 'scale(1.02)' : animState === 'open' ? 'scale(1)' : 'scale(0.85)',
      }}
    >
      {/* Title bar — drag handle */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 cursor-move"
        style={{
          flexShrink: 0,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          background: headerBg,
        }}
        onMouseDown={handleMouseDown}
      >
        <span
          className="flex-1 text-sm font-bold truncate"
          style={{ color: '#2D2D2D', pointerEvents: 'none', letterSpacing: '-0.01em' }}
        >
          {note.title}
        </span>

        {/* Three-dot menu */}
        <button
          className="no-drag p-1 rounded-lg hover:bg-black/8 flex items-center justify-center transition-colors"
          title="Options"
          onClick={() => setShowColorPicker(prev => !prev)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#555">
            <circle cx="3" cy="8" r="1.3" />
            <circle cx="8" cy="8" r="1.3" />
            <circle cx="13" cy="8" r="1.3" />
          </svg>
        </button>

        {/* Pin */}
        <button
          className="no-drag p-1 rounded-lg hover:bg-black/8 flex items-center justify-center transition-colors"
          title={note.pinned ? 'Unpin (stay on this tab)' : 'Pin (visible on all tabs)'}
          onClick={() => {
            if (note.pinned) {
              updateNote(note.id, { pinned: false, tabId: activeTabId });
            } else {
              updateNote(note.id, { pinned: true });
            }
          }}
          style={{ opacity: note.pinned ? 1 : 0.35 }}
        >
          <SIcon icon={PinIconData} size={16} style={{ color: '#555' }} />
        </button>

        {/* Minimize */}
        <button
          className="no-drag p-1 rounded-lg hover:bg-black/8 flex items-center justify-center transition-colors"
          title="Minimize"
          onClick={() => updateNote(note.id, { minimized: true })}
        >
          <SIcon icon={MinusSignIconData} size={16} style={{ color: '#555' }} />
        </button>

        {/* Close */}
        <button
          className="no-drag p-1 rounded-lg hover:bg-black/8 flex items-center justify-center transition-colors"
          title="Close (saves to saved list)"
          onClick={handleClose}
        >
          <SIcon icon={Cancel01IconData} size={16} style={{ color: '#555' }} />
        </button>
      </div>

      {/* Options dropdown — color picker + title rename */}
      {showColorPicker && (
        <div
          className="no-drag px-3 py-2.5 space-y-2"
          style={{
            background: headerBg,
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            flexShrink: 0,
          }}
        >
          <input
            className="w-full text-sm font-semibold rounded-lg px-2.5 py-1.5 outline-none transition-colors"
            value={note.title}
            autoFocus
            onChange={e => updateNote(note.id, { title: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter') setShowColorPicker(false); }}
            placeholder={t('stickyNotes.noteTitle')}
            style={{
              color: '#2D2D2D',
              background: 'rgba(255,255,255,0.45)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          />
          <div className="flex gap-2">
            {COLOR_OPTIONS.map(c => (
              <button
                key={c}
                className="w-7 h-7 rounded-full hover:scale-110 transition-transform"
                style={{
                  background: c,
                  border: note.color === c ? '2.5px solid #333' : '2px solid rgba(0,0,0,0.12)',
                  boxShadow: note.color === c ? '0 0 0 2px rgba(255,255,255,0.6)' : 'inset 0 1px 2px rgba(0,0,0,0.1)',
                }}
                onClick={() => { updateNote(note.id, { color: c }); setShowColorPicker(false); }}
              />
            ))}
          </div>
          {/* New note button */}
          <button
            className="w-full py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
            style={{
              background: 'rgba(0,0,0,0.06)',
              color: '#555',
              border: '1px dashed rgba(0,0,0,0.15)',
            }}
            onClick={() => {
              setShowColorPicker(false);
              createNote({ tabId: activeTabId });
            }}
          >
            + New Note
          </button>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-auto">
        {note.checklist ? (
          <StickyNoteChecklist
            checklist={note.checklist}
            onToggle={(itemId) => toggleChecklistItem(note.id, itemId)}
          />
        ) : (
          <div
            ref={editorRef}
            className="no-drag w-full h-full px-4 py-3 text-sm outline-none"
            contentEditable
            suppressContentEditableWarning
            onInput={handleEditorInput}
            onFocus={() => bringToFront(note.id)}
            data-placeholder={t('stickyNotes.typeAnything')}
            style={{
              color: '#2D2D2D',
              minHeight: '100%',
              lineHeight: 1.6,
              wordBreak: 'break-word',
            }}
          />
        )}
      </div>

      {/* Footer — checklist progress OR formatting toolbar */}
      {note.checklist ? (
        <div
          className="px-3 py-2 text-xs flex items-center justify-between"
          style={{
            color: '#555',
            flexShrink: 0,
            borderTop: '1px solid rgba(0,0,0,0.06)',
            background: headerBg,
          }}
        >
          <span>{completedCount}/{totalCount} steps completed</span>
          {completedCount === totalCount && totalCount > 0 && (
            <span className="flex items-center gap-1">
              <SIcon icon={CheckmarkCircle01IconData} size={12} style={{ color: '#16a34a' }} /> Done!
            </span>
          )}
        </div>
      ) : (
        <div
          className="no-drag sn-toolbar-scroll"
          style={{
            flexShrink: 0,
            borderTop: '1px solid rgba(0,0,0,0.06)',
            background: headerBg,
            overflowX: 'auto',
            overflowY: 'hidden',
          }}
        >
          <div
            className="flex items-center gap-0.5 px-2 py-1.5"
            style={{ minWidth: 'max-content', margin: '0 auto', width: 'fit-content' }}
          >
            <TBtn title="Bold" icon={TextBoldIconData} onAction={() => execFormat('bold')} />
            <TBtn title="Italic" icon={TextItalicIconData} onAction={() => execFormat('italic')} />
            <TBtn title="Underline" icon={TextUnderlineIconData} onAction={() => execFormat('underline')} />
            <TBtn title="Strikethrough" icon={TextStrikethroughIconData} onAction={() => execFormat('strikeThrough')} />

            <div className="w-px h-4 mx-0.5 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.12)' }} />

            <TBtn title="Heading 1" icon={Heading01IconData} onAction={() => execHeading('h1')} />
            <TBtn title="Heading 2" icon={Heading02IconData} onAction={() => execHeading('h2')} />

            <div className="w-px h-4 mx-0.5 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.12)' }} />

            <TBtn title="Bullet list" icon={LeftToRightListBulletIconData} onAction={() => execFormat('insertUnorderedList')} />
            <TBtn title="Numbered list" icon={LeftToRightListNumberIconData} onAction={() => execFormat('insertOrderedList')} />

            <div className="w-px h-4 mx-0.5 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.12)' }} />

            <TBtn title="Quote" icon={QuoteDownIconData} onAction={() => execHeading('blockquote')} />
            <TBtn title="Link" icon={Link01IconData} onAction={insertLink} />
            <button
              className="p-1.5 rounded-lg hover:bg-black/8 active:bg-black/15 flex items-center justify-center transition-colors flex-shrink-0"
              title="Horizontal rule"
              onMouseDown={e => { e.preventDefault(); execFormat('insertHorizontalRule'); }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#555" strokeWidth="1.5">
                <line x1="2" y1="8" x2="14" y2="8" />
              </svg>
            </button>

            {/* Organize / Broom button — appears when note has enough content */}
            {showOrganize && (
              <>
                <div className="w-px h-4 mx-0.5 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.12)' }} />
                <button
                  className="p-1.5 rounded-lg hover:bg-black/8 active:bg-black/15 flex items-center justify-center transition-colors flex-shrink-0"
                  title="Organize notes with AI"
                  onMouseDown={e => { e.preventDefault(); handleOrganize(); }}
                  disabled={isOrganizing}
                  style={{ opacity: isOrganizing ? 0.5 : 1 }}
                >
                  <SIcon
                    icon={CleanIconData}
                    size={16}
                    style={{
                      color: isOrganizing ? '#999' : '#555',
                      animation: isOrganizing ? 'spin 1s linear infinite' : 'none',
                    }}
                  />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Resize handle */}
      <div
        className="no-drag absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize"
        style={{ opacity: 0.25 }}
        onMouseDown={handleResizeStart}
      >
        <svg viewBox="0 0 16 16" fill="currentColor" style={{ color: '#666' }}>
          <path d="M14 14H10L14 10V14ZM14 8L6 14H8L14 6V8Z" />
        </svg>
      </div>

      {/* Styles */}
      <style>{`
        [data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: rgba(0,0,0,0.3);
          pointer-events: none;
          font-style: italic;
        }
        [data-sticky-id] h1 { font-size: 1.4em; font-weight: 700; margin: 0.3em 0; }
        [data-sticky-id] h2 { font-size: 1.15em; font-weight: 600; margin: 0.25em 0; }
        [data-sticky-id] blockquote { border-left: 3px solid rgba(0,0,0,0.2); padding-left: 10px; margin: 0.4em 0; opacity: 0.8; }
        [data-sticky-id] ul { padding-left: 1.5em; margin: 0.3em 0; list-style: disc; }
        [data-sticky-id] ol { padding-left: 1.5em; margin: 0.3em 0; list-style: decimal; }
        [data-sticky-id] li { list-style: inherit; }
        [data-sticky-id] a { color: #2563eb; text-decoration: underline; }
        [data-sticky-id] hr { border: none; border-top: 1px solid rgba(0,0,0,0.15); margin: 0.5em 0; }
        .sn-toolbar-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .sn-toolbar-scroll::-webkit-scrollbar { display: none; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
