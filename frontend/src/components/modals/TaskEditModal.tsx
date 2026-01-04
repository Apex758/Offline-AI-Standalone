import React, { useState } from 'react';
import { X, Calendar, Flag, AlignLeft, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Task, TaskFormData, TaskPriority } from '../../types/task';

interface TaskEditModalProps {
  task?: Task | null;
  selectedDate?: string;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onClose: () => void;
}

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

  // Natural priority colors
  const priorityStyles: { [key in TaskPriority]: { bg: string; border: string; text: string } } = {
    urgent: { bg: '#552A0120', border: '#552A01', text: '#552A01' },
    high: { bg: '#F2A63120', border: '#F2A631', text: '#F2A631' },
    medium: { bg: '#1D362D20', border: '#1D362D', text: '#1D362D' },
    low: { bg: '#E8EAE340', border: '#A8AFA3', text: '#552A01' }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const now = new Date().toISOString();
    const savedTask: Task = task
      ? {
          ...task,
          ...formData,
          updatedAt: now
        }
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
        backgroundColor: 'rgba(2, 13, 3, 0.6)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl w-full max-w-md"
        data-tutorial="task-edit-modal"
        style={{
          backgroundColor: 'rgba(253, 253, 248, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(29, 54, 45, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid #E8EAE3' }}
        >
          <h2 className="text-2xl font-bold" style={{ color: '#020D03' }}>
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            data-tutorial="task-modal-close"
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
          >
            <X className="w-5 h-5" style={{ color: '#552A01' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#552A01' }}>
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg outline-none transition-all"
              style={{
                backgroundColor: 'white',
                border: errors.title ? '1px solid #F2A631' : '1px solid #E8EAE3',
                color: '#020D03',
                boxShadow: '0 2px 8px rgba(29, 54, 45, 0.05)'
              }}
              placeholder="Enter task title"
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-sm" style={{ color: '#F2A631' }}>{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center text-sm font-semibold mb-2" style={{ color: '#552A01' }}>
              <AlignLeft className="w-4 h-4 mr-1" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg outline-none resize-none transition-all"
              style={{
                backgroundColor: 'white',
                border: '1px solid #E8EAE3',
                color: '#020D03',
                boxShadow: '0 2px 8px rgba(29, 54, 45, 0.05)'
              }}
              placeholder="Add details about this task (optional)"
              rows={3}
            />
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center text-sm font-semibold mb-2" style={{ color: '#552A01' }}>
              <Calendar className="w-4 h-4 mr-1" />
              Due Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 rounded-lg outline-none transition-all"
              style={{
                backgroundColor: 'white',
                border: errors.date ? '1px solid #F2A631' : '1px solid #E8EAE3',
                color: '#020D03',
                boxShadow: '0 2px 8px rgba(29, 54, 45, 0.05)'
              }}
            />
            {errors.date && (
              <p className="mt-1 text-sm" style={{ color: '#F2A631' }}>{errors.date}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="flex items-center text-sm font-semibold mb-2" style={{ color: '#552A01' }}>
              <Flag className="w-4 h-4 mr-1" />
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(priorityStyles) as TaskPriority[]).map((priority) => {
                const style = priorityStyles[priority];
                const isSelected = formData.priority === priority;
                
                return (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority })}
                    className="px-3 py-2 rounded-lg font-medium text-sm transition-all"
                    style={{
                      backgroundColor: isSelected ? style.bg : 'white',
                      border: `2px solid ${isSelected ? style.border : '#E8EAE3'}`,
                      color: isSelected ? style.text : '#552A01',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            {task && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
                style={{
                  color: '#F2A631',
                  backgroundColor: '#F2A63120'
                }}
              >
                <Trash2 className="w-4 h-4" />
                <span className="font-medium">Delete</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg transition-all hover:scale-105 font-medium"
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
                type="submit"
                data-tutorial="task-create-button"
                className="px-6 py-2 rounded-lg transition-all hover:scale-105 font-medium"
                style={{
                  backgroundColor: '#1D362D',
                  color: '#F8E59D',
                  boxShadow: '0 4px 12px rgba(29, 54, 45, 0.2)'
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