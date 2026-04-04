import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GradeSubjectMapping, SUBJECTS } from '../data/teacherConstants';
import { FeatureModuleId, NudgeState } from '../types/feature-disclosure';
import { getEnabledSidebarItems } from '../lib/featureModules';
import { NUDGE_COOLDOWN_MS } from '../lib/nudgeRules';

// TypeScript Interfaces
export interface TabColors {
  analytics: string;
  chat: string;
  curriculum: string;
  'lesson-planner': string;
  'kindergarten-planner': string;
  'multigrade-planner': string;
  'cross-curricular-planner': string;
  'quiz-generator': string;
  'rubric-generator': string;
  'resource-manager': string;
  'curriculum-tracker': string;
  'worksheet-generator': string;
  'image-studio': string;
  'class-management': string;
  support: string;
  settings: string;
  'brain-dump': string;
  'performance-metrics': string;
  'presentation-builder': string;
  'achievements': string;
  'storybook': string;
  'educator-insights': string;
}

export interface TutorialState {
  completedTutorials: string[];
  hasSeenWelcome: boolean;
  hasCompletedSetup: boolean;
  enabledModules: FeatureModuleId[];
  tutorialPreferences: {
    autoShowOnFirstUse: boolean;
    showFloatingButtons: boolean;
  };
}

export interface UserProfile {
  displayName: string;
  school: string;
  gradeSubjects: GradeSubjectMapping;
  filterContentByProfile: boolean;
  registrationDate?: string;
  // Legacy fields — kept for migration only
  gradeLevels?: string[];
  subjects?: string[];
}

export interface SidebarItemConfig {
  id: string;
  enabled: boolean;
}

// Canonical list of reorderable sidebar items (excludes pinned: analytics at top, support+settings at bottom)
export const DEFAULT_SIDEBAR_ORDER: SidebarItemConfig[] = [
  { id: 'chat', enabled: true },
  { id: 'curriculum', enabled: true },
  { id: 'planning-prep', enabled: true },
  { id: 'lesson-planners', enabled: true },
  { id: 'assessment-tools', enabled: true },
  { id: 'my-classroom', enabled: true },
  { id: 'visual-studio', enabled: false },
  // Pinned items still tracked here for enabled/disabled state
  { id: 'educator-insights', enabled: true },
  { id: 'performance-metrics', enabled: false },
];

// All valid reorderable IDs
const CANONICAL_IDS = DEFAULT_SIDEBAR_ORDER.map(i => i.id);

export interface NotificationPreferences {
  desktopEnabled: boolean;
  inAppEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;   // "HH:MM"
  quietHoursEnd: string;     // "HH:MM"
  persistentDesktop: boolean;
  enabledEventTypes: {
    exam: boolean;
    midterm: boolean;
    grading_deadline: boolean;
    report_card: boolean;
    custom: boolean;
  };
}

export interface Settings {
  fontSize: number; // Percentage (100 = default)
  tabColors: TabColors;
  aiModel: string;
  oakKey: string;
  autoCloseTabsOnExit: boolean;
  theme: 'light' | 'dark' | 'system';
  sidebarColor: string;
  tutorials: TutorialState;
  generationMode: 'queued' | 'simultaneous';
  // Legacy fields — kept for migration only
  teacherSubjects?: string[];
  teacherGradeLevels?: string[];
  profile: UserProfile;
  // Sidebar ordering & visibility
  sidebarOrder: SidebarItemConfig[];
  // Writing assistant features
  spellCheckEnabled: boolean;
  autocorrectEnabled: boolean;
  autoFinishEnabled: boolean;
  dictionaryEnabled: boolean;
  // System behavior
  minimizeToTray: boolean;
  startOnBoot: boolean;
  // File access
  fileAccessEnabled: boolean;
  // Thinking mode (for Qwen2.5/Qwen3 models)
  thinkingEnabled: boolean;
  // Feature discovery
  discoveredFeatures: string[];
  // Nudge system
  nudgeState: NudgeState;
  // Display comfort
  brightness: number;       // 50–150, default 100
  warmTone: number;          // 0–100, default 0
  warmToneEnabled: boolean;
  // Trophy showcase
  showTrophiesByDefault: boolean;
  // Notifications & reminders
  notifications: NotificationPreferences;
}

