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
import { HugeiconsIcon } from '@hugeicons/react';
import ArrowLeft01IconData from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import Maximize02IconData from '@hugeicons/core-free-icons/Maximize02Icon';

const IconW: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const ChevronLeft: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ArrowLeft01IconData} {...p} />;
const ChevronRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ArrowRight01IconData} {...p} />;
const Maximize2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Maximize02IconData} {...p} />;

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
      className="cc-widget"
      data-tutorial="analytics-calendar-widget"
    >
      {/* Header */}
      <div className="cc-header" data-tutorial="analytics-calendar-navigation">
        <button onClick={goToPreviousMonth} className="cc-nav-btn">
          <ChevronLeft className="w-4 h-4" />
        </button>

        <h3 className="cc-title">
          {format(currentMonth, 'MMM yyyy')}
        </h3>

        <div className="cc-header-actions">
          <button
            onClick={onExpandClick}
            className="cc-expand-btn"
            title="Expand calendar"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={goToNextMonth} className="cc-nav-btn">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="cc-body">
        {/* Weekday Headers */}
        <div className="cc-weekday-row">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} className="cc-weekday">{day}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="cc-days-grid">
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
                className={`cc-day ${isSelected ? 'cc-day-selected' : ''} ${isTodayDate && !isSelected ? 'cc-day-today' : ''} ${!isCurrentMonth ? 'cc-day-outside' : ''}`}
              >
                <span className="cc-day-num">{format(day, 'd')}</span>

                {hasActivity && isCurrentMonth && (
                  <div className="cc-dots">
                    {resourceCount > 0 && (
                      <div className={`cc-dot ${isSelected ? 'cc-dot-selected' : 'cc-dot-resource'}`} />
                    )}
                    {taskCount > 0 && (
                      <div className={`cc-dot ${isSelected ? 'cc-dot-selected' : 'cc-dot-task'}`} />
                    )}
                    {milestoneCount > 0 && (
                      <div className={`cc-dot ${isSelected ? 'cc-dot-selected' : 'cc-dot-milestone'}`} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="cc-legend" data-tutorial="analytics-calendar-legend">
          <div className="cc-legend-item">
            <div className="cc-legend-dot cc-dot-resource" />
            <span>Resources</span>
          </div>
          <div className="cc-legend-item">
            <div className="cc-legend-dot cc-dot-task" />
            <span>Tasks</span>
          </div>
          <div className="cc-legend-item">
            <div className="cc-legend-dot cc-dot-milestone" />
            <span>Milestones</span>
          </div>
        </div>
      </div>

      <style>{`
        /* ========== Compact Calendar Widget ========== */

        .cc-widget {
          border-radius: 1rem;
          overflow: hidden;
          background: var(--dash-card-bg, white);
          border: 1px solid var(--dash-border, #E8E8E0);
          box-shadow: 0 1px 3px var(--dash-card-shadow, rgba(0, 0, 0, 0.04));
        }

        /* Header */
        .cc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 0.75rem;
          background: var(--dash-primary, #1D362D);
        }

        .cc-nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.625rem;
          height: 1.625rem;
          border-radius: 0.375rem;
          border: none;
          background: transparent;
          color: var(--dash-primary-fg, #F8E59D);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .cc-nav-btn:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .cc-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--dash-primary-fg, #F8E59D);
          letter-spacing: -0.01em;
        }

        .cc-header-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .cc-expand-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.625rem;
          height: 1.625rem;
          border-radius: 0.375rem;
          border: none;
          background: transparent;
          color: var(--dash-primary-fg, #F8E59D);
          cursor: pointer;
          opacity: 0.7;
          transition: all 0.15s ease;
        }

        .cc-expand-btn:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.12);
        }

        /* Body */
        .cc-body {
          padding: 0.75rem;
          background: var(--dash-card-bg, white);
        }

        /* Weekday Row */
        .cc-weekday-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          margin-bottom: 0.375rem;
        }

        .cc-weekday {
          text-align: center;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--dash-text-sub, #94A3B8);
          padding-bottom: 0.25rem;
        }

        /* Days */
        .cc-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }

        .cc-day {
          position: relative;
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 0.375rem;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.12s ease;
          padding: 0;
        }

        .cc-day:hover:not(:disabled):not(.cc-day-selected) {
          background: var(--dash-gold-a25, #F5F5F0);
        }

        .cc-day:hover:not(:disabled):not(.cc-day-selected) .cc-day-num {
          color: var(--dash-text, #374151);
        }

        .cc-day:disabled {
          cursor: default;
        }

        .cc-day-num {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--dash-text, #374151);
          line-height: 1;
          position: relative;
          z-index: 1;
          transition: color 0.12s ease;
        }

        .cc-day-outside {
          opacity: 0.25;
        }

        .cc-day-outside .cc-day-num {
          color: var(--dash-text-faint, #9ca3af);
        }

        .cc-day-selected {
          background: var(--dash-primary, #1D362D) !important;
          box-shadow: 0 2px 6px var(--dash-primary-a25, rgba(29, 54, 45, 0.2));
        }

        .cc-day-selected .cc-day-num {
          color: var(--dash-primary-fg, #F8E59D);
          font-weight: 700;
        }

        .cc-day-today {
          background: transparent;
          box-shadow: inset 0 0 0 1.5px var(--dash-orange, #F2A631);
        }

        .cc-day-today .cc-day-num {
          color: var(--dash-orange, #F2A631);
          font-weight: 700;
        }

        /* Activity Dots */
        .cc-dots {
          display: flex;
          gap: 1.5px;
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
        }

        .cc-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
        }

        .cc-dot-resource { background: var(--dash-primary, #1D362D); }
        .cc-dot-task { background: var(--dash-orange, #F2A631); }
        .cc-dot-milestone { background: var(--dash-text-sub, #94A3B8); }
        .cc-dot-selected { background: var(--dash-primary-fg, #F8E59D) !important; }

        /* Legend */
        .cc-legend {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 0.625rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--dash-border, #E8E8E0);
        }

        .cc-legend-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.625rem;
          color: var(--dash-text-sub, #94A3B8);
        }

        .cc-legend-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default CompactCalendar;
