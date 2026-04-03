import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNotification, NotificationType } from '../contexts/NotificationContext';

// ─── Icons ───────────────────────────────────────────────────────────────────
const ICONS: Record<string, React.ReactNode> = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 8.2l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14.5 13H1.5L8 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M8 6.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="8" cy="11" r="0.6" fill="currentColor"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 7v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="8" cy="4.5" r="0.7" fill="currentColor"/>
    </svg>
  ),
};

// ─── Variants ─────────────────────────────────────────────────────────────────
const VARIANTS = {
  light: {
    success: { color: "#16a34a", bg: "rgba(240,253,244,0.78)", border: "rgba(187,247,208,0.65)", glow: "rgba(22,163,74,0.10)",  msg: "#6b7280", close: "#9ca3af" },
    error:   { color: "#dc2626", bg: "rgba(254,242,242,0.78)", border: "rgba(254,202,202,0.65)", glow: "rgba(220,38,38,0.10)",  msg: "#6b7280", close: "#9ca3af" },
    warning: { color: "#d97706", bg: "rgba(255,251,235,0.78)", border: "rgba(253,230,138,0.65)", glow: "rgba(217,119,6,0.10)",  msg: "#6b7280", close: "#9ca3af" },
    info:    { color: "#2563eb", bg: "rgba(239,246,255,0.78)", border: "rgba(191,219,254,0.65)", glow: "rgba(37,99,235,0.10)",  msg: "#6b7280", close: "#9ca3af" },
  },
  dark: {
    success: { color: "#4ade80", bg: "rgba(5,46,22,0.72)",    border: "rgba(22,101,52,0.55)",  glow: "rgba(74,222,128,0.10)",  msg: "#9ca3af", close: "#6b7280" },
    error:   { color: "#f87171", bg: "rgba(45,10,10,0.72)",   border: "rgba(127,29,29,0.55)",  glow: "rgba(248,113,113,0.10)", msg: "#9ca3af", close: "#6b7280" },
    warning: { color: "#fbbf24", bg: "rgba(28,18,8,0.72)",    border: "rgba(133,77,14,0.55)",  glow: "rgba(251,191,36,0.10)",  msg: "#9ca3af", close: "#6b7280" },
    info:    { color: "#60a5fa", bg: "rgba(10,22,40,0.72)",   border: "rgba(30,58,138,0.55)",  glow: "rgba(96,165,250,0.10)",  msg: "#9ca3af", close: "#6b7280" },
  },
};

// ─── Keyframes ────────────────────────────────────────────────────────────────
const toastStyles = `
  @keyframes toast-in {
    from { opacity: 0; transform: translateX(calc(100% + 24px)); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes toast-out {
    from { opacity: 1; transform: translateX(0); max-height: 100px; margin-bottom: 10px; }
    to   { opacity: 0; transform: translateX(calc(100% + 24px)); max-height: 0; margin-bottom: 0; }
  }
  @keyframes toast-progress {
    from { transform: scaleX(1); }
    to   { transform: scaleX(0); }
  }
  .toast-enter { animation: toast-in 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .toast-exit  { animation: toast-out 0.28s cubic-bezier(0.4, 0, 1, 1) forwards; }
`;

// ─── Toast item ───────────────────────────────────────────────────────────────
interface ToastItemProps {
  toast: {
    id: string;
    message: string;
    type: NotificationType;
    tabId?: string;
    duration?: number;
  };
  onDismiss: (id: string) => void;
  onNavigate?: (tabId: string) => void;
  isDark: boolean;
}