export interface SettingsContextValue {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
  markTutorialComplete: (tutorialId: string) => void;
  isTutorialCompleted: (tutorialId: string) => boolean;
  resetTutorials: () => void;
  setWelcomeSeen: (seen: boolean) => void;
  isSidebarItemEnabled: (id: string) => boolean;
  markFeatureDiscovered: (featureId: string) => void;
  isFeatureDiscovered: (featureId: string) => boolean;
  // Setup wizard
  hasCompletedSetup: boolean;
  completeSetup: (modules: FeatureModuleId[], profile?: Partial<UserProfile>) => void;
  resetSetup: () => void;
  // Nudge system
  dismissNudge: (nudgeId: string) => void;
  shouldShowNudge: (nudgeId: string) => boolean;
  isModuleEnabled: (moduleId: FeatureModuleId) => boolean;
  toggleModule: (moduleId: FeatureModuleId) => void;
}

// Default Settings (hex colors matching Settings.tsx defaults)
export const DEFAULT_SETTINGS: Settings = {
  fontSize: 100,
  tabColors: {
    'analytics': '#3b82f6',
    'chat': '#3b82f6',
    'curriculum': '#8b5cf6',
    'lesson-planner': '#f59e0b',
    'kindergarten-planner': '#ec4899',
    'multigrade-planner': '#06b6d4',
    'cross-curricular-planner': '#6366f1',
    'quiz-generator': '#14b8a6',
    'rubric-generator': '#f97316',
    'resource-manager': '#84cc16',
    'curriculum-tracker': '#22c55e',
    'worksheet-generator': '#8b5cf6',
    'image-studio': '#ec4899',
    'class-management': '#f97316',
    'support': '#3b82f6',
    'settings': '#6b7280',
    'brain-dump': '#a855f7',
    'performance-metrics': '#10b981',
    'presentation-builder': '#f97316',
    'achievements': '#f59e0b',
    'storybook': '#a855f7',
    'educator-insights': '#d97706',
  },
  aiModel: 'anthropic/claude-sonnet-4.5',
  oakKey: '',
  autoCloseTabsOnExit: false,
  theme: 'system',
  sidebarColor: '#21201e',
  tutorials: {
    completedTutorials: [],
    hasSeenWelcome: false,
    hasCompletedSetup: false,
    enabledModules: [],
    tutorialPreferences: {
      autoShowOnFirstUse: true,
      showFloatingButtons: true
    }
  },
  generationMode: 'queued',
  profile: {
    displayName: '',
    school: '',
    gradeSubjects: {},
    filterContentByProfile: true,
  },
  sidebarOrder: DEFAULT_SIDEBAR_ORDER,
  // Writing assistant defaults
  spellCheckEnabled: true,
  autocorrectEnabled: true,
  autoFinishEnabled: false,
  dictionaryEnabled: true,
  // System behavior
  minimizeToTray: false,
  startOnBoot: false,
  // File access
  fileAccessEnabled: false,
  // Thinking mode
  thinkingEnabled: false,
  // Feature discovery
  discoveredFeatures: [],
  // Nudge system
  nudgeState: {
    dismissedNudges: [],
    nudgeCooldowns: {},
  },
  // Display comfort
  brightness: 100,
  warmTone: 0,
  warmToneEnabled: false,
  // Trophy showcase
  showTrophiesByDefault: false,
  // Notifications & reminders
  notifications: {
    desktopEnabled: true,
    inAppEnabled: true,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    persistentDesktop: false,
    enabledEventTypes: {
      exam: true,
      midterm: true,
      grading_deadline: true,
      report_card: true,
      custom: true,
    },
  },
};

// localStorage key
const STORAGE_KEY = 'app-settings-main';

// Create Context
const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

// Helper function to migrate old tutorial data
const migrateTutorialData = (): Partial<TutorialState> => {
  const migrated: Partial<TutorialState> = {};

  try {
    // Migrate old dashboard tutorial completion
    const oldDashboardTutorial = localStorage.getItem('dashboard-tutorial-completed');
    if (oldDashboardTutorial === 'true') {
      migrated.completedTutorials = ['dashboard-main'];
      migrated.hasSeenWelcome = true;
      // Clean up old key
      localStorage.removeItem('dashboard-tutorial-completed');
    }
  } catch (error) {
    console.error('Error migrating tutorial data:', error);
  }

  return migrated;
};

