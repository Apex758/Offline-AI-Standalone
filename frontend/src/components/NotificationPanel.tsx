import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { formatDistanceToNow } from 'date-fns';
import { useNotification } from '../contexts/NotificationContext';
import { useQueue, QueueItem } from '../contexts/QueueContext';
import { useWebSocket } from '../contexts/WebSocketContext';

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6a4 4 0 018 0c0 2.5 1 4 1.5 4.5H2.5C3 10 4 8.5 4 6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M6 12a2 2 0 004 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const QueueIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 4h12M2 8h9M2 12h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
    <path d="M2 4h10M5 4V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V4M4 6v5.5a1 1 0 001 1h4a1 1 0 001-1V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GripIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="5" cy="3.5" r="1" fill="currentColor"/><circle cx="9" cy="3.5" r="1" fill="currentColor"/>
    <circle cx="5" cy="7" r="1" fill="currentColor"/><circle cx="9" cy="7" r="1" fill="currentColor"/>
    <circle cx="5" cy="10.5" r="1" fill="currentColor"/><circle cx="9" cy="10.5" r="1" fill="currentColor"/>
  </svg>
);

const CloseIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const StatusIcons = {
  success: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 8.2l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 7v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="8" cy="4.5" r="0.7" fill="currentColor"/>
    </svg>
  ),
  waiting: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  generating: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" strokeDasharray="30 14" strokeLinecap="round"/>
    </svg>
  ),
};

// ─── Theme helpers ────────────────────────────────────────────────────────────
function useIsDark() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

const palette = {
  light: {
    bg: 'rgba(255,255,255,0.72)',
    border: 'rgba(229,231,235,0.65)',
    divider: 'rgba(0,0,0,0.06)',
    text: '#111827',
    muted: '#6b7280',
    faint: '#9ca3af',
    unreadBg: 'rgba(239,246,255,0.50)',
    hoverBg: 'rgba(0,0,0,0.03)',
    success: '#16a34a',
    error: '#dc2626',
    info: '#2563eb',
    warning: '#d97706',
    accent: '#2563eb',
    tabActiveBg: 'rgba(0,0,0,0.04)',
    badgeBg: '#2563eb',
    queueBadge: '#d97706',
    glow: 'rgba(0,0,0,0.08)',
  },
  dark: {
    bg: 'rgba(17,24,39,0.72)',
    border: 'rgba(75,85,99,0.45)',
    divider: 'rgba(255,255,255,0.06)',
    text: '#f3f4f6',
    muted: '#9ca3af',
    faint: '#6b7280',
    unreadBg: 'rgba(96,165,250,0.08)',
    hoverBg: 'rgba(255,255,255,0.04)',
    success: '#4ade80',
    error: '#f87171',
    info: '#60a5fa',
    warning: '#fbbf24',
    accent: '#60a5fa',
    tabActiveBg: 'rgba(255,255,255,0.06)',
    badgeBg: '#3b82f6',
    queueBadge: '#f59e0b',
    glow: 'rgba(0,0,0,0.40)',
  },
};

// ─── Panel styles ─────────────────────────────────────────────────────────────
const panelKeyframes = `
  @keyframes notif-panel-in {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

type PanelTab = 'notifications' | 'queue';

const NotificationPanel: React.FC<NotificationPanelProps> = ({ open, onClose }) => {
  const { history, unreadCount, markAllRead, clearHistory, navigateToTab } = useNotification();
  const { queue, removeFromQueue, cancelGenerating, reorderQueue, clearCompleted, queueEnabled } = useQueue();
  const { getActiveStreams, cancelStream } = useWebSocket();
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<PanelTab>('notifications');
  const isDark = useIsDark();
  const c = isDark ? palette.dark : palette.light;

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (open && unreadCount > 0) markAllRead();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open, onClose]);

  const waitingItems = queue.filter(item => item.status === 'waiting');
  const activeStreams = getActiveStreams();
  const queuedTabEndpoints = new Set(
    queue.filter(item => item.status === 'generating').map(item => `${item.tabId}::${item.endpoint}`)
  );
  const directStreams = activeStreams.filter(s => !queuedTabEndpoints.has(`${s.tabId}::${s.endpoint}`));
  const queueCount = queue.filter(item => item.status === 'waiting' || item.status === 'generating').length + directStreams.length;

  const statusColor = (status: QueueItem['status']) => {
    switch (status) {
      case 'waiting': return c.warning;
      case 'generating': return c.info;
      case 'completed': return c.success;
      case 'error': return c.error;
    }
  };

  const statusIcon = (status: QueueItem['status']) => {
    const key = status === 'completed' ? 'success' : status;
    return <span style={{ color: statusColor(status), flexShrink: 0, marginTop: '2px' }}>{StatusIcons[key as keyof typeof StatusIcons] ?? StatusIcons.info}</span>;
  };

  const statusLabel = (status: QueueItem['status']) => {
    switch (status) {
      case 'waiting': return 'Waiting';
      case 'generating': return 'Generating...';
      case 'completed': return 'Completed';
      case 'error': return 'Failed';
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case 'success': return c.success;
      case 'error': return c.error;
      default: return c.info;
    }
  };

  const typeIcon = (type: string) => {
    const key = type as keyof typeof StatusIcons;
    return StatusIcons[key] ?? StatusIcons.info;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    if (e.currentTarget instanceof HTMLElement) e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
  };
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };
  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== toIndex) reorderQueue(dragIndex, toIndex);
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => { setDragIndex(null); setDragOverIndex(null); };

  // ─── Shared row style ────────────────────────────────────────────────
  const rowStyle = (highlight = false): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px 16px',
    borderBottom: `1px solid ${c.divider}`,
    background: highlight ? c.unreadBg : 'transparent',
    transition: 'background 0.15s',
  });

  return createPortal(
    <>
      <style>{panelKeyframes}</style>
      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            top: '44px',
            right: '8px',
            width: '380px',
            borderRadius: '16px',
            overflow: 'hidden',
            zIndex: 99999,
            background: c.bg,
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: `1px solid ${c.border}`,
            boxShadow: `0 16px 48px ${c.glow}, 0 4px 16px rgba(0,0,0,0.06), 0 0 0 0.5px ${c.border}`,
            animation: 'notif-panel-in 0.2s cubic-bezier(0.16,1,0.3,1) forwards',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {/* ─── Tab Header ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${c.divider}` }}>
            {([
              { key: 'notifications' as PanelTab, icon: <BellIcon />, label: 'Notifications', badge: unreadCount, badgeColor: c.badgeBg },
              { key: 'queue' as PanelTab, icon: <QueueIcon />, label: 'Queue', badge: queueCount, badgeColor: c.queueBadge },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  fontWeight: activeTab === tab.key ? 600 : 500,
                  color: activeTab === tab.key ? c.text : c.muted,
                  background: activeTab === tab.key ? c.tabActiveBg : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  letterSpacing: '-0.01em',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (activeTab !== tab.key) e.currentTarget.style.background = c.hoverBg; }}
                onMouseLeave={e => { if (activeTab !== tab.key) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{tab.icon}</span>
                {tab.label}
                {tab.badge > 0 && (
                  <span style={{
                    padding: '1px 6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '10px',
                    background: tab.badgeColor,
                    color: '#fff',
                    lineHeight: '16px',
                    letterSpacing: '0',
                  }}>
                    {tab.badge}
                  </span>
                )}
                {/* Active indicator bar */}
                {activeTab === tab.key && (
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '20%',
                    width: '60%',
                    height: '2px',
                    borderRadius: '2px',
                    background: c.accent,
                    opacity: 0.7,
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* ─── Notifications Tab ──────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <>
              {history.length > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  padding: '8px 16px',
                  borderBottom: `1px solid ${c.divider}`,
                }}>
                  <button
                    onClick={clearHistory}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      color: c.muted,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px 4px',
                      borderRadius: '6px',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = c.error; }}
                    onMouseLeave={e => { e.currentTarget.style.color = c.muted; }}
                  >
                    <TrashIcon />
                    Clear all
                  </button>
                </div>
              )}

              <div style={{ maxHeight: '288px', overflowY: 'auto' }}>
                {history.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 0',
                    gap: '8px',
                    color: c.faint,
                  }}>
                    <span style={{ opacity: 0.3 }}><BellIcon /></span>
                    <span style={{ fontSize: '13px' }}>No notifications yet</span>
                  </div>
                ) : (
                  history.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (item.tabId) { navigateToTab(item.tabId); onClose(); }
                      }}
                      style={{
                        ...rowStyle(!item.read),
                        cursor: item.tabId ? 'pointer' : 'default',
                      }}
                      onMouseEnter={e => { if (item.tabId) e.currentTarget.style.background = c.hoverBg; }}
                      onMouseLeave={e => { e.currentTarget.style.background = !item.read ? c.unreadBg : 'transparent'; }}
                    >
                      <span style={{ color: typeColor(item.type), flexShrink: 0, marginTop: '2px' }}>
                        {typeIcon(item.type)}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          margin: 0,
                          fontSize: '13px',
                          fontWeight: 500,
                          lineHeight: 1.45,
                          color: c.text,
                          letterSpacing: '-0.01em',
                        }}>
                          {item.message}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                          <span style={{ fontSize: '11.5px', color: c.muted }}>
                            {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                          </span>
                          {item.tabId && (
                            <span style={{ fontSize: '11.5px', color: c.accent, fontWeight: 500 }}>View</span>
                          )}
                        </div>
                      </div>
                      {!item.read && (
                        <span style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: c.accent,
                          flexShrink: 0,
                          marginTop: '6px',
                          boxShadow: `0 0 6px ${c.accent}60`,
                        }} />
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* ─── Queue Tab ──────────────────────────────────────────── */}
          {activeTab === 'queue' && (
            <>
              {(queue.length > 0 || directStreams.length > 0) && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderBottom: `1px solid ${c.divider}`,
                }}>
                  <span style={{ fontSize: '12px', color: c.muted }}>{queueCount} active</span>
                  <button
                    onClick={clearCompleted}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      color: c.muted,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px 4px',
                      borderRadius: '6px',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = c.error; }}
                    onMouseLeave={e => { e.currentTarget.style.color = c.muted; }}
                  >
                    <TrashIcon />
                    Clear finished
                  </button>
                </div>
              )}

              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {queue.length === 0 && directStreams.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 0',
                    gap: '8px',
                    color: c.faint,
                  }}>
                    <span style={{ opacity: 0.3 }}><QueueIcon /></span>
                    <span style={{ fontSize: '13px' }}>No active generations</span>
                    <span style={{ fontSize: '11.5px', opacity: 0.7 }}>Active generations will appear here</span>
                  </div>
                ) : (
                  <>
                    {/* Direct active streams */}
                    {directStreams.map(stream => (
                      <div key={`${stream.tabId}::${stream.endpoint}`} style={{ ...rowStyle(true) }}>
                        <span style={{ color: c.info, flexShrink: 0, marginTop: '2px' }}>{StatusIcons.generating}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: c.text, lineHeight: 1.45 }}>
                            {stream.toolName}
                          </p>
                          <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: c.info, fontWeight: 500 }}>
                            Generating...
                          </p>
                        </div>
                        <button
                          onClick={() => cancelStream(stream.tabId, stream.endpoint)}
                          title="Cancel generation"
                          style={{
                            flexShrink: 0,
                            padding: '4px',
                            background: 'none',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: c.faint,
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.15s, background 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = c.error; e.currentTarget.style.background = `${c.error}18`; }}
                          onMouseLeave={e => { e.currentTarget.style.color = c.faint; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <CloseIcon size={16} />
                        </button>
                      </div>
                    ))}

                    {/* Generating queue items */}
                    {queue.filter(item => item.status === 'generating').map(item => (
                      <div key={item.id} style={{ ...rowStyle(true) }}>
                        {statusIcon(item.status)}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: c.text, lineHeight: 1.45 }}>
                            {item.label}
                          </p>
                          <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: c.info, fontWeight: 500 }}>
                            {statusLabel(item.status)}
                          </p>
                        </div>
                        <button
                          onClick={() => cancelGenerating(item.id)}
                          title="Cancel generation"
                          style={{
                            flexShrink: 0,
                            padding: '4px',
                            background: 'none',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: c.faint,
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.15s, background 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = c.error; e.currentTarget.style.background = `${c.error}18`; }}
                          onMouseLeave={e => { e.currentTarget.style.color = c.faint; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <CloseIcon size={16} />
                        </button>
                      </div>
                    ))}

                    {/* Waiting items (draggable) */}
                    {waitingItems.length > 0 && (
                      <div>
                        {waitingItems.length > 1 && (
                          <div style={{ padding: '6px 16px', borderBottom: `1px solid ${c.divider}` }}>
                            <p style={{ margin: 0, fontSize: '11.5px', color: c.muted }}>Drag to reorder waiting tasks</p>
                          </div>
                        )}
                        {waitingItems.map((item, index) => (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={e => handleDragStart(e, index)}
                            onDragOver={e => handleDragOver(e, index)}
                            onDrop={e => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '6px',
                              padding: '12px 16px',
                              borderBottom: `1px solid ${c.divider}`,
                              background: dragOverIndex === index ? c.unreadBg : 'transparent',
                              opacity: dragIndex === index ? 0.5 : 1,
                              cursor: 'grab',
                              transition: 'background 0.15s, opacity 0.15s',
                            }}
                          >
                            <span style={{ color: c.faint, flexShrink: 0, marginTop: '2px', opacity: 0.5 }}><GripIcon /></span>
                            {statusIcon(item.status)}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ margin: 0, fontSize: '13px', color: c.text, lineHeight: 1.45 }}>
                                {item.label}
                              </p>
                              <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: c.muted }}>
                                #{index + 1} in queue &middot; {formatDistanceToNow(item.addedAt, { addSuffix: true })}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromQueue(item.id)}
                              title="Remove from queue"
                              style={{
                                flexShrink: 0,
                                padding: '4px',
                                background: 'none',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: c.faint,
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'color 0.15s, background 0.15s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.color = c.error; e.currentTarget.style.background = `${c.error}18`; }}
                              onMouseLeave={e => { e.currentTarget.style.color = c.faint; e.currentTarget.style.background = 'transparent'; }}
                            >
                              <CloseIcon size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Completed / Error items */}
                    {queue.filter(item => item.status === 'completed' || item.status === 'error').map(item => (
                      <div key={item.id} style={{ ...rowStyle(false), opacity: 0.55 }}>
                        {statusIcon(item.status)}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: '13px', color: c.text, lineHeight: 1.45 }}>
                            {item.label}
                          </p>
                          <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: c.muted }}>
                            {statusLabel(item.status)}
                            {item.completedAt && ` · ${formatDistanceToNow(item.completedAt, { addSuffix: true })}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>,
    document.body
  );
};

export default NotificationPanel;
