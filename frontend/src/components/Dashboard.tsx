import React, { useState } from 'react';
import { Menu, X, MessageSquare, ClipboardCheck, BookOpen, FileText, LogOut, Plus, Columns } from 'lucide-react';
import { User, Tab, Tool } from '../types';
import Chat from './Chat';

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
    id: 'grader',
    name: 'Grader AI',
    icon: 'ClipboardCheck',
    type: 'grader',
    description: 'Automated grading assistant'
  },
  {
    id: 'lesson-planner',
    name: 'Lesson Planner',
    icon: 'BookOpen',
    type: 'lesson-planner',
    description: 'Create comprehensive lesson plans'
  },
  {
    id: 'rubric-generator',
    name: 'Rubric Generator',
    icon: 'FileText',
    type: 'rubric-generator',
    description: 'Generate grading rubrics'
  }
];

const iconMap: { [key: string]: any } = {
  MessageSquare,
  ClipboardCheck,
  BookOpen,
  FileText
};

const MAX_TABS_PER_TYPE = 4;

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ tabId: string; x: number; y: number } | null>(null);

  const getTabCountByType = (type: string) => {
    return tabs.filter(tab => {
      if (tab.type === 'split' && tab.splitTabs) {
        // Count split tabs based on their child tabs
        const childTabs = tabs.filter(t => tab.splitTabs?.includes(t.id));
        return childTabs.some(t => t.type === type);
      }
      return tab.type === type;
    }).length;
  };

  const openTool = (tool: Tool) => {
    // Check if we already have 4 tabs of this type
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
      // Unsplit: restore the two tabs separately
      const [leftTabId, rightTabId] = tabToClose.splitTabs;
      const updatedTabs = tabs.filter(tab => tab.id !== tabId);
      setTabs(updatedTabs);
      
      // Set the first child tab as active
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
      createSplitTab(contextMenu.tabId, targetTabId);
    }
  };

  const updateTabData = (tabId: string, data: any) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, data: { ...tab.data, ...data } } : tab
    ));
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

  const renderSingleTabContent = (tab: Tab) => {
    switch (tab.type) {
      case 'chat':
        return <Chat tabId={tab.id} savedData={tab.data} onDataChange={(data) => updateTabData(tab.id, data)} />;
      case 'grader':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Grader AI</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      case 'lesson-planner':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Lesson Planner</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      case 'rubric-generator':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rubric Generator</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Get non-split tabs for the context menu
  const availableTabsForSplit = tabs.filter(t => 
    t.type !== 'split' && t.id !== contextMenu?.tabId
  );

  return (
    <div className="flex h-screen bg-gray-50" onClick={() => setContextMenu(null)}>
      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
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
        </div>
      )}

{/* Sidebar */}
      <div className={`bg-gray-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden relative flex flex-col`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="text-xl font-bold">AI Education</h2>
                <p className="text-sm text-gray-400">{user.name}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Tools
          </h3>
          {tools.map((tool) => {
            const Icon = iconMap[tool.icon];
            const count = getTabCountByType(tool.type);
            return (
              <button
                key={tool.id}
                onClick={() => openTool(tool)}
                disabled={count >= MAX_TABS_PER_TYPE}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition group ${
                  count >= MAX_TABS_PER_TYPE 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{tool.name}</p>
                  <p className="text-xs text-gray-400">
                    {count}/{MAX_TABS_PER_TYPE} open
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {sidebarOpen && (
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition text-red-400 hover:text-red-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Tabs */}
          <div className="flex-1 flex items-center space-x-2 ml-4 overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition ${
                  activeTabId === tab.id
                    ? 'bg-blue-100 text-blue-700'
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
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTabId ? (
            <div className="h-full">
              {tabs.find(tab => tab.id === activeTabId) && 
                renderTabContent(tabs.find(tab => tab.id === activeTabId)!)}
            </div>
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