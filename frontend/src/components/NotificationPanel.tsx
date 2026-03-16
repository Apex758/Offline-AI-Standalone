import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import CheckmarkCircle01IconData from '@hugeicons/core-free-icons/CheckmarkCircle01Icon';
import CancelCircleIconData from '@hugeicons/core-free-icons/CancelCircleIcon';
import Notification01IconData from '@hugeicons/core-free-icons/Notification01Icon';
import Delete02IconData from '@hugeicons/core-free-icons/Delete02Icon';
import CheckListIconData from '@hugeicons/core-free-icons/CheckListIcon';
import Loading02IconData from '@hugeicons/core-free-icons/Loading02Icon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import DragDropVerticalIconData from '@hugeicons/core-free-icons/DragDropVerticalIcon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties; size?: number }> = ({ icon, className = '', style, size: sizeProp }) => {
  if (sizeProp) return <HugeiconsIcon icon={icon} size={sizeProp} className={className} style={style} />;
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const CheckCircle2: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = (p) => <Icon icon={CheckmarkCircle01IconData} {...p} />;
const XCircle: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = (p) => <Icon icon={CancelCircleIconData} {...p} />;
const Bell: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = (p) => <Icon icon={Notification01IconData} {...p} />;
const Trash2: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = (p) => <Icon icon={Delete02IconData} {...p} />;
const ListOrdered: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = (p) => <Icon icon={CheckListIconData} {...p} />;
const Loader2: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = (p) => <Icon icon={Loading02IconData} {...p} />;
const Clock: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = (p) => <Icon icon={Clock01IconData} {...p} />;
const GripVertical: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = (p) => <Icon icon={DragDropVerticalIconData} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
import { formatDistanceToNow } from 'date-fns';
import { useNotification } from '../contexts/NotificationContext';
import { useQueue, QueueItem } from '../contexts/QueueContext';
import { useWebSocket } from '../contexts/WebSocketContext';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

type PanelTab = 'notifications' | 'queue';

const NotificationPanel: React.FC<NotificationPanelProps> = ({ open, onClose }) => {
  const { history, unreadCount, markAllRead, clearHistory } = useNotification();
  const { queue, removeFromQueue, reorderQueue, clearCompleted, queueEnabled } = useQueue();
  const { getActiveStreams } = useWebSocket();
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<PanelTab>('notifications');

  // Drag state for reordering
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Mark all as read when the panel is opened
  useEffect(() => {
    if (open && unreadCount > 0) markAllRead();
  }, [open]);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open, onClose]);

  const waitingItems = queue.filter(item => item.status === 'waiting');
  const activeStreams = getActiveStreams();
  // Filter out streams that are already tracked by the queue to avoid duplicates
  const queuedTabEndpoints = new Set(
    queue.filter(item => item.status === 'generating').map(item => `${item.tabId}::${item.endpoint}`)
  );
  const directStreams = activeStreams.filter(s => !queuedTabEndpoints.has(`${s.tabId}::${s.endpoint}`));
  const queueCount = queue.filter(item => item.status === 'waiting' || item.status === 'generating').length + directStreams.length;

  const getStatusIcon = (status: QueueItem['status']) => {
    switch (status) {
      case 'waiting':
        return <Clock size={15} className="text-yellow-500 shrink-0 mt-0.5" />;
      case 'generating':
        return <Loader2 size={15} className="text-blue-500 shrink-0 mt-0.5 animate-spin" />;
      case 'completed':
        return <CheckCircle2 size={15} className="text-green-500 shrink-0 mt-0.5" />;
      case 'error':
        return <XCircle size={15} className="text-red-500 shrink-0 mt-0.5" />;
    }
  };

  const getStatusLabel = (status: QueueItem['status']) => {
    switch (status) {
      case 'waiting': return 'Waiting';
      case 'generating': return 'Generating...';
      case 'completed': return 'Completed';
      case 'error': return 'Failed';
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Make the drag image slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== toIndex) {
      reorderQueue(dragIndex, toIndex);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="fixed top-11 right-2 w-96 rounded-xl shadow-2xl overflow-hidden z-[99999]"
          style={{
            backgroundColor: 'var(--notif-bg)',
            border: '1px solid var(--notif-border)',
          }}
        >
          {/* Tab Header */}
          <div className="flex" style={{ borderBottom: '1px solid var(--notif-divider)' }}>
            <button
              onClick={() => setActiveTab('notifications')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors relative"
              style={{
                color: activeTab === 'notifications' ? 'var(--notif-text)' : 'var(--notif-text-muted)',
                backgroundColor: activeTab === 'notifications' ? 'var(--notif-unread-bg)' : 'transparent',
              }}
            >
              <Bell size={14} />
              Notifications
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-blue-500 text-white leading-none">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors relative"
              style={{
                color: activeTab === 'queue' ? 'var(--notif-text)' : 'var(--notif-text-muted)',
                backgroundColor: activeTab === 'queue' ? 'var(--notif-unread-bg)' : 'transparent',
              }}
            >
              <ListOrdered size={14} />
              Queue
              {queueCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-500 text-white leading-none">
                  {queueCount}
                </span>
              )}
            </button>
          </div>

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <>
              {/* Clear all button */}
              {history.length > 0 && (
                <div className="flex justify-end px-4 py-2" style={{ borderBottom: '1px solid var(--notif-divider)' }}>
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-1 text-xs hover:text-red-400 transition"
                    style={{ color: 'var(--notif-text-muted)' }}
                  >
                    <Trash2 size={12} />
                    Clear all
                  </button>
                </div>
              )}

              <div className="max-h-72 overflow-y-auto">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2" style={{ color: 'var(--notif-text-faint)' }}>
                    <Bell size={26} className="opacity-25" />
                    <span className="text-sm">No notifications yet</span>
                  </div>
                ) : (
                  history.map(item => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 px-4 py-3 last:border-0"
                      style={{
                        borderBottom: '1px solid var(--notif-divider)',
                        backgroundColor: !item.read ? 'var(--notif-unread-bg)' : 'transparent',
                      }}
                    >
                      {item.type === 'success' ? (
                        <CheckCircle2 size={15} className="text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-snug" style={{ color: 'var(--notif-text)' }}>{item.message}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--notif-text-muted)' }}>
                          {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Queue Tab */}
          {activeTab === 'queue' && (
            <>
              {/* Queue actions bar */}
              {(queue.length > 0 || directStreams.length > 0) && (
                <div className="flex justify-between items-center px-4 py-2" style={{ borderBottom: '1px solid var(--notif-divider)' }}>
                  <span className="text-xs" style={{ color: 'var(--notif-text-muted)' }}>
                    {queueCount} active
                  </span>
                  <button
                    onClick={clearCompleted}
                    className="flex items-center gap-1 text-xs hover:text-red-400 transition"
                    style={{ color: 'var(--notif-text-muted)' }}
                  >
                    <Trash2 size={12} />
                    Clear finished
                  </button>
                </div>
              )}

              <div className="max-h-80 overflow-y-auto">
                {queue.length === 0 && directStreams.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2" style={{ color: 'var(--notif-text-faint)' }}>
                    <ListOrdered size={26} className="opacity-25" />
                    <span className="text-sm">No active generations</span>
                    <span className="text-xs opacity-75">Active generations will appear here</span>
                  </div>
                ) : (
                  <>
                    {/* Direct (non-queued) active generations */}
                    {directStreams.map(stream => (
                      <div
                        key={`${stream.tabId}::${stream.endpoint}`}
                        className="flex items-start gap-3 px-4 py-3"
                        style={{
                          borderBottom: '1px solid var(--notif-divider)',
                          backgroundColor: 'var(--notif-unread-bg)',
                        }}
                      >
                        <Loader2 size={15} className="text-blue-500 shrink-0 mt-0.5 animate-spin" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-snug" style={{ color: 'var(--notif-text)' }}>
                            {stream.toolName}
                          </p>
                          <p className="text-xs mt-0.5 text-blue-500 font-medium">
                            Generating...
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Queued - currently generating */}
                    {queue.filter(item => item.status === 'generating').map(item => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 px-4 py-3"
                        style={{
                          borderBottom: '1px solid var(--notif-divider)',
                          backgroundColor: 'var(--notif-unread-bg)',
                        }}
                      >
                        {getStatusIcon(item.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-snug" style={{ color: 'var(--notif-text)' }}>
                            {item.label}
                          </p>
                          <p className="text-xs mt-0.5 text-blue-500 font-medium">
                            {getStatusLabel(item.status)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Waiting items - draggable */}
                    {waitingItems.length > 0 && (
                      <div>
                        {waitingItems.length > 1 && (
                          <div className="px-4 py-1.5" style={{ borderBottom: '1px solid var(--notif-divider)' }}>
                            <p className="text-xs" style={{ color: 'var(--notif-text-muted)' }}>
                              Drag to reorder waiting tasks
                            </p>
                          </div>
                        )}
                        {waitingItems.map((item, index) => (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className="flex items-start gap-2 px-4 py-3 cursor-grab active:cursor-grabbing transition-colors"
                            style={{
                              borderBottom: '1px solid var(--notif-divider)',
                              backgroundColor: dragOverIndex === index ? 'var(--notif-unread-bg)' : 'transparent',
                              opacity: dragIndex === index ? 0.5 : 1,
                            }}
                          >
                            <GripVertical size={14} className="shrink-0 mt-0.5 opacity-40" style={{ color: 'var(--notif-text-muted)' }} />
                            {getStatusIcon(item.status)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm leading-snug" style={{ color: 'var(--notif-text)' }}>
                                {item.label}
                              </p>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--notif-text-muted)' }}>
                                #{index + 1} in queue &middot; {formatDistanceToNow(item.addedAt, { addSuffix: true })}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromQueue(item.id)}
                              className="shrink-0 p-1.5 rounded hover:bg-red-500/20 transition"
                              title="Remove from queue"
                            >
                              <X size={18} className="text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Completed / Error items */}
                    {queue.filter(item => item.status === 'completed' || item.status === 'error').map(item => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 px-4 py-3 opacity-60"
                        style={{
                          borderBottom: '1px solid var(--notif-divider)',
                        }}
                      >
                        {getStatusIcon(item.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-snug" style={{ color: 'var(--notif-text)' }}>
                            {item.label}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--notif-text-muted)' }}>
                            {getStatusLabel(item.status)}
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
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default NotificationPanel;
