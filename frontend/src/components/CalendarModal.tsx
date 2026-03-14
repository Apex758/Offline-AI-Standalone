import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  isSameMonth,
  setMonth,
  setYear,
  getYear
} from 'date-fns';
import {
  X, ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  BookMarked, ListChecks, FileText, GraduationCap, Users, School,
  Eye, Edit, TrendingUp, Activity, Plus, CheckCircle2, Circle,
  Clock, Sparkles
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  timestamp: string;
  type: 'lesson' | 'quiz' | 'rubric' | 'kindergarten' | 'multigrade' | 'cross-curricular';
  formData?: any;
  generatedPlan?: string;
  generatedQuiz?: string;
  generatedRubric?: string;
}

import type { Milestone } from '../types/milestone';
import { milestoneApi } from '../lib/milestoneApi';

interface CalendarModalProps {
  resourcesByDate: { [date: string]: Resource[] };
  onClose: () => void;
  onViewResource?: (type: string, resource: Resource) => void;
  onEditResource?: (type: string, resource: Resource) => void;
  tasksByDate?: { [date: string]: any[] };
  initialDate?: Date;
  onDateSelect?: (date: Date) => void;
  onTaskAdd?: () => void;
  onTaskEdit?: (task: any) => void;
  onTaskToggle?: (taskId: string) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  resourcesByDate,
  onClose,
  onViewResource,
  onEditResource,
  tasksByDate = {},
  initialDate,
  onDateSelect: onDateSelectCallback,
  onTaskAdd,
  onTaskEdit,
  onTaskToggle
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate || new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(getYear(initialDate || new Date()));
  const [pendingScrollTarget, setPendingScrollTarget] = useState<Date | null>(null);

