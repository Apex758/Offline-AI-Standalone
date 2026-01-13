import React, { useState, useEffect, useMemo } from 'react';
import { User, Camera } from 'lucide-react';
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
import TaskEditModal from './modals/TaskEditModal';
import CalendarModal from './CalendarModal';
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
  const [userImage, setUserImage] = useState<string | null>(null);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [allResourcesData, setAllResourcesData] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
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
    setLoading(true);
    try {
      // Load resources
      const [lessonPlans, rubrics, quizzes, kindergarten, multigrade, crossCurricular, worksheets, images] = await Promise.all([
        axios.get('http://localhost:8000/api/lesson-plan-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/rubric-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/quiz-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/kindergarten-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/multigrade-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/cross-curricular-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/worksheet-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/images-history').catch(() => ({ data: [] }))
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
        ...images.data.map((r: any) => ({ ...r, type: 'image' }))
      ];
      
      setAllResourcesData(allResources);

      // Load milestone stats if teacherId is available
      if (teacherId) {
        try {
          const stats = await milestoneApi.getStats(teacherId);
          setMilestoneStats(stats);

          const milestones = await milestoneApi.getUpcoming(teacherId, 30);
          setUpcomingMilestones(milestones);

          // Load progress breakdown for grade/subject views
          const progressData = await milestoneApi.getProgress(teacherId);
          setProgressBreakdown(progressData.byGradeSubject || []);
        } catch (e) {
          console.error('Error loading milestones:', e);
          setMilestoneStats(null);
          setProgressBreakdown([]);
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
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: '#FDFDF8' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#F2A631' }}></div>
          <p style={{ color: '#552A01' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: '#FDFDF8' }} data-tutorial="main-content">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-sm" style={{ 
        backgroundColor: 'rgba(253, 253, 248, 0.9)',
        boxShadow: '0 4px 16px rgba(29, 54, 45, 0.06)'
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
                  backgroundColor: '#1D362D',
                  boxShadow: '0 4px 12px rgba(29, 54, 45, 0.15)'
                }}
              >
                {userImage ? (
                  <img src={userImage} alt={userName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-7 h-7" style={{ color: '#F8E59D' }} />
                )}
              </div>
              <div 
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: '#F2A631' }}
              >
                <Camera className="w-3 h-3 text-white" />
              </div>
            </button>
            
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#020D03' }}>
                {userName}
              </h1>
              <p className="text-sm" style={{ color: '#552A01' }}>
                Your Teaching Hub
              </p>
            </div>
          </div>

          {/* Quick Stats - Minimal */}
          <div className="flex items-center space-x-6" data-tutorial="analytics-quick-stats">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#1D362D' }}>
                {quickStats.totalResources}
              </div>
              <div className="text-xs" style={{ color: '#552A01' }}>
                Resources
              </div>
            </div>
            <div 
              className="w-px h-10" 
              style={{ backgroundColor: '#E8EAE3' }}
            />
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#1D362D' }}>
                {quickStats.activeDays}
              </div>
              <div className="text-xs" style={{ color: '#552A01' }}>
                Active Days
              </div>
            </div>
            <div 
              className="w-px h-10" 
              style={{ backgroundColor: '#E8EAE3' }}
            />
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#F2A631' }}>
                {quickStats.completionRate}%
              </div>
              <div className="text-xs" style={{ color: '#552A01' }}>
                Tasks Done
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 3/5 + 2/5 Grid */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-5 gap-6" data-tutorial="analytics-layout">
          {/* Left Column - 3/5 */}
          <div className="col-span-3 space-y-6" data-tutorial="analytics-charts-section">
            {/* Resource Trends Chart */}
            <ChartCarousel
              trendData={trendData}
              distributionData={distributionData}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              forcePaused={currentTutorialStep >= 5 && currentTutorialStep <= 7}
            />

            {/* Curriculum Progress */}
            <CurriculumProgressWidget
              stats={milestoneStats}
              upcomingMilestones={upcomingMilestones}
              progressBreakdown={progressBreakdown}
              view={curriculumView}
              onViewChange={setCurriculumView}
            />

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
            />

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
        steps={analyticsDashboardSteps}
        showFloatingButton={false}
        onStepChange={setCurrentTutorialStep}
      />
    </div>
  );
};

// Profile Edit Modal Component
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
  const [name, setName] = useState(currentName);
  const [image, setImage] = useState<string | null>(currentImage);

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
      onSave(name.trim(), image);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(2, 13, 3, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-8 max-w-md w-full"
        style={{
          backgroundColor: 'rgba(253, 253, 248, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(29, 54, 45, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#020D03' }}>
          Edit Profile
        </h2>

        {/* Image Upload */}
        <div className="flex flex-col items-center mb-6">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mb-3"
            style={{
              backgroundColor: '#1D362D',
              boxShadow: '0 4px 12px rgba(29, 54, 45, 0.15)'
            }}
          >
            {image ? (
              <img src={image} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-12 h-12" style={{ color: '#F8E59D' }} />
            )}
          </div>
          
          <label 
            className="px-4 py-2 rounded-lg cursor-pointer transition-all hover:scale-105"
            style={{
              backgroundColor: '#F2A631',
              color: 'white',
              boxShadow: '0 2px 8px rgba(242, 166, 49, 0.3)'
            }}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Upload Photo
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
          <label className="block text-sm font-semibold mb-2" style={{ color: '#552A01' }}>
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl outline-none transition-all"
            style={{
              backgroundColor: 'white',
              border: '1px solid #E8EAE3',
              color: '#020D03',
              boxShadow: '0 2px 8px rgba(29, 54, 45, 0.05)'
            }}
            placeholder="Enter your name"
          />
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl transition-all hover:scale-105"
            style={{
              backgroundColor: 'white',
              border: '1px solid #E8EAE3',
              color: '#552A01',
              boxShadow: '0 2px 8px rgba(29, 54, 45, 0.05)'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-xl transition-all hover:scale-105"
            style={{
              backgroundColor: '#1D362D',
              color: '#F8E59D',
              boxShadow: '0 4px 12px rgba(29, 54, 45, 0.2)'
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;