import React from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import type { TeacherMetrics } from '../types/insights';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

interface MetricsNudgeBannerProps {
  metrics: TeacherMetrics | null;
  previousMetrics?: TeacherMetrics | null;
  dismissed: boolean;
  onDismiss: () => void;
  onTalkToCoach: (dimension?: string) => void;
}

const MetricsNudgeBanner: React.FC<MetricsNudgeBannerProps> = ({
  metrics,
  previousMetrics,
  dismissed,
  onDismiss,
  onTalkToCoach,
}) => {
  const { t } = useTranslation();
  if (!metrics || dismissed) return null;

  // Check nudge conditions
  const lowDimensions = Object.entries(metrics.dimensions)
    .filter(([, d]) => d.score < 60)
    .sort(([, a], [, b]) => a.score - b.score);

  const compositeBelow70 = metrics.composite_score < 70;

  // Check for significant drops
  let droppedDimension: string | null = null;
  if (previousMetrics) {
    for (const [key, dim] of Object.entries(metrics.dimensions)) {
      const prevDim = previousMetrics.dimensions[key as keyof typeof previousMetrics.dimensions];
      if (prevDim && (prevDim.score - dim.score) >= 10) {
        droppedDimension = key;
        break;
      }
    }
  }

  // Check for composite drop
  const compositeDrop = previousMetrics
    ? previousMetrics.composite_score - metrics.composite_score
    : 0;

  if (lowDimensions.length === 0 && !compositeBelow70 && !droppedDimension && compositeDrop < 5) {
    return null;
  }

  // Determine banner message
  let message: string;
  let targetDimension: string | undefined;

  if (compositeDrop >= 5 && previousMetrics) {
    message = t('metrics.scoreDropped', { from: Math.round(previousMetrics.composite_score), to: Math.round(metrics.composite_score) });
  } else if (lowDimensions.length > 0) {
    const [dimKey, dim] = lowDimensions[0];
    targetDimension = dimKey;
    message = t('metrics.dimensionLow', { dimension: dimKey, score: Math.round(dim.score) });
  } else if (droppedDimension) {
    targetDimension = droppedDimension;
    const dim = metrics.dimensions[droppedDimension as keyof typeof metrics.dimensions];
    message = t('metrics.dimensionDropped', { dimension: droppedDimension, score: Math.round(dim.score) });
  } else {
    message = t('metrics.compositeScore', { score: Math.round(metrics.composite_score) });
  }

  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-900/15 p-3 flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mt-0.5">
        <span className="text-blue-500 text-sm font-bold">EC</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-blue-800 dark:text-blue-300">{message}</p>
        <button
          onClick={() => onTalkToCoach(targetDimension)}
          className="mt-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          {t('metrics.talkToCoach')}
        </button>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors flex-shrink-0"
      >
        <Icon icon={Cancel01IconData} className="w-3.5 text-blue-400" />
      </button>
    </div>
  );
};

export default MetricsNudgeBanner;
