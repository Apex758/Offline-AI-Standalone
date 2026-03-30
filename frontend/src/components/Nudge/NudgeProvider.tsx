import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { NUDGE_RULES } from '../../lib/nudgeRules';
import { getModuleForTabType } from '../../lib/featureModules';
import { NudgeRule } from '../../types/feature-disclosure';
import NudgeToast from './NudgeToast';

interface NudgeContextValue {
  /** Call when the active tab type changes */
  evaluateNudges: (activeTabType: string) => void;
}

const NudgeContext = createContext<NudgeContextValue>({ evaluateNudges: () => {} });

export const useNudge = () => useContext(NudgeContext);

export const NudgeProvider: React.FC<{ children: React.ReactNode; onEnableModule?: (tabType: string) => void }> = ({ children, onEnableModule }) => {
  const { isModuleEnabled, toggleModule, shouldShowNudge, dismissNudge, hasCompletedSetup } = useSettings();
  const [activeNudge, setActiveNudge] = useState<(NudgeRule & { nudgeId: string }) | null>(null);
  const lastTabRef = useRef<string>('');

  const evaluateNudges = useCallback((activeTabType: string) => {
    if (!hasCompletedSetup) return;
    // Don't re-evaluate if same tab
    if (activeTabType === lastTabRef.current) return;
    lastTabRef.current = activeTabType;

    // Find first matching rule
    for (const rule of NUDGE_RULES) {
      if (rule.triggerTabType !== activeTabType) continue;
      if (isModuleEnabled(rule.disabledModule)) continue;

      const nudgeId = `${rule.triggerTabType}->${rule.disabledModule}`;
      if (!shouldShowNudge(nudgeId)) continue;

      setActiveNudge({ ...rule, nudgeId });
      return;
    }
  }, [hasCompletedSetup, isModuleEnabled, shouldShowNudge]);

  const handleDismiss = useCallback(() => {
    if (activeNudge) {
      dismissNudge(activeNudge.nudgeId);
      setActiveNudge(null);
    }
  }, [activeNudge, dismissNudge]);

  const handleEnable = useCallback(() => {
    if (activeNudge) {
      toggleModule(activeNudge.disabledModule);
      dismissNudge(activeNudge.nudgeId);
      if (activeNudge.navigateToTab && onEnableModule) {
        onEnableModule(activeNudge.navigateToTab);
      }
      setActiveNudge(null);
    }
  }, [activeNudge, toggleModule, dismissNudge, onEnableModule]);

  return (
    <NudgeContext.Provider value={{ evaluateNudges }}>
      {children}
      {activeNudge && (
        <NudgeToast
          message={activeNudge.message}
          ctaLabel={activeNudge.ctaLabel}
          onEnable={handleEnable}
          onDismiss={handleDismiss}
        />
      )}
    </NudgeContext.Provider>
  );
};
