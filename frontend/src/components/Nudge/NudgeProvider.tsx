import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { NUDGE_RULES } from '../../lib/nudgeRules';
import { getModuleForTabType } from '../../lib/featureModules';
import { NudgeRule } from '../../types/feature-disclosure';
import NudgeToast from './NudgeToast';
import { ProgressionToast } from './ProgressionToast';
import { getNextSuggestion, ToolStep } from '../../lib/workflowProgression';

interface NudgeContextValue {
  /** Call when the active tab type changes */
  evaluateNudges: (activeTabType: string) => void;
}

const NudgeContext = createContext<NudgeContextValue>({ evaluateNudges: () => {} });

export const useNudge = () => useContext(NudgeContext);

export const NudgeProvider: React.FC<{ children: React.ReactNode; onEnableModule?: (tabType: string) => void }> = ({ children, onEnableModule }) => {
  const { settings, isModuleEnabled, toggleModule, shouldShowNudge, dismissNudge, hasCompletedSetup, trackToolVisit, dismissProgression } = useSettings();
  const [activeNudge, setActiveNudge] = useState<(NudgeRule & { nudgeId: string }) | null>(null);
  const [progressionSuggestion, setProgressionSuggestion] = useState<ToolStep | null>(null);
  const lastTabRef = useRef<string>('');
  const progressionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const evaluateNudges = useCallback((activeTabType: string) => {
    if (!hasCompletedSetup) return;
    // Don't re-evaluate if same tab
    if (activeTabType === lastTabRef.current) return;
    lastTabRef.current = activeTabType;

    // Clear any pending progression timer
    if (progressionTimerRef.current) {
      clearTimeout(progressionTimerRef.current);
      progressionTimerRef.current = null;
    }

    // Find first matching nudge rule (module nudges take priority)
    let nudgeFound = false;
    for (const rule of NUDGE_RULES) {
      if (rule.triggerTabType !== activeTabType) continue;
      if (isModuleEnabled(rule.disabledModule)) continue;

      const nudgeId = `${rule.triggerTabType}->${rule.disabledModule}`;
      if (!shouldShowNudge(nudgeId)) continue;

      setActiveNudge({ ...rule, nudgeId });
      setProgressionSuggestion(null);
      nudgeFound = true;
      return;
    }

    // No module nudge — check for progression suggestion after a short delay
    if (!nudgeFound) {
      progressionTimerRef.current = setTimeout(() => {
        const enabledModules = settings.tutorials.enabledModules || [];
        const suggestion = getNextSuggestion(
          enabledModules,
          settings.workflowProgress.visitedTools,
          settings.workflowProgress.dismissedProgressions,
        );
        setProgressionSuggestion(suggestion);
      }, 2000);
    }
  }, [hasCompletedSetup, isModuleEnabled, shouldShowNudge, settings.tutorials.enabledModules, settings.workflowProgress]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (progressionTimerRef.current) clearTimeout(progressionTimerRef.current);
    };
  }, []);

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

  const handleProgressionAccept = useCallback((toolType: string) => {
    trackToolVisit(toolType);
    setProgressionSuggestion(null);
    if (onEnableModule) {
      onEnableModule(toolType);
    }
  }, [trackToolVisit, onEnableModule]);

  const handleProgressionDismiss = useCallback((toolType: string) => {
    dismissProgression(toolType);
    setProgressionSuggestion(null);
  }, [dismissProgression]);

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
      {!activeNudge && progressionSuggestion && (
        <ProgressionToast
          suggestion={progressionSuggestion}
          onAccept={handleProgressionAccept}
          onDismiss={handleProgressionDismiss}
        />
      )}
    </NudgeContext.Provider>
  );
};
