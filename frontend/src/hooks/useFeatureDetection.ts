import { useMemo } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import type { DiscoverableFeature, DetectionStrategy } from '../data/featureDiscoveryData';

interface ToolUsageEntry {
  type: string;
  count: number;
}

interface DetectionContext {
  completedTutorials: string[];
  toolUsage: ToolUsageEntry[];
  discoveredFeatures: string[];
  settings: Record<string, any>;
}

function evaluateStrategy(strategy: DetectionStrategy, ctx: DetectionContext): boolean {
  switch (strategy.type) {
    case 'tutorial':
      return ctx.completedTutorials.includes(strategy.tutorialId);

    case 'toolUsage':
      return ctx.toolUsage.some(t => t.type === strategy.toolType && t.count > 0);

    case 'setting': {
      // Support nested keys like 'profile.displayName'
      const keys = strategy.key.split('.');
      let value: any = ctx.settings;
      for (const k of keys) {
        if (value == null) return false;
        value = value[k];
      }
      // Check truthy — for strings, must be non-empty; for booleans, must be true
      if (typeof value === 'string') return value.length > 0;
      if (typeof value === 'boolean') return value;
      if (Array.isArray(value)) return value.length > 0;
      return !!value;
    }

    case 'manual':
      return false; // Manual features are checked via discoveredFeatures below

    case 'composite':
      return strategy.strategies.some(s => evaluateStrategy(s, ctx));
  }
}

/**
 * Hook that evaluates which features have been used/discovered.
 * Returns a Map<featureId, boolean> and a progress summary.
 */
export function useFeatureDetection(features: DiscoverableFeature[]) {
  const { settings, isTutorialCompleted } = useSettings();

  const toolUsage: ToolUsageEntry[] = useMemo(() => {
    try {
      const stored = localStorage.getItem('dashboard-tool-usage');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const detectionMap = useMemo(() => {
    const ctx: DetectionContext = {
      completedTutorials: settings.tutorials.completedTutorials,
      toolUsage,
      discoveredFeatures: settings.discoveredFeatures || [],
      settings: settings as any,
    };

    const result = new Map<string, boolean>();
    for (const feature of features) {
      // Check auto-detection first, then manual override
      const autoDetected = evaluateStrategy(feature.detectionStrategy, ctx);
      const manuallyMarked = ctx.discoveredFeatures.includes(feature.id);
      result.set(feature.id, autoDetected || manuallyMarked);
    }
    return result;
  }, [features, settings, toolUsage]);

  const discoveredCount = useMemo(() => {
    let count = 0;
    detectionMap.forEach(v => { if (v) count++; });
    return count;
  }, [detectionMap]);

  return {
    detectionMap,
    discoveredCount,
    totalCount: features.length,
    percentage: features.length > 0 ? Math.round((discoveredCount / features.length) * 100) : 0,
  };
}
