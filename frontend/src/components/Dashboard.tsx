import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { OECS_LOGO_BASE64 } from '../utils/logoBase64';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Message01IconData from '@hugeicons/core-free-icons/Message01Icon';
import CheckListIconData from '@hugeicons/core-free-icons/CheckListIcon';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import Logout01IconData from '@hugeicons/core-free-icons/Logout01Icon';
import PlusSignIconData from '@hugeicons/core-free-icons/PlusSignIcon';
import ColumnInsertIconData from '@hugeicons/core-free-icons/ColumnInsertIcon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import GraduationScrollIconData from '@hugeicons/core-free-icons/GraduationScrollIcon';
import BookBookmark01IconData from '@hugeicons/core-free-icons/BookBookmark01Icon';
import SchoolIconData from '@hugeicons/core-free-icons/SchoolIcon';
import UserGroupIconData from '@hugeicons/core-free-icons/UserGroupIcon';
import BarChartIconData from '@hugeicons/core-free-icons/BarChartIcon';
import LibraryIconData from '@hugeicons/core-free-icons/LibraryIcon';
import Settings01IconData from '@hugeicons/core-free-icons/Settings01Icon';
import Target01IconData from '@hugeicons/core-free-icons/Target01Icon';
import FileSpreadsheetIconData from '@hugeicons/core-free-icons/FileSpreadsheetIcon';
import ColorsIconData from '@hugeicons/core-free-icons/ColorsIcon';
import Notification01IconData from '@hugeicons/core-free-icons/Notification01Icon';
import DashboardSquare01IconData from '@hugeicons/core-free-icons/DashboardSquare01Icon';
import ChartIncreaseIconData from '@hugeicons/core-free-icons/ChartIncreaseIcon';
import FolderOpenIconData from '@hugeicons/core-free-icons/FolderOpenIcon';
import Search01IconData from '@hugeicons/core-free-icons/Search01Icon';
import PenTool01IconData from '@hugeicons/core-free-icons/PenTool01Icon';
import UserMultipleIconData from '@hugeicons/core-free-icons/UserMultipleIcon';
import Baby01IconData from '@hugeicons/core-free-icons/Baby01Icon';
import Layers01IconData from '@hugeicons/core-free-icons/Layers01Icon';
import GitMergeIconData from '@hugeicons/core-free-icons/GitMergeIcon';
import HelpCircleIconData from '@hugeicons/core-free-icons/HelpCircleIcon';
import AlertCircleIconData from '@hugeicons/core-free-icons/AlertCircleIcon';
import BrainIconData from '@hugeicons/core-free-icons/BrainIcon';
import Activity01IconData from '@hugeicons/core-free-icons/Activity01Icon';
import Presentation01IconData from '@hugeicons/core-free-icons/Presentation01Icon';
import Trophy01IconData from '@hugeicons/core-free-icons/Award01Icon';
import SquareLock01IconData from '@hugeicons/core-free-icons/SquareLock01Icon';
import StoryBookIconData from '@hugeicons/core-free-icons/BookOpen02Icon';
import Bulb01IconData from '@hugeicons/core-free-icons/BulbIcon';
import Compass01IconData from '@hugeicons/core-free-icons/Compass01Icon';
import Camera01IconData from '@hugeicons/core-free-icons/Camera01Icon';
import ComputerPhoneSyncIconData from '@hugeicons/core-free-icons/ComputerPhoneSyncIcon';
import PaintBrush01IconData from '@hugeicons/core-free-icons/PaintBrush01Icon';
import Calendar03IconData from '@hugeicons/core-free-icons/Calendar03Icon';
import { useCapabilities } from '../contexts/CapabilitiesContext';
import { useEngineStatus } from '../hooks/useEngineStatus';

// Wrapper to make HugeiconsIcon work like lucide-react components
const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

// Named icon components matching lucide-react API
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const MessageSquare: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Message01IconData} {...p} />;
const ClipboardCheck: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckListIconData} {...p} />;
const BookOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookOpen01IconData} {...p} />;
const FileText: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={File01IconData} {...p} />;
const LogOut: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Logout01IconData} {...p} />;
const Plus: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PlusSignIconData} {...p} />;
const Columns: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ColumnInsertIconData} {...p} />;
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowDown01IconData} {...p} />;
const ChevronRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowRight01IconData} {...p} />;
const GraduationCap: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={GraduationScrollIconData} {...p} />;
const ListChecks: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckListIconData} {...p} />;
const BookMarked: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookBookmark01IconData} {...p} />;
const School: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SchoolIconData} {...p} />;
const Users: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UserGroupIconData} {...p} />;
const BarChart3: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BarChartIconData} {...p} />;
const Library: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={LibraryIconData} {...p} />;
const SettingsIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Settings01IconData} {...p} />;
const Target: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Target01IconData} {...p} />;
const FileSpreadsheet: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FileSpreadsheetIconData} {...p} />;
const Palette: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ColorsIconData} {...p} />;
const Bell: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Notification01IconData} {...p} />;
const LayoutDashboard: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={DashboardSquare01IconData} {...p} />;
const TrendingUp: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ChartIncreaseIconData} {...p} />;
const FolderOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FolderOpenIconData} {...p} />;
const Search: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Search01IconData} {...p} />;
const PenTool: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PenTool01IconData} {...p} />;
const ClipboardList: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckListIconData} {...p} />;
const UsersRound: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UserMultipleIconData} {...p} />;
const Baby: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Baby01IconData} {...p} />;
const Layers: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Layers01IconData} {...p} />;
const Merge: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={GitMergeIconData} {...p} />;
const HelpCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={HelpCircleIconData} {...p} />;
const AlertTriangle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={AlertCircleIconData} {...p} />;
const Brain: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BrainIconData} {...p} />;
const Speedometer: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Activity01IconData} {...p} />;
const Presentation: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Presentation01IconData} {...p} />;
const Trophy: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Trophy01IconData} {...p} />;
const StoryBook: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={StoryBookIconData} {...p} />;
const Lightbulb: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Bulb01IconData} {...p} />;
const Compass: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Compass01IconData} {...p} />;
const Paintbrush: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PaintBrush01IconData} {...p} />;
const Camera: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Camera01IconData} {...p} />;
const DeviceSync: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ComputerPhoneSyncIconData} {...p} />;
const CalendarRange: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Calendar03IconData} {...p} />;

import { User, Tab, Tool, SplitViewState, Resource } from '../types';
import { AchievementProvider, useAchievementContext } from '../contexts/AchievementContext';
import { achievementApi } from '../lib/achievementApi';
import AchievementUnlockModal from './modals/AchievementUnlockModal';
import TrophyDetailCard from './TrophyDetailCard';
import { getTrophyType } from '../config/trophyMap';
import { getTrophyImageForTier } from '../assets/trophyImagesLazy';
import type { TrophyTier } from '../assets/trophyImages';

// Lazy-load all tab components (only downloaded when user opens that tab)
const Chat = React.lazy(() => import('./Chat'));
const LessonPlanner = React.lazy(() => import('./LessonPlanner'));
const CurriculumViewer = React.lazy(() => import('./CurriculumViewer'));
const QuizGenerator = React.lazy(() => import('./QuizGenerator'));
const RubricGenerator = React.lazy(() => import('./RubricGenerator'));
const MultigradePlanner = React.lazy(() => import('./MultigradePlanner'));
const KindergartenPlanner = React.lazy(() => import('./KindergartenPlanner'));
const CrossCurricularPlanner = React.lazy(() => import('./CrossCurricularPlanner'));
const AnalyticsDashboard = React.lazy(() => import('./AnalyticsDashboard'));
const ResourceManager = React.lazy(() => import('./ResourceManager'));
const Settings = React.lazy(() => import('./Settings'));
const CurriculumTracker = React.lazy(() => import('./CurriculumTracker'));
const WorksheetGenerator = React.lazy(() => import('./WorksheetGenerator'));
const ImageStudio = React.lazy(() => import('./ImageStudio'));
const ClassManagement = React.lazy(() => import('./ClassManagement'));
const SupportReporting = React.lazy(() => import('./SupportReporting'));
const BrainDump = React.lazy(() => import('./BrainDump'));
const PerformanceMetrics = React.lazy(() => import('./PerformanceMetrics'));
const PresentationBuilder = React.lazy(() => import('./PresentationBuilder'));
const StoryBookCreator = React.lazy(() => import('./StoryBookCreator'));
const Achievements = React.lazy(() => import('./Achievements'));
const EducatorInsights = React.lazy(() => import('./EducatorInsights'));
const PhotoReceiver = React.lazy(() => import('./PhotoReceiver'));
const SchoolYearHub = React.lazy(() => import('./SchoolYearHub'));
import TutorialOverlay, { getDashboardWalkthroughSteps } from './TutorialOverlay';
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
import LightRays from './LightRays';
import DraftSaveDialog from './DraftSaveDialog';
import ActiveGenerationDialog from './ActiveGenerationDialog';
import CloseAllDialog, { CloseAllSummary } from './CloseAllDialog';
import { useTabBusy } from '../contexts/TabBusyContext';
import { TabIdProvider } from '../contexts/TabIdContext';
import { useStickyNotes } from '../contexts/StickyNoteContext';
import { StickyNoteOverlay } from './sticky-notes/StickyNoteOverlay';
import { StickyNoteFabPanel } from './sticky-notes/StickyNoteFabPanel';
import { NudgeProvider, useNudge } from './Nudge/NudgeProvider';
import { getNextSuggestion } from '../lib/workflowProgression';


interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const getTools = (t: TFunction, coworkerName: string = 'Coworker'): Tool[] => [
  {
    id: 'analytics',
    name: 'My Overview',
    icon: 'LayoutDashboard',
    type: 'analytics',
    description: t('sidebar.descriptions.myOverview')
  },
  {
    id: 'educator-insights',
    name: 'Educator Insights',
    icon: 'Lightbulb',
    type: 'educator-insights',
    description: t('sidebar.descriptions.educatorInsights')
  },
  {
    id: 'brain-dump',
    name: 'Brain Dump',
    icon: 'Brain',
    type: 'brain-dump',
    description: t('sidebar.descriptions.brainDump'),
    group: 'planning-prep'
  },
  {
    id: 'curriculum-tracker',
    name: 'Progress Tracker',
    icon: 'TrendingUp',
    type: 'curriculum-tracker',
    description: t('sidebar.descriptions.progressTracker'),
    group: 'my-classroom'
  },
  {
    id: 'resource-manager',
    name: 'My Resources',
    icon: 'FolderOpen',
    type: 'resource-manager',
    description: t('sidebar.descriptions.myResources'),
    group: 'planning-prep'
  },
  {
    id: 'school-year-calendar',
    name: 'School Year',
    icon: 'CalendarRange',
    type: 'school-year-calendar',
    description: t('sidebar.descriptions.schoolYear'),
    group: 'planning-prep'
  },
  {
    id: 'chat',
    name: `Ask ${coworkerName}`,
    icon: 'MessageSquare',
    type: 'chat',
    description: t('sidebar.descriptions.askPearl', { coworkerName })
  },
  {
    id: 'curriculum',
    name: 'Curriculum Browser',
    icon: 'Search',
    type: 'curriculum',
    description: t('sidebar.descriptions.curriculumBrowser')
  },
  {
    id: 'quiz-generator',
    name: 'Quiz Builder',
    icon: 'PenTool',
    type: 'quiz-generator',
    description: t('sidebar.descriptions.quizBuilder'),
    group: 'assessment-tools'
  },
  {
    id: 'rubric-generator',
    name: 'Rubric Builder',
    icon: 'ClipboardList',
    type: 'rubric-generator',
    description: t('sidebar.descriptions.rubricBuilder'),
    group: 'assessment-tools'
  },
  {
    id: 'class-management',
    name: 'My Classes',
    icon: 'UsersRound',
    type: 'class-management',
    description: t('sidebar.descriptions.myClasses'),
    group: 'my-classroom'
  },
  // Lesson Planner Group
  {
    id: 'lesson-planner',
    name: 'Lesson Plan',
    icon: 'BookMarked',
    type: 'lesson-planner',
    description: t('sidebar.descriptions.lessonPlan'),
    group: 'lesson-planners'
  },
  {
    id: 'kindergarten-planner',
    name: 'Early Childhood',
    icon: 'Baby',
    type: 'kindergarten-planner',
    description: t('sidebar.descriptions.earlyChildhood'),
    group: 'lesson-planners'
  },
  {
    id: 'multigrade-planner',
    name: 'Multi-Level',
    icon: 'Layers',
    type: 'multigrade-planner',
    description: t('sidebar.descriptions.multiLevel'),
    group: 'lesson-planners'
  },
  {
    id: 'cross-curricular-planner',
    name: 'Integrated Lesson',
    icon: 'Merge',
    type: 'cross-curricular-planner',
    description: t('sidebar.descriptions.integratedLesson'),
    group: 'lesson-planners'
  },
  {
    id: 'achievements',
    name: 'Achievements',
    icon: 'Trophy',
    type: 'achievements',
    description: t('sidebar.descriptions.achievements'),
    group: 'my-classroom'
  },
  {
    id: 'photo-transfer',
    name: 'Document Transfer',
    icon: 'DeviceSync',
    type: 'photo-transfer',
    description: t('sidebar.descriptions.photoTransfer'),
    group: 'planning-prep'
  },
  {
    id: 'performance-metrics',
    name: 'Performance',
    icon: 'Speedometer',
    type: 'performance-metrics',
    description: t('sidebar.descriptions.performance')
  },
  {
    id: 'support',
    name: 'Support & Reporting',
    icon: 'HelpCircle',
    type: 'support',
    description: t('sidebar.descriptions.support')
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    type: 'settings',
    description: t('sidebar.descriptions.settings')
  },
  // Visual Studio Group
  {
    id: 'worksheet-generator',
    name: 'Worksheet Builder',
    icon: 'FileSpreadsheet',
    type: 'worksheet-generator',
    description: t('sidebar.descriptions.worksheetBuilder'),
    group: 'visual-studio'
  },
  {
    id: 'image-studio',
    name: 'Image Studio',
    icon: 'Palette',
    type: 'image-studio',
    description: t('sidebar.descriptions.imageStudio'),
    group: 'visual-studio'
  },
  {
    id: 'presentation-builder',
    name: 'Slide Deck',
    icon: 'Presentation',
    type: 'presentation-builder',
    description: t('sidebar.descriptions.slideDeck'),
    group: 'visual-studio'
  },
  {
    id: 'storybook',
    name: 'Storybook Creator',
    icon: 'StoryBook',
    type: 'storybook',
    description: t('sidebar.descriptions.storybookCreator'),
    group: 'visual-studio'
  }
];

// Map tool IDs to sidebar translation keys
const SIDEBAR_I18N: Record<string, string> = {
  'analytics': 'sidebar.myOverview',
  'educator-insights': 'sidebar.educatorInsights',
  'brain-dump': 'sidebar.brainDump',
  'curriculum-tracker': 'sidebar.progressTracker',
  'resource-manager': 'sidebar.myResources',
  'school-year-calendar': 'sidebar.schoolYear',
  'chat': 'sidebar.askPearl',
  'curriculum': 'sidebar.curriculumBrowser',
  'quiz-generator': 'sidebar.quizBuilder',
  'rubric-generator': 'sidebar.rubricBuilder',
  'class-management': 'sidebar.myClasses',
  'lesson-planner': 'sidebar.lessonPlan',
  'kindergarten-planner': 'sidebar.earlyChildhood',
  'multigrade-planner': 'sidebar.multiLevel',
  'cross-curricular-planner': 'sidebar.integratedLesson',
  'achievements': 'sidebar.achievements',
  'photo-transfer': 'sidebar.photoTransfer',
  'performance-metrics': 'sidebar.performance',
  'support': 'sidebar.supportReporting',
  'settings': 'sidebar.settings',
  'worksheet-generator': 'sidebar.worksheetBuilder',
  'image-studio': 'sidebar.imageStudio',
  'presentation-builder': 'sidebar.slideDeck',
  'storybook': 'sidebar.storybookCreator',
};

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
  AlertTriangle,
  Brain,
  Speedometer,
  Presentation,
  Trophy,
  StoryBook,
  Lightbulb,
  Camera,
  DeviceSync,
  CalendarRange,
};

const getWelcomeTips = (t: TFunction, coworkerName: string): string[] => [
  t('dashboard.tips.tip1'),
  t('dashboard.tips.tip2'),
  t('dashboard.tips.tip3'),
  t('dashboard.tips.tip4'),
  t('dashboard.tips.tip5'),
  t('dashboard.tips.tip6'),
  t('dashboard.tips.tip7'),
  t('dashboard.tips.tip8'),
  t('dashboard.tips.tip9'),
  t('dashboard.tips.tip10'),
  t('dashboard.tips.tip11', { coworkerName }),
  t('dashboard.tips.tip12'),
  t('dashboard.tips.tip13'),
  t('dashboard.tips.tip14'),
  t('dashboard.tips.tip15'),
];

const getQuicklinkSets = (t: TFunction, coworkerName: string) => [
  [
    { icon: LayoutDashboard, label: t('sidebar.myOverview'), type: 'analytics' },
    { icon: MessageSquare, label: t('sidebar.askPearl', { coworkerName }), type: 'chat' },
    { icon: Search, label: t('sidebar.curriculumBrowser'), type: 'curriculum' },
  ],
  [
    { icon: BookMarked, label: t('sidebar.lessonPlan'), type: 'lesson-planner' },
    { icon: PenTool, label: t('sidebar.quizBuilder'), type: 'quiz-generator' },
    { icon: ClipboardList, label: t('sidebar.rubricBuilder'), type: 'rubric-generator' },
  ],
  [
    { icon: Brain, label: t('sidebar.brainDump'), type: 'brain-dump' },
    { icon: FolderOpen, label: t('sidebar.myResources'), type: 'resource-manager' },
    { icon: TrendingUp, label: t('sidebar.progressTracker'), type: 'curriculum-tracker' },
  ],
  [
    { icon: FileSpreadsheet, label: t('sidebar.worksheetBuilder'), type: 'worksheet-generator' },
    { icon: UsersRound, label: t('sidebar.myClasses'), type: 'class-management' },
    { icon: Palette, label: t('sidebar.imageStudio'), type: 'image-studio' },
  ],
];

const RotatingQuickLinks = ({ isDarkMode, onOpenTool }: { isDarkMode: boolean; onOpenTool: (type: string) => void }) => {
  const { t } = useTranslation();
  const [setIndex, setSetIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const quicklinkSets = getQuicklinkSets(t);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setSetIndex(prev => (prev + 1) % quicklinkSets.length);
        setVisible(true);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, [quicklinkSets.length]);

  const currentSet = quicklinkSets[setIndex];

  return (
    <div className="relative mb-6">
      <div
        className="grid grid-cols-3 gap-3 transition-opacity duration-400"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {currentSet.map((item) => (
          <button
            key={item.label}
            className={`glass-action-btn flex flex-col items-center gap-2 p-4 ${!isDarkMode ? 'glass-action-btn-light' : ''}`}
            onClick={() => onOpenTool(item.type)}
          >
            <item.icon className="w-5 h-5" style={{ color: isDarkMode ? 'rgba(242,166,49,0.7)' : 'rgba(29,54,45,0.8)' }} />
            <span className="text-xs font-medium" style={{ color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(29,54,45,0.75)' }}>{item.label}</span>
          </button>
        ))}
      </div>
      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {quicklinkSets.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setVisible(false);
              setTimeout(() => {
                setSetIndex(i);
                setVisible(true);
              }, 300);
            }}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === setIndex ? 16 : 6,
              height: 6,
              backgroundColor: i === setIndex
                ? (isDarkMode ? 'rgba(242,166,49,0.6)' : 'rgba(29,54,45,0.5)')
                : (isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(29,54,45,0.15)'),
            }}
          />
        ))}
      </div>
    </div>
  );
};

const RotatingTip = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { t } = useTranslation();
  const tips = getWelcomeTips(t);
  const [index, setIndex] = useState(() => Math.floor(Math.random() * tips.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % tips.length);
        setVisible(true);
      }, 400);
    }, 12000);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <p
      className="text-xs transition-opacity duration-400"
      style={{
        color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(29,54,45,0.4)',
        opacity: visible ? 1 : 0,
      }}
    >
      {t('dashboard.tip')} {tips[index]}
    </p>
  );
};

const MAX_TABS_PER_TYPE = 3;
const SINGLE_INSTANCE_TABS = new Set(['worksheet-generator', 'image-studio', 'class-management', 'support', 'brain-dump', 'performance-metrics', 'presentation-builder', 'achievements', 'storybook', 'educator-insights', 'photo-transfer', 'school-year-calendar']);
const HIDE_TAB_COUNTER = new Set(['curriculum-tracker', 'resource-manager', 'curriculum', 'worksheet-generator', 'image-studio', 'presentation-builder', 'achievements', 'storybook', 'brain-dump', 'school-year-calendar', 'photo-transfer', 'class-management']);

const DRAFT_CONFIG: Record<string, { storagePrefix: string; plannerType: string; generatedKey: string }> = {
  'lesson-planner': { storagePrefix: 'lesson_state_', plannerType: 'lesson', generatedKey: 'generatedPlan' },
  'kindergarten-planner': { storagePrefix: 'kindergarten_state_', plannerType: 'kindergarten', generatedKey: 'generatedPlan' },
  'multigrade-planner': { storagePrefix: 'multigrade_state_', plannerType: 'multigrade', generatedKey: 'generatedPlan' },
  'cross-curricular-planner': { storagePrefix: 'cross_curricular_state_', plannerType: 'cross-curricular', generatedKey: 'generatedPlan' },
  'quiz-generator': { storagePrefix: 'quiz_state_', plannerType: 'quiz', generatedKey: 'generatedQuiz' },
  'rubric-generator': { storagePrefix: 'rubric_state_', plannerType: 'rubric', generatedKey: 'generatedRubric' },
  'worksheet-generator': { storagePrefix: 'worksheet_state_', plannerType: 'worksheet', generatedKey: 'generatedWorksheet' },
  'presentation-builder': { storagePrefix: '', plannerType: 'presentation', generatedKey: 'slides' },
};

/**
 * Memoized wrapper for tab content panels.
 * Skips re-rendering inactive tabs whose data hasn't changed,
 * preventing expensive re-renders when only activeTabId changes.
 */
