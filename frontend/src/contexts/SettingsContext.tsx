import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// TypeScript Interfaces
export interface TabColors {
  analytics: string;
  chat: string;
  curriculum: string;
  grader: string;
  'lesson-planner': string;
  'kindergarten-planner': string;
  'multigrade-planner': string;
  'cross-curricular-planner': string;
  'quiz-generator': string;
  'rubric-generator': string;
  'resource-manager': string;
}

export interface Settings {
  fontSize: number; // Percentage (100 = default)
  tabColors: TabColors;
  aiModel: string;
  oakKey: string;
  autoCloseTabsOnExit: boolean;
  theme: 'light' | 'dark' | 'system';
  sidebarColor: string;
}

export interface SettingsContextValue {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

// Default Settings (hex colors matching Settings.tsx defaults)
export const DEFAULT_SETTINGS: Settings = {
  fontSize: 100,
  tabColors: {
    'analytics': '#3b82f6',
    'chat': '#3b82f6',
    'curriculum': '#8b5cf6',
    'grader': '#10b981',
    'lesson-planner': '#f59e0b',
    'kindergarten-planner': '#ec4899',
    'multigrade-planner': '#06b6d4',
    'cross-curricular-planner': '#6366f1',
    'quiz-generator': '#14b8a6',
    'rubric-generator': '#f97316',
    'resource-manager': '#84cc16'
  },
  aiModel: 'anthropic/claude-sonnet-4.5',
  oakKey: '',
  autoCloseTabsOnExit: false,
  theme: 'system',
  sidebarColor: '#1e293b'
};

// localStorage key
const STORAGE_KEY = 'app-settings-main';

// Create Context
const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

// Helper function to safely load from localStorage
const loadSettingsFromStorage = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all fields exist
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        tabColors: {
          ...DEFAULT_SETTINGS.tabColors,
          ...(parsed.tabColors || {})
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

  const value: SettingsContextValue = {
    settings,
    updateSettings,
    resetSettings
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