// Old individual IDs that have been merged into groups
const MIGRATED_TO_GROUP: Record<string, string> = {
  'brain-dump': 'planning-prep',
  'resource-manager': 'planning-prep',
  'quiz-generator': 'assessment-tools',
  'rubric-generator': 'assessment-tools',
  'class-management': 'my-classroom',
  'curriculum-tracker': 'my-classroom',
  'achievements': 'my-classroom',
};

// Old IDs that are now pinned (kept in order for enabled state but not reorderable)
const NOW_PINNED = new Set(['educator-insights', 'performance-metrics']);

// Migrate old visualStudioEnabled / performanceMetricsEnabled into sidebarOrder
const migrateSidebarOrder = (parsed: any): SidebarItemConfig[] => {
  // If sidebarOrder already exists, validate and fill in missing items
  if (Array.isArray(parsed.sidebarOrder) && parsed.sidebarOrder.length > 0) {
    const existingIds = new Set(parsed.sidebarOrder.map((i: any) => i.id));

    // Migrate old individual IDs to new group IDs
    let order: SidebarItemConfig[] = [];
    const addedGroups = new Set<string>();
    for (const item of parsed.sidebarOrder) {
      const groupId = MIGRATED_TO_GROUP[item.id];
      if (groupId) {
        // Replace old individual item with its group (only once, preserve enabled if any member was enabled)
        if (!addedGroups.has(groupId)) {
          addedGroups.add(groupId);
          // Enable the group if any of its old members were enabled
          const groupEnabled = parsed.sidebarOrder
            .filter((i: any) => MIGRATED_TO_GROUP[i.id] === groupId)
            .some((i: any) => i.enabled);
          order.push({ id: groupId, enabled: groupEnabled });
        }
      } else if (!MIGRATED_TO_GROUP[item.id]) {
        order.push(item);
      }
    }

    const newExistingIds = new Set(order.map((i: any) => i.id));
    // Append any new canonical IDs that weren't in the saved order
    for (const item of DEFAULT_SIDEBAR_ORDER) {
      if (!newExistingIds.has(item.id)) {
        order.push({ ...item });
      }
    }
    // Remove any IDs that are no longer canonical
    return order.filter((i: any) => CANONICAL_IDS.includes(i.id));
  }

  // No sidebarOrder — build from old boolean flags
  const order = DEFAULT_SIDEBAR_ORDER.map(item => {
    if (item.id === 'visual-studio' && parsed.visualStudioEnabled !== undefined) {
      return { ...item, enabled: !!parsed.visualStudioEnabled };
    }
    if (item.id === 'performance-metrics' && parsed.performanceMetricsEnabled !== undefined) {
      return { ...item, enabled: !!parsed.performanceMetricsEnabled };
    }
    return { ...item };
  });

  return order;
};

// Migrate old flat gradeLevels+subjects and teacherSubjects/teacherGradeLevels into gradeSubjects mapping
const migrateGradeSubjects = (parsed: any): GradeSubjectMapping => {
  const profile = parsed.profile || {};
  // If gradeSubjects already exists and has data, sanitize against current SUBJECTS list
  if (profile.gradeSubjects && Object.keys(profile.gradeSubjects).length > 0) {
    const validSubjects = new Set(SUBJECTS as readonly string[]);
    const sanitized: GradeSubjectMapping = {};
    for (const [grade, subjects] of Object.entries(profile.gradeSubjects)) {
      if (Array.isArray(subjects)) {
        sanitized[grade] = subjects.filter(s => validSubjects.has(s));
      }
    }
    return sanitized;
  }

  const mapping: GradeSubjectMapping = {};

  // Migrate from profile.gradeLevels + profile.subjects (cartesian product)
  const oldGrades: string[] = profile.gradeLevels || [];
  const oldSubjects: string[] = profile.subjects || [];
  if (oldGrades.length > 0 && oldSubjects.length > 0) {
    for (const grade of oldGrades) {
      mapping[grade] = [...oldSubjects];
    }
  }

  // Also merge in teacherSubjects/teacherGradeLevels if they add anything new
  const tGrades: string[] = parsed.teacherGradeLevels || [];
  const tSubjects: string[] = parsed.teacherSubjects || [];
  if (tGrades.length > 0 && tSubjects.length > 0) {
    for (const grade of tGrades) {
      const key = grade.toLowerCase();
      if (!mapping[key]) mapping[key] = [];
      for (const subj of tSubjects) {
        if (!mapping[key].includes(subj)) mapping[key].push(subj);
      }
    }
  }

  return mapping;
};

