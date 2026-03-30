import React, { useState, useEffect, useRef } from 'react';
import { resetStepsCache } from '../lib/imageApi';
import { HugeiconsIcon } from '@hugeicons/react';
import Settings01IconData from '@hugeicons/core-free-icons/Settings01Icon';
import ViewIconData from '@hugeicons/core-free-icons/ViewIcon';
import ViewOffIconData from '@hugeicons/core-free-icons/ViewOffIcon';
import AlertCircleIconData from '@hugeicons/core-free-icons/AlertCircleIcon';
import ReloadIconData from '@hugeicons/core-free-icons/ReloadIcon';
import FolderOpenIconData from '@hugeicons/core-free-icons/FolderOpenIcon';
import Delete02IconData from '@hugeicons/core-free-icons/Delete02Icon';
import ColorsIconData from '@hugeicons/core-free-icons/ColorsIcon';
import ComputerIconData from '@hugeicons/core-free-icons/ComputerIcon';
import CpuIconData from '@hugeicons/core-free-icons/CpuIcon';
import Layers01IconData from '@hugeicons/core-free-icons/Layers01Icon';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import SlidersHorizontalIconData from '@hugeicons/core-free-icons/SlidersHorizontalIcon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import TextFontIconData from '@hugeicons/core-free-icons/TextFontIcon';
import Sun01IconData from '@hugeicons/core-free-icons/Sun01Icon';
import Moon01IconData from '@hugeicons/core-free-icons/Moon01Icon';
import Image01IconData from '@hugeicons/core-free-icons/Image01Icon';
import UserIconData from '@hugeicons/core-free-icons/UserIcon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import TextCheckIconData from '@hugeicons/core-free-icons/TextCheckIcon';
import PenTool01IconData from '@hugeicons/core-free-icons/PenTool01Icon';
import FlashIconData from '@hugeicons/core-free-icons/FlashIcon';
import BookAIconData from '@hugeicons/core-free-icons/BookAIcon';
import Download01IconData from '@hugeicons/core-free-icons/Download01Icon';
import Upload01IconData from '@hugeicons/core-free-icons/Upload01Icon';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import ShuffleIconData from '@hugeicons/core-free-icons/ShuffleIcon';
import MinusSignIconData from '@hugeicons/core-free-icons/MinusSignIcon';
import PlusSignIconData from '@hugeicons/core-free-icons/PlusSignIcon';
import PaintBrush01IconData from '@hugeicons/core-free-icons/PaintBrush01Icon';
import DropletIconData from '@hugeicons/core-free-icons/DropletIcon';
import BlendIconData from '@hugeicons/core-free-icons/BlendIcon';
import ComputerSettingsIconData from '@hugeicons/core-free-icons/ComputerSettingsIcon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import Rocket01IconData from '@hugeicons/core-free-icons/Rocket01Icon';
import DragDropVerticalIconData from '@hugeicons/core-free-icons/DragDropVerticalIcon';
import LockIconData from '@hugeicons/core-free-icons/LockIcon';
import DashboardSquare01IconData from '@hugeicons/core-free-icons/DashboardSquare01Icon';
import Brain01IconData from '@hugeicons/core-free-icons/Brain01Icon';
import Search01IconData from '@hugeicons/core-free-icons/Search01Icon';
import Message01IconData from '@hugeicons/core-free-icons/Message01Icon';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SidebarItemConfig, DEFAULT_SIDEBAR_ORDER } from '../contexts/SettingsContext';
import { useCapabilities, DualModelConfig } from '../contexts/CapabilitiesContext';
import { FEATURE_MODULES } from '../lib/featureModules';
import { FeatureModuleId } from '../types/feature-disclosure';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const SettingsIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Settings01IconData} {...p} />;
const Eye: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ViewIconData} {...p} />;
const EyeOff: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ViewOffIconData} {...p} />;
const AlertTriangle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={AlertCircleIconData} {...p} />;
const RotateCcw: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ReloadIconData} {...p} />;
const FolderOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FolderOpenIconData} {...p} />;
const RefreshCw: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ReloadIconData} {...p} />;
const Trash2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Delete02IconData} {...p} />;
const Palette: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ColorsIconData} {...p} />;
const Monitor: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ComputerIconData} {...p} />;
const Cpu: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CpuIconData} {...p} />;
const Layers: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Layers01IconData} {...p} />;
const BookOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookOpen01IconData} {...p} />;
const Sliders: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SlidersHorizontalIconData} {...p} />;
const ChevronRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowRight01IconData} {...p} />;
const Type: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={TextFontIconData} {...p} />;
const Sun: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Sun01IconData} {...p} />;
const Moon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Moon01IconData} {...p} />;
const Image: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Image01IconData} {...p} />;
const User: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UserIconData} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const SpellCheck: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={TextCheckIconData} {...p} />;
const PenTool: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PenTool01IconData} {...p} />;
const Zap: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FlashIconData} {...p} />;
const BookA: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookAIconData} {...p} />;
const Download: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Download01IconData} {...p} />;
const Upload: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Upload01IconData} {...p} />;
const Check: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Tick01IconData} {...p} />;
const Shuffle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ShuffleIconData} {...p} />;
const Minus: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={MinusSignIconData} {...p} />;
const Plus: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PlusSignIconData} {...p} />;
const Paintbrush: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PaintBrush01IconData} {...p} />;
const Droplets: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={DropletIconData} {...p} />;
const Blend: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BlendIconData} {...p} />;
const ComputerSettings: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ComputerSettingsIconData} {...p} />;
const ArrowDownTray: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowDown01IconData} {...p} />;
const Rocket: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Rocket01IconData} {...p} />;
const GripVertical: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={DragDropVerticalIconData} {...p} />;
const Lock: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={LockIconData} {...p} />;
const LayoutDashboardIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={DashboardSquare01IconData} {...p} />;
const BrainIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Brain01IconData} {...p} />;
const SearchIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Search01IconData} {...p} />;
const MessageIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Message01IconData} {...p} />;

// Sidebar item metadata for Features section
const SIDEBAR_ITEM_META: Record<string, { name: string; icon: React.FC<{ className?: string; style?: React.CSSProperties }>; description?: string; childCount?: number }> = {
  'analytics': { name: 'My Overview', icon: LayoutDashboardIcon },
  'brain-dump': { name: 'Brain Dump', icon: BrainIcon },
  'curriculum-tracker': { name: 'Progress Tracker', icon: (p) => <Icon icon={Layers01IconData} {...p} /> },
  'resource-manager': { name: 'My Resources', icon: FolderOpen },
  'chat': { name: 'Ask PEARL', icon: MessageIcon },
  'curriculum': { name: 'Curriculum Browser', icon: SearchIcon },
  'quiz-generator': { name: 'Quiz Builder', icon: PenTool },
  'rubric-generator': { name: 'Rubric Builder', icon: (p) => <Icon icon={BookOpen01IconData} {...p} /> },
  'class-management': { name: 'My Classes', icon: User },
  'lesson-planners': { name: 'Lesson Planners', icon: (p) => <Icon icon={BookOpen01IconData} {...p} />, childCount: 4 },
  'visual-studio': { name: 'Visual Studio', icon: PenTool, childCount: 3 },
  'performance-metrics': { name: 'Performance Metrics', icon: Cpu },
  'support': { name: 'Support & Reporting', icon: (p) => <Icon icon={AlertCircleIconData} {...p} /> },
  'settings': { name: 'Settings', icon: SettingsIcon },
};

const PINNED_TOP = ['analytics'];
const PINNED_BOTTOM = ['support', 'settings'];
const NON_TOGGLEABLE = new Set(['analytics', 'settings']);

// Sortable sidebar item component
const SortableSidebarItem: React.FC<{
  item: SidebarItemConfig;
  onToggle: (id: string, enabled: boolean) => void;
}> = ({ item, onToggle }) => {
  const meta = SIDEBAR_ITEM_META[item.id];
  const isLocked = NON_TOGGLEABLE.has(item.id);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  if (!meta) return null;
  const ItemIcon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
        isDragging
          ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40 shadow-lg'
          : 'bg-theme-surface border-theme-strong/10 hover:bg-theme-subtle'
      } ${!item.enabled && !isLocked ? 'opacity-50' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing flex-shrink-0 text-theme-muted hover:text-theme-label"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <ItemIcon className="w-4.5 h-4.5 text-theme-secondary flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-theme-label truncate">{meta.name}</p>
        {meta.childCount && (
          <p className="text-xs text-theme-hint">{meta.childCount} tools</p>
        )}
      </div>
      {isLocked ? (
        <Lock className="w-4 h-4 text-theme-muted flex-shrink-0" />
      ) : (
        <input
          type="checkbox"
          checked={item.enabled}
          onChange={(e) => onToggle(item.id, e.target.checked)}
          className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
        />
      )}
    </div>
  );
};
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { useSettings } from '../contexts/SettingsContext';
import { GRADE_LEVELS, SUBJECTS, GRADE_LABEL_MAP, getTeacherGrades, getTeacherSubjects } from '../data/teacherConstants';
import { downloadJSON } from '../lib/utils';
import axios from 'axios';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import { useLicense } from '../contexts/LicenseContext';
import { FEATURE_CATALOG, CATEGORY_LABELS, type FeatureCategory } from '../data/featureDiscoveryData';
import { useFeatureDetection } from '../hooks/useFeatureDetection';
import Compass01IconData from '@hugeicons/core-free-icons/Compass01Icon';
import ArrowRight02IconData from '@hugeicons/core-free-icons/ArrowRight02Icon';
import CircleArrowRight01IconData from '@hugeicons/core-free-icons/CircleArrowRight01Icon';

const Compass: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Compass01IconData} {...p} />;
const ArrowRightCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CircleArrowRight01IconData} {...p} />;
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowDown01IconData} {...p} />;

interface SettingsProps {
  tabId?: string;
  savedData?: Record<string, unknown>;
  onDataChange?: (data: Record<string, unknown>) => void;
  onNavigateToTool?: (toolType: string) => void;
}

interface ModelInfo {
  name: string;
  path: string;
  size_mb: number;
  extension: string;
  is_active: boolean;
}

