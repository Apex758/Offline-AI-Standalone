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
}

export interface TutorialState {
  completedTutorials: string[];
  hasSeenWelcome: boolean;
  tutorialPreferences: {
    autoShowOnFirstUse: boolean;
    showFloatingButtons: boolean;
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
}

export interface SettingsContextValue {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
  markTutorialComplete: (tutorialId: string) => void;
  isTutorialCompleted: (tutorialId: string) => boolean;
  resetTutorials: () => void;
  setWelcomeSeen: (seen: boolean) => void;
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
    'curriculum-tracker': '#22c55e'
  },
  aiModel: 'anthropic/claude-sonnet-4.5',
  oakKey: '',
  autoCloseTabsOnExit: false,
  theme: 'system',
  sidebarColor: '#1e293b',
  tutorials: {
    completedTutorials: [],
    hasSeenWelcome: false,
    tutorialPreferences: {
      autoShowOnFirstUse: true,
      showFloatingButtons: true
    }
  },
  generationMode: 'queued',
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

// Helper function to safely load from localStorage
const loadSettingsFromStorage = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const migratedTutorials = migrateTutorialData();
    
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all fields exist
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        tabColors: {
          ...DEFAULT_SETTINGS.tabColors,
          ...(parsed.tabColors || {})
        },
        tutorials: {
          ...DEFAULT_SETTINGS.tutorials,
          ...(parsed.tutorials || {}),
          ...migratedTutorials,
          completedTutorials: [
            ...(parsed.tutorials?.completedTutorials || []),
            ...(migratedTutorials.completedTutorials || [])
          ].filter((v, i, a) => a.indexOf(v) === i), // Remove duplicates
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
    setWelcomeSeen
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