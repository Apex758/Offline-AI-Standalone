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
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['kindergarten', 'grade1', 'grade1-subjects']));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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

  const formatName = (name: string, isFolder: boolean = false): string => {
    // Remove file extensions
    let formatted = name
      .replace(/page\.tsx$/, '')
      .replace(/\.tsx$/, '')
      .replace(/loading\.tsx$/, '');

    // Handle special cases for cleaner display
    if (isFolder) {
      // Kindergarten
      if (formatted === 'kindergarten') return 'Kindergarten';
      
      // Grade folders - simplify names
      if (formatted.match(/^grade(\d+)$/)) {
        return formatted.replace(/grade(\d+)/, 'Grade $1');
      }
      if (formatted.match(/^grade(\d+)-subjects$/)) {
        return formatted.replace(/grade(\d+)-subjects/, 'Grade $1');
      }
      
      // Standards
      if (formatted === 'standards') return 'Standards';
    }

    // Convert kebab-case to Title Case
    formatted = formatted
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    // If it's empty after processing, return original
    return formatted.trim() || name;
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

  // Custom sort function to put Kindergarten first, then grades in order
  const sortEntries = (entries: [string, any][]): [string, any][] => {
    return entries.sort(([keyA], [keyB]) => {
      // Kindergarten always first
      if (keyA === 'kindergarten') return -1;
      if (keyB === 'kindergarten') return 1;

      // Standards near the end
      if (keyA === 'standards') return 1;
      if (keyB === 'standards') return -1;

      // Grade ordering
      const gradeA = keyA.match(/grade(\d+)/);
      const gradeB = keyB.match(/grade(\d+)/);
      
      if (gradeA && gradeB) {
        const numA = parseInt(gradeA[1]);
        const numB = parseInt(gradeB[1]);
        return numA - numB;
      }

      // Alphabetical for everything else
      return keyA.localeCompare(keyB);
    });
  };

  const renderTree = (node: TreeNode, path: string = '', level: number = 0): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    const sortedEntries = sortEntries(Object.entries(node));

    sortedEntries.forEach(([key, value]) => {
      const currentPath = path ? `${path}/${key}` : key;
      const isExpanded = expandedNodes.has(currentPath);
      const indentation = level * 12;

      if (isFileInfo(value)) {
        // It's a file - only show if it has meaningful content
        const displayName = formatName(key, false);
        
        // Skip if display name is empty or just whitespace
        if (!displayName.trim()) return;

        const isActive = location.pathname === value.route;
        
        elements.push(
          <button
            key={currentPath}
            onClick={(e) => handleFileClick(value.route, e)}
            className={`flex items-center w-full py-2 px-2 hover:bg-blue-50 rounded-md transition-colors text-sm group text-left ${
              isActive ? 'bg-blue-100 border-l-4 border-blue-600' : ''
            }`}
            style={{ paddingLeft: `${indentation + 8}px` }}
          >
            <FileText className={`w-4 h-4 mr-2 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
            <span className={`${isActive ? 'text-blue-700 font-semibold' : 'text-gray-800 group-hover:text-blue-600'} text-sm`}>
              {displayName}
            </span>
          </button>
        );
      } else {
        // It's a directory
        const hasChildren = Object.keys(value).length > 0;
        if (!hasChildren) return; // Skip empty folders

        const displayName = formatName(key, true);
        
        elements.push(
          <div key={currentPath}>
            <button
              onClick={() => toggleNode(currentPath)}
              className="flex items-center w-full py-2 px-2 hover:bg-gray-100 rounded-md transition-colors text-sm font-medium"
              style={{ paddingLeft: `${indentation + 8}px` }}
            >
              {isExpanded ? 
                <ChevronDown className="w-4 h-4 mr-1 text-gray-600 flex-shrink-0" /> :
                <ChevronRight className="w-4 h-4 mr-1 text-gray-600 flex-shrink-0" />
              }
              {isExpanded ? 
                <FolderOpen className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" /> :
                <Folder className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
              }
              <span className="text-gray-900 font-semibold text-sm">
                {displayName}
              </span>
            </button>
            {isExpanded && hasChildren && (
              <div className="mt-1">
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
        <div className="mb-2 px-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Browse Curriculum
          </h3>
        </div>
        {renderTree(tree)}
      </div>
    </div>
  );
};

export default CurriculumNavigator;