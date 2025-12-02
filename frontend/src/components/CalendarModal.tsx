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
  getDay,
  setMonth,
  setYear,
  getMonth,
  getYear
} from 'date-fns';
import {
  X, ChevronLeft, ChevronRight, ChevronDown, Calendar as CalendarIcon,
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

interface CalendarModalProps {
  resourcesByDate: { [date: string]: Resource[] };
  onClose: () => void;
  onViewResource?: (type: string, resource: Resource) => void;
  onEditResource?: (type: string, resource: Resource) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  resourcesByDate,
  onClose,
  onViewResource,
  onEditResource
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
const [showMonthPicker, setShowMonthPicker] = useState(false);
const [pickerYear, setPickerYear] = useState(getYear(new Date()));
const [pendingScrollTarget, setPendingScrollTarget] = useState<Date | null>(null);


  // Get resources for selected date
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedResources = resourcesByDate[selectedDateKey] || [];

  const [monthList, setMonthList] = useState<Date[]>(() => {
    const current = startOfMonth(new Date());
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
      lesson: { icon: BookMarked, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Lesson' },
      quiz: { icon: ListChecks, color: 'text-cyan-600', bg: 'bg-cyan-100', label: 'Quiz' },
      rubric: { icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Rubric' },
      kindergarten: { icon: GraduationCap, color: 'text-pink-600', bg: 'bg-pink-100', label: 'Kindergarten' },
      multigrade: { icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Multigrade' },
      'cross-curricular': { icon: School, color: 'text-teal-600', bg: 'bg-teal-100', label: 'Cross-Curricular' }
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
  };

  // Move these handlers to component scope
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(setYear(new Date(), pickerYear), monthIndex);

    const isFuture = newDate > currentMonth;
    const isPast = newDate < currentMonth;

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
    if (count >= 6) return 'bg-green-700';
    if (count >= 3) return 'bg-green-500';
    return 'bg-green-200';
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

  // Add previous month to top
  const prependMonths = () => {
    const el = calendarRef.current;
    if (!el) return;

    // Record height BEFORE adding new month
    const oldHeight = el.scrollHeight;

    setMonthList(prev => {
      const first = prev[0];
      const newMonth = subMonths(first, 1);

      // Avoid duplicates
      if (prev.some(m => isSameMonth(m, newMonth))) return prev;

      return [newMonth, ...prev];
    });

    // After the DOM updates
    setTimeout(() => {
      const newHeight = el.scrollHeight;
      // Push scroll down by the added height
      el.scrollTop += newHeight - oldHeight;
    }, 0);
  };


  // Add next month to bottom
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

    // Clear state after scroll
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

    // Find the index of the target month in monthList
    const index = monthList.findIndex(m =>
      isSameMonth(m, targetMonth)
    );

    if (index === -1) return;

    // Find the actual month-section DOM element
    const monthSections = el.querySelectorAll('.month-section');

    const section = monthSections[index] as HTMLElement;
    if (!section) return;

    // Scroll so the section is aligned nicely
    el.scrollTo({
      top: section.offsetTop - 20,
      behavior: 'smooth'
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-8xl h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Resource Calendar</h2>
              <p className="text-blue-100 text-sm">
                Track your teaching resource creation timeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">
                  {format(currentMonth, 'MMMM yyyy')} Activity
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-600">
                    <strong className="text-gray-900">{monthStats.activeDays}</strong> Active Days
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">
                    <strong className="text-gray-900">{monthStats.totalResources}</strong> Resources
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
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg ${config.bg}`}
                    title={`${config.label}: ${count}`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                    <span className="text-sm font-semibold text-gray-700">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Calendar Section - 75% */}
          <div className="flex-[3] flex flex-col bg-gray-50">
            {/* Month Navigation */}
            {/* Month Navigation Header - replaced with clickable header and dropdown */}
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>

              {/* Clickable Month/Year Header */}
              <div className="relative">
                <button
                  className="text-xl font-bold text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                  onClick={() => {
                    setPickerYear(currentMonth.getFullYear());
                    setShowMonthPicker((prev) => !prev);
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={showMonthPicker}
                  aria-label="Select Month and Year"
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
                    className="month-picker-container absolute z-30 mt-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-xl w-64 p-4 dropdown-click-outside"
                    tabIndex={-1}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => handleYearChange('prev')}
                        className="p-1.5 rounded hover:bg-gray-100"
                        aria-label="Previous Year"
                        type="button"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <span className="font-semibold text-gray-800">{pickerYear}</span>
                      <button
                        onClick={() => handleYearChange('next')}
                        className="p-1.5 rounded hover:bg-gray-100"
                        aria-label="Next Year"
                        type="button"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: 12 }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleMonthSelect(idx)}
                          className={`py-1.5 rounded-lg font-medium ${
                            currentMonth.getMonth() === idx && currentMonth.getFullYear() === pickerYear
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-100 text-gray-800'
                          }`}
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
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Continuous Calendar */}
            <div ref={calendarRef} className="flex-1 overflow-y-auto px-6 py-4">
              <div className="continuous-calendar max-w-5xl mx-auto">
                {/* Weekday Headers */}
                <div className="weekday-header">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="weekday-cell">
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
                        <h4 className="month-title">
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
                                className={`
                                  day-cell
                                  ${!isCurrentMonth ? 'other-month' : ''}
                                  ${isSelected ? 'selected' : ''}
                                  ${isTodayDate ? 'today' : ''}
                                  ${resourceCount > 0 ? 'has-activity' : ''}
                                `}
                                disabled={!isCurrentMonth}
                              >
                                <span className="day-number">{format(day, 'd')}</span>
                                {resourceCount > 0 && (
                                  <div className="activity-indicator">
                                    <div className={`activity-dot ${activityColor}`} />
                                    {resourceCount > 1 && (
                                      <span className="activity-count">{resourceCount}</span>
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
              <div className="max-w-5xl mx-auto mt-6 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3">Activity Legend</h3>
                <div className="flex items-center space-x-12 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-200 rounded-full" />
                    <span className="text-gray-600 font-medium">1-2 resources</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full" />
                    <span className="text-gray-600 font-medium">3-5 resources</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-700 rounded-full" />
                    <span className="text-gray-600 font-medium">6+ resources</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-amber-400 rounded-full border-2 border-amber-600" />
                    <span className="text-gray-600 font-medium">Today</span>
                  </div>
                </div>
              </div>
          </div>

          {/* Details Panel - 25% */}
          <div className="flex-1 bg-white border-l border-gray-200 flex flex-col">
            {/* Selected Date Header */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-200 p-6">
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                  {format(selectedDate, 'd')}
                </div>
                <div className="text-base text-gray-700 font-semibold">
                  {format(selectedDate, 'EEEE')}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {format(selectedDate, 'MMMM yyyy')}
                </div>
              </div>

              {selectedResources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-bold text-gray-800">
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
                  <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-base text-gray-600 font-semibold">No resources</p>
                  <p className="text-sm text-gray-400 mt-2">
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
                      className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 group hover:border-blue-300"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2.5 rounded-xl ${config.bg} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2">
                            {resource.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className={`px-2.5 py-1 rounded-lg ${config.bg} ${config.color} font-semibold`}>
                              {config.label}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 font-medium">{timeStr}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(resource.generatedQuiz || resource.generatedPlan || resource.generatedRubric) && (
                          <button
                            onClick={() => onViewResource?.(resource.type, resource)}
                            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            View
                          </button>
                        )}
                        <button
                          onClick={() => onEditResource?.(resource.type, resource)}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
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
          background: #f9fafb;
          z-index: 10;
          padding: 12px 0;
        }

        .weekday-cell {
          text-align: center;
          font-size: 0.875rem;
          font-weight: 700;
          color: #6b7280;
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
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }

        .month-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e5e7eb;
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
          background: #f9fafb;
          border: 2px solid transparent;
          border-radius: 14px;
          font-weight: 600;
          color: #1f2937;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          min-height: 70px;
        }

        .day-cell:hover:not(:disabled) {
          background: #eff6ff;
          border-color: #3b82f6;
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.25);
        }

        .day-cell.selected {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          border-color: #3b82f6;
          color: white;
          transform: scale(1.08);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.4);
        }

        .day-cell.today {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-color: #f59e0b;
          color: #92400e;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }

        .day-cell.has-activity {
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
          border-color: #bfdbfe;
        }

        .day-cell.has-activity:hover {
          background: linear-gradient(135deg, #bfdbfe 0%, #c7d2fe 100%);
          border-color: #3b82f6;
        }

        .day-cell.other-month {
          opacity: 0.25;
          pointer-events: none;
          background: #f3f4f6;
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
          color: #4b5563;
        }

        .day-cell.selected .activity-count {
          color: white;
        }

        /* Smooth scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f9fafb;
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default CalendarModal;