import React, { useState, useEffect, useMemo } from 'react';
import {
  Menu,
  X,
  MessageSquare,
  ClipboardCheck,
  BookOpen,
  FileText,
  LogOut,
  Plus,
  Columns,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  ListChecks,
  BookMarked,
  School,
  Users,
  BarChart3,
  Library,
  Settings as SettingsIcon
} from 'lucide-react';

import { User, Tab, Tool } from '../types';
import Chat from './Chat';
import LessonPlanner from './LessonPlanner';
import CurriculumViewer from './CurriculumViewer';
import QuizGenerator from './QuizGenerator';
import RubricGenerator from './RubricGenerator';
import MultigradePlanner from './MultigradePlanner';
import KindergartenPlanner from './KindergartenPlanner';
import CrossCurricularPlanner from './CrossCurricularPlanner';
import AnalyticsDashboard from './AnalyticsDashboard';
import ResourceManager from './ResourceManager';
import Settings from './Settings';
import TutorialOverlay, { dashboardWalkthroughSteps } from './TutorialOverlay';
import { useSettings } from '../contexts/SettingsContext';
import { generateColorVariants, isColorDark } from '../lib/utils';


interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const tools: Tool[] = [
  {
    id: 'analytics',
    name: 'Dashboard',
    icon: 'BarChart3',
    type: 'analytics',
    description: 'View your teaching analytics and quick access'
  },
  { 
    id: 'resource-manager',
    name: 'Resource Manager',
    icon: 'Library',
    type: 'resource-manager',
    description: 'View, edit, and manage all your saved resources'
  },
  {
    id: 'chat',
    name: 'Chat with PEARL',
    icon: 'MessageSquare',
    type: 'chat',
    description: 'Have a conversation with the AI assistant'
  },
  {
    id: 'curriculum',
    name: 'Curriculum',
    icon: 'BookOpen',
    type: 'curriculum',
    description: 'Browse OECS curriculum content'
  },
  {
    id: 'grader',
    name: 'Grader AI',
    icon: 'ClipboardCheck',
    type: 'grader',
    description: 'Automated grading assistant'
  },
  {
    id: 'quiz-generator',
    name: 'Quiz Generator',
    icon: 'ListChecks',
    type: 'quiz-generator',
    description: 'Generate customized quizzes',
    group: 'tools'
  },
  {
    id: 'rubric-generator',
    name: 'Rubric Generator',
    icon: 'FileText',
    type: 'rubric-generator',
    description: 'Generate grading rubrics',
    group: 'tools'
  },
  // Lesson Planner Group
  {
    id: 'lesson-planner',
    name: 'Standard Lesson',
    icon: 'BookMarked',
    type: 'lesson-planner',
    description: 'Create comprehensive lesson plans',
    group: 'lesson-planners'
  },
  {
    id: 'kindergarten-planner',
    name: 'Kindergarten',
    icon: 'GraduationCap',
    type: 'kindergarten-planner',
    description: 'Kindergarten-specific lesson plans',
    group: 'lesson-planners'
  },
  {
    id: 'multigrade-planner',
    name: 'Multigrade',
    icon: 'Users',
    type: 'multigrade-planner',
    description: 'Plans for multiple grade levels',
    group: 'lesson-planners'
  },
  {
    id: 'cross-curricular-planner',
    name: 'Cross-Curricular',
    icon: 'School',
    type: 'cross-curricular-planner',
    description: 'Integrated subject lesson plans',
    group: 'lesson-planners'
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    type: 'settings',
    description: 'Application settings'
  }
];

const iconMap: { [key: string]: any } = {
  MessageSquare,
  ClipboardCheck,
  BookOpen,
  FileText,
  GraduationCap,
  ListChecks,
  BookMarked,
  School,
  Users,
  BarChart3,
  Library,
  Settings: SettingsIcon
};

