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

  const renderTaskItem = (task: Task, isOverdue: boolean = false) => {
    const priorityConfig = PRIORITY_CONFIG[task.priority];
    
    return (
      <div
        key={task.id}
        className={`group relative p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
          isOverdue
            ? 'bg-red-50 border-red-200 hover:border-red-300'
            : task.completed
            ? 'bg-gray-50 border-gray-200 opacity-60'
            : 'bg-white border-gray-200 hover:border-blue-300'
        }`}
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
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
            )}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4
                className={`font-semibold text-sm ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {task.title}
              </h4>
              
              {/* Priority Badge */}
              <span
                className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium ${priorityConfig.bgClass} ${priorityConfig.textClass}`}
              >
                {priorityConfig.label}
              </span>
            </div>

            {task.description && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Date */}
            <div className="flex items-center space-x-2 mt-2">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {format(parseISO(task.date), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>

        {/* Overdue Indicator */}
        {isOverdue && !task.completed && (
          <div className="absolute top-2 right-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
        )}
      </div>
    );
  };

  const hasAnyTasks = tasks.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h3 className="font-bold text-gray-900 flex items-center">
          <Flag className="w-5 h-5 mr-2 text-blue-600" />
          Tasks
        </h3>
        <button
          onClick={onAddTask}
          className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Task List - Scrollable with max height */}
      <div className="overflow-y-auto p-4 space-y-4" style={{ maxHeight: '400px' }}>
        {!hasAnyTasks ? (
          <div className="text-center py-12">
            <Flag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No tasks yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add" to create your first task</p>
          </div>
        ) : (
          <>
            {/* Overdue Tasks */}
            {groupedTasks.overdue.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <h4 className="text-xs font-bold text-red-700 uppercase tracking-wide">
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
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wide">
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
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Upcoming ({groupedTasks.upcoming.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {groupedTasks.upcoming.slice(0, 5).map((task) => renderTaskItem(task))}
                </div>
                {groupedTasks.upcoming.length > 5 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    +{groupedTasks.upcoming.length - 5} more tasks
                  </p>
                )}
              </div>
            )}

            {/* Completed Tasks (collapsed) */}
            {groupedTasks.completed.length > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Completed ({groupedTasks.completed.length})
                </h4>
                <div className="space-y-2">
                  {groupedTasks.completed.slice(0, 3).map((task) => renderTaskItem(task))}
                </div>
                {groupedTasks.completed.length > 3 && (
                  <p className="text-xs text-gray-400 mt-2 text-center">
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