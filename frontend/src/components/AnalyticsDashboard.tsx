import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, FileText, ListChecks, BookMarked, 
  School, Users, GraduationCap, Calendar, Clock, ArrowRight,
  BookOpen, Sparkles
} from 'lucide-react';
import axios from 'axios';
import TutorialOverlay, { analyticsDashboardSteps } from './TutorialOverlay';

interface AnalyticsDashboardProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  onNavigate?: (route: string) => void;
  onCreateTab?: (type: string) => void; // Add this prop
}

interface Stats {
  lessonPlans: number;
  rubrics: number;
  quizzes: number;
  kindergartenPlans: number;
  multigradePlans: number;
  crossCurricularPlans: number;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  tabId, 
  savedData, 
  onDataChange,
  onNavigate,
  onCreateTab // Add this
}) => {
  const [stats, setStats] = useState<Stats>({
    lessonPlans: 0,
    rubrics: 0,
    quizzes: 0,
    kindergartenPlans: 0,
    multigradePlans: 0,
    crossCurricularPlans: 0
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Teacher');

  useEffect(() => {
    // Load user name from context/props instead of localStorage
    // This assumes user data is passed from parent component
    const storedUser = localStorage.getItem('user'); // Only for user name - not for app state
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || user.username || 'Teacher');
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [lessonPlans, rubrics, quizzes, kindergarten, multigrade, crossCurricular] = await Promise.all([
        axios.get('http://localhost:8000/api/lesson-plan-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/rubric-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/quiz-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/kindergarten-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/multigrade-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/cross-curricular-history').catch(() => ({ data: [] }))
      ]);

      setStats({
        lessonPlans: lessonPlans.data.length,
        rubrics: rubrics.data.length,
        quizzes: quizzes.data.length,
        kindergartenPlans: kindergarten.data.length,
        multigradePlans: multigrade.data.length,
        crossCurricularPlans: crossCurricular.data.length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPlans = stats.lessonPlans + stats.kindergartenPlans + stats.multigradePlans + stats.crossCurricularPlans;
  const totalResources = totalPlans + stats.rubrics + stats.quizzes;

  const statCards = [
    {
      title: 'Total Resources',
      value: totalResources,
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Lesson Plans',
      value: totalPlans,
      icon: BookMarked,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Rubrics',
      value: stats.rubrics,
      icon: FileText,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Quizzes',
      value: stats.quizzes,
      icon: ListChecks,
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const curriculumLinks = [
    {
      title: 'Kindergarten',
      icon: GraduationCap,
      color: 'from-pink-500 to-rose-500',
      route: '/curriculum/kindergarten',
      description: '5 thematic units'
    },
    {
      title: 'Grade 1',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
      route: '/curriculum/grade1-subjects',
      description: 'All subjects'
    },
    {
      title: 'Grade 2',
      icon: BookOpen,
      color: 'from-green-500 to-teal-500',
      route: '/curriculum/grade2-subjects',
      description: 'All subjects'
    },
    {
      title: 'Grade 3',
      icon: BookOpen,
      color: 'from-purple-500 to-violet-500',
      route: '/curriculum/grade3-subjects',
      description: 'All subjects'
    },
    {
      title: 'Grade 4',
      icon: BookOpen,
      color: 'from-orange-500 to-red-500',
      route: '/curriculum/grade4-subjects',
      description: 'All subjects'
    },
    {
      title: 'Grade 5',
      icon: BookOpen,
      color: 'from-cyan-500 to-blue-500',
      route: '/curriculum/grade5-subjects',
      description: 'All subjects'
    },
    {
      title: 'Grade 6',
      icon: BookOpen,
      color: 'from-indigo-500 to-purple-500',
      route: '/curriculum/grade6-subjects',
      description: 'All subjects'
    }
  ];

  const planBreakdown = [
    { label: 'Standard Lessons', value: stats.lessonPlans, color: 'bg-purple-500' },
    { label: 'Kindergarten', value: stats.kindergartenPlans, color: 'bg-pink-500' },
    { label: 'Multigrade', value: stats.multigradePlans, color: 'bg-indigo-500' },
    { label: 'Cross-Curricular', value: stats.crossCurricularPlans, color: 'bg-teal-500' }
  ];

  // Action card handlers
  const actionCards = [
    {
      title: 'Create Lesson Plan',
      description: 'Start a new lesson plan',
      icon: BookMarked,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-100',
      toolType: 'lesson-planner'
    },
    {
      title: 'Generate Rubric',
      description: 'Create grading criteria',
      icon: FileText,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-100',
      toolType: 'rubric-generator'
    },
    {
      title: 'Build Quiz',
      description: 'Generate assessments',
      icon: ListChecks,
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-100',
      toolType: 'quiz-generator'
    },
    {
      title: 'Browse Curriculum',
      description: 'Explore OECS content',
      icon: School,
      color: 'from-pink-500 to-rose-600',
      textColor: 'text-pink-100',
      toolType: 'curriculum'
    }
  ];

  const handleActionCardClick = (toolType: string) => {
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
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-48 translate-y-48"></div>
        </div>
        
        <div className="relative px-8 py-12">
          <div className="flex items-center mb-4" data-tutorial="welcome-header">
            <BarChart3 className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-4xl font-bold">Welcome Back, {userName}!</h1>
              <p className="text-blue-100 mt-2">Your Teaching Resource Hub</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8" data-tutorial="stat-cards">
            {statCards.map((card, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">{card.title}</p>
                    <p className="text-3xl font-bold mt-1">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color}`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lesson Plan Breakdown */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100" data-tutorial="lesson-breakdown">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Lesson Plan Breakdown</h2>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              
              <div className="space-y-4">
                {planBreakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <span className="text-sm font-bold text-gray-900">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${item.color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${totalPlans > 0 ? (item.value / totalPlans) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalPlans}</div>
                    <div className="text-xs text-gray-600 mt-1">Total Plans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{stats.rubrics}</div>
                    <div className="text-xs text-gray-600 mt-1">Rubrics</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.quizzes}</div>
                    <div className="text-xs text-gray-600 mt-1">Quizzes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white" data-tutorial="quick-stats">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8" />
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  All Time
                </span>
              </div>
              <div className="text-4xl font-bold mb-2">{totalResources}</div>
              <p className="text-green-100">Resources Created</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Resource Summary
              </h3>
              <div className="space-y-3">
                {totalPlans > 0 && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">{totalPlans} lesson plans</span>
                  </div>
                )}
                {stats.rubrics > 0 && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">{stats.rubrics} grading rubrics</span>
                  </div>
                )}
                {stats.quizzes > 0 && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">{stats.quizzes} assessment quizzes</span>
                  </div>
                )}
                {totalResources === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No resources created yet</p>
                    <p className="text-gray-400 text-xs mt-1">Start by creating your first lesson plan!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access to Curriculum */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100" data-tutorial="curriculum-access">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Quick Access - Curriculum</h2>
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {curriculumLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate && onNavigate(link.route)}
                  className="group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                  <div className="relative">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${link.color} mb-3`}>
                      <link.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">{link.title}</h3>
                    <p className="text-xs text-gray-600">{link.description}</p>
                    <ArrowRight className="w-4 h-4 text-gray-400 mt-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8" data-tutorial="action-cards">
        <button
            onClick={() => handleActionCardClick('lesson-planner')}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
        >
            <BookMarked className="w-8 h-8 mb-3" />
            <h3 className="font-bold text-lg mb-2">Create Lesson Plan</h3>
            <p className="text-purple-100 text-sm">Start a new lesson plan</p>
        </button>

        <button
            onClick={() => handleActionCardClick('rubric-generator')}
            className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
        >
            <FileText className="w-8 h-8 mb-3" />
            <h3 className="font-bold text-lg mb-2">Generate Rubric</h3>
            <p className="text-amber-100 text-sm">Create grading criteria</p>
        </button>

        <button
            onClick={() => handleActionCardClick('quiz-generator')}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
        >
            <ListChecks className="w-8 h-8 mb-3" />
            <h3 className="font-bold text-lg mb-2">Build Quiz</h3>
            <p className="text-green-100 text-sm">Generate assessments</p>
        </button>

        <button
            onClick={() => handleActionCardClick('curriculum')}
            className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
        >
            <School className="w-8 h-8 mb-3" />
            <h3 className="font-bold text-lg mb-2">Browse Curriculum</h3>
            <p className="text-pink-100 text-sm">Explore OECS content</p>
        </button>
        </div>
      </div>
      {/* Tutorial Overlay */}
      <TutorialOverlay steps={analyticsDashboardSteps} />
    </div>
  );
};

export default AnalyticsDashboard;