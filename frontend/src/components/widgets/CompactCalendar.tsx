import React, { useState, useMemo } from 'react';
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
  getDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CompactCalendarProps {
  resourcesByDate: { [date: string]: any[] };
  tasksByDate?: { [date: string]: any[] };
  milestonesByDate?: { [date: string]: any[] };
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

const CompactCalendar: React.FC<CompactCalendarProps> = ({
  resourcesByDate,
  tasksByDate = {},
  milestonesByDate = {},
  onDateSelect,
  selectedDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={goToPreviousMonth}
            className="p-1 hover:bg-white/20 rounded transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold">{format(currentMonth, 'MMMM yyyy')}</h3>
          <button
            onClick={goToNextMonth}
            className="p-1 hover:bg-white/20 rounded transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} className="text-center text-xs font-semibold text-gray-600">
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
                className={`
                  aspect-square relative rounded-lg text-sm font-medium transition-all
                  ${!isCurrentMonth ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}
                  ${isSelected ? 'bg-blue-600 text-white ring-2 ring-blue-400' : ''}
                  ${isTodayDate && !isSelected ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-400' : ''}
                  ${!isSelected && !isTodayDate && isCurrentMonth ? 'hover:bg-gray-100' : ''}
                  ${hasActivity && !isSelected && !isTodayDate ? 'bg-blue-50' : ''}
                `}
              >
                <span className="relative z-10">{format(day, 'd')}</span>
                
                {/* Activity Indicators */}
                {hasActivity && isCurrentMonth && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {resourceCount > 0 && (
                      <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                    )}
                    {taskCount > 0 && (
                      <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500'}`} />
                    )}
                    {milestoneCount > 0 && (
                      <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-500'}`} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-gray-600">Resources</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-600">Tasks</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-gray-600">Milestones</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactCalendar;