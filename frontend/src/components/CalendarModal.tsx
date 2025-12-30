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
  getMonth,
  getYear
} from 'date-fns';
import {
  X, ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  BookMarked, ListChecks, FileText, GraduationCap, Users, School,
  Eye, Edit, TrendingUp, Activity
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
  onAddTask?: (date: string, task: any) => void;
  initialDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  resourcesByDate,
  onClose,
  onViewResource,
  onEditResource,
  tasksByDate,
  onAddTask,
  initialDate,
  onDateSelect: onDateSelectCallback
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
      lesson: { icon: BookMarked, color: '#1D362D', bg: '#1D362D20', label: 'Lesson' },
      quiz: { icon: ListChecks, color: '#F2A631', bg: '#F2A63120', label: 'Quiz' },
      rubric: { icon: FileText, color: '#552A01', bg: '#552A0120', label: 'Rubric' },
      kindergarten: { icon: GraduationCap, color: '#1D362D', bg: '#1D362D20', label: 'Kindergarten' },
      multigrade: { icon: Users, color: '#552A01', bg: '#552A0120', label: 'Multigrade' },
      'cross-curricular': { icon: School, color: '#F2A631', bg: '#F2A63120', label: 'Cross-Curricular' }
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

  // Handle date selection
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
    if (direction === 'prev') {
      setPickerYear(prev => prev - 1);
    } else {
      setPickerYear(prev => prev + 1);
    }
  };

  // Get resource count for a date
  const getResourceCount = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return resourcesByDate[dateKey]?.length || 0;
  };

  // Get activity color based on resource count
  const getActivityColor = (count: number) => {
    if (count === 0) return '';
    if (count >= 6) return '#1D362D';
    if (count >= 3) return '#552A01';
    return '#F8E59D';
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

      const nearTop = scrollTop < 200;
      const nearBottom = scrollTop + offsetHeight > scrollHeight - 200;

      if (nearTop) prependMonths();
      if (nearBottom) appendMonths();
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
    setMonthList([
      subMonths(base, 1),
      base,
      addMonths(base, 1),
    ]);
  };

  const scrollToMonth = (targetMonth: Date) => {
    const el = calendarRef.current;
    if (!el) return;

    const index = monthList.findIndex(m => isSameMonth(m, targetMonth));

    if (index === -1) return;

    const monthSections = el.querySelectorAll('.month-section');
    const section = monthSections[index] as HTMLElement;
    if (!section) return;

    el.scrollTo({
      top: section.offsetTop - 20,
      behavior: 'smooth'
    });
  };

  // Get resources for selected date
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedResources = resourcesByDate[selectedDateKey] || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(2, 13, 3, 0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-3xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden"
        style={{
          backgroundColor: '#FDFDF8',
          boxShadow: '0 20px 60px rgba(29, 54, 45, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: '#1D362D' }}
        >
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-8 h-8" style={{ color: '#F8E59D' }} />
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#F8E59D' }}>
                Resource Calendar
              </h2>
              <p className="text-sm" style={{ color: '#F8E59D', opacity: 0.8 }}>
                Track your teaching resource timeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all hover:bg-white/10"
          >
            <X className="w-6 h-6" style={{ color: '#F8E59D' }} />
          </button>
        </div>

        {/* Stats Bar */}
        <div 
          className="px-6 py-4 flex items-center justify-between"
          style={{ 
            backgroundColor: '#F8E59D40',
            borderBottom: '1px solid #E8EAE3'
          }}
        >
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5" style={{ color: '#1D362D' }} />
              <span className="text-sm font-semibold" style={{ color: '#020D03' }}>
                {format(currentMonth, 'MMMM yyyy')} Activity
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1D362D' }} />
                <span style={{ color: '#552A01' }}>
                  <strong style={{ color: '#020D03' }}>{monthStats.activeDays}</strong> Active Days
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" style={{ color: '#F2A631' }} />
                <span style={{ color: '#552A01' }}>
                  <strong style={{ color: '#020D03' }}>{monthStats.totalResources}</strong> Resources
                </span>
              </div>
            </div>
          </div>

          {/* Type breakdown */}
          <div className="flex items-center space-x-2">
            {Object.entries(monthStats.typeCount).map(([type, count]) => {
              const config = getTypeConfig(type);
              const Icon = config.icon;
              return (
                <div
                  key={type}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: config.bg }}
                  title={`${config.label}: ${count}`}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
                  <span className="text-sm font-semibold" style={{ color: '#020D03' }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Calendar Section - 75% */}
          <div className="flex-[3] flex flex-col" style={{ backgroundColor: '#FDFDF8' }}>
            {/* Month Navigation */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #E8EAE3' }}>
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
              >
                <ChevronLeft className="w-6 h-6" style={{ color: '#552A01' }} />
              </button>

              {/* Clickable Month/Year Header */}
              <div className="relative">
                <button
                  className="text-xl font-bold px-4 py-2 rounded-lg transition-colors flex items-center"
                  onClick={() => {
                    setPickerYear(currentMonth.getFullYear());
                    setShowMonthPicker((prev) => !prev);
                  }}
                  style={{ 
                    color: '#020D03',
                    backgroundColor: showMonthPicker ? '#F8E59D40' : 'transparent'
                  }}
                  type="button"
                >
                  {format(currentMonth, 'MMMM yyyy')}
                  <svg
                    className={`ml-2 w-4 h-4 transition-transform ${showMonthPicker ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showMonthPicker && (
                  <div
                    className="month-picker-container absolute z-30 mt-2 left-1/2 -translate-x-1/2 rounded-xl p-4 w-64"
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #E8EAE3',
                      boxShadow: '0 8px 24px rgba(29, 54, 45, 0.15)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => handleYearChange('prev')}
                        className="p-1.5 rounded hover:bg-gray-100"
                        type="button"
                      >
                        <ChevronLeft className="w-5 h-5" style={{ color: '#552A01' }} />
                      </button>
                      <span className="font-semibold" style={{ color: '#020D03' }}>{pickerYear}</span>
                      <button
                        onClick={() => handleYearChange('next')}
                        className="p-1.5 rounded hover:bg-gray-100"
                        type="button"
                      >
                        <ChevronRight className="w-5 h-5" style={{ color: '#552A01' }} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: 12 }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleMonthSelect(idx)}
                          className="py-1.5 rounded-lg font-medium"
                          style={{
                            backgroundColor: currentMonth.getMonth() === idx && currentMonth.getFullYear() === pickerYear
                              ? '#1D362D'
                              : 'transparent',
                            color: currentMonth.getMonth() === idx && currentMonth.getFullYear() === pickerYear
                              ? '#F8E59D'
                              : '#020D03'
                          }}
                          type="button"
                        >
                          {format(new Date(pickerYear, idx, 1), 'MMM')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
              >
                <ChevronRight className="w-6 h-6" style={{ color: '#552A01' }} />
              </button>
            </div>

            {/* Continuous Calendar */}
            <div ref={calendarRef} className="flex-1 overflow-y-auto px-6 py-4">
              <div className="continuous-calendar max-w-5xl mx-auto">
                {/* Weekday Headers */}
                <div className="weekday-header">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="weekday-cell" style={{ color: '#552A01' }}>
                      {day}
                    </div>
                  ))}
                </div>

                {/* Months */}
                <div className="months-container">
                  {monthList.map((month, monthIndex) => {
                    const days = getMonthDays(month);
                    
                    return (
                      <div key={monthIndex} className="month-section">
                        <h4 className="month-title" style={{ color: '#020D03', borderBottomColor: '#E8EAE3' }}>
                          {format(month, 'MMMM yyyy')}
                        </h4>
                        
                        <div className="days-grid">
                          {days.map((day, dayIndex) => {
                            const dateKey = format(day, 'yyyy-MM-dd');
                            const resourceCount = getResourceCount(day);
                            const isSelected = isSameDay(day, selectedDate);
                            const isTodayDate = isToday(day);
                            const isCurrentMonth = isSameMonth(day, month);
                            const activityColor = getActivityColor(resourceCount);

                            return (
                              <button
                                key={dayIndex}
                                onClick={() => handleDateClick(day)}
                                className="day-cell"
                                style={{
                                  backgroundColor: isSelected
                                    ? '#1D362D'
                                    : isTodayDate
                                    ? '#F2A631'
                                    : resourceCount > 0 && isCurrentMonth
                                    ? '#F8E59D40'
                                    : '#FDFDF8',
                                  color: isSelected || isTodayDate
                                    ? isSelected ? '#F8E59D' : '#020D03'
                                    : !isCurrentMonth
                                    ? '#E8EAE3'
                                    : '#020D03',
                                  boxShadow: isSelected
                                    ? '0 4px 12px rgba(29, 54, 45, 0.2)'
                                    : isTodayDate
                                    ? '0 2px 8px rgba(242, 166, 49, 0.3)'
                                    : 'none',
                                  cursor: isCurrentMonth ? 'pointer' : 'default',
                                  opacity: isCurrentMonth ? 1 : 0.25
                                }}
                                disabled={!isCurrentMonth}
                              >
                                <span className="day-number">{format(day, 'd')}</span>
                                {resourceCount > 0 && isCurrentMonth && (
                                  <div className="activity-indicator">
                                    <div 
                                      className="activity-dot" 
                                      style={{ backgroundColor: activityColor }}
                                    />
                                    {resourceCount > 1 && (
                                      <span className="activity-count" style={{ color: isSelected ? '#F8E59D' : '#552A01' }}>
                                        {resourceCount}
                                      </span>
                                    )}
                                  </div>
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
            <div className="max-w-5xl mx-auto mt-6 rounded-2xl p-4" style={{ backgroundColor: 'white', border: '1px solid #E8EAE3', boxShadow: '0 2px 8px rgba(29, 54, 45, 0.05)' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: '#020D03' }}>Activity Legend</h3>
              <div className="flex items-center space-x-12 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F8E59D' }} />
                  <span className="font-medium" style={{ color: '#552A01' }}>1-2 resources</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#552A01' }} />
                  <span className="font-medium" style={{ color: '#552A01' }}>3-5 resources</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#1D362D' }} />
                  <span className="font-medium" style={{ color: '#552A01' }}>6+ resources</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F2A631', boxShadow: '0 0 0 2px #552A01' }} />
                  <span className="font-medium" style={{ color: '#552A01' }}>Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Panel - 25% */}
          <div className="flex-1 flex flex-col relative overflow-hidden" style={{ backgroundColor: 'white', borderLeft: '1px solid #E8EAE3' }}>
            {/* Selected Date Header */}
            <div className="p-6 relative" style={{ backgroundColor: '#F8E59D40', borderBottom: '1px solid #E8EAE3' }}>
              <div className="text-center">
                <div className="text-5xl font-bold mb-1" style={{ color: '#1D362D' }}>
                  {format(selectedDate, 'd')}
                </div>
                <div className="text-base font-semibold" style={{ color: '#552A01' }}>
                  {format(selectedDate, 'EEEE')}
                </div>
                <div className="text-sm font-medium" style={{ color: '#552A01', opacity: 0.7 }}>
                  {format(selectedDate, 'MMMM yyyy')}
                </div>
              </div>

              {selectedResources.length > 0 && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid #E8EAE3' }}>
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingUp className="w-5 h-5" style={{ color: '#1D362D' }} />
                    <span className="text-sm font-bold" style={{ color: '#020D03' }}>
                      {selectedResources.length} {selectedResources.length === 1 ? 'Resource' : 'Resources'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Resources List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedResources.length === 0 ? (
                <div className="text-center py-16">
                  <CalendarIcon className="w-16 h-16 mx-auto mb-4" style={{ color: '#E8EAE3' }} />
                  <p className="text-base font-semibold" style={{ color: '#552A01' }}>No resources</p>
                  <p className="text-sm mt-2" style={{ color: '#A8AFA3' }}>
                    Nothing created on this day
                  </p>
                </div>
              ) : (
                selectedResources.map((resource) => {
                  const config = getTypeConfig(resource.type);
                  const Icon = config.icon;
                  const timeStr = format(new Date(resource.timestamp), 'HH:mm');

                  return (
                    <div
                      key={resource.id}
                      className="rounded-xl p-4 hover:shadow-lg transition-all duration-200 group"
                      style={{
                        backgroundColor: '#FDFDF8',
                        border: '1px solid #E8EAE3'
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div 
                          className="p-2.5 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: config.bg }}
                        >
                          <Icon className="w-5 h-5" style={{ color: config.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold line-clamp-2 mb-2" style={{ color: '#020D03' }}>
                            {resource.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs">
                            <span 
                              className="px-2.5 py-1 rounded-lg font-semibold"
                              style={{ backgroundColor: config.bg, color: config.color }}
                            >
                              {config.label}
                            </span>
                            <span style={{ color: '#A8AFA3' }}>•</span>
                            <span className="font-medium" style={{ color: '#552A01' }}>{timeStr}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-3 pt-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderTop: '1px solid #E8EAE3' }}>
                        {(resource.generatedQuiz || resource.generatedPlan || resource.generatedRubric) && (
                          <button
                            onClick={() => onViewResource?.(resource.type, resource)}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg transition-colors"
                            style={{
                              backgroundColor: '#1D362D',
                              color: '#F8E59D'
                            }}
                          >
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            View
                          </button>
                        )}
                        <button
                          onClick={() => onEditResource?.(resource.type, resource)}
                          className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg transition-colors"
                          style={{
                            backgroundColor: '#F2A631',
                            color: 'white'
                          }}
                        >
                          <Edit className="w-3.5 h-3.5 mr-1.5" />
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Continuous Calendar Styling */
        .continuous-calendar {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .weekday-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 8px;
          position: sticky;
          top: 0;
          background: #FDFDF8;
          z-index: 10;
          padding: 12px 0;
        }

        .weekday-cell {
          text-align: center;
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .months-container {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .month-section {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(29, 54, 45, 0.05);
          border: 1px solid #E8EAE3;
        }

        .month-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid;
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }

        .day-cell {
          position: relative;
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border: none;
          border-radius: 14px;
          font-weight: 600;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 70px;
        }

        .day-cell:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .day-cell:disabled {
          cursor: not-allowed;
        }

        .day-number {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .activity-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }

        .activity-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .activity-count {
          font-size: 0.625rem;
          font-weight: 700;
        }

        /* Smooth scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #FDFDF8;
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #E8EAE3;
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #A8AFA3;
        }
      `}</style>
    </div>
  );
};

export default CalendarModal;