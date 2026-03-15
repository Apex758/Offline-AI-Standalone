import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
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
  Settings as SettingsIcon,
  Target,
  FileSpreadsheet,
  Palette,
  Bell,
  LayoutDashboard,
  TrendingUp,
  FolderOpen,
  Search,
  PenTool,
  ClipboardList,
  UsersRound,
  Baby,
  Layers,
  Merge,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

import { User, Tab, Tool, SplitViewState, Resource } from '../types';
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
import CurriculumTracker from './CurriculumTracker';
import WorksheetGenerator from './WorksheetGenerator';
import ImageStudio from './ImageStudio';
import ClassManagement from './ClassManagement';
import SupportReporting from './SupportReporting';
import TutorialOverlay, { dashboardWalkthroughSteps } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import WelcomeModal from './WelcomeModal';
import { useSettings } from '../contexts/SettingsContext';
import { generateColorVariants } from '../lib/utils';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import { useTutorials } from '../contexts/TutorialContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useNotification } from '../contexts/NotificationContext';
import { useQueue } from '../contexts/QueueContext';
import NotificationPanel from './NotificationPanel';
import CommandPalette from './CommandPalette';
import { SearchEntry } from '../data/searchIndex';
import '../styles/edge-tabs.css';
import { TrapezoidTabShape, TAB_W, TAB_H, TAB_OVERLAP, TAB_EXTEND } from './layout/trapezoid-tabs';
import Grainient from './Grainient';
import Galaxy from './Galaxy';


interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const tools: Tool[] = [
  {
    id: 'analytics',
    name: 'My Overview',
    icon: 'LayoutDashboard',
    type: 'analytics',
    description: 'View your teaching analytics and quick access'
  },
  {
    id: 'curriculum-tracker',
    name: 'Progress Tracker',
    icon: 'TrendingUp',
    type: 'curriculum-tracker',
    description: 'Monitor your curriculum progress'
  },
  {
    id: 'resource-manager',
    name: 'My Resources',
    icon: 'FolderOpen',
    type: 'resource-manager',
    description: 'View, edit, and manage all your saved resources'
  },
  {
    id: 'chat',
    name: 'Ask PEARL',
    icon: 'MessageSquare',
    type: 'chat',
    description: 'Have a conversation with the AI assistant'
  },
  {
    id: 'curriculum',
    name: 'Curriculum Browser',
    icon: 'Search',
    type: 'curriculum',
    description: 'Browse OECS curriculum content'
  },
  {
    id: 'quiz-generator',
    name: 'Quiz Builder',
    icon: 'PenTool',
    type: 'quiz-generator',
    description: 'Build customized quizzes',
    group: 'tools'
  },
  {
    id: 'rubric-generator',
    name: 'Rubric Builder',
    icon: 'ClipboardList',
    type: 'rubric-generator',
    description: 'Build grading rubrics',
    group: 'tools'
  },
  {
    id: 'class-management',
    name: 'My Classes',
    icon: 'UsersRound',
    type: 'class-management',
    description: 'Manage students, classes, and quiz grades',
    group: 'tools'
  },
  // Lesson Planner Group
  {
    id: 'lesson-planner',
    name: 'Lesson Plan',
    icon: 'BookMarked',
    type: 'lesson-planner',
    description: 'Create comprehensive lesson plans',
    group: 'lesson-planners'
  },
  {
    id: 'kindergarten-planner',
    name: 'Early Childhood',
    icon: 'Baby',
    type: 'kindergarten-planner',
    description: 'Early childhood lesson plans',
    group: 'lesson-planners'
  },
  {
    id: 'multigrade-planner',
    name: 'Multi-Level',
    icon: 'Layers',
    type: 'multigrade-planner',
    description: 'Plans for multiple grade levels',
    group: 'lesson-planners'
  },
  {
    id: 'cross-curricular-planner',
    name: 'Integrated Lesson',
    icon: 'Merge',
    type: 'cross-curricular-planner',
    description: 'Integrated subject lesson plans',
    group: 'lesson-planners'
  },
  {
    id: 'support',
    name: 'Support & Reporting',
    icon: 'HelpCircle',
    type: 'support',
    description: 'FAQ help center and issue reporting'
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    type: 'settings',
    description: 'Application settings'
  },
  // Visual Studio Group
  {
    id: 'worksheet-generator',
    name: 'Worksheet Builder',
    icon: 'FileSpreadsheet',
    type: 'worksheet-generator',
    description: 'Build custom worksheets',
    group: 'visual-studio'
  },
  {
    id: 'image-studio',
    name: 'Image Studio',
    icon: 'Palette',
    type: 'image-studio',
    description: 'Create and edit images',
    group: 'visual-studio'
  }
];

const iconMap: { [key: string]: React.ElementType } = {
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
  Settings: SettingsIcon,
  Target,
  FileSpreadsheet,
  Palette,
  LayoutDashboard,
  TrendingUp,
  FolderOpen,
  Search,
  PenTool,
  ClipboardList,
  UsersRound,
  Baby,
  Layers,
  Merge,
  HelpCircle,
  AlertTriangle
};

const WELCOME_TIPS = [
  'Right-click on tabs to split them side-by-side',
  'Use Ctrl+K to open the command palette',
  'Drag tabs to reorder them in the toolbar',
  'Ask PEARL can help you plan lessons instantly',
  'Build worksheets tailored to any grade level',
  'Track curriculum coverage from My Overview',
  'Use the Rubric Builder to create assessment criteria',
  'The Curriculum Browser covers all OECS subject areas',
  'Create multi-level lesson plans for combined classes',
  'Export your lesson plans and worksheets as PDFs',
  'Use the Image Studio to create visual aids for lessons',
  'Manage your classes and student groups from My Classes',
  'The Quiz Builder supports multiple question types',
  'Pin your most-used tools for quick access',
  'Keyboard shortcuts make navigation faster — try them out',
];

const RotatingTip = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * WELCOME_TIPS.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % WELCOME_TIPS.length);
        setVisible(true);
      }, 400);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className="text-xs transition-opacity duration-400"
      style={{
        color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(29,54,45,0.4)',
        opacity: visible ? 1 : 0,
      }}
    >
      Tip: {WELCOME_TIPS[index]}
    </p>
  );
};

