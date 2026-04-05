import React from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import SaveIcon from '@hugeicons/core-free-icons/SaveIcon';
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

interface DraftSaveDialogProps {
  onSaveDraft: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

const DraftSaveDialog: React.FC<DraftSaveDialogProps> = ({ onSaveDraft, onDiscard, onCancel }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-theme-secondary border border-theme rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-theme-heading mb-2">{t('dialogs.saveDraft.title')}</h3>
        <p className="text-sm text-theme-body mb-6">
          {t('dialogs.saveDraft.message')}
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-theme text-theme-muted hover:bg-theme-hover transition"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onDiscard}
            className="px-4 py-2 text-sm rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition flex items-center gap-2"
          >
            <Icon icon={Delete02Icon} className="w-4 h-4" />
            {t('dialogs.saveDraft.discard')}
          </button>
          <button
            onClick={onSaveDraft}
            className="px-4 py-2 text-sm rounded-lg bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30 transition flex items-center gap-2"
          >
            <Icon icon={SaveIcon} className="w-4 h-4" />
            {t('dialogs.saveDraft.saveDraft')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftSaveDialog;
