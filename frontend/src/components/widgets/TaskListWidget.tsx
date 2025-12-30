import React from 'react';
import { Plus, CheckCircle2, Circle, Calendar, Flag, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Task } from '../../types/task';
import { PRIORITY_CONFIG } from '../../types/task';
import { groupTasksByStatus } from '../../lib/analyticsHelpers';

interface TaskListWidgetProps {
  tasks: Task[];
  selectedDate?: Date;
  onTaskEdit: (task: Task) => void;
  onTaskToggle: (taskId: string) => void;
  onAddTask: () => void;
}

const TaskListWidget: React.FC<TaskListWidgetProps> = ({
  tasks,
  selectedDate,
  onTaskEdit,
  onTaskToggle,
  onAddTask
}) => {
  const groupedTasks = groupTasksByStatus(tasks);

  // Natural priority colors
  const priorityStyles = {
    urgent: { bg: '#552A0120', border: '#552A01', text: '#552A01' },
    high: { bg: '#F2A63120', border: '#F2A631', text: '#F2A631' },
    medium: { bg: '#1D362D20', border: '#1D362D', text: '#1D362D' },
    low: { bg: '#E8EAE340', border: '#A8AFA3', text: '#552A01' }
  };

  const renderTaskItem = (task: Task, isOverdue: boolean = false) => {
    const priority = priorityStyles[task.priority];
    
    return (
      <div
        key={task.id}
        className="group relative p-3 rounded-xl transition-all cursor-pointer"
        style={{
          backgroundColor: isOverdue
            ? '#F2A63120'
            : task.completed
            ? '#FDFDF8'
            : 'white',
          border: `1px solid ${isOverdue ? '#F2A631' : '#E8EAE3'}`,
          boxShadow: '0 2px 8px rgba(29, 54, 45, 0.04)',
          opacity: task.completed ? 0.6 : 1
        }}
        onClick={() => onTaskEdit(task)}
      >
        <div className="flex items-start space-x-3">
          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTaskToggle(task.id);
            }}
            className="flex-shrink-0 mt-0.5"
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5" style={{ color: '#1D362D' }} />
            ) : (
              <Circle className="w-5 h-5 transition-colors" style={{ color: '#E8EAE3' }} />
            )}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4
                className={`font-semibold text-sm ${task.completed ? 'line-through' : ''}`}
                style={{ color: task.completed ? '#A8AFA3' : '#020D03' }}
              >
                {task.title}
              </h4>
              
              {/* Priority Badge */}
              <span
                className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: priority.bg,
                  color: priority.text,
                  border: `1px solid ${priority.border}`
                }}
              >
                {task.priority === 'urgent' ? '!' : task.priority === 'high' ? '↑' : task.priority === 'low' ? '↓' : '•'}
              </span>
            </div>

            {task.description && (
              <p className="text-xs mt-1 line-clamp-2" style={{ color: '#552A01' }}>
                {task.description}
              </p>
            )}

            {/* Date */}
            <div className="flex items-center space-x-2 mt-2">
              <Calendar className="w-3 h-3" style={{ color: '#A8AFA3' }} />
              <span className="text-xs" style={{ color: '#552A01' }}>
                {format(parseISO(task.date), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>

        {/* Overdue Indicator */}
        {isOverdue && !task.completed && (
          <div className="absolute top-2 right-2">
            <AlertCircle className="w-4 h-4" style={{ color: '#F2A631' }} />
          </div>
        )}
      </div>
    );
  };

  const hasAnyTasks = tasks.length > 0;

  return (
    <div 
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: 'white',
        boxShadow: '0 4px 16px rgba(29, 54, 45, 0.08)'
      }}
    >
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom: '1px solid #E8EAE3' }}
      >
        <h3 className="font-bold flex items-center" style={{ color: '#020D03' }}>
          <Flag className="w-5 h-5 mr-2" style={{ color: '#1D362D' }} />
          Tasks
        </h3>
        <button
          onClick={onAddTask}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all hover:scale-105 text-sm font-medium"
          style={{
            backgroundColor: '#F2A631',
            color: 'white',
            boxShadow: '0 2px 8px rgba(242, 166, 49, 0.3)'
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Task List - Scrollable */}
      <div className="overflow-y-auto p-4 space-y-4" style={{ maxHeight: '400px' }}>
        {!hasAnyTasks ? (
          <div className="text-center py-12">
            <Flag className="w-12 h-12 mx-auto mb-3" style={{ color: '#E8EAE3' }} />
            <p className="font-medium" style={{ color: '#552A01' }}>No tasks yet</p>
            <p className="text-sm mt-1" style={{ color: '#A8AFA3' }}>Click "Add" to create your first task</p>
          </div>
        ) : (
          <>
            {/* Overdue Tasks */}
            {groupedTasks.overdue.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4" style={{ color: '#F2A631' }} />
                  <h4 className="text-xs font-bold uppercase tracking-wide" style={{ color: '#F2A631' }}>
                    Overdue ({groupedTasks.overdue.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {groupedTasks.overdue.map((task) => renderTaskItem(task, true))}
                </div>
              </div>
            )}

            {/* Today's Tasks */}
            {groupedTasks.today.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4" style={{ color: '#1D362D' }} />
                  <h4 className="text-xs font-bold uppercase tracking-wide" style={{ color: '#1D362D' }}>
                    Today ({groupedTasks.today.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {groupedTasks.today.map((task) => renderTaskItem(task))}
                </div>
              </div>
            )}

            {/* Upcoming Tasks */}
            {groupedTasks.upcoming.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4" style={{ color: '#552A01' }} />
                  <h4 className="text-xs font-bold uppercase tracking-wide" style={{ color: '#552A01' }}>
                    Upcoming ({groupedTasks.upcoming.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {groupedTasks.upcoming.slice(0, 5).map((task) => renderTaskItem(task))}
                </div>
                {groupedTasks.upcoming.length > 5 && (
                  <p className="text-xs mt-2 text-center" style={{ color: '#A8AFA3' }}>
                    +{groupedTasks.upcoming.length - 5} more tasks
                  </p>
                )}
              </div>
            )}

            {/* Completed Tasks (collapsed) */}
            {groupedTasks.completed.length > 0 && (
              <div className="pt-3" style={{ borderTop: '1px solid #E8EAE3' }}>
                <h4 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#A8AFA3' }}>
                  Completed ({groupedTasks.completed.length})
                </h4>
                <div className="space-y-2">
                  {groupedTasks.completed.slice(0, 3).map((task) => renderTaskItem(task))}
                </div>
                {groupedTasks.completed.length > 3 && (
                  <p className="text-xs mt-2 text-center" style={{ color: '#A8AFA3' }}>
                    +{groupedTasks.completed.length - 3} more completed
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskListWidget;