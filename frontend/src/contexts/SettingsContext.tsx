import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
}

export interface TutorialState {
  completedTutorials: string[];
  hasSeenWelcome: boolean;
  tutorialPreferences: {
    autoShowOnFirstUse: boolean;
    showFloatingButtons: boolean;
  };
}

export interface UserProfile {
  displayName: string;
  school: string;
  gradeLevels: string[];
  subjects: string[];
  filterContentByProfile: boolean;
}

export interface SidebarItemConfig {
  id: string;
  enabled: boolean;
}

// Canonical list of reorderable sidebar items (excludes pinned: analytics at top, support+settings at bottom)
export const DEFAULT_SIDEBAR_ORDER: SidebarItemConfig[] = [
  { id: 'brain-dump', enabled: true },
  { id: 'curriculum-tracker', enabled: true },
  { id: 'resource-manager', enabled: true },
  { id: 'chat', enabled: true },
  { id: 'curriculum', enabled: true },
  { id: 'quiz-generator', enabled: true },
  { id: 'rubric-generator', enabled: true },
  { id: 'class-management', enabled: true },
  { id: 'lesson-planners', enabled: true },
  { id: 'visual-studio', enabled: false },
  { id: 'performance-metrics', enabled: false },
];

// All valid reorderable IDs
const CANONICAL_IDS = DEFAULT_SIDEBAR_ORDER.map(i => i.id);

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
  teacherSubjects: string[];
  teacherGradeLevels: string[];
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
  // Feature discovery
  discoveredFeatures: string[];
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
    'presentation-builder': '#f97316'
  },
  aiModel: 'anthropic/claude-sonnet-4.5',
  oakKey: '',
  autoCloseTabsOnExit: false,
  theme: 'system',
  sidebarColor: '#21201e',
  tutorials: {
    completedTutorials: [],
    hasSeenWelcome: false,
    tutorialPreferences: {
      autoShowOnFirstUse: true,
      showFloatingButtons: true
    }
  },
  generationMode: 'queued',
  teacherSubjects: [],
  teacherGradeLevels: [],
  profile: {
    displayName: '',
    school: '',
    gradeLevels: [],
    subjects: [],
    filterContentByProfile: false,
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
  // Feature discovery
  discoveredFeatures: [],
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

// Migrate old visualStudioEnabled / performanceMetricsEnabled into sidebarOrder
const migrateSidebarOrder = (parsed: any): SidebarItemConfig[] => {
  // If sidebarOrder already exists, validate and fill in missing items
  if (Array.isArray(parsed.sidebarOrder) && parsed.sidebarOrder.length > 0) {
    const existingIds = new Set(parsed.sidebarOrder.map((i: any) => i.id));
    const order = [...parsed.sidebarOrder];
    // Append any new canonical IDs that weren't in the saved order
    for (const item of DEFAULT_SIDEBAR_ORDER) {
      if (!existingIds.has(item.id)) {
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

// Helper function to safely load from localStorage
const loadSettingsFromStorage = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const migratedTutorials = migrateTutorialData();

    if (stored) {
      const parsed = JSON.parse(stored);
      const sidebarOrder = migrateSidebarOrder(parsed);

      // Merge with defaults to ensure all fields exist
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        // Remove legacy fields
        visualStudioEnabled: undefined,
        performanceMetricsEnabled: undefined,
        sidebarOrder,
        tabColors: {
          ...DEFAULT_SETTINGS.tabColors,
          ...(parsed.tabColors || {})
        },
        profile: {
          ...DEFAULT_SETTINGS.profile,
          ...(parsed.profile || {})
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
    isFeatureDiscovered
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