// Helper function to safely load from localStorage
const loadSettingsFromStorage = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const migratedTutorials = migrateTutorialData();

    if (stored) {
      const parsed = JSON.parse(stored);
      const sidebarOrder = migrateSidebarOrder(parsed);
      const gradeSubjects = migrateGradeSubjects(parsed);

      // Merge with defaults to ensure all fields exist
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        // Remove legacy fields
        visualStudioEnabled: undefined,
        performanceMetricsEnabled: undefined,
        teacherSubjects: undefined,
        teacherGradeLevels: undefined,
        sidebarOrder,
        tabColors: {
          ...DEFAULT_SETTINGS.tabColors,
          ...(parsed.tabColors || {})
        },
        profile: {
          ...DEFAULT_SETTINGS.profile,
          ...(parsed.profile || {}),
          gradeSubjects,
          // Backfill registrationDate for existing users who already completed setup
          registrationDate: (parsed.profile?.registrationDate) || (parsed.tutorials?.hasCompletedSetup ? new Date().toISOString() : undefined),
          // Clear legacy fields
          gradeLevels: undefined,
          subjects: undefined,
        },
        tutorials: {
          ...DEFAULT_SETTINGS.tutorials,
          ...(parsed.tutorials || {}),
          ...migratedTutorials,
          completedTutorials: [
            ...(parsed.tutorials?.completedTutorials || []),
            ...(migratedTutorials.completedTutorials || [])
          ].filter((v: string, i: number, a: string[]) => a.indexOf(v) === i),
          tutorialPreferences: {
            ...DEFAULT_SETTINGS.tutorials.tutorialPreferences,
            ...(parsed.tutorials?.tutorialPreferences || {})
          }
        }
      };
    }

    // If no stored settings, check for migration data
    if (Object.keys(migratedTutorials).length > 0) {
      return {
        ...DEFAULT_SETTINGS,
        tutorials: {
          ...DEFAULT_SETTINGS.tutorials,
          ...migratedTutorials
        }
      };
    }
  } catch (error) {
    console.error('Error loading settings from localStorage:', error);
  }
  return DEFAULT_SETTINGS;
};

// Helper function to safely save to localStorage
const saveSettingsToStorage = (settings: Settings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
};

