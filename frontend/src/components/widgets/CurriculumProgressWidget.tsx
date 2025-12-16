import React from 'react';
import { Target, ChevronRight, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { MilestoneStats } from '../../types/milestone';
import type { Milestone } from '../../types/milestone';
import type { CurriculumView } from '../../types/analytics';

interface CurriculumProgressWidgetProps {
  stats: MilestoneStats | null;
  upcomingMilestones: Milestone[];
  view: CurriculumView;
  onViewChange: (view: CurriculumView) => void;
}

const CurriculumProgressWidget: React.FC<CurriculumProgressWidgetProps> = ({
  stats,
  upcomingMilestones,
  view,
  onViewChange
}) => {
  const viewButtons: { value: CurriculumView; label: string }[] = [
    { value: 'overall', label: 'Overall' },
    { value: 'grade', label: 'By Grade' },
    { value: 'subject', label: 'By Subject' }
  ];

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderOverallView = () => {
    if (!stats) return null;

    return (
      <div className="space-y-4">
        {/* Completion Ring */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#3b82f6"
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
                <div className="text-2xl font-bold text-gray-900">
                  {stats.completionPercentage}%
                </div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
            <div className="text-xs text-green-600">Completed</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{stats.inProgress}</div>
            <div className="text-xs text-blue-600">In Progress</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="text-2xl font-bold text-gray-700">{stats.notStarted}</div>
            <div className="text-xs text-gray-600">Not Started</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <div className="text-2xl font-bold text-purple-700">{stats.totalMilestones}</div>
            <div className="text-xs text-purple-600">Total</div>
          </div>
        </div>
      </div>
    );
  };

  const renderGradeView = () => {
    // Placeholder for grade-level breakdown
    // This would require additional data from the API
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 text-center py-8">
          Grade-level breakdown coming soon!
        </p>
      </div>
    );
  };

  const renderSubjectView = () => {
    // Placeholder for subject breakdown
    // This would require additional data from the API
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 text-center py-8">
          Subject breakdown coming soon!
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-gray-900">Curriculum Progress</h3>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          {viewButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => onViewChange(btn.value)}
              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                view === btn.value
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
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
        <div className="border-t border-gray-200 p-4">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
            Upcoming Milestones
          </h4>
          <div className="space-y-2">
            {upcomingMilestones.slice(0, 5).map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {milestone.topic_title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{milestone.grade}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{milestone.subject}</span>
                  </div>
                  {milestone.due_date && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {format(parseISO(milestone.due_date), 'MMM d')}
                      </span>
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumProgressWidget;