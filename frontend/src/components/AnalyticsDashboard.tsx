import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3, TrendingUp, Activity, Calendar as CalendarIcon, Zap, Target as TargetIcon
} from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import TutorialOverlay, { analyticsDashboardSteps } from './TutorialOverlay';
import { milestoneApi } from '../lib/milestoneApi';
import type { MilestoneStats, Milestone } from '../types/milestone';
import type { Task } from '../types/task';
import type { Timeframe, CurriculumView } from '../types/analytics';
import type { Tab } from '../types';

// Import helper functions
import {
  processResourceTrends,
  calculateDistribution,
  calculateToolUsage,
  generateActivityFeed,
  calculateQuickStats
} from '../lib/analyticsHelpers';

// Import new components
import QuickStatsCard from './widgets/QuickStatsCard';
import TaskEditModal from './modals/TaskEditModal';
import TaskListWidget from './widgets/TaskListWidget';
import CompactCalendar from './widgets/CompactCalendar';
import ChartCarousel from './charts/ChartCarousel';
import CurriculumProgressWidget from './widgets/CurriculumProgressWidget';
import MostUsedTools from './widgets/MostUsedTools';
import RecentActivityTimeline from './widgets/RecentActivityTimeline';

interface AnalyticsDashboardProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  onNavigate?: (route: string) => void;
  onCreateTab?: (type: string) => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  tabId,
  savedData,
  onDataChange,
  onNavigate,
  onCreateTab
}) => {
  // State management
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Teacher');
  const [allResourcesData, setAllResourcesData] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestoneStats, setMilestoneStats] = useState<MilestoneStats | null>(null);
  const [upcomingMilestones, setUpcomingMilestones] = useState<Milestone[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeframe, setTimeframe] = useState<Timeframe>('month');
  const [curriculumView, setCurriculumView] = useState<CurriculumView>('overall');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
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
    
    loadAllData(teacherId);
  }, []);

  // Load tasks from localStorage
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('dashboard-tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dashboard-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }, [tasks]);

  const loadAllData = async (teacherId: string | null) => {
    setLoading(true);
    try {
      // Load resources
      const [lessonPlans, rubrics, quizzes, kindergarten, multigrade, crossCurricular] = await Promise.all([
        axios.get('http://localhost:8000/api/lesson-plan-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/rubric-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/quiz-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/kindergarten-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/multigrade-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/cross-curricular-history').catch(() => ({ data: [] }))
      ]);

      // Combine all resources with type labels
      const allResources = [
        ...lessonPlans.data.map((r: any) => ({ ...r, type: 'lesson' })),
        ...rubrics.data.map((r: any) => ({ ...r, type: 'rubric' })),
        ...quizzes.data.map((r: any) => ({ ...r, type: 'quiz' })),
        ...kindergarten.data.map((r: any) => ({ ...r, type: 'kindergarten' })),
        ...multigrade.data.map((r: any) => ({ ...r, type: 'multigrade' })),
        ...crossCurricular.data.map((r: any) => ({ ...r, type: 'cross-curricular' }))
      ];
      
      setAllResourcesData(allResources);

      // Load milestone stats if teacherId is available
      if (teacherId) {
        try {
          const stats = await milestoneApi.getStats(teacherId);
          setMilestoneStats(stats);
          
          const milestones = await milestoneApi.getUpcoming(teacherId, 30);
          setUpcomingMilestones(milestones);
        } catch (e) {
          console.error('Error loading milestones:', e);
          setMilestoneStats(null);
        }
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts
  const trendData = useMemo(() => {
    return processResourceTrends(allResourcesData, timeframe);
  }, [allResourcesData, timeframe]);

  const distributionData = useMemo(() => {
    return calculateDistribution(allResourcesData);
  }, [allResourcesData]);

  const lessonPlanComparison = useMemo(() => {
    return [
      {
        type: 'Standard',
        count: allResourcesData.filter(r => r.type === 'lesson').length
      },
      {
        type: 'Kindergarten',
        count: allResourcesData.filter(r => r.type === 'kindergarten').length
      },
      {
        type: 'Multigrade',
        count: allResourcesData.filter(r => r.type === 'multigrade').length
      },
      {
        type: 'Cross-Curricular',
        count: allResourcesData.filter(r => r.type === 'cross-curricular').length
      }
    ].filter(item => item.count > 0);
  }, [allResourcesData]);

  const quickStats = useMemo(() => {
    return calculateQuickStats(allResourcesData, tasks, timeframe);
  }, [allResourcesData, tasks, timeframe]);

  const activityFeed = useMemo(() => {
    return generateActivityFeed(allResourcesData, tasks, upcomingMilestones);
  }, [allResourcesData, tasks, upcomingMilestones]);

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

  const handleToolClick = (toolType: string) => {
    if (onCreateTab) {
      onCreateTab(toolType);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-48 translate-y-48"></div>
        </div>
        
        <div className="relative px-8 py-8">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-4xl font-bold">Welcome Back, {userName}!</h1>
              <p className="text-blue-100 mt-2">Your Teaching Analytics Hub</p>
            </div>
          </div>
          
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Resources</p>
                  <p className="text-3xl font-bold mt-1">{quickStats.totalResources}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Days</p>
                  <p className="text-3xl font-bold mt-1">{quickStats.activeDays}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                  <CalendarIcon className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Avg/Week</p>
                  <p className="text-3xl font-bold mt-1">{quickStats.avgPerWeek}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Task Completion</p>
                  <p className="text-3xl font-bold mt-1">{quickStats.completionRate}%</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                  <TargetIcon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="px-8 py-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Left Column (70%) - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart Carousel - Rotating Charts */}
            <ChartCarousel
              trendData={trendData}
              distributionData={distributionData}
              lessonPlanComparison={lessonPlanComparison}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />

            {/* Curriculum Progress */}
            <CurriculumProgressWidget
              stats={milestoneStats}
              upcomingMilestones={upcomingMilestones}
              view={curriculumView}
              onViewChange={setCurriculumView}
            />

            {/* Recent Activity Timeline */}
            <RecentActivityTimeline activities={activityFeed} limit={7} />
          </div>

          {/* Right Column (30%) - Sidebar */}
          <div className="h-full flex flex-col">
            {/* Compact Calendar */}
            <CompactCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              activityByDate={activityByDate}
              tasksByDate={tasksByDate}
              resourcesByDate={resourcesByDate}
            />

            {/* Grouped Task List and Most Used Tools */}
            <div className="flex flex-col flex-grow min-h-0 mt-6">
              <div className="flex-grow flex flex-col min-h-0">
                <TaskListWidget
                  tasks={tasks}
                  selectedDate={selectedDate}
                  onTaskEdit={handleEditTask}
                  onTaskToggle={handleToggleTask}
                  onAddTask={handleAddTask}
                />
              </div>
              <div className="mt-6">
                <MostUsedTools
                  toolUsage={toolUsage}
                  onToolClick={handleToolClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Edit Modal */}
      {showTaskModal && (
        <TaskEditModal
          task={editingTask}
          selectedDate={format(selectedDate, 'yyyy-MM-dd')}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {/* Tutorial Overlay */}
      <TutorialOverlay steps={analyticsDashboardSteps} showFloatingButton={false} />
    </div>
  );
};

export default AnalyticsDashboard;