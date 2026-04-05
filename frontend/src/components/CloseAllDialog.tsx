import React from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import AlertCircleIconData from '@hugeicons/core-free-icons/AlertCircleIcon';
import SaveIconData from '@hugeicons/core-free-icons/SaveIcon';
import CancelCircleIconData from '@hugeicons/core-free-icons/CancelCircleIcon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

export interface CloseAllSummary {
  /** Tab names with unsaved drafts */
  draftTabs: string[];
  /** Tab names with active generations */
  generatingTabs: string[];
  /** Total tabs being closed */
  totalTabs: number;
}

interface CloseAllDialogProps {
  summary: CloseAllSummary;
  /** Label for what's being closed: "all tabs", "Quiz Builder tabs", etc. */
  targetLabel: string;
  /** Save all drafts, then close everything */
  onSaveAndClose: () => void;
  /** Discard drafts & stop generations, close everything */
  onDiscardAll: () => void;
  /** Close only safe tabs (skip generating + draft tabs) */
  onCloseOnlySafe: () => void;
  /** Cancel — do nothing */
  onCancel: () => void;
}

const CloseAllDialog: React.FC<CloseAllDialogProps> = ({
  summary,
  targetLabel,
  onSaveAndClose,
  onDiscardAll,
  onCloseOnlySafe,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { draftTabs, generatingTabs, totalTabs } = summary;
  const hasDrafts = draftTabs.length > 0;
  const hasGenerating = generatingTabs.length > 0;
  const safeCount = totalTabs - draftTabs.length - generatingTabs.length;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-theme-secondary border border-theme rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
            <Icon icon={AlertCircleIconData} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-theme-heading">
              Close {targetLabel}?
            </h3>
            <p className="text-sm text-theme-body mt-1">
              You're about to close {totalTabs} tab{totalTabs !== 1 ? 's' : ''}. Some need your attention:
            </p>
          </div>
        </div>

        {/* Summary Sections */}
        <div className="space-y-2 mb-5">
          {hasDrafts && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20">
              <Icon icon={SaveIconData} className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-theme-heading">
                  {draftTabs.length} tab{draftTabs.length !== 1 ? 's' : ''} with unsaved form data
                </p>
                <p className="text-xs text-theme-muted mt-0.5">
                  {draftTabs.join(', ')}
                </p>
              </div>
            </div>
          )}

          {hasGenerating && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="w-4 h-4 mt-0.5 shrink-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-medium text-theme-heading">
                  {generatingTabs.length} tab{generatingTabs.length !== 1 ? 's' : ''} still generating
                </p>
                <p className="text-xs text-theme-muted mt-0.5">
                  {generatingTabs.join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-theme text-theme-muted hover:bg-theme-hover transition"
          >
            {t('common.cancel')}
          </button>

          {safeCount > 0 && (hasDrafts || hasGenerating) && (
            <button
              onClick={onCloseOnlySafe}
              className="px-4 py-2 text-sm rounded-lg border border-theme text-theme-body hover:bg-theme-hover transition"
            >
              Close only safe tabs ({safeCount})
            </button>
          )}

          {hasDrafts && (
            <button
              onClick={onSaveAndClose}
              className="px-4 py-2 text-sm rounded-lg bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30 transition flex items-center gap-2"
            >
              <Icon icon={SaveIconData} className="w-4 h-4" />
              {t('dialogs.closeAll.saveDraftsCloseAll')}
            </button>
          )}

          <button
            onClick={onDiscardAll}
            className="px-4 py-2 text-sm rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition flex items-center gap-2"
          >
            <Icon icon={CancelCircleIconData} className="w-4 h-4" />
            {hasDrafts ? t('dialogs.closeAll.discardCloseAll') : t('dialogs.closeAll.stopCloseAll')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloseAllDialog;
