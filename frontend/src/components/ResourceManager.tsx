import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceGridSkeleton } from './ui/ResourceGridSkeleton';
import { useRefetchOnActivation } from '../hooks/useRefetchOnActivation';
import { HugeiconsIcon } from '@hugeicons/react';
import Search01IconData from '@hugeicons/core-free-icons/Search01Icon';
import StarIconData from '@hugeicons/core-free-icons/StarIcon';
import Delete02IconData from '@hugeicons/core-free-icons/Delete02Icon';
import PencilEdit01IconData from '@hugeicons/core-free-icons/PencilEdit01Icon';
import Download01IconData from '@hugeicons/core-free-icons/Download01Icon';
import Calendar01IconData from '@hugeicons/core-free-icons/Calendar01Icon';
import ViewIconData from '@hugeicons/core-free-icons/ViewIcon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import CheckListIconData from '@hugeicons/core-free-icons/CheckListIcon';
import BookBookmark01IconData from '@hugeicons/core-free-icons/BookBookmark01Icon';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import GraduationScrollIconData from '@hugeicons/core-free-icons/GraduationScrollIcon';
import UserGroupIconData from '@hugeicons/core-free-icons/UserGroupIcon';
import Link01IconData from '@hugeicons/core-free-icons/Link01Icon';
import ReloadIconData from '@hugeicons/core-free-icons/ReloadIcon';
import SortingDownIconData from '@hugeicons/core-free-icons/SortingDownIcon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Image01IconData from '@hugeicons/core-free-icons/Image01Icon';
import FileSpreadsheetIconData from '@hugeicons/core-free-icons/FileSpreadsheetIcon';
import Presentation01IconData from '@hugeicons/core-free-icons/Presentation01Icon';
import FolderOpenIconData from '@hugeicons/core-free-icons/FolderOpenIcon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ComputerIconData from '@hugeicons/core-free-icons/ComputerIcon';
import Layers01IconData from '@hugeicons/core-free-icons/Layers01Icon';
import LinkSquare01IconData from '@hugeicons/core-free-icons/LinkSquare01Icon';
import axios from 'axios';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Search: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Search01IconData} {...p} />;
const Star: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={StarIconData} {...p} />;
const Trash2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Delete02IconData} {...p} />;
const Edit: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PencilEdit01IconData} {...p} />;
const Download: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Download01IconData} {...p} />;
const Calendar: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Calendar01IconData} {...p} />;
const Eye: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ViewIconData} {...p} />;
const FileText: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={File01IconData} {...p} />;
const ListChecks: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckListIconData} {...p} />;
const BookMarked: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookBookmark01IconData} {...p} />;
const BookOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookOpen01IconData} {...p} />;
const GraduationCap: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={GraduationScrollIconData} {...p} />;
const Users: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UserGroupIconData} {...p} />;
const Link2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Link01IconData} {...p} />;
const RefreshCw: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ReloadIconData} {...p} />;
const ArrowUpDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SortingDownIconData} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const Image: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Image01IconData} {...p} />;
const FileSpreadsheet: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FileSpreadsheetIconData} {...p} />;
const Presentation: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Presentation01IconData} {...p} />;
const FolderOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FolderOpenIconData} {...p} />;
const ChevronRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowRight01IconData} {...p} />;
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowDown01IconData} {...p} />;
const ComputerIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ComputerIconData} {...p} />;
const LayersIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Layers01IconData} {...p} />;
const ExternalLinkIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={LinkSquare01IconData} {...p} />;
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import CategoryRadialChart from './charts/CategoryRadialChart';
import type { DistributionData } from '../types/analytics';
import { RESOURCE_TO_TOOL_TYPE } from '../lib/analyticsHelpers';

import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import { useSettings } from '../contexts/SettingsContext';
import { useTutorials } from '../contexts/TutorialContext';

interface ResourceManagerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  onEditResource?: (type: string, resource: any) => void;
  onViewResource?: (type: string, resource: any) => void;
  isActive?: boolean;
  distributionData?: DistributionData[];
  tabColors?: { [key: string]: string };
}

interface Resource {
  id: string;
  title: string;
  timestamp: string;
  type: string;
  formData?: any;
  generatedPlan?: string;
  generatedQuiz?: string;
  generatedRubric?: string;
  favorite?: boolean;
  imageUrl?: string;
}

const resourceTypes = [
  { key: 'all', labelKey: 'resources.allResources', icon: FileText },
  { key: 'lesson', labelKey: 'resources.lessonPlans', icon: BookMarked },
  { key: 'quiz', labelKey: 'resources.quizzes', icon: ListChecks },
  { key: 'worksheet', labelKey: 'resources.worksheets', icon: FileSpreadsheet },
  { key: 'rubric', labelKey: 'resources.rubrics', icon: FileText },
  { key: 'kindergarten', labelKey: 'resources.kindergarten', icon: GraduationCap },
  { key: 'multigrade', labelKey: 'resources.multigrade', icon: Users },
  { key: 'cross-curricular', labelKey: 'resources.crossCurricular', icon: Link2 },
  { key: 'images', labelKey: 'resources.images', icon: Image },
  { key: 'presentation', labelKey: 'resources.presentations', icon: Presentation },
  { key: 'storybook', labelKey: 'resources.storybooks', icon: BookOpen }
];

const ResourceManager: React.FC<ResourceManagerProps> = ({
  tabId,
  savedData,
  onDataChange,
  onViewResource,
  onEditResource,
  isActive = true,
  distributionData = [],
  tabColors = {},
}) => {
  const { t } = useTranslation();
  const { startTutorial } = useTutorials();
  const { settings } = useSettings();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);


  // Restore persisted state from savedData
  const [searchQuery, setSearchQuery] = useState(savedData?.searchQuery || '');
  const [filterType, setFilterType] = useState<string>(savedData?.filterType || 'all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'type'>(savedData?.sortBy || 'date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(savedData?.sortOrder || 'desc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageResource, setSelectedImageResource] = useState<Resource | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());

  // Tab state: "In App" vs "On PC"
  type ResourceTab = 'in-app' | 'on-pc';
  const [activeTab, setActiveTab] = useState<ResourceTab>(savedData?.activeTab || 'in-app');

  // "On PC" state
  const [pcFolders, setPcFolders] = useState<string[]>([]);
  const [pcSelectedFolder, setPcSelectedFolder] = useState<string | null>(null);
  const [pcFolderContents, setPcFolderContents] = useState<FileEntry[]>([]);
  const [pcLoadingFolder, setPcLoadingFolder] = useState(false);
  const [pcSearchQuery, setPcSearchQuery] = useState('');
  const [pcSearchResults, setPcSearchResults] = useState<FileEntry[] | null>(null);
  const pcSearchTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pcExpandedSubfolders, setPcExpandedSubfolders] = useState<Set<string>>(new Set());
  const [pcSubfolderContents, setPcSubfolderContents] = useState<Record<string, FileEntry[]>>({});

  // Load allowed folders when "On PC" tab is selected
  useEffect(() => {
    if (activeTab === 'on-pc' && pcFolders.length === 0 && settings.fileAccessEnabled) {
      const api = (window as any).electronAPI;
      api?.getAllowedFolders?.().then((folders: string[]) => {
        setPcFolders(folders);
        if (folders.length > 0 && !pcSelectedFolder) {
          selectPcFolder(folders[0]);
        }
      });
    }
  }, [activeTab]);

  const selectPcFolder = async (folderPath: string) => {
    setPcSelectedFolder(folderPath);
    setPcLoadingFolder(true);
    setPcSearchResults(null);
    setPcSearchQuery('');
    const api = (window as any).electronAPI;
    const result = await api?.browseFolder?.(folderPath);
    if (result?.items) {
      setPcFolderContents(result.items);
    }
    setPcLoadingFolder(false);
  };

  const togglePcSubfolder = async (folderPath: string) => {
    const next = new Set(pcExpandedSubfolders);
    if (next.has(folderPath)) {
      next.delete(folderPath);
    } else {
      next.add(folderPath);
      if (!pcSubfolderContents[folderPath]) {
        const api = (window as any).electronAPI;
        const result = await api?.browseFolder?.(folderPath);
        if (result?.items) {
          setPcSubfolderContents(prev => ({ ...prev, [folderPath]: result.items }));
        }
      }
    }
    setPcExpandedSubfolders(next);
  };

  const handlePcSearch = (query: string) => {
    setPcSearchQuery(query);
    if (pcSearchTimeout.current) clearTimeout(pcSearchTimeout.current);
    if (!query.trim()) {
      setPcSearchResults(null);
      return;
    }
    pcSearchTimeout.current = setTimeout(async () => {
      const api = (window as any).electronAPI;
      const result = await api?.searchFiles?.(query);
      if (result?.items) setPcSearchResults(result.items);
    }, 300);
  };

  const openFileExternally = async (filePath: string) => {
    const api = (window as any).electronAPI;
    await api?.openFileExternal?.(filePath);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileTypeColor = (ext: string): string => {
    const colors: Record<string, string> = {
      '.docx': 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      '.doc': 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      '.pptx': 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
      '.ppt': 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
      '.xlsx': 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      '.xls': 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      '.csv': 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      '.pdf': 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    };
    return colors[ext] || 'bg-theme-surface border-theme';
  };

  const getFileIconColor = (ext: string): string => {
    const colors: Record<string, string> = {
      '.docx': 'text-blue-600', '.doc': 'text-blue-600',
      '.pptx': 'text-orange-500', '.ppt': 'text-orange-500',
      '.xlsx': 'text-green-600', '.xls': 'text-green-600', '.csv': 'text-green-600',
      '.pdf': 'text-red-500',
      '.txt': 'text-gray-500', '.md': 'text-gray-500',
      '.png': 'text-purple-500', '.jpg': 'text-purple-500', '.jpeg': 'text-purple-500',
    };
    return colors[ext] || 'text-gray-400';
  };

  const getFileTypeLabel = (ext: string): string => {
    const labels: Record<string, string> = {
      '.docx': 'Word', '.doc': 'Word', '.pptx': 'PowerPoint', '.ppt': 'PowerPoint',
      '.xlsx': 'Excel', '.xls': 'Excel', '.csv': 'CSV',
      '.pdf': 'PDF', '.txt': 'Text', '.md': 'Markdown',
      '.png': 'Image', '.jpg': 'Image', '.jpeg': 'Image',
    };
    return labels[ext] || ext.replace('.', '').toUpperCase();
  };

  // Persist filter/sort state to tab data
  useEffect(() => {
    const timer = setTimeout(() => {
      onDataChange({ searchQuery, filterType, sortBy, sortOrder, activeTab });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterType, sortBy, sortOrder, activeTab]);

  const loadAllResources = async () => {
    setLoading(true);
    try {
      const [lessonPlans, quizzes, worksheets, rubrics, kindergarten, multigrade, crossCurricular, images, presentations] = await Promise.all([
        axios.get('http://localhost:8000/api/lesson-plan-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/quiz-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/worksheet-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/rubric-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/kindergarten-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/multigrade-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/cross-curricular-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/images-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/presentation-history').catch(() => ({ data: [] }))
      ]);

      // Load storybooks from localStorage
      let storybookResources: any[] = [];
      try {
        const raw = localStorage.getItem('storybook_history');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            storybookResources = parsed.map((s: any) => ({
              id: s.id,
              title: s.formData?.title || s.parsedBook?.title || 'Untitled Storybook',
              timestamp: s.savedAt,
              type: 'storybook',
              formData: s.formData,
            }));
          }
        }
      } catch (e) {
        console.error('Failed to load storybook history:', e);
      }

      const allResources: Resource[] = [
        ...lessonPlans.data.map((r: any) => ({ ...r, type: 'lesson' })),
        ...quizzes.data.map((r: any) => ({ ...r, type: 'quiz' })),
        ...worksheets.data.map((r: any) => ({ ...r, type: 'worksheet' })),
        ...rubrics.data.map((r: any) => ({ ...r, type: 'rubric' })),
        ...kindergarten.data.map((r: any) => ({ ...r, type: 'kindergarten' })),
        ...multigrade.data.map((r: any) => ({ ...r, type: 'multigrade' })),
        ...crossCurricular.data.map((r: any) => ({ ...r, type: 'cross-curricular' })),
        ...images.data.map((r: any) => ({ ...r, type: 'images' })),
        ...presentations.data.map((r: any) => ({ ...r, type: 'presentation' })),
        ...storybookResources
      ];

      setResources(allResources);
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllResources();
  }, []);

  useRefetchOnActivation(isActive, useCallback(() => { loadAllResources(); }, []));

  // ESC key handler for image modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showImageModal) {
        closeImageModal();
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showImageModal]);

  const closeImageModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowImageModal(false);
      setSelectedImageResource(null);
      setIsClosing(false);
    }, 300);
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedResources(new Set());
  };

  const toggleResourceSelection = (resourceId: string) => {
    const newSelected = new Set(selectedResources);
    if (newSelected.has(resourceId)) {
      newSelected.delete(resourceId);
    } else {
      newSelected.add(resourceId);
    }
    setSelectedResources(newSelected);
  };

  const selectAllVisible = () => {
    const visibleResourceIds = filteredAndSortedResources.map(r => r.id);
    setSelectedResources(new Set(visibleResourceIds));
  };

  const clearSelection = () => {
    setSelectedResources(new Set());
  };

  const bulkDelete = async () => {
    if (selectedResources.size === 0) return;

    try {
      const deletePromises = Array.from(selectedResources).map(async (resourceId) => {
        const resource = resources.find(r => r.id === resourceId);
        if (resource) {
          const endpoint = getEndpointForType(resource.type);
          await axios.delete(`${endpoint}/${resourceId}`);
        }
      });

      await Promise.all(deletePromises);
      await loadAllResources();
      setSelectedResources(new Set());
      setSelectionMode(false);
    } catch (error) {
      console.error('Failed to bulk delete resources:', error);
      alert('Failed to delete some resources');
    }
  };

  const toggleFavorite = async (resource: Resource) => {
    try {
      const updatedResource = { ...resource, favorite: !resource.favorite };
      const endpoint = getEndpointForType(resource.type);
      await axios.post(endpoint, updatedResource);
      await loadAllResources();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const deleteResource = async (resource: Resource) => {
    try {
      const endpoint = getEndpointForType(resource.type);
      await axios.delete(`${endpoint}/${resource.id}`);
      await loadAllResources();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete resource:', error);
    }
  };

  const getEndpointForType = (type: string): string => {
    const endpoints: { [key: string]: string } = {
      'lesson': 'http://localhost:8000/api/lesson-plan-history',
      'quiz': 'http://localhost:8000/api/quiz-history',
      'worksheet': 'http://localhost:8000/api/worksheet-history',
      'rubric': 'http://localhost:8000/api/rubric-history',
      'kindergarten': 'http://localhost:8000/api/kindergarten-history',
      'multigrade': 'http://localhost:8000/api/multigrade-history',
      'cross-curricular': 'http://localhost:8000/api/cross-curricular-history',
      'images': 'http://localhost:8000/api/images-history',
      'presentation': 'http://localhost:8000/api/presentation-history'
    };
    return endpoints[type];
  };

  const exportResource = (resource: Resource) => {
    const content = resource.generatedPlan || resource.generatedQuiz || resource.generatedRubric || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.type}-${resource.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      'lesson': BookMarked,
      'quiz': ListChecks,
      'worksheet': FileSpreadsheet,
      'rubric': FileText,
      'kindergarten': GraduationCap,
      'multigrade': Users,
      'cross-curricular': Link2,
      'images': Image,
      'presentation': Presentation,
      'storybook': BookOpen
    };
    const Icon = icons[type] || FileText;
    return Icon;
  };

  const getTabColor = (type: string): string => {
    const toolType = RESOURCE_TO_TOOL_TYPE[type];
    return toolType ? (tabColors[toolType] || '#6b7280') : '#6b7280';
  };

  const getTypeColor = (type: string) => {
    return 'border';
  };

  const getTypeStyle = (type: string): React.CSSProperties => {
    const hex = getTabColor(type);
    return {
      backgroundColor: `${hex}18`,
      color: hex,
      borderColor: `${hex}40`,
    };
  };

  const getTypeDotColor = (type: string) => {
    return '';
  };

  const getTypeDotStyle = (type: string): React.CSSProperties => {
    return { backgroundColor: getTabColor(type) };
  };

  const filteredAndSortedResources = useMemo(() => resources
    .filter(r => filterType === 'all' || r.type === filterType)
    .filter(r =>
      searchQuery === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'date') {
        comparison = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'type') {
        comparison = a.type.localeCompare(b.type);
      }

      return sortOrder === 'asc' ? -comparison : comparison;
    }), [resources, filterType, searchQuery, sortBy, sortOrder]);

  const favoriteResources = useMemo(() => filteredAndSortedResources.filter(r => r.favorite), [filteredAndSortedResources]);

  // Count resources per type
  const getCountForType = (key: string) => {
    if (key === 'all') return resources.length;
    return resources.filter(r => r.type === key).length;
  };

  if (loading) {
    return <ResourceGridSkeleton accentColor={tabColors['resource-manager'] ?? '#84cc16'} />;
  }

  return (
    <div className="h-full flex flex-col tab-content-bg">
      {/* ── Top Tab Bar: In App / On PC ── */}
      {settings.fileAccessEnabled && (
        <div className="flex border-b border-theme bg-theme-surface flex-shrink-0">
          <button
            onClick={() => setActiveTab('in-app')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'in-app'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-theme-muted hover:text-theme-heading hover:bg-theme-hover'
            }`}
          >
            <LayersIcon className="w-4 h-4" />
            In App
          </button>
          <button
            onClick={() => setActiveTab('on-pc')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'on-pc'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-theme-muted hover:text-theme-heading hover:bg-theme-hover'
            }`}
          >
            <ComputerIcon className="w-4 h-4" />
            On PC
          </button>
        </div>
      )}

      {/* ── "On PC" Tab Content ── */}
      {activeTab === 'on-pc' && settings.fileAccessEnabled ? (
        <div className="flex-1 flex min-h-0">
          {/* Folder sidebar */}
          <div className="w-56 flex-shrink-0 bg-theme-surface border-r border-theme flex flex-col h-full">
            <div className="p-4 border-b border-theme">
              <h2 className="text-sm font-semibold text-theme-heading uppercase tracking-wider">Folders</h2>
            </div>
            <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {pcFolders.map(folder => {
                const folderName = folder.split(/[/\\]/).filter(Boolean).pop() || folder;
                const isActive = pcSelectedFolder === folder;
                return (
                  <button
                    key={folder}
                    onClick={() => selectPcFolder(folder)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-theme-label hover:bg-theme-hover'
                    }`}
                  >
                    <FolderOpen className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left truncate">{folderName}</span>
                  </button>
                );
              })}
              {pcFolders.length === 0 && (
                <p className="text-xs text-theme-hint p-3 text-center">No folders configured. Go to Settings &gt; File Access.</p>
              )}
            </nav>
          </div>

          {/* File listing area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Search bar */}
            <div className="bg-theme-surface border-b border-theme p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="text-xl font-bold text-theme-title">
                    {pcSelectedFolder ? pcSelectedFolder.split(/[/\\]/).filter(Boolean).pop() : 'Select a folder'}
                  </h1>
                  <p className="text-xs text-theme-hint mt-0.5">
                    {pcSearchResults !== null
                      ? `${pcSearchResults.length} search result${pcSearchResults.length !== 1 ? 's' : ''}`
                      : `${pcFolderContents.length} item${pcFolderContents.length !== 1 ? 's' : ''}`
                    }
                  </p>
                </div>
                <button
                  onClick={() => pcSelectedFolder && selectPcFolder(pcSelectedFolder)}
                  className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Refresh
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-hint" />
                <input
                  type="text"
                  value={pcSearchQuery}
                  onChange={(e) => handlePcSearch(e.target.value)}
                  placeholder="Search across all folders..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-theme-strong rounded-lg bg-theme-surface text-theme-title placeholder:text-theme-hint focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {pcSearchQuery && (
                  <button
                    onClick={() => { setPcSearchQuery(''); setPcSearchResults(null); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-theme-hint hover:text-theme-label" />
                  </button>
                )}
              </div>
            </div>

            {/* File grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {pcLoadingFolder ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {(pcSearchResults !== null ? pcSearchResults : pcFolderContents).map(item => {
                    if (item.isDirectory) {
                      const isExpanded = pcExpandedSubfolders.has(item.path);
                      const subItems = pcSubfolderContents[item.path] || [];
                      return (
                        <div key={item.path} className="col-span-full">
                          <button
                            onClick={() => togglePcSubfolder(item.path)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-theme-subtle transition w-full text-left"
                          >
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-theme-muted" /> : <ChevronRight className="w-3.5 h-3.5 text-theme-muted" />}
                            <FolderOpen className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-theme-heading">{item.name}</span>
                          </button>
                          {isExpanded && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 ml-6 mt-2">
                              {subItems.filter(si => !si.isDirectory).map(subFile => (
                                <div
                                  key={subFile.path}
                                  className={`rounded-xl border p-4 hover:shadow-lg transition group cursor-pointer ${getFileTypeColor(subFile.extension)}`}
                                  onDoubleClick={() => openFileExternally(subFile.path)}
                                >
                                  <div className="flex items-start gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-white/60 dark:bg-black/20 border border-white/40">
                                      <FileText className={`w-4 h-4 ${getFileIconColor(subFile.extension)}`} />
                                    </div>
                                  </div>
                                  <h3 className="font-semibold text-sm text-theme-title mb-1.5 line-clamp-2">{subFile.name}</h3>
                                  <div className="flex items-center text-xs text-theme-hint mb-3">
                                    <span>{getFileTypeLabel(subFile.extension)}</span>
                                    <span className="mx-1.5">-</span>
                                    <span>{formatFileSize(subFile.size)}</span>
                                    <span className="mx-1.5">-</span>
                                    <span>{new Date(subFile.modifiedTime).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); openFileExternally(subFile.path); }}
                                      className="flex-1 flex items-center justify-center px-2 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition"
                                    >
                                      <ExternalLinkIcon className="w-3.5 h-3.5 mr-1" />
                                      Open
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {subItems.filter(si => !si.isDirectory).length === 0 && (
                                <p className="text-xs text-theme-hint p-2 col-span-full">No supported files in this folder</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }
                    // File card
                    return (
                      <div
                        key={item.path}
                        className={`rounded-xl border p-4 hover:shadow-lg transition group cursor-pointer ${getFileTypeColor(item.extension)}`}
                        onDoubleClick={() => openFileExternally(item.path)}
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-white/60 dark:bg-black/20 border border-white/40">
                            <FileText className={`w-4 h-4 ${getFileIconColor(item.extension)}`} />
                          </div>
                        </div>
                        <h3 className="font-semibold text-sm text-theme-title mb-1.5 line-clamp-2">{item.name}</h3>
                        <div className="flex items-center text-xs text-theme-hint mb-3">
                          <span>{getFileTypeLabel(item.extension)}</span>
                          <span className="mx-1.5">-</span>
                          <span>{formatFileSize(item.size)}</span>
                          <span className="mx-1.5">-</span>
                          <span>{new Date(item.modifiedTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); openFileExternally(item.path); }}
                            className="flex-1 flex items-center justify-center px-2 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition"
                          >
                            <ExternalLinkIcon className="w-3.5 h-3.5 mr-1" />
                            Open
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {!pcLoadingFolder && pcFolderContents.length === 0 && pcSearchResults === null && (
                    <div className="col-span-full text-center py-12">
                      <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-theme-muted">No supported files in this folder</p>
                    </div>
                  )}
                  {pcSearchResults !== null && pcSearchResults.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-theme-muted">No files found matching "{pcSearchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
      /* ── "In App" Tab Content (original) ── */
      <div className="flex-1 flex min-h-0">

      {/* ── Left Sidebar: Category Filters ── */}
      <div className="w-60 flex-shrink-0 bg-theme-surface border-r border-theme flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-theme">
          <h2 className="text-sm font-semibold text-theme-heading uppercase tracking-wider">Categories</h2>
        </div>

        {/* Category List */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5" data-tutorial="resource-filters">
          {resourceTypes.map(({ key, labelKey, icon: TypeIcon }) => {
            const count = getCountForType(key);
            const isActive = filterType === key;
            const toolType = RESOURCE_TO_TOOL_TYPE[key];
            const iconColor = toolType ? tabColors[toolType] : undefined;

            return (
              <button
                key={key}
                onClick={() => setFilterType(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-theme-label hover:bg-theme-hover'
                }`}
                style={isActive && iconColor ? { backgroundColor: iconColor } : isActive ? { backgroundColor: '#2563eb' } : undefined}
              >
                <TypeIcon
                  className="w-4 h-4 flex-shrink-0"
                  style={!isActive && iconColor ? { color: iconColor } : undefined}
                />
                <span className="flex-1 text-left truncate">{t(labelKey)}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-theme-tertiary text-theme-muted'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Category Distribution Chart */}
        {resources.length > 0 && (
          <div className="border-t border-theme px-3 py-3">
            <p className="text-xs font-semibold text-theme-heading uppercase tracking-wider mb-2">Distribution</p>
            <CategoryRadialChart
              data={resourceTypes
                .filter(rt => rt.key !== 'all')
                .map(rt => ({
                  type: rt.key,
                  label: t(rt.labelKey),
                  count: getCountForType(rt.key),
                  color: getTabColor(rt.key),
                }))
                .filter(d => d.count > 0)
              }
              activeType={filterType}
              onTypeClick={setFilterType}
            />
          </div>
        )}

        {/* Sidebar Footer: Stats */}
        <div className="p-4 border-t border-theme">
          <div className="text-xs text-theme-hint space-y-1">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-medium text-theme-label">{resources.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Favorites</span>
              <span className="font-medium text-theme-label">{resources.filter(r => r.favorite).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <div className="bg-theme-surface border-b border-theme p-4" data-tutorial="resource-welcome">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-theme-title">
                {t(resourceTypes.find(rt => rt.key === filterType)?.labelKey ?? 'resources.allResources')}
              </h1>
              <p className="text-xs text-theme-hint mt-0.5">
                {filteredAndSortedResources.length} resource{filteredAndSortedResources.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSelectionMode}
                className={`flex items-center px-3 py-1.5 text-sm rounded-lg transition ${
                  selectionMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-theme-tertiary text-theme-label hover:bg-theme-hover'
                }`}
              >
                {selectionMode ? t('common.cancel') : t('resources.select')}
              </button>
              <button
                onClick={loadAllResources}
                className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Refresh
              </button>
            </div>
          </div>

          {/* Search + Sort Row */}
          <div className="flex gap-3">
            <div className="flex-1 relative" data-tutorial="resource-search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-hint" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('resources.searchResources')}
                className="w-full pl-9 pr-4 py-2 text-sm border border-theme-strong rounded-lg bg-theme-surface text-theme-title placeholder:text-theme-hint focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-hint hover:text-theme-label"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-theme-strong rounded-lg hover:bg-theme-hover transition"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <ArrowUpDown className="w-4 h-4 text-theme-muted" />
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'type')}
                className="px-3 py-2 text-sm border border-theme-strong rounded-lg bg-theme-surface text-theme-label focus:ring-2 focus:ring-blue-500"
                data-tutorial="resource-sort"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="type">Sort by Type</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selection Controls */}
        {selectionMode && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  {selectedResources.size} of {filteredAndSortedResources.length} selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAllVisible}
                    className="text-xs px-2.5 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-700 transition"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearSelection}
                    className="text-xs px-2.5 py-1 bg-theme-tertiary text-theme-label rounded hover:bg-theme-hover transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <button
                onClick={bulkDelete}
                disabled={selectedResources.size === 0}
                className="flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Delete ({selectedResources.size})
              </button>
            </div>
          </div>
        )}

        {/* Resources Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Favorites Section */}
          {favoriteResources.length > 0 && (
            <div className="mb-6" data-tutorial="resource-favorites">
              <h2 className="text-sm font-semibold text-theme-heading mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
                Favorites ({favoriteResources.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {favoriteResources.map(resource => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onToggleFavorite={() => toggleFavorite(resource)}
                    onDelete={() => setShowDeleteConfirm(resource.id)}
                    onExport={() => exportResource(resource)}
                    onView={() => {
                      if (resource.type === 'images') {
                        setSelectedImageResource(resource);
                        setShowImageModal(true);
                      } else {
                        onViewResource?.(resource.type, resource);
                      }
                    }}
                    onEdit={() => onEditResource?.(resource.type, resource)}
                    getTypeIcon={getTypeIcon}
                    getTypeColor={getTypeColor}
                    getTypeStyle={getTypeStyle}
                    getTypeDotColor={getTypeDotColor}
                    getTypeDotStyle={getTypeDotStyle}
                    selectionMode={selectionMode}
                    isSelected={selectedResources.has(resource.id)}
                    onToggleSelection={() => toggleResourceSelection(resource.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Resources */}
          <div>
            {favoriteResources.length > 0 && filteredAndSortedResources.length > favoriteResources.length && (
              <h2 className="text-sm font-semibold text-theme-heading mb-3">
                All ({filteredAndSortedResources.length})
              </h2>
            )}

            {filteredAndSortedResources.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-14 h-14 text-theme-hint mx-auto mb-3 opacity-40" />
                <p className="text-theme-muted font-medium">No resources found</p>
                <p className="text-sm text-theme-hint mt-1">
                  {searchQuery ? t('resources.noResultsHint') : t('resources.emptyState')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredAndSortedResources.map(resource => (
                  <ResourceCard
                    key={`${resource.type}-${resource.id}`}
                    resource={resource}
                    onToggleFavorite={() => toggleFavorite(resource)}
                    onDelete={() => setShowDeleteConfirm(resource.id)}
                    onExport={() => exportResource(resource)}
                    onView={() => {
                      if (resource.type === 'images') {
                        setSelectedImageResource(resource);
                        setShowImageModal(true);
                      } else {
                        onViewResource?.(resource.type, resource);
                      }
                    }}
                    onEdit={() => onEditResource?.(resource.type, resource)}
                    getTypeIcon={getTypeIcon}
                    getTypeColor={getTypeColor}
                    getTypeStyle={getTypeStyle}
                    getTypeDotColor={getTypeDotColor}
                    getTypeDotStyle={getTypeDotStyle}
                    selectionMode={selectionMode}
                    isSelected={selectedResources.has(resource.id)}
                    onToggleSelection={() => toggleResourceSelection(resource.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(null)}>
          <div className="rounded-xl p-6 max-w-md w-full mx-4 widget-glass" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-title">Confirm Delete</h3>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="p-1 rounded hover:bg-theme-hover transition"
              >
                <X className="w-5 h-5 text-theme-hint" />
              </button>
            </div>
            <p className="text-theme-muted mb-6">
              Are you sure you want to delete this resource? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-theme-strong rounded-lg hover:bg-theme-hover transition text-theme-label"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => {
                  const resource = resources.find(r => r.id === showDeleteConfirm);
                  if (resource) deleteResource(resource);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image View Modal */}
      {showImageModal && selectedImageResource && (
        <div
          className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-300 ${
            isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          onClick={closeImageModal}
        >
          <div
            className={`rounded-xl p-4 max-w-4xl w-full mx-4 widget-glass transition-all duration-300 ${
              isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button
                onClick={closeImageModal}
                className="p-1 rounded hover:bg-theme-hover transition"
              >
                <X className="w-5 h-5 text-theme-hint" />
              </button>
            </div>
            <div className="flex justify-center">
              <img loading="lazy" src={selectedImageResource.imageUrl} alt="" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Button */}
      <TutorialButton
        tutorialId={TUTORIAL_IDS.RESOURCE_MANAGER}
        onStartTutorial={() => startTutorial(TUTORIAL_IDS.RESOURCE_MANAGER)}
        position="bottom-right"
      />
    </div>
  );
};

interface ResourceCardProps {
  resource: Resource;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onExport: () => void;
  onView: () => void;
  onEdit: () => void;
  getTypeIcon: (type: string) => any;
  getTypeColor: (type: string) => string;
  getTypeStyle: (type: string) => React.CSSProperties;
  getTypeDotColor: (type: string) => string;
  getTypeDotStyle: (type: string) => React.CSSProperties;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onToggleFavorite,
  onDelete,
  onExport,
  onView,
  onEdit,
  getTypeIcon,
  getTypeColor,
  getTypeStyle,
  getTypeDotColor,
  getTypeDotStyle,
  selectionMode = false,
  isSelected = false,
  onToggleSelection
}) => {
  const { t } = useTranslation();
  const Icon = getTypeIcon(resource.type);

  return (
    <div
      className={`rounded-xl border p-4 hover:shadow-lg transition group ${
        selectionMode ? 'cursor-pointer' : ''
      } ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
          : 'bg-theme-surface border-theme'
      }`}
      data-tutorial="resource-card"
      onClick={selectionMode ? onToggleSelection : undefined}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {resource.type === 'images' && resource.imageUrl ? (
            <div className="w-10 h-10 rounded-lg border border-theme overflow-hidden">
              <img loading="lazy"
                src={resource.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`} style={getTypeStyle(resource.type)}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        {!selectionMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="p-1 rounded hover:bg-theme-hover transition"
          >
            <Star
              className={`w-4 h-4 ${
                resource.favorite
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-theme-hint'
              }`}
            />
          </button>
        )}
      </div>

      <h3 className="font-semibold text-sm text-theme-title mb-1.5 line-clamp-2">
        {resource.title}
      </h3>

      <div className="flex items-center text-xs text-theme-hint mb-3">
        <Calendar className="w-3 h-3 mr-1" />
        {new Date(resource.timestamp).toLocaleDateString()}
        <span className="ml-2 w-2 h-2 rounded-full" style={getTypeDotStyle(resource.type)} />
        <span className="ml-1 capitalize">{resource.type === 'cross-curricular' ? 'Cross-Curr.' : resource.type}</span>
      </div>

      {!selectionMode && (
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" data-tutorial="resource-actions">
          {(resource.generatedQuiz || resource.generatedPlan || resource.generatedRubric || resource.type === 'images') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="flex-1 flex items-center justify-center px-2 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition"
              title="View"
            >
              <Eye className="w-3.5 h-3.5 mr-1" />
              View
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex-1 flex items-center justify-center px-2 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition"
            title="Edit"
          >
            <Edit className="w-3.5 h-3.5 mr-1" />
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onExport();
            }}
            className="p-1.5 border border-theme-strong rounded-lg hover:bg-theme-hover transition"
            title="Export"
          >
            <Download className="w-3.5 h-3.5 text-theme-muted" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            title={t('common.delete')}
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceManager;