const MAX_TABS_PER_TYPE = 3;

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const { settings } = useSettings();
  
  // Generate dynamic tab colors based on settings
  const tabColors = useMemo(() => {
    const colors: { [key: string]: { border: string; bg: string; activeBg: string } } = {};
    
    // Generate colors for each tab type from settings
    Object.entries(settings.tabColors).forEach(([type, hexColor]) => {
      const variants = generateColorVariants(hexColor);
      colors[type] = variants;
    });
    
    // Add default colors for settings and split tabs
    colors['settings'] = generateColorVariants('#64748b'); // slate-500
    colors['split'] = generateColorVariants('#9ca3af'); // gray-400
    
    return colors;
  }, [settings.tabColors]);
  // Determine if sidebar color is dark for text contrast
  const sidebarIsDark = useMemo(() => isColorDark(settings.sidebarColor), [settings.sidebarColor]);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ tabId?: string; groupType?: string; x: number; y: number } | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [lessonPlannerExpanded, setLessonPlannerExpanded] = useState(false);
  const [showFirstTimeTutorial, setShowFirstTimeTutorial] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('dashboard-tutorial-completed');
    if (!hasSeenTutorial) {
      setShowFirstTimeTutorial(true); // Still set this for first-time users
    }
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem('dashboard-tutorial-completed', 'true');
    setShowFirstTimeTutorial(false);
  };


  const getTabCountByType = (type: string) => {
    return tabs.filter(tab => tab.type === type && tab.type !== 'split').length;
  };

  const openTool = (tool: Tool) => {
    if (tool.type === 'analytics') {
      const existingAnalyticsTab = tabs.find(tab => tab.type === 'analytics');
      if (existingAnalyticsTab) {
        setActiveTabId(existingAnalyticsTab.id);
        return;
      }
    }

    if (tool.type === 'settings') {
      const existingSettingsTab = tabs.find(tab => tab.type === 'settings');
      if (existingSettingsTab) {
        setActiveTabId(existingSettingsTab.id);
        return;
      }
    }

    const currentCount = getTabCountByType(tool.type);
    if (currentCount >= MAX_TABS_PER_TYPE) {
      alert(`Maximum of ${MAX_TABS_PER_TYPE} ${tool.name} tabs allowed at once.`);
      return;
    }

    const newTab: Tab = {
      id: `${tool.type}-${Date.now()}`,
      title: tool.name,
      type: tool.type,
      active: true,
      data: {}
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    const tabToClose = tabs.find(tab => tab.id === tabId);
    
    if (tabToClose?.type === 'split' && tabToClose.splitTabs) {
      const [leftTabId, rightTabId] = tabToClose.splitTabs;
      const updatedTabs = tabs.filter(tab => tab.id !== tabId);
      setTabs(updatedTabs);
      
      if (leftTabId) {
        setActiveTabId(leftTabId);
      }
    } else {
      const updatedTabs = tabs.filter(tab => tab.id !== tabId);
      setTabs(updatedTabs);
      
      if (activeTabId === tabId && updatedTabs.length > 0) {
        setActiveTabId(updatedTabs[updatedTabs.length - 1].id);
      } else if (updatedTabs.length === 0) {
        setActiveTabId(null);
      }
    }
  };

  useEffect(() => {
    const savedTabs = localStorage.getItem('dashboard-tabs');
    const savedActiveTabId = localStorage.getItem('dashboard-active-tab');
    
    if (savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs);
        setTabs(parsedTabs);
        if (savedActiveTabId) {
          setActiveTabId(savedActiveTabId);
        }
      } catch (error) {
        console.error('Error loading saved tabs:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem('dashboard-tabs', JSON.stringify(tabs));
    }
    if (activeTabId) {
      localStorage.setItem('dashboard-active-tab', activeTabId);
    }
  }, [tabs, activeTabId]);

  // Handle Auto-Close Tabs on App Exit
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (settings.autoCloseTabsOnExit) {
        localStorage.removeItem('dashboard-tabs');
        localStorage.removeItem('dashboard-active-tab');
      }
      // If setting is false, do nothing - let existing save logic work
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [settings.autoCloseTabsOnExit]);

  const createSplitTab = (leftTabId: string, rightTabId: string) => {
    const leftTab = tabs.find(t => t.id === leftTabId);
    const rightTab = tabs.find(t => t.id === rightTabId);
    
    if (!leftTab || !rightTab) return;

    const splitTab: Tab = {
      id: `split-${Date.now()}`,
      title: `${leftTab.title} | ${rightTab.title}`,
      type: 'split',
      active: true,
      splitTabs: [leftTabId, rightTabId],
      data: {}
    };

    setTabs([...tabs, splitTab]);
    setActiveTabId(splitTab.id);
    setContextMenu(null);
  };

  const handleTabContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({ 
      tabId, 
      x: rect.left, 
      y: rect.bottom + 8 // 8px below the tab
    });
  };

  const handleSplitWithTab = (targetTabId: string) => {
    if (contextMenu) {
      createSplitTab(contextMenu.tabId!, targetTabId);
    }
  };

  const updateTabData = (tabId: string, data: any) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, data: { ...tab.data, ...data } } : tab
    ));
  };

  const updateTabTitle = (tabId: string, title: string) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, title } : tab
    ));
  };

  const toggleGroupCollapse = (type: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(type)) {
      newCollapsed.delete(type);
    } else {
      newCollapsed.add(type);
    }
    setCollapsedGroups(newCollapsed);
  };

  const closeGroupTabs = (type: string) => {
    const updatedTabs = tabs.filter(tab => tab.type !== type);
    setTabs(updatedTabs);
    setContextMenu(null);
    
    if (updatedTabs.length > 0) {
      setActiveTabId(updatedTabs[updatedTabs.length - 1].id);
    } else {
      setActiveTabId(null);
    }
  };


  const handleEditResource = (type: string, resource: any) => {
    const typeToToolType: { [key: string]: string } = {
      'lesson': 'lesson-planner',
      'quiz': 'quiz-generator',
      'rubric': 'rubric-generator',
      'kindergarten': 'kindergarten-planner',
      'multigrade': 'multigrade-planner',
      'cross-curricular': 'cross-curricular-planner'
    };

    const toolType = typeToToolType[type];
    if (!toolType) {
      console.error('Unknown resource type:', type);
      return;
    }

    const tool = tools.find(t => t.type === toolType);
    if (!tool) {
      console.error('Could not find tool for type:', toolType);
      return;
    }

    // Create a new tab for the corresponding tool, pre-filled with the resource's form data
    const newTab: Tab = {
      id: `${tool.type}-${Date.now()}`,
      title: `Editing: ${resource.title.substring(0, 20)}...`,
      type: tool.type,
      active: true,
      data: resource.formData || {} // Pass the saved form data to the new tab
    };

    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const renderSingleTabContent = (tab: Tab) => {
    switch (tab.type) {
      case 'analytics':
        return (
          <AnalyticsDashboard 
            tabId={tab.id} 
            savedData={tab.data} 
            onDataChange={(data) => updateTabData(tab.id, data)}
            onNavigate={(route) => {
              // Handle navigation to curriculum
              if (route.startsWith('/curriculum')) {
                // Check if there's already an open curriculum tab
                const existingCurriculumTab = tabs.find(t => t.type === 'curriculum' && t.active);
                
                if (existingCurriculumTab) {
                  // Update existing curriculum tab with new route
                  updateTabData(existingCurriculumTab.id, { currentPath: route });
                  setActiveTabId(existingCurriculumTab.id);
                } else {
                  // Check if there's any curriculum tab (even inactive)
                  const anyCurriculumTab = tabs.find(t => t.type === 'curriculum');
                  
                  if (anyCurriculumTab) {
                    // Activate existing curriculum tab and update route
                    setTabs(prev => prev.map(t => ({
                      ...t,
                      active: t.id === anyCurriculumTab.id
                    })));
                    updateTabData(anyCurriculumTab.id, { currentPath: route });
                    setActiveTabId(anyCurriculumTab.id);
                  } else {
                    // Create new curriculum tab
                    const curriculumTool = tools.find(t => t.type === 'curriculum');
                    if (curriculumTool) {
                      const newTab: Tab = {
                        id: `tab-${Date.now()}`,
                        title: curriculumTool.name,
                        type: 'curriculum',
                        active: true,
                        data: { currentPath: route }
                      };
                      setTabs(prev => [...prev.map(t => ({ ...t, active: false })), newTab]);
                      setActiveTabId(newTab.id);
                    }
                  }
                }
              }
            }}
            onCreateTab={(toolType) => {
              // Handle creating new tool tabs from action cards
              const tool = tools.find(t => t.type === toolType);
              if (tool) {
                // Check if this tool type already has an open tab
                const existingTab = tabs.find(t => t.type === toolType);
                
                if (existingTab) {
                  // Just activate the existing tab
                  setTabs(prev => prev.map(t => ({
                    ...t,
                    active: t.id === existingTab.id
                  })));
                  setActiveTabId(existingTab.id);
                } else {
                  // Create new tab for this tool
                  const newTab: Tab = {
                    id: `tab-${Date.now()}`,
                    title: tool.name,
                    type: toolType as any,
                    active: true
                  };
                  setTabs(prev => [...prev.map(t => ({ ...t, active: false })), newTab]);
                  setActiveTabId(newTab.id);
                }
              }
            }}
          />
        );
      case 'chat':
        return (
          <Chat 
            tabId={tab.id} 
            savedData={tab.data} 
            onDataChange={(data) => updateTabData(tab.id, data)} 
            onTitleChange={(title) => updateTabTitle(tab.id, title)}
            onPanelClick={() => setSidebarOpen(false)}
          />
        );
      case 'curriculum':
        return (
          <CurriculumViewer
            tabId={tab.id}
            savedData={tab.data}
            onDataChange={(data) => updateTabData(tab.id, data)}
            onPanelClick={() => setSidebarOpen(false)}
          />
        );
      case 'grader':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Grader AI</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      case 'resource-manager':
        return (
          <ResourceManager
            tabId={tab.id}
            savedData={tab.data}
            onDataChange={(data) => updateTabData(tab.id, data)}
            onEditResource={handleEditResource}
            
          />
        );
      case 'lesson-planner':
        return <LessonPlanner tabId={tab.id} savedData={tab.data} onDataChange={(data) => updateTabData(tab.id, data)} />;
      case 'kindergarten-planner':
        return <KindergartenPlanner tabId={tab.id} savedData={tab.data} onDataChange={(data) => updateTabData(tab.id, data)} />;
      case 'multigrade-planner':
        return <MultigradePlanner tabId={tab.id} savedData={tab.data} onDataChange={(data) => updateTabData(tab.id, data)} />;
      case 'cross-curricular-planner':
        return <CrossCurricularPlanner tabId={tab.id} savedData={tab.data} onDataChange={(data) => updateTabData(tab.id, data)} />;
      case 'quiz-generator':
        return <QuizGenerator tabId={tab.id} savedData={tab.data} onDataChange={(data) => updateTabData(tab.id, data)} />;
      case 'rubric-generator':
        return <RubricGenerator tabId={tab.id} savedData={tab.data} onDataChange={(data) => updateTabData(tab.id, data)} />;
      case 'settings':
        return <Settings tabId={tab.id} savedData={tab.data} onDataChange={(data) => updateTabData(tab.id, data)} />;
      default:
        return null;
    }
  };

  const renderTabContent = (tab: Tab) => {
    if (tab.type === 'split' && tab.splitTabs) {
      const [leftTabId, rightTabId] = tab.splitTabs;
      const leftTab = tabs.find(t => t.id === leftTabId);
      const rightTab = tabs.find(t => t.id === rightTabId);

      return (
        <div className="flex h-full divide-x divide-gray-200" data-tutorial="split-view-demo">
          <div className="flex-1 overflow-hidden">
            {leftTab && renderSingleTabContent(leftTab)}
          </div>
          <div className="flex-1 overflow-hidden">
            {rightTab && renderSingleTabContent(rightTab)}
          </div>
        </div>
      );
    }

    return renderSingleTabContent(tab);
  };

  const groupedTabs = tabs.reduce((acc, tab) => {
    if (tab.type === 'split') {
      if (!acc['split']) acc['split'] = [];
      acc['split'].push(tab);
    } else {
      if (!acc[tab.type]) acc[tab.type] = [];
      acc[tab.type].push(tab);
    }
    return acc;
  }, {} as { [key: string]: Tab[] });

  const availableTabsForSplit = tabs.filter(t => 
    t.type !== 'split' && t.id !== contextMenu?.tabId
  );

  // Group tools by category
  const regularTools = tools.filter(t => !t.group && t.type !== 'settings');
  const lessonPlannerTools = tools.filter(t => t.group === 'lesson-planners');
  const otherGroupedTools = tools.filter(t => t.group === 'tools');
  const settingsTool = tools.find(t => t.type === 'settings');

  return (
    <div
      className="flex h-screen bg-gray-50"
      onClick={() => setContextMenu(null)}
      style={{ fontSize: `${settings.fontSize}%` }}
    >
      {/* Context Menu */}
      {contextMenu && (
        <div
          data-tutorial="split-context-menu"
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.groupType ? (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Group Actions</div>
              <button
                onClick={() => closeGroupTabs(contextMenu.groupType!)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Close all {tools.find(t => t.type === contextMenu.groupType)?.name} tabs</span>
              </button>
            </>
          ) : (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Split with...</div>
              {availableTabsForSplit.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-400">No other tabs available</div>
              ) : (
                availableTabsForSplit.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleSplitWithTab(tab.id)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Columns className="w-4 h-4" />
                    <span>{tab.title}</span>
                  </button>
                ))
              )}
            </>
          )}
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} overflow-hidden relative flex flex-col`}
        style={{
          backgroundColor: settings.sidebarColor,
          color: sidebarIsDark ? '#ffffff' : '#1f2937'
        }}
        data-tutorial="main-sidebar"
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div
          className="p-4 border-b"
          style={{
            borderColor: sidebarIsDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex items-center justify-center">
            {sidebarOpen ? (
              <div>
                <h2 className="text-xl font-bold whitespace-nowrap">OECS Learning Hub</h2>
                <p
                  className="text-sm whitespace-nowrap"
                  style={{ color: sidebarIsDark ? '#9ca3af' : '#6b7280' }}
                >
                  {user.name}
                </p>
              </div>
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          <h3
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: sidebarIsDark ? '#9ca3af' : '#6b7280' }}
          >
            Tools
          </h3>
          
          {/* Regular Tools */}
          {regularTools.map((tool) => {
            const Icon = iconMap[tool.icon];
            const count = getTabCountByType(tool.type);
            const activeTab = tabs.find(t => t.id === activeTabId);
            const isActiveToolType = activeTab?.type === tool.type;
            const toolColor = settings.tabColors[tool.type as keyof typeof settings.tabColors];
            
            return (
              <button
                key={tool.id}
                onClick={() => openTool(tool)}
                disabled={count >= MAX_TABS_PER_TYPE}
                data-tutorial={
                  tool.type === 'analytics'
                    ? 'tool-analytics'
                    : tool.type === 'chat'
                    ? 'tool-chat'
                    : undefined
                }
                className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} rounded-lg transition group ${
                  count >= MAX_TABS_PER_TYPE
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                title={!sidebarOpen ? `${tool.name} (${count}/${MAX_TABS_PER_TYPE} open)` : ''}
                style={
                  count < MAX_TABS_PER_TYPE
                    ? {
                        backgroundColor: 'transparent',
                        transition: 'background-color 0.2s'
                      }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (count < MAX_TABS_PER_TYPE) {
                    e.currentTarget.style.backgroundColor = sidebarIsDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (count < MAX_TABS_PER_TYPE) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActiveToolType ? 'icon-glow' : ''
                  }`}
                  style={
                    isActiveToolType && toolColor
                      ? { color: toolColor }
                      : { color: sidebarIsDark ? '#9ca3af' : '#6b7280' }
                  }
                />
                {sidebarOpen && (
                  <div className="flex-1 text-left overflow-hidden">
                    <p 
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      style={{
                        maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
                      }}
                    >
                      {tool.name}
                    </p>
                    {tool.type !== 'analytics' && (
                      <p
                        className="text-xs whitespace-nowrap"
                        style={{ color: sidebarIsDark ? '#9ca3af' : '#6b7280' }}
                      >
                        {count}/{MAX_TABS_PER_TYPE} open
                      </p>
                    )}
                  </div>
                )}
              </button>
            );
          })}

          {/* Other Grouped Tools */}
          {otherGroupedTools.map((tool) => {
            const Icon = iconMap[tool.icon];
            const count = getTabCountByType(tool.type);
            const activeTab = tabs.find(t => t.id === activeTabId);
            const isActiveToolType = activeTab?.type === tool.type;
            const toolColor = settings.tabColors[tool.type as keyof typeof settings.tabColors];
            
            return (
              <button
                key={tool.id}
                onClick={() => openTool(tool)}
                disabled={count >= MAX_TABS_PER_TYPE}
                data-tutorial={
                  tool.type === 'quiz-generator'
                    ? 'tool-quiz'
                    : tool.type === 'rubric-generator'
                    ? 'tool-rubric'
                    : undefined
                }
                className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} rounded-lg transition group ${
                  count >= MAX_TABS_PER_TYPE
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                title={!sidebarOpen ? `${tool.name} (${count}/${MAX_TABS_PER_TYPE} open)` : ''}
                style={{
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (count < MAX_TABS_PER_TYPE) {
                    e.currentTarget.style.backgroundColor = sidebarIsDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (count < MAX_TABS_PER_TYPE) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActiveToolType ? 'icon-glow' : ''
                  }`}
                  style={
                    isActiveToolType && toolColor
                      ? { color: toolColor }
                      : { color: sidebarIsDark ? '#9ca3af' : '#6b7280' }
                  }
                />
                {sidebarOpen && (
                  <div className="flex-1 text-left overflow-hidden">
                    <p 
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      style={{
                        maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
                      }}
                    >
                      {tool.name}
                    </p>
                    <p
                      className="text-xs whitespace-nowrap"
                      style={{ color: sidebarIsDark ? '#9ca3af' : '#6b7280' }}
                    >
                      {count}/{MAX_TABS_PER_TYPE} open
                    </p>
                  </div>
                )}
              </button>
            );
          })}

          {/* Lesson Planners Dropdown */}
          <div className="mt-4" data-tutorial="lesson-planners-group">
            <button
              onClick={() => setLessonPlannerExpanded(!lessonPlannerExpanded)}
              data-tutorial-click="lesson-planners-group"
              className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} rounded-lg transition`}
              style={{
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = sidebarIsDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <BookOpen
                className="w-5 h-5 flex-shrink-0"
                style={{ color: sidebarIsDark ? '#9ca3af' : '#6b7280' }}
              />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left text-sm font-medium">Lesson Planners</span>
                  {lessonPlannerExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </>
              )}
            </button>

            {lessonPlannerExpanded && sidebarOpen && (
              <div
                className="ml-4 mt-2 space-y-1 border-l-2 pl-2"
                style={{
                  borderColor: sidebarIsDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                }}
              >
                {lessonPlannerTools.map((tool) => {
                  const Icon = iconMap[tool.icon];
                  const count = getTabCountByType(tool.type);
                  const activeTab = tabs.find(t => t.id === activeTabId);
                  const isActiveToolType = activeTab?.type === tool.type;
                  const toolColor = settings.tabColors[tool.type as keyof typeof settings.tabColors];
                  
                  return (
                    <button
                      key={tool.id}
                      onClick={() => openTool(tool)}
                      disabled={count >= MAX_TABS_PER_TYPE}
                      className={`w-full flex items-center space-x-2 p-2 rounded-lg transition text-sm ${
                        count >= MAX_TABS_PER_TYPE
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      style={{
                        backgroundColor: 'transparent',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (count < MAX_TABS_PER_TYPE) {
                          e.currentTarget.style.backgroundColor = sidebarIsDark
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (count < MAX_TABS_PER_TYPE) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActiveToolType ? 'icon-glow' : ''
                        }`}
                        style={
                          isActiveToolType && toolColor
                            ? { color: toolColor }
                            : { color: sidebarIsDark ? '#9ca3af' : '#6b7280' }
                        }
                      />
                      <div className="flex-1 text-left overflow-hidden">
                        <p className="text-xs font-medium whitespace-nowrap overflow-hidden"
                           style={{
                             maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                             WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
                           }}>
                          {tool.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: sidebarIsDark ? '#9ca3af' : '#6b7280' }}
                        >
                          {count}/{MAX_TABS_PER_TYPE}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Settings Tool */}
          {settingsTool && (
            <div className="mt-4">
              {(() => {
                const Icon = iconMap[settingsTool.icon];
                const activeTab = tabs.find(t => t.id === activeTabId);
                const isActiveToolType = activeTab?.type === settingsTool.type;
                
                return (
                  <button
                    onClick={() => openTool(settingsTool)}
                    className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} rounded-lg transition group`}
                    title={!sidebarOpen ? settingsTool.name : ''}
                    style={{
                      backgroundColor: 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = sidebarIsDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActiveToolType ? 'icon-glow' : ''
                      }`}
                      style={
                        isActiveToolType
                          ? { color: '#64748b' }
                          : { color: sidebarIsDark ? '#9ca3af' : '#6b7280' }
                      }
                    />
                    {sidebarOpen && (
                      <div className="flex-1 text-left overflow-hidden">
                        <p
                          className="text-sm font-medium whitespace-nowrap overflow-hidden"
                          style={{
                            maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
                          }}
                        >
                          {settingsTool.name}
                        </p>
                      </div>
                    )}
                  </button>
                );
              })()}
            </div>
          )}
        </div>

        {sidebarOpen && (
          <div
            className="p-4 border-t"
            style={{
              borderColor: sidebarIsDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
            }}
          >
            <button
              onClick={onLogout}
              className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} rounded-lg transition text-red-400 hover:text-red-300`}
              title={!sidebarOpen ? 'Logout' : ''}
              style={{
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = sidebarIsDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          {/* Tabs on the left */}
          <div className="flex-1 flex items-center space-x-2 overflow-x-auto scrollbar-hide" data-tutorial="tab-bar">
            {Object.entries(groupedTabs).map(([type, groupTabs]) => {
              const isCollapsed = collapsedGroups.has(type);
              const activeInGroup = groupTabs.find(t => t.id === activeTabId);
              const colors = tabColors[type] || tabColors['split'];
              
              if (groupTabs.length === 1) {
                const tab = groupTabs[0];
                const isActive = activeTabId === tab.id;
                return (
                  <div
                    key={tab.id}
                    data-tutorial={isActive ? "single-tab-demo" : undefined}
                    data-tab-type={tab.type}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition border-l-4 ${
                      isActive ? 'text-white' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{
                      borderLeftColor: colors.border,
                      backgroundColor: isActive ? colors.activeBg : colors.bg
                    }}
                    onClick={() => setActiveTabId(tab.id)}
                    onContextMenu={(e) => tab.type !== 'split' && handleTabContextMenu(e, tab.id)}
                    title="Right-click to split"
                  >
                    {tab.type === 'split' && <Columns className="w-3 h-3" />}
                    <span className="text-sm font-medium whitespace-nowrap">{tab.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                      className="hover:bg-white/50 rounded p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              }

              return (
                <div key={type} className="flex items-center gap-1" data-tutorial="tab-groups">
                  <button
                    onClick={() => toggleGroupCollapse(type)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setContextMenu({ groupType: type, x: e.clientX, y: e.clientY });
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition border-l-4 ${
                      activeInGroup ? 'text-white' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{
                      borderLeftColor: colors.border,
                      backgroundColor: activeInGroup ? colors.activeBg : colors.bg
                    }}
                    title="Right-click for options"
                  >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span className="text-sm font-medium whitespace-nowrap">
                      {tools.find(t => t.type === type)?.name}
                    </span>
                  </button>

                  {!isCollapsed && groupTabs.map(tab => {
                    const isTabActive = activeTabId === tab.id;
                    return (
                      <div
                        key={tab.id}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition relative ${
                          isTabActive ? 'text-white' : 'text-gray-700 hover:bg-gray-200'
                        }`}
                        style={{
                          backgroundColor: isTabActive ? colors.activeBg : colors.bg,
                          maxWidth: '200px'
                        }}
                        onClick={() => setActiveTabId(tab.id)}
                        onContextMenu={(e) => handleTabContextMenu(e, tab.id)}
                      >
                        <span
                          className="text-sm whitespace-nowrap overflow-hidden relative"
                          style={{
                            maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
                          }}
                        >
                          {tab.title}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            closeTab(tab.id);
                          }}
                          className="hover:bg-white/20 rounded p-1 flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Close All Tabs Button on the right */}
          {tabs.length > 0 && (
            <button
              onClick={() => {
                setTabs([]);
                setActiveTabId(null);
                localStorage.removeItem('dashboard-tabs');
                localStorage.removeItem('dashboard-active-tab');
              }}
              data-tutorial="close-all-tabs"
              className="p-2 rounded-lg hover:bg-red-50 transition group ml-4 flex-shrink-0"
              title="Close All Tabs"
            >
              <X className="w-5 h-5 text-red-600 group-hover:text-red-700" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div
          className="flex-1 overflow-hidden relative"
          onClick={() => setSidebarOpen(false)}
          data-tutorial="main-content"
        >
          {tabs.length > 0 ? (
            <>
              {tabs.map(tab => (
                <div 
                  key={tab.id}
                  className="absolute inset-0"
                  style={{
                    zIndex: activeTabId === tab.id ? 10 : 0,
                    visibility: activeTabId === tab.id ? 'visible' : 'hidden',
                    pointerEvents: activeTabId === tab.id ? 'auto' : 'none'
                  }}
                >
                  {renderTabContent(tab)}
                </div>
              ))}
            </>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No tools open</h3>
                <p className="text-gray-500">Select a tool from the sidebar to get started</p>
                <p className="text-sm text-gray-400 mt-2">Tip: Right-click on tabs to split them side-by-side</p>
              </div>
            </div>
          )}
          
        </div>
      </div> 

      {/* First-time Dashboard Tutorial */}
      <TutorialOverlay
        steps={dashboardWalkthroughSteps}
        onComplete={handleTutorialComplete}
        autoStart={showFirstTimeTutorial}
        showFloatingButton={tabs.length === 0}
        onStepChange={(step) => {
          // Step 6 is the lesson planner dropdown (0-indexed, so step 14 is the 15th step)
          if (step === 14) {
            setSidebarOpen(true); // Force sidebar open for lesson planner step
          }
        }}
      />
    </div>
  );
};

export default Dashboard;