  // Milestone state
  const [upcomingMilestones, setUpcomingMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    const loadMilestones = async () => {
      const teacherId = JSON.parse(localStorage.getItem('user') || '{}').username;
      if (teacherId) {
        const milestones = await milestoneApi.getUpcoming(teacherId, 30);
        setUpcomingMilestones(milestones);
      }
    };
    loadMilestones();
  }, []);

  // Group milestones by date
  const milestonesByDate = useMemo(() => {
    const grouped: { [date: string]: Milestone[] } = {};
    upcomingMilestones.forEach(m => {
      if (m.due_date) {
        const dateKey = m.due_date.split('T')[0];
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(m);
      }
    });
    return grouped;
  }, [upcomingMilestones]);

  const [monthList, setMonthList] = useState<Date[]>(() => {
    const current = startOfMonth(initialDate || new Date());
    return [
      subMonths(current, 1),
      current,
      addMonths(current, 1)
    ];
  });

  // Scroll to current month on initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = calendarRef.current;
      if (!el) return;
      const monthSections = el.querySelectorAll('.month-section');
      const currentMonthSection = monthSections[1] as HTMLElement;
      if (currentMonthSection) {
        el.scrollTo({
          top: currentMonthSection.offsetTop - 320,
          behavior: 'auto'
        });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Calculate statistics for current month
  const monthStats = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    let totalResources = 0;
    let activeDays = 0;
    const typeCount: { [key: string]: number } = {};

    daysInMonth.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const resources = resourcesByDate[dateKey] || [];
      if (resources.length > 0) {
        activeDays++;
        totalResources += resources.length;
        resources.forEach(r => {
          typeCount[r.type] = (typeCount[r.type] || 0) + 1;
        });
      }
    });

    return { totalResources, activeDays, typeCount };
  }, [currentMonth, resourcesByDate]);

  // Get resource type config
  const getTypeConfig = (type: string) => {
    const configs: {
      [key: string]: { icon: any; color: string; bg: string; label: string };
    } = {
      lesson: { icon: BookMarked, color: '#1D362D', bg: '#1D362D15', label: 'Lesson' },
      quiz: { icon: ListChecks, color: '#F2A631', bg: '#F2A63115', label: 'Quiz' },
      rubric: { icon: FileText, color: '#552A01', bg: '#552A0115', label: 'Rubric' },
      kindergarten: { icon: GraduationCap, color: '#1D362D', bg: '#1D362D15', label: 'Early Childhood' },
      multigrade: { icon: Users, color: '#552A01', bg: '#552A0115', label: 'Multi-Level' },
      'cross-curricular': { icon: School, color: '#F2A631', bg: '#F2A63115', label: 'Integrated Lesson' }
    };
    return configs[type] || configs.lesson;
  };

  // Generate calendar days for a month
  const getMonthDays = (date: Date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = subMonths(prev, 1);
      rebuildMonthListAround(newDate);
      setPendingScrollTarget(newDate);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = addMonths(prev, 1);
      rebuildMonthListAround(newDate);
      setPendingScrollTarget(newDate);
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (onDateSelectCallback) {
      onDateSelectCallback(date);
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(setYear(new Date(), pickerYear), monthIndex);
    setCurrentMonth(newDate);
    rebuildMonthListAround(newDate);
    setPendingScrollTarget(newDate);
    setShowMonthPicker(false);
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    setPickerYear(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };

  const getResourceCount = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return resourcesByDate[dateKey]?.length || 0;
  };

  const getActivityLevel = (count: number): 'none' | 'low' | 'medium' | 'high' => {
    if (count === 0) return 'none';
    if (count <= 2) return 'low';
    if (count <= 5) return 'medium';
    return 'high';
  };

  // Click outside handler for month picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMonthPicker) {
        const target = event.target as HTMLElement;
        if (!target.closest('.month-picker-container')) {
          setShowMonthPicker(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMonthPicker]);

  // Infinite Scroll Listener
  useEffect(() => {
    const el = calendarRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const offsetHeight = el.offsetHeight;
      if (scrollTop < 200) prependMonths();
      if (scrollTop + offsetHeight > scrollHeight - 200) appendMonths();
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const prependMonths = () => {
    const el = calendarRef.current;
    if (!el) return;
    const oldHeight = el.scrollHeight;
    setMonthList(prev => {
      const first = prev[0];
      const newMonth = subMonths(first, 1);
      if (prev.some(m => isSameMonth(m, newMonth))) return prev;
      return [newMonth, ...prev];
    });
    setTimeout(() => {
      const newHeight = el.scrollHeight;
      el.scrollTop += newHeight - oldHeight;
    }, 0);
  };

  const appendMonths = () => {
    setMonthList(prev => {
      const last = prev[prev.length - 1];
      const newMonth = addMonths(last, 1);
      if (prev.some(m => isSameMonth(m, newMonth))) return prev;
      return [...prev, newMonth];
    });
  };

  useEffect(() => {
    if (!pendingScrollTarget) return;
    scrollToMonth(pendingScrollTarget);
    setPendingScrollTarget(null);
  }, [monthList]);

  const rebuildMonthListAround = (center: Date) => {
    const base = startOfMonth(center);
    setMonthList([subMonths(base, 1), base, addMonths(base, 1)]);
  };

  const scrollToMonth = (targetMonth: Date) => {
    const el = calendarRef.current;
    if (!el) return;
    const index = monthList.findIndex(m => isSameMonth(m, targetMonth));
    if (index === -1) return;
    const monthSections = el.querySelectorAll('.month-section');
    const section = monthSections[index] as HTMLElement;
    if (!section) return;
    el.scrollTo({ top: section.offsetTop - 20, behavior: 'smooth' });
  };

  // Get resources for selected date
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedResources = resourcesByDate[selectedDateKey] || [];
  const selectedTasks = tasksByDate[selectedDateKey] || [];
  const selectedMilestones = milestonesByDate[selectedDateKey] || [];

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
    rebuildMonthListAround(today);
    setPendingScrollTarget(today);
    if (onDateSelectCallback) onDateSelectCallback(today);
  };

  return (
    <div
      className="cal-modal-overlay"
      onClick={onClose}
    >
      <div
        className="cal-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cal-header">
          <div className="cal-header-left">
            <div className="cal-header-icon">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="cal-header-title">Calendar</h2>
              <p className="cal-header-subtitle">
                {format(currentMonth, 'MMMM yyyy')}
              </p>
            </div>
          </div>
          <div className="cal-header-actions">
            <button onClick={goToToday} className="cal-today-btn">
              Today
            </button>
            <button onClick={onClose} className="cal-close-btn">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* Main Content */}
        <div className="cal-body">
          {/* Calendar Section */}
          <div className="cal-calendar-section">
            {/* Month Navigation */}
            <div className="cal-month-nav">
              <button onClick={goToPreviousMonth} className="cal-nav-btn">
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  className="cal-month-title-btn"
                  onClick={() => {
                    setPickerYear(currentMonth.getFullYear());
                    setShowMonthPicker(prev => !prev);
                  }}
                  type="button"
                  data-active={showMonthPicker}
                >
                  {format(currentMonth, 'MMMM yyyy')}
                  <svg
                    className={`cal-chevron-icon ${showMonthPicker ? 'cal-chevron-rotated' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showMonthPicker && (
                  <div className="month-picker-container cal-month-picker">
                    <div className="cal-picker-year-nav">
                      <button onClick={() => handleYearChange('prev')} className="cal-nav-btn" type="button">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="cal-picker-year">{pickerYear}</span>
                      <button onClick={() => handleYearChange('next')} className="cal-nav-btn" type="button">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="cal-picker-grid">
                      {Array.from({ length: 12 }).map((_, idx) => {
                        const isActive = currentMonth.getMonth() === idx && currentMonth.getFullYear() === pickerYear;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleMonthSelect(idx)}
                            className={`cal-picker-month ${isActive ? 'cal-picker-month-active' : ''}`}
                            type="button"
                          >
                            {format(new Date(pickerYear, idx, 1), 'MMM')}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={goToNextMonth} className="cal-nav-btn">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Continuous Calendar */}
            <div ref={calendarRef} className="cal-scroll-area">
              <div className="cal-grid-container">
                {/* Weekday Headers */}
                <div className="cal-weekday-header">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="cal-weekday-cell">{day}</div>
                  ))}
                </div>

                {/* Months */}
                <div className="cal-months-list">
                  {monthList.map((month, monthIndex) => {
                    const days = getMonthDays(month);
                    return (
                      <div key={monthIndex} className="month-section cal-month-card">
                        <h4 className="cal-month-label">{format(month, 'MMMM yyyy')}</h4>
                        <div className="cal-days-grid">
                          {days.map((day, dayIndex) => {
                            const resourceCount = getResourceCount(day);
                            const isSelected = isSameDay(day, selectedDate);
                            const isTodayDate = isToday(day);
                            const isCurrentMonth = isSameMonth(day, month);
                            const level = getActivityLevel(resourceCount);
                            const dateKey = format(day, 'yyyy-MM-dd');
                            const hasMilestone = milestonesByDate[dateKey]?.length > 0;
                            const hasTask = tasksByDate[dateKey]?.length > 0;

                            return (
                              <button
                                key={dayIndex}
                                onClick={() => handleDateClick(day)}
                                className={`cal-day-cell ${isSelected ? 'cal-day-selected' : ''} ${isTodayDate && !isSelected ? 'cal-day-today' : ''} ${!isCurrentMonth ? 'cal-day-outside' : ''}`}
                                data-level={level}
                                disabled={!isCurrentMonth}
                              >
                                <span className="cal-day-number">{format(day, 'd')}</span>
                                {isCurrentMonth && (resourceCount > 0 || hasMilestone || hasTask) && (
                                  <div className="cal-day-indicators">
                                    {resourceCount > 0 && (
                                      <div className={`cal-indicator cal-indicator-resource ${isSelected ? 'cal-indicator-selected' : ''}`} />
                                    )}
                                    {hasTask && (
                                      <div className={`cal-indicator cal-indicator-task ${isSelected ? 'cal-indicator-selected' : ''}`} />
                                    )}
                                    {hasMilestone && (
                                      <div className={`cal-indicator cal-indicator-milestone ${isSelected ? 'cal-indicator-selected' : ''}`} />
                                    )}
                                  </div>
                                )}
                                {resourceCount > 1 && isCurrentMonth && (
                                  <span className={`cal-day-badge ${isSelected ? 'cal-day-badge-selected' : ''}`}>
                                    {resourceCount}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="cal-legend">
              <div className="cal-legend-group">
                <span className="cal-legend-label">Activity:</span>
                <div className="cal-legend-items">
                  <div className="cal-legend-item">
                    <div className="cal-legend-swatch cal-legend-low" />
                    <span>1-2</span>
                  </div>
                  <div className="cal-legend-item">
                    <div className="cal-legend-swatch cal-legend-medium" />
                    <span>3-5</span>
                  </div>
                  <div className="cal-legend-item">
                    <div className="cal-legend-swatch cal-legend-high" />
                    <span>6+</span>
                  </div>
                </div>
              </div>
              <div className="cal-legend-group">
                <div className="cal-legend-items">
                  <div className="cal-legend-item">
                    <div className="cal-legend-dot" style={{ backgroundColor: '#1D362D' }} />
                    <span>Resources</span>
                  </div>
                  <div className="cal-legend-item">
                    <div className="cal-legend-dot" style={{ backgroundColor: '#F2A631' }} />
                    <span>Tasks</span>
                  </div>
                  <div className="cal-legend-item">
                    <div className="cal-legend-dot" style={{ backgroundColor: '#8B5CF6' }} />
                    <span>Milestones</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="cal-details-panel">
            {/* Selected Date Display */}
            <div className="cal-date-display">
              <div className="cal-date-day">{format(selectedDate, 'd')}</div>
              <div className="cal-date-weekday">{format(selectedDate, 'EEEE')}</div>
              <div className="cal-date-month">{format(selectedDate, 'MMMM yyyy')}</div>
              {(selectedResources.length > 0 || selectedTasks.length > 0 || selectedMilestones.length > 0) && (
                <div className="cal-date-counts">
                  {selectedResources.length > 0 && (
                    <span className="cal-count-badge cal-count-resource">
                      {selectedResources.length} resource{selectedResources.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {selectedTasks.length > 0 && (
                    <span className="cal-count-badge cal-count-task">
                      {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {selectedMilestones.length > 0 && (
                    <span className="cal-count-badge cal-count-milestone">
                      {selectedMilestones.length} milestone{selectedMilestones.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Content List */}
            <div className="cal-detail-content">
              {selectedResources.length === 0 && selectedTasks.length === 0 && selectedMilestones.length === 0 ? (
                <div className="cal-empty-state">
                  <div className="cal-empty-icon">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <p className="cal-empty-title">Nothing here yet</p>
                  <p className="cal-empty-subtitle">
                    No activity on {format(selectedDate, 'MMM d, yyyy')}
                  </p>
                </div>
              ) : (
                <>
                  {/* Resources */}
                  {selectedResources.length > 0 && (
                    <div className="cal-section">
                      <h4 className="cal-section-title">
                        <BookMarked className="w-4 h-4" />
                        Resources
                      </h4>
                      <div className="cal-section-list">
                        {selectedResources.map((resource) => {
                          const config = getTypeConfig(resource.type);
                          const Icon = config.icon;
                          const timeStr = format(new Date(resource.timestamp), 'HH:mm');

                          return (
                            <div key={resource.id} className="cal-resource-card group">
                              <div className="cal-resource-icon" style={{ backgroundColor: config.bg }}>
                                <Icon className="w-4 h-4" style={{ color: config.color }} />
                              </div>
                              <div className="cal-resource-info">
                                <h5 className="cal-resource-title">{resource.title}</h5>
                                <div className="cal-resource-meta">
                                  <span className="cal-resource-type" style={{ backgroundColor: config.bg, color: config.color }}>
                                    {config.label}
                                  </span>
                                  <span className="cal-resource-time">
                                    <Clock className="w-3 h-3" />
                                    {timeStr}
                                  </span>
                                </div>
                              </div>
                              <div className="cal-resource-actions">
                                {(resource.generatedQuiz || resource.generatedPlan || resource.generatedRubric) && (
                                  <button
                                    onClick={() => onViewResource?.(resource.type, resource)}
                                    className="cal-action-btn cal-action-view"
                                    title="View"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => onEditResource?.(resource.type, resource)}
                                  className="cal-action-btn cal-action-edit"
                                  title="Edit"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tasks */}
                  {selectedTasks.length > 0 && (
                    <div className="cal-section">
                      <h4 className="cal-section-title">
                        <ListChecks className="w-4 h-4" />
                        Tasks
                      </h4>
                      <div className="cal-section-list">
                        {selectedTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`cal-task-card ${task.completed ? 'cal-task-done' : ''}`}
                            onClick={() => onTaskEdit?.(task)}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onTaskToggle?.(task.id);
                              }}
                              className="cal-task-check"
                            >
                              {task.completed ? (
                                <CheckCircle2 className="w-5 h-5" style={{ color: '#1D362D' }} />
                              ) : (
                                <Circle className="w-5 h-5" style={{ color: '#D1D5DB' }} />
                              )}
                            </button>
                            <div className="cal-task-info">
                              <p className={`cal-task-title ${task.completed ? 'cal-task-title-done' : ''}`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="cal-task-desc">{task.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Milestones */}
                  {selectedMilestones.length > 0 && (
                    <div className="cal-section">
                      <h4 className="cal-section-title">
                        <GraduationCap className="w-4 h-4" />
                        Milestones
                      </h4>
                      <div className="cal-section-list">
                        {selectedMilestones.map((milestone, idx) => (
                          <div key={idx} className="cal-milestone-card">
                            <div className="cal-milestone-dot" />
                            <div className="cal-milestone-info">
                              <p className="cal-milestone-title">{milestone.title}</p>
                              {milestone.strand && (
                                <p className="cal-milestone-strand">{milestone.strand}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Add Task Button */}
              {onTaskAdd && (
                <button onClick={onTaskAdd} className="cal-add-task-btn">
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ========== Calendar Modal - Modern Design ========== */

        .cal-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(12px);
          animation: cal-fade-in 0.2s ease-out;
        }

        @keyframes cal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes cal-slide-up {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .cal-modal-container {
          width: 100%;
          max-width: 80rem;
          height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #FAFAF7;
          border-radius: 1.25rem;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.05);
          animation: cal-slide-up 0.3s ease-out;
        }

        /* ===== Header ===== */
        .cal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: #1D362D;
          flex-shrink: 0;
        }

        .cal-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .cal-header-icon {
          width: 2.25rem;
          height: 2.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.625rem;
          background: rgba(248, 229, 157, 0.15);
          color: #F8E59D;
        }

        .cal-header-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #F8E59D;
          line-height: 1.2;
        }

        .cal-header-subtitle {
          font-size: 0.75rem;
          color: rgba(248, 229, 157, 0.6);
          font-weight: 500;
        }

        .cal-header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cal-today-btn {
          padding: 0.375rem 0.875rem;
          border-radius: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #1D362D;
          background: #F8E59D;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cal-today-btn:hover {
          background: #f5dc7a;
          transform: translateY(-1px);
        }

        .cal-close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          border: none;
          background: transparent;
          color: rgba(248, 229, 157, 0.7);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cal-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #F8E59D;
        }

        /* ===== Stats Strip ===== */
        .cal-stats-strip {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.625rem 1.5rem;
          background: #F5F5F0;
          border-bottom: 1px solid #E8E8E0;
          flex-shrink: 0;
          font-size: 0.8125rem;
          color: #64748B;
        }

        .cal-stat-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: #64748B;
        }

        .cal-stat-item strong {
          color: #1D362D;
          font-weight: 700;
        }

        .cal-stat-divider {
          width: 1px;
          height: 1rem;
          background: #D4D4CC;
        }

        .cal-stat-types {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-left: auto;
        }

        .cal-stat-type-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* ===== Body ===== */
        .cal-body {
          flex: 1;
          display: flex;
          overflow: hidden;
          min-height: 0;
        }

        /* ===== Calendar Section ===== */
        .cal-calendar-section {
          flex: 3;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .cal-month-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid #E8E8E0;
          flex-shrink: 0;
        }

        .cal-nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          border: 1px solid #E8E8E0;
          background: white;
          color: #64748B;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cal-nav-btn:hover {
          background: #F5F5F0;
          border-color: #D4D4CC;
          color: #1D362D;
        }

        .cal-month-title-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid transparent;
          background: transparent;
          font-size: 1rem;
          font-weight: 700;
          color: #1D362D;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cal-month-title-btn:hover,
        .cal-month-title-btn[data-active="true"] {
          background: #F5F5F0;
          border-color: #E8E8E0;
        }

        .cal-chevron-icon {
          width: 1rem;
          height: 1rem;
          transition: transform 0.2s ease;
        }

        .cal-chevron-rotated {
          transform: rotate(180deg);
        }

        /* Month Picker Dropdown */
        .cal-month-picker {
          position: absolute;
          z-index: 30;
          top: calc(100% + 0.5rem);
          left: 50%;
          transform: translateX(-50%);
          width: 16rem;
          padding: 1rem;
          background: white;
          border: 1px solid #E8E8E0;
          border-radius: 0.75rem;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
          animation: cal-slide-up 0.15s ease-out;
        }

        .cal-picker-year-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .cal-picker-year {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #1D362D;
        }

        .cal-picker-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.375rem;
        }

        .cal-picker-month {
          padding: 0.5rem;
          border-radius: 0.5rem;
          border: none;
          background: transparent;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cal-picker-month:hover {
          background: #F5F5F0;
        }

        .cal-picker-month-active {
          background: #1D362D !important;
          color: #F8E59D !important;
        }

        /* ===== Scrollable Calendar Grid ===== */
        .cal-scroll-area {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.5rem;
          min-height: 0;
        }

        .cal-grid-container {
          max-width: 56rem;
          margin: 0 auto;
        }

        .cal-weekday-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
          position: sticky;
          top: 0;
          background: #FAFAF7;
          z-index: 10;
          padding: 0.5rem 0 0.75rem;
        }

        .cal-weekday-cell {
          text-align: center;
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94A3B8;
        }

        .cal-months-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cal-month-card {
          background: white;
          border-radius: 1rem;
          padding: 1.25rem;
          border: 1px solid #E8E8E0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .cal-month-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1D362D;
          margin-bottom: 0.75rem;
          padding-bottom: 0.625rem;
          border-bottom: 1px solid #F0F0E8;
        }

        .cal-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
        }

        /* ===== Day Cell ===== */
        .cal-day-cell {
          position: relative;
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          border: none;
          border-radius: 0.625rem;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          min-height: 3.5rem;
        }

        .cal-day-cell:hover:not(:disabled):not(.cal-day-selected) {
          background: #F5F5F0;
        }

        .cal-day-cell:disabled {
          cursor: default;
        }

        .cal-day-outside {
          opacity: 0.2;
        }

        .cal-day-number {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          line-height: 1;
        }

        /* Activity levels */
        .cal-day-cell[data-level="low"]:not(.cal-day-selected):not(.cal-day-today):not(.cal-day-outside) {
          background: #F8E59D20;
        }

        .cal-day-cell[data-level="medium"]:not(.cal-day-selected):not(.cal-day-today):not(.cal-day-outside) {
          background: #F8E59D40;
        }

        .cal-day-cell[data-level="high"]:not(.cal-day-selected):not(.cal-day-today):not(.cal-day-outside) {
          background: #1D362D15;
        }

        /* Selected state */
        .cal-day-selected {
          background: #1D362D !important;
          box-shadow: 0 2px 8px rgba(29, 54, 45, 0.25);
        }

        .cal-day-selected .cal-day-number {
          color: #F8E59D;
        }

        /* Today state */
        .cal-day-today {
          background: #FFF7ED;
          box-shadow: inset 0 0 0 2px #F2A631;
        }

        .cal-day-today .cal-day-number {
          color: #F2A631;
          font-weight: 800;
        }

        /* Day indicators */
        .cal-day-indicators {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-top: 3px;
        }

        .cal-indicator {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .cal-indicator-resource { background: #1D362D; }
        .cal-indicator-task { background: #F2A631; }
        .cal-indicator-milestone { background: #8B5CF6; }
        .cal-indicator-selected { background: #F8E59D !important; }

        /* Day badge */
        .cal-day-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 0.5625rem;
          font-weight: 700;
          color: #1D362D;
          background: #F8E59D;
          min-width: 1rem;
          height: 1rem;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .cal-day-badge-selected {
          background: #F8E59D;
          color: #1D362D;
        }

        /* ===== Legend ===== */
        .cal-legend {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 1.5rem;
          border-top: 1px solid #E8E8E0;
          background: #F5F5F0;
          flex-shrink: 0;
          font-size: 0.75rem;
        }

        .cal-legend-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cal-legend-label {
          font-weight: 600;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.625rem;
        }

        .cal-legend-items {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .cal-legend-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: #64748B;
        }

        .cal-legend-swatch {
          width: 0.875rem;
          height: 0.875rem;
          border-radius: 0.25rem;
        }

        .cal-legend-low { background: #F8E59D40; border: 1px solid #F8E59D; }
        .cal-legend-medium { background: #F8E59D80; border: 1px solid #E8D580; }
        .cal-legend-high { background: #1D362D25; border: 1px solid #1D362D40; }

        .cal-legend-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
        }

        /* ===== Details Panel ===== */
        .cal-details-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          border-left: 1px solid #E8E8E0;
          background: white;
          min-width: 0;
          overflow: hidden;
        }

        .cal-date-display {
          padding: 1.5rem;
          text-align: center;
          border-bottom: 1px solid #E8E8E0;
          background: #FAFAF7;
          flex-shrink: 0;
        }

        .cal-date-day {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1D362D;
          line-height: 1;
        }

        .cal-date-weekday {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #374151;
          margin-top: 0.25rem;
        }

        .cal-date-month {
          font-size: 0.8125rem;
          color: #94A3B8;
          margin-top: 0.125rem;
        }

        .cal-date-counts {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
          justify-content: center;
          margin-top: 0.75rem;
        }

        .cal-count-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 999px;
          font-size: 0.6875rem;
          font-weight: 600;
        }

        .cal-count-resource {
          background: #1D362D15;
          color: #1D362D;
        }

        .cal-count-task {
          background: #F2A63115;
          color: #C2841F;
        }

        .cal-count-milestone {
          background: #8B5CF615;
          color: #7C3AED;
        }

        /* ===== Detail Content ===== */
        .cal-detail-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .cal-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          text-align: center;
        }

        .cal-empty-icon {
          width: 3.5rem;
          height: 3.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
          background: #F5F5F0;
          color: #D4D4CC;
          margin-bottom: 1rem;
        }

        .cal-empty-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #94A3B8;
        }

        .cal-empty-subtitle {
          font-size: 0.8125rem;
          color: #CBD5E1;
          margin-top: 0.25rem;
        }

        /* ===== Sections ===== */
        .cal-section {
          margin-bottom: 1.25rem;
        }

        .cal-section-title {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94A3B8;
          margin-bottom: 0.5rem;
          padding-bottom: 0.375rem;
          border-bottom: 1px solid #F0F0E8;
        }

        .cal-section-list {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        /* Resource Card */
        .cal-resource-card {
          display: flex;
          align-items: flex-start;
          gap: 0.625rem;
          padding: 0.625rem;
          border-radius: 0.625rem;
          border: 1px solid #F0F0E8;
          background: #FAFAF7;
          transition: all 0.15s ease;
        }

        .cal-resource-card:hover {
          border-color: #E0E0D8;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .cal-resource-icon {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          flex-shrink: 0;
        }

        .cal-resource-info {
          flex: 1;
          min-width: 0;
        }

        .cal-resource-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #1E293B;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cal-resource-meta {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-top: 0.375rem;
        }

        .cal-resource-type {
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.625rem;
          font-weight: 600;
        }

        .cal-resource-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.6875rem;
          color: #94A3B8;
        }

        .cal-resource-actions {
          display: flex;
          gap: 0.25rem;
          opacity: 0;
          transition: opacity 0.15s ease;
          flex-shrink: 0;
        }

        .cal-resource-card:hover .cal-resource-actions {
          opacity: 1;
        }

        .cal-action-btn {
          width: 1.75rem;
          height: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.375rem;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cal-action-view {
          background: #1D362D;
          color: #F8E59D;
        }

        .cal-action-view:hover {
          background: #2A4D3E;
        }

        .cal-action-edit {
          background: #F2A631;
          color: white;
        }

        .cal-action-edit:hover {
          background: #E09520;
        }

        /* Task Card */
        .cal-task-card {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.625rem;
          border-radius: 0.625rem;
          border: 1px solid #F0F0E8;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cal-task-card:hover {
          background: #FAFAF7;
          border-color: #E0E0D8;
        }

        .cal-task-done {
          opacity: 0.5;
        }

        .cal-task-check {
          border: none;
          background: none;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .cal-task-info {
          flex: 1;
          min-width: 0;
        }

        .cal-task-title {
          font-size: 0.8125rem;
          font-weight: 500;
          color: #1E293B;
        }

        .cal-task-title-done {
          text-decoration: line-through;
          color: #94A3B8;
        }

        .cal-task-desc {
          font-size: 0.75rem;
          color: #94A3B8;
          margin-top: 0.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Milestone Card */
        .cal-milestone-card {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.625rem;
          border-radius: 0.625rem;
          border: 1px solid #8B5CF620;
          background: #8B5CF608;
        }

        .cal-milestone-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: #8B5CF6;
          flex-shrink: 0;
          margin-top: 0.375rem;
        }

        .cal-milestone-info {
          flex: 1;
          min-width: 0;
        }

        .cal-milestone-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #1E293B;
        }

        .cal-milestone-strand {
          font-size: 0.75rem;
          color: #7C3AED;
          margin-top: 0.125rem;
        }

        /* Add Task Button */
        .cal-add-task-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          width: 100%;
          padding: 0.625rem;
          border-radius: 0.625rem;
          border: 1px dashed #D4D4CC;
          background: transparent;
          color: #94A3B8;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          margin-top: 0.75rem;
        }

        .cal-add-task-btn:hover {
          border-color: #F2A631;
          color: #F2A631;
          background: #FFF7ED;
        }

        /* ===== Scrollbar ===== */
        .cal-scroll-area::-webkit-scrollbar,
        .cal-detail-content::-webkit-scrollbar {
          width: 6px;
        }

        .cal-scroll-area::-webkit-scrollbar-track,
        .cal-detail-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .cal-scroll-area::-webkit-scrollbar-thumb,
        .cal-detail-content::-webkit-scrollbar-thumb {
          background: #D4D4CC;
          border-radius: 3px;
        }

        .cal-scroll-area::-webkit-scrollbar-thumb:hover,
        .cal-detail-content::-webkit-scrollbar-thumb:hover {
          background: #A8AFA3;
        }
      `}</style>
    </div>
  );
};

export default CalendarModal;
