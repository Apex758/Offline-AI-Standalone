import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, Eye, EyeOff, AlertTriangle, RotateCcw, FolderOpen, RefreshCw, Trash2, Palette, Monitor, Cpu, Layers, BookOpen, Sparkles, ChevronRight, Type, Sun, Moon, Image, User, X } from 'lucide-react';
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

  // Tutorial integration
  const [showTutorial, setShowTutorial] = useState(false);

  // Profile state synced with Dashboard localStorage
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  // Section navigation
  type SettingsSection = 'profile' | 'appearance' | 'models' | 'general' | 'features' | 'danger';
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
    { id: 'features' as const, label: 'Features', icon: Sparkles, description: 'Visual Studio & tools' },
    { id: 'danger' as const, label: 'Danger Zone', icon: AlertTriangle, description: 'Reset & wipe data' },
  ];

  // Tab types and their default colors (matching sidebar order)
  const tabTypes = [
    { type: 'analytics', label: 'My Overview', defaultColor: '#3b82f6' },
    { type: 'resource-manager', label: 'My Resources', defaultColor: '#84cc16' },
    { type: 'chat', label: 'Ask PEARL', defaultColor: '#3b82f6' },
    { type: 'curriculum', label: 'Curriculum Browser', defaultColor: '#8b5cf6' },
    { type: 'curriculum-tracker', label: 'Progress Tracker', defaultColor: '#10b981' },
    { type: 'quiz-generator', label: 'Quiz Builder', defaultColor: '#14b8a6' },
    { type: 'rubric-generator', label: 'Rubric Builder', defaultColor: '#f97316' },
    { type: 'lesson-planner', label: 'Lesson Plan', defaultColor: '#f59e0b' },
    { type: 'kindergarten-planner', label: 'Early Childhood', defaultColor: '#ec4899' },
    { type: 'multigrade-planner', label: 'Multi-Level', defaultColor: '#06b6d4' },
    { type: 'cross-curricular-planner', label: 'Integrated Lesson', defaultColor: '#6366f1' },
    { type: 'class-management', label: 'My Classes', defaultColor: '#f97316' },
    { type: 'settings', label: 'Settings', defaultColor: '#6b7280' },
    ...(settings.visualStudioEnabled ? [
      { type: 'worksheet-generator', label: 'Worksheet Builder', defaultColor: '#8b5cf6' },
      { type: 'image-studio', label: 'Image Studio', defaultColor: '#ec4899' },
    ] : [])
  ];

  const handleTabColorChange = (tabType: string, color: string) => {
    updateSettings({
      tabColors: {
        ...settings.tabColors,
        [tabType]: color
      }
    });
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

  // Export functions
  const handleExportChats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/chat-history');
      const chats = response.data;
      
      if (!chats || chats.length === 0) {
        alert('No chat history to export');
        return;
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        type: 'chats',
        count: chats.length,
        data: chats
      };

      const filename = `chats-export-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(exportData, filename);
    } catch (error) {
      console.error('Failed to export chats:', error);
      alert('Failed to export chats');
    }
  };

  const handleExportLessonPlans = async () => {
    try {
      // Fetch all lesson plan types
      const [standard, kindergarten, multigrade, crossCurricular] = await Promise.all([
        axios.get('http://localhost:8000/api/lesson-plan-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/kindergarten-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/multigrade-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/cross-curricular-history').catch(() => ({ data: [] }))
      ]);

      const allPlans = {
        standard: standard.data || [],
        kindergarten: kindergarten.data || [],
        multigrade: multigrade.data || [],
        crossCurricular: crossCurricular.data || []
      };

      const totalCount = allPlans.standard.length + allPlans.kindergarten.length +
                        allPlans.multigrade.length + allPlans.crossCurricular.length;

      if (totalCount === 0) {
        alert('No lesson plans to export');
        return;
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        type: 'lesson-plans',
        count: totalCount,
        data: allPlans
      };

      const filename = `lesson-plans-export-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(exportData, filename);
    } catch (error) {
      console.error('Failed to export lesson plans:', error);
      alert('Failed to export lesson plans');
    }
  };

  const handleExportQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/quiz-history');
      const quizzes = response.data;
      
      if (!quizzes || quizzes.length === 0) {
        alert('No quizzes to export');
        return;
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        type: 'quizzes',
        count: quizzes.length,
        data: quizzes
      };

      const filename = `quizzes-export-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(exportData, filename);
    } catch (error) {
      console.error('Failed to export quizzes:', error);
      alert('Failed to export quizzes');
    }
  };

  const handleExportRubrics = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/rubric-history');
      const rubrics = response.data;
      
      if (!rubrics || rubrics.length === 0) {
        alert('No rubrics to export');
        return;
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        type: 'rubrics',
        count: rubrics.length,
        data: rubrics
      };

      const filename = `rubrics-export-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(exportData, filename);
    } catch (error) {
      console.error('Failed to export rubrics:', error);
      alert('Failed to export rubrics');
    }
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
                        }}
                        className="text-xs gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
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
              </div>
            )}

            {/* ===== DANGER ZONE SECTION ===== */}
            {activeSection === 'danger' && (
              <div className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">Danger Zone</h2>
                  <p className="text-sm text-red-600/70 dark:text-red-400/60 mt-1">Irreversible actions -- proceed with caution</p>
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

      {/* OECS Authentication Key Section - Hidden */}
      {false && <Card className="mb-6" data-tutorial="settings-api">
        <CardHeader>
          <CardTitle>OECS Authentication Key (OAK)</CardTitle>
          <CardDescription>Used for app updates and accessing new models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your OAK key"
              value={settings.oakKey}
              onChange={(e) => updateSettings({ oakKey: e.target.value })}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-hint hover:text-theme-label"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </CardContent>
      </Card>}

      {/* Export Data Section - Hidden */}
      {false && <Card className="mb-6" data-tutorial="settings-export">
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>Export your data for backup or transfer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" className="w-full" onClick={handleExportChats}>
              Export All Chats
            </Button>
            <Button variant="outline" className="w-full" onClick={handleExportLessonPlans}>
              Export All Lesson Plans
            </Button>
            <Button variant="outline" className="w-full" onClick={handleExportQuizzes}>
              Export All Quizzes
            </Button>
            <Button variant="outline" className="w-full" onClick={handleExportRubrics}>
              Export All Rubrics
            </Button>
          </div>
        </CardContent>
      </Card>}

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

export default Settings;