const TabPanel = React.memo(({
  tab,
  isActive,
  renderContent
}: {
  tab: Tab;
  isActive: boolean;
  renderContent: (tab: Tab, isActive: boolean) => React.ReactNode;
}) => {
  return <>{renderContent(tab, isActive)}</>;
}, (prev, next) => {
  // Always re-render if active state changed
  if (prev.isActive !== next.isActive) return false;
  // Always re-render active tabs (they need fresh callbacks)
  if (next.isActive) return false;
  // Skip re-render for inactive tabs with same id and data
  if (prev.tab.id === next.tab.id && prev.tab.data === next.tab.data) return true;
  return false;
});

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const { settings, markTutorialComplete, setWelcomeSeen, isTutorialCompleted, isSidebarItemEnabled, isToolChildEnabled, trackToolVisit } = useSettings();
  const { t } = useTranslation();
  // Build the translated tools list — re-evaluated whenever the language changes
  const tools = useMemo(() => getTools(t), [t]);
  // Translate a tool name using the i18n key map, falling back to the original name
  const tn = (tool: Tool) => SIDEBAR_I18N[tool.id] ? t(SIDEBAR_I18N[tool.id]) : tool.name;
  // Derive the display label for a tab — re-evaluates on language change for standard tool tabs
  const getTabLabel = (tab: Tab) => {
    if (tab.toolId) {
      const tool = tools.find(tl => tl.id === tab.toolId);
      if (tool) return tn(tool);
    }
    return tab.title;
  };
  const { hasDiffusion } = useCapabilities();
  const { engineStatus, scannerStatus, studioStatus } = useEngineStatus();

  // -- Status indicator helpers --
  const statusColor = (s: typeof engineStatus) =>
    s === 'online' ? '#22c55e' :
    s === 'starting' ? '#f59e0b' :
    s === 'checking' ? 'var(--text-hint, #9ca3af)' :
    '#ef4444';

  const statusLabel = (s: typeof engineStatus) =>
    s === 'online' ? 'Online' :
    s === 'starting' ? 'Starting' :
    s === 'checking' ? 'Checking' :
    'Offline';

  const statusGlow = (s: typeof engineStatus) =>
    s === 'online' ? '0 0 6px #22c55e88' :
    s === 'starting' ? '0 0 6px #f59e0b88' :
    'none';

  const statusPulse = (s: typeof engineStatus) =>
    (s === 'starting' || s === 'checking') ? 'pulse 1.5s ease-in-out infinite' : 'none';

  type Indicator = { label: string; status: typeof engineStatus };
  const indicators: Indicator[] = [
    { label: 'Brain', status: engineStatus },
    ...(scannerStatus !== null ? [{ label: 'Scanner', status: scannerStatus }] : []),
    ...(studioStatus !== null ? [{ label: 'Studio', status: studioStatus }] : []),
  ];
  const multiMode = indicators.length > 1;

  // Import the real tutorial context at the top level
  const { startTutorial } = useTutorials();
  const { closeConnection, getIsTabBusy, getActiveStreams } = useWebSocket();
  const { unreadCount, registerNavigator } = useNotification();
  const { queue } = useQueue();
  const { isTabHttpBusy } = useTabBusy();
  const { openNoteIds, fabPanelOpen, setFabPanelOpen, createNote, openNote, notes } = useStickyNotes();
  const activeStreams = getActiveStreams();
  const queuedTabEndpoints = new Set(
    queue.filter(item => item.status === 'generating').map(item => `${item.tabId}::${item.endpoint}`)
  );
  const directStreamCount = activeStreams.filter(s => !queuedTabEndpoints.has(`${s.tabId}::${s.endpoint}`)).length;
  const queueActiveCount = queue.filter(item => item.status === 'waiting' || item.status === 'generating').length + directStreamCount;

  // Tabs that are queued (waiting/generating) — used for blue dot alongside streaming
  const queuedTabIds = new Set(
    queue.filter(item => item.status === 'waiting' || item.status === 'generating').map(item => item.tabId)
  );
  const isTabWorking = (tabId: string) => getIsTabBusy(tabId) || queuedTabIds.has(tabId) || isTabHttpBusy(tabId);

  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [completedTabIds, setCompletedTabIds] = useState<Set<string>>(new Set());
  const prevBusyTabsRef = useRef<Set<string>>(new Set());

  // Pulse only after generation completes on a non-active tab
  useEffect(() => {
    const currentBusy = new Set<string>();
    for (const stream of activeStreams) {
      currentBusy.add(stream.tabId);
    }
    for (const item of queue) {
      if (item.status === 'waiting' || item.status === 'generating') {
        currentBusy.add(item.tabId);
      }
    }

    // Tabs that were busy but aren't anymore = just completed
    for (const tabId of prevBusyTabsRef.current) {
      if (!currentBusy.has(tabId) && tabId !== activeTabId) {
        setCompletedTabIds(prev => {
          if (!prev.has(tabId)) return new Set(prev).add(tabId);
          return prev;
        });
      }
    }

    prevBusyTabsRef.current = currentBusy;
  }, [activeStreams, activeTabId, queue]);

  // Clear pulse when tab becomes active
  useEffect(() => {
    if (activeTabId && completedTabIds.has(activeTabId)) {
      setCompletedTabIds(prev => {
        const next = new Set(prev);
        next.delete(activeTabId);
        return next;
      });
    }
  }, [activeTabId, completedTabIds]);

  // Register tab navigator so notifications can navigate to the source tab
  useEffect(() => {
    registerNavigator((tabId: string) => {
      setActiveTabId(tabId);
    });
  }, [registerNavigator]);

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

  // Ctrl+F / Cmd+F to open command palette
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleCommandPaletteNavigate = (entry: SearchEntry, prefill?: Record<string, any>) => {
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
          initiateCloseAll([...tabs], 'all tabs');
          return;
      }
    }

    // Handle tool navigation
    if (entry.toolType) {
      const tool = tools.find(t => t.type === entry.toolType);
      if (tool) {
        // For settings entries, map the settingsSection to the correct sidebar panel
        let initialData = prefill ? { prefill } : undefined;
        if (entry.toolType === 'settings' && entry.settingsSection) {
          const sectionToPanel: Record<string, string> = {
            'font-size': 'appearance',
            'brightness': 'appearance',
            'night-tone': 'appearance',
            'settings-tab-colors': 'appearance',
            'settings-appearance': 'appearance',
            'ai-model': 'models',
            'thinking-mode': 'models',
            'diffusion-model': 'models',
            'ocr-model': 'models',
            'settings-notifications': 'general',
            'generation-mode': 'general',
            'settings-tutorials': 'general',
            'feature-modules': 'features',
            'sidebar-tools': 'features',
            'visual-studio': 'features',
            'writing-assistant': 'features',
            'system-behavior': 'features',
            'settings-reset': 'danger',
            'settings-wipe': 'danger',
          };
          const panel = sectionToPanel[entry.settingsSection] || 'profile';
          initialData = { ...initialData, initialSection: panel };
        }

        openTool(tool, initialData);

        // If navigating to a settings section, scroll to it after the tab renders
        if (entry.settingsSection) {
          const sectionId = entry.settingsSection;

          const tryScrollTo = () => {
            const el = document.querySelector(`[data-tutorial="${sectionId}"]`) ||
                       document.querySelector(`[data-search-section="${sectionId}"]`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.classList.add('search-highlight-flash');
              setTimeout(() => el.classList.remove('search-highlight-flash'), 2000);
              return true;
            }
            return false;
          };

          // Try after a short delay (panel may already be rendered)
          setTimeout(() => {
            if (tryScrollTo()) return;

            // If not found, observe DOM for the element to appear (panel switching)
            const observer = new MutationObserver(() => {
              if (tryScrollTo()) {
                observer.disconnect();
              }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            // Safety timeout: stop observing after 3s
            setTimeout(() => observer.disconnect(), 3000);
          }, 100);
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
    
    // Add default color for settings (only if not customized)
    if (!colors['settings']) colors['settings'] = generateColorVariants('#64748b'); // slate-500

    // Add default colors for support & reporting
    if (!colors['support']) colors['support'] = generateColorVariants('#3b82f6'); // blue-500

    // Ensure brain-dump always has a color
    if (!colors['brain-dump']) colors['brain-dump'] = generateColorVariants('#a855f7'); // purple-500

    // Ensure performance-metrics always has a color
    if (!colors['performance-metrics']) colors['performance-metrics'] = generateColorVariants('#10b981'); // emerald-500

    // Ensure school-year-calendar always has a color
    if (!colors['school-year-calendar']) colors['school-year-calendar'] = generateColorVariants('#0d9488'); // teal-600

    return colors;
  }, [settings.tabColors]);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabs, setTabs] = useState<Tab[]>([]);
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
  const [planningPrepExpanded, setPlanningPrepExpanded] = useState(false);
  const [assessmentToolsExpanded, setAssessmentToolsExpanded] = useState(false);
  const [myClassroomExpanded, setMyClassroomExpanded] = useState(false);
  const [showFirstTimeTutorial, setShowFirstTimeTutorial] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showResourceManagerTutorial, setShowResourceManagerTutorial] = useState(false);

  // Draft system state
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [pendingCloseTabId, setPendingCloseTabId] = useState<string | null>(null);
  const [pendingDraftData, setPendingDraftData] = useState<any>(null);

  // Active generation alert state
  const [showGenerationAlert, setShowGenerationAlert] = useState(false);
  const [generationAlertTarget, setGenerationAlertTarget] = useState<'tab' | 'tabs' | 'window'>('tab');
  const [generationAlertCount, setGenerationAlertCount] = useState(0);
  const [generationAlertAction, setGenerationAlertAction] = useState<(() => void) | null>(null);

  // Close-all dialog state
  const [showCloseAllDialog, setShowCloseAllDialog] = useState(false);
  const [closeAllSummary, setCloseAllSummary] = useState<CloseAllSummary>({ draftTabs: [], generatingTabs: [], totalTabs: 0 });
  const [closeAllTargetLabel, setCloseAllTargetLabel] = useState('all tabs');
  const [closeAllTabSet, setCloseAllTabSet] = useState<Tab[]>([]);

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

  // Auto-scroll tab strip to show the active tab whenever it changes
  useEffect(() => {
    if (!activeTabId) return;
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab) return;
    setTimeout(() => {
      const tabEl = document.querySelector(`[data-tab-id="${activeTabId}"]`) ||
                    document.querySelector(`[data-group-type="${activeTab.type}"]`);
      if (tabEl) {
        tabEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }, 80);
  }, [activeTabId, tabs]);

  // Preload diffusion pipeline when switching to image-capable tabs,
  // and auto-unload after 5 min when all image tabs are closed
  const diffusionUnloadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const diffusionPreloading = useRef(false);
  const IMAGE_TAB_TYPES = useMemo(() => new Set(['image-studio', 'storybook']), []);
  const DIFFUSION_IDLE_MS = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    const hasImageTab = tabs.some(t => IMAGE_TAB_TYPES.has(t.type));
    const activeTab = activeTabId ? tabs.find(t => t.id === activeTabId) : null;
    const activeIsImage = activeTab ? IMAGE_TAB_TYPES.has(activeTab.type) : false;

    // Preload when switching to an image tab (only if Brain is online)
    if (activeIsImage && engineStatus === 'online') {
      if (diffusionUnloadTimer.current) {
        clearTimeout(diffusionUnloadTimer.current);
        diffusionUnloadTimer.current = null;
      }
      // Dedup: skip if already preloading or already online
      // Don't reset the flag on fetch completion — only reset when studioStatus
      // goes back to null (diffusion deactivated) to prevent re-triggering on
      // every health-poll cycle while the model is still loading.
      if (!diffusionPreloading.current && studioStatus !== 'online') {
        diffusionPreloading.current = true;
        fetch('http://localhost:8000/api/image-service/preload', { method: 'POST' })
          .catch(() => {});
      }
      // Reset flag once loading completes so future tab switches can re-trigger
      if (studioStatus === 'online') {
        diffusionPreloading.current = false;
      }
      return;
    }

    // Not on an image tab — reset preload flag so it can fire again next time
    diffusionPreloading.current = false;

    // No image tabs open at all -- start 5-min unload timer
    if (!hasImageTab && !diffusionUnloadTimer.current) {
      diffusionUnloadTimer.current = setTimeout(() => {
        fetch('http://localhost:8000/api/image-service/unload', { method: 'POST' }).catch(() => {});
        diffusionUnloadTimer.current = null;
      }, DIFFUSION_IDLE_MS);
    }
  }, [activeTabId, tabs, IMAGE_TAB_TYPES, engineStatus, studioStatus]);

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

  const createTeacherWelcomeNote = useCallback(() => {
    if (localStorage.getItem('teacherWelcomeNoteCreated')) return;
    localStorage.setItem('teacherWelcomeNoteCreated', 'true');

    const hasName = !!(settings.profile.displayName && settings.profile.displayName.trim());
    const hasSchool = !!(settings.profile.school && settings.profile.school.trim());
    const hasGrades = Object.keys(settings.profile.gradeSubjects || {}).length > 0;
    const hasPhoto = !!localStorage.getItem('user-profile-image');

    const note = createNote({
      title: 'Press Ctrl+F to search anything',
      content: 'Use AI search or regular search — great when you\'re lost or looking for a tool.',
      checklist: [
        { id: 'setup_profile', text: 'Set up your profile (name & school)', completed: hasName && hasSchool },
        { id: 'setup_grades', text: 'Add your grades & subjects', completed: hasGrades },
        { id: 'setup_photo', text: 'Upload a profile photo', completed: hasPhoto },
        { id: 'setup_calendar', text: 'Set up your school year calendar', completed: false },
        { id: 'explore_lesson', text: 'Open the Lesson Planner', completed: false },
        { id: 'try_search', text: 'Try AI Search (Ctrl+F)', completed: false },
      ],
      color: '#fef08a',
      pinned: true,
      position: { x: Math.max(0, window.innerWidth - 360), y: 16 },
      size: { width: 340, height: 320 },
    });
    openNote(note.id, null);
  }, [settings.profile, createNote, openNote]);

  const handleTutorialComplete = useCallback(() => {
    markTutorialComplete(TUTORIAL_IDS.DASHBOARD_MAIN);
    setShowFirstTimeTutorial(false);
    createTeacherWelcomeNote();
  }, [markTutorialComplete, createTeacherWelcomeNote]);

  const handleWelcomeStartTour = useCallback(() => {
    setWelcomeSeen(true);
    setShowWelcomeModal(false);
    setShowFirstTimeTutorial(true);
  }, [setWelcomeSeen]);

  const handleWelcomeSkip = useCallback(() => {
    setWelcomeSeen(true);
    setShowWelcomeModal(false);
    createTeacherWelcomeNote();
  }, [setWelcomeSeen, createTeacherWelcomeNote]);

  // Fire checklist_complete flag when all items on the teacher welcome note are ticked
  useEffect(() => {
    if (localStorage.getItem('teacherChecklistComplete')) return;
    const welcomeNote = notes.find(n =>
      n.checklist && n.title === 'Press Ctrl+F to search anything'
    );
    if (!welcomeNote?.checklist) return;
    const allDone = welcomeNote.checklist.every(item => item.completed);
    if (!allDone) return;
    localStorage.setItem('teacherChecklistComplete', 'true');
    try {
      const raw = localStorage.getItem('user');
      const userId = raw ? (JSON.parse(raw).username || 'default_teacher') : 'default_teacher';
      achievementApi.trackFlag(userId, 'checklist_complete', 'set', 1).catch(() => {});
    } catch {}
  }, [notes]);

  const handleResourceManagerTutorialComplete = useCallback(() => {
    markTutorialComplete(TUTORIAL_IDS.RESOURCE_MANAGER);
    setShowResourceManagerTutorial(false);
  }, [markTutorialComplete]);

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

  // Mapping from sidebar item IDs to the tab types they control
  const SIDEBAR_ID_TO_TAB_TYPES: Record<string, string[]> = {
    'visual-studio': ['worksheet-generator', 'image-studio', 'presentation-builder', 'storybook'],
    'lesson-planners': ['lesson-planner', 'kindergarten-planner', 'multigrade-planner', 'cross-curricular-planner'],
    'performance-metrics': ['performance-metrics'],
    'brain-dump': ['brain-dump'],
    'curriculum-tracker': ['curriculum-tracker'],
    'resource-manager': ['resource-manager'],
    'chat': ['chat'],
    'curriculum': ['curriculum'],
    'quiz-generator': ['quiz-generator'],
    'rubric-generator': ['rubric-generator'],
    'class-management': ['class-management'],
    'support': ['support'],
    'photo-transfer': ['photo-transfer'],
    'school-year-calendar': ['school-year-calendar'],
  };

  // Close tabs when any sidebar item or individual child tool is disabled (with close-all dialog)
  useEffect(() => {
    const disabledTabTypes = new Set<string>();
    for (const item of settings.sidebarOrder) {
      if (!item.enabled) {
        // Entire group disabled — close all children
        const types = SIDEBAR_ID_TO_TAB_TYPES[item.id];
        if (types) types.forEach(t => disabledTabTypes.add(t));
      } else if (item.disabledChildren && item.disabledChildren.length > 0) {
        // Group enabled but some children individually disabled
        item.disabledChildren.forEach(childType => disabledTabTypes.add(childType));
      }
    }

    if (disabledTabTypes.size === 0) return;

    const tabsToClose = tabs.filter(tab => disabledTabTypes.has(tab.type));
    if (tabsToClose.length === 0) return;

    initiateCloseAll(tabsToClose, 'disabled module tabs');
  }, [settings.sidebarOrder]);

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

  const openTool = (tool: Tool, initialData?: Record<string, any>) => {
    // Guard: don't open if the tool's group has it individually disabled
    if (tool.group && !isToolChildEnabled(tool.group, tool.type)) return;
    // Track this tool visit for workflow progression
    trackToolVisit(tool.type);
    // Single-instance tool types: navigate to existing tab if open
    const singleInstanceTypes = ['analytics', 'curriculum', 'settings', 'curriculum-tracker', 'worksheet-generator', 'image-studio', 'resource-manager', 'support', 'performance-metrics', 'presentation-builder', 'achievements', 'educator-insights', 'school-year-calendar'];
    if (singleInstanceTypes.includes(tool.type)) {
      const existing = tabs.find(tab => tab.type === tool.type);
      if (existing) {
        // Merge initialData into existing tab so components can react to new props
        if (initialData) {
          updateTabData(existing.id, initialData);
        }
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
      title: tn(tool),
      toolId: tool.id,
      type: tool.type,
      active: true,
      data: initialData || {}
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  // Nudge: open a tool by tab type (used when teacher enables a module from a nudge toast)
  const openToolByTypeRef = useRef<(tabType: string) => void>(() => {});
  openToolByTypeRef.current = (tabType: string) => {
    const tool = tools.find(t => t.type === tabType);
    if (tool) openTool(tool);
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

  // Check if a generator tab has unsaved form data but no generated content
  const getDirtyPlannerData = useCallback((tabId: string, tabType: string) => {
    const config = DRAFT_CONFIG[tabType];
    if (!config) return null;
    try {
      let parsed: any;
      if (tabType === 'presentation-builder') {
        // PresentationBuilder stores state in tab.data, not localStorage
        const tab = tabs.find(t => t.id === tabId);
        if (!tab?.data) return null;
        parsed = tab.data;
      } else {
        const savedState = localStorage.getItem(`${config.storagePrefix}${tabId}`);
        if (!savedState) return null;
        parsed = JSON.parse(savedState);
      }
      const fd = parsed.formData;
      if (!fd) return null;
      // Check if any meaningful fields are filled
      const hasContent = fd.subject || fd.topic || fd.gradeLevel || fd.strand ||
        fd.essentialOutcomes || fd.specificOutcomes || fd.theme || fd.title ||
        fd.learningOutcomes || fd.worksheetType || fd.activityType;
      if (!hasContent) return null;
      // Build a title from available fields
      const titleParts = [fd.subject, fd.topic, fd.gradeLevel, fd.theme, fd.title].filter(Boolean);
      const title = titleParts.length > 0 ? titleParts.join(' - ') : t('dashboard.untitledDraft');
      return {
        formData: fd,
        step: parsed.step || 1,
        curriculumMatches: parsed.curriculumReferences || parsed.curriculumMatches || [],
        plannerType: config.plannerType,
        title,
      };
    } catch {
      return null;
    }
  }, [tabs]);

  // Save a draft to the backend
  const saveDraftForTab = useCallback(async (tabId: string, tabType: string, draftData: any) => {
    try {
      await fetch('http://localhost:8000/api/lesson-drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `draft_${tabId}_${Date.now()}`,
          title: draftData.title,
          timestamp: new Date().toISOString(),
          plannerType: draftData.plannerType,
          formData: draftData.formData,
          step: draftData.step,
          curriculumMatches: draftData.curriculumMatches,
        }),
      });
    } catch (e) {
      console.error('Failed to save draft:', e);
    }
  }, []);

  // Execute the actual tab close logic
  const executeTabClose = useCallback((tabId: string) => {
    setTabs(prevTabs => {
      const tab = prevTabs.find(t => t.id === tabId);
      if (!tab) return prevTabs;

      const updatedTabs = prevTabs.filter(t => t.id !== tabId);

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

      if (window && (window as any).wsDebugListConnections) {
        (window as any).wsDebugListConnections(tabId);
      }

      setSplitView(prevSplit => {
        if (prevSplit.isActive && (tabId === prevSplit.leftTabId || tabId === prevSplit.rightTabId)) {
          if (updatedTabs.length < 2) {
            if (updatedTabs.length > 0) {
              setActiveTabId(updatedTabs[0].id);
            }
            return { isActive: false, leftTabId: null, rightTabId: null, activePaneId: 'left' as const };
          } else {
            const availableTab = updatedTabs.find(t =>
              t.id !== prevSplit.leftTabId && t.id !== prevSplit.rightTabId
            );
            if (availableTab) {
              if (tabId === prevSplit.leftTabId) {
                return { ...prevSplit, leftTabId: availableTab.id };
              } else {
                return { ...prevSplit, rightTabId: availableTab.id };
              }
            }
          }
        }
        return prevSplit;
      });

      setActiveTabId(prevActiveId => {
        if (prevActiveId === tabId && updatedTabs.length > 0) {
          return updatedTabs[updatedTabs.length - 1].id;
        } else if (updatedTabs.length === 0) {
          return null;
        }
        return prevActiveId;
      });

      return updatedTabs;
    });
  }, [closeConnection]);

  // Close tab with generation + draft checks
  const closeTab = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) { executeTabClose(tabId); return; }

    // Check if tab has an active generation (streaming or queued)
    if (isTabWorking(tabId)) {
      setGenerationAlertTarget('tab');
      setGenerationAlertCount(1);
      setGenerationAlertAction(() => () => {
        // After confirming, proceed with draft check or close
        const config = DRAFT_CONFIG[tab.type];
        if (config) {
          const dirtyData = getDirtyPlannerData(tabId, tab.type);
          if (dirtyData) {
            setPendingCloseTabId(tabId);
            setPendingDraftData({ tabId, tabType: tab.type, ...dirtyData });
            setShowDraftDialog(true);
            return;
          }
        }
        executeTabClose(tabId);
      });
      setShowGenerationAlert(true);
      return;
    }

    const config = DRAFT_CONFIG[tab.type];
    if (config) {
      const dirtyData = getDirtyPlannerData(tabId, tab.type);
      if (dirtyData) {
        setPendingCloseTabId(tabId);
        setPendingDraftData({ tabId, tabType: tab.type, ...dirtyData });
        setShowDraftDialog(true);
        return;
      }
    }
    executeTabClose(tabId);
  }, [tabs, executeTabClose, getDirtyPlannerData, isTabWorking]);

  // Draft dialog handlers (single-tab close)
  const handleSaveDraft = useCallback(async () => {
    if (pendingDraftData && pendingCloseTabId) {
      await saveDraftForTab(pendingCloseTabId, pendingDraftData.tabType, pendingDraftData);
      executeTabClose(pendingCloseTabId);
    }
    setShowDraftDialog(false);
    setPendingCloseTabId(null);
    setPendingDraftData(null);
  }, [pendingDraftData, pendingCloseTabId, saveDraftForTab, executeTabClose]);

  const handleDiscardDraft = useCallback(() => {
    if (pendingCloseTabId) {
      executeTabClose(pendingCloseTabId);
    }
    setShowDraftDialog(false);
    setPendingCloseTabId(null);
    setPendingDraftData(null);
  }, [pendingCloseTabId, executeTabClose]);

  const handleCancelDraft = useCallback(() => {
    setShowDraftDialog(false);
    setPendingCloseTabId(null);
    setPendingDraftData(null);
  }, []);

  // Active generation alert handlers
  const handleGenerationAlertConfirm = useCallback(() => {
    setShowGenerationAlert(false);
    if (generationAlertAction) generationAlertAction();
    setGenerationAlertAction(null);
  }, [generationAlertAction]);

  const handleGenerationAlertCancel = useCallback(() => {
    setShowGenerationAlert(false);
    setGenerationAlertAction(null);
  }, []);

  // Close-all dialog helpers
  const getToolName = useCallback((tabType: string) => {
    return tools.find(t => t.type === tabType)?.name || tabType;
  }, []);

  /** Show the close-all dialog for a set of tabs, or close immediately if nothing needs attention */
  const initiateCloseAll = useCallback((tabsToClose: Tab[], targetLabel: string) => {
    if (tabsToClose.length === 0) return;

    const draftTabs: string[] = [];
    const generatingTabs: string[] = [];

    tabsToClose.forEach(tab => {
      const hasDraft = DRAFT_CONFIG[tab.type] && getDirtyPlannerData(tab.id, tab.type);
      const isBusy = isTabWorking(tab.id);
      if (hasDraft) draftTabs.push(tab.title || getToolName(tab.type));
      if (isBusy) generatingTabs.push(tab.title || getToolName(tab.type));
    });

    if (draftTabs.length === 0 && generatingTabs.length === 0) {
      // Nothing needs attention — close everything immediately
      tabsToClose.forEach(t => executeTabClose(t.id));
      if (targetLabel === 'all tabs') {
        setSplitView({ isActive: false, leftTabId: null, rightTabId: null, activePaneId: 'left' });
        setTabs([]);
        setActiveTabId(null);
        localStorage.removeItem('dashboard-tabs');
        localStorage.removeItem('dashboard-active-tab');
        localStorage.removeItem('dashboard-split-view');
      }
      return;
    }

    setCloseAllSummary({ draftTabs, generatingTabs, totalTabs: tabsToClose.length });
    setCloseAllTargetLabel(targetLabel);
    setCloseAllTabSet(tabsToClose);
    setShowCloseAllDialog(true);
  }, [getDirtyPlannerData, isTabWorking, getToolName, executeTabClose]);

  const handleCloseAllSaveAndClose = useCallback(async () => {
    // Save all dirty drafts, then close everything
    for (const tab of closeAllTabSet) {
      const config = DRAFT_CONFIG[tab.type];
      if (config) {
        const dirtyData = getDirtyPlannerData(tab.id, tab.type);
        if (dirtyData) {
          await saveDraftForTab(tab.id, tab.type, dirtyData);
        }
      }
    }
    closeAllTabSet.forEach(t => executeTabClose(t.id));
    if (closeAllTargetLabel === 'all tabs') {
      setSplitView({ isActive: false, leftTabId: null, rightTabId: null, activePaneId: 'left' });
      setTabs([]);
      setActiveTabId(null);
      localStorage.removeItem('dashboard-tabs');
      localStorage.removeItem('dashboard-active-tab');
      localStorage.removeItem('dashboard-split-view');
    }
    setShowCloseAllDialog(false);
  }, [closeAllTabSet, closeAllTargetLabel, getDirtyPlannerData, saveDraftForTab, executeTabClose]);

  const handleCloseAllDiscardAll = useCallback(() => {
    // Close everything without saving
    closeAllTabSet.forEach(t => executeTabClose(t.id));
    if (closeAllTargetLabel === 'all tabs') {
      setSplitView({ isActive: false, leftTabId: null, rightTabId: null, activePaneId: 'left' });
      setTabs([]);
      setActiveTabId(null);
      localStorage.removeItem('dashboard-tabs');
      localStorage.removeItem('dashboard-active-tab');
      localStorage.removeItem('dashboard-split-view');
    }
    setShowCloseAllDialog(false);
  }, [closeAllTabSet, closeAllTargetLabel, executeTabClose]);

  const handleCloseAllOnlySafe = useCallback(() => {
    // Close only tabs that don't have drafts or active generations
    closeAllTabSet.forEach(tab => {
      const hasDraft = DRAFT_CONFIG[tab.type] && getDirtyPlannerData(tab.id, tab.type);
      const isBusy = isTabWorking(tab.id);
      if (!hasDraft && !isBusy) {
        executeTabClose(tab.id);
      }
    });
    setShowCloseAllDialog(false);
  }, [closeAllTabSet, getDirtyPlannerData, isTabWorking, executeTabClose]);

  const handleCloseAllCancel = useCallback(() => {
    setShowCloseAllDialog(false);
  }, []);

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

  // Handle Auto-Close Tabs on App Exit + auto-save dirty drafts + active generation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Warn if any generations are still running
      const busyTabs = tabs.filter(t => isTabWorking(t.id));
      if (busyTabs.length > 0) {
        e.preventDefault();
        // Modern browsers show a generic message, but setting returnValue is required
        e.returnValue = 'You have active generations in progress. Are you sure you want to leave?';
      }

      // Auto-save any dirty planner/generator tabs as drafts
      tabs.forEach(tab => {
        const config = DRAFT_CONFIG[tab.type];
        if (!config) return;
        const dirtyData = getDirtyPlannerData(tab.id, tab.type);
        if (dirtyData) {
          // Use sendBeacon for reliable saving during unload
          const draft = {
            id: `draft_${tab.id}_${Date.now()}`,
            title: dirtyData.title,
            timestamp: new Date().toISOString(),
            plannerType: dirtyData.plannerType,
            formData: dirtyData.formData,
            step: dirtyData.step,
            curriculumMatches: dirtyData.curriculumMatches,
          };
          navigator.sendBeacon(
            'http://localhost:8000/api/lesson-drafts',
            new Blob([JSON.stringify(draft)], { type: 'application/json' })
          );
        }
      });

      if (settings.autoCloseTabsOnExit) {
        localStorage.removeItem('dashboard-tabs');
        localStorage.removeItem('dashboard-active-tab');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [settings.autoCloseTabsOnExit, tabs, getDirtyPlannerData, isTabWorking]);

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
    window.addEventListener('profile-image-changed', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profile-image-changed', handleStorageChange);
    };
  }, []);

  const updateTabData = useCallback((tabId: string, data: Partial<Tab['data']>) => {
    setTabs(prev => prev.map(tab =>
      tab.id === tabId ? { ...tab, data: { ...tab.data, ...data } } : tab
    ));
  }, []);

  const updateTabTitle = useCallback((tabId: string, title: string) => {
    setTabs(prev => prev.map(tab =>
      tab.id === tabId ? { ...tab, title } : tab
    ));
  }, []);

  // Stable per-tab callback refs — avoids creating new closures on every render
  const tabCallbacksRef = useRef<Map<string, {
    onDataChange: (data: any) => void;
    onTitleChange: (title: string) => void;
  }>>(new Map());

  const getTabCallbacks = useCallback((tabId: string) => {
    let cbs = tabCallbacksRef.current.get(tabId);
    if (!cbs) {
      cbs = {
        onDataChange: (data: any) => updateTabData(tabId, data),
        onTitleChange: (title: string) => updateTabTitle(tabId, title),
      };
      tabCallbacksRef.current.set(tabId, cbs);
    }
    return cbs;
  }, [updateTabData, updateTabTitle]);

  const triggerTabBounce = useCallback((tabId: string) => {
    setBouncingTabId(tabId);
    setTimeout(() => setBouncingTabId(null), 300);
  }, []);

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
    const groupTabs = tabs.filter(tab => tab.type === type);
    const toolName = getToolName(type);
    setContextMenu(null);
    initiateCloseAll(groupTabs, `${toolName} tabs`);
  };


  const typeToToolType: { [key: string]: string } = useMemo(() => ({
    'lesson': 'lesson-planner',
    'quiz': 'quiz-generator',
    'worksheet': 'worksheet-generator',
    'rubric': 'rubric-generator',
    'kindergarten': 'kindergarten-planner',
    'multigrade': 'multigrade-planner',
    'cross-curricular': 'cross-curricular-planner',
    'images': 'image-studio'
  }), []);

  const handleViewResource = useCallback((type: string, resource: Resource) => {
    const toolType = typeToToolType[type];
    if (!toolType) { console.error('Unknown resource type:', type); return; }
    const tool = tools.find(t => t.type === toolType);
    if (!tool) { console.error('Could not find tool for type:', toolType); return; }

    const newTab: Tab = {
      id: `${tool.type}-${Date.now()}`,
      title: `${t('dashboard.viewing')} ${resource.title.substring(0, 20)}...`,
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
        startInEditMode: false,
        ...(type === 'images' && { initialTab: 'editor', imageId: resource.id, imageUrl: resource.imageUrl })
      }
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [typeToToolType]);

  const handleEditResource = useCallback((type: string, resource: Resource) => {
    const toolType = typeToToolType[type];
    if (!toolType) { console.error('Unknown resource type:', type); return; }
    const tool = tools.find(t => t.type === toolType);
    if (!tool) { console.error('Could not find tool for type:', toolType); return; }

    const newTab: Tab = {
      id: `${tool.type}-${Date.now()}`,
      title: `${t('dashboard.editing')} ${resource.title.substring(0, 20)}...`,
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
        startInEditMode: true,
        ...(type === 'images' && { initialTab: 'editor', imageId: resource.id, imageUrl: resource.imageUrl })
      }
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [typeToToolType]);

  const renderSingleTabContent = (tab: Tab, isActive: boolean) => {
    const { onDataChange, onTitleChange } = getTabCallbacks(tab.id);
    const content = (() => { switch (tab.type) {
      case 'analytics':
        return (
          <>
            <AnalyticsDashboard
              tabId={tab.id}
              savedData={tab.data}
              onDataChange={onDataChange}
              isActive={isActive}
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
                      title: tn(tool),
                      toolId: tool.id,
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
        return <CurriculumTracker tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} />;
      case 'chat':
        return (
          <Chat
            tabId={tab.id}
            savedData={tab.data}
            onDataChange={onDataChange}
            onTitleChange={onTitleChange}
            isActive={isActive}
            onPanelClick={() => setSidebarOpen(false)}
            onOpenCurriculumTab={(route: string) => {
              const existingCurriculumTab = tabs.find(t => t.type === 'curriculum' && t.active);
              if (existingCurriculumTab) {
                updateTabData(existingCurriculumTab.id, { currentPath: route });
                setActiveTabId(existingCurriculumTab.id);
              } else {
                const anyCurriculumTab = tabs.find(t => t.type === 'curriculum');
                if (anyCurriculumTab) {
                  setTabs(prev => prev.map(t => ({
                    ...t,
                    active: t.id === anyCurriculumTab.id
                  })));
                  updateTabData(anyCurriculumTab.id, { currentPath: route });
                  setActiveTabId(anyCurriculumTab.id);
                } else {
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
      case 'curriculum':
        return (
          <CurriculumViewer
            tabId={tab.id}
            savedData={tab.data}
            onDataChange={onDataChange}
            onPanelClick={() => setSidebarOpen(false)}
            isActive={isActive}
          />
        );
      case 'resource-manager':
        return (
          <div className="h-full relative" data-tutorial="resource-welcome">
            <ResourceManager
              tabId={tab.id}
              savedData={tab.data}
              onDataChange={onDataChange}
              onViewResource={handleViewResource}
              onEditResource={handleEditResource}
              isActive={isActive}
              tabColors={Object.fromEntries(
                Object.entries(tabColors).map(([type, colors]) => [type, colors.border])
              )}
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
            onDataChange={onDataChange}
            isActive={isActive}
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
        return <KindergartenPlanner tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} />;
      case 'multigrade-planner':
        return <MultigradePlanner tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} />;
      case 'cross-curricular-planner':
        return <CrossCurricularPlanner tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} />;
      case 'quiz-generator':
        return <QuizGenerator tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} />;
      case 'rubric-generator':
        return <RubricGenerator tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} />;
      case 'worksheet-generator':
        return <WorksheetGenerator
          tabId={tab.id}
          savedData={tab.data}
          onDataChange={onDataChange}
          isActive={isActive}
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
        return <ImageStudio tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} />;
      case 'presentation-builder':
        return <PresentationBuilder tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} />;
      case 'storybook':
        return <StoryBookCreator tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} />;
      case 'settings':
        return <Settings tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} onNavigateToTool={(toolType) => { const tool = tools.find(t => t.type === toolType); if (tool) openTool(tool); }} />;
      case 'class-management':
        return <ClassManagement tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} />;
      case 'support':
        return <SupportReporting tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} initialScreenshot={tab.data?.initialScreenshot || null} />;
      case 'achievements':
        return <Achievements tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} />;
      case 'performance-metrics':
        return <PerformanceMetrics tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} />;
      case 'educator-insights':
        return <EducatorInsights tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} onNavigateToTool={(toolType) => { const tool = tools.find(t => t.type === toolType); if (tool) openTool(tool); }} />;
      case 'photo-transfer':
        return <PhotoReceiver tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} />;
      case 'school-year-calendar':
        return <SchoolYearHub tabId={tab.id} savedData={tab.data} onDataChange={onDataChange} isActive={isActive} />;
      case 'brain-dump':
        return (
          <BrainDump
            tabId={tab.id}
            savedData={tab.data}
            onDataChange={onDataChange}
            isActive={isActive}
            onCreateTab={(toolType, prefillData) => {
              const tool = tools.find(t => t.type === toolType);
              if (tool) {
                // Normalize brain dump details into formData fields that target components expect
                const formData = prefillData ? (() => {
                  const fd: Record<string, any> = { ...prefillData };
                  // AI returns "grade" but components expect "gradeLevel"
                  if (fd.grade && !fd.gradeLevel) {
                    fd.gradeLevel = fd.grade;
                    delete fd.grade;
                  }
                  // AI returns "grades" for multigrade — map to gradeRange
                  if (fd.grades && !fd.gradeRange) {
                    fd.gradeRange = Array.isArray(fd.grades) ? fd.grades.join(', ') : fd.grades;
                    delete fd.grades;
                  }
                  // AI returns "subjects" for cross-curricular — map to supportingSubjects
                  if (fd.subjects && !fd.supportingSubjects) {
                    fd.supportingSubjects = Array.isArray(fd.subjects) ? fd.subjects.join(', ') : fd.subjects;
                    delete fd.subjects;
                  }
                  // AI returns "questionCount" — map to numberOfQuestions for quiz
                  if (fd.questionCount && !fd.numberOfQuestions) {
                    fd.numberOfQuestions = String(fd.questionCount);
                  }
                  // AI returns "description" for image-studio — keep as-is
                  // Map "topic" to "lessonTopic" for kindergarten planner
                  if (toolType === 'kindergarten-planner' && fd.topic && !fd.lessonTopic) {
                    fd.lessonTopic = fd.topic;
                  }
                  // Map "topic" to "assignmentTitle" for rubric if no title
                  if (toolType === 'rubric-generator' && fd.topic && !fd.assignmentTitle) {
                    fd.assignmentTitle = fd.topic;
                  }
                  return fd;
                })() : undefined;

                const tabData = formData ? { formData } : undefined;
                const existingTab = tabs.find(t => t.type === toolType);
                if (existingTab && tabData) {
                  // Replace existing tab with new id so component remounts with fresh prefill data
                  const newId = `tab-${Date.now()}`;
                  setTabs(prev => prev.map(t => t.id === existingTab.id
                    ? { ...t, id: newId, active: true, data: tabData }
                    : { ...t, active: false }
                  ));
                  setActiveTabId(newId);
                } else if (existingTab) {
                  // No prefill data, just switch to existing tab
                  setTabs(prev => prev.map(t => ({ ...t, active: t.id === existingTab.id })));
                  setActiveTabId(existingTab.id);
                } else {
                  const newTab: Tab = {
                    id: `tab-${Date.now()}`,
                    title: tn(tool),
                    toolId: tool.id,
                    type: tool.type as Tool['type'],
                    active: true,
                    data: tabData
                  };
                  setTabs(prev => [...prev.map(t => ({ ...t, active: false })), newTab]);
                  setActiveTabId(newTab.id);
                }
              }
            }}
          />
        );
      default:
        return null;
    }
    })();
    return content ? <TabIdProvider tabId={tab.id}>{content}</TabIdProvider> : null;
  };

  const renderTabContent = () => {
    const isSplit = splitView.isActive && splitView.leftTabId && splitView.rightTabId;

    // Validate split tabs still exist
    if (isSplit) {
      const leftTab = tabs.find(t => t.id === splitView.leftTabId);
      const rightTab = tabs.find(t => t.id === splitView.rightTabId);
      if (!leftTab || !rightTab) {
        setSplitView({ isActive: false, leftTabId: null, rightTabId: null, activePaneId: 'left' });
        return null;
      }
    }

    // Compute split-mode styling values
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '96, 165, 250';
    };

    let activePaneColor = '#60a5fa';
    if (isSplit) {
      const activeTabInPane = tabs.find(t => t.id === (splitView.activePaneId === 'left' ? splitView.leftTabId : splitView.rightTabId));
      if (activeTabInPane) {
        activePaneColor = settings.tabColors[activeTabInPane.type as keyof typeof settings.tabColors] || '#60a5fa';
      }
    }

    // Always render ALL tabs through a single tabs.map() with consistent keys.
    // This prevents React from unmounting/remounting components when toggling split view.
    // Only CSS changes between normal and split modes.
    return (
      <div
        className={isSplit ? 'flex h-full gap-1 p-1' : ''}
        style={isSplit ? { backgroundColor: 'var(--tab-content-bg)' } : undefined}
        data-tutorial={isSplit ? 'split-view-demo' : undefined}
      >
        {tabs.map(tab => {
          if (!isSplit) {
            // Normal mode: absolute positioned, show/hide by display
            const isTabActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                className="absolute inset-0"
                style={{ display: isTabActive ? 'block' : 'none' }}
              >
                <React.Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-pulse text-theme-muted">{t('common.loading')}</div></div>}>
                  <TabPanel tab={tab} isActive={isTabActive} renderContent={renderSingleTabContent} />
                </React.Suspense>
              </div>
            );
          }

          // Split mode
          const isLeft = tab.id === splitView.leftTabId;
          const isRight = tab.id === splitView.rightTabId;

          if (!isLeft && !isRight) {
            // Hidden tab — keep mounted but invisible
            return (
              <div key={tab.id} style={{ display: 'none' }}>
                <React.Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-pulse text-theme-muted">{t('common.loading')}</div></div>}>
                  <TabPanel tab={tab} isActive={false} renderContent={renderSingleTabContent} />
                </React.Suspense>
              </div>
            );
          }

          const paneId: 'left' | 'right' = isLeft ? 'left' : 'right';
          const isActivePane = splitView.activePaneId === paneId;

          return (
            <div
              key={tab.id}
              className={`flex-1 overflow-hidden relative ${isActivePane ? 'active-pane-glow' : ''}`}
              onFocus={() => {
                if (splitView.activePaneId !== paneId) {
                  setSplitView(prev => ({ ...prev, activePaneId: paneId }));
                }
              }}
              tabIndex={-1}
              style={isActivePane ? {
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
              <React.Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-pulse text-theme-muted">{t('common.loading')}</div></div>}>
                <TabPanel tab={tab} isActive={true} renderContent={renderSingleTabContent} />
              </React.Suspense>
            </div>
          );
        })}
      </div>
    );
  };

  const groupedTabs = useMemo(() => tabs.reduce((acc, tab) => {
    if (!acc[tab.type]) acc[tab.type] = [];
    acc[tab.type].push(tab);
    return acc;
  }, {} as { [key: string]: Tab[] }), [tabs]);

  // Group tools by category — reactive to per-child visibility settings
  const lessonPlannerTools = useMemo(() => tools.filter(tl => tl.group === 'lesson-planners' && isToolChildEnabled('lesson-planners', tl.type)), [tools, settings.sidebarOrder]);
  const visualStudioTools = useMemo(() => tools.filter(tl => tl.group === 'visual-studio' && isToolChildEnabled('visual-studio', tl.type)), [tools, settings.sidebarOrder]);
  const planningPrepTools = useMemo(() => tools.filter(tl => tl.group === 'planning-prep' && isToolChildEnabled('planning-prep', tl.type)), [tools, settings.sidebarOrder]);
  const assessmentToolsList = useMemo(() => tools.filter(tl => tl.group === 'assessment-tools' && isToolChildEnabled('assessment-tools', tl.type)), [tools, settings.sidebarOrder]);
  const myClassroomTools = useMemo(() => tools.filter(tl => tl.group === 'my-classroom' && isToolChildEnabled('my-classroom', tl.type)), [tools, settings.sidebarOrder]);

  // Small component to evaluate nudges when active tab changes
  const NudgeEvaluator: React.FC = () => {
    const { evaluateNudges } = useNudge();
    useEffect(() => {
      const activeTab = tabs.find(t => t.id === activeTabId);
      if (activeTab) evaluateNudges(activeTab.type);
    }, [activeTabId, evaluateNudges]);
    return null;
  };

  return (
    <NudgeProvider onEnableModule={(tabType) => openToolByTypeRef.current(tabType)}>
    <AchievementProvider teacherId={user.id}>
    <AchievementUnlockModalBridge />
    <NudgeEvaluator />
    <div
      className="flex h-screen bg-[#f5f5f0] dark:bg-[#2b2b2b]"
      onClick={() => setContextMenu(null)}
      data-generation-active={activeStreams.length > 0 || queueActiveCount > 0 ? 'true' : 'false'}
    >
      {/* Context Menu */}
      {contextMenu && contextMenu.groupType && (
        <div
          className="fixed rounded-lg py-2 z-50 widget-glass"
          style={{ left: contextMenu.x, top: contextMenu.y + 20}}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">{t('dashboard.groupActions')}</div>
          <button
            onClick={() => closeGroupTabs(contextMenu.groupType!)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 flex items-center space-x-2 dark:text-gray-300 dark:hover:bg-red-900 dark:hover:text-red-400"
          >
            <X className="w-4 h-4" />
            <span>{t('dashboard.closeAllTabs', { name: (() => { const tool = tools.find(tl => tl.type === contextMenu.groupType); return tool ? tn(tool) : ''; })() })}</span>
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
          width: sidebarOpen ? '260px' : '72px',
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
                    <img loading="lazy"
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
                      <img loading="lazy" src={userProfileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h2 className="text-sm font-bold" style={{ letterSpacing: '0.01em', lineHeight: '1.3' }}>{t('sidebar.header')}</h2>
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
              padding: sidebarOpen ? `${lessonPlannerExpanded || visualStudioExpanded || planningPrepExpanded || assessmentToolsExpanded || myClassroomExpanded ? '10px' : '36px'} 12px 6px` : '36px 0 6px',
              transition: 'padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {t('sidebar.tools')}
          </div>

          {/* === Dynamic Sidebar rendered from sidebarOrder === */}
          {(() => {
            // Compute next suggested tool for progression dot indicator
            const enabledModules = settings.tutorials.enabledModules || [];
            const nextSuggestion = getNextSuggestion(
              enabledModules,
              settings.workflowProgress?.visitedTools || [],
              settings.workflowProgress?.dismissedProgressions || [],
            );
            const nextStepType = nextSuggestion?.type || null;

            // Helper: render a single tool button
            const renderToolButton = (tool: Tool, dataTutorial?: string) => {
              const Icon = iconMap[tool.icon];
              const count = getTabCountByType(tool.type);
              const activeTab = tabs.find(t => t.id === activeTabId);
              const isActiveToolType = activeTab?.type === tool.type;
              const toolColor = settings.tabColors[tool.type as keyof typeof settings.tabColors] || (tabColors[tool.type]?.border);
              const isSingle = SINGLE_INSTANCE_TABS.has(tool.type);
              const maxForTool = isSingle ? 1 : MAX_TABS_PER_TYPE;
              const isNextStep = nextStepType === tool.type;
              return (
                <button
                  key={tool.id}
                  data-tool-type={tool.type}
                  data-tutorial={dataTutorial}
                  onClick={() => openTool(tool)}
                  className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} glass-nav-item transition group`}
                  title={!sidebarOpen ? `${tn(tool)}${!isSingle && tool.type !== 'analytics' && !HIDE_TAB_COUNTER.has(tool.type) ? ` (${count}/${maxForTool} open)` : ''}` : ''}
                  style={{ backgroundColor: isActiveToolType ? 'var(--sidebar-active)' : 'transparent', transition: 'background-color 0.25s, box-shadow 0.25s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; const icon = e.currentTarget.querySelector('.sidebar-icon') as HTMLElement; if (icon && !isActiveToolType && toolColor) { icon.style.color = toolColor; icon.style.filter = 'drop-shadow(0 0 8px currentColor)'; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isActiveToolType ? 'var(--sidebar-active)' : 'transparent'; const icon = e.currentTarget.querySelector('.sidebar-icon') as HTMLElement; if (icon && !isActiveToolType) { icon.style.color = 'var(--sidebar-text-muted)'; icon.style.filter = ''; } }}
                >
                  <div className="relative flex-shrink-0">
                    <Icon className={`w-5 h-5 sidebar-icon ${isActiveToolType ? 'icon-glow' : ''}`} style={{ color: isActiveToolType && toolColor ? toolColor : 'var(--sidebar-text-muted)', transition: 'color 0.25s, filter 0.25s' }} />
                    {isNextStep && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />}
                  </div>
                  <div className="flex-1 text-left overflow-hidden" style={{ opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)', pointerEvents: sidebarOpen ? 'auto' : 'none' }}>
                    <p className="text-sm font-medium whitespace-nowrap overflow-hidden" style={{ maskImage: 'linear-gradient(to right, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)' }}>{tn(tool)}</p>
                    {!isSingle && count > 0 && tool.type !== 'analytics' && !HIDE_TAB_COUNTER.has(tool.type) && (<p className="text-xs whitespace-nowrap" style={{ color: 'var(--sidebar-text-muted)' }}>{count}/{maxForTool} open</p>)}
                  </div>
                </button>
              );
            };

            // Helper: render a collapsible group (lesson-planners or visual-studio)
            const renderGroup = (groupId: string, label: string, groupTools: Tool[], expanded: boolean, setExpanded: (v: boolean) => void, defaultIcon: React.ElementType) => {
              const activeTab = tabs.find(t => t.id === activeTabId);
              const activeGroupTool = !sidebarOpen && activeTab ? groupTools.find(t => t.type === activeTab.type) : null;
              const GroupIcon = activeGroupTool ? iconMap[activeGroupTool.icon] : defaultIcon;
              const groupToolColor = activeGroupTool ? settings.tabColors[activeGroupTool.type as keyof typeof settings.tabColors] : undefined;
              const expandedActiveColor = sidebarOpen && activeTab ? (() => { const match = groupTools.find(t => t.type === activeTab.type); return match ? settings.tabColors[match.type as keyof typeof settings.tabColors] : undefined; })() : undefined;
              return (
                <div className="mt-2" data-tutorial={groupId === 'lesson-planners' ? 'lesson-planners-group' : undefined} key={groupId}>
                  <button
                    onClick={() => setExpanded(!expanded)}
                    data-tutorial-click={groupId === 'lesson-planners' ? 'lesson-planners-group' : undefined}
                    className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} glass-nav-item transition`}
                    title={!sidebarOpen ? (activeGroupTool ? tn(activeGroupTool) : label) : ''}
                    style={{ backgroundColor: expandedActiveColor ? `${expandedActiveColor}18` : 'transparent', transition: 'background-color 0.25s, box-shadow 0.25s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = expandedActiveColor ? `${expandedActiveColor}18` : 'transparent'; }}
                  >
                    <GroupIcon className={`w-5 h-5 flex-shrink-0 ${sidebarOpen ? '' : 'mx-auto'} ${activeGroupTool ? 'icon-glow' : ''}`} style={{ color: activeGroupTool && groupToolColor ? groupToolColor : 'var(--sidebar-text-muted)', transition: 'color 0.3s, filter 0.3s' }} />
                    <div className="flex-1 text-left overflow-hidden" style={{ opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)', pointerEvents: sidebarOpen ? 'auto' : 'none' }}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1" style={{ maskImage: 'linear-gradient(to right, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)' }}>{label}</p>
                        <ChevronDown className="w-4 h-4 text-gray-400 chevron-icon ml-2 flex-shrink-0" style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                      </div>
                    </div>
                  </button>
                  <div className="ml-4 mt-2 space-y-1 border-l-2 pl-2" style={{ borderColor: 'var(--sidebar-border)', opacity: expanded && sidebarOpen ? 1 : 0, transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)', pointerEvents: expanded && sidebarOpen ? 'auto' : 'none', maxHeight: expanded && sidebarOpen ? '500px' : '0', overflow: 'hidden' }}>
                    {groupTools.map((tool) => {
                      const Icon = iconMap[tool.icon];
                      const count = getTabCountByType(tool.type);
                      const at = tabs.find(t => t.id === activeTabId);
                      const isActive = at?.type === tool.type;
                      const tc = settings.tabColors[tool.type as keyof typeof settings.tabColors];
                      const isLocked = false;
                      const isChildNextStep = nextStepType === tool.type;
                      return (
                        <button key={tool.id} data-tool-type={tool.type} onClick={() => openTool(tool)} className="w-full flex items-center space-x-2 p-2 rounded-lg transition text-sm" style={{ backgroundColor: isActive ? 'var(--sidebar-active)' : 'transparent', opacity: isLocked ? 0.5 : 1, transition: 'background-color 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; const ic = e.currentTarget.querySelector('.sidebar-icon') as HTMLElement; if (ic && !isActive && tc) { ic.style.color = tc; ic.style.filter = 'drop-shadow(0 0 8px currentColor)'; } }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isActive ? 'var(--sidebar-active)' : 'transparent'; const ic = e.currentTarget.querySelector('.sidebar-icon') as HTMLElement; if (ic && !isActive) { ic.style.color = 'var(--sidebar-text-muted)'; ic.style.filter = ''; } }}
                          title={isLocked ? t('dashboard.tier3Required') : tn(tool)}
                        >
                          <div className="relative flex-shrink-0">
                            <Icon className={`w-4 h-4 sidebar-icon ${isActive ? 'icon-glow' : ''}`} style={{ color: isActive && tc ? tc : 'var(--sidebar-text-muted)', transition: 'color 0.25s, filter 0.25s' }} />
                            {isLocked && <HugeiconsIcon icon={SquareLock01IconData} size={10} style={{ position: 'absolute', bottom: -2, right: -3, color: '#a855f7' }} />}
                            {isChildNextStep && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />}
                          </div>
                          <div className="flex-1 text-left overflow-hidden">
                            <p className="text-xs font-medium whitespace-nowrap overflow-hidden" style={{ maskImage: 'linear-gradient(to right, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)' }}>{tn(tool)}</p>
                            {count > 0 && !HIDE_TAB_COUNTER.has(tool.type) && (<p className="text-xs" style={{ color: 'var(--sidebar-text-muted)' }}>{count}/{SINGLE_INSTANCE_TABS.has(tool.type) ? 1 : MAX_TABS_PER_TYPE}</p>)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            };

            // Tool lookup helpers
            const toolById = (id: string) => tools.find(t => t.type === id || t.id === id);
            const tutorialMap: Record<string, string> = { 'analytics': 'tool-analytics', 'chat': 'tool-chat', 'curriculum': 'tool-curriculum', 'quiz-generator': 'tool-quiz', 'rubric-generator': 'tool-rubric' };

            // Render sidebar items
            const elements: React.ReactNode[] = [];

            // 1. Pinned top: analytics + educator insights
            const analyticsTool = toolById('analytics');
            if (analyticsTool) elements.push(renderToolButton(analyticsTool, 'tool-analytics'));
            const insightsTool = toolById('educator-insights');
            if (insightsTool) elements.push(renderToolButton(insightsTool));

            // 2. Reorderable middle from sidebarOrder
            for (const item of settings.sidebarOrder) {
              if (!item.enabled) continue;
              // Skip pinned items (they're rendered separately)
              if (item.id === 'analytics' || item.id === 'educator-insights' || item.id === 'performance-metrics' || item.id === 'support' || item.id === 'settings') continue;

              if (item.id === 'planning-prep') {
                elements.push(renderGroup('planning-prep', t('sidebar.groups.planningPrep'), planningPrepTools, planningPrepExpanded, setPlanningPrepExpanded, Compass));
              } else if (item.id === 'lesson-planners') {
                elements.push(renderGroup('lesson-planners', t('sidebar.groups.lessonPlanners'), lessonPlannerTools, lessonPlannerExpanded, setLessonPlannerExpanded, BookOpen));
              } else if (item.id === 'assessment-tools') {
                elements.push(renderGroup('assessment-tools', t('sidebar.groups.assessmentTools'), assessmentToolsList, assessmentToolsExpanded, setAssessmentToolsExpanded, Target));
              } else if (item.id === 'my-classroom') {
                elements.push(renderGroup('my-classroom', t('sidebar.groups.myClassroom'), myClassroomTools, myClassroomExpanded, setMyClassroomExpanded, School));
              } else if (item.id === 'visual-studio') {
                elements.push(renderGroup('visual-studio', t('sidebar.groups.visualStudio'), visualStudioTools, visualStudioExpanded, setVisualStudioExpanded, Paintbrush));
              } else {
                const tool = toolById(item.id);
                if (tool) elements.push(renderToolButton(tool, tutorialMap[item.id]));
              }
            }

            // 3. Divider before bottom pinned items
            elements.push(<div key="bottom-divider" className="glass-divider" style={{ background: 'linear-gradient(90deg, transparent, var(--sidebar-divider), transparent)' }} />);

            // 4. Pinned bottom: performance (if enabled) + support (if enabled) + settings
            const perfItem = settings.sidebarOrder.find(i => i.id === 'performance-metrics');
            if (perfItem?.enabled) {
              const perfTool = toolById('performance-metrics');
              if (perfTool) elements.push(<div key="perf-wrapper" className="mt-2">{renderToolButton(perfTool)}</div>);
            }
            const supportItem = settings.sidebarOrder.find(i => i.id === 'support');
            if (supportItem?.enabled !== false) {
              const st = toolById('support');
              if (st) elements.push(<div key="support-wrapper" className="mt-2">{renderToolButton(st)}</div>);
            }
            const settingsTl = toolById('settings');
            if (settingsTl) {
              const SettIcon = iconMap[settingsTl.icon];
              const at = tabs.find(t => t.id === activeTabId);
              const isActiveSt = at?.type === settingsTl.type;
              const settingsColor = settings.tabColors['settings'] ?? '#64748b';
              elements.push(
                <div key="settings-wrapper" className="mt-2">
                  <button
                    data-tool-type={settingsTl.type}
                    onClick={() => openTool(settingsTl)}
                    className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-3'} glass-nav-item transition group`}
                    title={!sidebarOpen ? tn(settingsTl) : ''}
                    style={{ backgroundColor: isActiveSt ? 'var(--sidebar-active)' : 'transparent', transition: 'background-color 0.25s, box-shadow 0.25s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; const icon = e.currentTarget.querySelector('.sidebar-icon') as HTMLElement; if (icon && !isActiveSt) { icon.style.color = settingsColor; icon.style.filter = 'drop-shadow(0 0 8px currentColor)'; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isActiveSt ? 'var(--sidebar-active)' : 'transparent'; const icon = e.currentTarget.querySelector('.sidebar-icon') as HTMLElement; if (icon && !isActiveSt) { icon.style.color = 'var(--sidebar-text-muted)'; icon.style.filter = ''; } }}
                  >
                    <SettIcon className={`w-5 h-5 flex-shrink-0 sidebar-icon ${isActiveSt ? 'icon-glow' : ''}`} style={{ color: isActiveSt ? settingsColor : 'var(--sidebar-text-muted)', transition: 'color 0.25s, filter 0.25s' }} />
                    <div className="flex-1 text-left overflow-hidden" style={{ opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)', pointerEvents: sidebarOpen ? 'auto' : 'none' }}>
                      <p className="text-sm font-medium whitespace-nowrap overflow-hidden" style={{ maskImage: 'linear-gradient(to right, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)' }}>{tn(settingsTl)}</p>
                    </div>
                  </button>
                </div>
              );
            }

            return <>{elements}</>;
          })()}
        </div>

        {/* Engine status indicator */}
        <div
          style={{
            borderTop: '1px solid var(--sidebar-border)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          title={!sidebarOpen ? indicators.map(i => `${i.label}: ${statusLabel(i.status)}`).join(' | ') : ''}
        >
          {sidebarOpen ? (
            multiMode ? (
              /* Multi-indicator: Brain [dot] | Scanner [dot] | Studio [dot] */
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {indicators.map((ind, idx) => (
                  <React.Fragment key={ind.label}>
                    {idx > 0 && (
                      <span style={{ color: 'var(--sidebar-border, #374151)', fontSize: '12px', userSelect: 'none' }}>|</span>
                    )}
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: statusColor(ind.status),
                        whiteSpace: 'nowrap',
                      }}>
                        {ind.label}
                      </span>
                      <span style={{
                        display: 'inline-block',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        flexShrink: 0,
                        backgroundColor: statusColor(ind.status),
                        boxShadow: statusGlow(ind.status),
                        animation: statusPulse(ind.status),
                      }} />
                    </span>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              /* Single indicator: [dot] Engine Online */
              <>
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    backgroundColor: statusColor(engineStatus),
                    boxShadow: statusGlow(engineStatus),
                    animation: statusPulse(engineStatus),
                  }}
                />
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    color: statusColor(engineStatus),
                  }}
                >
                  {engineStatus === 'online' ? 'Engine Online' : engineStatus === 'starting' ? 'Engine Starting' : engineStatus === 'checking' ? 'Checking...' : 'Engine Offline'}
                </span>
              </>
            )
          ) : (
            /* Sidebar collapsed: dots stacked vertically */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
              {indicators.map(ind => (
                <span
                  key={ind.label}
                  title={`${ind.label}: ${statusLabel(ind.status)}`}
                  style={{
                    display: 'inline-block',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: statusColor(ind.status),
                    boxShadow: statusGlow(ind.status),
                    animation: statusPulse(ind.status),
                  }}
                />
              ))}
            </div>
          )}
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
                    className={`edge-tab group ${bouncingTabId === tab.id ? 'edge-tab-bounce' : ''} ${completedTabIds.has(tab.id) ? 'edge-tab-done-pulse' : ''}`}
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
                    {isTabWorking(tab.id) && <div className="edge-tab-generating-dot" />}
                    <span
                      className="edge-tab-label"
                      style={{
                        color: isActive ? '#fff' : undefined,
                        fontWeight: isActive ? 600 : 400,
                        maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)'
                      }}
                    >
                      {getTabLabel(tab)}
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
                    className={`edge-tab-group group ${bouncingTabId === `${type}-group` ? 'edge-tab-group-bounce' : ''} ${groupTabs.some(t => completedTabIds.has(t.id)) ? 'edge-tab-done-pulse' : ''}`}
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
                    title={t('dashboard.rightClickOptions')}
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
                    {groupTabs.some(t => isTabWorking(t.id)) && <div className="edge-tab-generating-dot" />}
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
                      {(() => { const tl = tools.find(tl => tl.type === type); return tl ? tn(tl) : ''; })()}
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
                          className={`edge-tab group ${bouncingTabId === tab.id ? 'edge-tab-bounce' : ''} ${completedTabIds.has(tab.id) ? 'edge-tab-done-pulse' : ''}`}
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
                          {isTabWorking(tab.id) && <div className="edge-tab-generating-dot" />}
                          <span
                            className="edge-tab-label"
                            style={{
                              color: isTabActive ? '#fff' : undefined,
                              fontWeight: isTabActive ? 600 : 400,
                              fontSize: '0.75rem',
                              maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
                              WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)'
                            }}
                          >
                            {getTabLabel(tab)}
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
                    : 'hover:bg-white/10 text-gray-300 light-tab-icon'
                }`}
                title={splitView.isActive ? t('dashboard.exitSplitView') : t('dashboard.enterSplitView')}
              >
                <Columns className="w-5 h-5" />
              </button>

            )}
            
            {tabs.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  initiateCloseAll([...tabs], 'all tabs');
                }}
                data-tutorial="close-all-tabs"
                className="p-2 rounded-lg hover:bg-red-500/20 transition group flex-shrink-0 border border-red-400/30"
                title={t('dashboard.closeAllTabsExit')}
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
                className="relative p-2 rounded-lg hover:bg-white/10 transition text-gray-300 light-tab-icon flex-shrink-0"
                title={t('dashboard.notifications')}
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
                  <LightRays
                    raysOrigin="top-center"
                    raysColor="#ffffff"
                    raysSpeed={1}
                    lightSpread={0.5}
                    rayLength={3}
                    followMouse={true}
                    mouseInfluence={0.1}
                    noiseAmount={0}
                    distortion={0}
                    pulsating={false}
                    fadeDistance={1}
                    saturation={1}
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
                    <img loading="lazy"
                      src={OECS_LOGO_BASE64}
                      alt="OECS"
                      className="mx-auto mb-6 w-28 h-28 object-contain oecs-logo-pulse"
                      style={{
                        filter: isDarkMode ? 'drop-shadow(0 4px 24px rgba(77,168,46,0.3))' : 'drop-shadow(0 4px 24px rgba(29,54,45,0.15))'
                      }}
                    />

                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{
                        color: isDarkMode ? 'rgba(255,255,255,0.92)' : 'rgba(29,54,45,0.95)',
                        letterSpacing: '-0.02em',
                        textShadow: isDarkMode ? 'none' : '0 1px 2px rgba(255,255,255,0.5)'
                      }}
                    >
                      {t('dashboard.welcomeTitle')}
                    </h3>
                    <p
                      className="text-sm mb-8"
                      style={{ color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(29,54,45,0.6)' }}
                    >
                      {t('dashboard.welcomeSubtitle')}
                    </p>

                    <RotatingQuickLinks
                      isDarkMode={isDarkMode}
                      onOpenTool={(type) => {
                        const tool = tools.find(t => t.type === type);
                        if (tool) openTool(tool);
                      }}
                    />

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
        steps={getDashboardWalkthroughSteps(t)}
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
          onStickyNote={() => setFabPanelOpen(!fabPanelOpen)}
          stickyNoteCount={openNoteIds.length}
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
          onStickyNote={() => setFabPanelOpen(!fabPanelOpen)}
          stickyNoteCount={openNoteIds.length}
          position="bottom-right"
        />
      );
    }

    // Otherwise, use the mapped tutorial for the tab type, or fallback to dashboard tutorial
    const tutorialId = tutorialIdsByTabType[activeTab.type] || TUTORIAL_IDS.DASHBOARD_MAIN;

    return (
      <TutorialButton
        tutorialId={tutorialId as TutorialId}
        onStartTutorial={() => startTutorial(tutorialId as TutorialId)}
        onOpenSearch={() => setCommandPaletteOpen(true)}
        onScreenshotTicket={handleScreenshotTicket}
        onStickyNote={() => setFabPanelOpen(!fabPanelOpen)}
        stickyNoteCount={openNoteIds.length}
        position="bottom-right"
      />
    );
  })()}

      {/* Sticky Notes Overlay — renders all visible sticky notes above content */}
      <StickyNoteOverlay activeTabId={activeTabId} />

      {/* Sticky Notes FAB Panel — side popup for managing notes */}
      {fabPanelOpen && (
        <StickyNoteFabPanel
          activeTabId={activeTabId}
          onClose={() => setFabPanelOpen(false)}
        />
      )}

      {showCloseAllDialog && (
        <CloseAllDialog
          summary={closeAllSummary}
          targetLabel={closeAllTargetLabel}
          onSaveAndClose={handleCloseAllSaveAndClose}
          onDiscardAll={handleCloseAllDiscardAll}
          onCloseOnlySafe={handleCloseAllOnlySafe}
          onCancel={handleCloseAllCancel}
        />
      )}
      {showGenerationAlert && (
        <ActiveGenerationDialog
          target={generationAlertTarget}
          activeCount={generationAlertCount}
          onConfirm={handleGenerationAlertConfirm}
          onCancel={handleGenerationAlertCancel}
        />
      )}
      {showDraftDialog && (
        <DraftSaveDialog
          onSaveDraft={handleSaveDraft}
          onDiscard={handleDiscardDraft}
          onCancel={handleCancelDraft}
        />
      )}
    </div>
    </AchievementProvider>
    </NudgeProvider>
  );
};

function AchievementUnlockModalBridge() {
  const { pendingUnlocks, dismissUnlock } = useAchievementContext();
  const [trophySrc, setTrophySrc] = React.useState<string | undefined>(undefined);

  const current = pendingUnlocks.length > 0 ? pendingUnlocks[0] : null;

  // Load trophy image in the background — do NOT block modal display on this
  React.useEffect(() => {
    if (!current) { setTrophySrc(undefined); return; }
    setTrophySrc(undefined);
    const tType = getTrophyType(current.achievement_id);
    if (!tType) return;
    getTrophyImageForTier(tType, (current.tier ?? 'gold') as TrophyTier)
      .then(src => { setTrophySrc(src); })
      .catch(() => {});
  }, [current?.achievement_id, current?.tier]);

  // Show immediately when an achievement is pending — don't wait for the image
  if (!current) return null;

  if (trophySrc) {
    return (
      <TrophyDetailCard
        achievement={current}
        trophyImageSrc={trophySrc}
        earnedAt={current.earned_at}
        onClose={dismissUnlock}
      />
    );
  }

  // AchievementUnlockModal has its own internal image loading — safe to show right away
  return (
    <AchievementUnlockModal
      achievement={current}
      onDismiss={dismissUnlock}
    />
  );
}

export default Dashboard;
