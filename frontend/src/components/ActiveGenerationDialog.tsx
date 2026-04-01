import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import AlertCircleIconData from '@hugeicons/core-free-icons/AlertCircleIcon';
import CancelCircleIcon from '@hugeicons/core-free-icons/CancelCircleIcon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

interface ActiveGenerationDialogProps {
  /** What is being closed — used in the message */
  target: 'tab' | 'tabs' | 'window';
  /** How many active generations are affected */
  activeCount: number;
  /** Called when user confirms they want to stop & close */
  onConfirm: () => void;
  /** Called when user cancels */
  onCancel: () => void;
}

const ActiveGenerationDialog: React.FC<ActiveGenerationDialogProps> = ({ target, activeCount, onConfirm, onCancel }) => {
  const targetLabel = target === 'window' ? 'the application' : target === 'tabs' ? 'these tabs' : 'this tab';
  const genLabel = activeCount === 1 ? 'a generation' : `${activeCount} generations`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-theme-secondary border border-theme rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
            <Icon icon={AlertCircleIconData} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-theme-heading">Generation in Progress</h3>
            <p className="text-sm text-theme-body mt-1">
              You have {genLabel} still running. Closing {targetLabel} will stop {activeCount === 1 ? 'it' : 'them'} and any incomplete output will be lost.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-theme text-theme-muted hover:bg-theme-hover transition"
          >
            Keep Generating
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition flex items-center gap-2"
          >
            <Icon icon={CancelCircleIcon} className="w-4 h-4" />
            Stop & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveGenerationDialog;
