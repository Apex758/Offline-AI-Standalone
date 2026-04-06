import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import UserIconData from '@hugeicons/core-free-icons/UserIcon';
import Camera01IconData from '@hugeicons/core-free-icons/Camera01Icon';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import GraduationScrollIconData from '@hugeicons/core-free-icons/GraduationScrollIcon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import Trophy01IconData from '@hugeicons/core-free-icons/Award01Icon';
import Medal01IconData from '@hugeicons/core-free-icons/Medal01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const User: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UserIconData} {...p} />;
const Camera: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Camera01IconData} {...p} />;
const BookOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookOpen01IconData} {...p} />;
const GraduationCap: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={GraduationScrollIconData} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const Check: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Tick01IconData} {...p} />;
import { useSettings } from '../contexts/SettingsContext';
import { GRADE_LEVELS, SUBJECTS, GRADE_LABEL_MAP, GRADE_VALUE_MAP, getTeacherGrades, getTeacherSubjects, GradeSubjectMapping } from '../data/teacherConstants';
import { useTaskNotifications } from '../hooks/useTaskNotifications';
import { useNotification } from '../contexts/NotificationContext';
import axios from 'axios';
import { format } from 'date-fns';
import TutorialOverlay, { getAnalyticsDashboardSteps } from './TutorialOverlay';
import { milestoneApi } from '../lib/milestoneApi';
import type { MilestoneStats, Milestone } from '../types/milestone';
import type { Task } from '../types/task';
import type { Timeframe, CurriculumView } from '../types/analytics';
import type { Tab } from '../types';
import type { InsightsReport } from '../types/insights';


// ── Module-level API response cache (survives unmount/remount) ──
const API_CACHE_TTL = 60_000; // 60 seconds
let _cachedResources: any[] | null = null;
let _cacheTimestamp = 0;
let _cacheMilestoneStats: MilestoneStats | null = null;
let _cacheUpcomingMilestones: Milestone[] = [];
let _cacheProgressBreakdown: Array<{ grade: string; subject: string; total: number; completed: number; in_progress: number }> = [];
let _cacheTeacherId: string | null = null;

function isCacheValid(teacherId: string | null): boolean {
  return (
    _cachedResources !== null &&
    Date.now() - _cacheTimestamp < API_CACHE_TTL &&
    _cacheTeacherId === teacherId
  );
}

// Import helper functions
import {
  processResourceTrends,
  calculateDistribution,
  calculateToolUsage,
  generateActivityFeed,
  calculateQuickStats
} from '../lib/analyticsHelpers';

// Import new components
import TaskEditModal from './modals/TaskEditModal';
import CalendarModal from './CalendarModal';
import TaskListWidget from './widgets/TaskListWidget';
import CompactCalendar from './widgets/CompactCalendar';
import ChartCarousel from './charts/ChartCarousel';
import CurriculumProgressWidget from './widgets/CurriculumProgressWidget';
import MostUsedTools from './widgets/MostUsedTools';
import RecentActivityTimeline from './widgets/RecentActivityTimeline';
import { useAchievementContext } from '../contexts/AchievementContext';
import MiniTrophyCard from './MiniTrophyCard';
import TrophyDetailCard from './TrophyDetailCard';
import { getTrophyType } from '../config/trophyMap';
import { getTrophyImageForTier, type TrophyTier } from '../assets/trophyImages';
import type { NewlyEarnedAchievement } from '../types/achievement';
import { useRefetchOnActivation } from '../hooks/useRefetchOnActivation';
import { useCurrentPhase } from '../hooks/useCurrentPhase';
import { NeuroSegment } from './ui/NeuroSegment';

