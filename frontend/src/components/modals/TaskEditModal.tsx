import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Task, TaskFormData, TaskPriority } from '../../types/task';

interface TaskEditModalProps {
  task?: Task | null;
  selectedDate?: string;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onClose: () => void;
}

const priorityOptions: { value: TaskPriority; label: string; dot: string }[] = [
  { value: 'low', label: 'Low', dot: 'var(--dash-text-faint)' },
  { value: 'medium', label: 'Medium', dot: 'var(--dash-primary)' },
  { value: 'high', label: 'High', dot: 'var(--dash-orange)' },
  { value: 'urgent', label: 'Urgent', dot: '#ef4444' },
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

  const selectedPriority = priorityOptions.find(p => p.value === formData.priority)!;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl w-full max-w-sm overflow-hidden"
        data-tutorial="task-edit-modal"
        style={{
          backgroundColor: 'var(--dash-card-bg, rgba(253, 253, 248, 0.97))',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12), 0 0 0 1px var(--dash-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--dash-text)' }}>
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            data-tutorial="task-modal-close"
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--dash-text-faint)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--dash-task-bg)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-4">
          {/* Title */}
          <div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg outline-none text-sm transition-all"
              style={{
                backgroundColor: 'var(--dash-task-bg)',
                border: errors.title ? '1.5px solid #ef4444' : '1.5px solid transparent',
                color: 'var(--dash-text)',
              }}
              onFocus={(e) => { if (!errors.title) e.currentTarget.style.borderColor = 'var(--dash-primary)'; }}
              onBlur={(e) => { if (!errors.title) e.currentTarget.style.borderColor = 'transparent'; }}
              placeholder="Task name"
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-xs" style={{ color: '#ef4444' }}>{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg outline-none resize-none text-sm transition-all"
              style={{
                backgroundColor: 'var(--dash-task-bg)',
                border: '1.5px solid transparent',
                color: 'var(--dash-text)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--dash-primary)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
              placeholder="Add a description (optional)"
              rows={2}
            />
          </div>

          {/* Date & Priority row */}
          <div className="flex gap-3">
            {/* Date */}
            <div className="flex-1">
              <label className="block text-[11px] font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--dash-text-faint)' }}>
                Due date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg outline-none text-sm transition-all"
                style={{
                  backgroundColor: 'var(--dash-task-bg)',
                  border: errors.date ? '1.5px solid #ef4444' : '1.5px solid transparent',
                  color: 'var(--dash-text)',
                }}
                onFocus={(e) => { if (!errors.date) e.currentTarget.style.borderColor = 'var(--dash-primary)'; }}
                onBlur={(e) => { if (!errors.date) e.currentTarget.style.borderColor = 'transparent'; }}
              />
              {errors.date && (
                <p className="mt-1 text-xs" style={{ color: '#ef4444' }}>{errors.date}</p>
              )}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--dash-text-faint)' }}>
              Priority
            </label>
            <div className="flex gap-1.5">
              {priorityOptions.map((p) => {
                const isSelected = formData.priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p.value })}
                    className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: isSelected ? 'var(--dash-task-bg)' : 'transparent',
                      border: isSelected ? '1.5px solid var(--dash-border)' : '1.5px solid transparent',
                      color: isSelected ? 'var(--dash-text)' : 'var(--dash-text-faint)',
                    }}
                  >
                    <div
                      className="rounded-full flex-shrink-0"
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: p.dot,
                        opacity: isSelected ? 1 : 0.5,
                      }}
                    />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {task && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{ color: '#ef4444' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
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
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: 'var(--dash-text-sub)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--dash-task-bg)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                Cancel
              </button>
              <button
                type="submit"
                data-tutorial="task-create-button"
                className="px-5 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                style={{
                  backgroundColor: 'var(--dash-primary)',
                  color: 'var(--dash-primary-fg, white)',
                }}
              >
                {task ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
