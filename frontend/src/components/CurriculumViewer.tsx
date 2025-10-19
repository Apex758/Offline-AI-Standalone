import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import CurriculumNavigator from './CurriculumNavigator';
import { Menu, X } from 'lucide-react';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import { useSettings } from '../contexts/SettingsContext';

interface CurriculumViewerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  onPanelClick?: () => void;
}

// Import all curriculum pages using Vite's glob import
const allCurriculumPages = import.meta.glob('../curriculum/**/*.tsx', { eager: true });

// Filter out dynamic route pages (containing [...])
const curriculumPages = Object.keys(allCurriculumPages)
  .filter(path => !path.includes('[') && !path.includes(']'))
  .reduce((acc, key) => {
    // With eager loading, modules are already loaded
    const module = allCurriculumPages[key];
    acc[key] = () => Promise.resolve(module);
    return acc;
  }, {} as Record<string, () => Promise<unknown>>);

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
  const [showTutorial, setShowTutorial] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, markTutorialComplete, isTutorialCompleted } = useSettings();

  // Save current location to tab data
  useEffect(() => {
    if (location.pathname !== savedData?.currentPath) {
      onDataChange({ currentPath: location.pathname });
    }
  }, [location.pathname]);

  // Restore saved location on mount
  useEffect(() => {
    if (savedData?.currentPath && savedData.currentPath !== location.pathname) {
      console.log('📍 Restoring path from savedData:', savedData.currentPath);
      navigate(savedData.currentPath, { replace: true });
    }
  }, [savedData?.currentPath]);

  // Auto-show tutorial on first use
  useEffect(() => {
    if (
      settings.tutorials.tutorialPreferences.autoShowOnFirstUse &&
      !isTutorialCompleted(TUTORIAL_IDS.CURRICULUM)
    ) {
      setShowTutorial(true);
    }
  }, [settings, isTutorialCompleted]);

  // Tutorial complete handler
  const handleTutorialComplete = () => {
    markTutorialComplete(TUTORIAL_IDS.CURRICULUM);
    setShowTutorial(false);
  };

  // Load component when route changes
  useEffect(() => {
    const loadComponent = async () => {
      setLoading(true);
      setError(null);
      setCurrentComponent(null);
      
      // DECLARE curriculumPath FIRST!
      let curriculumPath = '';
      
      // THEN assign to it
      if (location.pathname === '/' || location.pathname === '') {
        curriculumPath = '';
      } else {
        curriculumPath = location.pathname
          .replace('/curriculum/', '')
          .replace('/curriculum', '')
          .replace(/^\//, '');
      }
      
      // Check if this is a dynamic route (contains [...] pattern)
      if (curriculumPath.includes('[') && curriculumPath.includes(']')) {
        console.log('Skipping dynamic route:', curriculumPath);
        setError('This page uses dynamic routing and cannot be displayed directly.');
        setLoading(false);
        return;
      }
      
      // Try different path variations
      const possiblePaths = [
        `../curriculum/${curriculumPath}/page.tsx`,
        `../curriculum/${curriculumPath}.tsx`,
        `../curriculum/${curriculumPath}/index.tsx`,
        `../curriculum/page.tsx`,
      ];

      console.log('Looking for component at:', curriculumPath);
      console.log('Possible paths:', possiblePaths);

      let foundComponent = null;

      for (const path of possiblePaths) {
        // Skip any paths that contain dynamic route segments
        if (path.includes('[') && path.includes(']')) {
          console.log('Skipping dynamic route path:', path);
          continue;
        }
        
        if (curriculumPages[path]) {
          console.log('Found match:', path);
          try {
            const module = await curriculumPages[path]();
            if (module && (module as any).default) {
              foundComponent = (module as any).default;
              break;
            }
          } catch (err) {
            console.error(`Failed to load ${path}:`, err);
          }
        }
      }

      if (foundComponent) {
        setCurrentComponent(() => foundComponent);
        setLoading(false);
      } else {
        console.error('No component found for path:', curriculumPath);
        setError(`Could not load page: ${curriculumPath}`);
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
      // Wrap in error boundary to catch any render errors
      try {
        return <Component />;
      } catch (err) {
        console.error('Error rendering component:', err);
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Render Error</h2>
            <p className="text-gray-600">Failed to render this page.</p>
            <p className="text-sm text-red-500 mt-2">{String(err)}</p>
          </div>
        );
      }
    }

    return (
      <div className="p-8" data-tutorial="curriculum-welcome">
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
    <div className="flex h-full bg-white relative" onClick={onPanelClick}>
      {/* Sidebar */}
      <div
        className={`border-r border-gray-200 bg-gray-50 transition-all duration-300 ${
          sidebarOpen ? 'w-50' : 'w-0'
        } overflow-hidden flex flex-col`}
        data-tutorial="curriculum-grades"
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
        <div className="flex-1 overflow-y-auto" data-tutorial="curriculum-subjects">
          <CurriculumNavigator onNavigate={() => {}} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-gray-200 p-4 flex items-center" data-tutorial="curriculum-breadcrumb">
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
        <div className="flex-1 overflow-y-auto" data-tutorial="curriculum-topics">
          {renderContent()}
        </div>
      </div>

      {/* Tutorial Components */}
      <TutorialOverlay
        steps={tutorials[TUTORIAL_IDS.CURRICULUM].steps}
        onComplete={handleTutorialComplete}
        autoStart={showTutorial}
        showFloatingButton={false}
      />
 
      <TutorialButton
        tutorialId={TUTORIAL_IDS.CURRICULUM}
        onStartTutorial={() => setShowTutorial(true)}
        position="bottom-right"
      />
    
    </div>
  );
};

export default CurriculumViewer;