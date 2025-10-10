import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import CurriculumNavigator from './CurriculumNavigator';
import { Menu, X } from 'lucide-react';

interface CurriculumViewerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  onPanelClick?: () => void;
}

// Import all curriculum pages using Vite's glob import
const curriculumPages = import.meta.glob('../curriculum/**/*.tsx', { eager: false });

const CurriculumViewer: React.FC<CurriculumViewerProps> = ({ 
  tabId, 
  savedData, 
  onDataChange,
  onPanelClick 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentComponent, setCurrentComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Save current location to tab data
  useEffect(() => {
    if (location.pathname !== savedData?.currentPath) {
      onDataChange({ currentPath: location.pathname });
    }
  }, [location.pathname]);

  // Restore saved location on mount
  useEffect(() => {
    if (savedData?.currentPath && savedData.currentPath !== location.pathname) {
      navigate(savedData.currentPath, { replace: true });
    }
  }, []);

  // Load component when route changes
  useEffect(() => {
    const loadComponent = async () => {
      setLoading(true);
      setError(null);
      
      // Extract the curriculum path from the current route
      // Current path: /curriculum/grade1-subjects/page
      // Need to find: ../curriculum/grade1-subjects/page.tsx
      
      let curriculumPath = location.pathname.replace('/curriculum/', '').replace('/curriculum', '');
      
      // Try different path variations
      const possiblePaths = [
        `../curriculum/${curriculumPath}/page.tsx`,
        `../curriculum/${curriculumPath}.tsx`,
        `../curriculum/${curriculumPath}/index.tsx`,
        `../curriculum/page.tsx`, // Root curriculum page
      ];

      console.log('Looking for component at:', curriculumPath);
      console.log('Possible paths:', possiblePaths);
      console.log('Available paths:', Object.keys(curriculumPages));

      let componentModule = null;

      for (const path of possiblePaths) {
        if (curriculumPages[path]) {
          console.log('Found match:', path);
          try {
            componentModule = await curriculumPages[path]();
            break;
          } catch (err) {
            console.error(`Failed to load ${path}:`, err);
          }
        }
      }

      if (componentModule && componentModule.default) {
        setCurrentComponent(() => componentModule.default);
        setLoading(false);
      } else {
        // Try to find closest match
        const partialPath = curriculumPath.split('/')[0];
        const matchingPath = Object.keys(curriculumPages).find(p => 
          p.includes(partialPath) && p.endsWith('page.tsx')
        );

        if (matchingPath) {
          console.log('Found partial match:', matchingPath);
          try {
            componentModule = await curriculumPages[matchingPath]();
            if (componentModule && componentModule.default) {
              setCurrentComponent(() => componentModule.default);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error(`Failed to load ${matchingPath}:`, err);
          }
        }

        console.error('No component found for path:', curriculumPath);
        setError(`Could not load page: ${curriculumPath}`);
        setCurrentComponent(null);
        setLoading(false);
      }
    };

    loadComponent();
  }, [location.pathname]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading page...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Current path: {location.pathname}</p>
          <button
            onClick={() => navigate('/curriculum')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Curriculum Home
          </button>
        </div>
      );
    }

    if (currentComponent) {
      const Component = currentComponent;
      return <Component />;
    }

    // Default welcome page
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to OECS Curriculum
        </h2>
        <p className="text-gray-600 mb-4">
          Browse the curriculum using the navigation sidebar.
        </p>
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Menu className="w-5 h-5 inline mr-2" />
            Show Navigation
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-white" onClick={onPanelClick}>
      {/* Sidebar */}
      <div 
        className={`border-r border-gray-200 bg-gray-50 transition-all duration-300 ${
          sidebarOpen ? 'w-80' : 'w-0'
        } overflow-hidden flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Curriculum</h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <CurriculumNavigator onNavigate={() => {}} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-gray-200 p-4 flex items-center">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition mr-4"
              title="Show navigation"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <h2 className="text-xl font-semibold text-gray-800">
            OECS Curriculum
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CurriculumViewer;