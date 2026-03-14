import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Bell, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotification } from '../contexts/NotificationContext';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ open, onClose }) => {
  const { history, unreadCount, markAllRead, clearHistory } = useNotification();
  const panelRef = useRef<HTMLDivElement>(null);

  // Mark all as read when the panel is opened
  useEffect(() => {
    if (open && unreadCount > 0) markAllRead();
  }, [open]);

  // Close when clicking outside (bell button uses stopPropagation so it won't trigger this)
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

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="fixed top-11 right-2 w-80 rounded-xl shadow-2xl overflow-hidden z-[99999]"
          style={{
            backgroundColor: 'var(--notif-bg)',
            border: '1px solid var(--notif-border)',
          }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--notif-divider)' }}>
              <div className="flex items-center gap-2">
                <Bell size={14} style={{ color: 'var(--notif-text-muted)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--notif-text)' }}>Notifications</span>
              </div>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-xs hover:text-red-400 transition"
                  style={{ color: 'var(--notif-text-muted)' }}
                >
                  <Trash2 size={12} />
                  Clear all
                </button>
              )}
            </div>

            {/* List */}
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
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default NotificationPanel;
