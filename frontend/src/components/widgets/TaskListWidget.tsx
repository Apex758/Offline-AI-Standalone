import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import PlusSignIconData from '@hugeicons/core-free-icons/PlusSignIcon';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import Calendar01IconData from '@hugeicons/core-free-icons/Calendar01Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import Task01IconData from '@hugeicons/core-free-icons/Task01Icon';

const IconW: React.FC<{ icon: any; className?: string; style?: React.CSSProperties; strokeWidth?: number }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Plus: React.FC<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }> = (p) => <IconW icon={PlusSignIconData} {...p} />;
const Check: React.FC<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }> = (p) => <IconW icon={Tick01IconData} {...p} />;
const Calendar: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Calendar01IconData} {...p} />;
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ArrowDown01IconData} {...p} />;
const ChevronRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ArrowRight01IconData} {...p} />;
const Clock: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Clock01IconData} {...p} />;
const ListTodo: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Task01IconData} {...p} />;
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
  const { t } = useTranslation();
  const groupedTasks = groupTasksByStatus(tasks);
  const [showCompleted, setShowCompleted] = useState(false);
  const hasAnyTasks = tasks.length > 0;
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const renderTaskItem = (task: Task, isOverdue: boolean = false) => {
    const colors = priorityColors[task.priority] || priorityColors.low;
    const gradientBg = task.completed
      ? 'transparent'
      : `linear-gradient(to right, ${colors.gradient} 0%, transparent 80%)`;

    return (
    <div
      key={task.id}
      className="group relative flex items-center gap-3 pl-10 pr-3 py-2.5 rounded-xl transition-all cursor-pointer"
      style={{
        opacity: task.completed ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(2px)';
        const bg = e.currentTarget.querySelector('[data-gradient]') as HTMLElement;
        if (!task.completed && bg) {
          bg.style.background = `linear-gradient(to right, ${colors.gradient} 0%, var(--dash-task-bg) 80%)`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
        const bg = e.currentTarget.querySelector('[data-gradient]') as HTMLElement;
        if (bg) bg.style.background = task.completed ? 'transparent' : gradientBg;
      }}
      onClick={() => onTaskEdit(task)}
    >
      {/* Gradient background with rounded left edge */}
      {!task.completed && (
        <div
          data-gradient
          className="absolute inset-y-0 right-0 pointer-events-none transition-all"
          style={{
            left: '1.5rem',
            background: gradientBg,
            borderRadius: '10px 6px 6px 10px',
          }}
        />
      )}
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTaskToggle(task.id);
        }}
        className="relative z-10 flex-shrink-0 flex items-center justify-center rounded-full transition-all"
        style={{
          width: 20,
          height: 20,
          border: task.completed
            ? '2px solid var(--dash-primary)'
            : `2px solid var(--dash-border)`,
          background: task.completed ? 'var(--dash-primary)' : 'transparent',
          boxShadow: task.completed ? '0 0 6px var(--dash-primary-a12)' : 'none',
        }}
        onMouseEnter={(e) => {
          if (!task.completed) {
            e.currentTarget.style.borderColor = 'var(--dash-primary)';
            e.currentTarget.style.transform = 'scale(1.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (!task.completed) {
            e.currentTarget.style.borderColor = 'var(--dash-border)';
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        {task.completed && <Check className="w-3 h-3" style={{ color: 'white' }} strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 relative z-10">
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
        className="relative z-10 flex-shrink-0 rounded-full transition-all"
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
        <div className="flex items-center justify-between px-3 mb-1.5">
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: isOverdue ? 'var(--dash-orange)' : 'var(--dash-text-faint)' }}
          >
            {label}
          </span>
          <span
            className="text-[10px] font-medium tabular-nums px-1.5 py-0.5 rounded-md"
            style={{
              color: isOverdue ? 'var(--dash-orange)' : 'var(--dash-text-faint)',
              backgroundColor: isOverdue ? 'rgba(239, 68, 68, 0.08)' : 'var(--dash-task-bg)',
            }}
          >
            {taskList.length}
          </span>
        </div>
        <div className="space-y-0.5">
          {displayed.map((task) => renderTaskItem(task, isOverdue))}
        </div>
        {remaining > 0 && (
          <p className="text-[11px] px-3 py-1.5 font-medium" style={{ color: 'var(--dash-primary)' }}>
            {t('tasks.moreItems', { count: remaining })}
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
        <div className="flex-1">
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
                {t('tasks.remaining', { count: tasks.filter(task => !task.completed).length })}
              </span>
            )}
          </h3>
          {/* Progress bar */}
          {hasAnyTasks && (
            <div className="mt-2 flex items-center gap-2">
              <div
                className="flex-1 rounded-full overflow-hidden"
                style={{ height: 3, backgroundColor: 'var(--dash-task-bg)' }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress * 100}%`,
                    backgroundColor: 'var(--dash-primary)',
                    transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
              <span
                className="text-[10px] font-medium tabular-nums"
                style={{ color: 'var(--dash-text-faint)' }}
              >
                {Math.round(progress * 100)}%
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onAddTask}
          data-tutorial="analytics-add-task"
          className="flex items-center justify-center rounded-xl transition-all ml-3"
          style={{
            width: 32,
            height: 32,
            backgroundColor: 'var(--dash-primary-a12)',
            color: 'var(--dash-primary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
            e.currentTarget.style.backgroundColor = 'var(--dash-primary)';
            e.currentTarget.style.color = 'var(--dash-primary-fg, white)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.backgroundColor = 'var(--dash-primary-a12)';
            e.currentTarget.style.color = 'var(--dash-primary)';
          }}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Task List */}
      <div
        className="overflow-y-auto px-1 pb-3 space-y-4"
        data-tutorial="analytics-task-list"
        style={{ maxHeight: '500px' }}
      >
        {!hasAnyTasks ? (
          <div className="text-center py-12 px-4">
            <div
              className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{
                backgroundColor: 'var(--dash-primary-a12)',
                boxShadow: '0 4px 12px var(--dash-primary-a12)',
              }}
            >
              <ListTodo className="w-6 h-6" style={{ color: 'var(--dash-primary)' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--dash-text-sub)' }}>
              {t('tasks.noTasksYet')}
            </p>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--dash-text-faint)' }}>
              {t('tasks.addFirstTask')}
            </p>
          </div>
        ) : (
          <>
            {renderSection(t('tasks.overdue'), groupedTasks.overdue, true)}
            {renderSection(t('tasks.today'), groupedTasks.today)}
            {renderSection(t('tasks.upcoming'), groupedTasks.upcoming, false, 5)}

            {/* Completed - collapsible */}
            {groupedTasks.completed.length > 0 && (
              <div>
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="flex items-center gap-1.5 px-3 py-1.5 w-full text-left rounded-lg transition-all"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--dash-task-bg)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div
                    className="transition-transform"
                    style={{
                      transform: showCompleted ? 'rotate(0deg)' : 'rotate(-90deg)',
                      color: 'var(--dash-text-faint)',
                    }}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--dash-text-faint)' }}
                  >
                    {t('tasks.completed')}
                  </span>
                  <span
                    className="text-[10px] font-medium ml-auto tabular-nums px-1.5 py-0.5 rounded-md"
                    style={{
                      color: 'var(--dash-text-faint)',
                      backgroundColor: 'var(--dash-task-bg)',
                    }}
                  >
                    {groupedTasks.completed.length}
                  </span>
                </button>
                {showCompleted && (
                  <div className="space-y-0.5 mt-1">
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
