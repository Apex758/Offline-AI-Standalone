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
                stroke="#E8EAE3"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#1D362D"
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
                <div className="text-2xl font-bold" style={{ color: '#020D03' }}>
                  {stats.completionPercentage}%
                </div>
                <div className="text-xs" style={{ color: '#552A01' }}>Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            className="rounded-lg p-3"
            style={{ 
              backgroundColor: '#1D362D20',
              border: '1px solid #1D362D40'
            }}
          >
            <div className="text-2xl font-bold" style={{ color: '#1D362D' }}>{stats.completed}</div>
            <div className="text-xs" style={{ color: '#552A01' }}>Completed</div>
          </div>
          <div 
            className="rounded-lg p-3"
            style={{ 
              backgroundColor: '#F2A63120',
              border: '1px solid #F2A63140'
            }}
          >
            <div className="text-2xl font-bold" style={{ color: '#F2A631' }}>{stats.inProgress}</div>
            <div className="text-xs" style={{ color: '#552A01' }}>In Progress</div>
          </div>
          <div 
            className="rounded-lg p-3"
            style={{ 
              backgroundColor: '#E8EAE340',
              border: '1px solid #E8EAE3'
            }}
          >
            <div className="text-2xl font-bold" style={{ color: '#552A01' }}>{stats.notStarted}</div>
            <div className="text-xs" style={{ color: '#552A01' }}>Not Started</div>
          </div>
          <div 
            className="rounded-lg p-3"
            style={{ 
              backgroundColor: '#552A0120',
              border: '1px solid #552A0140'
            }}
          >
            <div className="text-2xl font-bold" style={{ color: '#552A01' }}>{stats.totalMilestones}</div>
            <div className="text-xs" style={{ color: '#552A01' }}>Total</div>
          </div>
        </div>
      </div>
    );
  };

  const renderGradeView = () => {
    return (
      <div className="space-y-3">
        <p className="text-sm text-center py-8" style={{ color: '#552A01' }}>
          Grade-level breakdown coming soon!
        </p>
      </div>
    );
  };

  const renderSubjectView = () => {
    return (
      <div className="space-y-3">
        <p className="text-sm text-center py-8" style={{ color: '#552A01' }}>
          Subject breakdown coming soon!
        </p>
      </div>
    );
  };

  return (
    <div 
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: 'white',
        boxShadow: '0 4px 16px rgba(29, 54, 45, 0.08)'
      }}
    >
      {/* Header */}
      <div className="p-4" style={{ borderBottom: '1px solid #E8EAE3' }}>
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-5 h-5" style={{ color: '#1D362D' }} />
          <h3 className="font-bold" style={{ color: '#020D03' }}>Curriculum Progress</h3>
        </div>

        {/* View Toggle */}
        <div 
          className="flex items-center space-x-1 rounded-lg p-1"
          style={{ backgroundColor: '#F8E59D40' }}
        >
          {viewButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => onViewChange(btn.value)}
              className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={{
                backgroundColor: view === btn.value ? '#1D362D' : 'transparent',
                color: view === btn.value ? '#F8E59D' : '#552A01',
                boxShadow: view === btn.value ? '0 2px 4px rgba(29, 54, 45, 0.2)' : 'none'
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
        <div className="p-4" style={{ borderTop: '1px solid #E8EAE3' }}>
          <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#552A01' }}>
            Upcoming Milestones
          </h4>
          <div className="space-y-2">
            {upcomingMilestones.slice(0, 5).map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#1D362D' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1" style={{ color: '#020D03' }}>
                    {milestone.topic_title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs" style={{ color: '#552A01' }}>{milestone.grade}</span>
                    <span className="text-xs" style={{ color: '#A8AFA3' }}>•</span>
                    <span className="text-xs" style={{ color: '#552A01' }}>{milestone.subject}</span>
                  </div>
                  {milestone.due_date && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Calendar className="w-3 h-3" style={{ color: '#A8AFA3' }} />
                      <span className="text-xs" style={{ color: '#552A01' }}>
                        {format(parseISO(milestone.due_date), 'MMM d')}
                      </span>
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#A8AFA3' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumProgressWidget;