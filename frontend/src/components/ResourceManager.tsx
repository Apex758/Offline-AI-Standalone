import React, { useState, useEffect, useCallback } from 'react';
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
import GraduationScrollIconData from '@hugeicons/core-free-icons/GraduationScrollIcon';
import UserGroupIconData from '@hugeicons/core-free-icons/UserGroupIcon';
import Link01IconData from '@hugeicons/core-free-icons/Link01Icon';
import ReloadIconData from '@hugeicons/core-free-icons/ReloadIcon';
import SortingDownIconData from '@hugeicons/core-free-icons/SortingDownIcon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Image01IconData from '@hugeicons/core-free-icons/Image01Icon';
import FileSpreadsheetIconData from '@hugeicons/core-free-icons/FileSpreadsheetIcon';
import Presentation01IconData from '@hugeicons/core-free-icons/Presentation01Icon';
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
const GraduationCap: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={GraduationScrollIconData} {...p} />;
const Users: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UserGroupIconData} {...p} />;
const Link2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Link01IconData} {...p} />;
const RefreshCw: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ReloadIconData} {...p} />;
const ArrowUpDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SortingDownIconData} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const Image: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Image01IconData} {...p} />;
const FileSpreadsheet: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FileSpreadsheetIconData} {...p} />;
const Presentation: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Presentation01IconData} {...p} />;
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';

import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import { useSettings } from '../contexts/SettingsContext';
import { useTutorials } from '../contexts/TutorialContext';

interface ResourceManagerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  onEditResource?: (type: string, resource: any) => void;
  onViewResource?: (type: string, resource: any) => void;
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
  { key: 'all', label: 'All Resources', icon: FileText },
  { key: 'lesson', label: 'Lesson Plans', icon: BookMarked },
  { key: 'quiz', label: 'Quizzes', icon: ListChecks },
  { key: 'worksheet', label: 'Worksheets', icon: FileSpreadsheet },
  { key: 'rubric', label: 'Rubrics', icon: FileText },
  { key: 'kindergarten', label: 'Kindergarten', icon: GraduationCap },
  { key: 'multigrade', label: 'Multigrade', icon: Users },
  { key: 'cross-curricular', label: 'Cross-Curricular', icon: Link2 },
  { key: 'images', label: 'Images', icon: Image },
  { key: 'presentation', label: 'Presentations', icon: Presentation }
];

const ResourceManager: React.FC<ResourceManagerProps> = ({
  tabId,
  savedData,
  onDataChange,
  onViewResource,
  onEditResource
}) => {
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

  // Persist filter/sort state to tab data
  useEffect(() => {
    onDataChange({ searchQuery, filterType, sortBy, sortOrder });
  }, [searchQuery, filterType, sortBy, sortOrder]);

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

      const allResources: Resource[] = [
        ...lessonPlans.data.map((r: any) => ({ ...r, type: 'lesson' })),
        ...quizzes.data.map((r: any) => ({ ...r, type: 'quiz' })),
        ...worksheets.data.map((r: any) => ({ ...r, type: 'worksheet' })),
        ...rubrics.data.map((r: any) => ({ ...r, type: 'rubric' })),
        ...kindergarten.data.map((r: any) => ({ ...r, type: 'kindergarten' })),
        ...multigrade.data.map((r: any) => ({ ...r, type: 'multigrade' })),
        ...crossCurricular.data.map((r: any) => ({ ...r, type: 'cross-curricular' })),
        ...images.data.map((r: any) => ({ ...r, type: 'images' })),
        ...presentations.data.map((r: any) => ({ ...r, type: 'presentation' }))
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
      'presentation': Presentation
    };
    const Icon = icons[type] || FileText;
    return Icon;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'lesson': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
      'quiz': 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700',
      'worksheet': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
      'rubric': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
      'kindergarten': 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',
      'multigrade': 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700',
      'cross-curricular': 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700',
      'images': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
      'presentation': 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700'
    };
    return colors[type] || 'bg-theme-tertiary text-theme-label border-theme';
  };

  const getTypeDotColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'lesson': 'bg-purple-500',
      'quiz': 'bg-cyan-500',
      'worksheet': 'bg-blue-500',
      'rubric': 'bg-amber-500',
      'kindergarten': 'bg-pink-500',
      'multigrade': 'bg-indigo-500',
      'cross-curricular': 'bg-teal-500',
      'images': 'bg-green-500',
      'presentation': 'bg-orange-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const filteredAndSortedResources = resources
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
    });

  const favoriteResources = filteredAndSortedResources.filter(r => r.favorite);

  // Count resources per type
  const getCountForType = (key: string) => {
    if (key === 'all') return resources.length;
    return resources.filter(r => r.type === key).length;
  };

  if (loading) {
    return (
      <div className="h-full flex tab-content-bg">
        {/* Sidebar Skeleton */}
        <div className="w-60 flex-shrink-0 bg-theme-surface border-r border-theme flex flex-col h-full">
          <div className="p-4 border-b border-theme">
            <div className="h-4 w-24 rounded animate-pulse bg-theme-tertiary" />
          </div>
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                <div className="w-4 h-4 rounded animate-pulse bg-theme-tertiary flex-shrink-0" />
                <div className="flex-1 h-4 rounded animate-pulse bg-theme-tertiary" />
                <div className="w-6 h-4 rounded-full animate-pulse bg-theme-tertiary" />
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-theme space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-10 rounded animate-pulse bg-theme-tertiary" />
              <div className="h-3 w-6 rounded animate-pulse bg-theme-tertiary" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-16 rounded animate-pulse bg-theme-tertiary" />
              <div className="h-3 w-4 rounded animate-pulse bg-theme-tertiary" />
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Bar Skeleton */}
          <div className="bg-theme-surface border-b border-theme p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="space-y-1.5">
                <div className="h-6 w-36 rounded animate-pulse bg-theme-tertiary" />
                <div className="h-3 w-20 rounded animate-pulse bg-theme-tertiary" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-16 rounded-lg animate-pulse bg-theme-tertiary" />
                <div className="h-8 w-20 rounded-lg animate-pulse bg-theme-tertiary" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 h-9 rounded-lg animate-pulse bg-theme-tertiary" />
              <div className="h-9 w-9 rounded-lg animate-pulse bg-theme-tertiary" />
              <div className="h-9 w-28 rounded-lg animate-pulse bg-theme-tertiary" />
            </div>
          </div>

          {/* Resources Grid Skeleton */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-theme bg-theme-surface p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg animate-pulse bg-theme-tertiary" />
                    <div className="w-6 h-6 rounded animate-pulse bg-theme-tertiary" />
                  </div>
                  <div className="h-4 w-4/5 rounded animate-pulse bg-theme-tertiary" />
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-20 rounded animate-pulse bg-theme-tertiary" />
                    <div className="w-2 h-2 rounded-full animate-pulse bg-theme-tertiary" />
                    <div className="h-3 w-14 rounded animate-pulse bg-theme-tertiary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex tab-content-bg">
      {/* ── Left Sidebar: Category Filters ── */}
      <div className="w-60 flex-shrink-0 bg-theme-surface border-r border-theme flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-theme">
          <h2 className="text-sm font-semibold text-theme-heading uppercase tracking-wider">Categories</h2>
        </div>

        {/* Category List */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5" data-tutorial="resource-filters">
          {resourceTypes.map(({ key, label, icon: Icon }) => {
            const count = getCountForType(key);
            const isActive = filterType === key;

            return (
              <button
                key={key}
                onClick={() => setFilterType(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-theme-label hover:bg-theme-hover'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left truncate">{label}</span>
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
                {filterType === 'all' ? 'All Resources' : resourceTypes.find(t => t.key === filterType)?.label}
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
                {selectionMode ? 'Cancel' : 'Select'}
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
                placeholder="Search resources..."
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
                    getTypeDotColor={getTypeDotColor}
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
                  {searchQuery ? 'Try adjusting your search query' : 'Start creating resources to see them here'}
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
                    getTypeDotColor={getTypeDotColor}
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
                Cancel
              </button>
              <button
                onClick={() => {
                  const resource = resources.find(r => r.id === showDeleteConfirm);
                  if (resource) deleteResource(resource);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
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
              <img src={selectedImageResource.imageUrl} alt="" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
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
  getTypeDotColor: (type: string) => string;
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
  getTypeDotColor,
  selectionMode = false,
  isSelected = false,
  onToggleSelection
}) => {
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
              <img
                src={resource.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={`p-2 rounded-lg ${getTypeColor(resource.type)} border`}>
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
        <span className={`ml-2 w-2 h-2 rounded-full ${getTypeDotColor(resource.type)}`} />
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
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceManager;
