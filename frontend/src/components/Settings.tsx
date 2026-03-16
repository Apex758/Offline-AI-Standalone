import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, Eye, EyeOff, AlertTriangle, RotateCcw, FolderOpen, RefreshCw, Trash2, Palette, Monitor, Cpu, Layers, BookOpen, Sparkles, ChevronRight, Type, Sun, Moon, Image, User, X, SpellCheck, PenTool, Zap, BookA, Download, Upload, Check, Shuffle, Minus, Plus, Paintbrush, Droplets, Blend } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { useSettings } from '../contexts/SettingsContext';
import { downloadJSON } from '../lib/utils';
import axios from 'axios';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import { useLicense } from '../contexts/LicenseContext';

interface SettingsProps {
  tabId?: string;
  savedData?: Record<string, unknown>;
  onDataChange?: (data: Record<string, unknown>) => void;
}

interface ModelInfo {
  name: string;
  path: string;
  size_mb: number;
  extension: string;
  is_active: boolean;
}

const Settings: React.FC<SettingsProps> = () => {
  const { settings, updateSettings, resetSettings, markTutorialComplete, isTutorialCompleted, resetTutorials } = useSettings();
  const [showPassword, setShowPassword] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showWipeDialog, setShowWipeDialog] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [isSelectingModel, setIsSelectingModel] = useState(false);
  const [modelChangeMessage, setModelChangeMessage] = useState('');

  // Diffusion model state
  const [availableDiffusionModels, setAvailableDiffusionModels] = useState<ModelInfo[]>([]);
  const [loadingDiffusionModels, setLoadingDiffusionModels] = useState(false);
  const [selectedDiffusionModel, setSelectedDiffusionModel] = useState('');
  const [isSelectingDiffusionModel, setIsSelectingDiffusionModel] = useState(false);
  const [diffusionModelChangeMessage, setDiffusionModelChangeMessage] = useState('');

  // Export / Import state
  const DATA_CATEGORIES = [
    { key: 'chats', label: 'Chat Conversations' },
    { key: 'lesson_plans', label: 'Lesson Plans' },
    { key: 'kindergarten', label: 'Early Childhood Plans' },
    { key: 'multigrade', label: 'Multi-Level Plans' },
    { key: 'cross_curricular', label: 'Integrated Lesson Plans' },
    { key: 'quizzes', label: 'Quizzes' },
    { key: 'rubrics', label: 'Rubrics' },
    { key: 'worksheets', label: 'Worksheets' },
    { key: 'images', label: 'Generated Images' },
    { key: 'students', label: 'Student Records' },
    { key: 'settings', label: 'App Settings' },
  ] as const;
  const [exportSelected, setExportSelected] = useState<Set<string>>(new Set(DATA_CATEGORIES.map(c => c.key)));
  const [importSelected, setImportSelected] = useState<Set<string>>(new Set(DATA_CATEGORIES.map(c => c.key)));
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [importMessage, setImportMessage] = useState('');
  const importFileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  // Tutorial integration
  const [showTutorial, setShowTutorial] = useState(false);

  // Profile state synced with Dashboard localStorage
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  // Section navigation
  type SettingsSection = 'profile' | 'appearance' | 'models' | 'general' | 'features' | 'license' | 'danger';
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  // Load profile name & image from localStorage (synced with Dashboard)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const name = user.name || user.username || '';
        if (name && name !== settings.profile.displayName) {
          updateSettings({ profile: { ...settings.profile, displayName: name } });
        }
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    const storedImage = localStorage.getItem('user-profile-image');
    if (storedImage) {
      setUserProfileImage(storedImage);
    }
  }, []);

  // Sync display name changes back to Dashboard's localStorage
  const handleDisplayNameChange = (name: string) => {
    updateSettings({ profile: { ...settings.profile, displayName: name } });
    // Update the user object in localStorage so Dashboard picks it up
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.name = name;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (e) {
      console.error('Error updating user name:', e);
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUserProfileImage(dataUrl);
      localStorage.setItem('user-profile-image', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Remove profile image
  const handleRemoveProfileImage = () => {
    setUserProfileImage(null);
    localStorage.removeItem('user-profile-image');
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = '';
    }
  };

  // Fetch available models on component mount
  useEffect(() => {
    fetchAvailableModels();
    fetchAvailableDiffusionModels();
  }, []);

  // Auto-show tutorial on first use
  useEffect(() => {
    if (
      settings.tutorials.tutorialPreferences.autoShowOnFirstUse &&
      !isTutorialCompleted(TUTORIAL_IDS.SETTINGS)
    ) {
      setShowTutorial(true);
    }
  }, [settings, isTutorialCompleted]);

  const fetchAvailableModels = async () => {
    setLoadingModels(true);
    try {
      const response = await axios.get('http://localhost:8000/api/models');
      if (response.data.success) {
        setAvailableModels(response.data.models);
        // Set the currently active model
        const activeModel = response.data.models.find((m: ModelInfo) => m.is_active);
        if (activeModel) {
          setSelectedModel(activeModel.name);
        }
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleOpenModelsFolder = async () => {
    try {
      await axios.post('http://localhost:8000/api/models/open-folder');
    } catch (error) {
      console.error('Failed to open models folder:', error);
      alert('Failed to open models folder');
    }
  };

  // Handle model selection
  const handleModelSelect = async (modelName: string) => {
    if (modelName === selectedModel) return;
    
    setIsSelectingModel(true);
    setModelChangeMessage('');
    
    try {
      const response = await fetch('http://localhost:8000/api/models/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelName }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedModel(modelName);
        setModelChangeMessage(`✅ Model changed to ${modelName}. Please restart the app for changes to take effect.`);
      } else {
        const error = await response.json();
        setModelChangeMessage(`❌ Error: ${error.error || 'Failed to change model'}`);
      }
    } catch (error) {
      console.error('Error selecting model:', error);
      setModelChangeMessage('❌ Error: Failed to communicate with backend');
    } finally {
      setIsSelectingModel(false);
    }
  };

  // Diffusion model functions
  const fetchAvailableDiffusionModels = async () => {
    setLoadingDiffusionModels(true);
    try {
      const response = await axios.get('http://localhost:8000/api/diffusion-models');
      if (response.data.success) {
        setAvailableDiffusionModels(response.data.models);
        const activeModel = response.data.models.find((m: ModelInfo) => m.is_active);
        if (activeModel) {
          setSelectedDiffusionModel(activeModel.name);
        }
      }
    } catch (error) {
      console.error('Failed to fetch diffusion models:', error);
    } finally {
      setLoadingDiffusionModels(false);
    }
  };

  const handleOpenDiffusionModelsFolder = async () => {
    try {
      await axios.post('http://localhost:8000/api/diffusion-models/open-folder');
    } catch (error) {
      console.error('Failed to open diffusion models folder:', error);
      alert('Failed to open diffusion models folder');
    }
  };

  const handleDiffusionModelSelect = async (modelName: string) => {
    if (modelName === selectedDiffusionModel) return;

    setIsSelectingDiffusionModel(true);
    setDiffusionModelChangeMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/diffusion-models/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelName }),
      });

      if (response.ok) {
        setSelectedDiffusionModel(modelName);
        setDiffusionModelChangeMessage(`Model changed to ${modelName}. Please restart the app for changes to take effect.`);
      } else {
        const error = await response.json();
        setDiffusionModelChangeMessage(`Error: ${error.error || 'Failed to change diffusion model'}`);
      }
    } catch (error) {
      console.error('Error selecting diffusion model:', error);
      setDiffusionModelChangeMessage('Error: Failed to communicate with backend');
    } finally {
      setIsSelectingDiffusionModel(false);
    }
  };

  const handleTutorialComplete = () => {
    markTutorialComplete(TUTORIAL_IDS.SETTINGS);
    setShowTutorial(false);
  };

  const sections = [
    { id: 'profile' as const, label: 'Profile', icon: User, description: 'Your name, school & role' },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette, description: 'Theme, fonts & tab colors' },
    { id: 'models' as const, label: 'AI Models', icon: Cpu, description: 'Language & diffusion models' },
    { id: 'general' as const, label: 'General', icon: Layers, description: 'Behavior & generation' },
    { id: 'features' as const, label: 'Features', icon: Sparkles, description: 'Writing assistant & tools' },
    { id: 'license' as const, label: 'License & Updates', icon: RefreshCw, description: 'Activate for updates' },
    { id: 'danger' as const, label: 'Danger Zone', icon: AlertTriangle, description: 'Export, import & reset' },
  ];

  // Tab types and their default colors (matching sidebar order)
  const tabTypes = [
    // Regular tools
    { type: 'analytics', label: 'My Overview', defaultColor: '#3b82f6' },
    { type: 'brain-dump', label: 'Brain Dump', defaultColor: '#a855f7' },
    { type: 'curriculum-tracker', label: 'Progress Tracker', defaultColor: '#10b981' },
    { type: 'resource-manager', label: 'My Resources', defaultColor: '#84cc16' },
    { type: 'chat', label: 'Ask PEARL', defaultColor: '#3b82f6' },
    { type: 'curriculum', label: 'Curriculum Browser', defaultColor: '#8b5cf6' },
    // Tools group
    { type: 'quiz-generator', label: 'Quiz Builder', defaultColor: '#14b8a6' },
    { type: 'rubric-generator', label: 'Rubric Builder', defaultColor: '#f97316' },
    { type: 'class-management', label: 'My Classes', defaultColor: '#f97316' },
    // Lesson planners group
    { type: 'lesson-planner', label: 'Lesson Plan', defaultColor: '#f59e0b' },
    { type: 'kindergarten-planner', label: 'Early Childhood', defaultColor: '#ec4899' },
    { type: 'multigrade-planner', label: 'Multi-Level', defaultColor: '#06b6d4' },
    { type: 'cross-curricular-planner', label: 'Integrated Lesson', defaultColor: '#6366f1' },
    // Visual studio group
    ...(settings.visualStudioEnabled ? [
      { type: 'worksheet-generator', label: 'Worksheet Builder', defaultColor: '#8b5cf6' },
      { type: 'image-studio', label: 'Image Studio', defaultColor: '#ec4899' },
    ] : []),
    // Bottom tools
    { type: 'support', label: 'Support & Reporting', defaultColor: '#3b82f6' },
    { type: 'settings', label: 'Settings', defaultColor: '#6b7280' },
  ];

  const handleTabColorChange = (tabType: string, color: string) => {
    updateSettings({
      tabColors: {
        ...settings.tabColors,
        [tabType]: color
      }
    });
  };

  // ── Tab Color Presets ─────────────────────────────────────────
  const [gradientColors, setGradientColors] = useState<string[]>(['#a855f7', '#3b82f6']);
  const [spectrumBase, setSpectrumBase] = useState('#3b82f6');
  const [showGradientPicker, setShowGradientPicker] = useState(false);
  const [showSpectrumPicker, setShowSpectrumPicker] = useState(false);

  // Convert hex to HSL
  const hexToHSL = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Interpolate between two hex colors
  const lerpColor = (c1: string, c2: string, t: number): string => {
    const r1 = parseInt(c1.slice(1, 3), 16), g1 = parseInt(c1.slice(3, 5), 16), b1 = parseInt(c1.slice(5, 7), 16);
    const r2 = parseInt(c2.slice(1, 3), 16), g2 = parseInt(c2.slice(3, 5), 16), b2 = parseInt(c2.slice(5, 7), 16);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const applyPresetColors = (colors: Record<string, string>) => {
    updateSettings({ tabColors: { ...settings.tabColors, ...colors } as any });
  };

  // Monochrome: grays from dark to light
  const applyMonochrome = () => {
    const colors: Record<string, string> = {};
    const count = tabTypes.length;
    tabTypes.forEach((tab, i) => {
      const lightness = 30 + Math.round((i / (count - 1)) * 35); // 30% to 65%
      colors[tab.type] = hslToHex(220, 8, lightness);
    });
    applyPresetColors(colors);
  };

  // Randomize
  const applyRandom = () => {
    const colors: Record<string, string> = {};
    const goldenAngle = 137.508;
    const startHue = Math.random() * 360;
    tabTypes.forEach((tab, i) => {
      const hue = (startHue + i * goldenAngle) % 360;
      colors[tab.type] = hslToHex(Math.round(hue), 65 + Math.round(Math.random() * 20), 50 + Math.round(Math.random() * 10));
    });
    applyPresetColors(colors);
  };

  // Gradient: distribute colors across a multi-stop gradient
  const applyGradient = (stops: string[]) => {
    if (stops.length < 2) return;
    const colors: Record<string, string> = {};
    const count = tabTypes.length;
    tabTypes.forEach((tab, i) => {
      const t = count === 1 ? 0 : i / (count - 1);
      const segmentCount = stops.length - 1;
      const segment = Math.min(Math.floor(t * segmentCount), segmentCount - 1);
      const localT = (t * segmentCount) - segment;
      colors[tab.type] = lerpColor(stops[segment], stops[segment + 1], localT);
    });
    applyPresetColors(colors);
  };

  // Spectrum: shades of a single base color
  const applySpectrum = (baseHex: string) => {
    const [h, s] = hexToHSL(baseHex);
    const colors: Record<string, string> = {};
    const count = tabTypes.length;
    tabTypes.forEach((tab, i) => {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const lightness = 30 + Math.round(t * 40); // 30% to 70%
      const hueShift = Math.round(t * 80) - 40; // -40 to +40 degrees
      const satShift = Math.round(Math.sin(t * Math.PI) * 25); // arc: 0 → +25 → 0
      colors[tab.type] = hslToHex((h + hueShift + 360) % 360, Math.max(25, Math.min(100, s + satShift)), lightness);
    });
    applyPresetColors(colors);
  };

  const handleResetClick = () => {
    setShowResetDialog(true);
  };

  const handleConfirmReset = () => {
    resetSettings();
    setShowResetDialog(false);
  };

  const handleCancelReset = () => {
    setShowResetDialog(false);
  };

  const handleWipeApp = async () => {
    setIsWiping(true);
    try {
      // 1. Call backend to wipe all server-side data
      await axios.post('http://localhost:8000/api/factory-reset');
      // 2. Clear all localStorage
      localStorage.clear();
      // 3. Clear all sessionStorage
      sessionStorage.clear();
      // 4. Reload the app
      window.location.reload();
    } catch (err) {
      console.error('Factory reset failed:', err);
      setIsWiping(false);
      setShowWipeDialog(false);
    }
  };

  const toggleExportCategory = (key: string) => {
    setExportSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const toggleImportCategory = (key: string) => {
    setImportSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const handleBulkExport = async () => {
    if (exportSelected.size === 0) return;
    setIsExporting(true);
    setExportMessage('');
    try {
      // Separate backend categories from frontend-only ones
      const backendCats = [...exportSelected].filter(c => c !== 'settings');
      const includeSettings = exportSelected.has('settings');

      let backendData: Record<string, unknown> = {};
      if (backendCats.length > 0) {
        const response = await axios.get('http://localhost:8000/api/export-data', {
          params: { categories: backendCats.join(',') }
        });
        backendData = response.data.data || {};
      }

      // Add frontend settings if selected
      if (includeSettings) {
        backendData['settings'] = {
          appSettings: settings,
          user: JSON.parse(localStorage.getItem('user') || 'null'),
          profileImage: localStorage.getItem('user-profile-image'),
          dashboardTabs: JSON.parse(localStorage.getItem('dashboard-tabs') || 'null'),
          dashboardActiveTab: localStorage.getItem('dashboard-active-tab'),
          dashboardSplitView: JSON.parse(localStorage.getItem('dashboard-split-view') || 'null'),
        };
      }

      const exportPayload = {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        categories: [...exportSelected],
        data: backendData
      };

      const filename = `oecs-backup-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(exportPayload, filename);
      setExportMessage(`Exported ${exportSelected.size} categor${exportSelected.size === 1 ? 'y' : 'ies'} successfully`);
      setTimeout(() => setExportMessage(''), 4000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportMessage('Export failed. Please try again.');
      setTimeout(() => setExportMessage(''), 4000);
    } finally {
      setIsExporting(false);
    }
  };

  const processImportFile = async (file: File) => {
    setIsImporting(true);
    setImportMessage('');
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed.data || !parsed.categories) {
        setImportMessage('Invalid backup file format.');
        setTimeout(() => setImportMessage(''), 4000);
        return;
      }

      // Filter to only import the categories the user has selected
      const catsToImport = parsed.categories.filter((c: string) => importSelected.has(c));
      const filteredData: Record<string, unknown> = {};
      for (const cat of catsToImport) {
        if (parsed.data[cat]) filteredData[cat] = parsed.data[cat];
      }

      // Import settings locally
      if (catsToImport.includes('settings') && filteredData['settings']) {
        const s = filteredData['settings'] as Record<string, unknown>;
        if (s.appSettings) updateSettings(s.appSettings as Record<string, unknown>);
        if (s.user) localStorage.setItem('user', JSON.stringify(s.user));
        if (s.profileImage) localStorage.setItem('user-profile-image', s.profileImage as string);
        if (s.dashboardTabs) localStorage.setItem('dashboard-tabs', JSON.stringify(s.dashboardTabs));
        if (s.dashboardActiveTab) localStorage.setItem('dashboard-active-tab', s.dashboardActiveTab as string);
        if (s.dashboardSplitView) localStorage.setItem('dashboard-split-view', JSON.stringify(s.dashboardSplitView));
      }

      // Send backend categories to import endpoint
      const backendCats = catsToImport.filter((c: string) => c !== 'settings');
      const backendData: Record<string, unknown> = {};
      for (const cat of backendCats) {
        if (filteredData[cat]) backendData[cat] = filteredData[cat];
      }

      let importedSummary = '';
      if (backendCats.length > 0) {
        const response = await axios.post('http://localhost:8000/api/import-data', {
          categories: backendCats,
          data: backendData
        });
        const counts = response.data.imported || {};
        const parts = Object.entries(counts).map(([k, v]) => `${v} ${k.replace(/_/g, ' ')}`);
        if (parts.length > 0) importedSummary = parts.join(', ');
      }

      if (catsToImport.includes('settings')) {
        importedSummary = importedSummary ? importedSummary + ', settings restored' : 'Settings restored';
      }

      setImportMessage(importedSummary ? `Imported: ${importedSummary}` : 'Import complete (no new records)');
      setTimeout(() => setImportMessage(''), 6000);
    } catch (error) {
      console.error('Import failed:', error);
      setImportMessage('Import failed. Check the file format.');
      setTimeout(() => setImportMessage(''), 4000);
    } finally {
      setIsImporting(false);
      if (importFileRef.current) importFileRef.current.value = '';
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImportFile(file);
  };

  const handleImportDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.json')) {
      processImportFile(file);
    } else {
      setImportMessage('Please drop a .json backup file.');
      setTimeout(() => setImportMessage(''), 4000);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="h-full tab-content-bg flex" data-tutorial="settings-welcome">
      {/* Left Sidebar Navigation */}
      <div className="w-1/4 flex-shrink-0 border-r border-theme-strong/30 bg-theme-surface/50 flex flex-col">
        <div className="px-7 pt-7 pb-4">
          <div className="flex items-center gap-2.5 mb-1">
            <SettingsIcon className="w-6 h-6 text-theme-label" />
            <h1 className="text-xl font-bold text-theme-title">Settings</h1>
          </div>
          <p className="text-xs text-theme-muted ml-[34px]">Customize PEARL AI</p>
        </div>
        <nav className="flex-1 px-5 py-3 space-y-1.5">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            const isDanger = section.id === 'danger';
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                  isActive
                    ? isDanger
                      ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 shadow-sm'
                      : 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 shadow-sm'
                    : isDanger
                      ? 'text-red-600/70 dark:text-red-400/70 hover:bg-red-50/50 dark:hover:bg-red-950/20'
                      : 'text-theme-secondary hover:bg-theme-subtle'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? '' : isDanger ? 'opacity-70 group-hover:opacity-100' : 'opacity-70 group-hover:opacity-100 dark:text-white'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? '' : 'text-theme-label'}`}>{section.label}</p>
                  <p className={`text-[11px] truncate ${isActive ? 'opacity-70' : 'text-theme-hint'}`}>{section.description}</p>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-150 ${isActive ? 'opacity-70' : 'opacity-0 group-hover:opacity-50'}`} />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 min-w-0">
        <ScrollArea className="h-full">
          <div className="max-w-3xl p-6 pb-20">

            {/* ===== PROFILE SECTION ===== */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-theme-title">Profile</h2>
                  <p className="text-sm text-theme-muted mt-1">Tell PEARL about yourself to personalize your experience</p>
                </div>

                {/* Avatar & Name */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-4.5 h-4.5 text-theme-secondary" />
                      Personal Info
                    </CardTitle>
                    <CardDescription>Your basic information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Display Name + Avatar */}
                      <div className="flex items-center gap-5 mb-2">
                        <div className="relative group">
                          <div
                            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md overflow-hidden cursor-pointer"
                            onClick={() => profileImageInputRef.current?.click()}
                          >
                            {userProfileImage ? (
                              <img src={userProfileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : settings.profile.displayName ? (
                              settings.profile.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                            ) : (
                              <User className="w-7 h-7" />
                            )}
                          </div>
                          <div
                            className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => profileImageInputRef.current?.click()}
                          >
                            <span className="text-white text-[10px] font-medium">Change</span>
                          </div>
                          {userProfileImage && (
                            <button
                              onClick={handleRemoveProfileImage}
                              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                          <input
                            ref={profileImageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            className="hidden"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-theme-label mb-1.5">Display Name</label>
                          <Input
                            placeholder="e.g. Ms. Johnson"
                            value={settings.profile.displayName}
                            onChange={(e) => handleDisplayNameChange(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* School */}
                      <div>
                        <label className="block text-sm font-medium text-theme-label mb-1.5">School</label>
                        <Input
                          placeholder="e.g. Castries Primary School"
                          value={settings.profile.school}
                          onChange={(e) => updateSettings({ profile: { ...settings.profile, school: e.target.value } })}
                        />
                      </div>

                      {/* Grade Levels */}
                      <div>
                        <label className="block text-sm font-medium text-theme-label mb-2">Grade Levels</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: 'k', label: 'Kindergarten' },
                            { value: '1', label: 'Grade 1' },
                            { value: '2', label: 'Grade 2' },
                            { value: '3', label: 'Grade 3' },
                            { value: '4', label: 'Grade 4' },
                            { value: '5', label: 'Grade 5' },
                            { value: '6', label: 'Grade 6' },
                          ].map((grade) => {
                            const isSelected = settings.profile.gradeLevels.includes(grade.value);
                            return (
                              <button
                                key={grade.value}
                                onClick={() => {
                                  const newGrades = isSelected
                                    ? settings.profile.gradeLevels.filter(g => g !== grade.value)
                                    : [...settings.profile.gradeLevels, grade.value];
                                  updateSettings({ profile: { ...settings.profile, gradeLevels: newGrades } });
                                }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 border ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                                    : 'border-theme-strong/30 text-theme-secondary dark:text-white hover:border-theme-strong/60 hover:bg-theme-subtle'
                                }`}
                              >
                                {grade.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subjects */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subjects</CardTitle>
                    <CardDescription>Select the subjects you teach</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        'Mathematics', 'Language Arts', 'Science', 'Social Studies',
                        'Physical Education', 'Health & Family Life', 'Music', 'Art',
                        'Spanish', 'French', 'ICT', 'Agriculture',
                        'Religious Education', 'TVET', 'Library Skills'
                      ].map((subject) => {
                        const isSelected = settings.profile.subjects.includes(subject);
                        return (
                          <button
                            key={subject}
                            onClick={() => {
                              const newSubjects = isSelected
                                ? settings.profile.subjects.filter(s => s !== subject)
                                : [...settings.profile.subjects, subject];
                              updateSettings({ profile: { ...settings.profile, subjects: newSubjects } });
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 border ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                                : 'border-theme-strong/30 text-theme-secondary dark:text-white hover:border-theme-strong/60 hover:bg-theme-subtle'
                            }`}
                          >
                            {subject}
                          </button>
                        );
                      })}
                    </div>
                    {settings.profile.subjects.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-theme-strong/20">
                        <div className="flex flex-wrap gap-2">
                          {settings.profile.subjects.map((subject) => (
                            <span
                              key={subject}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                            >
                              {subject}
                              <button
                                onClick={() => {
                                  updateSettings({
                                    profile: {
                                      ...settings.profile,
                                      subjects: settings.profile.subjects.filter(s => s !== subject)
                                    }
                                  });
                                }}
                                className="ml-0.5 hover:text-blue-900 dark:hover:text-blue-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Content Filtering Toggle */}
                <Card>
                  <CardHeader>
                    <CardTitle>Content Filtering</CardTitle>
                    <CardDescription>Control what content is shown based on your profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-theme-subtle">
                      <div>
                        <p className="text-sm font-medium text-theme-label">Only show my grades & subjects</p>
                        <p className="text-xs text-theme-hint mt-0.5">
                          When enabled, curriculum, lesson plans, and other content will be filtered to only show items related to your selected grade levels and subjects.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.profile.filterContentByProfile}
                        onChange={(e) => updateSettings({ profile: { ...settings.profile, filterContentByProfile: e.target.checked } })}
                        className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"

                      />
                    </label>
                    {settings.profile.filterContentByProfile && settings.profile.gradeLevels.length === 0 && settings.profile.subjects.length === 0 && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 px-3">
                        Select at least one grade level or subject above for filtering to take effect.
                      </p>
                    )}
                    {settings.profile.filterContentByProfile && (settings.profile.gradeLevels.length > 0 || settings.profile.subjects.length > 0) && (
                      <div className="mt-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30">
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                          Showing content for{' '}
                          {settings.profile.gradeLevels.length > 0 && (
                            <span className="font-medium">
                              {settings.profile.gradeLevels.map(g => g === 'k' ? 'Kindergarten' : `Grade ${g}`).join(', ')}
                            </span>
                          )}
                          {settings.profile.gradeLevels.length > 0 && settings.profile.subjects.length > 0 && ' in '}
                          {settings.profile.subjects.length > 0 && (
                            <span className="font-medium">{settings.profile.subjects.join(', ')}</span>
                          )}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ===== APPEARANCE SECTION ===== */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-theme-title">Appearance</h2>
                  <p className="text-sm text-theme-muted mt-1">Customize how PEARL looks and feels</p>
                </div>

                {/* Theme */}
                <Card data-tutorial="settings-appearance">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sun className="w-4.5 h-4.5 text-theme-secondary" />
                      Theme
                    </CardTitle>
                    <CardDescription>Choose your preferred color scheme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      {([
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Monitor },
                      ] as const).map((option) => {
                        const OptIcon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => updateSettings({ theme: option.value })}
                            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                              settings.theme === option.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm'
                                : 'border-theme-strong/30 hover:border-theme-strong/60 bg-theme-surface'
                            }`}
                          >
                            <OptIcon className={`w-5 h-5 ${settings.theme === option.value ? 'text-blue-600 dark:text-blue-400' : 'text-theme-secondary'}`} />
                            <span className={`text-sm font-medium ${settings.theme === option.value ? 'text-blue-700 dark:text-blue-400' : 'text-theme-label'}`}>
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Font Size */}
                <Card data-search-section="font-size">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="w-4.5 h-4.5 text-theme-secondary" />
                      Font Size
                    </CardTitle>
                    <CardDescription>Adjust the font size for better readability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-theme-hint w-8">Aa</span>
                        <input
                          type="range"
                          min="80"
                          max="120"
                          step="5"
                          value={settings.fontSize}
                          onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                          className="flex-1 h-2 bg-theme-tertiary rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-lg font-bold text-theme-hint w-8">Aa</span>
                        <span className="text-sm font-semibold text-theme-label min-w-[50px] text-center px-2 py-1 rounded-md bg-theme-subtle">
                          {settings.fontSize}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tab Colors */}
                <Card data-tutorial="settings-tab-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Palette className="w-4.5 h-4.5 text-theme-secondary" />
                          Tab Colors
                        </CardTitle>
                        <CardDescription>Personalize the accent color for each tab</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const defaultColors: Record<string, string> = {};
                          tabTypes.forEach(tab => { defaultColors[tab.type] = tab.defaultColor; });
                          updateSettings({ tabColors: defaultColors as any });
                          setShowGradientPicker(false);
                          setShowSpectrumPicker(false);
                        }}
                        className="text-xs gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Default
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* ── Color Presets ── */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-theme-muted uppercase tracking-wider">Presets</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {/* Monochrome */}
                        <button
                          onClick={applyMonochrome}
                          className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-theme-strong/50 bg-theme-surface hover:border-theme-strong hover:shadow-sm transition-all"
                        >
                          <div className="flex gap-0.5">
                            {['#3d4450', '#4f5563', '#636b7a', '#7a8291', '#929aaa'].map((c, i) => (
                              <div key={i} className="w-3 h-6 rounded-sm first:rounded-l-md last:rounded-r-md" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                          <span className="text-[11px] font-medium text-theme-muted group-hover:text-theme-label transition-colors">Monochrome</span>
                        </button>

                        {/* Randomize */}
                        <button
                          onClick={applyRandom}
                          className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-theme-strong/50 bg-theme-surface hover:border-theme-strong hover:shadow-sm transition-all"
                        >
                          <div className="flex gap-0.5">
                            {['#f43f5e', '#a855f7', '#3b82f6', '#10b981', '#f59e0b'].map((c, i) => (
                              <div key={i} className="w-3 h-6 rounded-sm first:rounded-l-md last:rounded-r-md" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                          <span className="text-[11px] font-medium text-theme-muted group-hover:text-theme-label transition-colors flex items-center gap-1">
                            <Shuffle className="w-3 h-3" />
                            Randomize
                          </span>
                        </button>

                        {/* Gradient */}
                        <button
                          onClick={() => { setShowGradientPicker(!showGradientPicker); setShowSpectrumPicker(false); }}
                          className={`group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                            showGradientPicker ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/15 shadow-sm' : 'border-theme-strong/50 bg-theme-surface hover:border-theme-strong hover:shadow-sm'
                          }`}
                        >
                          <div className="w-[62px] h-6 rounded-md" style={{ background: `linear-gradient(to right, ${gradientColors.join(', ')})` }} />
                          <span className="text-[11px] font-medium text-theme-muted group-hover:text-theme-label transition-colors flex items-center gap-1">
                            <Blend className="w-3 h-3" />
                            Gradient
                          </span>
                        </button>

                        {/* Spectrum */}
                        <button
                          onClick={() => { setShowSpectrumPicker(!showSpectrumPicker); setShowGradientPicker(false); }}
                          className={`group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                            showSpectrumPicker ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/15 shadow-sm' : 'border-theme-strong/50 bg-theme-surface hover:border-theme-strong hover:shadow-sm'
                          }`}
                        >
                          <div className="flex gap-0.5">
                            {(() => {
                              const [h, s] = hexToHSL(spectrumBase);
                              return [30, 40, 50, 60, 70].map((l, i) => (
                                <div key={i} className="w-3 h-6 rounded-sm first:rounded-l-md last:rounded-r-md" style={{ backgroundColor: hslToHex((h + (i - 2) * 20 + 360) % 360, s, l) }} />
                              ));
                            })()}
                          </div>
                          <span className="text-[11px] font-medium text-theme-muted group-hover:text-theme-label transition-colors flex items-center gap-1">
                            <Droplets className="w-3 h-3" />
                            Spectrum
                          </span>
                        </button>
                      </div>

                      {/* Gradient Picker */}
                      {showGradientPicker && (
                        <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/10 space-y-3">
                          <p className="text-xs font-medium text-theme-label">Pick gradient stops, then apply:</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {gradientColors.map((color, i) => (
                              <div key={i} className="flex items-center gap-1">
                                <label className="relative cursor-pointer">
                                  <div className="w-8 h-8 rounded-lg ring-1 ring-black/10 shadow-sm" style={{ backgroundColor: color }} />
                                  <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => {
                                      const updated = [...gradientColors];
                                      updated[i] = e.target.value;
                                      setGradientColors(updated);
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                </label>
                                {gradientColors.length > 2 && (
                                  <button
                                    onClick={() => setGradientColors(gradientColors.filter((_, j) => j !== i))}
                                    className="p-0.5 rounded text-theme-hint hover:text-red-500 transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                            {gradientColors.length < 5 && (
                              <button
                                onClick={() => setGradientColors([...gradientColors, '#10b981'])}
                                className="p-1.5 rounded-lg border border-dashed border-theme-strong text-theme-muted hover:text-theme-label hover:border-theme-strong transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          {/* Gradient preview */}
                          <div className="w-full h-4 rounded-lg ring-1 ring-black/10" style={{ background: `linear-gradient(to right, ${gradientColors.join(', ')})` }} />
                          <Button
                            size="sm"
                            onClick={() => applyGradient(gradientColors)}
                            className="text-xs gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Paintbrush className="w-3.5 h-3.5" />
                            Apply Gradient
                          </Button>
                        </div>
                      )}

                      {/* Spectrum Picker */}
                      {showSpectrumPicker && (
                        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10 space-y-3">
                          <p className="text-xs font-medium text-theme-label">Pick a base color to generate shades:</p>
                          <div className="flex items-center gap-3">
                            <label className="relative cursor-pointer">
                              <div className="w-10 h-10 rounded-lg ring-1 ring-black/10 shadow-sm" style={{ backgroundColor: spectrumBase }} />
                              <input
                                type="color"
                                value={spectrumBase}
                                onChange={(e) => setSpectrumBase(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </label>
                            <span className="text-xs font-mono text-theme-muted uppercase">{spectrumBase}</span>
                          </div>
                          {/* Spectrum preview */}
                          <div className="flex gap-0.5">
                            {(() => {
                              const [h, s] = hexToHSL(spectrumBase);
                              const count = tabTypes.length;
                              return tabTypes.map((_, i) => {
                                const t = count === 1 ? 0.5 : i / (count - 1);
                                const lightness = 30 + Math.round(t * 40);
                                const hueShift = Math.round(t * 80) - 40;
                                const satShift = Math.round(Math.sin(t * Math.PI) * 25);
                                return (
                                  <div
                                    key={i}
                                    className="flex-1 h-4 first:rounded-l-lg last:rounded-r-lg"
                                    style={{ backgroundColor: hslToHex((h + hueShift + 360) % 360, Math.max(25, Math.min(100, s + satShift)), lightness) }}
                                  />
                                );
                              });
                            })()}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => applySpectrum(spectrumBase)}
                            className="text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Paintbrush className="w-3.5 h-3.5" />
                            Apply Spectrum
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* ── Individual Tab Colors ── */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-theme-muted uppercase tracking-wider">Individual Colors</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tabTypes.map((tab) => {
                          const currentColor = settings.tabColors[tab.type as keyof typeof settings.tabColors] || tab.defaultColor;
                          const colorInputId = `color-${tab.type}`;
                          return (
                            <label
                              key={tab.type}
                              htmlFor={colorInputId}
                              className="group relative flex items-center gap-3 p-3 rounded-xl border border-theme-strong/50 bg-theme-surface hover:border-theme-strong hover:shadow-sm transition-all duration-200 cursor-pointer"
                            >
                              <div className="relative flex-shrink-0">
                                <div
                                  className="w-9 h-9 rounded-lg shadow-inner ring-1 ring-black/10 transition-transform duration-200 group-hover:scale-110"
                                  style={{ backgroundColor: currentColor }}
                                />
                                <input
                                  id={colorInputId}
                                  type="color"
                                  value={currentColor}
                                  onChange={(e) => handleTabColorChange(tab.type, e.target.value)}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium text-theme-label truncate">
                                  {tab.label}
                                </span>
                                <span className="text-xs text-theme-secondary/70 font-mono uppercase tracking-wider">
                                  {currentColor}
                                </span>
                              </div>
                              <div
                                className="absolute inset-0 rounded-xl opacity-[0.04] pointer-events-none transition-opacity duration-200"
                                style={{ backgroundColor: currentColor }}
                              />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ===== MODELS SECTION ===== */}
            {activeSection === 'models' && (
              <div className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-theme-title">AI Models</h2>
                  <p className="text-sm text-theme-muted mt-1">Manage language and image generation models</p>
                </div>

                {/* Language Model */}
                <Card data-search-section="ai-model">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="w-4.5 h-4.5 text-theme-secondary" />
                      Language Model
                    </CardTitle>
                    <CardDescription>Select the AI model to use for text generation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <select
                          className="flex-1 px-4 py-2 border border-theme-strong rounded-md bg-theme-surface text-theme-label focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-theme-tertiary disabled:cursor-not-allowed"
                          value={selectedModel}
                          onChange={(e) => handleModelSelect(e.target.value)}
                          disabled={isSelectingModel || loadingModels || availableModels.length === 0}
                        >
                          {isSelectingModel ? (
                            <option value="">Changing model...</option>
                          ) : loadingModels ? (
                            <option>Loading models...</option>
                          ) : availableModels.length === 0 ? (
                            <option>No models found</option>
                          ) : (
                            availableModels.map((model) => (
                              <option key={model.name} value={model.name}>
                                {model.name} ({model.size_mb.toFixed(2)} MB)
                              </option>
                            ))
                          )}
                        </select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchAvailableModels}
                          disabled={loadingModels}
                          className="px-3"
                          title="Refresh model list"
                        >
                          {loadingModels ? <HeartbeatLoader className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                        </Button>
                      </div>
                      {modelChangeMessage && (
                        <div className={`mt-2 p-3 rounded-lg text-sm ${
                          modelChangeMessage.startsWith('\u2705')
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {modelChangeMessage}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={handleOpenModelsFolder}
                          className="flex-1"
                        >
                          <FolderOpen className="w-4 h-4 mr-2" />
                          Browse Models Folder
                        </Button>
                      </div>
                      {availableModels.length > 0 && (
                        <p className="text-sm text-theme-hint">
                          {availableModels.length} model{availableModels.length !== 1 ? 's' : ''} found in models directory
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Diffusion Model */}
                <Card data-search-section="diffusion-model">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="w-4.5 h-4.5 text-theme-secondary" />
                      Diffusion Model
                    </CardTitle>
                    <CardDescription>Select the diffusion model used for image generation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <select
                          className="flex-1 px-4 py-2 border border-theme-strong rounded-md bg-theme-surface text-theme-label focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-theme-tertiary disabled:cursor-not-allowed"
                          value={selectedDiffusionModel}
                          onChange={(e) => handleDiffusionModelSelect(e.target.value)}
                          disabled={isSelectingDiffusionModel || loadingDiffusionModels || availableDiffusionModels.length === 0}
                        >
                          {isSelectingDiffusionModel ? (
                            <option value="">Changing model...</option>
                          ) : loadingDiffusionModels ? (
                            <option>Loading models...</option>
                          ) : availableDiffusionModels.length === 0 ? (
                            <option>No diffusion models found</option>
                          ) : (
                            availableDiffusionModels.map((model) => (
                              <option key={model.name} value={model.name}>
                                {model.name} ({model.size_mb.toFixed(0)} MB)
                              </option>
                            ))
                          )}
                        </select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchAvailableDiffusionModels}
                          disabled={loadingDiffusionModels}
                          className="px-3"
                          title="Refresh diffusion model list"
                        >
                          {loadingDiffusionModels ? <HeartbeatLoader className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                        </Button>
                      </div>
                      {diffusionModelChangeMessage && (
                        <div className={`mt-2 p-3 rounded-lg text-sm ${
                          diffusionModelChangeMessage.startsWith('Model changed')
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {diffusionModelChangeMessage}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={handleOpenDiffusionModelsFolder}
                          className="flex-1"
                        >
                          <FolderOpen className="w-4 h-4 mr-2" />
                          Browse Diffusion Models Folder
                        </Button>
                      </div>
                      {availableDiffusionModels.length > 0 && (
                        <p className="text-sm text-theme-hint">
                          {availableDiffusionModels.length} model{availableDiffusionModels.length !== 1 ? 's' : ''} found in image generation directory
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ===== GENERAL SECTION ===== */}
            {activeSection === 'general' && (
              <div className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-theme-title">General</h2>
                  <p className="text-sm text-theme-muted mt-1">App behavior, generation mode, and tutorials</p>
                </div>

                {/* Application Behavior */}
                <Card data-tutorial="settings-notifications">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-4.5 h-4.5 text-theme-secondary" />
                      Application Behavior
                    </CardTitle>
                    <CardDescription>Configure how the application behaves</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-theme-subtle">
                      <div>
                        <p className="text-sm font-medium text-theme-label">Auto-close all tabs on app close</p>
                        <p className="text-xs text-theme-hint">Automatically close all open tabs when you exit the application</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.autoCloseTabsOnExit}
                        onChange={(e) => updateSettings({ autoCloseTabsOnExit: e.target.checked })}
                        className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </label>
                  </CardContent>
                </Card>

                {/* Generation Behavior */}
                <Card data-search-section="generation-mode">
                  <CardHeader>
                    <CardTitle>Generation Behavior</CardTitle>
                    <CardDescription>
                      Control how AI generations are processed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { value: 'queued' as const, label: 'Queued (recommended)', desc: 'Tasks are processed one at a time. You can view and reorder the queue from the notification panel.' },
                        { value: 'simultaneous' as const, label: 'Simultaneous (experimental)', desc: 'All tasks generate immediately without queuing.' },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-150 ${
                            settings.generationMode === option.value
                              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                              : 'border-transparent hover:bg-theme-subtle'
                          }`}
                        >
                          <input
                            type="radio"
                            name="generationMode"
                            value={option.value}
                            checked={settings.generationMode === option.value}
                            onChange={() => updateSettings({ generationMode: option.value })}
                            className="w-4 h-4 mt-0.5 text-blue-600 border-theme-strong focus:ring-blue-500 cursor-pointer"
                          />
                          <div>
                            <span className="text-sm font-medium text-theme-label">{option.label}</span>
                            <p className="text-xs text-theme-hint mt-0.5">{option.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tutorial Management */}
                <Card data-tutorial="settings-tutorials">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-4.5 h-4.5 text-theme-secondary" />
                      Tutorials
                    </CardTitle>
                    <CardDescription>Control tutorial behavior and reset completed tutorials</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-theme-subtle">
                        <div>
                          <p className="text-sm font-medium text-theme-label">Auto-show tutorials on first use</p>
                          <p className="text-xs text-theme-hint">Automatically display tutorials when you open a tool for the first time</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.tutorials.tutorialPreferences.autoShowOnFirstUse}
                          onChange={(e) => updateSettings({
                            tutorials: {
                              ...settings.tutorials,
                              tutorialPreferences: {
                                ...settings.tutorials.tutorialPreferences,
                                autoShowOnFirstUse: e.target.checked
                              }
                            }
                          })}
                          className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-theme-subtle">
                        <div>
                          <p className="text-sm font-medium text-theme-label">Show floating tutorial buttons</p>
                          <p className="text-xs text-theme-hint">Display help buttons in the corner of each tool</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.tutorials.tutorialPreferences.showFloatingButtons}
                          onChange={(e) => updateSettings({
                            tutorials: {
                              ...settings.tutorials,
                              tutorialPreferences: {
                                ...settings.tutorials.tutorialPreferences,
                                showFloatingButtons: e.target.checked
                              }
                            }
                          })}
                          className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer"
                        />
                      </label>

                      <div className="pt-4 mt-2 border-t border-theme-strong/20">
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (confirm('Reset all tutorials? This will mark all tutorials as not completed.')) {
                              resetTutorials();
                            }
                          }}
                          className="w-full"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset All Tutorials
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ===== FEATURES SECTION ===== */}
            {activeSection === 'features' && (
              <div className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-theme-title">Features</h2>
                  <p className="text-sm text-theme-muted mt-1">Enable or disable optional tools</p>
                </div>

                <Card data-search-section="visual-studio">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-theme-secondary" />
                      Visual Studio
                    </CardTitle>
                    <CardDescription>Control access to Visual Studio tools (Worksheet Builder, Image Studio)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-theme-subtle">
                      <div>
                        <p className="text-sm font-medium text-theme-label">Enable Visual Studio tools</p>
                        <p className="text-xs text-theme-hint">When disabled, Visual Studio tools are hidden from the sidebar and cannot be accessed.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.visualStudioEnabled}
                        onChange={(e) => updateSettings({ visualStudioEnabled: e.target.checked })}
                        className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </label>
                  </CardContent>
                </Card>

                {/* Writing Assistant */}
                <Card data-search-section="writing-assistant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PenTool className="w-4.5 h-4.5 text-theme-secondary" />
                      Writing Assistant
                    </CardTitle>
                    <CardDescription>Spell check, autocorrect, and smart text features for all text inputs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-theme-subtle">
                        <div className="flex items-start gap-3">
                          <SpellCheck className="w-4 h-4 text-theme-secondary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-theme-label">Spell Check</p>
                            <p className="text-xs text-theme-hint">Highlight misspelled words with a red underline as you type</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.spellCheckEnabled}
                          onChange={(e) => updateSettings({ spellCheckEnabled: e.target.checked })}
                          className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
                        />
                      </label>

                      <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-theme-subtle">
                        <div className="flex items-start gap-3">
                          <BookA className="w-4 h-4 text-theme-secondary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-theme-label">Dictionary Suggestions</p>
                            <p className="text-xs text-theme-hint">Click on misspelled words to see a popup with spelling suggestions</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.dictionaryEnabled}
                          onChange={(e) => updateSettings({ dictionaryEnabled: e.target.checked })}
                          className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
                          disabled={!settings.spellCheckEnabled}
                        />
                      </label>

                      <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-theme-subtle">
                        <div className="flex items-start gap-3">
                          <Zap className="w-4 h-4 text-theme-secondary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-theme-label">Autocorrect</p>
                            <p className="text-xs text-theme-hint">Automatically fix common spelling mistakes and typos as you type</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.autocorrectEnabled}
                          onChange={(e) => updateSettings({ autocorrectEnabled: e.target.checked })}
                          className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
                        />
                      </label>

                      <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-theme-subtle">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-4 h-4 text-theme-secondary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-theme-label">Auto-Finish Sentence</p>
                            <p className="text-xs text-theme-hint">AI suggests how to finish your sentence after a brief pause. Press Tab to accept.</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.autoFinishEnabled}
                          onChange={(e) => updateSettings({ autoFinishEnabled: e.target.checked })}
                          className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
                        />
                      </label>

                      {settings.autoFinishEnabled && (
                        <div className="mt-2 mx-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30">
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            Auto-finish uses your AI model to suggest completions. If the model is busy generating content, suggestions may be delayed.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ===== LICENSE & UPDATES SECTION ===== */}
            {activeSection === 'license' && (
              <LicenseSection />
            )}

            {/* ===== DANGER ZONE SECTION ===== */}
            {activeSection === 'danger' && (
              <div className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">Danger Zone</h2>
                  <p className="text-sm text-red-600/70 dark:text-red-400/60 mt-1">Export, import, reset &amp; wipe your data</p>
                </div>

                {/* Export Data */}
                <Card className="border-theme-strong/20">
                  <CardHeader>
                    <CardTitle className="text-theme-title flex items-center gap-2">
                      <Download className="w-5 h-5 text-blue-500" />
                      Export Data
                    </CardTitle>
                    <CardDescription>Download a backup of your selected data as a JSON file.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-theme-muted uppercase tracking-wider">Select categories</span>
                      <button
                        className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        onClick={() => {
                          if (exportSelected.size === DATA_CATEGORIES.length) {
                            setExportSelected(new Set());
                          } else {
                            setExportSelected(new Set(DATA_CATEGORIES.map(c => c.key)));
                          }
                        }}
                      >
                        {exportSelected.size === DATA_CATEGORIES.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {DATA_CATEGORIES.map(cat => (
                        <label
                          key={cat.key}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                            exportSelected.has(cat.key)
                              ? 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300'
                              : 'bg-theme-surface/50 border border-theme-strong/10 text-theme-muted hover:bg-theme-surface'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                            exportSelected.has(cat.key) ? 'bg-blue-500 text-white' : 'border-2 border-theme-strong/30'
                          }`}>
                            {exportSelected.has(cat.key) && <Check className="w-3 h-3" />}
                          </div>
                          {cat.label}
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <Button
                        onClick={handleBulkExport}
                        disabled={isExporting || exportSelected.size === 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isExporting ? 'Exporting...' : `Export ${exportSelected.size} Categor${exportSelected.size === 1 ? 'y' : 'ies'}`}
                      </Button>
                      {exportMessage && (
                        <span className={`text-sm ${exportMessage.includes('fail') ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                          {exportMessage}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Import Data */}
                <Card
                  className={`transition-colors ${isDragging ? 'border-emerald-400 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-theme-strong/20'}`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleImportDrop}
                >
                  <CardHeader>
                    <CardTitle className="text-theme-title flex items-center gap-2">
                      <Upload className="w-5 h-5 text-emerald-500" />
                      Import Data
                    </CardTitle>
                    <CardDescription>Restore data from a previously exported backup file. Select which categories you want to import.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-theme-muted uppercase tracking-wider">Import categories</span>
                      <button
                        className="text-xs text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
                        onClick={() => {
                          if (importSelected.size === DATA_CATEGORIES.length) {
                            setImportSelected(new Set());
                          } else {
                            setImportSelected(new Set(DATA_CATEGORIES.map(c => c.key)));
                          }
                        }}
                      >
                        {importSelected.size === DATA_CATEGORIES.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {DATA_CATEGORIES.map(cat => (
                        <label
                          key={cat.key}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                            importSelected.has(cat.key)
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300'
                              : 'bg-theme-surface/50 border border-theme-strong/10 text-theme-muted hover:bg-theme-surface'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                            importSelected.has(cat.key) ? 'bg-emerald-500 text-white' : 'border-2 border-theme-strong/30'
                          }`}>
                            {importSelected.has(cat.key) && <Check className="w-3 h-3" />}
                          </div>
                          {cat.label}
                        </label>
                      ))}
                    </div>

                    {/* Drop zone / file picker */}
                    <div
                      className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                        isDragging
                          ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 scale-[1.01]'
                          : 'border-theme-strong/20 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10'
                      }`}
                      onClick={() => !isImporting && importSelected.size > 0 && importFileRef.current?.click()}
                    >
                      <div className="flex flex-col items-center justify-center py-8 gap-2 pointer-events-none">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                          isDragging ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-theme-surface/80'
                        }`}>
                          <Upload className={`w-6 h-6 transition-colors ${isDragging ? 'text-emerald-500' : 'text-theme-muted'}`} />
                        </div>
                        <p className={`text-sm font-medium ${isDragging ? 'text-emerald-600 dark:text-emerald-400' : 'text-theme-label'}`}>
                          {isDragging ? 'Drop your backup file here' : 'Drag & drop your backup file here'}
                        </p>
                        <p className="text-xs text-theme-muted">or click to browse</p>
                        <p className="text-[11px] text-theme-hint mt-1">.json files only</p>
                      </div>
                    </div>

                    <input
                      ref={importFileRef}
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleImportFile}
                    />

                    <div className="flex items-center gap-3">
                      {isImporting && (
                        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Importing...</span>
                      )}
                      {importMessage && (
                        <span className={`text-sm ${importMessage.includes('fail') || importMessage.includes('Invalid') || importMessage.includes('Please') ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                          {importMessage}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Divider */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex-1 h-px bg-red-200 dark:bg-red-800/40" />
                  <span className="text-xs font-medium text-red-400 dark:text-red-500 uppercase tracking-wider">Destructive Actions</span>
                  <div className="flex-1 h-px bg-red-200 dark:bg-red-800/40" />
                </div>

                {/* Reset Settings */}
                <Card className="border-red-200 dark:border-red-800/50" data-tutorial="settings-reset">
                  <CardHeader>
                    <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                      <RotateCcw className="w-5 h-5" />
                      Reset Settings
                    </CardTitle>
                    <CardDescription>Restore all settings to their default values. Your data will not be affected.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleResetClick}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      Reset All Settings to Default
                    </Button>
                  </CardContent>
                </Card>

                {/* Wipe App */}
                <Card className="border-red-300 dark:border-red-700/50" data-tutorial="settings-wipe">
                  <CardHeader>
                    <CardTitle className="text-red-800 dark:text-red-400 flex items-center gap-2">
                      <Trash2 className="w-5 h-5" />
                      Wipe Entire App
                    </CardTitle>
                    <CardDescription className="text-red-600/80 dark:text-red-400/60">
                      Delete all data including chat history, generated resources, milestones, student records, and settings.
                      The app will behave as if opened for the first time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setShowWipeDialog(true)}
                      className="bg-red-700 hover:bg-red-800 text-white"
                    >
                      Wipe All App Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

          </div>
        </ScrollArea>
      </div>

      {/* Wipe Confirmation Dialog */}
      {showWipeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-lg p-6 max-w-md w-full mx-4 widget-glass">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-6 h-6 text-red-700" />
              <h3 className="text-lg font-semibold text-theme-title">Wipe Entire App?</h3>
            </div>
            <p className="text-theme-muted mb-2">
              This will permanently delete:
            </p>
            <ul className="text-theme-muted mb-4 text-sm list-disc list-inside space-y-1">
              <li>All chat conversations</li>
              <li>All generated lesson plans, quizzes, rubrics, and worksheets</li>
              <li>All curriculum milestones and progress</li>
              <li>All student records</li>
              <li>All generated images</li>
              <li>All app settings and preferences</li>
            </ul>
            <p className="text-red-600 font-medium mb-6 text-sm">
              This action cannot be undone. The app will reload after wiping.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setShowWipeDialog(false)}
                variant="outline"
                className="px-4 py-2"
                disabled={isWiping}
              >
                Cancel
              </Button>
              <Button
                onClick={handleWipeApp}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white"
                disabled={isWiping}
              >
                {isWiping ? 'Wiping...' : 'Wipe Everything'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-lg p-6 max-w-md w-full mx-4 widget-glass">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-theme-title">Reset Settings?</h3>
            </div>
            <p className="text-theme-muted mb-6">
              Are you sure you want to reset all settings to their default values? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={handleCancelReset}
                variant="outline"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
              >
                Reset Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Components */}
      <TutorialOverlay
        steps={tutorials[TUTORIAL_IDS.SETTINGS].steps}
        onComplete={handleTutorialComplete}
        autoStart={showTutorial}
        showFloatingButton={false}
      />

      {!showTutorial && settings.tutorials.tutorialPreferences.showFloatingButtons && (
        <TutorialButton
          tutorialId={TUTORIAL_IDS.SETTINGS}
          onStartTutorial={() => setShowTutorial(true)}
          position="bottom-right"
        />
      )}
    </div>
  );
};

function LicenseSection() {
  const { isLicensed, email, schoolName, loading, error, activate, deactivate } = useLicense();
  const [licenseEmail, setLicenseEmail] = useState('');
  const [licenseCode, setLicenseCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await activate(licenseEmail.trim(), licenseCode.trim().toUpperCase());
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-theme-title">License & Updates</h2>
        <p className="text-sm text-theme-muted mt-1">Enter a license code to receive automatic updates. The app works fully without a license.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-4.5 h-4.5 text-theme-secondary" />
            License Status
          </CardTitle>
          <CardDescription>
            A valid license enables automatic updates when new versions are available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLicensed ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">License Active</p>
                  {email && <p className="text-xs text-emerald-600 dark:text-emerald-400">{email}</p>}
                  {schoolName && <p className="text-xs text-emerald-600 dark:text-emerald-400">{schoolName}</p>}
                  <p className="text-xs text-emerald-500 dark:text-emerald-500 mt-1">Automatic updates are enabled</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.electronAPI?.checkForUpdates?.()}
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check for Updates
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm('Deactivate your license? You will no longer receive automatic updates.')) {
                      deactivate();
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Deactivate
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleActivate} className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  The app works fully without a license. A license code is only needed to receive automatic updates.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-label mb-1">Email address</label>
                <Input
                  type="email"
                  placeholder="you@school.edu"
                  value={licenseEmail}
                  onChange={e => setLicenseEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-label mb-1">License code</label>
                <Input
                  type="text"
                  placeholder="OECS-XXXX-XXXX-XXXX"
                  value={licenseCode}
                  onChange={e => setLicenseCode(e.target.value)}
                  required
                  className="font-mono tracking-wider"
                />
              </div>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <Button type="submit" disabled={submitting || loading} className="w-full">
                {submitting ? 'Validating...' : 'Activate License'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;