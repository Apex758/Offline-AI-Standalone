import React from 'react';
import { Clock, BookMarked, CheckCircle2, Target, FileText, ListChecks, GraduationCap, Users, School } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import type { Activity } from '../../types/analytics';

interface RecentActivityTimelineProps {
  activities: Activity[];
  limit?: number;
}

const RecentActivityTimeline: React.FC<RecentActivityTimelineProps> = ({
  activities,
  limit = 4
}) => {
  const getActivityIcon = (activity: Activity) => {
    switch (activity.type) {
      case 'resource_created':
        switch (activity.resourceType) {
          case 'lesson':
            return { Icon: BookMarked, color: '#1D362D' };
          case 'quiz':
            return { Icon: ListChecks, color: '#F2A631' };
          case 'rubric':
            return { Icon: FileText, color: '#552A01' };
          case 'kindergarten':
            return { Icon: GraduationCap, color: '#1D362D' };
          case 'multigrade':
            return { Icon: Users, color: '#552A01' };
          case 'cross-curricular':
            return { Icon: School, color: '#F2A631' };
          default:
            return { Icon: BookMarked, color: '#1D362D' };
        }
      case 'task_completed':
        return { Icon: CheckCircle2, color: '#1D362D' };
      case 'milestone_reached':
        return { Icon: Target, color: '#F2A631' };
      default:
        return { Icon: Clock, color: '#552A01' };
    }
  };

  const getActivityBg = (activity: Activity) => {
    switch (activity.type) {
      case 'resource_created':
        return { bg: '#1D362D20', border: '#1D362D40' };
      case 'task_completed':
        return { bg: '#1D362D20', border: '#1D362D40' };
      case 'milestone_reached':
        return { bg: '#F2A63120', border: '#F2A63140' };
      default:
        return { bg: '#E8EAE340', border: '#E8EAE3' };
    }
  };

  const displayedActivities = activities.slice(0, limit);

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
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5" style={{ color: '#552A01' }} />
          <h3 className="font-bold" style={{ color: '#020D03' }}>Recent Activity</h3>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4">
        {displayedActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto mb-3" style={{ color: '#E8EAE3' }} />
            <p className="text-sm font-medium" style={{ color: '#552A01' }}>No recent activity</p>
            <p className="text-xs mt-1" style={{ color: '#A8AFA3' }}>Create resources to see your activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedActivities.map((activity, index) => {
              const { Icon, color } = getActivityIcon(activity);
              const { bg, border } = getActivityBg(activity);
              const isLast = index === displayedActivities.length - 1;

              return (
                <div key={activity.id} className="relative">
                  {/* Timeline Line */}
                  {!isLast && (
                    <div 
                      className="absolute left-4 top-10 bottom-0 w-0.5" 
                      style={{ backgroundColor: '#E8EAE3' }}
                    />
                  )}

                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div
                      className="relative z-10 flex-shrink-0 p-2 rounded-lg"
                      style={{ 
                        backgroundColor: bg,
                        border: `1px solid ${border}`
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-sm font-medium line-clamp-2" style={{ color: '#020D03' }}>
                        {activity.description}
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#552A01' }}>
                        {formatDistanceToNow(parseISO(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View All Link */}
      {activities.length > limit && (
        <div className="px-4 pb-4">
          <button className="w-full text-sm font-medium" style={{ color: '#F2A631' }}>
            View all {activities.length} activities
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivityTimeline;