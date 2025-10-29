import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Star, Trash2, Edit, Download, Calendar, Eye,  
  FileText, ListChecks, BookMarked, GraduationCap, Users, 
  Link2, RefreshCw, ArrowUpDown, X
} from 'lucide-react';
import axios from 'axios';

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
}

const ResourceManager: React.FC<ResourceManagerProps> = ({ 
  tabId, 
  savedData, 
  onDataChange,
  onEditResource 
}) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const resourceTypes = [
    { key: 'all', label: 'All Resources', icon: FileText },
    { key: 'lesson', label: 'Lesson Plans', icon: BookMarked },
    { key: 'quiz', label: 'Quizzes', icon: ListChecks },
    { key: 'rubric', label: 'Rubrics', icon: FileText },
    { key: 'kindergarten', label: 'Kindergarten', icon: GraduationCap },
    { key: 'multigrade', label: 'Multigrade', icon: Users },
    { key: 'cross-curricular', label: 'Cross-Curricular', icon: Link2 }
  ];

  const loadAllResources = async () => {
    setLoading(true);
    try {
      const [lessonPlans, quizzes, rubrics, kindergarten, multigrade, crossCurricular] = await Promise.all([
        axios.get('http://localhost:8000/api/lesson-plan-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/quiz-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/rubric-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/kindergarten-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/multigrade-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/cross-curricular-history').catch(() => ({ data: [] }))
      ]);

      const allResources: Resource[] = [
        ...lessonPlans.data.map((r: any) => ({ ...r, type: 'lesson' })),
        ...quizzes.data.map((r: any) => ({ ...r, type: 'quiz' })),
        ...rubrics.data.map((r: any) => ({ ...r, type: 'rubric' })),
        ...kindergarten.data.map((r: any) => ({ ...r, type: 'kindergarten' })),
        ...multigrade.data.map((r: any) => ({ ...r, type: 'multigrade' })),
        ...crossCurricular.data.map((r: any) => ({ ...r, type: 'cross-curricular' }))
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
      'rubric': 'http://localhost:8000/api/rubric-history',
      'kindergarten': 'http://localhost:8000/api/kindergarten-history',
      'multigrade': 'http://localhost:8000/api/multigrade-history',
      'cross-curricular': 'http://localhost:8000/api/cross-curricular-history'
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
      'rubric': FileText,
      'kindergarten': GraduationCap,
      'multigrade': Users,
      'cross-curricular': Link2
    };
    const Icon = icons[type] || FileText;
    return Icon;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'lesson': 'bg-purple-100 text-purple-700 border-purple-200',
      'quiz': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'rubric': 'bg-amber-100 text-amber-700 border-amber-200',
      'kindergarten': 'bg-pink-100 text-pink-700 border-pink-200',
      'multigrade': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'cross-curricular': 'bg-teal-100 text-teal-700 border-teal-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resource Manager</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all your generated educational resources
            </p>
          </div>
          <button
            onClick={loadAllResources}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative" data-tutorial="resource-search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <ArrowUpDown className="w-5 h-5 text-gray-600" />
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'type')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-tutorial="resource-sort"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Type Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 overflow-x-auto" data-tutorial="resource-filters">
        <div className="flex gap-2 min-w-max">
          {resourceTypes.map(({ key, label, icon: Icon }) => {
            const count = key === 'all' 
              ? resources.length 
              : resources.filter(r => r.type === key).length;
            
            return (
              <button
                key={key}
                onClick={() => setFilterType(key)}
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  filterType === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{label}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  filterType === key 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Favorites Section */}
        {favoriteResources.length > 0 && (
          <div className="mb-8" data-tutorial="resource-favorites">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500 fill-yellow-500" />
              Favorite Resources ({favoriteResources.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteResources.map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onToggleFavorite={() => toggleFavorite(resource)}
                  onDelete={() => setShowDeleteConfirm(resource.id)}
                  onExport={() => exportResource(resource)}
                  onEdit={() => onEditResource?.(resource.type, resource)}
                  getTypeIcon={getTypeIcon}
                  getTypeColor={getTypeColor}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {filterType === 'all' ? 'All Resources' : resourceTypes.find(t => t.key === filterType)?.label} ({filteredAndSortedResources.length})
          </h2>
          
          {filteredAndSortedResources.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No resources found</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchQuery ? 'Try adjusting your search query' : 'Start creating resources to see them here'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedResources.map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onToggleFavorite={() => toggleFavorite(resource)}
                  onDelete={() => setShowDeleteConfirm(resource.id)}
                  onExport={() => exportResource(resource)}
                  onEdit={() => onEditResource?.(resource.type, resource)}
                  getTypeIcon={getTypeIcon}
                  getTypeColor={getTypeColor}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="p-1 rounded hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this resource? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
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
    </div>
  );
};

interface ResourceCardProps {
  resource: Resource;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onExport: () => void;
  onEdit: () => void;
  getTypeIcon: (type: string) => any;
  getTypeColor: (type: string) => string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onToggleFavorite,
  onDelete,
  onExport,
  onEdit,
  getTypeIcon,
  getTypeColor
}) => {
  const Icon = getTypeIcon(resource.type);
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition group" data-tutorial="resource-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${getTypeColor(resource.type)} border`}>
          <Icon className="w-5 h-5" />
        </div>
        <button
          onClick={onToggleFavorite}
          className="p-1 rounded hover:bg-gray-100 transition"
        >
          <Star
            className={`w-5 h-5 ${
              resource.favorite 
                ? 'text-yellow-500 fill-yellow-500' 
                : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {resource.title}
      </h3>

      <div className="flex items-center text-xs text-gray-500 mb-4">
        <Calendar className="w-3 h-3 mr-1" />
        {new Date(resource.timestamp).toLocaleDateString()}
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" data-tutorial="resource-actions">
        {/* "View" Button - shows if there's generated content */}
        {(resource.generatedQuiz || resource.generatedPlan || resource.generatedRubric) && (
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            title="View generated content"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </button>
        )}
        
        {/* "Edit" Button - always available */}
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
          title="Edit or view this resource"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </button>
        
        <button
          onClick={onExport}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          title="Export"
        >
          <Download className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default ResourceManager;