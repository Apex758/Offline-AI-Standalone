import { format, subDays, subWeeks, subMonths, startOfMonth, startOfWeek, endOfMonth, isToday, isBefore, startOfDay, parseISO, isAfter } from 'date-fns';
import type { ResourceTrendData, DistributionData, ToolUsage, Activity, Timeframe } from '../types/analytics';
import type { Task, TasksByStatus } from '../types/task';
import type { Tab } from '../types';

/**
 * Get date range based on timeframe
 */
export function getDateRange(timeframe: Timeframe): { start: Date; end: Date } {
  const end = new Date();
  let start: Date;

  switch (timeframe) {
    case 'week':
      start = subDays(end, 7);
      break;
    case '2weeks':
      start = subWeeks(end, 2);
      break;
    case '4weeks':
      start = subWeeks(end, 4);
      break;
    case 'month':
      start = startOfMonth(end);
      break;
    case '3months':
      start = subMonths(end, 3);
      break;
    case '6months':
      start = subMonths(end, 6);
      break;
    case 'all':
      start = new Date(2025, 0, 1); // January 1, 2025
      break;
    default:
      start = startOfMonth(end);
  }

  return { start, end };
}

/**
 * Process resources into trend data for charting.
 * Uses daily buckets for short timeframes, weekly for 3months/6months/all.
 */
export function processResourceTrends(resources: any[], timeframe: Timeframe): ResourceTrendData[] {
  const { start, end } = getDateRange(timeframe);
  const useWeekly = timeframe === '3months' || timeframe === '6months' || timeframe === 'all';
  const dataMap = new Map<string, ResourceTrendData>();

  const emptyBucket = (dateKey: string): ResourceTrendData => ({
    date: dateKey,
    total: 0,
    lessonPlans: 0,
    quizzes: 0,
    rubrics: 0,
    kindergarten: 0,
    multigrade: 0,
    crossCurricular: 0,
    worksheets: 0,
    images: 0,
    presentations: 0,
    storybooks: 0
  });

  // Initialize buckets across the range
  if (useWeekly) {
    let cur = startOfWeek(start, { weekStartsOn: 1 });
    while (cur <= end) {
      const dateKey = format(cur, 'yyyy-MM-dd');
      dataMap.set(dateKey, emptyBucket(dateKey));
      cur = new Date(cur.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
  } else {
    let cur = new Date(start);
    while (cur <= end) {
      const dateKey = format(cur, 'yyyy-MM-dd');
      dataMap.set(dateKey, emptyBucket(dateKey));
      cur = new Date(cur.setDate(cur.getDate() + 1));
    }
  }

  // Helper to find the right weekly bucket key for a date
  const getWeekKey = (d: Date): string => {
    const weekStart = startOfWeek(d, { weekStartsOn: 1 });
    return format(weekStart, 'yyyy-MM-dd');
  };

  // Aggregate resources into buckets
  resources.forEach(resource => {
    try {
      const resourceDate = new Date(resource.timestamp);
      if (resourceDate >= start && resourceDate <= end) {
        const dateKey = useWeekly
          ? getWeekKey(resourceDate)
          : format(resourceDate, 'yyyy-MM-dd');
        const data = dataMap.get(dateKey);

        if (data) {
          data.total++;

          switch (resource.type) {
            case 'lesson':
              data.lessonPlans++;
              break;
            case 'quiz':
              data.quizzes++;
              break;
            case 'rubric':
              data.rubrics++;
              break;
            case 'kindergarten':
              data.kindergarten++;
              break;
            case 'multigrade':
              data.multigrade++;
              break;
            case 'cross-curricular':
              data.crossCurricular++;
              break;
            case 'worksheet':
              data.worksheets++;
              break;
            case 'image':
              data.images++;
              break;
            case 'presentation':
              data.presentations++;
              break;
            case 'storybook':
              data.storybooks++;
              break;
          }
        }
      }
    } catch (error) {
      console.error('Error processing resource date:', error);
    }
  });

  return Array.from(dataMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Map resource types to tool types for color lookup
 */
export const RESOURCE_TO_TOOL_TYPE: Record<string, string> = {
  lesson: 'lesson-planner',
  quiz: 'quiz-generator',
  rubric: 'rubric-generator',
  kindergarten: 'kindergarten-planner',
  multigrade: 'multigrade-planner',
  'cross-curricular': 'cross-curricular-planner',
  worksheet: 'worksheet-generator',
  image: 'image-studio',
  images: 'image-studio',
  presentation: 'presentation-builder',
  storybook: 'storybook'
};

/**
 * Calculate resource type distribution
 */
export function calculateDistribution(resources: any[], tabColors: { [key: string]: string } = {}, timeframe: Timeframe = 'all'): DistributionData[] {
  const typeCounts: { [key: string]: number } = {};
  const typeLabels: { [key: string]: string } = {
    lesson: 'Lesson Plans',
    quiz: 'Quizzes',
    rubric: 'Rubrics',
    kindergarten: 'Early Childhood Plans',
    multigrade: 'Multi-Level Plans',
    'cross-curricular': 'Integrated Lesson Plans',
    worksheet: 'Worksheets',
    image: 'Images',
    presentation: 'Presentations',
    storybook: 'Storybooks'
  };

  // Get color for a resource type
  const getResourceColor = (resourceType: string): string => {
    const toolType = RESOURCE_TO_TOOL_TYPE[resourceType];
    return tabColors[toolType] || '#6b7280'; // fallback color
  };

  const { start, end } = getDateRange(timeframe);
  const filtered = resources.filter(r => {
    const raw = r.timestamp || r.createdAt;
    const d = raw ? new Date(raw) : null;
    return d && !isBefore(d, start) && !isAfter(d, end);
  });

  filtered.forEach(resource => {
    const type = resource.type || 'lesson';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const total = filtered.length || 1;

  return Object.entries(typeCounts).map(([type, count]) => ({
    type,
    label: typeLabels[type] || type,
    count,
    percentage: Math.round((count / total) * 100),
    color: getResourceColor(type)
  }));
}

/**
 * Group tasks by status (overdue, today, upcoming, completed)
 */
export function groupTasksByStatus(tasks: Task[]): TasksByStatus {
  const today = startOfDay(new Date());
  
  const overdue: Task[] = [];
  const todayTasks: Task[] = [];
  const upcoming: Task[] = [];
  const completed: Task[] = [];

  tasks.forEach(task => {
    if (task.completed) {
      completed.push(task);
      return;
    }

    if (!task.date) {
      upcoming.push(task);
      return;
    }

    try {
      const taskDate = startOfDay(parseISO(task.date));
      
      if (isBefore(taskDate, today)) {
        overdue.push(task);
      } else if (isToday(taskDate)) {
        todayTasks.push(task);
      } else {
        upcoming.push(task);
      }
    } catch (error) {
      console.error('Error parsing task date:', error);
      upcoming.push(task); // Default to upcoming if date parsing fails
    }
  });

  // Sort each group by date, then priority
  const sortByDateAndPriority = (a: Task, b: Task) => {
    const dateCompare = (a.date || '').localeCompare(b.date || '');
    if (dateCompare !== 0) return dateCompare;
    
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  };

  overdue.sort(sortByDateAndPriority);
  todayTasks.sort(sortByDateAndPriority);
  upcoming.sort(sortByDateAndPriority);
  completed.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return { overdue, today: todayTasks, upcoming, completed };
}

/**
 * Calculate tool usage from tabs
 */
export function calculateToolUsage(tabs: Tab[]): ToolUsage[] {
  const usageMap = new Map<string, ToolUsage>();
  
  const toolNames: { [key: string]: string } = {
    'lesson-planner': 'Lesson Planner',
    'quiz-generator': 'Quiz Generator',
    'rubric-generator': 'Rubric Generator',
    'kindergarten-planner': 'Kindergarten Planner',
    'multigrade-planner': 'Multigrade Planner',
    'cross-curricular-planner': 'Cross-Curricular Planner',
    'chat': 'Chat with Assistant',
    'curriculum': 'Curriculum Browser',
    'analytics': 'Analytics Dashboard',
    'resource-manager': 'Resource Manager',
    'curriculum-tracker': 'Progress Tracker'
  };

  const toolIcons: { [key: string]: string } = {
    'lesson-planner': 'BookMarked',
    'quiz-generator': 'ListChecks',
    'rubric-generator': 'FileText',
    'kindergarten-planner': 'GraduationCap',
    'multigrade-planner': 'Users',
    'cross-curricular-planner': 'School',
    'chat': 'MessageSquare',
    'curriculum': 'BookOpen',
    'analytics': 'BarChart3',
    'resource-manager': 'Library',
    'curriculum-tracker': 'Target'
  };

  tabs.forEach(tab => {
    const existing = usageMap.get(tab.type);
    const lastUsed = tab.lastActiveTime || Date.now();
    
    if (existing) {
      existing.count++;
      existing.lastUsed = Math.max(
        new Date(existing.lastUsed).getTime(),
        lastUsed
      ).toString();
    } else {
      usageMap.set(tab.type, {
        type: tab.type,
        name: toolNames[tab.type] || tab.title,
        count: 1,
        lastUsed: lastUsed.toString(),
        icon: toolIcons[tab.type] || 'BookOpen'
      });
    }
  });

  // Also load from localStorage to get historical usage
  try {
    const stored = localStorage.getItem('dashboard-tool-usage');
    if (stored) {
      const historical: ToolUsage[] = JSON.parse(stored);
      historical.forEach(item => {
        const existing = usageMap.get(item.type);
        if (existing) {
          existing.count += item.count;
        } else {
          usageMap.set(item.type, { ...item });
        }
      });
    }
  } catch (error) {
    console.error('Error loading tool usage from localStorage:', error);
  }

  const usage = Array.from(usageMap.values())
    .filter(item => item.type !== 'analytics') // Don't include analytics in "most used"
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5

  // Save updated usage
  try {
    localStorage.setItem('dashboard-tool-usage', JSON.stringify(usage));
  } catch (error) {
    console.error('Error saving tool usage:', error);
  }

  return usage;
}

/**
 * Generate activity feed from resources and tasks
 */
export function generateActivityFeed(
  resources: any[],
  tasks: Task[],
  milestones: any[]
): Activity[] {
  const activities: Activity[] = [];

  // Add resource creation activities
  resources.forEach(resource => {
    activities.push({
      id: `resource-${resource.id}`,
      type: 'resource_created',
      description: `Created ${resource.title}`,
      timestamp: resource.timestamp,
      resourceType: resource.type
    });
  });

  // Add completed task activities
  tasks
    .filter(task => task.completed)
    .forEach(task => {
      activities.push({
        id: `task-${task.id}`,
        type: 'task_completed',
        description: `Completed task: ${task.title}`,
        timestamp: task.updatedAt
      });
    });

  // Add milestone activities
  milestones
    .filter(m => m.status === 'completed')
    .forEach(milestone => {
      if (milestone.completed_at) {
        activities.push({
          id: `milestone-${milestone.id}`,
          type: 'milestone_reached',
          description: `Completed: ${milestone.topic_title}`,
          timestamp: milestone.completed_at
        });
      }
    });

  // Sort by timestamp (most recent first) and limit to last 10
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);
}
/**
 * Calculate quick stats for header
 */
export function calculateQuickStats(resources: any[], tasks: Task[], timeframe: Timeframe = 'month') {
  const { start, end } = getDateRange(timeframe);
  
  // Filter resources in timeframe FOR ACTIVITY METRICS ONLY
  const resourcesInRange = resources.filter(r => {
    try {
      const date = new Date(r.timestamp);
      return date >= start && date <= end;
    } catch (error) {
      console.error('Error parsing resource timestamp:', error);
      return false;
    }
  });

  // Calculate active days - ALL unique days with resources ever created
  const activeDays = new Set(
    resources.map(r => {
      try {
        return format(new Date(r.timestamp), 'yyyy-MM-dd');
      } catch (error) {
        console.error('Error formatting resource date:', error);
        return null;
      }
    }).filter(date => date !== null)
  ).size;

  // Calculate average per week in timeframe
  const daysDiff = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const weeks = Math.max(1, daysDiff / 7);
  const avgPerWeek = Math.round(resourcesInRange.length / weeks);

  // Tasks completion rate (overall, not filtered by timeframe)
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return {
    totalResources: resources.length, // ✅ ALL resources ever created
    activeDays, // ✅ FIXED - ALL unique days with activity (not filtered by timeframe)
    avgPerWeek, // Average for selected timeframe
    completionRate // Overall task completion
  };
}