// Provider Component
interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(loadSettingsFromStorage);

  // Save to localStorage whenever settings change
  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  // Sync system behavior settings to main process on mount
  useEffect(() => {
    const api = (window as any).electronAPI;
    if (api) {
      if (settings.minimizeToTray) {
        api.setMinimizeToTray?.(true);
      }
      if (settings.startOnBoot) {
        api.setStartOnBoot?.(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings, ...updates };

      // Special handling for nested tabColors
      if (updates.tabColors) {
        newSettings.tabColors = {
          ...prevSettings.tabColors,
          ...updates.tabColors
        };
      }

      // Special handling for nested profile
      if (updates.profile) {
        newSettings.profile = {
          ...prevSettings.profile,
          ...updates.profile
        };
      }

      return newSettings;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    saveSettingsToStorage(DEFAULT_SETTINGS);
  };

  const markTutorialComplete = (tutorialId: string) => {
    setSettings(prevSettings => {
      const newCompletedTutorials = prevSettings.tutorials.completedTutorials.includes(tutorialId)
        ? prevSettings.tutorials.completedTutorials
        : [...prevSettings.tutorials.completedTutorials, tutorialId];

      return {
        ...prevSettings,
        tutorials: {
          ...prevSettings.tutorials,
          completedTutorials: newCompletedTutorials
        }
      };
    });
  };

  const isTutorialCompleted = (tutorialId: string): boolean => {
    return settings.tutorials.completedTutorials.includes(tutorialId);
  };

  const isSidebarItemEnabled = (id: string): boolean => {
    const item = settings.sidebarOrder.find(i => i.id === id);
    return item?.enabled ?? false;
  };

  const markFeatureDiscovered = (featureId: string) => {
    setSettings(prevSettings => {
      if ((prevSettings.discoveredFeatures || []).includes(featureId)) {
        return prevSettings;
      }
      return {
        ...prevSettings,
        discoveredFeatures: [...(prevSettings.discoveredFeatures || []), featureId],
      };
    });
  };

  const isFeatureDiscovered = (featureId: string): boolean => {
    return (settings.discoveredFeatures || []).includes(featureId);
  };

  const resetTutorials = () => {
    setSettings(prevSettings => ({
      ...prevSettings,
      tutorials: DEFAULT_SETTINGS.tutorials
    }));
  };

  const setWelcomeSeen = (seen: boolean) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      tutorials: {
        ...prevSettings.tutorials,
        hasSeenWelcome: seen
      }
    }));
  };

  // --- Setup wizard ---
  const hasCompletedSetup = settings.tutorials.hasCompletedSetup ?? false;

  const completeSetup = (modules: FeatureModuleId[], profile?: Partial<UserProfile>) => {
    const enabledItems = getEnabledSidebarItems(modules);
    setSettings(prev => {
      const newSidebarOrder = prev.sidebarOrder.map(item => ({
        ...item,
        enabled: enabledItems.has(item.id),
      }));
      return {
        ...prev,
        tutorials: {
          ...prev.tutorials,
          hasCompletedSetup: true,
          hasSeenWelcome: true,
          enabledModules: modules,
        },
        profile: profile
          ? { ...prev.profile, ...profile, registrationDate: prev.profile.registrationDate || new Date().toISOString() }
          : prev.profile,
        sidebarOrder: newSidebarOrder,
      };
    });
  };

  const resetSetup = () => {
    setSettings(prev => ({
      ...prev,
      tutorials: {
        ...prev.tutorials,
        hasCompletedSetup: false,
        enabledModules: [],
      },
    }));
  };

  // --- Module toggling ---
  const isModuleEnabled = (moduleId: FeatureModuleId): boolean => {
    return (settings.tutorials.enabledModules || []).includes(moduleId);
  };

  const toggleModule = (moduleId: FeatureModuleId) => {
    setSettings(prev => {
      const current = prev.tutorials.enabledModules || [];
      const newModules = current.includes(moduleId)
        ? current.filter(m => m !== moduleId)
        : [...current, moduleId];
      const enabledItems = getEnabledSidebarItems(newModules);
      const newSidebarOrder = prev.sidebarOrder.map(item => ({
        ...item,
        enabled: enabledItems.has(item.id),
      }));
      return {
        ...prev,
        tutorials: { ...prev.tutorials, enabledModules: newModules },
        sidebarOrder: newSidebarOrder,
      };
    });
  };

  // --- Nudge system ---
  const dismissNudge = (nudgeId: string) => {
    setSettings(prev => ({
      ...prev,
      nudgeState: {
        ...prev.nudgeState,
        dismissedNudges: [...(prev.nudgeState?.dismissedNudges || []), nudgeId],
        nudgeCooldowns: {
          ...(prev.nudgeState?.nudgeCooldowns || {}),
          [nudgeId]: Date.now(),
        },
      },
    }));
  };

  const shouldShowNudge = (nudgeId: string): boolean => {
    const state = settings.nudgeState || { dismissedNudges: [], nudgeCooldowns: {} };
    if (state.dismissedNudges.includes(nudgeId)) return false;
    const lastDismissed = state.nudgeCooldowns[nudgeId];
    if (lastDismissed && Date.now() - lastDismissed < NUDGE_COOLDOWN_MS) return false;
    return true;
  };

  const value: SettingsContextValue = {
    settings,
    updateSettings,
    resetSettings,
    markTutorialComplete,
    isTutorialCompleted,
    resetTutorials,
    setWelcomeSeen,
    isSidebarItemEnabled,
    markFeatureDiscovered,
    isFeatureDiscovered,
    hasCompletedSetup,
    completeSetup,
    resetSetup,
    dismissNudge,
    shouldShowNudge,
    isModuleEnabled,
    toggleModule,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom Hook
export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;
