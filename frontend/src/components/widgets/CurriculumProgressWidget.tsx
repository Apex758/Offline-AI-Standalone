import React from 'react';
import { Target, ChevronRight, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { MilestoneStats } from '../../types/milestone';
import type { Milestone } from '../../types/milestone';
import type { CurriculumView } from '../../types/analytics';

interface CurriculumProgressWidgetProps {
  stats: MilestoneStats | null;
  upcomingMilestones: Milestone[];
  progressBreakdown?: Array<{
    grade: string;
    subject: string;
    total: number;
    completed: number;
    in_progress: number;
  }>;
  view: CurriculumView;
  onViewChange: (view: CurriculumView) => void;
}

const CurriculumProgressWidget: React.FC<CurriculumProgressWidgetProps> = ({
  stats,
  upcomingMilestones,
  progressBreakdown = [],
  view,
  onViewChange
}) => {
  const viewButtons: { value: CurriculumView; label: string }[] = [
    { value: 'overall', label: 'Overall' },
    { value: 'grade', label: 'By Grade' },
    { value: 'subject', label: 'By Subject' }
  ];

  const renderOverallView = () => {
    if (!stats) return null;

    return (
      <div className="space-y-4" data-tutorial="analytics-curriculum-stats">
        {/* Completion Ring */}
        <div className="flex items-center justify-center" data-tutorial="analytics-completion-ring">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="var(--dash-border)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="var(--dash-primary)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - stats.completionPercentage / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: 'var(--dash-text)' }}>
                  {stats.completionPercentage}%
                </div>
                <div className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor: 'var(--dash-primary-a12)',
              border: `1px solid var(--dash-primary-a25)`
            }}
          >
            <div className="text-2xl font-bold" style={{ color: 'var(--dash-primary)' }}>{stats.completed}</div>
            <div className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>Completed</div>
          </div>
          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor: 'var(--dash-orange-a12)',
              border: `1px solid var(--dash-orange-a25)`
            }}
          >
            <div className="text-2xl font-bold" style={{ color: 'var(--dash-orange)' }}>{stats.inProgress}</div>
            <div className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>In Progress</div>
          </div>
          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor: 'var(--dash-border-a25)',
              border: `1px solid var(--dash-border)`
            }}
          >
            <div className="text-2xl font-bold" style={{ color: 'var(--dash-text-sub)' }}>{stats.notStarted}</div>
            <div className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>Not Started</div>
          </div>
          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor: 'var(--dash-brown-a12)',
              border: `1px solid var(--dash-brown-a25)`
            }}
          >
            <div className="text-2xl font-bold" style={{ color: 'var(--dash-text-sub)' }}>{stats.totalMilestones}</div>
            <div className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>Total</div>
          </div>
        </div>
      </div>
    );
  };

  const renderGradeView = () => {
    if (!progressBreakdown || progressBreakdown.length === 0) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-center py-8" style={{ color: 'var(--dash-text-sub)' }}>
            No milestone data available
          </p>
        </div>
      );
    }

    // Group by grade
    const gradeGroups = progressBreakdown.reduce((acc, item) => {
      if (!acc[item.grade]) {
        acc[item.grade] = { total: 0, completed: 0, in_progress: 0 };
      }
      acc[item.grade].total += item.total;
      acc[item.grade].completed += item.completed;
      acc[item.grade].in_progress += item.in_progress;
      return acc;
    }, {} as Record<string, { total: number; completed: number; in_progress: number }>);

    const sortedGrades = Object.entries(gradeGroups)
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));

    return (
      <div className="space-y-4">
        {sortedGrades.map(([grade, stats]) => {
          const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
          const notStarted = stats.total - stats.completed - stats.in_progress;

          return (
            <div key={grade} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold" style={{ color: 'var(--dash-text)' }}>
                  Grade {grade}
                </h4>
                <span className="text-xs font-medium" style={{ color: 'var(--dash-text-sub)' }}>
                  {percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--dash-border)' }}>
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: percentage === 100 ? 'var(--dash-primary)' : percentage > 50 ? 'var(--dash-orange)' : 'var(--dash-text-sub)'
                  }}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold" style={{ color: 'var(--dash-primary)' }}>{stats.completed}</div>
                  <div style={{ color: 'var(--dash-text-sub)' }}>Done</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold" style={{ color: 'var(--dash-orange)' }}>{stats.in_progress}</div>
                  <div style={{ color: 'var(--dash-text-sub)' }}>In Progress</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold" style={{ color: 'var(--dash-text-faint)' }}>{notStarted}</div>
                  <div style={{ color: 'var(--dash-text-sub)' }}>Not Started</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSubjectView = () => {
    if (!progressBreakdown || progressBreakdown.length === 0) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-center py-8" style={{ color: 'var(--dash-text-sub)' }}>
            No milestone data available
          </p>
        </div>
      );
    }

    // Group by subject
    const subjectGroups = progressBreakdown.reduce((acc, item) => {
      if (!acc[item.subject]) {
        acc[item.subject] = { total: 0, completed: 0, in_progress: 0 };
      }
      acc[item.subject].total += item.total;
      acc[item.subject].completed += item.completed;
      acc[item.subject].in_progress += item.in_progress;
      return acc;
    }, {} as Record<string, { total: number; completed: number; in_progress: number }>);

    const sortedSubjects = Object.entries(subjectGroups)
      .sort(([a], [b]) => a.localeCompare(b));

    return (
      <div className="space-y-4">
        {sortedSubjects.map(([subject, stats]) => {
          const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
          const notStarted = stats.total - stats.completed - stats.in_progress;

          return (
            <div key={subject} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold" style={{ color: 'var(--dash-text)' }}>
                  {subject}
                </h4>
                <span className="text-xs font-medium" style={{ color: 'var(--dash-text-sub)' }}>
                  {percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--dash-border)' }}>
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: percentage === 100 ? 'var(--dash-primary)' : percentage > 50 ? 'var(--dash-orange)' : 'var(--dash-text-sub)'
                  }}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold" style={{ color: 'var(--dash-primary)' }}>{stats.completed}</div>
                  <div style={{ color: 'var(--dash-text-sub)' }}>Done</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold" style={{ color: 'var(--dash-orange)' }}>{stats.in_progress}</div>
                  <div style={{ color: 'var(--dash-text-sub)' }}>In Progress</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold" style={{ color: 'var(--dash-text-faint)' }}>{notStarted}</div>
                  <div style={{ color: 'var(--dash-text-sub)' }}>Not Started</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="widget-glass rounded-2xl overflow-hidden"
      data-tutorial="analytics-curriculum-progress"
    >
      {/* Header */}
      <div className="p-4" style={{ borderBottom: `1px solid var(--dash-border)` }}>
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-5 h-5" style={{ color: 'var(--dash-primary)' }} />
          <h3 className="font-bold" style={{ color: 'var(--dash-text)' }}>Curriculum Progress</h3>
        </div>

        {/* View Toggle */}
        <div
          className="flex items-center space-x-1 rounded-lg p-1"
          data-tutorial="analytics-curriculum-views"
          style={{ backgroundColor: 'var(--dash-gold-a25)' }}
        >
          {viewButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => onViewChange(btn.value)}
              className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={{
                backgroundColor: view === btn.value ? 'var(--dash-primary)' : 'transparent',
                color: view === btn.value ? 'var(--dash-primary-fg)' : 'var(--dash-text-sub)',
                boxShadow: view === btn.value ? `0 2px 4px var(--dash-primary-a25)` : 'none'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {view === 'overall' && renderOverallView()}
        {view === 'grade' && renderGradeView()}
        {view === 'subject' && renderSubjectView()}
      </div>

      {/* Upcoming Milestones */}
      {upcomingMilestones.length > 0 && (
        <div className="p-4" data-tutorial="analytics-upcoming-milestones" style={{ borderTop: `1px solid var(--dash-border)` }}>
          <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--dash-text-sub)' }}>
            Upcoming Milestones
          </h4>
          <div className="space-y-2">
            {upcomingMilestones.slice(0, 5).map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-start space-x-2 p-2 rounded-lg transition-colors cursor-pointer"
                style={{ ['--tw-bg-opacity' as any]: 1 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--dash-border-a25)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--dash-primary)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1" style={{ color: 'var(--dash-text)' }}>
                    {milestone.topic_title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>{milestone.grade}</span>
                    <span className="text-xs" style={{ color: 'var(--dash-text-faint)' }}>•</span>
                    <span className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>{milestone.subject}</span>
                  </div>
                  {milestone.due_date && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Calendar className="w-3 h-3" style={{ color: 'var(--dash-text-faint)' }} />
                      <span className="text-xs" style={{ color: 'var(--dash-text-sub)' }}>
                        {format(parseISO(milestone.due_date), 'MMM d')}
                      </span>
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--dash-text-faint)' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumProgressWidget;
