import React, { useState, useEffect } from 'react';
import { X, Trash2, CalendarDays, Type, AlignLeft, Flag } from 'lucide-react';
import { format } from 'date-fns';
import type { Task, TaskFormData, TaskPriority } from '../../types/task';

interface TaskEditModalProps {
  task?: Task | null;
  selectedDate?: string;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onClose: () => void;
}

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'var(--dash-text-faint)' },
  { value: 'medium', label: 'Medium', color: 'var(--dash-primary)' },
  { value: 'high', label: 'High', color: 'var(--dash-orange)' },
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
];

const TaskEditModal: React.FC<TaskEditModalProps> = ({
  task,
  selectedDate,
  onSave,
  onDelete,
  onClose
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    description: task?.description || '',
    date: task?.date || selectedDate || format(new Date(), 'yyyy-MM-dd'),
    priority: task?.priority || 'medium'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date().toISOString();
    const savedTask: Task = task
      ? { ...task, ...formData, updatedAt: now }
      : {
          id: `task-${Date.now()}`,
          ...formData,
          completed: false,
          createdAt: now,
          updatedAt: now
        };

    onSave(savedTask);
    onClose();
  };

  const handleDelete = () => {
    if (task && onDelete && confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{
        backgroundColor: mounted ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: mounted ? 'blur(8px)' : 'blur(0px)',
        transition: 'background-color 0.2s ease, backdrop-filter 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl w-full max-w-md overflow-hidden"
        data-tutorial="task-edit-modal"
        style={{
          backgroundColor: 'var(--dash-card-bg, rgba(253, 253, 248, 0.97))',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px var(--dash-border)',
          transform: mounted ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
          opacity: mounted ? 1 : 0,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-1">
          <h2 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--dash-text)' }}>
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            data-tutorial="task-modal-close"
            className="p-1.5 rounded-xl transition-all"
            style={{ color: 'var(--dash-text-faint)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--dash-task-bg)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-5">
          {/* Title */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--dash-text-faint)' }}>
              <Type className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full pl-10 pr-3 py-3 rounded-xl outline-none text-sm font-medium transition-all"
              style={{
                backgroundColor: 'var(--dash-task-bg)',
                border: errors.title ? '1.5px solid #ef4444' : '1.5px solid transparent',
                color: 'var(--dash-text)',
              }}
              onFocus={(e) => {
                if (!errors.title) e.currentTarget.style.borderColor = 'var(--dash-primary)';
                e.currentTarget.style.boxShadow = '0 0 0 3px var(--dash-primary-a12)';
              }}
              onBlur={(e) => {
                if (!errors.title) e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="Task name"
              autoFocus
            />
            {errors.title && (
              <p className="mt-1.5 text-xs font-medium" style={{ color: '#ef4444' }}>{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="relative">
            <div className="absolute left-3 top-3 pointer-events-none" style={{ color: 'var(--dash-text-faint)' }}>
              <AlignLeft className="w-4 h-4" />
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full pl-10 pr-3 py-3 rounded-xl outline-none resize-none text-sm transition-all"
              style={{
                backgroundColor: 'var(--dash-task-bg)',
                border: '1.5px solid transparent',
                color: 'var(--dash-text)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--dash-primary)';
                e.currentTarget.style.boxShadow = '0 0 0 3px var(--dash-primary-a12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="Add a description (optional)"
              rows={2}
            />
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--dash-text-faint)' }}>
              <CalendarDays className="w-3.5 h-3.5" />
              Due date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl outline-none text-sm transition-all"
              style={{
                backgroundColor: 'var(--dash-task-bg)',
                border: errors.date ? '1.5px solid #ef4444' : '1.5px solid transparent',
                color: 'var(--dash-text)',
              }}
              onFocus={(e) => {
                if (!errors.date) e.currentTarget.style.borderColor = 'var(--dash-primary)';
                e.currentTarget.style.boxShadow = '0 0 0 3px var(--dash-primary-a12)';
              }}
              onBlur={(e) => {
                if (!errors.date) e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.date && (
              <p className="mt-1.5 text-xs font-medium" style={{ color: '#ef4444' }}>{errors.date}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--dash-text-faint)' }}>
              <Flag className="w-3.5 h-3.5" />
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {priorityOptions.map((p) => {
                const isSelected = formData.priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p.value })}
                    className="relative flex flex-col items-center gap-2 px-2 py-2.5 rounded-xl text-xs font-medium transition-all"
                    style={{
                      backgroundColor: isSelected ? 'var(--dash-task-bg)' : 'transparent',
                      border: isSelected ? '1.5px solid var(--dash-border)' : '1.5px solid transparent',
                      color: isSelected ? 'var(--dash-text)' : 'var(--dash-text-faint)',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--dash-task-bg)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div
                      className="rounded-full flex-shrink-0 transition-all"
                      style={{
                        width: isSelected ? 10 : 8,
                        height: isSelected ? 10 : 8,
                        backgroundColor: p.color,
                        opacity: isSelected ? 1 : 0.45,
                        boxShadow: isSelected ? `0 0 8px ${p.color}` : 'none',
                      }}
                    />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--dash-border)', opacity: 0.5 }} />

          {/* Actions */}
          <div className="flex items-center justify-between">
            {task && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                style={{ color: '#ef4444' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  color: 'var(--dash-text-sub)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--dash-task-bg)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                data-tutorial="task-create-button"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: 'var(--dash-primary)',
                  color: 'var(--dash-primary-fg, white)',
                  boxShadow: '0 2px 8px var(--dash-primary-a12)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 14px var(--dash-primary-a12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px var(--dash-primary-a12)';
                }}
              >
                {task ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