interface AnalyticsDashboardProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  onNavigate?: (route: string) => void;
  onCreateTab?: (type: string) => void;
  tabColors?: { [key: string]: string };
  isActive?: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  tabId,
  savedData,
  onDataChange,
  onNavigate,
  onCreateTab,
  tabColors = {},
  isActive = true
}) => {
  const { t } = useTranslation();
  // Achievement data
  const { earned, totalAvailable, showcase, definitions } = useAchievementContext();
  const { settings } = useSettings();
  const { notify } = useNotification();
  // State management
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Teacher');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [allResourcesData, setAllResourcesData] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [testReminders, setTestReminders] = useState<import('../hooks/useTaskNotifications').TestReminder[]>([]);
  const [milestoneStats, setMilestoneStats] = useState<MilestoneStats | null>(null);
  const [upcomingMilestones, setUpcomingMilestones] = useState<Milestone[]>([]);
  const [progressBreakdown, setProgressBreakdown] = useState<Array<{
    grade: string;
    subject: string;
    total: number;
    completed: number;
    in_progress: number;
  }>>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeframe, setTimeframe] = useState<Timeframe>('month');
  const [curriculumView, setCurriculumView] = useState<CurriculumView>('overall');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [showShowcase, setShowShowcase] = useState(settings.showTrophiesByDefault);
  const [viewingTrophy, setViewingTrophy] = useState<NewlyEarnedAchievement | null>(null);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [latestInsightsReport, setLatestInsightsReport] = useState<InsightsReport | null>(null);
  const [dashProgressScope, setDashProgressScope] = useState<'overall' | 'phase'>('overall');
  const [metricsHistory, setMetricsHistory] = useState<import('../types/insights').MetricSnapshot[]>([]);

  // Stable teacherId for hooks
  const dashTeacherId = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) { const u = JSON.parse(raw); return u.username || u.id || 'default_teacher'; }
    } catch {}
    return 'default_teacher';
  }, []);
  const { currentPhase: dashPhase, allPhases: dashAllPhases } = useCurrentPhase(dashTeacherId);

  // Phase progress for summary card
  const [dashPhaseProgress, setDashPhaseProgress] = useState<Array<{ id: string; label: string; key: string; semester: string | null; pct: number }>>([]);
  const [dashUnassignedCount, setDashUnassignedCount] = useState(0);
  useEffect(() => {
    if (dashAllPhases.length === 0) return;
    Promise.all([
      ...dashAllPhases.map(p =>
        axios.get(`http://localhost:8000/api/milestones/${dashTeacherId}/phase-progress?phase_id=${encodeURIComponent(p.id)}`)
          .then(res => ({ id: p.id, label: p.phase_label, key: p.phase_key, semester: p.semester, pct: res.data.sco_pct || 0 }))
          .catch(() => ({ id: p.id, label: p.phase_label, key: p.phase_key, semester: p.semester, pct: 0 }))
      ),
      axios.get(`http://localhost:8000/api/milestones/${dashTeacherId}/unassigned`)
        .then(res => res.data.count || 0)
        .catch(() => 0),
    ]).then(results => {
      const unassigned = results.pop() as number;
      setDashPhaseProgress(results as any);
      setDashUnassignedCount(unassigned);
    });
  }, [dashAllPhases, dashTeacherId]);

  useEffect(() => {
    setShowShowcase(settings.showTrophiesByDefault);
  }, [settings.showTrophiesByDefault]);

  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // Load user profile
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedImage = localStorage.getItem('user-profile-image');
    let teacherId: string | null = null;

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || user.username || 'Teacher');
        teacherId = user.username || user.id || null;
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }

    if (storedImage) {
      setUserImage(storedImage);
    }

    loadAllData(teacherId);
  }, []);

  // Load tasks from file storage
  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (window.electronAPI && window.electronAPI.getTasksData) {
          const storedTasks = await window.electronAPI.getTasksData();
          if (storedTasks && Array.isArray(storedTasks)) {
            setTasks(storedTasks);
          }
        } else {
          // Fallback to localStorage for web version
          const storedTasks = localStorage.getItem('dashboard-tasks');
          if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
          }
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    loadTasks();
  }, []);

  // Load test reminders from backend
  useEffect(() => {
    const loadReminders = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/reminders');
        setTestReminders(res.data);
      } catch (err) {
        console.error('Error loading test reminders:', err);
      }
    };
    loadReminders();
  }, []);

  // Load latest insights report for calendar flip card
  useEffect(() => {
    axios.get('/api/insights/reports')
      .then(res => {
        const reports: InsightsReport[] = res.data;
        if (reports.length > 0) {
          const latest = reports[reports.length - 1];
          setLatestInsightsReport(latest);

          // Fire notifications for insight reminders on dashboard load
          const reminders = latest.reminders || [];
          if (reminders.length === 1) {
            notify(`Insight reminder: ${reminders[0].suggestion}`, 'info');
          } else if (reminders.length > 1) {
            notify(`${reminders.length} areas need attention in your latest insights report`, 'info');
          }
        }
      })
      .catch(() => {});
  }, []);

  // Save tasks to file storage
  useEffect(() => {
    const saveTasks = async () => {
      try {
        if (window.electronAPI && window.electronAPI.saveTasksData) {
          await window.electronAPI.saveTasksData(tasks);
        } else {
          // Fallback to localStorage for web version
          localStorage.setItem('dashboard-tasks', JSON.stringify(tasks));
        }
      } catch (error) {
        console.error('Error saving tasks:', error);
      }
    };

    // Only save if tasks have been loaded (avoid saving empty array on mount)
    if (tasks.length > 0 || (window.electronAPI && window.electronAPI.getTasksData)) {
      saveTasks();
    }
  }, [tasks]);

  const loadAllData = async (teacherId: string | null) => {
    // Use cached data if still fresh (avoids 9 API calls on every tab switch)
    if (isCacheValid(teacherId)) {
      setAllResourcesData(_cachedResources!);
      setMilestoneStats(_cacheMilestoneStats);
      setUpcomingMilestones(_cacheUpcomingMilestones);
      setProgressBreakdown(_cacheProgressBreakdown);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Load resources
      const [lessonPlans, rubrics, quizzes, kindergarten, multigrade, crossCurricular, worksheets, images, presentations] = await Promise.all([
        axios.get('http://localhost:8000/api/lesson-plan-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/rubric-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/quiz-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/kindergarten-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/multigrade-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/cross-curricular-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/worksheet-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/images-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/presentation-history').catch(() => ({ data: [] }))
      ]);

      // Combine all resources with type labels
      const allResources = [
        ...lessonPlans.data.map((r: any) => ({ ...r, type: 'lesson' })),
        ...rubrics.data.map((r: any) => ({ ...r, type: 'rubric' })),
        ...quizzes.data.map((r: any) => ({ ...r, type: 'quiz' })),
        ...kindergarten.data.map((r: any) => ({ ...r, type: 'kindergarten' })),
        ...multigrade.data.map((r: any) => ({ ...r, type: 'multigrade' })),
        ...crossCurricular.data.map((r: any) => ({ ...r, type: 'cross-curricular' })),
        ...worksheets.data.map((r: any) => ({ ...r, type: 'worksheet' })),
        ...images.data.map((r: any) => ({ ...r, type: 'image' })),
        ...presentations.data.map((r: any) => ({ ...r, type: 'presentation' }))
      ];

      setAllResourcesData(allResources);

      // Update cache
      _cachedResources = allResources;
      _cacheTimestamp = Date.now();
      _cacheTeacherId = teacherId;

      // Load milestone stats if teacherId is available
      if (teacherId) {
        try {
          const [stats, milestones, progressData] = await Promise.all([
            milestoneApi.getStats(teacherId),
            milestoneApi.getUpcoming(teacherId, 30),
            milestoneApi.getProgress(teacherId),
          ]);
          setMilestoneStats(stats);
          _cacheMilestoneStats = stats;
          setUpcomingMilestones(milestones);
          _cacheUpcomingMilestones = milestones;
          // Normalize grade labels from DB format ("Grade 2" -> "2", "Kindergarten" -> "K")
          const normalizedBreakdown = (progressData.byGradeSubject || []).map((item: any) => ({
            ...item,
            grade: GRADE_VALUE_MAP[item.grade]?.toUpperCase() || item.grade,
          }));
          setProgressBreakdown(normalizedBreakdown);
          _cacheProgressBreakdown = normalizedBreakdown;
        } catch (e: any) {
          console.error('Error loading milestones:', e?.response?.data || e?.message || e);
          setMilestoneStats(null);
          setProgressBreakdown([]);
          _cacheMilestoneStats = null;
          _cacheProgressBreakdown = [];
        }
      }
      // Load teacher metrics history for the carousel
      try {
        const metricsRes = await axios.get(`http://localhost:8000/api/teacher-metrics/history?teacher_id=${encodeURIComponent(teacherId || 'default_teacher')}`);
        if (Array.isArray(metricsRes.data?.history)) {
          setMetricsHistory(metricsRes.data.history);
        }
      } catch {}
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useRefetchOnActivation(isActive, useCallback(() => {
    const storedUser = localStorage.getItem('user');
    let teacherId: string | null = null;
    if (storedUser) {
      try { teacherId = JSON.parse(storedUser).username || JSON.parse(storedUser).id || null; } catch {}
    }
    loadAllData(teacherId);
  }, []));

  // Process data for charts
  const trendData = useMemo(() => {
    return processResourceTrends(allResourcesData, timeframe);
  }, [allResourcesData, timeframe]);

  const distributionData = useMemo(() => {
    return calculateDistribution(allResourcesData, tabColors, timeframe);
  }, [allResourcesData, tabColors, timeframe]);


  const quickStats = useMemo(() => {
    return calculateQuickStats(allResourcesData, tasks, timeframe);
  }, [allResourcesData, tasks, timeframe]);

  const activityFeed = useMemo(() => {
    return generateActivityFeed(allResourcesData, tasks, upcomingMilestones);
  }, [allResourcesData, tasks, upcomingMilestones]);

  // Filter progress data by profile settings
  const gradeMapping = settings.profile.gradeSubjects || {};
  const filterOn = settings.profile.filterContentByProfile;
  const filteredProgressBreakdown = useMemo(() => {
    if (!filterOn) return progressBreakdown;
    const tGrades = getTeacherGrades(gradeMapping);
    const tSubjects = getTeacherSubjects(gradeMapping);
    if (tGrades.length === 0 && tSubjects.length === 0) return progressBreakdown;
    return progressBreakdown.filter(item => {
      const gradeKey = item.grade.toLowerCase();
      const gradeOk = tGrades.length === 0 || tGrades.includes(gradeKey);
      if (!gradeOk) return false;
      if (gradeKey === 'k') return true;
      const gradeSubjectList = gradeMapping[gradeKey] || [];
      return gradeSubjectList.length === 0 || gradeSubjectList.includes(item.subject);
    });
  }, [progressBreakdown, filterOn, gradeMapping]);

  const filteredUpcomingMilestones = useMemo(() => {
    if (!filterOn) return upcomingMilestones;
    const tGrades = getTeacherGrades(gradeMapping);
    if (tGrades.length === 0) return upcomingMilestones;
    return upcomingMilestones.filter(m => {
      const gradeKey = (GRADE_VALUE_MAP[m.grade] || m.grade).toLowerCase();
      const gradeOk = tGrades.includes(gradeKey);
      if (!gradeOk) return false;
      if (gradeKey === 'k') return true;
      const gradeSubjectList = gradeMapping[gradeKey] || [];
      return gradeSubjectList.length === 0 || gradeSubjectList.includes(m.subject);
    });
  }, [upcomingMilestones, filterOn, gradeMapping]);

  // Recalculate stats from filtered breakdown to match profile
  const filteredMilestoneStats = useMemo((): MilestoneStats | null => {
    if (!milestoneStats) return null;
    if (!filterOn) return milestoneStats;
    const total = filteredProgressBreakdown.reduce((s, i) => s + i.total, 0);
    const completed = filteredProgressBreakdown.reduce((s, i) => s + i.completed, 0);
    const inProgress = filteredProgressBreakdown.reduce((s, i) => s + i.in_progress, 0);
    const notStarted = total - completed - inProgress;
    return {
      ...milestoneStats,
      totalMilestones: total,
      completed,
      inProgress,
      notStarted,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [milestoneStats, filteredProgressBreakdown, filterOn]);

  // Group resources and tasks by date
  const resourcesByDate = useMemo(() => {
    const grouped: { [date: string]: any[] } = {};
    allResourcesData.forEach(resource => {
      try {
        const dateKey = format(new Date(resource.timestamp), 'yyyy-MM-dd');
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(resource);
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    });
    return grouped;
  }, [allResourcesData]);

  const tasksByDate = useMemo(() => {
    const grouped: { [date: string]: Task[] } = {};
    tasks.forEach(task => {
      const dateKey = task.date;
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(task);
    });
    return grouped;
  }, [tasks]);

  const activityByDate = useMemo(() => {
    const activity: { [date: string]: number } = {};
    allResourcesData.forEach(resource => {
      const dateKey = format(new Date(resource.timestamp), 'yyyy-MM-dd');
      activity[dateKey] = (activity[dateKey] || 0) + 1;
    });
    return activity;
  }, [allResourcesData]);

  // Calculate tool usage from browser tabs
  const toolUsage = useMemo(() => {
    try {
      const savedTabs = localStorage.getItem('dashboard-tabs');
      if (savedTabs) {
        const tabs: Tab[] = JSON.parse(savedTabs);
        return calculateToolUsage(tabs);
      }
    } catch (error) {
      console.error('Error calculating tool usage:', error);
    }
    return [];
  }, []);

  // Alert for overdue / due-today / due-tomorrow tasks
  useTaskNotifications(tasks, testReminders);

  // Task handlers
  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    } else {
      setTasks([...tasks, task]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId
        ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
        : t
    ));
  };

  const handleExportCalendar = () => {
    const tasksJson = encodeURIComponent(JSON.stringify(tasks));
    const url = `http://localhost:8000/api/calendar/export.ics?tasks=${tasksJson}`;
    window.open(url, '_blank');
  };

  const handleToolClick = (toolType: string) => {
    if (onCreateTab) {
      onCreateTab(toolType);
    }
  };

  const handleProfileSave = (name: string, image: string | null) => {
    setUserName(name);
    setUserImage(image);

    // Update localStorage
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.name = name;
        localStorage.setItem('user', JSON.stringify(user));
      }

      if (image) {
        localStorage.setItem('user-profile-image', image);
        window.dispatchEvent(new Event('profile-image-changed'));
      } else {
        localStorage.removeItem('user-profile-image');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }

    setShowProfileEdit(false);
  };

  if (loading) {
    return (
      <div className="h-full overflow-y-auto" style={{ backgroundColor: 'var(--dash-bg)' }}>
        {/* Header Skeleton */}
        <header className="sticky top-0 z-20" style={{
          backgroundColor: 'var(--dash-bg)',
          boxShadow: `0 4px 16px var(--dash-shadow)`
        }}>
          <div className="px-8 py-5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
              <div className="space-y-2">
                <div className="h-6 w-32 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                <div className="h-4 w-24 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {[1, 2, 3].map(i => (
                <React.Fragment key={i}>
                  {i > 1 && <div className="w-px h-10" style={{ backgroundColor: 'var(--dash-border)' }} />}
                  <div className="text-center space-y-1">
                    <div className="h-7 w-10 mx-auto rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                    <div className="h-3 w-14 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content Skeleton - 3/5 + 2/5 Grid */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-5 gap-6">
            {/* Left Column - 3/5 */}
            <div className="col-span-3 space-y-6">
              {/* Chart Carousel Skeleton */}
              <div className="rounded-2xl p-6 widget-glass space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-36 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                  <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-8 w-16 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                    ))}
                  </div>
                </div>
                <div className="h-56 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
              </div>

              {/* Curriculum Progress Skeleton */}
              <div className="rounded-2xl p-6 widget-glass space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-44 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                  <div className="flex gap-2">
                    {[1, 2].map(i => (
                      <div key={i} className="h-7 w-20 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                    ))}
                  </div>
                </div>
                <div className="h-3 w-full rounded-full animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                  ))}
                </div>
              </div>

              {/* Recent Activity Skeleton */}
              <div className="rounded-2xl p-6 widget-glass space-y-4">
                <div className="h-5 w-36 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: 'var(--dash-border)' }} />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-4 w-3/4 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                      <div className="h-3 w-1/3 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - 2/5 */}
            <div className="col-span-2 space-y-6">
              {/* Calendar Skeleton */}
              <div className="rounded-2xl p-6 widget-glass space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-28 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                  <div className="h-8 w-8 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="h-8 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                  ))}
                </div>
              </div>

              {/* Task List Skeleton */}
              <div className="rounded-2xl p-6 widget-glass space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-20 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                  <div className="h-8 w-8 rounded-full animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                </div>
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-md animate-pulse flex-shrink-0" style={{ backgroundColor: 'var(--dash-border)' }} />
                    <div className="flex-1 space-y-1">
                      <div className="h-4 w-4/5 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                      <div className="h-3 w-1/4 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Most Used Tools Skeleton */}
              <div className="rounded-2xl p-6 widget-glass space-y-4">
                <div className="h-5 w-32 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg animate-pulse flex-shrink-0" style={{ backgroundColor: 'var(--dash-border)' }} />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-4 w-2/3 rounded animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                      <div className="h-2 w-full rounded-full animate-pulse" style={{ backgroundColor: 'var(--dash-border)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: 'var(--dash-bg)' }} data-tutorial="main-content">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-sm" style={{
        backgroundColor: 'var(--dash-bg-alpha)',
        boxShadow: `0 4px 16px var(--dash-shadow)`,
        overflow: 'visible'
      }}>
        <div className="px-8 py-5 flex items-center justify-between">
          {/* Profile Section */}
          <div className="flex items-center space-x-4" data-tutorial="analytics-profile">
            <button
              onClick={() => setShowProfileEdit(true)}
              className="relative group"
              data-tutorial="analytics-profile-edit"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105"
                style={{
                  backgroundColor: 'var(--dash-primary)',
                  boxShadow: `0 4px 12px var(--dash-primary-a25)`
                }}
              >
                {userImage ? (
                  <img loading="lazy" src={userImage} alt={userName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-7 h-7" style={{ color: 'var(--dash-primary-fg)' }} />
                )}
              </div>
              <div
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: 'var(--dash-orange)' }}
              >
                <Camera className="w-3 h-3 text-white" />
              </div>
            </button>

            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--dash-text)' }}>
                {userName}
              </h1>
              <p className="text-sm" style={{ color: 'var(--dash-text-sub)' }}>
                {t('analytics.teachingHub')}
              </p>
            </div>
          </div>

          {/* Quick Stats - Minimal */}
          <div className="flex items-center space-x-6" data-tutorial="analytics-quick-stats" style={{ overflow: 'visible' }}>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--dash-primary)' }}>
                {quickStats.totalResources}
              </div>
              <div className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>
                {t('analytics.resources')}
              </div>
            </div>
            <div
              className="w-px h-10"
              style={{ backgroundColor: 'var(--dash-border)' }}
            />
            <div
              className="text-center group relative"
              style={{ minWidth: showShowcase && showcase.length > 0 ? Math.min(showcase.length, 5) * 142 : undefined, transition: 'min-width 0.3s ease', overflow: 'visible' }}
            >
              {/* Stats view */}
              <div
                className="cursor-pointer"
                onClick={() => showcase.length > 0 ? setShowShowcase(true) : onCreateTab?.('achievements')}
                title={showcase.length > 0 ? t('analytics.showShowcase') : t('analytics.viewAchievements')}
                style={{
                  opacity: showShowcase ? 0 : 1,
                  transform: showShowcase ? 'rotateX(90deg)' : 'rotateX(0deg)',
                  transition: 'opacity 0.25s ease, transform 0.25s ease',
                  position: showShowcase ? 'absolute' : 'relative',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: showShowcase ? 'none' : 'auto',
                }}
              >
                <div className="text-2xl font-bold flex items-center justify-center gap-1.5 hover:opacity-80 transition-opacity" style={{ color: '#f59e0b' }}>
                  <HugeiconsIcon icon={Trophy01IconData} size={18} style={{ color: '#f59e0b' }} />
                  {earned.length}/{totalAvailable}
                </div>
                <div className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>
                  {t('analytics.achievements')}
                </div>
              </div>
              {/* Showcase view — inline mini trophy cards */}
              {showcase.length > 0 && (
                <div style={{
                  opacity: showShowcase ? 1 : 0,
                  transform: showShowcase ? 'rotateX(0deg)' : 'rotateX(-90deg)',
                  transition: 'opacity 0.25s ease, transform 0.25s ease',
                  position: showShowcase ? 'relative' : 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: showShowcase ? 'auto' : 'none',
                  overflow: 'visible',
                }}>
                  <div className="flex items-center gap-5" style={{ overflow: 'visible' }}>
                    {showcase.slice(0, 5).map(id => {
                      const def = definitions.find(d => d.id === id);
                      if (!def) return null;
                      const earnedEntry = earned.find(e => e.achievement_id === id);
                      return (
                        <MiniTrophyCard
                          key={id}
                          definition={def}
                          earnedAt={earnedEntry?.earned_at}
                          onClick={() => {
                            const tType = getTrophyType(id);
                            const tSrc = tType ? getTrophyImageForTier(tType, (def.tier ?? 'gold') as TrophyTier) : undefined;
                            if (tSrc) {
                              setViewingTrophy({
                                achievement_id: def.id,
                                earned_at: earnedEntry?.earned_at || '',
                                name: def.name,
                                description: def.description,
                                category: def.category,
                                icon_name: def.icon_name,
                                rarity: def.rarity,
                                points: def.points,
                                tier: def.tier,
                              });
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                  {/* Collapse arrow — overlaid on right edge, visible on hover */}
                  <div
                    onClick={(e) => { e.stopPropagation(); setShowShowcase(false); }}
                    title={t('analytics.showStats')}
                    className="group-hover:!opacity-100"
                    style={{
                      position: 'absolute',
                      right: -16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.15)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      opacity: 0,
                      transition: 'opacity 0.2s ease, background 0.2s ease',
                      zIndex: 10,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)'; }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M4.5 2.5L8 6l-3.5 3.5" stroke={isDark ? 'rgba(255,255,255,0.9)' : '#fff'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div
              className="w-px h-10"
              style={{ backgroundColor: 'var(--dash-border)' }}
            />
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--dash-orange)' }}>
                {quickStats.completionRate}%
              </div>
              <div className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>
                {t('analytics.tasksDone')}
              </div>
            </div>
            {dashPhase && (
              <>
                <div
                  className="w-px h-10"
                  style={{ backgroundColor: 'var(--dash-border)' }}
                />
                <div
                  className="text-center"
                  style={{
                    padding: '4px 12px',
                    borderRadius: 10,
                    background: `${dashPhase.color}12`,
                    border: `1px solid ${dashPhase.color}30`,
                  }}
                >
                  <div className="text-xs font-semibold" style={{ color: dashPhase.color }}>
                    {dashPhase.phase_label}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>
                    {t('analytics.daysLeft', { count: dashPhase.days_remaining })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Trophy Detail Modal */}
      {viewingTrophy && (() => {
        const tType = getTrophyType(viewingTrophy.achievement_id);
        const tSrc = tType ? getTrophyImageForTier(tType, (viewingTrophy.tier ?? 'gold') as TrophyTier) : undefined;
        return tSrc ? (
          <TrophyDetailCard
            achievement={viewingTrophy}
            trophyImageSrc={tSrc}
            earnedAt={viewingTrophy.earned_at}
            onClose={() => setViewingTrophy(null)}
          />
        ) : null;
      })()}

      {/* Main Content - 3/5 + 2/5 Grid */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-5 gap-6" data-tutorial="analytics-layout">
          {/* Left Column - 3/5 */}
          <div className="col-span-3 space-y-6" data-tutorial="analytics-charts-section">
            {/* Resource Trends Chart */}
            <ChartCarousel
              trendData={trendData}
              metricsHistory={metricsHistory}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              forcePaused={currentTutorialStep >= 5 && currentTutorialStep <= 7}
              tabColors={tabColors}
            />

            {/* Curriculum Progress */}
            <div>
              {/* Progress scope toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--dash-text-sub)', fontWeight: 500 }}>{t('analytics.progressView')}</span>
                <NeuroSegment
                  options={[
                    { value: 'overall', label: t('analytics.overall') },
                    { value: 'phase',   label: t('analytics.phase') },
                  ]}
                  value={dashProgressScope}
                  onChange={setDashProgressScope}
                  size="sm"
                  aria-label={t('analytics.progressView')}
                />
                {dashProgressScope === 'phase' && dashPhase && (
                  <span style={{ fontSize: 11, color: dashPhase.color, fontWeight: 600 }}>
                    {t('analytics.viewingPhase', { phase: dashPhase.phase_label })}
                  </span>
                )}
                {dashProgressScope === 'phase' && !dashPhase && (
                  <span style={{ fontSize: 11, color: 'var(--dash-text-sub)', fontStyle: 'italic' }}>
                    {t('analytics.noActivePhase')}
                  </span>
                )}
              </div>
              <CurriculumProgressWidget
                stats={filteredMilestoneStats}
                upcomingMilestones={filteredUpcomingMilestones}
                progressBreakdown={filteredProgressBreakdown}
                view={curriculumView}
                onViewChange={setCurriculumView}
              />
            </div>

            {/* Phase Progress Summary */}
            {dashPhaseProgress.length > 0 && (
              <div style={{
                background: 'var(--dash-card)',
                borderRadius: 12,
                border: '1px solid var(--dash-border)',
                padding: 16,
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--dash-text)', marginBottom: 12 }}>
                  {t('analytics.phaseProgressSummary')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {dashPhaseProgress.map(p => {
                    const PHASE_C: Record<string, string> = {
                      midterm_1: '#f97316', midterm_2: '#f97316',
                      midterm_1_prep: '#fbbf24', midterm_2_prep: '#fbbf24',
                      inter_semester_break: '#eab308', end_of_year_exam: '#ef4444',
                    };
                    const SEM_C: Record<string, string> = { 'Semester 1': '#3b82f6', 'Semester 2': '#22c55e' };
                    const color = PHASE_C[p.key] || (p.semester ? SEM_C[p.semester] || '#6b7280' : '#6b7280');
                    return (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--dash-text-sub)', width: 100, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.label}
                        </span>
                        <div style={{ flex: 1, height: 8, borderRadius: 4, background: `${color}20`, overflow: 'hidden' }}>
                          <div style={{
                            width: `${p.pct}%`, height: '100%', borderRadius: 4,
                            background: color, transition: 'width 0.5s ease',
                          }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color, width: 40, textAlign: 'right' }}>
                          {Math.round(p.pct)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
                {dashUnassignedCount > 0 && (
                  <div style={{ marginTop: 10, fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>
                    {t('analytics.unassignedELOs', { count: dashUnassignedCount })}
                  </div>
                )}
              </div>
            )}

            {/* Recent Activity Timeline */}
            <div data-tutorial="analytics-recent-activity">
              <RecentActivityTimeline activities={activityFeed} limit={4} />
            </div>
          </div>

          {/* Right Column - 2/5 */}
          <div className="col-span-2 space-y-6" data-tutorial="analytics-widgets-section">
            {/* Compact Calendar */}
            <CompactCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              activityByDate={activityByDate}
              tasksByDate={tasksByDate}
              resourcesByDate={resourcesByDate}
              onExpandClick={() => setShowCalendarModal(true)}
              insightsReport={latestInsightsReport}
              onViewFullReport={() => onCreateTab?.('educator-insights')}
              onRegenerateInsights={() => onCreateTab?.('educator-insights')}
            />

            {/* Upcoming Quizzes */}
            {(() => {
              const today = format(new Date(), 'yyyy-MM-dd');
              const upcomingQuizzes = testReminders.filter(r => r.type === 'quiz' && r.test_date >= today);
              const upcomingWorksheets = testReminders.filter(r => r.type === 'worksheet' && r.test_date >= today);
              const hasAny = testReminders.length > 0 || tasks.length > 0;

              return hasAny ? (
                <>
                  {upcomingQuizzes.length > 0 && (
                    <div className="bg-theme-surface rounded-xl border border-theme p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-theme-heading">{t('analytics.upcomingQuizzes')}</h3>
                      </div>
                      <div className="space-y-2">
                        {upcomingQuizzes.slice(0, 5).map(r => (
                          <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-theme-secondary text-xs">
                            <div>
                              <p className="font-medium text-theme-label">{r.title}</p>
                              <p className="text-theme-hint">{r.subject} - Grade {r.grade_level}</p>
                            </div>
                            <span className="text-theme-muted font-mono">
                              {new Date(r.test_date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {upcomingWorksheets.length > 0 && (
                    <div className="bg-theme-surface rounded-xl border border-theme p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-theme-heading">{t('analytics.upcomingWorksheets')}</h3>
                      </div>
                      <div className="space-y-2">
                        {upcomingWorksheets.slice(0, 5).map(r => (
                          <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-theme-secondary text-xs">
                            <div>
                              <p className="font-medium text-theme-label">{r.title}</p>
                              <p className="text-theme-hint">{r.subject} - Grade {r.grade_level}</p>
                            </div>
                            <span className="text-theme-muted font-mono">
                              {new Date(r.test_date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={handleExportCalendar}
                      className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 font-medium transition"
                    >
                      {t('analytics.exportCalendar')}
                    </button>
                  </div>
                </>
              ) : null;
            })()}

            {/* Task List */}
            <TaskListWidget
              tasks={tasks}
              selectedDate={selectedDate}
              onTaskEdit={handleEditTask}
              onTaskToggle={handleToggleTask}
              onAddTask={handleAddTask}
            />

            {/* Most Used Tools */}
            <MostUsedTools
              toolUsage={toolUsage}
              onToolClick={handleToolClick}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTaskModal && (
        <TaskEditModal
          task={editingTask}
          selectedDate={format(selectedDate, 'yyyy-MM-dd')}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {showCalendarModal && (
        <CalendarModal
          resourcesByDate={resourcesByDate}
          tasksByDate={tasksByDate}
          initialDate={selectedDate}
          onDateSelect={setSelectedDate}
          onClose={() => setShowCalendarModal(false)}
          onTaskAdd={handleAddTask}
          onTaskEdit={handleEditTask}
          onTaskToggle={handleToggleTask}
          insightsReminders={latestInsightsReport?.reminders || []}
        />
      )}

      {showProfileEdit && (
        <ProfileEditModal
          currentName={userName}
          currentImage={userImage}
          onSave={handleProfileSave}
          onClose={() => setShowProfileEdit(false)}
        />
      )}

      {/* Tutorial Overlay */}
      <TutorialOverlay
        steps={getAnalyticsDashboardSteps(t)}
        showFloatingButton={false}
        onStepChange={setCurrentTutorialStep}
      />
    </div>
  );
};

// Profile Edit Modal Component
const PROFILE_SUBJECTS = [...SUBJECTS];
const PROFILE_GRADE_LEVELS = GRADE_LEVELS.map(g => g.value);

interface ProfileEditModalProps {
  currentName: string;
  currentImage: string | null;
  onSave: (name: string, image: string | null) => void;
  onClose: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  currentName,
  currentImage,
  onSave,
  onClose
}) => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const [name, setName] = useState(currentName);
  const [image, setImage] = useState<string | null>(currentImage);
  const [localGradeSubjects, setLocalGradeSubjects] = useState<GradeSubjectMapping>({ ...settings.profile.gradeSubjects });
  const [activeGrade, setActiveGrade] = useState<string | null>(null);

  const selectedGrades = getTeacherGrades(localGradeSubjects);

  const toggleGrade = (grade: string) => {
    const updated = { ...localGradeSubjects };
    if (updated[grade] && updated[grade].length > 0) {
      delete updated[grade];
      if (activeGrade === grade) setActiveGrade(null);
    } else {
      updated[grade] = [];
      setActiveGrade(grade);
    }
    setLocalGradeSubjects(updated);
  };

  const toggleSubjectForGrade = (grade: string, subject: string) => {
    const updated = { ...localGradeSubjects };
    const current = updated[grade] || [];
    updated[grade] = current.includes(subject)
      ? current.filter(s => s !== subject)
      : [...current, subject];
    setLocalGradeSubjects(updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (name.trim()) {
      updateSettings({ profile: { ...settings.profile, gradeSubjects: localGradeSubjects } });
      onSave(name.trim(), image);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--dash-overlay)' }}
      onClick={onClose}
    >
      <div
        className="widget-glass rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--dash-text)' }}>
          {t('analytics.editProfile')}
        </h2>

        {/* Image Upload */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-3"
            style={{
              backgroundColor: 'var(--dash-primary)',
              boxShadow: `0 4px 12px var(--dash-primary-a25)`
            }}
          >
            {image ? (
              <img loading="lazy" src={image} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-12 h-12" style={{ color: 'var(--dash-primary-fg)' }} />
            )}
          </div>

          <label
            className="px-4 py-2 rounded-lg cursor-pointer transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--dash-orange)',
              color: 'white',
              boxShadow: `0 2px 8px var(--dash-orange-a30)`
            }}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            {t('analytics.uploadPhoto')}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dash-text-sub)' }}>
            {t('analytics.displayName')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl outline-none transition-all"
            style={{
              backgroundColor: 'var(--dash-card-bg)',
              border: `1px solid var(--dash-border)`,
              color: 'var(--dash-text)',
              boxShadow: `0 2px 8px var(--dash-card-shadow)`
            }}
            placeholder={t('analytics.enterName')}
          />
        </div>

        {/* Grade Levels I Teach */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: 'var(--dash-text-sub)' }}>
            <GraduationCap className="w-4 h-4" />
            {t('analytics.myGrades')}
          </label>
          <p className="text-xs mb-2" style={{ color: 'var(--dash-text-sub)', opacity: 0.6 }}>
            {t('analytics.gradesHint')}
          </p>
          <div className="flex flex-wrap gap-2">
            {PROFILE_GRADE_LEVELS.map(grade => {
              const hasSubjects = (localGradeSubjects[grade] || []).length > 0;
              const isActive = activeGrade === grade;
              return (
                <button
                  key={grade}
                  onClick={() => {
                    if (isActive) {
                      setActiveGrade(null);
                    } else {
                      if (!localGradeSubjects[grade]) {
                        setLocalGradeSubjects(prev => ({ ...prev, [grade]: [] }));
                      }
                      setActiveGrade(grade);
                    }
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 min-w-[60px]"
                  style={{
                    backgroundColor: isActive ? 'var(--dash-primary)' : hasSubjects ? 'var(--dash-primary)' : 'var(--dash-card-bg)',
                    color: isActive || hasSubjects ? 'var(--dash-primary-fg)' : 'var(--dash-text-sub)',
                    border: `1px solid ${isActive || hasSubjects ? 'var(--dash-primary)' : 'var(--dash-border)'}`,
                    boxShadow: isActive ? '0 2px 8px var(--dash-primary-a25)' : '0 1px 4px var(--dash-card-shadow)',
                    opacity: isActive ? 1 : hasSubjects ? 0.85 : 1,
                  }}
                >
                  {hasSubjects && <Check className="w-3 h-3 inline mr-1" />}
                  {GRADE_LABEL_MAP[grade] || grade}
                  {hasSubjects && <span className="ml-1 text-xs opacity-75">({(localGradeSubjects[grade] || []).length})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subjects for selected grade */}
        {activeGrade && (
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: 'var(--dash-text-sub)' }}>
              <BookOpen className="w-4 h-4" />
              {t('analytics.subjectsFor', { grade: GRADE_LABEL_MAP[activeGrade] })}
            </label>
            <div className="flex flex-wrap gap-2">
              {PROFILE_SUBJECTS.map(subj => {
                const active = (localGradeSubjects[activeGrade] || []).includes(subj);
                return (
                  <button
                    key={subj}
                    onClick={() => toggleSubjectForGrade(activeGrade, subj)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: active ? 'var(--dash-primary)' : 'var(--dash-card-bg)',
                      color: active ? 'var(--dash-primary-fg)' : 'var(--dash-text-sub)',
                      border: `1px solid ${active ? 'var(--dash-primary)' : 'var(--dash-border)'}`,
                      boxShadow: active ? '0 2px 8px var(--dash-primary-a25)' : '0 1px 4px var(--dash-card-shadow)'
                    }}
                  >
                    {active && <Check className="w-3 h-3 inline mr-1" />}
                    {subj}
                  </button>
                );
              })}
            </div>
            {(localGradeSubjects[activeGrade] || []).length === 0 && (
              <p className="text-xs mt-2" style={{ color: 'var(--dash-text-sub)', opacity: 0.6 }}>
                {t('analytics.subjectsHint')}
              </p>
            )}
          </div>
        )}

        {/* Trophy Display Preference */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--dash-text-sub)' }}>
              {t('analytics.showTrophies')}
            </p>
            <p className="text-xs" style={{ color: 'var(--dash-text-sub)', opacity: 0.6 }}>
              {t('analytics.showTrophiesHint')}
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.showTrophiesByDefault}
            onChange={(e) => updateSettings({ showTrophiesByDefault: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            style={{ accentColor: 'var(--dash-primary)' }}
          />
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--dash-card-bg)',
              border: `1px solid var(--dash-border)`,
              color: 'var(--dash-text-sub)',
              boxShadow: `0 2px 8px var(--dash-card-shadow)`
            }}
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-xl transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--dash-primary)',
              color: 'var(--dash-primary-fg)',
              boxShadow: `0 4px 12px var(--dash-primary-a25)`
            }}
          >
            {t('analytics.saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
