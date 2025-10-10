import React, { useState, useEffect } from 'react';
import { Menu, X, MessageSquare, ClipboardCheck, BookOpen, FileText, LogOut, Plus, Columns, ChevronDown, ChevronRight, GraduationCap, ListChecks, BookMarked, School, Users } from 'lucide-react';
import { User, Tab, Tool } from '../types';
import Chat from './Chat';
import LessonPlanner from './LessonPlanner';
import CurriculumViewer from './CurriculumViewer';
import QuizGenerator from './QuizGenerator';
import RubricGenerator from './RubricGenerator';
import MultigradePlanner from './MultigradePlanner';
import KindergartenPlanner from './KindergartenPlanner';
import CrossCurricularPlanner from './CrossCurricularPlanner';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const tools: Tool[] = [
  {
    id: 'chat',
    name: 'Chat with AI',
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
  Users
};

const MAX_TABS_PER_TYPE = 3;

const tabColors: { [key: string]: { border: string; bg: string; activeBg: string } } = {
  'chat': { 
    border: 'border-blue-500', 
    bg: 'bg-blue-50', 
    activeBg: 'bg-blue-600' 
  },
  'curriculum': { 
    border: 'border-green-500', 
    bg: 'bg-green-50', 
    activeBg: 'bg-green-600' 
  },
  'lesson-planner': { 
    border: 'border-purple-500', 
    bg: 'bg-purple-50', 
    activeBg: 'bg-purple-600' 
  },
  'kindergarten-planner': { 
    border: 'border-pink-500', 
    bg: 'bg-pink-50', 
    activeBg: 'bg-pink-600' 
  },
  'multigrade-planner': { 
    border: 'border-indigo-500', 
    bg: 'bg-indigo-50', 
    activeBg: 'bg-indigo-600' 
  },
  'cross-curricular-planner': { 
    border: 'border-teal-500', 
    bg: 'bg-teal-50', 
    activeBg: 'bg-teal-600' 
  },
  'grader': { 
    border: 'border-orange-500', 
    bg: 'bg-orange-50', 
    activeBg: 'bg-orange-600' 
  },
  'quiz-generator': { 
    border: 'border-cyan-500', 
    bg: 'bg-cyan-50', 
    activeBg: 'bg-cyan-600' 
  },
  'rubric-generator': { 
    border: 'border-amber-500', 
    bg: 'bg-amber-50', 
    activeBg: 'bg-amber-600' 
  },
  'split': { 
    border: 'border-gray-400', 
    bg: 'bg-gray-50', 
    activeBg: 'bg-gray-600' 
  }
};

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ tabId?: string; groupType?: string; x: number; y: number } | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [lessonPlannerExpanded, setLessonPlannerExpanded] = useState(false);

  const getTabCountByType = (type: string) => {
    return tabs.filter(tab => tab.type === type && tab.type !== 'split').length;
  };

  const openTool = (tool: Tool) => {
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
    setContextMenu({ tabId, x: e.clientX, y: e.clientY });
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

  const renderSingleTabContent = (tab: Tab) => {
    switch (tab.type) {
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
      case 'lesson-planner':
        return <LessonPlanner tabId={tab.id} savedData={tab.data} onDataChange={(data) => updateTabData(tab.id, data)} />;
      case 'kindergarten-planner':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Kindergarten Lesson Planner</h2>
            <p className="text-gray-600">Coming soon - AI-powered kindergarten lesson planning...</p>
          </div>
        );
      case 'multigrade-planner':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Multigrade Lesson Planner</h2>
            <p className="text-gray-600">Coming soon - Design lessons for multiple grade levels...</p>
          </div>
        );
      case 'cross-curricular-planner':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cross-Curricular Planner</h2>
            <p className="text-gray-600">Coming soon - Create integrated subject lesson plans...</p>
          </div>
        );
      case 'quiz-generator':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Generator</h2>
            <p className="text-gray-600">Coming soon - Generate customized quizzes...</p>
          </div>
        );
      case 'rubric-generator':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rubric Generator</h2>
            <p className="text-gray-600">Coming soon - Create detailed grading rubrics...</p>
          </div>
        );
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
        <div className="flex h-full divide-x divide-gray-200">
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
  const regularTools = tools.filter(t => !t.group);
  const lessonPlannerTools = tools.filter(t => t.group === 'lesson-planners');
  const otherGroupedTools = tools.filter(t => t.group === 'tools');

  return (
    <div className="flex h-screen bg-gray-50" onClick={() => setContextMenu(null)}>
      {/* Context Menu */}
      {contextMenu && (
        <div
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
        className={`bg-gray-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} overflow-hidden relative flex flex-col`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-center">
            {sidebarOpen ? (
              <div>
                <h2 className="text-xl font-bold whitespace-nowrap">OLH Innovative Tools</h2>
                <p className="text-sm text-gray-400 whitespace-nowrap">{user.name}</p>
              </div>
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Tools
          </h3>
          
          {/* Regular Tools */}
          {regularTools.map((tool) => {
            const Icon = iconMap[tool.icon];
            const count = getTabCountByType(tool.type);
            const activeTab = tabs.find(t => t.id === activeTabId);
            const isActiveToolType = activeTab?.type === tool.type;
            
            return (
              <button
                key={tool.id}
                onClick={() => openTool(tool)}
                disabled={count >= MAX_TABS_PER_TYPE}
                className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} rounded-lg transition group ${
                  count >= MAX_TABS_PER_TYPE 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-800'
                }`}
                title={!sidebarOpen ? `${tool.name} (${count}/${MAX_TABS_PER_TYPE} open)` : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${
                  isActiveToolType 
                    ? 'text-blue-400 icon-glow' 
                    : 'text-gray-400 group-hover:text-white'
                }`} />
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
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {count}/{MAX_TABS_PER_TYPE} open
                    </p>
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
            
            return (
              <button
                key={tool.id}
                onClick={() => openTool(tool)}
                disabled={count >= MAX_TABS_PER_TYPE}
                className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} rounded-lg transition group ${
                  count >= MAX_TABS_PER_TYPE 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-800'
                }`}
                title={!sidebarOpen ? `${tool.name} (${count}/${MAX_TABS_PER_TYPE} open)` : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${
                  isActiveToolType 
                    ? 'text-blue-400 icon-glow' 
                    : 'text-gray-400 group-hover:text-white'
                }`} />
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
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {count}/{MAX_TABS_PER_TYPE} open
                    </p>
                  </div>
                )}
              </button>
            );
          })}

          {/* Lesson Planners Dropdown */}
          <div className="mt-4">
            <button
              onClick={() => setLessonPlannerExpanded(!lessonPlannerExpanded)}
              className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} rounded-lg transition hover:bg-gray-800`}
            >
              <BookOpen className="w-5 h-5 flex-shrink-0 text-gray-400" />
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
              <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-700 pl-2">
                {lessonPlannerTools.map((tool) => {
                  const Icon = iconMap[tool.icon];
                  const count = getTabCountByType(tool.type);
                  const activeTab = tabs.find(t => t.id === activeTabId);
                  const isActiveToolType = activeTab?.type === tool.type;
                  
                  return (
                    <button
                      key={tool.id}
                      onClick={() => openTool(tool)}
                      disabled={count >= MAX_TABS_PER_TYPE}
                      className={`w-full flex items-center space-x-2 p-2 rounded-lg transition text-sm ${
                        count >= MAX_TABS_PER_TYPE 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${
                        isActiveToolType 
                          ? 'text-blue-400 icon-glow' 
                          : 'text-gray-400 group-hover:text-white'
                      }`} />
                      <div className="flex-1 text-left overflow-hidden">
                        <p className="text-xs font-medium whitespace-nowrap overflow-hidden"
                           style={{
                             maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                             WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
                           }}>
                          {tool.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {count}/{MAX_TABS_PER_TYPE}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {sidebarOpen && (
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={onLogout}
              className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} rounded-lg hover:bg-gray-800 transition text-red-400 hover:text-red-300`}
              title={!sidebarOpen ? 'Logout' : ''}
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
          <div className="flex-1 flex items-center space-x-2 ml-4 overflow-x-auto scrollbar-hide">
            {Object.entries(groupedTabs).map(([type, groupTabs]) => {
              const isCollapsed = collapsedGroups.has(type);
              const activeInGroup = groupTabs.find(t => t.id === activeTabId);
              const colors = tabColors[type] || tabColors['split'];
              
              if (groupTabs.length === 1) {
                const tab = groupTabs[0];
                return (
                  <div
                    key={tab.id}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition border-l-4 ${colors.border} ${
                      activeTabId === tab.id
                        ? `${colors.activeBg} text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
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
                <div key={type} className="flex items-center gap-1">
                  <button
                    onClick={() => toggleGroupCollapse(type)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setContextMenu({ groupType: type, x: e.clientX, y: e.clientY });
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition border-l-4 ${colors.border} ${
                      activeInGroup ? `${colors.activeBg} text-white` : `${colors.bg} text-gray-700 hover:bg-gray-200`
                    }`}
                    title="Right-click for options"
                  >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span className="text-sm font-medium whitespace-nowrap">
                      {tools.find(t => t.type === type)?.name}
                    </span>
                  </button>

                  {!isCollapsed && groupTabs.map(tab => (
                    <div
                      key={tab.id}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition relative ${
                        activeTabId === tab.id
                          ? `${colors.activeBg} text-white`
                          : `${colors.bg} text-gray-700 hover:bg-gray-200`
                      }`}
                      onClick={() => setActiveTabId(tab.id)}
                      onContextMenu={(e) => handleTabContextMenu(e, tab.id)}
                      style={{ maxWidth: '200px' }}
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
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div 
          className="flex-1 overflow-hidden relative"
          onClick={() => setSidebarOpen(false)}
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
    </div>
  );
};

export default Dashboard;