import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Eye, EyeOff, AlertTriangle, RotateCcw, Play, FolderOpen, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { useSettings } from '../contexts/SettingsContext';
import { downloadJSON } from '../lib/utils';
import axios from 'axios';
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
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [isSelectingModel, setIsSelectingModel] = useState(false);
  const [modelChangeMessage, setModelChangeMessage] = useState('');
  
  // Tutorial integration
  const [showTutorial, setShowTutorial] = useState(false);

  // Fetch available models on component mount
  useEffect(() => {
    fetchAvailableModels();
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

  const handleTutorialComplete = () => {
    markTutorialComplete(TUTORIAL_IDS.SETTINGS);
    setShowTutorial(false);
  };

  // Tab types and their default colors (matching sidebar order)
  const tabTypes = [
    { type: 'analytics', label: 'Dashboard', defaultColor: '#3b82f6' },
    { type: 'resource-manager', label: 'Resource Manager', defaultColor: '#84cc16' },
    { type: 'chat', label: 'Chat', defaultColor: '#3b82f6' },
    { type: 'curriculum', label: 'Curriculum', defaultColor: '#8b5cf6' },
    { type: 'quiz-generator', label: 'Quiz Generator', defaultColor: '#14b8a6' },
    { type: 'rubric-generator', label: 'Rubric Generator', defaultColor: '#f97316' },
    { type: 'lesson-planner', label: 'Standard Lesson', defaultColor: '#f59e0b' },
    { type: 'kindergarten-planner', label: 'Kindergarten', defaultColor: '#ec4899' },
    { type: 'multigrade-planner', label: 'Multigrade', defaultColor: '#06b6d4' },
    { type: 'cross-curricular-planner', label: 'Cross-Curricular', defaultColor: '#6366f1' },
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
    <div className="h-full bg-gray-50" data-tutorial="settings-welcome">
      <ScrollArea className="h-full">
        <div className="max-w-4xl mx-auto p-6 pb-20">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <SettingsIcon className="w-8 h-8 text-gray-700" />
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            </div>
            <p className="text-gray-600">Customize your PEARL AI experience</p>
          </div>

          {/* Font Scaling Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Font Size</CardTitle>
              <CardDescription>Adjust the font size for better readability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="80"
                    max="120"
                    step="5"
                    value={settings.fontSize}
                    onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-lg font-semibold text-gray-700 min-w-[60px] text-right">
                    {settings.fontSize}%
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>80%</span>
                  <span>100%</span>
                  <span>120%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab Colors Section */}
          <Card className="mb-6" data-tutorial="settings-tab-colors">
            <CardHeader>
              <CardTitle>Tab Colors</CardTitle>
              <CardDescription>Customize the color scheme for each tab type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tabTypes.map((tab) => (
                  <div key={tab.type} className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.tabColors[tab.type as keyof typeof settings.tabColors] || tab.defaultColor}
                      onChange={(e) => handleTabColorChange(tab.type, e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer flex-shrink-0"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {tab.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Model Selection Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>AI Model</CardTitle>
              <CardDescription>Select the AI model to use for generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    <RefreshCw className={`w-4 h-4 ${loadingModels ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                {modelChangeMessage && (
                  <div className={`mt-2 p-3 rounded-lg text-sm ${
                    modelChangeMessage.startsWith('✅')
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
                  <p className="text-sm text-gray-500">
                    {availableModels.length} model{availableModels.length !== 1 ? 's' : ''} found in models directory
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* OECS Authentication Key Section */}
          <Card className="mb-6" data-tutorial="settings-api">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Tutorial Management Section */}
          <Card className="mb-6" data-tutorial="settings-tutorials">
            <CardHeader>
              <CardTitle>Tutorial Management</CardTitle>
              <CardDescription>Control tutorial behavior and reset completed tutorials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Auto-show tutorials toggle */}
                <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Auto-show tutorials on first use</p>
                    <p className="text-xs text-gray-500">Automatically display tutorials when you open a tool for the first time</p>
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
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                {/* Show floating buttons toggle */}
                <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Show floating tutorial buttons</p>
                    <p className="text-xs text-gray-500">Display help buttons in the corner of each tool</p>
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
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                {/* Tutorial list */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Available Tutorials</h4>
                  <div className="space-y-2">
                    {Object.values(tutorials).map((tutorial) => {
                      const isCompleted = isTutorialCompleted(tutorial.id);
                      return (
                        <div key={tutorial.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">{tutorial.name}</p>
                            <p className="text-xs text-gray-500">{tutorial.description}</p>
                            {isCompleted && (
                              <span className="text-xs text-green-600 mt-1 inline-block">✓ Completed</span>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Remove from completed list to allow replay
                              updateSettings({
                                tutorials: {
                                  ...settings.tutorials,
                                  completedTutorials: settings.tutorials.completedTutorials.filter(id => id !== tutorial.id)
                                }
                              });
                            }}
                            className="ml-3"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Replay
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reset all tutorials button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
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

          {/* Export Data Section */}
          <Card className="mb-6" data-tutorial="settings-export">
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
          </Card>

          {/* App Behavior Section */}
          <Card className="mb-6" data-tutorial="settings-notifications">
            <CardHeader>
              <CardTitle>Application Behavior</CardTitle>
              <CardDescription>Configure how the application behaves</CardDescription>
            </CardHeader>
            <CardContent>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoCloseTabsOnExit}
                  onChange={(e) => updateSettings({ autoCloseTabsOnExit: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">
                  Auto-close all tabs on app close
                </span>
              </label>
            </CardContent>
          </Card>

          {/* Generation Behavior Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Generation Behavior</CardTitle>
              <CardDescription>
                Control how AI generations are processed. "Queued" is recommended for stability; "Simultaneous" is experimental and may cause issues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="generationMode"
                    value="queued"
                    checked={settings.generationMode === 'queued'}
                    onChange={() => updateSettings({ generationMode: 'queued' })}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Queued (recommended)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="generationMode"
                    value="simultaneous"
                    checked={settings.generationMode === 'simultaneous'}
                    onChange={() => updateSettings({ generationMode: 'simultaneous' })}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Simultaneous (experimental)</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Theme Section */}
          <Card className="mb-6" data-tutorial="settings-appearance">
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Choose your preferred theme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={settings.theme === 'light'}
                    onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' | 'system' })}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Light</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={settings.theme === 'dark'}
                    onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' | 'system' })}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Dark</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="system"
                    checked={settings.theme === 'system'}
                    onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' | 'system' })}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">System</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Color Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Sidebar Color</CardTitle>
              <CardDescription>Customize the sidebar background color</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={settings.sidebarColor}
                  onChange={(e) => updateSettings({ sidebarColor: e.target.value })}
                  className="w-16 h-12 rounded border border-gray-300 cursor-pointer"
                />
                <div
                  className="flex-1 h-12 rounded-md flex items-center px-4 text-white font-medium"
                  style={{ backgroundColor: settings.sidebarColor }}
                >
                  Preview
                </div>
                <span className="text-sm text-gray-600 font-mono">{settings.sidebarColor}</span>
              </div>
            </CardContent>
          </Card>

          {/* Reset Section */}
          <Card className="mb-6 border-red-200 bg-red-50" data-tutorial="settings-reset">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Reset Settings
              </CardTitle>
              <CardDescription>Restore all settings to their default values</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleResetClick}
                className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white"
              >
                Reset All Settings to Default
              </Button>
            </CardContent>
          </Card>

          {/* Reset Confirmation Dialog */}
          {showResetDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Reset Settings?</h3>
                </div>
                <p className="text-gray-600 mb-6">
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
        </div>
      </ScrollArea>

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