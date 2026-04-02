import React, { useState, useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import CheckmarkCircle01IconData from '@hugeicons/core-free-icons/CheckmarkCircle01Icon';
import CancelCircleIconData from '@hugeicons/core-free-icons/CancelCircleIcon';
import InformationCircleIconData from '@hugeicons/core-free-icons/InformationCircleIcon';
import Download01IconData from '@hugeicons/core-free-icons/Download01Icon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties; size?: number }> = ({ icon, className = '', style, size: sizeProp }) => {
  if (sizeProp) return <HugeiconsIcon icon={icon} size={sizeProp} className={className} style={style} />;
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const CheckCircle2: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = (p) => <Icon icon={CheckmarkCircle01IconData} {...p} />;
const XCircle: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = (p) => <Icon icon={CancelCircleIconData} {...p} />;
const Info: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = (p) => <Icon icon={InformationCircleIconData} {...p} />;
const Download: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = (p) => <Icon icon={Download01IconData} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
import { useNotification } from '../contexts/NotificationContext';

function UpdateBanner() {
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

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-lg shadow-xl min-w-[300px] max-w-[400px] bg-white dark:bg-gray-800 border-l-4 border-blue-500 transition-all duration-250 ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
    >
      <Download className="text-blue-500 shrink-0" size={22} />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Update v{updateVersion} ready
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Restart now to apply the update
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => window.electronAPI?.installUpdate?.()}
          className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Restart
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

const iconMap = {
  success: <CheckCircle2 className="text-green-500 shrink-0" size={20} />,
  error: <XCircle className="text-red-500 shrink-0" size={20} />,
  info: <Info className="text-blue-500 shrink-0" size={20} />,
};

const borderMap = {
  success: 'border-green-500',
  error: 'border-red-500',
  info: 'border-blue-500',
};

function ToastItem({ toast, onDismiss, onNavigate }: { toast: any; onDismiss: (id: string) => void; onNavigate?: (tabId: string) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClick = () => {
    if (toast.tabId && onNavigate) {
      onNavigate(toast.tabId);
      onDismiss(toast.id);
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[260px] max-w-[360px] border-l-4 bg-white dark:bg-gray-800 ${borderMap[toast.type as keyof typeof borderMap]} transition-all duration-200 ${visible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-[60px] scale-95'} ${toast.tabId ? 'cursor-pointer hover:brightness-95 dark:hover:brightness-110' : ''}`}
      onClick={handleClick}
    >
      {iconMap[toast.type as keyof typeof iconMap]}
      <div className="flex-1 min-w-0">
        <span className="text-sm text-gray-800 dark:text-gray-200">{toast.message}</span>
        {toast.tabId && (
          <p className="text-xs text-blue-500 mt-0.5 font-medium">Click to view</p>
        )}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(toast.id); }}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0 ml-1"
      >
        <X size={16} />
      </button>
    </div>
  );
}

const ToastContainer: React.FC = () => {
  const { toasts, dismiss, navigateToTab } = useNotification();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <UpdateBanner key="update-banner" />
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} onNavigate={toast.tabId ? navigateToTab : undefined} />
      ))}
    </div>
  );
};

export default ToastContainer;
