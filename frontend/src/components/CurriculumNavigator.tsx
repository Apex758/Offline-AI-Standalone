import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from 'lucide-react';

interface TreeNode {
  [key: string]: TreeNode | FileInfo;
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
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load curriculum tree
    import('../data/curriculumTree.json')
      .then(module => {
        console.log('Curriculum tree loaded:', module.default);
        setTree(module.default);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load curriculum tree:', error);
        setLoading(false);
      });
  }, []);

  const toggleNode = (path: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const formatName = (name: string): string => {
    return name
      .replace(/page\.tsx$/, '')
      .replace(/\.tsx$/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const isFileInfo = (value: any): value is FileInfo => {
    return value && typeof value === 'object' && value.type === 'file';
  };

  const handleFileClick = (route: string, e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Navigating to:', route);
    navigate(route);
    if (onNavigate) {
      onNavigate();
    }
  };

  const renderTree = (node: TreeNode, path: string = '', level: number = 0): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    Object.entries(node).forEach(([key, value]) => {
      const currentPath = path ? `${path}/${key}` : key;
      const isExpanded = expandedNodes.has(currentPath);
      const indentation = level * 16;

      if (isFileInfo(value)) {
        // It's a file
        const isActive = location.pathname === value.route;
        elements.push(
          <button
            key={currentPath}
            onClick={(e) => handleFileClick(value.route, e)}
            className={`flex items-center w-full py-2 px-3 hover:bg-gray-100 rounded-md transition-colors text-sm group text-left ${
              isActive ? 'bg-blue-50 border-l-2 border-blue-600' : ''
            }`}
            style={{ paddingLeft: `${indentation + 8}px` }}
          >
            <FileText className={`w-4 h-4 mr-2 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-blue-500'}`} />
            <span className={`${isActive ? 'text-blue-600 font-medium' : 'text-gray-700 group-hover:text-blue-600'}`}>
              {formatName(key)}
            </span>
          </button>
        );
      } else {
        // It's a directory
        const hasChildren = Object.keys(value).length > 0;
        
        elements.push(
          <div key={currentPath}>
            <button
              onClick={() => toggleNode(currentPath)}
              className="flex items-center w-full py-2 px-3 hover:bg-gray-50 rounded-md transition-colors text-sm"
              style={{ paddingLeft: `${indentation + 8}px` }}
            >
              {hasChildren && (
                isExpanded ? 
                  <ChevronDown className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0" /> :
                  <ChevronRight className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0" />
              )}
              {isExpanded ? 
                <FolderOpen className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" /> :
                <Folder className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
              }
              <span className="font-medium text-gray-800">
                {formatName(key)}
              </span>
            </button>
            {isExpanded && hasChildren && (
              <div>
                {renderTree(value as TreeNode, currentPath, level + 1)}
              </div>
            )}
          </div>
        );
      }
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

  return (
    <div className="curriculum-navigator h-full overflow-y-auto">
      <div className="p-2">
        {renderTree(tree)}
      </div>
    </div>
  );
};

export default CurriculumNavigator;