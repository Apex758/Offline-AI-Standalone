import React, { useState, useRef, useCallback, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import { useStickyNotes, StickyNoteGroup as GroupType } from '../../contexts/StickyNoteContext';
import { StickyNoteGroupExpanded } from './StickyNoteGroupExpanded';

const CLOSE_PREF_KEY = 'pearl_folder_close_pref';

interface Props {
  group: GroupType;
  zIndex: number;
  activeTabId: string | null;
  onNavigateAction?: (action: { toolType: string; settingsSection?: string }) => void;
}

const DOC_STYLES = {
  left:   { default: 'rotate(-12deg) translateX(-33px)', hover: 'rotate(-18deg) translateX(-43px) translateY(-10px)', bg: 'linear-gradient(155deg,#cdd0da,#b8bcc8)', shadow: '-3px 5px 16px rgba(0,0,0,.22)', z: 1 },
  right:  { default: 'rotate(9deg) translateX(33px)',    hover: 'rotate(15deg) translateX(43px) translateY(-10px)',   bg: 'linear-gradient(155deg,#c5c9d4,#b0b4c0)', shadow: '3px 5px 16px rgba(0,0,0,.22)',  z: 1 },
  center: { default: 'rotate(-1deg)',                     hover: 'rotate(-2deg) translateY(-12px)',                    bg: 'linear-gradient(165deg,#eef0f5,#d8dbe6)', shadow: '0 6px 18px rgba(0,0,0,.22)',   z: 2 },
} as const;

const DOC_ORDER: (keyof typeof DOC_STYLES)[] = ['left', 'right', 'center'];
const LINE_PATTERNS = [['72%','55%','38%','55%'],['72%','38%','55%','72%'],['72%','55%','38%','55%']];

export const StickyNoteGroup: React.FC<Props> = ({ group, zIndex, activeTabId, onNavigateAction }) => {
  const { notes, updateGroup, bringToFront, dissolveGroup } = useStickyNotes();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'opening' | 'closing'>('idle');
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [rememberChoice, setRememberChoice] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const groupNotes = notes.filter(n => group.noteIds.includes(n.id));

  // Folder color palette
  const folderTab = isDark ? 'linear-gradient(130deg, #5c3d1e, #3a2810)' : 'linear-gradient(130deg, #3c3c4e, #262630)';
  const folderShell = isDark
    ? 'linear-gradient(148deg, #5a3a1a 0%, #3a2510 55%, #2a1a08 100%)'
    : 'linear-gradient(148deg, #38384a 0%, #202030 55%, #151521 100%)';
  const folderGloss = isDark
    ? 'linear-gradient(158deg, rgba(255,200,120,0.14) 0%, rgba(255,200,120,0.04) 38%, transparent 58%)'
    : 'linear-gradient(158deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 38%, transparent 58%)';
  const folderTextColor = isDark ? '#f5d5a8' : '#e0dce8';
  const folderSubColor = isDark ? '#c49860' : '#b0a8c0';
  const folderSubtleColor = isDark ? '#9a7040' : '#7a7898';

  // --- All hooks must be above any early return ---

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    e.preventDefault();
    bringToFront(group.id);
    setIsDragging(true);
    didDrag.current = false;
    dragOffset.current = { x: e.clientX - group.position.x, y: e.clientY - group.position.y };
  }, [group.id, group.position, bringToFront]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      didDrag.current = true;
      updateGroup(group.id, {
        position: { x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y },
      });
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
  }, [isDragging, group.id, updateGroup]);

  const handleClick = useCallback(() => {
    if (!didDrag.current && !showCloseDialog) {
      setAnimState('opening');
      setTimeout(() => { updateGroup(group.id, { expanded: true }); setAnimState('idle'); }, 250);
    }
  }, [group.id, updateGroup, showCloseDialog]);

  const handleCloseButton = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    const saved = localStorage.getItem(CLOSE_PREF_KEY);
    if (saved === 'delete') { dissolveGroup(group.id, true); }
    else if (saved === 'minimize') { updateGroup(group.id, { minimized: true }); }
    else { setShowCloseDialog(true); }
  }, [group.id, dissolveGroup, updateGroup]);

  const handleCloseChoice = useCallback((choice: 'delete' | 'minimize') => {
    if (rememberChoice) localStorage.setItem(CLOSE_PREF_KEY, choice);
    if (choice === 'delete') dissolveGroup(group.id, true);
    else updateGroup(group.id, { minimized: true });
    setShowCloseDialog(false); setRememberChoice(false);
  }, [group.id, dissolveGroup, updateGroup, rememberChoice]);

  const handleCloseExpanded = useCallback(() => {
    setAnimState('closing');
    setTimeout(() => { updateGroup(group.id, { expanded: false }); setAnimState('idle'); }, 200);
  }, [group.id, updateGroup]);

  useEffect(() => {
    if (!group.expanded) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleCloseExpanded(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [group.expanded, handleCloseExpanded]);

  // --- Early returns AFTER all hooks ---

  if (group.minimized) {
    return (
      <div
        data-sticky-group-id={group.id}
        className="fixed rounded-xl cursor-pointer select-none"
        style={{
          left: group.position.x, top: group.position.y, zIndex,
          background: folderShell,
          padding: '8px 14px', fontSize: '13px', fontWeight: 600, color: folderTextColor,
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
        onMouseDown={handleMouseDown}
        onClick={() => updateGroup(group.id, { minimized: false })}
      >
        {group.title} <span style={{ opacity: 0.5 }}>({groupNotes.length})</span>
      </div>
    );
  }

  if (group.expanded) {
    return (
      <StickyNoteGroupExpanded
        group={group} zIndex={zIndex} activeTabId={activeTabId}
        onNavigateAction={onNavigateAction} onClose={handleCloseExpanded} animState={animState}
      />
    );
  }

  const docCount = Math.min(groupNotes.length, 3);

  return (
    <div
      data-sticky-group-id={group.id}
      data-sticky-id={group.id}
      className="fixed select-none cursor-move"
      style={{
        left: group.position.x, top: group.position.y, width: 140, zIndex,
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
        transform: animState === 'opening' ? 'scale(1.15)' : 'scale(1)',
        opacity: animState === 'opening' ? 0 : 1,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); if (showCloseDialog) { setShowCloseDialog(false); setRememberChoice(false); } }}
      onClick={handleClick}
    >
      {/* Close button on hover */}
      {isHovered && !showCloseDialog && (
        <button
          className="no-drag absolute flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{
            top: -6, right: -6, width: 22, height: 22, zIndex: 20, cursor: 'pointer',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            border: '2px solid rgba(255,255,255,0.8)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
          title="Close folder"
          onMouseDown={e => e.stopPropagation()}
          onClick={handleCloseButton}
        >
          <HugeiconsIcon icon={Cancel01IconData} size={10} style={{ color: '#fff' }} />
        </button>
      )}

      {/* Close dialog */}
      {showCloseDialog && (
        <div
          className="no-drag absolute rounded-xl shadow-2xl p-3"
          style={{
            top: -80, left: '50%', transform: 'translateX(-50%)', width: 200, zIndex: 30,
            background: 'var(--bg-surface, #fff)', border: '1px solid var(--border-default, #e5e7eb)',
            animation: 'sn-scale-in 0.15s ease',
          }}
          onMouseDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
        >
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-title, #111827)' }}>Close this folder?</p>
          <div className="flex gap-1.5 mb-2">
            <button className="flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors" style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }} onClick={() => handleCloseChoice('delete')}>Delete All</button>
            <button className="flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors" style={{ background: 'rgba(59,130,246,0.1)', color: '#2563eb' }} onClick={() => handleCloseChoice('minimize')}>Minimize</button>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={rememberChoice} onChange={e => setRememberChoice(e.target.checked)} className="rounded accent-blue-600" style={{ width: 12, height: 12 }} />
            <span className="text-xs" style={{ color: 'var(--text-muted, #6b7280)' }}>Remember my choice</span>
          </label>
          <button className="mt-1.5 w-full text-xs py-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors" style={{ color: 'var(--text-hint, #9ca3af)' }} onClick={() => { setShowCloseDialog(false); setRememberChoice(false); }}>Cancel</button>
        </div>
      )}

      <div className="flex flex-col items-center">
        {/* Documents sticking out */}
        <div className="relative" style={{ width: 125, height: 42 }}>
          {DOC_ORDER.slice(0, docCount).map((pos, i) => {
            const s = DOC_STYLES[pos];
            const noteColor = groupNotes[i]?.color;
            const bg = noteColor ? `linear-gradient(155deg, ${noteColor}, color-mix(in srgb, ${noteColor} 70%, #8888aa))` : s.bg;
            return (
              <div key={pos} className="absolute" style={{
                width: 52, height: 52, bottom: 0, left: '50%', marginLeft: -26,
                borderRadius: '8px 8px 5px 5px', background: bg, boxShadow: s.shadow, zIndex: s.z,
                transform: isHovered ? s.hover : s.default,
                transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
              }}>
                <div className="flex flex-col gap-[5px]" style={{ padding: '12px 10px 0' }}>
                  {LINE_PATTERNS[i]?.map((w, li) => (
                    <div key={li} className="rounded-full" style={{ height: 4, width: w, background: 'rgba(100,110,140,0.22)' }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Folder body */}
        <div className="relative" style={{
          width: 140, height: 110, marginTop: -32, zIndex: 10,
          transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), filter 0.35s ease',
          transform: isHovered ? 'translateY(-8px) scale(1.03)' : 'none',
          filter: isHovered ? 'drop-shadow(0 28px 40px rgba(0,0,0,0.3))' : 'drop-shadow(0 12px 24px rgba(0,0,0,0.2))',
        }}>
          <div className="absolute" style={{ top: 0, left: 12, width: 55, height: 18, background: folderTab, clipPath: 'polygon(0% 100%, 0% 0%, 90% 0%, 100% 100%)' }} />
          <div className="absolute overflow-hidden" style={{ bottom: 0, left: 0, width: 140, height: 100, background: folderShell, borderRadius: '4px 16px 18px 18px' }}>
            <div className="absolute inset-0" style={{ background: folderGloss, borderRadius: 'inherit' }} />
            <div className="absolute left-0 right-0" style={{ bottom: 18, height: 38, background: 'linear-gradient(90deg, transparent 8%, rgba(255,255,255,0.045) 30%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.045) 70%, transparent 92%)' }} />
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="font-bold truncate" style={{ color: folderTextColor, maxWidth: 80, fontSize: 10 }}>{group.title}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: folderSubColor, fontSize: 10 }}>{groupNotes.length}</span>
              </div>
              {groupNotes[0] && <p className="truncate mt-0.5" style={{ color: folderSubtleColor, fontSize: 9 }}>{groupNotes[0].title}</p>}
            </div>
          </div>
        </div>

        <div style={{ width: 120, height: 14, marginTop: -2, background: 'radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 75%)' }} />
      </div>
    </div>
  );
};
