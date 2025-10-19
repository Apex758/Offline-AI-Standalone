import React, { useState, useEffect, useRef } from 'react';
import curriculumTreeData from '../data/curriculumTree.json';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from 'lucide-react';

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
  const navigate = useNavigate();
  const location = useLocation();
  const hasAutoExpandedRef = useRef(false);

  useEffect(() => {
    try {
      console.log('Curriculum tree loaded:', curriculumTreeData);
      setTree(curriculumTreeData);
    } catch (error) {
      console.error('Failed to load curriculum tree:', error);
    } finally {
      setLoading(false);
    }
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
    console.log('Navigating to:', route);
    navigate(route);
    if (onNavigate) {
      onNavigate();
    }
  };

  const sortEntries = (entries: [string, any][]): [string, any][] => {
    return entries
      .filter(([key, value]) => !isFileInfo(value))
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

  const renderTree = (node: TreeNode, path: string = '', level: number = 0): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    const sortedEntries = sortEntries(Object.entries(node));

    sortedEntries.forEach(([key, value]) => {
      if (isFileInfo(value)) return;

      const currentPath = path ? `${path}/${key}` : key;
      const isExpanded = expandedNodes.has(currentPath);
      const indentation = level * 12;
      const folderNode = value as TreeNode;
      const indexRoute = getIndexPageForFolder(folderNode);

      if (!hasValidChildren(folderNode) && !indexRoute) {
        return;
      }

      const displayName = formatFolderName(key);
      
      elements.push(
        <div key={currentPath}>
          {/* Folder button - always toggles */}
          <button
            onClick={(e) => handleFolderToggle(currentPath, e)}
            className="flex items-center w-full py-2 px-2 rounded-md transition-colors text-sm font-medium text-left hover:bg-gray-100 text-gray-900"
            style={{ paddingLeft: `${indentation + 8}px` }}
          >
            {isExpanded ? 
              <ChevronDown className="w-4 h-4 mr-1 flex-shrink-0 text-gray-600" /> :
              <ChevronRight className="w-4 h-4 mr-1 flex-shrink-0 text-gray-600" />
            }
            {isExpanded ? 
              <FolderOpen className="w-4 h-4 mr-2 flex-shrink-0 text-blue-500" /> :
              <Folder className="w-4 h-4 mr-2 flex-shrink-0 text-blue-500" />
            }
            <span className="text-sm font-semibold">
              {displayName}
            </span>
          </button>

          {isExpanded && (
            <div className="mt-1">
              {/* Show index page as a clickable item if it exists */}
              {indexRoute && (
                <button
                  onClick={(e) => handlePageClick(indexRoute, e)}
                  className={`flex items-center w-full py-2 px-2 rounded-md transition-colors text-sm text-left ${
                    isCurrentPath(indexRoute)
                      ? 'bg-blue-100 border-l-4 border-blue-600 text-blue-700 font-semibold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
                >
                  <FileText className={`w-4 h-4 mr-2 flex-shrink-0 ${
                    isCurrentPath(indexRoute) ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className="text-sm">Overview</span>
                </button>
              )}
              {/* Render child folders */}
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
      <div className="p-4 text-center text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm">Loading curriculum...</p>
      </div>
    );
  }

  if (Object.keys(tree).length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-sm">No curriculum content found</p>
      </div>
    );
  }

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  return (
    <div className="curriculum-navigator h-full overflow-y-auto">
      <div className="p-2">
        <div className="mb-2 px-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Browse Curriculum
          </h3>
          <button
            onClick={handleCollapseAll}
            className="text-[10px] px-2 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
          >
            Collapse All
          </button>
        </div>
        {renderTree(tree)}
      </div>
    </div>
  );
};

export default CurriculumNavigator;