function ToastItem({ toast, onDismiss, onNavigate, isDark }: ToastItemProps) {
  const [exiting, setExiting] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef(Date.now());
  const remainRef = useRef(toast.duration ?? 4000);
  const duration = toast.duration ?? 4000;

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 280);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    if (!duration) return;
    timerRef.current = setTimeout(dismiss, remainRef.current);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [dismiss, duration]);

  const pause = () => {
    if (!duration) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    remainRef.current -= Date.now() - startRef.current;
    setPaused(true);
  };

  const resume = () => {
    if (!duration) return;
    startRef.current = Date.now();
    timerRef.current = setTimeout(dismiss, remainRef.current);
    setPaused(false);
  };

  const handleClick = () => {
    if (toast.tabId && onNavigate) {
      onNavigate(toast.tabId);
      onDismiss(toast.id);
    }
  };

  const theme = isDark ? 'dark' : 'light';
  const v = VARIANTS[theme][toast.type] ?? VARIANTS[theme].info;

  return (
    <div
      className={exiting ? 'toast-exit' : 'toast-enter'}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onClick={handleClick}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        width: '340px',
        padding: '14px 16px',
        background: v.bg,
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        border: `1px solid ${v.border}`,
        borderRadius: '14px',
        boxShadow: `0 8px 32px ${v.glow}, 0 2px 8px rgba(0,0,0,0.07), 0 0 0 0.5px ${v.border}`,
        cursor: toast.tabId ? 'pointer' : 'default',
        overflow: 'hidden',
        marginBottom: '10px',
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
      }}
    >
      <span style={{ color: v.color, flexShrink: 0, marginTop: '1px' }}>
        {ICONS[toast.type] ?? ICONS.info}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: '13.5px',
          fontWeight: 500,
          lineHeight: 1.4,
          color: v.color,
          letterSpacing: '-0.01em',
        }}>
          {toast.message}
        </p>
        {toast.tabId && (
          <p style={{
            margin: '2px 0 0',
            fontSize: '12px',
            lineHeight: 1.5,
            color: v.msg,
            fontWeight: 500,
          }}>
            Click to view
          </p>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          color: v.close,
          display: 'flex',
          alignItems: 'center',
          borderRadius: '4px',
          flexShrink: 0,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = v.color; }}
        onMouseLeave={e => { e.currentTarget.style.color = v.close; }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>

      {duration > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          width: '100%',
          background: v.color,
          transformOrigin: 'left',
          opacity: 0.45,
          animation: `toast-progress ${duration}ms linear forwards`,
          animationPlayState: paused ? 'paused' : 'running',
        }}/>
      )}
    </div>
  );
}

// ─── Update Banner ────────────────────────────────────────────────────────────
function UpdateBanner({ isDark }: { isDark: boolean }) {
  const { notify } = useNotification();
  const [updateReady, setUpdateReady] = useState(false);
  const [updateVersion, setUpdateVersion] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.electronAPI) return;

    window.electronAPI.onUpdateAvailable?.((info: any) => {
      notify(`Update v${info.version} is available — downloading...`, 'info');
    });

    window.electronAPI.onUpdateDownloaded?.((info: any) => {
      setUpdateVersion(info.version);
      setUpdateReady(true);
      notify(`Update v${info.version} is ready to install`, 'info');
    });
  }, []);

  useEffect(() => {
    if (updateReady && !dismissed) {
      requestAnimationFrame(() => setVisible(true));
    }
  }, [updateReady, dismissed]);

  if (!updateReady || dismissed) return null;

  const v = isDark ? VARIANTS.dark.info : VARIANTS.light.info;

  return (
    <div
      style={{
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        width: '340px',
        background: v.bg,
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        border: `1px solid ${v.border}`,
        borderRadius: '14px',
        boxShadow: `0 8px 32px ${v.glow}, 0 2px 8px rgba(0,0,0,0.07), 0 0 0 0.5px ${v.border}`,
        marginBottom: '10px',
        transition: 'all 0.25s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(60px) scale(0.95)',
      }}
    >
      <span style={{ color: v.color, flexShrink: 0 }}>
        {ICONS.info}
      </span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 2px', fontSize: '13.5px', fontWeight: 600, color: v.color }}>
          Update v{updateVersion} ready
        </p>
        <p style={{ margin: 0, fontSize: '12px', color: v.msg }}>
          Restart now to apply the update
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <button
          onClick={() => window.electronAPI?.installUpdate?.()}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 500,
            background: v.color,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          Restart
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            color: v.close,
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = v.color; }}
          onMouseLeave={e => { e.currentTarget.style.color = v.close; }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────
const ToastContainer: React.FC = () => {
  const { toasts, dismiss, navigateToTab } = useNotification();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{toastStyles}</style>
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}>
        <div style={{ pointerEvents: 'auto' }}>
          <UpdateBanner isDark={isDark} />
        </div>
        {toasts.map(toast => (
          <div key={toast.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem
              toast={toast}
              onDismiss={dismiss}
              onNavigate={toast.tabId ? navigateToTab : undefined}
              isDark={isDark}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ToastContainer;
