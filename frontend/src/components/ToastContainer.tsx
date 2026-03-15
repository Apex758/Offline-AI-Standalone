import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, Download, X } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

function UpdateBanner() {
  const { notify } = useNotification();
  const [updateReady, setUpdateReady] = useState(false);
  const [updateVersion, setUpdateVersion] = useState('');
  const [dismissed, setDismissed] = useState(false);

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

  if (!updateReady || dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-lg shadow-xl min-w-[300px] max-w-[400px] bg-white dark:bg-gray-800 border-l-4 border-blue-500"
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
    </motion.div>
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

const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useNotification();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        <UpdateBanner key="update-banner" />
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[260px] max-w-[360px] border-l-4 bg-white dark:bg-gray-800 ${borderMap[toast.type]}`}
          >
            {iconMap[toast.type]}
            <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0 ml-1"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