const MAX_TABS_PER_TYPE = 3;
const SINGLE_INSTANCE_TABS = new Set(['worksheet-generator', 'image-studio', 'class-management', 'support']);

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const { settings, markTutorialComplete, setWelcomeSeen, isTutorialCompleted } = useSettings();
  // Import the real tutorial context at the top level
  const { startTutorial } = useTutorials();
  const { closeConnection, getIsTabBusy, getActiveStreams } = useWebSocket();
  const { unreadCount } = useNotification();
  const { queue } = useQueue();
  const activeStreams = getActiveStreams();
  const queuedTabEndpoints = new Set(
    queue.filter(item => item.status === 'generating').map(item => `${item.tabId}::${item.endpoint}`)
  );
  const directStreamCount = activeStreams.filter(s => !queuedTabEndpoints.has(`${s.tabId}::${s.endpoint}`)).length;
  const queueActiveCount = queue.filter(item => item.status === 'waiting' || item.status === 'generating').length + directStreamCount;
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Ctrl+K / Cmd+K to open command palette
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleCommandPaletteNavigate = (entry: SearchEntry) => {
    // Handle direct actions
    if (entry.action) {
      switch (entry.action) {
        case 'toggleSplitView':
          toggleSplitView();
          return;
        case 'toggleNotifications':
          setNotifPanelOpen(prev => !prev);
          return;
        case 'closeAllTabs':
          setSplitView({ isActive: false, leftTabId: null, rightTabId: null, activePaneId: 'left' });
          setTabs([]);
          setActiveTabId(null);
          localStorage.removeItem('dashboard-tabs');
          localStorage.removeItem('dashboard-active-tab');
          localStorage.removeItem('dashboard-split-view');
          return;
      }
    }

    // Handle tool navigation
    if (entry.toolType) {
      const tool = tools.find(t => t.type === entry.toolType);
      if (tool) {
        openTool(tool);

        // If navigating to a settings section, scroll to it after the tab renders
        if (entry.settingsSection) {
          const sectionId = entry.settingsSection;
          setTimeout(() => {
            const el = document.querySelector(`[data-tutorial="${sectionId}"]`) ||
                       document.querySelector(`[data-search-section="${sectionId}"]`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // Flash highlight
              el.classList.add('search-highlight-flash');
              setTimeout(() => el.classList.remove('search-highlight-flash'), 2000);
            }
          }, 300);
        }
      }
    }
  };

  // Generate dynamic tab colors based on settings
  const tabColors = useMemo(() => {
    const colors: { [key: string]: { border: string; bg: string; activeBg: string } } = {};
    
    // Generate colors for each tab type from settings
    Object.entries(settings.tabColors).forEach(([type, hexColor]) => {
      const variants = generateColorVariants(hexColor);
      colors[type] = variants;
    });
    
    // Add default color for settings
    colors['settings'] = generateColorVariants('#64748b'); // slate-500

    // Add default colors for support & reporting
    if (!colors['support']) colors['support'] = generateColorVariants('#3b82f6'); // blue-500

    return colors;
  }, [settings.tabColors]);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [splitView, setSplitView] = useState<SplitViewState>({
    isActive: false,
    leftTabId: null,
    rightTabId: null,
    activePaneId: 'left'
  });
  const [contextMenu, setContextMenu] = useState<{ tabId?: string; groupType?: string; x: number; y: number } | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [lessonPlannerExpanded, setLessonPlannerExpanded] = useState(false);
  const [visualStudioExpanded, setVisualStudioExpanded] = useState(false);
  const [showFirstTimeTutorial, setShowFirstTimeTutorial] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showResourceManagerTutorial, setShowResourceManagerTutorial] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [bouncingTabId, setBouncingTabId] = useState<string | null>(null);
  const [hoveringTabId, setHoveringTabId] = useState<string | null>(null);
  const [animatingGroups, setAnimatingGroups] = useState<Set<string>>(new Set());
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking anywhere outside it
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  // Auto-scroll sidebar to the active tool when sidebar opens
  useEffect(() => {
    if (sidebarOpen && activeTabId && sidebarScrollRef.current) {
      const activeTab = tabs.find(t => t.id === activeTabId);
      if (!activeTab) return;
      const el = sidebarScrollRef.current.querySelector(`[data-tool-type="${activeTab.type}"]`) as HTMLElement;
      if (el) {
        // Small delay to let width transition start
        requestAnimationFrame(() => {
          el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
      }
    }
  }, [sidebarOpen, activeTabId, tabs]);

  // Check if user has seen welcome modal on mount
  useEffect(() => {
    if (!settings.tutorials.hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, [settings.tutorials.hasSeenWelcome]);

  const handleTutorialComplete = () => {
    markTutorialComplete(TUTORIAL_IDS.DASHBOARD_MAIN);
    setShowFirstTimeTutorial(false);
  };

  const handleWelcomeStartTour = () => {
    setWelcomeSeen(true);
    setShowWelcomeModal(false);
    setShowFirstTimeTutorial(true);
  };

  const handleWelcomeSkip = () => {
    setWelcomeSeen(true);
    setShowWelcomeModal(false);
  };

  const handleResourceManagerTutorialComplete = () => {
    markTutorialComplete(TUTORIAL_IDS.RESOURCE_MANAGER);
    setShowResourceManagerTutorial(false);
  };

  // Auto-show ResourceManager tutorial when tab becomes active
  useEffect(() => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (
      activeTab?.type === 'resource-manager' &&
      settings.tutorials.tutorialPreferences.autoShowOnFirstUse &&
      !isTutorialCompleted(TUTORIAL_IDS.RESOURCE_MANAGER)
    ) {
      setShowResourceManagerTutorial(true);
    }
  }, [activeTabId, tabs, settings, isTutorialCompleted]);

  // Auto-show dashboard tutorial when no tabs are open
  useEffect(() => {
    if (
      tabs.length === 0 &&
      settings.tutorials.tutorialPreferences.autoShowOnFirstUse &&
      !isTutorialCompleted(TUTORIAL_IDS.DASHBOARD_MAIN)
    ) {
      setShowFirstTimeTutorial(true);
    }
  }, [tabs.length, settings, isTutorialCompleted]);

  // Close Visual Studio tabs when Visual Studio is disabled
  useEffect(() => {
    if (!settings.visualStudioEnabled) {
      const visualStudioTabs = tabs.filter(tab =>
        tab.type === 'worksheet-generator' || tab.type === 'image-studio'
      );
      if (visualStudioTabs.length > 0) {
        const updatedTabs = tabs.filter(tab =>
          tab.type !== 'worksheet-generator' && tab.type !== 'image-studio'
        );
        setTabs(updatedTabs);

        // If the active tab was a Visual Studio tab, switch to another tab or null
        const activeTab = tabs.find(t => t.id === activeTabId);
        if (activeTab && (activeTab.type === 'worksheet-generator' || activeTab.type === 'image-studio')) {
          setActiveTabId(updatedTabs.length > 0 ? updatedTabs[updatedTabs.length - 1].id : null);
        }

        // Close WebSocket connections for Visual Studio tabs
        visualStudioTabs.forEach(tab => {
          const endpoints = [
            '/ws/chat',
            '/ws/lesson-plan',
            '/ws/quiz',
            '/ws/rubric',
            '/ws/kindergarten',
            '/ws/multigrade',
            '/ws/cross-curricular'
          ];

          endpoints.forEach(endpoint => {
            closeConnection(tab.id, endpoint);
          });
        });
      }
    }
  }, [settings.visualStudioEnabled, tabs, activeTabId, closeConnection]);


  const migrateLegacySplitTabs = (savedTabs: Tab[]): Tab[] => {
    const splitTabs = savedTabs.filter(t => t.type === 'split' as any);
    const regularTabs = savedTabs.filter(t => t.type !== 'split' as any);
    
    if (splitTabs.length > 0) {
      const firstSplit = splitTabs[0] as Tab & { splitTabs?: string[] };
      
      if (firstSplit.splitTabs && firstSplit.splitTabs.length === 2) {
        const [leftId, rightId] = firstSplit.splitTabs;
        const leftExists = regularTabs.find(t => t.id === leftId);
        const rightExists = regularTabs.find(t => t.id === rightId);
        
        if (leftExists && rightExists) {
          setSplitView({
            isActive: true,
            leftTabId: leftId,
            rightTabId: rightId,
            activePaneId: 'left'
          });
          
          localStorage.setItem('dashboard-split-view', JSON.stringify({
            isActive: true,
            leftTabId: leftId,
            rightTabId: rightId,
            activePaneId: 'left'
          }));
        }
      }
    }
    
    return regularTabs;
  };

  const getTabCountByType = (type: string) => {
    return tabs.filter(tab => tab.type === type).length;
  };

  const navigateToExistingTab = (tab: Tab) => {
    setActiveTabId(tab.id);
    triggerTabBounce(tab.id);
    // Expand tab group if collapsed
    if (collapsedGroups.has(tab.type)) {
      toggleGroupCollapse(tab.type);
    }
    // Scroll the tab into view
    setTimeout(() => {
      const tabEl = document.querySelector(`[data-tab-id="${tab.id}"]`) ||
                    document.querySelector(`[data-group-type="${tab.type}"]`);
      if (tabEl) {
        tabEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }, 50);
  };

  const openTool = (tool: Tool) => {
    // Single-instance tool types: navigate to existing tab if open
    const singleInstanceTypes = ['analytics', 'curriculum', 'settings', 'curriculum-tracker', 'worksheet-generator', 'image-studio', 'resource-manager', 'support'];
    if (singleInstanceTypes.includes(tool.type)) {
      const existing = tabs.find(tab => tab.type === tool.type);
      if (existing) {
        navigateToExistingTab(existing);
        return;
      }
    }

    // Multi-instance tabs: check max limit
    const maxTabsForTool = SINGLE_INSTANCE_TABS.has(tool.type) ? 1 : MAX_TABS_PER_TYPE;

    const currentCount = getTabCountByType(tool.type);
    if (currentCount >= maxTabsForTool) {
      // Navigate to the first open tab of this type
      const firstTab = tabs.find(t => t.type === tool.type);
      if (firstTab) {
        navigateToExistingTab(firstTab);
      }
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

  // Screenshot & create ticket handler for floating button
  const handleScreenshotTicket = useCallback(async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 1,
        logging: false,
        ignoreElements: (el) => {
          // Ignore the floating button itself to get a clean screenshot
          return el.classList?.contains('z-[9999]') || false;
        }
      });
      const screenshotData = canvas.toDataURL('image/png');

      // Open the support tab flipped to reporting side with the screenshot
      const supportTool = tools.find(t => t.type === 'support');
      if (supportTool) {
        const existingTab = tabs.find(t => t.type === 'support');
        if (existingTab) {
          updateTabData(existingTab.id, { initialScreenshot: screenshotData, flipped: true, reportView: 'create' });
          navigateToExistingTab(existingTab);
        } else {
          const newSupportTab: Tab = {
            id: `support-${Date.now()}`,
            title: supportTool.name,
            type: 'support',
            active: true,
            data: { initialScreenshot: screenshotData, flipped: true, reportView: 'create' }
          };
          setTabs(prev => [...prev, newSupportTab]);
          setActiveTabId(newSupportTab.id);
        }
      }
    } catch (err) {
      // If screenshot capture fails, just open support tab on reporting side
      const supportTool = tools.find(t => t.type === 'support');
      if (supportTool) {
        openTool(supportTool);
      }
    }
  }, [tabs, openTool]);

  const toggleSplitView = () => {
    if (splitView.isActive) {
      setSplitView({
        isActive: false,
        leftTabId: null,
        rightTabId: null,
        activePaneId: 'left'
      });
    } else {
      if (tabs.length < 2) return;
      
      const sortedTabs = [...tabs].sort((a, b) =>
        (b.lastActiveTime || 0) - (a.lastActiveTime || 0)
      );
      
      setSplitView({
        isActive: true,
        leftTabId: sortedTabs[0].id,
        rightTabId: sortedTabs[1].id,
        activePaneId: 'left'
      });
    }
  };

  const closeTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;

    const updatedTabs = tabs.filter(t => t.id !== tabId);
    setTabs(updatedTabs);

    const endpoints = [
      '/ws/chat',
      '/ws/lesson-plan',
      '/ws/quiz',
      '/ws/rubric',
      '/ws/kindergarten',
      '/ws/multigrade',
      '/ws/cross-curricular'
    ];

    endpoints.forEach(endpoint => {
      closeConnection(tabId, endpoint);
    });

    // Debug: Log all open WebSocket keys after closing
    if (window && (window as any).wsDebugListConnections) {
      (window as any).wsDebugListConnections(tabId);
    }

    if (splitView.isActive && (tabId === splitView.leftTabId || tabId === splitView.rightTabId)) {
      if (updatedTabs.length < 2) {
        setSplitView({
          isActive: false,
          leftTabId: null,
          rightTabId: null,
          activePaneId: 'left'
        });
        if (updatedTabs.length > 0) {
          setActiveTabId(updatedTabs[0].id);
        }
      } else {
        const availableTab = updatedTabs.find(t =>
          t.id !== splitView.leftTabId && t.id !== splitView.rightTabId
        );
        
        if (availableTab) {
          if (tabId === splitView.leftTabId) {
            setSplitView(prev => ({ ...prev, leftTabId: availableTab.id }));
          } else {
            setSplitView(prev => ({ ...prev, rightTabId: availableTab.id }));
          }
        }
      }
    } else {
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
    const savedSplitView = localStorage.getItem('dashboard-split-view');
    
    if (savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs);
        const migratedTabs = migrateLegacySplitTabs(parsedTabs);
        setTabs(migratedTabs);
        
        if (savedActiveTabId) {
          setActiveTabId(savedActiveTabId);
        }
        
        // Load split view state
        if (savedSplitView) {
          const parsed = JSON.parse(savedSplitView);
          const leftExists = migratedTabs.find(t => t.id === parsed.leftTabId);
          const rightExists = migratedTabs.find(t => t.id === parsed.rightTabId);
          
          if (leftExists && rightExists) {
            setSplitView(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading saved tabs:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (splitView.isActive) {
      localStorage.setItem('dashboard-split-view', JSON.stringify(splitView));
    } else {
      localStorage.removeItem('dashboard-split-view');
    }
  }, [splitView]);

  useEffect(() => {
    if (tabs.length > 0) {
      // Exclude tab data to prevent localStorage quota exceeded errors
      const tabsToSave = tabs.map(tab => ({ ...tab, data: {} }));
      localStorage.setItem('dashboard-tabs', JSON.stringify(tabsToSave));
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

  // Load user profile image from localStorage
  useEffect(() => {
    const storedImage = localStorage.getItem('user-profile-image');
    if (storedImage) {
      setUserProfileImage(storedImage);
    }
  }, []);

  // Listen for profile image changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedImage = localStorage.getItem('user-profile-image');
      setUserProfileImage(storedImage);
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically since storage event doesn't fire in same tab
    const interval = setInterval(() => {
      const storedImage = localStorage.getItem('user-profile-image');
      if (storedImage !== userProfileImage) {
        setUserProfileImage(storedImage);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [userProfileImage]);

  const updateTabData = (tabId: string, data: Partial<Tab['data']>) => {
    setTabs(tabs.map(tab =>
      tab.id === tabId ? { ...tab, data: { ...tab.data, ...data } } : tab
    ));
  };

  const updateTabTitle = (tabId: string, title: string) => {
    setTabs(tabs.map(tab =>
      tab.id === tabId ? { ...tab, title } : tab
    ));
  };

  const triggerTabBounce = (tabId: string) => {
    setBouncingTabId(tabId);
    setTimeout(() => setBouncingTabId(null), 300); // Remove bounce class after animation
  };

  const toggleGroupCollapse = (type: string) => {
    const newCollapsed = new Set(collapsedGroups);
    const wasCollapsed = newCollapsed.has(type);

    if (wasCollapsed) {
      // Expanding - start with slide-out state, then transition to slide-in
      setAnimatingGroups(prev => new Set(prev).add(type));
      setTimeout(() => {
        newCollapsed.delete(type);
        setCollapsedGroups(newCollapsed);
        // Keep animating state for the expand transition
        setTimeout(() => {
          setAnimatingGroups(prev => {
            const next = new Set(prev);
            next.delete(type);
            return next;
          });
        }, 300);
      }, 10); // Small delay to ensure slide-out state is applied first
    } else {
      // Collapsing - transition to slide-out state
      newCollapsed.add(type);
      setCollapsedGroups(newCollapsed);
      setAnimatingGroups(prev => new Set(prev).add(type));
      // Remove animation class after transition
      setTimeout(() => {
        setAnimatingGroups(prev => {
          const next = new Set(prev);
          next.delete(type);
          return next;
        });
      }, 300);
    }
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


  const handleViewResource = (type: string, resource: Resource) => {
    const typeToToolType: { [key: string]: string } = {
      'lesson': 'lesson-planner',
      'quiz': 'quiz-generator',
      'worksheet': 'worksheet-generator',
      'rubric': 'rubric-generator',
      'kindergarten': 'kindergarten-planner',
      'multigrade': 'multigrade-planner',
      'cross-curricular': 'cross-curricular-planner',
      'images': 'image-studio'
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

    // Create a new tab for viewing the resource
    const newTab: Tab = {
      id: `${tool.type}-${Date.now()}`,
      title: `Viewing: ${resource.title.substring(0, 20)}...`,
      type: tool.type,
      active: true,
      data: {
        formData: resource.formData,
        generatedQuiz: resource.generatedQuiz,
        generatedPlan: resource.generatedPlan,
        generatedWorksheet: resource.generatedWorksheet,
        generatedRubric: resource.generatedRubric,
        parsedQuiz: resource.parsedQuiz,
        parsedWorksheet: resource.parsedWorksheet,
        streamingQuiz: resource.streamingQuiz,
        startInEditMode: false, // View mode
        ...(type === 'images' && { initialTab: 'editor', imageId: resource.id, imageUrl: resource.imageUrl })
      }
    };

    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleEditResource = (type: string, resource: Resource) => {
    const typeToToolType: { [key: string]: string } = {
      'lesson': 'lesson-planner',
      'quiz': 'quiz-generator',
      'worksheet': 'worksheet-generator',
      'rubric': 'rubric-generator',
      'kindergarten': 'kindergarten-planner',
      'multigrade': 'multigrade-planner',
      'cross-curricular': 'cross-curricular-planner',
      'images': 'image-studio'
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

    // Create a new tab for editing the resource
    const newTab: Tab = {
      id: `${tool.type}-${Date.now()}`,
      title: `Editing: ${resource.title.substring(0, 20)}...`,
      type: tool.type,
      active: true,
      data: {
        formData: resource.formData,
        generatedQuiz: resource.generatedQuiz,
        generatedPlan: resource.generatedPlan,
        generatedWorksheet: resource.generatedWorksheet,
        generatedRubric: resource.generatedRubric,
        parsedQuiz: resource.parsedQuiz,
        parsedWorksheet: resource.parsedWorksheet,
        streamingQuiz: resource.streamingQuiz,
        startInEditMode: true, // Edit mode
        ...(type === 'images' && { initialTab: 'editor', imageId: resource.id, imageUrl: resource.imageUrl })
      }
    };

    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const renderSingleTabContent = (tab: Tab) => {
    switch (tab.type) {
      case 'analytics':
        return (
          <>
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
                      type: tool.type as Tool['type'],
                      active: true
                    };
                    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), newTab]);
                    setActiveTabId(newTab.id);
                  }
                }
              }}
              tabColors={Object.fromEntries(
                Object.entries(tabColors).map(([type, colors]) => [type, colors.border])
              )}
            />
            {/* Ensure only the centralized floating button is shown for analytics dashboard */}
            <TutorialOverlay
              steps={tutorials[TUTORIAL_IDS.ANALYTICS]?.steps || []}
              showFloatingButton={false}
              // Add any other required props as needed, e.g. onComplete, autoStart, etc.
            />
          </>
        );
      case 'curriculum-tracker':
        // Lazy import to avoid circular dependency if any
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        // const CurriculumTracker = require('./CurriculumTracker').default;
        // But since it's already imported in the project, just use it:
        
        // eslint-disable-next-line
        return <CurriculumTracker tabId={tab.id} savedData={tab.data} onDataChange={(data) => updateTabData(tab.id, data)} />;
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
      case 'resource-manager':
        return (
          <div className="h-full relative" data-tutorial="resource-welcome">
            <ResourceManager
              tabId={tab.id}
              savedData={tab.data}
              onDataChange={(data) => updateTabData(tab.id, data)}
              onViewResource={handleViewResource}
              onEditResource={handleEditResource}
            />
            
            {/* ResourceManager Tutorial Components */}
            {activeTabId === tab.id && (
              <TutorialOverlay
                steps={tutorials[TUTORIAL_IDS.RESOURCE_MANAGER].steps}
                onComplete={handleResourceManagerTutorialComplete}
                autoStart={showResourceManagerTutorial}
                showFloatingButton={false}
              />
            )}

            {/* Tutorial Button - Always visible when ResourceManager tab exists */}
            {!showResourceManagerTutorial && settings.tutorials.tutorialPreferences.showFloatingButtons && (
              <TutorialButton
                tutorialId={TUTORIAL_IDS.RESOURCE_MANAGER}
                onStartTutorial={() => setShowResourceManagerTutorial(true)}
                onOpenSearch={() => setCommandPaletteOpen(true)}
                onScreenshotTicket={handleScreenshotTicket}
                position="bottom-right"
              />
            )}
          </div>
        );
      case 'lesson-planner':
        return (
          <LessonPlanner
            tabId={tab.id}
            savedData={tab.data}
            onDataChange={(data) => updateTabData(tab.id, data)}
            onOpenCurriculumTab={(route: string) => {
              // Smart curriculum tab management (same logic as analytics onNavigate)
              const existingCurriculumTab = tabs.find(t => t.type === 'curriculum' && t.active);
              if (existingCurriculumTab) {
                updateTabData(existingCurriculumTab.id, { currentPath: route });
                setActiveTabId(existingCurriculumTab.id);
              } else {
                // Check if there's any curriculum tab (even inactive)
                const anyCurriculumTab = tabs.find(t => t.type === 'curriculum');
                if (anyCurriculumTab) {
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
            }}
          />
        );
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
      case 'worksheet-generator':
        return <WorksheetGenerator
          tabId={tab.id}
          savedData={tab.data}
          onDataChange={(data) => updateTabData(tab.id, data)}
          onOpenCurriculumTab={(route: string) => {
            // Smart curriculum tab management (same logic as analytics onNavigate)
            const existingCurriculumTab = tabs.find(t => t.type === 'curriculum' && t.active);
            if (existingCurriculumTab) {
              updateTabData(existingCurriculumTab.id, { currentPath: route });
              setActiveTabId(existingCurriculumTab.id);
            } else {
              // Check if there's any curriculum tab (even inactive)
              const anyCurriculumTab = tabs.find(t => t.type === 'curriculum');
              if (anyCurriculumTab) {
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
          }}
        />;
      case 'image-studio':
        return <ImageStudio tabId={tab.id} savedData={tab.data} onDataChange={(data) => updateTabData(tab.id, data)} />;
      case 'settings':
        return <Settings tabId={tab.id} savedData={tab.data} onDataChange={(data) => updateTabData(tab.id, data)} />;
      case 'class-management':
        return <ClassManagement tabId={tab.id} savedData={tab.data} onDataChange={(data) => updateTabData(tab.id, data)} />;
      case 'support':
        return <SupportReporting tabId={tab.id} savedData={tab.data} onDataChange={(data) => updateTabData(tab.id, data)} initialScreenshot={tab.data?.initialScreenshot || null} />;
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    if (splitView.isActive && splitView.leftTabId && splitView.rightTabId) {
      const leftTab = tabs.find(t => t.id === splitView.leftTabId);
      const rightTab = tabs.find(t => t.id === splitView.rightTabId);

      if (!leftTab || !rightTab) {
        setSplitView({
          isActive: false,
          leftTabId: null,
          rightTabId: null,
          activePaneId: 'left'
        });
        return null;
      }

      // Get active tab color for pane highlight
      const activeTabInPane = splitView.activePaneId === 'left' ? leftTab : rightTab;
      const activePaneColor = settings.tabColors[activeTabInPane.type as keyof typeof settings.tabColors] || '#60a5fa';
      
      // Convert hex to RGB for CSS variable
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
          : '96, 165, 250'; // fallback blue-400 RGB
      };

      return (
        <>
          <div className="flex h-full gap-1 p-1" style={{ backgroundColor: 'var(--tab-content-bg)' }} data-tutorial="split-view-demo">
            {/* Left Pane */}
            <div
              className={`flex-1 overflow-hidden relative ${
                splitView.activePaneId === 'left' ? 'active-pane-glow' : ''
              }`}
              onFocus={() => {
                if (splitView.activePaneId !== 'left') {
                  setSplitView(prev => ({ ...prev, activePaneId: 'left' }));
                }
              }}
              tabIndex={-1}
              style={splitView.activePaneId === 'left' ? {
                backgroundColor: 'var(--tab-content-bg)',
                '--glow-color': activePaneColor,
                '--glow-rgb': hexToRgb(activePaneColor),
                border: `3px solid ${activePaneColor}`,
                borderRadius: '4px',
                zIndex: 10
              } as React.CSSProperties : {
                backgroundColor: 'var(--tab-content-bg)',
                border: '3px solid transparent',
                borderRadius: '4px',
                zIndex: 1
              }}
            >
              {renderSingleTabContent(leftTab)}
            </div>

            {/* Right Pane */}
            <div
              className={`flex-1 overflow-hidden relative ${
                splitView.activePaneId === 'right' ? 'active-pane-glow' : ''
              }`}
              onFocus={() => {
                if (splitView.activePaneId !== 'right') {
                  setSplitView(prev => ({ ...prev, activePaneId: 'right' }));
                }
              }}
              tabIndex={-1}
              style={splitView.activePaneId === 'right' ? {
                backgroundColor: 'var(--tab-content-bg)',
                '--glow-color': activePaneColor,
                '--glow-rgb': hexToRgb(activePaneColor),
                border: `3px solid ${activePaneColor}`,
                borderRadius: '4px',
                zIndex: 10
              } as React.CSSProperties : {
                backgroundColor: 'var(--tab-content-bg)',
                border: '3px solid transparent',
                borderRadius: '4px',
                zIndex: 1
              }}
            >
              {renderSingleTabContent(rightTab)}
            </div>
          </div>
          {/* Keep non-split tabs mounted but hidden so skeleton loaders / state persist */}
          {tabs
            .filter(t => t.id !== splitView.leftTabId && t.id !== splitView.rightTabId)
            .map(tab => (
              <div key={tab.id} style={{ display: 'none' }}>
                {renderSingleTabContent(tab)}
              </div>
            ))
          }
        </>
      );
    }

    // Render ALL tabs but hide inactive ones so components stay mounted.
    // Preserves skeleton loaders, scroll position, form state, etc. when switching tabs.
    return (
      <>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className="absolute inset-0"
            style={{ display: tab.id === activeTabId ? 'block' : 'none' }}
          >
            {renderSingleTabContent(tab)}
          </div>
        ))}
      </>
    );
  };

  const groupedTabs = tabs.reduce((acc, tab) => {
    if (!acc[tab.type]) acc[tab.type] = [];
    acc[tab.type].push(tab);
    return acc;
  }, {} as { [key: string]: Tab[] });

  // Group tools by category
  const regularTools = tools.filter(t => !t.group && t.type !== 'settings' && t.type !== 'support');
  const lessonPlannerTools = tools.filter(t => t.group === 'lesson-planners');
  const visualStudioTools = tools.filter(t => t.group === 'visual-studio');
  const otherGroupedTools = tools.filter(t => t.group === 'tools');
  const supportTool = tools.find(t => t.type === 'support');
  const settingsTool = tools.find(t => t.type === 'settings');

  return (
    <div
      className="flex h-screen bg-[#f5f5f0] dark:bg-[#2b2b2b]"
      onClick={() => setContextMenu(null)}
    >
      {/* Context Menu */}
      {contextMenu && contextMenu.groupType && (
        <div
          className="fixed rounded-lg py-2 z-50 widget-glass"
          style={{ left: contextMenu.x, top: contextMenu.y + 20}}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Group Actions</div>
          <button
            onClick={() => closeGroupTabs(contextMenu.groupType!)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 flex items-center space-x-2 dark:text-gray-300 dark:hover:bg-red-900 dark:hover:text-red-400"
          >
            <X className="w-4 h-4" />
            <span>Close all {tools.find(t => t.type === contextMenu.groupType)?.name} tabs</span>
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className="w-16 overflow-hidden relative flex flex-col sidebar-glass"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: sidebarOpen ? '256px' : '72px',
          zIndex: 40,
          background: sidebarOpen ? 'var(--sidebar-bg)' : 'var(--sidebar-bg-collapsed)',
          color: 'var(--sidebar-text)',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s, background 0.3s',
          backdropFilter: 'blur(24px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
          borderRight: '1px solid var(--sidebar-border)',
          boxShadow: sidebarOpen ? '6px 0 40px rgba(0,0,0,0.25), 2px 0 12px rgba(0,0,0,0.15)' : '4px 0 16px rgba(0,0,0,0.12)',
        }}
        ref={sidebarRef}
        data-tutorial="main-sidebar"
        onMouseEnter={() => setSidebarOpen(true)}
      >
        {/* Glass header */}
        <div
          className="p-4"
          style={{
            borderBottom: '1px solid var(--sidebar-border)',
            background: 'var(--sidebar-header-bg)'
          }}
        >
          <div className="flex items-center justify-center">
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  opacity: sidebarOpen ? 0 : 1,
                  transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: sidebarOpen ? 'none' : 'auto'
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(96,165,250,0.5), rgba(139,92,246,0.5))',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  {userProfileImage ? (
                    <img
                      src={userProfileImage}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
              </div>
              <div
                style={{
                  opacity: sidebarOpen ? 1 : 0,
                  transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: sidebarOpen ? 'auto' : 'none'
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(96,165,250,0.4), rgba(139,92,246,0.4))',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    {userProfileImage ? (
                      <img src={userProfileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h2 className="text-sm font-bold whitespace-nowrap" style={{ letterSpacing: '0.01em' }}>OECS Learning Hub</h2>
                    <p
                      className="text-xs whitespace-nowrap overflow-hidden"
                      style={{
                        color: 'var(--sidebar-text-muted)',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {user.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={sidebarScrollRef} className="flex-1 p-4 space-y-1 overflow-y-auto glass-scrollbar">
          <div
            className="glass-section-label"
            style={{
              color: 'var(--sidebar-text-faint)',
              textAlign: sidebarOpen ? 'left' : 'center',
              padding: sidebarOpen ? '36px 12px 6px' : '36px 0 6px'
            }}
          >
            Tools
          </div>
          
          {/* Regular Tools */}
          {regularTools.map((tool, i) => {
            const Icon = iconMap[tool.icon];
            const count = getTabCountByType(tool.type);
            const activeTab = tabs.find(t => t.id === activeTabId);
            const isActiveToolType = activeTab?.type === tool.type;
            const toolColor = settings.tabColors[tool.type as keyof typeof settings.tabColors];
            const isSingleReg = SINGLE_INSTANCE_TABS.has(tool.type);
            const maxForReg = isSingleReg ? 1 : MAX_TABS_PER_TYPE;

            return (
              <button
                key={tool.id}
                data-tool-type={tool.type}
                onClick={() => openTool(tool)}
                data-tutorial={
                  tool.type === 'analytics'
                    ? 'tool-analytics'
                    : tool.type === 'chat'
                    ? 'tool-chat'
                    : tool.type === 'curriculum'
                    ? 'tool-curriculum'
                    : undefined
                }
                className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} glass-nav-item transition group`}
                title={!sidebarOpen ? `${tool.name}${!isSingleReg ? ` (${count}/${maxForReg} open)` : ''}` : ''}
                style={{
                  backgroundColor: isActiveToolType
                    ? ('var(--sidebar-active)')
                    : 'transparent',
                  transition: 'background-color 0.25s, box-shadow 0.25s',
                  animationDelay: `${i * 40}ms`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isActiveToolType
                    ? ('var(--sidebar-active)')
                    : 'transparent';
                }}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActiveToolType ? 'icon-glow' : ''
                  }`}
                  style={
                    isActiveToolType && toolColor
                      ? { color: toolColor }
                      : { color: 'var(--sidebar-text-muted)' }
                  }
                />
                <div
                  className="flex-1 text-left overflow-hidden"
                  style={{
                    opacity: sidebarOpen ? 1 : 0,
                    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: sidebarOpen ? 'auto' : 'none'
                  }}
                >
                  <p
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    style={{
                      maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
                    }}
                  >
                    {tool.name}
                  </p>
                  {tool.type !== 'analytics' && tool.type !== 'curriculum-tracker' && tool.type !== 'resource-manager' && tool.type !== 'curriculum' &&(
                    <p
                      className="text-xs whitespace-nowrap"
                      style={{ color: 'var(--sidebar-text-muted)' }}
                    >
                      {count}/{MAX_TABS_PER_TYPE} open
                    </p>
                  )}
                </div>
              </button>
            );
          })}

          {/* Glass divider */}
          <div className="glass-divider" style={{ background: 'linear-gradient(90deg, transparent, var(--sidebar-divider), transparent)' }} />

          {/* Other Grouped Tools */}
          {otherGroupedTools.map((tool, i) => {
            const Icon = iconMap[tool.icon];
            const count = getTabCountByType(tool.type);
            const activeTab = tabs.find(t => t.id === activeTabId);
            const isActiveToolType = activeTab?.type === tool.type;
            const toolColor = settings.tabColors[tool.type as keyof typeof settings.tabColors];
            const isSingle = SINGLE_INSTANCE_TABS.has(tool.type);
            const maxForTool = isSingle ? 1 : MAX_TABS_PER_TYPE;

            return (
              <button
                key={tool.id}
                data-tool-type={tool.type}
                onClick={() => openTool(tool)}
                data-tutorial={
                  tool.type === 'quiz-generator'
                    ? 'tool-quiz'
                    : tool.type === 'rubric-generator'
                    ? 'tool-rubric'
                    : undefined
                }
                className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} glass-nav-item transition group`}
                title={!sidebarOpen ? `${tool.name}${!isSingle ? ` (${count}/${maxForTool} open)` : ''}` : ''}
                style={{
                  backgroundColor: isActiveToolType
                    ? ('var(--sidebar-active)')
                    : 'transparent',
                  transition: 'background-color 0.25s, box-shadow 0.25s',
                  animationDelay: `${(i + regularTools.length) * 40}ms`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isActiveToolType
                    ? ('var(--sidebar-active)')
                    : 'transparent';
                }}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActiveToolType ? 'icon-glow' : ''
                  }`}
                  style={
                    isActiveToolType && toolColor
                      ? { color: toolColor }
                      : { color: 'var(--sidebar-text-muted)' }
                  }
                />
                <div
                  className="flex-1 text-left overflow-hidden"
                  style={{
                    opacity: sidebarOpen ? 1 : 0,
                    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: sidebarOpen ? 'auto' : 'none'
                  }}
                >
                  <p
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    style={{
                      maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
                    }}
                  >
                    {tool.name}
                  </p>
                  {!SINGLE_INSTANCE_TABS.has(tool.type) && (
                    <p
                      className="text-xs whitespace-nowrap"
                      style={{ color: 'var(--sidebar-text-muted)' }}
                    >
                      {count}/{maxForTool} open
                    </p>
                  )}
                </div>
              </button>
            );
          })}

          {/* Glass divider */}
          <div className="glass-divider" style={{ background: 'linear-gradient(90deg, transparent, var(--sidebar-divider), transparent)' }} />

          {/* Lesson Planners Dropdown */}
          <div className="mt-2" data-tutorial="lesson-planners-group">
            {(() => {
              const activeTab = tabs.find(t => t.id === activeTabId);
              const activeLPTool = !sidebarOpen && activeTab ? lessonPlannerTools.find(t => t.type === activeTab.type) : null;
              const LPIcon = activeLPTool ? iconMap[activeLPTool.icon] : BookOpen;
              const lpToolColor = activeLPTool ? settings.tabColors[activeLPTool.type as keyof typeof settings.tabColors] : undefined;
              return (
                <button
                  onClick={() => setLessonPlannerExpanded(!lessonPlannerExpanded)}
                  data-tutorial-click="lesson-planners-group"
                  className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} glass-nav-item transition`}
                  title={!sidebarOpen ? (activeLPTool ? activeLPTool.name : 'Lesson Planners') : ''}
                  style={{
                    backgroundColor: 'transparent',
                    transition: 'background-color 0.25s, box-shadow 0.25s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <LPIcon
                    className={`w-5 h-5 flex-shrink-0 ${sidebarOpen ? '' : 'mx-auto'} ${activeLPTool ? 'icon-glow' : ''}`}
                    style={{
                      color: activeLPTool && lpToolColor ? lpToolColor : ('var(--sidebar-text-muted)'),
                      transition: 'color 0.3s, filter 0.3s'
                    }}
                  />
              <div
                className="flex-1 text-left overflow-hidden"
                style={{
                  opacity: sidebarOpen ? 1 : 0,
                  transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: sidebarOpen ? 'auto' : 'none'
                }}
              >
                <div className="flex items-center justify-between">
                  <p
                    className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1"
                    style={{
                      maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
                    }}
                  >
                    Lesson Planners
                  </p>
                  <ChevronDown
                    className="w-4 h-4 text-gray-400 chevron-icon ml-2 flex-shrink-0"
                    style={{
                      transform: lessonPlannerExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                </div>
              </div>
                </button>
              );
            })()}

            <div
              className="ml-4 mt-2 space-y-1 border-l-2 pl-2"
              style={{
                borderColor: 'var(--sidebar-border)',
                opacity: lessonPlannerExpanded && sidebarOpen ? 1 : 0,
                transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: lessonPlannerExpanded && sidebarOpen ? 'auto' : 'none',
                maxHeight: lessonPlannerExpanded && sidebarOpen ? '500px' : '0',
                overflow: 'hidden'
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
                      data-tool-type={tool.type}
                      onClick={() => openTool(tool)}
                      className={`w-full flex items-center space-x-2 p-2 rounded-lg transition text-sm`}
                      style={{
                        backgroundColor: isActiveToolType
                          ? 'var(--sidebar-active)'
                          : 'transparent',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isActiveToolType
                          ? 'var(--sidebar-active)'
                          : 'transparent';
                      }}
                    >
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActiveToolType ? 'icon-glow' : ''
                        }`}
                        style={
                          isActiveToolType && toolColor
                            ? { color: toolColor }
                            : { color: 'var(--sidebar-text-muted)' }
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
                          style={{ color: 'var(--sidebar-text-muted)' }}
                        >
                          {count}/{SINGLE_INSTANCE_TABS.has(tool.type) ? 1 : MAX_TABS_PER_TYPE}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Visual Studio Dropdown */}
          {settings.visualStudioEnabled && (
            <div className="mt-2">
              {(() => {
                const activeTab = tabs.find(t => t.id === activeTabId);
                const activeVSTool = !sidebarOpen && activeTab ? visualStudioTools.find(t => t.type === activeTab.type) : null;
                const VSIcon = activeVSTool ? iconMap[activeVSTool.icon] : Palette;
                const vsToolColor = activeVSTool ? settings.tabColors[activeVSTool.type as keyof typeof settings.tabColors] : undefined;
                return (
              <button
                onClick={() => setVisualStudioExpanded(!visualStudioExpanded)}
                className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} glass-nav-item transition`}
                title={!sidebarOpen ? (activeVSTool ? activeVSTool.name : 'Visual Studio') : ''}
                style={{
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.25s, box-shadow 0.25s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                    <VSIcon
                      className={`w-5 h-5 flex-shrink-0 ${sidebarOpen ? '' : 'mx-auto'} ${activeVSTool ? 'icon-glow' : ''}`}
                      style={{
                        color: activeVSTool && vsToolColor ? vsToolColor : ('var(--sidebar-text-muted)'),
                        transition: 'color 0.3s, filter 0.3s'
                      }}
                    />
                <div
                  className="flex-1 text-left overflow-hidden"
                  style={{
                    opacity: sidebarOpen ? 1 : 0,
                    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: sidebarOpen ? 'auto' : 'none'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1"
                      style={{
                        maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
                      }}
                    >
                      Visual Studio
                    </p>
                    <ChevronDown
                      className="w-4 h-4 text-gray-400 chevron-icon ml-2 flex-shrink-0"
                      style={{
                        transform: visualStudioExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                  </div>
                </div>
              </button>
                );
              })()}

              <div
                className="ml-4 mt-2 space-y-1 border-l-2 pl-2"
                style={{
                  borderColor: 'var(--sidebar-border)',
                  opacity: visualStudioExpanded && sidebarOpen ? 1 : 0,
                  transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: visualStudioExpanded && sidebarOpen ? 'auto' : 'none',
                  maxHeight: visualStudioExpanded && sidebarOpen ? '500px' : '0',
                  overflow: 'hidden'
                }}
              >
                {visualStudioTools.map((tool) => {
                  const Icon = iconMap[tool.icon];
                  const count = getTabCountByType(tool.type);
                  const activeTab = tabs.find(t => t.id === activeTabId);
                  const isActiveToolType = activeTab?.type === tool.type;
                  const toolColor = settings.tabColors[tool.type as keyof typeof settings.tabColors];
                  return (
                    <button
                      key={tool.id}
                      data-tool-type={tool.type}
                      onClick={() => openTool(tool)}
                      className={`w-full flex items-center space-x-2 p-2 rounded-lg transition text-sm`}
                      style={{
                        backgroundColor: isActiveToolType
                          ? 'var(--sidebar-active)'
                          : 'transparent',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isActiveToolType
                          ? 'var(--sidebar-active)'
                          : 'transparent';
                      }}
                    >
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActiveToolType ? 'icon-glow' : ''
                        }`}
                        style={
                          isActiveToolType && toolColor
                            ? { color: toolColor }
                            : { color: 'var(--sidebar-text-muted)' }
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
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Glass divider */}
          <div className="glass-divider" style={{ background: 'linear-gradient(90deg, transparent, var(--sidebar-divider), transparent)' }} />

          {/* Support & Reporting Tool */}
          {supportTool && (
            <div className="mt-2">
              {(() => {
                const SupportIcon = iconMap[supportTool.icon];
                const activeTab = tabs.find(t => t.id === activeTabId);
                const isActiveToolType = activeTab?.type === supportTool.type;
                const toolColor = settings.tabColors[supportTool.type as keyof typeof settings.tabColors] || '#3b82f6';

                return (
                  <button
                    data-tool-type={supportTool.type}
                    onClick={() => openTool(supportTool)}
                    className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} glass-nav-item transition group`}
                    title={!sidebarOpen ? supportTool.name : ''}
                    style={{
                      backgroundColor: 'transparent',
                      transition: 'background-color 0.25s, box-shadow 0.25s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <SupportIcon
                      className={`w-5 h-5 flex-shrink-0 ${isActiveToolType ? 'icon-glow' : ''}`}
                      style={isActiveToolType ? { color: toolColor } : { color: 'var(--sidebar-text-muted)' }}
                    />
                    <div
                      className="flex-1 text-left overflow-hidden"
                      style={{
                        opacity: sidebarOpen ? 1 : 0,
                        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        pointerEvents: sidebarOpen ? 'auto' : 'none'
                      }}
                    >
                      <p
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                        style={{
                          maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                          WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
                        }}
                      >
                        {supportTool.name}
                      </p>
                    </div>
                  </button>
                );
              })()}
            </div>
          )}

          {/* Settings Tool */}
          {settingsTool && (
            <div className="mt-2">
              {(() => {
                const Icon = iconMap[settingsTool.icon];
                const activeTab = tabs.find(t => t.id === activeTabId);
                const isActiveToolType = activeTab?.type === settingsTool.type;

                return (
                  <button
                    data-tool-type={settingsTool.type}
                    onClick={() => openTool(settingsTool)}
                    className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} glass-nav-item transition group`}
                    title={!sidebarOpen ? settingsTool.name : ''}
                    style={{
                      backgroundColor: 'transparent',
                      transition: 'background-color 0.25s, box-shadow 0.25s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
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
                          : { color: 'var(--sidebar-text-muted)' }
                      }
                    />
                    <div
                      className="flex-1 text-left overflow-hidden"
                      style={{
                        opacity: sidebarOpen ? 1 : 0,
                        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        pointerEvents: sidebarOpen ? 'auto' : 'none'
                      }}
                    >
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
                  </button>
                );
              })()}
            </div>
          )}
        </div>

        <div
          className="p-4"
          style={{
            borderTop: '1px solid var(--sidebar-border)',
            opacity: sidebarOpen ? 1 : 0,
            transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: sidebarOpen ? 'auto' : 'none'
          }}
        >
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} rounded-lg transition text-red-400 hover:text-red-300`}
            title={!sidebarOpen ? 'Logout' : ''}
            style={{
              display: 'none',
              backgroundColor: 'transparent',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className="text-sm font-medium"
              style={{
                opacity: sidebarOpen ? 1 : 0,
                transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: sidebarOpen ? 'auto' : 'none'
              }}
            >
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: '72px' }}>
        {/* Top Bar */}
        <div className="px-2 flex items-end justify-between edge-tab-bar" style={{ height: `${TAB_H + 4}px`, paddingTop: '4px', paddingBottom: 0 }}>
          {/* Highlight bar at top when a tab is active */}
          {(() => {
            const currentActiveTab = tabs.find(t => t.id === activeTabId);
            const activeColors = currentActiveTab ? (tabColors[currentActiveTab.type] || tabColors['split']) : null;
            return activeColors ? (
              <div className="edge-tab-bar-highlight" style={{ background: activeColors.border }} />
            ) : null;
          })()}
          {/* Border line at bottom */}
          <div className="edge-tab-bar-border" />
          {/* Tabs on the left */}
          <div className="flex-1 flex items-end gap-0 overflow-x-auto scrollbar-hide" data-tutorial="tab-bar">
            {Object.entries(groupedTabs).map(([type, groupTabs], groupIndex) => {
              const isCollapsed = collapsedGroups.has(type);
              const totalGroups = Object.entries(groupedTabs).length;
              const baseZIndex = (totalGroups - groupIndex) * 10;  // Left = higher z-index
              const activeInGroup = groupTabs.find(t => t.id === activeTabId);
              const colors = tabColors[type] || tabColors['split'] || { border: '#6b7280', bg: '#6b7280', activeBg: '#4b5563' };
              
              if (groupTabs.length === 1) {
                const tab = groupTabs[0];
                const isActive = activeTabId === tab.id;
                const isHover = hoveringTabId === tab.id && !isActive;
                return (
                  <div
                    key={tab.id}
                    data-tutorial={isActive ? "single-tab-demo" : undefined}
                    data-tab-type={tab.type}
                    data-tab-id={tab.id}
                    className={`edge-tab group ${bouncingTabId === tab.id ? 'edge-tab-bounce' : ''}`}
                    data-active={isActive}
                    style={{
                      '--tab-color': colors.border,
                      '--tab-z-index': baseZIndex,
                      width: TAB_W,
                      height: TAB_H,
                      marginRight: TAB_OVERLAP,
                      overflow: 'visible',
                    } as React.CSSProperties}
                    onClick={() => {
                      triggerTabBounce(tab.id);
                      if (!splitView.isActive) {
                        setActiveTabId(tab.id);
                      } else {
                        if (splitView.activePaneId === 'left') {
                          setSplitView(prev => ({ ...prev, leftTabId: tab.id }));
                        } else {
                          setSplitView(prev => ({ ...prev, rightTabId: tab.id }));
                        }
                      }

                      setTabs(prev => prev.map(t => ({
                        ...t,
                        lastActiveTime: t.id === tab.id ? Date.now() : t.lastActiveTime
                      })));
                    }}
                    onMouseEnter={() => setHoveringTabId(tab.id)}
                    onMouseLeave={() => setHoveringTabId(null)}
                  >
                    <TrapezoidTabShape
                      isActive={isActive}
                      isHover={isHover}
                      width={TAB_W}
                      height={TAB_H}
                      activeColor={colors.border}
                      inactiveColor={colors.bg}
                      hoverColor={colors.activeBg || colors.bg}
                    />
                    <span
                      className="edge-tab-label"
                      style={{
                        color: isActive ? '#fff' : isHover ? '#444' : '#333',
                        fontWeight: isActive ? 600 : 400,
                        maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)'
                      }}
                    >
                      {tab.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                      className="edge-tab-close opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              }

              return (
                <div key={type} className="flex items-end" style={{ overflow: 'visible' }} data-tutorial="tab-groups" data-group-type={type}>
                  <button
                    onClick={() => {
                      triggerTabBounce(`${type}-group`);
                      toggleGroupCollapse(type);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setContextMenu({ groupType: type, x: e.clientX, y: e.clientY });
                    }}
                    className={`edge-tab-group group ${bouncingTabId === `${type}-group` ? 'edge-tab-group-bounce' : ''}`}
                    data-active={!!activeInGroup}
                    data-collapsed={isCollapsed}
                    style={{
                      '--group-color': colors.border,
                      '--group-z-index': baseZIndex,
                      width: TAB_W,
                      height: TAB_H,
                      marginRight: TAB_OVERLAP,
                      overflow: 'visible',
                    } as React.CSSProperties}
                    title="Right-click for options"
                    onMouseEnter={() => setHoveringTabId(`${type}-group`)}
                    onMouseLeave={() => setHoveringTabId(null)}
                  >
                    <TrapezoidTabShape
                      isActive={!!activeInGroup}
                      isHover={hoveringTabId === `${type}-group` && !activeInGroup}
                      width={TAB_W}
                      height={TAB_H}
                      activeColor={colors.border}
                      inactiveColor={colors.bg}
                      hoverColor={colors.activeBg || colors.bg}
                    />
                    <ChevronRight className="w-3.5 h-3.5 chevron-icon" style={{ color: activeInGroup ? '#fff' : '#333' }} />
                    <span
                      className="edge-tab-label"
                      style={{
                        color: activeInGroup ? '#fff' : '#333',
                        fontWeight: activeInGroup ? 600 : 400,
                        maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)'
                      }}
                    >
                      {tools.find(t => t.type === type)?.name}
                    </span>
                  </button>

                  <div
                    className={`edge-tab-group-container ${
                      isCollapsed ? 'slide-out' : 'slide-in'
                    }`}
                    style={{
                      '--group-line-color': colors.border,
                      '--group-container-z': baseZIndex - 1,
                      display: isCollapsed && !animatingGroups.has(type) ? 'none' : 'flex'
                    } as React.CSSProperties}
                  >
                    {groupTabs.map((tab, index) => {
                      const isTabActive = activeTabId === tab.id;
                      const isTabHover = hoveringTabId === tab.id && !isTabActive;
                      const tabZIndex = baseZIndex + (groupTabs.length - index);  // Left tabs higher
                      return (
                        <div
                          key={tab.id}
                          className={`edge-tab group ${bouncingTabId === tab.id ? 'edge-tab-bounce' : ''}`}
                          data-active={isTabActive}
                          data-grouped="true"
                          data-tab-id={tab.id}
                          style={{
                            '--tab-color': colors.border,
                            '--tab-z-index': tabZIndex,
                            width: TAB_W - 30,
                            height: TAB_H - 4,
                            marginRight: TAB_OVERLAP,
                            maxWidth: '200px',
                            overflow: 'visible',
                          } as React.CSSProperties}
                          onClick={() => {
                            triggerTabBounce(tab.id);
                            if (!splitView.isActive) {
                              setActiveTabId(tab.id);
                            } else {
                              if (splitView.activePaneId === 'left') {
                                setSplitView(prev => ({ ...prev, leftTabId: tab.id }));
                              } else {
                                setSplitView(prev => ({ ...prev, rightTabId: tab.id }));
                              }
                            }

                            setTabs(prev => prev.map(t => ({
                              ...t,
                              lastActiveTime: t.id === tab.id ? Date.now() : t.lastActiveTime
                            })));
                          }}
                          onMouseEnter={() => setHoveringTabId(tab.id)}
                          onMouseLeave={() => setHoveringTabId(null)}
                        >
                          <TrapezoidTabShape
                            isActive={isTabActive}
                            isHover={isTabHover}
                            width={TAB_W - 30}
                            height={TAB_H - 4}
                            activeColor={colors.border}
                            inactiveColor={colors.bg}
                            hoverColor={colors.activeBg || colors.bg}
                          />
                          <span
                            className="edge-tab-label"
                            style={{
                              color: isTabActive ? '#fff' : isTabHover ? '#444' : '#333',
                              fontWeight: isTabActive ? 600 : 400,
                              fontSize: '0.75rem',
                              maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
                              WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)'
                            }}
                          >
                            {tab.title}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              closeTab(tab.id);
                            }}
                            className="edge-tab-close opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Split Toggle, Bell, and Close All Tabs Buttons on the right */}
          <div className="flex items-center gap-2" style={{ position: 'relative', zIndex: 50, paddingBottom: '4px' }}>
            {tabs.length >= 2 && (
              <button
                data-tutorial="split-toggle"
                onClick={toggleSplitView}
                className={`p-2 rounded-lg transition group flex-shrink-0 ${
                  splitView.isActive
                    ? 'bg-white/20 text-white hover:bg-white/30'
                    : 'hover:bg-white/10 text-gray-300'
                }`}
                title={splitView.isActive ? 'Exit Split View' : 'Enter Split View'}
              >
                <Columns className="w-5 h-5" />
              </button>

            )}
            
            {tabs.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Dashboard: close all tabs clicked, current tabs:', tabs);
                  // Force immediate state reset - close everything at once
                  setSplitView({
                    isActive: false,
                    leftTabId: null,
                    rightTabId: null,
                    activePaneId: 'left'
                  });
                  setTabs([]);
                  setActiveTabId(null);
                  localStorage.removeItem('dashboard-tabs');
                  localStorage.removeItem('dashboard-active-tab');
                  localStorage.removeItem('dashboard-split-view');
                  console.log('Dashboard: close all tabs completed');
                }}
                data-tutorial="close-all-tabs"
                className="p-2 rounded-lg hover:bg-red-500/20 transition group flex-shrink-0 border border-red-400/30"
                title="Close All Tabs and Exit Split View"
              >
                <X className="w-5 h-5 text-red-400 group-hover:text-red-300" />
              </button>
            )}

            {/* Divider */}
            <div className="w-px h-5 bg-white/20 flex-shrink-0" />

            {/* Bell / Notification button */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setNotifPanelOpen(prev => !prev); }}
                className="relative p-2 rounded-lg hover:bg-white/10 transition text-gray-300 flex-shrink-0"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {(unreadCount > 0 || queueActiveCount > 0) && (
                  <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${queueActiveCount > 0 ? 'bg-amber-400' : 'bg-blue-400'}`} />
                )}
              </button>
              <NotificationPanel open={notifPanelOpen} onClose={() => setNotifPanelOpen(false)} />
            </div>
          </div>
        </div>


        {/* Content Area */}
        <div
          className="flex-1 overflow-hidden relative"
          onClick={() => setSidebarOpen(false)}
          data-tutorial="main-content"
          style={{ backgroundColor: 'var(--tab-content-bg)' }}
        >
          {tabs.length > 0 ? (
            <>
              <div className="absolute inset-0">
                {renderTabContent()}
              </div>
            </>
          ) : (
            <div className="h-full relative overflow-hidden" style={isDarkMode ? { background: '#000' } : {}}>
              {/* Background layer */}
              {isDarkMode ? (
                <div className="absolute inset-0" style={{ zIndex: 0 }}>
                  <Galaxy
                    mouseRepulsion
                    mouseInteraction
                    density={1}
                    glowIntensity={0.3}
                    saturation={0}
                    hueShift={140}
                    twinkleIntensity={0.3}
                    rotationSpeed={0.1}
                    repulsionStrength={2}
                    autoCenterRepulsion={0}
                    starSpeed={0.5}
                    speed={1}
                    transparent={false}
                  />
                </div>
              ) : (
                <div className="absolute inset-0" style={{ zIndex: 0 }}>
                  <Grainient
                    color1="#5cb832"
                    color2="#f0b818"
                    color3="#ffffff"
                    timeSpeed={0.25}
                    colorBalance={0}
                    warpStrength={1}
                    warpFrequency={5}
                    warpSpeed={2}
                    warpAmplitude={50}
                    blendAngle={0}
                    blendSoftness={0.05}
                    rotationAmount={500}
                    noiseScale={2}
                    grainAmount={0.1}
                    grainScale={2}
                    grainAnimated={false}
                    contrast={1.5}
                    gamma={1}
                    saturation={1}
                    centerX={0}
                    centerY={0}
                    zoom={0.9}
                  />
                </div>
              )}

              {/* Glass welcome card */}
              <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
                <div className="glass-card p-10 max-w-lg w-full mx-6 dashboard-welcome-enter">
                  <div className="text-center">
                    <div
                      className="mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{
                        background: isDarkMode
                          ? 'linear-gradient(135deg, rgba(77,168,46,0.3), rgba(232,170,32,0.25))'
                          : 'linear-gradient(135deg, rgba(29,54,45,0.5), rgba(232,170,32,0.4))',
                        border: isDarkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(29,54,45,0.2)',
                        boxShadow: isDarkMode ? '0 4px 24px rgba(77,168,46,0.2)' : '0 4px 24px rgba(29,54,45,0.15)'
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? 'rgba(160,220,120,0.8)' : 'rgba(255,255,255,0.9)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
                      </svg>
                    </div>

                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{
                        color: isDarkMode ? 'rgba(255,255,255,0.92)' : 'rgba(29,54,45,0.95)',
                        letterSpacing: '-0.02em',
                        textShadow: isDarkMode ? 'none' : '0 1px 2px rgba(255,255,255,0.5)'
                      }}
                    >
                      OECS Learning Hub
                    </h3>
                    <p
                      className="text-sm mb-8"
                      style={{ color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(29,54,45,0.6)' }}
                    >
                      Select a tool from the sidebar to get started
                    </p>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { icon: LayoutDashboard, label: 'My Overview', tool: tools.find(t => t.type === 'analytics') },
                        { icon: MessageSquare, label: 'Ask PEARL', tool: tools.find(t => t.type === 'chat') },
                        { icon: Search, label: 'Curriculum', tool: tools.find(t => t.type === 'curriculum') },
                      ].map((item) => (
                        <button
                          key={item.label}
                          className={`glass-action-btn flex flex-col items-center gap-2 p-4 ${!isDarkMode ? 'glass-action-btn-light' : ''}`}
                          onClick={() => item.tool && openTool(item.tool)}
                        >
                          <item.icon className="w-5 h-5" style={{ color: isDarkMode ? 'rgba(160,220,120,0.7)' : 'rgba(29,54,45,0.8)' }} />
                          <span className="text-xs font-medium" style={{ color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(29,54,45,0.75)' }}>{item.label}</span>
                        </button>
                      ))}
                    </div>

                    <RotatingTip isDarkMode={isDarkMode} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Welcome Modal for first-time users */}
      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleCommandPaletteNavigate}
      />

      {showWelcomeModal && (
        <WelcomeModal
          onClose={handleWelcomeSkip}
          onStartTour={handleWelcomeStartTour}
        />
      )}

      {/* First-time Dashboard Tutorial */}
      <TutorialOverlay
        steps={dashboardWalkthroughSteps}
        onComplete={handleTutorialComplete}
        autoStart={showFirstTimeTutorial}
        showFloatingButton={false}
        isSplitViewActive={splitView.isActive}
        onStepChange={(step) => {
          // Step 6 is the lesson planner dropdown (0-indexed, so step 14 is the 15th step)
          if (step === 14) {
            setSidebarOpen(true); // Force sidebar open for lesson planner step
          }
        }}
      />
  {/* Global Tutorial Button (centralized) */}
  {/* Rendered only when not in split view and tutorials are enabled */}
  {(() => {
    // Centralized floating TutorialButton using hook safely at component scope
    const tutorialIdsByTabType: Record<string, string> = {
      'lesson-planner': TUTORIAL_IDS.LESSON_PLANNER,
      'quiz-generator': TUTORIAL_IDS.QUIZ_GENERATOR,
      'rubric-generator': TUTORIAL_IDS.RUBRIC_GENERATOR,
      'kindergarten-planner': TUTORIAL_IDS.KINDERGARTEN_PLANNER,
      'resource-manager': TUTORIAL_IDS.RESOURCE_MANAGER,
      'analytics': TUTORIAL_IDS.DASHBOARD_MAIN,
      'curriculum': TUTORIAL_IDS.CURRICULUM,
      'curriculum-tracker': TUTORIAL_IDS.CURRICULUM_TRACKER,
      'multigrade-planner': TUTORIAL_IDS.MULTIGRADE_PLANNER,
      'cross-curricular-planner': TUTORIAL_IDS.CROSS_CURRICULAR_PLANNER,
      'worksheet-generator': TUTORIAL_IDS.WORKSHEET_GENERATOR,
      'image-studio': TUTORIAL_IDS.IMAGE_STUDIO,
      'settings': TUTORIAL_IDS.SETTINGS,
      'chat': TUTORIAL_IDS.CHAT,
      'class-management': TUTORIAL_IDS.CLASS_MANAGEMENT,
      'support': TUTORIAL_IDS.DASHBOARD_MAIN,
    };

    if (splitView.isActive || !settings.tutorials.tutorialPreferences.showFloatingButtons) return null;

    const activeTab = tabs.find((t) => t.id === activeTabId);

    // If no tabs are open, show the welcome tutorial
    if (!activeTab) {
      return (
        <TutorialButton
          tutorialId={TUTORIAL_IDS.DASHBOARD_MAIN}
          onStartTutorial={() => startTutorial(TUTORIAL_IDS.DASHBOARD_MAIN)}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          onScreenshotTicket={handleScreenshotTicket}
          position="bottom-right"
        />
      );
    }

    // If the dashboard (analytics) tab is open, use the analytics dashboard tutorial
    if (activeTab.type === "analytics") {
      return (
        <TutorialButton
          tutorialId={TUTORIAL_IDS.ANALYTICS}
          onStartTutorial={() => startTutorial(TUTORIAL_IDS.ANALYTICS)}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          onScreenshotTicket={handleScreenshotTicket}
          position="bottom-right"
        />
      );
    }

    // Otherwise, use the mapped tutorial for the tab type, or fallback to dashboard tutorial
    const tutorialId = tutorialIdsByTabType[activeTab.type] || TUTORIAL_IDS.DASHBOARD_MAIN;
    const isChat = activeTab.type === 'chat';

    return (
      <TutorialButton
        tutorialId={tutorialId as TutorialId}
        onStartTutorial={() => startTutorial(tutorialId as TutorialId)}
        onOpenSearch={() => setCommandPaletteOpen(true)}
        onScreenshotTicket={handleScreenshotTicket}
        position={isChat ? 'bottom-left' : 'bottom-right'}
        ghost={isChat}
      />
    );
  })()}
    </div>
  );
};

export default Dashboard;
