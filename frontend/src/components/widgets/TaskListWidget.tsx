import React, { useState } from 'react';
import { Plus, Check, Calendar, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Task } from '../../types/task';
import { groupTasksByStatus } from '../../lib/analyticsHelpers';

interface TaskListWidgetProps {
  tasks: Task[];
  selectedDate?: Date;
  onTaskEdit: (task: Task) => void;
  onTaskToggle: (taskId: string) => void;
  onAddTask: () => void;
}

const priorityColors: Record<string, { dot: string; gradient: string }> = {
  urgent: { dot: '#ef4444', gradient: 'rgba(239, 68, 68, 0.15)' },
  high: { dot: 'var(--dash-orange)', gradient: 'var(--dash-orange-a12)' },
  medium: { dot: 'var(--dash-primary)', gradient: 'var(--dash-primary-a12)' },
  low: { dot: 'var(--dash-text-faint)', gradient: 'rgba(148, 163, 184, 0.06)' },
};

const TaskListWidget: React.FC<TaskListWidgetProps> = ({
  tasks,
  onTaskEdit,
  onTaskToggle,
  onAddTask
}) => {
  const groupedTasks = groupTasksByStatus(tasks);
  const [showCompleted, setShowCompleted] = useState(false);
  const hasAnyTasks = tasks.length > 0;

  const renderTaskItem = (task: Task, isOverdue: boolean = false) => {
    const colors = priorityColors[task.priority] || priorityColors.low;
    const gradientBg = task.completed
      ? 'transparent'
      : `linear-gradient(to right, ${colors.gradient} 0%, transparent 80%)`;

    return (
    <div
      key={task.id}
      className="group relative flex items-center gap-3 pl-10 pr-3 py-2.5 rounded-lg transition-colors cursor-pointer"
      style={{
        opacity: task.completed ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        const bg = e.currentTarget.querySelector('[data-gradient]') as HTMLElement;
        if (!task.completed && bg) {
          bg.style.background = `linear-gradient(to right, ${colors.gradient} 0%, var(--dash-task-bg) 80%)`;
        }
      }}
      onMouseLeave={(e) => {
        const bg = e.currentTarget.querySelector('[data-gradient]') as HTMLElement;
        if (bg) bg.style.background = task.completed ? 'transparent' : gradientBg;
      }}
      onClick={() => onTaskEdit(task)}
    >
      {/* Gradient background with rounded left edge */}
      {!task.completed && (
        <div
          data-gradient
          className="absolute inset-y-0 right-0 pointer-events-none"
          style={{
            left: '1.5rem',
            background: gradientBg,
            borderRadius: '8px 4px 4px 8px',
          }}
        />
      )}
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTaskToggle(task.id);
        }}
        className="flex-shrink-0 flex items-center justify-center rounded-full transition-all"
        style={{
          width: 20,
          height: 20,
          border: task.completed
            ? '2px solid var(--dash-primary)'
            : `2px solid var(--dash-border)`,
          background: task.completed ? 'var(--dash-primary)' : 'transparent',
        }}
      >
        {task.completed && <Check className="w-3 h-3" style={{ color: 'white' }} strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span
          className={`text-sm ${task.completed ? 'line-through' : ''}`}
          style={{
            color: task.completed ? 'var(--dash-text-faint)' : 'var(--dash-text)',
            fontWeight: 500,
          }}
        >
          {task.title}
        </span>
        {(task.date || isOverdue) && (
          <div className="flex items-center gap-1 mt-0.5">
            {isOverdue && !task.completed ? (
              <Clock className="w-3 h-3" style={{ color: 'var(--dash-orange)' }} />
            ) : (
              <Calendar className="w-3 h-3" style={{ color: 'var(--dash-text-faint)' }} />
            )}
            <span
              className="text-xs"
              style={{ color: isOverdue && !task.completed ? 'var(--dash-orange)' : 'var(--dash-text-faint)' }}
            >
              {format(parseISO(task.date), 'MMM d')}
            </span>
          </div>
        )}
      </div>

      {/* Priority dot */}
      <div
        className="flex-shrink-0 rounded-full"
        style={{
          width: 8,
          height: 8,
          backgroundColor: colors.dot,
        }}
      />
    </div>
    );
  };

  const renderSection = (
    label: string,
    taskList: Task[],
    isOverdue: boolean = false,
    limit?: number
  ) => {
    if (taskList.length === 0) return null;
    const displayed = limit ? taskList.slice(0, limit) : taskList;
    const remaining = limit ? taskList.length - limit : 0;

    return (
      <div>
        <div className="flex items-center justify-between px-3 mb-1">
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: isOverdue ? 'var(--dash-orange)' : 'var(--dash-text-faint)' }}
          >
            {label}
          </span>
          <span
            className="text-[11px] tabular-nums"
            style={{ color: 'var(--dash-text-faint)' }}
          >
            {taskList.length}
          </span>
        </div>
        <div>
          {displayed.map((task) => renderTaskItem(task, isOverdue))}
        </div>
        {remaining > 0 && (
          <p className="text-[11px] px-3 py-1" style={{ color: 'var(--dash-text-faint)' }}>
            +{remaining} more
          </p>
        )}
      </div>
    );
  };

  return (
    <div
      className="widget-glass rounded-2xl overflow-hidden flex flex-col"
      data-tutorial="analytics-task-widget"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between flex-shrink-0">
        <h3
          className="text-sm font-semibold tracking-tight"
          style={{ color: 'var(--dash-text)' }}
        >
          Tasks
          {hasAnyTasks && (
            <span
              className="ml-2 text-xs font-normal"
              style={{ color: 'var(--dash-text-faint)' }}
            >
              {tasks.filter(t => !t.completed).length} remaining
            </span>
          )}
        </h3>
        <button
          onClick={onAddTask}
          data-tutorial="analytics-add-task"
          className="flex items-center justify-center rounded-lg transition-all hover:scale-105"
          style={{
            width: 32,
            height: 32,
            backgroundColor: 'var(--dash-primary-a12)',
            color: 'var(--dash-primary)',
          }}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Task List */}
      <div
        className="overflow-y-auto px-1 pb-3 space-y-3"
        data-tutorial="analytics-task-list"
        style={{ maxHeight: '500px' }}
      >
        {!hasAnyTasks ? (
          <div className="text-center py-10 px-4">
            <div
              className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: 'var(--dash-primary-a12)' }}
            >
              <Check className="w-5 h-5" style={{ color: 'var(--dash-primary)' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--dash-text-sub)' }}>
              No tasks yet
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--dash-text-faint)' }}>
              Add your first task to get started
            </p>
          </div>
        ) : (
          <>
            {renderSection('Overdue', groupedTasks.overdue, true)}
            {renderSection('Today', groupedTasks.today)}
            {renderSection('Upcoming', groupedTasks.upcoming, false, 5)}

            {/* Completed - collapsible */}
            {groupedTasks.completed.length > 0 && (
              <div>
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="flex items-center gap-1 px-3 py-1 w-full text-left"
                >
                  {showCompleted ? (
                    <ChevronDown className="w-3 h-3" style={{ color: 'var(--dash-text-faint)' }} />
                  ) : (
                    <ChevronRight className="w-3 h-3" style={{ color: 'var(--dash-text-faint)' }} />
                  )}
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--dash-text-faint)' }}
                  >
                    Completed
                  </span>
                  <span
                    className="text-[11px] ml-auto tabular-nums"
                    style={{ color: 'var(--dash-text-faint)' }}
                  >
                    {groupedTasks.completed.length}
                  </span>
                </button>
                {showCompleted && (
                  <div>
                    {groupedTasks.completed.map((task) => renderTaskItem(task))}
                  </div>
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
