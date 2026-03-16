import React, { useState, useEffect, useRef } from 'react';
import { getCurriculumTree } from '../data/curriculumLoader';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, FolderOpen, FileText, BookOpen, GraduationCap, Layers, ChevronsDownUp, Search, X } from 'lucide-react';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import { useSettings } from '../contexts/SettingsContext';

interface TreeNode {
  [key: string]: TreeNode | FileInfo | any;
}

interface FileInfo {
  type: 'file';
  path: string;
  route: string;
  name: string;
}

interface CurriculumNavigatorProps {
  onNavigate?: () => void;
}

const CurriculumNavigator: React.FC<CurriculumNavigatorProps> = ({ onNavigate }) => {
  const [tree, setTree] = useState<TreeNode>({});
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['kindergarten', 'grade1-subjects']));
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const hasAutoExpandedRef = useRef(false);
  const { settings } = useSettings();
  const accentColor = settings.tabColors['curriculum'] ?? '#8b5cf6';

  useEffect(() => {
    getCurriculumTree()
      .then(data => setTree(data))
      .catch(error => console.error('Failed to load curriculum tree:', error))
      .finally(() => setLoading(false));
  }, []);

  // Auto-expand folders in current path ONLY on initial load
  useEffect(() => {
    if (hasAutoExpandedRef.current) return;

    const pathParts = location.pathname.replace('/curriculum/', '').split('/').filter(Boolean);

    if (pathParts.length > 0) {
      setExpandedNodes(prev => {
        const newExpanded = new Set(prev);
        let currentPath = '';
        for (const part of pathParts) {
          currentPath = currentPath ? `${currentPath}/${part}` : part;
          newExpanded.add(currentPath);
        }
        return newExpanded;
      });
      hasAutoExpandedRef.current = true;
    }
  }, [loading]);

  const toggleNode = (path: string) => {
    setExpandedNodes(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      return newExpanded;
    });
  };

  const formatFolderName = (name: string): string => {
    if (name === 'kindergarten') return 'Kindergarten';
    if (name === 'standards') return 'Standards';

    if (name.match(/^grade(\d+)-subjects$/)) {
      return name.replace(/grade(\d+)-subjects/, 'Grade $1');
    }

    if (name.match(/^grade(\d+)$/)) {
      return name.replace(/grade(\d+)/, 'Grade $1');
    }

    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const isFileInfo = (value: any): value is FileInfo => {
    return value && typeof value === 'object' && value.type === 'file';
  };

  const hasValidChildren = (node: TreeNode): boolean => {
    return Object.entries(node).some(([key, value]) => {
      if (isFileInfo(value)) return false;
      return hasValidChildren(value as TreeNode) || Object.keys(value).length > 0;
    });
  };

  const getIndexPageForFolder = (node: TreeNode): string | null => {
    for (const [key, value] of Object.entries(node)) {
      if (isFileInfo(value) && (key === 'page.tsx' || key === 'index.tsx')) {
        return value.route;
      }
    }
    return null;
  };

  const isCurrentPath = (route: string): boolean => {
    const currentPath = location.pathname.replace(/\/$/, '');
    const routePath = route.replace(/\/$/, '');
    return currentPath === routePath;
  };

  const handleFolderToggle = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleNode(path);
  };

  const handlePageClick = (route: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(route);
    if (onNavigate) {
      onNavigate();
    }
  };

  const sortEntries = (entries: [string, any][]): [string, any][] => {
    return entries
      .filter(([key, value]) => !isFileInfo(value) && key !== 'standards')
      .sort(([keyA], [keyB]) => {
        if (keyA === 'kindergarten') return -1;
        if (keyB === 'kindergarten') return 1;
        if (keyA === 'standards') return 1;
        if (keyB === 'standards') return -1;

        const gradeA = keyA.match(/grade(\d+)/);
        const gradeB = keyB.match(/grade(\d+)/);

        if (gradeA && gradeB) {
          return parseInt(gradeA[1]) - parseInt(gradeB[1]);
        }

        return keyA.localeCompare(keyB);
      });
  };

  // Get an icon for the folder based on its name
  const getFolderIcon = (name: string, isExpanded: boolean) => {
    if (name === 'kindergarten') return <GraduationCap className="w-4 h-4" />;
    if (name === 'standards') return <Layers className="w-4 h-4" />;
    if (name.match(/^grade\d/)) return <GraduationCap className="w-4 h-4" />;
    if (isExpanded) return <FolderOpen className="w-4 h-4" />;
    return <FolderOpen className="w-4 h-4" />;
  };

  // Check if a folder name matches the search
  const matchesSearch = (name: string): boolean => {
    if (!searchQuery.trim()) return true;
    return formatFolderName(name).toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Check if a node or any of its descendants match
  const nodeOrDescendantsMatch = (node: TreeNode, key: string): boolean => {
    if (matchesSearch(key)) return true;
    const sortedEntries = sortEntries(Object.entries(node));
    return sortedEntries.some(([childKey, childValue]) => {
      if (isFileInfo(childValue)) return false;
      return nodeOrDescendantsMatch(childValue as TreeNode, childKey);
    });
  };

  const renderTree = (node: TreeNode, path: string = '', level: number = 0): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    const sortedEntries = sortEntries(Object.entries(node));

    sortedEntries.forEach(([key, value]) => {
      if (isFileInfo(value)) return;

      const currentPath = path ? `${path}/${key}` : key;
      const isExpanded = expandedNodes.has(currentPath);
      const folderNode = value as TreeNode;
      const indexRoute = getIndexPageForFolder(folderNode);

      if (!hasValidChildren(folderNode) && !indexRoute) {
        return;
      }

      // Search filtering
      if (searchQuery.trim() && !nodeOrDescendantsMatch(folderNode, key)) {
        return;
      }

      const displayName = formatFolderName(key);
      const isTopLevel = level === 0;
      const hasActiveChild = indexRoute ? isCurrentPath(indexRoute) : false;

      elements.push(
        <div key={currentPath} className={isTopLevel ? 'mb-1' : ''}>
          {/* Folder row */}
          <button
            onClick={(e) => handleFolderToggle(currentPath, e)}
            className={`
              group flex items-center w-full rounded-lg transition-all duration-150
              ${isTopLevel
                ? 'py-2.5 px-3 text-sm font-semibold'
                : 'py-1.5 px-3 text-[13px] font-medium'
              }
              ${hasActiveChild
                ? 'text-theme-title'
                : 'text-theme-label hover:text-theme-title'
              }
              hover:bg-theme-hover
            `}
            style={{
              paddingLeft: isTopLevel ? '12px' : `${level * 16 + 12}px`,
              ...(hasActiveChild ? { backgroundColor: `${accentColor}0a` } : {}),
            }}
          >
            {/* Expand/collapse chevron */}
            <span className={`mr-1.5 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
              <ChevronDown className="w-3.5 h-3.5 text-theme-hint group-hover:text-theme-muted" />
            </span>

            {/* Folder icon */}
            <span
              className="mr-2 shrink-0 transition-colors"
              style={{ color: isExpanded || hasActiveChild ? accentColor : undefined }}
            >
              {isTopLevel ? getFolderIcon(key, isExpanded) : <FolderOpen className="w-3.5 h-3.5" />}
            </span>

            <span className="truncate">{displayName}</span>

            {/* Item count badge for top-level */}
            {isTopLevel && (
              <span className="ml-auto text-[10px] font-normal text-theme-hint bg-theme-tertiary rounded-full px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {sortEntries(Object.entries(folderNode)).length}
              </span>
            )}
          </button>

          {/* Children */}
          {isExpanded && (
            <div className={`${isTopLevel ? 'ml-2' : ''} relative`}>
              {/* Vertical connector line */}
              {!isTopLevel && (
                <div
                  className="absolute top-0 bottom-0 w-px bg-theme-hover"
                  style={{ left: `${level * 16 + 20}px` }}
                />
              )}

              {/* Overview / index page link */}
              {indexRoute && (
                <button
                  onClick={(e) => handlePageClick(indexRoute, e)}
                  className={`
                    group/item flex items-center w-full rounded-lg transition-all duration-150 py-1.5 px-3 text-[13px]
                    ${isCurrentPath(indexRoute)
                      ? 'font-semibold'
                      : 'text-theme-muted hover:text-theme-label hover:bg-theme-hover'
                    }
                  `}
                  style={{
                    paddingLeft: `${(level + 1) * 16 + 12}px`,
                    ...(isCurrentPath(indexRoute)
                      ? {
                          color: accentColor,
                          backgroundColor: `${accentColor}10`,
                        }
                      : {}),
                  }}
                >
                  <FileText className={`w-3.5 h-3.5 mr-2 shrink-0 transition-colors ${
                    isCurrentPath(indexRoute) ? '' : 'text-theme-hint group-hover/item:text-theme-muted'
                  }`}
                    style={isCurrentPath(indexRoute) ? { color: accentColor } : {}}
                  />
                  <span className="truncate">Overview</span>
                  {isCurrentPath(indexRoute) && (
                    <span
                      className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </button>
              )}

              {/* Child folders */}
              {renderTree(folderNode, currentPath, level + 1)}
            </div>
          )}
        </div>
      );
    });

    return elements;
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-theme-hint">
        <HeartbeatLoader className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm">Loading curriculum...</p>
      </div>
    );
  }

  if (Object.keys(tree).length === 0) {
    return (
      <div className="p-6 text-center text-theme-hint">
        <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No curriculum content found</p>
      </div>
    );
  }

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  return (
    <div className="curriculum-navigator h-full flex flex-col overflow-hidden">
      {/* Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-theme-hint pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Auto-expand all when searching
              if (e.target.value.trim()) {
                const allPaths = new Set<string>();
                const collectPaths = (node: TreeNode, path: string = '') => {
                  const entries = sortEntries(Object.entries(node));
                  entries.forEach(([key, value]) => {
                    if (isFileInfo(value)) return;
                    const currentPath = path ? `${path}/${key}` : key;
                    allPaths.add(currentPath);
                    collectPaths(value as TreeNode, currentPath);
                  });
                };
                collectPaths(tree);
                setExpandedNodes(allPaths);
              }
            }}
            placeholder="Search topics..."
            className="w-full pl-8 pr-8 py-1.5 text-sm rounded-lg border border-theme bg-theme-surface text-theme-title placeholder:text-theme-hint focus:outline-none focus:ring-1 transition"
            style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-theme-hover transition"
            >
              <X className="w-3.5 h-3.5 text-theme-hint" />
            </button>
          )}
        </div>
      </div>

      {/* Header row */}
      <div className="px-3 pb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-theme-hint">
          Browse
        </span>
        <button
          onClick={handleCollapseAll}
          className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded text-theme-hint hover:text-theme-muted hover:bg-theme-hover transition"
          title="Collapse all"
        >
          <ChevronsDownUp className="w-3 h-3" />
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto px-2 pb-3 scrollbar-hide">
        {renderTree(tree)}
      </div>
    </div>
  );
};

export default CurriculumNavigator;
