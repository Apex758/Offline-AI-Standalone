import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useNotification();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[260px] max-w-[360px] border-l-4 ${
              toast.type === 'success'
                ? 'bg-white dark:bg-gray-800 border-green-500'
                : 'bg-white dark:bg-gray-800 border-red-500'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="text-green-500 shrink-0" size={20} />
            ) : (
              <XCircle className="text-red-500 shrink-0" size={20} />
            )}
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
