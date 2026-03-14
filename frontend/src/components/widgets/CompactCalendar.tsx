import React, { useState, useMemo, useEffect } from 'react';
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
  isSameMonth
} from 'date-fns';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface CompactCalendarProps {
  resourcesByDate: { [date: string]: any[] };
  tasksByDate?: { [date: string]: any[] };
  milestonesByDate?: { [date: string]: any[] };
  activityByDate?: { [date: string]: number };
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
  onExpandClick: () => void;
}

const CompactCalendar: React.FC<CompactCalendarProps> = ({
  resourcesByDate,
  tasksByDate = {},
  milestonesByDate = {},
  activityByDate = {},
  onDateSelect,
  selectedDate,
  onExpandClick
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  // Sync month view when selectedDate changes
  useEffect(() => {
    if (!isSameMonth(currentMonth, selectedDate)) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate]);

  const getActivityIndicator = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const resourceCount = resourcesByDate[dateKey]?.length || 0;
    const taskCount = tasksByDate[dateKey]?.length || 0;
    const milestoneCount = milestonesByDate[dateKey]?.length || 0;

    return { resourceCount, taskCount, milestoneCount };
  };

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div
      className="widget-glass rounded-2xl overflow-hidden"
      data-tutorial="analytics-calendar-widget"
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        data-tutorial="analytics-calendar-navigation"
        style={{
          backgroundColor: 'var(--dash-primary)'
        }}
      >
        <button
          onClick={goToPreviousMonth}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" style={{ color: 'var(--dash-primary-fg)' }} />
        </button>

        <h3 className="text-base font-bold" style={{ color: 'var(--dash-primary-fg)' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </h3>

        <div className="flex items-center space-x-1">
          <button
            onClick={onExpandClick}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Expand calendar"
          >
            <Maximize2 className="w-4 h-4" style={{ color: 'var(--dash-primary-fg)' }} />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--dash-primary-fg)' }} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div
              key={idx}
              className="text-center text-xs font-semibold"
              style={{ color: 'var(--dash-text-sub)' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((day, idx) => {
            const { resourceCount, taskCount, milestoneCount } = getActivityIndicator(day);
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const hasActivity = resourceCount > 0 || taskCount > 0 || milestoneCount > 0;

            return (
              <button
                key={idx}
                onClick={() => isCurrentMonth && onDateSelect(day)}
                disabled={!isCurrentMonth}
                className="aspect-square relative rounded-lg text-sm font-medium transition-all"
                style={{
                  color: !isCurrentMonth
                    ? 'var(--dash-border)'
                    : isSelected
                    ? 'var(--dash-primary-fg)'
                    : 'var(--dash-text)',
                  backgroundColor: isSelected
                    ? 'var(--dash-primary)'
                    : isTodayDate && !isSelected
                    ? 'var(--dash-orange)'
                    : hasActivity && !isSelected && isCurrentMonth
                    ? 'var(--dash-gold-a25)'
                    : 'transparent',
                  boxShadow: isSelected
                    ? `0 4px 12px var(--dash-primary-a25)`
                    : isTodayDate && !isSelected
                    ? `0 2px 8px var(--dash-orange-a30)`
                    : 'none',
                  cursor: isCurrentMonth ? 'pointer' : 'default'
                }}
              >
                <span className="relative z-10">{format(day, 'd')}</span>

                {/* Activity Indicators */}
                {hasActivity && isCurrentMonth && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {resourceCount > 0 && (
                      <div
                        className="w-1 h-1 rounded-full"
                        style={{
                          backgroundColor: isSelected ? 'var(--dash-primary-fg)' : 'var(--dash-primary)'
                        }}
                      />
                    )}
                    {taskCount > 0 && (
                      <div
                        className="w-1 h-1 rounded-full"
                        style={{
                          backgroundColor: isSelected ? 'var(--dash-primary-fg)' : 'var(--dash-orange)'
                        }}
                      />
                    )}
                    {milestoneCount > 0 && (
                      <div
                        className="w-1 h-1 rounded-full"
                        style={{
                          backgroundColor: isSelected ? 'var(--dash-primary-fg)' : 'var(--dash-text-sub)'
                        }}
                      />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3" data-tutorial="analytics-calendar-legend" style={{ borderTop: `1px solid var(--dash-border)` }}>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--dash-primary)' }} />
              <span style={{ color: 'var(--dash-text-sub)' }}>Resources</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--dash-orange)' }} />
              <span style={{ color: 'var(--dash-text-sub)' }}>Tasks</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--dash-text-sub)' }} />
              <span style={{ color: 'var(--dash-text-sub)' }}>Milestones</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactCalendar;