const Settings: React.FC<SettingsProps> = ({ onNavigateToTool }) => {
  const { settings, updateSettings, resetSettings, markTutorialComplete, isTutorialCompleted, resetTutorials, markFeatureDiscovered, resetSetup, hasCompletedSetup, toggleModule } = useSettings();
  const { tier, hasVision, hasOcr, hasDiffusion, dualModel, refreshCapabilities } = useCapabilities();
  const FEATURE_MODULE_LIST = FEATURE_MODULES;
  const handleToggleFeatureModule = (moduleId: FeatureModuleId) => toggleModule(moduleId);
  // dnd-kit sensors for sidebar reordering (must be at top level)
  const dndSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Profile: active grade tab for per-grade subject editing
  const [activeGradeTab, setActiveGradeTab] = useState<string | null>(null);

  // Feature Discovery state
  const [discoveryCategory, setDiscoveryCategory] = useState<'all' | FeatureCategory>('all');
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [discoverySearch, setDiscoverySearch] = useState('');
  const { detectionMap, discoveredCount, totalCount, percentage } = useFeatureDetection(FEATURE_CATALOG);
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

  // Tier config state
  const [tierConfig, setTierConfig] = useState<any>(null);
  const [dualModelEnabled, setDualModelEnabled] = useState(false);
  const [fastModel, setFastModel] = useState<string | null>(null);
  const [taskRouting, setTaskRouting] = useState<Record<string, 'fast' | 'primary'>>({});

  // OCR (HunyuanOCR) state
  const [ocrEnabled, setOcrEnabled] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<{available: boolean; loaded: boolean; loading: boolean; saved_locally?: boolean; local_size_mb?: number} | null>(null);
  const [ocrMessage, setOcrMessage] = useState('');

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
    { key: 'presentations', label: 'Presentations' },
    { key: 'brain_dumps', label: 'Brain Dumps' },
    { key: 'tasks', label: 'Tasks & Reminders' },
    { key: 'milestones', label: 'Progress Tracker' },
    { key: 'achievements', label: 'Achievements' },
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

  // File access state
  const [allowedFolders, setAllowedFolders] = useState<string[]>([]);
  const [defaultFolders, setDefaultFolders] = useState<string[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);

  // Load allowed folders from Electron on mount
  useEffect(() => {
    const api = (window as any).electronAPI;
    if (api?.getAllowedFolders) {
      setLoadingFolders(true);
      api.getAllowedFolders().then((folders: string[]) => {
        setAllowedFolders(folders);
        // First two are always defaults (Downloads + Desktop)
        setDefaultFolders(folders.slice(0, 2));
        setLoadingFolders(false);
      }).catch(() => setLoadingFolders(false));
    }
  }, []);

  // Tutorial integration
  const [showTutorial, setShowTutorial] = useState(false);

  // Profile state synced with Dashboard localStorage
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  // Section navigation
  type SettingsSection = 'profile' | 'appearance' | 'models' | 'general' | 'features' | 'discovery' | 'files' | 'license' | 'danger';
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
    fetchOcrStatus();
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/tier-config')
      .then(r => r.json())
      .then(config => {
        setTierConfig(config);
        const dm = config.dual_model || {};
        setDualModelEnabled(dm.enabled || false);
        setFastModel(dm.fast_model || null);
        setTaskRouting(dm.task_routing || {});
      })
      .catch(() => {});
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
        await refreshCapabilities();
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

  const handleTierAssign = async (model: string, newTier: number) => {
    try {
      await fetch('http://localhost:8000/api/tier-config/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, tier: newTier }),
      });
      // Refresh tier config and capabilities
      const res = await fetch('http://localhost:8000/api/tier-config');
      const config = await res.json();
      setTierConfig(config);
      await refreshCapabilities();
    } catch (e) {
      console.error('Failed to assign tier:', e);
    }
  };

  const handleDualModelUpdate = async (updates: Partial<DualModelConfig>) => {
    try {
      const body: any = {};
      if ('enabled' in updates) {
        body.enabled = updates.enabled;
        setDualModelEnabled(updates.enabled!);
      }
      if ('fast_model' in updates) {
        body.fast_model = updates.fast_model;
        setFastModel(updates.fast_model!);
      }
      if ('task_routing' in updates) {
        body.task_routing = updates.task_routing;
        setTaskRouting(updates.task_routing!);
      }
      await fetch('http://localhost:8000/api/tier-config/dual-model', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await refreshCapabilities();
    } catch (e) {
      console.error('Failed to update dual model config:', e);
    }
  };

  const handleTaskRoutingChange = (task: string, target: 'fast' | 'primary') => {
    const updated = { ...taskRouting, [task]: target };
    setTaskRouting(updated);
    handleDualModelUpdate({ task_routing: updated });
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
        resetStepsCache();
        setDiffusionModelChangeMessage(`Model changed to ${modelName}. Please restart the app for changes to take effect.`);
        await refreshCapabilities();
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

  // OCR functions
  const fetchOcrStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/ocr/status');
      if (response.ok) {
        const data = await response.json();
        setOcrStatus({ available: data.available, loaded: data.loaded, loading: data.loading, saved_locally: data.saved_locally, local_size_mb: data.local_size_mb });
        setOcrEnabled(data.enabled);
      }
    } catch {
      setOcrStatus(null);
    }
  };

  const handleOcrToggle = async (enabled: boolean) => {
    setOcrEnabled(enabled);
    try {
      await fetch('http://localhost:8000/api/ocr/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      setOcrMessage(enabled ? 'OCR grading enabled. Model will load on first scan.' : 'OCR grading disabled. Will use vision model instead.');
      setTimeout(() => setOcrMessage(''), 4000);
      await refreshCapabilities();
    } catch {
      setOcrMessage('Failed to update OCR setting');
    }
  };

  const handleOcrPreload = async () => {
    setOcrMessage('Loading HunyuanOCR model...');
    try {
      const response = await fetch('http://localhost:8000/api/ocr/load', { method: 'POST' });
      if (response.ok) {
        setOcrMessage('HunyuanOCR loaded successfully');
        setOcrStatus(prev => prev ? { ...prev, loaded: true, loading: false } : prev);
      } else {
        const err = await response.json();
        setOcrMessage(`Failed to load: ${err.detail || 'Unknown error'}`);
      }
    } catch {
      setOcrMessage('Failed to communicate with backend');
    }
    setTimeout(() => setOcrMessage(''), 5000);
  };

  const handleOcrUnload = async () => {
    try {
      await fetch('http://localhost:8000/api/ocr/unload', { method: 'POST' });
      setOcrMessage('OCR model unloaded, VRAM freed');
      setOcrStatus(prev => prev ? { ...prev, loaded: false } : prev);
    } catch {
      setOcrMessage('Failed to unload OCR model');
    }
    setTimeout(() => setOcrMessage(''), 4000);
  };

  const handleTutorialComplete = () => {
    markTutorialComplete(TUTORIAL_IDS.SETTINGS);
    setShowTutorial(false);
  };

  const sections = [
    { id: 'profile' as const, label: 'Profile', icon: User, description: 'Your name, school & role' },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette, description: 'Theme, fonts & tab colors' },
    { id: 'models' as const, label: 'Models', icon: Cpu, description: 'Language & diffusion models' },
    { id: 'general' as const, label: 'General', icon: Layers, description: 'Behavior & generation' },
    { id: 'features' as const, label: 'Features', icon: Sliders, description: 'Writing assistant & tools' },
    { id: 'discovery' as const, label: 'Feature Discovery', icon: Compass, description: 'Explore all app features' },
    { id: 'files' as const, label: 'File Access', icon: FolderOpen, description: 'Access PC files & folders' },
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
    ...(settings.sidebarOrder.find(i => i.id === 'visual-studio')?.enabled ? [
      { type: 'worksheet-generator', label: 'Worksheet Builder', defaultColor: '#8b5cf6' },
      { type: 'image-studio', label: 'Image Studio', defaultColor: '#ec4899' },
      { type: 'presentation-builder', label: 'Slide Deck', defaultColor: '#f97316' },
    ] : []),
    // Performance metrics
    ...(settings.sidebarOrder.find(i => i.id === 'performance-metrics')?.enabled ? [
      { type: 'performance-metrics', label: 'Performance', defaultColor: '#10b981' },
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
      // Define frontend-only categories (stored in localStorage)
      const frontendOnlyCats = ['settings', 'brain_dumps', 'tasks'];
      // Separate backend categories from frontend-only ones
      const backendCats = [...exportSelected].filter(c => !frontendOnlyCats.includes(c));
      const includeSettings = exportSelected.has('settings');
      const includeBrainDumps = exportSelected.has('brain_dumps');
      const includeTasks = exportSelected.has('tasks');

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

      // Add brain dumps from localStorage if selected
      if (includeBrainDumps) {
        try {
          const brainDumps = localStorage.getItem('brain-dump-entries');
          backendData['brain_dumps'] = brainDumps ? JSON.parse(brainDumps) : [];
        } catch (e) {
          console.error('Error exporting brain dumps:', e);
          backendData['brain_dumps'] = [];
        }
      }

      // Add tasks from localStorage if selected
      if (includeTasks) {
        try {
          const tasks = localStorage.getItem('dashboard-tasks');
          backendData['tasks'] = tasks ? JSON.parse(tasks) : [];
        } catch (e) {
          console.error('Error exporting tasks:', e);
          backendData['tasks'] = [];
        }
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

      // Define frontend-only categories (stored in localStorage)
      const frontendOnlyCats = ['settings', 'brain_dumps', 'tasks'];
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

      // Import brain dumps to localStorage
      if (catsToImport.includes('brain_dumps') && filteredData['brain_dumps']) {
        try {
          localStorage.setItem('brain-dump-entries', JSON.stringify(filteredData['brain_dumps']));
        } catch (e) {
          console.error('Error importing brain dumps:', e);
        }
      }

      // Import tasks to localStorage
      if (catsToImport.includes('tasks') && filteredData['tasks']) {
        try {
          localStorage.setItem('dashboard-tasks', JSON.stringify(filteredData['tasks']));
        } catch (e) {
          console.error('Error importing tasks:', e);
        }
      }

      // Send backend categories to import endpoint
      const backendCats = catsToImport.filter((c: string) => !frontendOnlyCats.includes(c));
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
      if (catsToImport.includes('brain_dumps')) {
        importedSummary = importedSummary ? importedSummary + ', brain dumps restored' : 'Brain dumps restored';
      }
      if (catsToImport.includes('tasks')) {
        importedSummary = importedSummary ? importedSummary + ', tasks restored' : 'Tasks restored';
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
          <p className="text-xs text-theme-muted ml-[34px]">Customize PEARL</p>
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
                              <img loading="lazy" src={userProfileImage} alt="Profile" className="w-full h-full object-cover" />
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
                        <p className="text-xs text-theme-hint mb-3">Select the grades you teach, then choose subjects for each grade below.</p>
                        <div className="flex flex-wrap gap-2">
                          {GRADE_LEVELS.map((grade) => {
                            const gradeSubjects = settings.profile.gradeSubjects[grade.value] || [];
                            const isSelected = gradeSubjects.length > 0;
                            const isActiveTab = activeGradeTab === grade.value;
                            return (
                              <button
                                key={grade.value}
                                onClick={() => {
                                  if (isActiveTab) {
                                    setActiveGradeTab(null);
                                  } else {
                                    setActiveGradeTab(grade.value);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 border relative ${
                                  isActiveTab
                                    ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 ring-2 ring-blue-300 dark:ring-blue-700'
                                    : isSelected
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                                    : 'border-theme-strong/30 text-theme-secondary dark:text-white hover:border-theme-strong/60 hover:bg-theme-subtle'
                                }`}
                              >
                                {grade.label}
                                {isSelected && (
                                  <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                                    {gradeSubjects.length}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Per-Grade Subjects */}
                {activeGradeTab && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Subjects for {GRADE_LABEL_MAP[activeGradeTab] || activeGradeTab}</CardTitle>
                          <CardDescription>Select the subjects you teach for this grade</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {(() => {
                            const currentSubjects = settings.profile.gradeSubjects[activeGradeTab] || [];
                            const otherGrades = getTeacherGrades(settings.profile.gradeSubjects).filter(g => g !== activeGradeTab);
                            const allSelected = currentSubjects.length === SUBJECTS.length;
                            return (
                              <>
                                <button
                                  onClick={() => {
                                    const updated = { ...settings.profile.gradeSubjects };
                                    updated[activeGradeTab] = allSelected ? [] : [...SUBJECTS];
                                    updateSettings({ profile: { ...settings.profile, gradeSubjects: updated } });
                                  }}
                                  className="text-xs px-2.5 py-1 rounded-md border border-theme-strong/20 text-theme-secondary hover:bg-theme-subtle"
                                >
                                  {allSelected ? 'Clear All' : 'Select All'}
                                </button>
                                {otherGrades.length > 0 && (
                                  <select
                                    value=""
                                    onChange={(e) => {
                                      if (!e.target.value) return;
                                      const sourceSubjects = settings.profile.gradeSubjects[e.target.value] || [];
                                      if (sourceSubjects.length > 0) {
                                        const updated = { ...settings.profile.gradeSubjects };
                                        updated[activeGradeTab] = [...sourceSubjects];
                                        updateSettings({ profile: { ...settings.profile, gradeSubjects: updated } });
                                      }
                                    }}
                                    className="text-xs px-2 py-1 rounded-md border border-theme-strong/20 text-theme-secondary bg-theme-surface cursor-pointer"
                                  >
                                    <option value="">Copy from...</option>
                                    {otherGrades.map(g => (
                                      <option key={g} value={g}>{GRADE_LABEL_MAP[g]}</option>
                                    ))}
                                  </select>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SUBJECTS.map((subject) => {
                          const currentSubjects = settings.profile.gradeSubjects[activeGradeTab] || [];
                          const isSelected = currentSubjects.includes(subject);
                          return (
                            <button
                              key={subject}
                              onClick={() => {
                                const updated = { ...settings.profile.gradeSubjects };
                                const current = updated[activeGradeTab] || [];
                                updated[activeGradeTab] = isSelected
                                  ? current.filter(s => s !== subject)
                                  : [...current, subject];
                                updateSettings({ profile: { ...settings.profile, gradeSubjects: updated } });
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
                      {/* Apply to all grades shortcut */}
                      {(settings.profile.gradeSubjects[activeGradeTab] || []).length > 0 && getTeacherGrades(settings.profile.gradeSubjects).length > 0 && (
                        <div className="mt-4 pt-3 border-t border-theme-strong/20">
                          <button
                            onClick={() => {
                              const sourceSubjects = settings.profile.gradeSubjects[activeGradeTab] || [];
                              const updated = { ...settings.profile.gradeSubjects };
                              // Apply to all grades that already have subjects configured
                              for (const g of getTeacherGrades(settings.profile.gradeSubjects)) {
                                updated[g] = [...sourceSubjects];
                              }
                              updateSettings({ profile: { ...settings.profile, gradeSubjects: updated } });
                            }}
                            className="text-xs px-3 py-1.5 rounded-md border border-blue-200 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                          >
                            Apply these subjects to all my grades
                          </button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Teaching Summary */}
                {getTeacherGrades(settings.profile.gradeSubjects).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>My Teaching Profile</CardTitle>
                      <CardDescription>Summary of your grade and subject assignments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {getTeacherGrades(settings.profile.gradeSubjects).sort((a, b) => {
                          const order = ['k', '1', '2', '3', '4', '5', '6'];
                          return order.indexOf(a) - order.indexOf(b);
                        }).map(grade => {
                          const subjects = settings.profile.gradeSubjects[grade] || [];
                          return (
                            <div key={grade} className="flex items-start gap-3 p-2.5 rounded-lg bg-theme-subtle/50">
                              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded-md whitespace-nowrap min-w-[90px] text-center">
                                {GRADE_LABEL_MAP[grade]}
                              </span>
                              <div className="flex flex-wrap gap-1.5 flex-1">
                                {subjects.map(s => (
                                  <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                                    {s}
                                    <button
                                      onClick={() => {
                                        const updated = { ...settings.profile.gradeSubjects };
                                        updated[grade] = (updated[grade] || []).filter(sub => sub !== s);
                                        if (updated[grade].length === 0) delete updated[grade];
                                        updateSettings({ profile: { ...settings.profile, gradeSubjects: updated } });
                                      }}
                                      className="ml-0.5 hover:text-blue-900 dark:hover:text-blue-100"
                                    >
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                    {settings.profile.filterContentByProfile && getTeacherGrades(settings.profile.gradeSubjects).length === 0 && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 px-3">
                        Select at least one grade and its subjects above for filtering to take effect.
                      </p>
                    )}
                    {settings.profile.filterContentByProfile && getTeacherGrades(settings.profile.gradeSubjects).length > 0 && (
                      <div className="mt-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30">
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                          Showing content for{' '}
                          <span className="font-medium">
                            {getTeacherGrades(settings.profile.gradeSubjects).sort((a, b) => {
                              const order = ['k', '1', '2', '3', '4', '5', '6'];
                              return order.indexOf(a) - order.indexOf(b);
                            }).map(g => GRADE_LABEL_MAP[g]).join(', ')}
                          </span>
                          {' '}with{' '}
                          <span className="font-medium">
                            {getTeacherSubjects(settings.profile.gradeSubjects).length} subject{getTeacherSubjects(settings.profile.gradeSubjects).length !== 1 ? 's' : ''}
                          </span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Redo Setup Wizard */}
                {hasCompletedSetup && (
                  <Card className="border-theme-strong/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <RotateCcw className="w-4.5 h-4.5 text-amber-500" />
                        Setup Wizard
                      </CardTitle>
                      <CardDescription>Re-run the first-time setup to change which features are shown in your sidebar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <button
                        onClick={resetSetup}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95"
                        style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}
                      >
                        Redo Setup Wizard
                      </button>
                    </CardContent>
                  </Card>
                )}
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
                  <h2 className="text-2xl font-bold text-theme-title">Models</h2>
                  <p className="text-sm text-theme-muted mt-1">Manage language and image generation models</p>
                </div>

                {/* Language Model */}
                <Card data-search-section="ai-model">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="w-4.5 h-4.5 text-theme-secondary" />
                      Language Model
                    </CardTitle>
                    <CardDescription>Select the model to use for text generation</CardDescription>
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

                {/* OCR Model (HunyuanOCR) */}
                <Card data-search-section="ocr-model">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SpellCheck className="w-4.5 h-4.5 text-theme-secondary" />
                      OCR Grading (HunyuanOCR)
                    </CardTitle>
                    <CardDescription>
                      Dedicated OCR model for reading scanned worksheets and quizzes. More accurate than vision LLM for handwriting recognition.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-theme-subtle">
                        <div>
                          <p className="text-sm font-medium text-theme-label">Use HunyuanOCR for scan grading</p>
                          <p className="text-xs text-theme-hint">
                            When enabled, scanned worksheets are read by HunyuanOCR (1B, 4-bit, ~500MB) then graded by your text LLM. When disabled, the vision LLM handles both.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={ocrEnabled}
                          onChange={(e) => handleOcrToggle(e.target.checked)}
                          className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer"
                        />
                      </label>

                      {ocrEnabled && (
                        <div className="flex gap-2">
                          {ocrStatus?.loaded ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleOcrUnload}
                              className="flex-1"
                            >
                              Unload Model (Free VRAM)
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleOcrPreload}
                              disabled={ocrStatus?.loading}
                              className="flex-1"
                            >
                              {ocrStatus?.loading ? 'Loading...' : 'Pre-load Model'}
                            </Button>
                          )}
                        </div>
                      )}

                      {ocrStatus && (
                        <div className="text-xs text-theme-hint space-y-1">
                          <p>Status: {ocrStatus.loaded ? 'Loaded in VRAM' : ocrStatus.loading ? 'Loading...' : 'Not loaded (loads on first scan)'}</p>
                          <p>Model: {ocrStatus.saved_locally ? `Saved locally (${ocrStatus.local_size_mb} MB)` : 'Not downloaded yet (will download on first use)'}</p>
                          {!ocrStatus.available && (
                            <p className="text-amber-600">Dependencies not installed. Run: pip install torch bitsandbytes accelerate</p>
                          )}
                        </div>
                      )}

                      {ocrMessage && (
                        <div className={`p-3 rounded-lg text-sm ${
                          ocrMessage.includes('Failed') || ocrMessage.includes('error')
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-green-100 text-green-800 border border-green-300'
                        }`}>
                          {ocrMessage}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Current Tier Display */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-4.5 h-4.5 text-theme-secondary" />
                      Capability Tier
                    </CardTitle>
                    <CardDescription>Auto-detected based on your active models</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 rounded-lg text-sm font-bold" style={{
                          background: tier === 3 ? 'rgba(168,85,247,0.15)' : tier === 2 ? 'rgba(59,130,246,0.15)' : 'rgba(100,116,139,0.15)',
                          color: tier === 3 ? '#c084fc' : tier === 2 ? '#60a5fa' : 'var(--text-secondary)',
                          border: `1px solid ${tier === 3 ? 'rgba(168,85,247,0.3)' : tier === 2 ? 'rgba(59,130,246,0.3)' : 'rgba(100,116,139,0.3)'}`,
                        }}>
                          Tier {tier}
                        </div>
                        <span className="text-sm text-theme-label">
                          {tier === 3 ? 'Creative — Text + Vision + Image Generation' : tier === 2 ? 'Multimodal — Text + Vision/OCR' : 'Text — Text generation only'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className={`p-2 rounded-lg text-center ${hasVision ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-400 border border-gray-200'}`}>
                          Vision {hasVision ? 'Active' : 'Off'}
                        </div>
                        <div className={`p-2 rounded-lg text-center ${hasOcr ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-400 border border-gray-200'}`}>
                          OCR {hasOcr ? 'Active' : 'Off'}
                        </div>
                        <div className={`p-2 rounded-lg text-center ${hasDiffusion ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-400 border border-gray-200'}`}>
                          Diffusion {hasDiffusion ? 'Active' : 'Off'}
                        </div>
                      </div>
                      {tierConfig && availableModels.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-theme-label mb-2">Model Tier Assignments</p>
                          <div className="space-y-1.5">
                            {availableModels.map(m => {
                              const currentTier = (tierConfig.tier2_models || []).some((t: string) => t.toLowerCase() === m.name.toLowerCase()) ? 2 : 1;
                              return (
                                <div key={m.name} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-theme-subtle">
                                  <span className="text-xs text-theme-label truncate flex-1">{m.name}</span>
                                  <select
                                    className="text-xs px-2 py-1 border border-theme-strong rounded bg-theme-surface text-theme-label"
                                    value={currentTier}
                                    onChange={(e) => handleTierAssign(m.name, parseInt(e.target.value))}
                                  >
                                    <option value={1}>Tier 1 — Text</option>
                                    <option value={2}>Tier 2 — Multimodal</option>
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                          {availableDiffusionModels.length > 0 && (
                            <div className="mt-2 space-y-1.5">
                              {availableDiffusionModels.map(m => (
                                <div key={m.name} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-theme-subtle">
                                  <span className="text-xs text-theme-label truncate flex-1">{m.name}</span>
                                  <span className="text-xs px-2 py-1 rounded bg-purple-50 text-purple-600 border border-purple-200">Tier 3 — Creative</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Dual-Model Routing (Tier 2+ only) */}
                {tier >= 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shuffle className="w-4.5 h-4.5 text-theme-secondary" />
                        Dual-Model Routing
                      </CardTitle>
                      <CardDescription>
                        Use a fast Tier 1 model for simple tasks and your primary model for advanced tasks
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-theme-subtle">
                          <div>
                            <p className="text-sm font-medium text-theme-label">Enable dual-model routing</p>
                            <p className="text-xs text-theme-hint">
                              Route quick tasks (quiz, rubric, autocomplete) to a smaller, faster model
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={dualModelEnabled}
                            onChange={(e) => handleDualModelUpdate({ enabled: e.target.checked })}
                            className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer"
                          />
                        </label>

                        {dualModelEnabled && (
                          <>
                            <div>
                              <p className="text-xs font-medium text-theme-label mb-1.5">Fast Model (Tier 1)</p>
                              <select
                                className="w-full px-3 py-2 border border-theme-strong rounded-md bg-theme-surface text-theme-label text-sm"
                                value={fastModel || ''}
                                onChange={(e) => handleDualModelUpdate({ fast_model: e.target.value || null })}
                              >
                                <option value="">Select a fast model...</option>
                                {availableModels
                                  .filter(m => m.name.toLowerCase() !== selectedModel.toLowerCase())
                                  .map(m => (
                                    <option key={m.name} value={m.name}>
                                      {m.name} ({m.size_mb.toFixed(0)} MB)
                                    </option>
                                  ))
                                }
                              </select>
                            </div>

                            {fastModel && (
                              <div>
                                <p className="text-xs font-medium text-theme-label mb-2">Task Routing</p>
                                <div className="space-y-1.5">
                                  {[
                                    { key: 'chat', label: 'Chat' },
                                    { key: 'lesson-plan', label: 'Lesson Plans' },
                                    { key: 'quiz', label: 'Quiz Generation' },
                                    { key: 'rubric', label: 'Rubric Generation' },
                                    { key: 'kindergarten', label: 'Kindergarten Plans' },
                                    { key: 'multigrade', label: 'Multigrade Plans' },
                                    { key: 'cross-curricular', label: 'Cross-Curricular Plans' },
                                    { key: 'worksheet', label: 'Worksheet Generation' },
                                    { key: 'presentation', label: 'Slide Deck' },
                                    { key: 'brain-dump', label: 'Brain Dump' },
                                    { key: 'title-generation', label: 'Title Generation' },
                                    { key: 'autocomplete', label: 'Autocomplete' },
                                  ].map(task => (
                                    <div key={task.key} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-theme-subtle">
                                      <span className="text-xs text-theme-label">{task.label}</span>
                                      <div className="flex gap-1">
                                        <button
                                          className={`text-xs px-2 py-1 rounded transition-colors ${
                                            (taskRouting[task.key] || 'primary') === 'fast'
                                              ? 'bg-blue-500 text-white'
                                              : 'bg-theme-surface text-theme-hint border border-theme-strong hover:bg-theme-subtle'
                                          }`}
                                          onClick={() => handleTaskRoutingChange(task.key, 'fast')}
                                        >
                                          Fast
                                        </button>
                                        <button
                                          className={`text-xs px-2 py-1 rounded transition-colors ${
                                            (taskRouting[task.key] || 'primary') === 'primary'
                                              ? 'bg-purple-500 text-white'
                                              : 'bg-theme-surface text-theme-hint border border-theme-strong hover:bg-theme-subtle'
                                          }`}
                                          onClick={() => handleTaskRoutingChange(task.key, 'primary')}
                                        >
                                          Primary
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
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
                      Control how generations are processed
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
                  <p className="text-sm text-theme-muted mt-1">Enable, disable, and reorder your sidebar tools</p>
                </div>

                {/* Feature Modules — High-level toggle */}
                {hasCompletedSetup && (
                  <Card data-search-section="feature-modules">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Rocket className="w-4.5 h-4.5 text-amber-500" />
                        Feature Modules
                      </CardTitle>
                      <CardDescription>Toggle feature groups on or off. This updates which tools appear in your sidebar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {FEATURE_MODULE_LIST.map((mod) => {
                          const enabled = (settings.tutorials.enabledModules || []).includes(mod.id as any);
                          return (
                            <button
                              key={mod.id}
                              onClick={() => handleToggleFeatureModule(mod.id as any)}
                              className="text-left p-3 rounded-xl transition-all"
                              style={{
                                backgroundColor: enabled ? 'rgba(245,158,11,0.06)' : 'transparent',
                                border: `1.5px solid ${enabled ? 'rgba(245,158,11,0.3)' : 'rgba(0,0,0,0.08)'}`,
                              }}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-theme-title">{mod.name}</span>
                                <div className={`w-8 h-5 rounded-full transition-colors ${enabled ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${enabled ? 'translate-x-3.5 ml-0' : 'translate-x-0.5'}`} />
                                </div>
                              </div>
                              <p className="text-xs text-theme-muted">{mod.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {mod.tools.map((tool: string) => (
                                  <span key={tool} className="text-[10px] px-1.5 py-0.5 rounded bg-theme-hover text-theme-muted">{tool}</span>
                                ))}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Sidebar Tools — Reorderable */}
                <Card data-search-section="sidebar-tools">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sliders className="w-4.5 h-4.5 text-theme-secondary" />
                      Sidebar Tools
                    </CardTitle>
                    <CardDescription>Drag to reorder, toggle to show or hide. Locked items cannot be disabled.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      // Build full list: pinned top + reorderable middle + pinned bottom
                      const pinnedTopItems: SidebarItemConfig[] = PINNED_TOP.map(id => ({ id, enabled: true }));
                      const pinnedBottomItems: SidebarItemConfig[] = PINNED_BOTTOM.map(id => {
                        const found = settings.sidebarOrder.find(i => i.id === id);
                        return found ?? { id, enabled: true };
                      });
                      const reorderableItems = settings.sidebarOrder.filter(
                        i => !PINNED_TOP.includes(i.id) && !PINNED_BOTTOM.includes(i.id)
                      );

                      const handleDragEnd = (event: DragEndEvent) => {
                        const { active, over } = event;
                        if (!over || active.id === over.id) return;

                        const oldIndex = reorderableItems.findIndex(i => i.id === active.id);
                        const newIndex = reorderableItems.findIndex(i => i.id === over.id);
                        if (oldIndex === -1 || newIndex === -1) return;

                        const newReorderable = arrayMove(reorderableItems, oldIndex, newIndex);
                        updateSettings({ sidebarOrder: newReorderable });
                      };

                      const handleToggle = (id: string, enabled: boolean) => {
                        const newOrder = settings.sidebarOrder.map(item =>
                          item.id === id ? { ...item, enabled } : item
                        );
                        updateSettings({ sidebarOrder: newOrder });
                      };

                      return (
                        <div className="space-y-2">
                          {/* Pinned top */}
                          {pinnedTopItems.map(item => (
                            <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-theme-surface border border-theme-strong/10">
                              <div className="flex-shrink-0 text-theme-muted/30">
                                <GripVertical className="w-4 h-4" />
                              </div>
                              {(() => { const M = SIDEBAR_ITEM_META[item.id]; const I = M?.icon; return I ? <I className="w-4.5 h-4.5 text-theme-secondary flex-shrink-0" /> : null; })()}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-theme-label truncate">{SIDEBAR_ITEM_META[item.id]?.name}</p>
                                <p className="text-xs text-theme-hint">Pinned to top</p>
                              </div>
                              <Lock className="w-4 h-4 text-theme-muted flex-shrink-0" />
                            </div>
                          ))}

                          {/* Reorderable middle */}
                          <DndContext sensors={dndSensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={reorderableItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                              {reorderableItems.map(item => (
                                <SortableSidebarItem key={item.id} item={item} onToggle={handleToggle} />
                              ))}
                            </SortableContext>
                          </DndContext>

                          {/* Pinned bottom */}
                          {pinnedBottomItems.map(item => {
                            const isLocked = NON_TOGGLEABLE.has(item.id);
                            const meta = SIDEBAR_ITEM_META[item.id];
                            const ItemIcon = meta?.icon;
                            return (
                              <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg bg-theme-surface border border-theme-strong/10 ${!item.enabled && !isLocked ? 'opacity-50' : ''}`}>
                                <div className="flex-shrink-0 text-theme-muted/30">
                                  <GripVertical className="w-4 h-4" />
                                </div>
                                {ItemIcon && <ItemIcon className="w-4.5 h-4.5 text-theme-secondary flex-shrink-0" />}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-theme-label truncate">{meta?.name}</p>
                                  <p className="text-xs text-theme-hint">Pinned to bottom</p>
                                </div>
                                {isLocked ? (
                                  <Lock className="w-4 h-4 text-theme-muted flex-shrink-0" />
                                ) : (
                                  <input
                                    type="checkbox"
                                    checked={item.enabled}
                                    onChange={(e) => handleToggle(item.id, e.target.checked)}
                                    className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
                                  />
                                )}
                              </div>
                            );
                          })}

                          {/* Reset button */}
                          <div className="pt-2">
                            <button
                              onClick={() => updateSettings({ sidebarOrder: [...DEFAULT_SIDEBAR_ORDER] })}
                              className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                            >
                              Reset to default order
                            </button>
                          </div>
                        </div>
                      );
                    })()}</CardContent>
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
                          <SpellCheck className="w-4 h-4 text-theme-secondary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-theme-label">Auto-Finish Sentence</p>
                            <p className="text-xs text-theme-hint">Suggests how to finish your sentence after a brief pause. Press Tab to accept.</p>
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
                            Auto-finish uses your model to suggest completions. If the model is busy generating content, suggestions may be delayed.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* System Behavior */}
                <Card data-search-section="system-behavior">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ComputerSettings className="w-4.5 h-4.5 text-theme-secondary" />
                      System Behavior
                    </CardTitle>
                    <CardDescription>Control how the app starts and runs in the background</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-theme-subtle">
                        <div className="flex items-start gap-3">
                          <ArrowDownTray className="w-4 h-4 text-theme-secondary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-theme-label">Minimize to Tray</p>
                            <p className="text-xs text-theme-hint">When you close the window, the app stays running in the system tray instead of quitting</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.minimizeToTray}
                          onChange={(e) => {
                            const enabled = e.target.checked;
                            updateSettings({ minimizeToTray: enabled });
                            window.electronAPI?.setMinimizeToTray?.(enabled);
                          }}
                          className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-theme-subtle">
                        <div className="flex items-start gap-3">
                          <Rocket className="w-4 h-4 text-theme-secondary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-theme-label">Start on Boot</p>
                            <p className="text-xs text-theme-hint">Automatically launch OECS Learning Hub when you log in to Windows</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.startOnBoot}
                          onChange={(e) => {
                            const enabled = e.target.checked;
                            updateSettings({ startOnBoot: enabled });
                            window.electronAPI?.setStartOnBoot?.(enabled);
                          }}
                          className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
                        />
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ===== FILE ACCESS SECTION ===== */}
            {activeSection === 'files' && (
              <div className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-theme-title">File Access</h2>
                  <p className="text-sm text-theme-muted mt-1">Allow the app to browse files on your computer</p>
                </div>

                {/* Master Toggle */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="w-4.5 h-4.5 text-theme-secondary" />
                      Enable File Access
                    </CardTitle>
                    <CardDescription>
                      When enabled, you can browse and reference your PC files from the Chat panel and Resource Manager
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-theme-subtle">
                      <div>
                        <p className="text-sm font-medium text-theme-label">Allow access to PC files</p>
                        <p className="text-xs text-theme-hint">Browse files from allowed folders within the app. Files are read-only — the app will never delete your files.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.fileAccessEnabled}
                        onChange={(e) => updateSettings({ fileAccessEnabled: e.target.checked })}
                        className="w-5 h-5 text-blue-600 border-theme-strong rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </label>
                  </CardContent>
                </Card>

                {/* Allowed Folders */}
                {settings.fileAccessEnabled && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FolderOpen className="w-4.5 h-4.5 text-theme-secondary" />
                        Allowed Folders
                      </CardTitle>
                      <CardDescription>
                        Choose which folders on your computer the app can access. Maximum 10 folders.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {loadingFolders ? (
                          <p className="text-sm text-theme-muted p-3">Loading folders...</p>
                        ) : (
                          <>
                            {allowedFolders.map((folder, index) => {
                              const folderName = folder.split(/[/\\]/).filter(Boolean).pop() || folder;
                              const isDefault = index < 2; // Downloads and Desktop are defaults
                              return (
                                <div
                                  key={folder}
                                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-theme-subtle"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <FolderOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-theme-label truncate">{folderName}</p>
                                      <p className="text-xs text-theme-hint truncate">{folder}</p>
                                    </div>
                                  </div>
                                  {isDefault ? (
                                    <span className="text-xs text-theme-hint flex-shrink-0 px-2 py-1 rounded bg-theme-subtle border border-theme-strong/20">Default</span>
                                  ) : (
                                    <button
                                      onClick={async () => {
                                        const updated = allowedFolders.filter((_, i) => i !== index);
                                        setAllowedFolders(updated);
                                        const api = (window as any).electronAPI;
                                        await api?.saveAllowedFolders?.(updated);
                                      }}
                                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 flex-shrink-0"
                                      title="Remove folder"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              );
                            })}

                            {allowedFolders.length < 10 && (
                              <button
                                onClick={async () => {
                                  const api = (window as any).electronAPI;
                                  if (!api?.selectFolder) return;
                                  const folder = await api.selectFolder();
                                  if (folder && !allowedFolders.includes(folder)) {
                                    const updated = [...allowedFolders, folder];
                                    setAllowedFolders(updated);
                                    await api.saveAllowedFolders?.(updated);
                                  }
                                }}
                                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-theme-strong/30 text-theme-muted hover:border-blue-500 hover:text-blue-500 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                                <span className="text-sm font-medium">Add Folder</span>
                              </button>
                            )}

                            {allowedFolders.length >= 10 && (
                              <p className="text-xs text-theme-hint text-center p-2">Maximum of 10 folders reached. Remove a folder to add another.</p>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Info Card */}
                {settings.fileAccessEnabled && (
                  <Card className="border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-950/20">
                    <CardContent className="pt-6">
                      <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-medium">How file access works:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs text-blue-700 dark:text-blue-300">
                          <li>A files button will appear in the Chat panel to browse your folders</li>
                          <li>You can attach files as reference context when chatting with PEARL</li>
                          <li>Ask PEARL to organize or find files in your allowed folders</li>
                          <li>The Resource Manager will show an "On PC" tab with your files</li>
                          <li>Files are <strong>never deleted</strong> — organizing only moves files into subfolders</li>
                          <li>Only these file types are visible: Word, PowerPoint, PDF, Excel, text, and images</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* ===== FEATURE DISCOVERY SECTION ===== */}
            {activeSection === 'discovery' && (() => {
              const categories: ('all' | FeatureCategory)[] = ['all', 'core', 'planning', 'creation', 'visual', 'writing', 'navigation', 'system'];
              const filteredFeatures = FEATURE_CATALOG.filter(f => {
                const matchesCategory = discoveryCategory === 'all' || f.category === discoveryCategory;
                const matchesSearch = !discoverySearch || f.name.toLowerCase().includes(discoverySearch.toLowerCase()) || f.description.toLowerCase().includes(discoverySearch.toLowerCase());
                return matchesCategory && matchesSearch;
              });
              const circumference = 2 * Math.PI * 40;
              const strokeOffset = circumference - (percentage / 100) * circumference;

              return (
                <div className="space-y-6">
                  {/* Header with progress ring */}
                  <div className="flex items-center gap-5">
                    <div className="relative flex-shrink-0">
                      <svg width="96" height="96" viewBox="0 0 96 96">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-theme-strong/10" />
                        <circle cx="48" cy="48" r="40" fill="none" stroke="url(#discoveryGradient)" strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={circumference} strokeDashoffset={strokeOffset}
                          transform="rotate(-90 48 48)" className="transition-all duration-700 ease-out" />
                        <defs>
                          <linearGradient id="discoveryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-theme-title">{percentage}%</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-theme-title">Feature Discovery</h2>
                      <p className="text-sm text-theme-muted mt-1">Explore everything the Learning Hub can do</p>
                      <p className="text-sm text-theme-secondary mt-2 font-medium">{discoveredCount} of {totalCount} features explored</p>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
                    <Input
                      placeholder="Search features..."
                      value={discoverySearch}
                      onChange={e => setDiscoverySearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Category filter pills */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => {
                      const isActive = discoveryCategory === cat;
                      const label = cat === 'all' ? 'All' : CATEGORY_LABELS[cat];
                      return (
                        <button
                          key={cat}
                          onClick={() => setDiscoveryCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-theme-surface border border-theme-strong/10 text-theme-label hover:bg-theme-subtle'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feature cards */}
                  <div className="space-y-2">
                    {filteredFeatures.length === 0 && (
                      <div className="text-center py-8 text-theme-muted">
                        <p className="text-sm">No features match your search</p>
                      </div>
                    )}
                    {filteredFeatures.map(feature => {
                      const isDiscovered = detectionMap.get(feature.id) || false;
                      const isExpanded = expandedFeature === feature.id;
                      const isManual = feature.detectionStrategy.type === 'manual';
                      return (
                        <div
                          key={feature.id}
                          className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                            isExpanded
                              ? 'border-blue-200 dark:border-blue-800/40 bg-blue-50/30 dark:bg-blue-950/10 shadow-sm'
                              : 'border-theme-strong/10 bg-theme-surface hover:bg-theme-subtle'
                          }`}
                        >
                          {/* Collapsed row */}
                          <button
                            onClick={() => setExpandedFeature(isExpanded ? null : feature.id)}
                            className="w-full flex items-center gap-3 p-3.5 text-left"
                          >
                            {/* Status indicator */}
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isDiscovered
                                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                : 'bg-theme-strong/5'
                            }`}>
                              {isDiscovered ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-theme-strong/20" />
                              )}
                            </div>

                            {/* Name & category */}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${isDiscovered ? 'text-theme-label' : 'text-theme-title'}`}>
                                {feature.name}
                              </p>
                              <p className="text-[11px] text-theme-hint truncate">{CATEGORY_LABELS[feature.category]}</p>
                            </div>

                            {/* Expand chevron */}
                            <ChevronDown className={`w-4 h-4 text-theme-muted flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Expanded content */}
                          {isExpanded && (
                            <div className="px-3.5 pb-4 pt-0 space-y-3 border-t border-theme-strong/5">
                              <p className="text-sm text-theme-body mt-3 leading-relaxed">{feature.description}</p>

                              <div className="space-y-1.5">
                                <p className="text-xs font-semibold text-theme-label uppercase tracking-wider">How to use</p>
                                <ol className="space-y-1 ml-0.5">
                                  {feature.howToUse.map((step, i) => (
                                    <li key={i} className="flex gap-2.5 text-sm text-theme-body">
                                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center mt-0.5">
                                        {i + 1}
                                      </span>
                                      <span className="leading-relaxed">{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>

                              <div className="flex items-center gap-2 pt-1">
                                {feature.toolType && onNavigateToTool && (
                                  <Button
                                    onClick={() => onNavigateToTool(feature.toolType!)}
                                    className="text-xs px-3 py-1.5 h-auto bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <ArrowRightCircle className="w-3.5 h-3.5 mr-1.5" />
                                    Go to {feature.name}
                                  </Button>
                                )}
                                {feature.settingsSection && (
                                  <Button
                                    onClick={() => setActiveSection(feature.settingsSection as SettingsSection)}
                                    variant="outline"
                                    className="text-xs px-3 py-1.5 h-auto"
                                  >
                                    <ArrowRightCircle className="w-3.5 h-3.5 mr-1.5" />
                                    Open in Settings
                                  </Button>
                                )}
                                {isManual && !isDiscovered && (
                                  <Button
                                    onClick={() => markFeatureDiscovered(feature.id)}
                                    variant="outline"
                                    className="text-xs px-3 py-1.5 h-auto border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                  >
                                    <Check className="w-3.5 h-3.5 mr-1.5" />
                                    Mark as Explored
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

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